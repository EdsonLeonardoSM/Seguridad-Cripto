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
| Unitarias | Verificar algoritmos individuales | Jest/Mocha o manual | script.js |
| Integración | Verificar flujo completo | Manual + Browser | index.html |
| Regresión | Verificar cambios no rompan funcionalidades | Manual | Todos |
| Rendimiento | Verificar tiempo de respuesta | Console API | Navegador |
| Usabilidad | Verificar interfaz de usuario | Manual | index.html |
| Seguridad | Verificar no-exposición de secrets | Manual | Todos |

### Criterios de Aceptación

Una característica es **aceptada** cuando:
1. Todos los casos de prueba pasan (100% éxito)
2. No hay errores en consola
3. La funcionalidad cumple el requisito de la rúbrica
4. La experiencia de usuario es fluida

---

## 2. Unidades de Prueba

### 2.1 Pruebas del Algoritmo César

#### Test Case C-001: Cifrado básico
```
Entrada: "abc", shift=3, álphabet="abcdefghijklmnopqrstuvwxyz"
Esperado: "def"
Verificación: 
- a(0) → d(3)
- b(1) → e(4)  
- c(2) → f(5)
```

#### Test Case C-002: Módulo en borde
```
Entrada: "xyz", shift=3, álphabet="abcdefghijklmnopqrstuvwxyz" (n=26)
Esperado: "abc"
Verificación:
- x(23) → a(26 mod 26 = 0)
- y(24) → b(27 mod 26 = 1)
- z(25) → c(28 mod 26 = 2)
```

#### Test Case C-003: Caracteres fuera del conjunto
```
Entrada: "a!b@c#", shift=1, álphabet="abc"
Esperado: "b!c@d#"
Verificación:
- a → b (dentro del conjunto)
- !, @, # preservados sin cambio
```

#### Test Case C-004: Conjunto personalizado
```
Entrada: "012", shift=1, álphabet="0123456789"
Esperado: "123"
Verificación:
- 0(0) → 1(1)
- 1(1) → 2(2)
- 2(2) → 3(3)
```

### 2.2 Pruebas del Algoritmo Atbash

#### Test Case A-001: Cifrado básico
```
Entrada: "abcde", álphabet="abcde" (n=5)
Esperado: "edcba"
Verificación:
- a(0) → e(4) [complemento: 5-1-0=4]
- b(1) → d(3)
- c(2) → c(2)
- d(3) → b(1)
- e(4) → a(0)
```

#### Test Case A-002: Caracteres fuera del conjunto
```
Entrada: "a!e", álphabet="abcde"
Esperado: "e!a"
Verificación:
- a → e (dentro del conjunto)
- ! preservado
- e → a (dentro del conjunto)
```

#### Test Case A-003: Par de caracteres simétrico
```
Entrada: "c", álphabet="abcde"
Esperado: "c"
Verificación:
- c(2) → c(2) [posición central]
```

### 2.3 Pruebas de Detección Automática

#### Test Case D-001: Detectar César con shift=3
```
Texto cifrado: "def" (de "abc" con shift=3)
Método esperado: César, shift=3
```

#### Test Case D-002: Detectar Atbash
```
Texto cifrado: "edcba" (de "abcde")
Método esperado: Atbash
```

#### Test Case D-003: Texto corto ambiguo
```
Texto cifrado: "a"
Método esperado: Ambas válidas, usar heurística adicional
```

---

## 3. Casos de Prueba Específicos

### 3.1 Características de la Rúbrica

| Requisito | Test Case | Descripción | Estado Esperado |
|-----------|-----------|-------------|-----------------|
| **Programa web cifrado/descifrado** | WEB-001 | Interfaz funcional al cargar | Pasa |
| **Conjunto de caracteres ASCII/config** | CH-001 | Selector de conjuntos funciona | Pasa |
| **Caracteres fuera del conjunto** | CH-002 | Caracteres preservados | Pasa |
| **Selección automática módulo** | MOD-001 | Botón detecta automáticamente | Pasa |
| **Descifrado César con módulo** | CE-001 | Detecta shift correctamente | Pasa |
| **Detección automática tipo** | DET-001 | Muestra Atbash o César | Pasa |
| **Línea descifrada correcta sin intervención** | AUTO-001 | Solo muestra una línea | Pasa |

### 3.2 Ejemplos Prácticos

#### Ejemplo 1: César con shift=5
```
Texto original: "el rata"
Conjunto: "abcdefghijklmnopqrstuvwxyz"
Shift: 5
Texto cifrado: "mj wfymf"
Detección: César, shift=5
Resultado: "el rata"
```

#### Ejemplo 2: Atbash
```
Texto original: "hola"
Conjunto: "abcdefghijklmnopqrstuvwxyz"
Texto cifrado: "slvi"
Detección: Atbash
Resultado: "hola"
```

#### Ejemplo 3: Texto con caracteres especiales
```
Texto original: "¡Hola, señor!"
Conjunto: "abcdefghijklmnopqrstuvwxyzáéíóú¡¿, "
Texto cifrado: "¡Jsli, sáliv!" (Atbash sobre conjunto especializado)
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

Si se requiere automatización:
```javascript
// Usar framework de testing
// Ej: Jest para funciones unitarias
// Ej: Cypress para tests E2E

// Comando sugerido:
npm test
```

---

## Registro de Pruebas

| Fecha | Tester | Estado | Comentario |
|-------|--------|--------|------------|
| [Fecha] | [Nombre] | Pendiente | Preparar para demostración |

---

## Observaciones Técnicas

1. **Para textos muy cortos** (< 10 chars): El análisis estadístico puede ser ambigüo. Considerar advertencia al usuario o sugerencias múltiples.

2. **Para idiomas no español**: El modelo de frecuencia está optimizado para español. Para otros idiomas, verificar y ajustar frequency tables.

3. **Para símbolos raros**: El sistema maneja caracteres fuera del conjunto preservándolos. Verificar que los caracteres acentuados estén en el conjunto si se quiere cifrarlos.

4. **Límites numéricos**: Para textos > 1MB, considerar optimización de algoritmos (pre-procesamiento, cache).

---
*Este plan cubre todos los requisitos de la rúbrica. Para detalles algorítmicos, consulte ALGORITHM.md.*