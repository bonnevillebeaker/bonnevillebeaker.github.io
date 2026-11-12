/* Herculean Workout Tracker · Copyright (C) 2026 Coleman Nielsen · GNU GPL v3 or later (see LICENSE) */
const clone=o=>JSON.parse(JSON.stringify(o));
const rid=p=>p+"-"+Math.random().toString(36).slice(2,8);
/* ---------- dates ---------- */
const DAY=864e5;
const D=s=>new Date(s+"T12:00");
const iso=d=>new Date(d.getTime()-d.getTimezoneOffset()*6e4).toISOString().slice(0,10);
const todayISO=()=>iso(new Date());
const addDays=(s,n)=>iso(new Date(D(s).getTime()+n*DAY));
const diffDays=(a,b)=>Math.round((D(b)-D(a))/DAY);
const mondayOf=s=>{const wd=D(s).getDay();return addDays(s,-((wd+6)%7))};
const fmtDate=s=>D(s).toLocaleDateString(undefined,{month:"short",day:"numeric"});
const wdShort=s=>D(s).toLocaleDateString(undefined,{weekday:"short"});

/* ---------- model ---------- */
const E=(id,name,sets,lo,hi,unit,more)=>Object.assign({id,name,sets,lo,hi,unit:unit||"reps",weight:true,dist:false,distUnit:"mi",pace:false,group:""},more||{});
const C=(on,label,type,target)=>({on:!!on,label:label||"",type:type||"steady",target:target||""});
function presetDays(pre){return [
  {id:pre+"mon",label:"Mon",name:"Push A",cardio:C(true,"Easy bike","steady","15 min, conversational pace"),ex:[
    E("smith-bench","Smith bench press",5,7,7),E("incline-db-press","Incline DB press",5,7,7),
    E("seated-db-shoulder","Seated DB shoulder press",4,7,7),E("cable-lateral","Cable lateral raise",3,12,15),
    E("triceps-pushdown","Triceps pushdown",3,7,7)]},
  {id:pre+"tue",label:"Tue",name:"Pull A + Legs B",cardio:C(false),ex:[
    E("lat-pulldown","Lat pulldown",5,7,7),E("seated-cable-row","Seated cable row",5,7,7),
    E("face-pull","Face pull",3,12,15),E("db-curl","DB curl",3,7,7),
    E("leg-press","Leg press",3,7,7),E("seated-leg-curl","Seated leg curl",3,7,7)]},
  {id:pre+"wed",label:"Wed",name:"Legs A",cardio:C(false),ex:[
    E("smith-squat","Smith squat",5,7,7),E("db-rdl","DB Romanian deadlift",5,7,7),
    E("walking-lunge","Walking lunge (each leg)",3,7,7),E("leg-extension","Leg extension",3,7,7),
    E("lying-leg-curl","Lying leg curl",3,7,7),E("calf-raise","Calf raise",4,12,15)]},
  {id:pre+"thu",label:"Thu",name:"Push B",cardio:C(true,"Easy bike","steady","15 min, conversational pace"),ex:[
    E("machine-chest-press","Machine chest press",5,7,7),E("incline-smith-press","Incline Smith press",5,7,7),
    E("pec-deck","Pec deck",3,7,7),E("machine-shoulder-press","Machine shoulder press",4,7,7),
    E("db-lateral","DB lateral raise",3,12,15),E("oh-db-triceps","Overhead DB triceps extension",3,7,7)]},
  {id:pre+"fri",label:"Fri",name:"Pull B",cardio:C(false),ex:[
    E("one-arm-db-row","One-arm DB row (each arm)",5,7,7),E("close-grip-pulldown","Close-grip pulldown",5,7,7),
    E("machine-row","Machine row",4,7,7),E("reverse-pec-deck","Reverse pec deck",3,12,15),
    E("hammer-curl","Hammer curl",3,7,7)]},
  {id:pre+"sat",label:"Sat",name:"Conditioning",cardio:C(true,"Bike intervals","intervals","4 × 4 min hard, 3 min easy"),ex:[
    E("cable-crunch","Cable crunch",3,12,15),E("plank","Plank",3,30,60,"sec",{weight:false})]}
]}
function presetProgram(){return {...STARTER,id:"ppl",name:"Push / Pull / Legs",deload:5,deloadSets:3,
  loop:{len:7,start:mondayOf(todayISO()),slots:["mon","tue","wed","thu","fri","sat",""]},days:presetDays("").map(d=>({...STARTER,...d}))}}
function presetProfile(){return {kind:"profile",v:3,settings:{unit:"lb",inc:5,restA:90,restB:150},
  activeId:"ppl",programs:[presetProgram()],workouts:presetDays("lib-").map(d=>({...STARTER,...d})),metrics:sanitizeMetrics([]),me:{id:rid("u"),name:""}}}

/* authorship: stamped once when an item is made, never edited in the app */
const AUTH_KEYS=["author","authorId","created","basedOn"];
function keepAuthor(o){AUTH_KEYS.forEach(k=>{o[k]=o[k]==null?"":String(o[k])});return o}
const STARTER={author:"Herculean",authorId:"ironlog",created:"2026-11-08"};
const isMine=o=>!o.authorId||o.authorId===profile.me.id;
const authorName=o=>o.authorId===profile.me.id?(profile.me.name||o.author||"You"):(o.author||"Unknown author");
function stampAuthor(o,from){
  o.author=profile.me.name;o.authorId=profile.me.id;o.created=todayISO();
  o.basedOn=from&&from.authorId&&from.authorId!==profile.me.id?authorName(from):(from&&from.basedOn)||"";
  return o;
}
function needName(){if(profile.me.name)return true;showWelcome();return false}
/* first visit: set up the profile (name is permanent, it becomes the author stamp) */
function showWelcome(){
  if(profile.me.name)return;
  $("wUnit").value=profile.settings.unit;$("wErr").hidden=true;
  $("wAlt").hidden=typeof window.openProfileFile!=="function";
  $("welcome").hidden=false;setTimeout(()=>$("wName").focus(),50);
}
function hideWelcome(){$("welcome").hidden=true}

function byline(o){
  const bits=["By "+authorName(o)];if(o.created)bits.push(fmtYear(o.created));if(o.basedOn)bits.push("based on "+o.basedOn+"’s");
  return bits.join(" · ");
}
const fmtYear=s=>D(s).toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"});
function sanitizeWorkout(w){
  w=keepAuthor(w||{});w.id=w.id||rid("w");w.name=(w.name||"").toString();w.label=(w.label||"").toString();
  w.cardio=Object.assign(C(false),w.cardio||{});w.cardio.on=!!w.cardio.on;
  const T=v=>v===true||v==="true";
  w.ex=(w.ex||[]).map(e=>({id:e.id||rid("x"),name:(e.name||"Exercise").toString(),sets:Math.max(1,Math.round(+e.sets||1)),
    lo:Math.max(0,+e.lo||0),hi:Math.max(+e.lo||0,+e.hi||+e.lo||0),unit:["sec","none"].includes(e.unit)?e.unit:"reps",
    weight:!(e.weight===false||e.weight==="false"),dist:T(e.dist),distUnit:DIST_UNITS.includes(e.distUnit)?e.distUnit:"mi",pace:T(e.pace),group:e.group?String(e.group):""}));
  normalizeGroups(w);
  return w;
}
const DIST_UNITS=["mi","km","m","yd"];
/* measurements: body weight plus anything else the person wants to follow over time */
const LEN=()=>profile&&profile.settings.unit==="kg"?"cm":"in";
const METRIC_PRESETS=[
  {id:"bw",name:"Body weight",unit:"@w",dir:"none",kind:"number"},
  {id:"bp",name:"Blood pressure",unit:"mmHg",dir:"down",kind:"bp"},
  {id:"rhr",name:"Resting heart rate",unit:"bpm",dir:"down",kind:"number"},
  {id:"vo2",name:"VO2 max",unit:"mL/kg/min",dir:"up",kind:"number"},
  {id:"ahi",name:"AHI (sleep apnea index)",unit:"events/hr",dir:"down",kind:"number"},
  {id:"bodyfat",name:"Body fat",unit:"%",dir:"down",kind:"number"},
  {id:"waist",name:"Waist",unit:"@l",dir:"down",kind:"number"},
  {id:"chest",name:"Chest",unit:"@l",dir:"up",kind:"number"},
  {id:"hips",name:"Hips",unit:"@l",dir:"none",kind:"number"},
  {id:"neck",name:"Neck",unit:"@l",dir:"none",kind:"number"},
  {id:"arm-l",name:"Upper arm (left)",unit:"@l",dir:"up",kind:"number"},
  {id:"arm-r",name:"Upper arm (right)",unit:"@l",dir:"up",kind:"number"},
  {id:"thigh-l",name:"Thigh (left)",unit:"@l",dir:"up",kind:"number"},
  {id:"thigh-r",name:"Thigh (right)",unit:"@l",dir:"up",kind:"number"},
  {id:"calf-l",name:"Calf (left)",unit:"@l",dir:"up",kind:"number"},
  {id:"calf-r",name:"Calf (right)",unit:"@l",dir:"up",kind:"number"},
  {id:"forearm",name:"Forearm",unit:"@l",dir:"up",kind:"number"},
  {id:"shoulders",name:"Shoulders",unit:"@l",dir:"up",kind:"number"}];
/* "@w" follows the weight unit, "@l" follows lengths (in with lb, cm with kg) */
const mUnit=m=>m.unit==="@w"?U():m.unit==="@l"?LEN():m.unit;
function sanitizeMetrics(list){
  const out=[];const seen=new Set();
  (Array.isArray(list)?list:[]).forEach(m=>{if(!m||!m.id||seen.has(m.id))return;seen.add(m.id);
    out.push({id:String(m.id),name:String(m.name||"Measurement"),unit:String(m.unit??""),dir:["up","down"].includes(m.dir)?m.dir:"none",kind:m.kind==="bp"?"bp":"number",on:!(m.on===false||m.on==="false")})});
  if(!seen.has("bw"))out.unshift({...METRIC_PRESETS[0],on:true});
  return out;
}
/* supersets: exercises sharing a group id must sit next to each other; a group of one is no group */
function normalizeGroups(w){
  const seen=new Set();let prev=null;
  w.ex.forEach(e=>{if(e.group&&e.group!==prev&&seen.has(e.group))e.group="";if(e.group)seen.add(e.group);prev=e.group});
  const count={};w.ex.forEach(e=>{if(e.group)count[e.group]=(count[e.group]||0)+1});
  w.ex.forEach(e=>{if(e.group&&count[e.group]<2)e.group=""});
  /* every exercise in a superset runs the same number of rounds: the first exercise's set count wins */
  const rounds={};w.ex.forEach(e=>{if(!e.group)return;if(!(e.group in rounds))rounds[e.group]=e.sets;else e.sets=rounds[e.group]});
}
const ssRounds=n=>(+n>0?n+" round"+(+n===1?"":"s"):"");
/* letters for each superset in order: A, B, C… */
function groupLetters(w){const m={};let n=0;w.ex.forEach(e=>{if(e.group&&!(e.group in m))m[e.group]=String.fromCharCode(65+(n++%26))});return m}
function metricVal(s,id){if(id==="bw")return s.bw>0?+s.bw:null;const v=s.m&&s.m[id];if(v==null)return null;return v}
const fmtMetric=(m,v)=>v==null?"":m.kind==="bp"?v.sys+"/"+v.dia+" "+mUnit(m):(+(+v).toFixed(2))+(mUnit(m)?" "+mUnit(m):"");
function entryMeasures(s){return profile.metrics.map(m=>[m,metricVal(s,m.id)]).filter(([,v])=>v!=null)}
const hasData=x=>(+x.r>0)||(+x.d>0);
function parseTime(v){v=String(v||"").trim();if(!v)return "";const parts=v.split(":").map(Number);if(parts.some(isNaN))return "";return parts.reduce((a,b)=>a*60+b,0)}
function fmtDur(s){s=Math.round(+s||0);if(!s)return "";const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return h?h+":"+String(m).padStart(2,"0")+":"+String(x).padStart(2,"0"):(m?m+":"+String(x).padStart(2,"0"):String(x))}
const fmtPace=s=>{s=Math.round(+s||0);return s?Math.floor(s/60)+":"+String(s%60).padStart(2,"0"):""};
const fmtDist=d=>String(+(+d).toFixed(2));
function sanitizeProgram(p){
  p=keepAuthor(p||{});p.id=p.id||rid("p");p.name=(p.name||"Untitled program").toString();
  p.deload=Math.max(0,Math.round(+(p.deload??5)||0));p.deloadSets=Math.max(1,Math.round(+p.deloadSets||3));
  p.days=(p.days||[]).map(sanitizeWorkout);
  if(!p.loop||!Array.isArray(p.loop.slots)){
    const slots=["","","","","","",""];
    p.days.forEach(d=>{if(d.weekday!=null&&d.weekday!==""){const pos=(+d.weekday+6)%7;if(!slots[pos])slots[pos]=d.id}});
    p.loop={len:7,start:mondayOf(todayISO()),slots};
  }
  p.days.forEach(d=>delete d.weekday);
  const ids=new Set(p.days.map(d=>d.id));
  p.loop.len=Math.min(42,Math.max(1,Math.round(+p.loop.len||7)));
  p.loop.slots=Array.from({length:p.loop.len},(_,i)=>ids.has(p.loop.slots[i])?p.loop.slots[i]:"");
  if(!/^\d{4}-\d\d-\d\d$/.test(p.loop.start||"")) p.loop.start=mondayOf(todayISO());
  return p;
}
function sanitizeProfile(pr){
  if(!pr||!Array.isArray(pr.programs)) return presetProfile();
  pr.kind="profile";pr.v=3;
  pr.settings=Object.assign({unit:"lb",inc:5,restA:90,restB:150},pr.settings||{});
  ["inc","restA","restB"].forEach(k=>pr.settings[k]=+pr.settings[k]||0);
  if(pr.settings.unit!=="kg")pr.settings.unit="lb";
  pr.programs=pr.programs.map(sanitizeProgram);
  pr.workouts=(pr.workouts||[]).map(sanitizeWorkout);
  if(!pr.programs.some(p=>p.id===pr.activeId)) pr.activeId=pr.programs[0]?pr.programs[0].id:null;
  pr.metrics=sanitizeMetrics(pr.metrics);
  pr.me={id:(pr.me&&pr.me.id)||rid("u"),name:String((pr.me&&pr.me.name)||"")};
  /* items made before authorship existed belong to this person */
  const claim=o=>{if(!o.authorId){o.authorId=pr.me.id;o.author=o.author||pr.me.name}};
  pr.programs.forEach(p=>{claim(p);p.days.forEach(claim)});pr.workouts.forEach(claim);
  return pr;
}
/* an older single-program save becomes a profile with one program */
function profileFromLegacy(old){
  const st=old.settings||{};
  const p=sanitizeProgram({id:"ppl",name:st.progName||"My program",deload:st.deload,deloadSets:st.deloadSets,loop:old.loop,days:clone(old.days||[])});
  return sanitizeProfile({settings:{unit:st.unit,inc:st.inc,restA:st.restA,restB:st.restB},activeId:p.id,programs:[p],
    workouts:p.days.map(d=>Object.assign(clone(d),{id:"lib-"+d.id}))});
}

