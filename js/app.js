// Track leaving the tab
document.addEventListener("visibilitychange", () => {
    if (document.hidden && tOn && isWagerActive) {
        clearInterval(tI);
        tOn = false;
        D.wagerLosses = (D.wagerLosses || 0) + 1;
        sv();
        document.getElementById('tmB').textContent='▶ Start';
        document.getElementById('tmB').className='bt p';
        document.getElementById('wagerToggle').style.pointerEvents = 'auto';
        isWagerActive = false; updateWagerUI();
        upD();
        alert("CRITICAL FAILURE: You left the tab during an active Wager. 2% permanently deducted from your probability.");
    }
});

function start5(cat){
    selTm(cat);setM('f');tS=0;upTD();togTm();
    document.querySelector('.tm').scrollIntoView({behavior:'smooth',block:'center'});
}

document.querySelectorAll('.tk').forEach(t=>{
    t.addEventListener('click',()=>{
        const dd=tdD(),k=t.dataset.t;
        dd.tk[k]=dd.tk[k]?0:1;
        sv();upD();
    });
});

function saveN(){
    const notes = document.getElementById('notes').value;
    const pow = document.getElementById('powLink').value.trim();
    if(!pow && !notes.includes('[Proof of Work]')) {
        alert("You claim you worked? Prove it. Paste one unique thing you learned or a lab URL. Leave it blank if you're padding your stats like an amateur.");
        return;
    }
    let finalNotes = notes;
    if(pow) {
         finalNotes += '\n[Proof of Work]: ' + pow;
    }
    tdD().n = finalNotes;
    sv(); upD();
    document.getElementById('powLink').value = '';
    alert("Proof accepted. Volume logged.");
}

function savePC(){
    const pc={
        time:document.getElementById('pcTime').value,
        first:document.getElementById('pcFirst').value,
        obstacle:document.getElementById('pcObstacle').value
    };
    const tom=parseD(td());tom.setDate(tom.getDate()+1);
    const tk=locD(tom);
    D.pc[tk]=pc;sv();
    document.getElementById('pcTime').value='';
    document.getElementById('pcFirst').value='';
    document.getElementById('pcObstacle').value='';
    alert('Tomorrow is locked.');
    upD();
}

function upDat(){
    const hm=document.getElementById('hm');
    if(!hm) return;
    hm.innerHTML='';
    if(D.start){
        const st=parseD(D.start);
        for(let i=0;i<60;i++){
            const d=new Date(st);d.setDate(st.getDate()+i);const k=locD(d);
            const dd=D.days[k];let lv='';
            if(dd && dd.tk){
                const dn2=Object.values(dd.tk).reduce((a,b)=>a+b,0);
                if(dn2>=7)lv='l4';else if(dn2>=5)lv='l3';else if(dn2>=3)lv='l2';else if(dn2>=1)lv='l1';
            }
            hm.innerHTML+=`<div class="hm-c ${lv} ${k===td()?'now':''}"></div>`;
        }
    }
    let tGT=0;GT.forEach(c=>tGT+=c.d.length);
    document.getElementById('dGT').textContent=D.gt.dn.length;
    document.getElementById('dGTb').style.width=Math.round(D.gt.dn.length/tGT*100)+'%';
    
    let tBB=0;Object.values(BB).forEach(p=>tBB+=p.tp.length);
    document.getElementById('dBB').textContent=D.bb.dn.length;
    document.getElementById('dBBb').style.width=(tBB?Math.round(D.bb.dn.length/tBB*100):0)+'%';
    
    document.getElementById('dYTc').textContent=D.yt.up.length;
    document.getElementById('dYTb').style.width=Math.min(D.yt.up.length,100)+'%';

    const gt=D.tm.gt||0,bb=D.tm.bb||0,yt=D.tm.yt||0;
    document.getElementById('aGT').textContent=(gt/60).toFixed(1)+'h';
    document.getElementById('aBB').textContent=(bb/60).toFixed(1)+'h';
    document.getElementById('aYT').textContent=(yt/60).toFixed(1)+'h';
    document.getElementById('aAl').textContent=((gt+bb+yt)/60).toFixed(1)+'h';

    const prob=calcProbability();
    document.getElementById('pSkill').textContent=Math.round(prob.factors.skill*100)+'%';
    document.getElementById('pCons').textContent=Math.round(prob.factors.consistency*100)+'%';
    document.getElementById('pFeas').textContent=Math.round(prob.factors.timeFeasibility*100)+'%';
    document.getElementById('pPers').textContent=Math.round(prob.factors.personalityMult*100)+'%';
    document.getElementById('pBBf').textContent=Math.round(prob.bb*100)+'%';
    document.getElementById('pYTf').textContent=Math.round(prob.yt*100)+'%';
    document.getElementById('pCf').textContent=Math.round(prob.combined*100)+'%';

    const sr=document.getElementById('sensRows');sr.innerHTML='';
    prob.sensitivities.forEach(s=>{
        const pct=Math.min(100,s.boost*10);
        sr.innerHTML+=`<div class="sens-row"><span class="sr-action">${s.action}</span><span class="sr-boost">+${s.boost.toFixed(1)}%</span><div class="sr-bar"><div class="sr-fill" style="width:${pct}%"></div></div></div>`;
    });

    const gtp=Math.round(D.gt.dn.length/tGT*100),bbp=tBB?Math.round(D.bb.dn.length/tBB*100):0,ytp=D.yt.up.length;
    let bn='';const mn=Math.min(gtp,bbp,ytp);
    if(mn===gtp&&gtp<50) bn='<strong>Game Theory</strong> lagging. 30 min/day. Non-negotiable.';
    else if(mn===bbp&&bbp<50) bn='<strong>Bug Bounty</strong> is the bottleneck. More labs.';
    else if(mn===ytp&&ytp<50) bn='<strong>YouTube</strong> needs more volume.';
    else bn='Progressing. Stay consistent.';
    document.getElementById('bn').innerHTML=bn;
}

