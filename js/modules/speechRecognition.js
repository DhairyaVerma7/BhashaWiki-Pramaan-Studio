/**
 * speechRecognition.js
 * BhashaWiki Pramaan Studio - Voice-First Field Narration Module
 * Wraps Web Speech API (SpeechRecognition) for live Hindi/Hinglish recording,
 * manages real-time spectrogram visualization, and triggers encyclopedic post-processing.
 */

export class SpeechRecognitionManager {
  constructor(options = {}) {
    this.options = {
      lang: 'hi-IN',
      continuous: true,
      interimResults: true,
      maxAlternatives: 1,
      onStart: () => {},
      onStop: () => {},
      onInterim: () => {},
      onResult: () => {},
      onError: () => {},
      onCleanUpComplete: () => {},
      ...options
    };

    this.isRecording = false;
    this.recognition = null;
    this.audioContext = null;
    this.analyser = null;
    this.mediaStream = null;
    this.waveAnimationId = null;
    this.simulationTimer = null;
    this.finalTranscript = '';
    this.interimTranscript = '';

    // Sample authentic Hindi field narration utterances for simulated fallback
    this.sampleUtterances = [
      "खुसरो बाग़ लूकरगंज में स्थित है और इसके बड़े दरवाजे पर",
      "फ़ारसी शिलालेख स्पष्ट रूप से आक़ा रज़ा का उल्लेख करता है...",
      "इस ऐतिहासिक स्मारक का निर्माण 1622 ईस्वी में पूर्ण हुआ था,",
      "जहाँगीर के शासनकाल में यह चारबाग़ शैली का प्रमुख उदाहरण बना।"
    ];

    this._initRecognition();
  }

  _initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.lang = this.options.lang;
        this.recognition.continuous = this.options.continuous;
        this.recognition.interimResults = this.options.interimResults;
        this.recognition.maxAlternatives = this.options.maxAlternatives;

        this.recognition.onstart = () => {
          this.isRecording = true;
          this.options.onStart();
          this._startVisualizer();
        };

