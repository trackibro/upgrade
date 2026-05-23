// =====================================================
// VAULT
// =====================================================
function addVault() {
    let inp = document.getElementById('vaultIdea');
    if(!inp.value.trim()) return;
    D.vault.push({t: inp.value.trim(), d: dn()});
    inp.value = '';
    sv(); upVault(); upD();
}

function upVault() {
    if(!document.getElementById('vCount')) return;
    document.getElementById('vCount').textContent = D.vault.length;
    let vL = document.getElementById('vaultList');
    vL.innerHTML = '';
    D.vault.forEach(v => {
        let unlockDay = v.d + 60;
        let daysLeft = Math.max(0, unlockDay - dn());
        vL.innerHTML += `<div class="vault-item"><div class="vi-lock">🔒</div><div class="vi-text">${v.t} (Q-Day ${v.d})</div><div class="vi-days">${daysLeft > 0 ? daysLeft + ' days until review' : '<span style="color:var(--g)">Reviewable</span>'}</div></div>`;
    });
}

// =====================================================
// GRAVEYARD
// =====================================================
function addGrave() {
    let gn = document.getElementById('gName');
    let gd = document.getElementById('gDays');
    if(!gn.value.trim() || !gd.value) return;
    D.grave.push({n: gn.value.trim(), d: parseInt(gd.value)});
    gn.value = ''; gd.value = '';
    sv(); upGrave();
}

function upGrave() {
    let gL = document.getElementById('graveList');
    if(!gL) return;
    gL.innerHTML = '';
    let totalD = dn();
    D.grave.forEach(g => {
        totalD += g.d;
        gL.innerHTML += `<div class="grave-item"><div class="gi-stone">🪦</div><div class="gi-info"><div class="gi-name">${g.n}</div><div class="gi-days">Lasted ${g.d} days</div></div></div>`;
    });
    let avg = Math.round(totalD / (D.grave.length + 1));
    document.getElementById('gAvg').textContent = avg;
    document.getElementById('gCurDays').textContent = `Day ${dn()}`;
    
    let mq = document.getElementById('qmGraveList');
    if(mq) mq.innerHTML = gL.innerHTML;
}

// =====================================================
// SPITE ENGINE
// =====================================================
function saveSpite() {
    D.spite.t = document.getElementById('spiteTarget').value.trim();
    D.spite.r = document.getElementById('spiteReason').value.trim();
    if(!D.spite.t) return;
    sv(); upD();
}

// =====================================================
// CONSTRAINTS IDENTIFIER
// =====================================================
function logConstraint() {
    let cCat = document.getElementById('consCat').value;
    let cTxt = document.getElementById('consText').value.trim();
    if(!cTxt) return;
    D.cons.push({d: td(), c: cCat, t: cTxt});
    document.getElementById('consText').value = '';
    sv(); renderCons();
}

function renderCons() {
    let cLog = document.getElementById('consLog');
    if(!cLog) return;
    cLog.innerHTML = '';
    D.cons.slice(-5).reverse().forEach(c => {
        cLog.innerHTML += `<div class="constraint-entry"><div class="ce-cat">${c.c}</div><div class="ce-text">${c.t}</div><div class="ce-date">${c.d}</div></div>`;
    });
    
    if(D.cons.length >= 5) {
        let cats = D.cons.slice(-7).map(c=>c.c);
        let counts = {}; cats.forEach(c=> counts[c] = (counts[c]||0)+1);
        let maxC = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
        if(counts[maxC] >= 3) {
            let cp = document.getElementById('constraintPattern');
            if(cp){
                cp.classList.remove('hide');
                cp.innerHTML = `<div class="cp-title">Constraint Pattern Detected</div><div class="cp-main">#1 Bottleneck: ${maxC.toUpperCase()}</div><div class="cp-detail">You've logged this ${counts[maxC]} times recently. Focus your systems on solving this single constraint before adding new tasks.</div>`;
            }
        }
    }
}

// =====================================================
// BOREDOM VACCINE & QUIT PARADOX
// =====================================================
function startBoredom() {
    let bp = document.getElementById('boredomPrompt');
    bp.innerHTML = '<div class="boredom-timer" id="bvTimer">120</div><div class="boredom-text" style="color:var(--w2)">Stare at the center. Do nothing. Let your dopamine baseline drop. Routine tasks will feel stimulating after this.</div>';
    let left = 120;
    let int = setInterval(() => {
        left--;
        let bvt = document.getElementById('bvTimer');
        if(bvt) bvt.textContent = left;
        if(left <= 0) {
            clearInterval(int);
            D.bv = td(); sv(); upD();
        }
    }, 1000);
}

function showQuitModal() {
    upGrave();
    if(D.spite && D.spite.t) document.getElementById('qmSpite').textContent = `Target [${D.spite.t}] gains +1 point.`;
    document.getElementById('quitModal').classList.add('sh');
    
    let btn = document.getElementById('qmConfBtn');
    btn.disabled = true;
    btn.textContent = 'Wait 10s...';
    setTimeout(() => { btn.disabled = false; btn.textContent = "Yes, I'm average"; }, 10000);
}

function refuseQuit() {
    D.qr = (D.qr || 0) + 1;
    sv(); upD();
    document.getElementById('quitModal').classList.remove('sh');
    alert("Resistance logged. Neural pathway reinforced. +1 to Resilence.");
}

function confirmQuit() {
    D.grave.push({n: "Black Swan (Quit)", d: dn()});
    D.start = null; 
    sv();
    location.reload();
}