/* ---------- state ---------- */
const $=id=>document.getElementById(id);
let profile=presetProfile(), prog=null, sessions={};
let dayId, date, draft={}, viewLoop=0, progTab="over";
let edit=null, editKind=null, openDays=new Set();
const U=()=>profile.settings.unit;
function fmtSec(s){s=Math.max(0,Math.round(+s||0));return Math.floor(s/60)+":"+String(s%60).padStart(2,"0")}
function toast(msg){const t=$("toast");t.textContent=msg;t.hidden=false;clearTimeout(toast.h);toast.h=setTimeout(()=>t.hidden=true,2600)}
const docId=(dt,dy)=>"s_"+dt+"_"+dy;
function derive(){
  const p=profile.programs.find(x=>x.id===profile.activeId)||null;
  prog=p?{id:p.id,name:p.name,days:p.days,loop:p.loop,settings:{...profile.settings,deload:p.deload,deloadSets:p.deloadSets}}
       :{id:null,name:"",days:[],loop:{len:7,start:mondayOf(todayISO()),slots:Array(7).fill("")},settings:{...profile.settings,deload:0,deloadSets:3}};
}
const inProgram=id=>prog.days.some(d=>d.id===id);
const getDay=id=>prog.days.find(d=>d.id===id)||profile.workouts.find(d=>d.id===id)||null;
function ghostFromEntry(s){
  if(!s||s.day==="rest")return null;
  return {id:s.day,name:s.dayName||"Workout",label:"",ghost:true,cardio:C(!!(s.cardio&&Object.keys(s.cardio).length),"Cardio",s.cardioType||"steady",""),
    ex:Object.keys(s.sets||{}).map(id=>{const du=s.dunits&&s.dunits[id];const arr=s.sets[id];
      return {id,name:(s.names&&s.names[id])||id,sets:arr.length,lo:0,hi:0,unit:(s.units&&s.units[id])||"reps",weight:arr.some(x=>+x.w>0),dist:!!du,distUnit:du||"mi",pace:arr.some(x=>+x.p>0),group:""}})};
}

/* ---------- loop math ---------- */
const L=()=>prog.loop.len;
const loopIdx=s=>Math.floor(diffDays(prog.loop.start,s)/L());
const loopPos=s=>((diffDays(prog.loop.start,s)%L())+L())%L();
const slotFor=s=>prog.loop.slots[loopPos(s)]||"rest";
const loopDates=i=>Array.from({length:L()},(_,k)=>addDays(prog.loop.start,i*L()+k));
const loopName=i=>"Loop "+(i+1);
function isDeload(i){const n=+prog.settings.deload;return n>0&&i>=0&&(i+1)%n===0}

/* ---------- storage helpers ---------- */
function localLoad(k,f){try{const v=localStorage.getItem(k);return v?JSON.parse(v):f}catch(e){return f}}
function localPut(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}}
function loadLocalProfile(){
  const pr=localLoad("ironlog.profile",null);
  if(pr) return sanitizeProfile(pr);
  const old=localLoad("ironlog.program",null);
  return old?profileFromLegacy(old):presetProfile();
}
async function saveProfile(){
  const p=sanitizeProfile(clone(profile));profile=p;derive();
  try{await persistProfile(p);return true}
  catch(e){toast("Couldn’t save your library. Try again.");return false}
}

/* ---------- history helpers ---------- */
function sortedSessions(){return Object.values(sessions).sort((a,b)=>a.date<b.date?-1:a.date>b.date?1:0)}
function findSession(dt,dy){for(const [id,v] of Object.entries(sessions)){if(v.date===dt&&v.day===dy)return [id,v]}return [docId(dt,dy),null]}
const workoutsOn=dt=>Object.values(sessions).filter(s=>s.date===dt&&s.day!=="rest");
function lastFor(exId,before){
  const l=sortedSessions().filter(s=>s.date<before&&s.sets&&s.sets[exId]&&s.sets[exId].some(hasData));
  return l.length?l[l.length-1]:null;
}
function verdict(e){
  const prev=lastFor(e.id,date);
  if(!prev) return {cls:"new",text:"First log",w:null};
  const sets=prev.sets[e.id].filter(hasData);
  if(!e.weight||e.unit==="none"){
    const bits=[];const totD=sets.reduce((a,x)=>a+(+x.d||0),0);const best=Math.max(0,...sets.map(x=>+x.r||0));
    if(e.dist&&totD)bits.push(fmtDist(totD)+" "+e.distUnit);
    if(e.unit==="sec"&&best)bits.push(fmtDur(best)+(e.dist?"":" best"));
    if(e.unit==="reps"&&best)bits.push(best+" reps best");
    const allHit=e.unit!=="none"&&e.hi>0&&sets.length>=e.sets&&sets.every(x=>+x.r>=+e.hi);
    return {cls:allHit?"up":"hold",text:(allHit?(e.unit==="sec"?"Go longer · ":"Add reps or load · "):"Last: ")+(bits.join(", ")||"logged"),w:null};
  }
  const topW=Math.max(0,...sets.map(x=>+x.w||0));
  const allHit=e.hi>0&&sets.length>=e.sets&&sets.every(x=>+x.r>=+e.hi);
  const inc=+profile.settings.inc||0;
  if(e.unit==="sec") return allHit?{cls:"up",text:"Go longer or add load",w:topW||null}:{cls:"hold",text:"Repeat",w:topW||null};
  if(!topW) return allHit?{cls:"up",text:"Add reps or load",w:null}:{cls:"hold",text:"Repeat",w:null};
  return allHit?{cls:"up",text:"Add weight → "+(topW+inc)+" "+U(),w:topW+inc}:{cls:"hold",text:"Hold "+topW+" "+U(),w:topW};
}
const rx=e=>e.unit!=="none"&&e.hi?(e.lo==e.hi?e.lo:e.lo+"–"+e.hi)+(e.unit==="sec"?" sec":""):"";
function cellStatus(dt){
  const slot=slotFor(dt), done=workoutsOn(dt).length>0, t=todayISO();
  if(done) return ["done","Done"];
  if(slot==="rest") return ["rest","Rest"];
  if(dt<t) return ["miss","Missed"];
  if(dt===t) return ["up","Today"];
  return ["up","Planned"];
}
function distUnitOf(s,id){if(s.dunits&&s.dunits[id])return s.dunits[id];for(const w of allWorkouts())for(const e of w.ex)if(e.id===id&&e.dist)return e.distUnit;return ""}
function unitOf(s,id){if(s.units&&s.units[id])return s.units[id];for(const w of allWorkouts())for(const e of w.ex)if(e.id===id)return e.unit;return "reps"}
function allWorkouts(){return [...prog.days,...profile.workouts,...profile.programs.flatMap(p=>p.days)]}

