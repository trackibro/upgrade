const GT=[
{c:"1",t:"Ten Tales of Strategy",d:["Read chapter","Notes on each story","3 real-life examples","Apply to bug bounty"]},
{c:"2",t:"Backward Reasoning",d:["Read chapter","Draw decision trees","Solve 3 problems","Plan BB backwards"]},
{c:"3",t:"Prisoners' Dilemma",d:["Read chapter","Real PD scenarios","PD in vuln disclosure","Connect Ch 1-3"]},
{c:"4",t:"Nash Equilibrium",d:["Read chapter","Equilibrium notes","3 real NE scenarios","NE in YT strategy"]},
{c:"5",t:"Mixed Strategies",d:["Read chapter","Mixed vs pure notes","Practice problems","Review Ch 1-5"]},
{c:"6",t:"Strategic Moves",d:["Read chapter","Commitments notes","Strategic moves in BB","3 business cases"]},
{c:"7",t:"Credibility",d:["Read chapter","Credibility notes","H1 reputation building","YT brand credibility"]},
{c:"8",t:"Information Games",d:["Read chapter","Info asymmetry notes","BB info asymmetry","3 scenarios"]},
{c:"9",t:"Cooperation",d:["Read chapter","Focal points notes","BB community","Review Ch 6-9"]},
{c:"10",t:"Auctions",d:["Read chapter","Auction notes","BB as auction","Winner's curse"]},
{c:"11",t:"Bargaining",d:["Read chapter","BATNA notes","Negotiate payouts","Scenarios"]},
{c:"12",t:"Voting",d:["Read chapter","Arrow's theorem","Group decisions","Review Ch 10-12"]},
{c:"13",t:"Incentives",d:["Read chapter","Incentive notes","YT algorithm incentives","Platform incentives"]},
{c:"14",t:"Final",d:["Case studies","Cheat sheet","Apply all concepts","Test yourself","6-mo strategy","Celebrate"]}
];

const BB={
p1:{t:"Foundations",tp:["HTTP requests/responses/methods","Status codes","Cookies, sessions, auth","SOP, CORS","Install Burp Suite","Burp: intercept & modify","Burp: Repeater & Intruder","DevTools: Network","DevTools: Application","OWASP Top 10","Setup DVWA/Juice Shop","5 PortSwigger labs","10 PortSwigger labs","All apprentice labs"]},
p2:{t:"Business Logic",tp:["What are BL vulns?","Price/quantity manipulation","PortSwigger BL labs","Workflow bypass","Race conditions","Race condition labs","Coupon abuse","Currency rounding","Feature misuse","Input validation bypass","Multi-step manipulation","5 BL challenges","10 disclosed BL reports","Analyze report patterns"]},
p3:{t:"Access Control",tp:["IDOR fundamentals","PortSwigger IDOR labs","Horizontal escalation","Vertical escalation","All AC labs","Missing function-level AC","JWT attacks","PortSwigger JWT labs","RBAC testing","Parameter-based bypass","Method-based bypass","Referer/Origin bypass","10 disclosed AC reports","All AC challenges"]},
p4:{t:"API & Advanced",tp:["REST API basics","API docs & discovery","BOLA","Mass assignment","Excessive data exposure","Rate limiting","GraphQL","API versioning","Chaining vulns","API security labs","Report writing","3 mock reports","Top 50 H1 reports","Burp extensions"]},
p5:{t:"Real Hunting",tp:["Sign up H1, Bugcrowd, Intigriti","Read 5 program policies","Choose first target","Recon: subdomains","Recon: endpoints","Recon: JS for APIs","Test: business logic","Test: access control","Test: APIs","Submit first report","Learn from triage","Second program","Personal methodology","1 valid bug/week"]}
};

const SCHED=[
{t:"08:00",s:"Upload 2 Shorts (pre-made)",d:"20m"},{t:"08:20",s:"Game Theory",d:"35m"},
{t:"09:00",s:"Break",d:"10m"},
{t:"09:10",s:"BB Theory",d:"2h"},{t:"11:10",s:"Break",d:"15m"},{t:"11:25",s:"BB Practice/Labs",d:"2.5h"},
{t:"13:55",s:"Break",d:"20m"},{t:"14:15",s:"YT — find/edit tomorrow's content",d:"40m"},
{t:"14:55",s:"Read 1 disclosed report",d:"15m"},{t:"15:10",s:"Log + pre-commit tomorrow",d:"5m"}
];

const EMER=[
"Run the math. You've invested {h} hours. Quitting = those hours produce $0. Continuing = they compound toward $500-5000.\n\nP(first bug | continuing) ≈ 85%\nP(first bug | quitting) = 0%\n\nExpected value isn't close. Open a lab.",
"Your friend makes 2-3K USD/month from cat videos with zero editing skills. They're not smarter. They just upload every day.\n\nGo to Pexels. Download a clip. Upload it. 5 minutes.",
"Your high-openness brain is already thinking about the next interesting thing. Name it. See it. Refuse it.\n\nYou're not starting anything new until Day 60. Open your current task. 5 minutes."
];

function df(){
  return {
    start:null, days:{}, gt:{dn:[]}, bb:{dn:[]}, yt:{up:[]}, tm:{gt:0,bb:0,yt:0}, cn:null, rv:[], pc:{},
    vault:[], grave:[], spite:{t:'',r:'',w:0,th:0}, cons:[], qr:0, lastAct:null, bv:null, restUsed:0,
    wagerWins: 0, wagerLosses: 0
  }
}

