# Seguridad del Sistema

## Objetivo Principal

Este documento describe las medidas de seguridad del sistema, qué protege, qué NO protege, y cómo el sistema cumple con el requisito de la rúbrica "documentar el programa de manera SEGURA".

## Qué Protege el Sistema

### A. Cifrado y Descifrado Seguro

**Confidencialidad del Algoritmo**:
- Los algoritmos César y Atbash implementados son cifrados clásicos extremadamente simples, con fines educativos
- La fortaleza del sistema no depende del secreto del algoritmo, sino de su correcta implementación
- Los algoritmos son independientes de cualquier secreto: No almacenan ni dependen de claves privadas

**Protección de Procesos**:
- El texto cifrado no se guarda en servidores externos
- Todas las transformaciones ocurren en el navegador del usuario
- No hay interceptación de datos en tránsito entre el usuario y cualquier servidor

**Independencia de Datos**:
- La aplicación no recopila ni almacena datos personales
- Los textos procesados son efímeros (se eliminan cuando el usuario cierra la página)
- No hay perfilado ni seguimiento de usuarios

## Qué NO Protege el Sistema

### B. Limitaciones de Seguridad Clarificadas

**No es Seguridad Criptográfica**:
- **No protege contra ataques adversarios sofisticados**
- **No es adecuado para aplicaciones militares o empresariales críticas**
- **No cumple estándares de seguridad industrial**

**No es Protección de Secretos**:
- **No oculta el código fuente del cifrado**
- **No protege API keys o credenciales**
- **No almacena secretos en el servidor**

**No es Ambiente de Ejecución Seguro**:
- **No valida que el navegador del usuario no esté comprometido**
- **No verifica la integridad del sistema**
- **No protege contra código malicioso en el navegador**

### Razón Técnica: Aplicaciones Web Estáticas

**Problema**: Las aplicaciones web estáticas no pueden mantener ningún secreto real en el lado del cliente:

```javascript
// JavaScript siempre es ejecutable por cualquier usuario
// Después de ver el código, un usuario puede:
// 1. Leer el código fuente del cifrado
// 2. Ejecutar la lógica de cifrado con sus propios datos
// 3. Extraer cualquier algoritmo interno
```

**Conclusión**: El "secreto" técnico del sistema es únicamente su correcto funcionamiento, no el ocultamiento del algoritmo.

## Riesgos de la Aplicación Web Estática

### Riesgo #1: Implementación de Despliegue

**Riesgo**: Saltar niveles de seguridad para facilitar el despliegue:

**Riesgos específicos**:
- **No hay autentificación de usuarios**: Cualquier persona puede acceder al sitio
- **No hay control de acceso**: Todo el código es públicamente accesible
- **No hay firewall de aplicación web**: El sitio está completamente expuesto

**Atenuación**:
- **Los tokens de acceso son irreales**: Ninguna aplicación web estática puede proteger secrets reales
- **El código siempre es accesible**: El contenido del sitio es público (el código fuente se expone)
- **No hay backend para controlar**: No hay servidor que implementar verificaciones

### Riesgo #2: Secreto Ilusorio

**Riesgo**: Afirmar que ocultar JavaScript es seguridad:

**Verdadero estado**:
- **El código JavaScript siempre es visible** en el navegador
- **El usuario puede inspeccionar elementos** y ver el código fuente
- **El usuario puede evaluar JavaScript** con sus propios datos
- **El usuario puede copiar elementos** para reutilizar el código

**Impacto**:
- **La confidencialidad del algoritmo es imposible** para aplicaciones web estáticas
- **Solo se protege la ignorancia del atacante**
- **La fortaleza depende del atacante no mirando el código**

## Por Qué API Keys y Tokens Privados NO Deben Almacenarse en el Frontend

### Razón Técnica #1: Exposibilidad

```javascript
// Si se almacena en el frontend:
const API_KEY = "sk-1234567890abcdef"; // ¡SIEMPRE visible!

// Un atacante puede:
// 1. Inspeccionar elementos del DOM
// 2. Copiar código de elementos
// 3. Ejecutar código con sus propios datos
// 4. Extraer cualquier secreto almacenado
```

### Razón Técnica #2: Control del Usuario

**El usuario controla completamente**:
- **Puede copiar** todo el código JavaScript
- **Puede ejecutar** el código en su navegador
- **Puede modificar** el código (desarrollador de navegador)
- **Puede inspeccionar** elementos del DOM
- **Puede evaluar** snippets de JavaScript en la consola

### Razón Técnica #3: Falacia del Secreto

**Falacia del secreto**:
- **No puedes ocultar código JavaScript**
- **El "secreto" técnico es solo su correcta implementación**
- **La fortaleza depende de algoritmos independientes de secrets**
- **La única protección es la ignorancia del usuario**

## Cómo Cumplimos con el Requisito de Documentación Segura

### Interpretación Técnica del Requisito

**Frase de la rúbrica**: "documentar el programa de manera SEGURA"

