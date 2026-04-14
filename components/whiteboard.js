window._doRenderWhiteboard = async function renderWhiteboard(sessionId) {
  updatePageSEO({ title: "STEM Majestic Lab", description: "Visual STEM learning board.", url: `/whiteboard/${sessionId}`, noindex: true });
  await ensureFabric();
  await ensureMathJax();
  const isTutor = State.user && (State.user.role === 'tutor' || State.user.role === 'admin');
  window._isLabHost = isTutor;
  // Expose institution name for PDF branding (set externally before renderWhiteboard is called)
  if (!window._wbInstitutionName) window._wbInstitutionName = '';

  const html = `
    <div style="display:flex; flex-direction:column; height:100vh; width:100%; position:fixed; top:0; left:0; background:#0D1B40; z-index:9999;">

      <!-- HEADER -->
      <div style="background:linear-gradient(90deg,#0D1B40 0%,#1A3060 100%); padding:8px 18px; display:flex; align-items:center; justify-content:space-between; border-bottom:3px solid #1A5FFF; flex-shrink:0; position:relative;">
        <div style="display:flex; align-items:center; gap:12px;">
          <img src="https://hdpkjomganndiiprnpok.supabase.co/storage/v1/object/public/assets/mathrone%20logo1.png" style="height:28px; filter:brightness(0) invert(1)"/>
          <span style="color:#fff; font-weight:900; font-size:15px; letter-spacing:1px;">⚗️ STEM MAJESTIC LAB</span>
          ${isTutor ? '<span style="background:#F5A623;color:#0D1B40;font-size:10px;font-weight:900;padding:2px 8px;border-radius:99px;margin-left:4px;">TUTOR � MOD</span>' : '<span style="background:#10B981;color:#fff;font-size:10px;font-weight:900;padding:2px 8px;border-radius:99px;margin-left:4px;">STUDENT</span>'}
        </div>
        <!-- CENTER BRAND -->
        <div style="position:absolute;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;pointer-events:none;user-select:none;">
          <span style="font-family:'Playfair Display',serif;font-weight:900;font-size:16px;color:#fff;letter-spacing:0.5px;white-space:nowrap;">Mathrone Academy</span>
          <span style="font-size:9px;color:rgba(245,166,35,0.85);letter-spacing:2px;text-transform:uppercase;font-weight:700;">STEM Majestic Lab</span>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
  <button class="btn btn-sm" onclick="toggleResourceDrawer()" style="background:#F5A623; color:#1a1a1a; font-weight:800; font-size:12px;">🧪 Labs & Sims</button>
  
  ${(State.user && State.user.role) ? `
    <button class="btn btn-sm" onclick="toggleLabVideo()" id="lab-video-btn" style="background:rgba(255,255,255,0.12); color:#fff; border:1px solid rgba(255,255,255,0.25); font-size:12px;" title="Start video call inside the lab">📹 Video Call</button>
    <button class="btn btn-sm" onclick="toggleScreenShare()" id="share-screen-btn" style="background:rgba(255,255,255,0.12); color:#fff; border:1px solid rgba(255,255,255,0.25); font-size:12px; display:none;" title="Share your screen with the student">🖥️ Share Screen</button>
  ` : `
    <button class="btn btn-sm" onclick="toggleSplitScreen()" id="lab-video-btn" style="background:rgba(255,255,255,0.12); color:#fff; border:1px solid rgba(255,255,255,0.25); font-size:12px;" title="Open Jitsi video meeting (new tab)">📹 Video Meet ↗</button>
  `}

  <button class="btn btn-sm" onclick="toggleShapesPanel()" style="background:rgba(255,255,255,0.12); color:#fff; border:1px solid rgba(255,255,255,0.25); font-size:12px;">📐 Shapes</button>
  <button class="btn btn-sm" onclick="exitMajesticLab()" style="background:#EF4444; color:#fff; font-size:12px;">✕ Exit</button>
</div>
      </div>

      <!-- RESOURCE DRAWER -->
      <div id="wb-resource-drawer" style="position:fixed; top:0; right:0; width:340px; height:100%; background:#fff; z-index:10001; transform:translateX(100%); transition:transform 0.3s ease; display:flex; flex-direction:column; box-shadow:-8px 0 40px rgba(0,0,0,0.3);">
        <div style="padding:16px 20px; background:var(--navy); color:#fff; display:flex; justify-content:space-between; align-items:center; flex-shrink:0;">
          <span style="font-weight:900; font-size:15px;">🔬 MAJESTIC SCIENCE HUB</span>
          <button onclick="toggleResourceDrawer()" style="background:none; border:none; color:#fff; font-size:22px; cursor:pointer; line-height:1;">✕</button>
        </div>

        <!-- Search + Custom URL -->
        <div style="padding:14px 16px; background:#f8faff; border-bottom:1px solid #e0e8ff; flex-shrink:0;">
          <div style="display:flex; gap:6px;">
            <input type="text" id="custom-link-input" class="input" style="min-height:36px; font-size:12px; flex:1;" placeholder="Paste any URL (PhET, YouTube, GeoGebra...)">
            <button class="btn btn-primary btn-sm" onclick="loadCustomLink()" style="white-space:nowrap;">▶ Load</button>
          </div>
          <p style="font-size:10px; color:var(--g400); margin-top:4px;">YouTube, PhET, GeoGebra, Khan Academy, etc.</p>
        </div>

        <!-- Library -->
        <div style="padding:12px 16px; overflow-y:auto; flex:1;">
          ${buildLibraryHTML()}
        </div>
      </div>

      <!-- SHAPES PANEL -->
      <div id="wb-shapes-panel" style="position:fixed; top:0; left:0; width:300px; height:100%; background:#fff; z-index:10001; transform:translateX(-100%); transition:transform 0.3s ease; display:flex; flex-direction:column; box-shadow:8px 0 40px rgba(0,0,0,0.3); overflow-y:auto;">
        <div style="padding:14px 18px; background:var(--navy); color:#fff; display:flex; justify-content:space-between; align-items:center; position:sticky; top:0; z-index:1;">
          <span style="font-weight:900; font-size:14px;">📐 ALL SHAPES</span>
          <button onclick="toggleShapesPanel()" style="background:none; border:none; color:#fff; font-size:20px; cursor:pointer; line-height:1;">✕</button>
        </div>
        <div style="padding:12px;">
          ${buildShapesPanelHTML()}
        </div>
      </div>

      <!-- MAIN TOOLBAR -->
      <div class="wb-toolbar" style="background:#1a2a50; padding:6px 12px; display:flex; align-items:center; gap:5px; flex-wrap:wrap; flex-shrink:0; border-bottom:2px solid #0D1B40;">
        <!-- Drawing Tools -->
        <!-- Page Management -->
        <div style="display:flex; align-items:center; gap:5px; background:rgba(0,0,0,0.3); padding:4px 8px; border-radius:8px; margin-right:8px;">
          <button class="wb-btn" onclick="prevWBPage()" title="Previous Page" style="min-width:30px; padding:4px;">◀</button>
          <span id="page-num-display" style="color:#fff; font-weight:bold; font-size:12px; min-width:40px; text-align:center;">1 / 1</span>
          <button class="wb-btn" onclick="nextWBPage()" title="Next Page" style="min-width:30px; padding:4px;">▶</button>
          <button class="wb-btn host-only" onclick="addWBPage()" style="background:#10B981; color:white; font-weight:bold;">+ Page</button>
        </div>
        <button class="wb-btn host-only" onclick="downloadLabAsPDF()" style="background:#1A5FFF; color:white; margin-right:10px; font-weight:bold;">💾 Save PDF</button>

        <div class="tool-sep" style="width:1px; height:28px; background:rgba(255,255,255,0.2); margin:0 4px;"></div>
        <button class="wb-btn active" id="tool-pencil" onclick="setSTEMTool('pencil')" title="Freehand Draw">✏️ Draw</button>
        <button class="wb-btn" id="tool-select" onclick="setSTEMTool('select')" title="Select & Move">🖱️ Select</button>
        <button class="wb-btn" id="tool-text" onclick="addSTEMText()" title="Add Text">Aa Text</button>
        <button class="wb-btn" id="tool-eraser" onclick="setSTEMTool('eraser')" title="Eraser">🧹 Erase</button>
        <button class="wb-btn" id="tool-line" onclick="startLineMode()" title="Draw straight line">╱ Line</button>
        <button class="wb-btn" id="tool-laser" onclick="setSTEMTool('laser')" title="Laser Pointer">🔦 Laser</button>
        <button class="wb-btn host-only" onclick="document.getElementById('wb-bg-upload').click()" title="Upload Worksheet/Image">🖼️ Upload</button>
        <input type="file" id="wb-bg-upload" accept="image/*" style="display:none" onchange="uploadWBBackground(this)">
        <button class="wb-btn host-only" id="tool-present" onclick="document.getElementById('wb-doc-upload').click()" title="Present PDF, PowerPoint or Word document" style="background:rgba(245,166,35,0.25);color:#F5A623;border:1px solid rgba(245,166,35,0.4);">📄 Present Doc</button>
        <input type="file" id="wb-doc-upload" accept=".pdf,.ppt,.pptx,.doc,.docx" style="display:none" onchange="openPresentationDoc(this)">

        <div class="tool-sep" style="width:1px; height:28px; background:rgba(255,255,255,0.2); margin:0 4px;"></div>

        <!-- Instruments -->
        <button class="wb-btn" onclick="addGraduatedRuler()" title="Graduated Ruler">📏 Ruler</button>
        <button class="wb-btn" onclick="addProtractor()" title="Dual-Sided Protractor">📐 Protractor</button>
        <button class="wb-btn" onclick="addSetSquare()" title="Set Square">📐 Set Sq</button>
        <button class="wb-btn" onclick="addCompass()" title="Compass symbol">🔵 Compass</button>
        <button class="wb-btn" onclick="addGrid()" title="Graph Grid">⊞ Grid</button>
        <button class="wb-btn" onclick="addNumberLine()" title="Number Line">↔ NumLine</button>
        <button class="wb-btn" onclick="addMathAxes()" title="2D XY Axes">📊 XY Axes</button>
        <button class="wb-btn" onclick="add3DAxes()" title="3D XYZ Axes">🧊 3D Axes</button>

        <div class="tool-sep" style="width:1px; height:28px; background:rgba(255,255,255,0.2); margin:0 4px;"></div>

        <!-- Formula & Greek -->
        <button class="wb-btn" onclick="openFormulaEditor()" title="Formula Editor with symbol keyboard">𝑓 Formula</button>
        <button class="wb-btn" onclick="toggleGreekPanel()" title="Insert Greek Letters" id="greek-toggle-btn">O Greek</button>
        <button class="wb-btn" onclick="toggleSciFormulas()" title="Science Formula Library � click to place on board" id="sci-formulas-btn">📋 Formulas</button>

        <div class="tool-sep" style="width:1px; height:28px; background:rgba(255,255,255,0.2); margin:0 4px;"></div>

        <!-- Style Controls -->
        <div style="display:flex; align-items:center; gap:6px;">
          <input type="color" id="wb-color" value="#1A5FFF" onchange="updateSTEMStyle()" style="width:30px; height:30px; cursor:pointer; border:none; background:none; border-radius:4px;" title="Color">
          <!-- Quick pen color swatches -->
          <div style="display:flex;gap:3px;align-items:center;" title="Pen Color">
            <span style="color:rgba(255,255,255,0.5);font-size:10px;margin-right:2px;">✏️</span>
            <button onclick="setWBColor('#1A5FFF')" title="Blue"   style="width:18px;height:18px;border-radius:50%;background:#1A5FFF;border:2px solid rgba(255,255,255,0.3);cursor:pointer;"></button>
            <button onclick="setWBColor('#EF4444')" title="Red"    style="width:18px;height:18px;border-radius:50%;background:#EF4444;border:2px solid rgba(255,255,255,0.3);cursor:pointer;"></button>
            <button onclick="setWBColor('#10B981')" title="Green"  style="width:18px;height:18px;border-radius:50%;background:#10B981;border:2px solid rgba(255,255,255,0.3);cursor:pointer;"></button>
            <button onclick="setWBColor('#F59E0B')" title="Orange" style="width:18px;height:18px;border-radius:50%;background:#F59E0B;border:2px solid rgba(255,255,255,0.3);cursor:pointer;"></button>
            <button onclick="setWBColor('#8B5CF6')" title="Purple" style="width:18px;height:18px;border-radius:50%;background:#8B5CF6;border:2px solid rgba(255,255,255,0.3);cursor:pointer;"></button>
            <button onclick="setWBColor('#ffffff')" title="White"  style="width:18px;height:18px;border-radius:50%;background:#ffffff;border:2px solid rgba(255,255,255,0.5);cursor:pointer;"></button>
            <button onclick="setWBColor('#000000')" title="Black"  style="width:18px;height:18px;border-radius:50%;background:#000000;border:2px solid rgba(255,255,255,0.3);cursor:pointer;"></button>
          </div>
          <!-- Shape fill (for selected objects) -->
          <select id="wb-fill" onchange="updateSTEMStyle()" class="input" style="width:76px; min-height:28px; font-size:10px; padding:2px 4px;" title="Shape Fill">
            <option value="transparent">No Fill</option>
            <option value="#fff">White</option>
            <option value="#E8F0FF">Lt Blue</option>
            <option value="#FEF3C7">Yellow</option>
            <option value="#D1FAE5">Green</option>
            <option value="#FEE2E2">Red</option>
            <option value="#000000">Black</option>
          </select>
          <select id="wb-width" onchange="updateSTEMStyle()" class="input" style="width:70px; min-height:28px; font-size:11px; padding:2px 4px;">
            <option value="1">1px</option>
            <option value="2" selected>2px</option>
            <option value="4">4px</option>
            <option value="8">8px</option>
          </select>
        </div>

        <div style="flex:1"></div>

        <!-- Actions -->
        <button class="wb-btn" onclick="undoWB()" title="Undo">↩ Undo</button>
        <button class="wb-btn" onclick="copySelected()" title="Copy">⎘ Copy</button>
        <button class="wb-btn btn-danger" onclick="clearWB()" style="background:rgba(239,68,68,0.2); color:#fca5a5;" title="Clear all">🗑 Clear</button>
      </div>

      <!-- GREEK LETTERS PANEL (slides down below toolbar) -->
      <div id="wb-greek-panel" style="display:none; background:#1a2a50; border-bottom:2px solid #0D1B40; padding:6px 14px; flex-shrink:0; flex-wrap:wrap; gap:3px; max-height:130px; overflow-y:auto;">
        <div style="color:rgba(255,255,255,0.5); font-size:10px; font-weight:700; width:100%; margin-bottom:4px; text-transform:uppercase; letter-spacing:1px;">Lowercase � click to insert on canvas</div>
        <div id="greek-buttons" style="display:flex; flex-wrap:wrap; gap:3px;"></div>
      </div>

      <!-- FORMULA EDITOR PANEL -->
      <div id="wb-formula-panel" style="display:none; background:#111d38; border-bottom:2px solid #0D1B40; padding:8px 14px; flex-shrink:0;">
        <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
          <span style="color:rgba(255,255,255,0.6); font-size:11px; font-weight:700;">FORMULA BUILDER:</span>
          <input id="formula-input" type="text" placeholder="LaTeX: \frac{a}{b}, \lim_{x\to\infty}, \int_0^1 x\,dx, \sum_{n=1}^{\infty}" 
            style="flex:1; min-width:240px; max-width:500px; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.25); border-radius:6px; color:#fff; padding:5px 10px; font-size:14px; font-family:'Courier New', monospace; outline:none;"
            oninput="previewLatex()" onkeydown="if(event.key==='Enter') placeFormula()">
          <div id="formula-preview" style="min-width:120px;max-width:220px;background:rgba(255,255,255,0.95);border-radius:6px;padding:4px 10px;font-size:18px;color:#111;text-align:center;min-height:34px;display:flex;align-items:center;justify-content:center;overflow:hidden;"></div>
          <select id="formula-size" style="background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.25); border-radius:6px; color:#fff; padding:4px 6px; font-size:12px;">
            <option value="18">Small</option>
            <option value="26" selected>Medium</option>
            <option value="36">Large</option>
            <option value="48">XL</option>
          </select>
          <button onclick="placeFormula()" style="background:#1A5FFF; color:#fff; border:none; border-radius:6px; padding:6px 14px; font-size:12px; font-weight:700; cursor:pointer;">✓ Place</button>
          <button onclick="closeFormulaEditor()" style="background:rgba(255,255,255,0.1); color:#ccc; border:1px solid rgba(255,255,255,0.2); border-radius:6px; padding:6px 10px; font-size:12px; cursor:pointer;">✕</button>
        </div>
        <!-- Symbol keyboard rows -->
        <div id="formula-symbols" style="display:flex; flex-wrap:wrap; gap:3px; margin-top:7px;"></div>
      </div>

      <!-- SCIENCE FORMULAS LIBRARY PANEL -->
      <div id="wb-sci-formulas-panel" style="display:none; background:#0e1a38; border-bottom:2px solid #0D1B40; padding:8px 14px; flex-shrink:0; max-height:220px; overflow-y:auto;">
        <div style="color:rgba(255,255,255,0.55); font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;">📋 Science Formula Library � click any formula to place it on the board</div>
        <div id="sci-formula-groups" style="display:flex; flex-wrap:wrap; gap:4px;"></div>
      </div>

      <!-- WORK AREA -->
      <!-- BUILT-IN VIDEO CALL PANEL -->
<div id="lab-video-panel" style="display:none; position:fixed; bottom:70px; right:16px; z-index:9999; background:#0D1B40; border-radius:14px; padding:10px; box-shadow:0 8px 40px rgba(0,0,0,0.6); border:2px solid rgba(26,95,255,0.4); width:280px; min-width:200px; min-height:160px; resize:both; overflow:auto;">
  <!-- DRAG HANDLE -->
  <div id="lab-vid-drag-handle" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; cursor:grab; user-select:none;">
    <span style="color:#fff; font-size:12px; font-weight:800;">⠿ 📹 Live Video Call</span>
    <div style="display:flex; gap:6px;">
      <button id="lab-vid-mute-btn" onclick="toggleLabVideoMute()" style="background:rgba(255,255,255,0.1); border:none; color:#fff; border-radius:6px; padding:3px 8px; font-size:11px; cursor:pointer;">🎤 Mute</button>
      <button id="lab-vid-cam-btn" onclick="toggleLabVideoCam()" style="background:rgba(255,255,255,0.1); border:none; color:#fff; border-radius:6px; padding:3px 8px; font-size:11px; cursor:pointer;">📷 Cam</button>
      <button onclick="stopLabVideo()" style="background:#EF4444; border:none; color:#fff; border-radius:6px; padding:3px 8px; font-size:11px; cursor:pointer;">✕</button>
    </div>
  </div>
  <!-- Local video (me) -->
  <div style="position:relative; margin-bottom:6px;">
    <video id="lab-local-video" autoplay muted playsinline style="width:100%; border-radius:8px; background:#000; display:block; max-height:140px; object-fit:cover;"></video>
    <span style="position:absolute; bottom:4px; left:6px; background:rgba(0,0,0,0.6); color:#fff; font-size:9px; padding:2px 5px; border-radius:4px;">You</span>
  </div>
  <!-- Remote video -->
  <div style="position:relative;">
    <video id="lab-remote-video" autoplay playsinline style="width:100%; border-radius:8px; background:#111; display:block; max-height:140px; object-fit:cover;"></video>
    <span id="lab-remote-label" style="position:absolute; bottom:4px; left:6px; background:rgba(0,0,0,0.6); color:#fff; font-size:9px; padding:2px 5px; border-radius:4px;">Waiting...</span>
    <div id="lab-call-status" style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; color:rgba(255,255,255,0.5); font-size:11px; font-weight:700; background:rgba(0,0,0,0.5); border-radius:8px;">📡 Waiting for partner...</div>
  </div>
  <!-- Resize hint -->
  <div style="text-align:right; color:rgba(255,255,255,0.2); font-size:9px; margin-top:4px;">↔ drag to move · ↘ resize</div>
</div>
<div id="wb-work-area" style="display:flex; flex:1; overflow:hidden;">
        <!-- BOARD -->
        <div style="flex:1; position:relative; overflow:hidden;">
          <!-- LAB OVERLAY (iFrame for sims) -->
          <div id="sim-overlay" style="display:none; position:absolute; inset:0; background:#fff; z-index:500;">
            <div style="padding:8px 16px; background:var(--navy); color:#fff; display:flex; justify-content:space-between; align-items:center; flex-shrink:0;">
              <span id="sim-title" style="font-weight:700; font-size:13px;">🔬 Virtual STEM Lab</span>
              <div style="display:flex; gap:8px;">
                <button onclick="popoutSim()" class="btn btn-sm" style="background:rgba(255,255,255,0.15); color:#fff; font-size:11px;">↗ Pop Out</button>
                <button onclick="closeExternalContent()" class="btn btn-sm btn-danger" style="font-size:11px;">✕ Back to Board</button>
              </div>
            </div>
            <iframe id="sim-iframe" allow="camera; microphone; fullscreen; accelerometer; gyroscope" sandbox="allow-scripts allow-forms allow-popups allow-presentation" style="width:100%; height:calc(100% - 42px); border:none;"></iframe>
          </div>
     <!-- DOCUMENT PRESENTATION OVERLAY -->
          <!-- DOCUMENT PRESENTATION OVERLAY (FULL SCREEN VERSION) -->
<div id="doc-present-overlay" style="display:none; position:fixed; inset:0; background:#0d1b40; z-index:9998; flex-direction:column;">
  <!-- Slide nav bar -->
  <div style="background:#0a1628; padding:6px 14px; display:flex; align-items:center; gap:8px; flex-shrink:0; border-bottom:2px solid #1A5FFF; flex-wrap:nowrap; overflow-x:auto;">
    <span style="color:#F5A623;font-weight:900;font-size:13px;white-space:nowrap;">📄 PRESENTATION</span>
    
    <div style="display:flex;align-items:center;gap:4px;background:rgba(255,255,255,0.05);padding:2px 8px;border-radius:6px;">
      <button onclick="docPrevSlide()" class="wb-btn" style="padding:4px 8px;">◀</button>
      <span id="doc-slide-counter" style="color:#fff;font-size:11px;font-weight:700;min-width:50px;text-align:center;">1 / 1</span>
      <button onclick="docNextSlide()" class="wb-btn" style="padding:4px 8px;">▶</button>
    </div>

    <div style="display:flex;align-items:center;gap:4px;margin-left:8px;">
      <button onclick="docSetTool('pen')" id="doc-tool-pen" class="wb-btn" style="padding:3px 8px;font-size:11px;">✏️ Draw</button>
      <button onclick="docSetTool('highlight')" id="doc-tool-highlight" class="wb-btn" style="padding:3px 8px;font-size:11px;">🟡 High</button>
      <button onclick="docSetTool('arrow')" id="doc-tool-arrow" class="wb-btn" style="padding:3px 8px;font-size:11px;">↗ Arrow</button>
      <button onclick="docSetTool('text')" id="doc-tool-text" class="wb-btn" style="padding:3px 8px;font-size:11px;">Aa Text</button>
      <button onclick="triggerFloatingImage()" id="doc-tool-img" class="wb-btn" style="padding:3px 8px;font-size:11px;">🖼️ Img</button>
      <input type="file" id="doc-float-img-upload" accept="image/*" style="display:none" onchange="addDocFloatingImage(this)">
      <button onclick="docSetTool('laser')" id="doc-tool-laser" class="wb-btn" style="padding:3px 8px;font-size:11px;">🔦 Laser</button>
    </div>

    <!-- ZOOM CONTROLS -->
    <div style="display:flex;align-items:center;gap:4px;margin-left:8px;border-left:1px solid rgba(255,255,255,0.1);padding-left:8px;">
      <button onclick="zoomDoc(-0.1)" class="wb-btn" style="padding:4px 8px;">➖</button>
      <span id="doc-zoom-label" style="color:#fff;font-size:11px;min-width:35px">100%</span>
      <button onclick="zoomDoc(0.1)" class="wb-btn" style="padding:4px 8px;">➕</button>
      <button onclick="resetDocZoom()" class="wb-btn" style="padding:4px 8px;">🔄</button>
    </div>

    <div style="margin-left:auto;display:flex;gap:6px;align-items:center;">
      <input type="color" id="doc-pen-color" value="#EF4444" style="width:24px;height:24px;border:none;background:none;cursor:pointer;" title="Pen color">
      <select id="doc-pen-width" style="background:rgba(255,255,255,0.1);color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:4px;padding:2px 4px;font-size:11px;cursor:pointer;" title="Stroke width">
        <option value="2">Thin</option>
        <option value="4" selected>Normal</option>
        <option value="8">Thick</option>
        <option value="14">Bold</option>
      </select>
      <button onclick="closePresentationMode()" class="wb-btn" style="background:#EF4444;color:#fff;padding:4px 10px;font-size:11px;">✕ Exit</button>
    </div>
  </div>

  <!-- Main Viewport: Scrollable -->
  <div id="doc-viewport" style="flex:1; overflow:auto; background:#1e1e2e; padding:0;">
    <div id="doc-zoom-container" style="position:relative; transform-origin: top left; transition: transform 0.1s ease; width:100%;">
        <div id="doc-canvas-wrap" style="position:relative; display:block; line-height:0; box-shadow:0 20px 80px rgba(0,0,0,0.5);">
          <canvas id="doc-slide-canvas" style="display:block; background:#fff;"></canvas>
          <canvas id="doc-anno-canvas" style="position:absolute; top:0; left:0; cursor:crosshair; pointer-events:none;"></canvas>
          <div id="doc-floating-items" style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:495;"></div>
  <div id="doc-textboxes" style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:496;" id="doc-textboxes"></div>
          <div id="doc-laser-dot" style="display:none;position:absolute;width:15px;height:15px;background:#ff0000;border-radius:50%;pointer-events:none;z-index:500;box-shadow:0 0 10px #f00,0 0 20px #f00;transform:translate(-50%,-50%);transition:left 0.04s linear,top 0.04s linear;"></div>
          
        </div>
    </div>
  </div>

  <!-- Thumb Strip -->
  <div id="doc-thumb-strip" style="height:60px;background:#0a1628;border-top:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;gap:6px;padding:4px 12px;overflow-x:auto;flex-shrink:0;"></div>
</div>
          <!-- CANVAS -->
          <div id="canvas-container" style="width:100%; height:100%; overflow:auto; background:#1a2a50; display:flex; justify-content:center; align-items:flex-start; padding:0; box-sizing:border-box;">
            <div id="grid-box" style="background:#fff; box-shadow:0 8px 48px rgba(0,0,0,0.4); border-radius:4px; margin:0; flex-shrink:0; width:100%;">
              <canvas id="wb-canvas-el"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- STATUS BAR -->
      <div id="wb-status" style="background:#0D1B40; color:rgba(255,255,255,0.5); padding:3px 14px; font-size:10px; display:flex; gap:16px; flex-shrink:0; border-top:1px solid rgba(255,255,255,0.08);">
        <span>✏️ Click to draw · Select to move/resize · Delete key to remove</span>
        <span id="wb-obj-count" style="margin-left:auto;">Objects: 0</span>
        <span id="wb-zoom-label">Zoom: 100%</span>
      </div>
    </div>
  `;
  render(html);
  // Show host-only controls for hosts, keep hidden for students
  setTimeout(() => {
    const isHost = (State.user && (State.user.role === 'tutor' || State.user.role === 'admin')) || window._isLabHost;
    if (isHost) {
      document.querySelectorAll('.host-only').forEach(el => { el.style.setProperty('display', 'inline-flex', 'important'); });
    }
  }, 50);
  setTimeout(() => {
    initWhiteboardSync(sessionId);
    // Auto-prompt video if this is a real scheduled session (not a solo lab)
    // A real session ID is a UUID (36 chars with dashes); tutor direct labs start with 'tutor_'
    const isRealSession = sessionId && sessionId.length === 36 && sessionId.includes('-');
    if (isRealSession) {
      setTimeout(() => {
        const panel = document.getElementById('lab-video-panel');
        if (panel) {
          // Show a subtle prompt instead of auto-starting (respects privacy)
          const prompt = document.createElement('div');
          prompt.style.cssText = 'position:fixed;top:70px;right:16px;z-index:9999;background:#0D1B40;color:#fff;padding:12px 16px;border-radius:10px;font-size:12px;font-weight:700;box-shadow:0 4px 20px rgba(0,0,0,0.4);border:1px solid rgba(26,95,255,0.4);display:flex;gap:10px;align-items:center;';
          prompt.innerHTML = `📹 Start video call with your session partner? <button onclick="toggleLabVideo();this.parentElement.remove();" style="background:#1A5FFF;color:#fff;border:none;border-radius:6px;padding:4px 10px;cursor:pointer;font-size:11px;font-weight:800;">Start</button><button onclick="this.parentElement.remove()" style="background:none;border:none;color:rgba(255,255,255,0.5);cursor:pointer;font-size:14px;">?</button>`;
          document.body.appendChild(prompt);
          setTimeout(() => prompt?.remove(), 15000);
        }
      }, 2000);
    }
  }, 100);
}

