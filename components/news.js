// NEWS_CATEGORIES is defined globally in app.js

async function insertNewsImage(input){
  const file = input.files[0]
  if(!file) return
  if(file.size > 5*1024*1024){ toast('Image must be under 5MB','err'); return }
  toast('Uploading image...')
  const form = new FormData()
  form.append('file', file)
  
  console.log('Token:', getToken()?.slice(0,20))
  try{
    const res = await fetch(API_URL + '/news/upload-image', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + getToken() },
      body: form
    })
    
    const data = await res.json()
  
    if(!res.ok) throw new Error(data.detail||'Upload failed')
   
    const editor = document.getElementById('news-editor')
    if(editor){
      const img = document.createElement('img')
      img.src = data.url
      img.style.cssText = 'max-width:100%;height:auto;border-radius:8px;margin:8px 0;display:block'
      editor.appendChild(img)
      toast('Image uploaded! ✅')

// Auto-populate the image URL field for card thumbnail
const imageUrlField = document.getElementById('news-image')
if(imageUrlField && !imageUrlField.value){
  imageUrlField.value = data.url
}
    } else {
      console.log('Editor not found!')
    }
  }catch(e){
    toast(e.message,'err')
  }
  input.value = ''
}

let _activeResizeImg = null
let _resizing = false
let _resizeHandle = null
let _resizeStartX = 0
let _resizeStartW = 0

function removeResizeHandles(){
  document.querySelectorAll('.img-resize-wrapper').forEach(w=>{
    const img = w.querySelector('img')
    if(img) w.parentNode.insertBefore(img, w)
    w.remove()
  })
  _activeResizeImg = null
}

function addResizeHandles(img){
  removeResizeHandles()
  _activeResizeImg = img

  const wrapper = document.createElement('div')
  wrapper.className = 'img-resize-wrapper'
  wrapper.style.cssText = `display:inline-block;position:relative;max-width:100%;line-height:0;outline:2px solid #1A5FFF;outline-offset:1px`
  wrapper.style.width = img.style.width || img.offsetWidth + 'px'

  img.style.width = '100%'
  img.style.height = 'auto'
  img.style.display = 'block'
  img.style.float = 'none'
  img.style.margin = '0'

  img.parentNode.insertBefore(wrapper, img)
  wrapper.appendChild(img)

  const handles = [
    { side:'left',  style:'left:-6px;top:50%;transform:translateY(-50%);cursor:ew-resize' },
    { side:'right', style:'right:-6px;top:50%;transform:translateY(-50%);cursor:ew-resize' },
  ]

  handles.forEach(({side, style})=>{
    const h = document.createElement('div')
    h.className = 'img-resize-handle'
    h.dataset.side = side
    h.style.cssText = `position:absolute;${style};width:12px;height:40px;background:#1A5FFF;border-radius:4px;display:flex;align-items:center;justify-content:center;user-select:none;z-index:100`
    h.innerHTML = `<span style="color:#fff;font-size:10px;line-height:1">⇔</span>`

    h.addEventListener('mousedown', e=>{
      e.preventDefault()
      _resizing = true
      _resizeHandle = side
      _resizeStartX = e.clientX
      _resizeStartW = wrapper.offsetWidth
      document.body.style.cursor = 'ew-resize'
      document.body.style.userSelect = 'none'
    })

    wrapper.appendChild(h)
  })

  // top-left and top-right corner handles
  const corners = [
    { name:'tl', style:'left:-6px;top:-6px;cursor:nwse-resize' },
    { name:'tr', style:'right:-6px;top:-6px;cursor:nesw-resize' },
    { name:'bl', style:'left:-6px;bottom:-6px;cursor:nesw-resize' },
    { name:'br', style:'right:-6px;bottom:-6px;cursor:nwse-resize' },
  ]
  corners.forEach(({name, style})=>{
    const c = document.createElement('div')
    c.style.cssText = `position:absolute;${style};width:12px;height:12px;background:#1A5FFF;border-radius:2px;z-index:100`
    c.addEventListener('mousedown', e=>{
      e.preventDefault()
      _resizing = true
      _resizeHandle = name.includes('r') ? 'right' : 'left'
      _resizeStartX = e.clientX
      _resizeStartW = wrapper.offsetWidth
      document.body.style.cursor = 'ew-resize'
      document.body.style.userSelect = 'none'
    })
    wrapper.appendChild(c)
  })

  // Show width badge
  const badge = document.createElement('div')
  badge.id = 'img-size-badge'
  badge.style.cssText = 'position:absolute;top:-28px;left:50%;transform:translateX(-50%);background:#0D1B40;color:#fff;font-size:11px;font-weight:700;padding:3px 8px;border-radius:4px;white-space:nowrap;z-index:200;pointer-events:none'
  badge.textContent = wrapper.offsetWidth + 'px'
  wrapper.appendChild(badge)
}

document.addEventListener('mousemove', e=>{
  if(!_resizing || !_activeResizeImg) return
  const wrapper = _activeResizeImg.closest('.img-resize-wrapper')
  if(!wrapper) return
  const dx = e.clientX - _resizeStartX
  let newW = _resizeHandle === 'right'
    ? _resizeStartW + dx
    : _resizeStartW - dx
  newW = Math.max(80, Math.min(newW, wrapper.parentElement.offsetWidth || 800))
  wrapper.style.width = newW + 'px'
  const badge = document.getElementById('img-size-badge')
  if(badge) badge.textContent = Math.round(newW) + 'px'
})

document.addEventListener('mouseup', e=>{
  if(!_resizing) return
  _resizing = false
  _resizeHandle = null
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
  // Save the final width into the img style so it persists in innerHTML
  if(_activeResizeImg){
    const wrapper = _activeResizeImg.closest('.img-resize-wrapper')
    if(wrapper){
      const finalW = wrapper.offsetWidth
      _activeResizeImg.dataset.finalWidth = finalW + 'px'
    }
  }
})

document.addEventListener('click', function(e){
  if(e.target.tagName === 'IMG' && e.target.closest('#news-editor')){
    addResizeHandles(e.target)
  } else if(
    !e.target.closest('.img-resize-wrapper') &&
    !e.target.closest('#img-resize-toolbar')
  ){
    removeResizeHandles()
  }
})

