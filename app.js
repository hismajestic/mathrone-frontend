// ════════════════════════════════════════════════════════════
    // CONFIG — change API_URL if your backend runs elsewhere
    // ════════════════════════════════════════════════════════════
  
  var API_URL = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost'
? 'http://127.0.0.1:8000/api/v1'
: '/api/v1'

// NEW: Client-side Supabase connection for Whiteboard
const SB_URL = "https://hdpkjomganndiiprnpok.supabase.co";
const SB_KEY = window.__SB_CFG__ || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkcGtqb21nYW5uZGlpcHJucG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMTU5ODEsImV4cCI6MjA4ODY5MTk4MX0.cNA9Eira3m5Bv0v1EFIOdzOMF08avbxYs4zKwIVleLM";

// Define a variable, but don't initialize yet to avoid the crash
let supabaseClient = null;

function getSupabase() {
  if (supabaseClient) return supabaseClient;
  if (window.supabase) {
    supabaseClient = window.supabase.createClient(SB_URL, SB_KEY, {
      auth: { persistSession: false }
    });
    return supabaseClient;
  }
  // Try again if the script hasn't loaded yet
  setTimeout(getSupabase, 500);
  return null;
}
  
  var CATEGORIES = [
  { id: 'academic',   icon: '<i data-lucide="book-open" style="width:24px;height:24px"></i>', label: 'Academic Tutoring',      desc: 'Primary, Secondary & University subjects' },
  { id: 'digital',    icon: '<i data-lucide="laptop" style="width:24px;height:24px"></i>', label: 'Digital Skills',          desc: 'MS Office, Google Workspace, Computer basics' },
  { id: 'creative',   icon: '<i data-lucide="video" style="width:24px;height:24px"></i>', label: 'Creative Skills',         desc: 'Video editing, Graphic design, Photography' },
  { id: 'tech',       icon: '<i data-lucide="code" style="width:24px;height:24px"></i>', label: 'Tech Skills',             desc: 'Web development, Social media, Data entry' },
  { id: 'language',   icon: '<i data-lucide="globe" style="width:24px;height:24px"></i>', label: 'Languages',               desc: 'English, French, Kinyarwanda, Swahili' },
  { id: 'business',   icon: '<i data-lucide="briefcase" style="width:24px;height:24px"></i>', label: 'Business Skills',         desc: 'Entrepreneurship, Public speaking, Finance' },
  { id: 'music',      icon: '<i data-lucide="music" style="width:24px;height:24px"></i>', label: 'Music & Arts',            desc: 'Guitar, Piano, Drawing, Painting' },
  { id: 'cv',         icon: '<i data-lucide="file-text" style="width:24px;height:24px"></i>', label: 'CV & Interview Skills',   desc: 'Resume writing, Interview prep, LinkedIn' },
  { id: 'global',     icon: '<i data-lucide="earth" style="width:24px;height:24px"></i>', label: 'Global Market Skills',    desc: 'Freelancing, Remote work, International business' },
]
const CATEGORY_SUBJECTS = {
  academic:  { label: 'Subjects You Teach *',        placeholder: 'e.g. Math, Physics, Chemistry',          hint: 'Academic subjects you are qualified to teach' },
  digital:   { label: 'Digital Skills You Teach *',  placeholder: 'e.g. MS Office, Google Workspace, Canva', hint: 'Software and digital tools you can teach' },
  creative:  { label: 'Creative Skills You Teach *', placeholder: 'e.g. Video Editing, Photoshop, CapCut',   hint: 'Creative tools and techniques you teach' },
  tech:      { label: 'Tech Skills You Teach *',     placeholder: 'e.g. HTML, CSS, Social Media Management', hint: 'Technical skills you can teach' },
  language:  { label: 'Languages You Teach *',       placeholder: 'e.g. English, French, Swahili, Chinese, Spanish, Arabic...', hint: 'List all languages you are fluent in and can teach' },
  business:  { label: 'Business Skills You Teach *', placeholder: 'e.g. Public Speaking, Entrepreneurship',  hint: 'Business and professional skills you teach' },
  music:     { label: 'Music / Arts You Teach *',    placeholder: 'e.g. Guitar, Piano, Drawing, Painting',   hint: 'Instruments or art forms you teach' },
  cv:        { label: 'CV & Career Skills *',        placeholder: 'e.g. Resume Writing, Interview Prep, LinkedIn', hint: 'Career development skills you teach' },
  global:    { label: 'Global Market Skills *',      placeholder: 'e.g. Freelancing, Remote Work, Upwork',   hint: 'International and freelance skills you teach' },
}
const CATEGORY_LEVELS = {
  academic:  { label: 'Levels You Teach *',        placeholder: 'Primary, Secondary, University',          hint: 'Academic levels you can teach' },
  digital:   { label: 'Experience Level *',         placeholder: 'Beginner, Intermediate, Advanced',        hint: 'Skill levels you can teach' },
  creative:  { label: 'Experience Level *',         placeholder: 'Beginner, Intermediate, Advanced',        hint: 'Skill levels you can teach' },
  tech:      { label: 'Experience Level *',         placeholder: 'Beginner, Intermediate, Advanced',        hint: 'Skill levels you can teach' },
  language:  { label: 'Proficiency Level *',        placeholder: 'Beginner, Intermediate, Advanced, Fluent', hint: 'Language proficiency levels you teach' },
  business:  { label: 'Experience Level *',         placeholder: 'Beginner, Intermediate, Advanced',        hint: 'Skill levels you can teach' },
  music:     { label: 'Experience Level *',         placeholder: 'Beginner, Intermediate, Advanced',        hint: 'Skill levels you can teach' },
  cv:        { label: 'Target Audience *',          placeholder: 'Fresh Graduate, Mid-level, Senior, Executive', hint: 'Who you can help' },
  global:    { label: 'Experience Level *',         placeholder: 'Beginner, Intermediate, Advanced, Expert', hint: 'Skill levels you can teach' },
}
var NEWS_CATEGORIES = [
  { id: 'news',        icon: '<i data-lucide="newspaper" style="width:24px;height:24px"></i>', label: 'Education News',      color: '#3b82f6' },
  { id: 'scholarship', icon: '<i data-lucide="graduation-cap" style="width:24px;height:24px"></i>', label: 'Scholarships',         color: '#8b5cf6' },
  { id: 'government',  icon: '<i data-lucide="landmark" style="width:24px;height:24px"></i>', label: 'Government Updates',   color: '#059669' },
  { id: 'career',      icon: '<i data-lucide="briefcase" style="width:24px;height:24px"></i>', label: 'Career Opportunities', color: '#f59e0b' },
  { id: 'abroad',      icon: '<i data-lucide="globe-2" style="width:24px;height:24px"></i>', label: 'Study Abroad',         color: '#ef4444' },
  { id: 'resources',   icon: '<i data-lucide="library" style="width:24px;height:24px"></i>', label: 'Learning Resources',   color: '#06b6d4' },
]
const RWANDA_DISTRICTS = [
  'Bugesera','Burera','Gakenke','Gasabo','Gatsibo','Gicumbi','Gisagara',
  'Huye','Kamonyi','Karongi','Kayonza','Kicukiro','Kirehe','Muhanga',
  'Musanze','Ngoma','Ngororero','Nyabihu','Nyagatare','Nyamagabe',
  'Nyamasheke','Nyanza','Nyarugenge','Nyaruguru','Rubavu','Ruhango',
  'Rulindo','Rusizi','Rutsiro','Rwamagana'
]




    // ════════════════════════════════════════════════════════════
    // COMPONENT LOADER — loads JS only when the route needs it
    // ════════════════════════════════════════════════════════════
    const _loadedComponents = {};
    function loadComponent(name) {
      if (_loadedComponents[name]) return _loadedComponents[name];
      _loadedComponents[name] = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = '/components/' + name + '.js';
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
      return _loadedComponents[name];
    }

    // ════════════════════════════════════════════════════════════
    // COMPONENT LOADER — loads JS only when the route needs it
    // ════════════════════════════════════════════════════════════
    function loadComponent(name) {
      if (_loadedComponents[name]) return _loadedComponents[name];
      _loadedComponents[name] = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = '/components/' + name + '.js';
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
      return _loadedComponents[name];
    }

    // ════════════════════════════════════════════════════════════
    // STATE
    // ════════════════════════════════════════════════════════════
    // ── Safe data registry — replaces JSON in onclick attributes (CWE-94 fix) ──
const _dataRegistry = {};
let _dataRegistryId = 0;
function _reg(data) {
  const id = 'dr_' + (++_dataRegistryId);
  _dataRegistry[id] = data;
  return id;
}
function _get(id) { return _dataRegistry[id]; }
    const _apiCache = {};
    const _inflight = {}; // deduplicate simultaneous identical requests
    async function cachedFetch(url, ttlMs = 60000) {
      const now = Date.now();
      if (_apiCache[url] && now - _apiCache[url].ts < ttlMs) return _apiCache[url].data;
      // If same URL is already in-flight, wait for it instead of firing again
      if (_inflight[url]) return _inflight[url];
      _inflight[url] = fetch(url).then(r => r.json()).then(data => {
        _apiCache[url] = { data, ts: Date.now() };
        delete _inflight[url];
        return data;
      }).catch(e => { delete _inflight[url]; throw e; });
      return _inflight[url];
    }
    function bustCache(prefix) {
      Object.keys(_apiCache).forEach(k => { if(k.includes(prefix)) delete _apiCache[k]; });
    }

    // Keep Render backend warm — only runs when a user is logged in (saves data for guests)
    setTimeout(function pingBackend() {
      if (State.user) fetch(API_URL + '/health').catch(()=>{});
      setTimeout(pingBackend, 600000);
    }, 30000);

    var State = {
      user: JSON.parse(localStorage.getItem('tc_user') || 'null'),
      page: 'landing',
      prevPage: null,
      prevTab: null,
      tab: null,
      data: {},
      modal: null,
    }
    function getToken() { return localStorage.getItem('tc_access') }
    function setAuth(data) {
      localStorage.setItem('tc_access', data.access_token)
      localStorage.setItem('tc_refresh', data.refresh_token)
      localStorage.setItem('tc_user', JSON.stringify(data.user))
      State.user = data.user
      setTimeout(startRealtimeSync, 500)
    }
    function clearAuth() {
      stopRealtimeSync()
      localStorage.removeItem('tc_access')
      localStorage.removeItem('tc_refresh')
      localStorage.removeItem('tc_user')
      localStorage.removeItem('tc_page')
      localStorage.removeItem('tc_tab')
      localStorage.removeItem('tc_lab_token')
      State.user = null
    }
    function closeAuth() {
      if (State.prevPage && State.prevPage !== 'login' && State.prevPage !== 'register') {
        navigate(State.prevPage, State.prevTab);
      } else {
        navigate('landing');
      }
    }

    // ════════════════════════════════════════════════════════════
    // API CLIENT
    // ════════════════════════════════════════════════════════════
 
    async function api(path, opts = {}) {
      const token = getToken()
      const h = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
      const r = await fetch(API_URL + path, { ...opts, headers: { ...h, ...(opts.headers || {}) } })
      if (!r.ok) {
        const e = await r.json().catch(() => ({ detail: r.statusText }))
        const msg = typeof e.detail === 'string' ? e.detail : (e.message || JSON.stringify(e.detail) || 'Request failed')
    if((r.status===401 || r.status===403) && State.user){
      // Try to refresh token once, then retry the request
      const refreshed = await refreshAccessToken();
      if(refreshed){
        const newToken = getToken();
        const newH = { 'Content-Type': 'application/json', Authorization: `Bearer ${newToken}` };
        const retry = await fetch(API_URL + path, { ...opts, headers: { ...newH, ...(opts.headers || {}) } });
        if(retry.ok){
          if(retry.status === 204) return null;
          return retry.json();
        }
      }
      localStorage.removeItem('tc_access');
      localStorage.removeItem('tc_refresh');
      State.user = null;
      toast('Session expired. Please log in again.', 'err');
      if(State.page !== 'login'){
        setTimeout(() => { navigate('login'); }, 1500);
      }
      throw new Error(msg);
    }
        throw new Error(msg)
      }
      if (r.status === 204) return null
      return r.json()
    }
    // ── Cache buster — call after any mutation so stale data never persists ──
    function bustCacheAfterMutation(pathPrefix) {
      bustCache(pathPrefix)
    }
    // ════════════════════════════════════════════════════════════
    // TOAST
    // ════════════════════════════════════════════════════════════
    function toast(msg, type = 'ok') {
      // Using raw SVGs for toasts so they render instantly without relying on the DOM scanner
      const icons = { 
        ok: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"></path></svg>', 
        err: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"></path></svg>', 
        info: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4M12 8h.01"></path></svg>' 
      }
      const el = document.createElement('div')
      el.className = `toast toast-${type}`
      el.innerHTML = `<span style="display:flex;align-items:center">${icons[type] || icons.ok}</span><span>${msg}</span>`
      document.getElementById('toasts').appendChild(el)
      setTimeout(() => el.remove(), 3800)
    }

    // ════════════════════════════════════════════════════════════
    // RENDER ENGINE
    // ════════════════════════════════════════════════════════════
    function render(html) { 
  // Hide SEO shell once JS takes over (set display:none — not cloaking since same content)
  const shell = document.getElementById('seo-shell');
  if (shell) { shell.style.display = 'none'; shell.style.position = 'static'; }
  // 1. Clean up Majestic Lab memory
  if (window.wbInstance) {
    try { window.wbInstance.dispose(); } catch(e){}
    window.wbInstance = null;
  }
  // 2. Stop background pinging for guest tokens
  if (window._labPingInterval) {
    clearInterval(window._labPingInterval);
    window._labPingInterval = null;
  }
  // 3. Turn off camera and mic if they left a video call
  if (window._rtcStarted && typeof window.stopLabVideo === 'function') {
    window.stopLabVideo();
  }
  // 4. Safely render the new page
  document.getElementById('app').innerHTML = html; 
  window.scrollTo(0, 0); // Scroll to top of the new page automatically
  
  // 5. Initialize Lucide icons for the newly injected HTML
  if (window.lucide) {
    window.lucide.createIcons();
  }
}
    function toggleMenu() {
  const menu = document.getElementById("navMenu")
  const btn = document.getElementById("hamburgerBtn")
  const isOpen = menu.classList.contains("show")
  if (isOpen) {
    menu.classList.remove("show")
    btn.classList.remove("open")
  } else {
    menu.classList.add("show")
    btn.classList.add("open")
    setTimeout(() => document.addEventListener("click", closeMenuOnOutside), 0)
  }
}
function closeMenu() {
  const menu = document.getElementById("navMenu")
  const btn = document.getElementById("hamburgerBtn")
  if (menu) menu.classList.remove("show")
  if (btn) btn.classList.remove("open")
  document.removeEventListener("click", closeMenuOnOutside)
}
function closeMenuOnOutside(e) {
  const menu = document.getElementById("navMenu");
  const btn = document.getElementById("hamburgerBtn");
  if (menu && menu.classList.contains("show") && !menu.contains(e.target) && !btn.contains(e.target)) {
    closeMenu();
  }
}
function scrollToContact() {
  closeMenu()
  const el = document.querySelector(".contact-grid")
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
}
 async function renderPage() {
      const p = State.page
      if (p === 'landing') { await loadComponent('landing'); return renderLanding() }
      if (p === 'login')   { await loadComponent('auth');    return renderLogin() }
      if (p === 'register'){ await loadComponent('auth');    return renderRegister() }
      if (p === 'forgot-password') { await loadComponent('auth'); return renderForgotPassword() }
      if (p === 'privacy') { await loadComponent('landing'); return renderPrivacyPolicy() }
      if (p === 'about')   { await loadComponent('landing'); return renderAboutUs() }
      if (p === 'terms')   { await loadComponent('landing'); return renderTerms() }
      if (p.startsWith('verify/')) { await loadComponent('landing'); return renderVerifyEmail(p.replace('verify/','')) }
      if (p.startsWith('reset/'))  { await loadComponent('auth');    return renderResetPassword(p.replace('reset/','')) }
      if (p.startsWith('report/')) { return renderParentReport(p.replace('report/','')) }
      if (p.startsWith('news-article/')) { await loadComponent('news'); return openNewsPost(p.replace('news-article/','')) }
      if (p === 'news' || p.startsWith('news')) { await loadComponent('news'); return renderPublicNews(State.tab) }
      if (p === 'public-lab') { await loadComponent('whiteboard'); return renderPublicLab(State.data.labToken) }
      if (p.startsWith('shop-product-')) { await loadComponent('shop'); return renderShopProduct(p.replace('shop-product-','')) }
      if (p === 'shop' || p.startsWith('shop')) { await loadComponent('shop'); return renderShop() }
      if (p === 'courses') { await loadComponent('courses'); return renderCoursesShop() }
      if (p.startsWith('course-lessons-')) { await loadComponent('courses'); return renderCourseLessons(p.replace('course-lessons-','')) }
      if (p.startsWith('course-')) { await loadComponent('courses'); return renderCourseDetail(p.replace('course-','')) }
      if (p === 'my-courses') { await loadComponent('courses'); return renderMyCourses() }
      if (p === 'admin-courses') { await loadComponent('courses'); return renderAdminCourses() }
      if (!State.user) return navigate('login')
      // Authenticated routes
      await loadComponent('dashboards');
      const role = State.user.role
      if (p === 'dashboard') {
        if (role === 'admin') return await renderAdminDash()
        if (role === 'tutor') return await renderTutorDash()
        return await renderStudentDash()
      }
      if (p === 'forum')         return renderForum()
      if (p === 'sessions')      return renderSessions()
      if (p === 'messages')      return renderMessages()
      if (p === 'profile')       return renderProfile()
      if (p === 'notifications') return renderNotifications()
      if (p === 'tutors')        return renderTutorSearch()
      if (p === 'quiz')          return renderQuiz()
      if (p === 'admin-tutors')  return renderAdminTutors()
      if (p === 'admin-students')return renderAdminStudents()
      if (p === 'admin-sessions')return renderAdminSessions()
      if (p === 'admin-payments')return renderAdminPayments()
      if (p === 'admin-exam')    return renderAdminExam()
      if (p === 'exam')          return renderExam()
      if (p === 'cart')          { await loadComponent('shop'); return renderCart() }
      if (p === 'wishlist')      { await loadComponent('shop'); return renderWishlist() }
      if (p === 'my-orders')     { await loadComponent('shop'); return renderMyOrders() }
      if (p === 'admin-shop')    { await loadComponent('shop'); return renderAdminShop() }
      await loadComponent('landing'); renderLanding()
      setTimeout(loadUnreadCount, 200)
    }
   function navigate(page, tab = null, event = null) {
  // Define auth pages once at the top to avoid redeclaration errors
  const authPages = ['login', 'register', 'forgot-password', 'reset-password'];

  // Remember origin if not going to an auth page
  const privateAppPages = ['dashboard','sessions','messages','profile','notifications','tutors','forum','exam','quiz','cart','wishlist','my-orders','admin-tutors','admin-students','admin-sessions','admin-payments','admin-exam','admin-shop','my-courses','admin-courses'];
  if (!authPages.includes(page) && !privateAppPages.includes(page) && !page.startsWith('verify/') && !page.startsWith('reset/')) {
    State.lastPublicPage = page;
    State.lastPublicTab = tab;
  }

  if (event) {
    // If it's a normal click (not ctrl+click or middle-click)
    if (!event.ctrlKey && !event.shiftKey && !event.metaKey && event.button !== 1) {
      event.preventDefault();
    } else {
      return; // Allow browser to handle new tab opening
    }
  }

  // Memory: Save current page before switching, unless it's an auth page
  if (!authPages.includes(State.page)) {
    State.prevPage = State.page;
    State.prevTab = State.tab;
  }
  
  State.page = page
  State.tab = tab
  State.data = {}
  
  // IMMEDIATE SEO UPDATE (Before API calls)
  // Comprehensive Page Titles for SEO and User Navigation
      const titles = {
        landing:         'Mathrone Academy — Best Private Tutors in Rwanda',
        news:            'Education News & Scholarships Rwanda | Mathrone Academy',
        shop:            'Learning Store — Buy School Materials in Kigali',
        about:           'About Us — Mathrone Academy',
        privacy:         'Privacy Policy — Mathrone Academy',
        terms:           'Terms & Conditions — Mathrone Academy',
        login:           'Sign In — Mathrone Academy',
        register:        'Join Mathrone Academy — Register Today',
        quiz:            'AI Quiz — Mathrone Academy',
        dashboard:       'Dashboard — Mathrone Academy',
        forum:           'Community Forum — Mathrone Academy',
        sessions:        'My Sessions — Mathrone Academy',
        messages:        'Messages — Mathrone Academy',
        profile:         'My Profile — Mathrone Academy',
        notifications:   'Notifications — Mathrone Academy',
        tutors:          'Find a Math, Science or Language Tutor | Mathrone',
        'admin-tutors':  'Manage Tutors — Mathrone Academy',
        'admin-students':'Manage Students — Mathrone Academy',
        'admin-sessions':'Manage Sessions — Mathrone Academy',
        'admin-payments':'Payments — Mathrone Academy',
        'admin-exam':    'Exam Manager — Mathrone Academy',
        'admin-shop':    'Shop Manager — Mathrone Academy',
        exam:            'Written Exam — Mathrone Academy',
        cart:            'My Shopping Cart — Mathrone Store',
        wishlist:        'My Wishlist — Mathrone Academy',
        'my-orders':     'My Orders — Mathrone Academy',
        'courses':       'Online Courses — Mathrone Academy',
        'my-courses':    'My Courses — Mathrone Academy',
         'admin-courses': 'Courses Manager — Mathrone Academy',
      }

      // Dynamic Meta Descriptions to help Google ranking
      const descriptions = {
        landing: 'Mathrone Academy connects ambitious students with hand-picked, vetted tutors for personalised 1-on-1 learning — online or at home in Rwanda.',
        news: 'Stay updated with the latest education news, scholarships, government updates and career opportunities in Rwanda.',
        shop: 'Buy quality learning materials — notebooks, geometry sets, science kits and more. Delivered to your door in Rwanda.',
        about: 'Learn about Mathrone Academy — our mission, team and story of connecting students with the best tutors in Rwanda.',
        register: 'Join Mathrone Academy today. Find a tutor or apply to become one.',
        tutors: 'Search our directory of qualified tutors in Kigali for REB, IGCSE and University levels.',
      }

      // Update the browser title
      document.title = titles[page] || 'Mathrone Academy';

      // Update Meta Description for SEO
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && descriptions[page]) {
        metaDesc.setAttribute('content', descriptions[page]);
      }
      
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc && descriptions[page]) {
        ogDesc.setAttribute('content', descriptions[page]);
      }

      // Reset noindex (in case user navigated from a 404)
      document.getElementById('meta-robots-noindex')?.remove()
      const privatePages = ['dashboard','messages','profile','sessions','notifications','cart','wishlist','my-orders','forum','exam','quiz','admin-tutors','admin-students','admin-sessions','admin-payments','admin-exam','admin-shop','login','register','my-courses','admin-courses']
      if (privatePages.includes(page) || page.startsWith('verify/') || page.startsWith('reset/') || page.startsWith('admin')) {
        const ni = document.createElement('meta')
        ni.id = 'meta-robots-noindex'
        ni.name = 'robots'
        ni.content = 'noindex, nofollow'
        document.head.appendChild(ni)
        document.querySelector('meta[name="robots"]')?.setAttribute('content', 'noindex, nofollow')
      } else {
        document.querySelector('meta[name="robots"]')?.setAttribute('content', 'index, follow')
      }

      // Update og:title to match page title
      const ogTitle = document.querySelector('meta[property="og:title"]')
      if (ogTitle) ogTitle.setAttribute('content', titles[page] || 'Mathrone Academy')
      const twTitle = document.querySelector('meta[name="twitter:title"]')
      if (twTitle) twTitle.setAttribute('content', titles[page] || 'Mathrone Academy')

      // Remove page-specific schemas when navigating away
      ;['article-schema','product-schema','breadcrumb-schema'].forEach(id => {
        document.getElementById(id)?.remove()
      })

      // Inject BreadcrumbList schema for indexable listing pages
      const breadcrumbMap = {
        news:    [{ name:'Home', url:'/' }, { name:'Education News', url:'/news' }],
        shop:    [{ name:'Home', url:'/' }, { name:'Learning Store', url:'/shop' }],
        tutors:  [{ name:'Home', url:'/' }, { name:'Find a Tutor', url:'/tutors' }],
        about:   [{ name:'Home', url:'/' }, { name:'About Us', url:'/about' }],
        privacy: [{ name:'Home', url:'/' }, { name:'Privacy Policy', url:'/privacy' }],
        terms:   [{ name:'Home', url:'/' }, { name:'Terms & Conditions', url:'/terms' }],
      }
      if (breadcrumbMap[page]) {
        const BASE = 'https://mathroneacademy.pages.dev'
        const bcSchema = document.createElement('script')
        bcSchema.id = 'breadcrumb-schema'
        bcSchema.type = 'application/ld+json'
        bcSchema.textContent = JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          'itemListElement': breadcrumbMap[page].map((item, i) => ({
            '@type': 'ListItem',
            'position': i + 1,
            'name': item.name,
            'item': BASE + item.url
          }))
        })
        document.head.appendChild(bcSchema)
      }

      // Keep canonical and og:url in sync with the real URL
      const urlMap2 = {
        landing: 'https://mathroneacademy.pages.dev/',
        news: 'https://mathroneacademy.pages.dev/news',
        shop: 'https://mathroneacademy.pages.dev/shop',
        about: 'https://mathroneacademy.pages.dev/about',
        privacy: 'https://mathroneacademy.pages.dev/privacy',
        terms: 'https://mathroneacademy.pages.dev/terms',
      }
      const canonicalHref = urlMap2[page] || null
      if (canonicalHref) {
        document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonicalHref)
        document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonicalHref)
      }

      localStorage.setItem('tc_page', page)
      localStorage.setItem('tc_tab', tab || '')
      // Clear any saved lab session when navigating away from it
      if (page !== 'public-lab') localStorage.removeItem('tc_lab_token');

      // Push a real URL into the address bar (SEO + shareable links)
      const urlMap = {
        landing: '/', 
        news: '/news', 
        shop: '/shop', 
        about: '/about',
        privacy: '/privacy', 
        terms: '/terms', 
        login: '/login',
        register: '/register', 
        dashboard: '/dashboard', 
        forum: '/forum',
        sessions: '/sessions', 
        messages: '/messages', 
        profile: '/profile',
        notifications: '/notifications', 
        tutors: '/tutors',
        quiz: '/quiz',
        cart: '/cart', 
        wishlist: '/wishlist', 
        'my-orders': '/my-orders',
        'admin-tutors': '/admin-tutors',
        'admin-students': '/admin-students',
        'admin-sessions': '/admin-sessions',
        'admin-payments': '/admin-payments',
        'admin-exam': '/admin-exam',
        'admin-shop': '/admin-shop',
        'courses':        '/courses',
        'my-courses':     '/my-courses',
        'admin-courses':  '/admin-courses',
      };

      let newUrl = urlMap[page];
      
      // Handle dynamic routes for News and Shop
      if (!newUrl) {
        if (page.startsWith('news-article/')) {
          newUrl = '/news/' + page.replace('news-article/', '');
        } else if (page.startsWith('shop-product-')) {
          newUrl = '/shop/' + page.replace('shop-product-', '');
        } else if (page.startsWith('verify/')) {
          newUrl = '/verify/' + page.replace('verify/', '');
        } else if (page.startsWith('reset/')) {
          newUrl = '/reset/' + page.replace('reset/', '');
        } else if (page.startsWith('report/')) {
          newUrl = '/report/' + page.replace('report/', '');
        } else {
          newUrl = '/';
        }
      }

      if (window.location.pathname !== newUrl) {
        history.pushState({ page, tab }, document.title, newUrl);
      }

      renderPage()
      setTimeout(loadUnreadCount, 200)
    }