function buildLibraryHTML() {
  const STEM_LIBRARY = [
    { group: "? PhET � Physics", emoji: "?", items: [
      { n: "Forces & Motion Basics", u: "https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_en.html" },
      { n: "Projectile Motion", u: "https://phet.colorado.edu/sims/html/projectile-motion/latest/projectile-motion_en.html" },
      { n: "Wave on a String", u: "https://phet.colorado.edu/sims/html/wave-on-a-string/latest/wave-on-a-string_en.html" },
      { n: "Wave Interference", u: "https://phet.colorado.edu/sims/html/wave-interference/latest/wave-interference_en.html" },
      { n: "Circuit Construction DC", u: "https://phet.colorado.edu/sims/html/circuit-construction-kit-dc/latest/circuit-construction-kit-dc_en.html" },
      { n: "Gravity & Orbits", u: "https://phet.colorado.edu/sims/html/gravity-and-orbits/latest/gravity-and-orbits_en.html" },
      { n: "Energy Skate Park", u: "https://phet.colorado.edu/sims/html/energy-skate-park-basics/latest/energy-skate-park-basics_en.html" },
      { n: "Friction", u: "https://phet.colorado.edu/sims/html/friction/latest/friction_en.html" },
      { n: "Balancing Act", u: "https://phet.colorado.edu/sims/html/balancing-act/latest/balancing-act_en.html" },
      { n: "Geometric Optics", u: "https://phet.colorado.edu/sims/html/geometric-optics/latest/geometric-optics_en.html" },
      { n: "Nuclear Fission", u: "https://phet.colorado.edu/sims/html/nuclear-fission/latest/nuclear-fission_en.html" },
      { n: "Faraday's Law", u: "https://phet.colorado.edu/sims/html/faradays-law/latest/faradays-law_en.html" },
      { n: "Charges & Fields", u: "https://phet.colorado.edu/sims/html/charges-and-fields/latest/charges-and-fields_en.html" },
      { n: "Color Vision", u: "https://phet.colorado.edu/sims/html/color-vision/latest/color-vision_en.html" }
    ]},
    { group: "??? PhET � Thermodynamics", emoji: "???", items: [
      { n: "States of Matter", u: "https://phet.colorado.edu/sims/html/states-of-matter/latest/states-of-matter_en.html" },
      { n: "States of Matter (Basics)", u: "https://phet.colorado.edu/sims/html/states-of-matter-basics/latest/states-of-matter-basics_en.html" },
      { n: "Gas Properties", u: "https://phet.colorado.edu/sims/html/gas-properties/latest/gas-properties_en.html" },
      { n: "Gases Intro", u: "https://phet.colorado.edu/sims/html/gases-intro/latest/gases-intro_en.html" },
      { n: "Blackbody Spectrum", u: "https://phet.colorado.edu/sims/html/blackbody-spectrum/latest/blackbody-spectrum_en.html" },
      { n: "Greenhouse Effect", u: "https://phet.colorado.edu/sims/html/greenhouse-effect/latest/greenhouse-effect_en.html" },
      { n: "Energy Forms & Changes", u: "https://phet.colorado.edu/sims/html/energy-forms-and-changes/latest/energy-forms-and-changes_en.html" },
      { n: "Fourier: Making Waves", u: "https://phet.colorado.edu/sims/html/fourier-making-waves/latest/fourier-making-waves_en.html" }
    ]},
    { group: "?? PhET � Chemistry", emoji: "??", items: [
      { n: "Build an Atom", u: "https://phet.colorado.edu/sims/html/build-an-atom/latest/build-an-atom_en.html" },
      { n: "Reactants, Products & Leftovers", u: "https://phet.colorado.edu/sims/html/reactants-products-and-leftovers/latest/reactants-products-and-leftovers_en.html" },
      { n: "Molecular Shapes", u: "https://phet.colorado.edu/sims/html/molecule-shapes/latest/molecule-shapes_en.html" },
      { n: "Beer's Law Lab", u: "https://phet.colorado.edu/sims/html/beers-law-lab/latest/beers-law-lab_en.html" },
      { n: "Acid-Base Solutions", u: "https://phet.colorado.edu/sims/html/acid-base-solutions/latest/acid-base-solutions_en.html" },
      { n: "Concentration", u: "https://phet.colorado.edu/sims/html/concentration/latest/concentration_en.html" },
      { n: "Molecule Polarity", u: "https://phet.colorado.edu/sims/html/molecule-polarity/latest/molecule-polarity_en.html" },
      { n: "Periodic Table (PhET)", u: "https://phet.colorado.edu/sims/html/build-a-nucleus/latest/build-a-nucleus_en.html" }
    ]},
    { group: "?? Mathematics Tools", emoji: "??", items: [
      { n: "GeoGebra Graphing", u: "https://www.geogebra.org/calculator" },
      { n: "GeoGebra Geometry", u: "https://www.geogebra.org/geometry" },
      { n: "GeoGebra 3D Calculator", u: "https://www.geogebra.org/3d" },
      { n: "GeoGebra Classic", u: "https://www.geogebra.org/classic" },
      { n: "GeoGebra CAS", u: "https://www.geogebra.org/cas" },
      { n: "Desmos Graphing Calculator", u: "https://www.desmos.com/calculator" },
      { n: "Desmos Geometry", u: "https://www.desmos.com/geometry" },
      { n: "Desmos Scientific Calculator", u: "https://www.desmos.com/scientific" },
      { n: "Wolfram Alpha", u: "https://www.wolframalpha.com/" },
      { n: "Symbolab", u: "https://www.symbolab.com/" },
      { n: "PhET � Fractions Intro", u: "https://phet.colorado.edu/sims/html/fractions-intro/latest/fractions-intro_en.html" },
      { n: "PhET � Area Model Algebra", u: "https://phet.colorado.edu/sims/html/area-model-algebra/latest/area-model-algebra_en.html" }
    ]},
    { group: "?? Biology & Life Science", emoji: "??", items: [
      { n: "Learn Genetics (Utah)", u: "https://learn.genetics.utah.edu/" },
      { n: "HHMI BioInteractive", u: "https://www.biointeractive.org/classroom-resources" },
      { n: "Cells Alive", u: "https://www.cellsalive.com/" },
      { n: "PhET � Natural Selection", u: "https://phet.colorado.edu/sims/html/natural-selection/latest/natural-selection_en.html" },
      { n: "PhET � Gene Expression", u: "https://phet.colorado.edu/sims/html/gene-expression-essentials/latest/gene-expression-essentials_en.html" },
      { n: "Phylo (Genomics Game)", u: "https://phylo.cs.mcgill.ca/" },
      { n: "CK-12 Biology Labs", u: "https://www.ck12.org/student/" }
    ]},
    { group: "?? Earth, Space & Environment", emoji: "??", items: [
      { n: "Stellarium Web (Planetarium)", u: "https://stellarium-web.org/" },
      { n: "NASA Eyes on the Solar System", u: "https://eyes.nasa.gov/apps/solar-system/#/home" },
      { n: "USGS Earthquake Map", u: "https://earthquake.usgs.gov/earthquakes/map/" },
      { n: "PhET � Greenhouse Effect", u: "https://phet.colorado.edu/sims/html/greenhouse-effect/latest/greenhouse-effect_en.html" },
      { n: "PhET � My Solar System", u: "https://phet.colorado.edu/sims/html/my-solar-system/latest/my-solar-system_en.html" }
    ]},
    { group: "?? Interactive Physics & Engineering", emoji: "??", items: [
      { n: "Falstad Circuit Simulator", u: "https://www.falstad.com/circuit/circuitjs.html" },
      { n: "myPhysicsLab", u: "https://www.myphysicslab.com/" },
      { n: "oPhysics Simulations", u: "https://ophysics.com/" },
      { n: "Physics Classroom Interactives", u: "https://www.physicsclassroom.com/Physics-Interactives" },
      { n: "PhET � Ohm's Law", u: "https://phet.colorado.edu/sims/html/ohms-law/latest/ohms-law_en.html" },
      { n: "PhET � Resistance in a Wire", u: "https://phet.colorado.edu/sims/html/resistance-in-a-wire/latest/resistance-in-a-wire_en.html" }
    ]},
    { group: "?? Video Learning", emoji: "??", items: [
      { n: "Khan Academy", u: "https://www.khanacademy.org/" },
      { n: "CrashCourse (YouTube � Physics)", u: "https://www.youtube.com/watch?v=ZM8ECpBuQYE" },
      { n: "3Blue1Brown (YouTube � Math)", u: "https://www.youtube.com/watch?v=WUvTyaaNkzM" },
      { n: "Kurzgesagt (YouTube � Science)", u: "https://www.youtube.com/watch?v=1AElONvi9WQ" },
      { n: "MIT OpenCourseWare", u: "https://ocw.mit.edu/" },
      { n: "OpenStax Free Textbooks", u: "https://openstax.org/subjects" }
    ]},
    { group: "??? Coding & Computer Science", emoji: "??", items: [
      { n: "p5.js Web Editor", u: "https://editor.p5js.org/" },
      { n: "Scratch 3.0 Editor", u: "https://scratch.mit.edu/projects/editor/" },
      { n: "Blockly Games", u: "https://blockly.games/" },
      { n: "CS Unplugged", u: "https://csunplugged.org/en/" },
    ]},
    { group: "?? Interactive Chemistry Tools", emoji: "??", items: [
      { n: "Periodic Table (ptable.com)", u: "https://ptable.com/" },
      { n: "ChemDoodle Web", u: "https://web.chemdoodle.com/" },
      { n: "Molecular Workbench (Concord)", u: "https://learn.concord.org/" }
    ]},
    { group: "?? PhysiWorld � Physics Simulations", emoji: "??", items: [
      { n: "PhysiWorld Home", u: "https://physiworld.com/" },
      { n: "Projectile Simulator", u: "https://physiworld.com/projectile-motion/" },
      { n: "Simple Harmonic Motion", u: "https://physiworld.com/simple-harmonic-motion/" },
      { n: "Electric Field Lines", u: "https://physiworld.com/electric-field/" },
      { n: "Wave Superposition", u: "https://physiworld.com/wave-superposition/" },
      { n: "Lens & Mirrors Optics", u: "https://physiworld.com/optics/" }
    ]},
    { group: "?? Rigs of Rods � Physics Sandbox", emoji: "??", items: [
      { n: "Rigs of Rods Official", u: "https://www.rigsofrods.org/" },
      { n: "RoR Forum & Downloads", u: "https://forum.rigsofrods.org/" },
      { n: "RoR Repository (Mods)", u: "https://repository.rigsofrods.org/" },
      { n: "RoR Documentation", u: "https://docs.rigsofrods.org/" }
    ]},
    { group: "?? The Science Playground", emoji: "??", items: [
      { n: "thescienceplayground.com", u: "https://www.thescienceplayground.com/" },
      { n: "Interactive Science Experiments", u: "https://www.thescienceplayground.com/experiments/" },
      { n: "Science Games", u: "https://www.thescienceplayground.com/games/" },
      { n: "Science Videos", u: "https://www.thescienceplayground.com/videos/" }
    ]},
    { group: "?? More Interactive Resources", emoji: "??", items: [
      { n: "Walter Fendt Physics Applets", u: "https://www.walter-fendt.de/html5/phen/" },
      { n: "nrich.maths.org", u: "https://nrich.maths.org/" },
      { n: "Polypad (Interactive Textbook)", u: "https://polypad.amplify.com/" },
      { n: "Science Buddies", u: "https://www.sciencebuddies.org/" },
      { n: "ExploreLearning Gizmos", u: "https://www.explorelearning.com/" },
      { n: "Labster Virtual Labs", u: "https://www.labster.com/simulations/" },
      { n: "ChemCollective Virtual Lab", u: "http://chemcollective.org/vlab/vlab.php" },
      { n: "PhET � All Simulations", u: "https://phet.colorado.edu/en/simulations/filter?type=html" }
    ]}
  ];

  return STEM_LIBRARY.map(cat => `
    <div style="margin-bottom:16px;">
      <div style="font-weight:900; font-size:11px; color:var(--blue); text-transform:uppercase; letter-spacing:0.5px; padding:4px 0; border-bottom:1px solid var(--g100); margin-bottom:6px;">${cat.group}</div>
      <div style="display:flex; flex-direction:column; gap:3px;">
        ${cat.items.map(item => `
          <button onclick="loadExternalContent('${item.u}', '${item.n.replace(/'/g, "\\'")}')"
            style="text-align:left; background:var(--g50); border:1px solid var(--g200); border-radius:6px; padding:6px 10px; font-size:12px; color:var(--navy); cursor:pointer; transition:all 0.15s; font-family:inherit;"
            onmouseover="this.style.background='var(--sky)'; this.style.borderColor='var(--blue2)'"
            onmouseout="this.style.background='var(--g50)'; this.style.borderColor='var(--g200)'">
            ${cat.emoji} ${item.n}
          </button>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function buildShapesPanelHTML() {
  const categories = [
    { label: "2D Flat Shapes", shapes: [
      { id: "triangle", label: "Triangle", icon: "?" },
      { id: "square", label: "Square", icon: "?" },
      { id: "rect", label: "Rectangle", icon: "?" },
      { id: "circle", label: "Circle", icon: "?" },
      { id: "ellipse", label: "Ellipse", icon: "?" },
      { id: "semicircle", label: "Semicircle", icon: "?" },
      { id: "sector", label: "Sector/Pie", icon: "?" },
      { id: "segment", label: "Arc Segment", icon: "?" },
      { id: "parallelogram", label: "Parallelogram", icon: "?" },
      { id: "rhombus", label: "Rhombus", icon: "?" },
      { id: "trapezium", label: "Trapezium", icon: "?" },
      { id: "kite", label: "Kite", icon: "??" },
      { id: "pentagon", label: "Pentagon", icon: "?" },
      { id: "hexagon", label: "Hexagon", icon: "?" },
      { id: "heptagon", label: "Heptagon", icon: "?" },
      { id: "octagon", label: "Octagon", icon: "?" },
      { id: "nonagon", label: "Nonagon", icon: "?" },
      { id: "decagon", label: "Decagon", icon: "?" },
      { id: "star", label: "Star (5pt)", icon: "?" },
      { id: "star6", label: "Star (6pt)", icon: "?" },
      { id: "arrow", label: "Arrow Vector", icon: "?" },
      { id: "cross", label: "Cross/Plus", icon: "?" }
    ]},
    { label: "3D Solids", shapes: [
      { id: "cube3d", label: "Cube", icon: "??" },
      { id: "cuboid3d", label: "Cuboid", icon: "??" },
      { id: "sphere3d", label: "Sphere", icon: "??" },
      { id: "cylinder3d", label: "Cylinder", icon: "??" },
      { id: "cone3d", label: "Cone", icon: "??" },
      { id: "pyramid3d", label: "Pyramid", icon: "??" },
      { id: "tetrahedron3d", label: "Tetrahedron", icon: "??" },
      { id: "octahedron3d", label: "Octahedron", icon: "??" },
      { id: "hemisphere3d", label: "Hemisphere", icon: "?" },
      { id: "torus3d", label: "Torus", icon: "??" }
    ]},
    { label: "Curves & Special", shapes: [
      { id: "parabola", label: "Parabola", icon: "n" },
      { id: "hyperbola", label: "Hyperbola", icon: "?" },
      { id: "spiral", label: "Spiral", icon: "??" },
      { id: "sinwave", label: "Sine Wave", icon: "?" },
      { id: "coswave", label: "Cosine Wave", icon: "?" },
      { id: "tanwave", label: "Tan Wave", icon: "?" }
    ]}
  ];

  return categories.map(cat => `
    <div style="margin-bottom:16px;">
      <div style="font-weight:900; font-size:11px; color:var(--blue); text-transform:uppercase; margin-bottom:8px; padding-bottom:4px; border-bottom:2px solid var(--sky2);">${cat.label}</div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:5px;">
        ${cat.shapes.map(s => `
          <button onclick="addSTEMShape('${s.id}'); toggleShapesPanel();"
            style="background:var(--g50); border:1px solid var(--g200); border-radius:8px; padding:8px 6px; font-size:11px; color:var(--navy); cursor:pointer; text-align:center; font-family:inherit; transition:all 0.15s;"
            onmouseover="this.style.background='var(--sky)'; this.style.borderColor='var(--blue2)'"
            onmouseout="this.style.background='var(--g50)'; this.style.borderColor='var(--g200)'">
            <div style="font-size:18px; margin-bottom:2px;">${s.icon}</div>
            <div style="font-size:10px; font-weight:600; line-height:1.2;">${s.label}</div>
          </button>
        `).join('')}
      </div>
    </div>
  `).join('');
}

async function initWhiteboardSync(sessionId) {
  // Safety guard � if fabric still not ready, bail cleanly
  if (!window.fabric || !window.fabric.Canvas) {
    const canvasContainer = document.getElementById('canvas-container');
    if (canvasContainer) canvasContainer.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#fff;font-size:16px;font-weight:700;">⚠️ Drawing engine unavailable. Please refresh.</div>';
    return;
  }
  // Dispose any previous canvas instance to avoid ghost canvases on re-entry
  if (window.wbInstance) {
    try { window.wbInstance.dispose(); } catch(e) {}
    window.wbInstance = null;
  }
  const isTutor = State.user && (State.user.role === 'tutor' || State.user.role === 'admin');
  const isMobile = window.innerWidth < 768;
  const headerEl = document.getElementById('wb-header');
  const toolbarEl = document.querySelector('.wb-toolbar');
  const statusEl = document.getElementById('wb-status');
  const headerH = headerEl ? headerEl.offsetHeight : 60;
  const toolbarH = toolbarEl ? toolbarEl.offsetHeight : 48;
  const statusH = statusEl ? statusEl.offsetHeight : 22;
  const usedHeight = headerH + toolbarH + statusH + 10;
  const boardWidth = isMobile ? window.innerWidth : window.innerWidth;
  const boardHeight = isMobile ? (window.innerHeight - usedHeight - 60) : (window.innerHeight - usedHeight);
  const canvas = new fabric.Canvas('wb-canvas-el', { width: boardWidth, height: boardHeight, isDrawingMode: true });
  window.wbInstance = canvas;
  const triggerCloudSave = () => {
    if (isTutor) {
        clearTimeout(window._saveTimeout);
        window._saveTimeout = setTimeout(() => window.saveToCloud(), 2000);
    }
};
canvas.on('object:added', triggerCloudSave);
canvas.on('object:modified', triggerCloudSave);
canvas.on('object:removed', triggerCloudSave);
canvas.on('path:created', triggerCloudSave);

  // --- CLOUD PERSISTENCE LOGIC ---
  window.saveToCloud = async () => {
    const isHost = State.user && (State.user.role === 'tutor' || State.user.role === 'admin');
    if (!isHost) return;
    const data = canvas.toJSON(['id']);
    // Save locally as backup always
    try {
      const pages = JSON.parse(localStorage.getItem('wb_pages_' + sessionId) || '[]');
      pages[window._wbCurrentPage] = data;
      localStorage.setItem('wb_pages_' + sessionId, JSON.stringify(pages));
    } catch(e) {}
    // Try cloud save silently � won't crash if endpoint missing
    try {
      await fetch(API_URL + '/lab/whiteboard/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, page_index: window._wbCurrentPage, json_data: data })
      });
    } catch (e) { /* cloud unavailable � local save already done */ }
  };

  window.loadFromCloud = async () => {
    // Try cloud first, fall back to localStorage
    try {
      const pages = await fetch(API_URL + `/lab/whiteboard/${sessionId}`).then(r => r.json());
      if (Array.isArray(pages) && pages.length > 0) {
        window._wbNotebook = pages.map(p => p.json_data);
        canvas.loadFromJSON(window._wbNotebook[0], () => { canvas.renderAll(); updatePageUI(); });
        return;
      }
    } catch (e) { /* cloud unavailable, try local */ }
    // Fallback: load from localStorage
    try {
      const local = JSON.parse(localStorage.getItem('wb_pages_' + sessionId) || '[]');
      if (local.length > 0) {
        window._wbNotebook = local;
        canvas.loadFromJSON(window._wbNotebook[0], () => { canvas.renderAll(); updatePageUI(); });
      }
    } catch(e) {}
  };

  // --- MULTI-PAGE NOTEBOOK LOGIC (Cloud Integrated) ---
  window._wbNotebook = [canvas.toJSON(['id'])]; 
  window._wbCurrentPage = 0;

  window.addWBPage = async () => {
    await window.saveToCloud();
    window._wbNotebook[window._wbCurrentPage] = canvas.toJSON(['id']);
    window._wbNotebook.push({}); 
    window._wbCurrentPage = window._wbNotebook.length - 1;
    canvas.clear();
    updatePageUI();
    if(channel) channel.send({ type: 'broadcast', event: 'page-change', payload: { page: window._wbCurrentPage, total: window._wbNotebook.length } });
  };

  window.nextWBPage = async () => {
    if (window._wbCurrentPage < window._wbNotebook.length - 1) {
      await window.saveToCloud();
      window._wbNotebook[window._wbCurrentPage] = canvas.toJSON(['id']);
      window._wbCurrentPage++;
      canvas.loadFromJSON(window._wbNotebook[window._wbCurrentPage], () => { canvas.renderAll(); updatePageUI(); });
      if(channel) channel.send({ type: 'broadcast', event: 'page-change', payload: { page: window._wbCurrentPage, total: window._wbNotebook.length } });
    }
  };

  window.prevWBPage = async () => {
    if (window._wbCurrentPage > 0) {
      await window.saveToCloud();
      window._wbNotebook[window._wbCurrentPage] = canvas.toJSON(['id']);
      window._wbCurrentPage--;
      canvas.loadFromJSON(window._wbNotebook[window._wbCurrentPage], () => { canvas.renderAll(); updatePageUI(); });
      if(channel) channel.send({ type: 'broadcast', event: 'page-change', payload: { page: window._wbCurrentPage, total: window._wbNotebook.length } });
    }
  };

  window.loadFromCloud(); // Initial Load

  function updatePageUI() {
    const el = document.getElementById('page-num-display');
    if(el) el.textContent = `${window._wbCurrentPage + 1} / ${window._wbNotebook.length}`;
  }

  // --- PDF EXPORT LOGIC ---
  // --- Branded PDF EXPORT ---
  window.downloadLabAsPDF = async () => {
    if (!window.jspdf) {
      toast("Loading PDF library...", "info");
      try { await ensureJsPDF(); } catch(e) { toast("Failed to load PDF library.", "err"); return; }
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('l', 'px', [canvas.width, canvas.height]);
    const logoUrl = "https://hdpkjomganndiiprnpok.supabase.co/storage/v1/object/public/assets/mathrone%20logo1.png";

    // Save current page state
    window._wbNotebook[window._wbCurrentPage] = canvas.toJSON(['id']);

    for (let i = 0; i < window._wbNotebook.length; i++) {
      if (i > 0) doc.addPage([canvas.width, canvas.height], 'l');
      
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width; 
      tempCanvas.height = canvas.height;
      const staticCanvas = new fabric.StaticCanvas(tempCanvas);
      
      await new Promise(resolve => {
        // 1. Load the background drawing
        staticCanvas.loadFromJSON(window._wbNotebook[i], () => {
          
          // 2. Add the Mathrone Logo
          fabric.Image.fromURL(logoUrl, (img) => {
            img.scaleToWidth(100); // Set logo size
            img.set({
              left: canvas.width - 120, // Position top right
              top: 20,
              opacity: 0.9
            });
            staticCanvas.add(img);

            // 3. Add Page footer text � co-branded
            const institutionName = window._wbInstitutionName || '';
            const footerLeft = new fabric.Text(
              institutionName ? `${institutionName}  �  Powered by Mathrone Academy STEM Majestic Lab` : `Mathrone Academy STEM Majestic Lab`,
              { left: 40, top: canvas.height - 38, fontSize: 13, fill: '#8A98B8', fontFamily: 'DM Sans', fontWeight: '700' }
            );
            const footerRight = new fabric.Text(`Page ${i+1} of ${window._wbNotebook.length}`, {
              left: canvas.width - 120, top: canvas.height - 38,
              fontSize: 13, fill: '#8A98B8', fontFamily: 'DM Sans'
            });
            staticCanvas.add(footerLeft);
            staticCanvas.add(footerRight);
            // Separator line
            const footerLine = new fabric.Line([30, canvas.height - 48, canvas.width - 30, canvas.height - 48], { stroke: '#c0cce0', strokeWidth: 1 });
            staticCanvas.add(footerLine);
            // footer variable removed � footerLeft/footerRight/footerLine already added above

            staticCanvas.renderAll();
            
            // 4. Add the finished branded canvas to PDF
            doc.addImage(staticCanvas.toDataURL({format: 'png'}), 'PNG', 0, 0, canvas.width, canvas.height);
            resolve();
          }, { crossOrigin: 'anonymous' }); // Required to avoid security errors with the image URL
        });
      });
    }
    
    doc.save(`Mathrone_Lesson_Notes_${new Date().toLocaleDateString().replace(/\//g,'-')}.pdf`);
    toast("Branded PDF Downloaded ✅");
  };
  window.addEventListener('resize', () => {
    if (window.wbInstance) {
      const hEl = document.getElementById('wb-header');
      const tEl = document.querySelector('.wb-toolbar');
      const sEl = document.getElementById('wb-status');
      const used = (hEl ? hEl.offsetHeight : 60) + (tEl ? tEl.offsetHeight : 48) + (sEl ? sEl.offsetHeight : 22) + 10;
      window.wbInstance.setWidth(window.innerWidth);
      window.wbInstance.setHeight(window.innerHeight - used);
      window.wbInstance.renderAll();
    }
  });
  window._wbHistory = [];

  canvas.freeDrawingBrush.width = 2;
  canvas.freeDrawingBrush.color = '#1A5FFF';
// -- TABLET / STYLUS SUPPORT (Huion H640P, Wacom, XP-Pen, etc.) ----------
  (() => {
    const upperCanvas = canvas.upperCanvasEl;
    // Enable pointer events for stylus pressure
    upperCanvas.style.touchAction = 'none';

    let _stylusDown = false;
    upperCanvas.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'pen' || e.pointerType === 'touch') {
        _stylusDown = true;
        upperCanvas.setPointerCapture(e.pointerId);
        // Apply pressure to brush width (pressure 0�1, scale to 1�12px)
        if (e.pressure && e.pressure > 0 && canvas.isDrawingMode) {
          canvas.freeDrawingBrush.width = Math.max(1, Math.round(e.pressure * 12));
        }
      }
    }, { passive: false });
    upperCanvas.addEventListener('pointermove', (e) => {
      if (!_stylusDown) return;
      if ((e.pointerType === 'pen' || e.pointerType === 'touch') && e.pressure > 0 && canvas.isDrawingMode) {
        canvas.freeDrawingBrush.width = Math.max(1, Math.round(e.pressure * 12));
      }
    }, { passive: true });
    upperCanvas.addEventListener('pointerup', (e) => {
      _stylusDown = false;
      // Restore to selected stroke width
      const wSel = parseInt(document.getElementById('wb-width')?.value || '2');
      if (canvas.isDrawingMode) canvas.freeDrawingBrush.width = wSel;
    }, { passive: true });
    upperCanvas.addEventListener('pointercancel', () => { _stylusDown = false; });
    // Prevent default touch scroll while drawing
    upperCanvas.addEventListener('touchstart', e => { if (canvas.isDrawingMode) e.preventDefault(); }, { passive: false });
    upperCanvas.addEventListener('touchmove', e => { if (canvas.isDrawingMode) e.preventDefault(); }, { passive: false });
  })();
  // -- END TABLET SUPPORT ---------------------------------------------------
  const client = getSupabase();
  if (!client) return;

  // Optimized channel config to prevent REST fallback error
  const channel = client.channel('wb_' + sessionId, {
    config: { broadcast: { self: false, ack: false } }
  });
  
  window._wbChannel = channel;

  channel.subscribe((status) => {
    if (status === 'SUBSCRIBED') console.log("Majestic Lab: Realtime Connected ✅");
  });

  // Object count updater
  const updateCount = () => {
    const el = document.getElementById('wb-obj-count');
    if (el) el.textContent = `Objects: ${canvas.getObjects().length}`;
  };
  canvas.on('object:added', updateCount);
  canvas.on('object:removed', updateCount);

  // --- KEYBOARD SHORTCUTS ---
  window.addEventListener('keydown', (e) => {
    if ((e.key === 'Delete' || e.key === 'Backspace') && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      canvas.getActiveObjects().forEach(obj => {
        canvas.remove(obj);
        if (channel) channel.send({ type: 'broadcast', event: 'del', payload: { id: obj.id } });
      });
      canvas.discardActiveObject().renderAll();
    }
    if (e.ctrlKey && e.key === 'z') undoWB();
    if (e.ctrlKey && e.key === 'c') copySelected();
    if (e.ctrlKey && e.key === 'a') { setSTEMTool('select'); canvas.discardActiveObject(); const sel = new fabric.ActiveSelection(canvas.getObjects(), {canvas}); canvas.setActiveObject(sel); canvas.renderAll(); }
  });

  // --- UNDO ---
  window.undoWB = () => {
    const objs = canvas.getObjects();
    if (objs.length) canvas.remove(objs[objs.length - 1]);
    canvas.renderAll();
  };

  // --- COPY ---
  window.copySelected = () => {
    const active = canvas.getActiveObject();
    if (!active) return;
    active.clone(cloned => {
      cloned.set({ left: active.left + 20, top: active.top + 20, id: 'sh_' + Math.random() });
      canvas.add(cloned);
      canvas.setActiveObject(cloned).renderAll();
    });
  };

  // --- CLEAR ---
  window.clearWB = () => {
    if (confirm('Clear the entire board?')) { 
        canvas.clear(); 
        canvas.renderAll(); 
        if (channel) channel.send({ type: 'broadcast', event: 'clear', payload: {} });
        window.saveToCloud();
    }
  };

  // --- GRADUATED RULER ---
  window.addGraduatedRuler = () => {
    setSTEMTool('select');
    // Each cm = 37.8px at 96dpi. We use 38px per cm for clarity.
    const PX_PER_CM = 38;
    const CMS = 20; // 20 cm ruler
    const width = PX_PER_CM * CMS;
    const height = 48;
    const color = document.getElementById('wb-color').value;
    const marks = [];

    // Body
    marks.push(new fabric.Rect({ left: 0, top: 0, width, height, fill: 'rgba(255,248,220,0.92)', stroke: '#b8860b', strokeWidth: 2, rx: 3, ry: 3, selectable: false }));

    for (let mm = 0; mm <= CMS * 10; mm++) {
      const x = mm * (PX_PER_CM / 10);
      const isCm = mm % 10 === 0;
      const isHalf = mm % 5 === 0;
      const tickH = isCm ? 28 : isHalf ? 18 : 10;
      marks.push(new fabric.Line([x, 0, x, tickH], { stroke: isCm ? '#222' : '#666', strokeWidth: isCm ? 1.5 : 0.8, selectable: false }));
      if (isCm) {
        const cm = mm / 10;
        marks.push(new fabric.IText(cm.toString(), { left: x + 2, top: 29, fontSize: 11, fontWeight: '700', fill: '#333', selectable: false, fontFamily: 'DM Sans' }));
      }
    }
    // Label
    marks.push(new fabric.IText('cm', { left: width - 28, top: 32, fontSize: 10, fill: '#888', selectable: false }));

    const ruler = new fabric.Group(marks, {
      left: 150, top: 180,
      id: 'rul_' + Math.random(),
      lockScalingX: true,   // Prevent X resize which breaks scale
      lockScalingY: true,   // Prevent Y resize
      hasControls: true,
      hasBorders: true,
    });
    // Only allow rotation and moving, not scaling
    ruler.setControlsVisibility({ mt: false, mb: false, ml: false, mr: false, tl: false, tr: false, bl: false, br: false });
    canvas.add(ruler);
    canvas.setActiveObject(ruler).renderAll();
    toast("📏 Ruler placed — scale locked at 1cm per division. Rotate freely.", "info");
  };

  // --- DUAL-SIDED PROTRACTOR (graduated both inner and outer) ---
  window.addProtractor = () => {
    setSTEMTool('select');
    const radius = 150;
    const color = document.getElementById('wb-color').value;
    const elements = [];

    // Semicircle background
    const bg = new fabric.Circle({ radius, startAngle: 0, endAngle: Math.PI, fill: 'rgba(240,248,255,0.85)', stroke: color, strokeWidth: 2.5, originX: 'center', originY: 'center' });
    elements.push(bg);

    // Baseline
    elements.push(new fabric.Line([-radius, 0, radius, 0], { stroke: color, strokeWidth: 2, selectable: false }));
    elements.push(new fabric.Line([-radius - 10, 0, radius + 10, 0], { stroke: color, strokeWidth: 1, strokeDashArray: [4, 3], selectable: false }));

    // OUTER graduations (0?180, left to right)
    for (let i = 0; i <= 180; i += 1) {
      const rad = (180 - i) * (Math.PI / 180);
      const isMaj = i % 10 === 0;
      const isMid = i % 5 === 0;
      const tickLen = isMaj ? 22 : (isMid ? 14 : 8);
      const x1 = Math.cos(rad) * radius;
      const y1 = -Math.sin(rad) * radius;
      const x2 = Math.cos(rad) * (radius - tickLen);
      const y2 = -Math.sin(rad) * (radius - tickLen);
      elements.push(new fabric.Line([x1, y1, x2, y2], { stroke: color, strokeWidth: isMaj ? 1.5 : 0.8, selectable: false }));
      if (isMaj) {
        const tx = Math.cos(rad) * (radius - 36);
        const ty = -Math.sin(rad) * (radius - 36);
        elements.push(new fabric.IText(i.toString(), { left: tx, top: ty, fontSize: i % 20 === 0 ? 13 : 10, fontWeight: '700', fill: '#1A5FFF', originX: 'center', originY: 'center', selectable: false }));
      }
    }

    // INNER graduations (180?0, reversed direction, shown inside)
    const innerR = radius - 28;
    for (let i = 0; i <= 180; i += 1) {
      const rad = (180 - i) * (Math.PI / 180);
      const mirrorDeg = 180 - i;
      const isMaj = mirrorDeg % 10 === 0;
      const isMid = mirrorDeg % 5 === 0;
      if (!isMaj && !isMid) continue;
      const tickLen = isMaj ? 14 : 8;
      const x1 = Math.cos(rad) * innerR;
      const y1 = -Math.sin(rad) * innerR;
      const x2 = Math.cos(rad) * (innerR - tickLen);
      const y2 = -Math.sin(rad) * (innerR - tickLen);
      elements.push(new fabric.Line([x1, y1, x2, y2], { stroke: '#F59E0B', strokeWidth: isMaj ? 1.5 : 0.8, selectable: false }));
      if (isMaj && mirrorDeg % 20 === 0) {
        const tx = Math.cos(rad) * (innerR - 24);
        const ty = -Math.sin(rad) * (innerR - 24);
        elements.push(new fabric.IText(mirrorDeg.toString(), { left: tx, top: ty, fontSize: 10, fontWeight: '700', fill: '#F59E0B', originX: 'center', originY: 'center', selectable: false }));
      }
    }

    // Labels
    elements.push(new fabric.IText('0�', { left: radius + 8, top: -6, fontSize: 11, fill: '#1A5FFF', fontWeight: '900', selectable: false }));
    elements.push(new fabric.IText('180�', { left: -radius - 32, top: -6, fontSize: 11, fill: '#1A5FFF', fontWeight: '900', selectable: false }));
    elements.push(new fabric.IText('90�', { left: -8, top: -(radius - 10), fontSize: 11, fill: '#1A5FFF', fontWeight: '900', selectable: false }));

    // Blue outer label
    elements.push(new fabric.IText('OUTER ?', { left: 30, top: 6, fontSize: 9, fill: '#1A5FFF', selectable: false }));
    elements.push(new fabric.IText('? INNER', { left: 30, top: 16, fontSize: 9, fill: '#F59E0B', selectable: false }));

    // Center cross
    elements.push(new fabric.Line([-12, 0, 12, 0], { stroke: '#EF4444', strokeWidth: 2, selectable: false }));
    elements.push(new fabric.Line([0, -12, 0, 12], { stroke: '#EF4444', strokeWidth: 2, selectable: false }));
    elements.push(new fabric.Circle({ radius: 4, fill: '#EF4444', originX: 'center', originY: 'center', selectable: false }));

    const protractor = new fabric.Group(elements, { left: 350, top: 250, id: 'pro_' + Math.random(), originX: 'center', originY: 'center' });
    canvas.add(protractor); canvas.setActiveObject(protractor).renderAll();
  };

  // --- SET SQUARE ---
  window.addSetSquare = () => {
    setSTEMTool('select');
    const color = document.getElementById('wb-color').value;
    const path = new fabric.Path('M 0 0 L 200 0 L 0 -200 Z', { fill: 'rgba(200,230,255,0.3)', stroke: color, strokeWidth: 2 });
    const hmark = new fabric.IText('90�', { left: 5, top: -25, fontSize: 12, fill: color });
    const label = new fabric.IText('45�-45�-90�', { left: 50, top: -50, fontSize: 10, fill: '#666' });
    const grp = new fabric.Group([path, hmark, label], { left: 300, top: 400, id: 'sq_' + Math.random() });
    canvas.add(grp); canvas.setActiveObject(grp).renderAll();
  };

  // --- COMPASS ---
  window.addCompass = () => {
    setSTEMTool('select');
    const color = document.getElementById('wb-color').value;
    const r = 80;
    const outer = new fabric.Circle({ radius: r, fill: 'rgba(240,248,255,0.4)', stroke: color, strokeWidth: 2, originX: 'center', originY: 'center' });
    const inner = new fabric.Circle({ radius: 5, fill: color, originX: 'center', originY: 'center' });
    const needle = new fabric.Path(`M 0 0 L 0 -${r}`, { stroke: '#EF4444', strokeWidth: 3, fill: null });
    const N = new fabric.IText('N', { left: -7, top: -(r + 18), fontSize: 14, fontWeight: '900', fill: '#EF4444', selectable: false });
    const grp = new fabric.Group([outer, needle, inner, N], { left: 400, top: 300, id: 'cmp_' + Math.random(), originX: 'center', originY: 'center' });
    canvas.add(grp); canvas.setActiveObject(grp).renderAll();
  };

  // --- GRID ---
  window.addGrid = () => {
    setSTEMTool('select');
    const size = 300; const step = 30;
    const lines = [];
    for (let i = 0; i <= size; i += step) {
      lines.push(new fabric.Line([i, 0, i, size], { stroke: '#aac4ff', strokeWidth: i % (step * 5) === 0 ? 1.5 : 0.7, selectable: false }));
      lines.push(new fabric.Line([0, i, size, i], { stroke: '#aac4ff', strokeWidth: i % (step * 5) === 0 ? 1.5 : 0.7, selectable: false }));
    }
    const grp = new fabric.Group(lines, { left: 100, top: 100, id: 'grid_' + Math.random() });
    canvas.add(grp); canvas.setActiveObject(grp).renderAll();
  };

  // --- NUMBER LINE ---
  window.addNumberLine = () => {
    setSTEMTool('select');
    const color = document.getElementById('wb-color').value;
    const els = [];
    const lineEl = new fabric.Line([-300, 0, 300, 0], { stroke: color, strokeWidth: 2 });
    els.push(lineEl);
    els.push(new fabric.Path('M 290 -6 L 300 0 L 290 6', { stroke: color, strokeWidth: 2, fill: null }));
    els.push(new fabric.Path('M -290 -6 L -300 0 L -290 6', { stroke: color, strokeWidth: 2, fill: null }));
    for (let x = -10; x <= 10; x++) {
      const px = x * 30;
      const h = x % 5 === 0 ? 12 : 7;
      els.push(new fabric.Line([px, -h, px, h], { stroke: color, strokeWidth: x === 0 ? 2 : 1 }));
      if (x % 2 === 0) els.push(new fabric.IText(x.toString(), { left: px, top: 14, fontSize: 12, fontWeight: x === 0 ? '900' : '500', fill: color, originX: 'center' }));
    }
    const grp = new fabric.Group(els, { left: 350, top: 300, id: 'nl_' + Math.random(), originX: 'center', originY: 'center' });
    canvas.add(grp); canvas.setActiveObject(grp).renderAll();
  };

  // --- XY AXES ---
  window.addMathAxes = () => {
    setSTEMTool('select');
    const color = document.getElementById('wb-color').value;
    const els = [];
    const size = 250;
    // Axes
    els.push(new fabric.Line([-size, 0, size, 0], { stroke: color, strokeWidth: 2 }));
    els.push(new fabric.Line([0, -size, 0, size], { stroke: color, strokeWidth: 2 }));
    // Arrowheads
    els.push(new fabric.Path(`M ${size - 8} -6 L ${size} 0 L ${size - 8} 6`, { stroke: color, fill: null, strokeWidth: 2 }));
    els.push(new fabric.Path(`M -6 ${-(size - 8)} L 0 -${size} L 6 ${-(size - 8)}`, { stroke: color, fill: null, strokeWidth: 2 }));
    // Labels
    els.push(new fabric.IText('x', { left: size + 8, top: -10, fontSize: 16, fontWeight: '900', fill: color }));
    els.push(new fabric.IText('y', { left: 6, top: -(size + 10), fontSize: 16, fontWeight: '900', fill: color }));
    els.push(new fabric.IText('O', { left: 5, top: 4, fontSize: 13, fill: color }));
    // Grid lines
    for (let i = -8; i <= 8; i++) {
      if (i === 0) continue;
      const p = i * 30;
      els.push(new fabric.Line([p, -size, p, size], { stroke: '#e0e8ff', strokeWidth: 0.5, selectable: false }));
      els.push(new fabric.Line([-size, p, size, p], { stroke: '#e0e8ff', strokeWidth: 0.5, selectable: false }));
      els.push(new fabric.Line([p, -6, p, 6], { stroke: color, strokeWidth: i % 2 === 0 ? 1.5 : 0.8 }));
      els.push(new fabric.Line([-6, p, 6, p], { stroke: color, strokeWidth: i % 2 === 0 ? 1.5 : 0.8 }));
      if (i % 2 === 0) {
        els.push(new fabric.IText(i.toString(), { left: p, top: 8, fontSize: 10, fill: color, originX: 'center' }));
        els.push(new fabric.IText((-i).toString(), { left: 8, top: p, fontSize: 10, fill: color, originY: 'center' }));
      }
    }
    const grp = new fabric.Group(els, { left: 400, top: 380, id: 'axes_' + Math.random(), originX: 'center', originY: 'center' });
    canvas.add(grp); canvas.setActiveObject(grp).renderAll();
  };

  // --- 3D XYZ AXES ---
  window.add3DAxes = () => {
    setSTEMTool('select');
    const color = document.getElementById('wb-color').value;
    const els = [];
    // Isometric projection of 3D axes
    // X axis ? right
    els.push(new fabric.Line([0, 0, 180, 0], { stroke: '#EF4444', strokeWidth: 2.5 }));
    els.push(new fabric.Path('M 172 -6 L 180 0 L 172 6', { stroke: '#EF4444', strokeWidth: 2, fill: null }));
    els.push(new fabric.IText('x', { left: 185, top: -10, fontSize: 16, fontWeight: '900', fill: '#EF4444', fontStyle: 'italic' }));
    // Y axis ? up
    els.push(new fabric.Line([0, 0, 0, -180], { stroke: '#10B981', strokeWidth: 2.5 }));
    els.push(new fabric.Path('M -6 -172 L 0 -180 L 6 -172', { stroke: '#10B981', strokeWidth: 2, fill: null }));
    els.push(new fabric.IText('y', { left: 6, top: -196, fontSize: 16, fontWeight: '900', fill: '#10B981', fontStyle: 'italic' }));
    // Z axis ? back-left (isometric)
    const zAngle = (210 * Math.PI) / 180;
    const zLen = 150;
    const zX = Math.cos(zAngle) * zLen;
    const zY = Math.sin(zAngle) * zLen;
    els.push(new fabric.Line([0, 0, zX, zY], { stroke: '#1A5FFF', strokeWidth: 2.5 }));
    els.push(new fabric.IText('z', { left: zX - 16, top: zY + 4, fontSize: 16, fontWeight: '900', fill: '#1A5FFF', fontStyle: 'italic' }));
    // Tick marks X
    for (let i = 1; i <= 5; i++) {
      const px = i * 30;
      els.push(new fabric.Line([px, -5, px, 5], { stroke: '#EF4444', strokeWidth: 1 }));
      if (i % 2 === 0) els.push(new fabric.IText(i.toString(), { left: px, top: 8, fontSize: 10, fill: '#EF4444', originX: 'center' }));
    }
    // Tick marks Y
    for (let i = 1; i <= 5; i++) {
      const py = -i * 30;
      els.push(new fabric.Line([-5, py, 5, py], { stroke: '#10B981', strokeWidth: 1 }));
      if (i % 2 === 0) els.push(new fabric.IText(i.toString(), { left: 8, top: py, fontSize: 10, fill: '#10B981', originY: 'center' }));
    }
    // Dashed guide planes (xy, xz, yz) � light outlines
    els.push(new fabric.Path('M 0 0 L 120 0 L 120 -120 L 0 -120 Z', { stroke: 'rgba(239,68,68,0.2)', strokeWidth: 1, strokeDashArray: [5,4], fill: 'rgba(239,68,68,0.04)' }));
    // Origin dot
    els.push(new fabric.Circle({ radius: 5, fill: color, originX: 'center', originY: 'center' }));
    els.push(new fabric.IText('O', { left: 6, top: 5, fontSize: 12, fill: color }));
    const grp = new fabric.Group(els, { left: 360, top: 380, id: '3dax_' + Math.random(), originX: 'center', originY: 'center' });
    canvas.add(grp); canvas.setActiveObject(grp).renderAll();
  };

  // --- FORMULA EDITOR ---
  const FORMULA_SYMBOLS = [
    // Superscripts & subscripts
    { label: 'x�', ins: '�' }, { label: 'x�', ins: '�' }, { label: 'xn', ins: 'n' },
    { label: 'x0', ins: '0' }, { label: 'x1', ins: '1' }, { label: 'x2', ins: '2' },
    // Operators
    { label: '�', ins: '�' }, { label: '�', ins: '�' }, { label: '�', ins: '�' },
    { label: '=', ins: '=' }, { label: '=', ins: '=' }, { label: '?', ins: '?' },
    { label: '�', ins: '�' }, { label: '?', ins: '?' }, { label: '8', ins: '8' },
    { label: 'v', ins: 'v' }, { label: '?', ins: '?' }, { label: '?', ins: '?' },
    // Fractions
    { label: '�', ins: '�' }, { label: '?', ins: '?' }, { label: '�', ins: '�' },
    { label: '�', ins: '�' }, { label: '?', ins: '?' },
    // Calculus � LaTeX templates
    { label: '?', ins: '?' }, { label: '?', ins: '?' }, { label: '?', ins: '?' },
    { label: '??', ins: '\\sum_{n=1}^{\\infty} ' }, { label: '?', ins: '\\prod_{n=1}^{N} ' },
    { label: '?', ins: '\\int ' }, { label: '???', ins: '\\int_{a}^{b} ' },
    { label: '?', ins: '\\iint ' }, { label: '?', ins: '\\oint ' },
    { label: 'lim x?8', ins: '\\lim_{x \\to \\infty} ' },
    { label: 'lim x?0', ins: '\\lim_{x \\to 0} ' },
    { label: 'lim x?a', ins: '\\lim_{x \\to a} ' },
    { label: 'lim x?0?', ins: '\\lim_{x \\to 0^+} ' },
    { label: 'frac', ins: '\\frac{a}{b}' }, { label: 'sqrt', ins: '\\sqrt{x}' },
    { label: 'x�', ins: 'x^{2}' }, { label: 'xn', ins: 'x^{n}' },
    { label: 'd/dx', ins: '\\frac{d}{dx}' }, { label: '?', ins: '\\to ' },
    // Logic & Sets
    { label: '?', ins: '?' }, { label: '?', ins: '?' }, { label: '?', ins: '?' },
    { label: '?', ins: '?' }, { label: '?', ins: '?' }, { label: 'n', ins: 'n' },
    { label: '?', ins: '?' }, { label: '?', ins: '?' }, { label: '?', ins: '?' },
    { label: '?', ins: '?' }, { label: '�', ins: '�' },
    // Geometry
    { label: '?', ins: '?' }, { label: '?', ins: '?' }, { label: '?', ins: '?' },
    { label: '?', ins: '?' }, { label: '~', ins: '~' }, { label: '�', ins: '�' },
    // Physics / Thermo
    { label: '?', ins: '?' }, { label: '?', ins: '?' }, { label: '?', ins: '?' },
    { label: '?', ins: '?' }, { label: '�', ins: '�' }, { label: 's', ins: 's' },
    { label: '?', ins: '?' }, { label: 'O', ins: 'O' }, { label: '?', ins: '?' },
    { label: '?', ins: '?' }, { label: 't', ins: 't' }, { label: '?', ins: '?' },
    // Common formula templates
    { label: 'F=ma', ins: 'F = ma' }, { label: 'E=mc�', ins: 'E = mc�' },
    { label: 'PV=nRT', ins: 'PV = nRT' }, { label: '?S=0', ins: '?S = 0' },
    { label: 'a�+b�=c�', ins: 'a� + b� = c�' },
    { label: 'v=u+at', ins: 'v = u + at' },
    { label: 'W=Q?T', ins: 'W = Q?T' }, { label: '?=W/Q', ins: '? = W/Q' }
  ];

  const GREEK_LETTERS = [
    { label: 'a', name: 'alpha' }, { label: '�', name: 'beta' }, { label: '?', name: 'gamma' },
    { label: 'd', name: 'delta' }, { label: 'e', name: 'epsilon' }, { label: '?', name: 'zeta' },
    { label: '?', name: 'eta' }, { label: '?', name: 'theta' }, { label: '?', name: 'iota' },
    { label: '?', name: 'kappa' }, { label: '?', name: 'lambda' }, { label: '�', name: 'mu' },
    { label: '?', name: 'nu' }, { label: '?', name: 'xi' }, { label: 'p', name: 'pi' },
    { label: '?', name: 'rho' }, { label: 's', name: 'sigma' }, { label: 't', name: 'tau' },
    { label: '?', name: 'upsilon' }, { label: 'f', name: 'phi' }, { label: '?', name: 'chi' },
    { label: '?', name: 'psi' }, { label: '?', name: 'omega' },
    { label: 'G', name: 'Gamma' }, { label: '?', name: 'Delta' }, { label: 'T', name: 'Theta' },
    { label: '?', name: 'Lambda' }, { label: '?', name: 'Xi' }, { label: '?', name: 'Pi' },
    { label: 'S', name: 'Sigma' }, { label: '?', name: 'Upsilon' }, { label: 'F', name: 'Phi' },
    { label: '?', name: 'Psi' }, { label: 'O', name: 'Omega' }
  ];

  // Build Greek buttons
  const gContainer = document.getElementById('greek-buttons');
  if (gContainer) {
    GREEK_LETTERS.forEach(g => {
      const btn = document.createElement('button');
      btn.textContent = g.label;
      btn.title = g.name;
      btn.style.cssText = 'background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:5px;color:#fff;padding:4px 8px;font-size:16px;cursor:pointer;font-family:serif;min-width:34px;';
      btn.onmouseover = () => btn.style.background = 'rgba(26,95,255,0.5)';
      btn.onmouseout = () => btn.style.background = 'rgba(255,255,255,0.1)';
      btn.onclick = () => insertGreekLetter(g.label);
      gContainer.appendChild(btn);
    });
  }

  // Build formula symbol buttons
  const fsContainer = document.getElementById('formula-symbols');
  if (fsContainer) {
    FORMULA_SYMBOLS.forEach(s => {
      const btn = document.createElement('button');
      btn.textContent = s.label;
      btn.style.cssText = 'background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.18);border-radius:5px;color:#e0e8ff;padding:3px 7px;font-size:14px;cursor:pointer;font-family:serif;white-space:nowrap;';
      btn.onmouseover = () => btn.style.background = 'rgba(26,95,255,0.4)';
      btn.onmouseout = () => btn.style.background = 'rgba(255,255,255,0.08)';
      btn.onclick = () => {
        const inp = document.getElementById('formula-input');
        if (inp) { const pos = inp.selectionStart; const val = inp.value; inp.value = val.slice(0, pos) + s.ins + val.slice(pos); inp.focus(); inp.setSelectionRange(pos + s.ins.length, pos + s.ins.length); }
      };
      fsContainer.appendChild(btn);
    });
  }

  window.insertGreekLetter = (letter) => {
    // If formula panel open, insert there; otherwise place directly on canvas
    const panel = document.getElementById('wb-formula-panel');
    if (panel && panel.style.display !== 'none') {
      const inp = document.getElementById('formula-input');
      if (inp) { const pos = inp.selectionStart || 0; const val = inp.value; inp.value = val.slice(0,pos)+letter+val.slice(pos); inp.focus(); inp.setSelectionRange(pos+1,pos+1); }
    } else {
      setSTEMTool('select');
      const t = new fabric.IText(letter, { left: 350, top: 320, fontSize: 36, fontFamily: 'serif', fill: document.getElementById('wb-color').value, fontWeight: '700', id: 'grk_'+Math.random() });
      canvas.add(t); canvas.setActiveObject(t).renderAll();
    }
  };

  window.toggleGreekPanel = () => {
    const gp = document.getElementById('wb-greek-panel');
    const fp = document.getElementById('wb-formula-panel');
    const isHidden = gp.style.display === 'none';
    gp.style.display = isHidden ? 'flex' : 'none';
    if (isHidden && fp) fp.style.display = 'none'; // close formula panel if open
    const btn = document.getElementById('greek-toggle-btn');
    if (btn) { btn.style.background = isHidden ? 'var(--blue)' : 'rgba(255,255,255,0.1)'; btn.style.color = '#fff'; }
  };

  window.openFormulaEditor = () => {
    const fp = document.getElementById('wb-formula-panel');
    const gp = document.getElementById('wb-greek-panel');
    if (fp) fp.style.display = fp.style.display === 'none' ? 'block' : 'none';
    if (gp) gp.style.display = 'none'; // close greek panel
    if (fp && fp.style.display !== 'none') setTimeout(() => document.getElementById('formula-input')?.focus(), 50);
  };

  window.closeFormulaEditor = () => {
    const fp = document.getElementById('wb-formula-panel');
    if (fp) fp.style.display = 'none';
  };

  // --- SCIENCE FORMULA LIBRARY ---
  const SCI_FORMULAS = [
    { cat: '? Mechanics', color: '#3B7BFF', formulas: [
      'F = ma', 'W = Fd', 'P = W/t', 'KE = �mv�', 'PE = mgh',
      'v = u + at', 's = ut + �at�', 'v� = u� + 2as', 'p = mv',
      'F�?t = ?p', 't = Fr', '? = 2pf', 'v = ?r', 'a = v�/r',
      'F = mv�/r', 'G = 6.674�10?�� Nm�/kg�', 'F = Gm1m2/r�'
    ]},
    { cat: '??? Thermodynamics', color: '#F59E0B', formulas: [
      'Q = mc?T', 'PV = nRT', '?U = Q - W', 'W = P?V',
      '? = 1 - Tc/Th', '?S = Q/T', '?S = 0', 'U = (3/2)nRT',
      'c = Q/(m?T)', 'k = -?A(dT/dx)'
    ]},
    { cat: '? Electricity', color: '#10B981', formulas: [
      'V = IR', 'P = IV', 'P = I�R', 'P = V�/R', 'R = ?L/A',
      'Q = CV', 'E = Q/e0A', 'F = qE', 'F = qvB',
      'e = -dF/dt', 'V = Ed', 'C = e0A/d', 'I = dQ/dt',
      'Vs/Vp = Ns/Np'
    ]},
    { cat: '?? Waves & Optics', color: '#8B5CF6', formulas: [
      'v = f?', 'T = 1/f', 'n = c/v', 'n1sin?1 = n2sin?2',
      '1/f = 1/v + 1/u', 'm = v/u', 'E = hf', '? = h/mv',
      'I = P/A', 'dsin? = n?'
    ]},
    { cat: '?? Modern Physics', color: '#EF4444', formulas: [
      'E = mc�', 'E = hf', 'KE = hf - f', '? = h/p',
      '?x?p = ?/2', 'E = -13.6/n� eV', 't = t0/v(1-v�/c�)',
      'N = N0e^(-?t)', 't� = ln2/?', 'E = mc� + KE'
    ]},
    { cat: '?? Chemistry', color: '#06B6D4', formulas: [
      'PV = nRT', 'pH = -log[H?]', 'pH + pOH = 14',
      '?G = ?H - T?S', '?G = -nFE', 'Kc = [C]^c[D]^d/[A]^a[B]^b',
      'E = E� - (RT/nF)lnQ', 'M1V1 = M2V2', 'n = m/M',
      '?max = b/T (Wien)', 'c = ??'
    ]},
    { cat: '?? Mathematics', color: '#F5A623', formulas: [
      'a� + b� = c�', 'A = pr�', 'C = 2pr', 'V = (4/3)pr�',
      'A = �bh', 'sin�? + cos�? = 1', 'tan? = sin?/cos?',
      'dy/dx = lim(?y/?x)', '?xndx = xn?�/(n+1) + C',
      'det(A) = ad - bc', 'e^(ip) + 1 = 0', 'log(ab) = loga + logb',
      'nCr = n!/r!(n-r)!', 'f\'(x) = lim[f(x+h)-f(x)]/h'
    ]},
    { cat: '?? Biology', color: '#34D399', formulas: [
      'BMI = mass(kg)/height(m)�', 'HR_max = 220 - age',
      'osmotic pressure = iMRT', 'Q10 = (R2/R1)^(10/(T2-T1))',
      'Hardy-Weinberg: p� + 2pq + q� = 1', 'p + q = 1',
      'net productivity = gross - respiration'
    ]}
  ];

  window.toggleSciFormulas = () => {
    const panel = document.getElementById('wb-sci-formulas-panel');
    const btn = document.getElementById('sci-formulas-btn');
    const isHidden = panel.style.display === 'none';
    panel.style.display = isHidden ? 'block' : 'none';
    if (btn) { btn.style.background = isHidden ? 'var(--blue)' : 'rgba(255,255,255,0.1)'; }
    if (isHidden && !document.getElementById('sci-formula-groups').children.length) {
      const container = document.getElementById('sci-formula-groups');
      SCI_FORMULAS.forEach(cat => {
        const group = document.createElement('div');
        group.style.cssText = 'margin-bottom:8px; width:100%;';
        group.innerHTML = `<div style="font-size:10px; font-weight:800; color:${cat.color}; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">${cat.cat}</div><div style="display:flex; flex-wrap:wrap; gap:3px;">` +
          cat.formulas.map(f => `<button onclick="placeSciFormula('${f.replace(/'/g,'\\\'')}')"
            style="background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.18); border-radius:5px; color:#e8f0ff; padding:3px 8px; font-size:12px; cursor:pointer; font-family:'Times New Roman',serif; white-space:nowrap;"
            onmouseover="this.style.background='rgba(26,95,255,0.45)'"
            onmouseout="this.style.background='rgba(255,255,255,0.07)'">${f}</button>`).join('') + '</div>';
        container.appendChild(group);
      });
    }
  };

  window.placeSciFormula = (formula) => {
    setSTEMTool('select');
    const color = document.getElementById('wb-color').value;
    latexToFabricImage(formula, 1.8, color, (img) => {
      if (img) {
        canvas.add(img);
        canvas.setActiveObject(img).renderAll();
        toast('Formula placed ✓', 'info');
      } else {
        placeFallbackText(formula, 22, color);
      }
    });
  };

   

  // -- FORMULA ENGINE: MathJax SVG ? Canvas Image ---------------------------
  // Renders LaTeX via MathJax tex-svg, extracts the SVG, converts to PNG via
  // an offscreen canvas, then stamps it on Fabric � identical to Word equations.

  function latexToFabricImage(latexStr, scaleFactor, color, callback) {
    if (!window.MathJax || !window.MathJax.tex2svg) {
      callback(null); return;
    }
    try {
      const node = window.MathJax.tex2svg(latexStr, { display: true });
      const svgEl = node.querySelector('svg');
      if (!svgEl) { callback(null); return; }

      // Scale up the SVG
      const exSize = 10;
      const wEx = parseFloat(svgEl.getAttribute('width')) || 10;
      const hEx = parseFloat(svgEl.getAttribute('height')) || 4;
      const svgW = Math.max(60, Math.round(wEx * exSize * scaleFactor));
      const svgH = Math.max(30, Math.round(hEx * exSize * scaleFactor));
      svgEl.setAttribute('width', svgW);
      svgEl.setAttribute('height', svgH);
      svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svgEl.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

      // Set color on all paths
      svgEl.querySelectorAll('path').forEach(p => p.setAttribute('fill', color));

      // Use Fabric's native SVG loader � handles <defs> and fonts correctly
      const svgStr = new XMLSerializer().serializeToString(svgEl);
      fabric.loadSVGFromString(svgStr, (objects, options) => {
        if (!objects || objects.length === 0) { callback(null); return; }
        const group = fabric.util.groupSVGElements(objects, options);
        group.set({
          left: canvas.width / 2 - (group.width || 100) / 2,
          top: canvas.height / 2 - (group.height || 50) / 2,
          id: 'fml_' + Math.random(),
          scaleX: scaleFactor * 0.5,
          scaleY: scaleFactor * 0.5,
        });
        callback(group);
      });
    } catch(err) {
      console.warn('MathJax render error:', err);
      callback(null);
    }
  }

  function placeFallbackText(val, size, color) {
    const t = new fabric.IText(val, {
      left: canvas.width / 2 - 100,
      top: canvas.height / 2 - 20,
      fontSize: Math.max(size, 20),
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontStyle: 'italic',
      fill: color || '#1A5FFF',
      fontWeight: 'bold',
      id: 'fml_' + Math.random(),
      padding: 8,
      backgroundColor: 'rgba(255,255,255,0.9)'
    });
    canvas.add(t); canvas.setActiveObject(t).renderAll();
  }

  window.previewLatex = () => {
    const inp = document.getElementById('formula-input');
    const prev = document.getElementById('formula-preview');
    if (!inp || !prev) return;
    const val = inp.value.trim();
    if (!val) { prev.innerHTML = ''; return; }

    if (window.MathJax && window.MathJax.tex2svg) {
      try {
        const node = window.MathJax.tex2svg(val, { display: true });
        prev.innerHTML = '';
        prev.appendChild(node);
      } catch(e) { prev.textContent = val; }
    } else {
      // MathJax not ready yet � show raw LaTeX styled
      prev.innerHTML = `<span style="font-family:Georgia,serif;font-style:italic;color:#111;font-size:15px">${val}</span>`;
    }
  };

  window.placeFormula = async () => {
    const inp = document.getElementById('formula-input');
    const val = inp ? inp.value.trim() : '';
    if (!val) { toast('Enter a formula first.', 'err'); return; }
    const sizeMap = { '18': 1.2, '26': 1.8, '36': 2.6, '48': 3.6 };
    const sizeVal = document.getElementById('formula-size')?.value || '26';
    const scaleFactor = sizeMap[sizeVal] || 1.8;
    const color = document.getElementById('wb-color').value;

    // Wait for MathJax to fully initialise before placing
    if (window.MathJax && window.MathJax.startup && window.MathJax.startup.promise) {
      await window.MathJax.startup.promise;
    }

    setSTEMTool('select');

    latexToFabricImage(val, scaleFactor, color, (img) => {
      if (img) {
        canvas.add(img);
        canvas.setActiveObject(img).renderAll();
        toast('Formula placed ✓  — select it to move/resize', 'info');
      } else {
        // Always place as styled text if image rendering fails
        placeFallbackText(val, parseInt(sizeVal), color);
        toast('Formula placed as text ✓', 'info');
      }
      if (inp) inp.value = '';
      const prev = document.getElementById('formula-preview');
      if (prev) prev.innerHTML = '';
    });
  };
  // -- END FORMULA ENGINE ---------------------------------------------------

  // --- ADD EQUATION (legacy quick-add, kept for compat) ---
  window.addEquation = () => openFormulaEditor();

  // --- LINE MODE ---
  let isLineMode = false;
  let linePt1 = null;
  let _linePreview = null;
  window.startLineMode = () => {
    setSTEMTool('select');
    isLineMode = true;
    linePt1 = null;
    document.getElementById('wb-status').innerHTML = '📏 <strong>Click & drag</strong> to draw a straight line. Release to place. <button onclick="cancelLineMode()" style="margin-left:8px;background:#EF4444;color:#fff;border:none;border-radius:4px;padding:2px 8px;cursor:pointer;font-size:10px;">Cancel</button>';
    canvas.defaultCursor = 'crosshair';
    canvas.selection = false;
    canvas.isDrawingMode = false;

    const onDown = (e) => {
      if (!isLineMode) return;
      linePt1 = canvas.getPointer(e.e);
      _linePreview = new fabric.Line([linePt1.x, linePt1.y, linePt1.x, linePt1.y], {
        stroke: document.getElementById('wb-color').value,
        strokeWidth: parseInt(document.getElementById('wb-width').value),
        selectable: false, evented: false, id: 'lprev'
      });
      canvas.add(_linePreview);
    };
    const onMove = (e) => {
      if (!isLineMode || !linePt1 || !_linePreview) return;
      const pt = canvas.getPointer(e.e);
      _linePreview.set({ x2: pt.x, y2: pt.y });
      canvas.renderAll();
    };
    const onUp = (e) => {
      if (!isLineMode || !linePt1) return;
      const pt = canvas.getPointer(e.e);
      canvas.remove(_linePreview); _linePreview = null;
      const dist = Math.hypot(pt.x - linePt1.x, pt.y - linePt1.y);
      if (dist > 5) {
        const ln = new fabric.Line([linePt1.x, linePt1.y, pt.x, pt.y], {
          stroke: document.getElementById('wb-color').value,
          strokeWidth: parseInt(document.getElementById('wb-width').value),
          id: 'ln_' + Math.random()
        });
        canvas.add(ln); canvas.renderAll();
      }
      isLineMode = false; linePt1 = null;
      canvas.off('mouse:down', onDown);
      canvas.off('mouse:move', onMove);
      canvas.off('mouse:up', onUp);
      canvas.defaultCursor = 'default';
      canvas.selection = true;
      document.getElementById('wb-status').textContent = '✏️ Click to draw · Select to move/resize · Delete key to remove';
    };
    canvas.on('mouse:down', onDown);
    canvas.on('mouse:move', onMove);
    canvas.on('mouse:up', onUp);
  };
  window.cancelLineMode = () => {
    isLineMode = false; linePt1 = null;
    if (_linePreview) { canvas.remove(_linePreview); _linePreview = null; }
    canvas.defaultCursor = 'default'; canvas.selection = true;
    document.getElementById('wb-status').textContent = '✏️ Done.';
  };

  // --- TOOL CONTROL ---
  window.setSTEMTool = (tool) => {
    window._activeWBTool = tool;
    canvas.isDrawingMode = (tool === 'pencil');
    canvas.selection = (tool === 'select');
    
    // Laser Pointer Visibility Logic
    let dot = document.getElementById('laser-dot');
    if (!dot) {
      dot = document.createElement('div');
      dot.id = 'laser-dot';
      document.getElementById('canvas-container').appendChild(dot);
    }
    dot.style.display = 'none'; 

    if (tool === 'laser') {
      canvas.defaultCursor = 'none';
    } else {
      canvas.defaultCursor = 'default';
    }
    
    if (tool === 'eraser') {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.color = '#fff';
      canvas.freeDrawingBrush.width = 24;
    } else {
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.color = document.getElementById('wb-color')?.value || '#1A5FFF';
      canvas.freeDrawingBrush.width = parseInt(document.getElementById('wb-width')?.value || '2');
    }
    document.querySelectorAll('.wb-btn').forEach(b => b.classList.remove('active'));
    if (document.getElementById('tool-' + tool)) document.getElementById('tool-' + tool).classList.add('active');
  };

  // --- Background Image Upload ---
  window.uploadWBBackground = (input) => {
    const file = input.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = (f) => {
      const data = f.target.result;
      fabric.Image.fromURL(data, (img) => {
        // Scale to fit canvas
        img.scaleToWidth(canvas.width * 0.8);
        canvas.add(img);
        canvas.centerObject(img);
        canvas.renderAll();
        // Sync to students
        if(channel) channel.send({ type: 'broadcast', event: 'draw', payload: img.toObject(['id']) });
      });
    };
    reader.readAsDataURL(file);
  };
  window.addSTEMText = () => {
    setSTEMTool('select');
    const t = new fabric.IText('Type here...', { left: 300, top: 300, fontSize: 24, fontFamily: 'DM Sans', fill: document.getElementById('wb-color').value, id: 'txt_' + Math.random() });
    canvas.add(t); canvas.setActiveObject(t).renderAll();
  };

  window.setWBColor = (hex) => {
    // Update the color picker input to match
    const picker = document.getElementById('wb-color');
    if (picker) picker.value = hex;
    // Apply to brush immediately
    canvas.freeDrawingBrush.color = hex;
    // Highlight the active swatch
    document.querySelectorAll('[onclick^="setWBColor"]').forEach(btn => {
      btn.style.border = btn.getAttribute('onclick').includes(hex)
        ? '2px solid #fff'
        : '2px solid rgba(255,255,255,0.3)';
      btn.style.transform = btn.getAttribute('onclick').includes(hex) ? 'scale(1.25)' : 'scale(1)';
    });
    // Also apply to any selected objects
    const active = canvas.getActiveObjects();
    if (active.length) {
      active.forEach(o => o.set({ stroke: hex }));
      canvas.renderAll();
    }
  };

  window.updateSTEMStyle = () => {
    const color = document.getElementById('wb-color')?.value || '#1A5FFF';
    canvas.freeDrawingBrush.color = color;
    canvas.freeDrawingBrush.width = parseInt(document.getElementById('wb-width')?.value || '2');
    const active = canvas.getActiveObjects();
    if (active.length) {
      const fill = document.getElementById('wb-fill')?.value || 'transparent';
      active.forEach(o => { o.set({ stroke: color, fill: fill === 'transparent' ? 'transparent' : fill }); });
      canvas.renderAll();
    }
  };

  // --- SHAPES (Full Comprehensive Set) ---
  window.addSTEMShape = (type) => {
    setSTEMTool('select');
    const color = document.getElementById('wb-color').value;
    const fill = document.getElementById('wb-fill').value;
    const sw = parseInt(document.getElementById('wb-width').value);
    const props = { left: 320, top: 300, stroke: color, strokeWidth: sw, fill, id: 'sh_' + Math.random() };
    let s;

    // Helper: regular polygon path
    const polyPath = (sides, r, cx, cy) => {
      const pts = [];
      for (let i = 0; i < sides; i++) {
        const a = (i * 2 * Math.PI / sides) - Math.PI / 2;
        pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
      }
      return 'M ' + pts.map(p => p.join(' ')).join(' L ') + ' Z';
    };

    switch (type) {
      case 'triangle': s = new fabric.Triangle({ ...props, width: 160, height: 140 }); break;
      case 'square': s = new fabric.Rect({ ...props, width: 140, height: 140 }); break;
      case 'rect': s = new fabric.Rect({ ...props, width: 200, height: 130 }); break;
      case 'circle': s = new fabric.Circle({ ...props, radius: 70 }); break;
      case 'ellipse': s = new fabric.Ellipse({ ...props, rx: 110, ry: 65 }); break;
      case 'semicircle': s = new fabric.Circle({ ...props, radius: 80, startAngle: 0, endAngle: 180 }); break;
      case 'sector': s = new fabric.Path('M 0 0 L 80 0 A 80 80 0 0 1 40 -69.3 Z', { ...props }); break;
      case 'segment': s = new fabric.Path('M -80 0 A 80 80 0 0 1 80 0 Z', { ...props }); break;
      case 'parallelogram': s = new fabric.Path('M 30 0 L 200 0 L 170 80 L 0 80 Z', { ...props }); break;
      case 'rhombus': s = new fabric.Path('M 80 0 L 160 70 L 80 140 L 0 70 Z', { ...props }); break;
      case 'trapezium': s = new fabric.Path('M 30 0 L 150 0 L 180 80 L 0 80 Z', { ...props }); break;
      case 'kite': s = new fabric.Path('M 80 0 L 160 90 L 80 170 L 0 90 Z', { ...props }); break;
      case 'pentagon': s = new fabric.Path(polyPath(5, 80, 80, 80), { ...props }); break;
      case 'hexagon': s = new fabric.Path(polyPath(6, 80, 80, 80), { ...props }); break;
      case 'heptagon': s = new fabric.Path(polyPath(7, 80, 80, 80), { ...props }); break;
      case 'octagon': s = new fabric.Path(polyPath(8, 80, 80, 80), { ...props }); break;
      case 'nonagon': s = new fabric.Path(polyPath(9, 80, 80, 80), { ...props }); break;
      case 'decagon': s = new fabric.Path(polyPath(10, 80, 80, 80), { ...props }); break;
      case 'star': {
        const pts = []; const n = 5;
        for (let i = 0; i < n * 2; i++) {
          const r2 = i % 2 === 0 ? 80 : 36;
          const a = (i * Math.PI / n) - Math.PI / 2;
          pts.push([80 + r2 * Math.cos(a), 80 + r2 * Math.sin(a)]);
        }
        s = new fabric.Path('M ' + pts.map(p => p.join(' ')).join(' L ') + ' Z', { ...props }); break;
      }
      case 'star6': {
        const pts = []; const n = 6;
        for (let i = 0; i < n * 2; i++) {
          const r2 = i % 2 === 0 ? 80 : 40;
          const a = (i * Math.PI / n) - Math.PI / 2;
          pts.push([80 + r2 * Math.cos(a), 80 + r2 * Math.sin(a)]);
        }
        s = new fabric.Path('M ' + pts.map(p => p.join(' ')).join(' L ') + ' Z', { ...props }); break;
      }
      case 'arrow': s = new fabric.Path('M 0 20 L 100 20 L 100 8 L 140 30 L 100 52 L 100 40 L 0 40 Z', { ...props }); break;
      case 'cross': s = new fabric.Path('M 40 0 L 80 0 L 80 40 L 120 40 L 120 80 L 80 80 L 80 120 L 40 120 L 40 80 L 0 80 L 0 40 L 40 40 Z', { ...props }); break;

      // 3D Shapes (SVG projections / isometric)
      case 'cube3d': {
        const d = 70;
        // Isometric cube: right face, left face, top face, plus back edges for full box look
        const els3d = [
          // Right face
          new fabric.Path(`M ${d} ${d * 0.5} L ${d * 2} 0 L ${d * 2} ${d} L ${d} ${d * 1.5} Z`, { stroke: color, strokeWidth: sw, fill: fill === 'transparent' ? 'rgba(80,120,220,0.25)' : fill }),
          // Left face
          new fabric.Path(`M 0 0 L ${d} ${d * 0.5} L ${d} ${d * 1.5} L 0 ${d} Z`, { stroke: color, strokeWidth: sw, fill: fill === 'transparent' ? 'rgba(100,150,255,0.38)' : fill }),
          // Top face
          new fabric.Path(`M 0 0 L ${d} ${d * 0.5} L ${d * 2} 0 L ${d} -${d * 0.5} Z`, { stroke: color, strokeWidth: sw, fill: fill === 'transparent' ? 'rgba(180,210,255,0.6)' : fill }),
          // Back-left edge
          new fabric.Line([0, 0, 0, d], { stroke: color, strokeWidth: sw * 0.7, strokeDashArray: [4,3] }),
          // Back-right edge
          new fabric.Line([d * 2, 0, d * 2, d], { stroke: color, strokeWidth: sw * 0.7, strokeDashArray: [4,3] }),
          // Back-top edge
          new fabric.Line([0, 0, d, -d * 0.5], { stroke: color, strokeWidth: sw * 0.7, strokeDashArray: [4,3] })
        ];
        s = new fabric.Group(els3d, { left: 300, top: 310, id: 'sh_' + Math.random() }); break;
      }
      case 'cuboid3d': {
        const w = 120, h = 70, d = 50;
        const els3d = [
          new fabric.Path(`M ${d} 0 L ${d + w} 0 L ${d + w} ${h} L ${d} ${h} Z`, { stroke: color, strokeWidth: sw, fill: fill === 'transparent' ? 'rgba(150,200,255,0.5)' : fill }),
          new fabric.Path(`M 0 ${d * 0.5} L ${d} 0 L ${d} ${h} L 0 ${h + d * 0.5} Z`, { stroke: color, strokeWidth: sw, fill: fill === 'transparent' ? 'rgba(80,130,240,0.35)' : fill }),
          new fabric.Path(`M 0 ${d * 0.5} L ${d} 0 L ${d + w} 0 L ${w} ${d * 0.5} Z`, { stroke: color, strokeWidth: sw, fill: fill === 'transparent' ? 'rgba(100,160,255,0.25)' : fill }),
          new fabric.Path(`M ${w} ${d * 0.5} L ${d + w} 0 L ${d + w} ${h} L ${w} ${h + d * 0.5} Z`, { stroke: color, strokeWidth: sw, fill: fill === 'transparent' ? 'rgba(60,120,200,0.3)' : fill })
        ];
        s = new fabric.Group(els3d, { left: 280, top: 280, id: 'sh_' + Math.random() }); break;
      }
      case 'sphere3d': {
        const r = 70;
        const sphere = new fabric.Circle({ radius: r, fill: fill === 'transparent' ? 'rgba(100,160,255,0.3)' : fill, stroke: color, strokeWidth: sw });
        const equator = new fabric.Ellipse({ rx: r, ry: r * 0.3, stroke: color, strokeWidth: sw * 0.8, fill: 'transparent', strokeDashArray: [5, 3], left: 0, top: r * 0.7 });
        const meridian = new fabric.Ellipse({ rx: r * 0.3, ry: r, stroke: color, strokeWidth: sw * 0.8, fill: 'transparent', strokeDashArray: [5, 3], left: r * 0.7, top: 0 });
        s = new fabric.Group([sphere, equator, meridian], { left: 300, top: 280, id: 'sh_' + Math.random() }); break;
      }
      case 'cylinder3d': {
        const r = 55, h = 120;
        const body = new fabric.Rect({ width: r * 2, height: h, fill: fill === 'transparent' ? 'rgba(100,160,255,0.3)' : fill, stroke: color, strokeWidth: sw });
        const top = new fabric.Ellipse({ rx: r, ry: r * 0.35, fill: fill === 'transparent' ? 'rgba(150,200,255,0.5)' : fill, stroke: color, strokeWidth: sw, left: 0, top: 0 });
        const bot = new fabric.Ellipse({ rx: r, ry: r * 0.35, fill: fill === 'transparent' ? 'rgba(80,130,220,0.4)' : fill, stroke: color, strokeWidth: sw, left: 0, top: h - r * 0.35 });
        s = new fabric.Group([body, bot, top], { left: 310, top: 280, id: 'sh_' + Math.random() }); break;
      }
      case 'cone3d': {
        const r = 70, h = 130;
        const base = new fabric.Ellipse({ rx: r, ry: r * 0.35, fill: fill === 'transparent' ? 'rgba(80,130,220,0.35)' : fill, stroke: color, strokeWidth: sw, left: 0, top: h });
        const leftSide = new fabric.Path(`M ${r} ${h + r * 0.35} L ${r} 0`, { stroke: color, strokeWidth: sw, fill: null });
        const body2 = new fabric.Path(`M 0 ${h + r * 0.35} Q ${-r * 0.2} ${h * 0.5} ${r} 0 Q ${r * 1.2} ${h * 0.5} ${r * 2} ${h + r * 0.35}`, { stroke: color, strokeWidth: sw, fill: fill === 'transparent' ? 'rgba(100,160,255,0.3)' : fill });
        s = new fabric.Group([body2, base], { left: 310, top: 240, id: 'sh_' + Math.random() }); break;
      }
      case 'pyramid3d': {
        const base3d = new fabric.Path('M 0 80 L 100 50 L 200 80 L 100 110 Z', { stroke: color, strokeWidth: sw, fill: fill === 'transparent' ? 'rgba(80,130,220,0.35)' : fill });
        const leftF = new fabric.Path('M 0 80 L 100 110 L 100 0 Z', { stroke: color, strokeWidth: sw, fill: fill === 'transparent' ? 'rgba(100,160,255,0.3)' : fill });
        const rightF = new fabric.Path('M 200 80 L 100 110 L 100 0 Z', { stroke: color, strokeWidth: sw, fill: fill === 'transparent' ? 'rgba(60,120,200,0.4)' : fill });
        const front = new fabric.Path('M 0 80 L 100 50 L 100 0 Z', { stroke: color, strokeWidth: sw, fill: fill === 'transparent' ? 'rgba(150,190,255,0.5)' : fill });
        s = new fabric.Group([base3d, leftF, rightF, front], { left: 290, top: 260, id: 'sh_' + Math.random() }); break;
      }
      case 'tetrahedron3d': {
        const face1 = new fabric.Path('M 80 0 L 0 130 L 160 130 Z', { stroke: color, strokeWidth: sw, fill: fill === 'transparent' ? 'rgba(100,160,255,0.35)' : fill });
        const face2 = new fabric.Path('M 80 0 L 160 130 L 200 80 Z', { stroke: color, strokeWidth: sw, fill: fill === 'transparent' ? 'rgba(80,130,220,0.5)' : fill });
        s = new fabric.Group([face1, face2], { left: 280, top: 260, id: 'sh_' + Math.random() }); break;
      }
      case 'octahedron3d': {
        const top2 = new fabric.Path('M 90 0 L 0 80 L 90 60 Z', { stroke: color, strokeWidth: sw, fill: fill === 'transparent' ? 'rgba(150,200,255,0.5)' : fill });
        const mid = new fabric.Path('M 0 80 L 90 60 L 180 80 L 90 100 Z', { stroke: color, strokeWidth: sw, fill: fill === 'transparent' ? 'rgba(100,160,255,0.35)' : fill });
        const bot = new fabric.Path('M 0 80 L 90 100 L 90 160 Z', { stroke: color, strokeWidth: sw, fill: fill === 'transparent' ? 'rgba(60,120,200,0.4)' : fill });
        const bot2 = new fabric.Path('M 180 80 L 90 100 L 90 160 Z', { stroke: color, strokeWidth: sw, fill: fill === 'transparent' ? 'rgba(80,140,230,0.3)' : fill });
        s = new fabric.Group([top2, mid, bot, bot2], { left: 290, top: 260, id: 'sh_' + Math.random() }); break;
      }
      case 'hemisphere3d': {
        const r = 70;
        const dome = new fabric.Circle({ radius: r, startAngle: 0, endAngle: Math.PI, fill: fill === 'transparent' ? 'rgba(100,160,255,0.35)' : fill, stroke: color, strokeWidth: sw });
        const flat = new fabric.Ellipse({ rx: r, ry: r * 0.3, fill: fill === 'transparent' ? 'rgba(80,130,220,0.5)' : fill, stroke: color, strokeWidth: sw, left: 0, top: 0 });
        s = new fabric.Group([dome, flat], { left: 310, top: 280, id: 'sh_' + Math.random() }); break;
      }
      case 'torus3d': {
        const outerR = 80, innerR = 38;
        const outerC = new fabric.Circle({ radius: outerR, fill: 'transparent', stroke: color, strokeWidth: sw });
        const innerC = new fabric.Circle({ radius: innerR, fill: fill === 'transparent' ? 'rgba(100,160,255,0.3)' : fill, stroke: color, strokeWidth: sw, left: outerR - innerR, top: outerR - innerR });
        const eq = new fabric.Ellipse({ rx: outerR, ry: outerR * 0.35, fill: 'transparent', stroke: color, strokeWidth: sw * 0.8, strokeDashArray: [6, 4], left: 0, top: outerR * 0.65 });
        s = new fabric.Group([outerC, innerC, eq], { left: 290, top: 270, id: 'sh_' + Math.random() }); break;
      }

      // Curves
      case 'parabola': {
        const pts = [];
        for (let x = -100; x <= 100; x += 5) pts.push((x < -99 ? 'M' : 'L') + ' ' + (x + 100) + ' ' + (130 - x * x / 80));
        s = new fabric.Path(pts.join(' '), { ...props, fill: 'transparent' }); break;
      }
      case 'hyperbola': {
        const p1 = [], p2 = [];
        for (let x = 20; x <= 100; x += 5) { const y = 60 * Math.sqrt((x * x / 40) - 1) || 0; p1.push((x < 21 ? 'M' : 'L') + ' ' + (x + 100) + ' ' + (100 - y)); p2.push((x < 21 ? 'M' : 'L') + ' ' + (x + 100) + ' ' + (100 + y)); }
        const p3 = [], p4 = [];
        for (let x = 20; x <= 100; x += 5) { const y = 60 * Math.sqrt((x * x / 40) - 1) || 0; p3.push((x < 21 ? 'M' : 'L') + ' ' + (-x + 100) + ' ' + (100 - y)); p4.push((x < 21 ? 'M' : 'L') + ' ' + (-x + 100) + ' ' + (100 + y)); }
        s = new fabric.Path(p1.join(' ') + ' ' + p2.join(' ') + ' ' + p3.join(' ') + ' ' + p4.join(' '), { ...props, fill: 'transparent' }); break;
      }
      case 'spiral': {
        const spiralPts = [];
        for (let t = 0; t <= 6 * Math.PI; t += 0.15) { const r2 = 5 * t; spiralPts.push((t < 0.16 ? 'M' : 'L') + ' ' + (100 + r2 * Math.cos(t)) + ' ' + (100 + r2 * Math.sin(t))); }
        s = new fabric.Path(spiralPts.join(' '), { ...props, fill: 'transparent' }); break;
      }
      case 'sinwave': {
        const wavePts = [];
        for (let x = 0; x <= 360; x += 5) { const y = 50 * Math.sin(x * Math.PI / 90); wavePts.push((x === 0 ? 'M' : 'L') + ' ' + x + ' ' + (70 - y)); }
        s = new fabric.Path(wavePts.join(' '), { ...props, fill: 'transparent' }); break;
      }
      case 'coswave': {
        const wavePts = [];
        for (let x = 0; x <= 360; x += 5) { const y = 50 * Math.cos(x * Math.PI / 90); wavePts.push((x === 0 ? 'M' : 'L') + ' ' + x + ' ' + (70 - y)); }
        s = new fabric.Path(wavePts.join(' '), { ...props, fill: 'transparent' }); break;
      }
      case 'tanwave': {
        const wavePts = [];
        let first = true;
        for (let x = 0; x <= 360; x += 3) { const y = 30 * Math.tan(x * Math.PI / 180); if (Math.abs(y) < 80) { wavePts.push((first ? 'M' : 'L') + ' ' + x + ' ' + (70 - y)); first = false; } else { first = true; } }
        s = new fabric.Path(wavePts.join(' '), { ...props, fill: 'transparent' }); break;
      }

      default: s = new fabric.Rect({ ...props, width: 150, height: 100 }); break;
    }

    if (s) { canvas.add(s); canvas.setActiveObject(s).renderAll(); }
  };

  // --- JITSI (Tutor as Moderator) ---
  window.toggleSplitScreen = () => {
    const roomName = `MathroneMajesticV5_${sessionId.replace(/[^a-zA-Z0-9]/g, '')}`;
    const isTutor2 = State.user && (State.user.role === 'tutor' || State.user.role === 'admin');
    const isGuestHost = window._isLabHost === true;
    const displayName = encodeURIComponent((isTutor2 || isGuestHost ? '👨‍🏫 ' : '🎓 ') + (State.user?.full_name || (window._wbGuestName || 'User')));
    // Build proper Jitsi URL � config keys go after # with & separators, userInfo uses JSON
    const jitsiUrl = `https://meet.jit.si/${roomName}`
      + `#config.prejoinPageEnabled=false`
      + `&config.startWithAudioMuted=true`
      + `&config.startWithVideoMuted=false`
      + `&config.disableDeepLinking=true`
      + `&config.enableWelcomePage=false`
      + `&userInfo.displayName=${displayName}`;
    window.open(jitsiUrl, '_blank');
    // Broadcast the room name so students can also join
    if (window._wbChannel) {
      try {
        window._wbChannel.send({ type: 'broadcast', event: 'jitsi-start', payload: { room: roomName } });
      } catch(e) {}
    }
    toast('Video room opened in new tab 📹 — share the room name with your student: ' + roomName, 'info');
  };

  // --- RESOURCE DRAWER ---
  window.toggleResourceDrawer = () => {
    const d = document.getElementById('wb-resource-drawer');
    const isOpen = d.style.transform === 'translateX(0px)' || d.style.transform === 'none';
    d.style.transform = isOpen ? 'translateX(100%)' : 'translateX(0px)';
    if (!isOpen) {
      const sp = document.getElementById('wb-shapes-panel');
      if (sp) sp.style.transform = 'translateX(-100%)';
    }
  };

  // --- SHAPES PANEL ---
  window.toggleShapesPanel = () => {
    const p = document.getElementById('wb-shapes-panel');
    const isOpen = p.style.transform === 'translateX(0px)' || p.style.transform === 'none';
    p.style.transform = isOpen ? 'translateX(-100%)' : 'translateX(0px)';
    if (!isOpen) {
      const rd = document.getElementById('wb-resource-drawer');
      if (rd) rd.style.transform = 'translateX(100%)';
    }
  };

  // --- LOAD EXTERNAL CONTENT ---
  window.loadExternalContent = (url, name) => {
    let finalUrl = url;
    if (url.includes('youtube.com/watch?v=')) {
      const vid = url.split('v=')[1].split('&')[0];
      finalUrl = `https://www.youtube.com/embed/${vid}?autoplay=1&rel=0`;
    } else if (url.includes('youtu.be/')) {
      const vid = url.split('.be/')[1].split('?')[0];
      finalUrl = `https://www.youtube.com/embed/${vid}?autoplay=1&rel=0`;
    }
    // Show locally
    document.getElementById('sim-iframe').src = finalUrl;
    document.getElementById('sim-title').textContent = '🔬 ' + (name || 'STEM Lab');
    document.getElementById('sim-overlay').style.display = 'block';
    const rd = document.getElementById('wb-resource-drawer');
    if (rd) rd.style.transform = 'translateX(100%)';

    // Broadcast to all students in the session
    if (window._wbChannel) {
      try {
        window._wbChannel.send({ type: 'broadcast', event: 'load-sim', payload: { url: finalUrl, name: name || 'STEM Lab' } });
      } catch(e) {}
    }
  };

  window.closeExternalContent = () => {
    document.getElementById('sim-overlay').style.display = 'none';
    document.getElementById('sim-iframe').src = '';
    // Tell students to close it too
    if (window._wbChannel) {
      try { window._wbChannel.send({ type: 'broadcast', event: 'close-sim', payload: {} }); } catch(e) {}
    }
  };

  window.loadCustomLink = () => {
    const url = document.getElementById('custom-link-input').value.trim();
    if (!url) return;
    loadExternalContent(url, 'External Resource');
  };

  

  window.popoutSim = () => {
    const src = document.getElementById('sim-iframe').src;
    if (src) window.open(src, '_blank');
  };

  // --- REAL-TIME SYNC (full two-way: tutor draws ? student sees live) ---
  if (channel) {
    // Receive remote draw/move/delete events
    channel.on('broadcast', { event: 'draw' }, (msg) => {
      fabric.util.enlivenObjects([msg.payload], (objs) => {
        objs.forEach(o => {
          const exist = canvas.getObjects().find(ex => ex.id === o.id);
          if (exist) canvas.remove(exist);
          o.remote = true;
          canvas.add(o);
        });
        canvas.renderAll();
      });
    })
    .on('broadcast', { event: 'del' }, (msg) => {
      const target = canvas.getObjects().find(o => o.id === msg.payload.id);
      if (target) { canvas.remove(target); canvas.renderAll(); }
    })
    .on('broadcast', { event: 'clear' }, () => {
      canvas.clear(); canvas.renderAll();
    })
    .on('broadcast', { event: 'page-change' }, (msg) => {
      window._wbCurrentPage = msg.payload.page;
      const total = msg.payload.total;
      
      // Ensure guest local notebook array matches host size
      while(window._wbNotebook.length < total) window._wbNotebook.push({});
      
      if (window._wbNotebook[window._wbCurrentPage]) {
         canvas.loadFromJSON(window._wbNotebook[window._wbCurrentPage], () => { canvas.renderAll(); });
      } else {
         canvas.clear();
      }
      const el = document.getElementById('page-num-display');
      if(el) el.textContent = `${window._wbCurrentPage + 1} / ${total}`;
    })
    .on('broadcast', { event: 'cursor' }, (msg) => {
      showRemoteCursor(msg.payload);
    })
    .on('broadcast', { event: 'live-stroke' }, (msg) => {
      // Draw live tutor stroke on student canvas as it happens
      if (!window._remoteStrokeCtx) {
        const upperCanvas = canvas.upperCanvasEl;
        window._remoteStrokeCtx = upperCanvas.getContext('2d');
      }
      const ctx = window._remoteStrokeCtx;
      const pts = msg.payload.points;
      if (!pts || pts.length < 2) return;
      ctx.strokeStyle = msg.payload.color || '#1A5FFF';
      ctx.lineWidth = msg.payload.width || 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();
    })
    .on('broadcast', { event: 'load-sim' }, (msg) => {
      const isHost = (State.user && (State.user.role === 'tutor' || State.user.role === 'admin')) || window._isLabHost;
      if (isHost) return;
      const overlay = document.getElementById('sim-overlay');
      const iframe = document.getElementById('sim-iframe');
      const title = document.getElementById('sim-title');
      if (!overlay || !iframe) return;
      // Set src to empty first to force a full reload at the exact URL
      iframe.src = '';
      setTimeout(() => {
        iframe.src = msg.payload.url;
      }, 80);
      if (title) title.textContent = '🔬 ' + (msg.payload.name || 'STEM Lab');
      overlay.style.display = 'block'; // must be block, not flex
      toast('📺 Tutor opened: ' + (msg.payload.name || 'resource'), 'info');
    })
    
    .on('broadcast', { event: 'close-sim' }, () => {
      const isHost = (State.user && (State.user.role === 'tutor' || State.user.role === 'admin')) || window._isLabHost;
      if (isHost) return;
      const iframe = document.getElementById('sim-iframe');
      const overlay = document.getElementById('sim-overlay');
      if (iframe) iframe.src = 'about:blank'; // fully stops the iframe
      if (overlay) overlay.style.display = 'none';
      toast('Simulation closed by tutor', 'info');
    })
    .on('broadcast', { event: 'laser-move' }, (msg) => {
      let dot = document.getElementById('laser-dot');
      if (!dot) {
        dot = document.createElement('div');
        dot.id = 'laser-dot';
        document.getElementById('canvas-container').appendChild(dot);
      }
      const canvasBox = document.getElementById('grid-box');
      dot.style.display = 'block';
      dot.style.left = (msg.payload.x + canvasBox.offsetLeft) + 'px';
      dot.style.top = (msg.payload.y + canvasBox.offsetTop) + 'px';
      
      clearTimeout(window._laserTimer);
      window._laserTimer = setTimeout(() => { if(dot) dot.style.display = 'none'; }, 2000);
    })
    .on('broadcast', { event: 'jitsi-start' }, (msg) => {
      const isHost2 = State.user && (State.user.role === 'tutor' || State.user.role === 'admin');
      const isHostByFlag = window._isLabHost === true;
      if (isHost2 || isHostByFlag) return;
      const room = msg.payload.room;
      const displayName = encodeURIComponent('🎓 ' + (State.user?.full_name || window._wbGuestName || 'Student'));
      const url = `https://meet.jit.si/${room}`
        + `#config.prejoinPageEnabled=false`
        + `&config.startWithAudioMuted=true`
        + `&config.disableDeepLinking=true`
        + `&config.enableWelcomePage=false`
        + `&userInfo.displayName=${displayName}`;
      // Show a modal/toast so student can choose to join
      const notif = document.createElement('div');
      notif.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#0D1B40;color:#fff;padding:16px 24px;border-radius:12px;z-index:99999;font-size:14px;font-weight:700;display:flex;gap:12px;align-items:center;box-shadow:0 8px 32px rgba(0,0,0,0.5);';
      notif.innerHTML = `📹 Teacher started a video session! <button onclick="window.open('${url}','_blank');this.parentElement.remove();" style="background:#10B981;color:#fff;border:none;border-radius:8px;padding:8px 16px;cursor:pointer;font-weight:800;font-size:13px;">Join Now</button> <button onclick="this.parentElement.remove()" style="background:rgba(255,255,255,0.15);color:#fff;border:none;border-radius:8px;padding:8px 12px;cursor:pointer;">Dismiss</button>`;
      document.body.appendChild(notif);
      setTimeout(() => notif.remove(), 30000);
    })
    .on('broadcast', { event: 'doc-enter-start' }, (msg) => {
      window._docPendingSlides = new Array(msg.payload.total);
      window._docTotalSlides = msg.payload.total;
      window._docStudentMode = true;
    })
    .on('broadcast', { event: 'doc-slide-data' }, (msg) => {
      if (!window._docPendingSlides) return;
      window._docPendingSlides[msg.payload.idx] = msg.payload.data;
      const received = window._docPendingSlides.filter(Boolean).length;
      if (received === window._docTotalSlides) {
        window._docSlides = window._docPendingSlides;
        window._docCurrentSlide = msg.payload.current || 0;
        window._docAnnotations = {};
        enterPresentationMode();
      }
    })
    .on('broadcast', { event: 'doc-slide-change' }, (msg) => {
      if (window._docStudentMode) renderDocSlide(msg.payload.idx);
    })
    .on('broadcast', { event: 'doc-annotation' }, (msg) => {
      if (!window._docStudentMode || msg.payload.slide !== window._docCurrentSlide) return;
      const ac = document.getElementById('doc-anno-canvas');
      const ctx = window._docAnnoCtx;
      if (!ac || !ctx) return;
      const img = new Image();
      img.onload = () => { ctx.clearRect(0,0,ac.width,ac.height); ctx.drawImage(img,0,0); };
      img.src = msg.payload.dataUrl;
    })
    .on('broadcast', { event: 'doc-laser' }, (msg) => {
      if (!window._docStudentMode) return;
      const dot = document.getElementById('doc-laser-dot');
      const ac = document.getElementById('doc-anno-canvas');
      if (!dot || !ac) return;
      dot.style.display = 'block';
      dot.style.left = (msg.payload.x * ac.width) + 'px';
      dot.style.top = (msg.payload.y * ac.height) + 'px';
      clearTimeout(window._docLaserTimer);
      window._docLaserTimer = setTimeout(() => { if (dot) dot.style.display = 'none'; }, 2000);
    })
    .on('broadcast', { event: 'doc-scroll' }, (msg) => {
      if (!window._docStudentMode) return;
      const vp = document.getElementById('doc-viewport');
      if (vp) { vp.scrollTop = msg.payload.scrollTop; vp.scrollLeft = msg.payload.scrollLeft; }
    })
    .on('broadcast', { event: 'doc-zoom' }, (msg) => {
      if (!window._docStudentMode) return;
      window._docZoom = msg.payload.zoom; applyDocZoom();
    })
    .on('broadcast', { event: 'doc-exit' }, () => {
      if (!window._docStudentMode) return;
      window._docStudentMode = false;
      const ov = document.getElementById('doc-present-overlay');
      const cc = document.getElementById('canvas-container');
      if (ov) ov.style.display = 'none';
      if (cc) cc.style.display = 'flex';
      window._docSlides = []; toast('Tutor ended the presentation', 'info');
    })
    .subscribe();
  setupDocStudentListeners(channel);
  // NOTE: doc student listeners are chained inside setupDocStudentListeners before subscribe � see below

    // Helper: send an object
    const sendObj = (obj) => {
      if (!obj || obj.remote) return;
      if (!obj.id) obj.set('id', Math.random().toString(36).substring(2, 9));
      try {
        channel.send({ type: 'broadcast', event: 'draw', payload: obj.toObject(['id']) });
      } catch(e) {}
    };

    // Sync: object added (shapes, text, completed strokes)
    canvas.on('object:added', (e) => sendObj(e.target));

    // Sync: object moved/scaled/rotated
    canvas.on('object:modified', (e) => sendObj(e.target));

    // Sync: freehand path after completed stroke
    canvas.on('path:created', (e) => sendObj(e.path));

    // Live stroke streaming: send points while tutor is still drawing
    let _liveStroke = null;
    canvas.on('mouse:down', () => { _liveStroke = []; });
    // --- UNIFIED MOUSE MOVE (Laser + Live Drawing + Cursor Sync) ---
    
    canvas.on('mouse:move', (e) => {
      const pt = canvas.getPointer(e.e);
      const isHost = State.user && (State.user.role === 'tutor' || State.user.role === 'admin');

      if (window._activeWBTool === 'laser' && isHost) {
        let dot = document.getElementById('laser-dot');
        const canvasBox = document.getElementById('grid-box');
        if(dot) {
           dot.style.display = 'block';
           dot.style.left = (pt.x + canvasBox.offsetLeft) + 'px';
           dot.style.top = (pt.y + canvasBox.offsetTop) + 'px';
        }
        try {
          channel.send({ type: 'broadcast', event: 'laser-move', payload: { x: Math.round(pt.x), y: Math.round(pt.y) } });
        } catch(err) {}
        return; 
      }

      try {
        channel.send({ type: 'broadcast', event: 'cursor', payload: {
          x: Math.round(pt.x), y: Math.round(pt.y),
          name: (State.user?.full_name || 'User'),
          role: (State.user?.role || 'student')
        }});
      } catch(err) {}
    });

    // Sync: deletions
    canvas.on('object:removed', (e) => {
      if (!e.target || e.target.remote) return;
      if (e.target.id) {
        try { channel.send({ type: 'broadcast', event: 'del', payload: { id: e.target.id } }); } catch(e2) {}
      }
    });

  }
  

  // Remote cursor renderer
  let remoteCursorEl = null;
  function showRemoteCursor(data) {
    if (!data || data.role !== 'tutor') return;
    if (!remoteCursorEl) {
      remoteCursorEl = document.createElement('div');
      remoteCursorEl.style.cssText = 'position:absolute;pointer-events:none;z-index:600;transition:left 0.05s,top 0.05s;';
      remoteCursorEl.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20"><polygon points="0,0 0,16 5,12 8,20 10,19 7,11 13,11" fill="#F5A623" stroke="#0D1B40" stroke-width="1"/></svg><span style="background:#F5A623;color:#0D1B40;font-size:10px;font-weight:900;padding:1px 5px;border-radius:4px;margin-left:2px;white-space:nowrap;"></span>';
      const cc = document.getElementById('canvas-container');
      if (cc) cc.style.position = 'relative', cc.appendChild(remoteCursorEl);
    }
    const label = remoteCursorEl.querySelector('span');
    if (label) label.textContent = '👨‍🏫 ' + (data.name || 'Tutor');
    remoteCursorEl.style.left = (data.x + (document.getElementById('grid-box')?.offsetLeft || 0)) + 'px';
    remoteCursorEl.style.top = (data.y + (document.getElementById('grid-box')?.offsetTop || 0)) + 'px';
    remoteCursorEl.style.display = 'block';
    clearTimeout(remoteCursorEl._hideTimer);
    remoteCursorEl._hideTimer = setTimeout(() => { if (remoteCursorEl) remoteCursorEl.style.display = 'none'; }, 3000);
  }

  // -- RTC Signaling via Supabase channel ----------------------
  // Store channel globally so the engine outside can use it
  window._wbChannel = channel;

  if (channel) {
    channel
    .on('broadcast', { event: 'rtc-call-started' }, async (msg) => {
      if (_rtcIsMe(msg)) return;
      
      const iAmHost = (State.user && (State.user.role === 'tutor' || State.user.role === 'admin')) || window._isLabHost;

      if (_rtcStarted) {
        window._rtcRemoteName = msg.payload.name;
        if (iAmHost) {
          // Wait longer to ensure student peer is fully ready
          setTimeout(async () => {
            try { await _rtcStartAsHost(); } catch(e) { console.error('Signaling Error:', e); }
          }, 2000);
        } else if (!msg.payload.isReply) {
          _rtcSend('rtc-call-started', {
            name: State.user?.full_name || window._wbGuestName || 'Student',
            isHost: false,
            isReply: true
          });
        }
        return;
      }

      if (msg.payload.isReply) return;

      window._rtcRemoteName = msg.payload.name;
      const btn = document.getElementById('lab-video-btn');
      if (btn) {
        btn.textContent = '\uD83D\uDCF9 Join Call';
        btn.style.background = 'rgba(16,185,129,0.7)';
      }

      document.getElementById('rtc-call-notif')?.remove();
      const notif = document.createElement('div');
      notif.id = 'rtc-call-notif';
      notif.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#0D1B40;color:#fff;padding:16px 24px;border-radius:12px;z-index:99999;font-size:14px;font-weight:700;display:flex;gap:12px;align-items:center;box-shadow:0 8px 32px rgba(0,0,0,0.5);border:2px solid #10B981;';
      notif.innerHTML = `\uD83D\uDCF9 <strong>${msg.payload.name}</strong> is calling... <button onclick="document.getElementById('rtc-call-notif')?.remove();window.toggleLabVideo();" style="background:#10B981;color:#fff;border:none;border-radius:8px;padding:8px 16px;cursor:pointer;font-weight:800;font-size:13px;">Answer \uD83D\uDCDE</button> <button onclick="document.getElementById('rtc-call-notif')?.remove()" style="background:rgba(255,255,255,0.15);color:#fff;border:none;border-radius:8px;padding:8px 12px;cursor:pointer;">Ignore</button>`;
      document.body.appendChild(notif);
      setTimeout(() => notif.remove(), 30000);
    })
    .on('broadcast', { event: 'rtc-offer' }, async (msg) => {
      if (_rtcIsMe(msg)) return;
      const iAmHost = (State.user && (State.user.role === 'tutor' || State.user.role === 'admin')) || window._isLabHost;
      if (iAmHost) return;
      // Store the offer � answer it when student clicks "Answer" or immediately if already started
      _rtcPendingOffer = msg.payload.sdp;
      if (_rtcStarted) {
        // Student already clicked Answer � process immediately
        try { await _rtcAnswerOffer(_rtcPendingOffer, window._rtcRemoteName || 'Tutor'); _rtcPendingOffer = null; }
        catch(e) { toast('Could not connect: ' + e.message, 'err'); }
      }
    })
    .on('broadcast', { event: 'rtc-answer' }, async (msg) => {
      if (_rtcIsMe(msg)) return;
      if (_rtcPeer && _rtcPeer.signalingState === 'have-local-offer') {
        try {
          const desc = msg.payload.sdp;
          await _rtcPeer.setRemoteDescription(new RTCSessionDescription({ type: desc.type, sdp: desc.sdp }));
        } catch(e) { console.warn('rtc-answer error:', e); }
      }
    })
    .on('broadcast', { event: 'rtc-ice' }, async (msg) => {
      if (_rtcIsMe(msg)) return;
      if (_rtcPeer && msg.payload.candidate) {
        try { await _rtcPeer.addIceCandidate(new RTCIceCandidate(msg.payload.candidate)); } catch(e) {}
      }
    })
    .on('broadcast', { event: 'rtc-end' }, (msg) => {
      if (_rtcIsMe(msg)) return;
      if (_rtcStarted) {
        // Other party hung up � clean up without sending rtc-end again
        _rtcCleanPeer();
        if (_localStream) { _localStream.getTracks().forEach(t => t.stop()); _localStream = null; }
        const lv = document.getElementById('lab-local-video');
        if (lv) lv.srcObject = null;
        const rv = document.getElementById('lab-remote-video');
        if (rv) rv.srcObject = null;
        _rtcStarted = false;
        _rtcSetBtn(false);
        _rtcHidePanel();
        const btn2 = document.getElementById('lab-video-btn');
        if (btn2) { btn2.textContent = '📹 Video Call'; btn2.style.background = 'rgba(255,255,255,0.12)'; btn2.style.animation = ''; btn2.style.boxShadow = ''; }
        toast('The other party ended the call.', 'info');
      }
    });
  }
}
// ------------------------------------------------------------
// WEBRTC VIDEO ENGINE � globals accessible everywhere
// channel reference stored on window so functions outside
// initWhiteboardSync can use it
// ------------------------------------------------------------
var _rtcPeer = null;
var _localStream = null;
var _rtcStarted = false;
var _rtcIsHost = false;
var STUN = { iceServers: [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' }
]};