function resizeSelectedImg(width, align=null){
  const wrapper = document.querySelector('#news-editor .img-resize-wrapper')
  const img = wrapper ? wrapper.querySelector('img') : document.querySelector('#news-editor img.selected')
  if(!img) return
  if(width){
    if(wrapper){
      const editor = document.getElementById('news-editor')
      const editorW = editor ? editor.offsetWidth : 600
      if(width.endsWith('%')){
        const px = Math.round(editorW * parseInt(width) / 100)
        wrapper.style.width = px + 'px'
        const badge = document.getElementById('img-size-badge')
        if(badge) badge.textContent = px + 'px'
      } else {
        wrapper.style.width = width
        const badge = document.getElementById('img-size-badge')
        if(badge) badge.textContent = width
      }
    } else {
      img.style.width = width
    }
  }
  if(align && wrapper){
    if(align==='center'){ wrapper.style.display='block'; wrapper.style.marginLeft='auto'; wrapper.style.marginRight='auto'; wrapper.style.float='none' }
    else if(align==='left'){ wrapper.style.float='left'; wrapper.style.marginRight='16px'; wrapper.style.marginLeft='0' }
    else if(align==='right'){ wrapper.style.float='right'; wrapper.style.marginLeft='16px'; wrapper.style.marginRight='0' }
  }
}
function newsCard(p, featured){
  const cat = NEWS_CATEGORIES.find(c=>c.id===p.category) || NEWS_CATEGORIES[0]
  const excerpt = p.content.replace(/<[^>]*>/g,'').slice(0,110)
  const imgColor = {news:'blue',scholarship:'gold',government:'green',career:'red',abroad:'navy',resources:'purple'}
  const articleUrl = p.slug ? `/news/${p.slug}` : `/news/${p.id}`;
return `
  <a href="${articleUrl}" class="pn-ncard" style="text-decoration: none; color: inherit; display: flex; flex-direction: column; border: 1px solid var(--g100); background:#fff;" onclick="navigate('news-article/${p.slug || p.id}', null, event)">
   <div style="position:relative; width:100%; aspect-ratio: 16/10; flex-shrink:0; overflow:hidden;">
      ${p.image_url
        ? `<img src="${p.image_url}" alt="${p.title||'News'}" loading="lazy" decoding="async" style="width:100%; height:100%; object-fit:cover; display:block;"/>`
        : `<div class="pn-ncard-img ${imgColor[p.category]||'blue'}" style="height:100%; width:100%; display:flex; align-items:center; justify-content:center; margin:0;">${cat.icon}</div>`
      }
      <div style="position:absolute; top:0; left:0; display:flex; gap:0;">
        <span class="pn-ncard-badge ${p.category||'news'}" style="background:rgba(255,255,255,0.95); font-size:8px; font-weight:900; padding:2px 6px; border-radius:0 0 4px 0; border-bottom:1px solid var(--g100); border-right:1px solid var(--g100); color:var(--navy);">${cat.label.toUpperCase()}</span>
      </div>
    </div>
    <div class="pn-ncard-body">
      <!-- Title: Zero padding on left/right -->
      <div class="pn-ncard-title" style="margin:6px 0 2px 0; padding: 0 2px; line-height:1.2; font-size: 13px; font-weight: 800; color:var(--navy); display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${p.title}</div>
      
      <!-- Excerpt: Zero padding on left/right -->
      <div class="pn-ncard-excerpt" style="margin:0; padding: 0 2px; font-size:11px; color:var(--g600); line-height:1.3; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${excerpt}</div>
      
      <div class="pn-ncard-footer" style="margin-top:auto; padding: 6px 2px 2px; border-top:1px solid var(--g50); display:flex; align-items:center; font-size:9px; color:var(--g400);">
        <span>${fmtShort(p.created_at)} • ${p.views_count||0} views</span>
      </div>
    </div>
  </a>`
}
async function renderPublicNews(activeCategory = null, searchQuery = ''){
  const isLoggedIn = !!State.user
  render(`
  <style>
    .pn-nav{display:flex;align-items:center;justify-content:space-between;padding:0 2.5rem;background:#0A0F2C;border-bottom:1px solid rgba(255,255,255,0.06);position:sticky;top:0;z-index:100;height:60px}
    .pn-logo{font-family:'Playfair Display',serif;color:#fff;font-size:1.1rem;font-weight:700;letter-spacing:-0.02em;display:flex;align-items:center;gap:8px;background:none;border:none;cursor:pointer}
    .pn-logo span{color:#F5C842}
    .pn-nav-links{display:flex;align-items:center;gap:10px}
    .pn-nav-btn{background:transparent;color:rgba(255,255,255,0.65);border:none;padding:6px 12px;border-radius:6px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;transition:color 0.2s}
    .pn-nav-btn:hover{color:#fff}
    .pn-nav-cta{background:#1A5FFF !important;color:#fff !important;border-radius:6px;font-weight:600 !important}
    header{position:sticky;top:60px;z-index:99}
    @keyframes pnTicker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
    .pn-ticker-wrap{background:#F5C842;overflow:hidden;height:32px;display:flex;align-items:center}
    .pn-ticker{display:flex;animation:pnTicker 32s linear infinite;white-space:nowrap;width:max-content}
    .pn-ticker-item{font-size:11px;font-weight:700;color:#0A0F2C;letter-spacing:0.05em;text-transform:uppercase;padding:0 2rem;display:flex;align-items:center;gap:8px}
    .pn-ticker-dot{width:5px;height:5px;background:#0A0F2C;border-radius:50%;flex-shrink:0}
    .pn-hero-main{display:grid;grid-template-columns:1fr;min-height:0;background:#0A0F2C}
    .pn-hero-h1{font-family:'Playfair Display',serif;font-size:clamp(1.4rem,2vw,1.9rem);font-weight:900;color:#fff;line-height:1.1;letter-spacing:-0.02em;margin-bottom:0;text-align:center;white-space:nowrap}
    .pn-hero-eyebrow{display:flex;align-items:center;gap:10px;margin-bottom:0.5rem;justify-content:center}
    .pn-breaking{background:#E63232;color:#fff;font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding:4px 10px;border-radius:3px}
    .pn-hero-date{color:rgba(255,255,255,0.4);font-size:11px;letter-spacing:0.06em;text-transform:uppercase}
    
    .pn-hero-h1 em{font-style:normal;color:#F5C842}
    .pn-hero-sub{color:rgba(255,255,255,0.55);font-size:0.85rem;line-height:1.5;max-width:480px;margin-bottom:0.5rem;display:none}
    .pn-hero-stats{display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap;margin-top:0.25rem;justify-content:center}
    .pn-stat-num{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:700;color:#fff;line-height:1}
    .pn-stat-lbl{font-size:10px;color:rgba(255,255,255,0.4);letter-spacing:0.06em;text-transform:uppercase;margin-top:2px}
    .pn-stat-div{width:1px;height:32px;background:rgba(255,255,255,0.12)}
    .pn-hero-right{display:none}
    .pn-featured{flex:1;background:#111A3E;padding:1.5rem;display:flex;flex-direction:column;justify-content:flex-end;position:relative;overflow:hidden;cursor:pointer;min-height:180px;transition:background 0.2s}
    .pn-featured:hover{background:#15204A}
    .pn-feat-glow{position:absolute;inset:0;background:radial-gradient(circle at 25% 35%,rgba(26,95,255,0.28) 0%,transparent 55%),radial-gradient(circle at 75% 70%,rgba(245,200,66,0.12) 0%,transparent 50%)}
    .pn-feat-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(10,15,44,0.95) 0%,rgba(10,15,44,0.25) 55%,transparent 100%)}
    .pn-feat-content{position:relative;z-index:2}
    .pn-feat-badge{display:inline-flex;align-items:center;gap:5px;background:rgba(26,95,255,0.85);color:rgba(255,255,255,0.95);font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:4px 10px;border-radius:3px;margin-bottom:0.8rem}
    .pn-feat-title{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;color:#fff;line-height:1.35;margin-bottom:0.6rem}
    .pn-feat-meta{font-size:11px;color:rgba(255,255,255,0.4);display:flex;align-items:center;gap:6px}
    .pn-sidebar-item{padding:1.1rem 1.4rem;border-top:1px solid rgba(255,255,255,0.06);cursor:pointer;display:flex;gap:0.9rem;align-items:flex-start;transition:background 0.15s}
    .pn-sidebar-item:hover{background:rgba(255,255,255,0.04)}
    .pn-sidebar-num{font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:900;color:rgba(255,255,255,0.1);line-height:1;flex-shrink:0;width:26px}
    .pn-sidebar-cat{font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#F5C842;margin-bottom:3px}
    .pn-sidebar-title{font-size:13px;font-weight:500;color:rgba(255,255,255,0.8);line-height:1.4}
    .pn-filterbar{background:#fff;border-bottom:1px solid #E5E2DA;position:sticky;top:0;z-index:90;box-shadow:0 2px 8px rgba(0,0,0,0.06)}
@keyframes pnHeroSlideUp{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-60px)}}
.pn-hero-main{transition:opacity 0.5s ease, transform 0.5s ease}
.pn-hero-hidden{animation:pnHeroSlideUp 0.5s cubic-bezier(0.4,0,0.2,1) forwards;pointer-events:none}
.pn-hero-main{overflow:hidden;transition:max-height 0.5s ease}
    .pn-filterbar-inner{max-width:100%;margin:0;padding:0 1rem;display:flex;align-items:center;gap:0;height:56px}
    .pn-search-wrap{display:flex;align-items:center;gap:8px;width:220px;flex-shrink:0;border-right:1px solid #E5E2DA;padding-right:1rem;margin-right:1rem;height:100%}
    .pn-search-input{border:none;outline:none;background:transparent;font-family:'DM Sans',sans-serif;font-size:14px;color:#1E2845;width:100%}
    .pn-search-input::placeholder{color:#8A98B8}
    .pn-search-btn{background:#1A5FFF;color:#fff;border:none;padding:8px 20px;border-radius:6px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:background 0.2s;flex-shrink:0;margin-right:1.5rem}
    .pn-search-btn:hover{background:#3B7BFF}
    .pn-cats{display:flex;align-items:center;gap:6px;overflow-x:auto;scrollbar-width:none;flex:1}
.pn-cats::-webkit-scrollbar{display:none}
.pn-cat{display:inline-flex;align-items:center;gap:5px;padding:5px 13px;border-radius:20px;border:1.5px solid #E5E2DA;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;color:#6B6B80;cursor:pointer;white-space:nowrap;transition:all 0.15s;background:transparent}
.pn-cat:hover{border-color:#1A5FFF;color:#1A5FFF}
.pn-cat.active{background:#1A5FFF;border-color:#1A5FFF;color:#fff}
.pn-cat-dropdown{display:none;position:relative;flex-shrink:0}
.pn-cat-dropdown-btn{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:20px;border:1.5px solid #E5E2DA;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;color:#1E2845;cursor:pointer;background:#fff;transition:all 0.15s;white-space:nowrap}
.pn-cat-dropdown-btn:hover{border-color:#1A5FFF;color:#1A5FFF}
.pn-cat-dropdown-btn.active{background:#1A5FFF;border-color:#1A5FFF;color:#fff}
.pn-cat-dropdown-btn .pn-cat-arrow{font-size:10px;transition:transform 0.2s;margin-left:2px}
.pn-cat-dropdown-btn.open .pn-cat-arrow{transform:rotate(180deg)}
.pn-cat-menu{display:none;position:absolute;top:calc(100% + 8px);left:0;background:#fff;border:1px solid #E5E2DA;border-radius:12px;box-shadow:0 8px 32px rgba(13,27,64,0.12);min-width:200px;z-index:200;overflow:hidden}
.pn-cat-menu.open{display:block}
.pn-cat-menu-item{display:flex;align-items:center;gap:10px;padding:10px 16px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:#1E2845;cursor:pointer;transition:background 0.15s;border:none;background:transparent;width:100%;text-align:left}
.pn-cat-menu-item:hover{background:#F0F4FF;color:#1A5FFF}
.pn-cat-menu-item.active{background:#EEF4FF;color:#1A5FFF;font-weight:700}
.pn-cat-menu-item .pn-cat-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
    .pn-body{max-width:100%;margin:0;padding:0.5rem 0}.pn-main-side>aside{align-self:start;position:sticky;top:8px}
    .pn-main-side{display:grid;grid-template-columns:1fr 300px;gap:2rem;align-items:start}
    .pn-section-hdr{display:flex;align-items:baseline;gap:1rem;margin-bottom:1.5rem}
    .pn-section-title{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:#1C1C2E;display:flex;align-items:center;gap:8px}
    .pn-section-title::before{content:'';display:block;width:4px;height:1.2rem;background:#1A5FFF;border-radius:2px;flex-shrink:0}
    .pn-view-all{margin-left:auto;font-size:13px;font-weight:600;color:#1A5FFF;background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif}
    .pn-grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:1.1rem}
    .pn-grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem}
    .pn-divider{border:none;border-top:1px solid #E5E2DA;margin:1rem 0}
    .pn-widget{background:#fff;border:1px solid #E5E2DA;border-radius:10px;overflow:hidden;margin-bottom:1.25rem}.pn-main-side aside{position:sticky;top:8px;align-self:start}.pn-main-side aside{position:sticky;top:8px;align-self:start}.pn-main-side aside{position:sticky;top:8px;align-self:start}.pn-main-side aside{position:sticky;top:8px;align-self:start}.pn-main-side aside{position:sticky;top:8px;align-self:start}.pn-main-side aside{position:sticky;top:8px;align-self:start}
    .pn-widget-hdr{padding:0.8rem 1rem;border-bottom:1px solid #E5E2DA;font-family:'Playfair Display',serif;font-size:0.9rem;font-weight:700;color:#1C1C2E;display:flex;align-items:center;gap:7px}
    .pn-widget-hdr::before{content:'';display:block;width:3px;height:13px;background:#1A5FFF;border-radius:2px}
    .pn-newsletter{background:#0A0F2C;border-radius:10px;padding:1.4rem 1.2rem;margin-bottom:1.25rem}
    .pn-trend-item{display:flex;align-items:flex-start;gap:10px;padding:9px 0;border-bottom:1px solid #E5E2DA;cursor:pointer}
    .pn-trend-item:last-child{border-bottom:none;padding-bottom:0}
    .pn-trend-num{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:900;color:#E5E2DA;width:22px;flex-shrink:0;line-height:1}
    .pn-trend-title{font-size:13px;font-weight:500;color:#1C1C2E;line-height:1.4;transition:color 0.15s}
    .pn-trend-item:hover .pn-trend-title{color:#1A5FFF}
    .pn-trend-cat{font-size:10px;color:#8A98B8;letter-spacing:0.05em;text-transform:uppercase;font-weight:600;margin-top:2px}
    .pn-tag{padding:4px 10px;border:1px solid #E5E2DA;border-radius:20px;font-size:12px;font-weight:500;color:#6B6B80;cursor:pointer;transition:all 0.15s;background:transparent;font-family:'DM Sans',sans-serif}
    .pn-tag:hover{border-color:#1A5FFF;color:#1A5FFF;background:#F0F4FF}
    .pn-ncard{background:#fff;border:1px solid #E5E2DA;border-radius:10px;overflow:hidden;cursor:pointer;display:flex;flex-direction:column;transition:transform 0.2s,box-shadow 0.2s,border-color 0.2s}
    .pn-ncard:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(10,15,44,0.08);border-color:#D0CEC6}
    .pn-ncard-img{width:100%;aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;font-size:40px;flex-shrink:0}
    .pn-ncard-img.blue{background:linear-gradient(135deg,#E3F0FF,#B8D4F5)}
    .pn-ncard-img.gold{background:linear-gradient(135deg,#FFF9E3,#F5E3A0)}
    .pn-ncard-img.green{background:linear-gradient(135deg,#E3F5EC,#A8DFC0)}
    .pn-ncard-img.navy{background:linear-gradient(135deg,#E8EAF6,#B8BDE8)}
    .pn-ncard-img.red{background:linear-gradient(135deg,#FDEAEA,#F5B8B8)}
    .pn-ncard-img.purple{background:linear-gradient(135deg,#F0E8FF,#D0B8F0)}
    .pn-ncard-body{padding: 8px 10px 12px; display:flex;flex-direction:column;flex:1}
    .pn-ncard-badge{display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:3px 8px;border-radius:3px;margin-bottom:0.6rem;align-self:flex-start}
    .pn-ncard-badge.news{background:#E3F0FF;color:#1A5FFF}
    .pn-ncard-badge.scholarship{background:#FFF9E3;color:#8A5F00}
    .pn-ncard-badge.government{background:#E3F5EC;color:#0A5A35}
    .pn-ncard-badge.career{background:#FFF0E8;color:#8A3500}
    .pn-ncard-badge.abroad{background:#EAF0FF;color:#2D1AA0}
    .pn-ncard-badge.resources{background:#F0E8FF;color:#5A0A8A}
    .pn-ncard-title{font-family:'Playfair Display',serif;font-size:15px;font-weight:700;color:#1C1C2E;line-height:1.4;margin-bottom:0.5rem;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
    .pn-ncard-excerpt{font-size:13px;color:#6B6B80;line-height:1.6;flex:1;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:0.8rem}
    .pn-ncard-footer{display:flex;align-items:center;justify-content:space-between;padding-top:0.7rem;border-top:1px solid #E5E2DA;margin-top:auto}
    .pn-ncard-meta{font-size:11px;color:#6B6B80;display:flex;align-items:center;gap:5px}
    .pn-subscribe{background:linear-gradient(135deg,#10B981,#059669);padding:3rem 2rem;text-align:center}
    .pn-footer{background:#0A0F2C;padding:1.5rem 2rem;display:flex;align-items:center;justify-content:space-between}
   @media(max-width:1024px){
  .pn-hero-main{grid-template-columns:1fr}
  .pn-hero-right{display:none}
  /* Tighten card grid and reduce space between them */
  .pn-grid-4, .pn-grid-3 { grid-template-columns: repeat(2, 1fr) !important; gap: 5px !important; }
  .pn-main-side { grid-template-columns: 1fr; }
  .pn-newsletter { display: none; }
  .pn-widget { display: none; }
  /* Main container sits flush against screen edges */
  .pn-body { padding: 4px 0px !important; }
  /* REMOVE ALL PADDING FROM INSIDE THE CARD */
  .pn-ncard-body { padding: 4px 0px 8px !important; }
  .pn-ncard { border-radius: 4px !important; overflow: hidden; margin: 0 !important; }
}
@media(max-width:768px){
  .pn-nav-btn:not(.pn-nav-cta){display:none}
  .pn-nav{padding:0 1rem}
  .pn-hero-left{padding:1.2rem 1rem}
  .pn-hero-h1{font-size:1.2rem;white-space:normal}
  .pn-hero-eyebrow{margin-bottom:0.3rem}
  .pn-hero-stats{gap:1rem}
  .pn-stat-num{font-size:1.1rem}
  .pn-grid-4{grid-template-columns:repeat(2, 1fr); gap: 8px;}
  .pn-grid-3{grid-template-columns:repeat(2, 1fr); gap: 8px;}
  .pn-body{padding: 8px 4px;}
  .pn-section-hdr{margin-bottom:1rem}
  .pn-filterbar-inner{padding:8px 0.75rem;height:auto;display:flex;flex-direction:column;gap:6px;align-items:stretch}
  .pn-search-wrap{width:100%;border-right:none;padding-right:0;margin-right:0}
  .pn-search-btn{width:100%;margin-right:0;margin-top:0}
  .pn-cats{display:none}
  .pn-cat-dropdown{display:block}
  .pn-ncard-img{height:120px !important}
  .pn-ncard-title{font-size:13px}
  .pn-ncard-excerpt{display:none}
}
@media(max-width:480px){
  .pn-grid-4{grid-template-columns:repeat(2,1fr);gap:0.6rem}
.pn-grid-3{grid-template-columns:repeat(2,1fr);gap:0.6rem}
  .pn-hero-h1{font-size:1.1rem}
  .pn-ncard-img{height:140px}
}
  </style>

  <div style="position:sticky;top:0;z-index:200;display:flex;flex-direction:column">
  <!-- NAV -->
  <nav class="pn-nav">
    <button class="pn-logo" onclick="navigate('${isLoggedIn ? 'dashboard' : 'landing'}')">
      <img src="https://hdpkjomganndiiprnpok.supabase.co/storage/v1/object/public/assets/mathrone%20logo1.png" alt="Mathrone Academy logo"loading="lazy" decoding="async" style="height:30px;width:auto;filter:brightness(0) invert(1)"/>
      Mathrone <span>Academy</span>
    </button>
    <div class="pn-nav-links">
      ${isLoggedIn
        ? `<button class="pn-nav-btn" onclick="navigate('dashboard')">← Dashboard</button>`
        : `<button class="pn-nav-btn" onclick="navigate('landing')">← Home</button>
           <button class="pn-nav-btn" onclick="navigate('login')">Sign In</button>
           <button class="pn-nav-btn pn-nav-cta" onclick="navigate('register')">Get Started</button>`
      }
    </div>
  </nav>

  <!-- HERO -->
  <header>
    <div class="pn-ticker-wrap">
      <div class="pn-ticker" id="pn-ticker">
        <span class="pn-ticker-item"><span class="pn-ticker-dot"></span>Loading latest news…</span>
      </div>
    </div>
    <div class="pn-hero-main">
      <div class="pn-hero-left">
        <div>
          <div class="pn-hero-eyebrow">
            <span class="pn-breaking">Breaking</span>
            <span class="pn-hero-date">${new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</span>
          </div>
          <h1 class="pn-hero-h1">Your <em>edge</em> in education starts with staying informed</h1>
          <p class="pn-hero-sub">Scholarships, government policy, career pathways, and academic news all in one place made for you.</p>
        </div>
        <div class="pn-hero-stats">
          <div><div class="pn-stat-num" id="pn-stat-articles">—</div><div class="pn-stat-lbl">Articles Published</div></div>
          <div class="pn-stat-div"></div>
          <div><div class="pn-stat-num">6</div><div class="pn-stat-lbl">Topics Covered</div></div>
          <div class="pn-stat-div"></div>
          <div><div class="pn-stat-num">🇷🇼</div><div class="pn-stat-lbl">Rwanda & Beyond</div></div>
        </div>
      </div>
      
    </div>
  </header>

  <!-- FILTER BAR -->
  <div class="pn-filterbar">
    <div class="pn-filterbar-inner">
      <div class="pn-search-wrap">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8A98B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input class="pn-search-input" type="text" placeholder="Search news, scholarships, careers…" id="news-search-input" value="${searchQuery}" onkeydown="if(event.key==='Enter')searchNews()"/>
      </div>
      <button class="pn-search-btn" onclick="searchNews()">Search</button>
      <div class="pn-cats">
        <button class="pn-cat ${!activeCategory?'active':''}" onclick="renderPublicNews()">🌐 All</button>
        ${NEWS_CATEGORIES.map(c=>`<button class="pn-cat ${activeCategory===c.id?'active':''}" onclick="renderPublicNews('${c.id}')">${c.icon} ${c.label}</button>`).join('')}
      </div>
      <div class="pn-cat-dropdown">
        <button class="pn-cat-dropdown-btn ${activeCategory?'active':''}" id="pn-cat-btn" onclick="toggleCatDropdown()">
          ${activeCategory ? (NEWS_CATEGORIES.find(c=>c.id===activeCategory)?.icon+' '+NEWS_CATEGORIES.find(c=>c.id===activeCategory)?.label) : '🌐 All Topics'}
          <span class="pn-cat-arrow">▾</span>
        </button>
        <div class="pn-cat-menu" id="pn-cat-menu">
          <button class="pn-cat-menu-item ${!activeCategory?'active':''}" onclick="renderPublicNews();closeCatDropdown()">
            <span class="pn-cat-dot" style="background:#1A5FFF"></span>🌐 All Topics
          </button>
          ${NEWS_CATEGORIES.map(c=>`
          <button class="pn-cat-menu-item ${activeCategory===c.id?'active':''}" onclick="renderPublicNews('${c.id}');closeCatDropdown()">
            <span class="pn-cat-dot" style="background:${c.color}"></span>${c.icon} ${c.label}
          </button>`).join('')}
        </div>
      </div>
    </div>
  </div>

  </div>
  <!-- BODY -->
  <div style="background:#F2F0EA;min-height:600px;padding:0">
    <div id="pn-content" style="padding:0">
      <div class="spinner"></div>
    </div>
  </div>

  <!-- SUBSCRIBE -->
  <div class="pn-subscribe">
    <div style="font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:700;color:#fff;margin-bottom:8px">📬 Stay Updated</div>
    <p style="font-size:15px;color:rgba(255,255,255,0.85);margin-bottom:1.5rem">Get notified about new scholarships, education updates, and career opportunities</p>
    <div style="display:flex;gap:10px;max-width:420px;margin:0 auto">
      <input type="email" id="subscribe-email" placeholder="Enter your email address" style="flex:1;padding:11px 14px;border:none;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:14px;outline:none"/>
      <button onclick="subscribeNewsletter()" style="background:#fff;color:#059669;border:none;padding:11px 22px;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:700;cursor:pointer;white-space:nowrap">Subscribe</button>
    </div>
  </div>

  <!-- FOOTER -->
  <div class="pn-footer">
    <span style="font-size:13px;color:rgba(255,255,255,0.35)">© 2026 Mathrone Academy. All rights reserved.</span>
    <button onclick="${isLoggedIn ? "navigate('dashboard')" : "navigate('landing')"}" style="font-size:13px;color:rgba(255,255,255,0.4);background:none;border:none;cursor:pointer">${isLoggedIn ? '← Dashboard' : '← Back to Home'}</button>
  </div>
  `)

  // Hide hero on scroll — use named function so it can be removed on re-render
  let heroCollapsed = false
  function onNewsScroll() {
    const hero = document.querySelector('.pn-hero-main')
    if (!hero) { window.removeEventListener('scroll', onNewsScroll); return }
    if (window.scrollY > 60 && !heroCollapsed) {
      heroCollapsed = true
      hero.classList.add('pn-hero-hidden')
      hero.style.maxHeight = '0'
      hero.style.marginBottom = '0'
      hero.style.paddingTop = '0'
      hero.style.paddingBottom = '0'
    } else if (window.scrollY <= 60 && heroCollapsed) {
      heroCollapsed = false
      hero.classList.remove('pn-hero-hidden')
      hero.style.maxHeight = ''
      hero.style.marginBottom = ''
      hero.style.paddingTop = ''
      hero.style.paddingBottom = ''
    }
  }
  // Remove any previous scroll listener before adding a new one
  window.removeEventListener('scroll', window._newsScrollHandler)
  window._newsScrollHandler = onNewsScroll
  window.addEventListener('scroll', onNewsScroll, { passive: true })

  // Load content
  try{
    const [allPosts, featuredPosts, popularPosts] = await Promise.all([
      fetch(API_URL + '/news/?' + (activeCategory ? `category=${activeCategory}&` : '') + (searchQuery ? `search=${encodeURIComponent(searchQuery)}` : '')).then(r=>r.json()),
      fetch(API_URL + '/news/?featured=true&limit=6').then(r=>r.json()),
      fetch(API_URL + '/news/?popular=true&limit=4' + (activeCategory ? `&category=${activeCategory}` : '')).then(r=>r.json())
    ])

    const posts = allPosts.filter(p => !p.is_featured)
    // Populate ticker with real post titles
    const tickerEl = document.getElementById('pn-ticker')
    if(tickerEl){
      const tickerPosts = [...featuredPosts, ...allPosts].slice(0, 8)
      if(tickerPosts.length){
        const items = [...tickerPosts, ...tickerPosts]
        tickerEl.innerHTML = items.map(p =>
          `<span class="pn-ticker-item" onclick="openNewsPost('${p.id}')" style="cursor:pointer">
            <span class="pn-ticker-dot"></span>${p.title}
          </span>`
        ).join('')
      } else {
        tickerEl.innerHTML = `
          <span class="pn-ticker-item"><span class="pn-ticker-dot"></span>Welcome to Mathrone Academy Education News</span>
          <span class="pn-ticker-item"><span class="pn-ticker-dot"></span>Stay updated with the latest scholarships and opportunities</span>
          <span class="pn-ticker-item"><span class="pn-ticker-dot"></span>Welcome to Mathrone Academy Education News</span>
          <span class="pn-ticker-item"><span class="pn-ticker-dot"></span>Stay updated with the latest scholarships and opportunities</span>`
      }
    }
    // Populate hero featured card
    const heroPost = featuredPosts[0] || allPosts[0]
    if(heroPost){
      const featTitle = document.getElementById('pn-feat-title')
      const featMeta  = document.getElementById('pn-feat-meta')
      const featCard  = document.getElementById('pn-feat-card')
      if(featTitle) featTitle.textContent = heroPost.title
      if(featMeta)  featMeta.innerHTML = `<span>${fmtShort(heroPost.created_at)}</span><span style="color:rgba(255,255,255,0.2)">·</span><span>Mathrone Academy</span>`
      if(featCard){
        featCard.onclick = () => openNewsPost(heroPost.id)
        if(heroPost.image_url){
          featCard.style.backgroundImage = `url(${heroPost.image_url})`
          featCard.style.backgroundSize = 'cover'
          featCard.style.backgroundPosition = 'center'
        }
      }
    }

    // Populate sidebar items 02 & 03
    const sidebarPosts = featuredPosts.length > 1 ? featuredPosts.slice(1,3) : allPosts.slice(1,3)
    const sidebarEl = document.getElementById('pn-sidebar-items')
    if(sidebarEl && sidebarPosts.length){
      sidebarEl.innerHTML = sidebarPosts.map((p,i) => {
        const cat = NEWS_CATEGORIES.find(c=>c.id===p.category) || NEWS_CATEGORIES[0]
        return `<div class="pn-sidebar-item" onclick="openNewsPost('${p.id}')">
          <div class="pn-sidebar-num">0${i+2}</div>
          <div><div class="pn-sidebar-cat">${cat.label}</div><div class="pn-sidebar-title">${p.title}</div></div>
        </div>`
      }).join('')
    }

    // Article count
    const statEl = document.getElementById('pn-stat-articles')
    if(statEl) statEl.textContent = (allPosts.length + featuredPosts.length) + '+'

    // Trending sidebar
    const trendingHtml = popularPosts.length ? popularPosts.map((p,i) => {
      const cat = NEWS_CATEGORIES.find(c=>c.id===p.category) || NEWS_CATEGORIES[0]
      return `<div class="pn-trend-item" onclick="openNewsPost('${p.id}')">
        <div class="pn-trend-num">0${i+1}</div>
        <div>
          <div class="pn-trend-title">${p.title.slice(0,60)}${p.title.length>60?'...':''}</div>
          <div class="pn-trend-cat">${cat.label}</div>
        </div>
      </div>`
    }).join('') : '<div style="font-size:13px;color:#8A98B8;padding:8px 0">No trending posts yet</div>'

    // More to read sidebar
    const moreToRead = allPosts.slice(0,3)
    const moreHtml = moreToRead.map(p => {
      const cat = NEWS_CATEGORIES.find(c=>c.id===p.category) || NEWS_CATEGORIES[0]
      const imgColor = {news:'blue',scholarship:'gold',government:'green',career:'red',abroad:'navy',resources:'purple'}
      return `<div onclick="openNewsPost('${p.id}')" style="display:flex;gap:10px;padding:10px 1rem;border-bottom:1px solid #E5E2DA;cursor:pointer;transition:background 0.15s" onmouseover="this.style.background='#F2F0EA'" onmouseout="this.style.background=''">
        <div class="pn-ncard-img ${imgColor[p.category]||'blue'}" style="width:64px;height:50px;aspect-ratio:unset;border-radius:6px;flex-shrink:0;font-size:22px">${cat.icon}</div>
        <div style="flex:1;min-width:0">
          <div style="font-family:'Playfair Display',serif;font-size:13px;font-weight:700;color:#1C1C2E;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:3px">${p.title}</div>
          <div style="font-size:11px;color:#8A98B8">${fmtShort(p.created_at)} · ${cat.label}</div>
        </div>
      </div>`
    }).join('')

    // Inject main content
    document.getElementById('pn-content').innerHTML = `
    <div class="pn-body">

      ${State.user?.role==='admin' ? `<div style="margin-bottom:20px"><button class="btn btn-primary" onclick="openNewsModalAsync()">+ Add Post</button></div>` : ''}

      <!-- Main + Sidebar -->
      <div class="pn-main-side">

        <!-- MAIN COLUMN -->
        <div>

          <!-- Most Popular OR Search Results -->
          ${searchQuery ? `
          <section style="margin-bottom:2.5rem">
            <div class="pn-section-hdr">
              <h2 class="pn-section-title">🔍 Search results for "${searchQuery}"</h2>
              <button class="pn-view-all" onclick="renderPublicNews()">Clear ✕</button>
            </div>
            ${allPosts.length ? `
            <div class="pn-grid-4">
              ${allPosts.map(p => newsCard(p, false)).join('')}
            </div>` : `
            <div style="text-align:center;padding:40px 20px;color:#8A98B8">
              <div style="font-size:40px;margin-bottom:10px">🔍</div>
              <div style="font-size:16px;font-weight:600">No results for "${searchQuery}"</div>
              <div style="font-size:13px;margin-top:4px">Try a different search term</div>
            </div>`}
          </section>
          <hr class="pn-divider"/>` : 
          (!activeCategory && popularPosts.length) ? `
          <section style="margin-bottom:0">
            <div class="pn-section-hdr">
              <h2 class="pn-section-title">Most Popular</h2>
            </div>
            <div class="pn-grid-4">
              ${popularPosts.map(p => newsCard(p, false)).join('')}
            </div>
          </section>
          <hr class="pn-divider"/>` : ''}
          
          ${featuredPosts.length ? `
          <section style="margin-bottom:2.5rem">
            <div class="pn-section-hdr">
              <h2 class="pn-section-title"> Featured</h2>
              <button class="pn-view-all" onclick="renderPublicNews()">View all →</button>
            </div>
            <div class="pn-grid-3">
              ${featuredPosts.map(p => newsCard(p, true)).join('')}
            </div>
          </section>
          <hr class="pn-divider"/>` : ''}

          <section>
            <div class="pn-section-hdr">
              <h2 class="pn-section-title">${activeCategory ? (NEWS_CATEGORIES.find(c=>c.id===activeCategory)?.label||'Latest') : '📰 Latest Articles'}</h2>
              <button class="pn-view-all" onclick="renderPublicNews()">View all →</button>
            </div>
            ${posts.length ? `
            <div class="pn-grid-3">
              ${posts.map(p => newsCard(p, false)).join('')}
            </div>` : `
            <div style="text-align:center;padding:60px 20px;color:#8A98B8">
              <div style="font-size:48px;margin-bottom:12px">📰</div>
              <div style="font-size:16px;font-weight:600">${searchQuery ? 'No results found' : 'No posts yet'}</div>
              <div style="font-size:13px;margin-top:4px">${searchQuery ? 'Try a different search term' : 'Check back soon'}</div>
            </div>`}
          </section>
        </div>

        <!-- SIDEBAR COLUMN -->
        <aside style="position:sticky;top:8px;align-self:start">
         
          <!-- Trending -->
          <div class="pn-widget">
            <div class="pn-widget-hdr">Trending Now</div>
            <div style="padding:0.25rem 1rem">${trendingHtml}</div>
          </div>

          <!-- Popular Topics -->
          <div class="pn-widget">
            <div class="pn-widget-hdr">Popular Topics</div>
            <div style="padding:0.9rem 1rem;display:flex;flex-wrap:wrap;gap:6px">
              ${['Scholarships','Rwanda','A-Level','STEM','Study Abroad','REB','University','Mastercard','TVET','Mathematics','Digital Skills','Career','O-Level','2026'].map(t=>`<button class="pn-tag" onclick="renderPublicNews(null,'${t}')">${t}</button>`).join('')}
            </div>
          </div>

          <!-- More to Read -->
          ${moreToRead.length ? `
          <div class="pn-widget">
            <div class="pn-widget-hdr">More to Read</div>
            ${moreHtml}
          </div>` : ''}
        </aside>

      </div>
    </div>
    <div id="modal-root"></div>`

  } catch(e) {
    document.getElementById('pn-content').innerHTML = `<div style="text-align:center;padding:60px;color:#8A98B8">Failed to load news. Please try again.</div>`
    
  }
}
function toggleCatDropdown(){
  const btn = document.getElementById('pn-cat-btn')
  const menu = document.getElementById('pn-cat-menu')
  if(!btn||!menu) return
  const isOpen = menu.classList.contains('open')
  if(isOpen){ closeCatDropdown() } else {
    btn.classList.add('open')
    menu.classList.add('open')
    setTimeout(()=>document.addEventListener('click', closeCatOnOutside), 0)
  }
}
function closeCatDropdown(){
  const btn = document.getElementById('pn-cat-btn')
  const menu = document.getElementById('pn-cat-menu')
  if(btn) btn.classList.remove('open')
  if(menu) menu.classList.remove('open')
  document.removeEventListener('click', closeCatOnOutside)
}
function closeCatOnOutside(e){
  const wrap = document.querySelector('.pn-cat-dropdown')
  if(wrap && !wrap.contains(e.target)) closeCatDropdown()
}
function searchNews(){
  const query = document.getElementById('news-search-input')?.value?.trim() || ''
  renderPublicNews(null, query)
}

