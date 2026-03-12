import fs from 'fs';
import path from 'path';
import { createCanvas } from 'canvas';
import { geoMercator, geoPath } from 'd3-geo';

const outDir = '/Users/samuel/Documents/NoNA/web/frontend/public/images/maps';

// Read previously fetched geojsons if we can, or just re-fetch with better parsing
async function fetchGeo(query) {
    const res = await fetch(`https://nominatim.openstreetmap.org/search.php?${query}&polygon_geojson=1&format=json`, {
        headers: { 'User-Agent': 'NoNA-App-Script/1.2' }
    });
    const data = await res.json();
    if (data && data.length > 0) {
        // filter for the best match that has a polygon or multipolygon
        const match = data.find(d => d.geojson && (d.geojson.type === 'Polygon' || d.geojson.type === 'MultiPolygon'));
        if (match) return match.geojson;
    }
    return null;
}

async function renderMap(name, stateQueries, metroQueries) {
    console.log(`Generating ${name}...`);

    // 1. Fetch Geometries
    const stateGeoms = [];
    for (const q of stateQueries) {
        const geom = await fetchGeo(q);
        if (geom) stateGeoms.push(geom);
        await new Promise(r => setTimeout(r, 1500));
    }

    const metroGeoms = [];
    for (const q of metroQueries) {
        const geom = await fetchGeo(q);
        if (geom) metroGeoms.push(geom);
        await new Promise(r => setTimeout(r, 1500));
    }

    const stateFeatureCollection = {
        type: "FeatureCollection",
        features: stateGeoms.map(g => ({ type: "Feature", geometry: g, properties: {} }))
    };

    const metroFeatureCollection = {
        type: "FeatureCollection",
        features: metroGeoms.map(g => ({ type: "Feature", geometry: g, properties: {} }))
    };

    if (!stateGeoms.length) {
        console.error(`Missing state geom for ${name}`);
        return;
    }

    // 2. Setup Canvas strictly for rasterization
    const width = 800;
    const height = 800;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // 3. Projection scaled to fit the STATE
    const projection = geoMercator().fitSize([width, height], stateFeatureCollection);
    const pathGenerator = geoPath(projection, ctx);

    // 4. Draw STATE to canvas (Black)
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    pathGenerator(stateFeatureCollection);
    ctx.fill();

    const stateImageData = ctx.getImageData(0, 0, width, height).data;

    // 5. Clear and Draw METRO to canvas (Black)
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    pathGenerator(metroFeatureCollection);
    ctx.fill();

    const metroImageData = ctx.getImageData(0, 0, width, height).data;

    // 6. Generate Dot Pattern
    const spacing = 10;
    let svgBody = '';

    const landColor = '#94a3b8';   // grey for State
    const metroColor = '#60a5fa';  // blue for Metro

    for (let x = 0; x < width; x += spacing) {
        for (let y = 0; y < height; y += spacing) {
            // Check alpha channel (index + 3)
            const index = (y * width + x) * 4;
            const stateAlpha = stateImageData[index + 3];
            const metroAlpha = metroImageData[index + 3];

            const isMetro = metroAlpha > 128;
            const isState = stateAlpha > 128;

            if (isMetro || isState) {
                const color = isMetro ? metroColor : landColor;
                const r = isMetro ? 2.5 : 1.5; // match worldMap size/density
                const opacity = isMetro ? 1.0 : 0.4;
                svgBody += `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${opacity}" />\n`;
            }
        }
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">
${svgBody}
</svg>`;

    fs.writeFileSync(path.join(outDir, `${name}_dots.svg`), svg);
    console.log(`Saved ${name}_dots.svg`);
}

async function main() {
    // 1. Monterrey (Nuevo Leon)
    await renderMap(
        'mty',
        ['state=Nuevo Leon&country=Mexico'],
        [
            'city=Monterrey&state=Nuevo Leon&country=Mexico',
            'city=San Pedro Garza Garcia&state=Nuevo Leon&country=Mexico',
            'city=Guadalupe&state=Nuevo Leon&country=Mexico',
            'city=San Nicolas de los Garza&state=Nuevo Leon&country=Mexico',
            'city=Apodaca&state=Nuevo Leon&country=Mexico',
            'city=Santa Catarina&state=Nuevo Leon&country=Mexico',
            'city=General Escobedo&state=Nuevo Leon&country=Mexico',
            'city=Juarez&state=Nuevo Leon&country=Mexico',
            'city=Pesqueria&state=Nuevo Leon&country=Mexico'
        ]
    );

    // 2. Guadalajara (Jalisco)
    await renderMap(
        'gdl',
        ['state=Jalisco&country=Mexico'],
        [
            'city=Guadalajara&state=Jalisco&country=Mexico',
            'city=Zapopan&state=Jalisco&country=Mexico',
            'city=Tlaquepaque&state=Jalisco&country=Mexico',
            'city=Tonala&state=Jalisco&country=Mexico',
            'city=Tlajomulco de Zuniga&state=Jalisco&country=Mexico',
            'city=El Salto&state=Jalisco&country=Mexico'
        ]
    );

    // 3. Ciudad de Mexico (Only CDMX as metro, and maybe some adjacent EdoMex for state to show the valley? NO, let's do CDMX state as "State", and just central boroughs as "Metro" to create the same effect, or CDMX + EdoMex as state, and CDMX as Metro)
    // The user's image shows the whole CDMX with yellow for the urban sprawl. That's essentially all of CDMX + some Edomex.
    await renderMap(
        'cdmx',
        ['state=Ciudad de Mexico&country=Mexico'], // CDMX is the state boundary
        [   // Central/Dense Boroughs for Metro effect
            'city=Cuauhtemoc&state=Ciudad de Mexico&country=Mexico',
            'city=Miguel Hidalgo&state=Ciudad de Mexico&country=Mexico',
            'city=Benito Juarez&state=Ciudad de Mexico&country=Mexico',
            'city=Coyoacan&state=Ciudad de Mexico&country=Mexico',
            'city=Venustiano Carranza&state=Ciudad de Mexico&country=Mexico',
            'city=Iztacalco&state=Ciudad de Mexico&country=Mexico',
            'city=Gustavo A. Madero&state=Ciudad de Mexico&country=Mexico',
            'city=Azcapotzalco&state=Ciudad de Mexico&country=Mexico',
            'city=Iztapalapa&state=Ciudad de Mexico&country=Mexico',
            'city=Alvaro Obregon&state=Ciudad de Mexico&country=Mexico'
        ]
    );
}

main().catch(console.error);
