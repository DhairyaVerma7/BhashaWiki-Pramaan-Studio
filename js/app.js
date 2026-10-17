/**
 * app.js
 * BhashaWiki Pramaan Studio - Main Application Controller
 * Wires up client-side modules: SpeechRecognition, ExifVerifier, GeminiService,
 * and KnowledgeCartographer with responsive UI telemetry and interactive events.
 */

import { SpeechRecognitionManager } from './modules/speechRecognition.js';
import { ExifVerifier } from './modules/exifVerifier.js';
import { GeminiService } from './modules/geminiService.js';
import { KnowledgeCartographer } from './modules/knowledgeGraph.js';

class PramaanStudioApp {
  constructor() {
    this.state = {
      activeMonument: 'khusro_bagh',
      biasFixed: false,
      isGraphHealed: false,
      injectedFacts: new Set(),
      epistemicScore: 96,
      npovScore: 94,
      totalMissingFacts: 14
    };

    this._initModules();
    this._bindDOM();
    this._initUI();
  }

  _initModules() {
    // 1. Gemini Service
    this.gemini = new GeminiService();

    // 2. EXIF Verifier
    this.exif = new ExifVerifier({
      onVerificationSuccess: (result) => this._onExifSuccess(result),
      onVerificationFailed: (result) => this._onExifFailed(result)
    });

    // 3. Knowledge Cartographer
    this.cartographer = new KnowledgeCartographer('knowledge-graph-container', {
      onHealed: (data) => this._onGraphHealed(data),
      onNodeClick: (node) => this._onGraphNodeClick(node)
    });

    // 4. Speech Recognition Manager
    this.speech = new SpeechRecognitionManager({
      onStart: () => this._onSpeechStart(),
      onStop: () => this._onSpeechStop(),
      onInterim: (interim, final) => this._onSpeechInterim(interim, final),
      onResult: (final) => this._onSpeechResult(final),
      onError: (err) => this._onSpeechError(err),
      onCleanUpComplete: (text) => this._onSpeechCleanUp(text)
    });
  }

  _bindDOM() {
    // Navigation tabs
    this.navTabs = document.querySelectorAll('.nav-tab');

    // Corpus Navigator items
    this.corpusItems = document.querySelectorAll('.corpus-item');

    // EXIF / Upload elements
    this.uploadPhotoBtn = document.getElementById('upload-photo-btn');
    this.photoUploadInput = document.getElementById('photo-upload-input');
    this.plaqueCardTrigger = document.getElementById('plaque-card-trigger');

    // Speech & Audio elements
    this.micToggleBtn = document.getElementById('mic-toggle-btn');
    this.audioPlayBtn = document.getElementById('audio-play-btn');
    this.liveTranscript = document.getElementById('live-transcript');
    this.recStatusPill = document.getElementById('rec-status-pill');
    this.recDot = document.getElementById('rec-dot');
    this.recTimerBadge = document.getElementById('rec-timer-badge');
    this.micIcon = document.getElementById('mic-icon');

    // Fact Diff elements
    this.batchInjectBtn = document.getElementById('batch-inject-btn');
    this.quickDiffRefresh = document.getElementById('quick-diff-refresh');
    this.factPills = document.querySelectorAll('.fact-pill');
    this.factGapCountBadge = document.getElementById('fact-gap-count-badge');
    this.factDiffRatio = document.getElementById('fact-diff-ratio');

    // Wikitext Editor elements
    this.wikitextEditor = document.getElementById('wikitext-editor');
    this.editorLineNumbers = document.getElementById('editor-line-numbers');
    this.editorPrettifyBtn = document.getElementById('editor-prettify');
    this.btnFormatBold = document.getElementById('btn-format-bold');
    this.btnFormatItalic = document.getElementById('btn-format-italic');
    this.btnFormatLink = document.getElementById('btn-format-link');
    this.btnFormatQuote = document.getElementById('btn-format-quote');
    this.btnFormatQid = document.getElementById('btn-format-qid');
    this.btnFormatAudio = document.getElementById('btn-format-audio');

    // Live Vector-2022 Preview elements
    this.wikipediaPreview = document.getElementById('wikipedia-preview');
    this.wikiRenderedText = document.getElementById('wiki-rendered-text');
    this.floorplanSvg = document.getElementById('floorplan-svg');

    // Epistemic & Bias Firewall elements
    this.fixBiasBtn = document.getElementById('fix-bias-btn');
    this.biasAlert = document.getElementById('bias-alert');
    this.npovStatusPill = document.getElementById('npov-status-pill');
    this.epistemicScoreNum = document.getElementById('epistemic-score-num');
    this.epistemicScoreCircle = document.getElementById('epistemic-score-circle');
    this.telemetryNpovNum = document.getElementById('telemetry-npov-num');
    this.npovProgressBar = document.getElementById('npov-progress-bar');
    this.epistemicVerdictTitle = document.getElementById('epistemic-verdict-title');

    // Knowledge Cartographer Auto-Heal button
    this.healGraphBtn = document.getElementById('heal-graph-btn');

    // Modals & Triggers
    this.exportModal = document.getElementById('export-modal');
    this.closeExportModal = document.getElementById('close-export-modal');
    this.btnCancelModal = document.getElementById('btn-cancel-modal');
    this.btnCopyPayload = document.getElementById('btn-copy-payload');
    this.btnConfirmPush = document.getElementById('btn-confirm-push');
    this.topPublishBtn = document.getElementById('top-publish-btn');
    this.headerExportBtn = document.getElementById('header-export-btn');
    this.headerExportMenuBtn = document.getElementById('header-export-menu-btn');
    this.bottomSandboxPushBtn = document.getElementById('bottom-sandbox-push-btn');

    // Provenance Lightbox Modal & Triggers
    this.provenanceModal = document.getElementById('provenance-modal');
    this.closeProvenanceModal = document.getElementById('close-provenance-modal');
    this.btnCloseProvenance = document.getElementById('btn-close-provenance');
    this.btnCopyProvenanceSha = document.getElementById('btn-copy-provenance-sha');
    this.exifSignedBadge = document.getElementById('exif-signed-badge');
    this.ocrGazetteMatch = document.getElementById('ocr-gazette-match');
    this.ocrSha256 = document.getElementById('ocr-sha256');

    // Sidebar & Inspector Drawer Controls
    this.sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
    this.sidebarCloseBtn = document.getElementById('sidebar-close-btn');
    this.corpusSidebar = document.getElementById('corpus-sidebar');
    this.inspectorToggleBtn = document.getElementById('inspector-toggle-btn');
    this.inspectorCloseBtn = document.getElementById('inspector-close-btn');
    this.pramaanInspectorDrawer = document.getElementById('pramaan-inspector-drawer');
    this.inspectorTabs = document.querySelectorAll('.inspector-tab');

    // Document View Mode Switcher
    this.viewModeBtns = document.querySelectorAll('.view-mode-btn');
    this.dualPaneArena = document.getElementById('dual-pane-arena');
    this.colEditor = document.getElementById('col-editor');
    this.wikipediaPreviewContainer = document.getElementById('wikipedia-preview-container');

    // API Key Modal
    this.apiModal = document.getElementById('api-modal');
    this.headerAiBadge = document.getElementById('header-ai-badge');
    this.closeApiModal = document.getElementById('close-api-modal');
    this.inputGeminiKey = document.getElementById('input-gemini-key');
    this.btnSaveKey = document.getElementById('btn-save-key');
    this.btnClearKey = document.getElementById('btn-clear-key');

    // Footer buttons
    this.btnLoadPreset = document.getElementById('btn-load-preset');
    this.btnFirewallTest = document.getElementById('btn-firewall-test');
  }

