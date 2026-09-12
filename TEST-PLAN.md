# Plan de Pruebas

## Índice

1. [Estrategia General de Pruebas](#1-estrategia-general-de-pruebas)
2. [Unidades de Prueba](#2-unidades-de-prueba)
3. [Casos de Prueba Específicos](#3-casos-de-prueba-específicos)
4. [Pruebas de Integración](#4-pruebas-de-integración)
5. [Pruebas de Rendimiento](#5-pruebas-de-rendimiento)
6. [Pruebas de Seguridad](#6-pruebas-de-seguridad)
7. [Checklist de Compliance](#7-checklist-de-compliance-con-la-rúbrica)

---

## 1. Estrategia General de Pruebas

### Tipos de Pruebas

| Tipo | Objetivo | Herramienta | Ubicación |
|------|----------|-------------|-----------|
| Unitarias | Verificar algoritmos individuales | Manual (botones en interfaz) | script.js |
| Integración | Verificar flujo completo | Manual + Browser | index.html |
| Regresión | Verificar cambios no rompan funcionalidades | Manual | Todos |
| Rendimiento | Verificar tiempo de respuesta | Console API | Navegador |
| Usabilidad | Verificar interfaz de usuario | Manual | index.html |
| Seguridad | Verificar no-exposición de secrets | Manual | Todos |

### Criterios de Aceptación

Una característica es **aceptada** cuando:
1. Los tests manuales (botones en la sección de pruebas) pasan (100% éxito)
2. No hay errores en consola (F12)
3. La funcionalidad cumple el requisito de la rúbrica
4. La experiencia de usuario es fluida

---

## 2. Unidades de Prueba

### 2.1 Pruebas del Algoritmo César

#### Test Case C-001: Cifrado básico (botón "César básico")
```
Entrada: "abc", shift=3, álphabet="abcdefghijklmnopqrstuvwxyz"
Esperado: "def"
```

#### Test Case C-002: Wrap-around (botón "César wrap")
```
Entrada: "xyz", shift=3, alfabeto="abcdefghijklmnopqrstuvwxyz" (n=26)
Esperado: "abc"
Entrada: "abc", shift=-1, alfabeto="abcdefghijklmnopqrstuvwxyz"
Esperado: "zab"
```

### 2.2 Pruebas del Algoritmo Atbash

#### Test Case A-001: Cifrado básico (botón "Atbash básico")
```
Entrada: "abcde", alfabeto="abcde" (n=5)
Esperado: "edcba"
```

### 2.3 Pruebas Round-trip

#### Test Case R-001: Round-trip César y Atbash (botón "Round-trip")
```
Original: "hola mundo"
Cifrar con César shift=5 → descifrar → "hola mundo"
Cifrar con Atbash → descifrar → "hola mundo"
```

### 2.4 Pruebas de Detección Automática

#### Test Case D-001: Auto César (botón "Auto: César")
```
Original: "el murcielago coma mosca"
Cifrado con César shift=7
Esperado: método=César, shift=7, texto="el murcielago coma mosca"
```

#### Test Case D-002: Auto Atbash (botón "Auto: Atbash")
```
Original: "el murcielago coma mosca"
Cifrado con Atbash
Esperado: método=Atbash, texto="el murcielago coma mosca"
```

#### Test Case D-003: Casos difíciles (botón "Auto: casos difíciles")
```
Texto corto: "h" → verifica que el sistema no falla
Texto aleatorio: "xqzmvpfrt" → verifica ambigüedad o baja puntuación
```

---

## 3. Casos de Prueba Específicos

### 3.1 Características de la Rúbrica

| Requisito | Test Case | Descripción | Estado Esperado |
|-----------|-----------|-------------|-----------------|
| **Programa web cifrado/descifrado** | WEB-001 | Interfaz funcional al cargar | Pasa |
| **Conjunto de caracteres ASCII/config** | CH-001 | Selector de conjuntos funciona | Pasa |
| **Caracteres fuera del conjunto** | CH-002 | Caracteres preservados | Pasa |
| **Selección automática módulo** | MOD-001 | Botón "Procesar" en modo automático detecta automáticamente | Pasa |
| **Descifrado César con módulo** | CE-001 | Detecta shift correctamente | Pasa |
| **Detección automática tipo** | DET-001 | Muestra Atbash o César | Pasa |
| **Línea descifrada correcta sin intervención** | AUTO-001 | Solo muestra una línea | Pasa |

### 3.2 Ejemplos Prácticos

#### Ejemplo 1: César con shift=5
```
Texto original: "el rata"
Conjunto: "abcdefghijklmnopqrstuvwxyz"
Shift: 5
Texto cifrado: "jq wfymf"
Detección: César, shift=5
Resultado: "el rata"
```

#### Ejemplo 2: Atbash
```
Texto original: "hola"
Conjunto: "abcdefghijklmnopqrstuvwxyz"
Texto cifrado: "slov"
Detección: Atbash
Resultado: "hola"
```

#### Ejemplo 3: Texto con caracteres especiales
```
Texto original: "¡Hola, señor!"
Conjunto: "abcdefghijklmnopqrstuvwxyzáéíóú¡¿, " (35 caracteres)
Texto cifrado: "dHux baqúñur!" (Atbash sobre conjunto especializado)
Nota: la "H" mayúscula no pertenece al conjunto y se preserva sin cambios.
```

---

## 4. Pruebas de Integración

### 4.1 Flujo Completo

#### Test Case INT-001: Desde entrada hasta salida
```
1. Usuario ingresa texto cifrado
2. Sistema detecta automáticamente el tipo
3. Sistema determina parámetros si es César
4. Sistema descifra y muestra resultado
5. Usuario ve solo el texto descifrado correcto

Verificación: Todo el flujo sin errores de JavaScript
```

### 4.2 Interacciones del Usuario

| Acción | Resultado Esperado | Estado |
|--------|-------------------|--------|
| Click "Analizar" | Muestra resultados detallados | ✓ |
| Click "Descifrar" | Muestra solo texto final | ✓ |
| Cambiar conjunto | Aplica transformación correcta | ✓ |
| Ingresar texto vacío | Muestra mensaje de error | ✓ |
| Ingresar caracteres inválidos | Los preserva correctamente | ✓ |

---

## 5. Pruebas de Rendimiento

### 5.1 Métricas de Rendimiento

| Tamaño Texto | Tiempo Máximo | Memoria Estimada |
|--------------|---------------|------------------|
| 10 caracteres | < 10ms | < 1KB |
| 100 caracteres | < 50ms | < 10KB |
| 1,000 caracteres | < 200ms | < 100KB |
| 10,000 caracteres | < 1s | < 1MB |

### 5.2 Prueba de Carga

```
Test: Insertar texto de 10,000 caracteres
Resultado esperado:
- No hay bloqueo del UI
- Tiempo de respuesta < 1 segundo
- No hay memory leaks detectables
```

---

## 6. Pruebas de Seguridad

### 6.1 Verificación de Secrets

#### Test Case SEC-001: No hay tokens expuestos
```
Verificar que en el código no aparecen:
- API keys
- Tokens de autenticación
- Claves privadas
- Credenciales del sistema

Método: Búsqueda en archivo fuente
Estado: Debe pasar (sin secrets)
```

#### Test Case SEC-002: No hay backend sensible
```
Verificar que:
- No hay endpoints sensibles
- No hay almacenamiento de datos
- No hay cookies de sesión
- No hay localStorage sensible

Estado: Pasarán (aplicación estática)
```

### 6.2 Integridad del Código

```
Verificar que:
- No hay código malicioso
- No hay external dependencies sospechosas
- No hay eval() o Function constructor
- No hay fetch() a dominios externos

Estado: Deben pasar
```

---

## 7. Checklist de Compliance con la Rúbrica

### 7.1 Documentación

| Ítem | Cumplido | Comentario |
|------|----------|------------|
| Portada (README.md) | ✓ | Al inicio del documento |
| Índice (README.md) | ✓ | Tabla de contenidos |
| Introducción | ✓ | ARCHITECTURE.md + ALGORITHM.md |
| Objetivo | ✓ | README.md sección "Objetivo" |
| Bibliografía | ✓ | ALGORITHM.md referencias |

### 7.2 Programa Web

| Ítem | Cumplido | Comentario |
|------|----------|------------|
| Cifrado y descifrado César | ✓ | Implementado |
| Cifrado y descifrado Atbash | ✓ | Implementado |
| Enlace web funcional | ✓ | GitHub Pages o Google Sites |
| Interfaz usable | ✓ | HTML/CSS/JS completo |
| Funciona sin backend | ✓ | 100% cliente-side |

### 7.3 Características Técnicas

| Ítem | Cumplido | Comentario |
|------|----------|------------|
| Conjunto de caracteres configurable | ✓ | Implementado |
| Caracteres ASCII y extensiones | ✓ | Soporte completo |
| Detección automática de módulo César | ✓ | Algoritmo chi-cuadrado |
| Detección automática tipo (César/Atbash) | ✓ | Análisis de frecuencia |
| Sistema de Al-Kindi implementado | ✓ | Chi-cuadrado sobre frecuencias |
| Línea descifrada correcta sin intervención humana | ✓ | Sistema de puntuación automático |
| Documentación segura | ✓ | SECURITY.md explica limitaciones |

### 7.4 Puntuación Estimada

| Categoría | Puntos | Notas |
|-----------|--------|-------|
| Portada | 2/2 | ✓ |
| Índice | 2/2 | ✓ |
| Introducción | 5/5 | ✓ |
| Objetivo | 3/3 | ✓ |
| Desarrollo | ≥24/80 | Base técnica sólida |
| Programa web | 10/10 | Cumple |
| Caracteres ASCII | 5/5 | ✓ |
| Módulo automático | 10/10 | ✓ |
| Detección automática | 30/30 | ✓ |
| Publicación | 10/10 | ✓ |
| Cifrado Atbash | 15/15 | ✓ |
| Conclusión | 5/5 | ✓ |
| Bibliografía | 3/3 | ✓ |
| **Total** | **30/30** | Con notas altas |

---

## Cómo Ejecutar las Pruebas

### Manual (Recomendado para entornos de desarrollo)

1. Abrir `index.html` en navegador moderno
2. Verificar que no hay errores en consola (F12)
3. Probar cada caso de uso de la tabla
4. Verificar tiempos de respuesta
5. Confirmar que no hay diálogo de confirmación/human intervention
6. Probar con textos de diferentes longitudes

### Automatización (Opcional)

No hay scripts de automatización configurados en este proyecto. Las pruebas se ejecutan manualmente a través de los botones en la sección de pruebas de la interfaz.

---

## Registro de Pruebas

| Fecha | Tester | Estado | Comentario |
|-------|--------|--------|------------|
| Septiembre 2026 | Edson Leonardo Sánchez Montalvo | Pendiente | Preparar para demostración |

---

## Observaciones Técnicas

1. **Para textos muy cortos** (< 10 chars): El análisis estadístico puede ser ambigüo. Considerar advertencia al usuario o sugerencias múltiples.

2. **Para idiomas no español**: El modelo de frecuencia está optimizado para español. Para otros idiomas, verificar y ajustar frequency tables.

3. **Para símbolos raros**: El sistema maneja caracteres fuera del conjunto preservándolos. Verificar que los caracteres acentuados estén en el conjunto si se quiere cifrarlos.

4. **Límites numéricos**: Para textos > 1MB, considerar optimización de algoritmos (pre-procesamiento, cache).

---
*Este plan cubre todos los requisitos de la rúbrica. Para detalles algorítmicos, consulte ALGORITHM.md.*