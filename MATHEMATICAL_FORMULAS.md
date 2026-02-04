# Documentación de Fórmulas Matemáticas y Memoria de Cálculo - NoNA

Este documento detalla exhaustivamente las fórmulas matemáticas implementadas en el backend (`web/backend/logic.py`) para el cálculo de viabilidad inmobiliaria, así como una memoria de cálculo con un ejemplo práctico.

## 1. Métricas del Terreno

**Valor Total del Terreno**
$$ Valor_{terreno} = Area_{terreno} \times Costo_{unitario} $$

---

## 2. Normativa y Áreas Permitidas

Cálculo de áreas edificables basadas en coeficientes urbanos:

- **COS (Huella / Planta Baja Máxima)**:
  $$ Area_{COS} = Area_{terreno} \times COS_{coef} $$

- **CUS (Area Total Construcción)**:
  $$ Area_{CUS} = Area_{terreno} \times CUS_{coef} $$

- **CAS (Area Verde / Permeable)**:
  $$ Area_{CAS} = Area_{terreno} \times CAS_{coef} $$

- **Area Neta Edificable**:
  $$ Area_{neta} = Area_{terreno} - Area_{retiros} $$

---

## 3. Costos de Demolición y Preliminares

Si la demolición está habilitada en el proyecto:

$$ Costo_{demolicion} = (Area_{demolicion} \times Costo_{m2}) + (Area_{terreno} \times Costo_{licencia}) + (Area_{terreno} \times \%_{residuos}) $$

> **Parámetros por defecto:**
> - Costo Demolición: $1,600 MXN/m²
> - Licencia: $15 MXN/m² de terreno
> - Residuos: 15% del valor del terreno (Ref: lógica original)

---

## 4. Usos Mixtos (Comercial)

Si el proyecto incluye componente comercial (Locales):

- **Area Comercial Total**: Se asigna el equivalente a la planta baja completa ($Area_{COS}$).
- **Area por Local**:
  $$ Area_{local} = \frac{Area_{comercio}}{Num_{locales}} $$
- **Ingreso por Ventas de Locales**:
  $$ Ingreso_{locales} = (Area_{local} \times Precio_{venta\_m2\_local}) \times Num_{locales} $$

---

## 5. Estacionamiento

El cálculo es dinámico según la delegación y distrito.

1.  **Número de Cajones**:
    $$ Cajones = \lceil (N_{viviendas} \times Factor_{zona}) + \frac{Area_{COS} - Area_{circulacion}}{Factor_{comercial}} \rceil $$

2.  **Area de Estacionamiento Total**:
    $$ Area_{est} = Total_{cajones} \times 12.5m^2 \times 1.5_{factor\_circulacion} $$

3.  **Costo de Estacionamiento**:
    $$ Costo_{est} = Area_{est} \times Costo_{m2\_construccion} $$

---

## 6. Costos de Construcción (Estructura de Costos)

### Costos Directos
Se utiliza el **Area Total Construida (CUS)** como base.

> **Nota Importante de Lógica**: Para alinearse con las prácticas del script original y estimar costos de "Llave en Mano" (Obra Negra + Acabados/Equipamiento), la fórmula **duplica** el costo base de construcción.

$$ Base_{construccion} = Area_{CUS} \times Costo_{m2\_construccion} $$
$$ Costos_{directos} = (Base_{construccion} \times 2) + Costo_{demolicion} $$

### Costos Indirectos
Calculados como porcentajes sobre costos directos o ingresos brutos.

$$ Indirectos = Honorarios + Legales + Adm + Fin + Com $$

- **Honorarios**: $15\% \times Costos_{directos}$
- **Legales**: $2\% \times Ingreso_{bruto}$
- **Administración**: $10\% \times Ingreso_{bruto}$
- **Financieros**: $3\% \times Ingreso_{bruto}$
- **Comerciales**: $6\% \times Ingreso_{bruto}$

### Costo Total del Proyecto
$$ Costo_{total} = Valor_{terreno} + Costos_{directos} + Costos_{indirectos} + Costo_{estacionamiento} $$

---

## 7. Ingresos y Utilidad

**Ingreso Bruto Inicial**
$$ Ingreso_{bruto} = (Area_{venta\_vivienda} \times Precio_{venta\_m2}) + Ingreso_{locales} $$
*Donde: $Area_{venta\_vivienda} = Area_{CUS} - (Area_{comercio} + Area_{estacionamiento})$*

**Utilidad Neta (Margen)**
$$ Utilidad_{\%} = \frac{Ingreso_{bruto} - Costo_{total}}{Ingreso_{bruto}} \times 100 $$

---

## 8. Simulación y Optimización

Para encontrar el precio de venta necesario para una utilidad deseada ($U_{target}$):

$$ Ingreso_{objetivo} = \frac{Costo_{total}}{1 - \frac{U_{target}}{100}} $$

---

# Memoria de Cálculo: Ejemplo Práctico

A continuación se presenta un ejercicio numérico completo para validar las fórmulas.

### 1. Datos de Entrada (Inputs)
- **Terreno**: 500 m² a $10,000/m²
- **Normativa**: COS 0.70, CUS 2.10 (3 niveles)
- **Construcción**: $12,000/m²
- **Proyecto**: 10 Viviendas, Sin Locales, Sin Demolición.
- **Venta Estimada**: $35,000/m²

### 2. Cálculo Paso a Paso

**A. Terreno**
$$ Valor = 500 \times 10,000 = \$5,000,000 $$

**B. Normativa**
- $Area_{COS} = 500 \times 0.70 = 350 m^2$
- $Area_{CUS} = 500 \times 2.10 = 1,050 m^2$ (Area Total Permitida)

**C. Costos Directos**
- Base = $1,050 m^2 \times \$12,000 = \$12,600,000$
- Costos Directos = $(\$12,600,000 \times 2) + 0 = \$25,200,000$

**D. Costos Indirectos**
*(Asumiremos Ingreso Bruto preliminar para calcular indirectos, en la práctica es iterativo o basado en venta estimada)*
- $Area_{venta} \approx Area_{CUS} = 1,050 m^2$ (simplificado sin estacionamiento para el ejemplo)
- $Ingreso_{bruto} = 1,050 \times 35,000 = \$36,750,000$

- Honorarios (15% Directo): $25.2M \times 0.15 = \$3,780,000$
- Legales (2% Ingreso): $36.75M \times 0.02 = \$735,000$
- Adm (10% Ingreso): $36.75M \times 0.10 = \$3,675,000$
- Fin (3% Ingreso): $36.75M \times 0.03 = \$1,102,500$
- Com (6% Ingreso): $36.75M \times 0.06 = \$2,205,000$
- **Total Indirectos**: $\$11,497,500$

**E. Costo Total**
$$ Total = 5M (Tierra) + 25.2M (Directo) + 11.5M (Indirecto) = \$41,700,000 $$

**F. Utilidad**
- Costo Total: $41,700,000
- Ingreso Total: $36,750,000
- **Resultado**: Pérdida de $-\$4,950,000$ (Negocio no viable con estos parámetros)

### Conclusión del Ejemplo
Este ejercicio demuestra la importancia de la fórmula de **Costos Directos duplicada**. Si solo hubiéramos usado el costo base ($12.6M$), el costo total habría bajado drásticamente a ~$29M, dando una utilidad falsa positiva de +$7M. La corrección protege al desarrollador de subestimar la inversión.
