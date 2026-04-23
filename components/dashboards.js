var FORUM_CATEGORIES = [
  { id: 'general',   icon: '<i data-lucide="message-square" style="width:16px;height:16px"></i>', label: 'General Discussion' },
  { id: 'study',     icon: '<i data-lucide="book-open" style="width:16px;height:16px"></i>', label: 'Study Tips' },
  { id: 'reviews',   icon: '<i data-lucide="star" style="width:16px;height:16px"></i>', label: 'Tutor Reviews' },
  { id: 'career',    icon: '<i data-lucide="briefcase" style="width:16px;height:16px"></i>', label: 'Career Advice' },
  { id: 'feedback',  icon: '<i data-lucide="megaphone" style="width:16px;height:16px"></i>', label: 'Platform Feedback' },
]
 // ════════════════════════════════════════════════════════════
    // STUDENT DASHBOARD
    // ════════════════════════════════════════════════════════════
    async function renderStudentDash() {
  render(dashWrap('dashboard', `<div class="loader-center"><div class="spinner"></div></div>`))
  try {
    const [me, sessions, assignments, notifs, progress, pubCourses] = await Promise.allSettled([
      api('/auth/me'),
      api('/sessions/my'),
      api('/students/assignments'),
      api('/notifications/'),
      api('/progress/student/' + State.user.id),
      api('/courses/public')
    ])
    
    const u        = me.value || State.user
    const student  = u.student || {}
    const sess     = sessions.value || []
    const assigns  = assignments.value || []
    const progs    = progress.value || []
    
    // Extract courses and filter by student's school level
    const allC = pubCourses.status === 'fulfilled' ? (Array.isArray(pubCourses.value) ? pubCourses.value : pubCourses.value.courses || pubCourses.value.data || []) : []
    let recommended = allC.filter(c => c.level && student.school_level && c.level.includes(student.school_level))
    if (recommended.length === 0) recommended = allC.slice(0, 3) // Fallback to latest if no exact match
    else recommended = recommended.slice(0, 3)

    const upcoming = sess.filter(s => ['scheduled','pending'].includes(s.status)).slice(0,3)
    const completed= sess.filter(s => s.status === 'completed').length
    const unread   = (notifs.value || []).filter(n => !n.is_read).length
    const avgMarks = progs.filter(p=>p.marks).length
      ? Math.round(progs.filter(p=>p.marks).reduce((a,b)=>a+b.marks,0) / progs.filter(p=>p.marks).length)
      : null
    const cat = CATEGORIES.find(c=>c.id===(student.category||'academic')) || CATEGORIES[0]

    render(dashWrap('dashboard', `
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Good day, ${u.full_name?.split(' ')[0]}! 👋</h1>
        <p class="page-subtitle">Here's your learning overview</p>
      </div>
      <button class="btn btn-primary" onclick="navigate('tutors')">🔍 Find a Tutor</button>
    </div>

    <!-- Student Profile Card -->
    <div class="card" style="padding:20px;margin-bottom:24px;display:flex;align-items:center;gap:16px;justify-content:space-between;flex-wrap:wrap">
      <div style="display:flex;align-items:center;gap:16px">
        <div style="position:relative;cursor:pointer" onclick="navigate('profile')">
          ${avi(u.full_name||'S', 56, u.avatar_url||null)}
          <div style="position:absolute;bottom:0;right:0;background:var(--blue);border-radius:50%;width:18px;height:18px;display:flex;align-items:center;justify-content:center;font-size:10px">📷</div>
        </div>
        <div>
          <div style="font-size:18px;font-weight:700;color:var(--navy)">${u.full_name}</div>
          <div style="font-size:13px;color:var(--g400);margin-top:2px">${student.school_level||''} ${student.school_level && cat.label ? '•' : ''} ${cat.icon} ${cat.label}</div>
          <div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap">
            ${(student.subjects_needed||[]).map(s=>`<span class="badge badge-blue">${s}</span>`).join('')}
          </div>
        </div>
      </div>
      <button class="btn btn-ghost btn-sm" onclick="navigate('profile')">Edit Profile</button>
    </div>

    <!-- Stats -->
    <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:24px">
      <div class="card" style="flex:1;min-width:130px;padding:18px;display:flex;align-items:center;gap:12px">
        <div class="stat-icon" style="background:#EEF2FF;color:var(--blue);flex-shrink:0"><i data-lucide="calendar"></i></div>
        <div><div class="stat-num">${upcoming.length}</div><div class="stat-label">Upcoming</div></div>
      </div>
      <div class="card" style="flex:1;min-width:130px;padding:18px;display:flex;align-items:center;gap:12px">
        <div class="stat-icon" style="background:#F0FDF4;color:var(--green);flex-shrink:0"><i data-lucide="check-circle"></i></div>
        <div><div class="stat-num">${completed}</div><div class="stat-label">Completed</div></div>
      </div>
      <div class="card" style="flex:1;min-width:130px;padding:18px;display:flex;align-items:center;gap:12px">
        <div class="stat-icon" style="background:#FFF7ED;color:var(--orange);flex-shrink:0"><i data-lucide="bar-chart-2"></i></div>
        <div><div class="stat-num">${avgMarks !== null ? avgMarks+'%' : '—'}</div><div class="stat-label">Avg Score</div></div>
      </div>
      <div class="card" style="flex:1;min-width:130px;padding:18px;display:flex;align-items:center;gap:12px">
        <div class="stat-icon" style="background:#FEF2F2;color:var(--red);flex-shrink:0"><i data-lucide="bell"></i></div>
        <div><div class="stat-num">${unread}</div><div class="stat-label">Notifications</div></div>
      </div>
    </div>

    <!-- Assigned Tutors -->
    ${assigns.length ? `
    <div class="card" style="padding:24px;margin-bottom:24px">
      <h3 style="font-size:16px;font-weight:700;color:var(--navy);margin-bottom:16px;display:flex;align-items:center;gap:6px"><i data-lucide="users" style="width:18px;height:18px;color:var(--blue)"></i> My Assigned Tutors</h3>
      <div class="grid-2">
        ${assigns.map(a=>`
        <div style="display:flex;align-items:center;gap:14px;padding:16px;border:1px solid var(--g100);border-radius:var(--rs)">
          ${avi(a.tutors?.profiles?.full_name||'T', 48, a.tutors?.profiles?.avatar_url||null)}
          <div style="min-width:0;flex:1">
            <div style="font-weight:700;color:var(--navy)">${a.tutors?.profiles?.full_name||'Tutor'}</div>
            <div style="font-size:12px;color:var(--g400);margin-top:2px">${a.subject} • ${a.mode}</div>
            <div style="margin-top:6px;display:flex;gap:6px;align-items:center">
              ${statusBadge(a.is_active?'approved':'cancelled')}
              ${a.is_active ? `<button class="btn btn-ghost btn-sm" onclick="navigate('messages')">💬 Message</button>` : ''}
            </div>
          </div>
        </div>`).join('')}
      </div>
    </div>` : `
    <div class="alert-warn" style="margin-bottom:24px">
      ⚠️ No tutor assigned yet. 
      <strong style="margin-left:4px;cursor:pointer" onclick="navigate('tutors')">Browse tutors and submit a request →</strong>
    </div>`}

    <!-- Recommended Courses -->
    ${recommended.length ? `
    <div class="card" style="padding:24px;margin-bottom:24px;border:1px solid #bfdbfe;background:linear-gradient(to right, #ffffff, #eff6ff)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:10px">
        <h3 style="font-size:16px;font-weight:800;color:var(--navy);display:flex;align-items:center;gap:6px">
          <i data-lucide="book-open-check" style="width:20px;height:20px;color:var(--blue)"></i> Recommended for ${student.school_level || 'You'}
        </h3>
        <button class="btn btn-primary btn-sm" onclick="navigate('courses')">View All Courses →</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px">
        ${recommended.map(c => `
        <div style="background:#fff;border:1px solid var(--g200);border-radius:12px;overflow:hidden;cursor:pointer;transition:all 0.2s" onclick="navigate('course-${c.slug||c.id}')" onmouseover="this.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)';this.style.borderColor='var(--blue)'" onmouseout="this.style.boxShadow='none';this.style.borderColor='var(--g200)'">
          <div style="height:110px;background:var(--sky);position:relative">
             ${c.image_url ? `<img src="${c.image_url}" style="width:100%;height:100%;object-fit:cover"/>` : `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:32px">📚</div>`}
             ${c.is_exam_prep ? `<span style="position:absolute;bottom:8px;left:8px;background:#fef3c7;color:#b45309;padding:3px 8px;border-radius:4px;font-size:9px;font-weight:800;letter-spacing:0.05em">📝 EXAM PREP</span>` : ''}
          </div>
          <div style="padding:14px">
            <div style="font-size:13px;font-weight:800;color:var(--navy);margin-bottom:4px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;line-height:1.3">${c.title}</div>
            <div style="font-size:11px;color:var(--g600);display:flex;justify-content:space-between">
              <span>${c.subject || 'General'}</span>
              <span style="font-weight:700;color:${c.price>0?'var(--navy)':'var(--green)'}">${c.price>0?'RWF '+Number(c.price).toLocaleString():'FREE'}</span>
            </div>
          </div>
        </div>
        `).join('')}
      </div>
    </div>
    ` : ''}

    <!-- Dashboard Grid (Upcoming & Progress) -->
    <div class="grid-2">

      <!-- Upcoming Sessions -->
      <div class="card" style="padding:24px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
          <h3 style="font-size:16px;font-weight:700;color:var(--navy);display:flex;align-items:center;gap:6px"><i data-lucide="calendar-clock" style="width:18px;height:18px;color:var(--blue)"></i> Upcoming Sessions</h3>
          <button class="btn btn-ghost btn-sm" onclick="navigate('sessions')">View all →</button>
        </div>
        ${upcoming.length ? `
        <div style="display:flex;flex-direction:column;gap:10px">
          ${upcoming.map(s=>`
          <div style="padding:12px;border:1px solid var(--g100);border-radius:var(--rs);background:var(--g50)">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
              <div style="font-weight:700;color:var(--navy);font-size:14px">${s.subject}</div>
              ${statusBadge(s.status)}
            </div>
            <div style="font-size:12px;color:var(--g400)">${fmt(s.scheduled_at)} • ${s.duration_mins} mins • ${s.mode}</div>
            <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;">
  <button class="btn btn-primary btn-sm" onclick="renderWhiteboard('${s.id}')">🚀 Join Session (Lab + Video)</button>
  ${s.mode !== 'home' ? `<button class="btn btn-ghost btn-sm" onclick="openStandaloneVideoCall('${s.id}')" style="font-size:11px;">📹 Video Only</button>` : ''}
</div>
          </div>`).join('')}
        </div>` : `
        <div class="empty-state" style="padding:20px">
          <div class="empty-icon" style="color:var(--g400)"><i data-lucide="calendar" style="width:48px;height:48px;stroke-width:1.5"></i></div>
          <div class="empty-title">No upcoming sessions</div>
          <div class="empty-sub">Your scheduled sessions will appear here</div>
        </div>`}
      </div>

      <!-- Recent Progress -->
      <div class="card" style="padding:24px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
          <h3 style="font-size:16px;font-weight:700;color:var(--navy);display:flex;align-items:center;gap:6px"><i data-lucide="bar-chart-2" style="width:18px;height:18px;color:var(--blue)"></i> Recent Progress</h3>
        </div>
        ${progs.length ? `
        <div style="display:flex;flex-direction:column;gap:10px">
          ${progs.slice(-3).reverse().map(p=>`
          <div style="padding:12px;border:1px solid var(--g100);border-radius:var(--rs)">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
              <div style="font-weight:700;color:var(--navy);font-size:14px">${p.subject}</div>
              ${p.marks !== null ? `<span style="background:${p.marks>=75?'#dcfce7':p.marks>=50?'#fef9c3':'#fee2e2'};color:${p.marks>=75?'#166534':p.marks>=50?'#854d0e':'#991b1b'};border-radius:999px;padding:2px 10px;font-weight:700;font-size:12px">${p.marks}%</span>` : ''}
            </div>
            <div style="font-size:12px;color:var(--g400);margin-bottom:4px">${fmtShort(p.recorded_at)}</div>
            ${p.feedback ? `<div style="font-size:12px;color:var(--g600);font-style:italic">"${p.feedback.slice(0,80)}${p.feedback.length>80?'...':''}"</div>` : ''}
          </div>`).join('')}
        </div>` : `
        <div class="empty-state" style="padding:20px">
          <div class="empty-icon" style="color:var(--g400)"><i data-lucide="bar-chart-2" style="width:48px;height:48px;stroke-width:1.5"></i></div>
          <div class="empty-title">No progress yet</div>
          <div class="empty-sub">Feedback from your tutor will appear here</div>
        </div>`}
      </div>

    </div>
    <!-- AI Tutor Card (shown only if quiz is enabled) -->
    <div id="student-quiz-card"></div>

    <div id="modal-root"></div>
    `))
  // Load quiz enabled status and conditionally show AI Tutor card + sidebar link
  try{
    const quizRes = await fetch(API_URL + '/auth/settings/quiz')
    const quizData = await quizRes.json()
    if(quizData.quiz_enabled){
      const card = document.getElementById('student-quiz-card')
      if(card) card.outerHTML = `
      <div class="card" style="padding:24px;margin-top:24px;background:linear-gradient(135deg,#1e1b4b 0%,#312e81 100%)">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
          <div>
            var FORUM_CATEGORIES = [
  { id: 'general',   icon: '<i data-lucide="message-square" style="width:16px;height:16px"></i>', label: 'General Discussion' },
  { id: 'study',     icon: '<i data-lucide="book-open" style="width:16px;height:16px"></i>', label: 'Study Tips' },
  { id: 'reviews',   ic<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
              <div style="background:rgba(255,255,255,0.1);padding:6px;border-radius:8px;display:flex;align-items:center;justify-content:center"><i data-lucide="bot" style="width:24px;height:24px;color:#a78bfa"></i></div>
              <h3 style="font-size:17px;font-weight:900;color:#fff">AI Study Tutor</h3>
              <span style="background:#a78bfa;color:#1e1b4b;font-size:10px;font-weight:900;padding:2px 8px;border-radius:99px">POWERED BY AI</span>
            </div>
            <p style="font-size:12px;color:rgba(255,255,255,0.65);max-width:400px">Ask questions, get explanations, quiz yourself — an interactive AI tutor available 24/7.</p>
          </div>
          <button class="btn btn-sm" onclick="navigate('quiz')" style="background:#a78bfa;color:#1e1b4b;font-weight:800;display:flex;align-items:center;gap:6px"><i data-lucide="graduation-cap" style="width:16px;height:16px"></i> Open AI Tutor</button>on: '<i data-lucide="star" style="width:16px;height:16px"></i>', label: 'Tutor Reviews' },
  { id: 'career',    icon: '<i data-lucide="briefcase" style="width:16px;height:16px"></i>', label: 'Career Advice' },
  { id: 'feedback',  icon: '<i data-lucide="megaphone" style="width:16px;height:16px"></i>', label: 'Platform Feedback' },
]
        </div>
      </div>`
      // Show quiz sidebar link
      document.querySelectorAll('.sidebar-item').forEach(btn => {
        if(btn.textContent.includes('AI Tutor')) btn.style.display = ''
      })
    } else {
      // Hide quiz sidebar link
      document.querySelectorAll('.sidebar-item').forEach(btn => {
        if(btn.textContent.includes('AI Tutor')) btn.style.display = 'none'
      })
    }
  }catch(e){}
  } catch(e) {
    toast(e.message, 'err')
    render(dashWrap('dashboard', `<div class="empty-state"><div class="empty-icon">⚠️</div><div class="empty-title">Failed to load dashboard</div><button class="btn btn-primary" onclick="navigate('dashboard')">Retry</button></div>`))
  }
}
    // ════════════════════════════════════════════════════════════
    // AI TUTOR — Interactive conversational study assistant
    // ════════════════════════════════════════════════════════════
async function renderQuiz(){
  // Check if quiz is enabled
  try{
    const res = await fetch(API_URL + '/auth/settings/quiz')
    const data = await res.json()
    if(!data.quiz_enabled){
      render(dashWrap('quiz', `
      <div style="max-width:480px;margin:80px auto;padding:24px;text-align:center">
        <div class="card" style="padding:40px">
          <div style="font-size:56px;margin-bottom:16px">🔒</div>
          <h2 style="font-size:20px;font-weight:800;color:var(--navy);margin-bottom:8px">AI Quiz Unavailable</h2>
          <p style="font-size:14px;color:var(--g400);margin-bottom:24px">The AI Quiz feature has been temporarily disabled by admin.</p>
          <button class="btn btn-ghost" onclick="navigate('dashboard')">← Back to Dashboard</button>
        </div>
      </div>`))
      return
    }
  }catch(e){}

  // _aiChat holds the full conversation state
  window._aiChat = {
    subject: '',
    topic: '',
    history: [],
    pendingQuiz: null,
    conversationDepth: 0,  // Track how deep the conversation has gone
  }

  render(dashWrap('quiz', `
  <style>
    #ai-chat-messages{display:flex;flex-direction:column;gap:16px;padding:24px;overflow-y:auto;flex:1;min-height:0;scroll-behavior:smooth}
    .ai-msg{display:flex;gap:12px;align-items:flex-start;animation:fadeUp .3s ease;max-width:85%}
    .ai-msg.user{flex-direction:row-reverse;margin-left:auto}
    .ai-msg.assistant{margin-right:auto}
    .ai-bubble{padding:14px 18px;border-radius:18px;font-size:14px;line-height:1.7;word-wrap:break-word}
    .ai-msg.assistant .ai-bubble{background:#fff;border:1px solid var(--g100);color:var(--navy);border-radius:6px 18px 18px 18px;box-shadow:0 1px 3px rgba(0,0,0,0.05)}
    .ai-msg.user .ai-bubble{background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#fff;border-radius:18px 6px 18px 18px;box-shadow:0 2px 8px rgba(124,58,237,0.25)}
    .ai-avatar{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;margin-top:2px}
    .ai-msg.assistant .ai-avatar{background:linear-gradient(135deg,#f5f3ff,#ede9fe);border:2px solid #e9d5ff}
    .ai-msg.user .ai-avatar{background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#fff;font-size:13px;font-weight:700;border:2px solid #a78bfa}
    .ai-quiz-card{background:linear-gradient(135deg,#faf5ff,#f5f3ff);border:2px solid #c4b5fd;border-radius:14px;padding:18px;margin-top:10px;box-shadow:0 2px 8px rgba(124,58,237,0.1)}
    .ai-quiz-opt{display:flex;align-items:center;gap:12px;padding:12px 16px;border:2px solid #e9d5ff;border-radius:10px;cursor:pointer;margin-top:10px;background:#fff;font-size:14px;transition:all .2s;position:relative;overflow:hidden}
    .ai-quiz-opt:hover{border-color:#7c3aed;background:#faf5ff;transform:translateX(2px)}
    .ai-quiz-opt.correct{border-color:var(--green);background:#f0fdf4;color:#166534;font-weight:600}
    .ai-quiz-opt.wrong{border-color:var(--red);background:#fef2f2;color:#991b1b}
    .ai-quiz-opt.reveal{border-color:var(--green);background:#f0fdf4;color:#166534}
    .ai-typing{display:flex;gap:6px;align-items:center;padding:14px 18px;background:#fff;border:1px solid var(--g100);border-radius:6px 18px 18px 18px;width:fit-content;box-shadow:0 1px 3px rgba(0,0,0,0.05)}
    .ai-typing span{width:8px;height:8px;border-radius:50%;background:#a78bfa;animation:aiDot 1.4s infinite ease-in-out}
    .ai-typing span:nth-child(2){animation-delay:.2s}
    .ai-typing span:nth-child(3){animation-delay:.4s}
    @keyframes aiDot{0%,80%,100%{transform:scale(0.7);opacity:.3}40%{transform:scale(1.1);opacity:1}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    .ai-chip{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:20px;border:1.5px solid #e9d5ff;background:#faf5ff;color:#7c3aed;font-size:12px;font-weight:600;cursor:pointer;transition:all .2s;white-space:nowrap}
    .ai-chip:hover{background:#f5f3ff;border-color:#7c3aed;transform:translateY(-1px);box-shadow:0 2px 6px rgba(124,58,237,0.15)}
    .ai-chip:active{transform:translateY(0)}
    #ai-input-row{display:flex;gap:10px;padding:16px 20px;border-top:1px solid var(--g100);background:#fff;flex-shrink:0}
    #ai-input{flex:1;border:2px solid var(--g200);border-radius:12px;padding:12px 16px;font-size:14px;outline:none;resize:none;font-family:inherit;max-height:120px;overflow-y:auto;line-height:1.5;transition:border-color .2s}
    #ai-input:focus{border-color:#7c3aed;box-shadow:0 0 0 3px rgba(124,58,237,0.1)}
    #ai-send-btn{background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#fff;border:none;border-radius:12px;padding:12px 24px;cursor:pointer;font-size:14px;font-weight:700;flex-shrink:0;transition:all .2s;box-shadow:0 2px 8px rgba(124,58,237,0.3)}
    #ai-send-btn:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(124,58,237,0.4)}
    #ai-send-btn:active{transform:translateY(0)}
    #ai-send-btn:disabled{background:var(--g200);cursor:not-allowed;box-shadow:none;transform:none}
    .ai-subject-setup{display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;padding:40px 24px;text-align:center}
    .ai-follow-up{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap}
    .ai-follow-up-btn{font-size:11px;padding:4px 10px;background:#f5f3ff;border:1px solid #e9d5ff;border-radius:12px;color:#7c3aed;cursor:pointer;transition:all .15s}
    .ai-follow-up-btn:hover{background:#ede9fe;border-color:#7c3aed}
  </style>

  <div style="display:flex;flex-direction:column;height:calc(100vh - 120px);max-width:780px;margin:0 auto">

    <!-- Header -->
    <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--g100);flex-shrink:0;background:#fff;border-radius:12px 12px 0 0">
      <div style="display:flex;align-items:center;gap:10px">
        <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#a78bfa);display:flex;align-items:center;justify-content:center;font-size:18px">🤖</div>
        <div>
          <div style="font-size:15px;font-weight:700;color:var(--navy)" id="ai-tutor-title">AI Study Tutor</div>
          <div style="font-size:11px;color:var(--g400)" id="ai-tutor-sub">Ask me anything • Quiz yourself • Get explanations</div>
        </div>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-ghost btn-sm" onclick="clearAiChat()" title="New conversation">🔄 New</button>
        <button class="btn btn-ghost btn-sm" onclick="navigate('dashboard')">← Back</button>
      </div>
    </div>

    <!-- Messages -->
    <div id="ai-chat-messages" style="background:#f8f7ff">
      <!-- Setup screen shown first -->
      <div class="ai-subject-setup" id="ai-setup-screen">
        <div style="font-size:48px;margin-bottom:16px">🎓</div>
        <h2 style="font-size:20px;font-weight:800;color:var(--navy);margin-bottom:8px">What would you like to study?</h2>
        <p style="font-size:14px;color:var(--g400);margin-bottom:24px;max-width:400px">I can explain concepts, answer questions, quiz you, give examples, and help you understand anything — just like a real tutor.</p>
        <div style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;justify-content:center">
          <input class="input" id="ai-subject-input" placeholder="Subject (e.g. Mathematics)" style="width:200px"/>
          <input class="input" id="ai-topic-input" placeholder="Topic (optional)" style="width:200px"/>
        </div>
        <button class="btn btn-primary" onclick="initAiChat()" style="background:#7c3aed;border-color:#7c3aed;padding:12px 32px;font-size:15px">Start Studying →</button>
        <div style="margin-top:20px;font-size:13px;color:var(--g400)">Or try a quick start:</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:10px">
          ${['📐 Mathematics','🧬 Biology','⚗️ Chemistry','🌍 Geography','📖 English','💻 Computer Science'].map(s=>`<button class="ai-chip" onclick="quickStartChat('${s.slice(2).trim()}')">${s}</button>`).join('')}
        </div>
      </div>
    </div>

    <!-- Suggestions row (hidden until chat starts) -->
    <div id="ai-suggestions" style="display:none;padding:10px 16px;border-top:1px solid var(--g100);background:linear-gradient(to bottom,#fafafa,#fff);overflow-x:auto;white-space:nowrap;flex-shrink:0">
      <div style="display:inline-flex;gap:8px;align-items:center">
        <span style="font-size:11px;color:var(--g400);font-weight:600;margin-right:4px">💡 Try:</span>
        <button class="ai-chip" onclick="sendSuggestion('Explain this in simpler terms')">🔄 Simpler</button>
        <button class="ai-chip" onclick="sendSuggestion('Give me a real-world example')">🌍 Example</button>
        <button class="ai-chip" onclick="sendSuggestion('Can you break this down step-by-step?')">📝 Step-by-step</button>
        <button class="ai-chip" onclick="sendSuggestion('Quiz me on this')">🎯 Quiz me</button>
        <button class="ai-chip" onclick="sendSuggestion('What are the key points?')">📌 Key points</button>
        <button class="ai-chip" onclick="sendSuggestion('How does this connect to other topics?')">🔗 Connections</button>
        <button class="ai-chip" onclick="sendSuggestion('What are common mistakes?')">⚠️ Mistakes</button>
        <button class="ai-chip" onclick="sendSuggestion('Summarize what we covered')">📋 Summary</button>
      </div>
    </div>

    <!-- Input -->
    <div id="ai-input-row" style="display:none">
      <textarea id="ai-input" rows="1" placeholder="Ask anything... I'm here to help you understand 💭" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendAiMessage()}" oninput="autoResizeInput(this)"></textarea>
      <button id="ai-send-btn" onclick="sendAiMessage()">Send ✨</button>
    </div>
  </div>`))
}

function quickStartChat(subject){
  const si = document.getElementById('ai-subject-input')
  if(si) si.value = subject
  initAiChat()
}

function initAiChat(){
  const subject = document.getElementById('ai-subject-input')?.value?.trim()
  if(!subject){ toast('Please enter a subject','err'); return }
  const topic = document.getElementById('ai-topic-input')?.value?.trim() || ''
  window._aiChat.subject = subject
  window._aiChat.topic   = topic

  // Update header
  const title = document.getElementById('ai-tutor-title')
  const sub   = document.getElementById('ai-tutor-sub')
  if(title) title.textContent = `AI Tutor — ${subject}${topic?' · '+topic:''}`
  if(sub)   sub.textContent   = 'Ask questions • Explore deeply • Learn naturally'

  // Hide setup, show input
  const setup = document.getElementById('ai-setup-screen')
  if(setup) setup.remove()
  document.getElementById('ai-input-row').style.display = 'flex'
  document.getElementById('ai-suggestions').style.display = 'block'

  // Send opening message from AI - NotebookLM style
  const greeting = topic
    ? `Hi! I'm your AI learning companion for **${subject}**, focusing on **${topic}**. 

Think of me as a knowledgeable friend who's here to help you truly understand this topic — not just memorize it. 

I can:
- Explain concepts in different ways until they click
- Give you real-world examples and analogies
- Test your understanding with questions
- Connect ideas to show you the bigger picture
- Answer any questions you have, no matter how basic

**What would you like to explore first?** You can ask me to explain something, or just tell me what you're curious about!`
    : `Hi! I'm your AI learning companion for **${subject}**. 

I'm here to help you understand this subject deeply through conversation. We can explore concepts together, work through examples, test your knowledge, and make connections that help everything make sense.

**What would you like to start with?** Ask me anything — whether it's a specific topic you're struggling with, or just "where should I begin?"`

  appendAiMessage('assistant', greeting)
  document.getElementById('ai-input')?.focus()
}

function appendAiMessage(role, content, extra = {}){
  const msgs = document.getElementById('ai-chat-messages')
  if(!msgs) return

  const isUser = role === 'user'
  const initials = (State.user?.full_name||'S').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()

  const div = document.createElement('div')
  div.className = `ai-msg ${role}`

  // Format markdown-lite: **bold**, *italic*, bullet lists, numbered lists, code
  const formatted = formatAiText(content)

  div.innerHTML = `
    <div class="ai-avatar">${isUser ? initials : '🤖'}</div>
    <div style="flex:1;min-width:0">
      <div class="ai-bubble">${formatted}</div>
      ${extra.quizOptions ? renderQuizOptions(extra) : ''}
      ${!isUser && !extra.quizOptions ? renderFollowUpSuggestions() : ''}
    </div>`

  msgs.appendChild(div)
  msgs.scrollTop = msgs.scrollHeight
  
  // Increment conversation depth
  if(window._aiChat) window._aiChat.conversationDepth++
}

function renderFollowUpSuggestions(){
  const suggestions = [
    'Tell me more',
    'Give an example',
    'I don\'t understand',
    'Quiz me',
    'What\'s next?'
  ]
  const random = suggestions.sort(() => Math.random() - 0.5).slice(0, 3)
  return `<div class="ai-follow-up">
    ${random.map(s => `<button class="ai-follow-up-btn" onclick="sendSuggestion('${s}')">${s}</button>`).join('')}
  </div>`
}

function formatAiText(text){
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code style="background:#f1f5f9;padding:1px 5px;border-radius:3px;font-size:13px">$1</code>')
    .replace(/^### (.+)$/gm, '<div style="font-weight:700;font-size:15px;color:var(--navy);margin:10px 0 4px">$1</div>')
    .replace(/^## (.+)$/gm,  '<div style="font-weight:800;font-size:16px;color:var(--navy);margin:12px 0 4px">$1</div>')
    .replace(/^- (.+)$/gm,   '<div style="display:flex;gap:8px;margin:3px 0"><span style="color:#7c3aed;flex-shrink:0">•</span><span>$1</span></div>')
    .replace(/^\d+\. (.+)$/gm, (m,p1,offset,str)=>{
      const num = str.slice(0,offset).split('\n').filter(l=>/^\d+\./.test(l)).length + 1
      return `<div style="display:flex;gap:8px;margin:3px 0"><span style="color:#7c3aed;font-weight:700;flex-shrink:0">${num}.</span><span>${p1}</span></div>`
    })
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>')
}

function renderQuizOptions(extra){
  const { options, questionId } = extra
  if(!options?.length) return ''
  const letters = ['A','B','C','D','E']
  return `<div class="ai-quiz-card">
    <div style="font-size:12px;font-weight:700;color:#7c3aed;margin-bottom:10px">🎯 QUIZ QUESTION</div>
    ${options.map((opt,i)=>`
    <button class="ai-quiz-opt" id="aiqopt-${questionId}-${i}" onclick="answerAiQuiz('${questionId}',${i},'${opt.replace(/'/g,"\'")}')">
      <span style="width:22px;height:22px;border-radius:50%;background:#ede9fe;color:#7c3aed;font-weight:700;font-size:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0">${letters[i]}</span>
      ${opt}
    </button>`).join('')}
  </div>`
}

function showTyping(){
  const msgs = document.getElementById('ai-chat-messages')
  if(!msgs) return
  const div = document.createElement('div')
  div.className = 'ai-msg assistant'
  div.id = 'ai-typing-indicator'
  div.innerHTML = `<div class="ai-avatar">🤖</div><div class="ai-typing"><span></span><span></span><span></span></div>`
  msgs.appendChild(div)
  msgs.scrollTop = msgs.scrollHeight
}

function hideTyping(){
  document.getElementById('ai-typing-indicator')?.remove()
}

function sendSuggestion(text){
  const input = document.getElementById('ai-input')
  if(input){ input.value = text }
  sendAiMessage()
}

async function sendAiMessage(){
  const input = document.getElementById('ai-input')
  const text  = input?.value?.trim()
  if(!text) return

  const d = window._aiChat
  if(!d.subject){ toast('Please set a subject first','err'); return }

  input.value = ''
  input.style.height = 'auto'

  const btn = document.getElementById('ai-send-btn')
  if(btn) btn.disabled = true

  appendAiMessage('user', text)
  d.history.push({ role:'user', content: text })

  showTyping()

  try{
    const res = await api('/quiz/chat', {
      method: 'POST',
      body: JSON.stringify({
        subject:  d.subject,
        topic:    d.topic,
        history:  d.history.slice(-20),
        message:  text,
      })
    })

    hideTyping()

    if(!res || (!res.type && !res.content)){
      throw new Error('Invalid response from AI')
    }
    if(!res.type) res.type = 'message'

    if(res.type === 'quiz' && res.options && res.options.length > 0){
      const qid = 'q_' + Date.now()
      d.pendingQuiz = {
        id: qid,
        question: res.content,
        options: res.options,
        correct: res.correct_index ?? 0,
        explanation: res.explanation || ''
      }
      appendAiMessage('assistant', res.content, { quizOptions: true, options: res.options, questionId: qid })
    } else {
      appendAiMessage('assistant', res.content || 'Sorry, I could not generate a response.')
    }

    d.history.push({ role:'assistant', content: res.content })
    
    setTimeout(() => {
      const msgs = document.getElementById('ai-chat-messages')
      if(msgs) msgs.scrollTop = msgs.scrollHeight
    }, 100)

  }catch(e){
    hideTyping()
    const errorMsg = e.message.includes('fetch') 
      ? 'I\'m having trouble connecting right now. Please check your internet and try again.'
      : `I ran into an issue: ${e.message}. Let\'s try that again!`
    appendAiMessage('assistant', errorMsg)
  }finally{
    if(btn) btn.disabled = false
    input?.focus()
  }
}

function answerAiQuiz(questionId, selectedIdx, selectedText){
  const d = window._aiChat
  if(!d.pendingQuiz || d.pendingQuiz.id !== questionId) return

  const q = d.pendingQuiz
  const isCorrect = selectedIdx === q.correct
  const letters = ['A','B','C','D','E']

  for(let i=0;i<q.options.length;i++){
    const el = document.getElementById(`aiqopt-${questionId}-${i}`)
    if(!el) continue
    el.onclick = null
    if(i === q.correct) el.className = 'ai-quiz-opt reveal'
    else if(i === selectedIdx && !isCorrect) el.className = 'ai-quiz-opt wrong'
    else el.className = 'ai-quiz-opt'
    el.style.cursor = 'default'
  }

  d.history.push({ role:'user', content: `My answer: ${letters[selectedIdx]}. ${selectedText}` })

  const feedback = isCorrect
    ? `✅ **Exactly right!** Well done.

${q.explanation}

**Want to go deeper?** I can explain why the other options were incorrect, or we can move on to the next concept.`
    : `**Not quite — but that's okay!** The correct answer is **${letters[q.correct]}. ${q.options[q.correct]}**.

${q.explanation}

**Let me know if you want me to explain this differently**, or we can try another question to reinforce the concept.`

  appendAiMessage('assistant', feedback)
  d.history.push({ role:'assistant', content: feedback })
  d.pendingQuiz = null
  
  setTimeout(() => {
    const msgs = document.getElementById('ai-chat-messages')
    if(msgs) msgs.scrollTop = msgs.scrollHeight
  }, 100)
}

function clearAiChat(){
  window._aiChat = { subject:'', topic:'', history:[], pendingQuiz:null, conversationDepth:0 }
  renderQuiz()
}

function autoResizeInput(textarea){
  textarea.style.height = 'auto'
  textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
}

    // ════════════════════════════════════════════════════════════
    // TUTOR DASHBOARD
    // ════════════════════════════════════════════════════════════
    async function uploadTutorDocs() {
      const cvFile = document.getElementById('cv-upload')?.files[0]
      if (!cvFile) { toast('Please select a CV file', 'err'); return }

      const formData = new FormData()
      formData.append('cv', cvFile)

      const certFiles = document.getElementById('cert-upload')?.files
      if (certFiles?.length) {
        for (const f of certFiles) formData.append('certificates', f)
      }

      try {
        const token = getToken()
        const r = await fetch(API_URL + '/tutors/upload-docs', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        })
        if (!r.ok) throw new Error('Upload failed')
        toast('Documents uploaded successfully! ✅')
        renderTutorDash()
      } catch (e) {
        console.error('Dashboard error:', e)
        alert('Error: ' + e.message + '\n' + e.stack)
        render(dashWrap('dashboard', `<div class="empty-state"><div class="empty-icon">⚠️</div><div class="empty-title">Failed to load dashboard</div><button class="btn btn-primary" onclick="navigate('dashboard')">Retry</button></div>`))
      }
    }
    function togglePaymentDetails(){
  const method = document.getElementById('t-pay-method')?.value
  const label  = document.getElementById('pay-details-label')
  if(!label) return
  if(method === 'bank'){
    label.textContent = 'Bank Account Number & Bank Name'
  } else if(method === 'mtn_momo'){
    label.textContent = 'MTN Mobile Money Number'
  } else if(method === 'airtel'){
    label.textContent = 'Airtel Money Number'
  } else {
    label.textContent = 'Account Details'
  }
}

async function savePaymentPreference(){
  const method  = document.getElementById('t-pay-method')?.value
  const details = document.getElementById('t-pay-details')?.value?.trim()
  if(!method){ toast('Please select a payment method','err'); return }
  if(!details){ toast('Please enter your account details','err'); return }
  try{
    await api('/tutors/me/payment-preference', {
      method: 'PATCH',
      body: JSON.stringify({ payment_method: method, payment_details: details })
    })
    toast('Payment preference saved! ✅')
  }catch(e){
    toast(e.message,'err')
  }
}
async function renderAdminExam() {
  render(dashWrap('admin-exam', `<div class="loader-center"><div class="spinner"></div></div>`))
  try{
    const [questions, attempts, settings] = await Promise.all([
      api('/exam/questions/admin'),
      api('/exam/attempts/admin'),
      api('/exam/settings/admin')
    ])

    const questionsHtml = questions.length ? questions.map((q,i) => {
      const correctAnswers = q.correct_answer ? q.correct_answer.split(',').map(a => a.trim().toLowerCase()) : []
      const optionsHtml = ['multiple_choice','multiple_select'].includes(q.type) && q.options
        ? '<div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">' +
          q.options.map(o => {
            const isCorrect = correctAnswers.includes(o.trim().toLowerCase())
            return '<span style="background:' + (isCorrect?'#dcfce7':'var(--g100)') + ';color:' + (isCorrect?'var(--green)':'var(--g600)') + ';padding:3px 10px;border-radius:6px;font-size:12px">' +
            o + (isCorrect?' ✓':'') + '</span>'
          }).join('') + '</div>'
        : ''
      const matchingHtml = q.type === 'matching' && q.pairs?.length
        ? '<div style="margin-top:8px;display:flex;flex-direction:column;gap:4px">' +
          q.pairs.map(p => '<div style="display:flex;gap:8px;font-size:12px"><span style="background:var(--sky);padding:2px 8px;border-radius:4px;color:var(--navy);font-weight:600">' + p.term + '</span><span style="color:var(--g400)">→</span><span style="background:#dcfce7;padding:2px 8px;border-radius:4px;color:#166534">' + p.answer + '</span></div>').join('') +
          '</div>'
        : ''
      return `<div style="padding:16px;border:1px solid var(--g100);border-radius:10px;display:flex;align-items:flex-start;gap:14px">
        <div style="background:var(--navy);color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0">${i+1}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:14px;font-weight:600;color:var(--navy);margin-bottom:4px">${q.question}</div>
          <div style="font-size:12px;color:var(--g400)">${q.type === 'multiple_choice' ? '🔘 Multiple choice' : q.type === 'multiple_select' ? '☑️ Select all that apply' : q.type === 'matching' ? '🔗 Matching (dropdown)' : '✍️ Written answer'} • ${q.marks} mark${q.marks>1?'s':''}</div>
          ${optionsHtml}${matchingHtml}
        </div>
        <div style="display:flex;gap:6px;flex-shrink:0">
          <button class="btn btn-ghost btn-sm" onclick="openEditQuestionModal(${JSON.stringify(q).replace(/"/g,'&quot;')})">✏️</button>
          <button class="btn btn-ghost btn-sm" style="color:var(--red)" onclick="deleteQuestion('${q.id}')"><i data-lucide="trash-2" style="width:16px;height:16px"></i></button>
        </div>
      </div>`
    }).join('') : '<div class="empty-state"><div class="empty-sub">No questions yet. Add your first question!</div></div>'

    const attemptsHtml = attempts.length ? attempts.map(a => {
      return `<tr>
        <td><div style="font-weight:600">${a.profiles?.full_name||'—'}</div><div style="font-size:11px;color:var(--g400)">${a.profiles?.email||''}</div></td>
        <td style="font-size:12px">${fmtShort(a.started_at)}</td>
        <td style="font-size:12px">${a.submitted_at ? fmtShort(a.submitted_at) : '—'}</td>
        <td>${statusBadge(a.status)} ${a.auto_submitted ? '<span style="background:#FEF3C7;color:#92400E;font-size:10px;padding:2px 6px;border-radius:4px;margin-left:4px">⏱ Auto</span>' : ''}</td>
        <td style="font-weight:700;color:var(--navy)">${a.score !== null ? a.score+'%' : '—'} ${a.status==='pending_review'?'<span style="background:#FEF3C7;color:#92400E;font-size:10px;padding:2px 6px;border-radius:4px">⏳ Pending</span>':a.status==='graded'?'<span style="background:#dcfce7;color:#166534;font-size:10px;padding:2px 6px;border-radius:4px">✅ Graded</span>':''}</td>
        <td style="${(a.tab_switches||0)>2 ? 'color:var(--red);font-weight:700' : 'color:var(--g600)'}">${a.tab_switches||0}</td>
        <td>
          <div style="display:flex;gap:4px;flex-wrap:wrap">
            <button class="btn btn-ghost btn-sm" onclick="viewExamAnswers('${a.id}')">📄 Answers</button>
            <button class="btn btn-ghost btn-sm" style="background:#f5f3ff;color:#7c3aed;border-color:#7c3aed" onclick="aiReGradeAttempt('${a.id}')">🤖 AI Grade</button>
            <button class="btn btn-ghost btn-sm" onclick="openGradeModal('${a.id}','${(a.profiles?.full_name||'').replace(/'/g,"\\'")}',${a.score||0})">✏️ Override</button>
            <button class="btn btn-ghost btn-sm" style="color:var(--red)" onclick="deleteAttempt('${a.id}')"><i data-lucide="trash-2" style="width:16px;height:16px"></i></button>
          </div>
        </td>
      </tr>`
    }).join('') : ''

    render(dashWrap('admin-exam', `
    <div class="page-header">
      <div><h1 class="page-title">Exam Manager</h1><p class="page-subtitle">${questions.length} questions • ${attempts.length} attempts</p></div>
      <button class="btn btn-primary" onclick="openAddQuestionModal()">+ Add Question</button>
    </div>

    <div class="card" style="padding:24px;margin-bottom:24px">
      <h3 style="font-size:16px;font-weight:700;color:var(--navy);margin-bottom:16px">⚙️ Exam Settings</h3>
      <div style="display:flex;gap:16px;align-items:flex-end">
        <div class="form-group" style="flex:1">
          <label class="form-label">Exam Duration (minutes)</label>
          <input class="input" id="exam-time" type="number" min="10" max="300" value="${settings.default_time_minutes || 60}"/>
        </div>
        <div class="form-group" style="flex:2">
          <label class="form-label">Exam Instructions</label>
          <textarea class="input" id="exam-instructions" rows="2" placeholder="Enter exam instructions...">${settings.instructions || 'Please read carefully before starting'}</textarea>
        </div>
        <button class="btn btn-primary" onclick="saveExamSettings()">Save Settings</button>
      </div>
    </div>

    <div class="card" style="padding:24px;margin-bottom:24px">
      <h3 style="font-size:16px;font-weight:700;color:var(--navy);margin-bottom:16px">📋 Exam Questions</h3>
      <div style="display:flex;flex-direction:column;gap:10px">${questionsHtml}</div>
    </div>

    <div class="card" style="padding:24px">
      <h3 style="font-size:16px;font-weight:700;color:var(--navy);margin-bottom:16px">📊 Exam Attempts</h3>
      ${attempts.length ? `
      <div class="table-wrap">
        <table>
          <thead><tr><th>Tutor</th><th>Started</th><th>Submitted</th><th>Status</th><th>MCQ Score</th><th>Tab Switches</th><th>Actions</th></tr></thead>
          <tbody>${attemptsHtml}</tbody>
        </table>
      </div>` : `<div class="empty-state"><div class="empty-sub">No exam attempts yet</div></div>`}
    </div>
    <div id="modal-root"></div>
    `))
  }catch(e){ toast(e.message,'err') }
}

function openAddQuestionModal(existing = null){
  const isEdit = !!existing
  document.getElementById('modal-root').innerHTML = `
  <div class="modal-overlay" onclick="if(event.target===this)this.remove()">
    <div class="modal" style="max-width:600px">
      <div class="modal-header">
        <span class="modal-title">${isEdit ? '✏️ Edit Question' : '+ Add Question'}</span>
        <button class="modal-close" onclick="document.querySelector('.modal-overlay').remove()">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Question Type</label>
          <select class="input" id="q-type" onchange="onQTypeChange(this.value)">
          <option value="multiple_choice" ${existing?.type==='multiple_choice'?'selected':''}>Multiple Choice (one answer)</option>
          <option value="multiple_select" ${existing?.type==='multiple_select'?'selected':''}>Multiple Select (click all that apply)</option>
          <option value="matching" ${existing?.type==='matching'?'selected':''}>Matching (pairs — answers hidden in dropdown)</option>
          <option value="text" ${existing?.type==='text'?'selected':''}>Written Answer</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Question *</label>
          <textarea class="input" id="q-text" rows="3" placeholder="Enter the question...">${existing?.question||''}</textarea>
          <div style="font-size:11px;color:var(--g400);margin-top:4px">Use LaTeX for formulas: \( x^2 + y^2 = z^2 \) for inline, \[ \frac{a}{b} \] for block</div>
        </div>
        <div id="q-options-wrap">
          <div class="form-group">
            <label class="form-label">Options (one per line) *</label>
            <textarea class="input" id="q-options" rows="4" placeholder="Option A&#10;Option B&#10;Option C&#10;Option D">${existing?.options?.join('\n')||''}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label" id="q-correct-label">Correct Answer *</label>
            <input class="input" id="q-correct" placeholder="e.g. Option A" value="${existing?.correct_answer||''}"/>
            <div id="q-correct-hint" style="font-size:11px;color:var(--g400);margin-top:4px">Must match one option exactly</div>
          </div>
        </div>
        <div id="q-model-answer-wrap" style="display:none">
          <div class="form-group">
            <label class="form-label">Model Answer * <span style="background:#7c3aed;color:#fff;font-size:10px;padding:2px 6px;border-radius:4px;margin-left:4px">AI GRADING</span></label>
            <textarea class="input" id="q-model-answer" rows="3" placeholder="Write the ideal answer here. The AI will compare the tutor's response to this and award marks accordingly."></textarea>
            <div style="font-size:11px;color:var(--g400);margin-top:4px">🤖 Claude AI will grade text answers against this model answer automatically on submission</div>
          </div>
        </div>
        <div id="q-matching-wrap" style="display:none">
          <div class="form-group">
            <label class="form-label">Matching Pairs *</label>
            <div style="font-size:12px;color:var(--g400);margin-bottom:8px">One pair per line in format: <code style="background:#f1f5f9;padding:1px 5px;border-radius:3px">Term | Answer</code></div>
            <textarea class="input" id="q-pairs" rows="5" placeholder="Photosynthesis | Process plants use to make food&#10;Mitosis | Cell division&#10;DNA | Genetic material">${existing?.pairs?.map(p=>p.term+'|'+p.answer).join('\n')||''}</textarea>
            <div style="font-size:11px;color:var(--g400);margin-top:4px">🔒 Answers will be hidden in a dropdown during the exam — tutors cannot photograph them</div>
          </div>
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Marks</label>
            <input class="input" type="number" id="q-marks" min="1" max="10" value="${existing?.marks||1}"/>
          </div>
          <div class="form-group">
            <label class="form-label">Order</label>
            <input class="input" type="number" id="q-order" min="0" value="${existing?.order_num||0}"/>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="document.querySelector('.modal-overlay').remove()">Cancel</button>
        <button class="btn btn-primary" onclick="${isEdit ? `saveEditQuestion('${existing.id}')` : 'saveNewQuestion()'}">
          ${isEdit ? 'Save Changes' : 'Add Question'}
        </button>
      </div>
    </div>
  </div>`
  onQTypeChange(existing?.type || 'multiple_choice')
  if(existing?.model_answer){
    setTimeout(()=>{
      const el = document.getElementById('q-model-answer')
      if(el) el.value = existing.model_answer
    }, 50)
  }
}

function openEditQuestionModal(q){ openAddQuestionModal(q) }

function onQTypeChange(type){
  const wrap        = document.getElementById('q-options-wrap')
  const matchWrap   = document.getElementById('q-matching-wrap')
  const modelWrap   = document.getElementById('q-model-answer-wrap')
  const label       = document.getElementById('q-correct-label')
  const hint        = document.getElementById('q-correct-hint')
  if(wrap)      wrap.style.display      = ['multiple_choice','multiple_select'].includes(type) ? 'block' : 'none'
  if(matchWrap) matchWrap.style.display = type === 'matching' ? 'block' : 'none'
  if(modelWrap) modelWrap.style.display = type === 'text' ? 'block' : 'none'
  if(label && type === 'multiple_select') label.textContent = 'Correct Answers * (comma separated)'
  if(label && type === 'multiple_choice') label.textContent = 'Correct Answer *'
  if(hint  && type === 'multiple_select') hint.textContent  = 'e.g. Option A, Option C'
  if(hint  && type === 'multiple_choice') hint.textContent  = 'Must match one option exactly'
}
async function saveNewQuestion(){
  const type    = document.getElementById('q-type')?.value
  const text    = document.getElementById('q-text')?.value?.trim()
  const options = ['multiple_choice','multiple_select'].includes(type) ? document.getElementById('q-options')?.value?.split('\n').map(o=>o.trim()).filter(Boolean) : null
  const correct = ['multiple_choice','multiple_select'].includes(type) ? document.getElementById('q-correct')?.value?.trim() : null
  const marks   = parseInt(document.getElementById('q-marks')?.value) || 1
  const order   = parseInt(document.getElementById('q-order')?.value) || 0
  let pairs = null
  if(type === 'matching'){
    const raw = document.getElementById('q-pairs')?.value?.trim()
    if(!raw){ toast('Please enter matching pairs','err'); return }
    pairs = raw.split('\n').map(l=>l.trim()).filter(Boolean).map(l=>{
      const [term,...rest] = l.split('|')
      return { term: term?.trim(), answer: rest.join('|').trim() }
    }).filter(p=>p.term && p.answer)
    if(pairs.length < 2){ toast('Please enter at least 2 pairs','err'); return }
  }
  if(!text){ toast('Question text is required','err'); return }
  if(['multiple_choice','multiple_select'].includes(type) && (!options?.length || !correct)){ toast('Options and correct answer are required','err'); return }
  const modelAnswer = type === 'text' ? (document.getElementById('q-model-answer')?.value?.trim() || null) : null
  try{
    await api('/exam/questions/admin', { method:'POST', body: JSON.stringify({ question:text, type, options, correct_answer:correct, model_answer:modelAnswer, marks, order_num:order, pairs }) })
    document.querySelector('.modal-overlay')?.remove()
    toast('Question added ✅')
    renderAdminExam()
  }catch(e){ toast(e.message,'err') }
}

async function saveEditQuestion(id){
  const type    = document.getElementById('q-type')?.value
  const text    = document.getElementById('q-text')?.value?.trim()
  const options = ['multiple_choice','multiple_select'].includes(type) ? document.getElementById('q-options')?.value?.split('\n').map(o=>o.trim()).filter(Boolean) : null
  const correct = ['multiple_choice','multiple_select'].includes(type) ? document.getElementById('q-correct')?.value?.trim() : null
  const marks   = parseInt(document.getElementById('q-marks')?.value) || 1
  const order   = parseInt(document.getElementById('q-order')?.value) || 0
  let pairs = null
  if(type === 'matching'){
    const raw = document.getElementById('q-pairs')?.value?.trim()
    if(!raw){ toast('Please enter matching pairs','err'); return }
    pairs = raw.split('\n').map(l=>l.trim()).filter(Boolean).map(l=>{
      const [term,...rest] = l.split('|')
      return { term: term?.trim(), answer: rest.join('|').trim() }
    }).filter(p=>p.term && p.answer)
    if(pairs.length < 2){ toast('Please enter at least 2 pairs','err'); return }
  }
  const modelAnswer = type === 'text' ? (document.getElementById('q-model-answer')?.value?.trim() || null) : null
  if(!text){ toast('Question text is required','err'); return }
  try{
    await api(`/exam/questions/admin/${id}`, { method:'PATCH', body: JSON.stringify({ question:text, type, options, correct_answer:correct, model_answer:modelAnswer, marks, order_num:order, pairs }) })
    document.querySelector('.modal-overlay')?.remove()
    toast('Question updated ✅')
    renderAdminExam()
  }catch(e){ toast(e.message,'err') }
}

async function deleteQuestion(id){
  if(!confirm('Delete this question? This cannot be undone.')) return
  try{
    await api(`/exam/questions/admin/${id}`, { method:'DELETE' })
    toast('Question deleted ✅')
    renderAdminExam()
  }catch(e){ toast(e.message,'err') }
}

async function saveExamSettings(){
  const time = document.getElementById('exam-time')?.value
  const instructions = document.getElementById('exam-instructions')?.value?.trim()
  if(!time || time < 10 || time > 300){ toast('Exam time must be 10-300 minutes','err'); return }
  if(!instructions){ toast('Instructions are required','err'); return }
  try{
    await api('/exam/settings/admin', { method:'PATCH', body: JSON.stringify({ default_time_minutes: parseInt(time), instructions }) })
    toast('Settings saved successfully','success')
  }catch(e){ toast(e.message,'err') }
}

async function deleteAttempt(id){
  if(!confirm('Delete this exam attempt? This action cannot be undone.')) return
  try{
    await api(`/exam/attempts/admin/${id}`, { method:'DELETE' })
    renderAdminExam()
    toast('Attempt deleted','success')
  }catch(e){ toast(e.message,'err') }
}

function openGradeModal(attemptId, name, currentScore){
  document.getElementById('modal-root').innerHTML = `
  <div class="modal-overlay" onclick="if(event.target===this)this.remove()">
    <div class="modal" style="max-width:420px">
      <div class="modal-header">
        <span class="modal-title">Grade ${name}</span>
        <button class="modal-close" onclick="document.querySelector('.modal-overlay').remove()">✕</button>
      </div>
      <div class="modal-body">
        <p style="font-size:13px;color:var(--g400);margin-bottom:16px">Set the final score after reviewing written answers. This overrides the auto-graded MCQ score.</p>
        <div class="form-group">
          <label class="form-label">Final Score (0-100)</label>
          <input class="input" type="number" id="final-score" min="0" max="100" value="${currentScore||0}"/>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="document.querySelector('.modal-overlay').remove()">Cancel</button>
        <button class="btn btn-primary" onclick="submitGrade('${attemptId}')">Save Score ✅</button>
      </div>
    </div>
  </div>`
}

async function submitGrade(attemptId){
  const score = parseInt(document.getElementById('final-score')?.value)
  if(isNaN(score) || score < 0 || score > 100){ toast('Score must be 0-100','err'); return }
  try{
    await api(`/exam/attempts/admin/${attemptId}/grade`, { method:'PATCH', body: JSON.stringify({ score }) })
    document.querySelector('.modal-overlay')?.remove()
    toast('Score saved ✅')
    renderAdminExam()
  }catch(e){ toast(e.message,'err') }
}

async function aiReGradeAttempt(attemptId){
  const btn = event.target
  btn.disabled = true; btn.textContent = '⏳ Grading...'
  try{
    const res = await api(`/exam/attempts/admin/${attemptId}/ai-grade`, { method:'POST' })
    toast(`AI grading complete! Score: ${res.score}% ${res.has_pending ? '— some answers still need manual review' : '✅'}`)
    renderAdminExam()
  }catch(e){ toast(e.message,'err') }
  finally{ btn.disabled=false; btn.textContent='🤖 AI Grade' }
}

async function gradeAnswerManually(attemptId, questionId, maxMarks){
  const marksEl = document.getElementById(`manual-marks-${questionId}`)
  const feedbackEl = document.getElementById(`manual-feedback-${questionId}`)
  const marks = parseInt(marksEl?.value)
  if(isNaN(marks) || marks < 0 || marks > maxMarks){ toast(`Marks must be 0–${maxMarks}`,'err'); return }
  try{
    const res = await api(`/exam/attempts/admin/${attemptId}/grade-answer`, {
      method:'PATCH',
      body: JSON.stringify({ question_id: questionId, marks_awarded: marks, feedback: feedbackEl?.value?.trim() || 'Manually graded' })
    })
    toast(`Saved! New total: ${res.score}%`)
    // Refresh the modal
    viewExamAnswers(attemptId)
  }catch(e){ toast(e.message,'err') }
}

async function viewExamAnswers(attemptId){
  try{
    const res = await api(`/exam/attempt/admin/${attemptId}`)
    const { attempt, questions, answer_map } = res
    const answers = attempt.answers || {}
    const aiFeedback = attempt.ai_feedback || {}

    const confidenceColor = { high:'#166534', medium:'#854d0e', low:'#991b1b', none:'#6B6B80', manual:'#1A5FFF' }
    const confidenceBg    = { high:'#dcfce7', medium:'#fef9c3', low:'#fee2e2', none:'var(--g100)', manual:'#EEF4FF' }

    document.getElementById('modal-root').innerHTML = `
    <div class="modal-overlay" onclick="if(event.target===this)this.remove()">
      <div class="modal" style="max-width:760px">
        <div class="modal-header">
          <span class="modal-title">📄 Exam Answers — AI Graded</span>
          <button class="modal-close" onclick="document.querySelector('.modal-overlay').remove()">✕</button>
        </div>
        <div style="padding:12px 24px;background:#f5f3ff;border-bottom:1px solid #e9d5ff;font-size:13px;color:#7c3aed;display:flex;align-items:center;gap:8px">
          🤖 <strong>AI Auto-Grading:</strong> Text answers graded by Claude AI against the model answer. Matching & MCQ graded automatically. You can override any answer below.
          <span style="margin-left:auto;font-weight:700">Total: ${attempt.score ?? '—'}% ${attempt.status==='pending_review'?'⏳ Pending review':attempt.status==='graded'?'✅ Graded':''}</span>
        </div>
        <div class="modal-body" style="max-height:70vh;overflow-y:auto">
          ${questions.map((q,i) => {
            const userAns = answers[q.id] || ''
            const correctAns = q.correct_answer || ''
            const fb = aiFeedback[q.id] || answer_map?.[q.id] || {}
            const marksAwarded = fb.marks_awarded ?? answer_map?.[q.id]?.marks_awarded
            const aiFeedbackText = fb.feedback || answer_map?.[q.id]?.ai_feedback || ''
            const conf = fb.confidence || answer_map?.[q.id]?.ai_confidence || 'none'
            const isPending = marksAwarded === null || marksAwarded === undefined

            // MCQ/matching correctness
            let autoResult = ''
            if(q.type === 'multiple_choice' || q.type === 'multiple_select'){
              const isCorrect = marksAwarded === q.marks
              autoResult = correctAns ? `<div style="font-size:12px;margin-top:6px;color:${isCorrect?'var(--green)':'var(--red)'}">
                ${isCorrect?'✅ Correct':'❌ Incorrect'} — Correct: ${correctAns}</div>` : ''
            } else if(q.type === 'matching' && q.pairs?.length){
              const userParts = (userAns||'').split('||')
              autoResult = '<div style="margin-top:8px">' + q.pairs.map((p,pi)=>{
                const given = (userParts[pi]||'').trim()
                const ok = given.toLowerCase() === p.answer.trim().toLowerCase()
                return `<div style="font-size:12px;display:flex;gap:8px;margin-top:3px">
                  <span style="font-weight:600">${p.term}:</span>
                  <span style="color:${ok?'var(--green)':'var(--red)'}">${given||'(blank)'} ${ok?'✅':'❌'}</span>
                  ${!ok?'<span style="color:var(--g400)">→ '+p.answer+'</span>':''}
                </div>`
              }).join('') + '</div>'
            }

            return `
          <div style="padding:16px;border:1px solid ${isPending?'#fbbf24':'var(--g100)'};border-radius:10px;margin-bottom:12px;${isPending?'background:#fffbeb':''}">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
              <div style="font-size:13px;font-weight:700;color:var(--navy)">${i+1}. ${q.question}</div>
              <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;margin-left:12px">
                ${marksAwarded !== null && marksAwarded !== undefined
                  ? `<span style="background:${marksAwarded===q.marks?'#dcfce7':marksAwarded>0?'#fef9c3':'#fee2e2'};color:${marksAwarded===q.marks?'#166534':marksAwarded>0?'#854d0e':'#991b1b'};padding:3px 10px;border-radius:999px;font-weight:700;font-size:13px">${marksAwarded}/${q.marks}</span>`
                  : `<span style="background:#FEF3C7;color:#92400E;padding:3px 10px;border-radius:999px;font-weight:700;font-size:11px">⏳ Needs grading</span>`}
                ${conf !== 'none' ? `<span style="background:${confidenceBg[conf]||'var(--g100)'};color:${confidenceColor[conf]||'#6B6B80'};padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700">${conf==='manual'?'MANUAL':conf.toUpperCase()} CONFIDENCE</span>` : ''}
              </div>
            </div>
            <div style="font-size:11px;color:var(--g400);margin-bottom:8px">${q.type==='multiple_choice'?'🔘 MCQ':q.type==='multiple_select'?'☑️ Multi-select':q.type==='matching'?'🔗 Matching':'✍️ Written'} • ${q.marks} mark${q.marks>1?'s':''}</div>

            <div style="background:var(--sky);border-radius:6px;padding:10px;font-size:13px;margin-bottom:8px">
              <strong>Answer:</strong> ${userAns || '<em style="color:var(--g400)">Not answered</em>'}
            </div>

            ${autoResult}

            ${q.type === 'text' && q.model_answer ? `
            <div style="background:#f0fdf4;border-radius:6px;padding:10px;font-size:12px;margin-bottom:8px;border-left:3px solid var(--green)">
              <strong>Model Answer:</strong> ${q.model_answer}
            </div>` : ''}

            ${aiFeedbackText ? `
            <div style="background:#f5f3ff;border-radius:6px;padding:10px;font-size:12px;margin-bottom:8px;border-left:3px solid #7c3aed">
              <strong>🤖 AI Feedback:</strong> ${aiFeedbackText}
            </div>` : ''}

            ${q.type === 'text' ? `
            <div style="border-top:1px solid var(--g100);padding-top:10px;margin-top:8px">
              <div style="font-size:12px;font-weight:600;color:var(--navy);margin-bottom:6px">✏️ Manual Override</div>
              <div style="display:flex;gap:8px;align-items:flex-end;flex-wrap:wrap">
                <div>
                  <label style="font-size:11px;color:var(--g400)">Marks (0–${q.marks})</label>
                  <input type="number" id="manual-marks-${q.id}" min="0" max="${q.marks}" value="${marksAwarded ?? ''}"
                    style="width:70px;border:1px solid var(--g200);border-radius:6px;padding:6px 8px;font-size:13px"/>
                </div>
                <div style="flex:1;min-width:160px">
                  <label style="font-size:11px;color:var(--g400)">Feedback (optional)</label>
                  <input type="text" id="manual-feedback-${q.id}" placeholder="e.g. Good explanation but missed X"
                    style="width:100%;border:1px solid var(--g200);border-radius:6px;padding:6px 8px;font-size:13px"/>
                </div>
                <button class="btn btn-primary btn-sm" onclick="gradeAnswerManually('${attemptId}','${q.id}',${q.marks})">Save</button>
              </div>
            </div>` : ''}
          </div>`
          }).join('')}
        </div>
        <div class="modal-footer" style="justify-content:space-between">
          <button class="btn btn-ghost" style="background:#f5f3ff;color:#7c3aed;border-color:#7c3aed" onclick="aiReGradeAttempt('${attemptId}');document.querySelector('.modal-overlay').remove()">🤖 Re-run AI Grading</button>
          <button class="btn btn-ghost" onclick="document.querySelector('.modal-overlay').remove()">Close</button>
        </div>
      </div>
    </div>`
  }catch(e){ toast(e.message,'err') }
}


async function renderExam() {
  // Check tutor status first — only show exam if invited
  let tutorStatus = State.user?.tutor?.status || null
  if(!tutorStatus){
    try{ const me = await api('/auth/me'); tutorStatus = me?.tutor?.status || null }catch(e){}
  }

  if(tutorStatus !== 'written_exam'){
    render(dashWrap('exam', `
    <div style="max-width:480px;margin:80px auto;padding:24px;text-align:center">
      <div class="card" style="padding:40px">
        <div style="font-size:56px;margin-bottom:16px">🔒</div>
        <h2 style="font-size:20px;font-weight:800;color:var(--navy);margin-bottom:8px">No Exam Scheduled</h2>
        <p style="font-size:14px;color:var(--g400);margin-bottom:24px">You have not been invited to take a written exam yet. Admin will notify you when your exam is ready.</p>
        <div style="background:var(--sky);border-radius:10px;padding:16px;font-size:13px;color:var(--g600);margin-bottom:24px">
          <strong>Current status:</strong> ${(tutorStatus||'applicant').replace(/_/g,' ')}
        </div>
        <button class="btn btn-ghost" onclick="navigate('dashboard')">← Back to Dashboard</button>
      </div>
    </div>`))
    return
  }

  render(dashWrap('exam', `
  <div style="max-width:480px;margin:80px auto;padding:24px">
    <div class="card" style="padding:40px;text-align:center">
      <div style="font-size:48px;margin-bottom:16px">📝</div>
      <h2 style="font-size:22px;font-weight:800;color:var(--navy);margin-bottom:8px">Written Examination</h2>
      <p style="font-size:14px;color:var(--g400);margin-bottom:24px">Enter the exam access code provided by your admin to begin.</p>
      <div id="exam-code-err" class="form-error" style="display:none;margin-bottom:12px"></div>
      <input class="input" id="exam-code-input" placeholder="XXXXXXXX" style="text-align:center;font-size:20px;letter-spacing:4px;font-weight:700;text-transform:uppercase;margin-bottom:16px" maxlength="8" oninput="this.value=this.value.toUpperCase()" onkeydown="if(event.key==='Enter')startExamWithCode()"/>
      <button class="btn btn-primary btn-full" id="exam-start-btn" onclick="startExamWithCode()">Start Exam →</button>
      <p style="font-size:12px;color:var(--g400);margin-top:16px">⚠️ Once started the exam cannot be paused. Ensure you have uninterrupted time.</p>
    </div>
  </div>`))
}

async function startExamWithCode() {
  const code = document.getElementById('exam-code-input')?.value?.trim()
  const err  = document.getElementById('exam-code-err')
  const btn  = document.getElementById('exam-start-btn')
  if(!code || code.length < 4){
    if(err){ err.style.display='block'; err.textContent='Please enter your exam code' }
    return
  }
  if(btn){ btn.disabled=true; btn.textContent='Starting...' }
  try {
    const res = await api('/exam/start', { method: 'POST', body: JSON.stringify({ exam_code: code }) })
    window._examData = res
    if(res.resumed){
      launchExam(res)
    } else {
      showExamInstructions(res)
    }
  }catch(e){
    if(btn){ btn.disabled=false; btn.textContent='Start Exam →' }
    if(err){ err.style.display='block'; err.textContent=e.message }
  }
}

function showExamInstructions(res){
  const mins = Math.round(res.time_remaining_seconds / 60)
  const instructions = res.instructions || 'Please read carefully before starting'
  render(dashWrap('exam', `
  <div style="max-width:600px;margin:40px auto;padding:24px">
    <div class="card" style="padding:40px">
      <div style="text-align:center;margin-bottom:24px">
        <div style="font-size:48px;margin-bottom:12px">📋</div>
        <h2 style="font-size:22px;font-weight:800;color:var(--navy)">Exam Instructions</h2>
        <p style="font-size:14px;color:var(--g400);margin-top:6px">${instructions}</p>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:28px">
        <div style="display:flex;gap:12px;align-items:flex-start;padding:12px;background:var(--sky);border-radius:8px">
          <div style="font-size:20px;flex-shrink:0">⏱️</div>
          <div><div style="font-weight:700;color:var(--navy);font-size:14px">Time Limit</div>
          <div style="font-size:13px;color:var(--g600)">You have <strong>${mins} minutes</strong> to complete this exam. The timer starts when you click Begin.</div></div>
        </div>
        <div style="display:flex;gap:12px;align-items:flex-start;padding:12px;background:#FFF7ED;border-radius:8px">
          <div style="font-size:20px;flex-shrink:0">🖥️</div>
          <div><div style="font-weight:700;color:var(--navy);font-size:14px">Fullscreen Required</div>
          <div style="font-size:13px;color:var(--g600)">The exam runs in fullscreen mode. Exiting fullscreen more than <strong>1 time</strong> will automatically submit your exam.</div></div>
        </div>
        <div style="display:flex;gap:12px;align-items:flex-start;padding:12px;background:#FEF2F2;border-radius:8px">
          <div style="font-size:20px;flex-shrink:0">🚫</div>
          <div><div style="font-weight:700;color:var(--navy);font-size:14px">No Cheating</div>
          <div style="font-size:13px;color:var(--g600)">Tab switching, copy-paste, and right-click are disabled. All violations are recorded and sent to admin.</div></div>
        </div>
        <div style="display:flex;gap:12px;align-items:flex-start;padding:12px;background:#F0FDF4;border-radius:8px">
          <div style="font-size:20px;flex-shrink:0">💾</div>
          <div><div style="font-weight:700;color:var(--navy);font-size:14px">Auto Save</div>
          <div style="font-size:13px;color:var(--g600)">Your answers are saved automatically as you type. Your progress is safe.</div></div>
        </div>
        <div style="display:flex;gap:12px;align-items:flex-start;padding:12px;background:#EEF2FF;border-radius:8px">
          <div style="font-size:20px;flex-shrink:0">✅</div>
          <div><div style="font-weight:700;color:var(--navy);font-size:14px">Submission</div>
          <div style="font-size:13px;color:var(--g600)">Click Submit when done. The exam auto-submits when time runs out. You cannot change answers after submission.</div></div>
        </div>
      </div>
      <div style="background:#FEF3C7;border-radius:8px;padding:12px;margin-bottom:24px;font-size:13px;color:#92400E;text-align:center;font-weight:600">
        ⚠️ By clicking Begin you confirm you are ready and agree to the exam rules
      </div>
      <button class="btn btn-primary btn-full" style="font-size:16px;padding:14px" onclick="launchExam(window._examData)">
        Begin Exam →
      </button>
    </div>
  </div>`))
}

function launchExam(res){
  const { attempt_id, time_remaining_seconds, questions, answers } = res
  let timeLeft = time_remaining_seconds
  let examSubmitted = false
  let fullscreenExits = 0
  let currentPage = 0
  const questionsPerPage = 5
  const totalPages = Math.ceil(questions.length / questionsPerPage)

  function renderExamPageOnly(){
    const start = currentPage * questionsPerPage
    const end = start + questionsPerPage
    const pageQuestions = questions.slice(start, end)

    const mins = Math.floor(timeLeft / 60).toString().padStart(2,'0')
    const secs = (timeLeft % 60).toString().padStart(2,'0')

    render(dashWrap('exam', `
    <div style="max-width:800px;margin:0 auto;padding:24px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;padding:16px;background:var(--navy);border-radius:12px;color:#fff">
        <div>
          <div style="font-size:18px;font-weight:700">📝 Written Examination</div>
          <div style="font-size:12px;opacity:0.7;margin-top:2px">Answer all questions honestly. This exam is monitored.</div>
        </div>
        <div style="text-align:center">
          <div id="exam-timer" style="font-size:28px;font-weight:800;color:var(--gold)">${mins}:${secs}</div>
          <div style="font-size:11px;opacity:0.7">Time remaining</div>
        </div>
      </div>

      <div id="exam-warnings" style="display:none;margin-bottom:16px"></div>

      <div id="exam-progress" style="background:var(--g100);border-radius:999px;height:6px;margin-bottom:24px">
        <div id="exam-progress-bar" style="background:var(--blue);height:6px;border-radius:999px;width:0%;transition:width .3s"></div>
      </div>

      <div id="exam-questions">
        ${pageQuestions.map((q, i) => {
          const globalIndex = start + i
          return `
        <div class="card" style="padding:24px;margin-bottom:16px" id="qcard-${q.id}">
          <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:16px">
            <div style="background:var(--navy);color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0">${globalIndex+1}</div>
            <div style="font-size:15px;font-weight:600;color:var(--navy);line-height:1.5">${q.question}</div>
          </div>
          <div style="font-size:11px;color:var(--g400);margin-bottom:12px">${q.marks} mark${q.marks>1?'s':''} • ${q.type === 'multiple_choice' ? 'Multiple choice' : q.type === 'multiple_select' ? 'Select all that apply' : 'Written answer'}</div>
          ${q.type === 'multiple_choice' ? `
          <div style="display:flex;flex-direction:column;gap:10px">
            ${(q.options || []).map((opt, oi) => `
            <label style="display:flex;align-items:center;gap:10px;padding:12px 16px;border:2px solid var(--g100);border-radius:8px;cursor:pointer;transition:all .2s" id="opt-${q.id}-${oi}" onclick="selectMCQ('${q.id}','${opt}','${attempt_id}',${q.options.length},${oi})">
              <div style="width:20px;height:20px;border-radius:50%;border:2px solid var(--g300);display:flex;align-items:center;justify-content:center;flex-shrink:0" id="radio-${q.id}-${oi}"></div>
              <span style="font-size:14px">${opt}</span>
            </label>`).join('')}
          </div>` : q.type === 'multiple_select' ? `
          <div style="font-size:12px;color:var(--blue);margin-bottom:8px;font-weight:600">Select all that apply</div>
          <div style="display:flex;flex-direction:column;gap:10px">
            ${(q.options || []).map((opt, oi) => `
            <label style="display:flex;align-items:center;gap:10px;padding:12px 16px;border:2px solid var(--g100);border-radius:8px;cursor:pointer;transition:all .2s" id="opt-${q.id}-${oi}" onclick="toggleMSQ('${q.id}','${opt}','${attempt_id}',${oi})">
              <div style="width:20px;height:20px;border-radius:4px;border:2px solid var(--g300);display:flex;align-items:center;justify-content:center;flex-shrink:0" id="check-${q.id}-${oi}"></div>
              <span style="font-size:14px">${opt}</span>
            </label>`).join('')}
          </div>` : q.type === 'matching' ? `
          <div style="font-size:12px;color:var(--blue);margin-bottom:10px;font-weight:600">🔗 Match each term to its correct answer using the dropdown</div>
          <div style="font-size:11px;color:var(--g400);margin-bottom:12px;background:#FFF7ED;padding:8px 12px;border-radius:6px">⚠️ Answers are hidden until you open each dropdown — this prevents screenshots</div>
          <div style="display:flex;flex-direction:column;gap:10px">
            ${(q.pairs || []).map((pair, pi) => {
              const shuffled = [...(q.pairs||[])].sort(()=>Math.random()-0.5)
              return `<div style="display:flex;align-items:center;gap:12px;padding:12px;border:1px solid var(--g100);border-radius:8px;background:var(--g50)">
                <div style="flex:1;font-size:14px;font-weight:600;color:var(--navy)">${pair.term}</div>
                <div style="font-size:14px;color:var(--g400)">→</div>
                <select id="match-${q.id}-${pi}" onchange="saveMatchAnswer('${q.id}','${attempt_id}',${(q.pairs||[]).length})"
                  style="flex:1;border:2px solid var(--g200);border-radius:8px;padding:8px 12px;font-size:14px;background:#fff;cursor:pointer;outline:none">
                  <option value="">— Select answer —</option>
                  ${shuffled.map(p => `<option value="${p.answer}">${p.answer}</option>`).join('')}
                </select>
              </div>`
            }).join('')}
          </div>` : `
          <textarea class="input" id="text-answer-${q.id}" rows="4" placeholder="Write your answer here..."
            oninput="saveTextAnswer('${q.id}','${attempt_id}')"
            style="width:100%;resize:vertical"></textarea>`}
        </div>`
        }).join('')}
      </div>

      <div style="display:flex;justify-content:space-between;margin-top:24px">
        <button class="btn btn-ghost" ${currentPage === 0 ? 'disabled' : ''} onclick="changePage(-1)">← Previous</button>
        <div style="font-size:14px;color:var(--g600)">Page ${currentPage + 1} of ${totalPages}</div>
        <button class="btn ${currentPage === totalPages - 1 ? 'btn-primary' : 'btn-ghost'}" onclick="${currentPage === totalPages - 1 ? `submitExam('${attempt_id}')` : 'changePage(1)'}">${currentPage === totalPages - 1 ? 'Submit Exam →' : 'Next →'}</button>
      </div>
    </div>`))

    // Restore saved answers if resumed
    if(answers && Object.keys(answers).length > 0){
      setTimeout(() => {
        pageQuestions.forEach(q => {
          const saved = answers[q.id]
          if(!saved) return
          if(q.type === 'text'){
            const ta = document.getElementById(`text-answer-${q.id}`)
            if(ta) ta.value = saved
          } else if(q.type === 'multiple_choice'){
            const idx = (q.options||[]).findIndex(o => o === saved)
            if(idx >= 0) selectMCQ(q.id, saved, attempt_id, q.options.length, idx)
          } else if(q.type === 'multiple_select'){
            const selected = saved.split(',').map(s => s.trim())
            selected.forEach(opt => {
              const idx = (q.options||[]).findIndex(o => o === opt)
              if(idx >= 0) toggleMSQ(q.id, opt, attempt_id, idx)
            })
          } else if(q.type === 'matching'){
            const parts = saved.split('||')
            parts.forEach((val, pi) => {
              const sel = document.getElementById(`match-${q.id}-${pi}`)
              if(sel && val) sel.value = val
            })
          }
        })
        updateExamProgress()
        if(window.MathJax) MathJax.typesetPromise()
      }, 300)
    }

    if(window._examTimerRunning) return  // guard: only start timer once
    window._examTimerRunning = true

    // Timer
    const timerEl = document.getElementById('exam-timer')
    const timerInterval = setInterval(() => {
      if(examSubmitted){ clearInterval(timerInterval); return }
      timeLeft--
      const m = Math.floor(timeLeft / 60).toString().padStart(2,'0')
      const s = (timeLeft % 60).toString().padStart(2,'0')
      if(timerEl) timerEl.textContent = `${m}:${s}`
      if(timerEl && timeLeft <= 300) timerEl.style.color = '#ef4444'
      if(timeLeft <= 0){
        clearInterval(timerInterval)
        submitExam(attempt_id, true)
        return
      }
    }, 1000)

    // Tab switch detection
    document.addEventListener('visibilitychange', function onVisChange(){
      if(examSubmitted){ document.removeEventListener('visibilitychange', onVisChange); return }
      if(document.hidden){
        api('/exam/report-cheating', { method:'POST', body: JSON.stringify({ attempt_id: attempt_id, type: 'tab_switch' }) })
        const warnings = document.getElementById('exam-warnings')
        if(warnings){
          warnings.style.display = 'block'
          warnings.innerHTML = '<div style="background:#FEF2E2;border:1px solid #F59E0B;border-radius:8px;padding:12px;font-size:13px;color:#92400E;text-align:center">⚠️ Tab switching detected. This has been recorded.</div>'
          setTimeout(() => { warnings.style.display = 'none' }, 3000)
        }
      }
    })

    // Fullscreen exit detection
    document.addEventListener('fullscreenchange', function onFSChange(){
      if(examSubmitted){ document.removeEventListener('fullscreenchange', onFSChange); return }
      if(!document.fullscreenElement){
        fullscreenExits++
        api('/exam/report-cheating', { method:'POST', body: JSON.stringify({ attempt_id: attempt_id, type: 'fullscreen_exit' }) })
        const warnings = document.getElementById('exam-warnings')
        if(warnings){
          warnings.style.display = 'block'
          warnings.innerHTML = `<div style="background:#FEE2E2;border:1px solid #EF4444;border-radius:8px;padding:12px;font-size:13px;color:#DC2626;text-align:center">🚫 Fullscreen exit detected (${fullscreenExits}/2). ${fullscreenExits >= 2 ? 'Exam will auto-submit.' : ''}</div>`
          setTimeout(() => { warnings.style.display = 'none' }, 3000)
        }
        if(fullscreenExits >= 2){
          submitExam(attempt_id, true)
        } else {
          // Re-enter fullscreen
          setTimeout(() => document.documentElement.requestFullscreen?.(), 1000)
        }
      }
    })

    // Disable right-click and copy-paste
    document.addEventListener('contextmenu', e => e.preventDefault())
    document.addEventListener('copy', e => e.preventDefault())
    document.addEventListener('paste', e => e.preventDefault())
    document.addEventListener('cut', e => e.preventDefault())
    document.addEventListener('selectstart', e => e.preventDefault())

    window.changePage = function(dir){
      currentPage += dir
      renderExamPageOnly()
    }
  }

  // Request fullscreen
  document.documentElement.requestFullscreen?.().catch(() => {})

  renderExamPageOnly()
}
function showExamWarning(msg){
  const el = document.getElementById('exam-warnings')
  if(!el) return
  el.style.display = 'block'
  el.innerHTML = `<div style="background:#FEF2F2;border:1px solid #FCA5A5;border-radius:8px;padding:12px;font-size:13px;color:#DC2626;font-weight:600">${msg}</div>`
  setTimeout(() => { el.style.display = 'none' }, 5000)
}

let _textSaveTimeout = {}
function saveTextAnswer(questionId, attemptId){
  clearTimeout(_textSaveTimeout[questionId])
  _textSaveTimeout[questionId] = setTimeout(async () => {
    const val = document.getElementById(`text-answer-${questionId}`)?.value
    if(val !== undefined){
      await api('/exam/save-answer', { method:'POST', body: JSON.stringify({ attempt_id: attemptId, question_id: questionId, answer: val }) })
      updateExamProgress()
    }
  }, 800)
}

function selectMCQ(questionId, answer, attemptId, totalOpts, selectedIdx){
  // Clear all options visually
  for(let i = 0; i < totalOpts; i++){
    const opt = document.getElementById(`opt-${questionId}-${i}`)
    const radio = document.getElementById(`radio-${questionId}-${i}`)
    if(opt){ opt.style.border = '2px solid var(--g100)'; opt.style.background = '' }
    if(radio){ radio.style.background = ''; radio.style.borderColor = 'var(--g300)'; radio.innerHTML = '' }
  }
  // Highlight selected
  const selOpt = document.getElementById(`opt-${questionId}-${selectedIdx}`)
  const selRadio = document.getElementById(`radio-${questionId}-${selectedIdx}`)
  if(selOpt){ selOpt.style.border = '2px solid var(--blue)'; selOpt.style.background = 'var(--sky)' }
  if(selRadio){ selRadio.style.background = 'var(--blue)'; selRadio.style.borderColor = 'var(--blue)'; selRadio.innerHTML = '<div style="width:8px;height:8px;border-radius:50%;background:#fff"></div>' }
  // Save answer
  api('/exam/save-answer', { method:'POST', body: JSON.stringify({ attempt_id: attemptId, question_id: questionId, answer }) })
  updateExamProgress()
}
const _msqSelected = {}
function toggleMSQ(questionId, option, attemptId, optIdx){
  if(!_msqSelected[questionId]) _msqSelected[questionId] = new Set()
  const sel = _msqSelected[questionId]
  const box  = document.getElementById(`check-${questionId}-${optIdx}`)
  const label = document.getElementById(`opt-${questionId}-${optIdx}`)

  if(sel.has(option)){
    sel.delete(option)
    if(box){ box.style.background=''; box.style.borderColor='var(--g300)'; box.innerHTML='' }
    if(label){ label.style.border='2px solid var(--g100)'; label.style.background='' }
  } else {
    sel.add(option)
    if(box){ box.style.background='var(--blue)'; box.style.borderColor='var(--blue)'; box.innerHTML='<div style="width:10px;height:6px;border-left:2px solid #fff;border-bottom:2px solid #fff;transform:rotate(-45deg);margin-top:-2px"></div>' }
    if(label){ label.style.border='2px solid var(--blue)'; label.style.background='var(--sky)' }
  }

  const answer = [...sel].join(',')
  api('/exam/save-answer', { method:'POST', body: JSON.stringify({ attempt_id: attemptId, question_id: questionId, answer }) })
  updateExamProgress()
}

function saveMatchAnswer(questionId, attemptId, totalPairs){
  const answers = []
  for(let i = 0; i < totalPairs; i++){
    const sel = document.getElementById(`match-${questionId}-${i}`)
    if(sel) answers.push(sel.value || '')
  }
  const answer = answers.join('||')
  api('/exam/save-answer', { method:'POST', body: JSON.stringify({ attempt_id: attemptId, question_id: questionId, answer }) })
  updateExamProgress()
}

function updateExamProgress(){
  if(!window._examData || !window._examData.questions) return
  const questions = window._examData.questions
  const answers = window._examData.answers || {}
  
  let answeredCount = 0
  questions.forEach(q => {
    const ans = answers[q.id]
    if(ans && ans.trim && ans.trim()) answeredCount++
    else if(ans && typeof ans === 'string' && ans.length > 0) answeredCount++
  })
  
  const bar = document.getElementById('exam-progress-bar')
  if(bar) bar.style.width = `${(answeredCount / questions.length * 100)}%`
}

async function submitExam(attemptId, autoSubmit = false){
  if(!autoSubmit && !confirm('Are you sure you want to submit your exam? You cannot change your answers after submission.')) return
  try{
    window.examSubmitted = true
    // Exit fullscreen safely
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {})
    }
    const res = await api('/exam/submit', { method:'POST', body: JSON.stringify({ attempt_id: attemptId, auto_submitted: autoSubmit }) })
    console.log('Submit response:', res)
    if(!res) throw new Error('No response from server')
    render(dashWrap('exam', `
    <div style="max-width:600px;margin:0 auto;padding:48px 24px;text-align:center">
      <div style="font-size:64px;margin-bottom:16px">🎉</div>
      <h1 style="font-size:28px;font-weight:800;color:var(--navy);margin-bottom:8px">Exam Submitted!</h1>
      <p style="font-size:15px;color:var(--g400);margin-bottom:24px">Your answers have been recorded. The admin will review your text answers and notify you of your final result.</p>
      <div style="background:var(--sky);border-radius:12px;padding:24px;margin-bottom:24px">
        <div style="font-size:13px;color:var(--g400);margin-bottom:4px">Multiple choice score</div>
        <div style="font-size:48px;font-weight:800;color:var(--navy)">${res.score ?? 0}%</div>
        <div style="font-size:13px;color:var(--g400);margin-top:4px">${res.earned_marks ?? 0} / ${res.total_marks ?? 0} marks from multiple choice</div>
      </div>
      <p style="font-size:13px;color:var(--g400)">Your written answers will be reviewed by admin. Final score and next steps will be communicated via email.</p>
      <button class="btn btn-primary" style="margin-top:24px" onclick="navigate('dashboard')">Back to Dashboard →</button>
    </div>`))
  }catch(e){ toast(e.message,'err') }
}

    function openTutorLabDirect(){
  window._wbInstitutionName = '';
  window._isLabHost = true;
  const sessionId = 'tutor_' + State.user.id + '_' + Date.now();
  window._currentTutorLabSessionId = sessionId;
  renderWhiteboard(sessionId);
}
function openTutorLabShareModal(){
  document.getElementById('modal-root').innerHTML = `
  <div class="modal-overlay" onclick="if(event.target===this)this.remove()">
    <div class="modal" style="max-width:480px">
      <div class="modal-header"><span class="modal-title">🔗 Share Lab Link with Student</span><button class="modal-close" onclick="document.querySelector('.modal-overlay').remove()">✕</button></div>
      <div class="modal-body">
        <p style="font-size:13px;color:var(--g600);margin-bottom:12px">Generate a secure, time-limited link for your student to join the live lab session.</p>
        <div class="form-group">
          <label class="form-label">Student Name</label>
          <input class="input" id="share-student-name" placeholder="e.g. Jean Paul" />
        </div>
        <div class="form-group">
          <label class="form-label">Session Duration</label>
          <select class="input" id="share-duration">
            <option value="1">1 hour</option>
            <option value="2">2 hours</option>
            <option value="3" selected>3 hours</option>
            <option value="8">Full day (8 hours)</option>
          </select>
        </div>
        <div id="share-link-result" style="display:none;margin-top:12px;background:var(--sky);border-radius:10px;padding:14px">
          <p style="font-size:12px;font-weight:700;color:var(--navy);margin-bottom:6px">✅ Share this link with your student:</p>
          <div style="display:flex;gap:8px;align-items:center">
            <input class="input" id="share-link-output" readonly style="font-size:12px;background:#fff;flex:1;">
            <button class="btn btn-sm btn-primary" onclick="navigator.clipboard.writeText(document.getElementById('share-link-output').value);toast('Link copied! 📋')">📋 Copy</button>
          </div>
          <p style="font-size:11px;color:var(--g600);margin-top:6px">The student opens this link to join your live lab session in real-time.</p>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="document.querySelector('.modal-overlay').remove()">Close</button>
        <button class="btn btn-primary" id="share-gen-btn" onclick="generateTutorStudentLabLink()">🔗 Generate Link</button>
      </div>
    </div>
  </div>`;
}

async function generateTutorStudentLabLink(){
  const name = document.getElementById('share-student-name')?.value?.trim() || 'Student';
  const hours = parseInt(document.getElementById('share-duration')?.value || '3');
  const btn = document.getElementById('share-gen-btn');
  if(btn){ btn.disabled = true; btn.textContent = '⏳ Generating...'; }
  try{
    // Use the current tutor's active lab session ID so both sides share the same Supabase channel
    const sessionId = window._currentTutorLabSessionId || ('tutor_' + State.user.id + '_' + Date.now());
    const result = await api('/lab/tokens', {
      method: 'POST',
      body: JSON.stringify({ buyer_name: name, hours, session_id: sessionId })
    });
    const link = window.location.origin + '/lab/' + result.token;
    document.getElementById('share-link-output').value = link;
    document.getElementById('share-link-result').style.display = 'block';
    // Also open the lab now if not already open, using the same session ID
    if(!window.wbInstance){
      window._wbInstitutionName = '';
      window._isLabHost = true;
      window._currentTutorLabSessionId = sessionId;
      renderWhiteboard(sessionId);
    }
    toast('Link generated! Share it with your student. ✅');
  }catch(e){
    toast(e.message, 'err');
  }finally{
    if(btn){ btn.disabled = false; btn.textContent = '🔗 Generate Link'; }
  }
}
async function renderTutorDash() {
      render(dashWrap('dashboard', `<div class="loader-center"><div class="spinner"></div></div>`))
      try {
        const [me, sessions] = await Promise.allSettled([api('/auth/me'), api('/sessions/my')])
        const u = me.value || State.user
        const sess = sessions.value || []
        const tutor = u.tutor || {}
        const upcoming = sess.filter(s => ['scheduled', 'pending'].includes(s.status)).slice(0, 5)
        render(dashWrap('dashboard', `
    <div class="page-header">
      <div>
        <h1 class="page-title">Hello, ${u.full_name?.split(' ')[0]}!</h1>
        <p class="page-subtitle">Your teaching dashboard</p>
      </div>
      ${statusBadge(tutor.status || 'applicant')}
    </div>
    ${tutor.status !== 'approved' ? `<div class="alert-warn"><i data-lucide="hourglass" style="width:16px;height:16px;margin-right:6px"></i> Your application status is <strong>${tutor.status?.replace(/_/g, ' ') || 'applicant'}</strong>. You'll be notified when approved to start teaching.</div>` : ''}
    <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:24px">
      <div class="card" style="flex:1;min-width:130px;padding:18px;display:flex;align-items:center;gap:12px">
        <div class="stat-icon" style="background:#EEF2FF;color:var(--blue);flex-shrink:0"><i data-lucide="calendar"></i></div>
        <div><div class="stat-num">${upcoming.length}</div><div class="stat-label">Upcoming</div></div>
      </div>
      <div class="card" style="flex:1;min-width:130px;padding:18px;display:flex;align-items:center;gap:12px">
        <div class="stat-icon" style="background:#F0FDF4;color:var(--green);flex-shrink:0"><i data-lucide="check-circle"></i></div>
        <div><div class="stat-num">${sess.filter(s=>s.status==='completed').length}</div><div class="stat-label">Completed</div></div>
      </div>
      <div class="card" style="flex:1;min-width:130px;padding:18px;display:flex;align-items:center;gap:12px">
        <div class="stat-icon" style="background:#FFF7ED;color:var(--orange);flex-shrink:0"><i data-lucide="star"></i></div>
        <div><div class="stat-num">${(tutor.rating||0).toFixed(1)}</div><div class="stat-label">Avg Rating</div></div>
      </div>
      <div class="card" style="flex:1;min-width:130px;padding:18px;display:flex;align-items:center;gap:12px">
        <div class="stat-icon" style="background:#F0FDF4;color:var(--green);flex-shrink:0"><i data-lucide="banknote"></i></div>
        <div><div class="stat-num" style="font-size:16px">${tutor.salary_amount ? '$'+tutor.salary_amount+'/'+(tutor.salary_frequency||'hr') : tutor.hourly_rate ? '$'+tutor.hourly_rate+'/hr' : '—'}</div><div class="stat-label">Salary</div></div>
      </div>
    </div>
    <div class="card" style="padding:24px;margin-bottom:24px">
      <div style="display:flex;align-items:center;gap:18px">
        ${avi(u.full_name || 'T', 60)}
        <div>
          <div style="font-size:18px;font-weight:700;color:var(--navy)">${u.full_name}</div>
          <div style="font-size:13px;color:var(--g400);margin-top:3px">${tutor.qualification || '—'}</div>
          <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap">${(tutor.subjects || []).slice(0, 4).map(s => `<span class="badge badge-blue">${s}</span>`).join('')}
          </div>
          ${!tutor.bio || tutor.bio.length < 200 ? `<div style="margin-top:8px;font-size:12px;color:var(--orange)">⚠️ Please complete your bio on your <a href="#" onclick="navigate('profile')" style="color:var(--blue)">Profile page</a></div>` : ''}
        </div>
      
        <button class="btn btn-ghost btn-sm" style="margin-left:auto" onclick="navigate('profile')">Edit Profile</button>
      </div>
    </div>
    <div class="card" style="padding:24px;margin-top:24px">
      <h3 style="font-size:16px;font-weight:700;color:var(--navy);margin-bottom:16px;display:flex;align-items:center;gap:6px"><i data-lucide="banknote" style="width:18px;height:18px;color:var(--blue)"></i> Salary & Payment</h3>
      ${tutor.salary_amount || tutor.hourly_rate ? `
      <div style="background:#f0fdf4;border-radius:10px;padding:16px;margin-bottom:16px">
        <div style="font-size:22px;font-weight:800;color:var(--green)">$${tutor.salary_amount||tutor.hourly_rate} <span style="font-size:14px;font-weight:500">/ ${tutor.salary_frequency||'hr'}</span></div>
        <div style="font-size:12px;color:var(--g400);margin-top:4px">Agreed salary — set by admin after contract signing</div>
      </div>` : `
      <div style="background:#FFF7ED;border-radius:8px;padding:12px;margin-bottom:16px;font-size:13px;color:var(--orange)">⏳ Salary not set yet. Admin will update after contract signing.</div>`}
      <div style="font-weight:700;font-size:13px;color:var(--g600);margin-bottom:12px">YOUR PAYMENT PREFERENCE</div>
      <div class="form-group">
        <label class="form-label">Payment Method</label>
        <select class="input" id="t-pay-method" onchange="togglePaymentDetails()">
          <option value="">— Select method —</option>
          <option value="mtn_momo" ${tutor.payment_method==='mtn_momo'?'selected':''}>MTN Mobile Money</option>
          <option value="airtel" ${tutor.payment_method==='airtel'?'selected':''}>Airtel Money</option>
          <option value="bank" ${tutor.payment_method==='bank'?'selected':''}>Bank Transfer</option>
        </select>
      </div>
      <div class="form-group" id="pay-details-wrap">
        <label class="form-label" id="pay-details-label">Mobile Number / Account Details</label>
        <input class="input" id="t-pay-details" placeholder="e.g. 078XXXXXXX or Account number" value="${tutor.payment_details||''}"/>
      </div>
      <button class="btn btn-primary btn-sm" onclick="savePaymentPreference()">Save Payment Preference 💾</button>
    </div>
    <div class="card" style="padding:24px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
        <h3 style="font-size:16px;font-weight:700;color:var(--navy);display:flex;align-items:center;gap:6px"><i data-lucide="calendar-clock" style="width:18px;height:18px;color:var(--blue)"></i> Upcoming Sessions</h3>
        <button class="btn btn-ghost btn-sm" onclick="navigate('sessions')">View all →</button>
      </div>
      ${upcoming.length ? `
      <div style="display:flex;flex-direction:column;gap:10px">
        ${upcoming.map(s => `
        <div style="display:flex;align-items:center;gap:14px;padding:14px;border:1px solid var(--g100);border-radius:var(--rs)">
          ${avi(s.students?.profiles?.full_name || 'S', 38)}
          <div style="flex:1;min-width:0">
            <div style="font-weight:700;color:var(--navy)">${s.students?.profiles?.full_name || 'Student'} — ${s.subject}</div>
            <div style="font-size:12px;color:var(--g400)">${fmt(s.scheduled_at)} • ${s.duration_mins} mins</div>
          </div>
          <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end">
            ${statusBadge(s.status)}
            <button class="btn btn-primary btn-sm" onclick="renderWhiteboard('${s.id}')" style="font-size:11px;">🚀 Start Session</button>
          </div>
        </div>`).join('')}
      </div>` : `<div class="empty-state"><div class="empty-icon" style="color:var(--g400)"><i data-lucide="calendar" style="width:48px;height:48px;stroke-width:1.5"></i></div><div class="empty-title">No upcoming sessions</div></div>`}
    </div>
    <div class="card" style="padding:24px;margin-top:24px;background:linear-gradient(135deg,#0D1B40 0%,#1A3060 100%);">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
        <div>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
            <div style="background:rgba(255,255,255,0.1);padding:6px;border-radius:8px;display:flex;align-items:center;justify-content:center"><i data-lucide="flask-conical" style="width:24px;height:24px;color:#F5A623"></i></div>
            <h3 style="font-size:17px;font-weight:900;color:#fff;letter-spacing:0.5px">STEM Majestic Lab</h3>
            <span style="background:#F5A623;color:#0D1B40;font-size:10px;font-weight:900;padding:2px 8px;border-radius:99px">TUTOR · HOST</span>
          </div>
          <p style="font-size:12px;color:rgba(255,255,255,0.65);max-width:380px">Open the full interactive lab — whiteboard, formulas, shapes, rulers, graph tools and more. Great for home sessions, online prep, or independent tutoring.</p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-sm" onclick="openTutorLabDirect()" style="background:#F5A623;color:#0D1B40;font-weight:800;">🚀 Open Lab Now</button>
          <button class="btn btn-sm" onclick="openTutorLabShareModal()" style="background:rgba(255,255,255,0.12);color:#fff;border:1px solid rgba(255,255,255,0.25);">🔗 Share Student Link</button>
        </div>
      </div>
    </div>
<div class="card" style="padding:24px;margin-top:24px">
      <h3 style="font-size:16px;font-weight:700;color:var(--navy);margin-bottom:16px;display:flex;align-items:center;gap:6px"><i data-lucide="file-text" style="width:18px;height:18px;color:var(--blue)"></i> Documents & CV</h3>
      <p style="font-size:13px;color:var(--g400);margin-bottom:16px">Upload your CV and certificates for admin review.</p>
      <div style="display:flex;flex-direction:column;gap:12px">
        <div>
          <label class="form-label">CV / Resume</label>
          <input type="file" id="cv-upload" accept=".pdf,.doc,.docx" class="input" style="padding:8px"/>
        </div>
        <div>
          <label class="form-label">Certificates (optional)</label>
          <input type="file" id="cert-upload" accept=".pdf,.jpg,.png" multiple class="input" style="padding:8px"/>
        </div>
        <button class="btn btn-primary" style="width:fit-content" onclick="uploadTutorDocs()">Upload Documents ⬆️</button>
        ${tutor.cv_url ? `<div style="margin-top:8px;font-size:13px">✅ CV on file: <a href="${tutor.cv_url}" target="_blank" style="color:var(--blue)">View uploaded CV</a></div>` : '<div style="font-size:13px;color:var(--orange)">⚠️ No CV uploaded yet</div>'}
      </div>
    </div>
    `))
      } catch (e) {
        toast(e.message, 'err')
      }
    }

    // ════════════════════════════════════════════════════════════
    // ADMIN DASHBOARD
    // ════════════════════════════════════════════════════════════
    function openContactReply(id, name, email, subject){
  const modalRoot = document.getElementById('modal-root') || document.createElement('div')
  if(!document.getElementById('modal-root')){
    modalRoot.id = 'modal-root'
    document.body.appendChild(modalRoot)
  }
  modalRoot.innerHTML = `
  <div class="modal-overlay" onclick="if(event.target===this)this.remove()">
    <div class="modal">
      <div class="modal-header">
        <span class="modal-title" style="display:flex;align-items:center;gap:8px"><i data-lucide="mail" style="width:20px;height:20px"></i> Reply to ${name}</span>
        <button class="modal-close" onclick="document.querySelector('.modal-overlay').remove()">✕</button>
      </div>
      <div class="modal-body">
        <div style="background:var(--sky);border-radius:8px;padding:12px;margin-bottom:16px;font-size:13px">
          <div><strong>To:</strong> ${name} (${email})</div>
          <div><strong>Subject:</strong> Re: ${subject}</div>
        </div>
        <div class="form-group">
          <label class="form-label">Your Reply</label>
          <textarea class="input" id="reply-content" rows="6" placeholder="Type your reply here..."></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="document.querySelector('.modal-overlay').remove()">Cancel</button>
        <button class="btn btn-primary" onclick="sendContactReply('${id}','${email}','${name}','${subject.replace(/'/g,"\\'")}')">Send Reply ✉️</button>
      </div>
    </div>
  </div>`
}

async function sendContactReply(id, email, name, subject){
  const content = document.getElementById('reply-content')?.value?.trim()
  if(!content){ toast('Please write a reply','err'); return }
  try{
    await api('/auth/contact-reply', {
      method: 'POST',
      body: JSON.stringify({ id, email, name, subject, message: content })
    })
    document.querySelector('.modal-overlay')?.remove()
    toast('Reply sent! ✅')
    renderAdminDash()
  }catch(e){
    toast(e.message,'err')
  }
}
async function deleteContactMessage(id){
  if(!confirm('Delete this message?')) return
  try{
    await api(`/auth/contact-messages/${id}`, { method: 'DELETE' })
    toast('Message deleted ✅')
    renderAdminDash()
  }catch(e){
    toast(e.message,'err')
  }
}
async function toggleRecruiting(){
  const btn = document.getElementById('recruiting-toggle-btn')
  const current = btn?.dataset.recruiting === 'true'
  try{
    await api('/auth/settings/recruiting', {
      method: 'PATCH',
      body: JSON.stringify({ is_recruiting: !current })
    })
    btn.dataset.recruiting = (!current).toString()
    btn.textContent = !current ? '🟢 Recruiting ON' : '🔴 Recruiting OFF'
    btn.style.color = !current ? 'var(--green)' : 'var(--red)'
    toast(!current ? 'Tutor recruiting is now ON ✅' : 'Tutor recruiting is now OFF 🔴')
  }catch(e){
    toast(e.message,'err')
  }
}

async function toggleQuiz(){
  const btn = document.getElementById('quiz-toggle-btn')
  const current = btn?.dataset.quiz === 'true'
  try{
    await api('/auth/settings/quiz', {
      method: 'PATCH',
      body: JSON.stringify({ quiz_enabled: !current })
    })
    btn.dataset.quiz = (!current).toString()
    btn.textContent = !current ? '🟢 Quiz ON' : '🔴 Quiz OFF'
    btn.style.color = !current ? 'var(--green)' : 'var(--red)'
    toast(!current ? 'AI Quiz is now enabled ✅' : 'AI Quiz is now disabled 🔴')
  }catch(e){
    toast(e.message,'err')
  }
}
    async function renderAdminDash() {
  render(dashWrap('dashboard', `<div class="loader-center"><div class="spinner"></div></div>`))
  try {
    const [tutors, students, sessions, payments] = await Promise.allSettled([
      api('/tutors/admin/all'), api('/students/admin/all'),
      api('/sessions/admin/all'), api('/payments/summary/admin')
    ])
    const T = tutors.value || []; const S = students.value || []
    const SE = sessions.value || []; const P = payments.value || {}
    let CM = []
    try{ CM = await api('/auth/contact-messages') }catch(e){}
    const pending = T.filter(t => ['applicant', 'under_review', 'written_exam', 'interview'].includes(t.status))
    render(dashWrap('dashboard', `
    <div class="page-header">
      <div><h1 class="page-title">Admin Dashboard</h1><p class="page-subtitle">Platform overview & management</p></div>
      <div style="display:flex;align-items:center;gap:16px">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:13px;color:var(--g400)">Recruiting:</span>
          <button id="recruiting-toggle-btn" class="btn btn-ghost btn-sm" onclick="toggleRecruiting()">Loading...</button>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:13px;color:var(--g400)">AI Quiz:</span>
          <button id="quiz-toggle-btn" class="btn btn-ghost btn-sm" onclick="toggleQuiz()">Loading...</button>
        </div>
      </div>
    </div>
    ${pending.length ? `<div class="alert-warn">📋 <strong>${pending.length} tutor application(s)</strong> awaiting review. <button class="btn btn-ghost btn-sm" style="margin-left:8px" onclick="navigate('admin-tutors')">Review now →</button></div>` : ''}
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-icon" style="background:#EEF2FF;color:var(--blue)"><i data-lucide="users"></i></div><div><div class="stat-num">${T.filter(t => t.status === 'approved').length}</div><div class="stat-label">Active Tutors</div><div class="stat-delta" style="color:var(--orange)">${pending.length} pending</div></div></div>
      <div class="stat-card"><div class="stat-icon" style="background:#F0FDF4;color:var(--green)"><i data-lucide="graduation-cap"></i></div><div><div class="stat-num">${S.length}</div><div class="stat-label">Students</div></div></div>
      <div class="stat-card"><div class="stat-icon" style="background:#FFF7ED;color:var(--orange)"><i data-lucide="calendar"></i></div><div><div class="stat-num">${SE.filter(s => ['scheduled', 'pending'].includes(s.status)).length}</div><div class="stat-label">Upcoming Sessions</div></div></div>
      <div class="stat-card"><div class="stat-icon" style="background:#F0FDF4;color:var(--green)"><i data-lucide="banknote"></i></div><div><div class="stat-num">$${(P.total_revenue || 0).toFixed(0)}</div><div class="stat-label">Total Revenue</div></div></div>
    </div>
    <div class="grid-2" style="margin-bottom:24px">
      <div class="card" style="padding:24px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
          <h3 style="font-size:15px;font-weight:700;color:var(--navy)">Recent Applications</h3>
          <button class="btn btn-ghost btn-sm" onclick="navigate('admin-tutors')">View all →</button>
        </div>
        ${pending.slice(0, 4).map(t => `
        <div style="display:flex;align-items:center;gap:11px;padding:11px 0;border-bottom:1px solid var(--g100)">
          ${avi(t.profiles?.full_name || 'T', 36)}
          <div style="flex:1;min-width:0"><div style="font-weight:600;font-size:13px;color:var(--navy)">${t.profiles?.full_name || '—'}</div><div style="font-size:11px;color:var(--g400)">${(t.subjects || []).slice(0, 2).join(', ')}</div></div>
          ${statusBadge(t.status)}
        </div>`).join('') || `<div class="empty-state" style="padding:20px"><div class="empty-sub">No pending applications</div></div>`}
      </div>
      <div class="card" style="padding:24px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
          <h3 style="font-size:15px;font-weight:700;color:var(--navy)">Recent Sessions</h3>
          <button class="btn btn-ghost btn-sm" onclick="navigate('admin-sessions')">View all →</button>
        </div>
        ${SE.slice(0, 4).map(s => `
        <div style="display:flex;align-items:center;gap:11px;padding:11px 0;border-bottom:1px solid var(--g100)">
          <div style="width:36px;height:36px;background:var(--sky);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px">📖</div>
          <div style="flex:1;min-width:0"><div style="font-weight:600;font-size:13px;color:var(--navy)">${s.subject}</div><div style="font-size:11px;color:var(--g400)">${fmtShort(s.scheduled_at)}</div></div>
          ${statusBadge(s.status)}
        </div>`).join('') || `<div class="empty-state" style="padding:20px"><div class="empty-sub">No sessions yet</div></div>`}
      </div>
    </div>
    <!-- Institution License Manager -->
    <div class="card" style="padding:24px;margin-bottom:24px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px">
        <div><h3 style="font-size:16px;font-weight:700;color:var(--navy)">🏫 Institution Licenses</h3>
        <p style="font-size:12px;color:var(--g400);margin-top:3px">Manage schools & universities. Each license = 1 concurrent Lab session.</p></div>
        <button class="btn btn-primary btn-sm" onclick="openAddInstitutionModal()">+ Add Institution</button>
      </div>
      <div id="institution-list"><div style="font-size:13px;color:var(--g400);text-align:center;padding:16px">Loading...</div></div>
    </div>
    <!-- Majestic Lab Access Manager -->
    <div class="card" style="padding:24px;margin-bottom:24px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px">
        <div><h3 style="font-size:16px;font-weight:700;color:var(--navy)">⚗️ Majestic Lab — Guest Access Links</h3>
        <p style="font-size:12px;color:var(--g400);margin-top:3px">Generate a time-limited Lab link for an independent tutor or external guest.</p></div>
        <button class="btn btn-primary btn-sm" onclick="openGenerateLabLinkModal()">+ Generate Link</button>
      </div>
      <div id="lab-links-list"><div style="font-size:13px;color:var(--g400);text-align:center;padding:16px">Click "+ Generate Link" to create a new access link.</div></div>
    </div>
    <!-- Contact Messages -->
    <div class="card" style="padding:24px;margin-bottom:24px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
        <h3 style="font-size:16px;font-weight:700;color:var(--navy);display:flex;align-items:center;gap:6px"><i data-lucide="mail" style="width:18px;height:18px;color:var(--blue)"></i> Contact Messages</h3>
      </div>
      <div id="contact-msgs-list"><div class="loader-center"><div class="spinner"></div></div></div>
    </div>
    `))

    // Load contact messages
    setTimeout(async ()=>{
      try{
        const msgs = await api('/auth/contact-messages')
        const el = document.getElementById('contact-msgs-list')
        if(el){
          el.innerHTML = msgs.length ? msgs.map(m=>`
          <div style="padding:12px;border:1px solid var(--g100);border-radius:8px;margin-bottom:8px;${!m.is_read?'background:var(--sky)':''}">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px">
              <div style="flex:1;min-width:0">
                <div style="font-weight:600;font-size:14px">${m.full_name} <span style="font-size:12px;color:var(--g400)">${m.email}</span></div>
                <div style="font-size:13px;font-weight:600;color:var(--navy);margin-top:2px">${m.subject}</div>
                <div style="font-size:12px;color:var(--g600);margin-top:4px">${m.message.slice(0,120)}${m.message.length>120?'...':''}</div>
              </div>
              <div style="display:flex;flex-direction:column;gap:6px;flex-shrink:0;margin-left:12px;align-items:flex-end">
                <div style="font-size:11px;color:var(--g400)">${fmtShort(m.created_at)}</div>
                <button class="btn btn-primary btn-sm" onclick="openContactReply('${m.id}','${m.full_name.replace(/'/g,"\\'")  }','${m.email}','${m.subject.replace(/'/g,"\\'")}')">Reply →</button>
                <button class="btn btn-ghost btn-sm" style="color:var(--red)" onclick="deleteContactMessage('${m.id}')"><i data-lucide="trash-2" style="width:16px;height:16px"></i> Delete</button>
              </div>
            </div>
          </div>`).join('') : '<div style="color:var(--g400);font-size:13px;text-align:center;padding:20px">No contact messages yet</div>'
        }
      }catch(e){}
    }, 500)
    // Load institution list
    renderInstitutionList();

    // Load recruiting + quiz status
  setTimeout(async ()=>{
    try{
      const [recRes, quizRes] = await Promise.all([
        fetch(API_URL + '/auth/settings/recruiting'),
        fetch(API_URL + '/auth/settings/quiz')
      ])
      const recData  = await recRes.json()
      const quizData = await quizRes.json()
      const recBtn  = document.getElementById('recruiting-toggle-btn')
      const quizBtn = document.getElementById('quiz-toggle-btn')
      if(recBtn){
        recBtn.dataset.recruiting = recData.is_recruiting.toString()
        recBtn.textContent = recData.is_recruiting ? '🟢 Recruiting ON' : '🔴 Recruiting OFF'
        recBtn.style.color = recData.is_recruiting ? 'var(--green)' : 'var(--red)'
      }
      if(quizBtn){
        quizBtn.dataset.quiz = quizData.quiz_enabled.toString()
        quizBtn.textContent = quizData.quiz_enabled ? '🟢 Quiz ON' : '🔴 Quiz OFF'
        quizBtn.style.color = quizData.quiz_enabled ? 'var(--green)' : 'var(--red)'
      }
    }catch(e){}
  }, 400)

  } catch (e) {
    toast(e.message, 'err')
  }
}