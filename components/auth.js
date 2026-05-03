
   // ════════════════════════════════════════════════════════════
    // LOGIN
    // ════════════════════════════════════════════════════════════
    function togglePwVisibility(inputId, btnId){
  const input = document.getElementById(inputId)
  const btn = document.getElementById(btnId)
  if(!input) return
  if(input.type === 'password'){
    input.type = 'text'
    if(btn) btn.innerHTML = '<i data-lucide="eye-off" style="width:18px;height:18px;color:var(--g400)"></i>'
  } else {
    input.type = 'password'
    if(btn) btn.innerHTML = '<i data-lucide="eye" style="width:18px;height:18px;color:var(--g400)"></i>'
  }
  if(window.lucide) window.lucide.createIcons();
}
    function renderLogin() {
      render(`
  <div class="auth-wrap">
    <div class="auth-card">
      <button class="auth-close-btn" onclick="closeAuth()" title="Close">✕</button>
      <div style="margin-bottom:16px;text-align:center;color:var(--blue)"><i data-lucide="graduation-cap" style="width:48px;height:48px;margin:0 auto"></i></div>
      <h1 class="auth-title" style="text-align:center">Welcome back</h1>
      <p class="auth-sub" style="text-align:center">Sign in to your Mathrone account</p>
      <div id="login-err" class="form-error" style="margin-bottom:14px;display:none"></div>
      <div class="form-group">
        <label class="form-label">Email Address</label>
        <input class="input" id="l-email" type="email" placeholder="you@example.com" onkeydown="if(event.key==='Enter')doLogin()"/>
      </div>
      <div class="form-group" style="position:relative">
  <label class="form-label">Password</label>
  <input class="input" id="l-pw" type="password" placeholder="Password" style="padding-right:44px" onkeydown="if(event.key==='Enter')doLogin()"/>
  <button type="button" onclick="togglePwVisibility('l-pw','login-pw-btn')" id="login-pw-btn" style="position:absolute;right:12px;bottom:10px;background:none;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center"><i data-lucide="eye" style="width:18px;height:18px;color:var(--g400)"></i></button>
</div>
      <div style="text-align:right;margin-top:-8px;margin-bottom:16px">
        <a onclick="renderForgotPassword()" style="font-size:13px;color:var(--blue);cursor:pointer">Forgot password?</a>
      </div>
      <button class="btn btn-primary btn-full btn-lg" id="login-btn" onclick="doLogin()">Sign In</button>
      <div class="auth-switch">Don't have an account? <a onclick="navigate('register')">Register →</a></div>
      <div class="auth-switch" style="margin-top:8px"><a onclick="navigate('landing')">← Back to home</a></div>
    </div>
  </div>`)
    }

    function renderForgotPassword() {
      render(`
  <div class="auth-wrap">
    <div class="auth-card">
      <button class="auth-close-btn" onclick="closeAuth()" title="Close">✕</button>
      <div style="margin-bottom:16px;text-align:center;color:var(--blue)"><i data-lucide="key" style="width:48px;height:48px;margin:0 auto"></i></div>
      <h1 class="auth-title" style="text-align:center">Reset Password</h1>
      <p class="auth-sub" style="text-align:center">Enter your email and we'll send you a reset link</p>
      <div id="fp-msg" style="display:none;padding:12px;border-radius:8px;margin-bottom:16px;text-align:center"></div>
      <div class="form-group">
        <label class="form-label">Email Address</label>
        <input class="input" id="fp-email" type="email" placeholder="you@example.com" onkeydown="if(event.key==='Enter')doForgotPassword()"/>
      </div>
      <button class="btn btn-primary btn-full btn-lg" id="fp-btn" onclick="doForgotPassword()">Send Reset Link</button>
      <div class="auth-switch" style="margin-top:12px"><a onclick="navigate('login')">← Back to login</a></div>
    </div>
  </div>`)
    }

    async function doForgotPassword() {
      const email = document.getElementById('fp-email')?.value?.trim()
      const btn = document.getElementById('fp-btn')
      const msg = document.getElementById('fp-msg')
      if (!email) {
        msg.style.display = 'block'
        msg.style.background = '#fee2e2'
        msg.style.color = '#dc2626'
        msg.textContent = 'Please enter your email address'
        return
      }
      btn.disabled = true
      btn.textContent = 'Sending...'
      try {
        await api('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) })
        msg.style.display = 'block'
        msg.style.background = '#dcfce7'
        msg.style.color = '#16a34a'
        msg.textContent = '✅ Reset link sent! Check your email inbox.'
        btn.textContent = 'Sent!'
      } catch (e) {
        msg.style.display = 'block'
        msg.style.background = '#fee2e2'
        msg.style.color = '#dc2626'
        msg.textContent = 'Failed to send reset email. Try again.'
        btn.disabled = false
        btn.textContent = 'Send Reset Link'
      }
    }

    async function doLogin() {
      const email = document.getElementById('l-email')?.value?.trim()
      const pw = document.getElementById('l-pw')?.value
      const btn = document.getElementById('login-btn')
      const err = document.getElementById('login-err')
      if (!email || !pw) { showErr(err, 'Please enter email and password'); return }
      btn.disabled = true; btn.textContent = 'Signing in...'
      try {
        const data = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password: pw }) })
        setAuth(data)
        navigate('dashboard')
        setTimeout(() => {
          toast(`Welcome back, ${data.user.full_name}! 👋`)
        }, 100)
     } catch (e) {
        const msg = e.message || 'Login failed. Please check your credentials.'
        if (err) {
          err.style.display = 'block'
          if (msg.toLowerCase().includes('verify')) {
            err.innerHTML = `${msg}<br><br><a onclick="doResendVerification('${email}')" style="color:var(--blue);cursor:pointer;font-weight:600">Resend verification email →</a>`
          } else {
            err.textContent = msg
          }
        }
        btn.disabled = false; btn.textContent = 'Sign In'
      }
    }

    function showErr(el, msg) { if (el) { el.textContent = msg; el.style.display = 'block' } }

    async function doResendVerification(email) {
      try {
        await api('/auth/resend-verification', { method: 'POST', body: JSON.stringify({ email }) })
        toast('Verification email resent! Check your inbox.', 'ok')
      } catch (e) {
        toast('Could not resend email. Please try again later.', 'err')
      }
    }

    // ════════════════════════════════════════════════════════════
    // REGISTER
    // ════════════════════════════════════════════════════════════