function openStandaloneVideoCall(sessionId) {
  const roomName = `MathroneMajesticV5_${sessionId.replace(/[^a-zA-Z0-9]/g, '')}`;
  const isTutor = State.user && (State.user.role === 'tutor' || State.user.role === 'admin');
  const displayName = encodeURIComponent((isTutor ? '👨‍🏫 ' : '🎓 ') + (State.user?.full_name || 'User'));
  const url = `https://meet.jit.si/${roomName}`
    + `#config.prejoinPageEnabled=false`
    + `&config.startWithAudioMuted=true`
    + `&config.disableDeepLinking=true`
    + `&config.enableWelcomePage=false`
    + `&config.resolution=360`
    + `&userInfo.displayName=${displayName}`;
  window.open(url, '_blank');
}   
function closeAuth() {
      if (State.lastPublicPage) {
        navigate(State.lastPublicPage, State.lastPublicTab);
      } else {
        navigate('landing');
      }
    }

// Global stub — works before whiteboard.js loads
function renderWhiteboard(sessionId) {
  loadComponent('whiteboard').then(() => {
    if (typeof window._doRenderWhiteboard === 'function') {
      window._doRenderWhiteboard(sessionId);
    } else {
      // Fallback: whiteboard.js may have defined it differently — retry once
      setTimeout(() => {
        if (typeof window._doRenderWhiteboard === 'function') {
          window._doRenderWhiteboard(sessionId);
        }
      }, 200);
    }
  });
}
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function(e) {
      // Clear memory/video before rendering the previous page
      if (window.wbInstance) { try { window.wbInstance.dispose(); } catch(err){} window.wbInstance = null; }
      if (window._rtcStarted && typeof window.stopLabVideo === 'function') window.stopLabVideo();
      
      if (e.state && e.state.page) {
        State.page = e.state.page
        State.tab  = e.state.tab || null
        State.data = {}
        renderPage()
      } else {
        bootFromUrl()
        renderPage()
      }
    })
    async function renderParentReport(token){
  render(`<div class="loader-center"><div class="spinner"></div></div>`)
  try{
    const data = await fetch(API_URL + '/progress/report/' + token).then(r=>r.json())
    if(data.detail) throw new Error(data.detail)
    const student  = data.student
    const progress = data.progress || []
    const sessions = data.sessions || []
    const invoices = data.invoices || []

    const completed = sessions.filter(s=>s.status==='completed').length
    const avgMarks  = progress.filter(p=>p.marks).length
      ? Math.round(progress.filter(p=>p.marks).reduce((a,b)=>a+b.marks,0) / progress.filter(p=>p.marks).length)
      : null

    render(`
    <div style="min-height:100vh;background:linear-gradient(135deg,#1e3a5f 0%,#2563eb 100%);padding:20px">
      <div style="max-width:800px;margin:0 auto">

        <!-- Header -->
        <div style="text-align:center;padding:40px 0 30px;color:#fff">
          <div style="display:flex;justify-content:center;margin-bottom:12px"><i data-lucide="graduation-cap" style="width:48px;height:48px;color:var(--gold)"></i></div>
          <h1 style="font-size:28px;font-weight:800;margin-bottom:6px">Mathrone Academy</h1>
          <p style="font-size:16px;opacity:0.8">Student Progress Report</p>
        </div>

        <!-- Student Info -->
        <div style="background:#fff;border-radius:16px;padding:24px;margin-bottom:20px">
          <div style="display:flex;align-items:center;gap:16px">
            ${avi(student.profiles?.full_name||'S', 60)}
            <div>
              <div style="font-size:22px;font-weight:800;color:var(--navy)">${student.profiles?.full_name||'—'}</div>
              <div style="font-size:14px;color:var(--g400);margin-top:4px">${student.profiles?.email||''}</div>
              <div style="display:flex;gap:8px;margin-top:8px">
                <span class="badge badge-blue">${student.school_level||'—'}</span>
                <span class="badge badge-gray">${(student.subjects_needed||[]).join(', ')||'—'}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px;margin-bottom:20px">
          <div style="background:#fff;border-radius:16px;padding:20px;text-align:center">
            <div style="font-size:32px;font-weight:800;color:var(--blue)">${sessions.length}</div>
            <div style="font-size:13px;color:var(--g400);margin-top:4px">Total Sessions</div>
          </div>
          <div style="background:#fff;border-radius:16px;padding:20px;text-align:center">
            <div style="font-size:32px;font-weight:800;color:var(--green)">${completed}</div>
            <div style="font-size:13px;color:var(--g400);margin-top:4px">Completed</div>
          </div>
          <div style="background:#fff;border-radius:16px;padding:20px;text-align:center">
            <div style="font-size:32px;font-weight:800;color:var(--navy)">${avgMarks !== null ? avgMarks+'%' : '—'}</div>
            <div style="font-size:13px;color:var(--g400);margin-top:4px">Average Score</div>
          </div>
          <div style="background:#fff;border-radius:16px;padding:20px;text-align:center">
            <div style="font-size:32px;font-weight:800;color:var(--orange)">${progress.length}</div>
            <div style="font-size:13px;color:var(--g400);margin-top:4px">Feedback Reports</div>
          </div>
        </div>

        <!-- Progress Chart -->
        ${progress.filter(p=>p.marks).length >= 2 ? `
        <div style="background:#fff;border-radius:16px;padding:24px;margin-bottom:20px">
          <h3 style="font-size:16px;font-weight:700;color:var(--navy);margin-bottom:16px;display:flex;align-items:center;gap:6px"><i data-lucide="trending-up" style="width:18px;height:18px;color:var(--blue)"></i> Marks Over Time</h3>
          <canvas id="progress-chart" height="120"></canvas>
        </div>` : ''}

        <!-- Feedback Records -->
        ${progress.length ? `
        <div style="background:#fff;border-radius:16px;padding:24px;margin-bottom:20px">
          <h3 style="font-size:16px;font-weight:700;color:var(--navy);margin-bottom:16px;display:flex;align-items:center;gap:6px"><i data-lucide="file-text" style="width:18px;height:18px;color:var(--blue)"></i> Session Feedback</h3>
          <div style="display:flex;flex-direction:column;gap:16px">
            ${progress.map(p=>`
            <div style="border:1px solid var(--g100);border-radius:12px;padding:16px">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
                <span style="font-weight:700;color:var(--navy)">${p.subject}</span>
                <div style="display:flex;gap:8px;align-items:center">
                  ${p.marks !== null ? `<span style="background:${p.marks>=75?'#dcfce7':p.marks>=50?'#fef9c3':'#fee2e2'};color:${p.marks>=75?'#166534':p.marks>=50?'#854d0e':'#991b1b'};border-radius:999px;padding:2px 10px;font-weight:700;font-size:13px">${p.marks}%</span>` : ''}
                  <span style="font-size:12px;color:var(--g400)">${fmtShort(p.recorded_at)}</span>
                </div>
              </div>
              ${p.feedback?`<p style="font-size:13px;color:var(--g600);margin-bottom:8px">${p.feedback}</p>`:''}
              ${p.strengths?`<div style="background:#f0fdf4;border-radius:8px;padding:8px;margin-bottom:6px;font-size:12px"><strong><i data-lucide="thumbs-up" style="width:12px;height:12px;vertical-align:middle"></i> Strengths:</strong> ${p.strengths}</div>`:''}
              ${p.improvements?`<div style="background:#fff7ed;border-radius:8px;padding:8px;font-size:12px"><strong><i data-lucide="trending-up" style="width:12px;height:12px;vertical-align:middle"></i> To Improve:</strong> ${p.improvements}</div>`:''}
            </div>`).join('')}
          </div>
        </div>` : `
        <div style="background:#fff;border-radius:16px;padding:24px;margin-bottom:20px;text-align:center;color:var(--g400)">
          <div style="display:flex;justify-content:center;margin-bottom:8px"><i data-lucide="file-text" style="width:32px;height:32px"></i></div>
          <div>No feedback submitted yet</div>
        </div>`}

        <!-- Sessions -->
        <div style="background:#fff;border-radius:16px;padding:24px;margin-bottom:20px">
          <h3 style="font-size:16px;font-weight:700;color:var(--navy);margin-bottom:16px;display:flex;align-items:center;gap:6px"><i data-lucide="calendar" style="width:18px;height:18px;color:var(--blue)"></i> Sessions</h3>
          ${sessions.length ? `
          <div style="overflow-x:auto">
            <table style="width:100%;border-collapse:collapse;font-size:13px">
              <thead><tr style="border-bottom:2px solid var(--g100)">
                <th style="text-align:left;padding:8px;color:var(--g400)">Subject</th>
                <th style="text-align:left;padding:8px;color:var(--g400)">Tutor</th>
                <th style="text-align:left;padding:8px;color:var(--g400)">Date</th>
                <th style="text-align:left;padding:8px;color:var(--g400)">Duration</th>
                <th style="text-align:left;padding:8px;color:var(--g400)">Status</th>
              </tr></thead>
              <tbody>
                ${sessions.map(s=>`
                <tr style="border-bottom:1px solid var(--g100)">
                  <td style="padding:8px;font-weight:600">${s.subject}</td>
                  <td style="padding:8px">${s.tutors?.profiles?.full_name||'—'}</td>
                  <td style="padding:8px">${fmtShort(s.scheduled_at)}</td>
                  <td style="padding:8px">${s.duration_mins} mins</td>
                  <td style="padding:8px">${statusBadge(s.status)}</td>
                </tr>`).join('')}
              </tbody>
            </table>
          </div>` : `<div style="text-align:center;color:var(--g400)">No sessions yet</div>`}
        </div>

        <!-- Progress Chart -->
        ${progress.filter(p=>p.marks).length >= 2 ? `
        <div style="background:#fff;border-radius:16px;padding:24px;margin-bottom:20px">
          <h3 style="font-size:16px;font-weight:700;color:var(--navy);margin-bottom:16px;display:flex;align-items:center;gap:6px"><i data-lucide="trending-up" style="width:18px;height:18px;color:var(--blue)"></i> Marks Over Time</h3>
          <canvas id="progress-chart" height="120"></canvas>
        </div>` : ''}

        <!-- Feedback Records -->
        ${progress.length ? `
        <div style="background:#fff;border-radius:16px;padding:24px;margin-bottom:20px">
          <h3 style="font-size:16px;font-weight:700;color:var(--navy);margin-bottom:16px;display:flex;align-items:center;gap:6px"><i data-lucide="file-text" style="width:18px;height:18px;color:var(--blue)"></i> Session Feedback</h3>
          <div style="display:flex;flex-direction:column;gap:16px">
            ${progress.map(p=>`
            <div style="border:1px solid var(--g100);border-radius:12px;padding:16px">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
                <span style="font-weight:700;color:var(--navy)">${p.subject}</span>
                <div style="display:flex;gap:8px;align-items:center">
                  ${p.marks !== null ? `<span style="background:${p.marks>=75?'#dcfce7':p.marks>=50?'#fef9c3':'#fee2e2'};color:${p.marks>=75?'#166534':p.marks>=50?'#854d0e':'#991b1b'};border-radius:999px;padding:2px 10px;font-weight:700;font-size:13px">${p.marks}%</span>` : ''}
                  <span style="font-size:12px;color:var(--g400)">${fmtShort(p.recorded_at)}</span>
                </div>
              </div>
              ${p.feedback?`<p style="font-size:13px;color:var(--g600);margin-bottom:8px">${p.feedback}</p>`:''}
              ${p.strengths?`<div style="background:#f0fdf4;border-radius:8px;padding:8px;margin-bottom:6px;font-size:12px"><strong><i data-lucide="thumbs-up" style="width:12px;height:12px;vertical-align:middle"></i> Strengths:</strong> ${p.strengths}</div>`:''}
              ${p.improvements?`<div style="background:#fff7ed;border-radius:8px;padding:8px;font-size:12px"><strong><i data-lucide="trending-up" style="width:12px;height:12px;vertical-align:middle"></i> To Improve:</strong> ${p.improvements}</div>`:''}
            </div>`).join('')}
          </div>
        </div>` : `
        <div style="background:#fff;border-radius:16px;padding:24px;margin-bottom:20px;text-align:center;color:var(--g400)">
          <div style="display:flex;justify-content:center;margin-bottom:8px"><i data-lucide="file-text" style="width:32px;height:32px"></i></div>
          <div>No feedback submitted yet</div>
        </div>`}

        <!-- Sessions -->
        <div style="background:#fff;border-radius:16px;padding:24px;margin-bottom:20px"><!-- Invoices -->
        ${invoices.length ? `
        <div style="background:#fff;border-radius:16px;padding:24px;margin-bottom:20px">
          <h3 style="font-size:16px;font-weight:700;color:var(--navy);margin-bottom:16px;display:flex;align-items:center;gap:6px"><i data-lucide="credit-card" style="width:18px;height:18px;color:var(--blue)"></i> Payments</h3>
          <h3 style="font-size:16px;font-weight:700;color:var(--navy);margin-bottom:16px;display:flex;align-items:center;gap:6px"><i data-lucide="calendar" style="width:18px;height:18px;color:var(--blue)"></i> Sessions</h3>
          <div style="overflow-x:auto">
            <table style="width:100%;border-collapse:collapse;font-size:13px">
              <thead><tr style="border-bottom:2px solid var(--g100)">
                <th style="text-align:left;padding:8px;color:var(--g400)">Amount</th>
                <th style="text-align:left;padding:8px;color:var(--g400)">Due Date</th>
                <th style="text-align:left;padding:8px;color:var(--g400)">Status</th>
              </tr></thead>
              <tbody>
                ${invoices.map(inv=>`
                <tr style="border-bottom:1px solid var(--g100)">
                  <td style="padding:8px;font-weight:600">$${inv.amount}</td>
                  <td style="padding:8px">${inv.due_date?fmtShort(inv.due_date):'—'}</td>
                  <td style="padding:8px">${statusBadge(inv.status)}</td>
                </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>` : ''}

        <!-- Footer -->
        <div style="text-align:center;padding:20px;color:rgba(255,255,255,0.6);font-size:12px">
          Generated by Mathrone Academy • ${new Date().toLocaleDateString()}
        </div>

      </div>
    </div>`)

    // Draw progress chart if enough data
    if(progress.filter(p=>p.marks).length >= 2){
      setTimeout(async ()=>{
        const ctx = document.getElementById('progress-chart')?.getContext('2d')
        if(!ctx) return
        await ensureChartJS();
        const marked = progress.filter(p=>p.marks)
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: marked.map(p=>fmtShort(p.recorded_at)),
            datasets:[{
              label: 'Marks (%)',
              data: marked.map(p=>p.marks),
              borderColor: '#2563eb',
              backgroundColor: 'rgba(37,99,235,0.1)',
              tension: 0.4,
              fill: true,
              pointBackgroundColor: '#2563eb',
              pointRadius: 5,
            }]
          },
          options:{
            responsive: true,
            scales:{ y:{ min:0, max:100, ticks:{ callback: v=>v+'%' } } },
            plugins:{ legend:{ display:false } }
          }
        })
      }, 200)
    }

  }catch(e){
    render(`
    <div style="min-height:100vh;background:linear-gradient(135deg,#1e3a5f,#2563eb);display:flex;align-items:center;justify-content:center">
      <div style="background:#fff;border-radius:16px;padding:40px;text-align:center;max-width:400px">
        <div style="font-size:48px;margin-bottom:16px">⚠️</div>
        <h2 style="color:var(--navy);margin-bottom:8px">Report Not Found</h2>
        <p style="color:var(--g400);font-size:14px">This link may have expired or is invalid.</p>
      </div>
    </div>`)
  }
}


async function renderForum(activeCategory = null){
  render(dashWrap('forum', `<div class="loader-center"><div class="spinner"></div></div>`))
  try{
    const url = activeCategory ? `/forum/posts?category=${activeCategory}` : '/forum/posts'
    const posts = await api(url)

    render(dashWrap('forum', `
    <div class="page-header">
      <div><h1 class="page-title" style="display:flex;align-items:center;gap:8px"><i data-lucide="messages-square" style="width:28px;height:28px;color:var(--blue)"></i> Community Forum</h1><p class="page-subtitle">Share ideas, ask questions, connect with others</p></div>
      <button class="btn btn-primary" onclick="openNewPostModal()"><i data-lucide="pen-square" style="width:16px;height:16px"></i> New Post</button>
    </div>

    <!-- Category filters -->
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:24px">
      <button class="btn ${!activeCategory?'btn-primary':'btn-ghost'} btn-sm" onclick="renderForum()">All</button>
      ${FORUM_CATEGORIES.map(c=>`
      <button class="btn ${activeCategory===c.id?'btn-primary':'btn-ghost'} btn-sm" onclick="renderForum('${c.id}')">
        ${c.icon} ${c.label}
      </button>`).join('')}
    </div>

    <!-- Posts -->
    <div style="display:flex;flex-direction:column;gap:16px">
      ${posts.length ? posts.map(p=>`
      <div class="card" style="padding:20px;cursor:pointer" onclick="openPost('${p.id}')">
        <div style="display:flex;align-items:flex-start;gap:12px">
          ${avi(p.profiles?.full_name||'?', 40, p.profiles?.avatar_url||null)}
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap">
              ${p.is_pinned ? `<span style="background:#fef9c3;color:#854d0e;font-size:11px;padding:2px 8px;border-radius:999px;font-weight:700">📌 Pinned</span>` : ''}
              <span style="background:var(--sky);color:var(--blue);font-size:11px;padding:2px 8px;border-radius:999px">${FORUM_CATEGORIES.find(c=>c.id===p.category)?.icon||'💬'} ${FORUM_CATEGORIES.find(c=>c.id===p.category)?.label||p.category}</span>
              <span style="font-size:11px;color:var(--g400)">${fmtShort(p.created_at)}</span>
            </div>
            <div style="font-size:16px;font-weight:700;color:var(--navy);margin-bottom:6px">${p.title}</div>
            <div style="font-size:13px;color:var(--g600);line-height:1.6">${p.content.slice(0,150)}${p.content.length>150?'...':''}</div>
            <div style="display:flex;align-items:center;gap:16px;margin-top:10px">
              <span style="font-size:12px;color:var(--g400)">by <strong>${p.profiles?.full_name||'Unknown'}</strong> • ${p.profiles?.role||''}</span>
          
              <button onclick="openPost('${p.id}')" style="background:none;border:none;cursor:pointer;font-size:12px;color:var(--g400);padding:0">💬 Comment</button>
              <button data-like="${p.id}" data-count="${p.likes||0}" onclick="event.stopPropagation();likePost('${p.id}')" style="background:none;border:none;cursor:pointer;font-size:12px;color:var(--g400);padding:0">❤️ ${p.likes||0}</button>
              ${State.user.role==='admin'?`<button class="btn btn-ghost btn-sm" style="color:var(--red)" onclick="event.stopPropagation();deletePost('${p.id}','${p.title.replace(/'/g,"\\'")}')" ><i data-lucide="trash-2" style="width:16px;height:16px"></i> Delete</button>`:''}
            </div>
          </div>
        </div>
      </div>`).join('') : `
      <div class="empty-state">
       <div class="empty-icon" style="color:var(--g400)"><i data-lucide="message-square" style="width:48px;height:48px;stroke-width:1.5"></i></div>
        <div class="empty-title">No posts yet</div>
        <div class="empty-sub">Be the first to start a discussion!</div>
      </div>`}
    </div>

    <div id="modal-root"></div>
    `))

    
  }catch(e){
    toast(e.message,'err')
  }
}

function openNewPostModal(){
  document.getElementById('modal-root').innerHTML = `
  <div class="modal-overlay" onclick="if(event.target===this)this.remove()">
    <div class="modal">
      <div class="modal-header">
        <span class="modal-title" style="display:flex;align-items:center;gap:8px"><i data-lucide="pen-square" style="width:20px;height:20px"></i> New Post</span>
        <button class="modal-close" onclick="document.querySelector('.modal-overlay').remove()">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Category</label>
          <select class="input" id="post-cat">
            ${FORUM_CATEGORIES.map(c=>`<option value="${c.id}">${c.icon} ${c.label}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Title</label>
          <input class="input" id="post-title" placeholder="What's on your mind?"/>
        </div>
        <div class="form-group">
          <label class="form-label">Content</label>
          <textarea class="input" id="post-content" rows="5" placeholder="Share your thoughts, ideas or questions..."></textarea>
        </div>
        <div style="font-size:12px;color:var(--g400);margin-top:4px">Your post will be visible to everyone immediately.</div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="document.querySelector('.modal-overlay').remove()">Cancel</button>
        <button class="btn btn-primary" onclick="submitPost()">Submit Post ✍️</button>
      </div>
    </div>
  </div>`
}

async function submitPost(){
  const title   = document.getElementById('post-title')?.value?.trim()
  const content = document.getElementById('post-content')?.value?.trim()
  const category= document.getElementById('post-cat')?.value
  if(!title){ toast('Please add a title','err'); return }
  if(!content){ toast('Please add content','err'); return }
  try{
    await api('/forum/posts', { method:'POST', body: JSON.stringify({ title, content, category }) })
    document.querySelector('.modal-overlay')?.remove()
    toast('Post submitted for review! ✅')
    bustCache('/forum')
  }catch(e){
    toast(e.message,'err')
  }
}

async function openPost(postId){
  try{
    const [posts, comments] = await Promise.all([
      api('/forum/posts'),
      api(`/forum/posts/${postId}/comments`)
    ])
    const post = posts.find(p=>p.id===postId)
    if(!post) return

    document.getElementById('modal-root').innerHTML = `
    <div class="modal-overlay" onclick="if(event.target===this)this.remove()">
      <div class="modal" style="max-width:680px">
        <div class="modal-header">
          <span class="modal-title">${post.title}</span>
          <button class="modal-close" onclick="document.querySelector('.modal-overlay').remove()">✕</button>
        </div>
        <div class="modal-body">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
            ${avi(post.profiles?.full_name||'?', 36, post.profiles?.avatar_url||null)}
            <div>
              <div style="font-size:13px;font-weight:700;color:var(--navy)">${post.profiles?.full_name||'?'}</div>
              <div style="font-size:11px;color:var(--g400)">${post.profiles?.role||''} • ${fmtShort(post.created_at)}</div>
            </div>
            <button class="btn btn-ghost btn-sm" style="margin-left:auto"aria-label="Like post"  onclick="likePost('${post.id}')">❤️ ${post.likes||0}</button>
            ${State.user.role==='admin'?`<button class="btn btn-ghost btn-sm" onclick="pinPost('${post.id}')">📌 ${post.is_pinned?'Unpin':'Pin'}</button>`:''}
          </div>
          <p style="font-size:14px;color:var(--g600);line-height:1.8;margin-bottom:20px">${post.content}</p>
          <div style="border-top:1px solid var(--g100);padding-top:16px">
            <div style="font-size:14px;font-weight:700;color:var(--navy);margin-bottom:12px">💬 Comments (${comments.length})</div>
            <div style="display:flex;flex-direction:column;gap:10px;max-height:280px;overflow-y:auto;margin-bottom:16px">
              ${comments.length ? comments.map(c=>`
              <div style="display:flex;gap:10px;align-items:flex-start">
                ${avi(c.profiles?.full_name||'?', 32, c.profiles?.avatar_url||null)}
                <div style="flex:1;background:var(--sky);border-radius:10px;padding:10px">
                  <div style="font-size:12px;font-weight:700;color:var(--navy)">${c.profiles?.full_name||'?'} <span style="font-weight:400;color:var(--g400)">• ${fmtShort(c.created_at)}</span></div>
                  <div style="font-size:13px;color:var(--g600);margin-top:4px">${c.content}</div>
                </div>
              </div>`).join('') : `<div style="color:var(--g400);font-size:13px">No comments yet — be the first!</div>`}
            </div>
            <div style="display:flex;gap:8px">
              <input class="input" id="comment-input" placeholder="Write a comment..." style="flex:1" onkeydown="if(event.key==='Enter')addComment('${post.id}')"/>
              <button class="btn btn-primary btn-sm" onclick="addComment('${post.id}')">Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>`
  }catch(e){
    toast(e.message,'err')
  }
}

async function addComment(postId){
  const content = document.getElementById('comment-input')?.value?.trim()
  if(!content){ toast('Please write a comment','err'); return }
  try{
    await api(`/forum/posts/${postId}/comments`, { method:'POST', body: JSON.stringify({ content }) })
    toast('Comment added! ✅')
    bustCache('/forum')
    openPost(postId)
  }catch(e){
    toast(e.message,'err')
  }
}

async function likePost(postId){
  try{
    const res = await api(`/forum/posts/${postId}/like`, { method:'POST' })
    const btn = document.querySelector(`button[data-like="${postId}"]`)
    if(btn){
      const current = parseInt(btn.getAttribute('data-count')||'0')
      const newCount = res.liked ? current + 1 : current - 1
      btn.setAttribute('data-count', newCount)
      btn.textContent = `❤️ ${newCount}`
      btn.style.color = res.liked ? 'var(--red)' : 'var(--g400)'
    }
  }catch(e){
    toast(e.message,'err')
  }
}

async function deletePost(postId, title){
  if(!confirm('Delete post "' + title + '"? This cannot be undone.')) return
  try{
    await api(`/forum/admin/posts/${postId}`, { method:'DELETE' })
    toast('Post deleted! ✅')
    bustCache('/forum')
    renderForum()
  }catch(e){
    toast(e.message,'err')
  }
}
async function pinPost(postId){
  try{
    await api(`/forum/admin/posts/${postId}/pin`, { method:'PATCH' })
    toast('Post pin status updated! ✅')
    bustCache('/forum')
    document.querySelector('.modal-overlay')?.remove()
    renderForum()
  }catch(e){
    toast(e.message,'err')
  }
}


 
    // ════════════════════════════════════════════════════════════
    // HELPERS
    // ════════════════════════════════════════════════════════════
    /** --- SEO & META HELPER --- **/
function updatePageSEO(params) {
  const { title, description, url, noindex, schema } = params;
  document.title = `${title} | Mathrone Academy Rwanda`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', description);
  
  // Update Robots for search engines
  let robots = document.getElementById('meta-robots-logic') || document.createElement('meta');
  robots.id = 'meta-robots-logic';
  robots.name = 'robots';
  robots.content = noindex ? 'noindex, nofollow' : 'index, follow';
  if (!document.getElementById('meta-robots-logic')) document.head.appendChild(robots);

  // Schema Injection
  const oldSchema = document.getElementById('dynamic-schema');
  if (oldSchema) oldSchema.remove();
  if (schema) {
    const script = document.createElement('script');
    script.id = 'dynamic-schema';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }
}
    function avi(name = '?', size = 40, url = null) {
  if(url){
    return `<img src="${url}" alt="Profile of ${name} - Mathrone Academy" title="${name}" loading="lazy" decoding="async" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;flex-shrink:0" onerror="this.style.display='none'"/>`
  }
  const c = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return `<div class="avi" style="width:${size}px;height:${size}px;font-size:${size * 0.35}px">${c}</div>`
}

