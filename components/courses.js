// ══════════════════════════════════════════════════
// COURSES — Public shop + checkout + student access
// ══════════════════════════════════════════════════

const COURSE_CURRICULA = [
  { id: 'REB',        label: 'REB / CBC',                      icon: '<i data-lucide="map-pin" style="width:16px;height:16px"></i>' },
  { id: 'IGCSE',      label: 'IGCSE / Cambridge',               icon: '<i data-lucide="graduation-cap" style="width:16px;height:16px"></i>' },
  { id: 'IB',         label: 'IB (Baccalaureate)',              icon: '<i data-lucide="globe" style="width:16px;height:16px"></i>' },
  { id: 'French',     label: 'French Curriculum',               icon: '<i data-lucide="languages" style="width:16px;height:16px"></i>' },
  { id: 'University', label: 'University / Higher Ed',          icon: '<i data-lucide="building-2" style="width:16px;height:16px"></i>' },
]
const COURSE_LEVELS = {
  REB:        ['P1','P2','P3','P4','P5','P6','S1','S2','S3','S4','S5','S6'],
  IGCSE:      ['Year 7','Year 8','Year 9','Year 10','Year 11','AS Level','A2 Level'],
  IB:         ['MYP 1','MYP 2','MYP 3','MYP 4','MYP 5','DP Year 1','DP Year 2'],
  French:     ['6ème','5ème','4ème','3ème','2nde','1ère','Terminale'],
  University: ['Year 1','Year 2','Year 3','Year 4','Masters'],
}
const COURSE_SUBJECTS = [
  'Mathematics','Physics','Chemistry','Biology',
  'Geography','History','Economics','Entrepreneurship',
  'English','French','Kinyarwanda','Kiswahili',
  'Computer Science','General Science','Social Studies',
  'Literature','Music','Physical Education','Other'
]
const COURSE_TERMS = ['Term 1','Term 2','Term 3','Full Year']

function _levelOptions(curriculum, selected) {
  return (COURSE_LEVELS[curriculum] || []).map(l =>
    `<option value="${l}" ${selected === l ? 'selected' : ''}>${l}</option>`
  ).join('')
}

const REB_LEVELS_PRIMARY   = ['P1','P2','P3','P4','P5','P6']
const REB_LEVELS_SECONDARY = ['S1','S2','S3','S4','S5','S6']

function _levelGroup(level) {
  if (!level) return null
  if (REB_LEVELS_PRIMARY.includes(level))   return { label: 'Primary',   bg:'#dcfce7', color:'#065f46' }
  if (REB_LEVELS_SECONDARY.includes(level)) return { label: 'Secondary', bg:'#dbeafe', color:'#1e40af' }
  if (['AS Level','A2 Level'].includes(level)) return { label: 'A-Level', bg:'#fce7f3', color:'#9d174d' }
  return { label: level, bg:'#f3f4f6', color:'#374151' }
}

// Course-only (guest) accounts have email ending @student.mathrone.rw
function _isCourseGuestAccount() {
  if (!State.user) return false
  return (State.user.email || '').endsWith('@student.mathrone.rw')
}

window.handleCourseSearchInput = function(val) {
  const suggestionsBox = document.getElementById('course-search-suggestions');
  if(!suggestionsBox) return;
  if(!val || val.length < 2) { suggestionsBox.style.display = 'none'; return; }
  
  const courses = window._allPublicCourses || [];
  const q = val.toLowerCase();
  
  let results = [];

  courses.forEach(c => {
    const courseText = [c.title, c.description, c.subject, c.level].filter(Boolean).join(' ').toLowerCase();
    const courseMatch = courseText.includes(q);

    const allLessons = [...(c.preview_lessons || []), ...(c.lessons || [])];
    const uniqueLessons = Array.from(new Map(allLessons.map(l => [l.id, l])).values());
    
    const matchingLessons = uniqueLessons.filter(l => l.title.toLowerCase().includes(q));

    if (courseMatch && matchingLessons.length === 0) {
      results.push({
        type: 'course',
        course: c,
        text: c.title,
        subtext: [c.subject, c.level].filter(Boolean).join(' • ')
      });
    }

    matchingLessons.forEach(l => {
      results.push({
        type: 'lesson',
        course: c,
        lesson: l,
        text: l.title,
        subtext: `Lesson in ${c.title}`
      });
    });
  });

  const filtered = results.slice(0, 6);
  
  if(filtered.length === 0) {
    suggestionsBox.innerHTML = '<div style="padding:12px 16px;font-size:13px;color:var(--g400)">No matches found</div>';
    suggestionsBox.style.display = 'block';
    return;
  }
  
   suggestionsBox.innerHTML = filtered.map(item => `
    <div onclick="navigate('course-${item.course.slug || item.course.id}?q=${encodeURIComponent(q)}')" 
         style="padding:12px 16px;cursor:pointer;font-size:13px;font-weight:600;color:var(--navy);border-bottom:1px solid var(--g50);display:flex;align-items:center;gap:10px" 
         onmouseover="this.style.background='var(--sky)'" 
         onmouseout="this.style.background='#fff'">
      <i data-lucide="${item.type === 'lesson' ? 'play-circle' : 'search'}" style="width:14px;height:14px;color:var(--g400);flex-shrink:0"></i> 
      <div style="display:flex;flex-direction:column;min-width:0">
        <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${item.text}</span>
        <span style="font-size:11px;color:var(--g400);font-weight:400;margin-top:2px">${item.subtext}</span>
      </div>
    </div>
  `).join('');
  
  suggestionsBox.style.display = 'block';
  if (window.lucide) window.lucide.createIcons();
}

// Close suggestions on outside click
document.addEventListener('click', (e) => {
  if(!e.target.closest('#course-search-input') && !e.target.closest('#course-search-suggestions')){
    const box = document.getElementById('course-search-suggestions');
    if(box) box.style.display = 'none';
  }
});


// ── Public: Courses Listing ─────────────────────────────────────────────────
async function renderCoursesShop() {
  const isLoggedIn = !!(State.user && localStorage.getItem('tc_access'))
  const isCourseGuest = _isCourseGuestAccount()

  const nav = `
  <nav style="display:flex;align-items:center;justify-content:space-between;padding:10px 20px;border-bottom:1px solid var(--g100);background:#fff;position:sticky;top:0;z-index:100;gap:8px">
    <button onclick="navigate('landing')" style="display:flex;align-items:center;gap:6px;background:none;border:none;cursor:pointer;padding:0">
      <img src="https://hdpkjomganndiiprnpok.supabase.co/storage/v1/object/public/assets/mathrone%20logo1.png" alt="Mathrone" loading="lazy" style="height:28px;width:auto"/>
      <span style="font-size:14px;font-weight:800;color:var(--navy)">Mathrone</span>
    </button>
    <div style="display:flex;align-items:center;gap:8px">
      ${isLoggedIn ? `
        <button class="btn btn-ghost btn-sm" onclick="navigate('my-courses')"><i data-lucide="book-open-check" style="width:16px;height:16px;margin-right:4px"></i> My Courses</button>
        ${isCourseGuest
          ? `<button class="btn btn-primary btn-sm" onclick="upgradeToCourseStudent()" style="background:linear-gradient(135deg,#7c3aed,#5b21b6)"><i data-lucide="rocket" style="width:16px;height:16px;margin-right:4px"></i> Find a Tutor & Upgrade</button>`
          : `<button class="btn btn-primary btn-sm" onclick="navigate('dashboard')">Dashboard</button>`}
    ` : `
        <button class="btn btn-ghost btn-sm" onclick="navigate('landing')"><i data-lucide="home" style="width:16px;height:16px;margin-right:4px"></i> Home</button>
        <button class="btn btn-ghost btn-sm" onclick="navigate('shop')"><i data-lucide="shopping-bag" style="width:16px;height:16px;margin-right:4px"></i> Go Shop</button>
        <button class="btn btn-ghost btn-sm" onclick="navigate('login')">Sign In</button>
        <button class="btn btn-primary btn-sm" onclick="navigate('register')">Sign Up</button>
      `}
    </div>
  </nav>`

  // Skeleton loading state
  render(`
  ${nav}
  <div style="max-width:1100px;margin:0 auto;padding:24px 16px">
    <div style="margin-bottom:24px">
      <h1 style="font-size:22px;font-weight:800;color:var(--navy);margin-bottom:4px;line-height:1.2"> Learn Anything, Anytime</h1>
      <p style="font-size:13px;color:var(--g400);">Expert-led video courses aligned to Rwanda's curriculum.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px">
      ${[1,2,3,4,5,6].map(()=>`
      <div style="background:#fff;border-radius:16px;border:1px solid var(--g100);overflow:hidden;animation:pulse 1.5s ease infinite alternate">
        <div style="height:180px;background:var(--sky)"></div>
        <div style="padding:20px">
          <div style="height:14px;background:var(--g100);border-radius:4px;margin-bottom:10px"></div>
          <div style="height:10px;background:var(--g100);border-radius:4px;width:60%;margin-bottom:16px"></div>
          <div style="height:36px;background:var(--g100);border-radius:8px"></div>
        </div>
      </div>`).join('')}
    </div>
  </div>`)

  try {
    const res = await fetch(API_URL + '/courses/public')
    if (!res.ok) throw new Error('Failed to load courses')
    const data = await res.json()
    const allCourses = Array.isArray(data) ? data : (data.courses || data.data || [])
    
    // Store globally so the search function can access it safely without JSON stringify issues
    window._allPublicCourses = allCourses;
    
    // Apply search filter if any
    const searchParams = new URLSearchParams(window.location.search)
    const query = searchParams.get('q') || ''
    
    let courses = allCourses;
    if (query) {
      const q = query.toLowerCase();
      courses = allCourses.filter(c => {
        // Combine all searchable text into one block for flexible matching
        const textToSearch = [
          c.title,
          c.description,
          c.subject,
          c.level,
          ...(c.preview_lessons || []).map(l => l.title),
          ...(c.lessons || []).map(l => l.title)
        ].filter(Boolean).join(' ').toLowerCase();
        
        return textToSearch.includes(q);
      });
    }

    const cards = courses.length ? courses.map(c => courseCard(c, isLoggedIn)).join('') : `
    <div class="empty-state" style="grid-column:1/-1">
      <div class="empty-icon" style="color:var(--g400)"><i data-lucide="book-open" style="width:48px;height:48px;stroke-width:1.5"></i></div>
      <div class="empty-title">No courses found</div>
      <div class="empty-sub">Check back soon or try a different search.</div>
    </div>`

    render(`
    ${nav}
    <div class="m-courses-container" style="max-width:1100px;margin:0 auto;padding:24px 16px">
      <div class="m-courses-header" style="margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px">
        <div style="flex:1;min-width:300px">
          <h1 style="font-size:22px;font-weight:800;color:var(--navy);margin-bottom:4px;line-height:1.2;display:flex;align-items:center;gap:8px"><i data-lucide="book-open-check" style="width:24px;height:24px;color:var(--blue)"></i> Your Academic Safety Net</h1>
          <p style="font-size:13px;color:var(--g400);margin:0">Teacher unavailable or need a better explanation? Keep your grades up with expert-led video courses aligned to the Rwandan curriculum.</p>
        </div>
        
        <div style="position:relative;width:100%;max-width:320px">
          <input class="input" id="course-search-input" value="${query}" placeholder="Search courses or subjects..." oninput="handleCourseSearchInput(this.value)" onkeydown="if(event.key==='Enter') { const url = new URL(window.location); url.searchParams.set('q', this.value); window.history.pushState({}, '', url); renderCoursesShop(); }" style="padding-left:40px;height:44px;border-radius:12px"/>
          <i data-lucide="search" style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--g400);width:18px;height:18px"></i>
          <div id="course-search-suggestions" style="display:none;position:absolute;top:100%;left:0;right:0;background:#fff;border:1px solid var(--g200);border-radius:8px;box-shadow:0 10px 25px rgba(0,0,0,0.1);z-index:50;margin-top:4px;max-height:250px;overflow-y:auto"></div>
        </div>
      </div>
      <div class="m-courses-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px">
        ${cards}
      </div>
    </div>
    <div style="background:#0f172a;padding:24px 32px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-top:48px">
      <div style="font-size:13px;color:rgba(255,255,255,0.4)">© 2026 Mathrone Academy</div>
      <button onclick="navigate('landing')" style="font-size:13px;color:rgba(255,255,255,0.4);background:none;border:none;cursor:pointer">← Back to Home</button>
    </div>`)
  } catch(e) {
    toast(e.message, 'err')
  }
}

