 //=====================================================
// GAME THEORY
// =====================================================
function upGT(){
    const c=document.getElementById('gtP');
    if(!c) return;
    c.innerHTML='';let n=0;
    GT.forEach(ch=>{
        const div=document.createElement('div');div.className='ph';let h='';
        ch.d.forEach(t=>{
            n++;const nn=n,done=D.gt.dn.includes(nn),isT=nn===dn();
            h+=`<div class="dp ${done?'dn':''} ${isT?'td':''}" data-g="${nn}"><span class="dd">${String(nn).padStart(2,'0')}</span><span>${t}</span></div>`;
        });
        div.innerHTML=`<h4>Ch ${ch.c}: ${ch.t}</h4>${h}`;c.appendChild(div);
    });
    c.querySelectorAll('.dp').forEach(d=>{
        d.addEventListener('click',()=>{
            const v=parseInt(d.dataset.g),i=D.gt.dn.indexOf(v);
            if(i>-1)D.gt.dn.splice(i,1);else D.gt.dn.push(v);
            sv();upGT();upD(); 
        });
    });
    let tot=0;GT.forEach(c=>tot+=c.d.length);const done=D.gt.dn.length;
    document.getElementById('gtPr').style.width=Math.round(done/tot*100)+'%';
    document.getElementById('gtPrT').textContent=done+'/'+tot+' ('+Math.round(done/tot*100)+'%)';
}

// =====================================================
// BUG BOUNTY
// =====================================================
function upBB(){
    Object.entries(BB).forEach(([k,ph])=>{
        const nm=k.replace('p',''),c=document.getElementById('bP'+nm);if(!c)return;
        c.innerHTML='';
        ph.tp.forEach((t,i)=>{
            const tid=k+'-'+i,done=D.bb.dn.includes(tid);
            const div=document.createElement('div');div.className='tp'+(done?' dn':'');
            div.innerHTML=`<div class="tpc">${done?'✓':''}</div><span>${t}</span>`;
            div.addEventListener('click',()=>{
                const idx=D.bb.dn.indexOf(tid);
                if(idx>-1)D.bb.dn.splice(idx,1);else D.bb.dn.push(tid);
                sv();upBB();upD();
            });
            c.appendChild(div);
        });
    });
    let tot=0;Object.values(BB).forEach(p=>tot+=p.tp.length);const done=D.bb.dn.length;
    if(document.getElementById('bbPr')) document.getElementById('bbPr').style.width=(tot?Math.round(done/tot*100):0)+'%';
    if(document.getElementById('bbPrT')) document.getElementById('bbPrT').textContent=done+'/'+tot+' ('+Math.round(done/tot*100)+'%)';
}

// =====================================================
// YOUTUBE
// =====================================================
function addU(){
    const t=document.getElementById('uT').value.trim(),n=document.getElementById('uN').value.trim();
    if(!t){alert('Title is required');return}
    D.yt.up.push({t,n,d:td()});
    sv();
    document.getElementById('uT').value='';document.getElementById('uN').value='';
    upYT();
    upD(); 
}

function upYT(){
    if(!document.getElementById('tUp')) return;
    const tot=D.yt.up.length;
    document.getElementById('tUp').textContent=tot;
    document.getElementById('uPr').style.width=Math.min(tot,100)+'%';
    const l=document.getElementById('uL');l.innerHTML='';[...D.yt.up].reverse().slice(0,15).forEach(u=>{
        l.innerHTML+=`<div class="ui"><span>${u.t}</span>${u.n?'<span class="td"> · '+u.n+'</span>':''}<span class="ud">${u.d}</span></div>`;
    });
    if(!tot)l.innerHTML='<div class="ts td tc" style="padding:16px">No uploads yet.</div>';
}
