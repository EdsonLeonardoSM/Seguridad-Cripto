/**
 * Motor Criptografico - Cesar y Atbash
 * Seguridad en Sistemas de Computo I - Fase 3
 */

// [XTZ-01]
const App = {
    alphabet: '',
    shift: 3,
    operationMode: 'encrypt',

DEFAULT_ALPHABET: 'abcdefghijklmnopqrstuvwxyz',
    PRESET_ALPHABETS: {
        basic: 'abcdefghijklmnopqrstuvwxyz',
        extended: 'abcdefghijklmnopqrstuvwxyzáéíóúüñ',
        ascii: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        ascii7: (() => {
            let s = '';
            for (let i = 32; i <= 126; i++) {
                s += String.fromCharCode(i);
            }
                return s;
            })(),

            custom: ''
        },

    spanishFreq: {},
    spanishBigrams: {},
    spanishTrigrams: {},
    commonWords: []
};

/**
 * DATOS ESTADISTICOS ESPANOL
 * Fuente: Requiere verificacion para bibliografia final
 */

// [XTZ-02]
App.spanishFreq = {
    a: 0.1253, b: 0.0142, c: 0.0455, d: 0.0513, e: 0.1372,
    f: 0.0069, g: 0.0117, h: 0.0074, i: 0.0481, j: 0.0045,
    k: 0.0001, l: 0.0524, m: 0.0332, n: 0.0704, o: 0.0868,
    p: 0.0251, q: 0.0103, r: 0.0687, s: 0.0798, t: 0.0420,
    u: 0.0241, v: 0.0128, w: 0.0039, x: 0.0012, y: 0.0108, z: 0.0017
};

// [XTZ-03]
App.spanishBigrams = {
    'de': 3.15, 'la': 2.52, 'el': 2.47, 'en': 1.45, 'qu': 2.09,
    'ue': 1.88, 'ar': 1.26, 'es': 0.98, 'er': 0.95, 're': 0.84,
    'on': 1.14, 'ad': 1.05, 'ro': 0.92, 'te': 0.90, 'os': 0.86,
    'as': 0.81, 'co': 0.75, 'nd': 0.71, 'al': 0.67, 'ac': 0.69
};

// [XTZ-04]
App.spanishTrigrams = {
    'que': 0.87, 'los': 0.73, 'las': 0.69, 'del': 0.62, 'ion': 0.55,
    'ent': 0.50, 'ada': 0.57, 'ado': 0.51, 'cia': 0.47, 'ico': 0.45
};

// [XTZ-05]
App.commonWords = [
    'de','la','que','el','en','y','a','los','del','se','las','un','por',
    'una','para','con','no','su','al','es','lo','como','mas','pero','sus',
    'le','ya','o','fue','ha','si','algo','mucho','cuando','esta','el','la'
];

/* ALFABETO */
// [XTZ-06]
function setAlphabet(alphabet) {
    const validation = validateAlphabet(alphabet);
    if (!validation.valid) {
        displayAlphabetErrors(validation.errors);
        return false;
    }
    App.alphabet = alphabet;
    displayAlphabet(alphabet);
    hideAlphabetErrors();
    updateStatus();
    return true;
}

function validateAlphabet(alphabet) {
    const errors = [];
    const chars = [...alphabet];
    if (!alphabet || chars.length === 0) {
        errors.push('El alfabeto no puede estar vacio');
        return { valid: false, errors };
    }
    if (chars.length === 1) {
        errors.push('El alfabeto debe tener al menos 2 caracteres');
    }
    const seen = new Set();
    const duplicates = [];
    for (const char of chars) {
        if (seen.has(char)) {
            if (!duplicates.includes(char)) duplicates.push(char);
        } else {
            seen.add(char);
        }
    }
    if (duplicates.length > 0) {
        errors.push('Caracteres duplicados: ' + duplicates.join(', '));
    }
    return { valid: errors.length === 0, errors };
}

function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function getAlphabetLength(alphabet) {
    return [...alphabet].length;
}

