// ─────────────────────────────────────────
//   VoiceFlow — Speech Studio
//   script.js  ← Brain (Speech Logic)
// ─────────────────────────────────────────

// ═══════════════════════════════════════
// 1. BROWSER SUPPORT CHECK
// ═══════════════════════════════════════
const supportsTTS = 'speechSynthesis' in window;
const supportsSTT = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

if (!supportsTTS && !supportsSTT) {
  document.getElementById('notSupported').style.display = 'flex';
}

// ═══════════════════════════════════════
// 2. STATE
// ═══════════════════════════════════════
let isSpeaking   = false;
let isPaused     = false;
let isRecording  = false;
let recognition  = null;
let voices       = [];
let history      = JSON.parse(localStorage.getItem('vf_history') || '[]');

// ═══════════════════════════════════════
// 3. DOM REFERENCES
// ═══════════════════════════════════════
const ttsInput     = document.getElementById('ttsInput');
const voiceSelect  = document.getElementById('voiceSelect');
const rateRange    = document.getElementById('rateRange');
const pitchRange   = document.getElementById('pitchRange');
const volRange     = document.getElementById('volRange');
const rateVal      = document.getElementById('rateVal');
const pitchVal     = document.getElementById('pitchVal');
const volVal       = document.getElementById('volVal');
const charCount    = document.getElementById('charCount');
const speakBtn     = document.getElementById('speakBtn');
const pauseBtn     = document.getElementById('pauseBtn');
const stopBtn      = document.getElementById('stopBtn');
const micBtn       = document.getElementById('micBtn');
const micHint      = document.getElementById('micHint');
const sttOutput    = document.getElementById('sttOutput');
const waveBars     = document.getElementById('waveBars');
const waveLabel    = document.getElementById('waveLabel');
const statusPill   = document.getElementById('statusPill');
const statusText   = document.getElementById('statusText');
const historyList  = document.getElementById('historyList');
const langSelect   = document.getElementById('langSelect');
const toast        = document.getElementById('toast');

// ═══════════════════════════════════════
// 4. INIT
// ═══════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  loadVoices();
  renderHistory();

  // Load voices (Chrome needs this event)
  if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  // Char counter
  ttsInput.addEventListener('input', () => {
    charCount.textContent = ttsInput.value.length;
  });

  // Slider live update labels
  rateRange.addEventListener('input', () => {
    rateVal.textContent = parseFloat(rateRange.value).toFixed(1) + 'x';
  });
  pitchRange.addEventListener('input', () => {
    pitchVal.textContent = parseFloat(pitchRange.value).toFixed(1);
  });
  volRange.addEventListener('input', () => {
    volVal.textContent = Math.round(volRange.value * 100) + '%';
  });
});

// ═══════════════════════════════════════
// 5. LOAD VOICES (TTS)
// ═══════════════════════════════════════
function loadVoices() {
  if (!supportsTTS) return;

  voices = window.speechSynthesis.getVoices();
  voiceSelect.innerHTML = '';

  if (voices.length === 0) {
    voiceSelect.innerHTML = '<option>No voices found</option>';
    return;
  }

  // Group voices by language
  const grouped = {};
  voices.forEach((voice, i) => {
    const lang = voice.lang.split('-')[0].toUpperCase();
    if (!grouped[lang]) grouped[lang] = [];
    grouped[lang].push({ voice, index: i });
  });

  // Build select options
  Object.keys(grouped).sort().forEach(lang => {
    const group = document.createElement('optgroup');
    group.label = lang;
    grouped[lang].forEach(({ voice, index }) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = `${voice.name} (${voice.lang})`;
      if (voice.default) option.selected = true;
      group.appendChild(option);
    });
    voiceSelect.appendChild(group);
  });
}