async function subscribeNewsletter(){
  const email = document.getElementById('subscribe-email')?.value?.trim()
  if(!email){ toast('Please enter your email','err'); return }
  if(!email.includes('@')){ toast('Please enter a valid email','err'); return }
  try{
    await fetch(API_URL + '/news/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    toast('Subscribed successfully! 📬')
    document.getElementById('subscribe-email').value = ''
  }catch(e){
    toast('Subscription failed. Please try again.','err')
  }
}

async function openNewsPost(slugOrId){
  try{
    // Try to fetch by slug first, fallback to ID for backward compatibility
    let p;
    try {
      p = await api('/news/by-slug/' + slugOrId);
    } catch (e) {
      // Fallback to ID-based lookup
      p = await api('/news/' + slugOrId);
    }
    const cat = NEWS_CATEGORIES.find(c=>c.id===p.category) || NEWS_CATEGORIES[0]
    const isLoggedIn = !!State.user
    render(`
    <style>
      .news-article-body h1{font-size:28px;font-weight:800;color:var(--navy);margin:16px 0 8px}
      .news-article-body h2{font-size:22px;font-weight:700;color:var(--navy);margin:14px 0 6px}
      .news-article-body h3{font-size:18px;font-weight:700;color:var(--navy);margin:12px 0 6px}
      .news-article-body p{margin:0 0 14px;line-height:1.8;font-size:15px;color:var(--g600)}
      .news-article-body ul,.news-article-body ol{padding-left:24px;margin-bottom:14px}
      .news-article-body li{margin-bottom:6px;line-height:1.7;font-size:15px;color:var(--g600)}
      .news-article-body a{color:var(--blue);text-decoration:underline}
      .news-article-body strong{font-weight:700}
      .news-article-body img{max-width:100%;border-radius:12px;margin:16px 0;display:block;position:static !important;z-index:auto !important}
      .news-article-body .math-formula{max-width:100%;overflow-x:auto;padding:2px 0}
      .news-article-body .math-formula[style*="block"]{background:#f8fafc;border-radius:8px;padding:16px;margin:20px 0;border:1px solid var(--g100)}
      
      .article-layout{display:flex;gap:32px;max-width:100%;margin:0;padding:24px 16px 80px}
      .article-main{flex:1;min-width:0}
      .article-sidebar{width:300px;flex-shrink:0;position:sticky;top:0;align-self:flex-start;max-height:100vh;overflow-y:auto;border-left:none;position:sticky;top:80px;max-height:calc(100vh - 100px);overflow-y:auto;align-self:flex-start}
      
      .trending-card{background:#fff;border:1px solid var(--g100);border-radius:12px;padding:16px;margin-bottom:16px;cursor:pointer;transition:all 0.2s;box-shadow:none}
      .trending-card:hover{box-shadow:0 4px 12px rgba(0,0,0,0.1);transform:translateY(-2px)}
      .trending-card img{width:100%;height:120px;object-fit:cover;border-radius:8px;margin-bottom:12px}
      .trending-card .title{font-size:14px;font-weight:600;color:var(--navy);line-height:1.4;margin-bottom:8px}
      .trending-card .meta{font-size:12px;color:var(--g400)}
      
      .related-articles{margin-top:48px}
      .related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
      
      @media (max-width: 1024px) {
        .article-layout{flex-direction:column}
        .article-sidebar{width:100%;margin-top:32px}
      }
    </style>
    <nav style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--g100);background:#fff;position:sticky;top:0;z-index:100">
      <button style="display:flex;align-items:center;gap:10px;background:none;border:none;cursor:pointer" onclick="navigate('news')">
        <img src="https://hdpkjomganndiiprnpok.supabase.co/storage/v1/object/public/assets/mathrone%20logo1.png" alt="Mathrone Academy logo" loading="lazy" decoding="async"style="height:34px;width:auto"/>
        <span style="font-size:17px;font-weight:700;color:var(--navy)">Mathrone Academy</span>
      </button>
      <div style="display:flex;gap:10px">
        <button class="btn btn-ghost btn-sm" onclick="navigate('news')">← Back to News</button>
        ${isLoggedIn ? `<button class="btn btn-primary btn-sm" onclick="navigate('dashboard')">Dashboard</button>` : `<button class="btn btn-primary btn-sm" onclick="navigate('register')">Get Started</button>`}
      </div>
    </nav>

    <div class="article-layout">
      <!-- Main Article Content -->
      <div class="article-main">
        <!-- Category badge -->
        <div style="margin-bottom:16px">
          <span style="background:${cat.color}22;color:${cat.color};font-size:12px;padding:4px 12px;border-radius:999px;font-weight:700">${cat.icon} ${cat.label}</span>
          ${p.is_featured ? `<span style="background:#fef9c3;color:#854d0e;font-size:12px;padding:4px 12px;border-radius:999px;font-weight:700;margin-left:6px">⭐ Featured</span>` : ''}
        </div>

        <!-- Title -->
        <h1 style="font-size:36px;font-weight:800;color:var(--navy);line-height:1.2;margin-bottom:16px;font-family:'Playfair Display',serif">${p.title}</h1>

        <!-- Meta -->
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;padding-bottom:24px;border-bottom:1px solid var(--g100)">
          ${avi(p.profiles?.full_name||'Admin', 36)}
          <div>
            <div style="font-size:14px;font-weight:600;color:var(--navy)">${p.profiles?.full_name||'Mathrone Admin'}</div>
            <div style="font-size:12px;color:var(--g400)">${fmt(p.created_at)} ${p.source_name ? `• Source: <strong>${p.source_name}</strong>` : ''}</div>
          </div>
        </div>

        <!-- Content (image_url is already inside content, don't show it twice) -->
       <div class="news-article-body">${(p.content || '').replace(/<table[^>]*data-ad-placeholder="true"[^>]*>.*?<\/table>/gs, `<div style="margin:16px 0;text-align:center"><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" data-ad-slot="XXXXXXXXXX" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});<\/script></div>`)}</div>

        <!-- Source link -->
        ${p.source_url ? `
        <div style="margin-top:32px;padding:20px;background:var(--sky);border-radius:12px;border-left:4px solid var(--blue)">
          <div style="font-size:13px;font-weight:700;color:var(--navy);margin-bottom:6px">Read the full article</div>
          <a href="${p.source_url}" target="_blank" class="btn btn-primary btn-sm">🔗 Visit Source →</a>
        </div>` : ''}

        <!-- Share buttons -->
        <div style="margin-top:32px;padding:20px;background:var(--sky);border-radius:12px">
          <div style="font-size:13px;font-weight:700;color:var(--navy);margin-bottom:12px">📤 Share this article</div>
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <a href="https://wa.me/?text=${encodeURIComponent(p.title + '\n\nhttps://mathroneacademy.pages.dev/news/' + (p.slug || p.id))}" target="_blank" style="display:inline-flex;align-items:center;gap:6px;background:#25d366;color:#fff;padding:8px 14px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600">💬 WhatsApp</a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://mathroneacademy.pages.dev/news/' + (p.slug || p.id))}" target="_blank" style="display:inline-flex;align-items:center;gap:6px;background:#1877f2;color:#fff;padding:8px 14px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600">📘 Facebook</a>
            <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(p.title)}&url=${encodeURIComponent('https://mathroneacademy.pages.dev/news/' + (p.slug || p.id))}" target="_blank" style="display:inline-flex;align-items:center;gap:6px;background:#000;color:#fff;padding:8px 14px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600">𝕏 Twitter</a>
            <a href="https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent('https://mathroneacademy.pages.dev/news/' + (p.slug || p.id))}&title=${encodeURIComponent(p.title)}" target="_blank" style="display:inline-flex;align-items:center;gap:6px;background:#0077b5;color:#fff;padding:8px 14px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600">💼 LinkedIn</a>
            <button onclick="navigator.clipboard.writeText('https://mathroneacademy.pages.dev/news/${p.slug || p.id}');toast('Link copied! 📋')" style="display:inline-flex;align-items:center;gap:6px;background:var(--g100);color:var(--navy);border:none;padding:8px 14px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">🔗 Copy Link</button>
          </div>
        </div>

        <!-- Related Articles (moved here after share buttons) -->
        <div class="related-articles">
          <h3 style="font-size:20px;font-weight:700;color:var(--navy);margin-bottom:20px">📚 Related Articles</h3>
          <div id="related-articles-content" class="related-grid">
            <div class="loader-center"><div class="spinner"></div></div>
          </div>
        </div>
<!-- Admin actions -->
        <div id="admin-news-actions" style="margin-top:32px;display:flex;gap:10px"></div>
      </div>
      <div id="modal-root"></div>

      <!-- Sidebar with Trending News -->
      <div class="article-sidebar">
        <h3 style="font-size:18px;font-weight:700;color:var(--navy);margin-bottom:16px">🔥 Trending News</h3>
        <div id="trending-news">
          <div class="loader-center"><div class="spinner"></div></div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#0f172a;padding:24px 48px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-top:48px">
      <div style="font-size:13px;color:rgba(255,255,255,0.5)">© 2026 Mathrone Academy</div>
      <button onclick="navigate('news')" style="font-size:13px;color:rgba(255,255,255,0.5);background:none;border:none;cursor:pointer">← Back to News</button>
    </div>
    `)
   
    // ── Single canonical meta update for this article ──────────────
    const articleSlug = p.slug || p.id
    // Render any math formulas in the article body
    setTimeout(async ()=>{
      const body = document.querySelector('.news-article-body')
      if(body && body.querySelector('.math-formula, mjx-container, .MathJax')){
        try{ await ensureMathJax(); await MathJax.typesetPromise([body]) }catch(e){}
      } else if(body && (body.textContent.includes('\\(') || body.textContent.includes('$$'))){
        try{ await ensureMathJax(); await MathJax.typesetPromise([body]) }catch(e){}
      }
    }, 200)
    const articleUrl = 'https://mathroneacademy.pages.dev/news/' + articleSlug
    const articleDesc = p.content.replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim().slice(0,155) + '...'
    const articleImg  = p.image_url || 'https://mathroneacademy.pages.dev/og-banner.jpg'
    const fullTitle   = p.title + ' | Mathrone Academy Rwanda'
    document.title = fullTitle
    document.querySelector('meta[name="description"]')?.setAttribute('content', articleDesc)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', fullTitle)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', articleDesc)
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', articleUrl)
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', articleImg)
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', fullTitle)
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', articleDesc)
    document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', articleImg)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', articleUrl)
  const existingSchema = document.getElementById('article-schema')
if(existingSchema) existingSchema.remove()
const articleSchema = document.createElement('script')
articleSchema.id = 'article-schema'
articleSchema.type = 'application/ld+json'
articleSchema.textContent = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": p.title,
  "description": p.content.replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim().slice(0,160),
  "image": {
    "@type": "ImageObject",
    "url": p.image_url || 'https://mathroneacademy.pages.dev/og-banner.jpg',
    "width": 1200,
    "height": 630
  },
  "datePublished": p.created_at,
  "dateModified": p.updated_at || p.created_at,
  "author": {
    "@type": "Organization",
    "name": "Mathrone Academy",
    "url": "https://mathroneacademy.pages.dev"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Mathrone Academy",
    "logo": {
      "@type": "ImageObject",
      "url": "https://mathroneacademy.pages.dev/favicon.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": 'https://mathroneacademy.pages.dev/news/' + (p.slug || p.id)
  }
})
document.head.appendChild(articleSchema)

// Breadcrumb schema for article
const existingBreadcrumb = document.getElementById('breadcrumb-schema')
if(existingBreadcrumb) existingBreadcrumb.remove()
const breadcrumbSchema = document.createElement('script')
breadcrumbSchema.id = 'breadcrumb-schema'
breadcrumbSchema.type = 'application/ld+json'
breadcrumbSchema.textContent = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mathroneacademy.pages.dev/" },
    { "@type": "ListItem", "position": 2, "name": "News", "item": "https://mathroneacademy.pages.dev/news" },
    { "@type": "ListItem", "position": 3, "name": p.title, "item": "https://mathroneacademy.pages.dev/news/" + (p.slug || p.id) }
  ]
})
document.head.appendChild(breadcrumbSchema)

  if(State.user?.role==='admin'){
    const el = document.getElementById('admin-news-actions')
    if(el){
      el.innerHTML = `
      <button class="btn btn-ghost btn-sm" onclick="openNewsModalAsync('${p.id}')">✏️ Edit Post</button>
      <button class="btn btn-ghost btn-sm" style="color:var(--red)" onclick="deleteNews('${p.id}')">🗑️ Delete Post</button>`
    }
  }

  // Load related articles
  try{
    const related = await api('/news/' + p.id + '/related')
    const relatedEl = document.getElementById('related-articles-content')
    if(relatedEl && related.length){
      relatedEl.innerHTML = `
        ${related.map(r => `
          <div class="card" style="padding:0;overflow:hidden;cursor:pointer" onclick="openNewsPost('${r.id}')">
            ${r.image_url ? `<img src="${r.image_url}" alt="${r.title||'Related article'}" loading="lazy" decoding="async" style="width:100%;height:140px;object-fit:cover"/>` : `
            <div style="width:100%;height:100px;background:linear-gradient(135deg,#e5e7eb,#d1d5db);display:flex;align-items:center;justify-content:center;font-size:32px">📰</div>`}
            <div style="padding:12px">
              <div style="font-size:14px;font-weight:600;color:var(--navy);line-height:1.4;margin-bottom:8px">${r.title}</div>
              <div style="font-size:12px;color:var(--g400)">${fmtShort(r.created_at)} • ${r.views_count || 0} views</div>
            </div>
          </div>
        `).join('')}`
    } else if(relatedEl) {
      relatedEl.innerHTML = '<p style="color:var(--g400);font-style:italic">No related articles found</p>'
    }
  }catch(e){
    console.log('Failed to load related articles:', e)
    document.getElementById('related-articles-content').innerHTML = '<p style="color:var(--g400);font-style:italic">Failed to load related articles</p>'
  }

  // Load trending news for sidebar (using popular recent news)
  try{
    const trending = await api('/news?popular=true&limit=5')
    const trendingEl = document.getElementById('trending-news')
    if(trendingEl && trending.length){
      trendingEl.innerHTML = trending.map(t => `
        <div class="trending-card" onclick="openNewsPost('${t.id}')">
          ${t.image_url ? `<img src="${t.image_url}" alt="${t.title}" loading="lazy" decoding="async"/>` : `<div style="width:100%;height:120px;background:linear-gradient(135deg,#e5e7eb,#d1d5db);display:flex;align-items:center;justify-content:center;font-size:32px">📰</div>`}
          <div class="title">${t.title}</div>
          <div class="meta">${fmtShort(t.created_at)} • ${t.views_count || 0} views</div>
        </div>
      `).join('')
    } else if(trendingEl) {
      trendingEl.innerHTML = '<p style="color:var(--g400);font-style:italic;text-align:center">No trending news</p>'
    }
  }catch(e){
    console.log('Failed to load trending news:', e)
    document.getElementById('trending-news').innerHTML = '<p style="color:var(--g400);font-style:italic;text-align:center">Failed to load trending news</p>'
  }
  // Update URL for refresh support
  history.pushState({ page: 'news-article/' + (p.slug || p.id), tab: null }, document.title, '/news/' + (p.slug || p.id))
  }catch(e){
    toast(e.message,'err')
  }
}
function insertNewsLink(){
  // Premium link modal instead of prompt()
  const sel = window.getSelection()
  const selectedText = sel && sel.toString() ? sel.toString() : ''
  const savedRange = sel && sel.rangeCount ? sel.getRangeAt(0).cloneRange() : null

  const modal = document.createElement('div')
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:99999;display:flex;align-items:center;justify-content:center'
  modal.innerHTML = `
    <div style="background:#fff;border-radius:12px;padding:24px;width:420px;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
      <div style="font-size:16px;font-weight:700;color:var(--navy);margin-bottom:16px">🔗 Insert Link</div>
      <div class="form-group">
        <label class="form-label">Link Text</label>
        <input class="input" id="link-text" value="${selectedText}" placeholder="e.g. Read more here"/>
      </div>
      <div class="form-group">
        <label class="form-label">URL *</label>
        <input class="input" id="link-url" placeholder="https://" type="url"/>
      </div>
      <div class="form-group">
        <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer">
          <input type="checkbox" id="link-newtab" checked/> Open in new tab
        </label>
      </div>
      <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:8px">
        <button onclick="this.closest('div[style*=fixed]').remove()" class="btn btn-ghost">Cancel</button>
        <button onclick="applyNewsLink()" class="btn btn-primary">Insert Link</button>
      </div>
    </div>`
  document.body.appendChild(modal)
  window._savedLinkRange = savedRange
  setTimeout(() => document.getElementById('link-url')?.focus(), 50)
}

function applyNewsLink(){
  const url = document.getElementById('link-url')?.value?.trim()
  const text = document.getElementById('link-text')?.value?.trim()
  const newTab = document.getElementById('link-newtab')?.checked
  if(!url){ toast('Please enter a URL','err'); return }
  const editor = document.getElementById('news-editor')
  if(!editor) return
  editor.focus()
  if(window._savedLinkRange){
    const sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(window._savedLinkRange)
  }
  const a = document.createElement('a')
  a.href = url
  a.textContent = text || url
  if(newTab){ a.target = '_blank'; a.rel = 'noopener noreferrer' }
  a.style.color = '#1A5FFF'
  const sel2 = window.getSelection()
  if(sel2 && sel2.rangeCount){
    const range = sel2.getRangeAt(0)
    range.deleteContents()
    range.insertNode(a)
    range.setStartAfter(a)
    range.collapse(true)
    sel2.removeAllRanges()
    sel2.addRange(range)
  }
  document.querySelector('div[style*="position:fixed"][style*="99999"]')?.remove()
  window._savedLinkRange = null
}

async function openNewsModalAsync(postId = null){
  await openNewsModal(postId)
}
function insertAdPlaceholder() {
  const editor = document.getElementById('news-editor')
  if (!editor) return
  editor.focus()
  const adHtml = '<table width="100%" style="background:#FFF8ED;border:2px dashed #F5A623;border-radius:8px;margin:16px 0" data-ad-placeholder="true"><tr><td style="padding:14px;text-align:center;font-size:13px;font-weight:700;color:#b45309">📢 AD PLACEMENT — Ad will appear here</td></tr></table><p><br></p>'
  document.execCommand('insertHTML', false, adHtml)
}

function toggleNewsEditorFullscreen(){
  const modal = document.querySelector('#modal-root .modal')
  const btn = document.getElementById('news-fs-btn')
  if(!modal) return
  const isFs = modal.dataset.fullscreen === '1'
  if(isFs){
    modal.dataset.fullscreen = '0'
    modal.style.cssText = 'max-width:600px'
    if(btn) btn.textContent = '⛶ Fullscreen'
  } else {
    modal.dataset.fullscreen = '1'
    modal.style.cssText = 'max-width:100vw;width:100vw;height:100vh;margin:0;border-radius:0;display:flex;flex-direction:column'
    const body = modal.querySelector('.modal-body')
    if(body) body.style.cssText = 'flex:1;overflow-y:auto'
    const editor = document.getElementById('news-editor')
    if(editor) editor.style.minHeight = '60vh'
    if(btn) btn.textContent = '✕ Exit Fullscreen'
  }
}

function insertNewsEmbed(){
  const modal = document.createElement('div')
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:99999;display:flex;align-items:center;justify-content:center'
  modal.innerHTML = `
    <div style="background:#fff;border-radius:12px;padding:24px;width:460px;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
      <div style="font-size:16px;font-weight:700;color:var(--navy);margin-bottom:16px">📺 Embed Media</div>
      <div class="form-group">
        <label class="form-label">YouTube / Video URL or full iframe code</label>
        <textarea class="input" id="embed-input" rows="3" placeholder="https://www.youtube.com/watch?v=... or paste full iframe HTML"></textarea>
      </div>
      <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:8px">
        <button onclick="this.closest('div[style*=fixed]').remove()" class="btn btn-ghost">Cancel</button>
        <button onclick="applyNewsEmbed()" class="btn btn-primary">Insert Embed</button>
      </div>
    </div>`
  document.body.appendChild(modal)
  setTimeout(()=>document.getElementById('embed-input')?.focus(),50)
}

function applyNewsEmbed(){
  let val = document.getElementById('embed-input')?.value?.trim()
  if(!val){ toast('Please enter a URL or embed code','err'); return }
  const editor = document.getElementById('news-editor')
  if(!editor) return
  let html = ''
  if(val.startsWith('<')){
    // Raw iframe/embed code — wrap it
    html = `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:16px 0">${val.replace(/width=["'][^"']*["']/i,'width="100%"').replace(/height=["'][^"']*["']/i,'height="100%"').replace(/<iframe/i,'<iframe style="position:absolute;top:0;left:0;width:100%;height:100%;border:0"')}</div><p><br></p>`
  } else {
    // Convert YouTube watch URL to embed
    const ytMatch = val.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/)
    if(ytMatch){
      html = `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:16px 0"><iframe style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" src="https://www.youtube.com/embed/${ytMatch[1]}" allowfullscreen loading="lazy"></iframe></div><p><br></p>`
    } else {
      html = `<div style="margin:16px 0"><iframe src="${val}" style="width:100%;height:400px;border:1px solid var(--g200);border-radius:8px" loading="lazy"></iframe></div><p><br></p>`
    }
  }
  editor.focus()
  document.execCommand('insertHTML', false, html)
  document.querySelector('div[style*="position:fixed"][style*="99999"]')?.remove()
  toast('Embed inserted! 📺')
}