function displayAlphabet(alphabet) {
    const display = document.getElementById('alphabetDisplay');
    const stats = document.getElementById('alphabetStats');
    const lengthSpan = document.getElementById('alphabetLength');
    if (!alphabet) {
        display.innerHTML = '<em>Sin definir</em>';
        stats.innerHTML = '';
        lengthSpan.textContent = 'Alfabeto: 0 caracteres';
        return;
    }
    let html = '';
    for (const char of alphabet) {
        html += '<span class="char">' + escapeHtml(char) + '</span>';
    }
    display.innerHTML = html;
    stats.innerHTML = '<span>Longitud: ' + getAlphabetLength(alphabet) + '</span>';
    lengthSpan.textContent = 'Alfabeto: ' + getAlphabetLength(alphabet) + ' caracteres';
}

function displayAlphabetErrors(errors) {
    const errorDiv = document.getElementById('alphabetErrors');
    const errorList = document.getElementById('alphabetErrorList');
    errorList.innerHTML = errors.map(e => '<li>' + escapeHtml(e) + '</li>').join('');
    errorDiv.classList.remove('hidden');
}

function hideAlphabetErrors() {
    document.getElementById('alphabetErrors').classList.add('hidden');
}

/* GRUPOS POR MAYUSCULAS/MINUSCULAS (fix Atbash 52 chars) */
function getAlphabetGroups(alphabet) {
    const chars = [...alphabet];
    return {
        upper: chars.filter(c => c >= 'A' && c <= 'Z'),
        lower: chars.filter(c => c >= 'a' && c <= 'z'),
        digits: chars.filter(c => c >= '0' && c <= '9')
    };
}

function useGroupedMode(alphabet, groups) {
    // Solo agrupar cuando el alfabeto es puramente alfanumerico ASCII
    // (preserva A<->Z, a<->z por separado para el preset ASCII).
    // Con alfabetos de simbolos/Unicode que contienen letras ASCII,
    // agrupar rompe el cifrado: las letras usarian un anillo de 26
    // mientras los simbolos usan el anillo completo, y el descifrado
    // automatico solo probaria 26 desplazamientos en vez de N.
    if (!(groups.upper.length > 0 && groups.lower.length > 0)) return false;
    const chars = [...alphabet];
    return chars.every(c =>
        (c >= 'A' && c <= 'Z') ||
        (c >= 'a' && c <= 'z') ||
        (c >= '0' && c <= '9')
    );
}

function caesarShiftInGroup(char, shift, group) {
    const n = group.length;
    const idx = group.indexOf(char);
    let newIdx = (idx + shift) % n;
    while (newIdx < 0) newIdx += n;
    return group[newIdx];
}

/* CIFRADO CESAR */
// [XTZ-07]
function caesarEncrypt(text, shift, alphabet) {
    const chars = [...alphabet];
    const n = chars.length;
    if (n === 0) return { result: text, errors: ['Alfabeto vacio'], charsTransformed: 0 };
    const groups = getAlphabetGroups(alphabet);
    const grouped = useGroupedMode(alphabet, groups);
    let transformed = '';
    let charsTransformed = 0;
    for (const char of text) {
        let done = false;
        if (grouped) {
            if (groups.upper.includes(char)) {
                transformed += caesarShiftInGroup(char, shift, groups.upper);
                done = true;
            } else if (groups.lower.includes(char)) {
                transformed += caesarShiftInGroup(char, shift, groups.lower);
                done = true;
            } else if (groups.digits.length > 1 && groups.digits.includes(char)) {
                transformed += caesarShiftInGroup(char, shift, groups.digits);
                done = true;
            }
        }
        if (!done) {
            const idx = chars.indexOf(char);
            if (idx !== -1) {
                let newIdx = idx + shift;
                while (newIdx < 0) newIdx += n;
                newIdx = newIdx % n;
                transformed += chars[newIdx];
            } else {
                transformed += char;
                continue;
            }
        }
        charsTransformed++;
    }
    return { result: transformed, charsTransformed, errors: [] };
}

// [XTZ-08]
function caesarDecrypt(text, shift, alphabet) {
    return caesarEncrypt(text, -shift, alphabet);
}