        this.recognition.onresult = (event) => {
          let interim = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              this.finalTranscript += transcript + ' ';
              this.options.onResult(this.finalTranscript.trim());
            } else {
              interim += transcript;
            }
          }
          this.interimTranscript = interim;
          this.options.onInterim(interim, this.finalTranscript);
        };

        this.recognition.onerror = (event) => {
          console.warn('[SpeechRecognition] API error:', event.error);
          this.options.onError(event.error);
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            this._runSimulatedVoiceCapture();
          }
        };

        this.recognition.onend = () => {
          if (this.isRecording) {
            // Restart if continuous recording desired and not explicitly stopped
            try {
              this.recognition.start();
            } catch (e) {
              this._handleStop();
            }
          } else {
            this._handleStop();
          }
        };
      } catch (err) {
        console.warn('[SpeechRecognition] Failed to initialize native API, fallback to simulation:', err);
        this.recognition = null;
      }
    } else {
      console.info('[SpeechRecognition] Web Speech API not natively available. Simulation engine active.');
    }
  }

  start() {
    if (this.isRecording) return;
    this.isRecording = true;
    this.finalTranscript = '';
    this.interimTranscript = '';

    if (this.recognition) {
      try {
        this.recognition.start();
      } catch (e) {
        console.warn('[SpeechRecognition] Native start failed, engaging simulator:', e);
        this._runSimulatedVoiceCapture();
      }
    } else {
      this._runSimulatedVoiceCapture();
    }
  }

  stop() {
    if (!this.isRecording) return;
    this.isRecording = false;

    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignore stop error
      }
    }

    if (this.simulationTimer) {
      clearInterval(this.simulationTimer);
      this.simulationTimer = null;
    }

    this._handleStop();
  }

  toggle() {
    if (this.isRecording) {
      this.stop();
    } else {
      this.start();
    }
    return this.isRecording;
  }

  _handleStop() {
    this._stopVisualizer();
    this.options.onStop();

    // Trigger simulated Gemini clean-up pass to convert raw spoken dictation into formal encyclopedic prose
    const completedText = (this.finalTranscript || this.sampleUtterances.join(' ')).trim();
    setTimeout(() => {
      this.options.onCleanUpComplete(completedText);
    }, 600);
  }

  _runSimulatedVoiceCapture() {
    this.options.onStart();
    this._startVisualizer();

    let utteranceIndex = 0;
    let wordIndex = 0;
    const words = this.sampleUtterances[utteranceIndex].split(' ');

    this.simulationTimer = setInterval(() => {
      if (!this.isRecording) {
        clearInterval(this.simulationTimer);
        return;
      }

      if (wordIndex < words.length) {
        this.interimTranscript = words.slice(0, wordIndex + 1).join(' ');
        this.options.onInterim(this.interimTranscript, this.finalTranscript);
        wordIndex++;
      } else {
        this.finalTranscript += (this.finalTranscript ? ' ' : '') + this.sampleUtterances[utteranceIndex];
        this.options.onResult(this.finalTranscript);
        this.interimTranscript = '';
        utteranceIndex++;
        if (utteranceIndex < this.sampleUtterances.length) {
          words.length = 0;
          words.push(...this.sampleUtterances[utteranceIndex].split(' '));
          wordIndex = 0;
        } else {
          // Finished sample speech sequence
          clearInterval(this.simulationTimer);
          this.simulationTimer = null;
          this.stop();
        }
      }
    }, 380);
  }

  async _startVisualizer() {
    const waveBars = document.querySelectorAll('.wave-bar');
    if (!waveBars.length) return;

    // Try Web Audio API for true mic levels
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();
        const source = this.audioContext.createMediaStreamSource(this.mediaStream);
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 32;
        source.connect(this.analyser);

        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        const animate = () => {
          if (!this.isRecording) return;
          this.analyser.getByteFrequencyData(dataArray);

          waveBars.forEach((bar, idx) => {
            const val = dataArray[idx % dataArray.length] || 0;
            const height = Math.max(4, Math.min(24, Math.round((val / 255) * 24)));
            bar.style.height = `${height}px`;
          });

          this.waveAnimationId = requestAnimationFrame(animate);
        };
        animate();
        return;
      }
    } catch (e) {
      // Fallback to randomized synthetic waveform animation
    }

    // Synthetic randomized wave animation
    const animateSynthetic = () => {
      if (!this.isRecording) return;
      waveBars.forEach((bar) => {
        const h = Math.floor(Math.random() * 20) + 4;
        bar.style.height = `${h}px`;
      });
      this.waveAnimationId = setTimeout(() => {
        requestAnimationFrame(animateSynthetic);
      }, 90);
    };
    animateSynthetic();
  }

  _stopVisualizer() {
    if (this.waveAnimationId) {
      cancelAnimationFrame(this.waveAnimationId);
      clearTimeout(this.waveAnimationId);
      this.waveAnimationId = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(t => t.stop());
      this.mediaStream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
    const waveBars = document.querySelectorAll('.wave-bar');
    waveBars.forEach((bar, idx) => {
      bar.style.height = `${(idx % 3 + 1) * 4}px`;
    });
  }

  /**
   * Pronounce text using SpeechSynthesis (Web Speech API)
   * @param {string} text Hindi/Indic text to pronounce
   * @param {Function} onStart Callback on speech start
   * @param {Function} onEnd Callback on speech finish
   */
  static speakPronunciation(text = "खुसरो बाग़", onStart = () => {}, onEnd = () => {}) {
    if (!('speechSynthesis' in window)) {
      console.warn('[SpeechSynthesis] Browser does not support speech synthesis.');
      onStart();
      setTimeout(onEnd, 1200);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    // Pick a Hindi voice if available
    const voices = window.speechSynthesis.getVoices();
    const hiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('HI'));
    if (hiVoice) {
      utterance.voice = hiVoice;
    }

    utterance.onstart = onStart;
    utterance.onend = onEnd;
    utterance.onerror = () => onEnd();

    window.speechSynthesis.speak(utterance);
  }
}