function insertNewsTable(){
  const modal = document.createElement('div')
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:99999;display:flex;align-items:center;justify-content:center'
  modal.innerHTML = `
    <div style="background:#fff;border-radius:12px;padding:24px;width:320px;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
      <div style="font-size:16px;font-weight:700;color:var(--navy);margin-bottom:16px">📊 Insert Table</div>
      <div style="display:flex;gap:12px;margin-bottom:16px">
        <div class="form-group" style="flex:1;margin:0">
          <label class="form-label">Rows</label>
          <input class="input" id="tbl-rows" type="number" value="3" min="1" max="20"/>
        </div>
        <div class="form-group" style="flex:1;margin:0">
          <label class="form-label">Columns</label>
          <input class="input" id="tbl-cols" type="number" value="3" min="1" max="10"/>
        </div>
      </div>
      <div style="display:flex;gap:10px;justify-content:flex-end">
        <button onclick="this.closest('div[style*=fixed]').remove()" class="btn btn-ghost">Cancel</button>
        <button onclick="applyNewsTable()" class="btn btn-primary">Insert Table</button>
      </div>
    </div>`
  document.body.appendChild(modal)
}

function applyNewsTable(){
  const rows = Math.max(1, Math.min(20, parseInt(document.getElementById('tbl-rows')?.value)||3))
  const cols = Math.max(1, Math.min(10, parseInt(document.getElementById('tbl-cols')?.value)||3))
  const editor = document.getElementById('news-editor')
  if(!editor) return
  const headerRow = `<tr>${Array.from({length:cols},(_,i)=>`<th style="border:1px solid #d1d5db;padding:8px 12px;background:#f8fafc;font-weight:700;text-align:left">Header ${i+1}</th>`).join('')}</tr>`
  const bodyRows = Array.from({length:rows-1},()=>`<tr>${Array.from({length:cols},()=>`<td style="border:1px solid #d1d5db;padding:8px 12px">Cell</td>`).join('')}</tr>`).join('')
  const html = `<table style="border-collapse:collapse;width:100%;margin:16px 0"><thead>${headerRow}</thead><tbody>${bodyRows}</tbody></table><p><br></p>`
  editor.focus()
  document.execCommand('insertHTML', false, html)
  document.querySelector('div[style*="position:fixed"][style*="99999"]')?.remove()
  toast('Table inserted! 📊')
}