/* CIFRADO ATBASH */
// [XTZ-09]
function atbashEncrypt(text, alphabet) {
    const chars = [...alphabet];
    const n = chars.length;
    if (n === 0) return { result: text, errors: ['Alfabeto vacio'], charsTransformed: 0 };
    const groups = getAlphabetGroups(alphabet);
    const grouped = useGroupedMode(alphabet, groups);
    let transformed = '';
    let charsTransformed = 0;
    for (const char of text) {
        let done = false;
        if (grouped) {
            if (groups.upper.includes(char)) {
                transformed += groups.upper[groups.upper.length - 1 - groups.upper.indexOf(char)];
                done = true;
            } else if (groups.lower.includes(char)) {
                transformed += groups.lower[groups.lower.length - 1 - groups.lower.indexOf(char)];
                done = true;
            } else if (groups.digits.length > 1 && groups.digits.includes(char)) {
                transformed += groups.digits[groups.digits.length - 1 - groups.digits.indexOf(char)];
                done = true;
            }
        }
        if (!done) {
            const idx = chars.indexOf(char);
            if (idx !== -1) {
                const mirrorIdx = n - 1 - idx;
                transformed += chars[mirrorIdx];
            } else {
                transformed += char;
                continue;
            }
        }
        charsTransformed++;
    }
    return { result: transformed, charsTransformed, errors: [] };
}

// [XTZ-09]
function atbashDecrypt(text, alphabet) {
    return atbashEncrypt(text, alphabet);
}

/* UTILIDADES */
function getSelectedMethod() {
    const radios = document.getElementsByName('cipherMethod');
    for (const radio of radios) {
        if (radio.checked) return radio.value;
    }
    return 'cesar';
}

function getShift() {
    const input = document.getElementById('shiftInput');
    let shift = parseInt(input.value, 10);
    return isNaN(shift) ? 0 : shift;
}

function setShift(shift) {
    document.getElementById('shiftInput').value = shift;
    App.shift = shift;
}

// [XTZ-11]
function normalizeShift(shift, alphabetLength) {
    if (alphabetLength === 0) return 0;
    let normalized = shift % alphabetLength;
    if (normalized < 0) normalized += alphabetLength;
    return normalized;
}

/* ANALISIS DE FRECUENCIA (AL-KINDI) */
// [XTZ-12]
function calculateFrequencies(text, alphabet) {
    const freq = {};
    let total = 0;
    const alphaSet = new Set([...alphabet]);
    for (const char of alphaSet) freq[char] = 0;
    for (const char of text) {
        if (alphaSet.has(char)) {
            freq[char]++;
            total++;
        }
    }
    for (const char in freq) {
        freq[char] = total > 0 ? freq[char] / total : 0;
    }
    return { freq, total };
}

// [XTZ-13]
function chiSquared(observedFreq, expectedFreq, alphabet) {
    let sum = 0;
    for (const char of alphabet) {
        const obs = observedFreq[char] || 0;
        const exp = expectedFreq[char] || 0;
        if (exp > 0) {
            sum += Math.pow(obs - exp, 2) / exp;
        } else if (obs > 0) {
            sum += 1;
        }
    }
    return sum;
}

/* ANALISIS LINGUISTICO */
// [XTZ-14]
function countBigrams(text, bigrams) {
    let count = 0;
    const lower = text.toLowerCase();
    for (let i = 0; i < lower.length - 1; i++) {
        const bigram = lower.substring(i, i + 2);
        if (bigrams[bigram]) count += bigrams[bigram];
    }
    return count;
}

// [XTZ-14]
function countTrigrams(text, trigrams) {
    let count = 0;
    const lower = text.toLowerCase();
    for (let i = 0; i < lower.length - 2; i++) {
        const trigram = lower.substring(i, i + 3);
        if (trigrams[trigram]) count += trigrams[trigram];
    }
    return count;
}

// [XTZ-14]
function countCommonWords(text, commonWords) {
    let count = 0;
    const lower = text.toLowerCase();
    for (const word of commonWords) {
        const regex = new RegExp('\\b' + word + '\\b', 'gi');
        const matches = lower.match(regex);
        if (matches) count += matches.length;
    }
    return count;
}