// ═══════════════════════════════════════
// 6. TEXT TO SPEECH
// ═══════════════════════════════════════
function startSpeech() {
  if (!supportsTTS) { showToast('❌ TTS not supported in this browser'); return; }

  const text = ttsInput.value.trim();
  if (!text) { showToast('⚠️ Please type something first!'); ttsInput.focus(); return; }

  // Stop anything currently speaking
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  // Apply settings
  utterance.voice  = voices[parseInt(voiceSelect.value)] || null;
  utterance.rate   = parseFloat(rateRange.value);
  utterance.pitch  = parseFloat(pitchRange.value);
  utterance.volume = parseFloat(volRange.value);

  // Events
  utterance.onstart = () => {
    isSpeaking = true;
    isPaused   = false;
    speakBtn.disabled  = true;
    pauseBtn.disabled  = false;
    stopBtn.disabled   = false;
    setWave(true);
    setStatus('Speaking', 'speaking');
    document.getElementById('ttsCard').classList.add('active');
  };

  utterance.onend = () => {
    isSpeaking = false;
    isPaused   = false;
    speakBtn.disabled  = false;
    pauseBtn.disabled  = true;
    stopBtn.disabled   = true;
    setWave(false);
    setStatus('Ready', '');
    document.getElementById('ttsCard').classList.remove('active');
    showToast('✅ Done speaking!');
  };

  utterance.onerror = (e) => {
    console.error('TTS Error:', e);
    resetTTSState();
    if (e.error !== 'interrupted') {
      showToast('❌ Speech error: ' + e.error);
      setStatus('Error', 'error');
    }
  };

  utterance.onpause  = () => { setWave(false); waveLabel.textContent = 'Paused'; };
  utterance.onresume = () => { setWave(true); };

  window.speechSynthesis.speak(utterance);
}

function pauseSpeech() {
  if (!supportsTTS) return;

  if (isPaused) {
    window.speechSynthesis.resume();
    isPaused = false;
    pauseBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
      </svg> Pause`;
    setWave(true);
    setStatus('Speaking', 'speaking');
  } else {
    window.speechSynthesis.pause();
    isPaused = true;
    pauseBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg> Resume`;
    setStatus('Paused', '');
  }
}

function stopSpeech() {
  if (!supportsTTS) return;
  window.speechSynthesis.cancel();
  resetTTSState();
  showToast('⏹️ Stopped');
}

