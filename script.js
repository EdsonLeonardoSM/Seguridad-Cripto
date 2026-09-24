
// [XTZ-01]
const Q0 = {
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


// [XTZ-02]
Q0.spanishFreq = {
    a: 0.1253, b: 0.0142, c: 0.0455, d: 0.0513, e: 0.1372,
    f: 0.0069, g: 0.0117, h: 0.0074, i: 0.0481, j: 0.0045,
    k: 0.0001, l: 0.0524, m: 0.0332, n: 0.0704, o: 0.0868,
    p: 0.0251, q: 0.0103, r: 0.0687, s: 0.0798, t: 0.0420,
    u: 0.0241, v: 0.0128, w: 0.0039, x: 0.0012, y: 0.0108, z: 0.0017
};

// [XTZ-03]
Q0.spanishBigrams = {
    'de': 3.15, 'la': 2.52, 'el': 2.47, 'en': 1.45, 'qu': 2.09,
    'ue': 1.88, 'ar': 1.26, 'es': 0.98, 'er': 0.95, 're': 0.84,
    'on': 1.14, 'ad': 1.05, 'ro': 0.92, 'te': 0.90, 'os': 0.86,
    'as': 0.81, 'co': 0.75, 'nd': 0.71, 'al': 0.67, 'ac': 0.69
};

// [XTZ-04]
Q0.spanishTrigrams = {
    'que': 0.87, 'los': 0.73, 'las': 0.69, 'del': 0.62, 'ion': 0.55,
    'ent': 0.50, 'ada': 0.57, 'ado': 0.51, 'cia': 0.47, 'ico': 0.45
};

// [XTZ-05]
Q0.commonWords = [
    'de','la','que','el','en','y','a','los','del','se','las','un','por',
    'una','para','con','no','su','al','es','lo','como','mas','pero','sus',
    'le','ya','o','fue','ha','si','algo','mucho','cuando','esta','el','la'
];

// [XTZ-06]
function x06(alphabet) {
    const validation = x06v(alphabet);
    if (!validation.valid) {
        dAE(validation.errors);
        return false;
    }
    Q0.alphabet = alphabet;
    dA(alphabet);
    dAH();
    dS();
    return true;
}

// [XTZ-06]
function x06v(alphabet) {
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

// [XTZ-06]
function eH(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// [XTZ-06]
function xN(alphabet) {
    return [...alphabet].length;
}

// [XTZ-06]
function dA(alphabet) {
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
        html += '<span class="char">' + eH(char) + '</span>';
    }
    display.innerHTML = html;
    stats.innerHTML = '<span>Longitud: ' + xN(alphabet) + '</span>';
    lengthSpan.textContent = 'Alfabeto: ' + xN(alphabet) + ' caracteres';
}

// [XTZ-06]
function dAE(errors) {
    const errorDiv = document.getElementById('alphabetErrors');
    const errorList = document.getElementById('alphabetErrorList');
    errorList.innerHTML = errors.map(e => '<li>' + eH(e) + '</li>').join('');
    errorDiv.classList.remove('hidden');
}

// [XTZ-06]
function dAH() {
    document.getElementById('alphabetErrors').classList.add('hidden');
}

// [XTZ-07/09]
function xG(alphabet) {
    const chars = [...alphabet];
    return {
        upper: chars.filter(c => c >= 'A' && c <= 'Z'),
        lower: chars.filter(c => c >= 'a' && c <= 'z'),
        digits: chars.filter(c => c >= '0' && c <= '9')
    };
}

// [XTZ-07/09]
function xGM(alphabet, groups) {
    if (!(groups.upper.length > 0 && groups.lower.length > 0)) return false;
    const chars = [...alphabet];
    return chars.every(c =>
        (c >= 'A' && c <= 'Z') ||
        (c >= 'a' && c <= 'z') ||
        (c >= '0' && c <= '9')
    );
}

// [XTZ-07]
function xSh(char, shift, group) {
    const n = group.length;
    const idx = group.indexOf(char);
    let newIdx = (idx + shift) % n;
    while (newIdx < 0) newIdx += n;
    return group[newIdx];
}

// [XTZ-07]
function x07(text, shift, alphabet) {
    const chars = [...alphabet];
    const n = chars.length;
    if (n === 0) return { result: text, errors: ['Alfabeto vacio'], charsTransformed: 0 };
    const groups = xG(alphabet);
    const grouped = xGM(alphabet, groups);
    let transformed = '';
    let charsTransformed = 0;
    for (const char of text) {
        let done = false;
        if (grouped) {
            if (groups.upper.includes(char)) {
                transformed += xSh(char, shift, groups.upper);
                done = true;
            } else if (groups.lower.includes(char)) {
                transformed += xSh(char, shift, groups.lower);
                done = true;
            } else if (groups.digits.length > 1 && groups.digits.includes(char)) {
                transformed += xSh(char, shift, groups.digits);
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
function x08(text, shift, alphabet) {
    return x07(text, -shift, alphabet);
}

// [XTZ-09]
function x09(text, alphabet) {
    const chars = [...alphabet];
    const n = chars.length;
    if (n === 0) return { result: text, errors: ['Alfabeto vacio'], charsTransformed: 0 };
    const groups = xG(alphabet);
    const grouped = xGM(alphabet, groups);
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
function x09i(text, alphabet) {
    return x09(text, alphabet);
}

// [XTZ-21/25]
function uM() {
    const radios = document.getElementsByName('cipherMethod');
    for (const radio of radios) {
        if (radio.checked) return radio.value;
    }
    return 'cesar';
}

// [XTZ-21]
function uS() {
    const input = document.getElementById('shiftInput');
    let shift = parseInt(input.value, 10);
    return isNaN(shift) ? 0 : shift;
}

// [XTZ-21]
function uSS(shift) {
    document.getElementById('shiftInput').value = shift;
    Q0.shift = shift;
}

// [XTZ-11]
function x11(shift, alphabetLength) {
    if (alphabetLength === 0) return 0;
    let normalized = shift % alphabetLength;
    if (normalized < 0) normalized += alphabetLength;
    return normalized;
}

// [XTZ-12]
function x12(text, alphabet) {
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
function x13(observedFreq, expectedFreq, alphabet) {
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

// [XTZ-14]
function x14b(text, bigrams) {
    let count = 0;
    const lower = text.toLowerCase();
    for (let i = 0; i < lower.length - 1; i++) {
        const bigram = lower.substring(i, i + 2);
        if (bigrams[bigram]) count += bigrams[bigram];
    }
    return count;
}

// [XTZ-14]
function x14t(text, trigrams) {
    let count = 0;
    const lower = text.toLowerCase();
    for (let i = 0; i < lower.length - 2; i++) {
        const trigram = lower.substring(i, i + 3);
        if (trigrams[trigram]) count += trigrams[trigram];
    }
    return count;
}

// [XTZ-14]
function x14w(text, commonWords) {
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
function x15(text, alphabet) {
    const bigramScore = x14b(text, Q0.spanishBigrams);
    const trigramScore = x14t(text, Q0.spanishTrigrams);
    const wordScore = x14w(text, Q0.commonWords);
    return {
        bigramScore,
        trigramScore,
        wordScore,
        total: bigramScore * 0.3 + trigramScore * 0.2 + wordScore * 0.5
    };
}

// [XTZ-16]
function x16(candidate, alphabet) {
    const lowerText = candidate.text.toLowerCase();
    const lowerAlphabet = [...new Set([...alphabet].map(c => c.toLowerCase()))].join('');
    const { freq: observedFreq } = x12(lowerText, lowerAlphabet);
    const chiSq = x13(observedFreq, Q0.spanishFreq, lowerAlphabet);
    const freqScore = 1 / (1 + chiSq);
    const lingScore = x15(candidate.text, alphabet);
    const normalizedLing = Math.min(lingScore.total / 10, 1);
    const combined = 0.4 * freqScore + 0.6 * normalizedLing;
    return {
        x13: chiSq,
        freqScore: freqScore,
        lingScore: lingScore,
        combined: combined
    };
}

// [XTZ-17]
function x17(ciphertext, alphabet) {
    const candidates = [];
    const n = xN(alphabet);
    for (let shift = 0; shift < n; shift++) {
        const decrypted = x08(ciphertext, shift, alphabet);
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
function x20(ciphertext, alphabet) {
    const decrypted = x09i(ciphertext, alphabet);
    return {
        text: decrypted.result,
        method: 'atbash',
        shift: null,
        charsTransformed: decrypted.charsTransformed
    };
}

// [XTZ-18]
function x18(candidates) {
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
function x19(ciphertext, alphabet) {
    const candidates = [];
    const cesarCandidates = x17(ciphertext, alphabet);
    for (const c of cesarCandidates) {
        c.score = x16(c, alphabet);
        candidates.push(c);
    }
    const atbashCandidate = x20(ciphertext, alphabet);
    atbashCandidate.score = x16(atbashCandidate, alphabet);
    candidates.push(atbashCandidate);
    candidates.sort((a, b) => b.score.combined - a.score.combined);
    const ambiguity = x18(candidates);
    const winner = candidates[0];
    return {
        winner: winner,
        allCandidates: candidates,
        ambiguity: ambiguity,
        isAmbiguous: ambiguity.ambiguous
    };
}

// [XTZ-21]
function x21() {
    const text = document.getElementById('inputText').value;
    const alphabet = Q0.alphabet;
    const mode = uO();
    if (!alphabet) {
        dE('Define un alfabeto primero');
        return;
    }
    if (!text) {
        dE('Ingresa texto para procesar');
        return;
    }
    let result, info = '';
    if (mode === 'encrypt') {
        const method = uM();
        const shift = x11(uS(), xN(alphabet));
        if (method === 'cesar') {
            result = x07(text, shift, alphabet);
            info = 'Cifrado Cesar con desplazamiento: ' + shift;
        } else {
            result = x09(text, alphabet);
            info = 'Cifrado Atbash';
        }
        info += '<br>Alfabeto: ' + xN(alphabet) + ' caracteres';
        info += '<br>Transformados: ' + result.charsTransformed;
    } else if (mode === 'decrypt') {
        const method = uM();
        const shift = x11(uS(), xN(alphabet));
        if (method === 'cesar') {
            result = x08(text, shift, alphabet);
            info = 'Descifrado Cesar con desplazamiento: ' + shift;
        } else {
            result = x09i(text, alphabet);
            info = 'Descifrado Atbash (simetrico)';
        }
        info += '<br>Alfabeto: ' + xN(alphabet) + ' caracteres';
        info += '<br>Transformados: ' + result.charsTransformed;
    } else {
        const autoResult = x19(text, alphabet);
        if (autoResult.isAmbiguous) {
            dR(autoResult.winner.text);
            info = '<strong>ADVERTENCIA: Ambiguedad detectada</strong><br>';
            info += 'Metodo: ' + (autoResult.winner.method === 'cesar' ? 'Cesar' : 'Atbash');
            if (autoResult.winner.shift !== null) info += ' (desplazamiento: ' + autoResult.winner.shift + ')';
            info += '<br><br>Diferencia: ' + (autoResult.ambiguity.gap * 100).toFixed(1) + '%';
            info += '<br>Score ganador: ' + (autoResult.winner.score.combined * 100).toFixed(1) + '%';
            info += '<br><br>No hay suficiente evidencia para afirmar que esta es la solucion correcta.';
        } else {
            dR(autoResult.winner.text);
            info = '<strong>Metodo detectado:</strong> ' + (autoResult.winner.method === 'cesar' ? 'Cesar' : 'Atbash');
            if (autoResult.winner.shift !== null) info += ' (desplazamiento: ' + autoResult.winner.shift + ')';
            info += '<br><strong>Puntuacion:</strong> ' + (autoResult.winner.score.combined * 100).toFixed(1) + '%';
            info += '<br><strong>Analisis:</strong>';
            info += '<br>- Chi-cuadrado: ' + autoResult.winner.score.x13.toFixed(3);
            info += '<br>- Bigramas: ' + autoResult.winner.score.lingScore.bigramScore.toFixed(1);
            info += '<br>- Palabras comunes: ' + autoResult.winner.score.lingScore.wordScore;
        }
        dI(info);
        return;
    }
    dR(result.result);
    dI(info);
}

// [XTZ-21]
function dR(text) {
    const output = document.getElementById('outputText');
    output.textContent = text || '(vacio)';
    output.classList.add('has-result');
}

// [XTZ-21]
function dI(info) {
    document.getElementById('processInfo').innerHTML = info;
}

// [XTZ-21]
function dE(message) {
    const output = document.getElementById('outputText');
    output.textContent = 'Error: ' + message;
    output.classList.remove('has-result');
}

// [XTZ-21]
function dC() {
    document.getElementById('inputText').value = '';
    document.getElementById('outputText').textContent = 'El resultado aparecera aqui...';
    document.getElementById('outputText').classList.remove('has-result');
    document.getElementById('processInfo').innerHTML = 'Sin informacion disponible';
}

// [XTZ-21]
function dCp() {
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

// [XTZ-21]
function dS() {
    const statusText = document.getElementById('statusText');
    const statusDot = document.getElementById('statusDot');
    if (Q0.alphabet) {
        statusText.textContent = 'Motor listo - ' + xN(Q0.alphabet) + ' caracteres';
        statusDot.classList.add('active');
    } else {
        statusText.textContent = 'Definiendo alfabeto...';
        statusDot.classList.remove('active');
    }
}

// [XTZ-23]
function uO() {
    const radios = document.getElementsByName('operationMode');
    for (const radio of radios) {
        if (radio.checked) return radio.value;
    }
    return 'encrypt';
}

// [XTZ-24]
function dMU() {
    const mode = uO();
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
    Q0.operationMode = mode;
}

// [XTZ-25]
function dMM() {
    const method = uM();
    document.getElementById('cesarOptions').classList.toggle('hidden', method !== 'cesar');
    document.getElementById('atbashInfo').classList.toggle('hidden', method !== 'atbash');
    document.getElementById('cesarOption').classList.toggle('selected', method === 'cesar');
    document.getElementById('atbashOption').classList.toggle('selected', method === 'atbash');
}

// [XTZ-22]
const x22 = {
    results: [],
    rs() { this.results = []; },
    lg(msg, type) { this.results.push({ message: msg, type }); },
    ok(cond, name) {
        const pass = cond === true;
        this.lg((pass ? '✓' : '✗') + ' ' + name, pass ? 'pass' : 'fail');
        return pass;
    },
    eq(actual, expected, name) {
        const pass = actual === expected;
        this.lg((pass ? '✓' : '✗') + ' ' + name, pass ? 'pass' : 'fail');
        if (!pass) this.lg('  Esperado: "' + expected + '", Obtenido: "' + actual + '"', 'fail');
        return pass;
    },
    rp() {
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

// [XTZ-22]
function v01() {
    x22.rs();
    x22.lg('PRUEBA: Cesar basico', 'info');
    const alpha = 'abcdefghijklmnopqrstuvwxyz';
    const enc = x07('abc', 3, alpha);
    x22.eq(enc.result, 'def', 'abc + 3 = def');
    return x22.rp();
}

// [XTZ-22]
function v02() {
    x22.rs();
    x22.lg('PRUEBA: Cesar wrap-around', 'info');
    const alpha = 'abcdefghijklmnopqrstuvwxyz';
    x22.eq(x07('xyz', 3, alpha).result, 'abc', 'xyz + 3 = abc');
    x22.eq(x07('abc', -1, alpha).result, 'zab', 'abc - 1 = zab');
    return x22.rp();
}

// [XTZ-22]
function v03() {
    x22.rs();
    x22.lg('PRUEBA: Atbash basico', 'info');
    const alpha = 'abcde';
    x22.eq(x09('abcde', alpha).result, 'edcba', 'abcde -> edcba');
    return x22.rp();
}

// [XTZ-22]
function v04() {
    x22.rs();
    x22.lg('PRUEBA: Round-trip', 'info');
    const alpha = 'abcdefghijklmnopqrstuvwxyz';
    const text = 'hola mundo';
    const enc = x07(text, 5, alpha).result;
    const dec = x08(enc, 5, alpha).result;
    x22.eq(dec, text, 'Cesar round-trip');
    const atbash = x09i(x09(text, alpha).result, alpha).result;
    x22.eq(atbash, text, 'Atbash round-trip');
    return x22.rp();
}

// [XTZ-22]
function v05() {
    x22.rs();
    x22.lg('PRUEBA: Auto-deteccion Cesar', 'info');
    const alpha = 'abcdefghijklmnopqrstuvwxyz';
    const original = 'el murcielago coma mosca';
    const shift = 7;
    const cipher = x07(original, shift, alpha).result;
    const result = x19(cipher, alpha);
    x22.ok(!result.isAmbiguous, 'No es ambiguo');
    x22.eq(result.winner.method, 'cesar', 'Detecta Cesar');
    x22.eq(result.winner.shift, shift, 'Detecta desplazamiento ' + shift);
    x22.eq(result.winner.text, original, 'Descifra correctamente');
    return x22.rp();
}

// [XTZ-22]
function v06() {
    x22.rs();
    x22.lg('PRUEBA: Auto-deteccion Atbash', 'info');
    const alpha = 'abcdefghijklmnopqrstuvwxyz';
    const original = 'el murcielago coma mosca';
    const cipher = x09(original, alpha).result;
    const result = x19(cipher, alpha);
    x22.ok(!result.isAmbiguous, 'No es ambiguo');
    x22.eq(result.winner.method, 'atbash', 'Detecta Atbash');
    x22.eq(result.winner.text, original, 'Descifra correctamente');
    return x22.rp();
}

// [XTZ-22]
function v07() {
    x22.rs();
    x22.lg('PRUEBA: Casos difficiles', 'info');
    const alpha = 'abcdefghijklmnopqrstuvwxyz';
    const short = x07('h', 3, alpha).result;
    const shortResult = x19(short, alpha);
    x22.lg('Texto corto "' + short + '" -> "' + shortResult.winner.text + '"', 'info');
    const random = 'xqzmvpfrt';
    const randomCipher = x07(random, 5, alpha).result;
    const randomResult = x19(randomCipher, alpha);
    x22.ok(randomResult.isAmbiguous || randomResult.winner.score.combined < 0.3, 'Texto aleatorio es ambiguo o baja puntuacion');
    return x22.rp();
}

// [XTZ-22]
function vAll() {
    const reports = [
        v01(),
        v02(),
        v03(),
        v04(),
        v05(),
        v06(),
        v07()
    ];
    let final = '========== INFORME COMPLETO ==========\n\n';
    final += reports.join('\n');
    const pass = (final.match(/✓/g) || []).length;
    const fail = (final.match(/✗/g) || []).length;
    final += '\n========== TOTAL: ' + pass + '/' + (pass + fail) + ' pruebas pasaron ==========\n';
    return final;
}

// [XTZ-22]
function dT(report) {
    const output = document.getElementById('testOutput');
    output.textContent = report;
    output.classList.remove('hidden');
    output.scrollTop = output.scrollHeight;
}

// [XTZ-26]
function boot() {
    document.getElementById('alphabetInput').value = Q0.DEFAULT_ALPHABET;
    x06(Q0.DEFAULT_ALPHABET);
    document.getElementById('setDefaultAlphabet').addEventListener('click', () => {
        document.getElementById('alphabetInput').value = Q0.PRESET_ALPHABETS.basic;
        x06(Q0.PRESET_ALPHABETS.basic);
    });
    document.getElementById('setExtendedAlphabet').addEventListener('click', () => {
        document.getElementById('alphabetInput').value = Q0.PRESET_ALPHABETS.extended;
        x06(Q0.PRESET_ALPHABETS.extended);
    });
    document.getElementById('setAsciiAlphabet').addEventListener('click', () => {
        document.getElementById('alphabetInput').value = Q0.PRESET_ALPHABETS.ascii;
        x06(Q0.PRESET_ALPHABETS.ascii);
    });
    document.getElementById('setAscii7Alphabet').addEventListener('click', () => {
        document.getElementById('alphabetInput').value = Q0.PRESET_ALPHABETS.ascii7;
        x06(Q0.PRESET_ALPHABETS.ascii7);
    });
    document.getElementById('alphabetInput').addEventListener('input', (e) => {
        if (!e.target.value) {
            Q0.alphabet = '';
            dA('');
            dAE(['El alfabeto no puede estar vacio']);
            dS();
            return;
        }
        x06(e.target.value);
    });
    document.querySelectorAll('input[name="cipherMethod"]').forEach(r => r.addEventListener('change', dMM));
    document.querySelectorAll('input[name="operationMode"]').forEach(r => r.addEventListener('change', dMU));
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => uSS(parseInt(btn.dataset.shift)));
    });
    document.getElementById('processBtn').addEventListener('click', x21);
    document.getElementById('clearBtn').addEventListener('click', dC);
    document.getElementById('copyBtn').addEventListener('click', dCp);
    document.getElementById('testCesarBasic').addEventListener('click', () => dT(v01()));
    document.getElementById('testCesarWrap').addEventListener('click', () => dT(v02()));
    document.getElementById('testAtbashBasic').addEventListener('click', () => dT(v03()));
    document.getElementById('testRoundTrip').addEventListener('click', () => dT(v04()));
    document.getElementById('testAutoCesar').addEventListener('click', () => dT(v05()));
    document.getElementById('testAutoAtbash').addEventListener('click', () => dT(v06()));
    document.getElementById('testAutoEdge').addEventListener('click', () => dT(v07()));
    document.getElementById('testAll').addEventListener('click', () => dT(vAll()));
    dMU();
    dMM();
    dS();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}