// [XTZ-15]
function calculateLinguisticScore(text, alphabet) {
    const bigramScore = countBigrams(text, App.spanishBigrams);
    const trigramScore = countTrigrams(text, App.spanishTrigrams);
    const wordScore = countCommonWords(text, App.commonWords);
    return {
        bigramScore,
        trigramScore,
        wordScore,
        total: bigramScore * 0.3 + trigramScore * 0.2 + wordScore * 0.5
    };
}

/* PUNTUACION COMBINADA */
// [XTZ-16]
function combinedScore(candidate, alphabet) {
    // Score insensible a mayusculas: baja todo a minusculas para comparar con spanishFreq
    const lowerText = candidate.text.toLowerCase();
    const lowerAlphabet = [...new Set([...alphabet].map(c => c.toLowerCase()))].join('');
    const { freq: observedFreq } = calculateFrequencies(lowerText, lowerAlphabet);
    const chiSq = chiSquared(observedFreq, App.spanishFreq, lowerAlphabet);
    const freqScore = 1 / (1 + chiSq);
    const lingScore = calculateLinguisticScore(candidate.text, alphabet);
    const normalizedLing = Math.min(lingScore.total / 10, 1);
    const combined = 0.4 * freqScore + 0.6 * normalizedLing;
    return {
        chiSquared: chiSq,
        freqScore: freqScore,
        lingScore: lingScore,
        combined: combined
    };
}

/* DESCRIFRADO AUTOMATICO */
// [XTZ-17]
function generateCesarCandidates(ciphertext, alphabet) {
    const candidates = [];
    // Probar los n desplazamientos (0 a n-1). En modo agrupado el cifrado
    // normaliza el shift con la longitud total (normalizeShift), asi que el
    // desplazamiento efectivo siempre esta en este rango; generar menos
    // candidatos (p. ej. solo 26) pierde shifts como 30 con digitos.
    const n = getAlphabetLength(alphabet);
    for (let shift = 0; shift < n; shift++) {
        const decrypted = caesarDecrypt(ciphertext, shift, alphabet);
        candidates.push({
            text: decrypted.result,
            method: 'cesar',
            shift: shift,
            charsTransformed: decrypted.charsTransformed
        });
    }
    return candidates;
}

// [XTZ-20]
function generateAtbashCandidate(ciphertext, alphabet) {
    const decrypted = atbashDecrypt(ciphertext, alphabet);
    return {
        text: decrypted.result,
        method: 'atbash',
        shift: null,
        charsTransformed: decrypted.charsTransformed
    };
}

// [XTZ-18]
function detectAmbiguity(candidates) {
    if (candidates.length < 2) return { ambiguous: false, gap: 0 };
    const top2 = candidates.slice(0, 2);
    const score1 = top2[0].score.combined;
    const score2 = top2[1].score.combined;
    const gap = Math.abs(score1 - score2);
    const avgScore = (score1 + score2) / 2;
    const relativeGap = avgScore > 0 ? gap / avgScore : gap;
    return {
        ambiguous: relativeGap < 0.05,
        gap: relativeGap,
        topScores: [score1, score2]
    };
}

// [XTZ-19]
function autoDecrypt(ciphertext, alphabet) {
    const candidates = [];
    const cesarCandidates = generateCesarCandidates(ciphertext, alphabet);
    for (const c of cesarCandidates) {
        c.score = combinedScore(c, alphabet);
        candidates.push(c);
    }
    const atbashCandidate = generateAtbashCandidate(ciphertext, alphabet);
    atbashCandidate.score = combinedScore(atbashCandidate, alphabet);
    candidates.push(atbashCandidate);
    candidates.sort((a, b) => b.score.combined - a.score.combined);
    const ambiguity = detectAmbiguity(candidates);
    const winner = candidates[0];
    return {
        winner: winner,
        allCandidates: candidates,
        ambiguity: ambiguity,
        isAmbiguous: ambiguity.ambiguous
    };
}

