/* Dapper Budget Planner. Copyright (C) 2026 Coleman Nielsen
   SPDX-License-Identifier: GPL-3.0-or-later  (see LICENSE; name and logo excluded, see NOTICE) */
(()=>{
const KEY='dapper-budget-v2',MN='Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
const FQ={weekly:52/12,biweekly:26/12,semimonthly:2,monthly:1,quarterly:1/3,yearly:1/12};
const FR=[['weekly','Weekly'],['biweekly','Every 2 weeks'],['semimonthly','Twice a month'],['monthly','Monthly'],['quarterly','Quarterly'],['yearly','Yearly']];
const CP=[['12','Monthly'],['365','Daily'],['4','Quarterly'],['1','Yearly'],['0','Continuously']];
const TY=['Checking','Savings','High-yield savings','Emergency fund','Retirement (401k/IRA)','Brokerage','Other'].map(x=>[x,x]);
const PAL=['#2f7d5b','#2f6fa8','#8a5bb0','#c8a01e','#b8475e','#3b8f9c','#e8731a'],DC=['#c8483d','#d98a7f','#7a2822','#e8a39a'];
const SP={income:[['amount','Amount ($)'],['freq','How often','text',FR]],expenses:[['amount','Amount ($)'],['freq','How often','text',FR]],
 debts:[['balance','Balance ($)'],['apr','Interest rate (APR %)'],['min','Minimum payment ($/mo)'],['comp','Compounds','text',CP]],
 savings:[['type','Account type','text',TY],['balance','Balance ($)'],['rate','Interest rate (APR %)'],['comp','Compounds','text',CP],['add','Monthly deposit ($)']]};
const NEW={income:()=>({name:'New income',amount:0,freq:'monthly'}),expenses:()=>({name:'New expense',amount:0,freq:'monthly'}),
 debts:()=>({name:'New debt',balance:0,apr:0,min:0,comp:'12'}),savings:n=>({name:'New account',type:'Savings',balance:0,rate:0,comp:'12',add:0,c:n})};
const TABS=[['income','Income'],['expenses','Expenses'],['debts','Debt'],['savings','Savings'],['plan','Plan']],NM={income:'income source',expenses:'expense',debts:'debt',savings:'account'};
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fm=v=>(v<0?'-':'')+'$'+Math.round(Math.abs(v)).toLocaleString();
const def=()=>({income:[{name:'Paycheck',amount:3000,freq:'monthly'}],expenses:[{name:'Rent',amount:1200,freq:'monthly'},{name:'Groceries',amount:400,freq:'monthly'}],debts:[],savings:[{name:'Savings',type:'Savings',balance:1000,rate:4,comp:'12',add:100,c:0}],plan:{years:10,strategy:'avalanche',extra:0,left:'0'}});
const blank=()=>({income:[],expenses:[],debts:[],savings:[],plan:{years:10,strategy:'avalanche',extra:0,left:'-1'}});
const TPL=`<section class="budget"><div class="budgetbar"><input data-r="bname" aria-label="Budget name"><button type="button" data-r="gs">Workbook</button><button type="button" data-r="dup">Duplicate</button><button type="button" class="x" data-r="rm">Remove</button></div><section class="card sheetpanel" data-r="sp" hidden></section><div class="app"><section class="card viewer"><div class="top"><div><h2>Outlook</h2><p data-r="status"></p></div><div class="actions"><button data-r="resetBtn" type="button">Reset view</button></div></div><div class="stats" data-r="stats"></div><div class="chips" data-r="chips"></div><div class="chart"><div class="plot" data-r="plot"><canvas data-r="cv"></canvas><div class="tip" data-r="tip"></div></div><div class="rs v" data-r="ys"></div><div class="rs h" data-r="xs"></div></div><p class="note">Drag the graph to move around. Slide the bars to move the axes, and drag the ends of a bar to stretch or squeeze an axis. Click a name above to show or hide a line.</p></section><section class="card controls"><h2>Budget</h2><nav data-r="tabs"></nav><div data-r="panel"></div></section><section class="card output"><h2>Balances over time</h2><pre data-r="output"></pre></section></div></section>`;
const loadAll=()=>{try{const j=JSON.parse(localStorage.getItem(KEY));if(Array.isArray(j)&&j.length)return j}catch(e){}
 try{const o=JSON.parse(localStorage.getItem('dapper-budget-v1'));if(o&&o.income&&o.plan)return[{name:'My budget',d:o}]}catch(e){}return[{name:'My budget',d:def()}]};
const E=loadAll(),insts=[],box=document.getElementById('budgets');
const saveAll=()=>{try{localStorage.setItem(KEY,JSON.stringify(E))}catch(e){}};
function make(entry,root){
const $=id=>root.querySelector('[data-r="'+id+'"]');
let D=entry.d,cons=null,tab='income',vis={},R,DOM,G={},hm=null,mx=0,dr=null,V={ax:true,ay:true};
const now=new Date(),sy=now.getFullYear(),sm=now.getMonth(),lab=m=>{const a=sy*12+sm+m;return MN[a%12]+' '+Math.floor(a/12)};
const on=k=>vis[k]??!(/^d\d/.test(k)||k=='savT'||k=='net');

const cn=x=>x.comp==null?12:+x.comp,gm=(r,n)=>n?Math.pow(1+r/(100*n),n/12)-1:Math.exp(r/1200)-1;
function sim(){
 const p=D.plan,N=Math.max(1,Math.min(50,+p.years||10))*12,M=a=>a.reduce((s,x)=>s+(+x.amount||0)*FQ[x.freq],0),inc=M(D.income),exp=M(D.expenses),dest=+p.left;
 const ds=D.debts.map(x=>({b:+x.balance||0,r:gm(+x.apr||0,cn(x)),m:+x.min||0})),ac=D.savings.map(x=>({b:+x.balance||0,r:gm(+x.rate||0,cn(x)),a:+x.add||0}));
 const o={N,inc,exp,debt:[],ds:ds.map(()=>[]),sav:ac.map(()=>[]),flow:[],int:0,free:-1};
 for(let m=0;m<=N;m++){
  const td=ds.reduce((s,d)=>s+d.b,0);o.debt.push(td);ds.forEach((d,i)=>o.ds[i].push(d.b));ac.forEach((a,i)=>o.sav[i].push(a.b));
  if(o.free<0&&o.debt[0]>.005&&td<.005)o.free=m;
  if(m==N)break;
  let paid=0,pool=0;
  ds.forEach(d=>{if(d.b>0){const i=d.b*d.r;d.b+=i;o.int+=i}const x=Math.min(Math.max(d.b,0),d.m);d.b-=x;paid+=x;pool+=d.m-x});
  if(p.strategy!='none'){pool+=+p.extra||0;ds.filter(d=>d.b>.005).sort(p.strategy=='snowball'?(a,b)=>a.b-b.b:(a,b)=>b.r-a.r).forEach(d=>{const x=Math.min(pool,d.b);d.b-=x;pool-=x;paid+=x})}
  ds.forEach(d=>{if(d.b<.005)d.b=0});
  const dep=ac.reduce((s,a)=>s+a.a,0),left=inc-exp-paid-dep;o.flow.push({paid,dep,left});
  ac.forEach((a,i)=>{a.b=a.b*(1+a.r)+a.a+(i==dest&&left>0?left:0)});
 }
 o.tot=o.debt.map((_,m)=>o.sav.reduce((s,a)=>s+a[m],0));o.net=o.tot.map((t,m)=>t-o.debt[m]);return o;
}
function series(){
 const s=[];if(D.debts.length)s.push({k:'debt',n:'Total debt',c:'#963c32',w:3,v:R.debt});
 D.debts.forEach((d,i)=>s.push({k:'d'+i,n:d.name,c:DC[i%4],w:1.5,dash:[4,3],v:R.ds[i]}));
 D.savings.forEach((a,i)=>s.push({k:'s'+i,n:a.name,c:PAL[a.c%7],w:2.5,v:R.sav[i]}));
 if(D.savings.length>1)s.push({k:'savT',n:'Total savings',c:'#33261c',w:2,dash:[6,4],v:R.tot});
 s.push({k:'net',n:'Net worth',c:'#7a6a5e',w:2,dash:[2,3],v:R.net});return s;
}
const fit=(r,d,min)=>{r=[Math.min(r[0],r[1]),Math.max(r[0],r[1])];const sp=Math.max(min,Math.min(r[1]-r[0],d[1]-d[0])),lo=Math.max(d[0],Math.min(r[0],d[1]-sp));return[lo,lo+sp]};
const nice=(a,b,n)=>{const s=(b-a)/n,p=Math.pow(10,Math.floor(Math.log10(s))),f=s/p,st=(f<1.5?1:f<3?2:f<7?5:10)*p,o=[];for(let v=Math.ceil(a/st)*st;v<=b+1e-9;v+=st)o.push(v);return o};
const ak=v=>{const a=Math.abs(v);return(v<0?'-':'')+'$'+(a>=1e6?+(a/1e6).toFixed(2)+'M':a>=1e3?+(a/1e3).toFixed(1)+'k':Math.round(a))};

function draw(){
 const cv=$('cv'),r=cv.parentNode.getBoundingClientRect(),dp=devicePixelRatio||1;cv.width=r.width*dp;cv.height=r.height*dp;
 const g=cv.getContext('2d');g.setTransform(dp,0,0,dp,0,0);
 const L=58,T=12,pw=r.width-L-14,ph=r.height-T-26,S=series().filter(s=>on(s.k));G={L,pw};
 let lo=0,hi=1;S.forEach(s=>s.v.forEach(x=>{if(x<lo)lo=x;if(x>hi)hi=x}));hi*=1.06;if(lo<0)lo*=1.06;
 DOM={x:[0,R.N],y:[lo,hi]};
 V.x=V.ax?[0,R.N]:fit(V.x,DOM.x,3);V.y=V.ay?[lo,hi]:fit(V.y,DOM.y,(hi-lo)*.02);
 const X=m=>L+(m-V.x[0])/(V.x[1]-V.x[0])*pw,Y=v=>T+ph-(v-V.y[0])/(V.y[1]-V.y[0])*ph;
 g.font='11px Arial';g.fillStyle='#7a6a5e';g.strokeStyle='#f0dfd0';g.lineWidth=1;g.textAlign='right';g.textBaseline='middle';
 nice(V.y[0],V.y[1],6).forEach(v=>{const y=Math.round(Y(v))+.5;g.beginPath();g.moveTo(L,y);g.lineTo(L+pw,y);g.stroke();g.fillText(ak(v),L-6,y)});
 const sp=V.x[1]-V.x[0],st=[1,2,3,6,12,24,60,120].find(s=>pw/(sp/s)>=70)||240;g.textAlign='center';g.textBaseline='top';
 for(let m=Math.ceil(V.x[0]);m<=V.x[1];m++){const a=sy*12+sm+m;if(a%st)continue;const x=Math.round(X(m))+.5;g.beginPath();g.moveTo(x,T);g.lineTo(x,T+ph);g.stroke();g.fillText(st>=12?Math.floor(a/12):MN[a%12]+' '+Math.floor(a/12),x,T+ph+7)}
 g.save();g.beginPath();g.rect(L,T,pw,ph);g.clip();
 if(lo<0){g.strokeStyle='#a89a8e';g.beginPath();g.moveTo(L,Y(0));g.lineTo(L+pw,Y(0));g.stroke()}
 S.forEach(s=>{g.beginPath();g.strokeStyle=s.c;g.lineWidth=s.w;g.setLineDash(s.dash||[]);g.lineJoin='round';const a=Math.max(0,Math.floor(V.x[0])),b=Math.min(R.N,Math.ceil(V.x[1]));for(let m=a;m<=b;m++){const x=X(m),y=Y(s.v[m]);m==a?g.moveTo(x,y):g.lineTo(x,y)}g.stroke()});
 g.setLineDash([]);
 if(R.free>=0&&on('debt')){const x=X(R.free);g.strokeStyle='#3c9a5f';g.setLineDash([5,4]);g.beginPath();g.moveTo(x,T);g.lineTo(x,T+ph);g.stroke();g.setLineDash([]);g.fillStyle='#25613c';g.textAlign='left';g.textBaseline='top';g.fillText(' Debt-free',x,T+4)}
 if(hm!=null){const x=X(hm);g.strokeStyle='#33261c55';g.beginPath();g.moveTo(x,T);g.lineTo(x,T+ph);g.stroke();S.forEach(s=>{g.fillStyle=s.c;g.beginPath();g.arc(x,Y(s.v[hm]),4,0,7);g.fill()})}
 g.restore();g.strokeStyle='#ecdccd';g.strokeRect(L+.5,T+.5,pw,ph);
 const tip=$('tip');
 if(hm!=null){tip.innerHTML='<b>'+lab(hm)+'</b><br>'+S.map(s=>'<span style="color:'+s.c+'">&#9679;</span> '+esc(s.n)+': '+fm(s.v[hm])).join('<br>');tip.style.display='block';tip.style.left=(mx>r.width/2?mx-tip.offsetWidth-12:mx+12)+'px';tip.style.top='10px'}else tip.style.display='none';
 $('xs').sync();$('ys').sync();
}

function scroller(el,vert,get,set){
 el.innerHTML='<div><b class="s"></b><b class="e"></b></div>';const t=el.firstChild;let d=null;
 el.sync=()=>{const[a,b]=get();t.style[vert?'top':'left']=a*100+'%';t.style[vert?'height':'width']=(b-a)*100+'%'};
 const pos=e=>{const r=el.getBoundingClientRect();return vert?(e.clientY-r.top)/r.height:(e.clientX-r.left)/r.width};
 el.onpointerdown=e=>{el.setPointerCapture(e.pointerId);const[a,b]=get(),p=pos(e),c=e.target.className,m=c=='s'||c=='e'?c:'m';
  if(e.target==el){const s=p-(a+b)/2;set(a+s,b+s);d={m,p,a:a+s,b:b+s}}else d={m,p,a,b}};
 el.onpointermove=e=>{if(!d)return;const x=pos(e)-d.p;let{a,b,m}=d;if(m=='m'){a+=x;b+=x}else if(m=='s')a+=x;else b+=x;set(a,b)};
 el.onpointerup=el.onpointercancel=()=>d=null;
}
const sx=()=>DOM.x[1]-DOM.x[0],sy_=()=>DOM.y[1]-DOM.y[0];
scroller($('xs'),0,()=>[(V.x[0]-DOM.x[0])/sx(),(V.x[1]-DOM.x[0])/sx()],(a,b)=>{V.x=fit([DOM.x[0]+a*sx(),DOM.x[0]+b*sx()],DOM.x,3);V.ax=false;draw()});
scroller($('ys'),1,()=>[1-(V.y[1]-DOM.y[0])/sy_(),1-(V.y[0]-DOM.y[0])/sy_()],(a,b)=>{V.y=fit([DOM.y[1]-Math.max(a,b)*sy_(),DOM.y[1]-Math.min(a,b)*sy_()],DOM.y,sy_()*.02);V.ay=false;draw()});

const pl=$('plot');
pl.onpointerdown=e=>{pl.setPointerCapture(e.pointerId);dr={x:e.clientX,y:e.clientY,vx:[...V.x],vy:[...V.y]};hm=null;pl.style.cursor='grabbing'};
pl.onpointermove=e=>{const r=pl.getBoundingClientRect();
 if(dr){const w=r.width-G.L-14,h=r.height-38,sx_=dr.vx[1]-dr.vx[0],sy2=dr.vy[1]-dr.vy[0],dx=(e.clientX-dr.x)/w*sx_,dy=(e.clientY-dr.y)/h*sy2;
  V.x=fit([dr.vx[0]-dx,dr.vx[1]-dx],DOM.x,3);V.y=fit([dr.vy[0]+dy,dr.vy[1]+dy],DOM.y,sy2*.5);V.ax=V.ay=false;draw();return}
 mx=e.clientX-r.left;const m=Math.round(V.x[0]+(mx-G.L)/G.pw*(V.x[1]-V.x[0]));hm=mx>G.L&&mx<G.L+G.pw&&m>=0&&m<=R.N?m:null;draw()};
pl.onpointerup=pl.onpointercancel=()=>{dr=null;pl.style.cursor='grab'};
pl.onpointerleave=()=>{if(!dr){hm=null;draw()}};
$('resetBtn').onclick=()=>{V.ax=V.ay=true;draw()};

const fld=(a,l,t,v,o)=>'<label>'+l+(o?'<select '+a+'>'+o.map(([x,y])=>'<option value="'+x+'"'+(x==v?' selected':'')+'>'+esc(y)+'</option>').join('')+'</select>':'<input '+a+' type="'+(t||'number')+'" value="'+esc(v)+'"'+(t?'':' min="0" step="any"')+'>')+'</label>';
function tabs(){$('tabs').innerHTML=TABS.map(([k,n])=>'<button type="button" data-t="'+k+'"'+(k==tab?' class="active"':'')+'>'+n+(D[k]&&D[k].length?' ('+D[k].length+')':'')+'</button>').join('')}
const sel_=()=>D.debts.filter((_,k)=>cons.sel.includes(k)),sumB=a=>a.reduce((s,d)=>s+(+d.balance||0),0);
const cprev=()=>{const sd=sel_(),b=sumB(sd),fee=b*(+cons.fee||0)/100,mn=sd.reduce((s,d)=>s+(+d.min||0),0),wa=b?sd.reduce((s,d)=>s+(+d.balance||0)*(+d.apr||0),0)/b:0;
 return sd.length<2?'Pick at least two debts.':'New loan: '+fm(b+fee)+(fee?' (includes '+fm(fee)+' fee)':'')+' at '+(+cons.apr||0)+'% instead of an average of '+wa.toFixed(2)+'%. Payments change from '+fm(mn)+' to '+fm(+cons.pay||0)+' per month.'};
const cform=()=>{if(!cons)return D.debts.length>1?'<button type="button" class="plus" data-cons style="margin-top:8px">Consolidate debts&hellip;</button>':'';
 const C=(k,l,t,o)=>fld('data-c="'+k+'"',l,t,cons[k],o);
 return '<div class="item" style="margin-top:10px"><h3 style="margin:0 0 8px;color:#a84e0c;font-size:1rem">Consolidate debts</h3>'+D.debts.map((d,i)=>'<label class="check"><input type="checkbox" data-ci="'+i+'"'+(cons.sel.includes(i)?' checked':'')+'> '+esc(d.name)+' &middot; '+fm(d.balance)+' at '+(+d.apr||0)+'%</label>').join('')+'<div class="fields" style="margin-top:10px">'+C('name','New loan name','text')+C('apr','New rate (APR %)')+C('pay','New monthly payment ($)')+C('fee','Fee (% of balance)')+C('comp','Compounds','text',CP)+'</div><p class="note" data-r="cpre">'+cprev()+'</p><p class="note">Tip: duplicate this budget first, so you can compare before and after.</p><div class="fields"><button type="button" class="plus" data-ccancel>Cancel</button><button type="button" data-capply style="background:#e8731a;border-color:#cf6312;color:#fff">Apply consolidation</button></div></div>'};
function panel(){
 const p=D.plan,P=(k,l,t,o)=>fld('data-p="'+k+'"',l,t,p[k],o);let h='<p class="sum" data-r="sum"></p>';
 if(tab=='plan'){h+='<div class="fields">'+P('years','Years to show')+P('left','Leftover cash goes to','text',[['-1','Nowhere (not tracked)'],...D.savings.map((s,i)=>[String(i),s.name])])+'</div><p class="note">Plans start this month. Leftover cash is what remains after expenses, debt payments and savings deposits.</p><button type="button" class="x" data-wipe>Clear all my data</button>';return h}
 if(tab=='debts')h+='<div class="fields">'+P('strategy','Payoff strategy','text',[['avalanche','Avalanche (highest rate first)'],['snowball','Snowball (smallest first)'],['none','Minimums only']])+P('extra','Extra per month ($)')+'</div><p class="note">Extra money and freed-up minimums roll into the next debt.</p>';
 D[tab].forEach((x,i)=>{h+='<div class="item"><div class="rowtop"><input data-i="'+i+'" data-k="name" value="'+esc(x.name)+'" aria-label="Name"><button type="button" class="x" data-del="'+i+'">Remove</button></div><div class="fields">'+SP[tab].map(([k,l,t,o])=>fld('data-i="'+i+'" data-k="'+k+'"',l,t,x[k],o)).join('')+'</div>'+(tab=='debts'?'<p class="warn" data-r="w'+i+'"></p>':'')+'</div>'});
 return h+'<button type="button" class="plus" data-add>+ Add '+NM[tab]+'</button>'+(tab=='debts'?cform():'');
}
function render(){tabs();$('panel').innerHTML=panel();update()}
function update(){
 R=sim();const f=R.flow[0]||{paid:0,dep:0,left:0},N=R.N;
 const sm_=a=>a.reduce((s,x)=>s+(+x.amount||0)*FQ[x.freq],0);
 const st=[['Income / month',fm(R.inc)],['Expenses / month',fm(R.exp)],['Debt paid / month',fm(f.paid)],['Left over / month',fm(f.left),f.left<0],['Debt today',fm(R.debt[0])],
  ['Debt-free by',R.debt[0]<.005?'No debt':R.free>=0?lab(R.free):'After '+N/12+' yrs',R.debt[0]>=.005&&R.free<0],['Interest paid',fm(R.int)],['Savings in '+N/12+' yrs',fm(R.tot[N])]];
 $('stats').innerHTML=st.map(s=>'<div class="stat'+(s[2]?' bad':'')+'"><span>'+s[0]+'</span><b>'+s[1]+'</b></div>').join('');
 $('status').textContent=f.left<0?'Over budget by '+fm(-f.left)+' each month.':'You have '+fm(f.left)+' left over each month.';
 const sum=$('sum');if(sum)sum.innerHTML=tab=='income'?'About <b>'+fm(R.inc)+'</b> per month':tab=='expenses'?'About <b>'+fm(R.exp)+'</b> per month':tab=='debts'?'Total <b>'+fm(R.debt[0])+'</b> &middot; minimums <b>'+fm(D.debts.reduce((s,d)=>s+(+d.min||0),0))+'</b> per month':tab=='savings'?'Total <b>'+fm(R.tot[0])+'</b> &middot; deposits <b>'+fm(f.dep)+'</b> per month':'Plan settings';
 D.debts.forEach((d,i)=>{const w=$('w'+i);if(w)w.textContent=d.balance>0&&d.min<d.balance*gm(+d.apr||0,cn(d))?'The minimum does not cover interest, so this balance will grow.':''});
 $('chips').innerHTML=series().map(s=>'<button type="button" class="chip'+(on(s.k)?'':' off')+'" data-k="'+s.k+'" style="--c:'+s.c+'"><i></i>'+esc(s.n)+'</button>').join('');
 let o='When'.padEnd(10)+'Debt'.padStart(11)+'Savings'.padStart(12)+'Net worth'.padStart(12)+'\n';
 for(let m=0;m<=N;m+=12)o+=(m?lab(m):'Now').padEnd(10)+fm(R.debt[m]).padStart(11)+fm(R.tot[m]).padStart(12)+fm(R.net[m]).padStart(12)+'\n';
 $('output').textContent=o;saveAll();draw();
}
$('tabs').onclick=e=>{const t=e.target.dataset.t;if(t){tab=t;cons=null;render()}};
$('chips').onclick=e=>{const b=e.target.closest('.chip');if(b){vis[b.dataset.k]=!on(b.dataset.k);V.ay=true;update()}};
$('panel').oninput=e=>{const t=e.target,v=t.type=='number'?+t.value:t.value;
 if(t.dataset.ci!=null){const i=+t.dataset.ci;cons.sel=t.checked?[...cons.sel,i]:cons.sel.filter(x=>x!=i);if(!cons.edited)cons.pay=sel_().reduce((s,d)=>s+(+d.min||0),0);render();return}
 if(t.dataset.c){cons[t.dataset.c]=v;if(t.dataset.c=='pay')cons.edited=true;$('cpre').textContent=cprev();return}
 if(t.dataset.p){D.plan[t.dataset.p]=v;if(t.dataset.p=='years')V.ax=true}else if(t.dataset.i!=null)D[tab][t.dataset.i][t.dataset.k]=v;else return;update();if(t.dataset.k=='name'||t.dataset.k==null){tabs()}};
$('panel').onclick=e=>{const t=e.target;
 if(t.dataset.del!=null){const i=+t.dataset.del;D[tab].splice(i,1);if(tab=='debts')cons=null;if(tab=='savings'){const l=+D.plan.left;D.plan.left=String(l==i?-1:l>i?l-1:l)}vis={};V.ay=true;render()}
 else if(t.dataset.add!=null){D[tab].push(NEW[tab](D[tab].length));if(tab=='savings'&&D.savings.length==1&&+D.plan.left<0)D.plan.left='0';render()}
 else if(t.dataset.cons!=null){const b=sumB(D.debts);cons={sel:D.debts.map((_,i)=>i),name:'Consolidation loan',apr:b?+(D.debts.reduce((s,d)=>s+(+d.balance||0)*(+d.apr||0),0)/b).toFixed(2):0,pay:D.debts.reduce((s,d)=>s+(+d.min||0),0),fee:0,comp:'12',edited:false};render()}
 else if(t.dataset.ccancel!=null){cons=null;render()}
 else if(t.dataset.capply!=null){if(cons.sel.length<2)return;const b=sumB(sel_());D.debts=D.debts.filter((_,k)=>!cons.sel.includes(k));D.debts.push({name:cons.name||'Consolidation loan',balance:+(b*(1+(+cons.fee||0)/100)).toFixed(2),apr:+cons.apr||0,min:+cons.pay||0,comp:cons.comp});cons=null;vis={};V.ay=true;render()}
 else if(t.dataset.wipe!=null&&confirm('Clear everything and start over?')){D=entry.d=def();vis={};V.ax=V.ay=true;render()}};
render();
return{draw:()=>R&&draw()};
}
const refresh=()=>insts.forEach(i=>i.rm.disabled=E.length<2);
function mount(entry,after){
 const w=document.createElement('div');w.innerHTML=TPL;const sec=w.firstChild;after?after.after(sec):box.append(sec);
 const inst=make(entry,sec),nm=sec.querySelector('[data-r=bname]');inst.rm=sec.querySelector('[data-r=rm]');insts.push(inst);
 nm.value=entry.name;nm.oninput=()=>{entry.name=nm.value;saveAll()};
 inst.rm.onclick=()=>{if(E.length>1&&confirm('Remove "'+entry.name+'"?')){E.splice(E.indexOf(entry),1);insts.splice(insts.indexOf(inst),1);sec.remove();saveAll();refresh()}};
 const sp=sec.querySelector('[data-r=sp]');sec.querySelector('[data-r=gs]').onclick=()=>{if(sp.hidden)openSheet(entry,sp);else sp.hidden=true};
 sec.querySelector('[data-r=dup]').onclick=()=>{const c={name:entry.name+' copy',d:JSON.parse(JSON.stringify(entry.d))};E.splice(E.indexOf(entry)+1,0,c);mount(c,sec);saveAll();refresh()};
 return sec;
}
E.forEach(e=>mount(e));refresh();
document.getElementById('addBudget').onclick=()=>{const e={name:'New budget',d:blank()};E.push(e);const s=mount(e);refresh();saveAll();s.scrollIntoView({behavior:'smooth'})};
const LK=['income','expenses','debts','savings'],NK='amount balance apr min rate add c years extra'.split(' ');
const xe=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c])),at=o=>Object.keys(o).map(k=>' '+k+'="'+xe(o[k])+'"').join('');
const toXml=()=>'<?xml version="1.0" encoding="UTF-8"?>\n<dapperBudgetPlanner version="1">\n'+E.map(b=>' <budget name="'+xe(b.name)+'">\n  <plan'+at(b.d.plan)+'/>\n'+LK.map(k=>'  <'+k+'>\n'+b.d[k].map(x=>'   <item'+at(x)+'/>\n').join('')+'  </'+k+'>\n').join('')+' </budget>\n').join('')+'</dapperBudgetPlanner>\n';
function fromXml(t){
 const x=new DOMParser().parseFromString(t,'application/xml');if(x.querySelector('parsererror')||x.documentElement.nodeName!='dapperBudgetPlanner')throw 0;
 const ob=e=>{const o={};for(const a of e.attributes)o[a.name]=NK.includes(a.name)?(+a.value||0):a.value;return o};
 const out=[...x.documentElement.children].filter(e=>e.nodeName=='budget').map(e=>{
  const d=blank(),kid=n=>[...e.children].find(c=>c.nodeName==n),p=kid('plan');if(p)Object.assign(d.plan,ob(p));
  LK.forEach(k=>{const c=kid(k);if(c)d[k]=[...c.children].map(ob)});
  d.income.concat(d.expenses).forEach(i=>{if(!FQ[i.freq])i.freq='monthly'});
  d.debts.forEach(i=>i.comp=i.comp||'12');d.savings.forEach((a,i)=>{a.comp=a.comp||'12';a.type=a.type||'Savings';if(a.c==null)a.c=i});
  d.plan.left=String(d.plan.left);if(!['avalanche','snowball','none'].includes(d.plan.strategy))d.plan.strategy='avalanche';
  return{name:e.getAttribute('name')||'Budget',d}});
 if(!out.length)throw 0;return out;
}
document.getElementById('saveXml').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([toXml()],{type:'application/xml'}));a.download='Dapper_Budget_Planner.xml';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
const xin=document.getElementById('xmlIn');
document.getElementById('loadXml').onclick=()=>xin.click();
xin.onchange=async()=>{const f=xin.files[0];xin.value='';if(!f)return;let out;
 try{out=fromXml(await f.text())}catch(e){alert('That file could not be read as a Dapper Budget Planner .xml file.');return}
 if(!confirm('Load '+out.length+' budget'+(out.length>1?'s':'')+' from this file? This replaces the budgets on this page.'))return;
 box.innerHTML='';insts.length=0;E.length=0;E.push(...out);E.forEach(e=>mount(e));refresh();saveAll()};