function toggleStudentLocation(){
  const mode = document.getElementById('r-mode')?.value
  const wrap = document.getElementById('location-wrap')
  if(!wrap) return
  wrap.style.display = mode === 'online' ? 'none' : 'block'
}
    function renderRegister() {
      const defaultRole = State.tab === 'tutor' ? 'tutor' : 'student'
      render(`
  <div class="auth-wrap" style="padding:30px 20px">
    <div class="auth-card" style="max-width:520px">
      <button class="auth-close-btn" onclick="closeAuth()" title="Close">✕</button>
      <h1 class="auth-title">Create Account</h1>
      <p class="auth-sub">Join Mathrone Academy</p>
      <div class="role-tabs">
        <button class="role-tab ${defaultRole === 'student' ? 'active' : ''}" id="rtab-student" onclick="switchRegRole('student')" style="display:flex;align-items:center;justify-content:center;gap:8px"><i data-lucide="graduation-cap" style="width:16px;height:16px"></i> I'm a Student</button>
        <button class="role-tab ${defaultRole === 'tutor' ? 'active' : ''}" id="rtab-tutor" onclick="switchRegRole('tutor')" style="display:flex;align-items:center;justify-content:center;gap:8px"><i data-lucide="briefcase" style="width:16px;height:16px"></i> I'm a Tutor</button>
        <div id="reg-not-recruiting" class="alert-warn" style="display:none;margin:10px 0 0">
        <i data-lucide="alert-circle" style="width:16px;height:16px;margin-right:6px"></i> We are not currently recruiting new tutors. Please check back later or <a onclick="scrollToContact()" style="color:var(--blue);cursor:pointer">Contact Us</a>.
       </div>
      </div>
      <div id="reg-form"></div>
      <div class="auth-switch">Already have an account? <a onclick="navigate('login')">Sign in →</a></div>
      <div class="auth-switch" style="margin-top:8px"><a onclick="navigate('landing')">← Back to home</a></div>
    </div>
  </div>`)
      window._regRole = defaultRole
      renderRegForm(defaultRole)

      // Check if recruiting
      setTimeout(async ()=>{
        try{
          const res = await fetch(API_URL + '/auth/settings/recruiting')
          const data = await res.json()
          const tutorTab = document.getElementById('rtab-tutor')
          const notRecruiting = document.getElementById('reg-not-recruiting')
          if(!data.is_recruiting){
            if(tutorTab) tutorTab.style.display = 'none'
            if(window._regRole === 'tutor'){
              switchRegRole('student')
              if(notRecruiting) notRecruiting.style.display = 'block'
            }
          } else {
            if(tutorTab) tutorTab.style.display = ''
            if(notRecruiting) notRecruiting.style.display = 'none'
          }
        }catch(e){}
      }, 200)
    }

    function switchRegRole(role) {
      window._regRole = role
      document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'))
      document.getElementById(`rtab-${role}`)?.classList.add('active')
      renderRegForm(role)
    }
    