/* PROCESAMIENTO */
// [XTZ-21]
function processText() {
    const text = document.getElementById('inputText').value;
    const alphabet = App.alphabet;
    const mode = getOperationMode();
    if (!alphabet) {
        showError('Define un alfabeto primero');
        return;
    }
    if (!text) {
        showError('Ingresa texto para procesar');
        return;
    }
    let result, info = '';
    if (mode === 'encrypt') {
        const method = getSelectedMethod();
        const shift = normalizeShift(getShift(), getAlphabetLength(alphabet));
        if (method === 'cesar') {
            result = caesarEncrypt(text, shift, alphabet);
            info = 'Cifrado Cesar con desplazamiento: ' + shift;
        } else {
            result = atbashEncrypt(text, alphabet);
            info = 'Cifrado Atbash';
        }
        info += '<br>Alfabeto: ' + getAlphabetLength(alphabet) + ' caracteres';
        info += '<br>Transformados: ' + result.charsTransformed;
    } else if (mode === 'decrypt') {
        const method = getSelectedMethod();
        const shift = normalizeShift(getShift(), getAlphabetLength(alphabet));
        if (method === 'cesar') {
            result = caesarDecrypt(text, shift, alphabet);
            info = 'Descifrado Cesar con desplazamiento: ' + shift;
        } else {
            result = atbashDecrypt(text, alphabet);
            info = 'Descifrado Atbash (simetrico)';
        }
        info += '<br>Alfabeto: ' + getAlphabetLength(alphabet) + ' caracteres';
        info += '<br>Transformados: ' + result.charsTransformed;
    } else {
        const autoResult = autoDecrypt(text, alphabet);
        if (autoResult.isAmbiguous) {
            displayResult(autoResult.winner.text);
            info = '<strong>ADVERTENCIA: Ambiguedad detectada</strong><br>';
            info += 'Metodo: ' + (autoResult.winner.method === 'cesar' ? 'Cesar' : 'Atbash');
            if (autoResult.winner.shift !== null) info += ' (desplazamiento: ' + autoResult.winner.shift + ')';
            info += '<br><br>Diferencia: ' + (autoResult.ambiguity.gap * 100).toFixed(1) + '%';
            info += '<br>Score ganador: ' + (autoResult.winner.score.combined * 100).toFixed(1) + '%';
            info += '<br><br>No hay suficiente evidencia para afirmar que esta es la solucion correcta.';
        } else {
            displayResult(autoResult.winner.text);
            info = '<strong>Metodo detectado:</strong> ' + (autoResult.winner.method === 'cesar' ? 'Cesar' : 'Atbash');
            if (autoResult.winner.shift !== null) info += ' (desplazamiento: ' + autoResult.winner.shift + ')';
            info += '<br><strong>Puntuacion:</strong> ' + (autoResult.winner.score.combined * 100).toFixed(1) + '%';
            info += '<br><strong>Analisis:</strong>';
            info += '<br>- Chi-cuadrado: ' + autoResult.winner.score.chiSquared.toFixed(3);
            info += '<br>- Bigramas: ' + autoResult.winner.score.lingScore.bigramScore.toFixed(1);
            info += '<br>- Palabras comunes: ' + autoResult.winner.score.lingScore.wordScore;
        }
        displayProcessInfo(info);
        return;
    }
    displayResult(result.result);
    displayProcessInfo(info);
}

function displayResult(text) {
    const output = document.getElementById('outputText');
    output.textContent = text || '(vacio)';
    output.classList.add('has-result');
}

function displayProcessInfo(info) {
    document.getElementById('processInfo').innerHTML = info;
}

function showError(message) {
    const output = document.getElementById('outputText');
    output.textContent = 'Error: ' + message;
    output.classList.remove('has-result');
}

function clearAll() {
    document.getElementById('inputText').value = '';
    document.getElementById('outputText').textContent = 'El resultado aparecera aqui...';
    document.getElementById('outputText').classList.remove('has-result');
    document.getElementById('processInfo').innerHTML = 'Sin informacion disponible';
}