function courseCard(c, isLoggedIn, isCourseGuest) {
  const enrollAction = isLoggedIn
    ? `memberEnrollCourse('${c.id}','${(c.title||'').replace(/'/g,"\\'").replace(/"/g,'&quot;')}',${c.price})`
    : `openLoginPrompt('${c.id}','${(c.title||'').replace(/'/g,"\\'").replace(/"/g,'&quot;')}',${c.price})`
  
  const lessonCount = c.lesson_count || (c.lessons && c.lessons.length) || (c.preview_lessons && c.preview_lessons.length) || 0;
  const lessonText = lessonCount > 0 ? `${lessonCount} Lessons` : `Video Lessons`;

  return `
  <div class="m-course-card" style="background:#fff;border:1px solid #e8ecf0;border-radius:12px;overflow:hidden;display:flex;flex-direction:column;transition:box-shadow .2s,transform .2s;"
       onmouseover="this.style.boxShadow='0 8px 32px rgba(0,0,0,0.10)';this.style.transform='translateY(-2px)'"
       onmouseout="this.style.boxShadow='none';this.style.transform='translateY(0)'">

    <!-- Image Area -->
    <a href="/course/${c.slug||c.id}" onclick="navigate('course-${c.slug||c.id}', null, event)"
       class="m-course-img-wrap" style="display:block;position:relative;width:100%;height:160px;background:#f8fafc;overflow:hidden;flex-shrink:0;border-bottom:1px solid #f0f2f5;cursor:pointer;">
      ${c.image_url
        ? `<img src="${c.image_url}" alt="${c.title}" loading="lazy" decoding="async"
               style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;transition:transform .3s"
               onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'"/>`
        : `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:52px;color:#cbd5e1"><i data-lucide="book-open" style="width:48px;height:48px;"></i></div>`}
    </a>

    <!-- Body Area -->
    <div class="m-course-body" style="padding:16px;flex:1;display:flex;flex-direction:column;gap:0">
      
      <div onclick="navigate('course-${c.slug||c.id}')"
           style="font-size:16px;font-weight:800;color:#0f172a;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:6px;cursor:pointer;">
        ${c.title}
      </div>

      <div style="font-size:12px;color:#64748b;margin-bottom:8px;line-height:1.5;">
        By <span style="font-weight:700;color:#334155">Mathrone Academy</span><br/>
        ${c.subject || 'General'} • ${c.level || 'All Levels'}
      </div>

      <!-- View Details Pill -->
      <a href="/course/${c.slug||c.id}" onclick="navigate('course-${c.slug||c.id}', null, event)"
         style="display:inline-flex;align-items:center;gap:3px;padding:4px 12px;border-radius:999px;border:1.5px solid #bfdbfe;background:#eff6ff;font-size:11px;font-weight:600;color:#1d4ed8;text-decoration:none;width:fit-content;transition:background .15s;margin-top:4px;margin-bottom:12px;"
         onmouseover="this.style.background='#dbeafe'" onmouseout="this.style.background='#eff6ff'">
        View full details →
      </a>

      <div style="flex:1"></div>

      <!-- Lessons and Price Row -->
      <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:12px;padding-top:12px;border-top:1px solid #f0f2f5;">
        <div style="font-size:12px;color:#64748b;display:flex;align-items:center;gap:6px;font-weight:600;">
          <i data-lucide="video" style="width:14px;height:14px"></i> ${lessonText}
        </div>
        <div style="font-size:18px;font-weight:800;color:#0f172a;">
          ${c.price > 0 ? `RWF ${Number(c.price).toLocaleString()}` : '<span style="color:#10b981">FREE</span>'}
        </div>
      </div>

      <!-- Enroll CTA (Triggers Login if Guest) -->
      <button onclick="event.stopPropagation(); ${enrollAction}"
        style="width:100%;background:var(--blue);color:#fff;border:none;padding:10px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center;gap:6px;transition:background .15s"
        onmouseover="this.style.background='#1d4ed8'" onmouseout="this.style.background='var(--blue)'">
        <i data-lucide="graduation-cap" style="width:16px;height:16px"></i>
        ${c.price > 0 ? 'Enroll Now' : 'Get Course for Free'}
      </button>
    </div>
  </div>`
}

// ── Public: Course Detail Page ──────────────────────────────────────────────
async function renderCourseDetail(slugParam) {
  const isLoggedIn = !!(State.user && localStorage.getItem('tc_access'))

  let slug = slugParam;
  let query = '';
  if (slug.includes('?q=')) {
    const parts = slug.split('?q=');
    slug = parts[0];
    query = decodeURIComponent(parts[1]).toLowerCase();
  }

  render(`
  <nav style="display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--g100);background:#fff;position:sticky;top:0;z-index:100">
    <button onclick="navigate('courses')" style="font-size:14px;font-weight:700;color:var(--navy);background:none;border:none;cursor:pointer">← Courses</button>
  </nav>
  <div style="max-width:860px;margin:60px auto;padding:0 16px;text-align:center">
    <div class="spinner" style="margin:0 auto"></div>
  </div>`)

  try {
    const res = await fetch(API_URL + '/courses/public/' + slug)
    if (!res.ok) throw new Error('Course not found')
    const c = await res.json()

    let displayLessons = c.lessons || c.preview_lessons || [];
    if (query) {
      const filtered = displayLessons.filter(l => 
        (l.title && l.title.toLowerCase().includes(query)) || 
        (l.content && l.content.toLowerCase().includes(query))
      );
      if (filtered.length > 0) displayLessons = filtered;
    }

    // ── SEO: update meta for this public course page ──
    const BASE = 'https://mathroneacademy.pages.dev'
    updatePageSEO({
      title: c.title,
      description: (c.description || `Learn ${c.title} on Mathrone Academy. ${c.subject ? c.subject + ' course' : ''} ${c.level ? '— ' + c.level : ''} — available online in Rwanda.`).slice(0, 160),
      url: BASE + '/course-' + slug,
      noindex: false,
      schema: {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: c.title,
        description: c.description || '',
        url: BASE + '/course-' + slug,
        provider: { '@type': 'Organization', name: 'Mathrone Academy', url: BASE },
        ...(c.image_url ? { image: c.image_url } : {}),
        ...(c.price != null ? { offers: { '@type': 'Offer', price: c.price, priceCurrency: 'RWF', availability: 'https://schema.org/InStock' } } : {}),
        ...(c.subject ? { about: { '@type': 'Thing', name: c.subject } } : {})
      }
    })
    // Also update og:url and canonical for this course
    const ogUrl = document.querySelector('meta[property="og:url"]')
    if (ogUrl) ogUrl.setAttribute('content', BASE + '/course-' + slug)
    const ogImg = document.querySelector('meta[property="og:image"]')
    if (ogImg && c.image_url) ogImg.setAttribute('content', c.image_url)
    let canon = document.querySelector('link[rel="canonical"]')
    if (canon) canon.setAttribute('href', BASE + '/course-' + slug)
    // ─────────────────────────────────────────────────

    render(`
    <nav style="display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--g100);background:#fff;position:sticky;top:0;z-index:100">
      <button onclick="navigate('courses')" style="font-size:14px;font-weight:700;color:var(--navy);background:none;border:none;cursor:pointer">← All Courses</button>
      ${isLoggedIn ? `<button class="btn btn-ghost btn-sm" onclick="navigate('my-courses')"><i data-lucide="book-open-check" style="width:16px;height:16px;margin-right:4px"></i> My Courses</button>` : `<button class="btn btn-ghost btn-sm" onclick="navigate('login')">Sign In</button>`}
    </nav>
    <div style="max-width:860px;margin:0 auto;padding:40px 16px 60px">

      <!-- Clean Header / Enroll Section -->
      <div style="margin-bottom:32px;display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:24px;">
        <div style="flex:1;min-width:300px;">
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">
            ${c.level ? `<span style="background:var(--sky);color:var(--blue);font-size:11px;font-weight:700;padding:4px 12px;border-radius:999px">${c.level}</span>` : ''}
            ${c.subject ? `<span style="background:var(--sky);color:var(--blue);font-size:11px;font-weight:700;padding:4px 12px;border-radius:999px">${c.subject}</span>` : ''}
          </div>
          <h1 style="font-size:28px;font-weight:900;color:var(--navy);margin-bottom:12px;line-height:1.2">${c.title}</h1>
          <p style="font-size:15px;color:var(--g600);line-height:1.6;max-width:600px;">${c.description || ''}</p>
        </div>
        
        <!-- Action Card -->
        <div class="course-action-card" style="background:#fff;border:1px solid var(--g200);padding:24px;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,0.06);text-align:center;min-width:240px;flex-shrink:0;">
          <div class="cac-price-wrap">
            <div style="font-size:13px;color:var(--g400);margin-bottom:4px;font-weight:600;text-transform:uppercase;">Course Price</div>
            <div style="font-size:28px;font-weight:900;color:var(--navy);margin-bottom:16px;">${c.price > 0 ? `RWF ${Number(c.price).toLocaleString()}` : '<span style="color:#10b981">FREE</span>'}</div>
          </div>
          
          <button class="cac-btn" onclick="${isLoggedIn ? `memberEnrollCourse('${c.id}','${(c.title||'').replace(/'/g,"\\'")}',${c.price})` : `openLoginPrompt('${c.id}','${(c.title||'').replace(/'/g,"\\'")}',${c.price})`}"
            style="width:100%;background:var(--blue);color:#fff;border:none;padding:14px 24px;border-radius:8px;cursor:pointer;font-size:15px;font-weight:700;display:flex;align-items:center;justify-content:center;gap:8px;transition:background 0.2s;"
            onmouseover="this.style.background='var(--blue2)'" onmouseout="this.style.background='var(--blue)'">
            <i data-lucide="graduation-cap" style="width:18px;height:18px"></i> ${c.price > 0 ? 'Enroll Now' : 'Get Free Access'}
          </button>
        </div>
      </div>

      <!-- Lessons List -->
      ${(c.lessons && c.lessons.length) || (c.preview_lessons && c.preview_lessons.length) ? `
      <div style="background:#fff;border-radius:16px;border:1px solid var(--g100);padding:clamp(16px, 4vw, 28px);margin-bottom:24px">
        <h2 style="font-size:18px;font-weight:800;color:var(--navy);margin-bottom:16px;display:flex;align-items:center;gap:8px"><i data-lucide="list-checks" style="width:20px;height:20px;color:var(--blue)"></i> What You'll Learn</h2>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${(c.lessons || c.preview_lessons).map((l, i) => {
            const isPreview = l.is_free_preview || c.preview_lessons?.find(pl => pl.id === l.id);
            const clickAction = isPreview 
              ? `window._currentLessons=JSON.parse('${JSON.stringify(c.preview_lessons || c.lessons).replace(/'/g,"\\'").replace(/"/g,'&quot;')}'); openLessonPlayer('${l.id}')` 
              : `toast('Enroll in the course to access this lesson.', 'info')`;
            
            return `
            <div onclick="${clickAction}" style="background:#fff;border:1px solid #e5e7eb;border-radius:4px;overflow:hidden;margin-bottom:16px;cursor:${isPreview?'pointer':'default'};box-shadow:0 1px 3px rgba(0,0,0,0.05);transition:transform 0.2s;" ${isPreview ? `onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'"` : ''}>
              <div style="display:flex;align-items:center;">
                <div style="width:clamp(120px, 30vw, 160px);aspect-ratio:16/9;background:#f3f4f6;flex-shrink:0;position:relative;">
                   ${c.image_url ? `<img src="${c.image_url}" style="width:100%;height:100%;object-fit:cover;opacity:0.8;display:block;"/>` : `<div style="display:flex;align-items:center;justify-content:center;height:100%;background:#1e3a8a;color:#fff;font-size:24px;font-weight:800;">${l.order_num || i+1}</div>`}
                   <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.25);">
                     ${isPreview ? '<i data-lucide="play-circle" style="width:32px;height:32px;color:#fff;opacity:0.9"></i>' : '<i data-lucide="lock" style="width:24px;height:24px;color:#fff;opacity:0.9"></i>'}
                   </div>
                </div>
                <div style="padding:16px;flex:1;display:flex;flex-direction:column;justify-content:center;">
                  <h3 style="font-size:15px;font-weight:700;color:#111827;margin-bottom:4px;line-height:1.3;">${l.title}</h3>
                  <p style="font-size:12px;color:#6b7280;margin-bottom:6px;">Mathrone Academy, Instructor</p>
                  <div style="display:flex;gap:4px;color:#10b981;font-size:12px;">
                    ★ ★ ★ ★ ★ <span style="color:#9ca3af;margin-left:4px;">${l.duration_mins ? `${l.duration_mins} min` : 'Video Lesson'}</span>
                  </div>
                </div>
              </div>
              <div style="background:#374151;padding:10px 16px;">
                <div style="display:flex;align-items:center;gap:12px;">
                  <div style="width:100%;height:4px;background:#4b5563;border-radius:2px;overflow:hidden;"></div>
                  <span style="font-size:11px;color:#9ca3af;white-space:nowrap;">${isPreview ? 'Preview available' : 'Locked'}</span>
                </div>
              </div>
            </div>`;
          }).join('')}
        </div>
        <div style="margin-top:16px;padding:14px;background:#fef3c7;border-radius:10px;font-size:13px;color:#92400e;display:flex;align-items:center;gap:8px">
          <i data-lucide="lock" style="width:16px;height:16px"></i> Full course access unlocked after enrollment
        </div>
      </div>` : ''}

       <!-- Course Preview Video -->
      ${c.video_url ? (() => {
        const ytMatch = c.video_url.match(/(?:embed\/|v=|youtu\.be\/)([\w-]{11})/);
        const ytId = ytMatch ? ytMatch[1] : '';
        const thumbUrl = ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : '';
        const cleanUrl = ytId ? `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1&showinfo=0` : c.video_url;
        
        return `
        <div style="margin-bottom:24px">
          <h2 style="font-size:18px;font-weight:800;color:var(--navy);margin-bottom:12px;display:flex;align-items:center;gap:8px"><i data-lucide="play-circle" style="width:20px;height:20px;color:var(--blue)"></i> Course Preview</h2>
          <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:14px;background:#000;box-shadow:0 8px 30px rgba(0,0,0,0.15)">
            
            <!-- Custom Mathrone Video Cover -->
            <div id="preview-vid-cover" onclick="this.style.display='none'; document.getElementById('preview-vid-iframe').src='${cleanUrl}'" 
                 style="position:absolute;top:0;left:0;width:100%;height:100%;cursor:pointer;background:#000 url('${thumbUrl}') center/cover no-repeat;display:flex;align-items:center;justify-content:center;z-index:2">
              <div style="width:64px;height:64px;background:var(--blue);border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(26,95,255,0.4);transition:transform 0.2s" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left:4px"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              </div>
            </div>
            
            <!-- Actual Video -->
            <iframe id="preview-vid-iframe" src=""
              style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;z-index:1"
              allowfullscreen loading="lazy" allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
          </div>
        </div>`;
      })() : ''}


      <!-- Tutoring CTA -->
      <div style="margin-top:16px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:14px;padding:18px;display:flex;align-items:center;gap:14px;flex-wrap:wrap">
        <div style="background:#dcfce7;padding:10px;border-radius:50%;color:#059669;display:flex;align-items:center;justify-content:center"><i data-lucide="users" style="width:28px;height:28px"></i></div>
        <div style="flex:1;min-width:160px">
          <div style="font-size:13px;font-weight:800;color:#065f46;margin-bottom:3px">Want 1-on-1 tutoring for this subject?</div>
          <div style="font-size:12px;color:#166534;line-height:1.5">Get a personal tutor who teaches you live — online or at home in Rwanda.</div>
        </div>
        <button onclick="navigate('register')" style="background:#059669;color:#fff;border:none;padding:9px 16px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:700;white-space:nowrap">Create Student Account →</button>
      </div>
    </div>
    <div id="modal-root"></div>`)

  } catch(e) {
    toast(e.message, 'err')
    navigate('courses')
  }
}

// ── Course Checkout Modal ────────────────────────────────────────────────────
// ── Not logged in — prompt to sign in or register ───────────────────────────
function openLoginPrompt(courseId, courseTitle, price) {
  const modalRoot = document.getElementById('modal-root') || (() => {
    const d = document.createElement('div'); d.id = 'modal-root'; document.body.appendChild(d); return d
  })()
  const priceDisplay = price > 0 ? 'RWF ' + Number(price).toLocaleString() : 'FREE'
  modalRoot.innerHTML = `
  <div class="modal-overlay" onclick="if(event.target===this)this.remove()">
    <div class="modal" style="max-width:420px">
      <div class="modal-header">
        <span class="modal-title">🎓 Enroll in Course</span>
        <button class="modal-close" onclick="document.querySelector('.modal-overlay').remove()">✕</button>
      </div>
      <div class="modal-body">
        <div style="background:linear-gradient(135deg,#0f172a,#1e3a8a);border-radius:12px;padding:16px 18px;margin-bottom:20px;color:#fff">
          <div style="font-size:13px;opacity:0.7;margin-bottom:4px">Enrolling in</div>
          <div style="font-size:15px;font-weight:800">${courseTitle}</div>
          <div style="font-size:22px;font-weight:900;color:#fbbf24;margin-top:6px">${priceDisplay}</div>
        </div>
        <div style="background:#fef9c3;border:1px solid #fde047;border-radius:10px;padding:14px;margin-bottom:20px;font-size:13px;color:#713f12;line-height:1.6">
          📋 You need a student account to enroll. Register once and access all courses + tutors from your dashboard.
        </div>
        <div style="display:flex;flex-direction:column;gap:10px">
          <button onclick="document.querySelector('.modal-overlay').remove();navigate('register')"
            style="display:flex;align-items:center;gap:14px;background:linear-gradient(135deg,#dbeafe,#eff6ff);border:1.5px solid var(--blue);border-radius:12px;padding:14px 16px;cursor:pointer;text-align:left;width:100%">
            <span style="font-size:26px">🎓</span>
            <div>
              <div style="font-size:13px;font-weight:800;color:var(--blue)">Create a Student Account</div>
              <div style="font-size:12px;color:var(--g600);margin-top:2px">Free to register — get courses, tutors & live sessions</div>
            </div>
          </button>
          <button onclick="document.querySelector('.modal-overlay').remove();navigate('login')"
            style="display:flex;align-items:center;gap:14px;background:#f8fafc;border:1.5px solid var(--g100);border-radius:12px;padding:14px 16px;cursor:pointer;text-align:left;width:100%">
            <span style="font-size:26px">🔑</span>
            <div>
              <div style="font-size:13px;font-weight:800;color:var(--navy)">I already have an account</div>
              <div style="font-size:12px;color:var(--g400);margin-top:2px">Sign in to enroll</div>
            </div>
          </button>
        </div>
      </div>
      <div class="modal-footer" style="justify-content:center">
        <button class="btn btn-ghost" onclick="document.querySelector('.modal-overlay').remove()">Cancel</button>
      </div>
    </div>
  </div>`
}


// ── Student: My Courses ──────────────────────────────────────────────────────
async function renderMyCourses() {
  if (!State.user || !localStorage.getItem('tc_access')) { navigate('login'); return }
  const isCourseGuest = _isCourseGuestAccount()
  render(dashWrap('my-courses', `<div class="loader-center"><div class="spinner"></div></div>`))

  try {
    const res = await fetch(API_URL + '/courses/my', {
      headers: { Authorization: 'Bearer ' + getToken() }
    })
    const courses = await res.json()

    render(dashWrap('my-courses', `
    <div class="page-header">
      <div><h1 class="page-title">📚 My Courses</h1><p class="page-subtitle">${courses.length} enrolled course${courses.length !== 1 ? 's' : ''}</p></div>
      <button class="btn btn-ghost" onclick="navigate('courses')">Browse More Courses</button>
    </div>

    ${isCourseGuest ? `
    <div style="background:linear-gradient(135deg,#7c3aed11,#5b21b611);border:1.5px solid #7c3aed33;border-radius:14px;padding:16px 20px;display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:24px">
      <div style="background:#ede9fe;color:#7c3aed;width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center"><i data-lucide="graduation-cap" style="width:24px;height:24px"></i></div>
      <div style="flex:1;min-width:200px">
        <div style="font-size:14px;font-weight:800;color:#5b21b6">You have a Course-Only account</div>
        <div style="font-size:12px;color:#7c3aed;margin-top:3px">Upgrade to get 1-on-1 tutoring, live sessions, and the full Mathrone experience — in one click.</div>
      </div>
      <button onclick="upgradeToCourseStudent()" style="background:linear-gradient(135deg,#7c3aed,#5b21b6);color:#fff;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:700;white-space:nowrap;display:flex;align-items:center;gap:6px"><i data-lucide="users" style="width:16px;height:16px"></i> Find a Tutor & Upgrade</button>
    </div>` : ''}

    ${courses.length ? `
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px">
      ${courses.map(c => `
      <div style="background:#fff;border-radius:14px;border:1px solid var(--g100);overflow:hidden;cursor:pointer;transition:box-shadow .2s"
        onclick="navigate('course-lessons-${c.id}')"
        onmouseover="this.style.boxShadow='0 4px 20px rgba(0,0,0,0.08)'"
        onmouseout="this.style.boxShadow='none'">
        <div style="height:140px;background:linear-gradient(135deg,#1E3A8A,#2563EB);position:relative;overflow:hidden">
          ${c.image_url ? `<img src="${c.image_url}" alt="${c.title}" loading="lazy" style="width:100%;height:100%;object-fit:cover;opacity:0.85"/>` : `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:48px">🎓</div>`}
          <div style="position:absolute;bottom:10px;left:12px;background:rgba(0,0,0,0.5);color:#fff;font-size:10px;font-weight:700;padding:3px 10px;border-radius:999px;backdrop-filter:blur(4px)">✅ Enrolled</div>
          ${c.level ? `<div style="position:absolute;top:10px;right:12px;background:rgba(255,255,255,0.9);color:var(--navy);font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px">${c.level}</div>` : ''}
        </div>
        <div style="padding:16px">
          <div style="font-size:15px;font-weight:800;color:var(--navy);margin-bottom:6px">${c.title}</div>
          ${c.description ? `<div style="font-size:12px;color:var(--g400);line-height:1.5;margin-bottom:12px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${c.description}</div>` : ''}
          <button style="width:100%;background:var(--blue);color:#fff;border:none;padding:9px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:700">
            ▶ Continue Learning
          </button>
        </div>
      </div>`).join('')}
    </div>` : `
    <div class="empty-state">
      <div class="empty-icon">📚</div>
      <div class="empty-title">No courses yet</div>
      <div class="empty-sub">Browse our courses and enroll to start learning</div>
      <button class="btn btn-primary" style="margin-top:16px" onclick="navigate('courses')">Browse Courses</button>
    </div>`}
    `))
  } catch(e) { toast(e.message, 'err') }
}

// ── Student: Course Lessons ──────────────────────────────────────────────────
async function renderCourseLessons(courseId) {
  if (!State.user || !localStorage.getItem('tc_access')) { navigate('login'); return }
  const isCourseGuest = _isCourseGuestAccount()
  render(dashWrap('my-courses', `<div class="loader-center"><div class="spinner"></div></div>`))

  try {
     const res = await fetch(API_URL + '/courses/my/' + courseId + '/lessons', {
      headers: { Authorization: 'Bearer ' + getToken() }
    })
    if (!res.ok) throw new Error('Access denied or course not found')
    const lessons = await res.json()
    window._currentLessons = lessons

    render(dashWrap('my-courses', `
    <div class="page-header">
      <div><h1 class="page-title">📖 Course Lessons</h1><p class="page-subtitle">${lessons.length} lesson${lessons.length !== 1 ? 's' : ''}</p></div>
      <button class="btn btn-ghost" onclick="navigate('my-courses')">← My Courses</button>
    </div>
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:16px;display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:20px">
      <div style="background:#dbeafe;color:#1d4ed8;width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center"><i data-lucide="users" style="width:24px;height:24px"></i></div>
      <div style="flex:1;min-width:160px">
        <div style="font-size:13px;font-weight:800;color:#1e40af;margin-bottom:3px">Want a personal tutor for this subject?</div>
        <div style="font-size:12px;color:#1d4ed8;line-height:1.5">Get live 1-on-1 sessions — online or at home in Rwanda.</div>
      </div>
      <button onclick="navigate('tutors')" style="background:var(--blue);color:#fff;border:none;padding:9px 16px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:700;white-space:nowrap">Find a Tutor →</button>
    </div>
    ${lessons.length ? `
    <div style="display:flex;flex-direction:column;gap:6px">
      ${(() => {
        let currentModule = null;
        return lessons.map((l, i) => {
          let moduleHeader = '';
          if (l.module_title && l.module_title !== currentModule) {
            currentModule = l.module_title;
            moduleHeader = `<div style="font-size:14px;font-weight:800;color:var(--navy);text-transform:uppercase;letter-spacing:0.05em;margin:16px 0 8px;padding-bottom:4px;border-bottom:2px solid var(--g100)">${l.module_title}</div>`;
          }
          return `
          ${moduleHeader}
          <div onclick="openLessonPlayer('${l.id}')" style="background:#fff;border:1px solid #e5e7eb;border-radius:4px;overflow:hidden;margin-bottom:8px;cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,0.05);transition:transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
            <div style="display:flex;align-items:center;">
              <div style="width:clamp(120px, 30vw, 160px);aspect-ratio:16/9;background:#f3f4f6;flex-shrink:0;position:relative;">
                 <div style="display:flex;align-items:center;justify-content:center;height:100%;background:#1e3a8a;color:#fff;font-size:24px;font-weight:800;">${l.order_num || i+1}</div>
                 <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.1);">
                   <i data-lucide="play-circle" style="width:32px;height:32px;color:#fff;opacity:0.9"></i>
                 </div>
              </div>
              <div style="padding:16px;flex:1;display:flex;flex-direction:column;justify-content:center;">
                <h3 style="font-size:15px;font-weight:700;color:#111827;margin-bottom:4px;line-height:1.3;">${l.title}</h3>
                <p style="font-size:12px;color:#6b7280;margin-bottom:6px;">Mathrone Academy, Instructor</p>
                <div style="display:flex;gap:4px;color:#10b981;font-size:12px;">
                  ★ ★ ★ ★ ★ <span style="color:#9ca3af;margin-left:4px;">${l.duration_mins ? `${l.duration_mins} min` : 'Video Lesson'}</span>
                </div>
              </div>
            </div>
            <div style="background:#374151;padding:10px 16px;">
              <div style="display:flex;align-items:center;gap:12px;">
                <div style="width:100%;height:4px;background:#4b5563;border-radius:2px;overflow:hidden;position:relative;">
                   <div style="width:${i===0?'100%':i===1?'40%':'0%'};height:100%;background:#10b981;border-radius:2px;"></div>
                </div>
                <span style="font-size:11px;color:#9ca3af;white-space:nowrap;">${i===0?'Completed':i===1?'In progress':'Not started'}</span>
              </div>
            </div>
          </div>`;
        }).join('');
      })()}
    </div>` : `
    <div class="empty-state">
      <div class="empty-icon">🎬</div>
      <div class="empty-title">No lessons yet</div>
      <div class="empty-sub">Lessons will appear here once added by your instructor</div>
    </div>`}
    <div id="modal-root"></div>
    `))
  } catch(e) { toast(e.message, 'err') }
}

function openLessonPlayer(lessonId) {
  const l = window._currentLessons?.find(x => x.id === lessonId);
  if (!l) { toast('Lesson not found', 'err'); return; }
  
  let videoHtml = '';
  if (l.video_url) {
    const ytMatch = l.video_url.match(/(?:embed\/|v=|youtu\.be\/)([\w-]{11})/);
    const ytId = ytMatch ? ytMatch[1] : '';
    const thumbUrl = ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : '';
    const cleanUrl = ytId ? `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1&showinfo=0&controls=1` : l.video_url;
    
    videoHtml = `
    <div style="position:relative;padding-bottom:56.25%;height:0;background:#000;border-radius:0;overflow:hidden;border-bottom:1px solid var(--g100)">
      <div id="lesson-vid-cover" onclick="this.style.display='none'; document.getElementById('lesson-vid-iframe').src='${cleanUrl}'" 
           style="position:absolute;top:0;left:0;width:100%;height:100%;cursor:pointer;background:#000 url('${thumbUrl}') center/cover no-repeat;display:flex;align-items:center;justify-content:center;z-index:2">
        <div style="width:64px;height:64px;background:var(--blue);border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(26,95,255,0.4);transition:transform 0.2s" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left:4px"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        </div>
      </div>
      <iframe id="lesson-vid-iframe" src=""
        style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;z-index:1"
        allowfullscreen allow="autoplay; encrypted-media; picture-in-picture"></iframe>
    </div>`;
  }

  // Rich Text Content Html
  let contentHtml = '';
  if (l.content) {
    contentHtml = `<div class="news-article-body" style="padding:20px; font-size:15px; color:var(--navy); line-height:1.7;">${l.content}</div>`;
  }
  
  // Notes Html
  let notesHtml = '';
  if (l.notes) {
    notesHtml = `<div style="padding:20px; background:var(--sky); border-top:1px solid var(--g100);">
      <h4 style="font-size:14px; font-weight:800; color:var(--blue); margin-bottom:10px; text-transform:uppercase; letter-spacing:0.05em;">📋 Key Notes</h4>
      <div style="font-size:14px; color:var(--navy); line-height:1.7; white-space:pre-line;">${l.notes}</div>
    </div>`;
  }

  // Resources Html
  let resHtml = '';
  if (l.resources && l.resources.length > 0) {
     resHtml = `<div style="padding:20px; border-top:1px solid var(--g100);">
       <h4 style="font-size:14px; font-weight:800; color:var(--navy); margin-bottom:12px;">🔗 Lesson Resources</h4>
       <div style="display:flex; flex-direction:column; gap:8px;">
         ${l.resources.map(r => `
           <a href="${r.url}" target="_blank" style="display:flex; align-items:center; gap:10px; padding:12px; background:#f8fafc; border:1px solid var(--g100); border-radius:8px; text-decoration:none; color:var(--blue); font-weight:600; transition:all 0.2s;" onmouseover="this.style.background='var(--sky)'" onmouseout="this.style.background='#f8fafc'">
             <span style="font-size:20px;">${r.type === 'pdf' ? '📄' : r.type === 'doc' ? '📝' : '🔗'}</span>
             <span>${r.label || 'View Resource'}</span>
           </a>
         `).join('')}
       </div>
     </div>`;
  }

  // AI Tutor CTA (Only for logged-in users)
  let aiHtml = '';
  if (State.user) {
    aiHtml = `
    <div style="margin:20px;background:linear-gradient(135deg,#faf5ff,#f3e8ff);border:1px solid #e9d5ff;border-radius:12px;padding:16px;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
      <div style="background:#d8b4fe;padding:12px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0"><i data-lucide="bot" style="width:24px;height:24px;color:#4c1d95"></i></div>
      <div style="flex:1;min-width:200px">
        <div style="font-size:14px;font-weight:800;color:#4c1d95;margin-bottom:4px">Still confused about this topic?</div>
        <div style="font-size:12px;color:#6b21a8;line-height:1.5">Our AI Study Tutor is online 24/7. Ask it to explain differently, give you a real-world example, or quiz you!</div>
      </div>
      <button onclick="document.querySelector('.modal-overlay').remove(); navigate('quiz')" style="background:#7c3aed;color:#fff;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:700;white-space:nowrap;box-shadow:0 4px 12px rgba(124,58,237,0.3);width:100%;max-width:200px;text-align:center;">Ask AI Tutor →</button>
    </div>`;
  }

  // Free Preview CTA (Shown ONLY if it is marked as a Free Preview)
  let ctaHtml = '';
  if (l.is_free_preview) {
     ctaHtml = `<div style="padding:24px 20px; background:linear-gradient(135deg, var(--navy), var(--blue)); color:#fff; text-align:center; border-radius:0 0 12px 12px; margin-top:auto;">
       <div style="font-size:28px; margin-bottom:12px;">🚀</div>
       <h3 style="font-size:20px; font-weight:800; margin-bottom:10px; color:#fff;">Ready to master this topic?</h3>
       <p style="font-size:14px; opacity:0.9; margin-bottom:20px; max-width:500px; margin-left:auto; margin-right:auto;">This free lesson is just the beginning! Unlock our full premium courses to get complete access to advanced topics, interactive quizzes, and 1-on-1 tutor support.</p>
       <button onclick="document.querySelector('.modal-overlay').remove(); navigate('courses')" class="btn btn-primary" style="background:var(--gold); color:#1a1a1a; font-weight:800; padding:12px 24px; font-size:15px; border:none;">Browse Premium Courses →</button>
     </div>`;
  }

  const modal = document.getElementById('modal-root') || document.createElement('div')
  if (!modal.id) { modal.id = 'modal-root'; document.body.appendChild(modal) }
  modal.innerHTML = `
  <div class="modal-overlay" onclick="if(event.target===this)this.remove()">
    <div class="modal" style="max-width:800px; width:100%; margin:auto; max-height:90vh; display:flex; flex-direction:column;">
      <div class="modal-header" style="flex-shrink:0; flex-wrap:wrap; gap:8px;">
        <span class="modal-title" style="font-size:16px;">▶ ${l.title}</span>
        <div style="display:flex;align-items:center;gap:12px;margin-left:auto">
          ${l.video_url ? `
          <label style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--g600);cursor:pointer;background:var(--sky);padding:4px 10px;border-radius:999px" title="Hide video to save internet data">
            <input type="checkbox" onchange="document.getElementById('lesson-video-wrapper').style.display = this.checked ? 'none' : 'block'" style="accent-color:var(--blue)">
            <span>📉 Data Saver Mode</span>
          </label>` : ''}
          <button class="modal-close" style="margin:0;" onclick="document.querySelector('.modal-overlay').remove()">✕</button>
        </div>
      </div>
      <div class="modal-body" style="padding:0; overflow-y:auto; flex:1; display:flex; flex-direction:column;">
        ${videoHtml}
        ${contentHtml}
        ${notesHtml}
        ${resHtml}
        ${aiHtml}
        ${ctaHtml}
        ${!videoHtml && !contentHtml && !notesHtml && !resHtml && !aiHtml && !ctaHtml ? `<div style="padding:40px; text-align:center; color:var(--g400);">No content available for this lesson.</div>` : ''}
      </div>
    </div>
  </div>`;
  
  // Trigger MathJax if there are formulas
  setTimeout(() => { if(window.MathJax) MathJax.typesetPromise() }, 100);
}

// ── Course-Guest Account Upgrade ─────────────────────────────────────────────
function upgradeToCourseStudent() {
  const modalRoot = document.getElementById('modal-root') || document.getElementById('modal-root-upgrade') || (() => {
    const d = document.createElement('div'); d.id = 'modal-root'; document.body.appendChild(d); return d
  })()

  modalRoot.innerHTML = `
  <div class="modal-overlay" onclick="if(event.target===this)this.remove()">
    <div class="modal" style="max-width:480px">
      <div class="modal-header">
        <span class="modal-title" style="display:flex;align-items:center;gap:8px"><i data-lucide="rocket" style="width:20px;height:20px"></i> Upgrade to Full Student Account</span>
        <button class="modal-close" onclick="document.querySelector('.modal-overlay').remove()">✕</button>
      </div>
      <div class="modal-body">
        <div style="background:linear-gradient(135deg,#7c3aed,#5b21b6);border-radius:12px;padding:20px;margin-bottom:20px;color:#fff">
          <div style="font-size:22px;margin-bottom:6px;display:flex;align-items:center;gap:8px"><i data-lucide="users" style="width:24px;height:24px"></i> Get a Personal Tutor</div>
          <div style="font-size:14px;opacity:0.85;line-height:1.6">Your course account will be upgraded — <strong>no new email or password needed</strong>. Just fill in your details below.</div>
        </div>
        <div style="background:#f8fafc;border-radius:10px;padding:14px;margin-bottom:20px">
          <div style="font-size:12px;font-weight:800;color:var(--navy);margin-bottom:10px;text-transform:uppercase;letter-spacing:.04em">What you'll get</div>
          <div style="display:flex;flex-direction:column;gap:8px">
            ${['Book live 1-on-1 sessions with tutors','Browse and choose your perfect tutor','Direct messaging with tutors','Keep all your enrolled courses','Full dashboard and progress tracking'].map(item => `<div style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--g600)"><i data-lucide="check-circle-2" style="width:16px;height:16px;color:var(--green)"></i> <span>${item}</span></div>`).join('')}
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Full Name *</label>
          <input class="input" id="upgrade-name" value="${State.user?.full_name || ''}" placeholder="e.g. Jean Claude Mugisha"/>
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">School Level</label>
            <select class="input" id="upgrade-level">
              <option value="">— Select —</option>
              <optgroup label="Primary (P1-P6)">${REB_LEVELS_PRIMARY.map(l => '<option value="'+l+'">'+l+'</option>').join('')}</optgroup>
              <optgroup label="Secondary (S1-S6)">${REB_LEVELS_SECONDARY.map(l => '<option value="'+l+'">'+l+'</option>').join('')}</optgroup>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Learning Mode</label>
            <select class="input" id="upgrade-mode">
              <option value="online">Online</option>
              <option value="home_visit">Home Visit</option>
              <option value="both">Both</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">New Password (optional)</label>
          <input class="input" type="password" id="upgrade-pw" placeholder="Leave blank to keep current password"/>
          <div style="font-size:11px;color:var(--g400);margin-top:4px">You can set a memorable password to replace the auto-generated one</div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="document.querySelector('.modal-overlay').remove()">Cancel</button>
        <button class="btn btn-primary" id="upgrade-btn" onclick="submitCourseAccountUpgrade()" style="background:linear-gradient(135deg,#7c3aed,#5b21b6)">
          🚀 Upgrade My Account →
        </button>
      </div>
    </div>
  </div>`
}

async function submitCourseAccountUpgrade() {
  const name  = document.getElementById('upgrade-name')?.value?.trim()
  const level = document.getElementById('upgrade-level')?.value
  const mode  = document.getElementById('upgrade-mode')?.value || 'online'
  const pw    = document.getElementById('upgrade-pw')?.value
  const btn   = document.getElementById('upgrade-btn')

  if (!name) { toast('Full name is required', 'err'); return }
  if (btn) { btn.disabled = true; btn.textContent = 'Upgrading...' }

  try {
    await api('/auth/upgrade-to-student', {
      method: 'POST',
      body: JSON.stringify({ full_name: name, school_level: level || 'Unknown', preferred_mode: mode })
    })
    if (pw && pw.length >= 6) {
      try { await api('/auth/update-password', { method: 'POST', body: JSON.stringify({ password: pw }) }) } catch(_) {}
    }
    document.querySelector('.modal-overlay')?.remove()
    toast('Account upgraded! Welcome to Mathrone Academy.', 'ok')
    try {
      const me = await api('/auth/me')
      State.user = me
      localStorage.setItem('tc_user', JSON.stringify(me))
    } catch(_) {}
    setTimeout(() => navigate('tutors'), 900)
  } catch(e) {
    toast(e.message || 'Upgrade failed. Please try again.', 'err')
    if (btn) { btn.disabled = false; btn.textContent = '🚀 Upgrade My Account →' }
  }
}

// ── Admin: Courses Manager ───────────────────────────────────────────────────
async function renderAdminCourses() {
  render(dashWrap('admin-courses', `<div class="loader-center"><div class="spinner"></div></div>`))
  try {
    const tab = State.tab || 'courses'
    const [courses, orders] = await Promise.all([
      api('/courses/admin/all'),
      api('/courses/admin/orders')
    ])
    const pendingOrders = orders.filter(o => o.status === 'pending').length

    render(dashWrap('admin-courses', `
    <div class="page-header">
      <div><h1 class="page-title" style="display:flex;align-items:center;gap:8px"><i data-lucide="library" style="width:28px;height:28px;color:var(--blue)"></i> Courses Manager</h1><p class="page-subtitle">${courses.length} courses • ${orders.length} orders${pendingOrders ? ' • ' + pendingOrders + ' pending' : ''}</p></div>
      ${tab === 'courses' ? `<button class="btn btn-primary" onclick="openAddCourseModal()">+ Add Course</button>` : ''}
    </div>
    <div class="tabs" style="margin-bottom:24px">
      <button class="tab-btn ${tab === 'courses' ? 'active' : ''}" onclick="State.tab='courses';renderAdminCourses()">Courses (${courses.length})</button>
      <button class="tab-btn ${tab === 'orders' ? 'active' : ''}" onclick="State.tab='orders';renderAdminCourses()">
        Orders (${orders.length})${pendingOrders ? ` <span style="background:#ef4444;color:#fff;border-radius:999px;font-size:11px;padding:1px 6px;margin-left:4px">${pendingOrders}</span>` : ''}
      </button>
    </div>

    ${tab === 'courses' ? `
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px">
      ${courses.map(c => `
      <div class="card" style="padding:0;overflow:hidden">
        <div style="height:130px;background:linear-gradient(135deg,#1E3A8A,#2563EB);position:relative;overflow:hidden">
          ${c.image_url ? `<img src="${c.image_url}" alt="${c.title}" loading="lazy" style="width:100%;height:100%;object-fit:cover;opacity:0.8"/>` : `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:40px">🎓</div>`}
          <div style="position:absolute;top:8px;right:8px;background:${c.is_published ? '#dcfce7' : '#fee2e2'};color:${c.is_published ? '#065f46' : '#991b1b'};font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px">${c.is_published ? '✅ Published' : '⏸ Draft'}</div>
          ${c.level ? `<div style="position:absolute;bottom:8px;left:8px;background:rgba(255,255,255,0.92);color:var(--navy);font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px">${c.level}</div>` : ''}
        </div>
        <div style="padding:14px">
          <div style="font-size:14px;font-weight:700;color:var(--navy);margin-bottom:2px">${c.title}</div>
          <div style="font-size:12px;color:var(--g400);margin-bottom:8px">${c.subject || '—'} ${c.level ? '• ' + c.level : ''}</div>
          <div style="font-size:16px;font-weight:800;color:var(--navy);margin-bottom:12px">${c.price > 0 ? 'RWF ' + Number(c.price).toLocaleString() : 'FREE'}</div>
          <div style="display:flex;gap:6px">
            <button class="btn btn-ghost btn-sm" style="flex:1" onclick="openEditCourseModal(${JSON.stringify(c).replace(/"/g,'&quot;')})"><i data-lucide="edit" style="width:14px;height:14px;margin-right:4px"></i> Edit</button>
            <button class="btn btn-ghost btn-sm" onclick="manageLessons('${c.id}','${(c.title||'').replace(/'/g,"\\'")}')"><i data-lucide="list-video" style="width:14px;height:14px;margin-right:4px"></i> Lessons</button>
            <button class="btn btn-ghost btn-sm" style="color:var(--red)" onclick="deleteCourseAdmin('${c.id}','${(c.title||'').replace(/'/g,"\\'")}')"><i data-lucide="trash-2" style="width:16px;height:16px"></i></button>
          </div>
        </div>
      </div>`).join('')}
      ${!courses.length ? `<div class="empty-state"><div class="empty-sub">No courses yet. Create your first!</div></div>` : ''}
    </div>` : `
    <!-- Orders Tab -->
    <div class="table-wrap">
      <table>
        <thead><tr><th>Customer</th><th>Course</th><th>Price</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
        <tbody>
          ${orders.map(o => `<tr>
            <td>
              <div style="font-weight:700;color:var(--navy)">${o.full_name}</div>
              <div style="font-size:12px;color:var(--g400)">${o.phone}</div>
            </td>
            <td style="font-size:13px;font-weight:600">${o.courses?.title || '—'}</td>
            <td style="font-weight:800;color:var(--navy)">RWF ${Number(o.courses?.price || 0).toLocaleString()}</td>
            <td>${statusBadge(o.status)}</td>
            <td style="font-size:12px">${fmtShort(o.created_at)}</td>
            <td>
              <div style="display:flex;gap:6px;flex-wrap:wrap">
                ${o.status === 'pending' ? `
                  <button class="btn btn-primary btn-sm" onclick="approveCourseOrder('${o.id}',this)" style="background:#059669">
                    ✅ Grant Access
                  </button>
                  <button class="btn btn-ghost btn-sm" style="color:var(--red)" onclick="rejectCourseOrder('${o.id}',this)">✕</button>
                ` : o.status === 'approved' ? `
                  <button class="btn btn-ghost btn-sm" style="color:#059669;cursor:default">✅ Approved</button>
                ` : `
                  <span style="font-size:12px;color:var(--g400)">${o.status}</span>
                `}
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`}
    <div id="modal-root"></div>
    `))
  } catch(e) { toast(e.message, 'err') }
}