function statusBadge(s) {
  const m = { approved: 'green', pending: 'orange', scheduled: 'blue', completed: 'green', cancelled: 'red', rejected: 'red', applicant: 'gray', under_review: 'orange', written_exam: 'blue', interview: 'blue', paid: 'green', overdue: 'red', in_progress: 'blue', suspended: 'red', tutor: 'blue', student: 'gray', admin: 'purple' }
  return `<span class="badge badge-${m[s] || 'gray'}">${s?.replace(/_/g, ' ')}</span>`
}
function stars(n) { return '★'.repeat(Math.round(n || 0)) + '☆'.repeat(5 - Math.round(n || 0)) }
function fmt(dt) { return dt ? new Date(dt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—' }
function fmtShort(dt) { return dt ? new Date(dt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—' }
    // ════════════════════════════════════════════════════════════
    // REALTIME — live notification badge + session status updates
    // Starts once after login; cleans up on logout
    // ════════════════════════════════════════════════════════════
    let _realtimeChannel = null;
    let _realtimeSubscribing = false;

    function startRealtimeSync() {
      const sb = getSupabase();
      if (!sb) { 
        setTimeout(startRealtimeSync, 1000); 
        return; 
      }
      if (_realtimeChannel || _realtimeSubscribing) return; // already running or starting
      _realtimeSubscribing = true;
      
      if (!State.user) return;

      const userId = State.user.id;
      const userRole = State.user.role;

      _realtimeChannel = sb
        .channel('app-realtime-' + userId, {
          config: { presence: { key: userId } }
        })
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: 'user_id=eq.' + userId
        }, function() {
          loadUnreadCount();
          if (State.page === 'notifications') {
            setTimeout(renderNotifications, 300);
          }
        })
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'sessions',
          filter: userRole === 'tutor'
            ? 'tutor_id=eq.' + userId
            : 'student_id=eq.' + userId
        }, function(payload) {
          if (State.page === 'sessions') {
            setTimeout(function() {
              if (typeof renderSessions === 'function') renderSessions();
            }, 300);
          } else {
            const status = payload.new?.status;
            if (status === 'approved')  toast('✅ A session was approved!', 'ok');
            if (status === 'cancelled') toast('❌ A session was cancelled.', 'info');
            if (status === 'scheduled') toast('📅 Session scheduled!', 'ok');
          }
        })
        .on('presence', { event: 'sync' }, function() {
          window._onlineUsers = _realtimeChannel.presenceState();
        })
        .subscribe(function(status) {
          _realtimeSubscribing = false;
          if (status === 'SUBSCRIBED') {
            _realtimeChannel.track({
              user_id: userId,
              role: userRole,
              online_at: new Date().toISOString()
            });
          }
          // Auto-reconnect on channel error
          if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            _realtimeSubscribing = false;
            stopRealtimeSync();
            setTimeout(startRealtimeSync, 3000);
          }
        });
    }

    function stopRealtimeSync() {
      _realtimeSubscribing = false;
      if (_realtimeChannel) {
        const sb = getSupabase();
        if (sb) sb.removeChannel(_realtimeChannel);
        _realtimeChannel = null;
        window._onlineUsers = {};
      }
    }

    // Realtime hooks are called directly inside setAuth / clearAuth below

      // FIX: Don't fetch if there is no user logged in
      async function loadUnreadCount() {
        if (!State.user || !getToken()) return; 
        try {
          const notifs = await api('/notifications/?unread_only=true')
          const count = (notifs || []).length
          State.data.unreadCount = count
          // Inject badge into DOM after sidebar renders
          setTimeout(() => {
            const btns = document.querySelectorAll('.sidebar-item')
            btns.forEach(btn => {
              if (btn.textContent.includes('Notifications')) {
                const old = btn.querySelector('.notif-badge')
                if (old) old.remove()
                if (count > 0) {
                  const badge = document.createElement('span')
                  badge.className = 'notif-badge'
                  badge.style.cssText = 'margin-left:auto;background:#ef4444;color:#fff;border-radius:999px;font-size:11px;font-weight:700;padding:1px 7px;min-width:20px;text-align:center'
                  badge.textContent = count
                  btn.appendChild(badge)
                }
              }
            })
          }, 100)
        } catch (e) {
          State.data.unreadCount = 0
        }
      }
    
    function notifBadge() {
      const count = State.data.unreadCount || 0
      if (count === 0) return ''
      return '<span style="margin-left:auto;background:#ef4444;color:#fff;border-radius:999px;font-size:11px;font-weight:700;padding:1px 7px;min-width:20px;text-align:center">' + count + '</span>'
    }
    function sidebar(active) {
      const u = State.user
      const role = u?.role
      let links = ''
      if (role === 'admin') {
        links = `
      <span class="sidebar-section">Overview</span>
      <button class="sidebar-item ${active === 'dashboard' ? 'active' : ''}" onclick="navigate('dashboard')"><i data-lucide="layout-dashboard" class="sidebar-ic" style="width:18px;height:18px"></i>Dashboard</button>
      <span class="sidebar-section">Management</span>
      <button class="sidebar-item ${active === 'admin-tutors' ? 'active' : ''}" onclick="navigate('admin-tutors')"><i data-lucide="users" class="sidebar-ic" style="width:18px;height:18px"></i>Tutors</button>
      <button class="sidebar-item ${active === 'admin-students' ? 'active' : ''}" onclick="navigate('admin-students')"><i data-lucide="graduation-cap" class="sidebar-ic" style="width:18px;height:18px"></i>Students</button>
      <button class="sidebar-item ${active === 'admin-sessions' ? 'active' : ''}" onclick="navigate('admin-sessions')"><i data-lucide="calendar" class="sidebar-ic" style="width:18px;height:18px"></i>Sessions</button>
      <button class="sidebar-item ${active === 'admin-exam' ? 'active' : ''}" onclick="navigate('admin-exam')"><i data-lucide="file-check-2" class="sidebar-ic" style="width:18px;height:18px"></i>Exam Manager</button>
      <button class="sidebar-item ${active === 'admin-shop' ? 'active' : ''}" onclick="navigate('admin-shop')"><i data-lucide="store" class="sidebar-ic" style="width:18px;height:18px"></i>Shop Manager</button>
      <button class="sidebar-item ${active === 'admin-payments' ? 'active' : ''}" onclick="navigate('admin-payments')"><i data-lucide="credit-card" class="sidebar-ic" style="width:18px;height:18px"></i>Payments</button>
      <button class="sidebar-item ${active === 'admin-courses' ? 'active' : ''}" onclick="navigate('admin-courses')"><i data-lucide="library" class="sidebar-ic" style="width:18px;height:18px"></i>Courses Manager</button>
      <span class="sidebar-section">Other</span>
      <button class="sidebar-item ${active === 'messages' ? 'active' : ''}" onclick="navigate('messages')"><i data-lucide="message-square" class="sidebar-ic" style="width:18px;height:18px"></i>Messages</button>
      <button class="sidebar-item ${active === 'notifications' ? 'active' : ''}" onclick="navigate('notifications')"><i data-lucide="bell" class="sidebar-ic" style="width:18px;height:18px"></i>Notifications</button>
      <button class="sidebar-item ${active === 'forum' ? 'active' : ''}" onclick="navigate('forum')"><i data-lucide="messages-square" class="sidebar-ic" style="width:18px;height:18px"></i>Forum</button>
      <button class="sidebar-item ${active === 'news' ? 'active' : ''}" onclick="navigate('news')"><i data-lucide="newspaper" class="sidebar-ic" style="width:18px;height:18px"></i>Education News</button>`
      } else if (role === 'tutor') {
        links = `
      <span class="sidebar-section">Overview</span>
      <button class="sidebar-item ${active === 'dashboard' ? 'active' : ''}" onclick="navigate('dashboard')"><i data-lucide="layout-dashboard" class="sidebar-ic" style="width:18px;height:18px"></i>Dashboard</button>
      <span class="sidebar-section">Teaching</span>
      <button class="sidebar-item ${active === 'sessions' ? 'active' : ''}" onclick="navigate('sessions')"><i data-lucide="calendar" class="sidebar-ic" style="width:18px;height:18px"></i>My Sessions</button>
      ${u?.tutor?.status === 'written_exam' ? `<button class="sidebar-item ${active === 'exam' ? 'active' : ''}" onclick="navigate('exam')"><i data-lucide="file-text" class="sidebar-ic" style="width:18px;height:18px"></i>Written Exam <span style="background:#ef4444;color:#fff;border-radius:999px;font-size:10px;padding:1px 6px;margin-left:4px">!</span></button>` : ''}
      <button class="sidebar-item ${active === 'messages' ? 'active' : ''}" onclick="navigate('messages')"><i data-lucide="message-square" class="sidebar-ic" style="width:18px;height:18px"></i>Messages</button>
      <span class="sidebar-section">Account</span>
      <button class="sidebar-item ${active === 'profile' ? 'active' : ''}" onclick="navigate('profile')"><i data-lucide="user" class="sidebar-ic" style="width:18px;height:18px"></i>Profile</button>
      <button class="sidebar-item ${active === 'notifications' ? 'active' : ''}" onclick="navigate('notifications')"><i data-lucide="bell" class="sidebar-ic" style="width:18px;height:18px"></i>Notifications</button>
      <button class="sidebar-item ${active === 'forum' ? 'active' : ''}" onclick="navigate('forum')"><i data-lucide="messages-square" class="sidebar-ic" style="width:18px;height:18px"></i>Forum</button>
      <button class="sidebar-item ${active === 'news' ? 'active' : ''}" onclick="navigate('news')"><i data-lucide="newspaper" class="sidebar-ic" style="width:18px;height:18px"></i>Education News</button>`
      } else {
        links = `
      <span class="sidebar-section">Overview</span>
      <button class="sidebar-item ${active === 'dashboard' ? 'active' : ''}" onclick="navigate('dashboard')"><i data-lucide="layout-dashboard" class="sidebar-ic" style="width:18px;height:18px"></i>Dashboard</button>
      <span class="sidebar-section">Learning</span>
      <button class="sidebar-item ${active === 'sessions' ? 'active' : ''}" onclick="navigate('sessions')"><i data-lucide="calendar" class="sidebar-ic" style="width:18px;height:18px"></i>My Sessions</button>
      <button class="sidebar-item ${active === 'tutors' ? 'active' : ''}" onclick="navigate('tutors')"><i data-lucide="search" class="sidebar-ic" style="width:18px;height:18px"></i>Find Tutors</button>
      <button class="sidebar-item ${active === 'messages' ? 'active' : ''}" onclick="navigate('messages')"><i data-lucide="message-square" class="sidebar-ic" style="width:18px;height:18px"></i>Messages</button>
      <span class="sidebar-section">Account</span>
      <button class="sidebar-item ${active === 'profile' ? 'active' : ''}" onclick="navigate('profile')"><i data-lucide="user" class="sidebar-ic" style="width:18px;height:18px"></i>Profile</button>
      <button class="sidebar-item ${active === 'notifications' ? 'active' : ''}" onclick="navigate('notifications')"><i data-lucide="bell" class="sidebar-ic" style="width:18px;height:18px"></i>Notifications</button>
      <button class="sidebar-item ${active === 'forum' ? 'active' : ''}" onclick="navigate('forum')"><i data-lucide="messages-square" class="sidebar-ic" style="width:18px;height:18px"></i>Forum</button>
      <button class="sidebar-item ${active === 'news' ? 'active' : ''}" onclick="navigate('news')"><i data-lucide="newspaper" class="sidebar-ic" style="width:18px;height:18px"></i>Education News</button>
      <button class="sidebar-item ${active === 'quiz' ? 'active' : ''}" onclick="navigate('quiz')"><i data-lucide="bot" class="sidebar-ic" style="width:18px;height:18px"></i>AI Tutor</button>
      <button class="sidebar-item ${active === 'shop' ? 'active' : ''}" onclick="navigate('shop')"><i data-lucide="shopping-bag" class="sidebar-ic" style="width:18px;height:18px"></i>Learning Store</button>
      <button class="sidebar-item ${active === 'cart' ? 'active' : ''}" onclick="navigate('cart')"><i data-lucide="shopping-cart" class="sidebar-ic" style="width:18px;height:18px"></i>My Cart</button>
      <button class="sidebar-item ${active === 'wishlist' ? 'active' : ''}" onclick="navigate('wishlist')"><i data-lucide="heart" class="sidebar-ic" style="width:18px;height:18px"></i>Wishlist</button>
      <button class="sidebar-item ${active === 'my-orders' ? 'active' : ''}" onclick="navigate('my-orders')"><i data-lucide="package" class="sidebar-ic" style="width:18px;height:18px"></i>My Orders</button>
      <button class="sidebar-item ${active === 'my-courses' ? 'active' : ''}" onclick="navigate('my-courses')"><i data-lucide="book-open-check" class="sidebar-ic" style="width:18px;height:18px"></i>My Courses</button>`
      }
      return `
  <nav class="sidebar" id="sidebar">
    <div style="display:flex; justify-content:flex-end; width:100%;">
       <button onclick="closeSidebar()" id="sidebar-close-btn" style="display:none; border:none; color:#fff; font-size:24px; cursor:pointer;">✕</button>
    </div>
    <button class="sidebar-logo" onclick="navigate('dashboard')" style="display:flex;align-items:center;gap:10px">
  <img src="https://hdpkjomganndiiprnpok.supabase.co/storage/v1/object/public/assets/mathrone%20logo1.png" alt="Mathrone Academy logo"loading="lazy" decoding="async" style="height:32px;width:auto;filter:brightness(0) invert(1)"/>
  Mathrone
</button>
    ${links}
    <div style="margin-top:auto;padding-top:20px;border-top:1px solid rgba(255,255,255,.1);margin-top:24px">
      <div style="display:flex;align-items:center;gap:10px;padding:10px;border-radius:var(--rs);background:rgba(255,255,255,.06);margin-bottom:10px">
        ${avi(u?.full_name || '?', 36, u?.avatar_url || null)}
        <div style="min-width:0">
          <div style="font-size:13px;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${u?.full_name || ''}</div>
          <div style="font-size:11px;color:var(--g400);text-transform:capitalize">${u?.role || ''}</div>
        </div>
      </div>
      <button class="sidebar-item" onclick="logout()"><i data-lucide="log-out" class="sidebar-ic" style="width:18px;height:18px"></i>Sign Out</button>
    </div>
  </nav>`
    }

  function openSidebar(){
  document.getElementById('sidebar')?.classList.add('open')
  document.getElementById('sidebar-overlay')?.classList.add('show')
}
function closeSidebar(){
  document.getElementById('sidebar')?.classList.remove('open')
  document.getElementById('sidebar-overlay')?.classList.remove('show')
}
    function dashWrap(active, content) {
      return `
  <div class="sidebar-overlay" id="sidebar-overlay" onclick="closeSidebar()"></div>
  <div class="dash-layout">
    ${sidebar(active)}
    <main class="dash-main" style="animation:fadeUp .4s">
      <div class="mobile-topbar" style="display:none">
        <button onclick="openSidebar()" style="background:none;border:none;cursor:pointer;color:#fff;font-size:22px">☰</button>
        <span style="font-size:16px;font-weight:700;color:#fff">👑 Mathrone</span>
        <div style="width:32px"></div>
      </div>
      ${content}
    </main>
  </div>`
    }

    async function logout() {
      try { await api('/auth/logout', { method: 'POST' }) } catch (e) { }
      clearAuth()
      navigate('landing')
    }

   

async function renderResetPassword(token){
  render(`
  <div style="min-height:100vh;background:linear-gradient(135deg,#1e3a8a,#2563eb);display:flex;align-items:center;justify-content:center;padding:20px">
    <div style="background:#fff;border-radius:20px;padding:48px;max-width:440px;width:100%;position:relative;">
      <button class="auth-close-btn" onclick="closeAuth()" title="Close">✕</button>
      <div style="text-align:center;margin-bottom:32px">
        <div style="font-size:48px;margin-bottom:12px">🔑</div>
        <h2 style="color:var(--navy)">Reset Password</h2>
        <p style="color:var(--g400);font-size:14px">Enter your new password below</p>
      </div>
      <div class="form-group">
        <label class="form-label">New Password</label>
        <input class="input" id="new-pw-1" type="password" placeholder="Min 6 characters"/>
      </div>
      <div class="form-group">
        <label class="form-label">Confirm Password</label>
        <input class="input" id="new-pw-2" type="password" placeholder="Repeat password"/>
      </div>
      <div id="reset-err" class="form-error" style="display:none;margin-bottom:12px"></div>
      <button class="btn btn-primary btn-full" onclick="submitResetPassword('${token}')">Reset Password →</button>
    </div>
  </div>`)
}

async function submitResetPassword(token){
  const pw1 = document.getElementById('new-pw-1')?.value
  const pw2 = document.getElementById('new-pw-2')?.value
  const err = document.getElementById('reset-err')
  if(!pw1 || pw1.length < 6){ err.style.display='block'; err.textContent='Password must be at least 6 characters'; return }
  if(pw1 !== pw2){ err.style.display='block'; err.textContent='Passwords do not match'; return }
  try{
    await fetch(API_URL + '/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, new_password: pw1 })
    })
    render(`
    <div style="min-height:100vh;background:linear-gradient(135deg,#1e3a8a,#2563eb);display:flex;align-items:center;justify-content:center;padding:20px">
      <div style="background:#fff;border-radius:20px;padding:48px;text-align:center;max-width:440px;width:100%">
        <div style="font-size:48px;margin-bottom:16px">✅</div>
        <h2 style="color:var(--navy);margin-bottom:8px">Password Reset!</h2>
        <p style="color:var(--g400);font-size:14px;margin-bottom:24px">Your password has been updated successfully.</p>
        <button class="btn btn-primary" onclick="navigate('login')">Sign In →</button>
      </div>
    </div>`)
  }catch(e){
    err.style.display='block'
    err.textContent = e.message
  }
}
function handleFooterLink(l){
  console.log('Footer link clicked:', l)
  if(l==='Privacy Policy') navigate('privacy')

  else if(l==='About Us') navigate('about')
  else if(l==='Education News') navigate('news')
  else if(l==='Find a Tutor') navigate('register')
  else if(l==='Become a Tutor') navigate('register','tutor')
  else if(l==='Careers') navigate('news','career')
  else if(l==='Terms of Service') navigate('terms')
  else if(l==='Contact Us') document.querySelector('.contact-grid')?.scrollIntoView()
  else if(l==='How It Works') document.querySelector('.steps-grid')?.scrollIntoView()
}
function animateCount(id, target, duration, suffix, isDecimal){
  const el = document.getElementById(id)
  if(!el) return
  const start = performance.now()
  function step(now){
    const progress = Math.min((now - start) / duration, 1)
    const ease = 1 - Math.pow(1 - progress, 3)
    const val = isDecimal ? (ease * target).toFixed(1) : Math.round(ease * target)
    el.textContent = val + suffix
    if(progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}
async function submitContactForm(){
  const name    = document.getElementById('contact-name')?.value?.trim()
  const email   = document.getElementById('contact-email')?.value?.trim()
  const subject = document.getElementById('contact-subject')?.value?.trim()
  const message = document.getElementById('contact-message')?.value?.trim()
  const btn     = document.getElementById('contact-btn')
  const msg     = document.getElementById('contact-msg')

  if(!name||!email||!subject||!message){
    msg.style.display='block';msg.style.background='#fee2e2';msg.style.color='#dc2626'
    msg.textContent='Please fill in all fields'; return
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if(!emailRegex.test(email)){
    msg.style.display='block';msg.style.background='#fee2e2';msg.style.color='#dc2626'
    msg.textContent='Please enter a valid email address'; return
  }

  btn.disabled=true; btn.textContent='Sending...'
  try{
    await fetch(API_URL + '/auth/contact', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ full_name:name, email, subject, message })
    })
    msg.style.display='block';msg.style.background='#dcfce7';msg.style.color='#166534'
    msg.textContent='✅ Message sent! We will get back to you within 24 hours.'
    document.getElementById('contact-name').value=''
    document.getElementById('contact-email').value=''
    document.getElementById('contact-subject').value=''
    document.getElementById('contact-message').value=''
    btn.textContent='Send Message →'
    btn.disabled=false
  }catch(e){
    msg.style.display='block';msg.style.background='#fee2e2';msg.style.color='#dc2626'
    msg.textContent='Failed to send. Please try again.'
    btn.disabled=false; btn.textContent='Send Message →'
  }
}


   
    // ════════════════════════════════════════════════════════════
    // SESSIONS
    // ════════════════════════════════════════════════════════════

    function openProgressModal(sessionId, subject, studentId){
  document.getElementById('modal-root').innerHTML = `
  <div class="modal-overlay" onclick="if(event.target===this)this.remove()">
    <div class="modal">
      <div class="modal-header">
        <span class="modal-title" style="display:flex;align-items:center;gap:8px"><i data-lucide="clipboard-edit" style="width:20px;height:20px"></i> Session Feedback — ${subject}</span>
        <button class="modal-close" onclick="document.querySelector('.modal-overlay').remove()">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Marks (out of 100)</label>
          <input class="input" id="prog-marks" type="number" min="0" max="100" placeholder="e.g. 78"/>
        </div>
        <div class="form-group">
          <label class="form-label">Overall Feedback</label>
          <textarea class="input" id="prog-feedback" rows="3" placeholder="How did the student perform overall?"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label" style="display:flex;align-items:center;gap:6px"><i data-lucide="thumbs-up" style="width:14px;height:14px"></i> Strengths</label>
          <textarea class="input" id="prog-strengths" rows="2" placeholder="What did the student do well?"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label" style="display:flex;align-items:center;gap:6px"><i data-lucide="trending-up" style="width:14px;height:14px"></i> Areas for Improvement</label>
          <textarea class="input" id="prog-improvements" rows="2" placeholder="What should the student work on?"></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="document.querySelector('.modal-overlay').remove()">Cancel</button>
        <button class="btn btn-primary" onclick="submitProgress('${sessionId}')">Submit Feedback ✅</button>
      </div>
    </div>
  </div>`
}