function copyResult() {
    const text = document.getElementById('outputText').textContent;
    if (text && !text.startsWith('Error') && !text.startsWith('El resultado')) {
        navigator.clipboard.writeText(text).then(() => {
            const label = document.getElementById('copyBtnLabel');
            if (label) {
                const original = label.textContent;
                label.textContent = 'Copiado!';
                setTimeout(() => { label.textContent = original; }, 1500);
            }
        }).catch(() => {});
    }
}

function updateStatus() {
    const statusText = document.getElementById('statusText');
    const statusDot = document.getElementById('statusDot');
    if (App.alphabet) {
        statusText.textContent = 'Motor listo - ' + getAlphabetLength(App.alphabet) + ' caracteres';
        statusDot.classList.add('active');
    } else {
        statusText.textContent = 'Definiendo alfabeto...';
        statusDot.classList.remove('active');
    }
}

// [XTZ-23]
function getOperationMode() {
    const radios = document.getElementsByName('operationMode');
    for (const radio of radios) {
        if (radio.checked) return radio.value;
    }
    return 'encrypt';
}

// [XTZ-24]
function updateModeUI() {
    const mode = getOperationMode();
    const manualConfigCard = document.getElementById('manualConfigCard');
    const autoNotice = document.getElementById('autoNotice');
    const processBtnText = document.getElementById('processBtnText');
    const modeText = document.getElementById('modeText');
    document.querySelectorAll('.mode-option').forEach(opt => opt.classList.remove('selected'));
    const modeEl = document.getElementById('mode' + mode.charAt(0).toUpperCase() + mode.slice(1));
    if (modeEl) modeEl.classList.add('selected');
    if (mode === 'encrypt' || mode === 'decrypt') {
        manualConfigCard.classList.remove('manual-config-hidden');
        autoNotice.classList.add('hidden');
        modeText.textContent = 'Modo: ' + (mode === 'encrypt' ? 'Cifrar' : 'Descifrar');
        processBtnText.textContent = 'Procesar';
    } else {
        manualConfigCard.classList.add('manual-config-hidden');
        autoNotice.classList.remove('hidden');
        modeText.textContent = 'Modo: Automatico';
        processBtnText.textContent = 'Descifrar automaticamente';
    }
    App.operationMode = mode;
}

// [XTZ-25]
function updateMethodUI() {
    const method = getSelectedMethod();
    document.getElementById('cesarOptions').classList.toggle('hidden', method !== 'cesar');
    document.getElementById('atbashInfo').classList.toggle('hidden', method !== 'atbash');
    document.getElementById('cesarOption').classList.toggle('selected', method === 'cesar');
    document.getElementById('atbashOption').classList.toggle('selected', method === 'atbash');
}

/* PRUEBAS */
// [XTZ-22]
const TestEngine = {
    results: [],
    reset() { this.results = []; },
    log(msg, type) { this.results.push({ message: msg, type }); },
    assert(cond, name) {
        const pass = cond === true;
        this.log((pass ? '✓' : '✗') + ' ' + name, pass ? 'pass' : 'fail');
        return pass;
    },
    assertEq(actual, expected, name) {
        const pass = actual === expected;
        this.log((pass ? '✓' : '✗') + ' ' + name, pass ? 'pass' : 'fail');
        if (!pass) this.log('  Esperado: "' + expected + '", Obtenido: "' + actual + '"', 'fail');
        return pass;
    },
    getReport() {
        const pass = this.results.filter(r => r.type === 'pass').length;
        const fail = this.results.filter(r => r.type === 'fail').length;
        const total = pass + fail;
        let report = 'INFORME DE PRUEBAS\n==================\n\n';
        for (const r of this.results) {
            const icon = r.type === 'pass' ? '✓' : r.type === 'fail' ? '✗' : '→';
            report += icon + ' ' + r.message + '\n';
        }
        report += '\n==================\n';
        report += 'RESUMEN: ' + pass + '/' + total + ' pruebas pasaron';
        if (fail > 0) report += ' (' + fail + ' fallidas)';
        report += '\n==================\n';
        return report;
    }
};