async function approveCourseOrder(orderId, btn) {
  if (btn) { btn.disabled = true; btn.textContent = 'Granting...' }
  try {
    await api('/courses/admin/orders/' + orderId + '/approve', { method: 'POST', body: '{}' })
    toast('✅ Access granted! Student is now enrolled.')
    renderAdminCourses()
  } catch(e) {
    toast(e.message, 'err')
    if (btn) { btn.disabled = false; btn.textContent = '✅ Grant Access' }
  }
}


// ── Logged-in student: request enrollment ────────────────────────────────────
async function memberEnrollCourse(courseId, courseTitle, price) {
  if (!price || Number(price) <= 0) {
    return submitEnrollmentRequest(courseId, courseTitle, 0);
  }

  const modalRoot = document.getElementById('modal-root') || (() => {
    const d = document.createElement('div'); d.id = 'modal-root'; document.body.appendChild(d); return d
  })()
  const priceDisplay = price > 0 ? 'RWF ' + Number(price).toLocaleString() : 'FREE'
  const payNote = price > 0
    ? `
      <div style="font-weight:800;color:var(--navy);margin-bottom:8px;">How to pay via MoMo/Airtel:</div>
      <ol style="padding-left:16px;margin-bottom:12px;display:flex;flex-direction:column;gap:6px">
        <li>Dial <strong>*182*8*1*178251#</strong> 
        <li>Or send money directly to <strong>0786 684 285</strong> (Mathrone Academy)</li>
        <li>Click "Submit Request" below.</li>
        <li>Send a screenshot of your payment message to our WhatsApp.</li>
      </ol>
      <div>Once confirmed, admin will instantly unlock the course for you.</div>
      `
    : 'This is a free course. Click below to enroll and start learning immediately.'

  modalRoot.innerHTML = `
  <div class="modal-overlay" onclick="if(event.target===this)this.remove()">
    <div class="modal" style="max-width:420px">
      <div class="modal-header">
        <span class="modal-title">🎓 Request Enrollment</span>
        <button class="modal-close" onclick="document.querySelector('.modal-overlay').remove()">✕</button>
      </div>
      <div class="modal-body">
        <div style="background:linear-gradient(135deg,#0f172a,#1e3a8a);border-radius:12px;padding:16px 18px;margin-bottom:16px;color:#fff">
          <div style="font-size:13px;opacity:0.7;margin-bottom:4px">Enrolling in</div>
          <div style="font-size:15px;font-weight:800">${courseTitle}</div>
          <div style="font-size:22px;font-weight:900;color:#fbbf24;margin-top:6px">${priceDisplay}</div>
        </div>
        <div style="background:var(--sky);border-radius:10px;padding:14px;font-size:13px;color:var(--g600);line-height:1.6">
          ${payNote}
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="document.querySelector('.modal-overlay').remove()">Cancel</button>
        <button class="btn btn-primary" id="enroll-submit-btn" onclick="submitEnrollmentRequest('${courseId}','${courseTitle.replace(/'/g,"\'")}',${price})">
          ${price > 0 ? '✅ Submit Enrollment Request' : '✅ Enroll Now'}
        </button>
      </div>
    </div>
  </div>`
}