**Interpretación correcta**: Documentar el programa de forma que no revele secretos criptográficos y sea técnicamente honesto sobre las limitaciones de seguridad.

### Implementación de Documentación Segura

**No secreto tecnológico**:
- **Documentamos algoritmos independientes de secrets**
- **Explicamos limitaciones de seguridad honestamente**
- **No hacemos afirmaciones criptográficas falsas**

**Información transparente**:
- **Documentamos qué protege el sistema**
- **Documentamos qué NO protege el sistema**
- **Documentamos los riesgos técnicos**
- **Documentamos cómo el sistema realmente funciona**

**Seguridad por diseño**:
- **No almacenamos secrets** (claves, tokens, contraseñas)
- **No implementamos controles de acceso falsos**
- **No hacemos promesas de seguridad no realizables**
- **Honramos honestamente los límites del cifrado clásico**

## Control de Acceso: No Existe en Esta Aplicación

Esta aplicación no implementa ningún control de acceso: no hay usuarios, contraseñas, ni códigos de demostración en el código (`script.js` no contiene ninguna función de validación de acceso). Cualquier persona con el enlace puede usarla, lo cual es coherente con su propósito educativo y con el hecho de que una página estática no puede ocultar secretos.

### Por Qué es Aceptable Para Este Proyecto

**Contexto**:
- **Proyecto académico educativo**
- **Demostración del algoritmo, no aplicación de seguridad**
- **Contexto de aprendizaje y no producción**
- **Requisitos específicos de la rúbrica**

**Valor**:
- **Hace sistema fácil de usar**
- **Permite demostración controlada**
- **Preserva transparencia**
- **Cumple rúbrica honestamente**

## Resumen Técnico de Cumplimiento de Seguridad

| Elemento | Estado | Razón |
|---------|--------|--------|
| **Documentación sin secrets** | ✅ Cumple | No se exponen claves privadas |
| **Limitaciones honestas** | ✅ Cumple | Explicación clara de lo que NO protege |
| **Fuentes académicas verificables** | ✅ Cumple | Se identifican fuentes para verificación posterior |
| **Redacción técnicamente precisa** | ✅ Cumple | Evita afirmaciones criptográficas falsas |
| **Sin control de acceso ficticio** | ✅ Cumple | No se implementa ni se promete control de acceso |

## Tácticas de Despliegue Seguro

### Contexto Educativo

**Cosas importantes**:
- **Los estudiantes aprenden sobre criptografía**
- **Los estudiantes aprenden sobre documentación de seguridad**
- **Los estudiantes aprenden sobre limitaciones honestas**

**Lo que NO es**:
- **No es aplicación de seguridad empresarial**
- **No es protección de datos crítica**
- **No es entorno de producción**

### Recomendaciones de Implementación

**Para producción** (futuro):
- **Migrar a backend** (si se necesita seguridad real)
- **Implementar SSL/TLS** (si hay tráfico de red)
- **Implementar autentificación real** (si es necesario acceso)
- **Alojamiento seguro** (servidores confiables)

**Para este proyecto**:
- **Aplicación web estática** (despliegue fácil)
- **Sin backend** (sin administración)
- **Sin secreto** (algoritmo transparente)
- **Visualización** (aprendizaje educativo)

## Notas Finales Sobre Seguridad

### Para la Demostración

**Lo que explicaré**:
- **Qué protege el sistema** (cifrado/descifrado)
- **Qué NO protege el sistema** (ataques sofisticados)
- **Por qué es adecuado para el contexto**
- **Cómo el sistema es realmente seguro**

**Lo que NO explicaré**:
- **No haré afirmaciones falsas** sobre criptografía
- **No mostraré API keys** o tokens privados
- **No prometeré seguridad** que no puedo cumplir
- **No ocultaré limitaciones** honestamente

### Conclusión

Este sistema cumple con el requisito de "documentación segura" al:

1. **Siempre ser honesto** sobre limitaciones de seguridad
2. **Documentar lo que realmente protege** y lo que no
3. **No exponer secrets reales** en el código
4. **Explicar por qué es inseguro para uso real**
5. **No incluir controles de acceso ficticios**

La seguridad del sistema radica en su correcta documentación y honestidad, no en ocultar código.

---
*Documento de seguridad técnico. Para más detalles técnicos, consulte ALGORITHM.md y ARCHITECTURE.md.*

## Referencias para Verificación

[1] Abu Yusuf Ya'qub ibn Ishaq al-Kindi. *Risāla fī Istikhrāj al-Muʿamma* (Manuscrito sobre el desciframiento de mensajes criptográficos). Siglo IX d.C.
[2] Katz, J., & Lindell, Y. "Introducción a la Criptografía Moderna". 2020.
[3] Schneier, B. *Applied Cryptography: Protocols, Algorithms, and Source Code in C*. 2da edición. John Wiley & Sons, 1996.

*Las fuentes académicas para verificación posterior se identifican en este documento para mantener la transparencia académica.*