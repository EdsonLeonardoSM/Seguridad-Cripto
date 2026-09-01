# Algoritmos y Análisis Matemático

## Índice

1. [Conjunto de Caracteres Configurable](#1-conjunto-de-caracteres-configurable)
2. [Cifrado César](#2-cifrado-césar)
3. [Cifrado Atbash](#3-cifrado-atbash)
4. [Análisis de Frecuencia de Al-Kindi](#4-análisis-de-frecuencia-de-al-kindi)
5. [Chi-Cuadrado](#5-chi-cuadrado)
6. [Generación de Candidatos](#6-generación-de-candidatos)
7. [Sistema de Puntuación Lingüística](#7-sistema-de-puntuación-lingüística)
8. [Selección Automática del Resultado](#8-selección-automática-del-resultado)

---

## 1. Conjunto de Caracteres Configurable

### Definición Formal

Sea **Σ** un conjunto finito de caracteres definido por el usuario:

```
Σ = {c₀, c₁, c₂, ..., c_{n-1}}
```

donde:
- **n** = |Σ| es la cardinalidad del conjunto (longitud)
- **cᵢ** = carácter en la posición i (0-indexed)

### Ejemplo

Para el alfabeto latino estándar:

```
Σ = {'a', 'b', 'c', ..., 'z'}
n = 26
```

### Propiedades

1. **Orden**: Los caracteres tienen un orden definido por su posición en Σ
2. **Mapeo índice**: `index(c) → i` donde `0 ≤ i < n`
3. **Mapeo inverso**: `at(i) → cᵢ` donde `0 ≤ i < n`
4. **Complemento**: `complement(i) = n - 1 - i` (para Atbash)

### Manejo de Caracteres Fuera del Conjunto

Para cualquier carácter `x` que no pertenezca a Σ:

```
x ∉ Σ ⟹ x se preserva sin modificación
```

Esto permite que símbolos, espacios, y puntuación se mantengan intactos durante la transformación.

---

## 2. Cifrado César

### Definición Matemática

Sea **Σ** un conjunto de caracteres de longitud **n**, y sea **k** el desplazamiento (clave):

```
C_k(cᵢ) = c_{(i + k) mod n}
```

donde:
- **cᵢ** = carácter en posición i dentro de Σ
- **k** = desplazamiento (entero, 0 ≤ k < n)
- **mod** = operación módulo

### Algoritmo de Cifrado

```
Para cada carácter x en el texto:
    Si x ∈ Σ:
        i = índice de x en Σ
        j = (i + k) mod n
        Retornar Σ[j]
    Sino:
        Retornar x sin cambios
```

### Algoritmo de Descifrado

```
Para cada carácter x en el texto:
    Si x ∈ Σ:
        i = índice de x en Σ
        j = (i - k) mod n
        Retornar Σ[j]
    Sino:
        Retornar x sin cambios
```

### Ejemplo

Para Σ = {'a', 'b', 'c', 'd', 'e'} y k = 2:

| Original | Índice | Cálculo | Resultado |
|----------|--------|---------|----------|
| a        | 0      | (0+2) mod 5 = 2 | c |
| b        | 1      | (1+2) mod 5 = 3 | d |
| c        | 2      | (2+2) mod 5 = 4 | e |
| d        | 3      | (3+2) mod 5 = 0 | a |
| e        | 4      | (4+2) mod 5 = 1 | b |

**Cifrado**: "abcde" → "cdefb"
**Descifrado**: "cdefb" → "abcde"

### Propiedades

1. **Determinista**: Mismo texto + misma clave = mismo resultado
2. **Simétrico para k fijo**: C_k(C_k(x)) = x (descifrado es cifrado con desplazamiento n-k)
3. **Espacio de claves**: n posibles desplazamientos (0 a n-1)
4. **Complejidad temporal**: O(m) donde m = longitud del texto

---

## 3. Cifrado Atbash

### Definición Matemática

Atbash es una sustitución por espejo dentro del conjunto Σ:

```
A(cᵢ) = c_{n-1-i}
```

donde:
- **cᵢ** = carácter en posición i dentro de Σ
- **n** = longitud de Σ
- **n-1-i** = posición espejada (complemento)

### Propiedades Matemáticas

1. **Simétrico**: A(A(cᵢ)) = cᵢ
2. **Involution**: El algoritmo es su propio inverso
3. **No requiere clave**: Solo existe una transformación válida

### Ejemplo

Para Σ = {'a', 'b', 'c', 'd', 'e'} (n = 5):

| Original | Índice | Complemento | Resultado |
|----------|--------|-------------|----------|
| a        | 0      | 5-1-0 = 4   | e        |
| b        | 1      | 5-1-1 = 3   | d        |
| c        | 2      | 5-1-2 = 2   | c        |
| d        | 3      | 5-1-3 = 1   | b        |
| e        | 4      | 5-1-4 = 0   | a        |

**Cifrado/Descifrado**: "abcde" → "edcba"

### Característica del Espejo

```
Posición:     0   1   2   3   4
Alfabeto:     a   b   c   d   e
                ↘ ↙ ↘ ↙ ↘
Espejo:       e   d   c   b   a
```

---

## 4. Análisis de Frecuencia de Al-Kindi

### Contexto Histórico

**Abu Yusuf al-Kindi** (801-873 d.C.), filósofo y científico árabe, escribió el tratado "Manuscrito sobre la desciframiento de mensajes criptográficos" (*Risāla fī Istikhrāj al‑Muʿamma*). Este es considerado el primer texto conocido sobre criptoanálisis estadístico.

### Principio Fundamental

**Observación de Al-Kindi**: En cualquier idioma, algunas letras aparecen con mayor frecuencia que otras. Esta distribución es relativamente estable en textos suficientemente largos.

### Modelo para Español

La frecuencia de letras en español (basada en estudios de corpus) es:

| Letra | Frecuencia (%) |
|-------|----------------|
| E     | 13.72          |
| A     | 12.53          |
| O     | 8.68           |
| S     | 7.98           |
| R     | 6.87           |
| L     | 5.24           |
| N     | 5.11           |
| I     | 4.78           |
| D     | 4.67           |
| C     | 4.52           |
| ...   | ...            |

### Frecuencia Observada

Dado un texto cifrado, calculamos las frecuencias observadas:

```
f_obs(x) = conteo(x) / total_caracteres_validos
```

donde:
- **x** = carácter en Σ
- **conteo(x)** = número de veces que aparece x en el texto
- **total_caracteres_validos** = número de caracteres en Σ presentes en el texto

### Distribución para César vs Atbash

**César**: La distribución de frecuencias se desplaza pero mantiene la forma:
```
f_cesar(cᵢ) = f_plano(c_{(i-k) mod n})
```

**Atbash**: La distribución se invierte:
```
f_atbash(cᵢ) = f_plano(c_{n-1-i})
```

Esta diferencia permite distinguir entre ambos métodos.

### Aplicación al Descifrado Automático

1. **Calcular frecuencias observadas** en el texto cifrado
2. **Generar candidatos** para César (cada posible desplazamiento)
3. **Evaluar cada candidato** usando chi-cuadrado contra distribución esperada
4. **Seleccionar candidato** con menor diferencia

---

## 5. Chi-Cuadrado

### Definición

El test chi-cuadrado (χ²) mide la diferencia entre frecuencias observadas y esperadas:

```
χ² = Σ [(f_obs(i) - f_exp(i))² / f_exp(i)]
```

donde:
- **f_obs(i)** = frecuencia observada del carácter i
- **f_exp(i)** = frecuencia esperada del carácter i (basada en modelo del idioma)

### Interpretación

- **χ² = 0**: Frecuencias perfectamente coincidentes
- **χ² pequeño**: Alta similitud (buen candidato)
- **χ² grande**: Baja similitud (mal candidato)

### Ejemplo de Cálculo

Para Σ = {'a', 'b', 'c'}:

| Carácter | Observado | Esperado | Diferencia | (O-E)²/E |
|----------|-----------|----------|------------|----------|
| a        | 0.30      | 0.27     | 0.03       | 0.003    |
| b        | 0.25      | 0.27     | -0.02      | 0.001    |
| c        | 0.45      | 0.46     | -0.01      | 0.000    |

```
χ² = 0.003 + 0.001 + 0.000 = 0.004
```

### Uso en Detección de César

```
Para cada desplazamiento k (0 a n-1):
    1. Calcular χ² entre f_obs y f_exp desplazada
    2. Seleccionar k con mínimo χ²
    
k_óptimo = argmin_k (χ²(k))
```

---

## 6. Generación de Candidatos

### Generación de Candidatos César

```
candidatos_Cesar = []

Para k desde 0 hasta n-1:
    candidato = descifrar_Cesar(texto_cifrado, k)
    score = evaluar_calidad(candidato)
    candidatos_Cesar.agregar({texto: candidato, k: k, score: score})

Retornar candidatos_Cesar ordenados por score descendente
```

### Generación de Candidatos Atbash

Para Atbash, solo existe un candidato válido (el algoritmo es simétrico):

```
candidato_Atbash = descifrar_Atbash(texto_cifrado)
score = evaluar_calidad(candidato_Atbash)
```

### Evaluación de Calidad Lingüística

La función `evaluar_calidad` usa el sistema de puntuación descrito en la siguiente sección.

### Selección Inicial

Para textos cortos (< 50 caracteres), se pueden reducir los candidatos a los 10 mejores para cada método antes de la evaluación final.

---

## 7. Sistema de Puntuación Lingüística

### Componentes del Score

El score final se calcula combinando múltiples métricas:

```
score_final = α × score_palabras + β × score_bigramas + γ × score_trigramas
```

donde α, β, γ son pesos empirically determinados.

### A. Score de Palabras Comunes

**Conjunto base**: Lista de palabras frecuentes en español (artículos, preposiciones, verbos comunes, etc.)

```
palabras_comunes = {
    "el", "la", "los", "las", "de", "en", "un", "una", "y", "a",
    "es", "son", "está", "están", "como", "para", "por", "que",
    "con", "del", "al", "se", "lo", "mas", "pero", "su", "si",
    "me", "ya", "te", "ti", "mi", "nos", "os", "le", "les",
    "yo", "tu", "el", "ella", "nosotros", "ellos", "ellas",
    ...
}
```

**Cálculo**:
```
score_palabras = (palabras_encontradas / total_palabras) × 100
```

### B. Score de Bigramas

**Bigramas comunes en español**:
- "de", "en", "el", "la", "lo", "que", "es", "er", "ión", "ad"

```
score_bigramas = (bigramas_válidos / total_bigramas) × 100
```

### C. Score de Trigramas

**Trigramas comunes en español**:
- "que", "del", "con", "las", "los", "por", "est", "ión", "ado", "ent"

```
score_trigramas = (trigramas_válidos / total_trigramas) × 100
```

### D. Bonus por Longitud

```
si longitud > 100:
    bonus = 0.1
sino si longitud > 50:
    bonus = 0.05
sino:
    bonus = 0
```

### E. Penalización por Caracteres Inválidos

```
si contiene_caracteres_invalidos:
    penalty = 0.2
```

### Fórmula Final

```
score_total = score_final + bonus - penalty
```

---

## 8. Selección Automática del Resultado

### Algoritmo de Selección

```
función seleccionar_resultado(candidatos_Cesar, candidato_Atbash):
    
    # Encontrar mejor candidato César
    mejor_Cesar = max(candidatos_Cesar, key=lambda c: c.score)
    
    # Asignar peso adicional a César si hay many candidatos cerca
    if count_close_scores(candidatos_Cesar, mejor_Cesar.score, threshold=0.05) > 3:
        # César tiene alta confianza
        return mejor_Cesar
    
    # Si Atbash tiene score comparable
    if abs(mejor_Cesar.score - candidato_Atbash.score) < threshold:
        # Usar chi-cuadrado para desempate
        if candidato_Atbash.chi_squared < mejor_Cesar.chi_squared:
            return candidato_Atbash
        else:
            return mejor_Cesar
    
    # Seleccionar el de mayor score
    if mejor_Cesar.score >= candidato_Atbash.score:
        return mejor_Cesar
    else:
        return candidato_Atbash
```

### Criterio de Terminación

El sistema siempre devuelve exactamente **una** línea descifrada:

```
resultado = seleccionar_mejor_candidato()
mostrar(resultado.texto)
mostrar(f"Método: {resultado.método}")
mostrar(f"Desplazamiento: {resultado.parámetros}")
```

### Manejo de Textos Cortos

Para textos con menos de 10 caracteres, el análisis estadístico es menos confiable:

```
si longitud < 10:
    # Usar heurísticas adicionales
    # 1. Verificar si todas las letras son del conjunto
    # 2. Verificar patrones comunes
    # 3. Si hay ambigüedad, mostrar ambos candidatos con advertencia
```

### Manejo de Textos Muy Largos

```
si longitud > 1000:
    # Dividir en bloques para análisis
    # Analizar cada bloque independientemente
    # Combinar resultados usando voting
```

---

## Referencias Bibliográficas

### Fuentes Primarias

1. **Al-Kindi, Abu Yusuf Ya'qub ibn Ishaq al-Sabbah**
   - *Risāla fī Istikhrāj al‑Muʿamma* (Manuscrito sobre la desciframiento de mensajes criptográficos)
   - Escrito: Siglo IX d.C.
   - Nota: El manuscrito original está en la Biblioteca de los Manuscritos de Estambul (ms. nr. 4831)
   - **⚠️ IMPORTANTE**: La fuente original requiere verificación. Buscar en archivos históricos árabes para confirmar atribución exacta.

### Fuentes Secundarias (Para Verificación)

2. **Kahn, David** - *The Codebreakers: The Story of Secret Writing* (1967)
   - Macmillan, Nueva York
   - Capítulo sobre Al-Kindi y orígenes del criptoanálisis

3. **Singh, Simon** - *The Code Book* (1999)
   - Anchor Books, Nueva York
   - Explicación accesible del análisis de frecuencia

4. **Alvarez, G. et al.** - "A cryptanalysis of the classical cipher" (para frecuencias del español)
   - Journal of the American Society for Information Science and Technology

### Notas sobre Verificación Académica

⚠️ **Advertencia metodológica**: 
- La atribución del manuscrito a Al-Kindi ha sido debatida por historiadores de la ciencia
- Se recomienda verificar en fuentes primarias árabes antes de citar en la bibliografía final
- Para la introducción, usar fuentes secundarias verificables (Kahn, Singh) como respaldo

---
*Documento técnico-algorítmico. Para arquitectura, consulte ARCHITECTURE.md. Para seguridad, consulte SECURITY.md.*