function resetTTSState() {
  isSpeaking = false;
  isPaused   = false;
  speakBtn.disabled = false;
  pauseBtn.disabled = true;
  stopBtn.disabled  = true;
  pauseBtn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
    </svg> Pause`;
  setWave(false);
  setStatus('Ready', '');
  document.getElementById('ttsCard').classList.remove('active');
}

function clearTTS() {
  stopSpeech();
  ttsInput.value = '';
  charCount.textContent = '0';
  ttsInput.focus();
}

// ═══════════════════════════════════════
// 7. SPEECH RECOGNITION (STT)
// ═══════════════════════════════════════
function toggleRecording() {
  if (isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
}

function startRecording() {
  if (!supportsSTT) { showToast('❌ Speech recognition not supported. Use Chrome.'); return; }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();

  recognition.lang           = langSelect.value;
  recognition.continuous     = true;       // Keep listening
  recognition.interimResults = true;       // Show results as you speak
  recognition.maxAlternatives = 1;

  let finalTranscript    = '';
  let interimTranscript  = '';

  recognition.onstart = () => {
    isRecording = true;
    micBtn.classList.add('recording');
    micHint.textContent = '🔴 Listening... Tap to stop';
    micHint.classList.add('active');
    setStatus('Listening', 'listening');
    document.getElementById('sttCard').classList.add('active');

    // Clear placeholder
    sttOutput.innerHTML = '<span style="color:var(--accent2);font-style:italic;">Listening...</span>';
  };

  recognition.onresult = (event) => {
    interimTranscript = '';
    finalTranscript   = '';

    for (let i = 0; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript + ' ';
      } else {
        interimTranscript += transcript;
      }
    }

    // Display: final in white, interim in muted color
    sttOutput.innerHTML =
      `<span>${finalTranscript}</span>` +
      `<span style="color:var(--muted);font-style:italic;">${interimTranscript}</span>`;
  };

  recognition.onend = () => {
    if (isRecording) {
      // Auto-restart if still supposed to be recording (some browsers stop after silence)
      try { recognition.start(); } catch(e) { /* already started */ }
    } else {
      finishRecording(finalTranscript);
    }
  };

  recognition.onerror = (event) => {
    console.error('STT Error:', event.error);
    isRecording = false;

    const errorMessages = {
      'network':          '❌ Network error. Check your connection.',
      'not-allowed':      '🔒 Microphone access denied. Allow mic in browser settings.',
      'no-speech':        '🔇 No speech detected. Try again.',
      'audio-capture':    '🎤 No microphone found.',
      'service-not-allowed': '❌ Service not allowed.',
      'language-not-supported': '⚠️ This language isn\'t supported by your browser\'s speech engine yet.',
    };

    showToast(errorMessages[event.error] || `❌ Error: ${event.error}`);
    setStatus('Error', 'error');
    resetMicState();
  };

  try {
    recognition.start();
  } catch (e) {
    showToast('❌ Could not start microphone: ' + e.message);
    resetMicState();
  }
}

function stopRecording() {
  isRecording = false;
  if (recognition) {
    recognition.stop();
  }
}

function finishRecording(text) {
  const finalText = text.trim();

  resetMicState();

  if (finalText) {
    sttOutput.innerHTML = finalText;
    addToHistory(finalText);
    showToast('✅ Speech captured!');
  } else {
    sttOutput.innerHTML = '<span class="output-placeholder">Nothing detected. Try again...</span>';
    showToast('🔇 No speech detected');
  }

  setStatus('Ready', '');
  document.getElementById('sttCard').classList.remove('active');
}

function resetMicState() {
  micBtn.classList.remove('recording');
  micHint.textContent = 'Tap to start listening';
  micHint.classList.remove('active');
}

// ═══════════════════════════════════════
// 8. UTILITY ACTIONS
// ═══════════════════════════════════════
function copyText() {
  const text = sttOutput.innerText.trim();
  if (!text || text === 'Your speech will appear here...') {
    showToast('⚠️ Nothing to copy');
    return;
  }
  navigator.clipboard.writeText(text).then(() => {
    showToast('📋 Copied to clipboard!');
  }).catch(() => {
    // Fallback for older browsers
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    showToast('📋 Copied!');
  });
}

function sendToTTS() {
  const text = sttOutput.innerText.trim();
  if (!text || text === 'Your speech will appear here...') {
    showToast('⚠️ No text to send');
    return;
  }
  ttsInput.value = text;
  charCount.textContent = text.length;
  showToast('✅ Sent to Text-to-Speech!');
  // Smooth scroll to TTS section
  document.getElementById('ttsCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function clearSTT() {
  sttOutput.innerHTML = '<span class="output-placeholder">Your speech will appear here...</span>';
  showToast('🗑️ Cleared');
}

// ═══════════════════════════════════════
// 9. HISTORY
// ═══════════════════════════════════════
function addToHistory(text) {
  const entry = {
    text: text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    id: Date.now()
  };

  history.unshift(entry);

  // Store ALL history — no limit, nothing is ever auto-deleted
  localStorage.setItem('vf_history', JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  if (history.length === 0) {
    historyList.innerHTML = '<p class="no-history">No history yet</p>';
    return;
  }

  historyList.innerHTML = history.map(entry => `
    <div class="history-item" onclick="loadFromHistory('${entry.id}')">
      <span class="history-text">${escapeHtml(entry.text)}</span>
      <span class="history-time">${entry.time}</span>
    </div>
  `).join('');
}

function loadFromHistory(id) {
  const entry = history.find(h => h.id == id);
  if (!entry) return;
  sttOutput.innerHTML = entry.text;
  showToast('📝 Loaded from history');
}

function clearHistory() {
  if (history.length === 0) { showToast('⚠️ History is already empty'); return; }
  history = [];
  localStorage.removeItem('vf_history');
  renderHistory();
  showToast('🗑️ History cleared');
}

// ═══════════════════════════════════════
// 10. UI HELPERS
// ═══════════════════════════════════════
function setWave(active) {
  if (active) {
    waveBars.classList.add('active');
    waveLabel.textContent = 'Speaking';
  } else {
    waveBars.classList.remove('active');
    waveLabel.textContent = 'Idle';
  }
}

function setStatus(text, type) {
  statusText.textContent = text;
  statusPill.className = 'status-pill';
  if (type) statusPill.classList.add(type);
}

let toastTimeout;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}

// ═══════════════════════════════════════
// 11. KEYBOARD SHORTCUTS
// ═══════════════════════════════════════
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + Enter → Speak
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    if (!isSpeaking) startSpeech();
  }
  // Ctrl/Cmd + M → Toggle Mic
  if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
    e.preventDefault();
    toggleRecording();
  }
  // Escape → Stop everything
  if (e.key === 'Escape') {
    if (isSpeaking) stopSpeech();
    if (isRecording) stopRecording();
  }
});

// ═══════════════════════════════════════
// 12. PREVENT SPEECH SYNTHESIS GLITCHES
//     (Chrome bug: pauses after ~15s)
// ═══════════════════════════════════════
setInterval(() => {
  if (isSpeaking && !isPaused && window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }
}, 5000);