// Store my own identity so we can ignore our own broadcasts
var _rtcMyId = Math.random().toString(36).slice(2);
var _rtcPendingOffer = null;

function _rtcGetChannel() {
  return window._wbChannel || null;
}

function _rtcSend(event, payload) {
  const ch = _rtcGetChannel();
  // If channel doesn't exist or isn't fully 'joined', wait and retry. 
  // This stops the "Falling back to REST" console error.
  if (!ch || ch.state !== 'joined') {
    setTimeout(() => _rtcSend(event, payload), 300);
    return;
  }
  try {
    const safe = JSON.parse(JSON.stringify(payload));
    ch.send({ 
      type: 'broadcast', 
      event: event, 
      payload: { ...safe, _senderId: _rtcMyId }
    });
  } catch(e) { console.warn('_rtcSend failed:', e); }
}

function _rtcIsMe(msg) {
  return msg?.payload?._senderId === _rtcMyId;
}

function _rtcShowPanel() {
  const panel = document.getElementById('lab-video-panel');
  if (panel) panel.style.display = 'block';
  // Re-trigger play after panel is visible (hidden elements can't play)
  setTimeout(() => {
    const lv = document.getElementById('lab-local-video');
    if (lv && _localStream) { lv.srcObject = _localStream; lv.play().catch(()=>{}); }
    const rv = document.getElementById('lab-remote-video');
    if (rv && rv.srcObject) { rv.play().catch(()=>{}); }
  }, 100);
}

