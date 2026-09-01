# Arquitectura del Sistema

## Visión General

El proyecto implementa una aplicación web estática completa (Single Page Application) que permite cifrar y descifrar texto usando los métodos César y Atbash, con detección automática del algoritmo y parámetros de cifrado.

## Arquitectura de la Aplicación

```
├── index.html          # Estructura HTML principal
├── styles.css          # Estilos CSS (incrustados en index.html o archivos separados)
└── script.js           # Lógica JavaScript de cifrado y detección
```

### Componentes

1. **Capa de Presentación** (HTML/CSS)
   - Área de entrada de texto
   - Botones de acción (cifrar, descifrar, analizar)
   - Área de salida de resultados
   - Indicadores de estado

2. **Capa de Lógica** (JavaScript)
   - Implementación de algoritmos César y Atbash
   - Funciones de análisis de frecuencia (Al-Kindi)
   - Sistema de puntuación lingüística
   - Manejo de eventos de interfaz de usuario

3. **Capa de Datos** (Memoria del navegador)
   - Configuración del conjunto de caracteres
   - Historial de transformaciones (opcional)
   - Cache de resultados para optimización

## Flujo de Datos

```
[Entrada de Texto] 
       ↓
[Preprocesamiento] → [Validación de Caracteres] 
       ↓
[Selección de Algoritmo] 
       ↓
[Transformación de Texto] 
       ↓
[Postprocesamiento y Salida]
```

### Detalle de Flujo

1. **Entrada**: El usuario ingresa texto en el área de texto
2. **Preprocesamiento**: Se detecta el conjunto de caracteres configurado
3. **Selección de Algoritmo**: 
   - Si se especifica "Analizar todo", se ejecutan ambos algoritmos
   - Si se especifica César o Atbash directamente, se usa el seleccionado
4. **Transformación**:
   - Para César: Se prueba cada posible desplazamiento dentro del conjunto
   - Para Atbash: Se aplica directamente (solo una posible transformación)
5. **Evaluación**: Cada resultado se evalúa usando:
   - Análisis de frecuencia de Al-Kindi
   - Puntuación de palabras comunes
   - Análisis de bigramas/trigramas
6. **Selección**: Se elige el resultado con mayor puntuación
7. **Salida**: Se muestra el resultado seleccionado

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica de la página
- **CSS3**: Estilos visuales y diseño responsive
- **JavaScript ES6**: Lógica de cifrado y detección
- **GitHub Pages**: Plataforma de despliegue (opcional)

## Patrones de Diseño

### Single Responsibility Principle

Cada función tiene una única responsabilidad clara:
- `caesarEncrypt()`: Solo implementa el cifrado César
- `atbashEncrypt()`: Solo implementa el cifrado Atbash
- `analyzeFrequency()`: Solo realiza análisis de frecuencia
- `scoreLinguisticQuality()`: Solo evalúa calidad lingüística

### Functional Programming Approach

- Funciones puras sin efectos secundarios
- Estado mínimo mantenido en el DOM
- Transformaciones de datos explícitas

## Decisiones Arquitectónicas

### Aplicación Web Estática vs. Con Backend

**Ventajas de la solución estática**:
- **Simplicidad**: No requiere servidor backend
- **Privacidad**: Los datos nunca abandonan el navegador del usuario
- **Rendimiento**: No hay latencia de red
- **Mantenimiento**: No hay componentes de servidor que administrar
- **Costo**: Despliegue gratuito en GitHub Pages

**Desventajas consideradas pero descartadas**:
- **Funcionalidad del backend**: No requerida para el alcance del proyecto
- **Escalabilidad**: No aplicable para uso educativo individual
- **Seguridad**: Aplicación web estática no es más vulnerable que una con backend para este caso de uso

## Consideraciones de Escalabilidad

- **Máximo tamaño de entrada**: Limitado por memoria del navegador (prácticamente ilimitado para textos normales)
- **Complejidad algorítmica**: 
  - César: O(n * m) donde n = longitud del texto, m = tamaño del conjunto de caracteres
  - Atbash: O(n)
  - Análisis de frecuencia: O(n)
  - Puntuación lingüística: O(n)
- **Optimización**: Los algoritmos están diseñados para ser eficientes en términos de tiempo y espacio

## Modelos de Datos

### Configuración del Conjunto de Caracteres

```javascript
{
  alphabet: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  name: "Alfanumérico estándar",
  description: "Letras mayúsculas, minúsculas y dígitos"
}
```

### Resultado de Transformación

```javascript
{
  originalText: "Texto original",
  transformedText: "Texto transformado",
  method: "César|Atbash",
  parameters: {
    shift: 3, // para César
    // nada para Atbash
  },
  score: 0.85, // puntuación de calidad lingüística
  confidence: "Alta|Media|Baja"
}
```

## Manejo de Errores

- **Conjunto de caracteres vacío**: Muestra mensaje de error
- **Texto vacío**: No realiza transformación
- **Caracteres no reconocibles**: Se preservan sin cambio
- **Entrada no válida**: Validación y retroalimentación al usuario

## Seguridad en la Arquitectura

La aplicación sigue el modelo de amenaza de "navegador de usuario no confiable":
- No almacena secretos (claves, tokens)
- No ejecuta código no confiable
- Los datos del usuario nunca abandonan su navegador
- No hay superficie de ataque de servidor

## Diagramas

### Diagrama de Componentes

```
[Usuario] 
    ↓ (HTTP/HTTPS)
[Navegador Web] 
    ↓ (DOM API)
[JavaScript Runtime] 
    ↓ (Funciones Puras)
[Resultados de Cifrado]
```

### Diagrama de Flujo de Información

```
Entrada de Texto → Validación → Análisis de Frecuencia → 
                  ↓                                      ↓
            Transformación César               Transformación Atbash 
                  ↓                                      ↓
           Evaluación de Calidad               Evaluación de Calidad
                  ↓                                      ↓
           Selección del Mejor Resultado ←─────────────
                  ↓
           Presentación de Resultados
```

## Limitaciones y Supuestos

- **Supuesto**: El usuario tiene JavaScript habilitado en su navegador
- **Supuesto**: El texto a procesar está en un idioma con distribución de frecuencia reconocible (español)
- **Limitación**: No garantiza detección correcta para textos muy cortos (< 10 caracteres)
- **Limitación**: La precisión depende de la calidad del modelo de frecuencia de español

## Próximos Pasos

1. Validar implementación contra casos de prueba conocidos
2. Optimizar algoritmos para mejor rendimiento
3. Mejorar documentación y comentarios en el código
4. Probar en diferentes navegadores y dispositivos
5. Preparar materiales de demostración

---
*Este documento describe la arquitectura técnica del sistema. Para detalles de implementación específica, consulte ALGORITHM.md.*