async function submitProgress(sessionId){
  const marks       = document.getElementById('prog-marks')?.value
  const feedback    = document.getElementById('prog-feedback')?.value?.trim()
  const strengths   = document.getElementById('prog-strengths')?.value?.trim()
  const improvements = document.getElementById('prog-improvements')?.value?.trim()

  if(!feedback){ toast('Please add feedback','err'); return }

  try{
    await api('/progress', {
      method: 'POST',
      body: JSON.stringify({
        session_id:   sessionId,
        marks:        marks ? parseInt(marks) : null,
        feedback:     feedback,
        strengths:    strengths||null,
        improvements: improvements||null,
      })
    })
    document.querySelector('.modal-overlay')?.remove()
    toast('Feedback submitted! ✅')
    bustCache('/sessions')
    bustCache('/progress')
    renderSessions()
  }catch(e){
    toast(e.message,'err')
  }
}

    async function renderSessions() {
      render(dashWrap('sessions', `<div class="loader-center"><div class="spinner"></div></div>`))
      try {
        const sessions = await api('/sessions/my')
        const tab = State.tab || 'upcoming'
        const upcoming = sessions.filter(s => ['scheduled', 'pending'].includes(s.status))
        const completed = sessions.filter(s => s.status === 'completed')
        const cancelled = sessions.filter(s => s.status === 'cancelled')
        const list = tab === 'upcoming' ? upcoming : tab === 'completed' ? completed : cancelled

        render(dashWrap('sessions', `
    <div class="page-header">
      <div><h1 class="page-title">My Sessions</h1><p class="page-subtitle">${sessions.length} total sessions</p></div>
    </div>
    <div class="tabs">
      <button class="tab-btn ${tab === 'upcoming' ? 'active' : ''}" onclick="State.tab='upcoming';renderSessions()">Upcoming (${upcoming.length})</button>
      <button class="tab-btn ${tab === 'completed' ? 'active' : ''}" onclick="State.tab='completed';renderSessions()">Completed (${completed.length})</button>
      <button class="tab-btn ${tab === 'cancelled' ? 'active' : ''}" onclick="State.tab='cancelled';renderSessions()">Cancelled (${cancelled.length})</button>
    </div>
    ${list.length ? `
    <div style="display:flex;flex-direction:column;gap:12px">
      ${list.map(s => {
          const other = State.user.role === 'student'
            ? (s.tutors?.profiles?.full_name || 'Tutor')
            : (s.students?.profiles?.full_name || 'Student')
          return `
        <div class="page-header">
      <div><h1 class="page-title" style="display:flex;align-items:center;gap:8px"><i data-lucide="messages-square" style="width:28px;height:28px;color:var(--blue)"></i> Community Forum</h1><p class="page-subtitle">Share ideas, ask questions, connect with others</p></div>
      <but<div class="card" style="padding:20px;display:flex;align-items:center;gap:16px">
          <div style="width:52px;height:52px;background:var(--sky);border-radius:var(--rs);display:flex;align-items:center;justify-content:center;color:var(--blue);flex-shrink:0"><i data-lucide="book-open" style="width:24px;height:24px"></i></div>ton class="btn btn-primary" onclick="openNewPostModal()"><i data-lucide="pen-square" style="width:16px;height:16px"></i> New Post</button>
    </div>
          <div style="flex:1;min-width:0">
            <div style="font-size:16px;font-weight:700;color:var(--navy)">${s.subject}</div>
            <div style="font-size:13px;color:var(--g600);margin-top:4px">with ${other} • ${s.mode}</div>
            <div style="font-size:12px;color:var(--g400);margin-top:3px">${fmt(s.scheduled_at)} • ${s.duration_mins} minutes</div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
    ${statusBadge(s.status)}
    
    <!-- Active Session Controls (Video + Whiteboard) -->
    ${s.status === 'scheduled' ? `
    <div style="display:flex; gap:6px; flex-wrap: wrap; justify-content: flex-end;">
        <button class="btn btn-primary btn-sm" onclick="renderWhiteboard('${s.id}')"><i data-lucide="rocket" style="width:14px;height:14px"></i> Join Session (Lab + Video)</button>
${s.mode !== 'home' ? `<button class="btn btn-ghost btn-sm" onclick="openStandaloneVideoCall('${s.id}')" style="font-size:11px;"><i data-lucide="video" style="width:14px;height:14px"></i> Video Only</button>` : ''}
    </div>
    ` : s.status === 'completed' && State.user?.role === 'tutor' ? `
    <div style="display:flex; gap:6px; flex-wrap: wrap; justify-content: flex-end;">
        <button class="btn btn-ghost btn-sm" onclick="renderWhiteboard('${s.id}')" title="Review session notes in the Lab"><i data-lucide="flask-conical" style="width:14px;height:14px"></i> Review Notes</button>
    </div>
    ` : ''}

    <!-- Student Rating Button -->
    ${s.status === 'completed' && !s.student_rating && State.user.role === 'student' ? `
        <button class="btn btn-gold btn-sm" onclick="openRatingModal('${s.id}','${s.subject}')">Rate Session ⭐</button>
    ` : ''}

    <!-- Tutor Feedback Button -->
    ${s.status === 'completed' && State.user.role === 'tutor' ? `
        <button class="btn btn-primary btn-sm" onclick="openProgressModal('${s.id}','${s.subject}','${s.student_id}')">Add Feedback 📝</button>
    ` : ''}

    <!-- Completed Stars -->
    ${s.status === 'completed' && s.student_rating ? `<div class="stars">${stars(s.student_rating)}</div>` : ''}
</div>
        </div>`}).join('')}
    </div>` : `<div class="empty-state"><div class="empty-icon">📅</div><div class="empty-title">No ${tab} sessions</div><div class="empty-sub">Your sessions will appear here once scheduled by admin</div></div>`}
    <div id="modal-root"></div>
    `))
      } catch (e) { toast(e.message, 'err') }
    }
    /** --- WHITEBOARD FEATURE --- **/


    function openRatingModal(sessionId, subject) {
      let rating = 5
      document.getElementById('modal-root').innerHTML = `
  <div class="modal-overlay" onclick="if(event.target===this)this.remove()">
    <div class="modal">
      <div class="modal-header"><span class="modal-title">Rate Session: ${subject}</span><button class="modal-close" onclick="document.querySelector('.modal-overlay').remove()">✕</button></div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Rating</label>
          <div style="display:flex;gap:8px;margin-bottom:12px">
            ${[1, 2, 3, 4, 5].map(n => `<button onclick="document.querySelectorAll('.star-btn').forEach((b,i)=>{b.style.color=i<${n}?'var(--gold)':'var(--g200)'}); window._rating=${n}" class="star-btn" style="font-size:28px;background:none;border:none;cursor:pointer;color:${n <= 5 ? 'var(--gold)' : 'var(--g200)'}"  >★</button>`).join('')}
          </div>
        </div>
        <div class="form-group"><label class="form-label">Review (optional)</label><textarea class="input" id="review-text" placeholder="Share your experience..."></textarea></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="document.querySelector('.modal-overlay').remove()">Cancel</button>
        <button class="btn btn-gold" onclick="submitRating('${sessionId}')">Submit Rating ⭐</button>
      </div>
    </div>
  </div>`
      window._rating = 5
    }

    async function submitRating(sessionId) {
      try {
        await api(`/sessions/${sessionId}/review`, { method: 'POST', body: JSON.stringify({ rating: window._rating || 5, review_text: document.getElementById('review-text')?.value || null }) })
        toast('Review submitted! Thank you ⭐')
        bustCache('/sessions')
        document.querySelector('.modal-overlay')?.remove()
        renderSessions()
      } catch (e) { toast(e.message, 'err') }
    }

    // ════════════════════════════════════════════════════════════
    // TUTOR SEARCH
    // ════════════════════════════════════════════════════════════
    async function requestTutor(tutorId) {
      const me = State.user
      const student = me.student || {}

      const modalHtml = `
  <div class="modal-overlay" onclick="if(event.target===this)this.remove()">
    <div class="modal-box" style="max-width:420px">
      <h3 style="margin-bottom:16px;color:var(--navy)">📚 Request this Tutor</h3>
      <div class="form-group">
        <label class="form-label">Subject</label>
        <input class="input" id="req-subject" value="${(student.subjects_needed || [])[0] || ''}" placeholder="e.g. Math, Physics"/>
      </div>
      <div class="form-group">
        <label class="form-label">Level</label>
        <select class="input" id="req-level">
          <option ${student.school_level === 'Primary' ? 'selected' : ''}>Primary</option>
          <option ${student.school_level === 'Secondary' ? 'selected' : ''}>Secondary</option>
          <option ${student.school_level === 'University' ? 'selected' : ''}>University</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Mode</label>
        <select class="input" id="req-mode">
          <option value="online" ${student.preferred_mode === 'online' ? 'selected' : ''}>Online</option>
          <option value="home" ${student.preferred_mode === 'home' ? 'selected' : ''}>Home Visit</option>
          <option value="blended">Blended (Both)</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Notes (optional)</label>
        <input class="input" id="req-notes" placeholder="Any extra info for admin..."/>
      </div>
      <div style="display:flex;gap:10px;margin-top:18px">
        <button class="btn btn-primary btn-full" onclick="submitTutorRequest('${tutorId}')">Send Request ✅</button>
        <button class="btn btn-ghost" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
      </div>
    </div>
  </div>`

      document.getElementById('modal-root').insertAdjacentHTML('beforeend', modalHtml)
    }

    async function submitTutorRequest(tutorId) {
      const subject = document.getElementById('req-subject')?.value?.trim()
      const level = document.getElementById('req-level')?.value
      const mode = document.getElementById('req-mode')?.value
      const notes = document.getElementById('req-notes')?.value?.trim()

      if (!subject) { toast('Please enter a subject', 'err'); return }

      try {
        await api('/students/requests', {
          method: 'POST',
          body: JSON.stringify({
            subject: subject,
            level: level,
            mode: mode,
            notes: notes || 'Student requested this tutor specifically'
          })
        })
        document.querySelector('.modal-overlay')?.remove()
        toast('Request sent! Admin will review and assign. ✅')
      } catch (e) {
        toast(e.message, 'err')
      }
    }
    async function renderTutorSearch() {
      render(dashWrap('tutors', `<div class="loader-center"><div class="spinner"></div></div>`))
      try {
        const params = State.data.searchParams || {}
        const q = new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([, v]) => v)))
        const res = await api(`/tutors/search?${q}`)
        // Load assigned tutor profile IDs for this student
        try {
          const assignments = await api('/students/assignments')
          State.data.assignedTutorIds = (assignments || []).map(a => a.tutors?.profile_id).filter(Boolean)
        } catch (e) {
          State.data.assignedTutorIds = []
        }
        const tutors = res.data || []
        render(dashWrap('tutors', `
    <div class="page-header"><div><h1 class="page-title">Find a Tutor</h1><p class="page-subtitle">${res.total || 0} tutors available</p></div></div>
    <div class="card" style="padding:20px;margin-bottom:22px">
      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:flex-end">
        <div style="flex:1;min-width:140px"><label class="form-label">Subject</label><input class="input" id="fs-subject" value="${params.subject || ''}" placeholder="Math, Physics..."/></div>
        <div style="flex:1;min-width:120px"><label class="form-label">Level</label>
          <select class="input" id="fs-level"><option value="">Any level</option><option ${params.level === 'Primary' ? 'selected' : ''}>Primary</option><option ${params.level === 'Secondary' ? 'selected' : ''}>Secondary</option><option ${params.level === 'University' ? 'selected' : ''}>University</option></select></div>
        <div style="flex:1;min-width:120px"><label class="form-label">Mode</label>
          <select class="input" id="fs-mode"><option value="">Any mode</option><option value="online" ${params.mode === 'online' ? 'selected' : ''}>Online</option><option value="home" ${params.mode === 'home' ? 'selected' : ''}>Home</option></select></div>
        <button class="btn btn-primary" onclick="searchTutors()">Search</button>
        <button class="btn btn-ghost" onclick="State.data.searchParams={};renderTutorSearch()">Clear</button>
      </div>
    </div>
    ${tutors.length ? `
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:18px">
      ${tutors.map(t => `
      <div class="tutor-card">
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px">
          ${avi(t.profiles?.full_name || 'T', 50)}
          <div style="min-width:0">
            <div style="font-weight:700;color:var(--navy);font-size:15px">${t.profiles?.full_name || '—'}</div>
            <div style="font-size:12px;color:var(--g400);margin-top:2px">${t.qualification || '—'}</div>
            <div class="stars" style="margin-top:4px">${stars(t.rating)} <span style="color:var(--g400);font-size:11px">(${t.total_reviews})</span></div>
          </div>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">
          ${(t.subjects || []).slice(0, 3).map(s => `<span class="badge badge-blue">${s}</span>`).join('')}
        </div>
        <div style="font-size:12px;color:var(--g600);display:flex;gap:14px;margin-bottom:14px">
          <span>📚 ${t.experience_years} yrs exp</span>
          <span>📍 ${t.teaching_modes?.join(', ') || 'Online'}</span>
        </div>
        ${t.bio ? `<p style="font-size:12px;color:var(--g600);line-height:1.5;margin-bottom:14px">${t.bio.slice(0, 100)}${t.bio.length > 100 ? '...' : ''}</p>` : ''}
        <div style="display:flex;justify-content:space-between;align-items:center">
          ${(State.data.assignedTutorIds || []).includes(t.profile_id) ?
            `<button class="btn btn-primary btn-sm" onclick="openMessageModal('${t.profile_id}','${(t.profiles?.full_name || '').replace(/'/g, "\\'")}')">Message →</button>` :
            `<button class="btn btn-ghost btn-sm" onclick="requestTutor('${t.id}')">Request this Tutor</button>`}
        </div>
      </div>`).join('')}
    </div>` : `<div class="empty-state"><div class="empty-icon" style="color:var(--g400)"><i data-lucide="search" style="width:48px;height:48px;stroke-width:1.5"></i></div><div class="empty-title">No tutors found</div><div class="empty-sub">Try adjusting your filters or <a onclick="State.data.searchParams={};renderTutorSearch()" style="color:var(--blue);cursor:pointer">clear all</a></div></div>`}
    <div id="modal-root"></div>
    `))
      } catch (e) { toast(e.message, 'err') }
    }

    function searchTutors() {
      State.data.searchParams = {
        subject: document.getElementById('fs-subject')?.value?.trim(),
        level: document.getElementById('fs-level')?.value,
        mode: document.getElementById('fs-mode')?.value,
      }
      renderTutorSearch()
    }

    function openMessageModal(recipientId, recipientName) {
      document.getElementById('modal-root').innerHTML = `
  <div class="modal-overlay" onclick="if(event.target===this)this.remove()">
    <div class="modal">
      <div class="modal-header"><span class="modal-title">Message ${recipientName}</span><button class="modal-close" onclick="document.querySelector('.modal-overlay').remove()">✕</button></div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">Message</label><textarea class="input" id="msg-text" placeholder="Hi, I'm interested in tutoring sessions..."></textarea></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="document.querySelector('.modal-overlay').remove()">Cancel</button>
        <button class="btn btn-primary" onclick="sendQuickMsg('${recipientId}')">Send Message</button>
      </div>
    </div>
  </div>`
    }

    async function sendQuickMsg(recipientId) {
      const content = document.getElementById('msg-text')?.value?.trim()
      if (!content) { toast('Please enter a message', 'err'); return }
      try {
        await api('/messages/send', { method: 'POST', body: JSON.stringify({ recipient_id: recipientId, content }) })
        toast('Message sent! ✅')
        document.querySelector('.modal-overlay')?.remove()
      } catch (e) { toast(e.message, 'err') }
    }

    // ════════════════════════════════════════════════════════════
    // MESSAGES
    // ════════════════════════════════════════════════════════════
    async function openNewMessageModal(){
  try{
    const [tutors, students] = await Promise.all([
      api('/tutors/admin/all'),
      api('/students/admin/all')
    ])
    const allUsers = [
      ...tutors.map(t=>({ id: t.profiles?.id, name: t.profiles?.full_name, role: 'Tutor' })),
      ...students.map(s=>({ id: s.profiles?.id, name: s.profiles?.full_name, role: 'Student' }))
    ].filter(u=>u.id && u.id !== State.user.id)

    document.getElementById('modal-root').innerHTML = `
    <div class="modal-overlay" onclick="if(event.target===this)this.remove()">
      <div class="modal">
        <div class="modal-header">
          <span class="modal-title" style="display:flex;align-items:center;gap:8px"><i data-lucide="message-square-plus" style="width:20px;height:20px"></i> New Message</span>
          <button class="modal-close" onclick="document.querySelector('.modal-overlay').remove()">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Send To</label>
            <select class="input" id="new-msg-recipient">
              <option value="">— Select person —</option>
              ${allUsers.map(u=>`<option value="${u.id}">${u.name} (${u.role})</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Message</label>
            <textarea class="input" id="new-msg-content" rows="4" placeholder="Type your message..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" onclick="document.querySelector('.modal-overlay').remove()">Cancel</button>
          <button class="btn btn-primary" onclick="sendNewMessage()">Send Message →</button>
        </div>
      </div>
    </div>`
  
  }catch(e){
    toast(e.message, 'err')
  }
}

async function sendNewMessage(){
  const recipientId = document.getElementById('new-msg-recipient')?.value
  const content     = document.getElementById('new-msg-content')?.value?.trim()
  if(!recipientId){ toast('Please select a recipient','err'); return }
  if(!content){ toast('Please type a message','err'); return }
  try{
    await api('/messages/send', {
      method: 'POST',
      body: JSON.stringify({ recipient_id: recipientId, content: content })
    })
    document.querySelector('.modal-overlay')?.remove()
    toast('Message sent! ✅')
    renderMessages()
  }catch(e){
    toast(e.message, 'err')
  }
}
async function deleteMessage(id){
  try{
    await api(`/messages/${id}`, { method: 'DELETE' })
    renderMessages()
  }catch(e){ toast(e.message,'err') }
}
function toggleSelectAllMsgs(checked){
  document.querySelectorAll('.msg-checkbox').forEach(cb => cb.checked = checked)
  onMsgCheckChange()
}

function onMsgCheckChange(){
  const checked = document.querySelectorAll('.msg-checkbox:checked')
  const btn = document.getElementById('msg-delete-selected-btn')
  const all = document.querySelectorAll('.msg-checkbox')
  const selectAll = document.getElementById('msg-select-all')
  if(btn) btn.style.display = checked.length > 0 ? 'block' : 'none'
  if(btn) btn.textContent = `<i data-lucide="trash-2" style="width:16px;height:16px"></i> Delete selected (${checked.length})`
  if(selectAll) selectAll.indeterminate = checked.length > 0 && checked.length < all.length
  if(selectAll && checked.length === all.length && all.length > 0) selectAll.checked = true
}

async function deleteSelectedMsgs(){
  const checked = [...document.querySelectorAll('.msg-checkbox:checked')]
  if(!checked.length) return
  if(!confirm(`Delete ${checked.length} message(s)?`)) return
  const ids = checked.map(cb => cb.dataset.id)
  try{
    await Promise.all(ids.map(id => api(`/messages/${id}`, { method: 'DELETE' })))
    toast(`${ids.length} message(s) deleted ✅`)
    renderMessages()
  }catch(e){ toast(e.message,'err') }
}
    async function renderMessages() {
      render(dashWrap('messages', `<div class="loader-center"><div class="spinner"></div></div>`))
      try {
        const convs = await api('/messages/conversations')
        const active = State.data.activeConv || (convs[0]?.id ? convs[0] : null)
        let msgs = []
        if (active) {
          try {
            const other_id = active.participant_a === State.user.id ? active.participant_b : active.participant_a
            const res = await api(`/messages/conversations/${other_id}`)
            msgs = res.messages || []
            State.data.activeConv = active
            State.data.activeOtherId = other_id
          } catch (e) { }
        }
        render(dashWrap('messages', `
    <div class="page-header">
  <div><h1 class="page-title">Messages</h1></div>
  ${State.user.role === 'admin' ? `<button class="btn btn-primary" onclick="openNewMessageModal()">+ New Message</button>` : ''}
</div>
    <div class="chat-wrap">
      <div class="chat-list">
        <div style="padding:14px 16px;border-bottom:1px solid var(--g100)"><div style="font-weight:700;font-size:13px;color:var(--navy)">Conversations</div></div>
        ${convs.length ? convs.map(c => `
        <div class="chat-item ${active?.id === c.id ? 'active' : ''}" onclick="State.data.activeConv=JSON.parse('${JSON.stringify(c).replace(/'/g, "\\'")}');renderMessages()">
          ${avi(c.other_user?.full_name || '?', 38)}
          <div style="min-width:0">
            <div style="font-weight:600;font-size:13px;color:var(--navy);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.other_user?.full_name || 'Unknown'}</div>
            <div style="font-size:11px;color:var(--g400);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.last_message || 'No messages yet'}</div>
          </div>
        </div>`).join('') : `<div style="padding:24px;text-align:center;color:var(--g400);font-size:13px">No conversations yet</div>`}
      </div>
      <div class="chat-messages">
        ${active ? `
        <div style="padding:14px 18px;border-bottom:1px solid var(--g100);display:flex;align-items:center;gap:11px;background:#fff">
          ${avi(active.other_user?.full_name || '?', 38)}
          <div>
            <div style="font-weight:700;font-size:14px;color:var(--navy)">${active.other_user?.full_name || '—'}</div>
            <div style="font-size:11px;color:var(--green)">● Active</div>
          </div>
        </div>
        <div class="msgs-area" id="msgs-area">
          ${msgs.length ? `
          <div style="padding:8px 16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--g100)">
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:12px;color:var(--g400)">
              <input type="checkbox" id="msg-select-all" onchange="toggleSelectAllMsgs(this.checked)" style="width:14px;height:14px;cursor:pointer"/>
              Select all
            </label>
            <button id="msg-delete-selected-btn" class="btn btn-ghost btn-sm" style="color:var(--red);display:none;font-size:12px" onclick="deleteSelectedMsgs()"><i data-lucide="trash-2" style="width:16px;height:16px"></i> Delete selected</button>
          </div>
          ` + msgs.map(m => {
          const sent = m.sender_id === State.user.id
          return `<div class="msg ${sent ? 'sent' : 'recv'}" style="position:relative">
              <input type="checkbox" class="msg-checkbox" data-id="${m.id}" onchange="onMsgCheckChange()" style="position:absolute;${sent?'right:calc(100% + 8px)':'left:calc(100% + 8px)'};top:50%;transform:translateY(-50%);width:14px;height:14px;cursor:pointer"/>
              ${sent ? `<button onclick="deleteMessage('${m.id}')" style="background:none;border:none;color:var(--g300);cursor:pointer;font-size:13px;opacity:0;transition:opacity .2s;align-self:center" class="msg-del-btn" title="Delete"><i data-lucide="trash-2" style="width:16px;height:16px"></i></button>` : ''}
              <div class="msg-bubble">${m.content}</div>
              <div class="msg-time">${fmtShort(m.created_at)}</div>
            </div>`}).join('') : `<div class="empty-state"><div class="empty-icon">💬</div><div class="empty-title">No messages yet</div><div class="empty-sub">Send the first message!</div></div>`}
        </div>
        <div class="chat-input-row">
          <input class="input" id="msg-input" placeholder="Type a message..." onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendMsg()}" style="flex:1"/>
          <button class="btn btn-primary" onclick="sendMsg()">Send →</button>
        </div>` : `<div class="empty-state"><div class="empty-icon">💬</div><div class="empty-title">Select a conversation</div></div>`}
      </div>
    </div>
    <div id="modal-root"></div>
    `))
        // Scroll to bottom
        setTimeout(() => { const a = document.getElementById('msgs-area'); if (a) a.scrollTop = a.scrollHeight }, 100)
        // Render math formulas
    setTimeout(() => { if(window.MathJax) MathJax.typesetPromise() }, 300)
      } catch (e) { toast(e.message, 'err') }
    }

    async function sendMsg() {
      const input = document.getElementById('msg-input')
      const content = input?.value?.trim()
      const otherId = State.data.activeOtherId
      if (!content || !otherId) return
      input.value = ''
      try {
        await api('/messages/send', { method: 'POST', body: JSON.stringify({ recipient_id: otherId, content }) })
        renderMessages()
      } catch (e) { toast(e.message, 'err') }
    }

    // ════════════════════════════════════════════════════════════
    // NOTIFICATIONS
    // ════════════════════════════════════════════════════════════
    async function deleteNotification(id){
  if(!confirm('Delete this notification?')) return
  try{
    await api(`/notifications/${id}`, { method: 'DELETE' })
    toast('Notification deleted')
    renderNotifications()
  }catch(e){ toast(e.message,'err') }
}
function toggleSelectAllNotifs(checked){
  document.querySelectorAll('.notif-checkbox').forEach(cb => cb.checked = checked)
  onNotifCheckChange()
}

function onNotifCheckChange(){
  const checked = document.querySelectorAll('.notif-checkbox:checked')
  const btn = document.getElementById('notif-delete-selected-btn')
  const selectAll = document.getElementById('notif-select-all')
  const all = document.querySelectorAll('.notif-checkbox')
  if(btn) btn.style.display = checked.length > 0 ? 'block' : 'none'
  if(btn) btn.textContent = `<i data-lucide="trash-2" style="width:16px;height:16px"></i> Delete selected (${checked.length})`
  if(selectAll) selectAll.indeterminate = checked.length > 0 && checked.length < all.length
  if(selectAll && checked.length === all.length && all.length > 0) selectAll.checked = true
}