function ld(){
  try {
    const s = localStorage.getItem('bsv5');
    if(s) {
       let d = JSON.parse(s);
       // CRITICAL FIX: Safe Fallbacks so old data doesn't crash the new engine
       d.days = d.days || {};
       d.gt = d.gt || {dn:[]};
       d.bb = d.bb || {dn:[]};
       d.yt = d.yt || {up:[]};
       d.tm = d.tm || {gt:0,bb:0,yt:0};
       d.pc = d.pc || {};
       d.vault = d.vault || [];
       d.grave = d.grave ||[];
       d.spite = d.spite || {t:'',r:'',w:0,th:0};
       d.cons = d.cons ||[];
       d.qr = d.qr || 0;
       d.restUsed = d.restUsed || 0;
       d.wagerWins = d.wagerWins || 0;
       d.wagerLosses = d.wagerLosses || 0;
       return d;
    }
  } catch(e){}
  return df();
}

let D = ld();
let tI = null, tS = 0, tOn = false, tCat = null, tMd = 'p', tDr = 1500;
let isWagerActive = false;
let lastDate = locD(new Date());

function locD(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function parseD(s){const p=s.split('-');return new Date(p[0],p[1]-1,p[2])}
function td(){return locD(new Date())}
function sv(){localStorage.setItem('bsv5',JSON.stringify(D))}
function tdD(){
    const t=td();
    if(!D.days[t]) D.days[t] = {tk:{gt:0,bbt:0,bbp:0,ytc:0,yt1:0,yt2:0,lrn:0,log:0},tm:{gt:0,bb:0,yt:0},n:'',ch:0};
    return D.days[t];
}
function dn(){
    if(!D.start) return 1;
    const start=parseD(D.start), today=parseD(td());
    return Math.max(1, Math.round((today-start)/864e5)+1);
}
function dl(){return Math.max(0, 61-dn())}

function stk(){
    let s=0, d=parseD(td());
    for(let i=0; i<200; i++){
        const k=locD(d), dd=D.days[k];
        if(dd) {
            if(dd.tk && Object.values(dd.tk).reduce((a,b)=>a+b,0) >= 1) { s++; d.setDate(d.getDate()-1) }
            else if(k===td()) d.setDate(d.getDate()-1);
            else break;
        } else if(k===td()) {
            d.setDate(d.getDate()-1);
        } else {
            break;
        }
    }
    return s;
}

function getVelocity(windowDays){
    let t=0, d=parseD(td());
    for(let i=0; i<windowDays; i++){
        const k=locD(d), dd=D.days[k];
        if(dd && dd.tk) t += Object.values(dd.tk).reduce((a,b)=>a+b,0);
        d.setDate(d.getDate()-1);
    }
    return t/windowDays; 
}
function vel7(){return getVelocity(7)}
function vel14(){return getVelocity(14)}

function calcConsistency(){
    if(!D.start || dn()<=2) return 0.5;
    const days=[], n=Math.min(dn()-1,30);
    const d=parseD(td()); d.setDate(d.getDate()-1);
    for(let i=0; i<n; i++){
        const k=locD(d), dd=D.days[k];
        days.push((dd && dd.tk) ? Object.values(dd.tk).reduce((a,b)=>a+b,0) : 0);
        d.setDate(d.getDate()-1);
    }
    if(days.length<2) return 0.5;
    const mean = days.reduce((a,b)=>a+b,0)/days.length;
    if(mean===0) return 0;
    const variance = days.reduce((a,b)=>a+Math.pow(b-mean,2),0)/days.length;
    const cv = Math.sqrt(variance)/mean;
    return Math.max(0.05, Math.min(1, 1/(1+cv*1.2)));
}

function countTwoDayViolations(){
    if(!D.start) return 0;
    let violations=0, consecutive=0;
    const d=parseD(D.start);
    for(let i=0; i<dn()-1; i++){
        const k=locD(d), dd=D.days[k];
        const done = (dd && dd.tk) ? Object.values(dd.tk).reduce((a,b)=>a+b,0) : 0;
        if(done===0) { consecutive++; if(consecutive>=2) violations++ }
        else consecutive=0;
        d.setDate(d.getDate()+1);
    }
    return violations;
}

function missY(){
    const y=parseD(td()); y.setDate(y.getDate()-1);
    const k=locD(y), dd=D.days[k];
    if(!dd || !dd.tk) return dn()>1;
    return Object.values(dd.tk).reduce((a,b)=>a+b,0)<1;
}

function missedDays(){
    let m=0; if(!D.start) return 0;
    const s=parseD(D.start);
    for(let i=0; i<dn()-1; i++){
        const d=new Date(s); d.setDate(s.getDate()+i);
        const k=locD(d);
        const dd = D.days[k];
        if(!dd || !dd.tk || Object.values(dd.tk).reduce((a,b)=>a+b,0)<1) m++;
    }
    return m;
}

function getDailyBBHours(n){
    const arr=[], d=parseD(td());
    for(let i=0; i<n; i++){
        const k=locD(d), dd=D.days[k];
        arr.push(dd ? (dd.tm.bb||0)/60 : 0);
        d.setDate(d.getDate()-1);
    }
    return arr.reverse();
}

function getDailyUploads(n){
    const arr=[], d=parseD(td());
    for(let i=0; i<n; i++){
        const k=locD(d);
        const count = D.yt.up.filter(u=>u.d===k).length;
        arr.push(count);
        d.setDate(d.getDate()-1);
    }
    return arr.reverse();
}
