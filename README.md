# Proyecto de Seguridad en Sistemas de Cómputo I

## Descripción

Este proyecto implementa un sistema de cifrado y descifrado que soporta dos métodos clásicos:

- **César**: Cifrado por sustitución con desplazamiento fijo
- **Atbash**: Cifrado por sustitución por espejo

Ambos algoritmos operan sobre un conjunto de caracteres configurable por el usuario, lo que permite una mayor flexibilidad en la protección de información.

## Enlaces de Entrega

El proyecto debe entregarse con dos enlaces separados:

1. **Enlace del programa** (web de cifrado/descifrado)
2. **Enlace del código fuente** (GitHub)

Los estudiantes deben compartir ambos enlaces en el área de comentarios para recibir calificación.

## Requisitos de la Rúbrica y Mapeo

| Requisito | Fuente | Implementación |
|------------|--------|----------------|
| **Portada** (2%) | rúbrica | Página principal de este README.md |
| **Índice** (2%) | rúbrica | Tabla de navegación en este README.md |
| **Introducción** (5%) | rúbrica | "Desarrollo" en ARCHITECTURE.md |
| **Objetivo** (3%) | rúbrica | Sección "Objetivo" en README.md |
| **Programa en web de cifrado/descifrado** (10%) | rúbrica | index.html con interfaz completa |
| **Conjunto de caracteres ASCII/configurable** (5%) | rúbrica | Lógica de " conjunto de caracteres " en script.js |
| **Selección automática de módulo** (10%) | rúbrica | Función "detectarTipo()" en script.js |
| **Detección automática de módulo César y su módulo** (30%) | rúbrica | Función "desencriptarCesarAuto()" en script.js |
| **Publicación del sitio** (10%) | rúbrica | Despliegue en GitHub Pages |
| **Cifrado Atbash** (15%) | rúbrica | Función "encriptarAtbash()" en script.js |
| **Conclusión** (5%) | rúbrica | Discusión "Cierre" en README.md |
| **Bibliografía** (3%) | rúbrica | Referencias en ALGORITHM.md |

## Características Principales

- **Interfaz de usuario intuitiva**: Área de texto para entrada, botones de acción, desplegables de selección
- **Detección automática inteligente**: Determina si el texto cifrado usa César o Atbash sin intervención humana
- **Cifrado César automático**: Detecta tanto el algoritmo como el módulo de desplazamiento
- **Análisis de Al-Kindi**: Usa análisis de frecuencia de letras para identificar patrones
- **Soporte de conjunto configurable**: Permite usar cualquier conjunto de caracteres personalizado
- **Preservación de caracteres**: Carácter fuera del conjunto se mantienen sin cambios
- **Selección automática de resultado**: Selecciona una única línea descifrada correcta sin intervención humana

## Guía de Uso

1. Ingrese o pegue el texto cifrado en el área de texto
2. Seleccione el conjunto de caracteres (predefinido: letras latinas, extensible)
3. Haga clic en "Analizar" o "Descifrar todo"
4. El sistema detectará automáticamente si es César o Atbash
5. Si es César, también detectará el módulo de desplazamiento
6. Muestra los resultados procesados

## Instrucciones de Despliegue

### Despliegue Local (Desarrollo)

```bash
# Clonar el repositorio
cd Seguridad-Cripto

# Ejecutar servidor web (si aplica)
# npm install && npm start

# Abrir index.html en navegador
```

### Despliegue en GitHub Pages

1. Configurar un token personal de acceso (PAT) para GitHub
2. Habilitar GitHub Pages en las propiedades del repositorio
3. Subir el código generado
4. Copiar la URL proporcionada

### Despliegue en Google Sites

1. Crear un nuevo sitio de Google
2. Subir los archivos del proyecto
3. Publicar sitio
4. Copiar la URL

## Restricciones Técnicas

- La aplicación funciona completamente en el lado del cliente (sin backend)
- No se almacena ningún dato en servidores externos
- Todos los algoritmos de cifrado son completamente deterministas
- Los resultados de descifrado son reproducibles sin intervención humana

## Proceso de Demostración

Durante la demostración (máximo 5 minutos):

1. Abrir el enlace de la aplicación web
2. Ingresar un texto cifrado de ejemplo
3. Demostrar la detección automática (César vs Atbash)
4. Mostrar la detección automática del módulo César
5. Explicar cómo el análisis de Al-Kindi funciona
6. Demostrar la preservación de caracteres fuera del conjunto
7. Explicar la selección automática de línea descifrada correcta

## Registro de Calificaciones

- Proyecto vale 30 puntos para calificación parcial
- Pérdida de 6.6 puntos por cada día de retraso
- Requisitos no cumplidos resultarán en calificación nula

## Datos del Proyecto

- Título: Seguridad en Sistemas de Cómputo I - Proyecto 1
- Autor: [Estudiante]
- Fecha: [Fecha]
- Contacto: [Correo electrónico del estudiante]

## Notas Técnicas

- La aplicación opera completamente en el navegador del usuario
- Todas las transformaciones de texto ocurren localmente
- No se requiere servidor backend
- No hay servicios externos involucrados
- El código fuente es proporcionado como evidencia de implementación

## Contacto para Asistencia Técnica

Si encuentra problemas durante la implementación o el despliegue, por favor contacte al profesor para asistencia.

---

*El proyecto debe entregarse antes de la fecha límite especificada.
Sin ambos enlaces (web y código) en los comentarios, el proyecto es declarado nulo.*