async function submitEnrollmentRequest(courseId, courseTitle, price) {
  const btn = document.getElementById('enroll-submit-btn')
  if (btn) { btn.disabled = true; btn.textContent = price > 0 ? 'Submitting...' : 'Enrolling...' }
  
  if (!price || Number(price) <= 0) {
    toast('Enrolling in free course... ⏳', 'info')
  }

  try {
    await api('/courses/request-enrollment', {
      method: 'POST',
      body: JSON.stringify({ course_id: courseId })
    })
    document.querySelector('.modal-overlay')?.remove()
    
    if (price > 0) {
      toast('Enrollment request submitted! Admin will grant access shortly. 🎓')
    } else {
      toast('Successfully enrolled! 🎓')
      navigate('my-courses')
    }
  } catch(e) {
    toast(e.message, 'err')
    if (btn) { btn.disabled = false; btn.textContent = price > 0 ? '✅ Submit Enrollment Request' : '✅ Enroll Now' }
  }
}

async function rejectCourseOrder(orderId, btn) {
  if (!confirm('Reject this enrollment order?')) return
  if (btn) { btn.disabled = true }
  try {
    await api('/courses/admin/orders/' + orderId + '/reject', { method: 'POST', body: '{}' })
    toast('Order rejected')
    renderAdminCourses()
  } catch(e) { toast(e.message, 'err') }
}

