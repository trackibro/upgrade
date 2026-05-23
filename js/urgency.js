// =====================================================
// URGENCY ENGINE & ENTROPY CLOCK
// =====================================================
function calcEntropy(totalHours) {
    try {
        const safeD = window.D || {};
        let lastActMs = safeD.lastAct || Date.now();
        let hrsSince = (Date.now() - lastActMs) / 36e5;
        let stability = Math.max(2, totalHours * 0.4); 
        let retention = Math.exp(-hrsSince / stability);
        
        let pct = (retention * 100).toFixed(1);
        
        let ev = document.getElementById('entVal');
        if(ev) ev.textContent = pct + '%';
        
        let el = document.getElementById('entLoss');
        if(el) el.textContent = `-${(100 - pct).toFixed(1)}% lost since last practice`;
        
        let er = document.getElementById('entRate');
        if(er) er.textContent = `Decay rate: ${(100/stability).toFixed(2)}% / hr`;
    } catch(e) {}
}

function upUrg(){
    try {
        // 1. ULTRA-SAFE VARIABLE EXTRACTION (Prevents localStorage crashes)
        const safeD = window.D || {};
        const safeTm = safeD.tm || {};
        const safeYt = safeD.yt || {};
        
        let dy = 1, dL = 60, v = 0, md = 0;
        
        // Wrap global function calls in try/catch in case they fail internally
        try { dy = typeof dn === 'function' ? dn() : 1; } catch(e) {}
        try { dL = typeof dl === 'function' ? dl() : 60; } catch(e) {}
        try { v = typeof vel7 === 'function' ? vel7() : 0; } catch(e) {}
        try { md = typeof missedDays === 'function' ? missedDays() : 0; } catch(e) {}
        
        const bbH = (safeTm.bb || 0) / 60;
        const ups = Array.isArray(safeYt.up) ? safeYt.up.length : 0;

        // 2. Rest Budget
        if(document.getElementById('rbUsed')) {
            document.getElementById('rbUsed').textContent = (safeD.restUsed || 0) + ' Days';
            if(document.getElementById('rbPr')) {
                document.getElementById('rbPr').style.width = Math.min(100, ((safeD.restUsed || 0)/3)*100) + '%';
            }
        }

        // 3. Point of No Return
        const dailyBBActual = bbH / Math.max(1, dy - 1);
        const rate = Math.max(0.1, dailyBBActual); 
        const bbPONR = Math.round(Math.max(0, 200 - bbH) / rate);
        const ponrDay = Math.max(0, 60 - bbPONR);
        
        if(document.getElementById('ponrV')) {
            document.getElementById('ponrV').textContent = Math.max(0, ponrDay - dy + 1);
        }
        
        const ponrSub = document.getElementById('ponrSub');
        if(ponrSub) {
            if(dy > ponrDay) {
                ponrSub.textContent = '⚠ You may have passed the point of no return for finding a bug by Day 60 at your current practice rate. Increase daily BB hours immediately.';
            } else {
                ponrSub.textContent = 'After Day ' + ponrDay + ', finding a bug by Day 60 becomes mathematically unlikely at your current pace. You have ' + (ponrDay - dy) + ' days of margin.';
            }
        }

        // 4. Compound Vis
        const cv = document.getElementById('compoundVis');
        if(cv) {
            cv.innerHTML = '';
            for(let i = 1; i <= 60; i += 5){
                const val = Math.round((61 - i) * 0.5 + 10);
                const maxVal = 40;
                const pct = Math.round((val / maxVal) * 100);
                const isNow = (i <= dy && i + 5 > dy);
                const bg = isNow ? 'var(--a)' : (i < dy ? 'var(--w4)' : 'var(--g)');
                cv.innerHTML += `<div class="compound-row"><span class="cr-label">Day ${i}</span><div class="cr-bar"><div class="cr-fill" style="width:${pct}%;background:${bg}"></div></div><span class="cr-val">$${val}</span></div>`;
            }
        }

        // 5. Opportunity Cost Calculation
        if(document.getElementById('ocBB')) document.getElementById('ocBB').textContent = '~$' + Math.round(15 + v * 3);
        if(document.getElementById('ocYT')) document.getElementById('ocYT').textContent = '~$' + Math.round(5 + ups * 0.1);
        if(document.getElementById('ocSkip')) document.getElementById('ocSkip').textContent = '-$' + Math.round(20 + v * 4);
        if(document.getElementById('ocSkip3')) document.getElementById('ocSkip3').textContent = '-$' + Math.round(75 + v * 10);
        if(document.getElementById('ocSkip7')) document.getElementById('ocSkip7').textContent = '-$' + Math.round(200 + v * 20);
        if(document.getElementById('ocTotal')) document.getElementById('ocTotal').textContent = md > 0 ? '-$' + Math.round(md * 20) : '$0';
        
    } catch(err) {
        console.error('Urgency Engine Error handled:', err);
    }
}

// =====================================================
// ANTI-QUIT / SYSTEMS PANEL
// =====================================================
function saveCn(){
    try {
        const nEl = document.getElementById('cN');
        const wEl = document.getElementById('cW');
        const cEl = document.getElementById('cC');
        const iEl = document.getElementById('cI');
        
        if(!nEl || !wEl || !cEl || !iEl) return;
        
        const c = {
            n: nEl.value,
            w: wEl.value,
            c: cEl.value,
            i: iEl.value,
            d: typeof td === 'function' ? td() : new Date().toISOString().split('T')[0]
        };
        
        if(!c.n || !c.w){ alert('Fill name + goals'); return; }
        if(window.D) window.D.cn = c; 
        if(typeof sv === 'function') sv(); 
        upCn();
    } catch(e) {}
}

function upCn(){
    try {
        const cnF = document.getElementById('cnF');
        const cnS = document.getElementById('cnS');
        if(!window.D || !window.D.cn){
            if(cnF) cnF.style.display = 'block';
            if(cnS) cnS.classList.add('hide');
            return;
        }
        
        if(cnF) cnF.style.display = 'none';
        if(cnS) {
            cnS.classList.remove('hide');
            cnS.innerHTML = `<h4>Locked — ${window.D.cn.d}</h4><p>${window.D.cn.n}\n\nGoal: ${window.D.cn.w}\n\nCost of quitting: ${window.D.cn.c}\n\n"${window.D.cn.i}"</p>`;
        }
    } catch(e) {}
}
