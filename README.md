# Seguridad en Sistemas de Cómputo I — Proyecto 1

**Materia:** Seguridad en Sistemas de Cómputo I  
**Proyecto:** Sistema de Cifrado César y Atbash con Descifrado Automático  
**Autor:** [Estudiante]  
**Fecha:** [Fecha]  
**Contacto:** [Correo electrónico del estudiante]

---

## Índice

1. [Introducción](#1-introducción)
2. [Objetivo](#2-objetivo)
3. [Desarrollo](#3-desarrollo)
4. [Conclusión](#4-conclusión)
5. [Bibliografía](#5-bibliografía)

---

## 1. Introducción

### Contexto histórico

La criptografía clásica constituye el origen de la ciencia que busca proteger la información mediante la transformación de mensajes. Entre los sistemas más antiguos se encuentran el cifrado César y el cifrado Atbash, ambos de la antigüedad grecorromana, diseñados para la comunicación militar y diplomática.

### Abu Yusuf Ya'qub ibn Ishaq al-Kindi

**Abu Yusuf Ya'qub ibn Ishaq al-Kindi** (801-873 d.C.), filósofo, matemático y astrólogo árabe, es considerado el padre del criptoanálisis. En su tratado *Risāla fī Istikhrāj al-Muʿamma* (*Manuscrito sobre la desciframiento de mensajes criptográficos*), escrito en el siglo IX, describió por primera vez el método de análisis de frecuencia para romper cifrados por sustitución.

### Su aporte al criptoanálisis y al análisis de frecuencia

La observación fundamental de al-Kindi fue que en cualquier idioma, ciertas letras aparecen con mayor frecuencia que otras. Esta distribución estadística es relativamente estable en textos suficientemente largos. Aplicando este principio, un cifrado por sustitución —por más sofisticado que parezca— queda vulnerable: si la letra "e" aparece con mayor frecuencia en el texto cifrado, es muy probable que corresponda a la letra "e" del idioma original.

El sistema implementado en este proyecto utiliza el análisis de frecuencia de al-Kindi mediante el test chi-cuadrado para comparar las frecuencias observadas con las frecuencias esperadas en textos en español.

### Por qué César y Atbash ya no son adecuados como protección de datos

Ni el cifrado César ni el cifrado Atbash ofrecen protección real de datos en el contexto moderno:

- **Espacio de claves insuficiente:** El cifrado César tiene como máximo 25 desplazamientos posibles (excluyendo el desplazamiento cero que deja el texto sin cambiar). Un atacante puede probar todas las combinaciones en segundos.
- **Inmunidad nula al análisis estadístico:** Ambos métodos conservan la distribución de frecuencias del idioma original, solo que transformada. El análisis de frecuencia de al-Kindi permite romperlos sin conocer la clave.
- **Atbash es una operación simétrica:** No requiere clave alguna, por lo que la seguridad depende únicamente del secreto del algoritmo, lo cual es insuficiente según los principios criptográficos modernos.
- **Sin confidencialidad real:** Cualquier persona con acceso al texto cifrado puede recuperarlo con conocimientos básicos de criptoanálisis.

Estos cifrados son valiosos con fines educativos para comprender los principios fundamentales de la criptografía, pero no deben utilizarse para proteger información sensible.

---

## 2. Objetivo

Implementar un sistema de cifrado y descifrado basado en los métodos César y Atbash, con las siguientes capacidades:

- Cifrado y descifrado manual sobre un conjunto de caracteres configurable.
- Descifrado automático que detecta el tipo de cifrado utilizado y el desplazamiento de César.
- Aplicación del conocimiento de al-Kindi mediante análisis de frecuencia y puntuación lingüística.
- Presentación de una única línea descifrada correcta sin requerir selección manual por parte del usuario.
- Documentación segura del programa mediante identificadores [XTZ-XX].
- Publicación del sistema como aplicación web accesible.

---

## 3. Desarrollo

### Documentación segura del programa

El código fuente (`script.js`) utiliza identificadores breves [XTZ-XX] que hacen referencia a cada componente funcional. Un documento independiente (`XTZ-REFERENCE.md`) explica cada identificador, su ubicación, función y relevancia para el proyecto.

| Identificador | Sección |
|---------------|---------|
| [XTZ-01] | Estado global de la aplicación |
| [XTZ-02] | Frecuencias de letras en español |
| [XTZ-03] | Bigramas en español |
| [XTZ-04] | Trigramas en español |
| [XTZ-05] | Palabras comunes en español |
| [XTZ-06] | Validación del alfabeto |
| [XTZ-07] | Cifrado César |
| [XTZ-08] | Descifrado César |
| [XTZ-09] | Cifrado/Descifrado Atbash |
| [XTZ-11] | Normalización del desplazamiento |
| [XTZ-12] | Análisis de frecuencia |
| [XTZ-13] | Distancia Chi-cuadrado |
| [XTZ-14] | Análisis lingüístico: bigramas |
| [XTZ-15] | Puntuación lingüística |
| [XTZ-16] | Puntuación combinada |
| [XTZ-17] | Candidatos César automático |
| [XTZ-18] | Detección de ambigüedad |
| [XTZ-19] | Descifrado automático |
| [XTZ-20] | Candidato Atbash |
| [XTZ-21] | Procesamiento principal |
| [XTZ-22] | Motor de pruebas |
| [XTZ-23] | Obtener modo de operación |
| [XTZ-24] | Actualizar UI por modo |
| [XTZ-25] | Actualizar UI por método |
| [XTZ-26] | Inicialización |

La documentación detallada del código se encuentra en los siguientes archivos:
- `ALGORITHM.md` — Detalles algorítmicos y matemáticos
- `ARCHITECTURE.md` — Arquitectura del sistema
- `SECURITY.md` — Consideraciones de seguridad
- `TEST-PLAN.md` — Plan de pruebas

---

### Cifrado César

El cifrado César es un método de sustitución por desplazamiento definido matemáticamente como:

```
C_k(cᵢ) = c_{(i + k) mod n}
```

donde **k** es el desplazamiento (clave) y **n** es la longitud del conjunto de caracteres.

El sistema permite configurar el desplazamiento mediante un control numérico y botones predefinidos (+1, +3, +5, +13, +21, -3). El descifrado utiliza el desplazamiento inverso.

### Cifrado Atbash

Atbash es una sustitución por espejo:

```
A(cᵢ) = c_{n-1-i}
```

El descifrado es idéntico al cifrado porque la operación es simétrica (involutiva). El sistema lo detecta automáticamente cuando se compara contra César en el modo de descifrado automático.

### Base en ASCII y conjunto de caracteres configurable

El sistema soporta un conjunto de caracteres configurable por el usuario. Los alfabetos predefinidos incluyen:

- **Básico:** Letras minúsculas latinas (a-z, 26 caracteres)
- **Extendido:** Letras latinas con acentos y ñ (a-z, á, é, í, ó, ú, ü, ñ)
- **ASCII:** Letras mayúsculas y minúsculas más dígitos (a-z, A-Z, 0-9, 62 caracteres)

El usuario puede definir cualquier conjunto de caracteres personalizado. Los caracteres que no pertenecen al conjunto se preservan sin cambios durante el cifrado o descifrado.

### Caracteres Unicode y símbolos

El conjunto configurable puede incluir caracteres Unicode y símbolos especiales. El sistema trata cada carácter como una entrada única en el alfabeto definido por el usuario, lo que permite cifrar textos con caracteres acentuados, signos de puntuación y símbolos especiales siempre que estén incluidos en el alfabeto activo.

### Selección del método

El usuario selecciona el método de cifrado (César o Atbash) mediante botones de radio antes de procesar el texto. La interfaz se adapta dinámicamente: cuando se selecciona César se muestra el control de desplazamiento; cuando se selecciona Atbash se muestra información sobre el funcionamiento del algoritmo.

### Cifrado

En modo **Cifrar**, el sistema aplica el algoritmo seleccionado con el desplazamiento configurado. El resultado se muestra en el área de salida junto con información del proceso (método utilizado, desplazamiento, número de caracteres transformados).

### Descifrado automático

En modo **Descifrar automáticamente**, el sistema:
1. Genera todos los candidatos posibles para César (cada desplazamiento del alfabeto).
2. Genera el candidato para Atbash.
3. Evalúa cada candidato mediante puntuación combinada: `score = 0.4 × freqScore + 0.6 × lingScore`.
4. Ordena los candidatos por score descendente.
5. Detecta ambigüedad: si la diferencia entre los dos mejores candidatos es menor al 5%, se emite una advertencia.
6. Muestra únicamente el candidato ganador sin requerir que el usuario elija manualmente.

### Detección de Atbash o César

El sistema determina automáticamente si el texto cifrado fue generado con César o Atbash al comparar las puntuaciones de los mejores candidatos de cada método. El candidato con mayor puntuación combinada indica el método utilizado.

### Detección del módulo/desplazamiento de César

Para textos cifrados con César, el sistema prueba cada desplazamiento posible (de 0 a n-1, donde n es la longitud del alfabeto) y selecciona aquel cuyo resultado tenga mayor similitud con las frecuencias del español, medida mediante la distancia chi-cuadrado.

### Conocimiento de al-Kindi aplicado al descifrado

El descifrado automático aplica el principio de al-Kindi: las frecuencias de letras en un texto cifrado con sustitución conservan la distribución del idioma original, solo que desplazada o invertida. El sistema utiliza:

- **Frecuencias de letras en español** ([XTZ-02])
- **Bigramas comunes** ([XTZ-03])
- **Trigramas comunes** ([XTZ-04])
- **Palabras frecuentes** ([XTZ-05])

La combinación de estos datos permite una detección precisa del idioma y el método utilizado.

### Mostrar únicamente la línea descifrada correcta

El sistema presenta siempre una sola línea descifrada: el candidato con mayor puntuación combinada. Si existe ambigüedad, se muestra el candidato ganador con una advertencia informativa sobre la posible falta de certeza.

### Publicación del sitio

La aplicación puede desplegarse en:
- **GitHub Pages:** Configurando el repositorio para Pages y subiendo los archivos.
- **Google Sites:** Subiendo los archivos del proyecto a un sitio de Google (método sugerido por el profesor).

La aplicación funciona completamente en el lado del cliente (HTML, CSS, JavaScript) sin necesidad de servidor backend.

---

## 4. Conclusión

Este proyecto demuestra que los cifrados clásicos César y Atbash, aunque históricamente significativos, no ofrecen protección real de datos en el contexto moderno. Su espacio de claves limitado y su vulnerabilidad al análisis de frecuencia los hacen inadecuados para cualquier aplicación que requiera confidencialidad genuina.

Sin embargo, su estudio es fundamental para comprender los principios de la criptografía: el papel de las claves, la importancia del espacio de búsqueda y la relación entre estadística lingüística y seguridad. El análisis de frecuencia descrito por al-Kindi en el siglo IX sigue siendo una herramienta vigente para evaluar la solidez de los sistemas de cifrado.

La implementación de un descifrado automático que combina análisis estadístico y lingüístico ilustra cómo el conocimiento interdisciplinario —matemáticas, estadística y lingüística— es esencial para comprender tanto la construcción como la ruptura de sistemas criptográficos.

---

## 5. Bibliografía

1. **Al-Kindi, Abu Yusuf Ya'qub ibn Ishaq al-Sabbah.** *Risāla fī Istikhrāj al-Muʿamma* (Manuscrito sobre la desciframiento de mensajes criptográficos). Siglo IX d.C.

2. **Kahn, David.** *The Codebreakers: The Story of Secret Writing*. Macmillan, Nueva York, 1967. Capítulo sobre al-Kindi y los orígenes del criptoanálisis.

3. **Singh, Simon.** *The Code Book: The Science of Secrecy from Ancient Egypt to Quantum Cryptography*. Anchor Books, Nueva York, 1999. Explicación accesible del análisis de frecuencia.

4. **Álvarez, G. et al.** "A cryptanalysis of the classical cipher." *Journal of the American Society for Information Science and Technology*.

---

## Enlaces de Entrega

El proyecto debe entregarse con dos enlaces separados:

1. **Enlace del programa** (web de cifrado/descifrado)
2. **Enlace del código fuente** (GitHub)

Los estudiantes deben compartir ambos enlaces en el área de comentarios para recibir calificación.

---

*Documento principal del proyecto. Para detalles técnicos consulte: `ALGORITHM.md`, `ARCHITECTURE.md`, `SECURITY.md`, `TEST-PLAN.md`, `XTZ-REFERENCE.md`.*