async function deleteCourseAdmin(id, title) {
  if (!confirm(`Delete course "${title}"? This will also remove all lessons and enrollments.`)) return
  try {
    await api('/courses/admin/' + id, { method: 'DELETE' })
    toast('Course deleted')
    renderAdminCourses()
  } catch(e) { toast(e.message, 'err') }
}

function openAddCourseModal(existing = null) {
  const isEdit = !!existing
  document.getElementById('modal-root').innerHTML = `
  <div class="modal-overlay" onclick="if(event.target===this)this.remove()">
    <div class="modal" style="max-width:520px">
      <div class="modal-header">
        <span class="modal-title">${isEdit ? '✏️ Edit Course' : '+ New Course'}</span>
        <button class="modal-close" onclick="document.querySelector('.modal-overlay').remove()">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Course Title *</label>
          <input class="input" id="c-title" value="${existing?.title || ''}" placeholder="e.g. Advanced Mathematics S6"/>
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Slug (URL) *</label>
            <input class="input" id="c-slug" value="${existing?.slug || ''}" placeholder="e.g. advanced-math-s6"/>
          </div>
          <div class="form-group">
            <label class="form-label">Price (RWF) *</label>
            <input class="input" type="number" id="c-price" value="${existing?.price || 0}" min="0"/>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Curriculum</label>
          <select class="input" id="c-curriculum" onchange="updateCourseLevelOptions(this.value)">
            ${COURSE_CURRICULA.map(cu => `<option value="${cu.id}" ${(existing?.curriculum||'REB') === cu.id ? 'selected' : ''}>${cu.icon} ${cu.label}</option>`).join('')}
          </select>
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Academic Level</label>
            <select class="input" id="c-level">
              <option value="">— Select Level —</option>
              ${_levelOptions(existing?.curriculum || 'REB', existing?.level)}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Subject</label>
            <select class="input" id="c-subject">
              <option value="">— Select Subject —</option>
              ${COURSE_SUBJECTS.map(s => `<option value="${s}" ${existing?.subject === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Term</label>
          <select class="input" id="c-term">
            <option value="">— Select Term —</option>
            ${COURSE_TERMS.map(t => `<option value="${t}" ${existing?.term === t ? 'selected' : ''}>${t}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea class="input" id="c-desc" rows="3" placeholder="What students will learn...">${existing?.description || ''}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Cover Image URL</label>
          <input class="input" id="c-image" value="${existing?.image_url || ''}" placeholder="https://..."/>
        </div>
        <div class="form-group">
          <label class="form-label">🎬 Course Preview Video (YouTube)</label>
          <input class="input" id="c-video" value="${existing?.video_url || ''}" placeholder="https://www.youtube.com/embed/VIDEO_ID"/>
          <div style="font-size:11px;color:var(--g400);margin-top:4px">
            Paste the <strong>embed URL</strong> of your unlisted YouTube video — e.g. <code>https://www.youtube.com/embed/abc123XYZ</code>. Shown as a teaser to public visitors before they enroll.
          </div>
          ${existing?.video_url ? `
          <div style="margin-top:10px;position:relative;padding-bottom:40%;height:0;overflow:hidden;border-radius:8px;background:#000">
            <iframe src="${existing.video_url.replace('youtube.com','youtube-nocookie.com')}"
              style="position:absolute;top:0;left:0;width:100%;height:100%;border:none" allowfullscreen loading="lazy"></iframe>
          </div>` : ''}
        </div>
        <div class="form-group" style="display:flex;gap:16px;flex-wrap:wrap;border-top:1px solid var(--g100);padding-top:16px">
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:14px">
            <input type="checkbox" id="c-published" ${existing?.is_published ? 'checked' : ''} style="width:16px;height:16px"/>
            ✅ Publish course
          </label>
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:14px">
            <input type="checkbox" id="c-examprep" ${existing?.is_exam_prep ? 'checked' : ''} style="width:16px;height:16px"/>
            📝 National Exam Prep / Past Papers
          </label>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="document.querySelector('.modal-overlay').remove()">Cancel</button>
        <button class="btn btn-primary" onclick="${isEdit ? `saveCourseEdit('${existing.id}')` : 'saveCourseNew()'}">${isEdit ? 'Save Changes' : 'Create Course'}</button>
      </div>
    </div>
  </div>`
}

function openEditCourseModal(c) { openAddCourseModal(c) }

function updateCourseLevelOptions(curriculum) {
  const levelSel = document.getElementById('c-level')
  if (!levelSel) return
  levelSel.innerHTML = '<option value="">— Select Level —</option>' + _levelOptions(curriculum, '')
}

function _getCourseFormData() {
  return {
    title:        document.getElementById('c-title')?.value?.trim(),
    slug:         document.getElementById('c-slug')?.value?.trim(),
    price:        parseFloat(document.getElementById('c-price')?.value) || 0,
    level:        document.getElementById('c-level')?.value || null,
    subject:      document.getElementById('c-subject')?.value?.trim() || null,
    description:  document.getElementById('c-desc')?.value?.trim() || null,
    image_url:    document.getElementById('c-image')?.value?.trim() || null,
    video_url:    document.getElementById('c-video')?.value?.trim() || null,
    is_published: document.getElementById('c-published')?.checked || false,
    is_exam_prep: document.getElementById('c-examprep')?.checked || false,
  }
}

async function saveCourseNew() {
  const data = _getCourseFormData()
  if (!data.title || !data.slug) { toast('Title and slug are required', 'err'); return }
  try {
    await api('/courses/admin', { method: 'POST', body: JSON.stringify(data) })
    document.querySelector('.modal-overlay')?.remove()
    toast('Course created ✅')
    renderAdminCourses()
  } catch(e) { toast(e.message, 'err') }
}

async function saveCourseEdit(id) {
  const data = _getCourseFormData()
  if (!data.title) { toast('Title is required', 'err'); return }
  try {
    await api('/courses/admin/' + id, { method: 'PATCH', body: JSON.stringify(data) })
    document.querySelector('.modal-overlay')?.remove()
    toast('Course updated ✅')
    renderAdminCourses()
  } catch(e) { toast(e.message, 'err') }
}

// ── Admin: Manage Lessons ────────────────────────────────────────────────────
async function manageLessons(courseId, courseTitle) {
  render(dashWrap('admin-courses', `<div class="loader-center"><div class="spinner"></div></div>`))
  try {
    const lessons = await api('/courses/my/' + courseId + '/lessons')
    render(dashWrap('admin-courses', `
    <div class="page-header">
      <div><h1 class="page-title">📋 Lessons — ${courseTitle}</h1><p class="page-subtitle">${lessons.length} lesson${lessons.length !== 1 ? 's' : ''}</p></div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-ghost" onclick="State.tab='courses';renderAdminCourses()">← Back</button>
        <button class="btn btn-primary" onclick="openAddLessonModal('${courseId}')">+ Add Lesson</button>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:10px">
      ${lessons.map((l, i) => `
      <div class="card" style="padding:16px;display:flex;align-items:center;gap:14px">
        <div style="width:36px;height:36px;border-radius:50%;background:var(--blue);color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">${l.order_num || i+1}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:14px;font-weight:700;color:var(--navy)">${l.title}</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px">
            ${l.duration_mins ? `<span style="font-size:11px;color:var(--g400)">⏱ ${l.duration_mins} min</span>` : ''}
            ${l.video_url ? `<span style="font-size:11px;color:var(--g400)">🎬 Video</span>` : ''}
            ${l.content ? `<span style="font-size:11px;color:var(--g400)">📝 Content</span>` : ''}
            ${l.notes ? `<span style="font-size:11px;color:var(--g400)">📋 Notes</span>` : ''}
            ${(l.quiz && l.quiz.length) ? `<span style="font-size:11px;color:#7c3aed">🧠 ${l.quiz.length} quiz Q</span>` : ''}
            ${(l.resources && l.resources.length) ? `<span style="font-size:11px;color:#059669">🔗 ${l.resources.length} resource${l.resources.length>1?'s':''}</span>` : ''}
            ${l.is_free_preview ? `<span style="font-size:11px;font-weight:700;color:#d97706;background:#fef3c7;padding:1px 6px;border-radius:999px">🔓 Free Preview</span>` : ''}
          </div>
        </div>
        <div style="display:flex;gap:6px;flex-shrink:0">
          <button class="btn btn-ghost btn-sm" onclick="openAddLessonModal('${courseId}', ${JSON.stringify(l).replace(/"/g,'&quot;')})">✏️ Edit</button>
          <button class="btn btn-ghost btn-sm" style="color:var(--red)" onclick="deleteLessonAdmin('${courseId}','${l.id}','${(l.title||'').replace(/'/g,"\\'")}','${courseTitle.replace(/'/g,"\\'")}')">🗑️</button>
        </div>
      </div>`).join('')}
      ${!lessons.length ? `<div class="empty-state"><div class="empty-sub">No lessons yet. Add your first lesson!</div></div>` : ''}
    </div>
    <div id="modal-root"></div>
    `))
  } catch(e) { toast(e.message, 'err') }
}