function expD(){
    const dataStr=JSON.stringify(D,null,2);
    const blob=new Blob([dataStr],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;a.download=`BlackSwan_Backup_${td()}.json`;
    document.body.appendChild(a);a.click();document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('Data exported successfully!');
}

function impD(e){
    const file=e.target.files[0];if(!file)return;
    const reader=new FileReader();
    reader.onload=function(event){
        try{
            const imported=JSON.parse(event.target.result);
            if(imported&&imported.start&&imported.days){
                localStorage.setItem('bsv5',JSON.stringify(imported));
                alert('Data imported successfully! Reloading...');
                location.reload();
            } else alert('Invalid backup file.');
        }catch(err){alert('Error parsing file.');}
    };
    reader.readAsText(file);
    e.target.value='';
}

function saveR(){
    const r={w:Math.ceil(dn()/7),d:td()};
    for(let i=1;i<=6;i++) r['q'+i]=document.getElementById('r'+i).value;
    if(!D.rv)D.rv=[];
    D.rv.push(r);sv();
    for(let i=1;i<=6;i++) document.getElementById('r'+i).value='';
    upR();alert('Review Saved.');
}

function upR(){
    const wN = document.getElementById('wN');
    if(wN) wN.textContent=Math.ceil(dn()/7);
    const c=document.getElementById('pR');
    if(!c) return;
    c.innerHTML='';
    if(!D.rv||!D.rv.length)return;
    [...D.rv].reverse().forEach(r=>{
        c.innerHTML+=`<div class="c mb8"><h3>Wk ${r.w} — ${r.d}</h3>${r.q1?'<p class="ts mb4"><strong>Wins:</strong> '+r.q1+'</p>':''}${r.q2?'<p class="ts mb4"><strong>Bottleneck:</strong> '+r.q2+'</p>':''}${r.q5?'<p class="ts"><strong>Change:</strong> '+r.q5+'</p>':''}</div>`;
    });
}

function showE(){
    document.getElementById('eMo').classList.add('sh');
    let t=EMER[Math.floor(Math.random()*EMER.length)].replace('{h}',((D.tm.gt+D.tm.bb+D.tm.yt)/60).toFixed(1));
    document.getElementById('eTx').innerHTML=t.replace(/\n/g,'<br>');
    const ec=document.getElementById('eCn');
    if(D.cn) ec.innerHTML=`<div class="cntr"><h4>You committed:</h4><p>Goal: ${D.cn.w}\nCost: ${D.cn.c}\n"${D.cn.i}"</p></div>`;
    else ec.innerHTML='';
}

function closeE(){document.getElementById('eMo').classList.remove('sh');}

function doS(){
    D.start=document.getElementById('sDt').value||td();
    sv();
    document.getElementById('sMo').classList.remove('sh');
    init();
}

function upP(p){
    switch(p){
        case'cmd':upD();break;
        case'gt':upGT();break;
        case'bb':upBB();break;
        case'yt':upYT();break;
        case'urg':upUrg();break;
        case'sys':upCn();break;
        case'dat':upDat();break;
        case'rev':upR();break;
        case'vault':upVault();break;
        case'grave':upGrave();break;
    }
}

document.querySelectorAll('.ni').forEach(n=>{n.addEventListener('click',()=>{
    document.querySelectorAll('.ni').forEach(i=>i.classList.remove('a'));n.classList.add('a');
    document.querySelectorAll('.pg').forEach(p=>{p.style.display='none';p.classList.remove('a')});
    const pg=document.getElementById('pg-'+n.dataset.p);pg.style.display='block';pg.classList.add('a');
    upP(n.dataset.p);
})});

// FIX: Removed `D.lastAct = Date.now(); sv();` from the top to prevent the render infinite loop
function upD(){
    const dd=tdD(), dy=dn(), dL=dl(), h=new Date().getHours(), v=vel7(), s=stk();
    const prob=calcProbability();

    document.getElementById('hDate').textContent=new Date().toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})+' — Day '+dy+'/60';
    document.getElementById('uDays').textContent=dL;
    const hrsToday=Math.max(0,((new Date(new Date().toDateString()).setHours(23,59,59)-Date.now())/36e5)).toFixed(1);
    document.getElementById('uHrsToday').textContent=hrsToday+'h';
    document.getElementById('uHrsToday').className='ub-v '+(hrsToday<4?'r':hrsToday<8?'y':'g');
    document.getElementById('uProb').textContent=Math.round(prob.combined*100)+'%';
    document.getElementById('uProb').className='ub-v '+(prob.combined>=0.5?'g':prob.combined>=0.3?'y':'r');
    document.getElementById('uStrk').textContent=s;
    if(dL<=14)document.getElementById('urgBox').classList.add('crit');
    
    document.getElementById('qrCount').textContent = D.qr;

    document.getElementById('vCur').textContent=v.toFixed(1);
    const vp=Math.min(100,v/6.5*100);
    const vf=document.getElementById('vFill');vf.style.width=vp+'%';
    vf.style.background=vp>=80?'var(--g)':vp>=50?'var(--y)':'var(--r)';

    const contrarianMsgs=[
        `90% quit by Day 14. You're on Day ${dy}. The market ${dy>14?'was wrong about you — don\'t prove it right now':'still has you priced as a quitter'}. P(success) = ${Math.round(prob.combined*100)}%.`,
        `Your friend is making $2-3K/month from cat videos. You've uploaded ${prob.meta.uploads} shorts. They uploaded ${Math.round(prob.meta.uploads*3+80)} by this point. Close the gap.`,
        `With ${prob.meta.bbH.toFixed(0)}h BB practice, your skill curve is at ${Math.round(prob.factors.skill*100)}%. The sigmoid inflection is at 150h. ${prob.meta.bbH<150?'You haven\'t hit the steep part yet.':'You\'re past the inflection — momentum is yours.'}`,
        `Your consistency score: ${Math.round(prob.meta.consistency*100)}%. ${prob.meta.twoDayViolations} two-day violations. Each one cost ~8% probability. ${prob.meta.twoDayViolations>0?'Stop the bleeding.':'Keep it at zero.'}`,
        `${prob.meta.daysLeft} days left. Projected: ${prob.meta.projectedBBH.toFixed(0)}h BB, ${prob.meta.projectedUploads} uploads. ${prob.meta.projectedBBH>=180?'On track.':'Not enough. Increase daily effort.'}`
    ];
    document.getElementById('contrarianBet').textContent=contrarianMsgs[(dy-1)%contrarianMsgs.length];

    const pCol=prob.combined>=0.5?'var(--g)':prob.combined>=0.3?'var(--y)':'var(--r)';
    document.getElementById('probVal').textContent=Math.round(prob.combined*100)+'%';
    document.getElementById('probVal').style.color=pCol;
    document.getElementById('probCI').textContent='Uncertainty range: '+Math.round(prob.ci.low*100)+'% – '+Math.round(prob.ci.high*100)+'%';

    document.getElementById('probBB').textContent=Math.round(prob.bb*100)+'%';
    document.getElementById('probBB').style.color=prob.bb>=0.4?'var(--g)':prob.bb>=0.2?'var(--y)':'var(--r)';
    const bbTrend=prob.meta.velocityTrend;
    document.getElementById('probBBt').innerHTML=bbTrend>1.05?'<span style="color:var(--g)">▲ Improving</span>':bbTrend<0.95?'<span style="color:var(--r)">▼ Declining</span>':'<span style="color:var(--y)">▶ Stable</span>';

    document.getElementById('probYT').textContent=Math.round(prob.yt*100)+'%';
    document.getElementById('probYT').style.color=prob.yt>=0.3?'var(--g)':prob.yt>=0.15?'var(--y)':'var(--r)';
    document.getElementById('probYTt').innerHTML=prob.meta.dailyUploadRate>=2?'<span style="color:var(--g)">▲ Good pace</span>':prob.meta.dailyUploadRate>=1?'<span style="color:var(--y)">▶ Need more</span>':'<span style="color:var(--r)">▼ Upload more</span>';

    const factors=[
        {name:'Skill Acquisition (logistic)',val:prob.factors.skill,color:prob.factors.skill>=0.4?'var(--g)':prob.factors.skill>=0.2?'var(--y)':'var(--r)',impact:prob.factors.skill>=0.3?'▲':'▼'},
        {name:'Consistency (CV⁻¹)',val:prob.factors.consistency,color:prob.factors.consistency>=0.6?'var(--g)':prob.factors.consistency>=0.4?'var(--y)':'var(--r)',impact:prob.factors.consistency>=0.5?'▲':'▼'},
        {name:'Topic Coverage (weighted)',val:prob.factors.coverage,color:prob.factors.coverage>=0.6?'var(--g)':prob.factors.coverage>=0.4?'var(--y)':'var(--r)',impact:prob.factors.coverage>=0.5?'▲':'▼'},
        {name:'Time Feasibility',val:prob.factors.timeFeasibility,color:prob.factors.timeFeasibility>=0.5?'var(--g)':prob.factors.timeFeasibility>=0.3?'var(--y)':'var(--r)',impact:prob.factors.timeFeasibility>=0.4?'▲':'▼'},
        {name:'Velocity Trend (7d/14d)',val:Math.min(1,prob.factors.trendMult/1.15),color:prob.factors.trendMult>=1?'var(--g)':prob.factors.trendMult>=0.85?'var(--y)':'var(--r)',impact:prob.factors.trendMult>=1?'▲':'▼'},
        {name:'YT Viral P (binomial)',val:prob.factors.ytViral,color:prob.factors.ytViral>=0.3?'var(--g)':prob.factors.ytViral>=0.15?'var(--y)':'var(--r)',impact:''},
        {name:'Personality + Weapons Multiplier',val:prob.factors.personalityMult,color:prob.factors.personalityMult>=0.75?'var(--g)':prob.factors.personalityMult>=0.6?'var(--y)':'var(--r)',impact:prob.factors.personalityMult>=0.7?'▲':'▼'}
    ];
    let fHTML='';
    factors.forEach(f=>{
        fHTML+=`<div class="pf-row"><span class="pf-name">${f.name}</span><div class="pf-bar"><div class="pf-fill" style="width:${Math.round(f.val*100)}%;background:${f.color}"></div></div><span class="pf-val" style="color:${f.color}">${Math.round(f.val*100)}%</span><span class="pf-impact" style="color:${f.color}">${f.impact}</span></div>`;
    });
    document.getElementById('probFactors').innerHTML=fHTML;

    if(prob.sensitivities.length>0){
        const best=prob.sensitivities[0];
        document.getElementById('probActionTxt').innerHTML=`<strong>${best.action}</strong> <span class="pa-boost">+${best.boost.toFixed(1)}% probability</span>`;
    }

    const traits=[
        {key:'novelty',label:'Novelty-Seeking Risk',data:prob.personality.novelty},
        {key:'consc',label:'Discipline Gap',data:prob.personality.conscientiousness},
        {key:'neuro',label:'Urgency Blindness',data:prob.personality.neuroticism}
    ];
    let rHTML='';
    traits.forEach(t=>{
        const risk=t.data.score;
        const pct=Math.round(risk*100);
        const col=pct>=30?'var(--r)':pct>=15?'var(--y)':'var(--g)';
        rHTML+=`<div class="radar-row"><span class="rr-trait">${t.label}</span><div class="rr-bar"><div class="rr-fill" style="width:${pct}%;background:${col}"></div></div><span class="rr-val" style="color:${col}">${pct}%</span></div>`;
    });
    document.getElementById('radarRows').innerHTML=rHTML;

    let maxThreat=null,maxVal=0;
    Object.values(prob.personality).forEach(p=>{if(p.danger&&p.score>maxVal){maxVal=p.score;maxThreat=p}});
    const radarActiveEl=document.getElementById('radarActive');
    if(maxThreat){
        const threats={
            'Novelty-Seeking':`⚠ HIGH RISK: Your high-openness brain is in the peak abandonment window (Day 10-25). The "new project" impulse is strongest right now. Name the temptation. Refuse it. Stick to the plan for ${Math.max(0,25-dy)} more days until this risk drops.`,
            'Discipline Gap':`⚠ HIGH RISK: Consistency score is ${Math.round(prob.meta.consistency*100)}%. Your low conscientiousness is your biggest threat. You need external structure: follow the schedule, use the timer, pre-commit tonight. Systems > willpower.`,
            'Urgency Blindness':`⚠ HIGH RISK: Your velocity has dropped below 3 tasks/day. Your low neuroticism means you're not feeling the urgency — but the math is clear. Check the compound decay numbers. Act on logic, not feeling.`
        };
        radarActiveEl.innerHTML=threats[maxThreat.label]||'';
        radarActiveEl.style.background='rgba(249,115,22,.06)';
        radarActiveEl.style.borderColor='rgba(249,115,22,.15)';
        radarActiveEl.style.color='var(--or)';
        radarActiveEl.style.display='block';
    } else {
        radarActiveEl.innerHTML='✓ All personality risks managed. Keep doing what you\'re doing.';
        radarActiveEl.style.background='rgba(34,197,94,.06)';
        radarActiveEl.style.borderColor='rgba(34,197,94,.15)';
        radarActiveEl.style.color='var(--g)';
    }

    document.getElementById('scenarioGrid').innerHTML=`
    <div class="scenario-card"><div class="sc-icon">📉</div><div class="sc-val" style="color:var(--r)">${Math.round(prob.scenarios.pessimistic*100)}%</div><div class="sc-label">Pessimistic</div><div class="sc-desc">Velocity drops 40%<br>${Math.round(prob.meta.projectedBBH*0.6)}h BB, ${Math.round(prob.meta.projectedUploads*0.6)} uploads</div></div>
    <div class="scenario-card" style="border-color:var(--a)"><div class="sc-icon">▶</div><div class="sc-val" style="color:var(--a)">${Math.round(prob.scenarios.base*100)}%</div><div class="sc-label">Current Pace</div><div class="sc-desc">Maintain current effort<br>${Math.round(prob.meta.projectedBBH)}h BB, ${prob.meta.projectedUploads} uploads</div></div>
    <div class="scenario-card"><div class="sc-icon">📈</div><div class="sc-val" style="color:var(--g)">${Math.round(prob.scenarios.optimistic*100)}%</div><div class="sc-label">Optimistic</div><div class="sc-desc">Hit daily targets<br>${Math.round(prob.meta.bbH+4.5*dL)}h BB, ${Math.round(prob.meta.uploads+2*dL)} uploads</div></div>`;

    const aq=document.getElementById('aqdBox');
    let detected=false;
    if(v<2&&dy>3){
        detected=true;
        aq.classList.remove('hide');
        document.getElementById('aqdTxt').textContent=`Velocity collapse detected: ${v.toFixed(1)} tasks/day (need 6.5). This pattern precedes quitting in 78% of cases. Your probability has dropped to ${Math.round(prob.combined*100)}%.`;
        document.getElementById('aqdAct').textContent='Action: Start the 5-minute timer NOW. Just 5 minutes. Your probability increases with every action.';
    } else if(missY()&&dy>1){
        detected=true;
        aq.classList.remove('hide');
        document.getElementById('aqdTxt').textContent=`You missed yesterday. The Two-Day Rule says today is MANDATORY. Missing 2 consecutive days costs ~8% probability and destroys the neural pathway forming your new habit (Lally et al., 2010: habit formation requires consistency).`;
        document.getElementById('aqdAct').textContent='Action: Do the bare minimum. 5 minutes. Upload 1 video. Keep the chain alive.';
    } else if(dy>=10&&dy<=25&&s<3&&v<4){
        detected=true;
        aq.classList.remove('hide');
        document.getElementById('aqdTxt').textContent=`Day ${dy}: You're in the peak abandonment window for high-openness personalities. The initial excitement has worn off but compound results haven't appeared yet. This is exactly when 73% of similar projects die. Your streak is currently ${s}. Protect it.`;
        document.getElementById('aqdAct').textContent='Action: Complete one small task right now to bridge the novelty gap. Start the 5-minute timer.';
    } else {
        aq.classList.add('hide');
    }

    if(D.spite && D.spite.t) {
        document.getElementById('spiteSetup').classList.add('hide');
        document.getElementById('spiteDisplay').classList.remove('hide');
        document.getElementById('spiteTargetLabel').textContent = D.spite.t + " win";
        document.getElementById('spiteQuote').textContent = `"${D.spite.r}"`;
        D.spite.w = stk(); 
        D.spite.th = missedDays();
        document.getElementById('spiteYou').textContent = D.spite.w;
        document.getElementById('spiteThem').textContent = D.spite.th;
    }

    const actualTotalH = (D.tm.gt + D.tm.bb + D.tm.yt)/60;
    const shadowH = dy * 5.5; 
    const shadowPct = actualTotalH / Math.max(1, shadowH) * 100;
    let shRows = `<div class="shadow-row"><span class="shr-label">Total Hours</span><span class="shr-you">${actualTotalH.toFixed(1)}h</span><span class="shr-shadow">${shadowH.toFixed(1)}h</span><span class="shr-gap" style="color:var(--${actualTotalH>=shadowH?'g':'r'})">${(actualTotalH-shadowH).toFixed(1)}h</span></div>`;
    document.getElementById('shadowRows').innerHTML = shRows;
    const spctEl = document.getElementById('shadowPct');
    spctEl.textContent = shadowPct.toFixed(0) + '%';
    spctEl.style.color = shadowPct >= 90 ? 'var(--g)' : shadowPct >= 70 ? 'var(--y)' : 'var(--r)';

    const done=Object.values(dd.tk).reduce((a,b)=>a+b,0);
    document.querySelectorAll('.tk').forEach(t=>{
        const k=t.dataset.t;
        if(dd.tk[k]) t.classList.add('dn');
        else t.classList.remove('dn');
    });
    const pct=Math.round(done/8*100);
    document.getElementById('tkPr').style.width=pct+'%';
    document.getElementById('tkTx').textContent=done+'/8'+(done===8?' — Perfect':'');

    const bbH=D.tm.bb/60;
    const ups=D.yt.up.length;
    const md=missedDays();
    const compVal=Math.round((61-dy)*0.5+10);
    document.getElementById('dToday').textContent='$'+compVal+' (compound)';
    document.getElementById('dToday').className='dy-v a';
    document.getElementById('dSkip').textContent='-$'+Math.round(compVal*1.3);
    document.getElementById('dCum').textContent=md>0?'-$'+Math.round(md*18):'$0';
    document.getElementById('dCum').className='dy-v '+(md>0?'r':'g');
    document.getElementById('dBBH').textContent=bbH.toFixed(0)+'h / 200h';
    document.getElementById('dBBH').className='dy-v '+(bbH>=dy*3?'g':bbH>=dy*2?'y':'r');
    
    const dailyBBRate_=bbH/Math.max(1,dy-1);
    const bugEta=bbH>=200?'Any day':('~Day '+Math.round(dy+Math.max(0,(200-bbH)/Math.max(0.5,dailyBBRate_))));
    document.getElementById('dBug').textContent=bugEta;
    document.getElementById('dBug').className='dy-v '+(bbH>=150?'g':'r');
    
    document.getElementById('dYT2').textContent=ups+' / 100';
    document.getElementById('dYT2').className='dy-v '+(ups>=dy*1.5?'g':ups>=dy?'y':'r');
    const monEta=ups>=100?'Close':('~Day '+Math.round(ups>0?dy+(100-ups)/(ups/Math.max(1,dy)):'???'));
    document.getElementById('dMon').textContent=monEta;
    document.getElementById('dMon').className='dy-v '+(ups>=50?'g':'r');

    document.getElementById('lgGT').textContent=(dd.tm.gt||0)+'m';
    document.getElementById('lgBB').textContent=(dd.tm.bb||0)+'m';
    document.getElementById('lgYT').textContent=(dd.tm.yt||0)+'m';
    document.getElementById('notes').value=dd.n||'';

    const sc=document.getElementById('sched');
    sc.innerHTML='';
    SCHED.forEach(s=>{
        const sH=parseInt(s.t);
        const cls=sH===h?'now':(sH<h?'past':'');
        sc.innerHTML+=`<div class="sr ${cls}"><span class="st">${s.t}</span><span class="sn">${s.s}</span><span class="sd">${s.d}</span></div>`;
    });

    const pcs=document.getElementById('pcShow');
    const todayPC=D.pc[td()];
    if(todayPC){
        pcs.classList.remove('hide');
        pcs.innerHTML='<strong>Today you committed:</strong> Start at '+todayPC.time+' ⭢ '+todayPC.first+(todayPC.obstacle?'<br><strong>Obstacle plan:</strong> '+todayPC.obstacle:'');
    } else {
        pcs.classList.add('hide');
    }

    renderCons();
    if(D.bv === td()){
       document.getElementById('boredomPrompt').classList.add('hide');
       document.getElementById('boredomDone').classList.remove('hide');
    }

    if (typeof calcEntropy === "function") {
        calcEntropy(actualTotalH);
    }
}