function runTestCesarBasic() {
    TestEngine.reset();
    TestEngine.log('PRUEBA: Cesar basico', 'info');
    const alpha = 'abcdefghijklmnopqrstuvwxyz';
    const enc = caesarEncrypt('abc', 3, alpha);
    TestEngine.assertEq(enc.result, 'def', 'abc + 3 = def');
    return TestEngine.getReport();
}

function runTestCesarWrap() {
    TestEngine.reset();
    TestEngine.log('PRUEBA: Cesar wrap-around', 'info');
    const alpha = 'abcdefghijklmnopqrstuvwxyz';
    TestEngine.assertEq(caesarEncrypt('xyz', 3, alpha).result, 'abc', 'xyz + 3 = abc');
    TestEngine.assertEq(caesarEncrypt('abc', -1, alpha).result, 'zab', 'abc - 1 = zab');
    return TestEngine.getReport();
}

function runTestAtbashBasic() {
    TestEngine.reset();
    TestEngine.log('PRUEBA: Atbash basico', 'info');
    const alpha = 'abcde';
    TestEngine.assertEq(atbashEncrypt('abcde', alpha).result, 'edcba', 'abcde -> edcba');
    return TestEngine.getReport();
}

function runTestRoundTrip() {
    TestEngine.reset();
    TestEngine.log('PRUEBA: Round-trip', 'info');
    const alpha = 'abcdefghijklmnopqrstuvwxyz';
    const text = 'hola mundo';
    const enc = caesarEncrypt(text, 5, alpha).result;
    const dec = caesarDecrypt(enc, 5, alpha).result;
    TestEngine.assertEq(dec, text, 'Cesar round-trip');
    const atbash = atbashDecrypt(atbashEncrypt(text, alpha).result, alpha).result;
    TestEngine.assertEq(atbash, text, 'Atbash round-trip');
    return TestEngine.getReport();
}

function runTestAutoCesar() {
    TestEngine.reset();
    TestEngine.log('PRUEBA: Auto-deteccion Cesar', 'info');
    const alpha = 'abcdefghijklmnopqrstuvwxyz';
    const original = 'el murcielago coma mosca';
    const shift = 7;
    const cipher = caesarEncrypt(original, shift, alpha).result;
    const result = autoDecrypt(cipher, alpha);
    TestEngine.assert(!result.isAmbiguous, 'No es ambiguo');
    TestEngine.assertEq(result.winner.method, 'cesar', 'Detecta Cesar');
    TestEngine.assertEq(result.winner.shift, shift, 'Detecta desplazamiento ' + shift);
    TestEngine.assertEq(result.winner.text, original, 'Descifra correctamente');
    return TestEngine.getReport();
}

function runTestAutoAtbash() {
    TestEngine.reset();
    TestEngine.log('PRUEBA: Auto-deteccion Atbash', 'info');
    const alpha = 'abcdefghijklmnopqrstuvwxyz';
    const original = 'el murcielago coma mosca';
    const cipher = atbashEncrypt(original, alpha).result;
    const result = autoDecrypt(cipher, alpha);
    TestEngine.assert(!result.isAmbiguous, 'No es ambiguo');
    TestEngine.assertEq(result.winner.method, 'atbash', 'Detecta Atbash');
    TestEngine.assertEq(result.winner.text, original, 'Descifra correctamente');
    return TestEngine.getReport();
}

function runTestAutoEdge() {
    TestEngine.reset();
    TestEngine.log('PRUEBA: Casos difficiles', 'info');
    const alpha = 'abcdefghijklmnopqrstuvwxyz';
    const short = caesarEncrypt('h', 3, alpha).result;
    const shortResult = autoDecrypt(short, alpha);
    TestEngine.log('Texto corto "' + short + '" -> "' + shortResult.winner.text + '"', 'info');
    const random = 'xqzmvpfrt';
    const randomCipher = caesarEncrypt(random, 5, alpha).result;
    const randomResult = autoDecrypt(randomCipher, alpha);
    TestEngine.assert(randomResult.isAmbiguous || randomResult.winner.score.combined < 0.3, 'Texto aleatorio es ambiguo o baja puntuacion');
    return TestEngine.getReport();
}