function _rtcHidePanel() {
  const panel = document.getElementById('lab-video-panel');
  if (panel) panel.style.display = 'none';
}

function _rtcSetBtn(active) {
  const btn = document.getElementById('lab-video-btn');
  const shareBtn = document.getElementById('share-screen-btn');
  const iAmHost = !!(State.user && (State.user.role === 'tutor' || State.user.role === 'admin')) || !!window._isLabHost;

  if (!btn) return;
  if (active) {
    btn.style.background = 'rgba(239,68,68,0.8)';
    btn.style.color = '#fff';
    btn.textContent = '\uD83D\uDCF9 End Call';
    if (iAmHost && shareBtn) shareBtn.style.display = 'inline-flex';
  } else {
    btn.style.background = 'rgba(255,255,255,0.12)';
    btn.style.color = '#fff';
    btn.textContent = '\uD83D\uDCF9 Video Call';
    if (shareBtn) {
      if (window._isSharingScreen) stopScreenShare();
      shareBtn.style.display = 'none';
    }
  }
}

async function _rtcGetMedia() {
  if (_localStream) {
    // Re-assign to video element every time in case panel was hidden when first set
    const lv = document.getElementById('lab-local-video');
    if (lv && lv.srcObject !== _localStream) {
      lv.srcObject = _localStream;
      lv.play().catch(()=>{});
    }
    return _localStream;
  }
  _localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  const lv = document.getElementById('lab-local-video');
  if (lv) {
    lv.srcObject = _localStream;
    lv.play().catch(()=>{});
  }
  return _localStream;
}