const mq=x=>(+x.amount||0)*FQ[x.freq],col=n=>String.fromCharCode(65+n);
const crcT=(()=>{const t=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t.push(c>>>0)}return t})();
const crc=u=>{let c=-1;for(const b of u)c=crcT[(c^b)&255]^(c>>>8);return(c^-1)>>>0};
function zip(F){const te=new TextEncoder(),L=[],C=[];let off=0,cs=0;
 F.forEach(([n,t])=>{const nm=te.encode(n),d=te.encode(t),c=crc(d),a=new DataView(new ArrayBuffer(30)),b=new DataView(new ArrayBuffer(46));
  [[a,0,0x04034b50,4],[a,4,20,2],[a,6,0x800,2],[a,12,0x21,2],[a,14,c,4],[a,18,d.length,4],[a,22,d.length,4],[a,26,nm.length,2],
   [b,0,0x02014b50,4],[b,4,20,2],[b,6,20,2],[b,8,0x800,2],[b,14,0x21,2],[b,16,c,4],[b,20,d.length,4],[b,24,d.length,4],[b,28,nm.length,2],[b,42,off,4]].forEach(([v,o,x,w])=>w==4?v.setUint32(o,x,1):v.setUint16(o,x,1));
  L.push(a,nm,d);C.push(b,nm);off+=30+nm.length+d.length;cs+=46+nm.length});
 const e=new DataView(new ArrayBuffer(22));e.setUint32(0,0x06054b50,1);e.setUint16(8,F.length,1);e.setUint16(10,F.length,1);e.setUint32(12,cs,1);e.setUint32(16,off,1);
 return new Blob([...L,...C,e],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
}
function Sh(){const rows={},cw=[];return{cw,set(ref,v,s=0){(rows[+ref.slice(1)]=rows[+ref.slice(1)]||[]).push([ref,v,s])},
 xml(){let x='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><cols>'+cw.map(([i,w,st])=>'<col min="'+i+'" max="'+i+'" width="'+w+'" customWidth="1"'+(st?' style="'+st+'"':'')+'/>').join('')+'</cols><sheetData>';
  Object.keys(rows).sort((a,b)=>a-b).forEach(r=>{x+='<row r="'+r+'">'+rows[r].sort((a,b)=>a[0]<b[0]?-1:1).map(([ref,v,s])=>v&&v.f!=null?'<c r="'+ref+'" s="'+s+'"><f>'+xe(v.f)+'</f></c>':typeof v=='number'?'<c r="'+ref+'" s="'+s+'"><v>'+v+'</v></c>':'<c r="'+ref+'" s="'+s+'" t="inlineStr"><is><t>'+xe(v)+'</t></is></c>').join('')+'</row>'});
  return x+'</sheetData></worksheet>'}}}
function buildSheet(exps,y0,m0){
 const n=12;
 const used=new Set(),sn=t=>{const b=String(t).replace(/[\[\]:*?\/\\]/g,' ').trim().slice(0,31)||'Expense';let u=b,k=2;while(used.has(u.toLowerCase()))u=b.slice(0,28)+' '+k++;used.add(u.toLowerCase());return u};
 const months=[...Array(n)].map((_,j)=>{const a=y0*12+m0+j;return{y:Math.floor(a/12),m:a%12}}),ser=(y,m)=>Math.round((Date.UTC(y,m,1)-Date.UTC(1899,11,30))/864e5);
 const et=exps.map(x=>sn(x.name)),yt=sn('Year at a glance'),q=t=>"'"+t.replace(/'/g,"''")+"'",sheets=[];
 exps.forEach((x,i)=>{const s=Sh();s.cw.push([1,14,3],[2,28],[3,12,2],[4,3],[5,14],[6,12],[7,12]);
  s.set('A1',x.name,5);['Date','Note','Amount'].forEach((h,k)=>s.set(col(k)+'3',h,1));s.set('E1','Monthly budget',5);s.set('F1',+mq(x).toFixed(2),2);
  ['Month','Spent','Remaining'].forEach((h,k)=>s.set(col(4+k)+'3',h,1));
  months.forEach((o,j)=>{const r=4+j;s.set('E'+r,ser(o.y,o.m),6);s.set('F'+r,{f:'SUMIFS($C$4:$C$1000,$A$4:$A$1000,">="&E'+r+',$A$4:$A$1000,"<"&EDATE(E'+r+',1))'},2);s.set('G'+r,{f:'$F$1-F'+r},2)});
  s.set('E'+(4+n),'All entries',5);s.set('F'+(4+n),{f:'SUM($C$4:$C$1000)'},4);sheets.push([et[i],s])});
 {const s=Sh(),h=exps.length+4;[0,1,2].forEach(b=>s.cw.push([b*5+1,22],[b*5+2,12],[b*5+3,12],[b*5+4,12],[b*5+5,3]));
  months.forEach((o,j)=>{const c0=(j%3)*5,r0=1+Math.floor(j/3)*h,C=k=>col(c0+k);
   s.set(C(0)+r0,MN[o.m]+' '+o.y,5);['Item','Budget','Spent','Remaining'].forEach((t,i)=>s.set(C(i)+(r0+1),t,1));
   exps.forEach((x,i)=>{const r=r0+2+i,e=q(et[i]);s.set(C(0)+r,x.name);s.set(C(1)+r,{f:e+'!$F$1'},2);s.set(C(2)+r,{f:e+'!F'+(4+j)},2);s.set(C(3)+r,{f:C(1)+r+'-'+C(2)+r},2)});
   const t=r0+2+exps.length;s.set(C(0)+t,'Total',5);[1,2,3].forEach(k=>s.set(C(k)+t,{f:'SUM('+C(k)+(r0+2)+':'+C(k)+(t-1)+')'},4))});
  sheets.push([yt,s])}
 const NS='xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"',RN='http://schemas.openxmlformats.org/officeDocument/2006/relationships',H='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',N=sheets.length,X=(i,f)=>'<xf numFmtId="'+i+'" fontId="'+f[0]+'" fillId="'+f[1]+'" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1"/>';
 const F=[['[Content_Types].xml',H+'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'+sheets.map((_,i)=>'<Override PartName="/xl/worksheets/sheet'+(i+1)+'.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>').join('')+'</Types>'],
 ['_rels/.rels',H+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="'+RN+'/officeDocument" Target="xl/workbook.xml"/></Relationships>'],
 ['xl/workbook.xml',H+'<workbook '+NS+' xmlns:r="'+RN+'"><sheets>'+sheets.map(([nm],i)=>'<sheet name="'+xe(nm)+'" sheetId="'+(i+1)+'" r:id="rId'+(i+1)+'"/>').join('')+'</sheets><calcPr fullCalcOnLoad="1"/></workbook>'],
 ['xl/_rels/workbook.xml.rels',H+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+sheets.map((_,i)=>'<Relationship Id="rId'+(i+1)+'" Type="'+RN+'/worksheet" Target="worksheets/sheet'+(i+1)+'.xml"/>').join('')+'<Relationship Id="rId'+(N+1)+'" Type="'+RN+'/styles" Target="styles.xml"/></Relationships>'],
 ['xl/styles.xml',H+'<styleSheet '+NS+'><numFmts count="3"><numFmt numFmtId="164" formatCode="&quot;$&quot;#,##0.00"/><numFmt numFmtId="165" formatCode="yyyy\\-mm\\-dd"/><numFmt numFmtId="166" formatCode="mmm\\ yyyy"/></numFmts><fonts count="2"><font><sz val="11"/><name val="Arial"/></font><font><b/><sz val="11"/><name val="Arial"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFF6E6D8"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="7">'+[[0,[0,0]],[0,[1,2]],[164,[0,0]],[165,[0,0]],[164,[1,0]],[0,[1,0]],[166,[0,0]]].map(([i,f])=>X(i,f)).join('')+'</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>'],
 ...sheets.map(([,sh],i)=>['xl/worksheets/sheet'+(i+1)+'.xml',sh.xml()])];
 return zip(F);
}
function openSheet(entry,sp){
 const ex=entry.d.expenses,d=new Date();sp.hidden=false;
 if(!ex.length){sp.innerHTML='<h2>Make a workbook</h2><p class="note">Add some expenses to this budget first.</p>';return}
 sp.innerHTML='<h2>Make a workbook</h2><p class="note">Pick the expenses to include. You get one tab for each expense, followed by a Year at a glance tab with a block for every month. Type each purchase into its expense tab and the totals update.</p>'+ex.map((x,i)=>'<label class="check"><input type="checkbox" data-sx="'+i+'" checked> '+esc(x.name)+' &middot; '+fm(mq(x))+' per month</label>').join('')+'<div class="fields" style="margin-top:10px"><label>First month<input type="month" data-r="sm" value="'+d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'"></label></div><div class="actions"><button type="button" data-r="sgo">Create workbook file</button><button type="button" data-r="sc">Close</button></div><p class="note" data-r="smsg"></p>';
 const q=k=>sp.querySelector('[data-r='+k+']');q('sc').onclick=()=>sp.hidden=true;
 q('sgo').onclick=()=>{const pick=[...sp.querySelectorAll('[data-sx]')].filter(c=>c.checked).map(c=>ex[+c.dataset.sx]);
  if(!pick.length){q('smsg').textContent='Tick at least one expense.';return}
  const[y,m]=(q('sm').value||'').split('-').map(Number),a=document.createElement('a');
  a.href=URL.createObjectURL(buildSheet(pick,y||d.getFullYear(),y?m-1:d.getMonth()));a.download=(entry.name.replace(/[^\w\- ]+/g,'').trim()||'Budget').replace(/ +/g,'_')+'_Workbook.xlsx';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  q('smsg').innerHTML='Downloaded your workbook. To open it in Google Sheets, go to <a href="https://sheets.new" target="_blank" rel="noopener">sheets.new</a>, choose File &gt; Import &gt; Upload, and pick the file. Or drag it into Google Drive and open it with Google Sheets.'};
}
addEventListener('resize',()=>insts.forEach(i=>i.draw()));
})();