/* ---------- log view ---------- */
function goToDate(dt,keepDay){
  date=dt;$("date").value=dt;viewLoop=loopIdx(dt);
  if(!keepDay||!(dayId==="rest"||getDay(dayId)||findSession(dt,dayId)[1])){
    const logged=workoutsOn(dt);dayId=logged.length?logged[0].day:slotFor(dt);
  }
  renderLog();
}
function renderStrip(){
  const t=todayISO();
  $("activeName").textContent=prog.id?prog.name:"None. Activate one in Library.";
  $("loopTitle").textContent=loopName(viewLoop)+" · "+fmtDate(loopDates(viewLoop)[0])+" – "+fmtDate(loopDates(viewLoop)[L()-1])+(isDeload(viewLoop)?" · lighter":"");
  const strip=$("strip");strip.innerHTML="";
  loopDates(viewLoop).forEach(dt=>{
    const d=prog.days.find(x=>x.id===slotFor(dt)),[cls,txt]=cellStatus(dt);
    const b=document.createElement("button");b.className="cell"+(dt===t?" today":"");b.setAttribute("aria-pressed",dt===date);
    const a=document.createElement("span");a.className="d";a.textContent=wdShort(dt)+" "+D(dt).getDate();
    const bb=document.createElement("b");bb.textContent=d?(d.label||d.name):"Rest";
    const s=document.createElement("span");s.className="s "+cls;s.textContent=txt;
    b.append(a,bb,s);b.setAttribute("aria-label",fmtDate(dt)+", "+(d?d.name:"Rest")+", "+txt);
    b.onclick=()=>goToDate(dt);strip.appendChild(b);
  });
  const sel=strip.querySelector('[aria-pressed="true"]');if(sel)sel.scrollIntoView({block:"nearest",inline:"nearest"});
}
function renderDays(){
  const nav=$("days");nav.innerHTML="";
  const lab=document.createElement("span");lab.className="lab";lab.textContent="Log:";nav.appendChild(lab);
  [...prog.days.map(d=>[d.id,d.label||d.name]),["rest","Rest"]].forEach(([id,txt])=>{
    const b=document.createElement("button");b.textContent=txt;b.setAttribute("aria-pressed",id===dayId);
    b.onclick=()=>{dayId=id;renderLog()};nav.appendChild(b);
  });
  if(profile.workouts.length){
    const s=document.createElement("select");s.id="oneoff";s.setAttribute("aria-label","Log a one-off workout from your library");
    const o0=document.createElement("option");o0.value="";o0.textContent="One-off…";s.appendChild(o0);
    profile.workouts.forEach(w=>{const o=document.createElement("option");o.value=w.id;o.textContent=w.name;s.appendChild(o)});
    if(!inProgram(dayId)&&profile.workouts.some(w=>w.id===dayId)){s.value=dayId;s.classList.add("on")}
    s.onchange=()=>{if(s.value){dayId=s.value;renderLog()}};nav.appendChild(s);
  }
}
function currentWorkout(){
  if(dayId==="rest")return null;
  return getDay(dayId)||ghostFromEntry(findSession(date,dayId)[1]);
}
function loadDraft(day){
  const s=findSession(date,day?day.id:"rest")[1];
  const dl=day&&inProgram(day.id)&&isDeload(loopIdx(date)), dSets=+prog.settings.deloadSets||3;
  draft={};
  (day?day.ex:[]).forEach(e=>{
    const saved=(s&&s.sets&&s.sets[e.id])||[];
    const n=Math.max(saved.length, dl?Math.min(e.sets,dSets):e.sets);
    draft[e.id]=Array.from({length:n},(_,i)=>({w:saved[i]?.w||"",r:saved[i]?.r||"",d:saved[i]?.d||"",p:saved[i]?.p||""}));
  });
  $("note").value=s?.note||"";renderMeasures(s);
  return s;
}
function renderLog(preserve){
  if(dayId!=="rest"&&!currentWorkout())dayId="rest";
  renderStrip();renderDays();
  $("loopLabel").textContent=prog.id?loopName(loopIdx(date))+", day "+(loopPos(date)+1)+" of "+L():"No active program";
  const day=currentWorkout();
  const list=$("exList");list.innerHTML="";
  const keepC=preserve?readCardio():null;const keepM=preserve?readMeasures():null;
  const s=preserve?findSession(date,day?day.id:"rest")[1]:loadDraft(day);
  const oneOff=day&&!inProgram(day.id);
  $("dayTitle").textContent=day?day.name:"Rest day";
  const planned=slotFor(date),pd=prog.days.find(x=>x.id===planned);
  const tag=oneOff?" · one-off":"";
  $("daySub").textContent=fmtDate(date)+tag+(s?" · saved":" · not logged yet")+((planned||"rest")!==dayId&&prog.id?" · planned: "+(pd?pd.name:"Rest"):"");
  const dl=day&&!oneOff&&isDeload(loopIdx(date));$("deload").hidden=!dl;
  $("deload").textContent="Lighter loop: "+(+prog.settings.deloadSets||3)+" sets per exercise at your current weights.";
  if(!day){list.innerHTML='<div class="empty">'+(prog.id?"Recovery day. Log body weight or a note if you like, or pick a workout above to train anyway.":"No active program. Pick a one-off workout above, or activate a program in Library.")+'</div>'}
  else if(!day.ex.length){list.innerHTML='<div class="empty">No exercises in this workout yet. Add them in Library.</div>'}
  const letters=day?groupLetters(day):{};const pos={};let block=null,prevG=null;
  (day?day.ex:[]).forEach(e=>{
    const v=verdict(e);
    const card=document.createElement("div");card.className="ex";
    let tag="";
    if(e.group){pos[e.group]=(pos[e.group]||0)+1;tag=letters[e.group]+pos[e.group]}
    card.innerHTML=`<div class="exhead"><div><h3></h3><div class="rx num"></div></div><span class="chip ${v.cls}"></span></div>
      <div class="sets"></div>
      <div class="setbtns"><button class="ghost addset">+ Set</button><button class="ghost rmset">− Set</button></div>`;
    const h3=card.querySelector("h3");
    if(tag){const t=document.createElement("span");t.className="sstag";t.textContent=tag;h3.appendChild(t)}
    h3.append(e.name);
    const rxBits=[e.sets+(rx(e)?" × "+rx(e):" sets")];if(e.dist)rxBits.push("distance ("+e.distUnit+")");if(e.pace)rxBits.push("pace");
    card.querySelector(".rx").textContent=rxBits.join(" · ");
    card.querySelector(".chip").textContent=v.text;
    const cols=[];
    if(e.weight)cols.push(["w","Weight ("+U()+")"]);
    if(e.unit==="reps")cols.push(["r","Reps"]);
    if(e.unit==="sec")cols.push(["r","Time"]);
    if(e.dist)cols.push(["d","Dist ("+e.distUnit+")"]);
    if(e.pace)cols.push(["p","Pace /"+e.distUnit]);
    if(!cols.length)cols.push(["r","Reps"]);
    const grid=card.querySelector(".sets");grid.style.gridTemplateColumns="2rem repeat("+cols.length+",minmax(0,1fr))";
    const hd=document.createElement("span");hd.className="h";hd.style.textAlign="center";hd.textContent="Set";grid.appendChild(hd);
    cols.forEach(([,lab])=>{const x=document.createElement("span");x.className="h";x.textContent=lab;grid.appendChild(x)});
    draft[e.id].forEach((st,i)=>{
      const n=document.createElement("span");n.className="n";n.textContent=i+1;grid.appendChild(n);
      const inputs={};
      const autoPace=()=>{const pi=inputs.p;if(!pi)return;const t=+st.r,d=+st.d;pi.placeholder=(e.unit==="sec"&&t>0&&d>0)?fmtPace(t/d):"m:ss"};
      cols.forEach(([k,lab])=>{
        const el=document.createElement("input");el.id=`${k}-${e.id}-${i}`;el.setAttribute("aria-label",e.name+" set "+(i+1)+" "+lab.toLowerCase());
        if(k==="w"){el.type="number";el.inputMode="decimal";el.min=0;el.step="any";el.value=st.w;el.placeholder=v.w!=null?v.w:"–";
          el.oninput=()=>{st.w=el.value===""?"":+el.value};
          el.onfocus=()=>{if(el.value===""&&i>0&&draft[e.id][i-1].w!==""){el.value=draft[e.id][i-1].w;st.w=+el.value}}}
        else if(k==="r"&&e.unit==="sec"){el.type="text";el.inputMode="decimal";el.value=st.r===""?"":fmtDur(st.r);el.placeholder=e.hi?fmtDur(e.hi):"m:ss";
          el.onchange=()=>{const t=parseTime(el.value);st.r=t;el.value=t===""?"":fmtDur(t);mark();autoPace()}}
        else if(k==="r"){el.type="number";el.inputMode="numeric";el.min=0;el.step=1;el.value=st.r;el.placeholder=e.hi||"";el.oninput=()=>{st.r=el.value===""?"":+el.value;mark()}}
        else if(k==="d"){el.type="number";el.inputMode="decimal";el.min=0;el.step="any";el.value=st.d;el.placeholder="0.0";el.oninput=()=>{st.d=el.value===""?"":+el.value;autoPace()}}
        else if(k==="p"){el.type="text";el.inputMode="decimal";el.value=st.p===""?"":fmtPace(st.p);
          el.onchange=()=>{const t=parseTime(el.value);st.p=t;el.value=t===""?"":fmtPace(t)}}
        inputs[k]=el;grid.appendChild(el);
      });
      function mark(){const r=inputs.r;if(r&&e.unit==="reps")r.classList.toggle("hit",e.hi>0&&r.value!==""&&+r.value>=+e.hi);if(r&&e.unit==="sec")r.classList.toggle("hit",e.hi>0&&+st.r>=+e.hi)}
      mark();autoPace();
    });
    card.querySelector(".addset").onclick=()=>{draft[e.id].push({w:"",r:"",d:"",p:""});renderLog(true)};
    const rm=card.querySelector(".rmset");rm.disabled=draft[e.id].length<=1;
    rm.onclick=()=>{draft[e.id].pop();renderLog(true)};
    if(e.group){
      if(e.group!==prevG){block=document.createElement("div");block.className="superset";
        const lb=document.createElement("div");lb.className="sslabel";lb.textContent=["Superset "+letters[e.group],ssRounds(e.sets),"one set of each, then rest"].filter(Boolean).join(" · ");block.appendChild(lb);list.appendChild(block)}
      block.appendChild(card);
    } else list.appendChild(card);
    prevG=e.group;
  });
  renderCardio(day,s);
  if(keepC)Object.entries(keepC).forEach(([k,v])=>{const el=$("c-"+k);if(el)el.value=v});
  if(preserve)renderMeasures(null,keepM);
  renderDelete(!!s);
  const inc=+profile.settings.inc,n=+prog.settings.deload;
  $("rules").innerHTML="";
  ["Stop each set 1 to 2 reps short of failure.",
   "Rest "+fmtSec(profile.settings.restB)+" on the first two lifts, "+fmtSec(profile.settings.restA)+" on the rest.",
   inc?"Every set hits the top of its range → add "+inc+" "+U()+" next session.":"Every set hits the top of its range → progress next session.",
   n&&prog.id?"Every "+(n===1?"":n+(n===2?"nd":n===3?"rd":"th")+" ")+"loop, drop to "+prog.settings.deloadSets+" sets per exercise.":null
  ].filter(Boolean).forEach(t=>{const li=document.createElement("li");li.textContent=t;$("rules").appendChild(li)});
  $("tA").textContent=fmtSec(profile.settings.restA);$("tB").textContent=fmtSec(profile.settings.restB);
}
function renderCardio(day,s){
  const cb=$("cardioBox");
  if(!day||!day.cardio||!day.cardio.on){cb.hidden=true;cb.innerHTML="";return}
  cb.hidden=false;const c=s?.cardio||{};
  cb.innerHTML=`<div class="exhead"><div><h3></h3><div class="rx"></div></div></div><div class="grid2"></div>`;
  cb.querySelector("h3").textContent=day.cardio.label||"Cardio";
  cb.querySelector(".rx").textContent=day.cardio.target||"";
  const iv=day.cardio.type==="intervals";
  const fields=iv?[["rounds","Rounds done"],["level","Hard level"],["hr","Peak HR (bpm)"]]:[["min","Minutes"],["level","Level"],["hr","Avg HR (bpm)"]];
  fields.forEach(([k,lab])=>{const Lb=document.createElement("label");Lb.className="field";Lb.textContent=lab;
    const I=document.createElement("input");I.type="number";I.inputMode="numeric";I.id="c-"+k;I.value=c[k]??"";I.className="num";Lb.appendChild(I);cb.querySelector(".grid2").appendChild(Lb)});
}
function renderMeasures(s,draftVals){
  const box=$("measures");box.innerHTML="";
  const on=profile.metrics.filter(m=>m.on);
  $("measBox").hidden=!on.length;
  on.forEach(m=>{
    const v=draftVals?draftVals[m.id]:(s?metricVal(s,m.id):null);
    const L=document.createElement("label");L.className="field";L.textContent=m.name+(mUnit(m)?" ("+mUnit(m)+")":"");
    if(m.kind==="bp"){
      const wrap=document.createElement("div");wrap.className="bpin";
      const a=document.createElement("input"),b=document.createElement("input");
      [a,b].forEach((x,i)=>{x.type="number";x.inputMode="numeric";x.min=0;x.className="num";x.id="m-"+m.id+(i?"-dia":"-sys");x.placeholder=i?"Dia":"Sys";x.setAttribute("aria-label",m.name+(i?" diastolic":" systolic"))});
      if(v){a.value=v.sys??"";b.value=v.dia??""}
      const sl=document.createElement("span");sl.textContent="/";wrap.append(a,sl,b);L.appendChild(wrap);
    } else {
      const i=document.createElement("input");i.type="number";i.inputMode="decimal";i.min=0;i.step="any";i.className="num";i.id="m-"+m.id;i.placeholder="–";
      if(v!=null&&v!=="")i.value=v;L.appendChild(i);
    }
    box.appendChild(L);
  });
}
function readMeasures(){
  const out={};
  profile.metrics.filter(m=>m.on).forEach(m=>{
    if(m.kind==="bp"){const a=$("m-"+m.id+"-sys"),b=$("m-"+m.id+"-dia");if(a&&b&&a.value!==""&&b.value!=="")out[m.id]={sys:+a.value,dia:+b.value}}
    else{const i=$("m-"+m.id);if(i&&i.value!=="")out[m.id]=+i.value}
  });
  return out;
}
function readCardio(){const c={};["rounds","level","hr","min"].forEach(k=>{const el=$("c-"+k);if(el&&el.value!=="")c[k]=+el.value});return c}
function renderDelete(exists){
  const w=$("delWrap");w.innerHTML="";
  if(!exists) return;
  const b=document.createElement("button");b.className="ghost danger";b.textContent="Delete entry";
  b.onclick=()=>{w.innerHTML='<span class="confirm">Delete this entry? <button class="danger" id="delYes">Delete</button><button class="ghost" id="delNo">Keep</button></span>';
    $("delNo").onclick=()=>renderDelete(true);$("delYes").onclick=deleteSession};
  w.appendChild(b);
}
async function saveSession(){
  const day=currentWorkout();
  const sets={},names={},units={},dunits={};
  (day?day.ex:[]).forEach(e=>{const arr=draft[e.id]||[];const f=arr.filter(x=>x.w!==""||x.r!==""||x.d!==""||x.p!=="");
    if(f.length){sets[e.id]=f.map(x=>{const o={w:x.w===""?0:+x.w,r:x.r===""?0:+x.r};
      if(e.dist||x.d!=="")o.d=x.d===""?0:+x.d;
      let p=x.p===""?0:+x.p;if(!p&&e.pace&&e.unit==="sec"&&o.r>0&&o.d>0)p=Math.round(o.r/o.d);if(p)o.p=p;return o});
      names[e.id]=e.name;if(e.unit!=="reps")units[e.id]=e.unit;if(e.dist)dunits[e.id]=e.distUnit}});
  const oneOff=day&&!inProgram(day.id);
  const prior=findSession(date,day?day.id:"rest")[1];
  const data={kind:"session",date,day:day?day.id:"rest",dayName:day?day.name:"Rest",
    programName:oneOff?"One-off":(prog.name||""),programId:oneOff?"":(prog.id||""),
    loop:loopIdx(date)+1,unit:U(),sets,names,units,dunits,note:$("note").value.trim(),savedAt:new Date().toISOString()};
  if(day&&day.ghost&&prior){data.programName=prior.programName||"";data.programId=prior.programId||""}
  const meas=readMeasures();
  /* keep values for measurements that are switched off, so turning one off never erases history */
  const keep=prior&&prior.m?Object.fromEntries(Object.entries(prior.m).filter(([k])=>!profile.metrics.some(m=>m.on&&m.id===k))):{};
  if(meas.bw!=null)data.bw=meas.bw;else if(prior&&prior.bw&&!profile.metrics.some(m=>m.on&&m.id==="bw"))data.bw=prior.bw;
  delete meas.bw;const allM={...keep,...meas};if(Object.keys(allM).length)data.m=allM;
  if(day&&day.cardio&&day.cardio.on){data.cardio=readCardio();data.cardioType=day.cardio.type}
  if(!Object.keys(sets).length&&!data.note&&data.bw==null&&!data.m&&!Object.keys(data.cardio||{}).length){toast("Enter a set, a measurement or a note before saving");return}
  const id=findSession(date,data.day)[0];
  $("save").disabled=true;
  try{await persistSession(id,data);sessions[id]=data;toast(saveNote());setStatus();renderLog()}
  catch(e){toast(e&&e.code==="quota_exceeded"?"Log is full. Delete old entries to save new ones.":"Couldn’t save. Check your connection and try again.")}
  $("save").disabled=false;
}
async function deleteSession(){
  const id=findSession(date,dayId)[0];
  try{await removeSession(id);delete sessions[id];toast("Deleted");setStatus();renderLog()}
  catch(e){toast("Couldn’t delete. Try again.")}
}