function _rtcCleanPeer() {
  if (_rtcPeer) {
    _rtcPeer.onicecandidate = null;
    _rtcPeer.ontrack = null;
    _rtcPeer.onconnectionstatechange = null;
    try { _rtcPeer.close(); } catch(e) {}
    _rtcPeer = null;
  }
}

function _rtcMakePeer(remoteName) {
  _rtcCleanPeer();
  _rtcPeer = new RTCPeerConnection(STUN);

  // When we get remote video/audio
   _rtcPeer.ontrack = (e) => {
    const rv = document.getElementById('lab-remote-video');
    if (rv) { 
      rv.srcObject = e.streams[0]; 
      rv.play().catch(()=>{}); 
      // ADD THIS LINE BELOW
      rv.title = "Double-click to enlarge";
      rv.ondblclick = () => document.getElementById('lab-video-panel').classList.toggle('fullscreen-video');
    }
    const s = document.getElementById('lab-call-status');
    if (s) s.style.display = 'none';
    const lb = document.getElementById('lab-remote-label');
    if (lb) lb.textContent = remoteName || 'Connected';
    _rtcShowPanel();
  };

  // Send ICE candidates to the other side
  _rtcPeer.onicecandidate = (e) => {
    if (e.candidate) _rtcSend('rtc-ice', { candidate: e.candidate });
  };

  // Connection state changes
  _rtcPeer.onconnectionstatechange = () => {
    const state = _rtcPeer ? _rtcPeer.connectionState : '';
    const s = document.getElementById('lab-call-status');
    if (state === 'connected') {
      toast('📹 Video call connected!', 'ok');
      if (s) s.style.display = 'none';
    }
    if (state === 'disconnected' || state === 'failed') {
      if (s) { s.style.display = 'flex'; s.textContent = '⚠️ Connection lost...'; }
      toast('Video call disconnected.', 'err');
    }
  };

  return _rtcPeer;
}