function updateNewsWordCount(){
  const editor = document.getElementById('news-editor')
  const el = document.getElementById('news-word-count')
  if(!editor||!el) return
  const text = editor.innerText || editor.textContent || ''
  const words = text.trim().split(/\s+/).filter(w=>w.length>0).length
  const chars = text.replace(/\s/g,'').length
  el.textContent = `${words} words · ${chars} chars`
}

async function insertNewsFormula(){
  await ensureMathJax()

  const modal = document.createElement('div')
  modal.id = 'formula-modal'
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:99999;display:flex;align-items:center;justify-content:center'
  modal.innerHTML = `
    <div style="background:#fff;border-radius:14px;padding:28px;width:520px;max-width:95vw;box-shadow:0 24px 64px rgba(0,0,0,0.3)">
      <div style="font-size:16px;font-weight:700;color:var(--navy);margin-bottom:6px">Σ Insert Math Formula</div>
      <div style="font-size:12px;color:var(--g400);margin-bottom:16px">Write LaTeX. Use <code style='background:#f1f5f9;padding:1px 5px;border-radius:3px'>\\( ... \\)</code> for inline or <code style='background:#f1f5f9;padding:1px 5px;border-radius:3px'>$$ ... $$</code> for display (block).</div>

      <!-- Quick-insert buttons -->
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">
        ${[
          ['x²',        '\\(x^{2}\\)'],
          ['xₙ',        '\\(x_{n}\\)'],
          ['√x',        '\\(\\sqrt{x}\\)'],
          ['∛x',        '\\(\\sqrt[3]{x}\\)'],
          ['a/b',       '\\(\\frac{a}{b}\\)'],
          ['∑',         '\\(\\sum_{i=1}^{n} i\\)'],
          ['∫',         '\\(\\int_{a}^{b} f(x)\\,dx\\)'],
          ['lim',       '\\(\\lim_{x \\to \\infty} f(x)\\)'],
          ['matrix',    '$$\\begin{pmatrix} a & b \\\\\\\\ c & d \\end{pmatrix}$$'],
          ['quadratic', '$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$'],
          ['π e',       '\\(\\pi \\approx 3.14159,\\quad e \\approx 2.718\\)'],
          ['≤ ≥ ≠',     '\\(a \\leq b \\geq c \\neq d\\)'],
        ].map(([label, latex])=>`<button type="button" onclick="document.getElementById('formula-input').value=${JSON.stringify(latex)};previewFormula()" style="border:1px solid #e2e8f0;background:#f8fafc;padding:3px 9px;border-radius:4px;font-size:12px;cursor:pointer;color:#334155">${label}</button>`).join('')}
      </div>

      <textarea id="formula-input" rows="3" placeholder="e.g.  \\( \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a} \\)" style="width:100%;border:1px solid var(--g200);border-radius:6px;padding:10px;font-family:monospace;font-size:13px;resize:vertical;outline:none;margin-bottom:12px" oninput="previewFormula()"></textarea>

      <div style="font-size:12px;font-weight:600;color:var(--g400);margin-bottom:6px">PREVIEW</div>
      <div id="formula-preview" style="min-height:56px;border:1px solid var(--g100);border-radius:8px;padding:14px;background:#fafafa;text-align:center;font-size:18px;overflow-x:auto">
        <span style="color:var(--g300);font-size:13px">Type a formula above to see preview</span>
      </div>

      <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:16px">
        <button onclick="document.getElementById('formula-modal').remove()" class="btn btn-ghost">Cancel</button>
        <button onclick="applyNewsFormula()" class="btn btn-primary">Σ Insert Formula</button>
      </div>
    </div>`
  document.body.appendChild(modal)
  setTimeout(()=>document.getElementById('formula-input')?.focus(), 50)
}