/* ---------- charts ---------- */
function niceTicks(lo,hi,zero){if(zero)lo=0;if(hi===lo)hi=lo+(lo?lo*.1:10);const span=hi-lo;const step=[1,2,5,10,20,25,50,100,200,250,500,1000,2000,2500,5000,10000,20000,25000,50000,100000].find(s=>span/s<=5)||200000;const a=Math.floor(lo/step)*step,b=Math.ceil(hi/step)*step;const t=[];for(let v=a;v<=b+1e-9;v+=step)t.push(+v.toFixed(2));return t}
const fmtN=v=>v>=10000?(v/1000).toFixed(v>=100000?0:1)+"k":String(+v.toFixed(1));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function svgWrap(W,H,g,label){return `<div class="tablewrap"><svg viewBox="0 0 ${W} ${H}" width="100%" style="min-width:320px" role="img" aria-label="${esc(label)}">${g}</svg></div>`}
function lineChart(series,labels,unit,label,zero){
  const W=640,H=220,Lm=48,R=14,T=20,B=30,n=labels.length;
  const all=series.flatMap(s=>s.vals).filter(v=>v!=null);
  const ticks=niceTicks(Math.min(...all),Math.max(...all),zero);const y0=ticks[0],y1=ticks[ticks.length-1];
  const x=i=>n===1?(Lm+W-R)/2:Lm+(W-Lm-R)*(i/(n-1));
  const y=v=>T+(H-T-B)*(1-(v-y0)/((y1-y0)||1));
  let g="";
  ticks.forEach(t=>{g+=`<line x1="${Lm}" x2="${W-R}" y1="${y(t)}" y2="${y(t)}" stroke="var(--line)" stroke-width="1"/><text x="${Lm-6}" y="${y(t)+4}" text-anchor="end">${fmtN(t)}</text>`});
  const every=Math.ceil(n/6);
  labels.forEach((l,i)=>{if((i%every===0&&(n-1-i)>=every*.6)||i===n-1)g+=`<text x="${x(i)}" y="${H-8}" text-anchor="${n>1&&i===0?"start":n>1&&i===n-1?"end":"middle"}">${esc(l)}</text>`});
  series.forEach(s=>{
    const pts=s.vals.map((v,i)=>v==null?null:[x(i),y(v)]).filter(Boolean);if(!pts.length)return;
    const d=pts.map((p,i)=>(i?"L":"M")+p[0].toFixed(1)+" "+p[1].toFixed(1)).join(" ");
    if(s.area&&pts.length>1)g+=`<path d="${d} L${pts[pts.length-1][0].toFixed(1)} ${H-B} L${pts[0][0].toFixed(1)} ${H-B} Z" fill="var(--accent)" fill-opacity=".1"/>`;
    if(s.kind==="dash")g+=`<path d="${d}" fill="none" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="4 4"/>`+pts.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="2.5" fill="var(--muted)"/>`).join("");
    else{g+=`<path d="${d}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round"/>`;
      pts.forEach((p,i)=>g+=`<circle cx="${p[0]}" cy="${p[1]}" r="${i===pts.length-1?5:3}" fill="var(--accent)"/>`);
      const lv=s.vals.filter(v=>v!=null).pop(),lp=pts[pts.length-1];
      g+=`<text x="${W-R}" y="${Math.max(12,lp[1]-10)}" text-anchor="end" style="fill:var(--ink);font-weight:600">${fmtN(lv)}${unit?" "+esc(unit):""}</text>`}
  });
  return svgWrap(W,H,g,label);
}
function barChart(bars,unit,label){
  const W=640,H=210,Lm=48,R=10,T=20,B=30,n=bars.length;
  const mx=Math.max(1,...bars.map(b=>Math.max(b.value,b.planned||0)));
  const ticks=niceTicks(0,mx,true),y1=ticks[ticks.length-1];
  const slot=(W-Lm-R)/n,bw=Math.min(44,slot*.62);
  const y=v=>T+(H-T-B)*(1-v/y1);
  let g="";
  ticks.forEach(t=>{g+=`<line x1="${Lm}" x2="${W-R}" y1="${y(t)}" y2="${y(t)}" stroke="var(--line)" stroke-width="1"/><text x="${Lm-6}" y="${y(t)+4}" text-anchor="end">${fmtN(t)}</text>`});
  const every=Math.ceil(n/8);
  bars.forEach((b,i)=>{
    const cx=Lm+slot*i+slot/2;
    if(b.planned)g+=`<rect x="${cx-bw/2}" y="${y(b.planned)}" width="${bw}" height="${y(0)-y(b.planned)}" rx="3" fill="var(--sunk)" stroke="var(--line)"/>`;
    if(b.value>0)g+=`<rect x="${cx-bw/2+(b.planned?4:0)}" y="${y(b.value)}" width="${bw-(b.planned?8:0)}" height="${y(0)-y(b.value)}" rx="2" fill="var(--accent)"/>`;
    if(b.value>0||b.planned)g+=`<text x="${cx}" y="${y(Math.max(b.value,b.planned||0))-5}" text-anchor="middle" style="fill:var(--ink)">${b.planned?b.value+"/"+b.planned:fmtN(b.value)}</text>`;
    if(i%every===0||i===n-1)g+=`<text x="${cx}" y="${H-8}" text-anchor="middle">${esc(b.label)}</text>`;
  });
  return svgWrap(W,H,g,label);
}

/* ---------- progress view ---------- */
function setProgTab(t){progTab=t;$("pOver").setAttribute("aria-pressed",t==="over");$("pEx").setAttribute("aria-pressed",t==="ex");$("overPane").hidden=t!=="over";$("exPane").hidden=t!=="ex";renderProgress()}
function renderProgress(){if(progTab==="over")renderOverview();else{renderPick();renderChart()}}
function renderOverview(){
  const cur=loopIdx(todayISO());
  const first=Math.max(0,Math.min(cur,...sortedSessions().map(s=>loopIdx(s.date))));
  const lo=Math.max(first,cur-11),idxs=[];for(let i=lo;i<=cur;i++)idxs.push(i);
  const plannedPerLoop=prog.loop.slots.filter(Boolean).length;
  const per=idxs.map(i=>{const ds=new Set(loopDates(i));const ss=Object.values(sessions).filter(s=>ds.has(s.date));
    const wdates=new Set(ss.filter(s=>s.day!=="rest").map(s=>s.date));
    let vol=0,min=0,rounds=0;ss.forEach(s=>{Object.entries(s.sets||{}).forEach(([id,arr])=>{if(unitOf(s,id)==="reps")arr.forEach(x=>vol+=(+x.w||0)*(+x.r||0))});if(s.cardio){min+=+s.cardio.min||0;rounds+=+s.cardio.rounds||0}});
    return {i,done:wdates.size,vol,min,rounds}});
  const labs=per.map(p=>"L"+(p.i+1));
  const any=Object.keys(sessions).length>0;
  $("cAdh").innerHTML=any?barChart(per.map(p=>({label:"L"+(p.i+1),value:p.done,planned:plannedPerLoop})),"","Workouts completed per loop"):'<div class="empty">Log your first workout to start tracking loops.</div>';
  $("capVol").textContent="Sum of weight × reps across all lifts ("+U()+").";
  $("cVol").innerHTML=per.some(p=>p.vol>0)?barChart(per.map(p=>({label:"L"+(p.i+1),value:Math.round(p.vol)})),U(),"Training volume per loop"):'<div class="empty">Volume appears once you log weighted sets.</div>';
  $("cCardio").innerHTML=per.some(p=>p.min||p.rounds)?lineChart([{vals:per.map(p=>p.min||null),kind:"line"},{vals:per.map(p=>p.rounds||null),kind:"dash"}],labs,"","Cardio per loop",true):'<div class="empty">Cardio appears once you log minutes or rounds.</div>';
  renderMetricChart();
  renderLoopTable(idxs.slice().reverse());
}
function renderMetricChart(){
  const sel=$("mPick"),cur=sel.value;sel.innerHTML="";
  const withData=profile.metrics.filter(m=>m.on||sortedSessions().some(s=>metricVal(s,m.id)!=null));
  withData.forEach(m=>{const o=document.createElement("option");o.value=m.id;o.textContent=m.name;sel.appendChild(o)});
  sel.value=withData.some(m=>m.id===cur)?cur:(withData[0]?withData[0].id:"");
  const m=profile.metrics.find(x=>x.id===sel.value),box=$("cBw"),st=$("mStats"),lg=$("mLegend");st.innerHTML="";lg.innerHTML="";
  if(!m){box.innerHTML='<div class="empty">Turn on a measurement in Library to chart it here.</div>';return}
  const byDate=new Map();sortedSessions().forEach(s=>{const v=metricVal(s,m.id);if(v!=null)byDate.set(s.date,v)});
  const arr=[...byDate.entries()].slice(-40);
  if(arr.length<2){box.innerHTML='<div class="empty">'+(arr.length?"One "+esc(m.name.toLowerCase())+" entry logged. The trend appears after your second.":"Log "+esc(m.name.toLowerCase())+" on any entry to see the trend.")+'</div>';
    if(arr.length)st.textContent="Latest: "+fmtMetric(m,arr[0][1]);return}
  const labels=arr.map(x=>fmtDate(x[0]));
  if(m.kind==="bp"){
    lg.innerHTML='<span><i></i>Systolic</span><span><i class="d"></i>Diastolic</span>';
    box.innerHTML=lineChart([{vals:arr.map(x=>x[1].sys),kind:"line"},{vals:arr.map(x=>x[1].dia),kind:"dash"}],labels,mUnit(m),m.name+" over time");
  } else box.innerHTML=lineChart([{vals:arr.map(x=>+x[1]),kind:"line",area:true}],labels,mUnit(m),m.name+" over time");
  const first=arr[0],last=arr[arr.length-1];
  const tile=(lab,val,cls)=>{const d=document.createElement("div");d.className="mstat";const a=document.createElement("span");a.className="eyebrow";a.textContent=lab;const b=document.createElement("b");b.className="num"+(cls?" "+cls:"");b.textContent=val;d.append(a,b);st.appendChild(d)};
  tile("First · "+fmtDate(first[0]),fmtMetric(m,first[1]));tile("Latest · "+fmtDate(last[0]),fmtMetric(m,last[1]));
  if(m.kind==="bp"){const ds=last[1].sys-first[1].sys,dd=last[1].dia-first[1].dia;tile("Change",(ds>0?"+":"")+ds+"/"+(dd>0?"+":"")+dd,(ds+dd)<0?"good":(ds+dd)>0?"warn":"")}
  else{const dlt=+(last[1]-first[1]).toFixed(2);const good=m.dir==="none"||!dlt?"":((m.dir==="down")===(dlt<0)?"good":"warn");tile("Change",(dlt>0?"+":"")+dlt+(mUnit(m)?" "+mUnit(m):""),good)}
}
function renderLoopTable(idxs){
  const h=$("loopTable");
  if(!prog.id){h.innerHTML='<div class="empty">Activate a program to see loop history.</div>';return}
  const heads=prog.loop.slots.map(s=>{const d=prog.days.find(x=>x.id===s);return d?(d.label||d.name):"Rest"});
  let html='<div class="tablewrap"><table><thead><tr><th>Loop</th>'+heads.map(x=>`<th class="c">${esc(x)}</th>`).join("")+'<th class="r">Done</th></tr></thead><tbody>';
  idxs.forEach(i=>{
    const ds=loopDates(i);let done=0,plan=0;
    const cells=ds.map(dt=>{const [cls,txt]=cellStatus(dt);if(slotFor(dt)!=="rest")plan++;if(cls==="done")done++;
      const sym=cls==="done"?"✓":cls==="miss"?"✕":cls==="rest"?"·":"○";return `<td class="c"><span class="mk ${cls}" title="${fmtDate(dt)}: ${txt}">${sym}</span></td>`}).join("");
    html+=`<tr><td>L${i+1} <span class="muted">${fmtDate(ds[0])}</span>${isDeload(i)?' <span class="muted">lighter</span>':""}</td>${cells}<td class="num">${done}/${plan}</td></tr>`;
  });
  html+='</tbody></table></div><div class="muted" style="font-size:.8rem;margin-top:6px">✓ done · ✕ missed · ○ upcoming · · rest</div>';
  h.innerHTML=html;
}
function allExercises(){
  const m=new Map();
  const add=(e,group)=>{if(!m.has(e.id))m.set(e.id,{id:e.id,name:e.name,unit:e.unit,weight:e.weight,dist:e.dist,distUnit:e.distUnit,pace:e.pace,group})};
  prog.days.forEach(d=>d.ex.forEach(e=>add(e,(prog.name||"Program")+" · "+d.name)));
  profile.workouts.forEach(w=>w.ex.forEach(e=>add(e,"Library · "+w.name)));
  profile.programs.forEach(p=>p.days.forEach(d=>d.ex.forEach(e=>add(e,p.name+" · "+d.name))));
  sortedSessions().forEach(s=>Object.keys(s.sets||{}).forEach(id=>{if(!m.has(id))m.set(id,{id,name:(s.names&&s.names[id])||id,unit:(s.units&&s.units[id])||"reps",weight:true,dist:!!(s.dunits&&s.dunits[id]),distUnit:(s.dunits&&s.dunits[id])||"mi",group:"No longer in a workout"})}));
  return [...m.values()];
}
function renderPick(){
  const sel=$("exPick"),cur=sel.value;sel.innerHTML="";
  const groups={};allExercises().forEach(e=>{(groups[e.group]=groups[e.group]||[]).push(e)});
  Object.entries(groups).forEach(([g,list])=>{const og=document.createElement("optgroup");og.label=g;
    list.forEach(e=>{const o=document.createElement("option");o.value=e.id;o.textContent=e.name;og.appendChild(o)});sel.appendChild(og)});
  const ids=allExercises().map(e=>e.id);sel.value=ids.includes(cur)?cur:(ids[0]||"");
}
function seriesFor(exId){
  return sortedSessions().filter(s=>s.sets&&s.sets[exId]).map(s=>{
    const sets=s.sets[exId].filter(hasData);if(!sets.length)return null;
    const top=sets.reduce((a,b)=>(+b.w>+a.w||(+b.w===+a.w&&+b.r>+a.r))?b:a);
    const e1=Math.max(...sets.map(x=>(+x.w)*(1+(+x.r)/30)));
    const dist=sets.reduce((a,x)=>a+(+x.d||0),0),time=sets.reduce((a,x)=>a+(+x.r||0),0);
    const paces=sets.filter(x=>+x.p>0);const pace=dist>0&&time>0&&unitOf(s,exId)==="sec"?time/dist:(paces.length?paces.reduce((a,x)=>a+(+x.p),0)/paces.length:0);
    return {date:s.date,top:+top.w,reps:+top.r,best:Math.max(...sets.map(x=>+x.r||0)),e1rm:Math.round(e1),vol:sets.reduce((a,x)=>a+(+x.w)*(+x.r),0),n:sets.length,dist,time,pace,prog:s.programName||""};
  }).filter(Boolean);
}
function renderChart(){
  const id=$("exPick").value, box=$("chart");
  const e=allExercises().find(x=>x.id===id);
  if(!e){box.innerHTML='<div class="empty">No exercises yet.</div>';$("history").innerHTML="";return}
  const pts=seriesFor(id);
  const mode=e.dist?"dist":(e.weight&&e.unit==="reps")?"weight":e.unit==="sec"?"time":"reps";
  const lg={dist:["Distance per session ("+e.distUnit+")",e.pace||e.unit==="sec"?"Pace (min per "+e.distUnit+")":""],weight:["Top set weight ("+U()+")","Estimated 1RM, Epley ("+U()+")"],time:["Longest set (seconds)",""],reps:["Most reps in a set",""]}[mode];
  $("lgTop").textContent=lg[0];$("lgE1").textContent=lg[1];$("lgE1").parentElement.hidden=!lg[1]||mode==="dist";
  if(mode!=="weight"){
    if(pts.length<2){box.innerHTML='<div class="empty">'+(pts.length?"One session logged. The trend appears after your second.":"No sets logged for "+esc(e.name)+" yet.")+'</div>';renderHistory(pts,e,mode);return}
    const labels=pts.map(p=>fmtDate(p.date));
    let html=mode==="dist"?lineChart([{vals:pts.map(p=>+p.dist.toFixed(2)),kind:"line",area:true}],labels,e.distUnit,e.name+" distance per session",true)
      :lineChart([{vals:pts.map(p=>p.best),kind:"line",area:true}],labels,mode==="time"?"sec":"reps",e.name+" best set",true);
    if(mode==="dist"&&pts.filter(p=>p.pace>0).length>=2){
      html+='<div class="cap">'+esc(lg[1])+'. Lower is faster.</div>'+lineChart([{vals:pts.map(p=>p.pace>0?+(p.pace/60).toFixed(2):null),kind:"dash"}],labels,"min",e.name+" pace per session")}
    box.innerHTML=html;renderHistory(pts,e,mode);return}
  if(pts.length<2){box.innerHTML='<div class="empty">'+(pts.length?"One session logged. The trend line appears after your second.":"No sets logged for "+esc(e.name)+" yet.")+'</div>';renderHistory(pts,e,mode);return}
  box.innerHTML=lineChart([{vals:pts.map(p=>p.top),kind:"line",area:true},{vals:pts.map(p=>p.e1rm),kind:"dash"}],pts.map(p=>fmtDate(p.date)),U(),e.name+" top set weight over time");
  renderHistory(pts,e,mode);
}
function renderHistory(pts,e,mode){
  const h=$("history");
  if(!pts.length){h.innerHTML='<div class="empty">No history yet.</div>';return}
  let cols;
  if(mode==="dist")cols=[["Distance "+e.distUnit,p=>fmtDist(p.dist)],...(e.unit==="sec"?[["Time",p=>fmtDur(p.time)]]:[]),...(e.pace||e.unit==="sec"?[["Pace /"+e.distUnit,p=>fmtPace(p.pace)||"–"]]:[]),...(e.weight?[["Top "+U(),p=>p.top]]:[])];
  else if(mode==="weight")cols=[["Top "+U(),p=>p.top],["Reps",p=>p.reps],["e1RM",p=>p.e1rm],["Volume "+U(),p=>p.vol.toLocaleString()]];
  else if(mode==="time")cols=[["Best",p=>fmtDur(p.best)],...(e.weight?[["Top "+U(),p=>p.top]]:[])];
  else cols=[["Best reps",p=>p.best],...(e.weight?[["Top "+U(),p=>p.top]]:[])];
  cols.push(["Sets",p=>p.n]);
  const rows=pts.slice().reverse().map(p=>`<tr><td>${fmtDate(p.date)} <span class="muted">${esc(p.prog)}</span></td>${cols.map(([,f])=>`<td class="num">${esc(f(p))}</td>`).join("")}</tr>`).join("");
  h.innerHTML=`<div class="tablewrap"><table><thead><tr><th>Date</th>${cols.map(([t])=>`<th class="r">${esc(t)}</th>`).join("")}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

/* ---------- archive ---------- */
function setsSummary(arr,unit,du){
  const xs=arr.filter(x=>hasData(x)||+x.w>0);
  const fmt=x=>{const b=[];
    const main=unit==="sec"?fmtDur(x.r):unit==="none"?"":(+x.r?String(x.r):"");
    if(+x.w&&main)b.push(x.w+"×"+main);else if(+x.w)b.push(x.w+" "+U());else if(main)b.push(main+(unit==="reps"?" reps":""));
    if(+x.d)b.push(fmtDist(x.d)+" "+(du||""));
    if(+x.p)b.push(fmtPace(x.p)+"/"+(du||"unit"));
    return b.join(" · ")};
  const f=xs.map(fmt);const same=f.length>1&&f.every(t=>t===f[0]);
  return same?f.length+" × "+f[0]:f.join(", ");
}
function renderArchive(){
  const all=sortedSessions().slice().reverse();
  const progs=[...new Set(all.map(s=>s.programName||"").filter(Boolean))];
  const pf=$("archProg"),cur=pf.value;pf.innerHTML="";
  [["","All programs and one-offs"],...progs.map(p=>[p,p])].forEach(([v,t])=>{const o=document.createElement("option");o.value=v;o.textContent=t;pf.appendChild(o)});
  pf.value=progs.includes(cur)?cur:"";
  const showRest=$("archRest").checked;
  const list=all.filter(s=>(showRest||s.day!=="rest")&&(!pf.value||s.programName===pf.value));
  const box=$("archList");box.innerHTML="";
  const nW=all.filter(s=>s.day!=="rest").length;
  $("archCount").textContent=list.length+" shown · "+nW+" workout"+(nW===1?"":"s")+" total";
  if(!list.length){box.innerHTML='<div class="empty">'+(all.length?"No days match this filter.":"Days you log will appear here, newest first.")+'</div>';return}
  let month="";
  list.forEach(s=>{
    const m=D(s.date).toLocaleDateString(undefined,{month:"long",year:"numeric"});
    if(m!==month){month=m;const h=document.createElement("h3");h.className="archmonth";h.textContent=m;box.appendChild(h)}
    const det=document.createElement("details");det.className="archday";
    const sum=document.createElement("summary");
    const left=document.createElement("div");left.className="al";
    const dt=document.createElement("div");dt.className="ad num";dt.textContent=D(s.date).toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"})+(s.programName&&s.programName!=="One-off"&&s.loop?" · L"+s.loop:"");
    const nm=document.createElement("div");nm.className="an";nm.textContent=s.day==="rest"?(Object.keys(s.sets||{}).length?"Rest day":"Rest day · measurements"):(s.dayName||"Workout");
    const pg=document.createElement("div");pg.className="ap";pg.textContent=s.programName==="One-off"?"One-off workout":s.programName?"Program: "+s.programName:"Program: not recorded";
    left.append(dt,nm,pg);
    let nSets=0,vol=0;Object.entries(s.sets||{}).forEach(([id,arr])=>arr.forEach(x=>{if(hasData(x)){nSets++;if(unitOf(s,id)==="reps")vol+=(+x.w||0)*(+x.r||0)}}));
    const right=document.createElement("div");right.className="ar num";
    right.textContent=s.day==="rest"?entryMeasures(s).slice(0,2).map(([m,v])=>fmtMetric(m,v)).join(" · "):nSets+" set"+(nSets===1?"":"s")+(vol?" · "+Math.round(vol).toLocaleString()+" "+(s.unit||U()):"");
    sum.append(left,right);det.appendChild(sum);
    det.ontoggle=()=>{if(!det.open||det.dataset.built)return;det.dataset.built="1";
      const body=document.createElement("div");body.className="abody";
      const ex=Object.entries(s.sets||{});
      if(ex.length){const t=document.createElement("table");t.innerHTML='<thead><tr><th>Exercise</th><th>Sets</th></tr></thead>';const tb=document.createElement("tbody");
        ex.forEach(([id,arr])=>{const tr=document.createElement("tr");const a=document.createElement("td");a.textContent=(s.names&&s.names[id])||(allExercises().find(e=>e.id===id)||{}).name||id;
          const b=document.createElement("td");b.className="num";b.textContent=setsSummary(arr,unitOf(s,id),distUnitOf(s,id));tr.append(a,b);tb.appendChild(tr)});
        t.appendChild(tb);const w=document.createElement("div");w.className="tablewrap";w.appendChild(t);body.appendChild(w)}
      const facts=[];
      if(s.cardio&&Object.keys(s.cardio).length){const c=s.cardio;facts.push("Cardio: "+[c.min!=null?c.min+" min":null,c.rounds!=null?c.rounds+" rounds":null,c.level!=null?"level "+c.level:null,c.hr!=null?c.hr+" bpm":null].filter(Boolean).join(", "))}
      entryMeasures(s).forEach(([m,v])=>facts.push(m.name+": "+fmtMetric(m,v)));
      facts.forEach(f=>{const p=document.createElement("div");p.className="muted";p.textContent=f;body.appendChild(p)});
      if(s.note){const q=document.createElement("blockquote");q.textContent=s.note;body.appendChild(q)}
      if(!ex.length&&!facts.length&&!s.note){const p=document.createElement("div");p.className="muted";p.textContent="Nothing recorded beyond the date.";body.appendChild(p)}
      const op=document.createElement("button");op.textContent="Open in Log";op.onclick=()=>{setView("log");dayId=s.day;date=s.date;$("date").value=s.date;viewLoop=loopIdx(s.date);renderLog();window.scrollTo({top:0})};
      body.appendChild(op);det.appendChild(body)};
    box.appendChild(det);
  });
}

/* ---------- XML (programs, workouts, profiles) ---------- */
function xel(doc,parent,tag,attrs){const e=doc.createElement(tag);Object.entries(attrs||{}).forEach(([k,v])=>{if(v!==undefined&&v!==null&&v!=="")e.setAttribute(k,String(v))});parent.appendChild(e);return e}
function authorAttrs(o){return {author:o.authorId===profile.me.id?(profile.me.name||o.author):o.author,authorId:o.authorId,created:o.created,basedOn:o.basedOn}}
const readAuthor=el=>({author:xA(el,"author")||"",authorId:xA(el,"authorId")||"",created:xA(el,"created")||"",basedOn:xA(el,"basedOn")||""});
function workoutFileXML(w){
  const doc=document.implementation.createDocument(null,"herculean-workout",null);
  doc.documentElement.setAttribute("version","1");doc.documentElement.setAttribute("exported",new Date().toISOString());
  workoutToXML(doc,doc.documentElement,w);return serializeXML(doc);
}
/* expert-library style program: workouts are separate files, referenced by id and path */
function programRefXML(p,dir,files){
  const doc=document.implementation.createDocument(null,"herculean-program",null),r=doc.documentElement;
  r.setAttribute("version","1");
  const e=xel(doc,r,"program",{id:p.id,name:p.name,...authorAttrs(p),deload:p.deload,deloadSets:p.deloadSets});
  const lp=xel(doc,e,"loop",{len:p.loop.len,start:p.loop.start});p.loop.slots.forEach((w,i)=>xel(doc,lp,"slot",{index:i,workout:w}));
  p.days.forEach(w=>xel(doc,e,"workout",{ref:w.id,src:(dir||"workouts/")+((files&&files[w.id])||w.id)+".xml"}));return serializeXML(doc);
}
function workoutToXML(doc,parent,w){
  const e=xel(doc,parent,"workout",{id:w.id,label:w.label,name:w.name,...authorAttrs(w)});
  xel(doc,e,"cardio",{on:w.cardio.on?"true":"false",type:w.cardio.type,label:w.cardio.label,target:w.cardio.target});
  w.ex.forEach(x=>xel(doc,e,"exercise",{id:x.id,name:x.name,sets:x.sets,lo:x.lo,hi:x.hi,unit:x.unit,weight:x.weight?"true":"false",dist:x.dist?"true":"",distUnit:x.dist?x.distUnit:"",pace:x.pace?"true":"",group:x.group}));return e;
}
function programToXML(doc,parent,p){
  const e=xel(doc,parent,"program",{id:p.id,name:p.name,...authorAttrs(p),deload:p.deload,deloadSets:p.deloadSets});
  const lp=xel(doc,e,"loop",{len:p.loop.len,start:p.loop.start});
  p.loop.slots.forEach((w,i)=>xel(doc,lp,"slot",{index:i,workout:w}));
  p.days.forEach(w=>workoutToXML(doc,e,w));return e;
}
const serializeXML=doc=>'<?xml version="1.0" encoding="UTF-8"?>\n'+new XMLSerializer().serializeToString(doc).replace(/></g,">\n<");
function programFileXML(p){
  const doc=document.implementation.createDocument(null,"herculean-program",null);
  doc.documentElement.setAttribute("version","1");doc.documentElement.setAttribute("exported",new Date().toISOString());
  programToXML(doc,doc.documentElement,p);return serializeXML(doc);
}
const xA=(e,k)=>e.getAttribute(k), xN=(e,k)=>{const v=e.getAttribute(k);return v===null||v===""?undefined:+v};
/* files made before the rename use "ironlog" tags; both are read */
const xKind=r=>r.nodeName.replace(/^ironlog/,"herculean");
const xKids=(e,tag)=>[...e.children].filter(c=>c.nodeName===tag);
function parseWorkoutEl(w){const c=xKids(w,"cardio")[0];
  return sanitizeWorkout({...readAuthor(w),id:xA(w,"id"),label:xA(w,"label")||"",name:xA(w,"name")||"",
    cardio:c?{on:xA(c,"on")==="true",type:xA(c,"type")||"steady",label:xA(c,"label")||"",target:xA(c,"target")||""}:C(false),
    ex:xKids(w,"exercise").map(e=>({id:xA(e,"id"),name:xA(e,"name")||"",sets:xN(e,"sets"),lo:xN(e,"lo"),hi:xN(e,"hi"),unit:xA(e,"unit"),weight:xA(e,"weight"),dist:xA(e,"dist"),distUnit:xA(e,"distUnit"),pace:xA(e,"pace"),group:xA(e,"group")}))})}
/* resolve(ref,src) returns a workout for <workout ref=… src=…/>, or null if it can’t be found */
function parseProgramEl(el,resolve){
  const lp=xKids(el,"loop")[0];const loop=lp?{len:xN(lp,"len"),start:xA(lp,"start"),slots:[]}:null;
  if(lp)xKids(lp,"slot").forEach(s=>loop.slots[xN(s,"index")]=xA(s,"workout")||"");
  const missing=[];
  const days=xKids(el,"workout").map(w=>{const ref=xA(w,"ref");if(!ref)return parseWorkoutEl(w);
    const found=resolve?resolve(ref,xA(w,"src")):null;if(!found){missing.push(ref);return null}
    const c=clone(found);c.id=ref;return c}).filter(Boolean);
  const p=sanitizeProgram({...readAuthor(el),id:xA(el,"id"),name:xA(el,"name"),deload:xN(el,"deload"),deloadSets:xN(el,"deloadSets"),loop,days});
  if(missing.length)p._missing=missing;
  return p;
}
const programRefs=el=>xKids(el,"workout").filter(w=>xA(w,"ref")).map(w=>[xA(w,"ref"),xA(w,"src")]);
/* expert-library paths (programs/…, workouts/…) are relative to the herculean/ folder beside herculean.html */
const HERC_BASE="herculean/";
async function fetchText(src){const r=await fetch(/^([a-z]+:|\/)/i.test(src)?src:HERC_BASE+src,{cache:"no-cache"});if(!r.ok)throw new Error(src+" ("+r.status+")");return r.text()}
async function fetchWorkout(src){const r=parseXMLText(await fetchText(src));const w=xKids(r,"workout")[0]||(r.nodeName==="workout"?r:null);if(!w)throw new Error(src+" isn’t a workout file");return parseWorkoutEl(w)}
function parseXMLText(text){
  const doc=new DOMParser().parseFromString(text,"application/xml");
  if(doc.querySelector("parsererror"))throw new Error("not-xml");
  return doc.documentElement;
}
/* full profile: used by the file version and by Import of a whole profile */
function profileToXML(pr,sess){
  const doc=document.implementation.createDocument(null,"herculean",null),root=doc.documentElement;
  root.setAttribute("version","4");root.setAttribute("saved",new Date().toISOString());
  xel(doc,root,"settings",pr.settings);
  xel(doc,root,"me",{id:pr.me.id,name:pr.me.name});
  const ms=xel(doc,root,"measurements");(pr.metrics||[]).forEach(m=>xel(doc,ms,"measure",{id:m.id,name:m.name,unit:m.unit,dir:m.dir,kind:m.kind,on:m.on?"true":"false"}));
  const ps=xel(doc,root,"programs",{active:pr.activeId});pr.programs.forEach(p=>programToXML(doc,ps,p));
  const lib=xel(doc,root,"library");pr.workouts.forEach(w=>workoutToXML(doc,lib,w));
  const es=xel(doc,root,"entries");
  Object.entries(sess).sort((a,b)=>a[1].date<b[1].date?-1:1).forEach(([id,s])=>{
    const en=xel(doc,es,"entry",{id,date:s.date,day:s.day,dayName:s.dayName,programName:s.programName,programId:s.programId,loop:s.loop,unit:s.unit,bw:s.bw,savedAt:s.savedAt});
    if(s.note){const n=xel(doc,en,"note");n.textContent=s.note}
    Object.entries(s.m||{}).forEach(([k,v])=>xel(doc,en,"value",typeof v==="object"?{of:k,sys:v.sys,dia:v.dia}:{of:k,v}));
    if(s.cardio&&Object.keys(s.cardio).length)xel(doc,en,"cardio",{type:s.cardioType,...s.cardio});
    Object.entries(s.sets||{}).forEach(([exId,arr])=>{const x=xel(doc,en,"exercise",{id:exId,name:s.names&&s.names[exId],unit:s.units&&s.units[exId],distUnit:s.dunits&&s.dunits[exId]});arr.forEach(st=>xel(doc,x,"set",{w:st.w,r:st.r,d:st.d,p:st.p}))});
  });
  return serializeXML(doc);
}
function profileFromXMLRoot(r){
  const settings={};const st=xKids(r,"settings")[0];
  if(st)[...st.attributes].forEach(a=>settings[a.name]=(a.name==="unit"||a.name==="progName")?a.value:+a.value);
  const meEl=xKids(r,"me")[0];
  let pr;
  const ps=xKids(r,"programs")[0];
  if(ps){
    pr={settings,activeId:xA(ps,"active"),programs:xKids(ps,"program").map(parseProgramEl),workouts:[]};
    const lib=xKids(r,"library")[0];if(lib)pr.workouts=xKids(lib,"workout").map(parseWorkoutEl);
    const mm=xKids(r,"measurements")[0];
    if(mm)pr.metrics=xKids(mm,"measure").map(x=>({id:xA(x,"id"),name:xA(x,"name"),unit:xA(x,"unit")??"",dir:xA(x,"dir"),kind:xA(x,"kind"),on:xA(x,"on")}));
    if(meEl)pr.me={id:xA(meEl,"id"),name:xA(meEl,"name")||""};
    pr=sanitizeProfile(pr);
  } else {
    /* older single-program file */
    const lp=xKids(r,"loop")[0];const loop=lp?{len:xN(lp,"len"),start:xA(lp,"start"),slots:[]}:null;
    if(lp)xKids(lp,"slot").forEach(s=>loop.slots[xN(s,"index")]=xA(s,"workout")||"");
    const ws=xKids(r,"workouts")[0];
    pr=profileFromLegacy({settings,loop,days:ws?xKids(ws,"workout").map(parseWorkoutEl):[]});
  }
  const out={};const es=xKids(r,"entries")[0];
  (es?xKids(es,"entry"):[]).forEach(en=>{
    const s={kind:"session",programName:xA(en,"programName")||"",programId:xA(en,"programId")||"",date:xA(en,"date"),day:xA(en,"day"),dayName:xA(en,"dayName")||"",loop:xN(en,"loop"),unit:xA(en,"unit")||"lb",savedAt:xA(en,"savedAt")||"",sets:{},names:{},units:{},dunits:{},note:""};
    if(xN(en,"bw")!=null)s.bw=xN(en,"bw");
    xKids(en,"value").forEach(v=>{const k=xA(v,"of");if(!k)return;s.m=s.m||{};s.m[k]=xA(v,"sys")!=null?{sys:xN(v,"sys"),dia:xN(v,"dia")}:xN(v,"v")});
    const n=xKids(en,"note")[0];if(n)s.note=n.textContent;
    const c=xKids(en,"cardio")[0];if(c){s.cardio={};[...c.attributes].forEach(a=>{if(a.name==="type")s.cardioType=a.value;else s.cardio[a.name]=+a.value})}
    xKids(en,"exercise").forEach(x=>{const id=xA(x,"id");s.sets[id]=xKids(x,"set").map(t=>{const o={w:xN(t,"w")||0,r:xN(t,"r")||0};if(xN(t,"d")!=null)o.d=xN(t,"d");if(xN(t,"p")!=null)o.p=xN(t,"p");return o});if(xA(x,"name"))s.names[id]=xA(x,"name");if(xA(x,"unit"))s.units[id]=xA(x,"unit");if(xA(x,"distUnit"))s.dunits[id]=xA(x,"distUnit")});
    if(s.date&&s.day)out[xA(en,"id")||docId(s.date,s.day)]=s;
  });
  return {profile:pr,sessions:out};
}
/* Import: program files (embedded or referencing workout files), workout files, or a full profile.
   Several files can be picked at once, so a program and the workouts it references come in together. */
async function importTexts(texts){
  const roots=[];
  texts.forEach(t=>{let r;try{r=parseXMLText(t.text)}catch(e){throw new Error(t.name+" isn’t valid XML.")}roots.push(r)});
  const pool={},progEls=[],progs=[],works=[];
  roots.forEach(r=>{
    if(xKind(r)==="herculean-workout"||r.nodeName==="workout")(r.nodeName==="workout"?[r]:xKids(r,"workout")).forEach(w=>{const x=parseWorkoutEl(w);pool[x.id]=x;works.push(x)});
    else if(xKind(r)==="herculean-program"){progEls.push(...xKids(r,"program"));xKids(r,"workout").forEach(w=>works.push(parseWorkoutEl(w)))}
    else if(r.nodeName==="program")progEls.push(r);
    else if(xKind(r)==="herculean"){const d=profileFromXMLRoot(r);progs.push(...d.profile.programs);works.push(...d.profile.workouts);
      d.profile.metrics.forEach(m=>{if(!profile.metrics.some(x=>x.id===m.id))profile.metrics.push(m)})}
    else throw new Error("That file isn’t an Herculean program, workout or profile.");
  });
  /* fetch referenced workouts that weren't in the batch (works when Herculean runs from a website) */
  for(const el of progEls)for(const [ref,src] of programRefs(el)){
    if(pool[ref]||!src)continue;
    try{pool[ref]=await fetchWorkout(src)}catch(e){}
  }
  for(const el of progEls){const p=parseProgramEl(el,(ref)=>pool[ref]||null);
    if(p._missing)throw new Error(p.name+" needs workout files that weren’t found: "+p._missing.join(", ")+". Select them along with the program.");
    progs.push(p)}
  if(!progs.length&&!works.length)throw new Error("No programs or workouts found.");
  return addImported(progs,works);
}
async function importText(text){return importTexts([{name:"That file",text}])}
function addImported(progs,works){
  const pIds=new Set(profile.programs.map(p=>p.id)),pNames=new Set(profile.programs.map(p=>p.name));
  let pAdded=0;
  progs.forEach(p=>{
    const same=profile.programs.find(x=>x.id===p.id);if(same&&JSON.stringify(same.days)===JSON.stringify(p.days)&&same.name===p.name)return;
    if(pIds.has(p.id))p.id=rid("p");let n=p.name;while(pNames.has(n))n=n+" (imported)";p.name=n;pIds.add(p.id);pNames.add(n);profile.programs.push(p);pAdded++});
  const wIds=new Set(profile.workouts.map(w=>w.id));let wAdded=0;
  works.forEach(w=>{const same=profile.workouts.find(x=>x.id===w.id||x.id==="lib-"+w.id);
    if(same&&JSON.stringify({...same,id:0})===JSON.stringify({...w,id:0}))return;
    let id=w.id;if(!id.startsWith("lib-"))id="lib-"+id;if(wIds.has(id))id=rid("w");w.id=id;wIds.add(id);profile.workouts.push(w);wAdded++});
  return {p:pAdded,w:wAdded,names:progs.map(p=>p.name)};
}
const importSummary=r=>(r.p||r.w)?"Added "+[r.p?r.p+" program"+(r.p===1?"":"s"):"",r.w?r.w+" workout"+(r.w===1?"":"s"):""].filter(Boolean).join(" and ")+".":"Already in your library.";

/* ---------- expert library (programs/ and workouts/ folders beside the page) ---------- */
let catalogState={loaded:false,ok:false,programs:[],workouts:[],err:""};
async function loadCatalog(){
  if(!window.IRONLOG_CATALOG){catalogState={loaded:true,ok:false,programs:[],workouts:[],err:"off"};return}
  try{
    const [pt,wt]=await Promise.all([fetchText("programs/index.xml"),fetchText("workouts/index.xml")]);
    const items=t=>xKids(parseXMLText(t),"item").map(i=>({file:xA(i,"file"),id:xA(i,"id"),name:xA(i,"name"),author:xA(i,"author")||"",summary:xA(i,"summary")||""}));
    catalogState={loaded:true,ok:true,programs:items(pt),workouts:items(wt),err:""};
  }catch(e){catalogState={loaded:true,ok:false,programs:[],workouts:[],err:location.protocol==="file:"?"file":"net"}}
}
function renderCatalog(){
  const box=$("catalog");if(!box)return;
  if(!window.IRONLOG_CATALOG){$("catalogSec").hidden=true;return}
  $("catalogSec").hidden=false;
  if(!catalogState.loaded){box.innerHTML='<div class="empty">Loading the expert library…</div>';loadCatalog().then(renderCatalog);return}
  if(!catalogState.ok){box.innerHTML='<div class="empty">'+(catalogState.err==="file"
    ?"The expert library loads when Herculean is opened from its website. On your computer, use Import… and pick a program file together with its workout files."
    :"Couldn’t reach the expert library right now. Try again later.")+'</div>';return}
  box.innerHTML="";
  const group=(title,list,kind)=>{
    const h=document.createElement("div");h.className="subhead";h.textContent=title;box.appendChild(h);
    if(!list.length){const e=document.createElement("div");e.className="muted";e.textContent="Nothing here yet.";box.appendChild(e);return}
    list.forEach(it=>{
      const card=document.createElement("div");card.className="libcard catalogcard";
      const h3=document.createElement("h3");h3.textContent=it.name;
      const by=document.createElement("div");by.className="byline";by.textContent="By "+(it.author||"Unknown author");
      const sm=document.createElement("div");sm.className="rx";sm.textContent=it.summary;
      const have=kind==="p"?profile.programs.some(p=>p.id===it.id):profile.workouts.some(w=>w.id==="lib-"+it.id||w.id===it.id);
      const b=btn(have?"In your library":"Add to my library",have?"ghost":"primary",async()=>{
        b.disabled=true;b.textContent="Adding…";
        try{let r;
          if(kind==="w")r=addImported([],[await fetchWorkout(it.file)]);
          else r=await importTexts([{name:it.name,text:await fetchText(it.file)}]);
          if(await saveProfile()){toast(importSummary(r)+(kind==="p"&&r.p?" Activate it to start.":""));renderLibrary()}}
        catch(e){toast("Couldn’t add "+it.name+": "+e.message);b.disabled=false;b.textContent="Add to my library"}});
      b.disabled=have;
      const acts=document.createElement("div");acts.className="actions";acts.appendChild(b);
      card.append(h3,by,sm,acts);box.appendChild(card);
    })};
  group("Programs",catalogState.programs,"p");group("Workouts",catalogState.workouts,"w");
}

/* ---------- library ---------- */
function btn(txt,cls,fn,label){const b=document.createElement("button");b.textContent=txt;if(cls)b.className=cls;b.onclick=fn;if(label)b.setAttribute("aria-label",label);return b}
function confirmInline(holder,msg,yesTxt,onYes,onNo){holder.innerHTML="";const cf=document.createElement("span");cf.className="confirm";cf.append(msg,btn(yesTxt,"danger",onYes),btn("Cancel","ghost",onNo));holder.appendChild(cf)}
function renderLibrary(){
  const pl=$("progList");pl.innerHTML="";
  if(!profile.programs.length)pl.innerHTML='<div class="empty">No programs yet. Create one or import a program file.</div>';
  profile.programs.forEach(p=>{
    const card=document.createElement("div");card.className="libcard"+(p.id===profile.activeId?" active":"");
    const head=document.createElement("div");head.className="exhead";
    const l=document.createElement("div");const h=document.createElement("h3");h.textContent=p.name;
    const used=p.loop.slots.filter(Boolean).length;
    const meta=document.createElement("div");meta.className="rx";meta.textContent=p.loop.len+"-day loop · "+used+" training day"+(used===1?"":"s")+" · "+p.days.length+" workout"+(p.days.length===1?"":"s");
    const by=document.createElement("div");by.className="byline";by.textContent=byline(p);
    l.append(h,by,meta);head.appendChild(l);
    if(p.id===profile.activeId){const c=document.createElement("span");c.className="chip up";c.textContent="Active";head.appendChild(c)}
    card.appendChild(head);
    const wl=document.createElement("div");wl.className="wnames";wl.textContent=p.days.map(d=>d.name).join(" · ")||"No workouts yet";card.appendChild(wl);
    const acts=document.createElement("div");acts.className="actions";
    if(p.id!==profile.activeId)acts.appendChild(btn("Activate","primary",async()=>{profile.activeId=p.id;if(await saveProfile()){toast(p.name+" is now active");goToDate(todayISO());renderLibrary()}}));
    const dupP=async()=>{if(!needName())return;const c=stampAuthor(clone(p),p);c.id=rid("p");c.name=p.name+(isMine(p)?" copy":" (my copy)");profile.programs.push(c);if(await saveProfile()){toast(isMine(p)?"Duplicated":"Your copy of "+p.name+" is ready to customize");renderLibrary()}};
    if(isMine(p))acts.append(btn("Edit","",()=>openEditor("program",p.id)));else acts.append(btn("View","",()=>openEditor("program",p.id)));
    acts.append(btn(isMine(p)?"Duplicate":"Make my copy","ghost",dupP),
      exportMenu(p));
    const del=document.createElement("span");
    del.appendChild(btn("Delete","ghost danger",()=>confirmInline(del,"Delete "+p.name+"? Logged days keep its name in the Archive.","Delete",async()=>{
      profile.programs=profile.programs.filter(x=>x.id!==p.id);if(profile.activeId===p.id)profile.activeId=profile.programs[0]?profile.programs[0].id:null;
      if(await saveProfile()){toast("Deleted");goToDate(date,true);renderLibrary()}},renderLibrary)));
    acts.appendChild(del);card.appendChild(acts);pl.appendChild(card);
  });
  const wl=$("workList");wl.innerHTML="";
  if(!profile.workouts.length)wl.innerHTML='<div class="empty">No saved workouts. Create one, or save one from a program.</div>';
  profile.workouts.forEach(w=>{
    const card=document.createElement("div");card.className="libcard";
    const h=document.createElement("h3");h.textContent=w.name;
    const by=document.createElement("div");by.className="byline";by.textContent=byline(w);
    const meta=document.createElement("div");meta.className="rx";meta.textContent=w.ex.length+" exercise"+(w.ex.length===1?"":"s")+(w.cardio.on?" · "+(w.cardio.label||"cardio"):"");
    const ex=document.createElement("div");ex.className="wnames";ex.textContent=w.ex.map(e=>e.name).join(" · ");
    const acts=document.createElement("div");acts.className="actions";
    acts.append(btn("Log as one-off","primary",()=>{setView("log");dayId=w.id;goToDate(todayISO(),true);window.scrollTo({top:0})}),
      btn(isMine(w)?"Edit":"View","",()=>openEditor("workout",w.id)),
      btn(isMine(w)?"Duplicate":"Make my copy","ghost",async()=>{if(!needName())return;const c=stampAuthor(clone(w),w);c.id=rid("w");c.name=w.name+(isMine(w)?" copy":" (my copy)");profile.workouts.push(c);if(await saveProfile()){toast("Duplicated");renderLibrary()}}),
      btn("Export","ghost",()=>exportText(fileSafe(w.name),workoutFileXML(w))));
    const del=document.createElement("span");
    del.appendChild(btn("Delete","ghost danger",()=>confirmInline(del,"Delete "+w.name+" from your library? Programs that use it keep their own copy.","Delete",async()=>{
      profile.workouts=profile.workouts.filter(x=>x.id!==w.id);if(await saveProfile()){toast("Deleted");renderLibrary()}},renderLibrary)));
    acts.appendChild(del);
    card.append(h,by,meta,ex,acts);wl.appendChild(card);
  });
  renderMetricList();
  renderCatalog();
}
function renderSettings(){
  const st=profile.settings;
  $("sUnit").value=st.unit;$("sInc").value=st.inc;$("sRestA").value=st.restA;$("sRestB").value=st.restB;
  $("meName").textContent=profile.me.name||"Not set yet";
  renderReset();renderProfileReset();
}
function renderProfileReset(){
  const w=$("profResetWrap");w.innerHTML="";
  w.appendChild(btn("Reset user profile","ghost danger",()=>confirmInline(w,"Erase everything in this browser and start over? This can’t be undone.","Reset profile",async()=>{
    if(window.resetUserProfile)await window.resetUserProfile();toast("Profile reset");setView("log")},renderProfileReset)));
}
/* program export: one file, or a program file that points to separate workout files (expert-library layout) */
function exportMenu(p){
  const sel=document.createElement("select");sel.className="exportpick";sel.setAttribute("aria-label","Export "+p.name);
  [["","Export…"],["one","Download as one file"],["split","Download with separate workout files"]].forEach(([v,t])=>{const o=document.createElement("option");o.value=v;o.textContent=t;sel.appendChild(o)});
  sel.onchange=()=>{const v=sel.value;sel.value="";if(v==="one")exportText(fileSafe(p.name),programFileXML(p));if(v==="split")exportProgramSplit(p)};
  return sel;
}
function exportProgramSplit(p){
  const files={},used=new Set();
  p.days.forEach(w=>{let base=fileSafe(w.name||w.id).toLowerCase(),n=base,i=2;while(used.has(n))n=base+"-"+i++;used.add(n);files[w.id]=n});
  const list=[[fileSafe(p.name).toLowerCase(),programRefXML(p,"workouts/",files)],...p.days.map(w=>[files[w.id],workoutFileXML(w)])];
  list.forEach(([name,text],i)=>setTimeout(()=>blobDownload(name+".xml",text),i*400));
  toast("Downloading "+list.length+" files. If your browser asks, allow multiple downloads.");
}
function renderMetricList(){
  const box=$("metricList");box.innerHTML="";
  profile.metrics.forEach((m,i)=>{
    const row=document.createElement("div");row.className="metricrow"+(m.on?"":" off");
    const ck=document.createElement("input");ck.type="checkbox";ck.checked=m.on;ck.id="mon-"+m.id;ck.setAttribute("aria-label","Track "+m.name);
    ck.onchange=async()=>{m.on=ck.checked;if(await saveProfile()){renderMetricList();renderLog(true)}};
    const name=document.createElement("input");name.type="text";name.value=m.name;name.maxLength=40;name.setAttribute("aria-label","Name");
    name.onchange=async()=>{m.name=name.value.trim()||m.name;await saveProfile()};
    const unit=document.createElement("input");unit.type="text";unit.maxLength=16;unit.className="unit";unit.setAttribute("aria-label",m.name+" unit");
    unit.value=mUnit(m);unit.disabled=m.unit==="@w";unit.title=m.unit==="@w"?"Follows your weight unit":m.unit==="@l"?"Follows your units (in or cm). Type to override.":"";
    unit.onchange=async()=>{m.unit=unit.value.trim();await saveProfile()};
    const tools=document.createElement("div");tools.className="tools";
    const up=btn("↑","icon",async()=>{[profile.metrics[i-1],profile.metrics[i]]=[profile.metrics[i],profile.metrics[i-1]];if(await saveProfile())renderMetricList()},"Move "+m.name+" up");up.disabled=i===0;
    tools.appendChild(up);
    const used=sortedSessions().some(s=>metricVal(s,m.id)!=null);
    if(m.id!=="bw"){const del=document.createElement("span");
      del.appendChild(btn("✕","icon danger",()=>{if(!used){profile.metrics.splice(i,1);saveProfile().then(renderMetricList);return}
        confirmInline(del,"Remove "+m.name+"? Its past values stay in your entries but won’t be shown.","Remove",async()=>{profile.metrics.splice(i,1);if(await saveProfile())renderMetricList()},renderMetricList)},"Remove "+m.name));
      tools.appendChild(del)}
    row.append(ck,name,unit,tools);box.appendChild(row);
  });
  const pp=$("presetPick");pp.innerHTML="";
  const avail=METRIC_PRESETS.filter(p=>!profile.metrics.some(m=>m.id===p.id));
  avail.forEach(p=>{const o=document.createElement("option");o.value=p.id;o.textContent=p.name;pp.appendChild(o)});
  if(!avail.length){const o=document.createElement("option");o.textContent="All presets added";pp.appendChild(o)}
  pp.disabled=$("addPreset").disabled=!avail.length;
}
$("addPreset").onclick=async()=>{const p=METRIC_PRESETS.find(x=>x.id===$("presetPick").value);if(!p)return;profile.metrics.push({...p,on:true});if(await saveProfile()){toast("Now tracking "+p.name);renderMetricList();renderLog(true)}};
$("addCustom").onclick=async()=>{const n=$("cmName").value.trim();if(!n){toast("Give the measurement a name");$("cmName").focus();return}
  profile.metrics.push({id:rid("m"),name:n,unit:$("cmUnit").value.trim(),dir:$("cmDir").value,kind:"number",on:true});
  if(await saveProfile()){$("cmName").value="";$("cmUnit").value="";toast("Now tracking "+n);renderMetricList();renderLog(true)}};
$("mPick").onchange=renderMetricChart;
const fileSafe=s=>(s||"program").replace(/[^\w\- ]+/g,"").trim().replace(/\s+/g,"-")||"program";
function renderReset(){
  const w=$("resetWrap");w.innerHTML="";
  w.appendChild(btn("Restore preset program and workouts","ghost",()=>confirmInline(w,"Add the original Push / Pull / Legs program and its six workouts back to your library? Nothing is deleted.","Restore",async()=>{
    const pp=presetProgram();if(profile.programs.some(p=>p.id===pp.id))pp.id=rid("p");if(profile.programs.some(p=>p.name===pp.name))pp.name+=" (preset)";profile.programs.push(pp);
    presetDays("lib-").forEach(d=>{if(!profile.workouts.some(x=>x.id===d.id))profile.workouts.push(d)});
    if(!profile.activeId)profile.activeId=pp.id;
    if(await saveProfile()){toast("Preset restored");renderSettings()}},renderReset)));
}
["sUnit","sInc","sRestA","sRestB"].forEach(id=>{
  const el=$(id),key={sUnit:"unit",sInc:"inc",sRestA:"restA",sRestB:"restB"}[id];
  el.onchange=async()=>{profile.settings[key]=id==="sUnit"?el.value:(el.value===""?0:+el.value);if(await saveProfile())toast("Settings saved")};
});
$("newProg").onclick=()=>{if(needName())openEditor("program",null)};
$("newWorkout").onclick=()=>{if(needName())openEditor("workout",null)};

$("importProg").onclick=()=>$("importProgInput").click();
$("importProgInput").onchange=async e=>{
  const files=[...e.target.files];e.target.value="";if(!files.length)return;
  try{const texts=await Promise.all(files.map(async f=>({name:f.name,text:await f.text()})));
    const r=await importTexts(texts);if(await saveProfile()){toast(importSummary(r)+(r.p?" Activate a program to start.":""));renderLibrary()}}
  catch(err){toast(err.message||"Couldn’t read those files.")}
};

/* ---------- editors (program or workout) ---------- */
function markDirty(v){$("dirty").hidden=!v;if(edit)edit._dirty=v}
function field(label,el){const Lb=document.createElement("label");Lb.className="field";Lb.append(label,el);return Lb}
function inp(type,val,on,attrs){const i=document.createElement("input");i.type=type;i.value=val??"";if(type==="number"){i.className="num";i.inputMode="decimal"}Object.assign(i,attrs||{});i.oninput=()=>{on(type==="number"?(i.value===""?"":+i.value):i.value);markDirty(true)};return i}
function sel(opts,val,on,attrs){const s=document.createElement("select");opts.forEach(([v,t])=>{const o=document.createElement("option");o.value=v;o.textContent=t;s.appendChild(o)});s.value=String(val);Object.assign(s,attrs||{});s.onchange=()=>{on(s.value);markDirty(true)};return s}
function openEditor(kind,id){
  editKind=kind;
  if(kind==="program"){const p=profile.programs.find(x=>x.id===id);edit=p?clone(p):sanitizeProgram(stampAuthor({id:rid("p"),name:"New program",loop:{len:7,start:mondayOf(todayISO()),slots:Array(7).fill("")},days:[]}));edit._new=!p}
  else{const w=profile.workouts.find(x=>x.id===id);edit=w?clone(w):sanitizeWorkout(stampAuthor({id:rid("w"),name:"New workout",ex:[]}));edit._new=!w;openDays.add(edit.id)}
  edit._orig=JSON.stringify(edit.days||edit);edit._ro=!isMine(edit);
  showView("edit");markDirty(!!edit._new);renderEditor();window.scrollTo({top:0});
}
function renderEditor(){
  const body=$("editBody");body.innerHTML="";
  $("editKind").textContent=editKind==="program"?"Program":"Library workout";
  $("editTitle").textContent=(edit._ro?"":edit._new?"New ":"Edit ")+(editKind==="program"?(edit._ro?edit.name:"program"):(edit._ro?edit.name:"workout"));
  const by=document.createElement("div");by.className="authorbox";
  const bt=document.createElement("b");bt.textContent=byline(edit);by.appendChild(bt);
  const bn=document.createElement("span");bn.textContent=edit._ro?" Made by someone else, so it can’t be edited here. Use Make my copy in Library to customize it.":" Author is set when an item is created and can’t be changed.";by.appendChild(bn);
  body.appendChild(by);$("saveEdit").hidden=!!edit._ro;$("cancelEdit").textContent=edit._ro?"Back to Library":"Cancel";
  if(editKind==="workout"){body.appendChild(workoutEditor(edit,{standalone:true}));lockIfReadOnly(body);return}
  const p=edit;
  const top=document.createElement("div");top.className="ex";
  const g=document.createElement("div");g.className="grid2";
  g.append(field("Program name",inp("text",p.name,v=>{p.name=v},{id:"pName",maxLength:60})),
    field("Lighter loop every N loops (0 = off)",inp("number",p.deload,v=>{p.deload=v},{min:0,step:1,id:"pDeload"})),
    field("Sets per exercise on a lighter loop",inp("number",p.deloadSets,v=>{p.deloadSets=v},{min:1,step:1,id:"pDeloadSets"})));
  const pn=g.firstChild;pn.style.gridColumn="1 / -1";top.appendChild(g);body.appendChild(top);
  const loop=document.createElement("div");loop.className="ex";
  const lh=document.createElement("div");lh.className="subhead";lh.textContent="Loop";loop.appendChild(lh);
  const lg=document.createElement("div");lg.className="grid2";
  const len=inp("number",p.loop.len,()=>{},{min:1,max:42,step:1,id:"lLen"});
  len.onchange=()=>{const n=Math.min(42,Math.max(1,Math.round(+len.value||1)));len.value=n;p.loop.len=n;p.loop.slots=Array.from({length:n},(_,i)=>p.loop.slots[i]||"");markDirty(true);renderSlots(slotsBox)};
  const start=inp("date",p.loop.start,()=>{},{id:"lStart"});
  start.onchange=()=>{if(!start.value)return;p.loop.start=start.value;markDirty(true);renderSlots(slotsBox)};
  lg.append(field("Loop length (days)",len),field("First loop starts on",start));loop.appendChild(lg);
  const cap=document.createElement("div");cap.className="muted";cap.style.fontSize=".8rem";cap.textContent="Assign a workout or rest to each day. The loop repeats from the start date.";loop.appendChild(cap);
  const slotsBox=document.createElement("div");slotsBox.className="slots";loop.appendChild(slotsBox);renderSlots(slotsBox);
  body.appendChild(loop);
  const wh=document.createElement("div");wh.className="subhead";wh.textContent="Workouts in this program";body.appendChild(wh);
  p.days.forEach((d,di)=>body.appendChild(workoutEditor(d,{program:p,index:di})));
  if(!p.days.length){const em=document.createElement("div");em.className="empty";em.textContent="No workouts yet. Add one from your library or start a blank one.";body.appendChild(em)}
  const add=document.createElement("div");add.className="actions";
  if(profile.workouts.length){
    const s=document.createElement("select");s.id="addFromLib";s.setAttribute("aria-label","Workout from library");
    profile.workouts.forEach(w=>{const o=document.createElement("option");o.value=w.id;o.textContent=w.name;s.appendChild(o)});
    add.append(s,btn("Add from library","",()=>{const w=profile.workouts.find(x=>x.id===s.value);if(!w)return;const c=clone(w);c.id=rid("d");p.days.push(c);
      const free=p.loop.slots.indexOf("");if(free>=0&&!p.loop.slots.includes(c.id)){/* leave assignment to the user */}
      openDays.add(c.id);markDirty(true);renderEditor();toast("Added "+w.name+". Assign it to loop days above.")}));
  }
  add.appendChild(btn("New blank workout","ghost",()=>{const d=sanitizeWorkout(stampAuthor({id:rid("d"),name:"New workout"}));p.days.push(d);openDays.add(d.id);markDirty(true);renderEditor();const el=$(`dn-${d.id}`);if(el){el.focus();el.select()}}));
  body.appendChild(add);
  lockIfReadOnly(body);
}
/* someone else’s item: show it, but nothing can change */
function lockIfReadOnly(body){
  if(!edit._ro)return;
  body.querySelectorAll("input,select,textarea,button").forEach(el=>{if(el.tagName==="BUTTON"&&!el.closest(".exrow,.actions,.slots"))return;el.disabled=true});
  body.querySelectorAll(".dayedit .body > .actions,.exrow .linkbtn,.exrow .tools").forEach(el=>el.hidden=true);
  body.querySelectorAll(":scope > .actions").forEach(el=>el.hidden=true);
}
function renderSlots(box){
  const p=edit;box.innerHTML="";
  const opts=[["","Rest"],...p.days.map(d=>[d.id,(d.label?d.label+" · ":"")+d.name])];
  p.loop.slots.forEach((s,k)=>{const dt=addDays(p.loop.start,k);
    box.appendChild(field("Day "+(k+1)+" · "+wdShort(dt),sel(opts,s,v=>{p.loop.slots[k]=v},{id:"slot-"+k})))});
}
function workoutEditor(d,ctx){
  const prg=ctx.program;
  const det=document.createElement("details");det.className="dayedit";det.open=ctx.standalone||openDays.has(d.id);
  det.ontoggle=()=>{det.open?openDays.add(d.id):openDays.delete(d.id)};
  const sum=document.createElement("summary");
  const h=document.createElement("h3");const retitle=()=>{h.textContent=(d.label?d.label+" · ":"")+(d.name||"Untitled")};retitle();
  const meta=document.createElement("span");meta.className="muted";meta.style.fontSize=".8rem";
  const used=prg?prg.loop.slots.filter(s=>s===d.id).length:0;
  meta.textContent=d.ex.length+" exercise"+(d.ex.length===1?"":"s")+(prg?" · "+(used?used+"× per loop":"not in loop"):"");
  sum.append(h,meta);det.appendChild(sum);
  const body=document.createElement("div");body.className="body";
  const g=document.createElement("div");g.className="grid2";
  g.append(field("Workout name",inp("text",d.name,v=>{d.name=v;retitle()},{id:`dn-${d.id}`,maxLength:50})),
           field("Short label (for tabs)",inp("text",d.label,v=>{d.label=v;retitle()},{id:`dl-${d.id}`,maxLength:6})));
  body.appendChild(g);
  const exh=document.createElement("div");exh.className="subhead";exh.textContent="Exercises";body.appendChild(exh);
  const letters=groupLetters(d);
  d.ex.forEach((e,ei)=>{
    const row=document.createElement("div");row.className="exrow"+(e.group?" grouped":"");
    if(e.group&&(ei===0||d.ex[ei-1].group!==e.group)){const lb=document.createElement("div");lb.className="sslabel";lb.id=`ssl-${d.id}-${e.group}`;lb.textContent=["Superset "+letters[e.group],ssRounds(e.sets)].filter(Boolean).join(" · ");row.appendChild(lb)}
    const nm=field("Name",inp("text",e.name,v=>{e.name=v},{id:`en-${d.id}-${e.id}`,maxLength:60}));
    const tools=document.createElement("div");tools.className="tools";
    const up=btn("↑","icon",()=>{[d.ex[ei-1],d.ex[ei]]=[d.ex[ei],d.ex[ei-1]];normalizeGroups(d);markDirty(true);renderEditor()},"Move "+e.name+" up");up.disabled=ei===0;
    const dn=btn("↓","icon",()=>{[d.ex[ei+1],d.ex[ei]]=[d.ex[ei],d.ex[ei+1]];normalizeGroups(d);markDirty(true);renderEditor()},"Move "+e.name+" down");dn.disabled=ei===d.ex.length-1;
    tools.append(up,dn);
    if(prg&&prg.days.length>1){const mv=sel([["","Move to…"],...prg.days.filter(x=>x!==d).map(x=>[x.id,x.name])],"",v=>{if(!v)return;const t=prg.days.find(x=>x.id===v);d.ex.splice(ei,1);e.group="";t.ex.push(e);normalizeGroups(d);openDays.add(v);renderEditor()});
      mv.setAttribute("aria-label","Move "+e.name+" to another workout");mv.style.maxWidth="7.5rem";tools.appendChild(mv)}
    tools.appendChild(btn("✕","icon danger",()=>{d.ex.splice(ei,1);normalizeGroups(d);markDirty(true);renderEditor()},"Remove "+e.name));
    const nums=document.createElement("div");nums.className="nums";
    const noMain=e.unit==="none";
    const setSets=v=>{e.sets=v;if(!e.group)return;
      d.ex.forEach(x=>{if(x.group===e.group&&x!==e){x.sets=v;const o=$(`es-${d.id}-${x.id}`);if(o)o.value=v}});
      const lb=$(`ssl-${d.id}-${e.group}`);if(lb)lb.textContent=["Superset "+letters[e.group],ssRounds(v)].filter(Boolean).join(" · ")};
    nums.append(field(e.group?"Sets (rounds)":"Sets",inp("number",e.sets,setSets,{min:1,step:1,id:`es-${d.id}-${e.id}`})),
      field("Counts",sel([["reps","Reps"],["sec","Time"],["none","Nothing"]],e.unit,v=>{e.unit=v;renderEditor()})),
      field(e.unit==="sec"?"Target low (sec)":"Target low",inp("number",e.lo,v=>{e.lo=v},{min:0,step:1,disabled:noMain})),
      field(e.unit==="sec"?"Target high (sec)":"Target high",inp("number",e.hi,v=>{e.hi=v},{min:0,step:1,disabled:noMain})));
    const track=document.createElement("div");track.className="track";
    const chk=(label,val,on)=>{const l=document.createElement("label");l.className="check";const c=document.createElement("input");c.type="checkbox";c.checked=!!val;c.onchange=()=>{on(c.checked);markDirty(true);renderEditor()};l.append(c,label);return l};
    const tl=document.createElement("span");tl.className="muted";tl.textContent="Log per set:";
    track.append(tl,chk("Weight",e.weight,v=>e.weight=v),chk("Distance",e.dist,v=>{e.dist=v;if(!v)e.pace=false}));
    if(e.dist){track.appendChild(sel(DIST_UNITS.map(u=>[u,{mi:"miles",km:"kilometers",m:"meters",yd:"yards"}[u]]),e.distUnit,v=>{e.distUnit=v},{"ariaLabel":"Distance unit"}));
      track.appendChild(chk("Pace",e.pace,v=>e.pace=v))}
    row.append(nm,tools,nums,track);
    if(ei<d.ex.length-1){
      const linked=e.group&&d.ex[ei+1].group===e.group;
      const link=btn(linked?"Unlink from next exercise":"Superset with next exercise","ghost linkbtn",()=>{
        if(linked){const g=e.group,ng=rid("g");for(let k=ei+1;k<d.ex.length&&d.ex[k].group===g;k++)d.ex[k].group=ng}
        else{const g=e.group||d.ex[ei+1].group||rid("g");const old=d.ex[ei+1].group;if(old&&old!==g)d.ex.forEach(x=>{if(x.group===old)x.group=g});e.group=g;d.ex[ei+1].group=g}
        normalizeGroups(d);markDirty(true);renderEditor()});
      link.setAttribute("aria-pressed",!!linked);row.appendChild(link);
    }
    body.appendChild(row);
  });
  if(!d.ex.length){const em=document.createElement("div");em.className="empty";em.textContent="No exercises yet.";body.appendChild(em)}
  const exAdd=document.createElement("div");exAdd.className="actions";
  exAdd.appendChild(btn("+ Add exercise","",()=>{const ne=E(rid("x"),"New exercise",3,7,7);d.ex.push(ne);openDays.add(d.id);markDirty(true);renderEditor();const el=$(`en-${d.id}-${ne.id}`);if(el){el.focus();el.select()}}));
  const known=allExercises().filter(x=>!d.ex.some(e=>e.id===x.id));
  if(known.length){const ks=document.createElement("select");ks.setAttribute("aria-label","Add an exercise you already track");
    const o0=document.createElement("option");o0.value="";o0.textContent="Add an exercise you track…";ks.appendChild(o0);
    known.forEach(x=>{const o=document.createElement("option");o.value=x.id;o.textContent=x.name;ks.appendChild(o)});
    ks.onchange=()=>{const x=allWorkouts().flatMap(w=>w.ex).find(e=>e.id===ks.value)||known.find(k=>k.id===ks.value);if(!x)return;
      d.ex.push(E(x.id,x.name,x.sets||3,x.lo??7,x.hi??7,x.unit||"reps",{weight:x.weight!==false,dist:!!x.dist,distUnit:x.distUnit||"mi",pace:!!x.pace}));openDays.add(d.id);markDirty(true);renderEditor()};
    exAdd.appendChild(ks)}
  body.appendChild(exAdd);
  const ch=document.createElement("div");ch.className="subhead";ch.textContent="Cardio";body.appendChild(ch);
  const ck=document.createElement("label");ck.className="check";const cb=document.createElement("input");cb.type="checkbox";cb.checked=!!d.cardio.on;
  cb.onchange=()=>{d.cardio.on=cb.checked;if(cb.checked&&!d.cardio.label)d.cardio.label="Easy bike";markDirty(true);renderEditor()};ck.append(cb,"Log cardio with this workout");body.appendChild(ck);
  if(d.cardio.on){const cg=document.createElement("div");cg.className="grid2";
    cg.append(field("Name",inp("text",d.cardio.label,v=>{d.cardio.label=v},{maxLength:40})),
      field("Type",sel([["steady","Steady (minutes)"],["intervals","Intervals (rounds)"]],d.cardio.type,v=>{d.cardio.type=v})),
      field("Target",inp("text",d.cardio.target,v=>{d.cardio.target=v},{maxLength:60})));
    body.appendChild(cg)}
  if(prg){
    const dt=document.createElement("div");dt.className="actions";
    dt.append(btn("Save to library","ghost",async()=>{const c=sanitizeWorkout(clone(d));if(!c.authorId||isMine(c)){if(!needName())return;if(!c.author)c.author=profile.me.name}c.id=rid("w");delete c._dirty;profile.workouts.push(c);if(await saveProfile())toast(d.name+" saved to your library")}),
      btn("Duplicate","ghost",()=>{const c=stampAuthor(clone(d),d);c.id=rid("d");c.name=d.name+" copy";prg.days.splice(ctx.index+1,0,c);openDays.add(c.id);markDirty(true);renderEditor()}));
    const del=document.createElement("span");
    del.appendChild(btn("Remove from program","ghost danger",()=>confirmInline(del,"Remove "+(d.name||"this workout")+"? Its loop days become rest. Logged days stay.","Remove",()=>{prg.days.splice(ctx.index,1);prg.loop.slots=prg.loop.slots.map(s=>s===d.id?"":s);markDirty(true);renderEditor()},renderEditor)));
    dt.appendChild(del);body.appendChild(dt);
  }
  det.appendChild(body);return det;
}
$("saveEdit").onclick=async()=>{
  if(edit._ro)return;
  const obj=clone(edit);const orig=edit._orig?JSON.parse(edit._orig):null;delete obj._dirty;delete obj._new;delete obj._orig;delete obj._ro;
  if(editKind==="program"){
    /* a workout someone else wrote becomes yours, credited to them, once you change it */
    if(Array.isArray(orig))obj.days.forEach(d=>{const o=orig.find(x=>x.id===d.id);if(o&&!isMine(o)&&JSON.stringify(d)!==JSON.stringify(o)){stampAuthor(d,o)}});
    const p=sanitizeProgram(obj);p.name=p.name.trim()||"Untitled program";
    const i=profile.programs.findIndex(x=>x.id===p.id);if(i>=0)profile.programs[i]=p;else profile.programs.push(p);
    if(!profile.activeId)profile.activeId=p.id;
  } else {
    const w=sanitizeWorkout(obj);w.name=w.name.trim()||"Untitled workout";
    const i=profile.workouts.findIndex(x=>x.id===w.id);if(i>=0)profile.workouts[i]=w;else profile.workouts.push(w);
  }
  $("saveEdit").disabled=true;
  if(await saveProfile()){toast("Saved");edit=null;setView("lib");goToDate(date,true)}
  $("saveEdit").disabled=false;
};
$("cancelEdit").onclick=()=>{edit=null;setView("lib")};

/* ---------- first-visit welcome ---------- */
$("wForm").addEventListener("submit",async e=>{
  e.preventDefault();const n=$("wName").value.trim();
  if(!n){$("wErr").hidden=false;$("wName").focus();return}
  profile.me.name=n;profile.settings.unit=$("wUnit").value;
  const fill=o=>{if(o.authorId===profile.me.id&&!o.author)o.author=n};
  profile.programs.forEach(p=>{fill(p);p.days.forEach(fill)});profile.workouts.forEach(fill);
  $("wGo").disabled=true;
  if(await saveProfile()){hideWelcome();toast("Welcome, "+n+". Your profile is ready.");renderAll()}
  $("wGo").disabled=false;
});
$("wOpen").onclick=()=>{if(window.openProfileFile)window.openProfileFile()};

/* ---------- wiring ---------- */
function renderAll(fromSync){
  derive();
  const ae=document.activeElement;
  const typing=fromSync&&ae&&ae.closest&&ae.closest("#logView")&&/INPUT|TEXTAREA/.test(ae.tagName);
  if(!typing) renderLog(); else renderStrip();
  if(!$("progView").hidden) renderProgress();
  if(!$("archView").hidden) renderArchive();
  if(!$("libView").hidden) renderLibrary();
  if(!$("setView").hidden) renderSettings();
}
const VIEWS=["log","arch","prog","lib","set","edit"];
function showView(v){
  VIEWS.forEach(k=>$(k+"View").hidden=k!==v);
  [["vLog","log"],["vArch","arch"],["vProg","prog"],["vLib","lib"],["vSet","set"]].forEach(([b,k])=>$(b).setAttribute("aria-pressed",k===v||(v==="edit"&&k==="lib")));
}
function setView(v){
  if(!$("editView").hidden&&v!=="edit"&&edit&&edit._dirty&&!confirmLeave(v))return;
  if(v!=="edit")edit=null;
  showView(v);
  if(v==="prog") renderProgress();
  if(v==="arch") renderArchive();
  if(v==="lib") renderLibrary();
  if(v==="set") renderSettings();
  if(v==="log") renderLog();
}
/* leaving the editor with unsaved changes asks first, inline */
function confirmLeave(v){
  const holder=$("dirty");holder.hidden=false;holder.innerHTML="";
  const cf=document.createElement("span");cf.className="confirm";
  cf.append("Discard unsaved changes?",btn("Discard","danger",()=>{holder.textContent="Unsaved changes";edit=null;setView(v)}),btn("Keep editing","ghost",()=>{holder.textContent="Unsaved changes"}));
  holder.appendChild(cf);holder.scrollIntoView({block:"nearest"});return false;
}
$("vLog").onclick=()=>setView("log");
$("vArch").onclick=()=>setView("arch");
$("vProg").onclick=()=>setView("prog");
$("vLib").onclick=()=>setView("lib");
$("vSet").onclick=()=>setView("set");
$("pOver").onclick=()=>setProgTab("over");
$("pEx").onclick=()=>setProgTab("ex");
$("archProg").onchange=renderArchive;
$("archRest").onchange=renderArchive;
$("exPick").onchange=renderChart;
$("date").onchange=()=>{if($("date").value)goToDate($("date").value)};
$("prevLoop").onclick=()=>{viewLoop--;renderStrip()};
$("nextLoop").onclick=()=>{viewLoop++;renderStrip()};
$("save").onclick=saveSession;

let tEnd=0,tInt=null;
function tick(){const left=Math.max(0,Math.round((tEnd-Date.now())/1000));$("clock").textContent=fmtSec(left);$("clock").classList.toggle("done",left===0&&tEnd>0);if(left===0){clearInterval(tInt);tInt=null}}
function startT(s){tEnd=Date.now()+s*1000;clearInterval(tInt);tInt=setInterval(tick,250);tick()}
$("tA").onclick=()=>startT(+profile.settings.restA||90);$("tB").onclick=()=>startT(+profile.settings.restB||150);
$("tStop").onclick=()=>{clearInterval(tInt);tInt=null;tEnd=0;$("clock").textContent="0:00";$("clock").classList.remove("done")};