// Called by host (tutor) to start the call
async function _rtcStartAsHost() {
  const stream = await _rtcGetMedia();
  const peer = _rtcMakePeer('Student');
  stream.getTracks().forEach(t => peer.addTrack(t, stream));

  const offer = await peer.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
  await peer.setLocalDescription(offer);

  // Send plain serializable object � not RTCSessionDescription instance
  _rtcSend('rtc-offer', { sdp: { type: peer.localDescription.type, sdp: peer.localDescription.sdp } });
}

// Called by student when they receive an offer
async function _rtcAnswerOffer(sdp, hostName) {
  const stream = await _rtcGetMedia();
  const peer = _rtcMakePeer(hostName || 'Tutor');
  stream.getTracks().forEach(t => peer.addTrack(t, stream));

  const desc = typeof sdp === 'string' ? JSON.parse(sdp) : sdp;
  await peer.setRemoteDescription(new RTCSessionDescription(desc));
  const answer = await peer.createAnswer();
  await peer.setLocalDescription(answer);

  // Serialize answer safely before sending
  _rtcSend('rtc-answer', { sdp: { type: peer.localDescription.type, sdp: peer.localDescription.sdp } });
  _rtcShowPanel();
  _rtcStarted = true;
  _rtcSetBtn(true);
}