async function previewFormula(){
  const input = document.getElementById('formula-input')?.value?.trim()
  const preview = document.getElementById('formula-preview')
  if(!preview) return
  if(!input){ preview.innerHTML = '<span style="color:var(--g300);font-size:13px">Type a formula above to see preview</span>'; return }
  preview.innerHTML = input
  try{
    await ensureMathJax()
    await MathJax.typesetPromise([preview])
  }catch(e){
    preview.innerHTML = `<span style="color:var(--red);font-size:12px">Preview error: ${e.message}</span>`
  }
}

async function applyNewsFormula(){
  const input = document.getElementById('formula-input')?.value?.trim()
  if(!input){ toast('Please enter a formula','err'); return }

  const editor = document.getElementById('news-editor')
  if(!editor){ toast('Editor not found','err'); return }

  // Determine if display (block) or inline
  const isDisplay = input.startsWith('$$') || input.includes('\\[')
  const tag = isDisplay ? 'div' : 'span'
  const style = isDisplay
    ? 'display:block;text-align:center;margin:16px 0;overflow-x:auto'
    : 'display:inline-block;vertical-align:middle'

  // Render via MathJax to SVG so it looks perfect for all viewers
  try{
    await ensureMathJax()
    // Create a hidden staging element
    const stage = document.createElement('div')
    stage.style.cssText = 'position:absolute;visibility:hidden;top:-9999px'
    stage.innerHTML = input
    document.body.appendChild(stage)
    await MathJax.typesetPromise([stage])
    const rendered = stage.innerHTML
    document.body.removeChild(stage)

    // Wrap with data-latex for re-editing later
    const safeLatex = input.replace(/"/g,'&quot;')
    const html = `<${tag} class="math-formula" data-latex="${safeLatex}" style="${style}" contenteditable="false">${rendered}</${tag}>${isDisplay ? '<p><br></p>' : '\u200b'}`

    editor.focus()
    document.execCommand('insertHTML', false, html)
    document.getElementById('formula-modal')?.remove()
    toast('Formula inserted! ✅')
    updateNewsWordCount()
  }catch(e){
    toast('Failed to render formula: ' + e.message, 'err')
  }
}

async function openNewsModal(postId = null){
  let modalRoot = document.getElementById('modal-root')
  if(!modalRoot){
    modalRoot = document.createElement('div')
    modalRoot.id = 'modal-root'
    document.body.appendChild(modalRoot)
  }
  modalRoot.innerHTML = `
  <div class="modal-overlay" onclick="if(event.target===this)this.remove()">
    <div class="modal" style="max-width:600px">
      <div class="modal-header">
        <span class="modal-title">${postId ? '✏️ Edit Post' : '+ New Education Post'}</span>
        <button class="modal-close" onclick="document.querySelector('.modal-overlay').remove()">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Category</label>
          <select class="input" id="news-cat">
            ${NEWS_CATEGORIES.map(c=>`<option value="${c.id}">${c.icon} ${c.label}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Tags (comma-separated, optional - auto-generated from content)</label>
          <div style="display:flex;gap:8px;align-items:flex-start">
            <input class="input" id="news-tags" placeholder="e.g. scholarship, university, deadline" style="flex:1"/>
            <button type="button" onclick="generateSuggestedTags()" style="background:#f0f4ff;color:#1a5fff;border:1px solid #1a5fff;padding:8px 12px;border-radius:6px;font-size:12px;font-weight:600;white-space:nowrap">🎯 Suggest Tags</button>
          </div>
          <small style="color:#6B6B80;font-size:12px">Leave empty to auto-generate relevant tags from your article content</small>
        </div>
        <div class="form-group">
          <label class="form-label">Title *</label>
          <input class="input" id="news-title" placeholder="e.g. Rwanda Government Opens 500 University Scholarships"/>
        </div>
        <div class="form-group">
          <label class="form-label">SEO Slug (optional - auto-generated from title)</label>
          <input class="input" id="news-slug" placeholder="e.g. rwanda-government-opens-500-university-scholarships"/>
          <small style="color:#6B6B80;font-size:12px">Leave empty to auto-generate from title</small>
        </div>
        <div class="form-group">
          <label class="form-label">Meta Description (optional - auto-generated from content)</label>
          <textarea class="input" id="news-description" rows="3" placeholder="Brief description for SEO (max 160 characters)"></textarea>
          <small style="color:#6B6B80;font-size:12px">Leave empty to auto-generate from content</small>
        </div>
        <div class="form-group">
          <label class="form-label">Content *</label>
          <div style="border:1px solid var(--g200);border-radius:8px;overflow:hidden">
            <div style="background:#f8fafc;padding:8px;border-bottom:1px solid var(--g200);display:flex;gap:6px;flex-wrap:wrap;align-items:center">
              <!-- Row 1: Block format + font + size + fullscreen -->
              <select onchange="document.execCommand('formatBlock',false,this.value);this.value=''" style="border:1px solid var(--g200);background:#fff;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:13px">
                <option value="">Paragraph</option>
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
                <option value="blockquote">Blockquote</option>
                <option value="pre">Code Block</option>
              </select>
              <select onchange="document.execCommand('fontName',false,this.value);this.value=''" style="border:1px solid var(--g200);background:#fff;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:13px">
                <option value="">Font</option>
                <option value="Arial">Arial</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Verdana">Verdana</option>
              </select>
              <select onchange="document.execCommand('fontSize',false,this.value);this.value=''" style="border:1px solid var(--g200);background:#fff;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:13px">
                <option value="">Size</option>
                <option value="1">Small</option>
                <option value="3">Normal</option>
                <option value="5">Large</option>
                <option value="7">Huge</option>
              </select>
              <button id="news-fs-btn" type="button" onclick="toggleNewsEditorFullscreen()" title="Fullscreen editor" style="border:1px solid var(--g200);background:#fff;padding:4px 10px;border-radius:4px;cursor:pointer;font-size:12px;margin-left:auto">⛶ Fullscreen</button>
            </div>
            <div style="background:#f8fafc;padding:6px 8px;border-bottom:1px solid var(--g200);display:flex;gap:5px;flex-wrap:wrap;align-items:center">
              <!-- Row 2: Inline formatting -->
              <button type="button" onclick="document.execCommand('bold')" title="Bold (Ctrl+B)" style="border:1px solid var(--g200);background:#fff;padding:4px 10px;border-radius:4px;font-weight:700;cursor:pointer">B</button>
              <button type="button" onclick="document.execCommand('italic')" title="Italic (Ctrl+I)" style="border:1px solid var(--g200);background:#fff;padding:4px 10px;border-radius:4px;font-style:italic;cursor:pointer">I</button>
              <button type="button" onclick="document.execCommand('underline')" title="Underline (Ctrl+U)" style="border:1px solid var(--g200);background:#fff;padding:4px 10px;border-radius:4px;text-decoration:underline;cursor:pointer">U</button>
              <button type="button" onclick="document.execCommand('strikeThrough')" title="Strikethrough" style="border:1px solid var(--g200);background:#fff;padding:4px 10px;border-radius:4px;text-decoration:line-through;cursor:pointer">S</button>
              <span style="width:1px;height:20px;background:var(--g200);display:inline-block;margin:0 2px"></span>
              <button type="button" onclick="document.execCommand('justifyLeft')" title="Align left" style="border:1px solid var(--g200);background:#fff;padding:4px 8px;border-radius:4px;cursor:pointer">⬅</button>
              <button type="button" onclick="document.execCommand('justifyCenter')" title="Center" style="border:1px solid var(--g200);background:#fff;padding:4px 8px;border-radius:4px;cursor:pointer">☰</button>
              <button type="button" onclick="document.execCommand('justifyRight')" title="Align right" style="border:1px solid var(--g200);background:#fff;padding:4px 8px;border-radius:4px;cursor:pointer">➡</button>
              <span style="width:1px;height:20px;background:var(--g200);display:inline-block;margin:0 2px"></span>
              <button type="button" onclick="document.execCommand('insertUnorderedList')" style="border:1px solid var(--g200);background:#fff;padding:4px 10px;border-radius:4px;cursor:pointer">• List</button>
              <button type="button" onclick="document.execCommand('insertOrderedList')" style="border:1px solid var(--g200);background:#fff;padding:4px 10px;border-radius:4px;cursor:pointer">1. List</button>
              <button type="button" onclick="document.execCommand('indent')" title="Indent" style="border:1px solid var(--g200);background:#fff;padding:4px 8px;border-radius:4px;cursor:pointer">→</button>
              <button type="button" onclick="document.execCommand('outdent')" title="Outdent" style="border:1px solid var(--g200);background:#fff;padding:4px 8px;border-radius:4px;cursor:pointer">←</button>
              <span style="width:1px;height:20px;background:var(--g200);display:inline-block;margin:0 2px"></span>
              <button type="button" onclick="document.execCommand('undo')" title="Undo (Ctrl+Z)" style="border:1px solid var(--g200);background:#fff;padding:4px 8px;border-radius:4px;cursor:pointer">↩</button>
              <button type="button" onclick="document.execCommand('redo')" title="Redo (Ctrl+Y)" style="border:1px solid var(--g200);background:#fff;padding:4px 8px;border-radius:4px;cursor:pointer">↪</button>
              <span style="width:1px;height:20px;background:var(--g200);display:inline-block;margin:0 2px"></span>
              <button type="button" onclick="insertNewsLink()" style="border:1px solid var(--g200);background:#fff;padding:4px 10px;border-radius:4px;cursor:pointer">🔗 Link</button>
              <button type="button" onclick="document.getElementById('news-img-upload').click()" style="border:1px solid var(--g200);background:#fff;padding:4px 10px;border-radius:4px;cursor:pointer">🖼️ Image</button>
              <button type="button" onclick="insertNewsEmbed()" title="Embed YouTube or iframe" style="border:1px solid var(--g200);background:#fff;padding:4px 10px;border-radius:4px;cursor:pointer">📺 Embed</button>
              <button type="button" onclick="insertNewsTable()" title="Insert table" style="border:1px solid var(--g200);background:#fff;padding:4px 10px;border-radius:4px;cursor:pointer">📊 Table</button>
              <button type="button" onclick="insertNewsFormula()" title="Insert math formula (LaTeX)" style="border:1px solid #7c3aed;background:#f5f3ff;padding:4px 10px;border-radius:4px;cursor:pointer;font-weight:600;color:#7c3aed">Σ Formula</button>
              <button type="button" onclick="insertAdPlaceholder()" style="border:1px solid #F5A623;background:#FFF8ED;padding:4px 10px;border-radius:4px;cursor:pointer;font-weight:600;color:#b45309">📢 Ad</button>
              <input type="file" id="news-img-upload" accept="image/*" style="display:none" onchange="insertNewsImage(this)"/>
              <input type="color" onchange="document.execCommand('foreColor',false,this.value)" title="Text color" style="border:1px solid var(--g200);border-radius:4px;width:32px;height:28px;cursor:pointer;padding:2px"/>
              <input type="color" onchange="document.execCommand('hiliteColor',false,this.value)" title="Highlight color" style="border:1px solid var(--g200);border-radius:4px;width:32px;height:28px;cursor:pointer;padding:2px;background:#ffff00"/>
            </div>
            <div id="news-editor" contenteditable="true" style="min-height:200px;padding:12px;font-size:14px;outline:none;line-height:1.8" placeholder="Write your post content here..." oninput="updateNewsWordCount()"></div>
            <div style="background:#f8fafc;padding:4px 12px;border-top:1px solid var(--g200);font-size:11px;color:var(--g400);display:flex;justify-content:space-between;align-items:center">
              <span id="news-word-count">0 words · 0 chars</span>
              <span style="font-size:10px;color:var(--g300)">Ctrl+B Bold · Ctrl+I Italic · Ctrl+Z Undo</span>
            </div>
          </div>
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Image URL (optional)</label>
            <input class="input" id="news-image" placeholder="https://..."/>
          </div>
          <div class="form-group">
            <label class="form-label">Source Name (optional)</label>
            <input class="input" id="news-source-name" placeholder="e.g. REB, MINEDUC"/>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Source URL (optional)</label>
          <input class="input" id="news-source-url" placeholder="https://..."/>
        </div>
        <div class="form-group">
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:14px">
            <input type="checkbox" id="news-featured"/> Feature this post (shows at top)
          </label>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="document.querySelector('.modal-overlay').remove()">Cancel</button>
        <button class="btn btn-primary" onclick="submitNews('${postId||''}')">
          ${postId ? 'Update Post ✅' : 'Publish Post ✅'}
        </button>
      </div>
    </div>
  </div>`

  // Populate fields if editing
  if(postId){
    try{
      const post = await api('/news/' + postId)
      if(!post || post.detail){ toast('Post not found','err'); document.querySelector('.modal-overlay')?.remove(); return; }
      setTimeout(() => {
        document.getElementById('news-cat').value = post.category
        document.getElementById('news-tags').value = post.tags?.join(', ') || ''
        document.getElementById('news-title').value = post.title
        document.getElementById('news-slug').value = post.slug || ''
        document.getElementById('news-description').value = post.description || ''
        document.getElementById('news-editor').innerHTML = post.content
        document.getElementById('news-image').value = post.image_url || ''
        document.getElementById('news-source-name').value = post.source_name || ''
        document.getElementById('news-source-url').value = post.source_url || ''
        document.getElementById('news-featured').checked = post.is_featured
        updateNewsWordCount()
        // Show current tags info
        if(post.tags && post.tags.length > 0){
          const tagsInput = document.getElementById('news-tags')
          tagsInput.placeholder = `Current: ${post.tags.join(', ')}`
        }
      }, 100)
    }catch(e){
      toast('Failed to load post for editing: ' + e.message,'err')
      document.querySelector('.modal-overlay')?.remove()
    }
  }
}

function generateSuggestedTags(){
  const title = document.getElementById('news-title')?.value?.trim() || ''
  const content = document.getElementById('news-editor')?.innerHTML?.trim() || ''
  
  if(!title && !content){
    toast('Please add a title and content first','err')
    return
  }
  
  // Simple client-side tag generation (fallback if backend fails)
  try{
    const text = (title + ' ' + content).toLowerCase()
    const words = text.replace(/<[^>]*>/g, '').split(/\s+/)
    
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'])
    
    const educationWords = new Set(['education', 'school', 'university', 'college', 'student', 'teacher', 'tutor', 'learning', 'academic', 'scholarship', 'exam', 'test', 'grade', 'class', 'course', 'subject', 'math', 'science', 'english', 'history', 'geography', 'physics', 'chemistry', 'biology', 'rwanda', 'kigali', 'africa', 'government', 'ministry', 'reb', 'mineduc', 'unesco', 'online', 'digital', 'technology', 'computer', 'internet', 'mobile', 'app', 'career', 'job', 'employment', 'opportunity', 'training', 'skill', 'development'])
    
    const candidates = words.filter(word => 
      word.length > 3 && 
      !stopWords.has(word) && 
      /^[a-z]+$/.test(word)
    )
    
    // Count frequency
    const freq = {}
    candidates.forEach(word => freq[word] = (freq[word] || 0) + 1)
    
    // Sort by education relevance then frequency
    const sorted = Object.keys(freq).sort((a,b) => {
      const aEdu = educationWords.has(a) ? 1 : 0
      const bEdu = educationWords.has(b) ? 1 : 0
      if(aEdu !== bEdu) return bEdu - aEdu
      return freq[b] - freq[a]
    })
    
    const suggested = sorted.slice(0, 5)
    if(suggested.length > 0){
      document.getElementById('news-tags').value = suggested.join(', ')
      toast(`Suggested tags: ${suggested.join(', ')}`, 'success')
    }else{
      toast('No suitable tags found. Try adding more content.','warn')
    }
  }catch(e){
    toast('Error generating tags','err')
  }
}

async function submitNews(postId){
  // Unwrap any resize wrappers and bake width into img style before saving
  const editor = document.getElementById('news-editor')
  if(editor){
    editor.querySelectorAll('.img-resize-wrapper').forEach(wrapper=>{
      const img = wrapper.querySelector('img')
      if(img){
        img.style.width = wrapper.offsetWidth + 'px'
        img.style.height = 'auto'
        img.style.maxWidth = '100%'
        img.style.display = 'block'
        img.style.float = wrapper.style.float || 'none'
        img.style.marginLeft = wrapper.style.marginLeft || 'auto'
        img.style.marginRight = wrapper.style.marginRight || 'auto'
        wrapper.parentNode.insertBefore(img, wrapper)
        wrapper.remove()
      }
    })
  }
  const title      = document.getElementById('news-title')?.value?.trim()
  const description= document.getElementById('news-description')?.value?.trim()||null
  const content    = document.getElementById('news-editor')?.innerHTML?.trim()
  const category   = document.getElementById('news-cat')?.value
  const tags       = document.getElementById('news-tags')?.value?.trim()?.split(',').map(t=>t.trim()).filter(t=>t)||[]
  const is_featured= document.getElementById('news-featured')?.checked||false
  const source_name= document.getElementById('news-source-name')?.value?.trim()||null
  const source_url = document.getElementById('news-source-url')?.value?.trim()||null

  // Get image_url: manual field first, then first img in editor
  let image_url = document.getElementById('news-image')?.value?.trim()||null
  if(!image_url){
    const editorHtml = document.getElementById('news-editor')?.innerHTML||''
    const match = editorHtml.match(/<img[^>]+src=["']([^"']+)["']/i)
    if(match && match[1]) image_url = match[1]
  }

 if(!title){ toast('Please add a title','err'); return }
if(!content || content === '<br>'){ toast('Please add content','err'); return }
const slug = document.getElementById('news-slug')?.value?.trim() ||
  title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-')

  try{
    if(postId){
      await api(`/news/${postId}`, { method:'PATCH', body: JSON.stringify({ title, slug, description, content, category, tags, image_url, source_name, source_url, is_featured }) })
      toast('Post updated! ✅')
    } else {
      await api('/news/', { method:'POST', body: JSON.stringify({ title, slug, description, content, category, tags, image_url, source_name, source_url, is_featured }) })
      toast('Post published! ✅')
    }
    document.querySelector('.modal-overlay')?.remove()
    renderPublicNews()
  }catch(e){
    toast(e.message,'err')
  }
}

async function deleteNews(postId){
  if(!confirm('Delete this post?')) return
  try{
    await api(`/news/${postId}`, { method:'DELETE' })
    toast('Post deleted! ✅')
    renderPublicNews()
  }catch(e){
    toast(e.message,'err')
  }
}
async function openCropModal(){
  const img = document.querySelector('#news-editor img.selected')
  if(!img) return
  await ensureCropper();
  const src = img.src
  
  // Create crop modal with stretching options
  const modal = document.createElement('div')
  modal.id = 'crop-modal'
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:99999;display:flex;align-items:center;justify-content:center'
  modal.innerHTML = `
    <div style="background:#fff;border-radius:16px;padding:24px;max-width:800px;width:90%;max-height:90vh;overflow:auto">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <h3 style="font-size:16px;font-weight:700;color:var(--navy)">✂️ Crop & Resize Image</h3>
        <button onclick="closeCropModal()" style="background:none;border:none;font-size:20px;cursor:pointer">✕</button>
      </div>
      
      <!-- Image container with resize handles (MS Word style) -->
      <div style="max-height:500px;overflow:hidden;margin-bottom:16px;position:relative;display:flex;justify-content:center">
        <div style="position:relative;display:inline-block" id="image-container">
          <!-- Corner resize handles -->
          <div class="resize-handle nw" data-direction="nw"></div>
          <div class="resize-handle ne" data-direction="ne"></div>
          <div class="resize-handle sw" data-direction="sw"></div>
          <div class="resize-handle se" data-direction="se"></div>

          <!-- Midpoint resize handles -->
          <div class="resize-handle n" data-direction="n"></div>
          <div class="resize-handle s" data-direction="s"></div>
          <div class="resize-handle w" data-direction="w"></div>
          <div class="resize-handle e" data-direction="e"></div>

          <img id="crop-img" src="${src}" alt="Image to crop" loading="lazy" decoding="async" style="max-width:100%;display:block;border:2px solid #007bff;border-radius:4px;"/>
        </div>
      </div>
      
      <!-- Aspect Ratio Controls -->
      <div style="margin-bottom:16px">
        <label style="font-size:14px;font-weight:600;color:var(--navy);display:block;margin-bottom:8px">Crop Aspect Ratio:</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button onclick="setCropRatio(16/9)" class="btn btn-ghost btn-sm">16:9</button>
          <button onclick="setCropRatio(4/3)" class="btn btn-ghost btn-sm">4:3</button>
          <button onclick="setCropRatio(1)" class="btn btn-ghost btn-sm">1:1</button>
          <button onclick="setCropRatio(3/4)" class="btn btn-ghost btn-sm">3:4</button>
          <button onclick="setCropRatio(9/16)" class="btn btn-ghost btn-sm">9:16</button>
          <button onclick="setCropRatio(NaN)" class="btn btn-ghost btn-sm">Free</button>
        </div>
      </div>
      
      <!-- Resize/Stretching Controls -->
      <div style="margin-bottom:16px">
        <label style="font-size:14px;font-weight:600;color:var(--navy);display:block;margin-bottom:8px">Resize to Specific Dimensions:</label>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px">
          <button onclick="resizeToDimensions(800, 600)" class="btn btn-ghost btn-sm">800×600</button>
          <button onclick="resizeToDimensions(600, 400)" class="btn btn-ghost btn-sm">600×400</button>
          <button onclick="resizeToDimensions(400, 300)" class="btn btn-ghost btn-sm">400×300</button>
          <button onclick="resizeToDimensions(300, 200)" class="btn btn-ghost btn-sm">300×200</button>
          <button onclick="resizeToDimensions(1200, 800)" class="btn btn-ghost btn-sm">1200×800</button>
          <button onclick="resizeToDimensions(1920, 1080)" class="btn btn-ghost btn-sm">1920×1080</button>
        </div>
      </div>
      
      <!-- Stretch Controls (Independent Side Stretching) -->
      <div style="margin-bottom:16px">
        <label style="font-size:14px;font-weight:600;color:var(--navy);display:block;margin-bottom:8px">Stretch Image Sides:</label>
        <div style="display:flex;flex-direction:column;gap:12px">
          <!-- Left Side Stretching -->
          <div style="display:flex;gap:8px;align-items:center">
            <span style="font-size:12px;min-width:40px">Left:</span>
            <button onclick="stretchSide('left', -10)" class="btn btn-ghost btn-sm">◀️</button>
            <input type="range" id="stretch-left" min="-100" max="100" value="0" step="5" style="flex:1" oninput="updateStretchPreview()"/>
            <button onclick="stretchSide('left', 10)" class="btn btn-ghost btn-sm">▶️</button>
            <span id="stretch-left-value" style="font-size:12px;min-width:40px">0%</span>
          </div>
          <!-- Right Side Stretching -->
          <div style="display:flex;gap:8px;align-items:center">
            <span style="font-size:12px;min-width:40px">Right:</span>
            <button onclick="stretchSide('right', -10)" class="btn btn-ghost btn-sm">◀️</button>
            <input type="range" id="stretch-right" min="-100" max="100" value="0" step="5" style="flex:1" oninput="updateStretchPreview()"/>
            <button onclick="stretchSide('right', 10)" class="btn btn-ghost btn-sm">▶️</button>
            <span id="stretch-right-value" style="font-size:12px;min-width:40px">0%</span>
          </div>
          <!-- Stretch Controls -->
          <div style="display:flex;gap:8px;justify-content:center">
            <button onclick="resetStretching()" class="btn btn-ghost btn-sm">🔄 Reset</button>
            <button onclick="applyStretching()" class="btn btn-primary btn-sm">Apply Stretch</button>
          </div>
        </div>
      </div>
      
      <!-- Resize Controls (MS Word style) -->
      <div style="margin-bottom:16px">
        <label style="font-size:14px;font-weight:600;color:var(--navy);display:block;margin-bottom:8px">Resize Image: <span style="font-size:12px;font-weight:400;color:#666">(Drag corner/side handles to resize)</span></label>
        <div style="display:flex;gap:8px;align-items:center">
          <button onclick="toggleAspectRatio()" id="aspect-btn" class="btn btn-primary btn-sm" style="background:#28a745">🔗 Maintain Aspect</button>
          <button onclick="resetImageSize()" class="btn btn-ghost btn-sm">🔄 Reset Size</button>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div style="display:flex;gap:10px;margin-top:16px;justify-content:flex-end">
        <button onclick="closeCropModal()" class="btn btn-ghost">Cancel</button>
        <button onclick="applyCrop()" class="btn btn-primary">Apply Changes ✅</button>
      </div>
    </div>
  `
  document.body.appendChild(modal)
  
  // Initialize cropper with enhanced options
  const cropImg = document.getElementById('crop-img')
  window._cropper = new Cropper(cropImg, {
    viewMode: 1,
    autoCropArea: 1,
    responsive: true,
    restore: false,
    checkCrossOrigin: false,
    checkOrientation: false,
    modal: true,
    guides: true,
    center: true,
    highlight: false,
    background: false,
    cropBoxMovable: true,
    cropBoxResizable: true,
    toggleDragModeOnDblclick: false,
    zoomOnWheel: true,
    zoomOnTouch: true,
    zoom: function(e) {
      // Update zoom slider when zooming with mouse wheel
      const zoomSlider = document.getElementById('zoom-slider')
      const zoomValue = document.getElementById('zoom-value')
      if(zoomSlider && zoomValue) {
        zoomSlider.value = e.detail.ratio
        zoomValue.textContent = e.detail.ratio.toFixed(1) + 'x'
      }
    }
  })
  
  // Initialize zoom slider
  const zoomSlider = document.getElementById('zoom-slider')
  if(zoomSlider) {
    zoomSlider.addEventListener('input', function() {
      window._cropper.zoomTo(this.value)
      document.getElementById('zoom-value').textContent = parseFloat(this.value).toFixed(1) + 'x'
    })
  }
  
  // Initialize resize handles
  initResizeHandles()
  
  // Initialize stretching functionality
  initStretching()
}

function setCropRatio(ratio){
  if(window._cropper) window._cropper.setAspectRatio(ratio)
}

function resizeToDimensions(width, height){
  if(!window._cropper) return
  
  // Set crop box to specific dimensions
  const containerData = window._cropper.getContainerData()
  const cropBoxData = window._cropper.getCropBoxData()
  
  // Calculate new crop box size
  const newWidth = Math.min(width, containerData.width * 0.8)
  const newHeight = Math.min(height, containerData.height * 0.8)
  
  // Center the crop box
  const left = (containerData.width - newWidth) / 2
  const top = (containerData.height - newHeight) / 2
  
  window._cropper.setCropBoxData({
    left: left,
    top: top,
    width: newWidth,
    height: newHeight
  })
  
  // Set aspect ratio to match the dimensions
  window._cropper.setAspectRatio(width / height)
}

function resizeToCustomDimensions(){
  const width = parseInt(document.getElementById('custom-width').value)
  const height = parseInt(document.getElementById('custom-height').value)
  const maintainAspect = document.getElementById('maintain-aspect').checked
  
  if(!width || !height || width < 50 || height < 50 || width > 2000 || height > 2000){
    toast('Please enter valid dimensions (50-2000px)', 'err')
    return
  }
  
  if(!window._cropper) return
  
  if(maintainAspect){
    // Calculate aspect ratio and resize accordingly
    const aspectRatio = width / height
    window._cropper.setAspectRatio(aspectRatio)
    
    // Resize crop box to fit within container while maintaining aspect ratio
    const containerData = window._cropper.getContainerData()
    const maxWidth = containerData.width * 0.9
    const maxHeight = containerData.height * 0.9
    
    let newWidth = width
    let newHeight = height
    
    if(newWidth > maxWidth){
      newWidth = maxWidth
      newHeight = newWidth / aspectRatio
    }
    
    if(newHeight > maxHeight){
      newHeight = maxHeight
      newWidth = newHeight * aspectRatio
    }
    
    const left = (containerData.width - newWidth) / 2
    const top = (containerData.height - newHeight) / 2
    
    window._cropper.setCropBoxData({
      left: left,
      top: top,
      width: newWidth,
      height: newHeight
    })
  } else {
    // Free resize - set exact dimensions
    resizeToDimensions(width, height)
  }
  
  toast(`Resized to ${width}×${height}px`, 'success')
}

// MS Word-style image resizing
let isResizing = false
let resizeDirection = null
let startX = 0
let startY = 0
let startWidth = 0
let startHeight = 0
let aspectRatio = 1
let maintainAspect = true

function initResizeHandles(){
  const container = document.getElementById('image-container')
  const img = document.getElementById('crop-img')

  if(!container || !img) return

  // Wait for image to load before initializing
  if(img.complete){
    initializeResizeHandles()
  } else {
    img.onload = initializeResizeHandles
  }
}

function initializeResizeHandles(){
  const container = document.getElementById('image-container')
  const img = document.getElementById('crop-img')

  if(!container || !img) return

  // Set initial size
  startWidth = img.offsetWidth
  startHeight = img.offsetHeight
  aspectRatio = startWidth / startHeight

  // Add event listeners to handles
  const handles = container.querySelectorAll('.resize-handle')
  handles.forEach(handle => {
    handle.addEventListener('mousedown', startResize)
  })

  // Update handle positions
  updateHandlePositions()
}

function startResize(e){
  e.preventDefault()
  isResizing = true
  resizeDirection = e.target
  startX = e.clientX
  startY = e.clientY

  const img = document.getElementById('crop-img')
  startWidth = img.offsetWidth
  startHeight = img.offsetHeight

  document.addEventListener('mousemove', resize)
  document.addEventListener('mouseup', stopResize)
}

function resize(e){
  if(!isResizing || !resizeDirection) return

  const img = document.getElementById('crop-img')
  const direction = resizeDirection.getAttribute('data-direction')

  const deltaX = e.clientX - startX
  const deltaY = e.clientY - startY

  let newWidth = startWidth
  let newHeight = startHeight

  // Calculate new dimensions based on handle direction
  switch(direction){
    case 'nw': // North West
      newWidth = startWidth - deltaX
      newHeight = maintainAspect ? newWidth / aspectRatio : startHeight - deltaY
      break
    case 'ne': // North East
      newWidth = startWidth + deltaX
      newHeight = maintainAspect ? newWidth / aspectRatio : startHeight - deltaY
      break
    case 'sw': // South West
      newWidth = startWidth - deltaX
      newHeight = maintainAspect ? newWidth / aspectRatio : startHeight + deltaY
      break
    case 'se': // South East
      newWidth = startWidth + deltaX
      newHeight = maintainAspect ? newWidth / aspectRatio : startHeight + deltaY
      break
    case 'n': // North
      newHeight = startHeight - deltaY
      newWidth = maintainAspect ? newHeight * aspectRatio : startWidth
      break
    case 's': // South
      newHeight = startHeight + deltaY
      newWidth = maintainAspect ? newHeight * aspectRatio : startWidth
      break
    case 'w': // West
      newWidth = startWidth - deltaX
      newHeight = maintainAspect ? newWidth / aspectRatio : startHeight
      break
    case 'e': // East
      newWidth = startWidth + deltaX
      newHeight = maintainAspect ? newWidth / aspectRatio : startHeight
      break
  }

  // Apply minimum size constraints
  newWidth = Math.max(50, newWidth)
  newHeight = Math.max(50, newHeight)

  // Apply new dimensions
  img.style.width = newWidth + 'px'
  img.style.height = newHeight + 'px'

  // Update handle positions
  updateHandlePositions()
}

function stopResize(){
  isResizing = false
  resizeDirection = null
  document.removeEventListener('mousemove', resize)
  document.removeEventListener('mouseup', stopResize)
}

function updateHandlePositions(){
  const container = document.getElementById('image-container')
  const img = document.getElementById('crop-img')
  if(!container || !img) return

  const rect = img.getBoundingClientRect()
  const containerRect = container.getBoundingClientRect()

  // Update corner handles
  const nw = container.querySelector('.resize-handle.nw')
  const ne = container.querySelector('.resize-handle.ne')
  const sw = container.querySelector('.resize-handle.sw')
  const se = container.querySelector('.resize-handle.se')

  if(nw) nw.style.left = (rect.left - containerRect.left - 5) + 'px'
  if(ne) ne.style.left = (rect.right - containerRect.left - 5) + 'px'
  if(sw) sw.style.left = (rect.left - containerRect.left - 5) + 'px'
  if(se) se.style.left = (rect.right - containerRect.left - 5) + 'px'

  if(nw) nw.style.top = (rect.top - containerRect.top - 5) + 'px'
  if(ne) ne.style.top = (rect.top - containerRect.top - 5) + 'px'
  if(sw) sw.style.top = (rect.bottom - containerRect.top - 5) + 'px'
  if(se) se.style.top = (rect.bottom - containerRect.top - 5) + 'px'

  // Update midpoint handles
  const n = container.querySelector('.resize-handle.n')
  const s = container.querySelector('.resize-handle.s')
  const w = container.querySelector('.resize-handle.w')
  const e = container.querySelector('.resize-handle.e')

  if(n) n.style.left = (rect.left - containerRect.left + rect.width/2 - 5) + 'px'
  if(s) s.style.left = (rect.left - containerRect.left + rect.width/2 - 5) + 'px'
  if(w) w.style.top = (rect.top - containerRect.top + rect.height/2 - 5) + 'px'
  if(e) e.style.top = (rect.top - containerRect.top + rect.height/2 - 5) + 'px'

  if(n) n.style.top = (rect.top - containerRect.top - 5) + 'px'
  if(s) s.style.top = (rect.bottom - containerRect.top - 5) + 'px'
  if(w) w.style.left = (rect.left - containerRect.left - 5) + 'px'
  if(e) e.style.left = (rect.right - containerRect.left - 5) + 'px'
}

function toggleAspectRatio(){
  maintainAspect = !maintainAspect
  const button = document.getElementById('aspect-btn')
  if(button){
    button.textContent = maintainAspect ? '🔗 Maintain Aspect' : '🔓 Free Resize'
  }
}

function resetImageSize(){
  const img = document.getElementById('crop-img')
  if(!img) return

  img.style.width = ''
  img.style.height = ''
  startWidth = img.offsetWidth
  startHeight = img.offsetHeight
  aspectRatio = startWidth / startHeight
  updateHandlePositions()
}

// Stretching functionality (independent side stretching)
let stretchCanvas, stretchCtx, originalImageData

function initStretching(){
  const cropImg = document.getElementById('crop-img')
  if(!cropImg) return
  
  // Create canvas for stretching preview
  stretchCanvas = document.createElement('canvas')
  stretchCtx = stretchCanvas.getContext('2d')
  
  // Store original image data with CORS handling
  const img = new Image()
  img.crossOrigin = 'anonymous' // Enable CORS
  img.onload = function(){
    try {
      stretchCanvas.width = img.width
      stretchCanvas.height = img.height
      stretchCtx.drawImage(img, 0, 0)
      originalImageData = stretchCtx.getImageData(0, 0, stretchCanvas.width, stretchCanvas.height)
    } catch (e) {
      console.warn('CORS error: Cannot access image data for stretching. Using fallback mode.')
      // Fallback: create a simple colored rectangle as placeholder
      stretchCanvas.width = img.width
      stretchCanvas.height = img.height
      stretchCtx.fillStyle = '#f0f0f0'
      stretchCtx.fillRect(0, 0, stretchCanvas.width, stretchCanvas.height)
      stretchCtx.fillStyle = '#666'
      stretchCtx.font = '16px Arial'
      stretchCtx.textAlign = 'center'
      stretchCtx.fillText('CORS Restricted', stretchCanvas.width/2, stretchCanvas.height/2)
      originalImageData = stretchCtx.getImageData(0, 0, stretchCanvas.width, stretchCanvas.height)
      
      // Disable stretching controls
      document.getElementById('stretch-left').disabled = true
      document.getElementById('stretch-right').disabled = true
      toast('Image stretching disabled due to CORS restrictions', 'warn')
    }
  }
  img.onerror = function(){
    console.warn('Failed to load image for stretching')
  }
  img.src = cropImg.src
}

function stretchSide(side, amount){
  const slider = document.getElementById(`stretch-${side}`)
  const currentValue = parseInt(slider.value)
  slider.value = Math.max(-100, Math.min(100, currentValue + amount))
  updateStretchPreview()
}

function updateStretchPreview(){
  if(!stretchCanvas || !originalImageData) {
    console.log('No canvas or image data available for stretching')
    return
  }
  
  const leftStretch = parseInt(document.getElementById('stretch-left').value) / 100
  const rightStretch = parseInt(document.getElementById('stretch-right').value) / 100
  
  // Update display values
  document.getElementById('stretch-left-value').textContent = (leftStretch * 100).toFixed(0) + '%'
  document.getElementById('stretch-right-value').textContent = (rightStretch * 100).toFixed(0) + '%'
  
  // Apply stretching effect
  const width = stretchCanvas.width
  const height = stretchCanvas.height
  
  // Clear canvas
  stretchCtx.clearRect(0, 0, width, height)
  
  // Create stretched image
  const stretchedImageData = stretchCtx.createImageData(width, height)
  
  for(let y = 0; y < height; y++){
    for(let x = 0; x < width; x++){
      // Calculate source position with stretching
      let sourceX = x
      
      // Apply left side stretching
      if(x < width / 2){
        const leftFactor = 1 + leftStretch
        const centerX = width / 2
        sourceX = centerX - (centerX - x) * leftFactor
      }
      // Apply right side stretching  
      else {
        const rightFactor = 1 + rightStretch
        const centerX = width / 2
        sourceX = centerX + (x - centerX) * rightFactor
      }
      
      // Clamp to valid coordinates
      sourceX = Math.max(0, Math.min(width - 1, sourceX))
      
      // Get pixel from original image
      const sourceIndex = (Math.floor(sourceX) + Math.floor(y) * width) * 4
      const targetIndex = (x + y * width) * 4
      
      if(sourceIndex < originalImageData.data.length - 3){
        stretchedImageData.data[targetIndex] = originalImageData.data[sourceIndex]     // R
        stretchedImageData.data[targetIndex + 1] = originalImageData.data[sourceIndex + 1] // G
        stretchedImageData.data[targetIndex + 2] = originalImageData.data[sourceIndex + 2] // B
        stretchedImageData.data[targetIndex + 3] = originalImageData.data[sourceIndex + 3] // A
      }
    }
  }
  
  stretchCtx.putImageData(stretchedImageData, 0, 0)
  
  // Update the cropper image
  const cropImg = document.getElementById('crop-img')
  cropImg.src = stretchCanvas.toDataURL()
  
  // Reinitialize cropper with new image
  if(window._cropper){
    window._cropper.replace(cropImg.src)
  }
}

function resetStretching(){
  document.getElementById('stretch-left').value = 0
  document.getElementById('stretch-right').value = 0
  // Re-enable controls in case they were disabled due to CORS
  document.getElementById('stretch-left').disabled = false
  document.getElementById('stretch-right').disabled = false
  updateStretchPreview()
}

function applyStretching(){
  // The stretched image is already applied to the cropper
  toast('Stretching applied! Use crop controls to finalize.', 'success')
}

function applyCrop(){
  const img = document.querySelector('#news-editor img.selected')
  if(!img || !window._cropper) return
  
  const canvas = window._cropper.getCroppedCanvas()
  const croppedUrl = canvas.toDataURL('image/jpeg', 0.9)
  
  // Upload cropped image to server
  canvas.toBlob(async (blob)=>{
    const form = new FormData()
    form.append('file', blob, 'cropped.jpg')
    try{
      const res = await fetch(API_URL + '/news/upload-image', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + getToken() },
        body: form
      })
      const data = await res.json()
      if(res.ok){
        img.src = data.url
        img.style.width = ''
        toast('Image cropped and uploaded! ✅')
      } else {
        // Fallback to base64 if upload fails
        img.src = croppedUrl
      }
    }catch(e){
      img.src = croppedUrl
    }
    closeCropModal()
  }, 'image/jpeg', 0.9)
}

function closeCropModal(){
  if(window._cropper){ window._cropper.destroy(); window._cropper = null }
  document.getElementById('crop-modal')?.remove()
}