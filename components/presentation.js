// ── Document Presentation Functions ─────────────────────────────────────────
// These were missing from whiteboard.js — loaded separately via index.html

async function openPresentationDoc(input) {
  const file = input.files[0];
  if (!file) return;
  input.value = '';
  const ext = file.name.split('.').pop().toLowerCase();
  toast('Loading document...', 'info');

  if (ext === 'pdf') {
    try {
      if (!window.pdfjsLib) {
        await new Promise((res, rej) => {
          const s = document.createElement('script');
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
          s.onload = res; s.onerror = rej;
          document.head.appendChild(s);
        });
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      }
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const slides = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.8 });
        const offscreen = document.createElement('canvas');
        offscreen.width = viewport.width;
        offscreen.height = viewport.height;
        await page.render({ canvasContext: offscreen.getContext('2d'), viewport }).promise;
        slides.push(offscreen.toDataURL('image/png'));
      }
      window._docSlides = slides;
      window._docCurrentSlide = 0;
      window._docAnnotations = {};
      enterPresentationMode();
    } catch(e) {
      toast('PDF load failed: ' + e.message, 'err');
    }
    return;
  }

  // PPT/PPTX/DOC/DOCX: embed via object URL in iframe
  const url = URL.createObjectURL(file);
  const overlay = document.getElementById('doc-present-overlay');
  const vp = document.getElementById('doc-viewport');
  if (!overlay || !vp) return;
  vp.innerHTML = '';
  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.style.cssText = 'width:100%;height:100%;border:none;background:#fff;';
  iframe.setAttribute('allow', 'fullscreen');
  vp.appendChild(iframe);
  overlay.style.display = 'flex';
  document.getElementById('canvas-container').style.display = 'none';
  toast('Document loaded - students can see it in real time', 'info');
}

function enterPresentationMode() {
  const overlay = document.getElementById('doc-present-overlay');
  const cc = document.getElementById('canvas-container');
  if (!overlay || !window._docSlides || !window._docSlides.length) return;
  overlay.style.display = 'flex';
  if (cc) cc.style.display = 'none';
  const slideCanvas = document.getElementById('doc-slide-canvas');
  const annoCanvas  = document.getElementById('doc-anno-canvas');
  if (!slideCanvas || !annoCanvas) return;
  const firstImg = new Image();
  firstImg.onload = () => {
    const W = window.innerWidth;
    const H = Math.round(W * firstImg.naturalHeight / firstImg.naturalWidth);
    window._docCW = W; window._docCH = H;
    slideCanvas.width = W; slideCanvas.height = H;
    annoCanvas.width  = W; annoCanvas.height  = H;
    window._docSlideCtx = slideCanvas.getContext('2d');
    window._docAnnoCtx  = annoCanvas.getContext('2d');
    window._docZoom = 1;
    renderDocSlide(0);
    buildThumbStrip();
    setupDocAnnotationEvents(annoCanvas);
    docSetTool('pen');
    const ch = window._wbChannel;
    if (ch && !window._docStudentMode) {
      try {
        ch.send({ type: 'broadcast', event: 'doc-enter-start', payload: { total: window._docSlides.length } });
        window._docSlides.forEach((data, idx) => {
          setTimeout(() => {
            try { ch.send({ type: 'broadcast', event: 'doc-slide-data', payload: { idx, data, current: 0 } }); } catch(e) {}
          }, idx * 120);
        });
      } catch(e) {}
    }
    const docVp = document.getElementById('doc-viewport');
    if (docVp) docVp.addEventListener('scroll', () => broadcastDocScroll(docVp.scrollTop, docVp.scrollLeft));
  };
  firstImg.src = window._docSlides[0];
}

function closePresentationMode() {
  const overlay = document.getElementById('doc-present-overlay');
  const cc = document.getElementById('canvas-container');
  if (overlay) overlay.style.display = 'none';
  if (cc) cc.style.display = 'flex';
  removeDocAnnotationEvents();
  window._docSlides = [];
  window._docStudentMode = false;
  const ch = window._wbChannel;
  if (ch) try { ch.send({ type: 'broadcast', event: 'doc-exit', payload: {} }); } catch(e) {}
}

function zoomDoc(delta) {
  window._docZoom = Math.max(0.3, Math.min(3, (window._docZoom || 1) + delta));
  applyDocZoom();
  const ch = window._wbChannel;
  if (ch) try { ch.send({ type: 'broadcast', event: 'doc-zoom', payload: { zoom: window._docZoom } }); } catch(e) {}
}

function resetDocZoom() { window._docZoom = 1; applyDocZoom(); }

function applyDocZoom() {
  const container = document.getElementById('doc-zoom-container');
  const label = document.getElementById('doc-zoom-label');
  if (container) container.style.transform = 'scale(' + (window._docZoom || 1) + ')';
  if (label) label.textContent = Math.round((window._docZoom || 1) * 100) + '%';
}

function triggerFloatingImage() { document.getElementById('doc-float-img-upload')?.click(); }

function addDocFloatingImage(input) {
  const file = input.files[0];
  if (!file) return;
  input.value = '';
  const reader = new FileReader();
  reader.onload = (e) => {
    const wrap = document.getElementById('doc-floating-items');
    if (!wrap) return;
    const id = 'fi_' + Date.now();
    const div = document.createElement('div');
    div.id = id;
    div.style.cssText = 'position:absolute;top:40px;left:40px;cursor:move;user-select:none;pointer-events:auto;z-index:497;';
    const img = document.createElement('img');
    img.src = e.target.result;
    img.style.cssText = 'max-width:300px;max-height:300px;display:block;border:2px solid #1A5FFF;border-radius:4px;';
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'x';
    closeBtn.style.cssText = 'position:absolute;top:-8px;right:-8px;background:#EF4444;color:#fff;border:none;border-radius:50%;width:20px;height:20px;cursor:pointer;font-size:12px;';
    closeBtn.onclick = () => div.remove();
    div.appendChild(img);
    div.appendChild(closeBtn);
    let ox = 0, oy = 0, dragging = false;
    div.addEventListener('mousedown', (ev) => { if (ev.target.tagName === 'BUTTON') return; dragging = true; ox = ev.clientX - div.offsetLeft; oy = ev.clientY - div.offsetTop; });
    document.addEventListener('mousemove', (ev) => { if (!dragging) return; div.style.left = (ev.clientX - ox) + 'px'; div.style.top = (ev.clientY - oy) + 'px'; });
    document.addEventListener('mouseup', () => { dragging = false; });
    wrap.appendChild(div);
  };
  reader.readAsDataURL(file);
}