window.toggleLabVideo = async () => {
  if (_rtcStarted) {
    window.stopLabVideo();
    return;
  }

  _rtcShowPanel();
  _rtcIsHost = !!(State.user && (State.user.role === 'tutor' || State.user.role === 'admin')) || !!window._isLabHost;

  try {
    await _rtcGetMedia();
    _rtcStarted = true;
    _rtcSetBtn(true);

    // Tell the other person I am ready
    _rtcSend('rtc-call-started', {
      name: State.user?.full_name || window._wbGuestName || (_rtcIsHost ? 'Tutor' : 'Student'),
      isHost: _rtcIsHost
    });

    // Student: if tutor already sent an offer, answer it after a short delay
    // to ensure our peer connection listeners are attached
    if (!_rtcIsHost && _rtcPendingOffer) {
      setTimeout(async () => {
        try {
          await _rtcAnswerOffer(_rtcPendingOffer, window._rtcRemoteName || 'Tutor');
          _rtcPendingOffer = null;
        } catch(e) { console.error('Answer error:', e); }
      }, 1000);
    }

    // Tutor: if student is already in the call (sent rtc-call-started before us),
    // send the offer after giving student time to set up their peer
    if (_rtcIsHost && window._rtcRemoteName) {
      setTimeout(async () => {
        try { await _rtcStartAsHost(); } catch(e) { console.error('Offer error:', e); }
      }, 2000);
    }

  } catch(e) {
    toast('Camera/mic error: ' + e.message, 'err');
    _rtcStarted = false; _rtcSetBtn(false); _rtcHidePanel();
  }
};

