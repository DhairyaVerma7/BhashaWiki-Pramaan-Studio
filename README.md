# BhashaWiki Pramaan Studio (भाषाविकी प्रमाण स्टूडियो)
> **A voice-first, multimodal field-to-Wiki verification and knowledge-graph engine for Indian regional languages.**

---

## 🌟 Overview & Architecture

BhashaWiki Pramaan Studio bridges on-site archaeological ground truth (ASI monument plaques, physical inscriptions, field voice narrations, and EXIF coordinates) with Wikimedia knowledge repositories (**Hindi Wikipedia** and **Wikidata**).

### Project File & Module Structure

```
stitch_bhashawiki_pramaan_studio/
├── index.html                       # High-fidelity semantic UI shell
├── package.json                     # Project manifest & start scripts
├── README.md                        # Documentation & architecture guide
├── DESIGN.md                        # Design system & color tokens
├── js/
│   ├── app.js                       # Primary orchestrator & event bus
│   └── modules/
│       ├── speechRecognition.js     # Web Speech API & Hinglish voice capture
│       ├── exifVerifier.js          # EXIF GPS extraction & SHA-256 verifier
│       ├── geminiService.js         # Gemini 3.8 Flash NPOV neutrality firewall
│       └── knowledgeGraph.js        # 2D Force-directed SVG Wikidata cartographer
```

---

## 🚀 Key Modules & Interactive Features

### 1. Web Speech API & Voice-First Field Narration (`speechRecognition.js`)
- **Dual-Mode Audio Capture**: Native `webkitSpeechRecognition` / `SpeechRecognition` configured for `hi-IN` (Devanagari/Hinglish), with high-realism simulated dictation fallback for restricted environments.
- **Live Waveform Visualizer**: Animates 10-band frequency bars using Web Audio API (`AnalyserNode`) or simulated audio spectral flow.
- **Interim Token Streaming**: Streams live transcription tokens into the UI (`#live-transcript`) with confidence highlighting.
- **AI Encyclopedic Clean-Up**: Automatically triggers a Gemini post-processing pass upon recording completion to convert casual colloquial notes into formal encyclopedic Devanagari prose with `<ref>` citations.
- **Native Speech Synthesis TTS**: Plays native `.ogg` audio pronunciation when clicking the audio play widget.

### 2. Client-Side EXIF GPS & Vision OCR Verifier (`exifVerifier.js`)
- **Metadata Extraction**: Reads GPS coordinates (`latitude`, `longitude`), timestamp, and camera hardware signatures via `exifr` and HTML5 `FileReader`.
- **Geospatial Grounding**: Matches coordinates against archaeological monument bounding boxes (Prayagraj: Khusro Bagh at `25.4448° N, 81.8213° E`, Allahabad Fort, Anand Bhavan).
- **Cryptographic Provenance**: Computes SHA-256 hardware provenance hash using Web Crypto API.
- **Photo Upload & Presets**: Drag-and-drop or click to upload any photo (`.jpg`, `.png`), dynamically updating the OCR Extraction box, confidence bars, and Field Station HUD.

### 3. Gemini 3.8 Flash NPOV Neutrality Firewall (`geminiService.js`)
- **Structured JSON Audits**: Evaluates text against Wikipedia Neutral Point of View (`WP:NPOV`) policies.
- **Subjective Adjective Detection**: Flags non-neutral superlatives like `"अद्वितीय और सबसे सुंदर"` and suggests empirical replacements: `"मुग़ल स्थापत्य कला का प्रमुख उदाहरण"`.
- **One-Click Bias Fix (`#fix-bias-btn`)**: Instantly updates the wikitext markup and live reader preview, raises Epistemic Trust score from 96 to 99, and switches the amber alert card to an emerald verified badge.
- **Live Gemini API Support**: Click the top AI badge to input your Google Gemini API key for live inference with `gemini-3.8-flash`, or use the built-in zero-latency studio simulation mode.

### 4. Cross-Language Fact-Gap Diff Engine (`app.js`)
- **Comparative Diff**: Compares facts between `en.wikipedia` (18 facts) and `hi.wikipedia` (4 facts).
- **Fact Injection Pills**:
  - `court-artist`: Injects Aqa Reza Herati (1622) into wikitext and reader preview.
  - `sandstone-arcade`: Injects Sultan Begum 3-tier sandstone arcade architecture.
  - `sync-citations`: Injects 4 validated citations from UP District Gazetteer and ASI.
- **Batch Injection**: Injects all missing discrepancies in one click, achieving parity between English and Hindi Wikipedia.
- **Visual Pulse Animation**: Injected sentences highlight with a smooth green pulse animation (`.injected-highlight`).

### 5. Interactive 2D Knowledge Cartographer (`knowledgeGraph.js`)
- **Force-Directed SVG Graph**: Renders central entity hub (`Khusro Bagh Q6403185`) connected to entities (`Prayagraj`, `Mughal Architecture`, `Jahangir`).
- **Orphan Link Detection**: Highlights broken links in red with pulsing indicators (`Aqa Reza`, `Nisar Begum`).
- **Auto-Healing (`#heal-graph-btn`)**: Resolves 4 broken links, animates lines from red dashed to glowing emerald solid lines with pulsing packet flow, and connects entities to Wikidata QID `Q6403185`.
- **Node Inspection**: Hover over any node to view entity metadata, English name, QID, and property handles.

### 6. Sandbox Push & Export Bundle
- **MediaWiki Sandbox Push**: Exports complete signed bundle:
  - Wikitext Article body
  - Commons `.ogg` Audio
  - SVG Floorplan diagram
  - 4 Wikidata claims
  - SHA-256 integrity hash
- **Copy JSON**: One-click clipboard copy of the full MediaWiki API edit payload.

---

## 💻 Running the Application

### Option A: Via Local Web Server (Recommended)
```bash
# Using Node / npx
npx serve -l 3000 .
# Open http://localhost:3000 in your browser
```

### Option B: Via Python HTTP Server
```bash
python -m http.server 3000
# Open http://localhost:3000 in your browser
```

---

## 🏆 Hackathon Demo Flow Checklist

1. **Voice Input**: Click the orange microphone button. Speak or let the simulator stream Hinglish notes into the live ASR box. Click again to watch Gemini automatically clean it up into formal Devanagari encyclopedic prose!
2. **Audio Pronunciation**: Click the play arrow next to `"उच्चारण: खुसरो बाग़"` to hear native Indic speech synthesis.
3. **EXIF Upload**: Click the brass plaque card to upload a photo or switch presets in the left sidebar to watch EXIF coordinates and gazette trust recalculate live.
4. **Fix Bias**: Click the orange `"Fix to Neutral"` button under the AI Audit card. Watch the alert card turn emerald green and the score gauge surge from 96 to 99!
5. **Auto-Heal Knowledge Graph**: Click `"⚡ Auto-Heal 4 Broken WikiLinks"`. Watch the red orphan nodes turn emerald green and link to QID `Q6403185`!
6. **Inject Facts**: Click the fact pills or `"Inject All Discrepancies"` to see facts smoothly append into the Wikitext editor and live Vector-2022 reader.
7. **Publish to Sandbox**: Click `"Publish Diff to Sandbox"` or `"Export Package"` to inspect the cryptographic SHA-256 signed payload and push to the Wikimedia sandbox!