// ── Rich Lesson Editor ────────────────────────────────────────────────────────
// Uses Quill.js for rich text, KaTeX for math, and native file inputs for media.
// Loaded from CDN only when the modal opens — no page-load cost.

function openAddLessonModal(courseId, existing = null) {
  const isEdit = !!existing
  const modalRoot = document.getElementById('modal-root') || (() => {
    const d = document.createElement('div'); d.id = 'modal-root'; document.body.appendChild(d); return d
  })()

  modalRoot.innerHTML = `
  <div class="modal-overlay" onclick="if(event.target===this)this.remove()">
    <div class="modal" style="max-width:740px;width:95vw;max-height:92vh;display:flex;flex-direction:column">

      <!-- Header -->
      <div class="modal-header" style="flex-shrink:0">
        <span class="modal-title">${isEdit ? '✏️ Edit Lesson' : '➕ New Lesson'}</span>
        <button class="modal-close" onclick="document.querySelector('.modal-overlay').remove()">✕</button>
      </div>

      <!-- Scrollable body -->
      <div class="modal-body" style="flex:1;overflow-y:auto;padding:24px">

        <!-- Tabs -->
        <div style="display:flex;gap:0;border-bottom:2px solid var(--g100);margin-bottom:24px" id="lesson-tabs">
          ${['<i data-lucide="info" style="width:14px;height:14px;margin-right:4px;vertical-align:middle"></i> Basic',
             '<i data-lucide="video" style="width:14px;height:14px;margin-right:4px;vertical-align:middle"></i> Video',
             '<i data-lucide="file-text" style="width:14px;height:14px;margin-right:4px;vertical-align:middle"></i> Content',
             '<i data-lucide="sticky-note" style="width:14px;height:14px;margin-right:4px;vertical-align:middle"></i> Notes',
             '<i data-lucide="paperclip" style="width:14px;height:14px;margin-right:4px;vertical-align:middle"></i> Resources',
             '<i data-lucide="brain-circuit" style="width:14px;height:14px;margin-right:4px;vertical-align:middle"></i> Quiz'].map((t,i) => `
          <button onclick="switchLessonTab(${i})" id="ltab-${i}"
            style="padding:8px 14px;border:none;background:none;cursor:pointer;font-size:12px;font-weight:700;color:${i===0?'var(--blue)':'var(--g400)'};border-bottom:${i===0?'2px solid var(--blue)':'2px solid transparent'};margin-bottom:-2px;transition:all .15s;white-space:nowrap">
            ${t}
          </button>`).join('')}
        </div>

        <!-- TAB 0: Basic -->
        <div id="ltab-panel-0">
          <div class="form-group">
            <label class="form-label">Lesson Title *</label>
          <input class="input" id="l-title" value="${existing?.title || ''}" placeholder="e.g. Solving Quadratic Equations"/>
        </div>
        <div class="form-group">
          <label class="form-label">Unit / Module Name (optional)</label>
          <input class="input" id="l-module" value="${existing?.module_title || ''}" placeholder="e.g. Unit 1: Algebra"/>
          <div style="font-size:11px;color:var(--g400);margin-top:4px">Lessons with the same module name will be grouped together automatically.</div>
        </div>
        <div class="grid-2">
          <div class="form-group">
              <label class="form-label">Duration (minutes)</label>
              <input class="input" type="number" id="l-duration" value="${existing?.duration_mins || 0}" min="0"/>
            </div>
            <div class="form-group">
              <label class="form-label">Order Number</label>
              <input class="input" type="number" id="l-order" value="${existing?.order_num || 1}" min="1"/>
            </div>
          </div>
          <div class="form-group">
            <label style="display:flex;align-items:center;gap:10px;cursor:pointer">
              <input type="checkbox" id="l-preview" ${existing?.is_free_preview ? 'checked' : ''} style="width:18px;height:18px;accent-color:var(--blue)"/>
              <div>
                <div style="font-size:14px;font-weight:700;color:var(--navy)">🔓 Free Preview</div>
                <div style="font-size:12px;color:var(--g400)">Visible to non-enrolled students as a sample</div>
              </div>
            </label>
          </div>
        </div>

        <!-- TAB 1: Video -->
        <div id="ltab-panel-1" style="display:none">
          <div style="background:var(--sky);border-radius:10px;padding:14px;margin-bottom:16px;font-size:13px;color:var(--g600);line-height:1.6">
            📌 <strong>How to get the embed URL from YouTube:</strong><br>
            Open the video → click <em>Share</em> → click <em>Embed</em> → copy only the URL inside <code>src="..."</code><br>
            Example: <code style="background:#e2e8f0;padding:2px 6px;border-radius:4px">https://www.youtube.com/embed/dQw4w9WgXcQ</code>
          </div>
          <div class="form-group">
            <label class="form-label">YouTube Embed URL</label>
            <input class="input" id="l-video" value="${existing?.video_url || ''}" placeholder="https://www.youtube.com/embed/VIDEO_ID"/>
          </div>
          <div id="l-video-preview" style="margin-top:12px;display:${existing?.video_url ? 'block' : 'none'}">
            <div style="position:relative;padding-bottom:56.25%;height:0;border-radius:12px;overflow:hidden;background:#000">
              <iframe id="l-video-frame" src="${existing?.video_url || ''}"
                style="position:absolute;top:0;left:0;width:100%;height:100%;border:none"
                allowfullscreen loading="lazy"></iframe>
            </div>
          </div>
          <button onclick="previewVideo()" style="margin-top:10px;background:none;border:1.5px solid var(--g200);border-radius:8px;padding:8px 16px;cursor:pointer;font-size:13px;color:var(--navy)">👁 Preview Video</button>
        </div>

        <!-- TAB 2: Content (rich text + math) -->
        <div id="ltab-panel-2" style="display:none">
          <div style="background:var(--sky);border-radius:10px;padding:12px 14px;margin-bottom:14px;font-size:12px;color:var(--g600);line-height:1.7">
            ✍️ Type your lesson explanation normally — use the toolbar for <strong>bold</strong>, <em>italic</em>, lists, headings.<br>
            🧮 For <strong>math formulas</strong>, click the <strong>∑ Formula</strong> button and type LaTeX (e.g. <code>x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}</code>)<br>
            🖼️ For <strong>images</strong>, click <strong>📷 Image</strong> and paste a URL or upload a file.<br>
            📄 For <strong>PDFs</strong>, add them in the Resources tab — they'll show as a viewer in the lesson.
          </div>

          <!-- Toolbar -->
          <div id="l-toolbar" style="border:1.5px solid var(--g100);border-bottom:none;border-radius:10px 10px 0 0;background:#f8fafc;padding:6px 8px;display:flex;gap:4px;flex-wrap:wrap;align-items:center">
            <button onclick="lfmt('bold')" title="Bold" style="font-weight:900;font-size:14px" class="tb-btn">B</button>
            <button onclick="lfmt('italic')" title="Italic" style="font-style:italic;font-size:14px" class="tb-btn"><em>I</em></button>
            <button onclick="lfmt('underline')" title="Underline" style="text-decoration:underline;font-size:14px" class="tb-btn">U</button>
            <div style="width:1px;height:20px;background:var(--g100);margin:0 2px"></div>
            <button onclick="lfmtBlock('h2')" title="Heading" class="tb-btn" style="font-size:12px;font-weight:800">H2</button>
            <button onclick="lfmtBlock('h3')" title="Sub-heading" class="tb-btn" style="font-size:12px;font-weight:800">H3</button>
            <div style="width:1px;height:20px;background:var(--g100);margin:0 2px"></div>
            <button onclick="lfmtBlock('insertUnorderedList')" title="Bullet list" class="tb-btn">• List</button>
            <button onclick="lfmtBlock('insertOrderedList')" title="Numbered list" class="tb-btn">1. List</button>
            <button onclick="lfmtBlock('formatBlock','blockquote')" title="Quote / example" class="tb-btn">" Quote</button>
            <div style="width:1px;height:20px;background:var(--g100);margin:0 2px"></div>
            <button onclick="insertLessonLink()" class="tb-btn" style="color:var(--blue)">🔗 Link</button>
            <button onclick="insertMathFormula()" class="tb-btn" style="color:#7c3aed;font-weight:800">∑ Formula</button>
            <button onclick="document.getElementById('l-img-upload').click()" class="tb-btn" style="color:#059669">📷 Image</button>
            <button onclick="document.getElementById('l-img-url-row').style.display=document.getElementById('l-img-url-row').style.display==='none'?'flex':'none'" class="tb-btn" style="color:#059669">🌐 Image URL</button>
            <div id="l-formula-row" style="display:none;gap:8px;align-items:center;margin-top:8px;background:#faf5ff;border:1px solid #e9d5ff;border-radius:8px;padding:8px 10px">
              <span style="font-size:13px;color:#7c3aed;white-space:nowrap;font-weight:700">∑ LaTeX:</span>
              <input id="l-formula-input" class="input" style="flex:1;font-family:monospace" placeholder="e.g. x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}" onkeydown="if(event.key==='Enter'){event.preventDefault();insertFormulaFromBar()}"/>
              <button onclick="insertFormulaFromBar()" style="background:#7c3aed;color:#fff;border:none;padding:7px 14px;border-radius:7px;cursor:pointer;font-size:12px;font-weight:700;white-space:nowrap">Insert</button>
              <button onclick="document.getElementById('l-formula-row').style.display='none'" style="background:none;border:none;color:var(--g400);cursor:pointer;font-size:18px;line-height:1">×</button>
            </div>
            <div style="width:1px;height:20px;background:var(--g100);margin:0 2px"></div>
            <button onclick="lfmtBlock('removeFormat')" class="tb-btn" style="color:var(--g400);font-size:11px">Clear</button>
          </div>

          <!-- Editor area -->
          <div id="l-content-editor"
            contenteditable="true"
            style="border:1.5px solid var(--g100);border-radius:0 0 10px 10px;min-height:280px;padding:16px;font-size:14px;line-height:1.8;color:var(--navy);outline:none;font-family:inherit;overflow-y:auto"
            oninput="syncContentToHidden()"
            onkeydown="handleEditorKeydown(event)">
          </div>
          <input type="hidden" id="l-content"/>

          <!-- Image upload helper -->
          <input type="file" id="l-img-upload" accept="image/*" style="display:none" onchange="handleContentImageUpload(event)"/>
          <input type="file" id="l-pdf-upload" accept="application/pdf" style="display:none" onchange="handleContentPdfUpload(event)"/>

          <!-- Inline image URL bar (hidden by default) -->
          <div id="l-img-url-row" style="display:none;gap:8px;align-items:center;margin-top:8px;background:#f8fafc;border:1px solid var(--g100);border-radius:8px;padding:8px 10px">
            <span style="font-size:13px;color:var(--g400);white-space:nowrap">🌐 URL:</span>
            <input id="l-img-url-input" class="input" style="flex:1" placeholder="https://example.com/image.png"/>
            <button onclick="insertImageFromUrlBar()" style="background:var(--blue);color:#fff;border:none;padding:7px 14px;border-radius:7px;cursor:pointer;font-size:12px;font-weight:700;white-space:nowrap">Insert</button>
            <button onclick="document.getElementById('l-img-url-row').style.display='none'" style="background:none;border:none;color:var(--g400);cursor:pointer;font-size:18px;line-height:1">×</button>
          </div>
        </div>

        <!-- TAB 3: Notes -->
        <div id="ltab-panel-3" style="display:none">
          <div style="background:var(--sky);border-radius:10px;padding:12px 14px;margin-bottom:14px;font-size:12px;color:var(--g600);line-height:1.6">
            📋 Write key revision points students can refer to — one point per line. Keep them short and clear. These appear as a clean summary card below the lesson.
          </div>
          <div style="border:1.5px solid var(--g100);border-radius:10px;overflow:hidden">
            <div style="background:#f8fafc;padding:8px 12px;border-bottom:1px solid var(--g100);font-size:11px;font-weight:700;color:var(--g400)">KEY POINTS</div>
            <textarea id="l-notes" style="width:100%;border:none;outline:none;padding:14px;font-size:14px;line-height:1.9;color:var(--navy);font-family:inherit;min-height:200px;resize:vertical;box-sizing:border-box" placeholder="- The quadratic formula is x = (-b ± √(b²−4ac)) / 2a&#10;- The discriminant (b²−4ac) tells us the number of solutions&#10;- If discriminant > 0: two real roots&#10;- If discriminant = 0: one repeated root&#10;- If discriminant < 0: no real roots">${existing?.notes || ''}</textarea>
          </div>
        </div>

        <!-- TAB 4: Resources -->
        <div id="ltab-panel-4" style="display:none">
          <div style="background:var(--sky);border-radius:10px;padding:12px 14px;margin-bottom:14px;font-size:12px;color:var(--g600);line-height:1.6">
            🔗 Add links to PDFs, past papers, worksheets, or any external resources. PDFs will display as an embedded viewer inside the lesson. Links will open in a new tab.
          </div>
          <div id="resources-list" style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px">
            ${(existing?.resources || []).map((r,i) => `
            <div class="res-row" style="display:flex;gap:8px;align-items:center;background:#f8fafc;border:1px solid var(--g100);border-radius:8px;padding:10px">
              <span style="font-size:20px">${r.type==='pdf'?'📄':r.type==='doc'?'📝':'🔗'}</span>
              <input class="input" style="flex:1;min-width:0" placeholder="Label e.g. Past Paper 2023" value="${r.label}" data-key="label"/>
              <input class="input" style="flex:2;min-width:0" placeholder="URL https://..." value="${r.url}" data-key="url"/>
              <select class="input" style="width:90px;flex-shrink:0" data-key="type">
                <option value="pdf" ${r.type==='pdf'?'selected':''}>📄 PDF</option>
                <option value="link" ${r.type==='link'?'selected':''}>🔗 Link</option>
                <option value="doc" ${r.type==='doc'?'selected':''}>📝 Doc</option>
              </select>
              <button onclick="this.closest('.res-row').remove()" style="background:none;border:none;color:var(--red);cursor:pointer;font-size:18px;flex-shrink:0">×</button>
            </div>`).join('')}
          </div>
          <div style="display:flex;gap:8px">
          <button onclick="addResourceRow()" style="flex:1;background:none;border:1.5px dashed var(--g200);border-radius:8px;padding:10px;cursor:pointer;font-size:13px;color:var(--g400)">+ Add Link / URL</button>
          <button onclick="document.getElementById('l-pdf-upload').click()" style="flex:1;background:none;border:1.5px dashed #f87171;border-radius:8px;padding:10px;cursor:pointer;font-size:13px;color:#dc2626">📄 Upload PDF from Computer</button>
        </div>
        <input type="file" id="l-pdf-resource-upload" accept="application/pdf" style="display:none" onchange="handlePdfResourceUpload(event)"/>
        </div>

        <!-- TAB 5: Quiz -->
        <div id="ltab-panel-5" style="display:none">
          <div style="background:var(--sky);border-radius:10px;padding:12px 14px;margin-bottom:14px;font-size:12px;color:var(--g600);line-height:1.6">
            🧠 Add multiple-choice questions shown at the end of the lesson. Students see instant feedback and must get all correct to mark the lesson complete.
          </div>
          <div id="quiz-list" style="display:flex;flex-direction:column;gap:16px;margin-bottom:12px">
            ${(existing?.quiz || []).map((q,i) => `
            <div class="quiz-card" style="background:#faf5ff;border:1.5px solid #e9d5ff;border-radius:12px;padding:16px;position:relative">
              <button onclick="this.closest('.quiz-card').remove()" style="position:absolute;top:10px;right:10px;background:none;border:none;color:var(--red);cursor:pointer;font-size:18px">×</button>
              <div style="font-size:12px;font-weight:800;color:#7c3aed;margin-bottom:10px">Question ${i+1}</div>
              <div class="form-group" style="margin-bottom:10px">
                <input class="input" placeholder="Type the question..." value="${q.question}" data-key="question"/>
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px">
                ${(q.options||['','','','']).map((o,j)=>`<input class="input" placeholder="Option ${String.fromCharCode(65+j)}" value="${o}" data-opt="${j}"/>`).join('')}
              </div>
              <div>
                <label class="form-label" style="font-size:11px">✅ Correct Answer (copy one option exactly)</label>
                <input class="input" placeholder="Must match one of the options above" value="${q.answer}" data-key="answer"/>
              </div>
            </div>`).join('')}
          </div>
          <button onclick="addQuizQuestion()" style="width:100%;background:none;border:1.5px dashed #c4b5fd;border-radius:8px;padding:10px;cursor:pointer;font-size:13px;color:#7c3aed">+ Add Quiz Question</button>
        </div>

      </div>

      <!-- Footer -->
      <div class="modal-footer" style="flex-shrink:0;border-top:1px solid var(--g100)">
        <button class="btn btn-ghost" onclick="document.querySelector('.modal-overlay').remove()">Cancel</button>
        <button class="btn btn-primary" id="lesson-save-btn" onclick="${isEdit ? `saveLessonEdit('${courseId}','${existing?.id}')` : `saveLessonNew('${courseId}')`}">
          ${isEdit ? '💾 Save Changes' : '➕ Add Lesson'}
        </button>
      </div>
    </div>
  </div>`

  // Load KaTeX for formula rendering in editor
  if (!window.katex) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css'
    document.head.appendChild(link)
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js'
    document.head.appendChild(script)
  }

  // Populate editor with existing content
  if (existing?.content) {
    setTimeout(() => {
      const ed = document.getElementById('l-content-editor')
      if (ed) ed.innerHTML = existing.content
    }, 50)
  }

  // Style toolbar buttons
  setTimeout(() => {
    document.querySelectorAll('.tb-btn').forEach(btn => {
      btn.style.cssText += ';background:#fff;border:1px solid var(--g100);border-radius:5px;padding:4px 8px;cursor:pointer;font-size:12px;color:var(--navy);transition:background .1s'
      btn.addEventListener('mouseover', () => btn.style.background = 'var(--sky)')
      btn.addEventListener('mouseout',  () => btn.style.background = '#fff')
    })
  }, 0)
}

