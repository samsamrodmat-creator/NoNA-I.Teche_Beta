import { geoMercator, geoContains } from 'd3-geo';
import fs from 'fs';
import path from 'path';

const outDir = '/Users/samuel/Documents/NoNA/web/frontend/public/images/maps';
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

async function fetchGeoJSON(query) {
    console.log(`Fetching: ${query}`);
    const res = await fetch(`https://nominatim.openstreetmap.org/search.php?${query}&polygon_geojson=1&format=json`, {
        headers: { 'User-Agent': 'NoNA-App-Script/1.0' }
    });
    const data = await res.json();
    if (data && data.length > 0 && data[0].geojson) {
        return { type: 'Feature', geometry: data[0].geojson, properties: {} };
    }
    console.warn(`Could not fetch GeoJSON for ${query}`);
    return null;
}

// Combine multiple features into a single MultiPolygon Feature for easier d3.geoContains check
function combineFeatures(features) {
    const polygons = [];
    for (const f of features) {
        if (!f) continue;
        if (f.geometry.type === 'Polygon') {
            polygons.push(f.geometry.coordinates);
        } else if (f.geometry.type === 'MultiPolygon') {
            polygons.push(...f.geometry.coordinates);
        }
    }
    return {
        type: 'Feature',
        geometry: {
            type: 'MultiPolygon',
            coordinates: polygons
        },
        properties: {}
    };
}

async function generateMap(name, stateQueries, metroQueries) {
    console.log(`\nGenerating map for ${name}...`);

    // Fetch state boundaries
    const stateFeatures = [];
    for (const q of stateQueries) {
        const feature = await fetchGeoJSON(q);
        if (feature) stateFeatures.push(feature);
        await new Promise(r => setTimeout(r, 1500)); // Rate limit
    }

    // Fetch metro boundaries
    const metroFeatures = [];
    for (const q of metroQueries) {
        const feature = await fetchGeoJSON(q);
        if (feature) metroFeatures.push(feature);
        await new Promise(r => setTimeout(r, 1500)); // Rate limit
    }

    const stateBoundary = combineFeatures(stateFeatures);
    const metroBoundary = combineFeatures(metroFeatures);

    if (!stateBoundary.geometry.coordinates.length) {
        console.error(`Failed to get state boundaries for ${name}`);
        return;
    }

    // Grid config
    const width = 800;
    const height = 800;
    const spacing = 12;

    const projection = geoMercator().fitSize([width, height], stateBoundary);

    let circles = '';

    const landColor = '#94a3b8';   // slate-400 for State
    const metroColor = '#3b82f6';  // blue-500 for Metro

    for (let x = 0; x < width; x += spacing) {
        for (let y = 0; y < height; y += spacing) {
            // Add a little offset to y based on x for a staggered hex-like look
            const offsetY = (x / spacing) % 2 === 0 ? y : y + spacing / 2;
            if (offsetY > height) continue;

            const [lon, lat] = projection.invert([x, offsetY]);

            const isMetro = metroBoundary.geometry.coordinates.length > 0 && geoContains(metroBoundary, [lon, lat]);
            const isState = geoContains(stateBoundary, [lon, lat]);

            if (isMetro || isState) {
                const color = isMetro ? metroColor : landColor;
                const r = isMetro ? 2.5 : 1.5;
                const opacity = isMetro ? 1.0 : 0.4;
                circles += `<circle cx="${x}" cy="${offsetY}" r="${r}" fill="${color}" opacity="${opacity}" />\n`;
            }
        }
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">
${circles}
</svg>`;

    fs.writeFileSync(path.join(outDir, `${name}_dots.svg`), svg);
    console.log(`Saved ${name}_dots.svg`);
}

async function main() {
    // 1. Monterrey (Nuevo Leon)
    await generateMap(
        'mty',
        ['state=Nuevo Leon&country=Mexico'],
        [
            'city=Monterrey&state=Nuevo Leon&country=Mexico',
            'city=San Pedro Garza Garcia&state=Nuevo Leon&country=Mexico',
            'city=Guadalupe&state=Nuevo Leon&country=Mexico',
            'city=San Nicolas de los Garza&state=Nuevo Leon&country=Mexico',
            'city=Apodaca&state=Nuevo Leon&country=Mexico',
            'city=Santa Catarina&state=Nuevo Leon&country=Mexico',
            'city=General Escobedo&state=Nuevo Leon&country=Mexico'
        ]
    );

    // 2. Guadalajara (Jalisco)
    await generateMap(
        'gdl',
        ['state=Jalisco&country=Mexico'],
        [
            'city=Guadalajara&state=Jalisco&country=Mexico',
            'city=Zapopan&state=Jalisco&country=Mexico',
            'city=Tlaquepaque&state=Jalisco&country=Mexico',
            'city=Tonala&state=Jalisco&country=Mexico',
            'city=Tlajomulco de Zuniga&state=Jalisco&country=Mexico'
        ]
    );

    // 3. Ciudad de Mexico (CDMX + Edomex for context)
    await generateMap(
        'cdmx',
        ['state=Ciudad de Mexico&country=Mexico', 'state=Estado de Mexico&country=Mexico'],
        ['state=Ciudad de Mexico&country=Mexico'] // For CDMX, the state itself is the metro region for visual simplicity
    );
}

main().catch(console.error);