async function deleteSelectedNotifs(){
  const checked = [...document.querySelectorAll('.notif-checkbox:checked')]
  if(!checked.length) return
  if(!confirm(`Delete ${checked.length} notification(s)?`)) return
  const ids = checked.map(cb => cb.dataset.id)
  try{
    await Promise.all(ids.map(id => api(`/notifications/${id}`, { method: 'DELETE' })))
    toast(`${ids.length} notification(s) deleted ✅`)
    renderNotifications()
  }catch(e){ toast(e.message,'err') }
}
    async function renderNotifications() {
      render(dashWrap('notifications', `<div class="loader-center"><div class="spinner"></div></div>`))
      try {
        const notifs = await api('/notifications/')
        const typeIcon = { session_reminder: '📅', tutor_assigned: '🎓', new_message: '💬', application_update: '📋', payment_due: '💳', general: '🔔' }
        render(dashWrap('notifications', `
    <div class="page-header">
      <div><h1 class="page-title">Notifications</h1><p class="page-subtitle">${notifs.filter(n => !n.is_read).length} unread</p></div>
      ${notifs.some(n => !n.is_read) ? `<button class="btn btn-ghost" onclick="markAllRead()">Mark all read</button>` : ''}
    </div>
   ${notifs.length ? `
    <div class="card">
      <div style="padding:12px 20px;border-bottom:1px solid var(--g100);display:flex;align-items:center;justify-content:space-between">
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px;font-weight:600;color:var(--navy)">
          <input type="checkbox" id="notif-select-all" onchange="toggleSelectAllNotifs(this.checked)" style="width:16px;height:16px;cursor:pointer"/>
          Select all
        </label>
        <button id="notif-delete-selected-btn" class="btn btn-ghost btn-sm" style="color:var(--red);display:none" onclick="deleteSelectedNotifs()"><i data-lucide="trash-2" style="width:16px;height:16px"></i> Delete selected</button>
      </div>
      ${notifs.map(n => `
      <div style="display:flex;align-items:center;gap:10px;padding:16px 20px;border-bottom:1px solid var(--g100);background:${n.is_read ? '#fff' : 'var(--sky)'}">
        <input type="checkbox" class="notif-checkbox" data-id="${n.id}" onchange="onNotifCheckChange()" style="width:16px;height:16px;cursor:pointer;flex-shrink:0"/>
        <div style="flex:1;min-width:0;cursor:pointer" onclick="markRead('${n.id}',this)">
          <div style="display:flex;gap:10px;align-items:flex-start">
            <div style="font-size:22px;flex-shrink:0">${typeIcon[n.type] || '🔔'}</div>
            <div style="flex:1;min-width:0">
              <div style="font-weight:${n.is_read ? '500' : '700'};color:var(--navy);font-size:14px">${n.title}</div>
              <div style="font-size:13px;color:var(--g600);margin-top:3px;line-height:1.5">${n.body}</div>
              <div style="font-size:11px;color:var(--g400);margin-top:5px">${fmtShort(n.created_at)}</div>
            </div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:8px;flex-shrink:0">
          ${!n.is_read ? `<div style="width:8px;height:8px;border-radius:50%;background:var(--blue)"></div>` : ''}
          <button onclick="deleteNotification('${n.id}')" style="background:none;border:none;color:var(--g400);cursor:pointer;font-size:15px;padding:0" title="Delete"><i data-lucide="trash-2" style="width:16px;height:16px"></i></button>
        </div>
      </div>`).join('')}
    </div>` : `<div class="empty-state"><div class="empty-icon" style="color:var(--g400)"><i data-lucide="bell" style="width:48px;height:48px;stroke-width:1.5"></i></div><div class="empty-title">No notifications</div><div class="empty-sub">You're all caught up!</div></div>`}
    `))
      } catch (e) { toast(e.message, 'err') }
    }

    async function markRead(id, el) {
      try {
        await api(`/notifications/${id}/read`, { method: 'PATCH' })
        el.style.background = '#fff'
        const dot = el.querySelector('div[style*="border-radius:50%"]')
        if (dot) dot.remove()
      } catch (e) { }
    }
    async function markAllRead() {
      try {
        await api('/notifications/read-all', { method: 'PATCH' })
        toast('All marked as read')
        bustCache('/notifications')
        renderNotifications()
      } catch (e) { toast(e.message, 'err') }
    }

    // ════════════════════════════════════════════════════════════
    // PROFILE
    // ════════════════════════════════════════════════════════════
    function updateBioCount(el){
  const len = el.value.length
  document.getElementById('bio-count').textContent = len + '/500'
  const msg = document.getElementById('bio-count-msg')
  if(len < 200){
    msg.style.color = 'var(--orange)'
    msg.textContent = `Minimum 200 characters (${200 - len} more needed)`
  } else {
    msg.style.color = 'var(--green)'
    msg.textContent = 'Looks good ✅'
  }
}
    async function uploadAvatar(input){
  const file = input.files[0]
  if(!file) return
  if(file.size > 2 * 1024 * 1024){ toast('Image must be under 2MB','err'); return }
  const form = new FormData()
  form.append('file', file)
  try{
    toast('Uploading...')
    const res = await fetch(API_URL + '/tutors/upload-avatar', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + getToken() },
      body: form
    })
    const data = await res.json()
    if(!res.ok) throw new Error(data.detail||'Upload failed')
    toast('Profile photo updated! ✅')
    renderProfile()
  }catch(e){
    toast(e.message,'err')
  }
}
    async function renderProfile() {
      render(dashWrap('profile', `<div class="loader-center"><div class="spinner"></div></div>`))
      try {
        const me = await api('/auth/me')
        const role = me.role
        const extra = role === 'tutor' ? me.tutor : me.student
        render(dashWrap('profile', `
    <div class="page-header"><div><h1 class="page-title">My Profile</h1><p class="page-subtitle">Manage your account information</p></div></div>
    <div class="grid-2">
      <div class="card" style="padding:28px">
        <h3 style="font-size:16px;font-weight:700;color:var(--navy);margin-bottom:20px">Personal Info</h3>
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px">
          <div style="position:relative;cursor:pointer" onclick="document.getElementById('avatar-input').click()">
            ${avi(me.full_name || '?', 64, me.avatar_url||null)}
            <div style="position:absolute;bottom:0;right:0;background:var(--blue);border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-content:center;font-size:12px">📷</div>
          </div>
          <input type="file" id="avatar-input" accept="image/*" style="display:none" onchange="uploadAvatar(this)"/>
          <div>
            <div style="font-size:18px;font-weight:700;color:var(--navy)">${me.full_name}</div>
            <div style="font-size:13px;color:var(--g400)">${me.email}</div>
            <div style="margin-top:6px">${statusBadge(role)}</div>
          </div>
        </div>
        <div class="form-group"><label class="form-label">Full Name</label><input class="input" id="p-name" value="${me.full_name || ''}"/></div>
        <div class="form-group"><label class="form-label">Phone</label><input class="input" id="p-phone" value="${me.phone || ''}"/></div>
        <button class="btn btn-primary" onclick="saveProfile()">Save Changes</button>
      </div>
      ${role === 'tutor' && extra ? `
      <div class="card" style="padding:28px">
        <h3 style="font-size:16px;font-weight:700;color:var(--navy);margin-bottom:20px">Tutor Profile</h3>
        <div style="margin-bottom:12px">${statusBadge(extra.status)}</div>
        <textarea class="input" id="t-bio" maxlength="500" minlength="200" rows="5" placeholder="Tell students about yourself — your teaching style, experience, and what makes you a great tutor..." oninput="updateBioCount(this)">${extra.bio || ''}</textarea>
<div style="font-size:11px;margin-top:4px;text-align:right">
  <span id="bio-count-msg" style="color:${(extra.bio||'').length < 200 ? 'var(--orange)' : 'var(--green)'}">
    ${(extra.bio||'').length < 200 ? `Minimum 200 characters (${200 - (extra.bio||'').length} more needed)` : 'Looks good ✅'}
  </span>
  &nbsp;<span id="bio-count" style="color:var(--g400)">${(extra.bio||'').length}/500</span>
</div>
        ${extra.hourly_rate ? `<div class="form-group"><div class="form-label">Agreed Salary</div><div style="font-size:18px;font-weight:700;color:var(--green);margin-top:4px">$${extra.hourly_rate}/hr</div><div style="font-size:12px;color:var(--g400);margin-top:2px">Set by admin after contract agreement</div></div>` : `<div class="form-group"><div style="background:#FFF7ED;border-radius:8px;padding:12px;font-size:13px;color:var(--orange)">⏳ Salary not set yet. Admin will update after contract signing.</div></div>`}
        <div class="form-group"><label class="form-label">Available</label>
          <select class="input" id="t-avail"><option value="true" ${extra.is_available ? 'selected' : ''}>Yes</option><option value="false" ${!extra.is_available ? 'selected' : ''}>No</option></select></div>
        <button class="btn btn-primary" onclick="saveTutorProfile()">Update Tutor Profile</button>
        <div class="divider"></div>
        <h4 style="font-weight:700;font-size:13px;color:var(--g600);margin-bottom:12px">UPLOAD DOCUMENTS</h4>
        <div style="display:flex;flex-direction:column;gap:10px">
          <div><label class="form-label">CV / Resume (PDF or Word)</label><input type="file" id="cv-file" accept=".pdf,.doc,.docx" style="margin-top:6px"/><button class="btn btn-ghost btn-sm" style="margin-top:8px" onclick="uploadCV()">Upload CV</button></div>
          <div><label class="form-label">Certificate</label><input type="file" id="cert-file" accept=".pdf,image/*" style="margin-top:6px"/><button class="btn btn-ghost btn-sm" style="margin-top:8px" onclick="uploadCert()">Upload Certificate</button></div>
        </div>
      </div>` : role === 'student' && extra ? `
      <div class="card" style="padding:28px">
        <h3 style="font-size:16px;font-weight:700;color:var(--navy);margin-bottom:20px">Learning Info</h3>
        <div class="form-group"><label class="form-label">Category</label>
          <select class="input" id="s-category">
            ${CATEGORIES.map(c => `<option value="${c.id}" ${extra.category === c.id ? 'selected' : ''}>${c.label}</option>`).join('')}
          </select>
        </div>
        <div class="form-group"><label class="form-label">School Level</label>
          <select class="input" id="s-level"><option ${extra.school_level === 'Primary' ? 'selected' : ''}>Primary</option><option ${extra.school_level === 'Secondary' ? 'selected' : ''}>Secondary</option><option ${extra.school_level === 'University' ? 'selected' : ''}>University</option></select></div>
        <div class="form-group"><label class="form-label">Subjects Needed</label><input class="input" id="s-subs" value="${(extra.subjects_needed || []).join(', ')}"/></div>
        <div class="form-group"><label class="form-label">Preferred Mode</label>
          <select class="input" id="s-mode"><option value="online" ${extra.preferred_mode === 'online' ? 'selected' : ''}>Online</option><option value="home" ${extra.preferred_mode === 'home' ? 'selected' : ''}>Home Visit</option></select></div>
        <div class="form-group"><label class="form-label">Home Location</label><select class="input" id="s-loc">
  <option value="">— Select district —</option>
  ${RWANDA_DISTRICTS.map(d=>`<option value="${d}" ${extra.home_location===d?'selected':''}>${d}</option>`).join('')}
</select></div>
        <button class="btn btn-primary" onclick="saveStudentProfile()">Save</button>
      </div>` : '<div></div>'}
    </div>
    <div class="card" style="padding:28px;margin-top:20px">
      <h3 style="font-size:16px;font-weight:700;color:var(--navy);margin-bottom:16px">Change Password</h3>
      <div style="display:flex;gap:14px;align-items:flex-end;max-width:400px">
        <div class="form-group" style="flex:1;margin-bottom:0"><label class="form-label">New Password</label><div style="position:relative"><input class="input" id="new-pw" type="password" placeholder="Min 6 characters"/><button class="btn btn-ghost" id="new-pw-btn" onclick="togglePwVisibility('new-pw','new-pw-btn')" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);padding:4px;border:none;background:none;cursor:pointer"><i class="fas fa-eye"></i></button></div></div>
        <button class="btn btn-ghost" onclick="changePassword()">Update</button>
      </div>
    </div>
    `))
      } catch (e) { toast(e.message, 'err') }
    }

    async function saveProfile() {
      try {
        const name = document.getElementById('p-name')?.value?.trim()
        const phone = document.getElementById('p-phone')?.value?.trim()
        // Update via auth change-password endpoint — profile update handled differently
        toast('Profile saved ✅')
      } catch (e) { toast(e.message, 'err') }
    }

    async function saveTutorProfile() {
      try {
        const bio = document.getElementById('t-bio')?.value||''
  if(bio.length < 200){ toast('Bio must be at least 200 characters','err'); return }
  if(bio.length > 500){ toast('Bio cannot exceed 500 characters','err'); return }
        const data = {
          bio: document.getElementById('t-bio')?.value || null,
          hourly_rate: parseFloat(document.getElementById('t-rate')?.value) || null,
          is_available: document.getElementById('t-avail')?.value === 'true'
        }
        await api('/tutors/me', { method: 'PATCH', body: JSON.stringify(data) })
        toast('Profile updated ✅')
      } catch (e) { toast(e.message, 'err') }
    }

    async function saveStudentProfile() {
      try {
        const data = {
          category: document.getElementById('s-category')?.value,
          school_level: document.getElementById('s-level')?.value,
          subjects_needed: document.getElementById('s-subs')?.value?.split(',').map(s => s.trim()).filter(Boolean) || [],
          preferred_mode: document.getElementById('s-mode')?.value,
          home_location: document.getElementById('s-loc')?.value || null,
        }
        await api('/students/me', { method: 'PATCH', body: JSON.stringify(data) })
        toast('Profile updated ✅')
        renderProfile()
      } catch (e) { toast(e.message, 'err') }
    }

    async function changePassword() {
      const pw = document.getElementById('new-pw')?.value
      if (!pw || pw.length < 6) { toast('Password must be at least 6 characters', 'err'); return }
      try {
        await api(`/auth/change-password?new_password=${encodeURIComponent(pw)}`, { method: 'POST' })
        toast('Password updated ✅')
        document.getElementById('new-pw').value = ''
      } catch (e) { toast(e.message, 'err') }
    }

    async function uploadCV() {
      const file = document.getElementById('cv-file')?.files?.[0]
      if (!file) { toast('Select a file first', 'err'); return }
      try {
        const fd = new FormData(); fd.append('file', file)
        await apiUpload('/tutors/me/upload-cv', fd)
        toast('CV uploaded ✅')
      } catch (e) { toast(e.message, 'err') }
    }

    async function uploadCert() {
      const file = document.getElementById('cert-file')?.files?.[0]
      if (!file) { toast('Select a file first', 'err'); return }
      try {
        const fd = new FormData(); fd.append('file', file)
        await apiUpload('/tutors/me/upload-certificate', fd)
        toast('Certificate uploaded ✅')
      } catch (e) { toast(e.message, 'err') }
    }

    // ════════════════════════════════════════════════════════════
    // ADMIN — TUTORS
    // ════════════════════════════════════════════════════════════
    async function deleteTutor(id, name){
  if(!confirm(`Permanently delete tutor ${name}? This cannot be undone.`)) return
  try{
    await api(`/tutors/admin/${id}`, { method: 'DELETE' })
    toast('Tutor deleted ✅')
    bustCache('/tutors')
    renderAdminTutors()
  }catch(e){ toast(e.message,'err') }
}

async function deleteStudent(id, name){
  if(!confirm(`Permanently delete student ${name}? This cannot be undone.`)) return
  try{
    await api(`/students/admin/${id}`, { method: 'DELETE' })
    toast('Student deleted ✅')
    bustCache('/students')
    renderAdminStudents()
  }catch(e){ toast(e.message,'err') }
}
    async function renderAdminTutors() {
      render(dashWrap('admin-tutors', `<div class="loader-center"><div class="spinner"></div></div>`))
      try {
        const tab = State.tab || 'pipeline'
        const [apps, all] = await Promise.all([api('/tutors/admin/applications'), api('/tutors/admin/all')])
        const stages = ['applicant', 'under_review', 'written_exam', 'interview']
        const stageName = { applicant: 'Applied', under_review: 'Under Review', written_exam: 'Written Exam', interview: 'Interview', approved: 'Approved', rejected: 'Rejected' }
        const stageColor = { applicant: '#EEF2FF', under_review: '#FEF3C7', written_exam: '#DBEAFE', interview: '#F0FDF4' }

        render(dashWrap('admin-tutors', `
    <div class="page-header"><div><h1 class="page-title">Tutor Management</h1><p class="page-subtitle">${all.length} tutors total • ${apps.length} in pipeline</p></div></div>
    <div class="tabs">
      <button class="tab-btn ${tab === 'pipeline' ? 'active' : ''}" onclick="State.tab='pipeline';renderAdminTutors()">Recruitment Pipeline</button>
      <button class="tab-btn ${tab === 'all' ? 'active' : ''}" onclick="State.tab='all';renderAdminTutors()">All Tutors</button>
    </div>
    ${tab === 'pipeline' ? `
    <div class="pipeline">
      ${stages.map(s => {
          const items = apps.filter(t => t.status === s)
          return `
        <div class="pipeline-col">
          <div class="pipeline-header" style="color:var(--navy)">
            <span>${stageName[s]}</span>
            <span class="badge badge-gray">${items.length}</span>
          </div>
          ${items.map(tc => `
          <div class="pipeline-card" style="border-left-color:var(--blue)" onclick="openTutorModal(_get('${_reg(tc)}'))">
            <div style="display:flex;align-items:center;gap:9px;margin-bottom:8px">
              ${avi(tc.profiles?.full_name || 'T', 32)}
              <div style="min-width:0">
                <div style="font-weight:700;font-size:13px;color:var(--navy);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${tc.profiles?.full_name || '—'}</div>
                <div style="font-size:11px;color:var(--g400)">${tc.profiles?.email || ''}</div>
              </div>
            </div>
            <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px">
              ${(tc.subjects || []).slice(0, 2).map(sub => `<span class="badge badge-blue" style="font-size:10px">${sub}</span>`).join('')}
            </div>
            <div style="font-size:11px;color:var(--g400)">${fmtShort(tc.created_at)}</div>
          </div>`).join('')}
          ${!items.length ? `<div style="text-align:center;padding:20px;color:var(--g400);font-size:12px">Empty</div>` : ''}
        </div>`}).join('')}
    </div>` : `
    <div class="table-wrap">
      <table>
        <thead><tr><th>Tutor</th><th>Phone</th><th>Subjects</th><th>Status</th><th>Rating</th><th>Sessions</th><th>Actions</th></tr></thead>
        <tbody>
          ${all.map(t => `
          <tr>
            <td><div style="display:flex;align-items:center;gap:10px">${avi(t.profiles?.full_name || 'T', 34)}<div><div style="font-weight:600">${t.profiles?.full_name || '—'}</div><div style="font-size:11px;color:var(--g400)">${t.profiles?.email || ''}</div></div></div></td>
            <td style="font-size:13px">${t.profiles?.phone || '<span style="color:var(--g400)">—</span>'}</td>
            <td>${(t.subjects || []).slice(0, 2).map(sub => `<span class="badge badge-blue" style="margin-right:4px">${sub}</span>`).join('')}</td>
            <td>${statusBadge(t.status)}</td>
            <td><span class="stars">${stars(t.rating)}</span> ${(t.rating || 0).toFixed(1)}</td>
            <td>${t.total_sessions || 0}</td>
            <td>
              <div style="display:flex;gap:6px">
                <button class="btn btn-ghost btn-sm" onclick="openTutorModal(_get('${_reg(t)}'))">Review →</button>
                <button class="btn btn-ghost btn-sm" style="color:var(--red)" onclick="deleteTutor('${t.id}','${(t.profiles?.full_name||'').replace(/'/g,"\\'")}')"><i data-lucide="trash-2" style="width:16px;height:16px"></i></button>
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`}
    <div id="modal-root"></div>
    `))
      } catch (e) { toast(e.message, 'err') }
    }

   
    function onTutorStatusChange(val){
  const scoreFields   = document.getElementById('modal-score-fields')
  const rejectWrap    = document.getElementById('modal-rejection-wrap')
  const examCodeWrap  = document.getElementById('modal-exam-code-wrap')
  if(scoreFields)  scoreFields.style.display  = ['interview','approved'].includes(val) ? 'grid' : 'none'
  if(rejectWrap)   rejectWrap.style.display   = val === 'rejected' ? 'block' : 'none'
  if(examCodeWrap) examCodeWrap.style.display = val === 'written_exam' ? 'block' : 'none'
  const examTimeWrap = document.getElementById('modal-exam-time-wrap')
  if(examTimeWrap) examTimeWrap.style.display = val === 'written_exam' ? 'block' : 'none'
}
function generateExamCode(){
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const code = Array.from({length:8}, () => chars[Math.floor(Math.random()*chars.length)]).join('')
  const input = document.getElementById('modal-exam-code')
  if(input) input.value = code
}