// ── Editor tab switching ──────────────────────────────────────────────────────
function switchLessonTab(idx) {
  for (let i = 0; i < 6; i++) {
    const panel = document.getElementById(`ltab-panel-${i}`)
    const tab   = document.getElementById(`ltab-${i}`)
    if (!panel || !tab) continue
    const active = i === idx
    panel.style.display = active ? 'block' : 'none'
    tab.style.color = active ? 'var(--blue)' : 'var(--g400)'
    tab.style.borderBottom = active ? '2px solid var(--blue)' : '2px solid transparent'
  }
  // Sync hidden field when leaving content tab
  syncContentToHidden()
}

// ── Rich text formatting helpers ──────────────────────────────────────────────
function _ed() { return document.getElementById('l-content-editor') }

function lfmt(cmd) {
  _ed()?.focus()
  document.execCommand(cmd, false, null)
  syncContentToHidden()
}

function lfmtBlock(cmd, val) {
  _ed()?.focus()
  document.execCommand(cmd, false, val || null)
  syncContentToHidden()
}

function syncContentToHidden() {
  const ed = _ed()
  const hidden = document.getElementById('l-content')
  if (ed && hidden) hidden.value = ed.innerHTML
}

function handleEditorKeydown(e) {
  // Tab key → indent
  if (e.key === 'Tab') {
    e.preventDefault()
    document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;')
  }
}