function selectCategory(id){
  CATEGORIES.forEach(c=>{
    const el = document.getElementById('cat-'+c.id)
    if(el) el.style.border = '2px solid var(--g100)'
  })
  const sel = document.getElementById('cat-'+id)
  if(sel) sel.style.border = '2px solid var(--blue)'
  document.getElementById('r-category').value = id

  // Update subjects field
  const info = CATEGORY_SUBJECTS[id] || CATEGORY_SUBJECTS.academic
  const label = document.getElementById('subjects-label')
  const input = document.getElementById('r-subjects')
  const hint  = document.getElementById('subjects-hint')
  if(label) label.textContent = info.label
  if(input) input.placeholder = info.placeholder
  if(hint)  hint.textContent  = info.hint

  // Update levels checkboxes
  const lvlLabel = document.getElementById('levels-label')
  const lvlBox   = document.getElementById('levels-checkboxes')
  if(lvlLabel) lvlLabel.textContent = CATEGORY_LEVELS[id]?.label || 'Levels *'

  if(lvlBox){
    const opts = {
      academic: ['Primary','Secondary','University'],
      digital:  ['Beginner','Intermediate','Advanced','All Levels'],
      creative: ['Beginner','Intermediate','Advanced','All Levels'],
      tech:     ['Beginner','Intermediate','Advanced','All Levels'],
      language: ['Beginner','Intermediate','Advanced','Fluent','All Levels'],
      business: ['Beginner','Intermediate','Advanced','All Levels'],
      music:    ['Beginner','Intermediate','Advanced','All Levels'],
      cv:       ['Fresh Graduate','Mid-level','Senior','Executive','All Levels'],
      global:   ['Beginner','Intermediate','Advanced','Expert','All Levels'],
    }
    const choices = opts[id] || opts.academic
    lvlBox.innerHTML = choices.map(o=>`
      <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer">
        <input type="checkbox" value="${o}" class="lvl-check"/> ${o}
      </label>`).join('')
  }
}
const STUDENT_CATEGORY_LEVELS = {
  academic:  ['Primary', 'Secondary', 'University'],
  digital:   ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
  creative:  ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
  tech:      ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
  language:  ['Beginner', 'Intermediate', 'Advanced', 'Fluent', 'All Levels'],
  business:  ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
  music:     ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
  cv:        ['Fresh Graduate', 'Mid-level', 'Senior', 'Executive', 'All Levels'],
  global:    ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'All Levels'],
}