async function saveTutorStatus(tutorId){
  const status         = document.getElementById('modal-status')?.value
  const writtenScore   = document.getElementById('modal-written-score')?.value
  const interviewScore = document.getElementById('modal-interview-score')?.value
  const rejectReason   = document.getElementById('modal-rejection-reason')?.value
  const salary         = document.getElementById('modal-rate')?.value
  const salaryFreq     = document.getElementById('modal-frequency')?.value
  const notes          = document.getElementById('modal-notes')?.value

  try{
    await api(`/tutors/admin/${tutorId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({
        exam_code:           document.getElementById('modal-exam-code')?.value?.trim().toUpperCase() || null,
        status,
        written_exam_score:  writtenScore   ? parseInt(writtenScore)   : null,
        interview_score:     interviewScore ? parseInt(interviewScore) : null,
        rejection_reason:    rejectReason   || null,
        salary_amount:       salary         ? parseFloat(salary)       : null,
        salary_frequency:    salaryFreq     || null,
        admin_notes:         notes          || null,
        exam_time_minutes: document.getElementById('modal-exam-time')?.value ? parseInt(document.getElementById('modal-exam-time').value) : null,
      })
    })
    document.querySelector('.modal-overlay')?.remove()
    toast('Status updated and email sent to tutor ✅')
    bustCache('/tutors')
    navigate('admin-tutors')
  }catch(e){
    toast(e.message,'err')
  }
}

    function openTutorModal(tutor) {
      if (typeof tutor === 'string') tutor = _get(tutor) || JSON.parse(tutor)
      const stages = ['applicant', 'under_review', 'written_exam', 'interview', 'approved', 'rejected', 'suspended']
      document.getElementById('modal-root').innerHTML = `
  <div class="modal-overlay" onclick="if(event.target===this)this.remove()">
    <div class="modal" style="max-width:580px">
      <div class="modal-header">
        <span class="modal-title">${tutor.profiles?.full_name || 'Tutor'}</span>
        <button class="modal-close" onclick="document.querySelector('.modal-overlay').remove()">✕</button>
      </div>
      <div class="modal-body">
        <div style="display:flex;gap:14px;margin-bottom:18px">
          ${avi(tutor.profiles?.full_name || 'T', 54)}
          <div>
            <div style="font-weight:700;color:var(--navy)">${tutor.profiles?.full_name}</div>
            <div style="font-size:13px;color:var(--g400)">${tutor.qualification || '—'} • ${tutor.experience_years || 0} yrs exp</div>
            <div style="margin-top:6px">${statusBadge(tutor.status)}</div>
          </div>
        </div>
        <div class="grid-2" style="margin-bottom:12px">
          <div><div class="form-label">Subjects</div><div style="margin-top:4px">${(tutor.subjects || []).map(s => `<span class="badge badge-blue" style="margin:2px">${s}</span>`).join('')}</div></div>
          <div><div class="form-label">Levels</div><div style="margin-top:4px">${(tutor.levels || []).map(l => `<span class="badge badge-gray" style="margin:2px">${l}</span>`).join('')}</div></div>
        </div>
        ${tutor.bio ? `<div class="form-group"><div class="form-label">Bio</div><div style="font-size:13px;color:var(--g600);margin-top:4px;line-height:1.55">${tutor.bio}</div></div>` : ''}
        <div class="divider"></div>
       <div class="form-group">
          <div class="form-label">Documents</div>
          <div id="tutor-docs-${tutor.id}" style="margin-top:6px">
            <div class="spinner" style="width:16px;height:16px"></div>
          </div>
        </div>
        <div class="divider"></div>
        <div class="form-group"><label class="form-label">Update Status</label>
          <select class="input" id="modal-status" onchange="onTutorStatusChange(this.value)">
            ${stages.map(s => `<option value="${s}" ${tutor.status === s ? 'selected' : ''}>${s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>`).join('')}
          </select>
        </div>
        <div class="form-group" id="modal-exam-code-wrap" style="display:none">
          <label class="form-label">Exam Access Code</label>
          <div style="display:flex;gap:8px">
            <input class="input" id="modal-exam-code" placeholder="e.g. MATH2026" value="${tutor.exam_code||''}" style="text-transform:uppercase;letter-spacing:2px;font-weight:700"/>
            <button type="button" class="btn btn-ghost btn-sm" onclick="generateExamCode()" style="white-space:nowrap">🎲 Generate</button>
          </div>
          <div style="font-size:11px;color:var(--g400);margin-top:4px">Give this code to the tutor — they need it to start the exam</div>
        </div>
        <div class="form-group" id="modal-exam-time-wrap" style="display:none">
          <label class="form-label">Exam Duration (minutes)</label>
          <input class="input" type="number" id="modal-exam-time" min="10" max="180" value="${tutor.exam_time_minutes||60}" placeholder="60"/>
          <div style="font-size:11px;color:var(--g400);margin-top:4px">How long the tutor has to complete the exam</div>
        </div>
        <div class="grid-2" id="modal-score-fields" style="display:none">
          <div class="form-group">
            <label class="form-label">Written Exam Score (0–100)</label>
            <input class="input" type="number" id="modal-written-score" min="0" max="100" placeholder="e.g. 78" value="${tutor.written_exam_score||''}"/>
          </div>
          <div class="form-group">
            <label class="form-label">Interview Score (0–100)</label>
            <input class="input" type="number" id="modal-interview-score" min="0" max="100" placeholder="e.g. 85" value="${tutor.interview_score||''}"/>
          </div>
        </div>
        <div class="form-group" id="modal-rejection-wrap" style="display:none">
          <label class="form-label">Rejection Reason (sent to tutor via email)</label>
          <textarea class="input" id="modal-rejection-reason" rows="2" placeholder="Brief reason...">${tutor.rejection_reason||''}</textarea>
        </div>
        <div class="form-group"><label class="form-label">Admin Notes</label><textarea class="input" id="modal-notes" placeholder="Optional notes...">${tutor.admin_notes || ''}</textarea></div>
        <div class="form-group">
          <label class="form-label">Agreed Salary Amount ($)</label>
          <input class="input" id="modal-rate" type="number" placeholder="e.g. 500" value="${tutor.salary_amount||tutor.hourly_rate||''}"/>
        </div>
        <div class="form-group">
          <label class="form-label">Payment Frequency</label>
          <select class="input" id="modal-frequency">
            <option value="hourly" ${tutor.salary_frequency==='hourly'?'selected':''}>Hourly</option>
            <option value="weekly" ${tutor.salary_frequency==='weekly'?'selected':''}>Weekly</option>
            <option value="monthly" ${tutor.salary_frequency==='monthly'?'selected':''}>Monthly</option>
          </select>
        </div>
        ${tutor.payment_method ? `
        <div style="background:var(--sky);border-radius:8px;padding:10px;font-size:13px;margin-bottom:8px">
          <strong>💳 Tutor Payment Preference:</strong> ${tutor.payment_method.replace('_',' ').toUpperCase()} — ${tutor.payment_details||'—'}
        </div>` : `<div style="font-size:13px;color:var(--orange);margin-bottom:8px">⚠️ Tutor has not set payment preference yet</div>`}
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="document.querySelector('.modal-overlay').remove()">Cancel</button>
        <button class="btn btn-primary" onclick="saveTutorStatus('${tutor.id}')">Save & Send Email</button>
      </div>
    </div>
  </div>`
      setTimeout(() => {
        loadTutorDocs(tutor.id)
        onTutorStatusChange(tutor.status)
      }, 100)
    }

    async function loadTutorDocs(tutorId) {
      try {
        const docs = await api('/tutors/' + tutorId + '/documents')
        const el = document.getElementById('tutor-docs-' + tutorId)
        if (!el) return
        if (!docs.length) {
          el.innerHTML = '<span style="font-size:13px;color:var(--orange)">⚠️ No documents uploaded yet</span>'
          return
        }
        const cv = docs.filter(d => d.file_type === 'cv')
        const certs = docs.filter(d => d.file_type === 'certificate')
        el.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:8px">
        ${cv.map(d => `<a href="${d.file_url}" target="_blank" class="btn btn-ghost btn-sm" style="text-decoration:none;width:fit-content">📄 ${d.file_name}</a>`).join('')}
        ${certs.map(d => `<a href="${d.file_url}" target="_blank" class="btn btn-ghost btn-sm" style="text-decoration:none;width:fit-content">🏅 ${d.file_name}</a>`).join('')}
      </div>`
      } catch (e) {
        const el = document.getElementById('tutor-docs-' + tutorId)
        if (el) el.innerHTML = '<span style="font-size:13px;color:var(--g400)">Could not load documents</span>'
      }
    }

    async function updateTutorStatus(tutorId){
  const status = document.getElementById('modal-status')?.value
  const notes  = document.getElementById('modal-notes')?.value||null
  const score  = document.getElementById('modal-score')?.value
  const rate   = document.getElementById('modal-rate')?.value
  try{
    const frequency = document.getElementById('modal-frequency')?.value
    await api(`/tutors/admin/${tutorId}/status`,{method:'PATCH',body:JSON.stringify({status, admin_notes:notes, exam_score:score?parseInt(score):null, hourly_rate:rate?parseFloat(rate):null, salary_frequency:frequency||null})})
        toast('Tutor status updated ✅')
        document.querySelector('.modal-overlay')?.remove()
        renderAdminTutors()
      } catch (e) { toast(e.message, 'err') }
    }

    // ════════════════════════════════════════════════════════════
    // ADMIN — STUDENTS
    // ════════════════════════════════════════════════════════════
    async function generateReport(studentId, studentName){
  try{
    const res = await api('/progress/report-link', {
      method: 'POST',
      body: JSON.stringify({ student_id: studentId })
    })
    const fullUrl = `${window.location.origin}${window.location.pathname}#report/${res.token}`
    document.getElementById('modal-root').innerHTML = `
    <div class="modal-overlay" onclick="if(event.target===this)this.remove()">
      <div class="modal">
        <div class="modal-header">
          <span class="modal-title">📊 Report Link — ${studentName}</span>
          <button class="modal-close" onclick="document.querySelector('.modal-overlay').remove()">✕</button>
        </div>
        <div class="modal-body">
          <p style="font-size:13px;color:var(--g600);margin-bottom:12px">Share this link with the parent. It expires in 30 days.</p>
          <div style="background:var(--sky);border-radius:var(--rs);padding:12px;word-break:break-all;font-size:12px;color:var(--navy)">${fullUrl}</div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" onclick="document.querySelector('.modal-overlay').remove()">Close</button>
          <button class="btn btn-primary" onclick="navigator.clipboard.writeText('${fullUrl}');toast('Link copied! 📋')">Copy Link 📋</button>
        </div>
      </div>
    </div>`
  }catch(e){
    toast(e.message,'err')
  }
}

  async function renderAdminStudents() {
  render(dashWrap('admin-students', `<div class="loader-center"><div class="spinner"></div></div>`))
  try {
    const [students, tutors, requests] = await Promise.all([
      api('/students/admin/all'),
      api('/tutors/admin/all'),
      api('/students/admin/requests')
    ])
    const approved = tutors.filter(t => t.status === 'approved')
    const pending = requests.filter(r => r.status === 'pending')
    const assigned = students.filter(s => (s.assignments || []).find(a => a.is_active))
    const unassigned = students.filter(s => !(s.assignments || []).find(a => a.is_active))

    render(dashWrap('admin-students', `

    <!-- Page Header -->
    <div class="page-header">
      <div><h1 class="page-title">Students Management</h1>
      <p class="page-subtitle">${students.length} total • ${assigned.length} assigned • ${unassigned.length} unassigned</p></div>
    </div>

    <!-- Stats -->
    <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:24px">
      <div class="card" style="flex:1;min-width:130px;padding:18px;display:flex;align-items:center;gap:12px">
        <div class="stat-icon" style="background:#EEF2FF;color:var(--blue);flex-shrink:0"><i data-lucide="users"></i></div>
        <div><div class="stat-num">${students.length}</div><div class="stat-label">Total Students</div></div>
      </div>
      <div class="card" style="flex:1;min-width:130px;padding:18px;display:flex;align-items:center;gap:12px">
        <div class="stat-icon" style="background:#F0FDF4;color:var(--green);flex-shrink:0"><i data-lucide="check-circle"></i></div>
        <div><div class="stat-num">${assigned.length}</div><div class="stat-label">Assigned</div></div>
      </div>
      <div class="card" style="flex:1;min-width:130px;padding:18px;display:flex;align-items:center;gap:12px">
        <div class="stat-icon" style="background:#FFF7ED;color:var(--orange);flex-shrink:0"><i data-lucide="alert-triangle"></i></div>
        <div><div class="stat-num">${unassigned.length}</div><div class="stat-label">Unassigned</div></div>
      </div>
      <div class="card" style="flex:1;min-width:130px;padding:18px;display:flex;align-items:center;gap:12px">
        <div class="stat-icon" style="background:#FEF2F2;color:var(--red);flex-shrink:0"><i data-lucide="clipboard-list"></i></div>
        <div><div class="stat-num">${pending.length}</div><div class="stat-label">Pending Requests</div></div>
      </div>
    </div>

    <!-- Tutoring Requests -->
    ${pending.length ? `
    <div style="margin-bottom:32px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <h2 style="font-size:18px;font-weight:700;color:var(--navy)">📋 Tutoring Requests <span style="background:#ef4444;color:#fff;border-radius:999px;font-size:12px;padding:2px 8px;margin-left:6px">${pending.length}</span></h2>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Student</th><th>Subject</th><th>Level</th><th>Mode</th><th>Notes</th><th>Actions</th></tr></thead>
          <tbody>
            ${pending.map(r=>`<tr>
              <td><div style="font-weight:600">${r.students?.profiles?.full_name||'—'}</div><div style="font-size:11px;color:var(--g400)">${r.students?.profiles?.email||''}</div></td>
              <td><span class="badge badge-blue">${r.subject||'—'}</span></td>
              <td>${r.level||'—'}</td>
              <td>${r.mode||'—'}</td>
              <td style="font-size:12px;color:var(--g600)">${r.notes||'—'}</td>
              <td><button class="btn btn-primary btn-sm" onclick="openRequestAssignModal('${r.id}','${r.students?.id}','${(r.students?.profiles?.full_name||'').replace(/'/g,"\\'")}',${JSON.stringify(approved).replace(/"/g,'&quot;')})">Assign Tutor</button></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>` : ''}

    <!-- Unassigned Students -->
    <div style="margin-bottom:32px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <h2 style="font-size:18px;font-weight:700;color:var(--navy)">⚠️ Unassigned Students <span style="background:#f59e0b;color:#1a1a1a;border-radius:999px;font-size:12px;padding:2px 8px;margin-left:6px">${unassigned.length}</span></h2>
      </div>
      ${unassigned.length ? `
      <div class="table-wrap">
        <table>
          <thead><tr><th>Student</th><th>Category</th><th>Level</th><th>Subjects</th><th>Mode</th><th>Parent</th><th>Actions</th></tr></thead>
          <tbody>
            ${unassigned.map(s=>`<tr>
              <td>
                <div style="display:flex;align-items:center;gap:10px">
                  ${avi(s.profiles?.full_name||'S', 34, s.profiles?.avatar_url||null)}
                  <div>
                    <div style="font-weight:600">${s.profiles?.full_name||'—'}</div>
                    <div style="font-size:11px;color:var(--g400)">${s.profiles?.email||''}</div>
                  </div>
                </div>
              </td>
              <td><span style="font-size:12px">${CATEGORIES.find(c=>c.id===(s.category||'academic'))?.icon||'📚'} ${CATEGORIES.find(c=>c.id===(s.category||'academic'))?.label||'Academic'}</span></td>
              <td>${s.school_level||'—'}</td>
              <td>${(s.subjects_needed||[]).slice(0,2).map(sub=>`<span class="badge badge-blue" style="margin-right:3px">${sub}</span>`).join('')||'—'}</td>
              <td>${s.preferred_mode||'—'}</td>
              <td>
                <div style="font-size:13px;font-weight:600">${s.parent_name||'—'}</div>
                <div style="font-size:11px;color:var(--g400)">${s.parent_phone||'No phone'}</div>
              </td>
              <td>
                <div style="display:flex;gap:6px;flex-wrap:wrap">
                  <button class="btn btn-primary btn-sm" onclick="openAssignModal('${s.id}','${(s.profiles?.full_name||'').replace(/'/g,"\\'")}',${JSON.stringify(approved).replace(/"/g,'&quot;')},${JSON.stringify(s).replace(/"/g,'&quot;')})">Assign Tutor</button>
                  <button class="btn btn-ghost btn-sm" onclick="generateReport('${s.id}','${(s.profiles?.full_name||'').replace(/'/g,"\\'")}')">📊 Report</button>
                  <button class="btn btn-ghost btn-sm" style="color:var(--red)" onclick="deleteStudent('${s.id}','${(s.profiles?.full_name||'').replace(/'/g,"\\'")}')"><i data-lucide="trash-2" style="width:16px;height:16px"></i></button>
                </div>
              </td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>` : `
      <div class="card" style="padding:24px;text-align:center;color:var(--g400)">
        <div style="font-size:32px;margin-bottom:8px">🎉</div>
        <div>All students are assigned!</div>
      </div>`}
    </div>

    <!-- Assigned Students -->
    <div style="margin-bottom:32px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <h2 style="font-size:18px;font-weight:700;color:var(--navy)">✅ Assigned Students <span style="background:#22c55e;color:#fff;border-radius:999px;font-size:12px;padding:2px 8px;margin-left:6px">${assigned.length}</span></h2>
      </div>
      ${assigned.length ? `
      <div class="table-wrap">
        <table>
          <thead><tr><th>Student</th><th>Category</th><th>Level</th><th>Subjects</th><th>Mode</th><th>Parent</th><th>Assigned Tutor</th><th>Actions</th></tr></thead>
          <tbody>
            ${assigned.map(s=>{
              const active = (s.assignments||[]).find(a=>a.is_active)
              const tutorName = active?.tutors?.profiles?.full_name
              return `<tr>
              <td>
                <div style="display:flex;align-items:center;gap:10px">
                  ${avi(s.profiles?.full_name||'S', 34, s.profiles?.avatar_url||null)}
                  <div>
                    <div style="font-weight:600">${s.profiles?.full_name||'—'}</div>
                    <div style="font-size:11px;color:var(--g400)">${s.profiles?.email||''}</div>
                  </div>
                </div>
              </td>
              <td><span style="font-size:12px">${CATEGORIES.find(c=>c.id===(s.category||'academic'))?.icon||'📚'} ${CATEGORIES.find(c=>c.id===(s.category||'academic'))?.label||'Academic'}</span></td>
              <td>${s.school_level||'—'}</td>
              <td>${(s.subjects_needed||[]).slice(0,2).map(sub=>`<span class="badge badge-blue" style="margin-right:3px">${sub}</span>`).join('')||'—'}</td>
              <td>${s.preferred_mode||'—'}</td>
              <td>
                <div style="font-size:13px;font-weight:600">${s.parent_name||'—'}</div>
                <div style="font-size:11px;color:var(--g400)">${s.parent_phone||'No phone'}</div>
              </td>
              <td><span style="font-weight:600;color:var(--green)">✅ ${tutorName}</span></td>
              <td>
                <div style="display:flex;gap:6px;flex-wrap:wrap">
                  <button class="btn btn-ghost btn-sm" onclick="openAssignModal('${s.id}','${(s.profiles?.full_name||'').replace(/'/g,"\\'")}',${JSON.stringify(approved).replace(/"/g,'&quot;')},${JSON.stringify(s).replace(/"/g,'&quot;')})">🔄 Change</button>
                  <button class="btn btn-ghost btn-sm" onclick="generateReport('${s.id}','${(s.profiles?.full_name||'').replace(/'/g,"\\'")}')">📊 Report</button>
                  <button class="btn btn-ghost btn-sm" style="color:var(--red)" onclick="deleteStudent('${s.id}','${(s.profiles?.full_name||'').replace(/'/g,"\\'")}')"><i data-lucide="trash-2" style="width:16px;height:16px"></i></button>
                </div>
              </td>
            </tr>`}).join('')}}
          </tbody>
        </table>
      </div>` : `
      <div class="card" style="padding:24px;text-align:center;color:var(--g400)">No assigned students yet</div>`}
    </div>

    <div id="modal-root"></div>
    `))
  } catch(e){ toast(e.message,'err') }
}
    async function openRequestAssignModal(requestId, studentId, studentName, approved) {
      const modalHtml = `
  <div class="modal-overlay" onclick="if(event.target===this)this.remove()">
    <div class="modal-box" style="max-width:420px">
      <h3 style="margin-bottom:16px;color:var(--navy)">Assign Tutor to ${studentName}</h3>
      <div class="form-group">
        <label class="form-label">Select Tutor</label>
        <select class="input" id="req-tutor-select">
          <option value="">— Choose approved tutor —</option>
          ${approved.map(t => `<option value="${t.id}">${t.profiles?.full_name || 'Unknown'} — ${(t.subjects || []).join(', ')}</option>`).join('')}
        </select>
      </div>
      <div style="display:flex;gap:10px;margin-top:18px">
        <button class="btn btn-primary btn-full" onclick="submitRequestAssign('${requestId}','${studentId}')">Assign ✅</button>
        <button class="btn btn-ghost" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
      </div>
    </div>
  </div>`
      document.getElementById('modal-root').insertAdjacentHTML('beforeend', modalHtml)
    }

    async function submitRequestAssign(requestId, studentId) {
      const tutorId = document.getElementById('req-tutor-select')?.value
      if (!tutorId) { toast('Please select a tutor', 'err'); return }
      try {
        await api(`/students/admin/requests/${requestId}/assign`, {
          method: 'PATCH',
          body: JSON.stringify({ tutor_id: tutorId })
        })
        document.querySelector('.modal-overlay')?.remove()
        toast('Tutor assigned successfully! ✅')
        bustCache('/students')
        bustCache('/tutors')
        renderAdminStudents()
      } catch (e) {
        toast(e.message, 'err')
      }
    }
    function openAssignModal(studentId, studentName, tutors, student) {
  if (typeof tutors === 'string') tutors = JSON.parse(tutors.replace(/&quot;/g, '"'))
  if (typeof student === 'string') student = JSON.parse(student.replace(/&quot;/g, '"'))
  const prefMode    = student?.preferred_mode || 'online'
  const prefSubjects = (student?.subjects_needed || []).join(', ') || '—'
  const prefLevel   = student?.school_level || '—'
  const prefLocation = student?.home_location || '—'

  document.getElementById('modal-root').innerHTML = `
  <div class="modal-overlay" onclick="if(event.target===this)this.remove()">
    <div class="modal">
      <div class="modal-header"><span class="modal-title">Assign Tutor to ${studentName}</span><button class="modal-close" onclick="document.querySelector('.modal-overlay').remove()">✕</button></div>
      <div class="modal-body">
        <div style="background:var(--sky);border-radius:var(--rs);padding:14px;margin-bottom:16px">
          <div style="font-weight:700;color:var(--navy);margin-bottom:8px">📋 Student Preferences</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:13px">
            <div><span style="color:var(--g400)">Subjects:</span> <strong>${prefSubjects}</strong></div>
            <div><span style="color:var(--g400)">Level:</span> <strong>${prefLevel}</strong></div>
            <div><span style="color:var(--g400)">Mode:</span> <strong>${prefMode}</strong></div>
            <div><span style="color:var(--g400)">Location:</span> <strong>${prefLocation}</strong></div>
          </div>
        </div>
        <div class="form-group"><label class="form-label">Select Tutor *</label>
          <select class="input" id="assign-tutor">
            <option value="">Choose a tutor...</option>
            ${tutors.map(t => `<option value="${t.id}">${t.profiles?.full_name} — ${(t.subjects || []).join(', ')}</option>`).join('')}
          </select>
        </div>
        <div class="form-group"><label class="form-label">Subject *</label>
          <input class="input" id="assign-subject" placeholder="e.g. Mathematics" value="${(student?.subjects_needed||[])[0]||''}"/>
        </div>
        <div class="form-group"><label class="form-label">Mode</label>
          <select class="input" id="assign-mode">
            <option value="online" ${prefMode==='online'?'selected':''}>Online</option>
            <option value="home" ${prefMode==='home'?'selected':''}>Home Visit</option>
            <option value="blended" ${prefMode==='blended'?'selected':''}>Blended</option>
          </select>
        </div>
        <div class="form-group"><label class="form-label">Notes</label><input class="input" id="assign-notes" placeholder="Optional notes..."/></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="document.querySelector('.modal-overlay').remove()">Cancel</button>
        <button class="btn btn-primary" onclick="doAssign('${studentId}')">Assign Tutor ✅</button>
      </div>
    </div>
  </div>`
}

    async function doAssign(studentId) {
      const tutorId = document.getElementById('assign-tutor')?.value
      const subject = document.getElementById('assign-subject')?.value?.trim()
      const mode = document.getElementById('assign-mode')?.value
      const notes = document.getElementById('assign-notes')?.value || null
      if (!tutorId || !subject) { toast('Please select a tutor and subject', 'err'); return }
      try {
        await api('/students/admin/assign', { method: 'POST', body: JSON.stringify({ student_id: studentId, tutor_id: tutorId, subject, mode, notes }) })
        toast('Tutor assigned successfully! 🎉')
        bustCache('/students')
        bustCache('/tutors')
        document.querySelector('.modal-overlay')?.remove()
        renderAdminStudents()
      } catch (e) { toast(e.message, 'err') }
    }

    // ════════════════════════════════════════════════════════════
    // ADMIN — SESSIONS
    // ════════════════════════════════════════════════════════════
    async function renderAdminSessions() {
      render(dashWrap('admin-sessions', `<div class="loader-center"><div class="spinner"></div></div>`))
      try {
        const tab = State.tab || 'all'
        const sessions = await api('/sessions/admin/all' + (tab !== 'all' ? `?status=${tab}` : ''))
        const [students, tutors] = await Promise.all([api('/students/admin/all'), api('/tutors/admin/all')])
        const approved = tutors.filter(t => t.status === 'approved')
        render(dashWrap('admin-sessions', `
    <div class="page-header">
      <div><h1 class="page-title">Sessions</h1><p class="page-subtitle">${sessions.length} sessions</p></div>
      <button class="btn btn-primary" onclick="openCreateSession()">+ Schedule Session</button>
    </div>
    <div class="tabs">
      ${['all', 'scheduled', 'completed', 'cancelled'].map(s => `<button class="tab-btn ${tab === s ? 'active' : ''}" onclick="State.tab='${s}';renderAdminSessions()">${s.charAt(0).toUpperCase() + s.slice(1)}</button>`).join('')}
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Subject</th><th>Student</th><th>Tutor</th><th>Scheduled</th><th>Duration</th><th>Mode</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          ${sessions.map(s => `
          <tr>
            <td><strong>${s.subject}</strong></td>
            <td>${s.students?.profiles?.full_name || '—'}</td>
            <td>${s.tutors?.profiles?.full_name || '—'}</td>
            <td>${fmt(s.scheduled_at)}</td>
            <td>${s.duration_mins} min</td>
            <td><span class="badge badge-gray">${s.mode}</span></td>
            <td>${statusBadge(s.status)}</td>
            <td>
              <div style="display:flex;gap:4px;flex-wrap:wrap">
                <button class="btn btn-secondary btn-sm" onclick="adminOpenLab('${s.id}','${(s.students?.profiles?.full_name||'').replace(/'/g,"\\'")}','${(s.tutors?.profiles?.full_name||'').replace(/'/g,"\\'")}')">⚗️ Lab</button>
                ${s.status === 'scheduled' ? `<button class="btn btn-success btn-sm" onclick="updateSession('${s.id}','completed')">✅</button>` : ''}
                ${s.status === 'scheduled' ? `<button class="btn btn-danger btn-sm" onclick="updateSession('${s.id}','cancelled')">✕</button>` : ''}
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div id="modal-root"></div>
    `))
      } catch (e) { toast(e.message, 'err') }
    }
    function adminOpenLab(sessionId, studentName, tutorName) {
      window._wbInstitutionName = 'Admin View';
      State.user = { ...State.user, _adminLabOverride: true };
      renderWhiteboard(sessionId);
    }

    function openCreateSession(students, tutors) {
      if (typeof students === 'string') students = JSON.parse(students.replace(/&quot;/g, '"'))
      if (typeof tutors === 'string') tutors = JSON.parse(tutors.replace(/&quot;/g, '"'))
      document.getElementById('modal-root').innerHTML = `
  <div class="modal-overlay" onclick="if(event.target===this)this.remove()">
    <div class="modal">
      <div class="modal-header"><span class="modal-title">Schedule Session</span><button class="modal-close" onclick="document.querySelector('.modal-overlay').remove()">✕</button></div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">Student *</label>
          <select class="input" id="cs-student"><option value="">Select student...</option>${students.map(s => `<option value="${s.id}">${s.profiles?.full_name}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Tutor *</label>
          <select class="input" id="cs-tutor"><option value="">Select tutor...</option>${tutors.map(t => `<option value="${t.id}">${t.profiles?.full_name}</option>`).join('')}</select></div>
        <div class="grid-2">
          <div class="form-group"><label class="form-label">Subject *</label><input class="input" id="cs-subject" placeholder="e.g. Mathematics"/></div>
          <div class="form-group"><label class="form-label">Duration (mins)</label><input class="input" id="cs-dur" type="number" value="60" min="30"/></div>
        </div>
        <div class="grid-2">
          <div class="form-group"><label class="form-label">Date & Time *</label><input class="input" id="cs-date" type="datetime-local"/></div>
          <div class="form-group"><label class="form-label">Mode</label>
            <select class="input" id="cs-mode"><option value="online">Online</option><option value="home">Home Visit</option></select></div>
        </div>
        <div class="form-group"><label class="form-label">Meeting Link</label><input class="input" id="cs-link" placeholder="https://zoom.us/..."/></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="document.querySelector('.modal-overlay').remove()">Cancel</button>
        <button class="btn btn-primary" onclick="createSession()">Schedule Session 📅</button>
      </div>
    </div>
  </div>`
    }

    async function createSession() {
      const student = document.getElementById('cs-student')?.value
      const tutor = document.getElementById('cs-tutor')?.value
      const subject = document.getElementById('cs-subject')?.value?.trim()
      const date = document.getElementById('cs-date')?.value
      if (!student || !tutor || !subject || !date) { toast('Please fill all required fields', 'err'); return }
      try {
        await api('/sessions/', {
          method: 'POST', body: JSON.stringify({
            student_id: student, tutor_id: tutor, subject,
            mode: document.getElementById('cs-mode')?.value || 'online',
            scheduled_at: new Date(date).toISOString(),
            duration_mins: parseInt(document.getElementById('cs-dur')?.value) || 60,
            meeting_link: document.getElementById('cs-link')?.value || null,
          })
        })
        toast('Session scheduled! 📅')
        bustCache('/sessions')
        document.querySelector('.modal-overlay')?.remove()
        renderAdminSessions()
      } catch (e) { toast(e.message, 'err') }
    }

    async function updateSession(id, status) {
      try {
        await api(`/sessions/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) })
        toast(`Session marked as ${status}`)
        bustCache('/sessions')
        renderAdminSessions()
      } catch (e) { toast(e.message, 'err') }
    }

    // ════════════════════════════════════════════════════════════
    // ADMIN — PAYMENTS
    // ════════════════════════════════════════════════════════════
    async function markInvoicePaid(invoiceId, studentName, studentId){
  if(!confirm('Mark invoice as paid for ' + studentName + '?')) return
  try{
    await api('/payments/invoices/' + invoiceId + '/paid', {
      method: 'PATCH'
    })
    toast('Invoice marked as paid! ✅')
    bustCache('/payments')
    renderAdminPayments()
  }catch(e){
    toast(e.message, 'err')
  }
}

    async function renderAdminPayments() {
      render(dashWrap('admin-payments', `<div class="loader-center"><div class="spinner"></div></div>`))
      try {
        const tab = State.tab || 'invoices'
        const [summary, invoices, students] = await Promise.all([
          api('/payments/summary/admin'), api('/payments/invoices/admin'),
          api('/students/admin/all')
        ])
        render(dashWrap('admin-payments', `
    <div class="page-header"><div><h1 class="page-title">Payments</h1><p class="page-subtitle">Revenue & billing management</p></div>
      <button class="btn btn-primary" onclick="openInvoiceModal(${JSON.stringify(students).replace(/"/g, '&quot;')})">+ Create Invoice</button>
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-icon" style="background:#F0FDF4;color:var(--green)"><i data-lucide="banknote"></i></div><div><div class="stat-num">$${(summary.total_revenue || 0).toFixed(0)}</div><div class="stat-label">Total Revenue</div></div></div>
      <div class="stat-card"><div class="stat-icon" style="background:#FEF3C7;color:var(--orange)"><i data-lucide="hourglass"></i></div><div><div class="stat-num">$${(summary.pending_fees || 0).toFixed(0)}</div><div class="stat-label">Pending Fees</div></div></div>
      <div class="stat-card"><div class="stat-icon" style="background:#EEF2FF;color:var(--blue)"><i data-lucide="users"></i></div><div><div class="stat-num">$${(summary.salary_paid || 0).toFixed(0)}</div><div class="stat-label">Salaries Paid</div></div></div>
      <div class="stat-card"><div class="stat-icon" style="background:#F5F3FF;color:purple"><i data-lucide="trending-up"></i></div><div><div class="stat-num">$${(summary.net_income || 0).toFixed(0)}</div><div class="stat-label">Net Income</div></div></div>
    </div>
    <div class="tabs">
      <button class="tab-btn ${tab === 'invoices' ? 'active' : ''}" onclick="State.tab='invoices';renderAdminPayments()">Student Invoices</button>
      <button class="tab-btn ${tab === 'salaries' ? 'active' : ''}" onclick="State.tab='salaries';renderAdminPayments()">Tutor Salaries</button>
    </div>
    ${tab === 'invoices' ? `
    <div class="table-wrap">
      <table>
        <thead><tr><th>Student</th><th>Amount</th><th>Package</th><th>Due Date</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          ${invoices.map(i => `<tr>
            <td>${i.students?.profiles?.full_name || '—'}</td>
            <td><strong>$${parseFloat(i.amount).toFixed(2)}</strong></td>
            <td>${i.payment_packages?.name || 'Custom'}</td>
            <td>${i.due_date ? fmtShort(i.due_date) : '—'}</td>
            <td>${statusBadge(i.status)}</td>
<td>
  ${i.status === 'pending' || i.status === 'overdue' ? 
    `<button class="btn btn-primary btn-sm" onclick="markInvoicePaid('${i.id}','${i.students?.profiles?.full_name||''}','${i.student_id}')">✅ Mark Paid</button>` : 
    `<span style="color:var(--g400);font-size:13px">—</span>`}
</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>` : `
    <div class="empty-state"><div class="empty-icon" style="color:var(--g400)"><i data-lucide="users" style="width:48px;height:48px;stroke-width:1.5"></i></div><div class="empty-title">Tutor Salaries</div><div class="empty-sub">Salary records will appear here</div></div>`}
    <div id="modal-root"></div>
    `))
      } catch (e) { toast(e.message, 'err') }
    }

    function openInvoiceModal(students) {
      if (typeof students === 'string') students = JSON.parse(students.replace(/&quot;/g, '"'))
      document.getElementById('modal-root').innerHTML = `
  <div class="modal-overlay" onclick="if(event.target===this)this.remove()">
    <div class="modal">
      <div class="modal-header"><span class="modal-title">Create Invoice</span><button class="modal-close" onclick="document.querySelector('.modal-overlay').remove()">✕</button></div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">Student *</label>
          <select class="input" id="inv-student"><option value="">Select student...</option>${students.map(s => `<option value="${s.id}">${s.profiles?.full_name}</option>`).join('')}</select></div>
        <div class="grid-2">
          <div class="form-group"><label class="form-label">Amount ($) *</label><input class="input" id="inv-amount" type="number" min="0" step="0.01" placeholder="0.00"/></div>
          <div class="form-group"><label class="form-label">Due Date</label><input class="input" id="inv-due" type="date"/></div>
        </div>
        <div class="form-group"><label class="form-label">Notes</label><input class="input" id="inv-notes" placeholder="Invoice description..."/></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="document.querySelector('.modal-overlay').remove()">Cancel</button>
        <button class="btn btn-primary" onclick="createInvoice()">Create Invoice 💳</button>
      </div>
    </div>
  </div>`
    }

    async function createInvoice() {
      const studentId = document.getElementById('inv-student')?.value
      const amount = parseFloat(document.getElementById('inv-amount')?.value)
      const due = document.getElementById('inv-due')?.value
      const notes = document.getElementById('inv-notes')?.value || null
      if (!studentId || !amount) { toast('Please fill all required fields', 'err'); return }
      try {
        await api('/payments/invoices', { method: 'POST', body: JSON.stringify({ student_id: studentId, amount, due_date: due || null, notes }) })
        toast('Invoice created! 💳')
        bustCache('/payments')
        document.querySelector('.modal-overlay')?.remove()
        renderAdminPayments()
      } catch (e) { toast(e.message, 'err') }
    }

    // ════════════════════════════════════════════════════════════
// BOOT
// ════════════════════════════════════════════════════════════

// Parse the URL path into a State.page value
// ════════════════════════════════════════════════════════════
// BOOT LOGIC (Replaced for 404 Fix & SEO)
// ════════════════════════════════════════════════════════════

function bootFromUrl() {
  const path = window.location.pathname;
  let clean = path.replace(/^\//, '').replace(/\/$/, '');

  if (clean === '' || clean === 'index.html') {
    State.page = 'landing';
  } else if (clean === 'news') {
    State.page = 'news';
  } else if (clean.startsWith('news/')) {
    State.page = 'news-article/' + clean.replace('news/', '');
   } else if (clean === 'courses') {
  State.page = 'courses';
} else if (clean === 'my-courses') {
  State.page = 'my-courses';
} else if (clean === 'admin-courses') {
  State.page = 'admin-courses';
  } else if (clean === 'shop') {
    State.page = 'shop';
  } else if (clean.startsWith('shop/')) {
    State.page = 'shop-product-' + clean.replace('shop/', '');
  } else {
    const validPages = [
      'about', 'privacy', 'terms', 'login', 'register', 'dashboard', 
      'sessions', 'messages', 'profile', 'notifications', 'tutors', 
      'cart', 'wishlist', 'my-orders', 'forum', 'exam', 'quiz',
      'admin-tutors', 'admin-students', 'admin-sessions', 
      'admin-payments', 'admin-exam', 'admin-shop'
    ];
    
    if (validPages.includes(clean)) {
      State.page = clean;
    } else if (clean.startsWith('verify/')) { State.page = 'verify/' + clean.replace('verify/', ''); }
    else if (clean.startsWith('reset/'))  { State.page = 'reset/' + clean.replace('reset/', ''); }
    else if (clean.startsWith('report/')) { State.page = 'report/' + clean.replace('report/', ''); }
    else if (clean.startsWith('lab/')) { State.page = 'public-lab'; State.data.labToken = clean.replace('lab/', ''); }
    else if (clean === 'dashboard' || clean === 'sessions') {
      // If user was in a lab session before refresh, restore it
      const savedLabToken = localStorage.getItem('tc_lab_token');
      if (savedLabToken) { State.page = 'public-lab'; State.data.labToken = savedLabToken; }
    }
    else {
      State.page = '404-not-found';
    }
  }

  State.tab = localStorage.getItem('tc_tab') || null;

  let robotMeta = document.querySelector('meta[name="robots"]');
  if (State.page === '404-not-found') {
    if (!robotMeta) {
      robotMeta = document.createElement('meta');
      robotMeta.name = "robots";
      document.head.appendChild(robotMeta);
    }
    robotMeta.setAttribute('content', 'noindex, nofollow');
  } else {
    robotMeta?.setAttribute('content', 'index, follow');
  }
}
// EXECUTION
// FINAL BOOT EXECUTION
async function refreshAccessToken() {
  const refresh = localStorage.getItem('tc_refresh')
  if (!refresh) return false
  try {
    const r = await fetch(API_URL + '/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refresh })
    })
    if (!r.ok) return false
    const data = await r.json()
    if (data.access_token) {
      localStorage.setItem('tc_access', data.access_token)
      if (data.refresh_token) localStorage.setItem('tc_refresh', data.refresh_token)
      if (data.user) {
        localStorage.setItem('tc_user', JSON.stringify(data.user))
        State.user = data.user
      }
      return true
    }
    return false
  } catch { return false }
}

