# Referencia de Identificadores XTZ

## Propósito

Este documento lista todos los identificadores `[XTZ-XX]` usados en el código fuente (`script.js`). Cada identificador proporciona una referencia breve que permite consultar la documentación detallada en los archivos de arquitectura, algoritmos y seguridad.

---

## Índice de Identificadores

| ID | Nombre | Sección |
|----|--------|---------|
| [XTZ-01](#xtz-01) | Estado global de la aplicación | App |
| [XTZ-02](#xtz-02) | Frecuencias de letras en español | Datos estadísticos |
| [XTZ-03](#xtz-03) | Bigramas en español | Datos estadísticos |
| [XTZ-04](#xtz-04) | Trigramas en español | Datos estadísticos |
| [XTZ-05](#xtz-05) | Palabras comunes en español | Datos estadísticos |
| [XTZ-06](#xtz-06) | Validación del alfabeto | Alfabeto configurable |
| [XTZ-07](#xtz-07) | Cifrado César | Algoritmo César |
| [XTZ-08](#xtz-08) | Descifrado César | Algoritmo César |
| [XTZ-09](#xtz-09) | Cifrado/Descifrado Atbash | Algoritmo Atbash |
| [XTZ-11](#xtz-11) | Normalización del desplazamiento | Utilidades |
| [XTZ-12](#xtz-12) | Análisis de frecuencia | Al-Kindi |
| [XTZ-13](#xtz-13) | Distancia Chi-cuadrado | Al-Kindi |
| [XTZ-14](#xtz-14) | Análisis lingüístico: bigramas | Análisis |
| [XTZ-15](#xtz-15) | Puntuación lingüística | Análisis |
| [XTZ-16](#xtz-16) | Puntuación combinada | Análisis |
| [XTZ-17](#xtz-17) | Candidatos César automático | Descifrado automático |
| [XTZ-18](#xtz-18) | Detección de ambigüedad | Descifrado automático |
| [XTZ-19](#xtz-19) | Descifrado automático | Descifrado automático |
| [XTZ-20](#xtz-20) | Candidato Atbash | Descifrado automático |
| [XTZ-21](#xtz-21) | Procesamiento principal | UI |
| [XTZ-22](#xtz-22) | Motor de pruebas | Pruebas |
| [XTZ-23](#xtz-23) | Obtener modo de operación | UI |
| [XTZ-24](#xtz-24) | Actualizar UI por modo | UI |
| [XTZ-25](#xtz-25) | Actualizar UI por método | UI |
| [XTZ-26](#xtz-26) | Inicialización | App |

---

## Detalle por Identificador

### [XTZ-01] Estado global de la aplicación

**Archivo:** `script.js`
**Línea aproximada:** 7
**Función:** `const App = {...}`

**Qué hace:** Define el estado global de la aplicación incluyendo el alfabeto activo, el desplazamiento de César por defecto, los conjuntos de alfabetos predefinidos (básico, extendido, ASCII alfanumérico, ASCII 7 bits) y las tablas estadísticas del español.

**Relevancia para seguridad:** El alfabeto configurable permite al usuario definir exactamente qué caracteres serán procesados. Esto impide que caracteres fuera del conjunto sean accidentalmente modificados o que información sensible sea comprometida por transformaciones inesperadas.

---

### [XTZ-02] Frecuencias de letras en español

**Archivo:** `script.js`
**Línea aproximada:** 40
**Función:** `App.spanishFreq = {...}`

**Qué hace:** Define las frecuencias relativas de cada letra en textos en español. Estos datos se usan para el análisis de frecuencia de Al-Kindi.

**Relevancia para seguridad:** Permite determinar si un texto descifrado es español válido mediante chi-cuadrado. Un atacante que desconozca el desplazamiento correcto no podrá producir texto que coincida con estas frecuencias.

---

### [XTZ-03] Bigramas en español

**Archivo:** `script.js`
**Línea aproximada:** 49
**Función:** `App.spanishBigrams = {...}`

**Qué hace:** Lista los bigramas (pares de letras) más comunes en español con sus frecuencias relativas.

**Relevancia para seguridad:** Complementa el análisis de frecuencia de letras para mejorar la detección del texto correcto.

---

### [XTZ-04] Trigramas en español

**Archivo:** `script.js`
**Línea aproximada:** 57
**Función:** `App.spanishTrigrams = {...}`

**Qué hace:** Lista los trigramas (tripletes de letras) más comunes en español.

**Relevancia para seguridad:** Aumenta la precisión del análisis lingüístico para textos más largos.

---

### [XTZ-05] Palabras comunes en español

**Archivo:** `script.js`
**Línea aproximada:** 63
**Función:** `App.commonWords = [...]`

**Qué hace:** Lista artículos, preposiciones y palabras frecuentes en español.

**Relevancia para seguridad:** Permite verificar si el texto descifrado contiene palabras válidas en español, mejorando la selección del candidato correcto.

---

### [XTZ-06] Validación del alfabeto

**Archivo:** `script.js`
**Línea aproximada:** 71
**Función:** `setAlphabet()`

**Qué hace:** Valida que el alfabeto proporcionado no esté vacío, tenga al menos 2 caracteres, y no contenga duplicados. Muestra errores descriptivos si la validación falla.

**Relevancia para seguridad:** Un alfabeto inválido podría causar errores en el cifrado o revelar información sobre el sistema. La validación previene fallos inesperados.

---

### [XTZ-07] Cifrado César

**Archivo:** `script.js`
**Línea aproximada:** 141
**Función:** `caesarEncrypt(text, shift, alphabet)`

**Qué hace:** Implementa el cifrado César mediante desplazamiento modular: `C(c_i) = c_{(i + k) mod n}`. Itera por cada carácter, busca su índice en el alfabeto, aplica el desplazamiento módulo n, y preserva caracteres fuera del alfabeto.

**Relevancia para seguridad:** Este es el algoritmo central del proyecto. Un atacante que no conozca el desplazamiento no puede descifrar el mensaje sin análisis estadístico.

---

### [XTZ-08] Descifrado César

**Archivo:** `script.js`
**Línea aproximada:** 162
**Función:** `caesarDecrypt(text, shift, alphabet)`

**Qué hace:** Descifra texto cifrado con César usando el desplazamiento inverso (`caesarEncrypt` con `-shift`).

**Relevancia para seguridad:** Permite al receptor recuperar el mensaje original si conoce el desplazamiento. La implementación reutiliza `caesarEncrypt` para evitar código duplicado.

---

### [XTZ-09] Cifrado/Descifrado Atbash

**Archivo:** `script.js`
**Línea aproximada:** 168, 187
**Funciones:** `atbashEncrypt()` y `atbashDecrypt()`

**Qué hace:** Implementa Atbash mediante inversión del alfabeto: `A(c_i) = c_{n-1-i}`. El descifrado usa la misma operación por simetría (involutiva).

**Relevancia para seguridad:** Atbash no requiere clave, pero el sistema debe poder detectarlo automáticamente entre múltiples candidatos en el modo automático.

---

### [XTZ-11] Normalización del desplazamiento

**Archivo:** `script.js`
**Línea aproximada:** 212
**Función:** `normalizeShift(shift, alphabetLength)`

**Qué hace:** Normaliza el desplazamiento al rango válido `[0, n)` usando módulo positivo. Maneja desplazamientos negativos correctamente.

**Relevancia para seguridad:** Previene errores de índice que podrían causar excepciones o comportamiento inesperado.

---

### [XTZ-12] Análisis de frecuencia

**Archivo:** `script.js`
**Línea aproximada:** 221
**Función:** `calculateFrequencies(text, alphabet)`

**Qué hace:** Calcula las frecuencias relativas de cada carácter del alfabeto presente en el texto. Retorna un objeto `{freq, total}` donde `freq` es un mapa carácter → frecuencia relativa.

**Relevancia para seguridad:** Base del método de Al-Kindi para determinar si un texto descifrado es español válido.

---

### [XTZ-13] Distancia Chi-cuadrado

**Archivo:** `script.js`
**Línea aproximada:** 238
**Función:** `chiSquared(observedFreq, expectedFreq, alphabet)`

**Qué hace:** Calcula χ² = Σ[(f_obs - f_exp)² / f_exp] para comparar distribuciones. Retorna la suma total; valores menores indican mayor similitud con la distribución esperada.

**Relevancia para seguridad:** Cuanto menor χ², mayor la similitud entre el texto descifrado y español válido.

---

### [XTZ-14] Análisis lingüístico: bigramas

**Archivo:** `script.js`
**Línea aproximada:** 254, 265, 276
**Funciones:** `countBigrams()`, `countTrigrams()`, `countCommonWords()`

**Qué hace:** Cuenta coincidencias de bigramas, trigramas y palabras frecuentes del español en el texto candidato. `countBigrams` y `countTrigrams` buscan subcadenas en los mapas estadísticos; `countCommonWords` usa expresiones regulares con límites de palabra (`\b`).

**Relevancia para seguridad:** Mejora la puntuación de candidatos que forman palabras coherentes en español.

---

### [XTZ-15] Puntuación lingüística

**Archivo:** `script.js`
**Línea aproximada:** 288
**Función:** `calculateLinguisticScore(text, alphabet)`

**Qué hace:** Combina análisis de bigramas, trigramas y palabras comunes en un score ponderado: `total = 0.3 × bigramScore + 0.2 × trigramScore + 0.5 × wordScore`.

**Relevancia para seguridad:** Permite seleccionar automáticamente el mejor candidato sin intervención humana.

---

### [XTZ-16] Puntuación combinada

**Archivo:** `script.js`
**Línea aproximada:** 302
**Función:** `combinedScore(candidate, alphabet)`

**Qué hace:** Combina puntuación de frecuencia (χ²) y puntuación lingüística en un score único: `combined = 0.4 × freqScore + 0.6 × normalizedLing`, donde `freqScore = 1 / (1 + χ²)` y `normalizedLing = min(lingScore.total / 10, 1)`.

**Relevancia para seguridad:** Balancea ambos métodos para máxima precisión en la selección del candidato.

---

### [XTZ-17] Candidatos César automático

**Archivo:** `script.js`
**Línea aproximada:** 319
**Función:** `generateCesarCandidates(ciphertext, alphabet)`

**Qué hace:** Genera un candidato para cada posible desplazamiento de César (0 a n-1). Usa `caesarDecrypt` con cada desplazamiento.

**Relevancia para seguridad:** Permite probar todas las claves posibles sin intervención del usuario.

---

### [XTZ-18] Detección de ambigüedad

**Archivo:** `script.js`
**Línea aproximada:** 346
**Función:** `detectAmbiguity(candidates)`

**Qué hace:** Determina si los dos mejores candidatos tienen puntuaciones similares calculando `relativeGap = gap / avgScore`. Si `relativeGap < 0.05` (5%), se marca como ambiguo.

**Relevancia para seguridad:** Advierte al usuario cuando no hay suficiente evidencia para determinar la solución correcta.

---

### [XTZ-19] Descifrado automático

**Archivo:** `script.js`
**Línea aproximada:** 362
**Función:** `autoDecrypt(ciphertext, alphabet)`

**Qué hace:** Orquestación completa del descifrado automático: genera candidatos César, genera candidato Atbash, puntúa todos con `combinedScore`, ordena por score descendente, detecta ambigüedad y retorna el ganador.

**Relevancia para seguridad:** Implementa el requisito de "mostrar únicamente la línea descifrada correcta sin depender de que el usuario elija manualmente entre resultados".

---

### [XTZ-20] Candidato Atbash

**Archivo:** `script.js`
**Línea aproximada:** 335
**Función:** `generateAtbashCandidate(ciphertext, alphabet)`

**Qué hace:** Genera el único candidato válido para Atbash usando `atbashDecrypt`. El desplazamiento es `null` porque Atbash no usa clave numérica.

**Relevancia para seguridad:** Permite comparar Atbash contra César para determinar cuál método produjo el texto cifrado.

---

### [XTZ-21] Procesamiento principal

**Archivo:** `script.js`
**Línea aproximada:** 385
**Función:** `processText()`

**Qué hace:** Dispatch principal que routea a cifrar (modo encrypt), descifrar manual (modo decrypt) o descifrado automático (modo auto) según el modo seleccionado. Muestra resultado o información del proceso.

**Relevancia para seguridad:** Punto de entrada para toda transformación de texto.

---

### [XTZ-22] Motor de pruebas

**Archivo:** `script.js`
**Línea aproximada:** 538
**Constante:** `const TestEngine = {...}`

**Qué hace:** Framework de pruebas integrado con assertions y reporte. Contiene métodos `reset()`, `log()`, `assert()`, `assertEq()` y `getReport()`. Se usa para verificar correctitud de algoritmos directamente desde la interfaz.

**Relevancia para seguridad:** Permite verificar que los algoritmos funcionan correctamente antes de confiar en ellos.

---

### [XTZ-23] Obtener modo de operación

**Archivo:** `script.js`
**Línea aproximada:** 496
**Función:** `getOperationMode()`

**Qué hace:** Lee el radio button seleccionado (encrypt/decrypt/auto). Retorna el valor del modo de operación.

**Relevancia para seguridad:** Determina el flujo de procesamiento (cifrar, descifrar o automático).

---

### [XTZ-24] Actualizar UI por modo

**Archivo:** `script.js`
**Línea aproximada:** 505
**Función:** `updateModeUI()`

**Qué hace:** Actualiza la interfaz según el modo de operación seleccionado. Muestra/oculta el panel de configuración manual, el banner automático, y ajusta el texto del botón de procesar.

**Relevancia para seguridad:** Mantiene coherencia entre estado interno y UI.

---

### [XTZ-25] Actualizar UI por método

**Archivo:** `script.js`
**Línea aproximada:** 528
**Función:** `updateMethodUI()`

**Qué hace:** Muestra/oculta opciones de César o Atbash según selección del método. Actualiza las pestañas de método para reflejar el estado actual.

**Relevancia para seguridad:** Solo presenta opciones válidas para el método elegido.

---

### [XTZ-26] Inicialización

**Archivo:** `script.js`
**Línea aproximada:** 680
**Función:** `init()`

**Qué hace:** Configura event listeners para todos los controles de la interfaz (alfabeto, modo, método, shift, procesar, limpiar, copiar, pruebas). Establece el alfabeto por defecto y el estado inicial de la aplicación.

**Relevancia para seguridad:** Asegura que la aplicación inicia en un estado válido y seguro.

---

## Notas sobre el espacio XTZ

- Los identificadores van de [XTZ-01] a [XTZ-26], saltando el [XTZ-10] que no está asignado en el código.
- [XTZ-09] se usa tanto para cifrado como descifrado Atbash porque la operación es simétrica (la misma función sirve para ambos).
- [XTZ-14] se usa tres veces: para `countBigrams`, `countTrigrams` y `countCommonWords` porque forman parte del mismo módulo de análisis lingüístico.

---

## Uso de Identificadores

Buscar en el código:
```
grep -n "\[XTZ-" script.js
```

Consultar documentación:
- Para detalles algorítmicos: `ALGORITHM.md`
- Para arquitectura del sistema: `ARCHITECTURE.md`
- Para consideraciones de seguridad: `SECURITY.md`
- Para plan de pruebas: `TEST-PLAN.md`

---

## Notas sobre Seguridad

Los identificadores XTZ facilitan la documentación segura al:
1. Proporcionar referencias breves en el código fuente
2. Mantener la documentación separada del código
3. Evitar comentarios extensos que podrían ser modificados accidentalmente
4. Permitir auditorías de seguridad trazables

La documentación segura requiere que el código no exponga secretos. Los identificadores XTZ documentan la lógica, no los secretos.

---

*Documento generado para el proyecto de Seguridad en Sistemas de Cómputo I.*