function runTestAll() {
    const reports = [
        runTestCesarBasic(),
        runTestCesarWrap(),
        runTestAtbashBasic(),
        runTestRoundTrip(),
        runTestAutoCesar(),
        runTestAutoAtbash(),
        runTestAutoEdge()
    ];
    let final = '========== INFORME COMPLETO ==========\n\n';
    final += reports.join('\n');
    // Cada subprueba reinicia TestEngine, asi que el conteo real
    // se obtiene de los reportes generados, no del estado final.
    const pass = (final.match(/✓/g) || []).length;
    const fail = (final.match(/✗/g) || []).length;
    final += '\n========== TOTAL: ' + pass + '/' + (pass + fail) + ' pruebas pasaron ==========\n';
    return final;
}

function showTestOutput(report) {
    const output = document.getElementById('testOutput');
    output.textContent = report;
    output.classList.remove('hidden');
    output.scrollTop = output.scrollHeight;
}

/* INICIALIZACION */
// [XTZ-26]
function init() {
    document.getElementById('alphabetInput').value = App.DEFAULT_ALPHABET;
    setAlphabet(App.DEFAULT_ALPHABET);
    document.getElementById('setDefaultAlphabet').addEventListener('click', () => {
        document.getElementById('alphabetInput').value = App.PRESET_ALPHABETS.basic;
        setAlphabet(App.PRESET_ALPHABETS.basic);
    });
    document.getElementById('setExtendedAlphabet').addEventListener('click', () => {
        document.getElementById('alphabetInput').value = App.PRESET_ALPHABETS.extended;
        setAlphabet(App.PRESET_ALPHABETS.extended);
    });
    document.getElementById('setAsciiAlphabet').addEventListener('click', () => {
        document.getElementById('alphabetInput').value = App.PRESET_ALPHABETS.ascii;
        setAlphabet(App.PRESET_ALPHABETS.ascii);
    });
    document.getElementById('setAscii7Alphabet').addEventListener('click', () => {
        document.getElementById('alphabetInput').value = App.PRESET_ALPHABETS.ascii7;
        setAlphabet(App.PRESET_ALPHABETS.ascii7);
    });
    document.getElementById('alphabetInput').addEventListener('input', (e) => {
        if (!e.target.value) {
            App.alphabet = '';
            displayAlphabet('');
            displayAlphabetErrors(['El alfabeto no puede estar vacio']);
            updateStatus();
            return;
        }
        setAlphabet(e.target.value);
    });
    document.querySelectorAll('input[name="cipherMethod"]').forEach(r => r.addEventListener('change', updateMethodUI));
    document.querySelectorAll('input[name="operationMode"]').forEach(r => r.addEventListener('change', updateModeUI));
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => setShift(parseInt(btn.dataset.shift)));
    });
    document.getElementById('processBtn').addEventListener('click', processText);
    document.getElementById('clearBtn').addEventListener('click', clearAll);
    document.getElementById('copyBtn').addEventListener('click', copyResult);
    document.getElementById('testCesarBasic').addEventListener('click', () => showTestOutput(runTestCesarBasic()));
    document.getElementById('testCesarWrap').addEventListener('click', () => showTestOutput(runTestCesarWrap()));
    document.getElementById('testAtbashBasic').addEventListener('click', () => showTestOutput(runTestAtbashBasic()));
    document.getElementById('testRoundTrip').addEventListener('click', () => showTestOutput(runTestRoundTrip()));
    document.getElementById('testAutoCesar').addEventListener('click', () => showTestOutput(runTestAutoCesar()));
    document.getElementById('testAutoAtbash').addEventListener('click', () => showTestOutput(runTestAutoAtbash()));
    document.getElementById('testAutoEdge').addEventListener('click', () => showTestOutput(runTestAutoEdge()));
    document.getElementById('testAll').addEventListener('click', () => showTestOutput(runTestAll()));
    updateModeUI();
    updateMethodUI();
    updateStatus();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}