function selectStudentCategory(id){
  CATEGORIES.forEach(c=>{
    const el = document.getElementById('scat-'+c.id)
    if(el) el.style.border = '2px solid var(--g100)'
  })
  const sel = document.getElementById('scat-'+id)
  if(sel) sel.style.border = '2px solid var(--blue)'
  document.getElementById('r-student-category').value = id

  // Show level selector for all student categories, with dynamic options
  const levelWrap = document.getElementById('school-level-wrap')
  const levelSelect = document.getElementById('r-level')
  const levelLabel = levelWrap?.querySelector('.form-label')

  if(levelWrap) levelWrap.style.display = 'block'

  if(levelLabel) {
    if (id === 'academic') {
      levelLabel.textContent = 'School Level *'
    } else {
      levelLabel.textContent = CATEGORY_LEVELS[id]?.label || 'Level *'
    }
  }

  if(levelSelect) {
    const levels = STUDENT_CATEGORY_LEVELS[id] || STUDENT_CATEGORY_LEVELS.academic
    levelSelect.innerHTML = '<option value="">Select level</option>' + levels.map(l=>`<option value="${l}">${l}</option>`).join('')
  }

  // Update subjects placeholder
  const info = CATEGORY_SUBJECTS[id] || CATEGORY_SUBJECTS.academic
  const subInput = document.getElementById('r-subjects')
  if(subInput){
    subInput.placeholder = info.placeholder
    subInput.previousElementSibling.textContent = id === 'academic' ? 'Subjects Needed' : 'Skills You Want to Learn'
  }

  // keep location visibility in sync with session mode
  toggleStudentLocation()
}
    function renderRegForm(role) {
      const el = document.getElementById('reg-form')
      if (!el) return
      if (role === 'student') {
        el.innerHTML = `
      <div id="reg-err" class="form-error" style="margin-bottom:12px;display:none"></div>
      <div class="grid-2">
        <div class="form-group"><label class="form-label">Full Name *</label><input class="input" id="r-name" placeholder="John Smith"/></div>
        <div class="form-group"><label class="form-label">Email *</label><input class="input" id="r-email" type="email" placeholder="you@example.com"/></div>
      </div>
      <div class="grid-2">
        <div class="form-group"><label class="form-label">Password *</label><input class="input" id="r-pw" type="password" placeholder="Min 6 chars"/></div>
        <div class="form-group"><label class="form-label">Phone</label><input class="input" id="r-phone" placeholder="+250 789 123 456"/></div>
      </div>
      
      <div class="form-group">
        <label class="form-label">What do you want to learn? *</label>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:6px" id="student-cat-grid">
        </div>
        <input type="hidden" id="r-student-category" value="academic"/>
      </div>
      <div class="form-group" id="school-level-wrap">
        <label class="form-label">School Level *</label>
        <select class="input" id="r-level">
          <option value="">Select level</option>
          <option>Primary</option>
          <option>Secondary</option>
          <option>University</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Session Mode (Online,Home Visit or Both)</label>
        <select class="input" id="r-mode" onchange="toggleStudentLocation()">
          <option value="online">Online</option>
          <option value="home">Home Visit</option>
          <option value="blended">Blended (Both)</option>
        </select>
      </div>

      <div class="form-group" id="location-wrap">
        <label class="form-label">Home Location</label>
        <select class="input" id="r-location-s">
  <option value="">— Select your district —</option>
  ${RWANDA_DISTRICTS.map(d=>`<option value="${d}">${d}</option>`).join('')}
</select>
        <div style="font-size:11px;color:var(--g400);margin-top:4px">Required for home visits so tutor knows where to come</div>
      </div>
      <div class="form-group"><label class="form-label">Subjects Needed (comma separated)</label><input class="input" id="r-subjects" placeholder="Math, Physics, Chemistry"/></div>
      <div class="grid-2">
  <div class="form-group"><label class="form-label">Parent Name</label><input class="input" id="r-parent" placeholder="Parent / Guardian name"/></div>
  <div class="form-group"><label class="form-label">Parent Phone</label><input class="input" id="r-parent-phone" placeholder="+250 789 123 456"/></div>
</div>
      <button class="btn btn-primary btn-full" style="margin-top:8px" id="reg-btn" onclick="doRegister()">Create Student Account →</button>`
      
    // Build student category grid
      const sCatGrid = document.getElementById('student-cat-grid')
      console.log('Building cat grid, sCatGrid:', sCatGrid, 'CATEGORIES:', CATEGORIES)
      if(sCatGrid){
        sCatGrid.innerHTML = CATEGORIES.map(c=>`
          <div onclick="selectStudentCategory(this.dataset.id)" data-id="${c.id}" id="scat-${c.id}" style="border:2px solid ${c.id==='academic'?'var(--blue)':'var(--g100)'};border-radius:10px;padding:10px;cursor:pointer;transition:all 0.2s">
            <div style="margin-bottom:6px;color:var(--blue)">${c.icon}</div>
            <div style="font-size:12px;font-weight:700;color:var(--navy)">${c.label}</div>
            <div style="font-size:11px;color:var(--g400)">${c.desc}</div>
          </div>`).join('')
          const districtOptions = RWANDA_DISTRICTS.map(d=>`<option value="${d}">${d}</option>`).join('')
      }
      // Sync location visibility for initial mode (default online)
      toggleStudentLocation()
    } else {
        el.innerHTML = `
      <div id="reg-err" class="form-error" style="margin-bottom:12px;display:none"></div>
      <div class="grid-2">
        <div class="form-group"><label class="form-label">Full Name *</label><input class="input" id="r-name" placeholder="Jane Doe"/></div>
        <div class="form-group"><label class="form-label">Email *</label><input class="input" id="r-email" type="email" placeholder="you@example.com"/></div>
      </div>
      <div class="grid-2">
        <div class="form-group"><label class="form-label">Password *</label><input class="input" id="r-pw" type="password" placeholder="Min 6 chars"/></div>
        <div class="form-group"><label class="form-label">Phone Number *</label><input class="input" id="r-phone" placeholder="+250 789 123 456"/></div>
      </div>
      <div class="grid-2">
        <div class="form-group"><label class="form-label">Qualification *</label><input class="input" id="r-qual" placeholder="BSc Mathematics, MSc Physics..."/></div>
        <div class="form-group"><label class="form-label">Location</label><select class="input" id="r-location">
  <option value="">— Select your district —</option>
  ${RWANDA_DISTRICTS.map(d=>`<option value="${d}">${d}</option>`).join('')}
</select></div>
      </div>
      <div class="form-group">
  <label class="form-label">Teaching Category</label>
  <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:6px" id="cat-grid">
    ${CATEGORIES.map(c=>`
    <div onclick="selectCategory('${c.id}')" id="cat-${c.id}" style="border:2px solid var(--g100);border-radius:10px;padding:12px;cursor:pointer;transition:all 0.2s">
      <div style="margin-bottom:6px;color:var(--blue)">${c.icon}</div>
      <div style="font-size:13px;font-weight:700;color:var(--navy)">${c.label}</div>
      <div style="font-size:11px;color:var(--g400);margin-top:2px">${c.desc}</div>
    </div>`).join('')}
  </div>
  <input type="hidden" id="r-category" value="academic"/>
</div>
      <div class="form-group">
  <label class="form-label" id="subjects-label">Subjects / Skills You Teach *</label>
  <input class="input" id="r-subjects" placeholder="e.g. Math, Physics, Chemistry"/>
  <div style="font-size:11px;color:var(--g400);margin-top:4px" id="subjects-hint">Separate multiple subjects with commas</div>
</div>
      <div class="grid-2">
        <div class="form-group">
          <label class="form-label" id="levels-label">Levels *</label>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:6px" id="levels-checkboxes">
            <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer"><input type="checkbox" value="Primary" class="lvl-check"/> Primary</label>
            <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer"><input type="checkbox" value="Secondary" class="lvl-check"/> Secondary</label>
            <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer"><input type="checkbox" value="University" class="lvl-check"/> University</label>
          </div>
        <div style="font-size:11px;color:var(--g400);margin-top:4px" id="levels-hint">Select all that apply</div>
        </div>
        <div class="form-group"><label class="form-label">Years Experience *</label><input class="input" id="r-exp" type="number" min="0" placeholder="3"/></div>
      </div>
      
      <div class="form-group"><label class="form-label">Teaching Mode</label>
        <select class="input" id="r-mode"><option value="online,home">Both Online & Home</option><option value="online">Online Only</option><option value="home">Home Only</option></select></div>
      <div class="form-group"><label class="form-label">Bio / About You</label><textarea class="input" id="r-bio" placeholder="Tell students about your teaching style..."></textarea></div>
      <div class="form-group">
        <label class="form-label">CV / Resume * <span style="font-size:11px;color:var(--g400)">(PDF, DOC — required)</span></label>
        <input type="file" class="input" id="r-cv" accept=".pdf,.doc,.docx" style="padding:8px"/>
      </div>
      <div class="form-group">
        <label class="form-label">Certificates <span style="font-size:11px;color:var(--g400)">(PDF, JPG, PNG — optional)</span></label>
        <input type="file" class="input" id="r-cert" accept=".pdf,.jpg,.png,.jpeg" multiple style="padding:8px"/>
      </div>
      <button class="btn btn-primary btn-full" style="margin-top:8px" id="reg-btn" onclick="doRegister()">Submit Application →</button>`
      }
    }

    async function doRegister() {
      const role = window._regRole
      const btn = document.getElementById('reg-btn')
      const err = document.getElementById('reg-err')
      const name = document.getElementById('r-name')?.value?.trim()
      const email = document.getElementById('r-email')?.value?.trim()
      const pw = document.getElementById('r-pw')?.value
      const phone = document.getElementById('r-phone')?.value?.trim()
      
      if (!name || !email || !pw) { showErr(err, 'Name, email and password are required'); return }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) { showErr(err, 'Please enter a valid email address (e.g. name@example.com)'); return }
      if (pw.length < 6) { showErr(err, 'Password must be at least 6 characters'); return }

      if (role === 'tutor') {
        if (!phone) { showErr(err, 'Phone number is required for tutors'); return }
        const cvFile = document.getElementById('r-cv')?.files[0]
        if (!cvFile) { showErr(err, 'Please upload your CV document'); return }
      }

      btn.disabled = true; btn.textContent = 'Creating account...'
      try {
        let body, path
        if (role === 'student') {
          const level = document.getElementById('r-level')?.value
          if (!level) { showErr(err, 'Please select a school level'); btn.disabled = false; btn.textContent = 'Create Student Account →'; return }
          const locationS = document.getElementById('r-location-s')?.value
const sessionMode = document.getElementById('r-mode')?.value
if (!locationS && sessionMode !== 'online') { showErr(err, 'Please select your district'); btn.disabled = false; btn.textContent = 'Create Student Account →'; return }
          body = {
            full_name: name, email, password: pw,
            phone: document.getElementById('r-phone')?.value || null,
            school_level: level,
            subjects_needed: document.getElementById('r-subjects')?.value?.split(',').map(s => s.trim()).filter(Boolean) || [],
            preferred_mode: document.getElementById('r-mode')?.value || 'online',
            home_location: document.getElementById('r-location-s')?.value || null,
            parent_name: document.getElementById('r-parent')?.value||null,
            parent_phone: document.getElementById('r-parent-phone')?.value||null ,
            category: document.getElementById('r-student-category')?.value || 'academic',}
            path = '/auth/register/student'
            
       } else {
          const qual = document.getElementById('r-qual')?.value?.trim()
          const subs = document.getElementById('r-subjects')?.value?.split(',').map(s => s.trim()).filter(Boolean) || []
          const category = document.getElementById('r-category')?.value || 'academic'
          
          // Read directly from DOM to prevent hidden-input sync bugs
          const lvls = [...document.querySelectorAll('.lvl-check:checked')].map(c => c.value)
          
          const exp = parseInt(document.getElementById('r-exp')?.value) || 0
          const locationT = document.getElementById('r-location')?.value
          
          if (!qual) { showErr(err, 'Please enter your qualification (e.g. BSc Mathematics)'); btn.disabled = false; btn.textContent = 'Submit Application →'; return }
          
          if (!subs.length) { 
            const msg = category === 'academic' 
              ? 'Please type at least one subject you teach in the text box (e.g. Math, Physics)' 
              : 'Please type at least one specific skill in the text box (e.g. Web Design, MS Office)';
            showErr(err, msg); 
            btn.disabled = false; 
            btn.textContent = 'Submit Application →'; 
            return 
          }
          
          if (!lvls.length) { showErr(err, 'Please select at least one level by ticking the checkboxes'); btn.disabled = false; btn.textContent = 'Submit Application →'; return }
          if (!locationT) { showErr(err, 'Please select your district'); btn.disabled = false; btn.textContent = 'Submit Application →'; return }
          
          body = {
            full_name: name, email, password: pw,
            phone: phone || null,
            qualification: qual, subjects: subs, levels: lvls,
            teaching_modes: document.getElementById('r-mode')?.value?.split(',') || ['online'],
            experience_years: exp,
            location: locationT,
            bio: document.getElementById('r-bio')?.value || null,
            category: category
          }
          path = '/auth/register/tutor'
        }

        const data = await api(path, { method: 'POST', body: JSON.stringify(body) })
        // Do NOT call setAuth here — user must verify email before being logged in
        // Use the temporary token from registration only for CV upload, then discard it
        const tempToken = data.access_token

        // Upload CV after successful tutor registration
        if (role === 'tutor' && tempToken) {
          btn.textContent = 'Uploading CV...'
          const cvFile = document.getElementById('r-cv')?.files[0]
          const certFiles = document.getElementById('r-cert')?.files
          const formData = new FormData()
          formData.append('cv', cvFile)
          if (certFiles?.length) {
            for (const f of certFiles) formData.append('certificates', f)
          }
          try {
            await fetch(API_URL + '/tutors/upload-docs', {
              method: 'POST',
              headers: { Authorization: `Bearer ${tempToken}` },
              body: formData
            })
          } catch (e) {
            toast('Account created but CV upload failed. Please upload from your dashboard after logging in.', 'err')
          }
        }

        // Clear auth — don't log them in yet, they must verify email first
        localStorage.removeItem('tc_access')
        localStorage.removeItem('tc_refresh')
        localStorage.removeItem('tc_user')
        State.user = null

        if (role === 'tutor') {
          render(`
            <div class="auth-wrap">
              <div class="auth-card" style="text-align:center">
                <div style="font-size:48px;margin-bottom:16px">📧</div>
                <h1 class="auth-title">Application Submitted!</h1>
                <p class="auth-sub" style="margin-bottom:16px">We sent a verification link to <strong>${email}</strong>.<br>Please check your inbox and verify your email before logging in.</p>
                <p style="font-size:13px;color:var(--g400);margin-bottom:24px">After verification, our team will review your application within 2–3 business days.</p>
                <button class="btn btn-primary btn-full" onclick="navigate('login')">Go to Login →</button>
                <div class="auth-switch" style="margin-top:12px"><a onclick="navigate('landing')">← Back to home</a></div>
              </div>
            </div>`)
        } else {
          render(`
            <div class="auth-wrap">
              <div class="auth-card" style="text-align:center">
                <div style="font-size:48px;margin-bottom:16px">📧</div>
                <h1 class="auth-title">Almost there!</h1>
                <p class="auth-sub" style="margin-bottom:16px">We sent a verification link to <strong>${email}</strong>.<br>Please check your inbox and click the link to activate your account.</p>
                <p style="font-size:13px;color:var(--g400);margin-bottom:24px">Didn't receive it? Check your spam folder.</p>
                <button class="btn btn-primary btn-full" onclick="navigate('login')">Go to Login →</button>
                <div class="auth-switch" style="margin-top:12px"><a onclick="navigate('landing')">← Back to home</a></div>
              </div>
            </div>`)
        }
      } catch (e) {
        showErr(err, e.message)
        btn.disabled = false
        btn.textContent = role === 'student' ? 'Create Student Account →' : 'Submit Application →'
      }
    }