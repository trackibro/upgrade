function selTm(c){
    tCat=c;
    const l={gt:'Game Theory',bb:'Bug Bounty',yt:'YouTube'};
    document.getElementById('tmC').textContent=l[c];
}

function setM(m){
    tMd=m;
    tDr=m==='p'?1500:m==='l'?2700:0;
    rstTm();
}

function toggleWager() {
    if(tOn) return; 
    isWagerActive = !isWagerActive;
    updateWagerUI();
}

function updateWagerUI() {
    const el = document.getElementById('wgStatus');
    const box = document.getElementById('wagerToggle');
    if(isWagerActive) {
        el.innerHTML = '<span style="color:var(--r)">☑ WAGER ACTIVE (STAKES HIGH)</span>';
        box.style.borderColor = 'var(--r)';
        box.style.background = 'rgba(239,68,68,0.1)';
    } else {
        el.innerHTML = '☐ Wager 2% Probability';
        box.style.borderColor = 'var(--bd)';
        box.style.background = 'transparent';
    }
}

function togTm(){
    if(!tCat){alert('Select category');return}
    if(tOn){
        showTrapModal();
    } else {
        tOn=true;
        document.getElementById('tmB').textContent='⏸ Stop';
        document.getElementById('tmB').className='bt d';
        document.getElementById('wagerToggle').style.pointerEvents = 'none'; 
        
        tI = setInterval(() => {
            tS++; upTD();
            
            let marketTarget = tDr > 0 ? tDr * 0.95 : 3600; 
            let mPct = Math.min(100, (tS / marketTarget) * 100);
            document.getElementById('marketBar').style.width = mPct + '%';

            if(tMd!=='f' && tS>=tDr){
                clearInterval(tI); tOn=false;
                document.getElementById('tmB').textContent='▶ Start';
                document.getElementById('tmB').className='bt p';
                document.getElementById('wagerToggle').style.pointerEvents = 'auto';
                
                if(isWagerActive) {
                    D.wagerWins = (D.wagerWins || 0) + 1;
                    alert('SESSION SECURED. You beat the Market and survived the wager. +0.5% Probability.');
                } else {
                    alert('Session Complete. Log your volume.');
                }
                isWagerActive = false; updateWagerUI();
                logT(); 
            }
        }, 1000);
    }
}

function showTrapModal() {
    clearInterval(tI); 
    let trap = document.getElementById('trapModal');
    let title = document.getElementById('trapTitle');
    let desc = document.getElementById('trapDesc');
    let btn = document.getElementById('trapQuitBtn');

    let type = "TOURIST";
    if (tMd !== 'f') {
         if (tS >= tDr) type = "COMPETITIVE";
         else if (tS >= tDr * 0.8) type = "AVERAGE";
         else type = "TOURIST";
    } else {
         if(tS >= 5400) type = "COMPETITIVE";
         else if(tS >= 1800) type = "AVERAGE";
    }

    if(type === "COMPETITIVE") {
         title.textContent = "Session Complete";
         title.style.color = "var(--g)";
         desc.textContent = "You've put in solid competitive volume. You may exit safely without penalty.";
         btn.textContent = "Log Time & Exit";
    } else {
         title.textContent = "Mediocrity Trap Triggered";
         title.style.color = "var(--r)";
         desc.innerHTML = `Stopping now classifies this session volume as: <strong style="color:var(--r);font-size:14px">${type}</strong>.<br>90% of failures stop here because they get bored.<br>Are you sure you want to quit?` + 
         (isWagerActive ? `<br><br><strong style="color:var(--r)">CRITICAL: You will permanently lose your 2% Wager if you quit now!</strong>` : ``);
         btn.textContent = `Yes, I am ${type}`;
    }
    trap.classList.add('sh');
}

function trapResume() {
    document.getElementById('trapModal').classList.remove('sh');
    tI = setInterval(() => {
        tS++; upTD();
        let marketTarget = tDr > 0 ? tDr * 0.95 : 3600; 
        let mPct = Math.min(100, (tS / marketTarget) * 100);
        document.getElementById('marketBar').style.width = mPct + '%';

        if(tMd!=='f' && tS>=tDr){
            clearInterval(tI); tOn=false;
            document.getElementById('tmB').textContent='▶ Start';
            document.getElementById('tmB').className='bt p';
            document.getElementById('wagerToggle').style.pointerEvents = 'auto';
            if(isWagerActive) {
                D.wagerWins = (D.wagerWins || 0) + 1;
                alert('SESSION SECURED. You beat the Market and survived the wager. +0.5% Probability.');
            } else {
                alert('Session Complete. Log your volume.');
            }
            isWagerActive = false; updateWagerUI();
            logT(); 
        }
    }, 1000);
}

function trapQuit() {
    let failedWager = false;
    let wonWager = false;
    if (isWagerActive) {
        if (tMd !== 'f' && tS < tDr) failedWager = true;
        else if (tMd === 'f' && tS < 1800) failedWager = true; 
        else wonWager = true;
    }
    
    if(failedWager) {
        D.wagerLosses = (D.wagerLosses || 0) + 1;
        alert('WAGER LOST. 2% permanently deducted from your probability engine.');
    } else if (wonWager) {
        D.wagerWins = (D.wagerWins || 0) + 1;
        alert('SESSION SECURED. You survived the wager. +0.5% Probability.');
    }

    document.getElementById('trapModal').classList.remove('sh');
    tOn = false;
    document.getElementById('tmB').textContent='▶ Start';
    document.getElementById('tmB').className='bt p';
    document.getElementById('wagerToggle').style.pointerEvents = 'auto';
    isWagerActive = false; updateWagerUI();
    logT(); 
}

function rstTm(){
    clearInterval(tI);tOn=false;tS=0;upTD();
    document.getElementById('tmB').textContent='▶ Start';
    document.getElementById('tmB').className='bt p';
}

function upTD(){
    let d;
    if(tMd==='f'){
        const h=Math.floor(tS/3600),m=Math.floor(tS%3600/60),s=tS%60;
        d=String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
    } else {
        const r=Math.max(0,tDr-tS),m=Math.floor(r/60),s=r%60;
        d=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
    }
    document.getElementById('tmV').textContent=d;
}

function logT(){
    const m=Math.max(1,Math.round(tS/60));
    const dd=tdD();
    const k=tCat==='gt'?'gt':tCat==='bb'?'bb':'yt';
    dd.tm[k]=(dd.tm[k]||0)+m;D.tm[k]=(D.tm[k]||0)+m;
    tS=0;upTD();sv();upD();
}

function manL(){
    if(!tCat){alert('Select category first');return}
    const dd=tdD();
    const k=tCat==='gt'?'gt':tCat==='bb'?'bb':'yt';
    dd.tm[k]=(dd.tm[k]||0)+30;D.tm[k]=(D.tm[k]||0)+30;
    sv();upD();
}