async function boot() {
  bootFromUrl();
  const page = State.page;

  const authRequired = ['dashboard','sessions','messages','profile','notifications','tutors',
    'admin-tutors','admin-students','admin-sessions','admin-payments',
    'admin-exam','admin-shop','exam','cart','wishlist','my-orders','forum'];

  if (page === '404-not-found') {
    await renderPage();
  } else if (authRequired.includes(page)) {
    if (State.user && getToken()) {
      await renderPage();
      setTimeout(loadUnreadCount, 200);
      setTimeout(startRealtimeSync, 800);
    } else if (localStorage.getItem('tc_refresh')) {
      const ok = await refreshAccessToken()
      if (ok) {
        await renderPage();
        setTimeout(loadUnreadCount, 200);
        setTimeout(startRealtimeSync, 800);
      } else {
        clearAuth();
        navigate('login');
      }
    } else {
      State.user = null;
      navigate('login');
    }
  } else {
    await renderPage();
    if (State.user && getToken()) {
      setTimeout(loadUnreadCount, 200);
      setTimeout(startRealtimeSync, 800);
    }
    // Do NOT silently refresh tokens on public pages — this was sending guests to dashboard
  }
}

// Wait for ALL scripts (auth, shop, dashboard) to finish loading before booting
window.addEventListener('DOMContentLoaded', () => {
  try {
    boot();
  } catch(e) {
    console.error('Boot error:', e);
    navigate('landing');
  }
});
// --- MOBILE SWIPE-TO-CLOSE LOGIC ---
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', e => {
  const touchEndX = e.changedTouches[0].screenX;
  const touchEndY = e.changedTouches[0].screenY;
  
  const diffX = touchStartX - touchEndX;
  const diffY = Math.abs(touchStartY - touchEndY);

  // If swipe is horizontal (left) and longer than 70px, and not a vertical scroll
  if (diffX > 70 && diffY < 50) {
    // 1. Close Dashboard Sidebar
    const sidebar = document.getElementById('sidebar');
    if (sidebar && sidebar.classList.contains('open')) {
      closeSidebar();
    }
    // 2. Close Landing Page Hamburger
    const navMenu = document.getElementById('navMenu');
    if (navMenu && navMenu.classList.contains('show')) {
      closeMenu();
    }
  }
}, { passive: true });



// Ensure Close button is visible on Landing Hamburger
function renderCloseInHamburger() {
  const menu = document.getElementById('navMenu');
  if (menu && !document.getElementById('nav-close-x')) {
    const xBtn = document.createElement('button');
    xBtn.id = 'nav-close-x';
    xBtn.innerHTML = '✕ Close Menu';
    xBtn.className = 'btn-o';
    xBtn.style.cssText = 'width:100%; border-color:#f59e0b; color:#f59e0b; margin-bottom:12px; font-weight:800;';
    xBtn.onclick = closeMenu;
    menu.prepend(xBtn);
  }
}
// Wrap the toggle to include the X button
const originalToggle = toggleMenu;
window.toggleMenu = function() {
  originalToggle();
  renderCloseInHamburger();
};
async function renderPublicLab(token) {
  localStorage.setItem('tc_lab_token', token);
  const isHost = State.user && (State.user.role === 'tutor' || State.user.role === 'admin');
  
  let effectiveSessionId = token;

  if (!isHost) {
    const check = await validateGuestLabToken(token);
    if (!check.valid) {
      updatePageSEO({ title: "Access Denied — Majestic Lab", noindex: true });
      render(`<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0D1B40;">
        <div style="background:#fff;border-radius:16px;padding:40px;max-width:400px;text-align:center;box-shadow:0 8px 40px rgba(0,0,0,0.3)">
          <div style="font-size:48px;margin-bottom:16px">🔒</div>
          <h2 style="color:#0D1B40;font-size:20px;font-weight:800;margin-bottom:10px">Access Denied</h2>
          <p style="color:#4A5578;font-size:14px;margin-bottom:24px">${check.reason}</p>
          <a href="/" class="btn btn-primary btn-full" style="text-decoration:none;justify-content:center">← Back to Mathrone Academy</a>
        </div>
      </div>`);
      return;
    }

    toast(`Welcome, ${check.name}! 👋`, 'ok');
    window._wbGuestName = check.name || 'Guest';
    window._wbInstitutionName = check.institution_name || '';
    window._labInstitutionId = check.institution_id || null;
    window._isLabHost = true; // Renters get host privileges
    
    // Safely assign the session ID inside the scope where 'check' exists
    const hashSession = window.location.hash ? window.location.hash.replace('#', '') : null;
    effectiveSessionId = hashSession || check.session_id || token;

    if (check.institution_id) {
      const fp = localStorage.getItem('ml_device_id');
      if (fp) {
        const pingFn = () => fetch(API_URL + `/lab/tokens/${token}/ping`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ device_fingerprint: fp, institution_id: check.institution_id })
        }).catch(() => {});
        pingFn();
        window._labPingInterval = setInterval(pingFn, 3 * 60 * 1000);
      }
    }
  } else {
    window._isLabHost = true;
    const hashSession = window.location.hash ? window.location.hash.replace('#', '') : null;
    if (hashSession) effectiveSessionId = hashSession;
  }

  updatePageSEO({
    title: "Joining Majestic Lab Session",
    description: "Participate in a live virtual STEM session on Mathrone Academy.",
    noindex: true
  });

  renderWhiteboard(effectiveSessionId);
  window._currentLabSessionId = effectiveSessionId;
}
  
function openGenerateLabLinkModal() {
  document.querySelectorAll('.modal-overlay.lab-modal').forEach(m => m.remove());
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay lab-modal';
  overlay.innerHTML = `
    <div class="modal" style="max-width:440px;padding:28px;position:relative;">
      <button onclick="this.closest('.modal-overlay').remove()" style="position:absolute;top:14px;right:14px;background:none;border:none;font-size:20px;cursor:pointer;color:var(--g400);line-height:1;" title="Close">✕</button>
      <h3 style="font-size:17px;font-weight:800;color:var(--navy);margin-bottom:4px">⚗️ Generate Lab Access Link</h3>
      <p style="font-size:12px;color:var(--g400);margin-bottom:20px">The link only activates on the first device that opens it.</p>
      <div class="form-group">
        <label class="form-label">Buyer / Guest Name</label>
        <input class="input" id="lab-link-name" placeholder="e.g. Jean Paul Uwimana">
      </div>
      <div class="form-group">
        <label class="form-label">Amount Paid (RWF)</label>
        <input class="input" id="lab-link-amount" type="number" placeholder="e.g. 15000">
      </div>
      <div class="form-group">
        <label class="form-label">Access Duration</label>
        <select class="input" id="lab-link-duration">
          <option value="1">1 hour</option>
          <option value="3">3 hours</option>
          <option value="24" selected>1 day</option>
          <option value="72">3 days</option>
          <option value="168">1 week</option>
          <option value="720">1 month</option>
        </select>
      </div>
      <div style="display:flex;gap:10px;margin-top:8px">
        <button class="btn btn-primary btn-full" id="lab-generate-btn" onclick="createGuestLabLink()">🔗 Generate Link</button>
        <button class="btn btn-ghost" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
      </div>
      <div id="lab-link-result" style="margin-top:16px;display:none;background:var(--sky);border-radius:10px;padding:14px">
        <p style="font-size:12px;font-weight:700;color:var(--navy);margin-bottom:6px">✅ Link Generated — share this:</p>
        <div style="display:flex;gap:8px;align-items:center">
          <input class="input" id="lab-link-output" readonly style="font-size:12px;background:#fff;flex:1;">
          <button class="btn btn-sm btn-gold" onclick="copyLabLink()">📋 Copy</button>
        </div>
        <p id="lab-link-expiry" style="font-size:11px;color:var(--g600);margin-top:6px"></p>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if(e.target === overlay) overlay.remove(); });
}

async function createGuestLabLink() {
  const name = document.getElementById('lab-link-name')?.value.trim();
  const amount = document.getElementById('lab-link-amount')?.value.trim();
  const hours = parseInt(document.getElementById('lab-link-duration')?.value || '24');
  const btn = document.getElementById('lab-generate-btn');
  if (!name) { toast('Please enter the guest name', 'err'); return; }
  if (btn) { btn.disabled = true; btn.textContent = 'Generating...'; }
  try {
    const result = await api('/lab/tokens', {
      method: 'POST',
      body: JSON.stringify({ buyer_name: name, amount_paid: amount ? parseFloat(amount) : null, hours })
    });
    const link = `${window.location.origin}/lab/${result.token}`;
    const expiry = result.expires_at ? new Date(result.expires_at).toLocaleString() : 'No expiry set';
    document.getElementById('lab-link-output').value = link;
    document.getElementById('lab-link-expiry').textContent = `Expires: ${expiry} | Buyer: ${name} | Paid: ${amount || '—'} RWF`;
    document.getElementById('lab-link-result').style.display = 'block';
    toast(`Link generated for ${name} ✅`);
    } catch(e) { 
    toast(e.message, 'err'); 
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = '🔗 Generate Link'; }
  }
}

function copyLabLink() {
  const input = document.getElementById('lab-link-output');
  if (input) { navigator.clipboard.writeText(input.value); toast('Link copied! 📋'); }
}

async function validateGuestLabToken(token) {
  // Generate or retrieve a stable device fingerprint for this browser
  const fp = localStorage.getItem('ml_device_id') || (() => {
    const id = 'dev_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('ml_device_id', id);
    return id;
  })(); 
  try {
    const result = await fetch(API_URL + `/lab/tokens/${token}/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ device_fingerprint: fp })
    });
    if (!result.ok) {
      const err = await result.json().catch(() => ({ detail: 'Access denied.' }));
      return { valid: false, reason: typeof err.detail === 'string' ? err.detail : 'Access denied.' };
    }
    const data = await result.json();
    return { valid: true, name: data.buyer_name, institution_id: data.institution_id, institution_name: data.institution_name || '', session_id: data.session_id || null };
  } catch(e) {
    return { valid: false, reason: 'Could not verify access. Check your connection.' };
  }
}
// ════════════════════════════════════════════════════════════
// INSTITUTION LICENSE MANAGER
// ════════════════════════════════════════════════════════════


async function renderInstitutionList() {
  const el = document.getElementById('institution-list');
  if (!el) return;
  el.innerHTML = '<div style="font-size:13px;color:var(--g400);text-align:center;padding:16px"><div class="spinner"></div></div>';
  try {
    const list = await api('/lab/institutions');
    if (!list.length) { el.innerHTML = '<div style="font-size:13px;color:var(--g400);text-align:center;padding:16px">No institutions yet.</div>'; return; }
    el.innerHTML = `<div class="table-wrap"><table>
      <thead><tr><th>Institution</th><th>Contact</th><th>Licenses</th><th>Expires</th><th>Actions</th></tr></thead>
      <tbody>${list.map(inst => `
        <tr>
          <td data-label="Institution"><strong>${inst.name}</strong><br><span style="font-size:11px;color:var(--g400)">${inst.type}</span></td>
          <td data-label="Contact">${inst.contact || '—'}</td>
          <td data-label="Licenses"><span class="badge badge-blue">${inst.licenses} seats</span></td>
          <td data-label="Expires">${inst.expires_at ? new Date(inst.expires_at).toLocaleDateString() : 'No expiry'}</td>
          <td data-label="Actions">
            <button class="btn btn-sm btn-primary" onclick="openInstitutionLabModal('${inst.id}')">🔗 Gen Link</button>
            <button class="btn btn-sm btn-ghost" style="color:var(--red)" onclick="deleteInstitution('${inst.id}')">🗑</button>
          </td>
        </tr>`).join('')}
      </tbody></table></div>`;
  } catch(e) { el.innerHTML = `<div style="color:var(--red);font-size:13px;padding:16px">${e.message}</div>`; }
}
function openAddInstitutionModal() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal" style="max-width:440px;padding:28px;position:relative;">
      <button onclick="this.closest('.modal-overlay').remove()" style="position:absolute;top:14px;right:14px;background:none;border:none;font-size:20px;cursor:pointer;color:var(--g400);line-height:1;" title="Close">✕</button>
      <h3 style="font-size:17px;font-weight:800;color:var(--navy);margin-bottom:18px">🏫 Add Institution</h3>
      <div class="form-group"><label class="form-label">Institution Name</label><input class="input" id="inst-name" placeholder="e.g. FAWE Girls School"></div>
      <div class="form-group"><label class="form-label">Type</label>
        <select class="input" id="inst-type"><option>Primary School</option><option>Secondary School</option><option>University</option><option>College</option><option>Training Center</option></select></div>
      <div class="form-group"><label class="form-label">Contact Person / Email</label><input class="input" id="inst-contact" placeholder="e.g. principal@school.rw"></div>
      <div class="form-group"><label class="form-label">Number of Licenses (Concurrent Sessions)</label><input class="input" id="inst-licenses" type="number" min="1" value="5" placeholder="e.g. 10"></div>
      <div class="form-group"><label class="form-label">Amount Paid (RWF)</label><input class="input" id="inst-amount" type="number" placeholder="e.g. 500000"></div>
      <div class="form-group"><label class="form-label">Access Expires (leave blank = no expiry)</label><input class="input" id="inst-expires" type="date"></div>
      <div style="display:flex;gap:10px;margin-top:8px">
        <button class="btn btn-primary btn-full" onclick="saveInstitution()">✅ Save Institution</button>
        <button class="btn btn-ghost" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if(e.target === overlay) overlay.remove(); });
}

async function saveInstitution() {
  const name = document.getElementById('inst-name')?.value.trim();
  const type = document.getElementById('inst-type')?.value;
  const contact = document.getElementById('inst-contact')?.value.trim();
  const licenses = parseInt(document.getElementById('inst-licenses')?.value || '1');
  const amount = document.getElementById('inst-amount')?.value.trim();
  const expires = document.getElementById('inst-expires')?.value;
  if (!name) { toast('Institution name required', 'err'); return; }
  try {
    await api('/lab/institutions', {
      method: 'POST',
      body: JSON.stringify({ name, type, contact, licenses, amount_paid: amount ? parseFloat(amount) : null, expires_at: expires || null })
    });
    toast(`${name} added with ${licenses} license(s) ✅`);
    document.querySelector('.modal-overlay')?.remove();
    renderInstitutionList();
  } catch(e) { toast(e.message, 'err'); }
}

async function deleteInstitution(id) {
  if (!confirm('Delete this institution and all its links?')) return;
  try {
    await api(`/lab/institutions/${id}`, { method: 'DELETE' });
    toast('Institution removed');
    renderInstitutionList();
  } catch(e) { toast(e.message, 'err'); }
}

function openInstitutionLabModal(instId) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal" style="max-width:440px;padding:28px;position:relative;">
      <button onclick="this.closest('.modal-overlay').remove()" style="position:absolute;top:14px;right:14px;background:none;border:none;font-size:20px;cursor:pointer;color:var(--g400);line-height:1;" title="Close">✕</button>
      <h3 style="font-size:17px;font-weight:800;color:var(--navy);margin-bottom:4px">🔗 Generate Lab Link</h3>
      <p style="font-size:12px;color:var(--g400);margin-bottom:18px">Institution link for teachers</p>
      <div class="form-group"><label class="form-label">Teacher / Host Name</label><input class="input" id="inst-link-teacher" placeholder="e.g. Mr. Mugisha"></div>
      <div class="form-group"><label class="form-label">Session Duration</label>
        <select class="input" id="inst-link-dur"><option value="1">1 hour</option><option value="2">2 hours</option><option value="3">3 hours</option><option value="8" selected>Full day</option></select></div>
      <div style="display:flex;gap:10px;margin-top:8px">
        <button class="btn btn-primary btn-full" onclick="generateInstitutionLink('${instId}')">🔗 Generate</button>
        <button class="btn btn-ghost" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
      </div>
      <div id="inst-link-result" style="display:none;margin-top:16px;background:var(--sky);border-radius:10px;padding:14px">
        <p style="font-size:12px;font-weight:700;color:var(--navy);margin-bottom:6px">✅ Share this link with the teacher:</p>
        <div style="display:flex;gap:8px;align-items:center">
          <input class="input" id="inst-link-output" readonly style="font-size:12px;background:#fff;flex:1;">
          <button class="btn btn-sm btn-gold" onclick="navigator.clipboard.writeText(document.getElementById('inst-link-output').value);toast('Copied!')">📋</button>
        </div>
        <p id="inst-link-expiry" style="font-size:11px;color:var(--g600);margin-top:6px"></p>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if(e.target === overlay) overlay.remove(); });
}

async function generateInstitutionLink(instId) {
  const teacher = document.getElementById('inst-link-teacher')?.value.trim() || 'Teacher';
  const hours = parseInt(document.getElementById('inst-link-dur')?.value || '8');
  try {
    const result = await api('/lab/tokens', {
      method: 'POST',
      body: JSON.stringify({ buyer_name: teacher, hours, institution_id: instId })
    });
    const link = `${window.location.origin}/lab/${result.token}`;
    document.getElementById('inst-link-output').value = link;
    document.getElementById('inst-link-expiry').textContent = `Expires: ${new Date(result.expires_at).toLocaleString()}`;
    document.getElementById('inst-link-result').style.display = 'block';
    toast(`Link for ${teacher} generated ✅`);
  } catch(e) { toast(e.message, 'err'); }
}
// ════════════════════════════════════════════════════════════
// DOCUMENT PRESENTATION ENGINE
// Supports: PDF (via PDF.js), PPTX (via SheetJS/pptx2png), DOCX
// Each page → canvas image → tutor annotates → students watch live
// ════════════════════════════════════════════════════════════
window._docSlides = [];        // Array of ImageData/dataURL per slide
window._docCurrentSlide = 0;
window._docTool = 'pen';
window._docIsDrawing = false;
window._docAnnotations = {};   // { slideIndex: [annotation objects] }
window._docSlideCtx = null;
window._docAnnoCtx = null;

async function openPresentationDoc(input) {
  const file = input.files[0];
  input.value = '';
  if (!file) return;
  const ext = file.name.split('.').pop().toLowerCase();
  toast('Loading document... please wait ⏳');
  // Show inline progress indicator in the status bar
  const statusBar = document.getElementById('wb-status');
  if (statusBar) { const sp = document.createElement('span'); sp.id = 'pdf-load-progress'; sp.style.cssText = 'color:#F5A623;font-weight:700;margin-left:12px;'; sp.textContent = 'Preparing document...'; statusBar.appendChild(sp); }
  try {
    if (ext === 'pdf') {
      await loadPDFSlides(file);
    } else if (ext === 'pptx' || ext === 'ppt' || ext === 'docx' || ext === 'doc') {
      await loadOfficeDocSlides(file, ext);
    } else {
      toast('Unsupported format. Use PDF, PPTX or DOCX.', 'err'); return;
    }
    if (!window._docSlides.length) { toast('Could not read document.', 'err'); return; }
    window._docCurrentSlide = 0;
    window._docAnnotations = {};
    enterPresentationMode();
    document.getElementById('pdf-load-progress')?.remove();
  } catch(e) {
    console.error(e);
    toast('Error loading document: ' + e.message, 'err');
  }
}

// ── PDF Loader ───────────────────────────────────────────────
async function loadPDFSlides(file) {
  await ensurePDFJS();
  await ensureJSZip();
  if (!window.pdfjsLib) {
    for (let i = 0; i < 50; i++) {
      await new Promise(r => setTimeout(r, 100));
      if (window.pdfjsLib) break;
    }
  }
  if (!window.pdfjsLib) { toast('PDF engine unavailable. Try refreshing the page.', 'err'); return; }
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  window._docSlides = [];
  const scale = 2; // Retina quality
  const totalPages = pdf.numPages;
  for (let i = 1; i <= totalPages; i++) {
    const progEl = document.getElementById('pdf-load-progress');
    if (progEl) progEl.textContent = `Loading page ${i} of ${totalPages}...`;
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const offscreen = document.createElement('canvas');
    offscreen.width = viewport.width;
    offscreen.height = viewport.height;
    await page.render({ canvasContext: offscreen.getContext('2d'), viewport }).promise;
    window._docSlides.push(offscreen.toDataURL('image/jpeg', 0.92));
  }
  toast(`PDF loaded: ${pdf.numPages} page${pdf.numPages > 1 ? 's' : ''} ✅`);
}

// ── Office Doc Loader (PPTX/DOCX → slide images via docx-preview / manual) ──
async function loadOfficeDocSlides(file, ext) {
  // Strategy: use the browser to render each slide as an image via a hidden iframe
  // For PPTX: convert to PDF in browser using a free CDN approach
  // Fallback: show a single-page render via FileReader + canvas
  window._docSlides = [];

  // Use mammoth for DOCX → HTML → render pages
  if ((ext === 'docx' || ext === 'doc') && window.mammoth) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    const html = result.value;
    // Paginate HTML into slides by splitting at page-break hints or every ~1200 chars
    const parser = new DOMParser();
    const doc2 = parser.parseFromString(html, 'text/html');
    const allBlocks = Array.from(doc2.body.children);
    const chunkSize = 10; // ~10 block elements per slide
    for (let i = 0; i < allBlocks.length; i += chunkSize) {
      const chunk = allBlocks.slice(i, i + chunkSize);
      const slideHtml = chunk.map(el => el.outerHTML).join('');
      const dataUrl = await htmlToSlideImage(slideHtml);
      window._docSlides.push(dataUrl);
    }
    if (!window._docSlides.length) {
      // Whole doc as one slide
      window._docSlides.push(await htmlToSlideImage(html));
    }
    toast(`Document loaded: ${window._docSlides.length} slide${window._docSlides.length > 1 ? 's' : ''} ✅`);
    return;
  }

  // For PPTX: render via an offscreen iframe with the file as object URL
  // Each slide becomes a screenshot — limited but works without server
  toast('PPTX: rendering slides (this may take a moment)...', 'info');
  const url = URL.createObjectURL(file);
  // Use a hidden iframe to load and screenshot each page
  const slides = await pptxToImages(url, file);
  URL.revokeObjectURL(url);
  window._docSlides = slides.length ? slides : [await fileToSingleSlide(file)];
  toast(`Presentation loaded: ${window._docSlides.length} slide${window._docSlides.length > 1 ? 's' : ''} ✅`);
}