// ── Math formula insertion ────────────────────────────────────────────────────
function insertMathFormula() {
  const row = document.getElementById('l-formula-row')
  if (row) {
    row.style.display = row.style.display === 'none' ? 'flex' : 'none'
    if (row.style.display === 'flex') {
      const inp = document.getElementById('l-formula-input')
      if (inp) { inp.value = ''; inp.focus() }
    }
  }
}

function insertFormulaFromBar() {
  const latex = (document.getElementById('l-formula-input')?.value || '').trim()
  if (!latex) { toast('Type a LaTeX formula first', 'err'); return }
  const ed = _ed()
  if (!ed) return
  ed.focus()
  let html
  try {
    html = `<span class="math-formula" style="display:inline-block;background:#f5f3ff;border:1px solid #e9d5ff;border-radius:6px;padding:3px 10px;margin:2px 4px;font-family:serif;color:#4c1d95">${window.katex ? window.katex.renderToString(latex, {throwOnError:false}) : `\\(${latex}\\)`}</span>`
  } catch(e) {
    html = `<span style="font-family:serif;color:#4c1d95;background:#f5f3ff;padding:2px 8px;border-radius:4px">${latex}</span>`
  }
  html = html.replace('<span class="math-formula"', `<span class="math-formula" data-latex="${latex.replace(/"/g,'&quot;')}"`)
  document.execCommand('insertHTML', false, html + '&nbsp;')
  syncContentToHidden()
  document.getElementById('l-formula-input').value = ''
  document.getElementById('l-formula-row').style.display = 'none'
}

function insertLessonLink(){
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
        <input class="input" id="l-link-text" value="${selectedText}" placeholder="e.g. Read more here"/>
      </div>
      <div class="form-group">
        <label class="form-label">URL *</label>
        <input class="input" id="l-link-url" placeholder="https://" type="url"/>
      </div>
      <div class="form-group">
        <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer">
          <input type="checkbox" id="l-link-newtab" checked/> Open in new tab
        </label>
      </div>
      <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:8px">
        <button onclick="this.closest('div[style*=fixed]').remove()" class="btn btn-ghost">Cancel</button>
        <button onclick="applyLessonLink()" class="btn btn-primary">Insert Link</button>
      </div>
    </div>`
  document.body.appendChild(modal)
  window._savedLessonLinkRange = savedRange
  setTimeout(() => document.getElementById('l-link-url')?.focus(), 50)
}

function applyLessonLink(){
  const url = document.getElementById('l-link-url')?.value?.trim()
  const text = document.getElementById('l-link-text')?.value?.trim()
  const newTab = document.getElementById('l-link-newtab')?.checked
  if(!url){ toast('Please enter a URL','err'); return }
  const editor = document.getElementById('l-content-editor')
  if(!editor) return
  editor.focus()
  if(window._savedLessonLinkRange){
    const sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(window._savedLessonLinkRange)
  }
  const a = document.createElement('a')
  a.href = url
  a.textContent = text || url
  if(newTab){ a.target = '_blank'; a.rel = 'noopener noreferrer' }
  a.style.color = '#1A5FFF'
  a.style.textDecoration = 'underline'
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
  syncContentToHidden()
  document.querySelector('div[style*="position:fixed"][style*="99999"]')?.remove()
  window._savedLessonLinkRange = null
}

function insertContentImage() {
  document.getElementById('l-img-upload')?.click()
}
function insertImageFromUrlBar() {
  const url = document.getElementById('l-img-url-input')?.value?.trim()
  if (!url) { toast('Paste an image URL first', 'err'); return }
  _insertImageHtml(url)
  document.getElementById('l-img-url-input').value = ''
  document.getElementById('l-img-url-row').style.display = 'none'
}

function handleContentPdfUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = e => {
    const ed = _ed()
    if (!ed) return
    ed.focus()
    const html = `<div style="margin:12px 0;border:1.5px solid #fca5a5;border-radius:10px;overflow:hidden">
      <div style="background:#fee2e2;padding:8px 14px;display:flex;align-items:center;gap:8px">
        <span style="font-size:18px">📄</span>
        <span style="font-size:13px;font-weight:700;color:#991b1b">${file.name}</span>
      </div>
      <iframe src="${e.target.result}" style="width:100%;height:500px;border:none;display:block" loading="lazy"></iframe>
    </div><p></p>`
    document.execCommand('insertHTML', false, html)
    syncContentToHidden()
  }
  reader.readAsDataURL(file)
  event.target.value = ''
}

function handleContentImageUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = e => _insertImageHtml(e.target.result, file.name)
  reader.readAsDataURL(file)
  event.target.value = '' // reset so same file can be re-selected
}

function _insertImageHtml(src, alt = 'Image') {
  const ed = _ed()
  if (!ed) return
  ed.focus()
  const html = `<figure style="margin:12px 0;text-align:center">
    <img src="${src}" alt="${alt}" style="max-width:100%;border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,0.08)" loading="lazy"/>
    <figcaption contenteditable="true" style="font-size:12px;color:var(--g400);margin-top:6px;font-style:italic">Caption (click to edit)</figcaption>
  </figure><p></p>`
  document.execCommand('insertHTML', false, html)
  syncContentToHidden()
}

// ── Resource rows ─────────────────────────────────────────────────────────────
function addResourceRow() {
  const list = document.getElementById('resources-list')
  const div = document.createElement('div')
  div.className = 'res-row'
  div.style.cssText = 'display:flex;gap:8px;align-items:center;background:#f8fafc;border:1px solid var(--g100);border-radius:8px;padding:10px'
  div.innerHTML = `
    <span style="font-size:20px">🔗</span>
    <input class="input" style="flex:1;min-width:0" placeholder="Label e.g. Past Paper 2023" data-key="label"/>
    <input class="input" style="flex:2;min-width:0" placeholder="URL https://..." data-key="url"/>
    <select class="input" style="width:90px;flex-shrink:0" data-key="type" onchange="this.previousElementSibling.previousElementSibling.previousElementSibling.textContent=this.value==='pdf'?'📄':this.value==='doc'?'📝':'🔗'">
      <option value="pdf">📄 PDF</option>
      <option value="link">🔗 Link</option>
      <option value="doc">📝 Doc</option>
    </select>
    <button onclick="this.closest('.res-row').remove()" style="background:none;border:none;color:var(--red);cursor:pointer;font-size:18px;flex-shrink:0">×</button>`
  list.appendChild(div)
}

// ── Quiz builder ──────────────────────────────────────────────────────────────
function addQuizQuestion() {
  const list = document.getElementById('quiz-list')
  const i = list.children.length
  const div = document.createElement('div')
  div.className = 'quiz-card'
  div.style.cssText = 'background:#faf5ff;border:1.5px solid #e9d5ff;border-radius:12px;padding:16px;position:relative'
  div.innerHTML = `
    <button onclick="this.closest('.quiz-card').remove()" style="position:absolute;top:10px;right:10px;background:none;border:none;color:var(--red);cursor:pointer;font-size:18px">×</button>
    <div style="font-size:12px;font-weight:800;color:#7c3aed;margin-bottom:10px">Question ${i+1}</div>
    <div class="form-group" style="margin-bottom:10px">
      <input class="input" placeholder="Type the question..." data-key="question"/>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px">
      <input class="input" placeholder="Option A" data-opt="0"/>
      <input class="input" placeholder="Option B" data-opt="1"/>
      <input class="input" placeholder="Option C" data-opt="2"/>
      <input class="input" placeholder="Option D" data-opt="3"/>
    </div>
    <div>
      <label class="form-label" style="font-size:11px">✅ Correct Answer (copy one option exactly)</label>
      <input class="input" placeholder="Must match one of the options above" data-key="answer"/>
    </div>`
  list.appendChild(div)
}

// ── Collect form data ─────────────────────────────────────────────────────────
function _getLessonFormData() {
  syncContentToHidden()
  return {
    title:          document.getElementById('l-title')?.value?.trim(),
    module_title:   document.getElementById('l-module')?.value?.trim() || null,
    video_url:      document.getElementById('l-video')?.value?.trim() || null,
    duration_mins:  parseInt(document.getElementById('l-duration')?.value) || 0,
    order_num:      parseInt(document.getElementById('l-order')?.value) || 1,
    is_free_preview:document.getElementById('l-preview')?.checked || false,
    content:        document.getElementById('l-content')?.value || null,
    notes:          document.getElementById('l-notes')?.value?.trim() || null,
    resources: Array.from(document.querySelectorAll('.res-row')).map(row => ({
      label: row.querySelector('[data-key="label"]')?.value?.trim() || '',
      url:   row.querySelector('[data-key="url"]')?.value?.trim()   || '',
      type:  row.querySelector('[data-key="type"]')?.value          || 'link'
    })).filter(r => r.label && r.url),
    quiz: Array.from(document.querySelectorAll('.quiz-card')).map(card => ({
      question: card.querySelector('[data-key="question"]')?.value?.trim() || '',
      answer:   card.querySelector('[data-key="answer"]')?.value?.trim()   || '',
      options:  Array.from(card.querySelectorAll('[data-opt]')).map(i => i.value?.trim()).filter(Boolean)
    })).filter(q => q.question && q.answer && q.options.length >= 2)
  }
}

function handlePdfResourceUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = e => {
    const list = document.getElementById('resources-list')
    const div = document.createElement('div')
    div.className = 'res-row'
    div.style.cssText = 'display:flex;gap:8px;align-items:center;background:#fff5f5;border:1px solid #fca5a5;border-radius:8px;padding:10px'
    div.innerHTML = `
      <span style="font-size:20px">📄</span>
      <input class="input" style="flex:1;min-width:0" value="${file.name}" data-key="label"/>
      <input class="input" style="flex:2;min-width:0;font-size:11px;color:var(--g400)" value="${e.target.result}" data-key="url" readonly title="Base64 PDF data"/>
      <select class="input" style="width:90px;flex-shrink:0" data-key="type">
        <option value="pdf" selected>📄 PDF</option>
      </select>
      <button onclick="this.closest('.res-row').remove()" style="background:none;border:none;color:var(--red);cursor:pointer;font-size:18px;flex-shrink:0">×</button>`
    list.appendChild(div)
    toast('PDF added to resources ✅')
  }
  reader.readAsDataURL(file)
  event.target.value = ''
}

function previewVideo() {
  const url = document.getElementById('l-video')?.value?.trim()
  if (!url) { toast('Enter a video URL first', 'err'); return }
  const preview = document.getElementById('l-video-preview')
  const frame   = document.getElementById('l-video-frame')
  if (preview && frame) {
    frame.src = url
    preview.style.display = 'block'
  }
}

async function saveLessonNew(courseId) {
  const data = _getLessonFormData()
  if (!data.title) { toast('Lesson title is required', 'err'); return }
  const btn = document.getElementById('lesson-save-btn')
  if (btn) { btn.disabled = true; btn.textContent = 'Saving...' }
  try {
    await api('/courses/admin/' + courseId + '/lessons', { method: 'POST', body: JSON.stringify(data) })
    document.querySelector('.modal-overlay')?.remove()
    toast('Lesson added ✅')
    manageLessons(courseId, '')
  } catch(e) {
    toast(e.message, 'err')
    if (btn) { btn.disabled = false; btn.textContent = '➕ Add Lesson' }
  }
}

async function saveLessonEdit(courseId, lessonId) {
  const data = _getLessonFormData()
  if (!data.title) { toast('Lesson title is required', 'err'); return }
  const btn = document.getElementById('lesson-save-btn')
  if (btn) { btn.disabled = true; btn.textContent = 'Saving...' }
  try {
    await api('/courses/admin/' + courseId + '/lessons/' + lessonId, { method: 'PATCH', body: JSON.stringify(data) })
    document.querySelector('.modal-overlay')?.remove()
    toast('Lesson updated ✅')
    manageLessons(courseId, '')
  } catch(e) {
    toast(e.message, 'err')
    if (btn) { btn.disabled = false; btn.textContent = '💾 Save Changes' }
  }
}


async function deleteLessonAdmin(courseId, lessonId, lessonTitle, courseTitle) {
  if (!confirm(`Delete lesson "${lessonTitle}"?`)) return
  try {
    await api('/courses/admin/' + courseId + '/lessons/' + lessonId, { method: 'DELETE' })
    toast('Lesson deleted')
    manageLessons(courseId, courseTitle)
  } catch(e) { toast(e.message, 'err') }
}