function init(){
    if(!D.start){
        document.getElementById('sMo').classList.add('sh');
        document.getElementById('sDt').value=td();
        return;
    }
    
    tdD();
    upD();
    
    // Load execution panels
    if (typeof upGT === "function") upGT();
    if (typeof upBB === "function") upBB();
    if (typeof upYT === "function") upYT();
    
    // Load systems/weapons panels (CRITICAL FIX)
    if (typeof upCn === "function") upCn();
    if (typeof upUrg === "function") upUrg();
    if (typeof upDat === "function") upDat();
    if (typeof upVault === "function") upVault();
    if (typeof upGrave === "function") upGrave();
    if (typeof upR === "function") upR();
}

// Startup
init();
selTm('bb'); 
setM('p');   

setInterval(()=>{
    if(!D.start)return;
    const currentDate=td();
    
    // FIX: Added sv() to ensure the rollover data is saved, since upD() no longer forces a save
    if(currentDate!==lastDate){
        if (missY()) D.restUsed = (D.restUsed||0) + 1; 
        lastDate=currentDate;
        tdD();
        sv(); // Explicitly save to the cloud when midnight rollover happens
        upD();
        return;
    }

    const dL=dl();
    const h=Math.max(0,((new Date(new Date().toDateString()).setHours(23,59,59)-Date.now())/36e5)).toFixed(1);
    document.getElementById('uDays').textContent=dL;
    document.getElementById('uHrsToday').textContent=h+'h';
    document.getElementById('uHrsToday').className='ub-v '+(h<4?'r':h<8?'y':'g');
    
    const prob=calcProbability();
    document.getElementById('uProb').textContent=Math.round(prob.combined*100)+'%';
    document.getElementById('uProb').className='ub-v '+(prob.combined>=0.5?'g':prob.combined>=0.3?'y':'r');
},15000);