window.stopLabVideo = () => {
  const wasStarted = _rtcStarted;
  _rtcCleanPeer();
  if (_localStream) {
    _localStream.getTracks().forEach(t => t.stop());
    _localStream = null;
  }
  const lv = document.getElementById('lab-local-video');
  if (lv) lv.srcObject = null;
  const rv = document.getElementById('lab-remote-video');
  if (rv) rv.srcObject = null;
  _rtcStarted = false;
  _rtcSetBtn(false);
  _rtcHidePanel();
  // Also reset "Join Call" state if it was showing
  document.getElementById('rtc-call-notif')?.remove();
  const btn = document.getElementById('lab-video-btn');
  if (btn) { btn.textContent = '📹 Video Call'; btn.style.background = 'rgba(255,255,255,0.12)'; btn.style.animation = ''; btn.style.boxShadow = ''; }
  if (wasStarted) {
    _rtcSend('rtc-end', {});
    toast('Video call ended.', 'info');
  }
};
window._isSharingScreen = false;
window._originalStream = null;

async function toggleScreenShare() {
  if (window._isSharingScreen) {
    stopScreenShare();
    return;
  }
  try {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
    const screenTrack = screenStream.getVideoTracks()[0];

    if (_rtcPeer && _rtcStarted) {
      const senders = _rtcPeer.getSenders();
      const videoSender = senders.find(s => s.track && s.track.kind === 'video');
      if (videoSender) videoSender.replaceTrack(screenTrack);
    }

    window._originalStream = _localStream;
    const localVid = document.getElementById('lab-local-video');
    if (localVid) localVid.srcObject = screenStream;

    const btn = document.getElementById('share-screen-btn');
    btn.innerHTML = "🚫 Stop Sharing";
    btn.style.background = "var(--red)";
    window._isSharingScreen = true;

    screenTrack.onended = () => stopScreenShare();
    toast("Sharing screen... Students see your screen in the video frame.", "ok");
  } catch (e) {
    toast("Screen share failed: " + e.message, "err");
  }
}

function stopScreenShare() {
  if (!window._isSharingScreen) return;
  const localVid = document.getElementById('lab-local-video');
  const videoTrack = window._originalStream.getVideoTracks()[0];

  if (_rtcPeer && _rtcStarted) {
    const senders = _rtcPeer.getSenders();
    const videoSender = senders.find(s => s.track && s.track.kind === 'video');
    if (videoSender) videoSender.replaceTrack(videoTrack);
  }

  if (localVid) localVid.srcObject = window._originalStream;
  const btn = document.getElementById('share-screen-btn');
  btn.innerHTML = "🖥️ Share Screen";
  btn.style.background = "rgba(255,255,255,0.12)";
  window._isSharingScreen = false;
}
// -- Video panel drag to move ---------------------------------
(function initVideoPanelDrag() {
  // Run after DOM is ready
  const tryInit = () => {
    const panel = document.getElementById('lab-video-panel');
    const handle = document.getElementById('lab-vid-drag-handle');
    if (!panel || !handle) { setTimeout(tryInit, 300); return; }
    let dragging = false, ox = 0, oy = 0;
    handle.addEventListener('mousedown', (e) => {
      if (e.target.tagName === 'BUTTON') return;
      dragging = true;
      // Switch from bottom/right to top/left positioning
      const r = panel.getBoundingClientRect();
      panel.style.right = 'auto';
      panel.style.bottom = 'auto';
      panel.style.left = r.left + 'px';
      panel.style.top = r.top + 'px';
      ox = e.clientX - r.left;
      oy = e.clientY - r.top;
      handle.style.cursor = 'grabbing';
      e.preventDefault();
    });
    document.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      panel.style.left = Math.max(0, Math.min(window.innerWidth - 80, e.clientX - ox)) + 'px';
      panel.style.top  = Math.max(0, Math.min(window.innerHeight - 80, e.clientY - oy)) + 'px';
    });
    document.addEventListener('mouseup', () => { dragging = false; handle.style.cursor = 'grab'; });
    // Touch support
    handle.addEventListener('touchstart', (e) => {
      if (e.target.tagName === 'BUTTON') return;
      const t = e.touches[0];
      const r = panel.getBoundingClientRect();
      panel.style.right = 'auto'; panel.style.bottom = 'auto';
      panel.style.left = r.left + 'px'; panel.style.top = r.top + 'px';
      ox = t.clientX - r.left; oy = t.clientY - r.top;
      dragging = true;
    }, { passive: true });
    document.addEventListener('touchmove', (e) => {
      if (!dragging) return;
      const t = e.touches[0];
      panel.style.left = Math.max(0, e.clientX - ox) + 'px';
      panel.style.top  = Math.max(0, t.clientY - oy) + 'px';
    }, { passive: true });
    document.addEventListener('touchend', () => { dragging = false; });
  };
  setTimeout(tryInit, 500);
})();
window.toggleLabVideoMute = () => {
  if (!_localStream) return;
  const t = _localStream.getAudioTracks()[0];
  if (!t) return;
  t.enabled = !t.enabled;
  const btn = document.getElementById('lab-vid-mute-btn');
  if (btn) btn.textContent = t.enabled ? '🎤 Mute' : '🔇 Unmute';
};

window.toggleLabVideoCam = () => {
  if (!_localStream) return;
  const t = _localStream.getVideoTracks()[0];
  if (!t) return;
  t.enabled = !t.enabled;
  const btn = document.getElementById('lab-vid-cam-btn');
  if (btn) btn.textContent = t.enabled ? '📷 Cam' : '🚫 Cam Off';
};

// -- Exit Lab -------------------------------------------------
function exitMajesticLab() {
  if (window._rtcStarted && typeof window.stopLabVideo === 'function') window.stopLabVideo();
  if (window.wbInstance) { try { window.wbInstance.dispose(); } catch(e){} window.wbInstance = null; }
  if (window._wbChannel) {
    const sb = getSupabase();
    if (sb) try { sb.removeChannel(window._wbChannel); } catch(e){}
    window._wbChannel = null;
  }
  // Navigate back
  const prev = State.prevPage || 'dashboard';
  navigate(prev, State.prevTab);
}

// -- Tutor direct lab (no session) ----------------------------
function openTutorLabDirect() {
  window._wbInstitutionName = '';
  window._isLabHost = true;
  renderWhiteboard('tutor_' + State.user.id + '_' + Date.now());
}

// -- Document Presentation � missing helpers -------------------

function renderDocSlide(idx) {
  const slideCtx = window._docSlideCtx;
  const annoCtx  = window._docAnnoCtx;
  if (!slideCtx || !window._docSlides || !window._docSlides[idx]) return;
  window._docCurrentSlide = idx;

  const img = new Image();
  img.onload = () => {
    slideCtx.clearRect(0, 0, window._docCW, window._docCH);
    slideCtx.drawImage(img, 0, 0, window._docCW, window._docCH);
    // Restore annotations for this slide
    if (annoCtx) {
      annoCtx.clearRect(0, 0, window._docCW, window._docCH);
      const saved = window._docAnnotations[idx];
      if (saved) {
        const imgData = new ImageData(new Uint8ClampedArray(saved.data), saved.width, saved.height);
        annoCtx.putImageData(imgData, 0, 0);
      }
    }
  };
  img.src = window._docSlides[idx];

  // Update counter
  const counter = document.getElementById('doc-slide-counter');
  if (counter) counter.textContent = `${idx + 1} / ${window._docSlides.length}`;

  // Update thumb strip active state
  document.querySelectorAll('.doc-thumb').forEach((t, i) => {
    t.style.border = i === idx ? '2px solid #1A5FFF' : '2px solid transparent';
  });

  // Broadcast to students
  const ch = window._wbChannel;
  if (ch && !window._docStudentMode) {
    try { ch.send({ type: 'broadcast', event: 'doc-slide-change', payload: { idx } }); } catch(e) {}
  }
}

function docPrevSlide() {
  if (window._docCurrentSlide > 0) renderDocSlide(window._docCurrentSlide - 1);
}

function docNextSlide() {
  if (window._docCurrentSlide < (window._docSlides?.length || 1) - 1) renderDocSlide(window._docCurrentSlide + 1);
}

function buildThumbStrip() {
  const strip = document.getElementById('doc-thumb-strip');
  if (!strip || !window._docSlides) return;
  strip.innerHTML = window._docSlides.map((src, i) => `
    <img class="doc-thumb" src="${src}" onclick="renderDocSlide(${i})"
      style="height:48px;width:auto;border-radius:4px;cursor:pointer;border:2px solid ${i === 0 ? '#1A5FFF' : 'transparent'};flex-shrink:0;object-fit:cover;"/>`
  ).join('');
}

function docSetTool(tool) {
  window._docTool = tool;
  const annoCanvas = document.getElementById('doc-anno-canvas');
  if (!annoCanvas) return;
  if (tool === 'laser') {
    annoCanvas.style.cursor = 'none';
  } else if (tool === 'text') {
    annoCanvas.style.cursor = 'text';
  } else {
    annoCanvas.style.cursor = 'crosshair';
  }
  // Highlight active tool button
  ['pen','highlight','arrow','text','laser'].forEach(t => {
    const btn = document.getElementById('doc-tool-' + t);
    if (btn) btn.style.background = t === tool ? 'var(--blue)' : 'rgba(255,255,255,0.1)';
  });
}

function setupDocAnnotationEvents(annoCanvas) {
  if (!annoCanvas) return;
  annoCanvas.style.pointerEvents = 'auto';
  let drawing = false;
  let lastX = 0, lastY = 0;
  let arrowStart = null;

  const getPos = (e) => {
    const rect = annoCanvas.getBoundingClientRect();
    const scaleX = annoCanvas.width / rect.width;
    const scaleY = annoCanvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  };

  const onDown = (e) => {
    const pos = getPos(e);
    drawing = true;
    lastX = pos.x; lastY = pos.y;
    if (window._docTool === 'arrow') arrowStart = { x: pos.x, y: pos.y };
    if (window._docTool === 'text') {
      drawing = false;
      const text = prompt('Enter text:');
      if (text && window._docAnnoCtx) {
        const ctx = window._docAnnoCtx;
        ctx.font = '20px DM Sans, Arial';
        ctx.fillStyle = document.getElementById('doc-pen-color')?.value || '#EF4444';
        ctx.fillText(text, pos.x, pos.y);
        saveDocAnnotation();
        broadcastDocAnnotation();
      }
    }
  };

  const onMove = (e) => {
    if (!drawing) return;
    const pos = getPos(e);
    const ctx = window._docAnnoCtx;
    if (!ctx) return;
    const color = document.getElementById('doc-pen-color')?.value || '#EF4444';
    const width = parseInt(document.getElementById('doc-pen-width')?.value || '4');

    if (window._docTool === 'laser') {
      const dot = document.getElementById('doc-laser-dot');
      if (dot) { dot.style.display = 'block'; dot.style.left = pos.x + 'px'; dot.style.top = pos.y + 'px'; }
      const ch = window._wbChannel;
      if (ch) try { ch.send({ type: 'broadcast', event: 'doc-laser', payload: { x: pos.x / annoCanvas.width, y: pos.y / annoCanvas.height } }); } catch(e) {}
      return;
    }
    if (window._docTool === 'pen') {
      ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(lastX, lastY); ctx.lineTo(pos.x, pos.y); ctx.stroke();
    } else if (window._docTool === 'highlight') {
      ctx.strokeStyle = color + '80'; ctx.lineWidth = width * 4; ctx.lineCap = 'square';
      ctx.beginPath(); ctx.moveTo(lastX, lastY); ctx.lineTo(pos.x, pos.y); ctx.stroke();
    }
    lastX = pos.x; lastY = pos.y;
    broadcastDocAnnotation();
  };

  const onUp = (e) => {
    if (!drawing) return;
    drawing = false;
    if (window._docTool === 'arrow' && arrowStart) {
      const pos = getPos(e);
      const ctx = window._docAnnoCtx;
      if (ctx) {
        const color = document.getElementById('doc-pen-color')?.value || '#EF4444';
        const width = parseInt(document.getElementById('doc-pen-width')?.value || '4');
        ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(arrowStart.x, arrowStart.y); ctx.lineTo(pos.x, pos.y); ctx.stroke();
        // Arrowhead
        const angle = Math.atan2(pos.y - arrowStart.y, pos.x - arrowStart.x);
        const headLen = 16;
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(pos.x - headLen * Math.cos(angle - 0.4), pos.y - headLen * Math.sin(angle - 0.4));
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(pos.x - headLen * Math.cos(angle + 0.4), pos.y - headLen * Math.sin(angle + 0.4));
        ctx.stroke();
      }
      arrowStart = null;
      broadcastDocAnnotation();
    }
    saveDocAnnotation();
  };

  annoCanvas.addEventListener('mousedown', onDown);
  annoCanvas.addEventListener('mousemove', onMove);
  annoCanvas.addEventListener('mouseup', onUp);
  annoCanvas.addEventListener('touchstart', onDown, { passive: true });
  annoCanvas.addEventListener('touchmove', onMove, { passive: true });
  annoCanvas.addEventListener('touchend', onUp, { passive: true });
  annoCanvas._docHandlers = { onDown, onMove, onUp };
}

function removeDocAnnotationEvents() {
  const annoCanvas = document.getElementById('doc-anno-canvas');
  if (!annoCanvas || !annoCanvas._docHandlers) return;
  const { onDown, onMove, onUp } = annoCanvas._docHandlers;
  annoCanvas.removeEventListener('mousedown', onDown);
  annoCanvas.removeEventListener('mousemove', onMove);
  annoCanvas.removeEventListener('mouseup', onUp);
  annoCanvas.removeEventListener('touchstart', onDown);
  annoCanvas.removeEventListener('touchmove', onMove);
  annoCanvas.removeEventListener('touchend', onUp);
  annoCanvas.style.pointerEvents = 'none';
}

function saveDocAnnotation() {
  const ctx = window._docAnnoCtx;
  if (!ctx) return;
  const imageData = ctx.getImageData(0, 0, window._docCW, window._docCH);
  window._docAnnotations[window._docCurrentSlide] = {
    data: Array.from(imageData.data),
    width: imageData.width,
    height: imageData.height
  };
}

function broadcastDocAnnotation() {
  const annoCanvas = document.getElementById('doc-anno-canvas');
  const ch = window._wbChannel;
  if (!ch || !annoCanvas) return;
  try {
    ch.send({ type: 'broadcast', event: 'doc-annotation', payload: {
      slide: window._docCurrentSlide,
      dataUrl: annoCanvas.toDataURL('image/png', 0.5)
    }});
  } catch(e) {}
}

function broadcastDocScroll(scrollTop, scrollLeft) {
  const ch = window._wbChannel;
  if (!ch) return;
  try { ch.send({ type: 'broadcast', event: 'doc-scroll', payload: { scrollTop, scrollLeft } }); } catch(e) {}
}

function setupDocStudentListeners(channel) {
  if (!channel) return;
  let _pendingSlides = [];
  let _totalSlides = 0;

  channel
    .on('broadcast', { event: 'doc-enter-start' }, (msg) => {
      _totalSlides = msg.payload.total;
      _pendingSlides = new Array(_totalSlides);
      window._docStudentMode = true;
    })
    .on('broadcast', { event: 'doc-slide-data' }, (msg) => {
      _pendingSlides[msg.payload.idx] = msg.payload.data;
      const received = _pendingSlides.filter(Boolean).length;
      if (received === _totalSlides) {
        window._docSlides = _pendingSlides;
        window._docCurrentSlide = msg.payload.current || 0;
        window._docAnnotations = {};
        enterPresentationMode();
      }
    })
    .on('broadcast', { event: 'doc-slide-change' }, (msg) => {
      if (window._docStudentMode) renderDocSlide(msg.payload.idx);
    })
    .on('broadcast', { event: 'doc-annotation' }, (msg) => {
      if (!window._docStudentMode) return;
      if (msg.payload.slide !== window._docCurrentSlide) return;
      const annoCanvas = document.getElementById('doc-anno-canvas');
      const ctx = window._docAnnoCtx;
      if (!annoCanvas || !ctx) return;
      const img = new Image();
      img.onload = () => { ctx.clearRect(0, 0, annoCanvas.width, annoCanvas.height); ctx.drawImage(img, 0, 0); };
      img.src = msg.payload.dataUrl;
    })
    .on('broadcast', { event: 'doc-laser' }, (msg) => {
      if (!window._docStudentMode) return;
      const annoCanvas = document.getElementById('doc-anno-canvas');
      const dot = document.getElementById('doc-laser-dot');
      if (!dot || !annoCanvas) return;
      dot.style.display = 'block';
      dot.style.left = (msg.payload.x * annoCanvas.width) + 'px';
      dot.style.top  = (msg.payload.y * annoCanvas.height) + 'px';
      clearTimeout(window._docLaserTimer);
      window._docLaserTimer = setTimeout(() => { if (dot) dot.style.display = 'none'; }, 2000);
    })
    .on('broadcast', { event: 'doc-scroll' }, (msg) => {
      if (!window._docStudentMode) return;
      const vp = document.getElementById('doc-viewport');
      if (vp) { vp.scrollTop = msg.payload.scrollTop; vp.scrollLeft = msg.payload.scrollLeft; }
    })
    .on('broadcast', { event: 'doc-zoom' }, (msg) => {
      if (!window._docStudentMode) return;
      window._docZoom = msg.payload.zoom;
      applyDocZoom();
    })
    .on('broadcast', { event: 'doc-exit' }, () => {
      if (!window._docStudentMode) return;
      window._docStudentMode = false;
      const overlay = document.getElementById('doc-present-overlay');
      const cc = document.getElementById('canvas-container');
      if (overlay) overlay.style.display = 'none';
      if (cc) cc.style.display = 'flex';
      window._docSlides = [];
      toast('Tutor ended the presentation', 'info');
    });
}