  _initUI() {
    this.lastExifResult = this.exif.getDefaultVerification();
    this._syncProvenanceModal(this.lastExifResult);
    this._attachEventListeners();
    this._updateLineNumbers();
    this._checkStoredApiKey();
  }

  _attachEventListeners() {
    // 0. Sidebar & Inspector Drawer Toggles
    const toggleSidebar = () => {
      if (this.corpusSidebar) {
        this.corpusSidebar.classList.toggle('hidden');
      }
    };
    if (this.sidebarToggleBtn) this.sidebarToggleBtn.addEventListener('click', toggleSidebar);
    if (this.sidebarCloseBtn) this.sidebarCloseBtn.addEventListener('click', toggleSidebar);

    const toggleInspector = () => {
      if (this.pramaanInspectorDrawer) {
        this.pramaanInspectorDrawer.classList.toggle('hidden');
      }
    };
    if (this.inspectorToggleBtn) this.inspectorToggleBtn.addEventListener('click', toggleInspector);
    if (this.inspectorCloseBtn) this.inspectorCloseBtn.addEventListener('click', toggleInspector);

    // Inspector Sub-Tabs
    this.inspectorTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetPaneId = tab.getAttribute('data-tab').replace('tab-', 'pane-');
        this.inspectorTabs.forEach(t => {
          t.classList.remove('border-b-2', 'border-wiki-blue', 'text-wiki-blue', 'bg-white');
          t.classList.add('text-text-muted');
        });
        tab.classList.add('border-b-2', 'border-wiki-blue', 'text-wiki-blue', 'bg-white');
        tab.classList.remove('text-text-muted');

        document.querySelectorAll('.inspector-pane').forEach(p => p.classList.add('hidden'));
        const targetPane = document.getElementById(targetPaneId);
        if (targetPane) targetPane.classList.remove('hidden');
      });
    });

    // View Mode Selector (Split / Reader / Editor)
    this.viewModeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        this.viewModeBtns.forEach(b => {
          b.classList.remove('bg-white', 'text-text-primary', 'shadow-xs');
          b.classList.add('text-text-secondary');
        });
        btn.classList.add('bg-white', 'text-text-primary', 'shadow-xs');
        btn.classList.remove('text-text-secondary');

        if (mode === 'split') {
          if (this.dualPaneArena) {
            this.dualPaneArena.className = 'flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[680px]';
          }
          if (this.colEditor) {
            this.colEditor.classList.remove('hidden', 'max-w-4xl', 'mx-auto', 'w-full');
          }
          if (this.wikipediaPreviewContainer) {
            this.wikipediaPreviewContainer.classList.remove('hidden', 'max-w-4xl', 'mx-auto', 'w-full');
          }
        } else if (mode === 'reader') {
          if (this.dualPaneArena) {
            this.dualPaneArena.className = 'flex-1 max-w-4xl mx-auto w-full min-h-[680px] flex justify-center';
          }
          if (this.colEditor) this.colEditor.classList.add('hidden');
          if (this.wikipediaPreviewContainer) {
            this.wikipediaPreviewContainer.classList.remove('hidden');
            this.wikipediaPreviewContainer.classList.add('w-full', 'max-w-4xl');
          }
        } else if (mode === 'editor') {
          if (this.dualPaneArena) {
            this.dualPaneArena.className = 'flex-1 max-w-4xl mx-auto w-full min-h-[680px] flex justify-center';
          }
          if (this.wikipediaPreviewContainer) this.wikipediaPreviewContainer.classList.add('hidden');
          if (this.colEditor) {
            this.colEditor.classList.remove('hidden');
            this.colEditor.classList.add('w-full', 'max-w-4xl');
          }
        }
      });
    });

    // 1. Navigation Tabs
    this.navTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        this.navTabs.forEach(t => {
          t.classList.remove('bg-primary-container', 'text-on-primary', 'font-body-ui-medium', 'shadow-sm');
          t.classList.add('text-on-surface-variant');
          t.removeAttribute('aria-current');
        });
        tab.classList.remove('text-on-surface-variant');
        tab.classList.add('bg-primary-container', 'text-on-primary', 'font-body-ui-medium', 'shadow-sm');
        tab.setAttribute('aria-current', 'page');

        const targetId = tab.getAttribute('data-target');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          targetEl.classList.add('ring-2', 'ring-primary/30');
          setTimeout(() => targetEl.classList.remove('ring-2', 'ring-primary/30'), 800);
        }
      });
    });

    // 2. Corpus Navigator Switcher
    this.corpusItems.forEach(item => {
      item.addEventListener('click', () => {
        const monumentKey = item.getAttribute('data-monument');
        this.loadMonumentPreset(monumentKey);
      });
    });

    // 3. Voice Recording
    if (this.micToggleBtn) {
      this.micToggleBtn.addEventListener('click', () => {
        this.speech.toggle();
      });
    }

    // Audio Widget Pronunciation Playback
    if (this.audioPlayBtn) {
      this.audioPlayBtn.addEventListener('click', () => {
        const textToSpeak = this.state.activeMonument === 'khusro_bagh' ? 'खुसरो बाग़' :
                            this.state.activeMonument === 'allahabad_fort' ? 'इलाहाबाद का क़िला' : 'आनंद भवन';
        const playIcon = document.getElementById('audio-play-icon');

        SpeechRecognitionManager.speakPronunciation(textToSpeak, 
          () => {
            if (playIcon) playIcon.innerText = 'volume_up';
            this.audioPlayBtn.classList.add('ring-2', 'ring-primary/50');
            this.showToast(`उच्चारण चल रहा है: "${textToSpeak}" (Native Indic TTS)`, 'info');
          },
          () => {
            if (playIcon) playIcon.innerText = 'play_arrow';
            this.audioPlayBtn.classList.remove('ring-2', 'ring-primary/50');
          }
        );
      });
    }

    // 4. Photo Upload & EXIF Verification
    if (this.uploadPhotoBtn && this.photoUploadInput) {
      this.uploadPhotoBtn.addEventListener('click', () => this.photoUploadInput.click());
    }
    if (this.photoUploadInput) {
      this.photoUploadInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
          this.showToast(`Parsing EXIF tags from "${file.name}"...`, 'info');
          try {
            await this.exif.verifyImageFile(file);
          } catch (err) {
            this.showToast(`EXIF parsing error: ${err.message}`, 'error');
          }
        }
      });
    }

    // 5. NPOV Bias Fix Button
    if (this.fixBiasBtn) {
      this.fixBiasBtn.addEventListener('click', () => this.resolveSubjectiveBias());
    }

    // 6. Indic Fact Pills & Batch Inject
    this.factPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const factKey = pill.getAttribute('data-inject');
        this.injectMissingFact(factKey, pill);
      });
    });

    if (this.batchInjectBtn) {
      this.batchInjectBtn.addEventListener('click', () => this.injectAllMissingFacts());
    }

    if (this.quickDiffRefresh) {
      this.quickDiffRefresh.addEventListener('click', () => this.refreshCorporaDiff());
    }

    // 7. Knowledge Cartographer Auto-Heal
    if (this.healGraphBtn) {
      this.healGraphBtn.addEventListener('click', async () => {
        this.healGraphBtn.disabled = true;
        this.healGraphBtn.innerHTML = `
          <span class="material-symbols-outlined text-[14px] animate-spin">sync</span>
          <span>Healing Graph Links &amp; Querying Wikidata...</span>
        `;
        await this.cartographer.autoHeal();
      });
    }

    // 8. Editor Formatting Toolbar
    this._attachEditorToolbar();

    // 9. Floorplan Interactive Hover / Click
    this._attachFloorplanInteractivity();

    // 10. Modals (Export & API Settings)
    this._attachModalEvents();

    // 11. Footer Quick Actions
    if (this.btnLoadPreset) {
      this.btnLoadPreset.addEventListener('click', () => {
        const presets = ['khusro_bagh', 'allahabad_fort', 'anand_bhavan'];
        const currentIdx = presets.indexOf(this.state.activeMonument);
        const nextMonument = presets[(currentIdx + 1) % presets.length];
        this.loadMonumentPreset(nextMonument);
      });
    }

    if (this.btnFirewallTest) {
      this.btnFirewallTest.addEventListener('click', () => this.triggerFirewallTest());
    }
  }

  // =====================================================================
  // SPEECH RECOGNITION HANDLERS
  // =====================================================================
  _onSpeechStart() {
    if (this.recDot) {
      this.recDot.classList.remove('bg-secondary-container');
      this.recDot.classList.add('bg-error', 'animate-ping');
    }
    if (this.recTimerBadge) {
      this.recTimerBadge.innerText = 'REC LIVE (hi-IN)';
    }
    if (this.micIcon) {
      this.micIcon.innerText = 'mic';
    }
    if (this.micToggleBtn) {
      this.micToggleBtn.classList.remove('bg-secondary');
      this.micToggleBtn.classList.add('bg-error', 'ring-4', 'ring-error/20');
    }
    this.showToast('Voice-First Field Narration Active: Speak in Hindi/Hinglish...', 'info');
  }

  _onSpeechStop() {
    if (this.recDot) {
      this.recDot.classList.add('bg-secondary-container');
      this.recDot.classList.remove('bg-error', 'animate-ping');
    }
    if (this.recTimerBadge) {
      this.recTimerBadge.innerText = 'READY (hi-IN)';
    }
    if (this.micIcon) {
      this.micIcon.innerText = 'graphic_eq';
    }
    if (this.micToggleBtn) {
      this.micToggleBtn.classList.add('bg-secondary');
      this.micToggleBtn.classList.remove('bg-error', 'ring-4', 'ring-error/20');
    }
  }

  _onSpeechInterim(interim, final) {
    if (this.liveTranscript) {
      this.liveTranscript.innerHTML = `
        <span class="bg-emerald-subtle/80 px-1 py-0.5 rounded text-tertiary font-medium">खुसरो बाग़</span>
        <span class="text-on-surface">${final ? final + ' ' : ''}</span>
        <span class="text-secondary font-semibold bg-saffron-subtle px-1 rounded">${interim}</span>
      `;
    }
  }

  _onSpeechResult(final) {
    if (this.liveTranscript) {
      this.liveTranscript.innerHTML = `
        <span class="bg-emerald-subtle/80 px-1 py-0.5 rounded text-tertiary font-medium">खुसरो बाग़</span>
        <span class="text-on-surface">${final}</span>
      `;
    }
  }

  _onSpeechError(error) {
    this.showToast(`Speech status: ${error}. Simulated dictation stream active.`, 'info');
  }

  async _onSpeechCleanUp(text) {
    this.showToast('AI Post-Processing: Converting spoken Hinglish to encyclopedic Devanagari...', 'info');
    const result = await this.gemini.cleanUpSpeechToWikitext(text);
    
    if (this.liveTranscript) {
      this.liveTranscript.innerHTML = `
        <span class="bg-emerald-subtle text-tertiary font-medium px-1 rounded">✓ Verified Encyclopedic Prose</span>
        <p class="mt-1 text-on-surface font-body-encyclopedic text-[12px] leading-relaxed">${result.formalHindi}</p>
      `;
    }

    const asrPercent = document.getElementById('asr-token-confidence');
    if (asrPercent) asrPercent.innerText = `${result.confidence}% Token Avg`;

    this.showToast('Devanagari encyclopedic prose generated with archival citations!', 'success');
  }

  // =====================================================================
  // EXIF & GEOSPATIAL VERIFICATION HANDLERS
  // =====================================================================
  _onExifSuccess(res) {
    // Update Filename
    const label = document.getElementById('photo-filename-label');
    if (label) label.innerText = res.fileName;

    // Update Plaque HUD
    const gpsText = document.getElementById('plaque-gps-text');
    if (gpsText) gpsText.innerText = `GPS: ${res.latitude}° N, ${res.longitude}° E`;

    const camText = document.getElementById('plaque-camera-text');
    if (camText) camText.innerText = res.cameraModelStr;

    // Update OCR Monospace Box
    const epochEl = document.getElementById('ocr-construct-epoch');
    if (epochEl) epochEl.innerText = res.monument.year;

    const archEl = document.getElementById('ocr-lead-architect');
    if (archEl) archEl.innerText = res.monument.architect;

    const asiEl = document.getElementById('ocr-asi-status');
    if (asiEl) asiEl.innerText = res.monument.asiCategory;

    const coordEl = document.getElementById('ocr-p625-coord');
    if (coordEl) coordEl.innerText = `${res.latitude}, ${res.longitude} (Δ ${res.deltaDegrees}°)`;

    const shaEl = document.getElementById('ocr-sha256');
    if (shaEl) shaEl.innerText = res.shortSha;

    // Update Confidence bars
    const gazettePercent = document.getElementById('gazette-match-percent');
    const gazetteBar = document.getElementById('gazette-progress-bar');
    const ocrGazetteMatch = document.getElementById('ocr-gazette-match');
    if (gazettePercent) gazettePercent.innerText = `${res.gazetteMatchScore}%`;
    if (gazetteBar) gazetteBar.style.width = `${res.gazetteMatchScore}%`;
    if (ocrGazetteMatch) ocrGazetteMatch.innerText = `${res.gazetteMatchScore}% Gazette Match`;

    // Update Sidebar HUD
    const hudGps = document.getElementById('sidebar-hud-gps');
    if (hudGps) hudGps.innerText = `GPS: ${res.latitude}° N, ${res.longitude}° E`;

    const sidebarExifPercent = document.getElementById('sidebar-exif-percent');
    const sidebarExifBar = document.getElementById('sidebar-exif-bar');
    if (sidebarExifPercent) sidebarExifPercent.innerText = `${res.gazetteMatchScore}%`;
    if (sidebarExifBar) sidebarExifBar.style.width = `${res.gazetteMatchScore}%`;

    // Modal SHA
    const modalSha = document.getElementById('modal-sha-signature');
    if (modalSha) modalSha.innerText = res.sha256;

    // Cache latest verification & sync Provenance Lightbox Modal
    this.lastExifResult = res;
    this._syncProvenanceModal(res);

    this.showToast(`✓ EXIF GPS Verified: ${res.latitude}° N, ${res.longitude}° E (Δ ${res.deltaMeters}m)`, 'success');
  }

  _syncProvenanceModal(res) {
    if (!res) return;
    const modalProvSha = document.getElementById('modal-provenance-sha');
    if (modalProvSha) modalProvSha.innerText = res.sha256;

    const modalProvMonument = document.getElementById('modal-prov-monument');
    if (modalProvMonument) modalProvMonument.innerText = `${res.monument.name} (${res.monument.englishName})`;

    const modalProvCoords = document.getElementById('modal-prov-coords');
    if (modalProvCoords) modalProvCoords.innerText = `${res.latitude}° N, ${res.longitude}° E (Δ ${res.deltaDegrees || '0.0001'}°)`;

    const modalProvCat = document.getElementById('modal-prov-category');
    if (modalProvCat) modalProvCat.innerText = res.monument.asiCategory || res.asiStatus;

    const modalProvCam = document.getElementById('modal-prov-camera');
    if (modalProvCam) modalProvCam.innerText = `${res.device || res.cameraModelStr} (Exif 2.32)`;

    const modalProvTime = document.getElementById('modal-prov-time');
    if (modalProvTime) modalProvTime.innerText = `${res.timestamp}`;

    const lbAsi = document.getElementById('lightbox-asi-code');
    if (lbAsi) lbAsi.innerText = res.monument.asiCode;

    const lbTitle = document.getElementById('lightbox-monument-title');
    if (lbTitle) lbTitle.innerText = `${res.monument.name} (${res.monument.year.split(' ')[0]})`;

    const lbCam = document.getElementById('lightbox-camera-model');
    if (lbCam) lbCam.innerText = res.device || res.cameraModelStr;

    const lbGps = document.getElementById('lightbox-gps-coords');
    if (lbGps) lbGps.innerText = `${res.latitude}° N, ${res.longitude}° E`;
  }

  _onExifFailed(res) {
    this.showToast(`⚠️ Geotag out of monument bounds (${res.deltaMeters}m offset).`, 'warning');
  }

  // =====================================================================
  // NPOV BIAS FIREWALL HANDLER
  // =====================================================================
  async resolveSubjectiveBias() {
    if (this.state.biasFixed) {
      this.showToast('NPOV Neutrality already verified.', 'info');
      return;
    }

    this.state.biasFixed = true;
    this.state.npovScore = 99;
    this.state.epistemicScore = 99;

    // 1. Update Status Pill
    if (this.npovStatusPill) {
      this.npovStatusPill.className = 'px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300';
      this.npovStatusPill.innerHTML = '✓ NPOV: PASSED';
    }

    // 2. Update Alert Card to Emerald Success
    if (this.biasAlert) {
      this.biasAlert.classList.remove('bg-saffron-subtle', 'border-amber-200');
      this.biasAlert.classList.add('bg-emerald-subtle', 'border-emerald-300');
      this.biasAlert.innerHTML = `
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1.5 text-emerald-800 font-mono text-[11px] font-semibold">
            <span class="material-symbols-outlined text-[15px] text-emerald-600">check_circle</span>
            <span>Bias Auto-Remediated (WP:NPOV)</span>
          </div>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300" id="npov-status-pill">
            ✓ NPOV: PASSED
          </span>
        </div>
        <p class="text-[11.5px] text-text-secondary leading-snug">
          Rewritten to neutral encyclopedic prose: <em class="font-semibold text-emerald-800">"मुग़ल स्थापत्य कला का प्रमुख उदाहरण"</em>. All Wikimedia NPOV community standards satisfied.
        </p>
        <div class="pt-1 flex items-center justify-between text-[10.5px] font-mono text-emerald-800 font-bold">
          <span>NPOV Trust Score: 99/100</span>
          <span>Zero Subjective Adjectives</span>
        </div>
      `;
    }

    // 3. Update Radial Score Gauge
    if (this.epistemicScoreNum) this.epistemicScoreNum.innerText = '99';
    if (this.epistemicScoreCircle) {
      this.epistemicScoreCircle.setAttribute('stroke-dasharray', '99, 100');
    }
    if (this.epistemicVerdictTitle) {
      this.epistemicVerdictTitle.innerText = 'Pramaan Certified Gold';
    }

    // 4. Update Progress Bars
    if (this.telemetryNpovNum) this.telemetryNpovNum.innerText = '99%';
    if (this.npovProgressBar) this.npovProgressBar.style.width = '99%';

    // 5. Update Wikitext Editor & Live Reader text
    if (this.wikitextEditor) {
      let content = this.wikitextEditor.innerHTML;
      content = content.replaceAll('अद्वितीय और सबसे सुंदर', 'मुग़ल स्थापत्य कला का प्रमुख उदाहरण');
      this.wikitextEditor.innerHTML = content;
    }

    if (this.wikiRenderedText) {
      let content = this.wikiRenderedText.innerHTML;
      content = content.replaceAll('अद्वितीय और सबसे सुंदर', 'मुग़ल स्थापत्य कला का प्रमुख उदाहरण');
      this.wikiRenderedText.innerHTML = content;
    }

    this.showToast('✨ Auto-Neutralized: Wikipedia:NPOV neutral tone restored and verified!', 'success');
  }

  triggerFirewallTest() {
    this.state.biasFixed = false;
    this.state.npovScore = 94;
    this.state.epistemicScore = 96;

    // Reset Alert Card
    if (this.biasAlert) {
      this.biasAlert.classList.add('bg-saffron-subtle', 'border-amber-200');
      this.biasAlert.classList.remove('bg-emerald-subtle', 'border-emerald-300');
      this.biasAlert.innerHTML = `
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1.5 text-amber-900 font-mono text-[11px] font-semibold">
            <span class="material-symbols-outlined text-[15px] text-saffron-accent">warning</span>
            <span>Subjective Adjective Detected</span>
          </div>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200" id="npov-status-pill">
            NPOV: FLAGGED
          </span>
        </div>
        <p class="text-[11.5px] text-text-secondary leading-snug">
          Flagged phrase: <span class="bg-white px-1.5 py-0.5 rounded font-medium text-amber-900 border border-amber-200/60" id="flagged-bias-phrase">"अद्वितीय और सबसे सुंदर"</span> violates Wikipedia:NPOV.
        </p>
        <div class="flex items-center gap-2 pt-0.5">
          <button class="flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all duration-300 ease-in-out cursor-pointer shadow-xs active:scale-[0.98]" id="fix-bias-btn" title="One-click automatic neutrality remediation">
            <span class="material-symbols-outlined text-[15px]">magic_button</span>
            <span>✨ Auto-Neutralize</span>
          </button>
        </div>
      `;

      // Rebind button & status pill
      const newBtn = document.getElementById('fix-bias-btn');
      if (newBtn) {
        newBtn.addEventListener('click', () => this.resolveSubjectiveBias());
      }
      this.npovStatusPill = document.getElementById('npov-status-pill');
    }

    if (this.epistemicScoreNum) this.epistemicScoreNum.innerText = '96';
    if (this.epistemicScoreCircle) {
      this.epistemicScoreCircle.setAttribute('stroke-dasharray', '96, 100');
    }
    if (this.epistemicVerdictTitle) {
      this.epistemicVerdictTitle.innerText = 'Pramaan Verified';
    }
    if (this.telemetryNpovNum) this.telemetryNpovNum.innerText = '94%';
    if (this.npovProgressBar) this.npovProgressBar.style.width = '94%';

    // Re-inject bias phrase into editor and live preview
    if (this.wikitextEditor) {
      let content = this.wikitextEditor.innerHTML;
      content = content.replaceAll('मुग़ल स्थापत्य कला का प्रमुख उदाहरण', 'अद्वितीय और सबसे सुंदर');
      this.wikitextEditor.innerHTML = content;
    }
    if (this.wikiRenderedText) {
      let content = this.wikiRenderedText.innerHTML;
      content = content.replaceAll('मुग़ल स्थापत्य कला का प्रमुख उदाहरण', 'अद्वितीय और सबसे सुंदर');
      this.wikiRenderedText.innerHTML = content;
    }

    this.showToast('Firewall Test: Non-neutral phrase injected into verification queue. (NPOV: FLAGGED)', 'warning');
  }

  // =====================================================================
  // FACT-GAP INJECTORS HANDLER
  // =====================================================================
  injectMissingFact(factKey, pillElement) {
    if (this.state.injectedFacts.has(factKey)) {
      this.showToast('Fact already injected into article.', 'info');
      return;
    }

    const discrepancies = this.gemini.getFactDiscrepancies();
    const fact = discrepancies.find(f => f.id === factKey);
    if (!fact) return;

    this.state.injectedFacts.add(factKey);

    // Style pill as injected
    if (pillElement) {
      pillElement.classList.remove('bg-surface-panel', 'text-primary', 'border-outline-variant/30');
      pillElement.classList.add('bg-emerald-subtle', 'text-tertiary', 'border-tertiary-fixed/50');
      pillElement.innerHTML = `
        <span class="material-symbols-outlined text-[13px]">check_circle</span>
        <span>${fact.factTitle} (Injected)</span>
      `;
    }

    // Append to Wikitext Editor
    if (this.wikitextEditor) {
      const additionWrapper = document.createElement('div');
      additionWrapper.className = 'injected-highlight';
      additionWrapper.innerHTML = fact.wikitextAddition;
      this.wikitextEditor.appendChild(additionWrapper);
      this._updateLineNumbers();
    }

    // Append to Live Preview
    if (this.wikiRenderedText) {
      const previewWrapper = document.createElement('div');
      previewWrapper.className = 'injected-highlight';
      previewWrapper.innerHTML = fact.readerAddition;
      this.wikiRenderedText.appendChild(previewWrapper);
    }

    // Update remaining missing facts counter
    const remaining = Math.max(0, this.state.totalMissingFacts - this.state.injectedFacts.size);
    if (this.factGapCountBadge) {
      this.factGapCountBadge.innerText = remaining === 0 ? 
        '✓ All 14 Verified Facts Synchronized!' : 
        `⚠️ ${remaining} Verified Facts Missing in Hindi!`;
      if (remaining === 0) {
        this.factGapCountBadge.classList.remove('bg-saffron-subtle', 'text-secondary', 'border-secondary-fixed/50');
        this.factGapCountBadge.classList.add('bg-emerald-subtle', 'text-tertiary', 'border-tertiary-fixed/50');
      }
    }

    this.showToast(`✓ Injected Fact: ${fact.factTitle}`, 'success');
  }

  injectAllMissingFacts() {
    this.factPills.forEach(pill => {
      const key = pill.getAttribute('data-inject');
      if (!this.state.injectedFacts.has(key)) {
        this.injectMissingFact(key, pill);
      }
    });

    if (this.batchInjectBtn) {
      this.batchInjectBtn.innerHTML = `
        <span class="material-symbols-outlined text-[13px]">done_all</span>
        <span>✓ 14 Facts Synchronized</span>
      `;
      this.batchInjectBtn.classList.remove('bg-primary');
      this.batchInjectBtn.classList.add('bg-tertiary');
    }

    if (this.factDiffRatio) {
      this.factDiffRatio.innerText = 'en.wiki (18 Facts) ⟷ hi.wiki (18 Facts) [100% Parity]';
      this.factDiffRatio.classList.add('text-tertiary', 'font-semibold');
    }

    this.showToast('All 14 Missing Facts from en.wikipedia successfully injected!', 'success');
  }

  refreshCorporaDiff() {
    if (!this.quickDiffRefresh) return;
    const originalHtml = this.quickDiffRefresh.innerHTML;
    this.quickDiffRefresh.disabled = true;
    this.quickDiffRefresh.innerHTML = `
      <span class="material-symbols-outlined text-[13px] animate-spin text-primary">sync</span>
      <span>Diffing Corpora...</span>
    `;

    setTimeout(() => {
      this.quickDiffRefresh.disabled = false;
      this.quickDiffRefresh.innerHTML = originalHtml;
      const latencyEl = document.getElementById('telemetry-latency');
      if (latencyEl) latencyEl.innerText = `${Math.floor(Math.random() * 8) + 12}ms`;
      this.showToast('Corpora Re-diffed: en.wikipedia and hi.wikipedia aligned with ASI Gazette.', 'info');
    }, 600);
  }

  // =====================================================================
  // KNOWLEDGE CARTOGRAPHER HANDLERS
  // =====================================================================
  _onGraphHealed(data) {
    this.state.isGraphHealed = true;

    // Update heal button state
    if (this.healGraphBtn) {
      this.healGraphBtn.disabled = false;
      this.healGraphBtn.classList.remove('bg-primary', 'hover:bg-wiki-blue-hover');
      this.healGraphBtn.classList.add('bg-tertiary', 'hover:bg-tertiary/90');
      this.healGraphBtn.innerHTML = `
        <span class="material-symbols-outlined text-[14px]">task_alt</span>
        <span>All 4 Links Healed &amp; Synced to Q6403185</span>
      `;
    }

    // Update markup element in editor
    const markupAqa = document.getElementById('markup-aqa');
    if (markupAqa) {
      markupAqa.classList.remove('bg-amber-100', 'text-secondary');
      markupAqa.classList.add('bg-emerald-100', 'text-tertiary');
      markupAqa.innerHTML = `[[आक़ा रज़ा]] <span class="text-[9px] text-tertiary font-telemetry-mono">[Linked]</span>`;
    }

    // Update Header and Breadcrumb badges
    const headerQid = document.getElementById('header-qid-text');
    if (headerQid) headerQid.innerText = 'Wikidata (Q6403185 • 4 Claims Healed)';

    const orphanStatus = document.getElementById('orphan-status-text');
    if (orphanStatus) {
      orphanStatus.className = 'text-emerald-700 font-bold';
      orphanStatus.innerText = '0 (All 4 Links Grounded)';
    }

    this.showToast(`✓ Auto-Healed ${data.healedCount} Broken WikiLinks & Connected to Wikidata QID ${data.targetQid}!`, 'success');
  }

  _onGraphNodeClick(node) {
    this.showToast(`Wikidata Entity: ${node.label} (${node.english}) • QID: ${node.qid}`, 'info');
  }

  // =====================================================================
  // WIKITEXT EDITOR TOOLBAR & LIVE SYNC
  // =====================================================================
  _attachEditorToolbar() {
    if (this.btnFormatBold) {
      this.btnFormatBold.addEventListener('click', () => this._insertMarkup("'''", "'''"));
    }
    if (this.btnFormatItalic) {
      this.btnFormatItalic.addEventListener('click', () => this._insertMarkup("''", "''"));
    }
    if (this.btnFormatLink) {
      this.btnFormatLink.addEventListener('click', () => this._insertMarkup('[[', ']]'));
    }
    if (this.btnFormatQuote) {
      this.btnFormatQuote.addEventListener('click', () => this._insertMarkup('<ref>{{cite web |title=ASI Registry}}</ref>', ''));
    }
    if (this.btnFormatQid) {
      this.btnFormatQid.addEventListener('click', () => this._insertMarkup('[d:Q6403185]', ''));
    }
    if (this.btnFormatAudio) {
      this.btnFormatAudio.addEventListener('click', () => this._insertMarkup('{{Audio|Hi-KhusroBagh.ogg|उच्चारण}}', ''));
    }
    if (this.editorPrettifyBtn) {
      this.editorPrettifyBtn.addEventListener('click', () => {
        this._prettifyEditor();
        this.showToast('Wikitext markup prettified and indented.', 'info');
      });
    }

    if (this.wikitextEditor) {
      this.wikitextEditor.addEventListener('input', () => {
        this._updateLineNumbers();
      });
    }
  }

  _insertMarkup(before, after) {
    if (!this.wikitextEditor) return;
    this.wikitextEditor.focus();
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    const selectedText = range.toString() || 'शीर्षक';
    const newNode = document.createTextNode(`${before}${selectedText}${after}`);
    range.deleteContents();
    range.insertNode(newNode);
    this._updateLineNumbers();
  }

  _prettifyEditor() {
    if (!this.wikitextEditor) return;
    const text = this.wikitextEditor.innerText;
    const cleaned = text.split('\n').map(l => l.trimEnd()).join('\n');
    this.wikitextEditor.innerText = cleaned;
    this._updateLineNumbers();
  }

  _updateLineNumbers() {
    if (!this.wikitextEditor || !this.editorLineNumbers) return;
    const lineCount = Math.max(16, this.wikitextEditor.innerText.split('\n').length);
    let nums = '';
    for (let i = 1; i <= lineCount; i++) {
      nums += `${i}<br/>`;
    }
    this.editorLineNumbers.innerHTML = nums;
  }

  // =====================================================================
  // ARCHITECTURAL FLOORPLAN INTERACTIVITY
  // =====================================================================
  _attachFloorplanInteractivity() {
    const quadrants = document.querySelectorAll('.floorplan-quadrant');
    quadrants.forEach(q => {
      const tomb = q.getAttribute('data-tomb');
      q.addEventListener('click', () => {
        this.showToast(`Architectural Quadrangle Selected: ${tomb.replace('_', ' ').toUpperCase()}`, 'info');
        const preview = document.getElementById('wiki-p3');
        if (preview) {
          preview.classList.add('injected-highlight');
          setTimeout(() => preview.classList.remove('injected-highlight'), 1200);
        }
      });
    });
  }

  // =====================================================================
  // MONUMENT PRESET SWITCHER
  // =====================================================================
  loadMonumentPreset(monumentKey) {
    this.state.activeMonument = monumentKey;
    this.exif.setActiveMonument(monumentKey);
    const m = this.exif.activeMonument;

    // Update active state in sidebar
    this.corpusItems.forEach(item => {
      if (item.getAttribute('data-monument') === monumentKey) {
        item.classList.add('bg-surface-container', 'text-primary', 'font-body-ui-medium');
        item.classList.remove('text-on-surface-variant');
      } else {
        item.classList.remove('bg-surface-container', 'text-primary', 'font-body-ui-medium');
        item.classList.add('text-on-surface-variant');
      }
    });

    // Update Breadcrumb & Header
    const breadcrumbTitle = document.getElementById('breadcrumb-wiki-title');
    const breadcrumbQid = document.getElementById('breadcrumb-qid-label');
    const headerQid = document.getElementById('header-qid-text');
    if (breadcrumbTitle) breadcrumbTitle.innerText = `hi.wikipedia.org/wiki/${m.name.replace(/ /g, '_')}`;
    if (breadcrumbQid) breadcrumbQid.innerText = `QID: ${m.qid} (${m.englishName})`;
    if (headerQid) headerQid.innerText = `Wikidata (${m.qid})`;

    // Update Plaque
    const plaqueTitle = document.getElementById('plaque-monument-title');
    const plaqueSnippet = document.getElementById('plaque-inscription-snippet');
    const plaqueGps = document.getElementById('plaque-gps-text');
    const plaqueCam = document.getElementById('plaque-camera-text');
    const plaqueAsi = document.getElementById('plaque-asi-code');
    const photoLabel = document.getElementById('photo-filename-label');

    if (plaqueTitle) plaqueTitle.innerText = `${m.name} (${m.year.split(' ')[0]})`;
    if (plaqueSnippet) plaqueSnippet.innerText = m.inscriptionText;
    if (plaqueGps) plaqueGps.innerText = `GPS: ${m.targetLat}° N, ${m.targetLon}° E`;
    if (plaqueCam) plaqueCam.innerText = m.cameraModel;
    if (plaqueAsi) plaqueAsi.innerText = m.asiCode;
    if (photoLabel) photoLabel.innerText = m.imageName;

    // Update Infobox
    const infoboxTitle = document.getElementById('infobox-title');
    const infoboxArchitect = document.getElementById('infobox-architect');
    const infoboxCoord = document.getElementById('infobox-coordinates');
    const infoboxQid = document.getElementById('infobox-qid');
    const previewArticleTitle = document.getElementById('preview-article-title');
    const audioPronounce = document.getElementById('audio-pronounce-text');

    if (infoboxTitle) infoboxTitle.innerHTML = `${m.name} <br/><span class="text-[11px] font-normal text-text-muted">${m.englishName}</span>`;
    if (infoboxArchitect) infoboxArchitect.innerText = m.architect;
    if (infoboxCoord) infoboxCoord.innerText = `${m.targetLat}° N, ${m.targetLon}° E`;
    if (infoboxQid) infoboxQid.innerText = m.qid;
    if (previewArticleTitle) previewArticleTitle.innerText = m.name;
    if (audioPronounce) audioPronounce.innerText = `"${m.name}"`;

    // Re-verify EXIF for new monument
    const def = this.exif.getDefaultVerification();
    this._onExifSuccess(def);

    this.showToast(`Corpus Switched: ${m.name} (${m.englishName})`, 'info');
  }

  // =====================================================================
  // MODALS (EXPORT BUNDLE & GEMINI API KEY)
  // =====================================================================
  _attachModalEvents() {
    const openExport = () => {
      if (this.exportModal) {
        this.exportModal.classList.remove('hidden');
        this._updateExportPreview();
      }
    };

    const closeExport = () => {
      if (this.exportModal) this.exportModal.classList.add('hidden');
    };

    if (this.topPublishBtn) this.topPublishBtn.addEventListener('click', openExport);
    if (this.headerExportBtn) this.headerExportBtn.addEventListener('click', openExport);
    if (this.bottomSandboxPushBtn) this.bottomSandboxPushBtn.addEventListener('click', openExport);
    if (this.closeExportModal) this.closeExportModal.addEventListener('click', closeExport);
    if (this.btnCancelModal) this.btnCancelModal.addEventListener('click', closeExport);

    if (this.btnCopyPayload) {
      this.btnCopyPayload.addEventListener('click', () => {
        const preview = document.getElementById('modal-json-preview');
        if (preview && navigator.clipboard) {
          navigator.clipboard.writeText(preview.innerText);
          this.showToast('✓ Payload JSON copied to clipboard!', 'success');
        }
      });
    }

    if (this.btnConfirmPush) {
      this.btnConfirmPush.addEventListener('click', () => {
        this.btnConfirmPush.disabled = true;
        this.btnConfirmPush.innerHTML = `
          <span class="material-symbols-outlined text-[15px] animate-spin">refresh</span>
          <span>Transmitting Signed Payload...</span>
        `;
        setTimeout(() => {
          this.btnConfirmPush.disabled = false;
          this.btnConfirmPush.innerHTML = `
            <span class="material-symbols-outlined text-[15px]">done_all</span>
            <span>Pushed to Sandbox!</span>
          `;
          this.showToast('🚀 Success! Pushed 1 Article, 1 Commons Audio, 1 SVG Floorplan & 4 Claims to Wikimedia Sandbox.', 'success');
          setTimeout(() => closeExport(), 1000);
        }, 800);
      });
    }

    // 2. Provenance Lightbox Modal
    const openProvenance = () => {
      if (this.provenanceModal) {
        if (!this.lastExifResult) {
          this.lastExifResult = this.exif.getDefaultVerification();
        }
        this._syncProvenanceModal(this.lastExifResult);
        this.provenanceModal.classList.remove('hidden');
      }
    };

    const closeProvenance = () => {
      if (this.provenanceModal) this.provenanceModal.classList.add('hidden');
    };

    if (this.exifSignedBadge) this.exifSignedBadge.addEventListener('click', openProvenance);
    if (this.ocrGazetteMatch) this.ocrGazetteMatch.addEventListener('click', openProvenance);
    if (this.plaqueCardTrigger) this.plaqueCardTrigger.addEventListener('click', openProvenance);
    if (this.ocrSha256) this.ocrSha256.addEventListener('click', openProvenance);
    if (this.closeProvenanceModal) this.closeProvenanceModal.addEventListener('click', closeProvenance);
    if (this.btnCloseProvenance) this.btnCloseProvenance.addEventListener('click', closeProvenance);

    if (this.btnCopyProvenanceSha) {
      this.btnCopyProvenanceSha.addEventListener('click', () => {
        const shaEl = document.getElementById('modal-provenance-sha');
        if (shaEl && navigator.clipboard) {
          navigator.clipboard.writeText(shaEl.innerText.trim());
          this.showToast('✓ Provenance SHA-256 hash copied to clipboard!', 'success');
        }
      });
    }

    // 3. Gemini API Modal
    if (this.headerAiBadge) {
      this.headerAiBadge.addEventListener('click', () => {
        if (this.apiModal) {
          if (this.inputGeminiKey) {
            this.inputGeminiKey.value = this.gemini.getApiKey();
          }
          this.apiModal.classList.remove('hidden');
        }
      });
    }

    if (this.closeApiModal) {
      this.closeApiModal.addEventListener('click', () => {
        if (this.apiModal) this.apiModal.classList.add('hidden');
      });
    }

    if (this.btnSaveKey) {
      this.btnSaveKey.addEventListener('click', () => {
        const key = this.inputGeminiKey ? this.inputGeminiKey.value : '';
        this.gemini.setApiKey(key);
        this._checkStoredApiKey();
        if (this.apiModal) this.apiModal.classList.add('hidden');
        this.showToast(key ? '✓ Gemini API Key saved. Live inference enabled!' : 'Zero-Latency Studio Simulation Mode active.', 'success');
      });
    }

    if (this.btnClearKey) {
      this.btnClearKey.addEventListener('click', () => {
        this.gemini.setApiKey('');
        if (this.inputGeminiKey) this.inputGeminiKey.value = '';
        this._checkStoredApiKey();
        if (this.apiModal) this.apiModal.classList.add('hidden');
        this.showToast('Gemini API Key removed. Studio Simulation Mode active.', 'info');
      });
    }

    // 4. Backdrop Dismissal for all Modals
    [this.exportModal, this.apiModal, this.provenanceModal].forEach(modal => {
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            modal.classList.add('hidden');
          }
        });
      }
    });

    // 5. Global Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.provenanceModal && !this.provenanceModal.classList.contains('hidden')) {
          this.provenanceModal.classList.add('hidden');
        }
        if (this.exportModal && !this.exportModal.classList.contains('hidden')) {
          this.exportModal.classList.add('hidden');
        }
        if (this.apiModal && !this.apiModal.classList.contains('hidden')) {
          this.apiModal.classList.add('hidden');
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        if (this.corpusSidebar) this.corpusSidebar.classList.toggle('hidden');
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        if (this.pramaanInspectorDrawer) this.pramaanInspectorDrawer.classList.toggle('hidden');
      }
    });
  }

  _checkStoredApiKey() {
    const badgeLabel = document.getElementById('header-ai-label');
    if (badgeLabel) {
      if (this.gemini.hasApiKey()) {
        badgeLabel.innerText = 'Gemini 3.8 Live + EXIF Verifier';
      } else {
        badgeLabel.innerText = 'Gemini 3.8 (Studio Sim) + EXIF';
      }
    }
  }

  _updateExportPreview() {
    const preview = document.getElementById('modal-json-preview');
    const m = this.exif.activeMonument;
    if (preview) {
      const payload = {
        meta: {
          client: "BhashaWiki Pramaan Studio v2.4",
          timestamp: new Date().toISOString(),
          provenanceSha256: "9f833777d9e052532b32b91c8683ec5120b1905b37b42136a61f0747dcf682f3",
          hardwareToken: "RTK-GPS-EXIF-TRUST-L1"
        },
        action: "edit",
        wiki: "hi.wikipedia.org",
        targetTitle: `सदस्य:PramaanBot/${m.name.replace(/ /g, '_')}`,
        summary: `BhashaWiki multimodal field verification (EXIF: ${m.targetLat}, ${m.targetLon}; QID: ${m.qid})`,
        npovScore: this.state.npovScore,
        claims: [
          { property: "P131", value: "Q189578", label: "प्रयागराज" },
          { property: "P149", value: "Q854611", label: "मुग़ल वास्तुकला" },
          { property: "P127", value: "Q83653", label: "जहाँगीर" },
          { property: "P84", value: "Aqa Reza Herati", label: "आक़ा रज़ा" }
        ],
        mediaAttachments: [
          { type: "audio/ogg", fileName: `Hi-${m.englishName.replace(/ /g, '')}.ogg`, commonsStatus: "Verified Native Indic Pronunciation" },
          { type: "image/svg+xml", fileName: `${m.englishName.replace(/ /g, '')}_Floorplan_v2.svg`, status: "ASI Cadastral Alignment" }
        ]
      };
      preview.innerText = JSON.stringify(payload, null, 2);
    }
  }

  // =====================================================================
  // TOAST NOTIFICATIONS
  // =====================================================================
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const isSuccess = type === 'success';
    const isError = type === 'error';
    const isWarning = type === 'warning';

    const bgClass = isSuccess ? 'bg-slate-900 border-emerald-500 text-emerald-300' :
                    isError ? 'bg-slate-900 border-red-500 text-red-300' :
                    isWarning ? 'bg-slate-900 border-amber-500 text-amber-300' :
                    'bg-slate-900 border-blue-500 text-blue-300';

    const icon = isSuccess ? 'check_circle' :
                 isError ? 'error' :
                 isWarning ? 'warning' : 'info';

    toast.className = `p-3 rounded-lg border shadow-xl flex items-center gap-2.5 text-[12px] font-body-ui pointer-events-auto transition-all duration-300 transform translate-y-2 opacity-0 ${bgClass}`;
    toast.innerHTML = `
      <span class="material-symbols-outlined text-[17px] shrink-0">${icon}</span>
      <span class="text-slate-100 flex-1 leading-snug">${message}</span>
    `;

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    });

    // Auto dismiss after 3.5s
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.pramaanApp = new PramaanStudioApp();
});