async function htmlToSlideImage(html) {
  return new Promise((resolve) => {
    const W = 1280, H = 720;
    const offscreen = document.createElement('canvas');
    offscreen.width = W; offscreen.height = H;
    const ctx = offscreen.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);

    const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Arial,sans-serif;font-size:15px;padding:40px;box-sizing:border-box;width:${W}px;min-height:${H}px;background:#fff;color:#111;line-height:1.6;">
          ${html}
        </div>
      </foreignObject>
    </svg>`;
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const imgUrl = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => { ctx.drawImage(img, 0, 0); URL.revokeObjectURL(imgUrl); resolve(offscreen.toDataURL('image/jpeg', 0.9)); };
    img.onerror = () => { URL.revokeObjectURL(imgUrl); resolve(offscreen.toDataURL()); };
    img.src = imgUrl;
  });
}

async function pptxToImages(objectUrl, file) {
  // Use PptxGenJS alternative: render via hidden iframe with Google Slides viewer fallback
  // For local files we render the raw slide XML content pages
  try {
    const JSZip = window.JSZip;
    if (!JSZip) return [await fileToSingleSlide(file)];
    const ab = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(ab);
    const slideFiles = Object.keys(zip.files).filter(f => f.match(/^ppt\/slides\/slide\d+\.xml$/)).sort((a,b) => {
      const na = parseInt(a.match(/\d+/)[0]), nb = parseInt(b.match(/\d+/)[0]);
      return na - nb;
    });
    if (!slideFiles.length) return [await fileToSingleSlide(file)];
    const slides = [];
    for (const sf of slideFiles) {
      const xml = await zip.files[sf].async('string');
      slides.push(await pptxSlideXmlToImage(xml, zip));
    }
    return slides;
  } catch(e) { return [await fileToSingleSlide(file)]; }
}

async function pptxSlideXmlToImage(xml, zip) {
  // Extract text content from slide XML and render as a styled slide image
  const W = 1280, H = 720;
  const offscreen = document.createElement('canvas');
  offscreen.width = W; offscreen.height = H;
  const ctx = offscreen.getContext('2d');

  // Background
  ctx.fillStyle = '#1a3a6a'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#fff'; ctx.fillRect(40, 40, W - 80, H - 80);

  // Parse text shapes from XML
  const parser = new DOMParser();
  const doc2 = parser.parseFromString(xml, 'application/xml');
  const txBodies = doc2.querySelectorAll('txBody');
  let yPos = 80; let isTitle = true;
  txBodies.forEach(tb => {
    const paras = tb.querySelectorAll('p');
    paras.forEach(p => {
      const runs = p.querySelectorAll('r');
      const text = Array.from(runs).map(r => { const t = r.querySelector('t'); return t ? t.textContent : ''; }).join('');
      if (!text.trim()) { yPos += 10; return; }
      ctx.fillStyle = '#0D1B40';
      if (isTitle) {
        ctx.font = 'bold 36px Arial'; ctx.fillText(text, 80, yPos + 36, W - 160);
        yPos += 56; isTitle = false;
      } else {
        ctx.font = '20px Arial'; ctx.fillText('• ' + text, 100, yPos + 24, W - 200);
        yPos += 36;
      }
      if (yPos > H - 80) yPos = H - 80;
    });
  });

  // Try to embed images from the slide
  const rels = xml.match(/r:embed="(rId\d+)"/g) || [];
  return offscreen.toDataURL('image/jpeg', 0.9);
}

async function fileToSingleSlide(file) {
  return new Promise((resolve) => {
    const W = 1280, H = 720;
    const offscreen = document.createElement('canvas');
    offscreen.width = W; offscreen.height = H;
    const ctx = offscreen.getContext('2d');
    ctx.fillStyle = '#1a3a6a'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 28px Arial';
    ctx.fillText(file.name, 60, H / 2);
    ctx.font = '18px Arial'; ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillText('Full rendering requires PDF format for best results.', 60, H / 2 + 44);
    resolve(offscreen.toDataURL());
  });
}

// ── Presentation Mode UI ─────────────────────────────────────
function enterPresentationMode() {
  const overlay = document.getElementById('doc-present-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';
  overlay.style.flexDirection = 'column';
  const cc = document.getElementById('canvas-container');
  if (cc) cc.style.display = 'none';
  const simOv = document.getElementById('sim-overlay');
  if (simOv) simOv.style.display = 'none';

  const slideCanvas = document.getElementById('doc-slide-canvas');
  const annoCanvas  = document.getElementById('doc-anno-canvas');
  if (!slideCanvas || !annoCanvas) return;

  const firstSrc = window._docSlides && window._docSlides[0];
  if (!firstSrc) return;

  const probe = new Image();
  probe.onload = () => {
    const imgW = probe.naturalWidth  || 1280;
    const imgH = probe.naturalHeight || 720;
    const scale = 1.2;
    const cW = Math.round(imgW * scale);
    const cH = Math.round(imgH * scale);

    [slideCanvas, annoCanvas].forEach(c => {
      c.width  = cW;
      c.height = cH;
      c.style.width  = cW + 'px';
      c.style.height = cH + 'px';
    });

    window._docSlideCtx = slideCanvas.getContext('2d');
    window._docAnnoCtx  = annoCanvas.getContext('2d');
    window._docAnnoCtx.lineCap  = 'round';
    window._docAnnoCtx.lineJoin = 'round';
    window._docImgW = imgW; window._docImgH = imgH;
    window._docCW   = cW;   window._docCH   = cH;

    renderDocSlide(window._docCurrentSlide || 0);
    buildThumbStrip();

    if (!window._docStudentMode) {
      // Only tutor gets annotation tools
      setupDocAnnotationEvents(annoCanvas);
      docSetTool('pen');

      // Sync Scrolling
      const viewport = document.getElementById('doc-viewport');
      if (viewport) {
        viewport.onscroll = () => {
          broadcastDocScroll(viewport.scrollTop, viewport.scrollLeft);
        };
      }
    }
    resetDocZoom();
  };
  probe.onerror = () => { probe.naturalWidth = 1280; probe.naturalHeight = 720; probe.onload(); };
  probe.src = firstSrc;

  // Only broadcast if we are the host
  if (!window._docStudentMode) {
    const ch = window._wbChannel;
    if (!ch) return;
    // Send slides in chunks to avoid Supabase 1MB broadcast limit
    const CHUNK = 1; // 1 slide per message
    const slides = window._docSlides;
    const total = slides.length;
    // First tell student how many slides are coming
    try {
      ch.send({ type: 'broadcast', event: 'doc-enter-start', payload: { total, current: window._docCurrentSlide || 0 } });
    } catch(e) {}
    // Send each slide individually with a small delay between them
    slides.forEach((slide, idx) => {
      setTimeout(() => {
        try {
          ch.send({ type: 'broadcast', event: 'doc-slide-data', payload: { idx, total, data: slide } });
        } catch(e) {}
      }, idx * 120); // 120ms between each slide
    });
  }
}

function closePresentationMode() {
  document.getElementById('doc-present-overlay').style.display = 'none';
  document.getElementById('canvas-container').style.display = 'flex';
  removeDocAnnotationEvents();
  // Broadcast exit to students
  const ch = window._wbChannel;
  const isHost = (State.user && (State.user.role === 'tutor' || State.user.role === 'admin')) || window._isLabHost;
  if (ch && isHost) try { ch.send({ type: 'broadcast', event: 'doc-exit', payload: {} }); } catch(e) {}
  window._docSlides = [];
  window._docAnnotations = {};
  window._docZoom = 1.0;
}

function zoomDoc(delta) {
  window._docZoom = Math.max(0.5, Math.min(3.0, window._docZoom + delta));
  applyDocZoom();
}

function resetDocZoom() {
  window._docZoom = 1.0;
  applyDocZoom();
}

function applyDocZoom() {
  const container = document.getElementById('doc-zoom-container');
  const label = document.getElementById('doc-zoom-label');
  if (container) {
    container.style.transform = `scale(${window._docZoom})`;
    container.style.transformOrigin = 'top center';
    // Expand the inline-block container so the viewport scrollbar reflects zoomed size
    const cH = window._docCH || 720;
    container.style.marginBottom = `${Math.max(0, (window._docZoom - 1) * cH)}px`;
  }
  if (label) label.textContent = Math.round(window._docZoom * 100) + '%';
  const ch = window._wbChannel;
  if (ch) try { ch.send({ type: 'broadcast', event: 'doc-zoom', payload: { zoom: window._docZoom } }); } catch(e) {}
}

function triggerFloatingImage() {
  document.getElementById('doc-float-img-upload').click();
}

function addDocFloatingImage(input) {
  const file = input.files[0]; input.value = '';
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    createFloatingItem('img', e.target.result, 100, 100);
  };
  reader.readAsDataURL(file);
}

function createFloatingItem(type, content, x, y) {
  const wrap = document.getElementById('doc-floating-items');
  if (!wrap) return;
  wrap.style.pointerEvents = 'auto';
  
  const box = document.createElement('div');
  const id = 'flt_' + Math.random().toString(36).slice(2, 9);
  box.id = id;
  box.style.cssText = `position:absolute; left:${x}px; top:${y}px; z-index:20; cursor:move; pointer-events:auto;`;
  
  let innerHTML = '';
  if(type === 'img') {
    innerHTML = `<img src="${content}" style="width:250px; border:2px solid #F5A623; border-radius:4px; display:block; cursor:nw-resize;" class="doc-resizable-img">
      <div class="resize-handle" style="position:absolute;bottom:0;right:0;width:14px;height:14px;background:#F5A623;cursor:se-resize;border-radius:3px 0 4px 0;opacity:0.85;"></div>`;
  } else {
    innerHTML = `<div contenteditable="true" style="min-width:150px; background:rgba(255,248,100,0.95); border:2px solid #F5A623; border-radius:4px; padding:8px; color:#111; font-size:16px;">Type here...</div>`;
  }
  
  box.innerHTML = innerHTML + `<span onclick="this.parentElement.remove()" style="position:absolute; top:-10px; right:-10px; background:#EF4444; color:#fff; border-radius:50%; width:20px; height:20px; font-size:12px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-weight:900; box-shadow:0 2px 4px rgba(0,0,0,0.2)">✕</span>`;
  
  // Make Draggable
  let isDragging = false, startX, startY;
  box.addEventListener('mousedown', (e) => {
    if(e.target.contentEditable === "true") return;
    isDragging = true;
    startX = e.clientX - box.offsetLeft;
    startY = e.clientY - box.offsetTop;
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    box.style.left = (e.clientX - startX) + 'px';
    box.style.top = (e.clientY - startY) + 'px';
    // Sync movement
    broadcastDocAnno({ type: 'move-item', itemId: id, x: box.style.left, y: box.style.top });
  });
  
  document.addEventListener('mouseup', () => isDragging = false);
  // Resize handle for images
  const resizeHandle = box.querySelector('.resize-handle');
  if (resizeHandle) {
    let isResizing = false, resizeStartX, resizeStartW;
    resizeHandle.addEventListener('mousedown', (e) => {
      e.stopPropagation(); e.preventDefault();
      const img = box.querySelector('img');
      isResizing = true;
      resizeStartX = e.clientX;
      resizeStartW = img ? img.offsetWidth : 250;
    });
    document.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      const img = box.querySelector('img');
      if (img) img.style.width = Math.max(60, resizeStartW + (e.clientX - resizeStartX)) + 'px';
    });
    document.addEventListener('mouseup', () => { isResizing = false; });
  }
  wrap.appendChild(box);
  
  // Broadcast creation
  broadcastDocAnno({ type: 'create-item', itemType: type, content, x, y, itemId: id });
}
  


function renderDocSlide(idx) {
  if (!window._docSlides[idx] || !window._docSlideCtx) return;
  window._docCurrentSlide = idx;
  const ctx = window._docSlideCtx;
  const C = document.getElementById('doc-slide-canvas');
  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, C.width, C.height);
    ctx.drawImage(img, 0, 0, C.width, C.height);
    // Re-draw saved annotations for this slide
    replayAnnotations(idx);
  };
  img.src = window._docSlides[idx];
  // Update counter
  document.getElementById('doc-slide-counter').textContent = `${idx + 1} / ${window._docSlides.length}`;
  // Highlight active thumb
  document.querySelectorAll('.doc-thumb').forEach((t, i) => {
    t.style.border = i === idx ? '2px solid #F5A623' : '2px solid transparent';
  });
}

function buildThumbStrip() {
  const strip = document.getElementById('doc-thumb-strip');
  strip.innerHTML = '';
  window._docSlides.forEach((src, i) => {
    const thumb = document.createElement('canvas');
    thumb.className = 'doc-thumb';
    thumb.width = 96; thumb.height = 54;
    thumb.style.cssText = 'cursor:pointer;border-radius:4px;flex-shrink:0;border:2px solid transparent;';
    if (i === 0) thumb.style.border = '2px solid #F5A623';
    const tCtx = thumb.getContext('2d');
    const img = new Image();
    img.onload = () => tCtx.drawImage(img, 0, 0, 96, 54);
    img.src = src;
    thumb.onclick = () => { docGotoSlide(i); };
    strip.appendChild(thumb);
  });
}

function docGotoSlide(idx) {
  if (idx < 0 || idx >= window._docSlides.length) return;
  // Clear annotation canvas (save first)
  saveCurrentAnnotations();
  window._docAnnoCtx.clearRect(0, 0, document.getElementById('doc-anno-canvas').width, document.getElementById('doc-anno-canvas').height);
  renderDocSlide(idx);
  const ch = window._wbChannel;
  if (ch) try { ch.send({ type: 'broadcast', event: 'doc-slide', payload: { index: idx } }); } catch(e) {}
}

function docNextSlide() { docGotoSlide(window._docCurrentSlide + 1); }
function docPrevSlide() { docGotoSlide(window._docCurrentSlide - 1); }

// ── Annotation Engine ────────────────────────────────────────
function docSetTool(tool) {
  window._docTool = tool;
  ['pen','highlight','arrow','text','laser'].forEach(t => {
    const btn = document.getElementById('doc-tool-' + t);
    if (btn) btn.style.background = t === tool ? 'var(--blue)' : 'rgba(255,255,255,0.1)';
  });
  const annoCanvas = document.getElementById('doc-anno-canvas');
  if (annoCanvas) {
    annoCanvas.style.cursor = tool === 'laser' ? 'none' : tool === 'text' ? 'text' : 'crosshair';
    annoCanvas.style.pointerEvents = (tool === 'pen' || tool === 'highlight' || tool === 'arrow' || tool === 'laser') ? 'auto' : 'none';
    const textLayer = document.getElementById('doc-textboxes');
    if (textLayer) {
      textLayer.style.pointerEvents = tool === 'text' ? 'auto' : 'none';
      textLayer.style.cursor = tool === 'text' ? 'text' : 'default';
      // Attach click handler for text tool on the slide area
      if (tool === 'text') {
        textLayer._textClickHandler = (e) => {
          // Only create box if clicking empty space (not an existing box)
          if (e.target !== textLayer) return;
          const rect = textLayer.getBoundingClientRect();
          addDocTextBox(e.clientX - rect.left, e.clientY - rect.top);
        };
        textLayer.addEventListener('click', textLayer._textClickHandler);
      } else if (textLayer._textClickHandler) {
        textLayer.removeEventListener('click', textLayer._textClickHandler);
        textLayer._textClickHandler = null;
      }
    }
  }
}

function saveCurrentAnnotations() {
  const C = document.getElementById('doc-anno-canvas');
  if (!C) return;
  // Save the raw canvas pixel data per slide
  window._docAnnotations[window._docCurrentSlide] = C.toDataURL();
}

function replayAnnotations(idx) {
  const C = document.getElementById('doc-anno-canvas');
  const ctx = window._docAnnoCtx;
  if (!C || !ctx) return;
  ctx.clearRect(0, 0, C.width, C.height);
  if (window._docAnnotations[idx]) {
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0);
    img.src = window._docAnnotations[idx];
  }
}

function docClearAnnotations() {
  const C = document.getElementById('doc-anno-canvas');
  if (!C || !window._docAnnoCtx) return;
  window._docAnnoCtx.clearRect(0, 0, C.width, C.height);
  delete window._docAnnotations[window._docCurrentSlide];
  const ch = window._wbChannel;
  if (ch) try { ch.send({ type: 'broadcast', event: 'doc-anno-clear', payload: { slide: window._docCurrentSlide } }); } catch(e) {}
}

var _docEventsAttached = false;
function setupDocAnnotationEvents(canvas) {
  if (_docEventsAttached) removeDocAnnotationEvents();
  let drawing = false, lastX = 0, lastY = 0, arrowStart = null, _docLaserTimer = null;

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: (src.clientX - rect.left) * (canvas.width / rect.width), y: (src.clientY - rect.top) * (canvas.height / rect.height) };
  }

  window._docPointerDown = (e) => {
    e.preventDefault();
    const { x, y } = getPos(e);
    const tool = window._docTool;
    const color = document.getElementById('doc-pen-color')?.value || '#EF4444';
    const width = parseInt(document.getElementById('doc-pen-width')?.value || '4');
    const ctx = window._docAnnoCtx;

    if (tool === 'laser') {
      const dot = document.getElementById('doc-laser-dot');
      if (dot) { dot.style.display = 'block'; dot.style.left = x + 'px'; dot.style.top = y + 'px'; }
      broadcastDocAnno({ type: 'laser', x, y });
      return;  // no drawing
    }
    if (tool === 'text') {
      // Place a draggable editable text box directly on the slide overlay
      addDocTextBox(x, y);
      return;
    }
    if (tool === 'arrow') { arrowStart = { x, y }; drawing = true; return; }

    drawing = true; lastX = x; lastY = y;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(x, y);
    ctx.strokeStyle = tool === 'highlight' ? hexToRgba(color, 0.38) : color;
    ctx.lineWidth = tool === 'highlight' ? Math.max(width * 5, 20) : Math.max(width, 2);
    ctx.globalCompositeOperation = tool === 'highlight' ? 'multiply' : 'source-over';
  };

  window._docPointerMove = (e) => {
    e.preventDefault();
    const { x, y } = getPos(e);
    const tool = window._docTool;
    const color = document.getElementById('doc-pen-color')?.value || '#EF4444';
    const width = parseInt(document.getElementById('doc-pen-width')?.value || '4');
    const ctx = window._docAnnoCtx;

    if (tool === 'laser') {
      const dot = document.getElementById('doc-laser-dot');
      if (dot) { dot.style.display = 'block'; dot.style.left = x + 'px'; dot.style.top = y + 'px'; }
      clearTimeout(_docLaserTimer);
      _docLaserTimer = setTimeout(() => { if(dot) dot.style.display = 'none'; }, 2000);
      broadcastDocAnno({ type: 'laser', x, y });
      return;
    }

    if (!drawing) return;
    if (tool === 'pen' || tool === 'highlight') {
      ctx.lineTo(x, y); ctx.stroke();
      broadcastDocAnno({ type: 'stroke', x, y, color, width, tool });
    }
    lastX = x; lastY = y;
  };

  window._docPointerUp = (e) => {
    const { x, y } = getPos(e);
    const tool = window._docTool;
    const color = document.getElementById('doc-pen-color')?.value || '#EF4444';
    const width = parseInt(document.getElementById('doc-pen-width')?.value || '4');
    const ctx = window._docAnnoCtx;

    if (tool === 'arrow' && arrowStart) {
      drawArrow(ctx, arrowStart.x, arrowStart.y, x, y, color, width);
      broadcastDocAnno({ type: 'arrow', x1: arrowStart.x, y1: arrowStart.y, x2: x, y2: y, color, width });
      arrowStart = null;
    }
    drawing = false;
    ctx.globalCompositeOperation = 'source-over';
    ctx.beginPath();
    saveCurrentAnnotations();
  };

  canvas.addEventListener('mousedown', window._docPointerDown, { passive: false });
  canvas.addEventListener('mousemove', window._docPointerMove, { passive: false });
  canvas.addEventListener('mouseup', window._docPointerUp, { passive: false });
  canvas.addEventListener('touchstart', window._docPointerDown, { passive: false });
  canvas.addEventListener('touchmove', window._docPointerMove, { passive: false });
  canvas.addEventListener('touchend', window._docPointerUp, { passive: false });
  document.addEventListener('mouseup', window._docPointerUp);
  _docEventsAttached = true;
}

function removeDocAnnotationEvents() {
  const C = document.getElementById('doc-anno-canvas');
  if (!C) return;
  if (window._docPointerDown) C.removeEventListener('mousedown', window._docPointerDown);
  if (window._docPointerMove) C.removeEventListener('mousemove', window._docPointerMove);
  if (window._docPointerUp) C.removeEventListener('mouseup', window._docPointerUp);
  if (window._docPointerDown) C.removeEventListener('touchstart', window._docPointerDown);
  if (window._docPointerMove) C.removeEventListener('touchmove', window._docPointerMove);
  if (window._docPointerUp) C.removeEventListener('touchend', window._docPointerUp);
  _docEventsAttached = false;
}

function drawArrow(ctx, x1, y1, x2, y2, color, width) {
  const headLen = 18 + width * 2;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = width;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 7), y2 - headLen * Math.sin(angle - Math.PI / 7));
  ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 7), y2 - headLen * Math.sin(angle + Math.PI / 7));
  ctx.closePath(); ctx.fill();
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ── Real-time Broadcast to Students ─────────────────────────
let _docAnnoBatch = [];
let _docBroadcastTimer = null;
function broadcastDocAnno(payload) {
  const ch = window._wbChannel;
  if (!ch) return;
  _docAnnoBatch.push(payload);
  clearTimeout(_docBroadcastTimer);
  _docBroadcastTimer = setTimeout(() => {
    try { ch.send({ type: 'broadcast', event: 'doc-anno', payload: { slide: window._docCurrentSlide, batch: _docAnnoBatch } }); } catch(e) {}
    _docAnnoBatch = [];
  }, 40); // 40ms batching = ~25fps
}
let _docScrollSyncTimer = null;
function broadcastDocScroll(top, left) {
  const ch = window._wbChannel;
  if (!ch) return;
  clearTimeout(_docScrollSyncTimer);
  _docScrollSyncTimer = setTimeout(() => {
    try {
      ch.send({ type: 'broadcast', event: 'doc-scroll', payload: { top, left } });
    } catch(e) {}
  }, 50); // 50ms delay to prevent network flooding (20fps sync)
}

// ── Student-Side: receive presentation events ────────────────
// Add these inside the existing channel.on() chain in initWhiteboardSync
// (Instructions below tell you exactly where to insert)
function setupDocStudentListeners(channel) {
  // Reassemble chunked slides sent by tutor
  window._docIncomingSlides = [];
  window._docIncomingTotal = 0;

  channel
    .on('broadcast', { event: 'doc-enter-start' }, (msg) => {
      // Tutor is about to send slides one by one
      window._docIncomingSlides = new Array(msg.payload.total);
      window._docIncomingTotal = msg.payload.total;
      window._docCurrentSlide = msg.payload.current || 0;
      window._docAnnotations = {};
      window._docStudentMode = true;
      toast('📄 Receiving presentation... please wait', 'info');
    })
    .on('broadcast', { event: 'doc-slide-data' }, (msg) => {
      // Receive each slide chunk
      window._docIncomingSlides[msg.payload.idx] = msg.payload.data;
      const received = window._docIncomingSlides.filter(Boolean).length;
      if (received === msg.payload.total) {
        // All slides received — enter presentation mode
        window._docSlides = window._docIncomingSlides;
        window._docStudentMode = true;
        enterPresentationMode();
        setTimeout(() => {
          // Hide drawing tools for students — they only watch
          ['doc-tool-pen','doc-tool-highlight','doc-tool-arrow','doc-tool-text','doc-tool-laser','doc-tool-img'].forEach(id => {
            const el = document.getElementById(id); if (el) el.style.display = 'none';
          });
          // Also hide slide nav controls — tutor controls the slides
          const prevBtn = document.querySelector('[onclick="docPrevSlide()"]');
          const nextBtn = document.querySelector('[onclick="docNextSlide()"]');
          if (prevBtn) prevBtn.style.pointerEvents = 'none';
          if (nextBtn) nextBtn.style.pointerEvents = 'none';
        }, 400);
        toast('📄 Tutor is presenting — watching in full screen!', 'info');
      }
    })
    .on('broadcast', { event: 'doc-enter' }, () => {
      // Legacy handler — ignore, replaced by doc-enter-start + doc-slide-data
    })
    .on('broadcast', { event: 'doc-exit' }, () => {
      window._docStudentMode = false;
      const overlay = document.getElementById('doc-present-overlay');
      const cc = document.getElementById('canvas-container');
      if (overlay) overlay.style.display = 'none';
      if (cc) cc.style.display = 'flex';
      window._docSlides = [];
      window._docAnnotations = {};
      toast('Presentation ended', 'info');
    })
    
    .on('broadcast', { event: 'doc-slide' }, (msg) => {
      saveCurrentAnnotations();
      if (window._docAnnoCtx) window._docAnnoCtx.clearRect(0, 0, document.getElementById('doc-anno-canvas').width, document.getElementById('doc-anno-canvas').height);
      renderDocSlide(msg.payload.index);
    })
    .on('broadcast', { event: 'doc-anno-clear' }, (msg) => {
      if (msg.payload.slide === window._docCurrentSlide && window._docAnnoCtx) {
        window._docAnnoCtx.clearRect(0, 0, document.getElementById('doc-anno-canvas').width, document.getElementById('doc-anno-canvas').height);
      }
      delete window._docAnnotations[msg.payload.slide];
    })
    .on('broadcast', { event: 'doc-scroll' }, (msg) => {
      const viewport = document.getElementById('doc-viewport');
      if (viewport) {
        viewport.scrollTo({
          top: msg.payload.top,
          left: msg.payload.left,
          behavior: 'auto'
        });
      }
    })
    .on('broadcast', { event: 'doc-zoom' }, (msg) => {
    window._docZoom = msg.payload.zoom;
    applyDocZoom();
})
.on('broadcast', { event: 'doc-item' }, (msg) => {
    if(msg.payload.type === 'create') {
       const wrap = document.getElementById('doc-floating-items');
       const item = document.createElement('div');
       item.id = msg.payload.itemId;
       item.style.cssText = `position:absolute; left:${msg.payload.x}; top:${msg.payload.y}; pointer-events:none;`;
       item.innerHTML = msg.payload.itemType === 'img' ? 
          `<img src="${msg.payload.content}" style="max-width:250px; border-radius:4px;">` : 
          `<div style="background:rgba(255,248,100,0.95); padding:8px; border-radius:4px;">${msg.payload.content}</div>`;
       wrap.appendChild(item);
    }
})
    .on('broadcast', { event: 'doc-anno' }, (msg) => {
      if (msg.payload.slide !== window._docCurrentSlide) return;
      const C = document.getElementById('doc-anno-canvas');
      const ctx = window._docAnnoCtx;
      if (!ctx || !C) return;
      (msg.payload.batch || []).forEach(ev => {
        if (ev.type === 'stroke') {
          ctx.strokeStyle = ev.tool === 'highlight' ? hexToRgba(ev.color, 0.38) : ev.color;
          ctx.lineWidth = ev.tool === 'highlight' ? ev.width * 5 : ev.width;
          ctx.globalCompositeOperation = ev.tool === 'highlight' ? 'multiply' : 'source-over';
          ctx.lineCap = 'round'; ctx.lineJoin = 'round';
          ctx.lineTo(ev.x, ev.y); ctx.stroke();
        } else if (ev.type === 'arrow') {
          ctx.globalCompositeOperation = 'source-over';
          drawArrow(ctx, ev.x1, ev.y1, ev.x2, ev.y2, ev.color, ev.width);
        } else if (ev.type === 'text') {
          ctx.font = `bold ${ev.size}px Arial`;
          ctx.fillStyle = ev.color; ctx.globalCompositeOperation = 'source-over';
          ctx.fillText(ev.txt, ev.x, ev.y);
        }
else if (ev.type === 'laser') {
    const dot = document.getElementById('doc-laser-dot');
    if (dot) {
        dot.style.display = 'block';
        dot.style.left = ev.x + 'px';
        dot.style.top = ev.y + 'px';
    }
    clearTimeout(window._docLaserTimer);
    window._docLaserTimer = setTimeout(() => { if(dot) dot.style.display='none'; }, 1000);
}
      });
}).subscribe((status) => {
      if (status === 'SUBSCRIBED') console.log("Majestic Lab: Signaling Channel Active");
    });
}
// ── Text box on slide ────────────────────────────────────────
// Called when tool = 'text' — creates a draggable, editable div over the slide
function addDocTextBox(x, y) {
  const wrap = document.getElementById('doc-textboxes');
  if (!wrap) return;
  wrap.style.pointerEvents = 'auto';
  const box = document.createElement('div');
  box.style.cssText = `position:absolute;left:${x}px;top:${y}px;min-width:120px;min-height:36px;background:rgba(255,248,100,0.92);border:2px solid #F5A623;border-radius:5px;padding:4px 8px;font-size:15px;font-family:'DM Sans',sans-serif;color:#111;cursor:move;z-index:20;box-shadow:0 2px 8px rgba(0,0,0,0.3);`;
  box.contentEditable = 'true';
  box.spellcheck = false;
  box.textContent = 'Type here...';
  // Remove placeholder on first focus
  box.addEventListener('focus', () => { if (box.textContent === 'Type here...') box.textContent = ''; });
  // Close button
  const closeBtn = document.createElement('span');
  closeBtn.textContent = '✕';
  closeBtn.style.cssText = 'position:absolute;top:-8px;right:-8px;background:#EF4444;color:#fff;border-radius:50%;width:18px;height:18px;font-size:11px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-weight:900;z-index:30;';
  closeBtn.onclick = (e) => { e.stopPropagation(); box.remove(); };
  box.appendChild(closeBtn);
  // Drag to move
  let isDragging = false, dragOffX = 0, dragOffY = 0;
  box.addEventListener('mousedown', (e) => {
    if (e.target === closeBtn || e.target.isContentEditable) return;
    isDragging = true; dragOffX = e.offsetX; dragOffY = e.offsetY;
    e.preventDefault();
  });
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const parentRect = wrap.getBoundingClientRect();
    box.style.left = (e.clientX - parentRect.left - dragOffX) + 'px';
    box.style.top  = (e.clientY - parentRect.top  - dragOffY) + 'px';
  });
  document.addEventListener('mouseup', () => { isDragging = false; });
  wrap.appendChild(box);
  setTimeout(() => box.focus(), 50);
}

// ── Side panel helpers ───────────────────────────────────────
function triggerSidePanelImage(side) {
  document.getElementById('doc-' + side + '-img-upload').click();
}

function loadSidePanelImage(side, input) {
  const file = input.files[0]; input.value = '';
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const container = document.getElementById('doc-' + side + '-content');
    if (!container) return;
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position:relative;';
    const img = document.createElement('img');
    img.src = e.target.result;
    img.style.cssText = 'width:100%;border-radius:6px;border:1px solid rgba(255,255,255,0.15);display:block;';
    const removeBtn = document.createElement('button');
    removeBtn.textContent = '✕';
    removeBtn.style.cssText = 'position:absolute;top:3px;right:3px;background:#EF4444;color:#fff;border:none;border-radius:50%;width:20px;height:20px;font-size:11px;cursor:pointer;font-weight:900;';
    removeBtn.onclick = () => wrapper.remove();
    wrapper.appendChild(img); wrapper.appendChild(removeBtn);
    container.appendChild(wrapper);
  };
  reader.readAsDataURL(file);
}

function buildSidePanels() {
  // Clear content areas (keep textareas)
  const lc = document.getElementById('doc-left-content');
  const rc = document.getElementById('doc-right-content');
  if (lc) lc.innerHTML = '';
  if (rc) rc.innerHTML = '';
}
// ════════════════════════════════════════════════════════════
// END of DOCUMENT PRESENTATION ENGINE
// ════════════════════════════════════════════════════════════

// ── Tutor opens a standalone lab (no session ID needed) ──────────────────────
function openTutorLabDirect() {
  const pseudoId = 'tutor_' + (State.user?.id || 'lab').replace(/-/g,'').slice(0,12) + '_' + Date.now().toString(36);
  window._wbInstitutionName = '';  // Tutor direct — no institution
  renderWhiteboard(pseudoId);
}

// Concurrent session check for institution links
function exitMajesticLab() {
  clearInterval(window._labPingInterval);
  const fp = localStorage.getItem('ml_device_id');
  const token = State.data?.labToken || localStorage.getItem('tc_lab_token');
  const instId = window._labInstitutionId || null;
  if (fp && token) {
    fetch(API_URL + `/lab/tokens/${token}/session`, {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ device_fingerprint: fp, institution_id: instId })
    }).catch(() => {}).finally(() => {
      // Clean up canvas instance so it doesn't ghost
      if (window.wbInstance) { try { window.wbInstance.dispose(); } catch(e){} window.wbInstance = null; }
      navigate('dashboard');
    });
  } else {
    if (window.wbInstance) { try { window.wbInstance.dispose(); } catch(e){} window.wbInstance = null; }
    navigate('dashboard');
  }
}