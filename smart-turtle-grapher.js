(()=>{"use strict";
const $=id=>document.getElementById(id);
const COLORS=['#1f62c4','#d94b3d','#1aa6a6','#a44ac4','#e08a1e','#3f8f3a','#334144'];

/* ---------- Math engine: tokenizer, parser, compiler ---------- */
function lgam(z){const g=[676.5203681218851,-1259.1392167224028,771.3234287776531,-176.6150291621406,12.507343278686905,-.13857109526572012,9.984369578019572e-6,1.5056327351493116e-7];z--;let a=.9999999999998099,t=z+7.5;g.forEach((c,i)=>a+=c/(z+i+1));return .5*Math.log(2*Math.PI)+(z+.5)*Math.log(t)-t+Math.log(a)}
function gamma(z){if(Number.isInteger(z)){if(z<=0)return NaN;if(z<=171){let r=1;for(let i=2;i<z;i++)r*=i;return r}return Infinity}if(z<.5)return Math.PI/(Math.sin(Math.PI*z)*gamma(1-z));return Math.exp(lgam(z))}
const FUNCS={sin:Math.sin,cos:Math.cos,tan:Math.tan,sec:x=>1/Math.cos(x),csc:x=>1/Math.sin(x),cot:x=>1/Math.tan(x),asin:Math.asin,acos:Math.acos,atan:Math.atan,arcsin:Math.asin,arccos:Math.acos,arctan:Math.atan,sinh:Math.sinh,cosh:Math.cosh,tanh:Math.tanh,sqrt:Math.sqrt,cbrt:Math.cbrt,abs:Math.abs,ln:Math.log,log:Math.log10,exp:Math.exp,floor:Math.floor,ceil:Math.ceil,round:Math.round,sign:Math.sign,min:Math.min,max:Math.max,mod:(a,b)=>((a%b)+b)%b};
const CONST={pi:Math.PI,tau:2*Math.PI,e:Math.E};
const NAMES=[...Object.keys(FUNCS),...Object.keys(CONST)].sort((a,b)=>b.length-a.length);
function lex(s){s=s.replace(/π/g,'pi').replace(/[·×]/g,'*').replace(/÷/g,'/').replace(/[−–]/g,'-').replace(/\*\*/g,'^').replace(/[\[{]/g,'(').replace(/[\]}]/g,')');const t=[];let i=0;while(i<s.length){const c=s[i];if(/\s/.test(c)){i++;continue}const m=s.slice(i).match(/^(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?/);if(m){t.push({t:'num',v:+m[0]});i+=m[0].length;continue}if(/[a-zA-Z]/.test(c)){const rest=s.slice(i),n=NAMES.find(n=>rest.startsWith(n));if(n){t.push({t:'id',v:n});i+=n.length}else{t.push({t:'id',v:c});i++}continue}if('+-*/^(),|!'.includes(c)){t.push({t:c});i++;continue}throw Error(`I don't understand "${c}"`)}return t}
function compile(src,fns){const tk=lex(src),vars=new Set,calls=new Set;let p=0;const peek=()=>tk[p],next=()=>tk[p++],is=t=>peek()&&peek().t===t,expect=t=>{if(!is(t))throw Error(`Missing "${t}"`);p++},atom=k=>k&&(k.t==='num'||k.t==='id'||k.t==='(');
function add(){let a=mul();while(is('+')||is('-')){const o=next().t,b=mul(),l=a;a=o==='+'?s=>l(s)+b(s):s=>l(s)-b(s)}return a}
function mul(){let a=unary();for(;;){if(is('*')||is('/')){const o=next().t,b=unary(),l=a;a=o==='*'?s=>l(s)*b(s):s=>l(s)/b(s)}else if(atom(peek())){const b=pow(),l=a;a=s=>l(s)*b(s)}else return a}}
function unary(){if(is('-')){next();const a=unary();return s=>-a(s)}if(is('+')){next();return unary()}return pow()}
function pow(){const a=post();if(is('^')){next();const b=unary();return s=>Math.pow(a(s),b(s))}return a}
function post(){let a=prim();while(is('!')){next();const l=a;a=s=>gamma(l(s)+1)}return a}
function prim(){const k=next();if(!k)throw Error('The expression ends too early');if(k.t==='num'){const v=k.v;return()=>v}if(k.t==='('){const a=add();expect(')');return a}if(k.t==='|'){const a=add();expect('|');return s=>Math.abs(a(s))}if(k.t==='id'){const n=k.v;if(FUNCS[n]){const f=FUNCS[n];let args;if(is('(')){next();args=[add()];while(is(',')){next();args.push(add())}expect(')')}else args=[pow()];if(args.length===1){const a=args[0];return s=>f(a(s))}return s=>f(...args.map(a=>a(s)))}if(n in CONST){const v=CONST[n];return()=>v}if(fns.has(n)&&is('(')){next();const a=add();expect(')');calls.add(n);return s=>s.call(n,a(s))}vars.add(n);return s=>s.v[n]}throw Error(`Unexpected "${k.t}"`)}
if(!tk.length)throw Error('Empty expression');const f=add();if(p<tk.length){const k=tk[p];throw Error(`Unexpected "${k.v!=null?k.v:k.t}"`)}return{f,vars,calls}}
function topSplit(s,ch){let d=0,out=[],st=0;for(let i=0;i<s.length;i++){const c=s[i];if('([{'.includes(c))d++;else if(')]}'.includes(c))d--;else if(c===ch&&!d){out.push(s.slice(st,i));st=i+1}}out.push(s.slice(st));return out}
function findRel(s){let d=0;for(let i=0;i<s.length;i++){const c=s[i];if('([{'.includes(c))d++;else if(')]}'.includes(c))d--;else if(!d&&'<>='.includes(c)){const op=(c!=='='&&s[i+1]==='=')?c+'=':c;return{lhs:s.slice(0,i).trim(),op,rhs:s.slice(i+op.length).trim()}}}return null}
function wrapped(t){if(t[0]!=='('||t[t.length-1]!==')')return false;let d=0;for(let i=0;i<t.length;i++){if(t[i]==='(')d++;else if(t[i]===')'){d--;if(!d&&i<t.length-1)return false}}return true}
const SETTING_RANGE={gravity:[0,30],friction:[0,1]};
const FLIP={'<':'>','>':'<','<=':'>=','>=':'<=','=':'='};
/* ---------- State ---------- */
let uid=0,colorN=0;
const S={rows:[],focus:null,hover:null,pin:null,env:null,playing:new Set,time:0,timeRunning:false,timeSpeed:1,timeUsed:false,paramOrder:[]};
const V={cx:0,cy:0,s:30},G={l:72,t:20,w:600,h:400};
const newRow=(text='')=>({id:++uid,text,color:COLORS[colorN++%COLORS.length],hidden:false,min:null,max:null});

function analyze(){const fns=new Set,defs={},params={},vals={t:S.time};S.timeUsed=false;S.paramOrder=[];
S.env={v:{},depth:0,call(n,a){const d=defs[n];if(!d||!d.f||this.depth>60)return NaN;const o=this.v.x;this.v.x=a;this.depth++;const r=d.f(this);this.depth--;this.v.x=o;return r}};
const rows=S.rows;let skSeen=false;
rows.forEach(r=>{Object.assign(r,{kind:null,err:null,missing:[],value:null,slider:false,name:null,f:null,g:null,op:'=',lbl:null,split:null,_cache:null});const t=r.text.trim().replace(/≤/g,'<=').replace(/≥/g,'>=');r.t=t;if(!t){r.kind='empty';return}if(/^skate$/i.test(t)){if(skSeen){r.kind='dupe';r.err='Only one skate line is allowed. The turtle already rides from the skate line above';return}skSeen=true;r.kind='skate';if(!Number.isFinite(r.gravity))r.gravity=9.8;if(!Number.isFinite(r.friction))r.friction=0.05;return}if(/^t\s*(\(\s*x\s*\))?\s*=(?!=)/.test(t)){r.kind='reserved';r.err='t is reserved for time, so it cannot be redefined. Use the time controls above to pause or restart it';return}let m=t.match(/^([a-zA-Z])\s*\(\s*x\s*\)\s*=([^=<>]+)$/);if(m&&!'xy'.includes(m[1])&&m[1]!=='e'){r.kind='def';r.name=m[1];r.rhs=m[2];if(fns.has(m[1]))r.err=`${m[1]}(x) is defined more than once`;fns.add(m[1]);defs[m[1]]=r;return}m=t.match(/^([a-zA-Z])\s*=([^=<>]+)$/);if(m&&!'xy'.includes(m[1])&&m[1]!=='e'){r.kind='param';r.name=m[1];r.rhs=m[2];if(params[m[1]])r.err=`${m[1]} is defined more than once`;else params[m[1]]=r}});
const fail=(r,x)=>{r.err=x.message;r.f=null};
const need=(r,c,allowed)=>{if(c.vars.has('t'))S.timeUsed=true;c.vars.forEach(v=>{if(v!=='t'&&!allowed.includes(v)&&!params[v])r.missing.push(v)});if(r.missing.length)r.err=`${r.missing.map(v=>`"${v}"`).join(', ')} ${r.missing.length>1?'are':'is'} not defined`};
rows.forEach(r=>{if(r.err||(r.kind!=='def'&&r.kind!=='param'))return;try{const c=compile(r.rhs,fns);r.f=c.f;r.cvars=c.vars;r.calls=c.calls;r.deps=[...c.vars].filter(v=>v!=='x');need(r,c,r.kind==='def'?['x']:[]);if(r.kind==='param'&&c.vars.has('x'))r.err='A slider value cannot depend on x. Use y = ... to graph it.';if(r.kind==='param'&&/^\s*-?(\d+\.?\d*|\.\d+)\s*$/.test(r.rhs))r.slider=true}catch(x){fail(r,x)}});
// resolve parameter values (they may depend on each other)
const plist=Object.values(params).filter(r=>!r.err&&r.f);let left=plist.slice();for(let pass=0;pass<=plist.length&&left.length;pass++){left=left.filter(r=>{if(r.deps.every(d=>d in vals)){S.env.v=vals;r.value=r.f(S.env);vals[r.name]=r.value;S.paramOrder.push(r);return false}return true})}left.forEach(r=>r.err='This slider depends on itself in a loop');
S.env.v=Object.assign({x:0,y:0},vals);const E=S.env;
// Names whose value changes with time: sliders that use t, and functions that use t or those sliders.
const timedP=new Set;S.paramOrder.forEach(r=>{if(r.deps.some(d=>d==='t'||timedP.has(d)))timedP.add(r.name)});
const timedD=new Set;for(let k=0;k<6;k++)Object.values(defs).forEach(r=>{if(r.cvars&&([...r.cvars].some(v=>v==='t'||timedP.has(v))||[...r.calls].some(n=>timedD.has(n))))timedD.add(r.name)});
const timed=c=>[...c.vars].some(v=>v==='t'||timedP.has(v))||[...c.calls].some(n=>timedD.has(n));
// Move the clock: set t, then refresh every slider value that depends on it (in dependency order).
S.setTime=tt=>{const v=E.v;v.t=tt;S.paramOrder.forEach(r=>{if(r.deps.length)v[r.name]=r.value=r.f(E)})};
rows.forEach(r=>{if(r.kind==='param'&&r.slider&&!r.err){const v=r.value;if(r.min==null||r.max==null){const lim=SETTING_RANGE[r.name]||[-10,10];r.min=Math.min(lim[0],Math.floor(v));r.max=Math.max(lim[1],Math.ceil(v))}}});
rows.forEach(r=>{if(r.err||r.kind==='empty'||r.kind==='param'||r.kind==='skate')return;const t=r.t;try{
if(r.kind==='def'){r.op='=';const f=r.f;r.fx=x=>{E.v.x=x;return f(E)};r.kind='yfx';r.lbl=`${r.name}(x)`;return}
if(wrapped(t)){const parts=topSplit(t.slice(1,-1),',');if(parts.length===2){const a=compile(parts[0],fns),b=compile(parts[1],fns);need(r,{vars:new Set([...a.vars,...b.vars])},[]);r.kind='point';r.pf=[a.f,b.f];if(!r.err){r.px=a.f(E);r.py=b.f(E)}return}}
const rel=findRel(t);
if(!rel){const c=compile(t,fns);if(c.vars.has('y')){r.err='Add an equals sign to graph an equation with y, for example y = ... or x^2 + y^2 = 4';return}if(c.vars.has('x')){r.kind='yfx';need(r,c,['x']);const f=c.f;r.fx=x=>{E.v.x=x;return f(E)};return}r.kind='value';need(r,c,[]);r.vf=c.f;if(!r.err)r.value=c.f(E);return}
if(!rel.lhs||!rel.rhs)throw Error('Each side of the '+rel.op+' needs something');
if(/[<>=]/.test(rel.rhs.replace(/^=/,'')))throw Error('Only one comparison per line');
const L=compile(rel.lhs,fns),R=compile(rel.rhs,fns),one=(c,v)=>c.vars.size===1&&c.vars.has(v)&&rel[c===L?'lhs':'rhs'].trim()===v;
let op=rel.op;
if(one(L,'y')&&!R.vars.has('y')){r.kind='yfx';r.op=op;need(r,R,['x']);const f=R.f;r.fx=x=>{E.v.x=x;return f(E)}}
else if(one(R,'y')&&!L.vars.has('y')){r.kind='yfx';r.op=FLIP[op];need(r,L,['x']);const f=L.f;r.fx=x=>{E.v.x=x;return f(E)}}
else if(one(L,'x')&&!R.vars.has('x')){r.kind='xfy';r.op=op;need(r,R,['y']);const f=R.f;r.gy=y=>{E.v.y=y;return f(E)}}
else if(one(R,'x')&&!L.vars.has('x')){r.kind='xfy';r.op=FLIP[op];need(r,L,['y']);const f=L.f;r.gy=y=>{E.v.y=y;return f(E)}}
else{r.kind='implicit';r.op=op;need(r,{vars:new Set([...L.vars,...R.vars])},['x','y']);const a=L.f,b=R.f;r.F=(x,y)=>{E.v.x=x;E.v.y=y;return a(E)-b(E)};const aS=!timed(L),bS=!timed(R);if(aS||bS)r.split={a:(x,y)=>{E.v.x=x;E.v.y=y;return a(E)},b:(x,y)=>{E.v.x=x;E.v.y=y;return b(E)},aStatic:aS,bStatic:bS};if(!L.vars.size&&!R.vars.size)r.err='This compares two numbers. Include x or y to graph it.'}
}catch(x){fail(r,x)}});
rows.forEach(applyRange);}
const RANGED=['yfx','xfy','implicit'],MOVABLE=['yfx','xfy','implicit','point'];
/* ---------- Auto-translate: rewrite an expression as y = f(x + a) + b ---------- */
// Replace the variables x and y (never the x inside names like exp or max) with new text.
function subVars(src,map){let out='',i=0;while(i<src.length){const c=src[i];if(/[a-zA-Z]/.test(c)){const rest=src.slice(i),n=NAMES.find(n=>rest.startsWith(n));if(n){out+=n;i+=n.length;continue}out+=map[c]!=null?map[c]:c;i++;continue}out+=c;i++}return out}
function moveText(r,step){const dec=Math.max(0,Math.min(8,-Math.floor(Math.log10(step)+1e-9))),num=v=>String(+Math.abs(v).toFixed(dec)),dx=+r.dx.toFixed(dec),dy=+r.dy.toFixed(dec),
X=dx?`(x ${dx>0?'-':'+'} ${num(dx)})`:'x',Y=dy?`(y ${dy>0?'-':'+'} ${num(dy)})`:'y',both=t=>subVars(t,{x:X,y:Y}),
// add a shift to an expression, folding it into a trailing constant ("x^2 - 3" moved up 1.2 becomes "x^2 - 1.8")
plus=v=>v?` ${v>0?'+':'-'} ${num(v)}`:'',add=(e,v)=>{e=tidy(e.trim());if(!v)return e;if(/^-?\d*\.?\d+$/.test(e))return String(+(+e+v).toFixed(dec));const m=e.match(/^([\s\S]*?)\s*([+-])\s*(\d*\.?\d+)$/);if(m&&m[1].trim()&&!/[\^*\/(+\-]$/.test(m[1].trim())&&depth0(m[1])){const c=+((m[2]==='-'?-1:1)*+m[3]+v).toFixed(dec);return c?`${m[1].trim()} ${c<0?'-':'+'} ${num(c)}`:m[1].trim()}return e+plus(v)},
t=r.base.trim().replace(/≤/g,'<=').replace(/≥/g,'>='),k=r.baseKind;let m;
if(k==='point'){const q=topSplit(t.slice(1,-1),',');return`(${add(q[0],dx)}, ${add(q[1],dy)})`}
if((m=t.match(/^([a-zA-Z])\s*\(\s*x\s*\)\s*=([\s\S]*)$/)))return`${m[1]}(x) = ${add(subVars(m[2].trim(),{x:X}),dy)}`;
const rel=findRel(t);
if(!rel)return k==='yfx'?add(subVars(t,{x:X}),dy):tidy(both(t));
if(k==='yfx'&&rel.lhs==='y')return`y ${rel.op} ${add(subVars(rel.rhs,{x:X}),dy)}`;
if(k==='yfx'&&rel.rhs==='y')return`${add(subVars(rel.lhs,{x:X}),dy)} ${rel.op} y`;
if(k==='xfy'&&rel.lhs==='x')return`x ${rel.op} ${add(subVars(rel.rhs,{y:Y}),dx)}`;
if(k==='xfy'&&rel.rhs==='x')return`${add(subVars(rel.lhs,{y:Y}),dx)} ${rel.op} x`;
return`${tidy(both(rel.lhs))} ${rel.op} ${tidy(both(rel.rhs))}`}
const tidy=e=>e.replace(/\(\(([xy] [+-] [\d.]+)\)\)/g,'($1)'),depth0=e=>{let d=0;for(const c of e){if(c==='(')d++;else if(c===')')d--}return d===0};
// Is the pointer within a few pixels of this expression's curve?
function grabs(r,mx,my){const tol=12;if(r.hidden||r.err)return false;
if(r.kind==='point')return Math.hypot(px(r.px)-mx,py(r.py)-my)<tol;
if(r.kind==='yfx'||r.kind==='xfy'){for(let k=-tol;k<=tol;k+=2){if(r.kind==='yfx'){const y=r.fx(wx(mx+k));if(Number.isFinite(y)&&Math.hypot(k,py(y)-my)<tol)return true}else{const x=r.gy(wy(my+k));if(Number.isFinite(x)&&Math.hypot(k,px(x)-mx)<tol)return true}}return false}
if(r.kind==='implicit'){const x=wx(mx),y=wy(my),h=1/V.s,F=r.F(x,y),gx=(r.F(x+h,y)-r.F(x-h,y))/(2*h),gy=(r.F(x,y+h)-r.F(x,y-h))/(2*h),g=Math.hypot(gx,gy);return Number.isFinite(F)&&g>0&&Math.abs(F)/g*V.s<tol}return false}
const movers=()=>S.rows.filter(r=>r.move&&MOVABLE.includes(r.kind)&&!r.err&&!r.hidden);
let drag=null;
function startMove(mx,my){const ms=movers();if(!ms.some(r=>grabs(r,mx,my)))return false;
drag={x:wx(mx),y:wy(my),rows:ms.map(r=>{if(r.text!==r.gen){r.base=r.text;r.baseKind=r.kind;r.dx=0;r.dy=0}return{r,dx:r.dx,dy:r.dy,dom:r.dom?r.dom.slice():null}})};return true}
function doMove(mx,my){const step=nice(6/V.s),snap=v=>Math.round(v/step)*step,ddx=snap(wx(mx)-drag.x),ddy=snap(wy(my)-drag.y);
drag.rows.forEach(({r,dx,dy,dom})=>{r.dx=dx+ddx;r.dy=dy+ddy;r.text=r.gen=moveText(r,step);
// a chosen x or y range travels with the curve
if(dom)r.dom=dom.map((v,i)=>v==null||v===''||!Number.isFinite(+v)?v:String(+(+v+(i<2?ddx:ddy)).toFixed(6)));
const el=elOf(r);if(el)el.querySelector('.expr').value=r.text});changed(false)}

// Per-expression x and y ranges: outside them the curve is undefined, so it is neither drawn nor ridden.
function rangeOf(r){const d=(r.dom||[]).map(v=>v==null||v===''||!Number.isFinite(+v)?null:+v);let[x0,x1,y0,y1]=[d[0],d[1],d[2],d[3]];if(x0!=null&&x1!=null&&x0>x1)[x0,x1]=[x1,x0];if(y0!=null&&y1!=null&&y0>y1)[y0,y1]=[y1,y0];return[x0??-Infinity,x1??Infinity,y0??-Infinity,y1??Infinity]}
function hasRange(r){return(r.dom||[]).some(v=>v!=null&&v!=='')}
function applyRange(r){if(r.err||!RANGED.includes(r.kind)||!hasRange(r))return;const[x0,x1,y0,y1]=rangeOf(r),inX=x=>x>=x0&&x<=x1,inY=y=>y>=y0&&y<=y1;
if(r.kind==='yfx'){const f=r.fx;r.fx=x=>{if(!inX(x))return NaN;const y=f(x);return inY(y)?y:NaN}}
else if(r.kind==='xfy'){const g=r.gy;r.gy=y=>{if(!inY(y))return NaN;const x=g(y);return inX(x)?x:NaN}}
else{const F=r.F;r.F=(x,y)=>inX(x)&&inY(y)?F(x,y):NaN;if(r.split){const s=r.split,wrap=f=>(x,y)=>inX(x)&&inY(y)?f(x,y):NaN;s.a=wrap(s.a);s.b=wrap(s.b)}}}

/* ---------- Coordinates and formatting (plot window inside the frame) ---------- */
const px=x=>G.l+G.w/2+(x-V.cx)*V.s,py=y=>G.t+G.h/2-(y-V.cy)*V.s,wx=p=>V.cx+(p-G.l-G.w/2)/V.s,wy=p=>V.cy-(p-G.t-G.h/2)/V.s;
const inPlot=(x,y)=>x>=G.l&&x<=G.l+G.w&&y>=G.t&&y<=G.t+G.h;
function nice(raw){const p=Math.pow(10,Math.floor(Math.log10(raw))),m=raw/p;return(m<1.5?1:m<3.5?2:m<7.5?5:10)*p}
function fmtAxis(v){if(Math.abs(v)<1e-12)return'0';const a=Math.abs(v);return a>=1e6||a<1e-4?v.toExponential(1).replace('e+','e'):String(+v.toPrecision(10))}
function fmt(v){if(!Number.isFinite(v))return v!==v?'undefined':(v>0?'∞':'-∞');if(Math.abs(v)<1e-10)return'0';const a=Math.abs(v);return a>=1e7||a<1e-4?v.toPrecision(5).replace('e+','e'):String(+v.toFixed(4))}
const pt=(x,y)=>`(${fmt(x)}, ${fmt(y)})`;
const graphable=r=>!r.hidden&&!r.err&&['yfx','xfy','implicit','point'].includes(r.kind);

/* ---------- Curve sampling ---------- */
// True discontinuity test: keep halving the interval around the jump; a real jump never shrinks.
function isJump(f,a,b,fa,fb,thr){for(let i=0;i<40;i++){const m=(a+b)/2,fm=f(m);if(!Number.isFinite(fm))return true;if(Math.abs(fm-fa)>Math.abs(fb-fm)){b=m;fb=fm}else{a=m;fa=fm}if(Math.abs(fb-fa)<thr*.25)return false}return true}
function sample(f,start,len,toS,other,span){const N=Math.ceil(len*1.5),segs=[];let cur=[],prev=null;
for(let i=0;i<=N;i++){const a=start+i*len/N,v=f(other(a));if(!Number.isFinite(v)){if(cur.length>1)segs.push(cur);cur=[];prev=null;continue}const s=toS(v);if(prev&&Math.abs(s-prev[1])>4&&isJump(f,other(prev[0]),other(a),prev[2],v,4/V.s)){if(cur.length>1)segs.push(cur);cur=[]}prev=[a,s,v];cur.push([a,Math.max(-span*3,Math.min(span*4,s))])}if(cur.length>1)segs.push(cur);return segs}
const sampleY=f=>sample(f,G.l,G.w,py,wx,G.h);
const sampleX=g=>sample(g,G.t,G.h,px,wy,G.w).map(seg=>seg.map(([a,s])=>[s,a]));
function contour(F,op,c,color,fillOnly,row){const r=Math.max(3,Math.round(Math.sqrt(G.w*G.h/26000))),cols=Math.ceil(G.w/r)+1,rows=Math.ceil(G.h/r)+1,v=new Float64Array(cols*rows),X=i=>G.l+i*r,Y=j=>G.t+j*r;
const grid=f=>{const g=new Float64Array(cols*rows);for(let j=0;j<rows;j++){const y=wy(Y(j));for(let i=0;i<cols;i++)g[j*cols+i]=f(wx(X(i)),y)}return g};
// A side of the equation that ignores time is sampled once per view, then reused every frame.
if(row&&row.split){const sp=row.split,key=[V.cx,V.cy,V.s,G.l,G.t,G.w,G.h,r].join();if(!row._cache||row._cache.key!==key)row._cache={key,a:sp.aStatic?grid(sp.a):null,b:sp.bStatic?grid(sp.b):null};
const ga=row._cache.a||grid(sp.a),gb=row._cache.b||grid(sp.b);for(let k=0;k<v.length;k++)v[k]=ga[k]-gb[k]}
else for(let j=0;j<rows;j++){const y=wy(Y(j));for(let i=0;i<cols;i++)v[j*cols+i]=F(wx(X(i)),y)}
if(op!=='='){const want=op[0]==='<'?-1:1;c.fillStyle=color;c.globalAlpha=.16;for(let j=0;j<rows-1;j++){let st=-1;for(let i=0;i<cols;i++){let ok=false;if(i<cols-1){const k=j*cols+i,m=(v[k]+v[k+1]+v[k+cols]+v[k+cols+1])/4;ok=Number.isFinite(m)&&Math.sign(m)===want}if(ok&&st<0)st=i;if(!ok&&st>=0){c.fillRect(X(st),Y(j),(i-st)*r,r);st=-1}}}c.globalAlpha=1}
if(fillOnly)return;c.beginPath();
const cross=(x0,y0,a,x1,y1,b)=>{const t=a/(a-b),xx=x0+(x1-x0)*t,yy=y0+(y1-y0)*t,m=F(wx(xx),wy(yy));return Number.isFinite(m)&&Math.abs(m)<Math.max(Math.abs(a),Math.abs(b))?[xx,yy]:null};
const seg=(p,q)=>{if(p&&q){c.moveTo(p[0],p[1]);c.lineTo(q[0],q[1])}};
for(let j=0;j<rows-1;j++)for(let i=0;i<cols-1;i++){const k=j*cols+i,a=v[k],b=v[k+1],cc=v[k+cols+1],d=v[k+cols];if(!(Number.isFinite(a)&&Number.isFinite(b)&&Number.isFinite(cc)&&Number.isFinite(d)))continue;const sa=a>0,sb=b>0,sc=cc>0,sd=d>0;if(sa===sb&&sb===sc&&sc===sd)continue;const x0=X(i),y0=Y(j),x1=x0+r,y1=y0+r,T=sa!==sb?cross(x0,y0,a,x1,y0,b):null,R=sb!==sc?cross(x1,y0,b,x1,y1,cc):null,B=sd!==sc?cross(x0,y1,d,x1,y1,cc):null,L=sa!==sd?cross(x0,y0,a,x0,y1,d):null,pts=[T,R,B,L].filter(Boolean);
if(pts.length===2)seg(pts[0],pts[1]);else if(pts.length===4){if(((a+b+cc+d)>0)===sa){seg(T,R);seg(B,L)}else{seg(T,L);seg(R,B)}}}
c.stroke()}

/* ---------- Drawing (same window layout as the probability simulator) ---------- */
function strokeSegs(c,segs){c.beginPath();segs.forEach(s=>s.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y)));c.stroke()}
function fillSegs(c,segs,edge,vertical){c.beginPath();segs.forEach(s=>{const a=s[0],b=s[s.length-1];if(vertical){c.moveTo(edge,a[1]);s.forEach(([x,y])=>c.lineTo(x,y));c.lineTo(edge,b[1])}else{c.moveTo(a[0],edge);s.forEach(([x,y])=>c.lineTo(x,y));c.lineTo(b[0],edge)}c.closePath()});c.fill()}
function marker(c,p){const x=px(p.x),y=py(p.y);if(!inPlot(x,y))return;c.fillStyle=p.color;c.beginPath();c.arc(x,y,5,0,7);c.fill();const text=pt(p.x,p.y);c.font='700 12px Arial';const bw=c.measureText(text).width+14,bx=Math.min(G.l+G.w-bw-4,Math.max(G.l+4,x-bw/2)),by=Math.max(G.t+4,y-38);c.fillStyle='white';c.strokeStyle=p.color;c.lineWidth=1;c.fillRect(bx,by,bw,28);c.strokeRect(bx,by,bw,28);c.fillStyle=p.color;c.textAlign='center';c.fillText(text,bx+bw/2,by+18)}
function draw(rec){let cv=$('plot'),r=cv.getBoundingClientRect(),w=Math.max(320,r.width|0),h=Math.max(260,r.height|0),d=Math.min(devicePixelRatio||1,2),c=rec?rec.init(w,h):cv.getContext('2d');if(!rec){cv.width=w*d;cv.height=h*d;c.setTransform(d,0,0,d,0,0)}c.fillStyle='white';c.fillRect(0,0,w,h);
let m={l:72,r:18,t:20,b:58},pw=w-m.l-m.r,ph=h-m.t-m.b;G.l=m.l;G.t=m.t;G.w=pw;G.h=ph;
const vis=S.rows.filter(graphable);const live=vis.length||S.skating;$('empty').hidden=!!live;$('saveSvg').disabled=!live;if(!live)return;
const st=nice(80/V.s);c.font='12px Arial';c.strokeStyle='#dfe7e8';c.fillStyle='#516063';c.lineWidth=1;
for(let k=Math.ceil(wy(m.t+ph)/st);k<=Math.floor(wy(m.t)/st);k++){const p=py(k*st);c.beginPath();c.moveTo(m.l,p);c.lineTo(m.l+pw,p);c.stroke();c.textAlign='right';c.fillText(fmtAxis(k*st),m.l-8,p+4)}
for(let k=Math.ceil(wx(m.l)/st);k<=Math.floor(wx(m.l+pw)/st);k++){const p=px(k*st);c.beginPath();c.moveTo(p,m.t);c.lineTo(p,m.t+ph);c.stroke();c.textAlign='center';c.fillText(fmtAxis(k*st),p,m.t+ph+20)}
const ax=px(0),ay=py(0);c.strokeStyle='#9aa8aa';c.lineWidth=1.5;c.beginPath();if(ax>m.l&&ax<m.l+pw){c.moveTo(ax,m.t);c.lineTo(ax,m.t+ph)}if(ay>m.t&&ay<m.t+ph){c.moveTo(m.l,ay);c.lineTo(m.l+pw,ay)}c.stroke();c.lineWidth=1;
c.strokeStyle='#68777a';c.strokeRect(m.l,m.t,pw,ph);c.fillStyle='#334144';c.textAlign='center';c.fillText('x',m.l+pw/2,h-8);c.save();c.translate(18,m.t+ph/2);c.rotate(-Math.PI/2);c.fillText('y',0,0);c.restore();
c.save();c.beginPath();c.rect(m.l,m.t,pw,ph);c.clip();
vis.forEach(r=>{if(r.op==='=')return;c.fillStyle=r.color;c.globalAlpha=.16;if(r.kind==='yfx')fillSegs(c,sampleY(r.fx),r.op[0]==='>'?m.t:m.t+ph,false);else if(r.kind==='xfy')fillSegs(c,sampleX(r.gy),r.op[0]==='>'?m.l+pw:m.l,true);else if(r.kind==='implicit'){c.globalAlpha=1;contour(r.F,r.op,c,r.color,true,r)}c.globalAlpha=1});
vis.forEach(r=>{if(!r.move||(r.kind!=='yfx'&&r.kind!=='xfy'))return;c.strokeStyle=r.color;c.globalAlpha=.22;c.lineWidth=10;strokeSegs(c,r.kind==='yfx'?sampleY(r.fx):sampleX(r.gy));c.globalAlpha=1});
vis.forEach(r=>{if(r.kind==='point')return;c.strokeStyle=r.color;c.lineWidth=r.id===S.focus?3.2:2.3;c.setLineDash(r.op==='<'||r.op==='>'?[6,4]:[]);if(r.kind==='yfx')strokeSegs(c,sampleY(r.fx));else if(r.kind==='xfy')strokeSegs(c,sampleX(r.gy));else contour(r.F,'=',c,r.color,false,r);c.setLineDash([])});
vis.forEach(r=>{if(r.kind!=='point'||!Number.isFinite(r.px)||!Number.isFinite(r.py))return;const x=px(r.px),y=py(r.py);c.fillStyle=r.color;c.beginPath();c.arc(x,y,5,0,7);c.fill();c.font='12px Arial';c.textAlign='left';c.fillText(pt(r.px,r.py),x+9,y-9)});
if(S.skating)Skate.draw(c);c.restore();
if(S.pin)marker(c,S.pin);if(S.hover&&!rec&&!S.recording)marker(c,S.hover)}
let rafPending=false;const requestDraw=()=>{if(rafPending)return;rafPending=true;requestAnimationFrame(()=>{rafPending=false;draw()})};
function legend(){$('legend').innerHTML=S.rows.filter(graphable).map(r=>`<span style="color:${r.color}">━━</span> ${S.rows.indexOf(r)+1}. ${esc(r.t)}`).join(' &nbsp; ')}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function readout(){const p=S.pin;if(!p){$('readout').hidden=true;return}$('readout').style.color=p.color;$('readout').innerHTML=`<strong>${pt(p.x,p.y)}</strong>${p.name?' on '+esc(p.name):''}`;$('readout').hidden=false}

/* ---------- Hover trace and pinning ---------- */
const DEFAULT_STATUS='Type an expression to graph it. Drag to pan, scroll to zoom.';
function nearest(mx,my){if(!inPlot(mx,my))return null;let best=null,bd=26;const x=wx(mx);S.rows.forEach(r=>{if(!graphable(r))return;if(r.kind==='point'){if(Math.hypot(px(r.px)-mx,py(r.py)-my)<14){best={x:r.px,y:r.py,color:r.color,name:r.t};bd=-1}return}if(r.kind!=='yfx')return;const y=r.fx(x);if(!Number.isFinite(y))return;const d=Math.abs(py(y)-my)-(r.id===S.focus?6:0);if(d<bd){bd=d;best={x,y,color:r.color,name:r.t}}});return best}
function hover(mx,my){cv.style.cursor=movers().some(r=>grabs(r,mx,my))?'move':'';$('status').textContent=inPlot(mx,my)?`x = ${fmt(wx(mx))},  y = ${fmt(wy(my))}`:DEFAULT_STATUS;S.hover=nearest(mx,my);requestDraw()}

/* ---------- Expression list UI ---------- */
const list=$('list'),rowOf=el=>S.rows.find(r=>r.id===+el.closest('.erow').dataset.id),elOf=r=>list.querySelector(`.erow[data-id="${r.id}"]`);
function renderList(){list.innerHTML=S.rows.map(r=>`<div class="erow" data-id="${r.id}"><div class="lcol"><button type="button" class="swatch" title="Show or hide"></button><label class="pick" title="Choose color"><input class="pickc" type="color" aria-label="Expression color"></label></div><div><input class="expr" spellcheck="false" autocomplete="off" autocapitalize="off" placeholder="e.g. y = x^2" aria-label="Expression ${S.rows.indexOf(r)+1}"><div class="slider" hidden><input class="smin" type="number" step="any" aria-label="Slider minimum"><input class="srange" type="range" step="any" aria-label="Slider"><input class="smax" type="number" step="any" aria-label="Slider maximum"><button type="button" class="play" title="Animate">▶</button></div><div class="range" hidden><span>x from</span><input class="rg" data-k="0" type="number" step="any" placeholder="-∞" aria-label="x minimum"><span>to</span><input class="rg" data-k="1" type="number" step="any" placeholder="∞" aria-label="x maximum"><span>y from</span><input class="rg" data-k="2" type="number" step="any" placeholder="-∞" aria-label="y minimum"><span>to</span><input class="rg" data-k="3" type="number" step="any" placeholder="∞" aria-label="y maximum"><button type="button" class="clearrange">Clear range</button></div><div class="skateset" hidden><span>Gravity</span><input class="sk" data-k="gravity" type="range" min="0" max="30" step="0.1" aria-label="Gravity"><input class="skn" data-k="gravity" type="number" min="0" step="any" aria-label="Gravity value"><span>Friction</span><input class="sk" data-k="friction" type="range" min="0" max="1" step="0.01" aria-label="Friction"><input class="skn" data-k="friction" type="number" min="0" step="any" aria-label="Friction value"></div><div class="emsg" hidden></div></div><button type="button" class="remove" title="Delete">×</button><button type="button" class="menu" title="Set x and y range" aria-label="Set x and y range">☰</button><button type="button" class="move" title="Move on graph: drag this curve to shift it" aria-label="Move on graph" aria-pressed="false">✥</button><button type="button" class="copy" title="Copy this expression, then paste it with Ctrl+V or Cmd+V" aria-label="Copy expression">⧉</button></div>`).join('');S.rows.forEach(r=>{elOf(r).querySelector('.expr').value=r.text;updateRowUI(r)})}
function updateRowUI(r){const el=elOf(r);if(!el)return;const muted=['param','value','empty','skate','dupe'].includes(r.kind);el.style.setProperty('--c',muted?'#b9c6c8':r.color);el.className='erow'+(r.id===S.focus?' focus':'')+(muted?' '+r.kind:'');el.querySelector('.swatch').classList.toggle('off',r.hidden);const pk=el.querySelector('.pickc');el.querySelector('.pick').hidden=muted;if(pk!==document.activeElement)pk.value=r.color;
const sl=el.querySelector('.slider');sl.hidden=!(r.slider&&!r.err);if(!sl.hidden){const a=document.activeElement,rg=sl.querySelector('.srange');if(a!==sl.querySelector('.smin'))sl.querySelector('.smin').value=fmtAxis(r.min);if(a!==sl.querySelector('.smax'))sl.querySelector('.smax').value=fmtAxis(r.max);rg.min=r.min;rg.max=r.max;rg.step=(r.max-r.min)/1000;rg.value=r.value;sl.querySelector('.play').textContent=S.playing.has(r.id)?'❚❚':'▶'}
const canRange=RANGED.includes(r.kind)||(r.err&&!['param','skate','empty','value','reserved'].includes(r.kind)),mb=el.querySelector('.menu'),rp=el.querySelector('.range');mb.hidden=!canRange&&!hasRange(r);mb.classList.toggle('on',hasRange(r));mb.classList.toggle('open',!!r.menuOpen);rp.hidden=!r.menuOpen||mb.hidden;
if(!rp.hidden)rp.querySelectorAll('.rg').forEach(inp=>{if(inp!==document.activeElement){const v=(r.dom||[])[+inp.dataset.k];inp.value=v==null?'':v}});
const ss=el.querySelector('.skateset');ss.hidden=r.kind!=='skate';if(!ss.hidden)ss.querySelectorAll('.sk,.skn').forEach(inp=>{if(inp!==document.activeElement)inp.value=r[inp.dataset.k]});
const mv=el.querySelector('.move');mv.hidden=!MOVABLE.includes(r.kind)||!!r.err;el.classList.toggle('tall',!mv.hidden||!el.querySelector('.menu').hidden);el.querySelector('.copy').hidden=!r.text.trim()||r.kind==='skate'||r.kind==='dupe';mv.classList.toggle('on',!!r.move);mv.setAttribute('aria-pressed',r.move?'true':'false');
const m=el.querySelector('.emsg');m.className='emsg';m.hidden=true;
if(r.err&&r.kind!=='empty'){m.hidden=false;m.classList.add('err');m.textContent=r.err+'. ';r.missing.forEach(v=>{const b=document.createElement('button');b.type='button';b.className='addslider';b.dataset.v=v;b.textContent='Add slider: '+v;m.appendChild(b)})}
else if(r.kind==='skate'){m.hidden=false;m.textContent='The turtle rides any curve you graph. Wheels use this friction, anything else slides with 10x more. ';const b=document.createElement('button');b.type='button';b.className='respawn';b.textContent='Restart run';m.appendChild(b)}
else if(r.kind==='value'||(r.kind==='param'&&!r.slider)){m.hidden=false;m.classList.add('val');m.textContent='= '+fmt(r.value)}}
function changed(full=true){analyze();Skate.sync();clockSync();S.rows.forEach(updateRowUI);S.hover=null;if(full){S.pin=null;readout();legend();saveHash()}requestDraw()}
function sliderDecimals(r){return Math.max(0,Math.min(8,-Math.floor(Math.log10((r.max-r.min)/1000))))}
function setSlider(r,v){v=+v.toFixed(sliderDecimals(r));r.text=`${r.name} = ${v}`;const el=elOf(r);if(el)el.querySelector('.expr').value=r.text}
function insertRow(after,text='',focus=true){const r=newRow(text),i=after?S.rows.indexOf(after)+1:S.rows.length;S.rows.splice(i,0,r);renderList();changed();if(focus)elOf(r).querySelector('.expr').focus();return r}
function removeRow(r,focusPrev){const i=S.rows.indexOf(r);S.playing.delete(r.id);S.rows.splice(i,1);if(!S.rows.length)S.rows.push(newRow());if(S.focus===r.id)S.focus=null;renderList();changed();if(focusPrev){const inp=elOf(S.rows[Math.max(0,i-1)]).querySelector('.expr');inp.focus();inp.setSelectionRange(inp.value.length,inp.value.length)}}
list.addEventListener('input',e=>{const r=rowOf(e.target),c=e.target.classList;if(c.contains('pickc')){r.color=e.target.value;updateRowUI(r);legend();requestDraw();saveHash()}else if(c.contains('sk')||c.contains('skn')){const v=+e.target.value;if(e.target.value===''||!Number.isFinite(v))return;r[e.target.dataset.k]=Math.max(0,v);elOf(r).querySelectorAll(`[data-k="${e.target.dataset.k}"]`).forEach(i=>{if(i!==e.target)i.value=r[e.target.dataset.k]});saveHash()}else if(c.contains('rg')){r.dom=r.dom||[null,null,null,null];r.dom[+e.target.dataset.k]=e.target.value===''?null:e.target.value;changed()}else if(c.contains('expr')){r.text=e.target.value;changed()}else if(c.contains('srange')){setSlider(r,+e.target.value);changed()}});
list.addEventListener('change',e=>{const c=e.target.classList;if(!c.contains('smin')&&!c.contains('smax'))return;const r=rowOf(e.target),v=+e.target.value;if(!Number.isFinite(v)||e.target.value===''){updateRowUI(r);return}if(c.contains('smin'))r.min=Math.min(v,r.max-1e-9);else r.max=Math.max(v,r.min+1e-9);if(r.value<r.min)setSlider(r,r.min);if(r.value>r.max)setSlider(r,r.max);changed()});
list.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const r=rowOf(b);if(b.classList.contains('swatch')){r.hidden=!r.hidden;changed()}else if(b.classList.contains('remove'))removeRow(r,false);else if(b.classList.contains('play')){S.playing.has(r.id)?S.playing.delete(r.id):S.playing.add(r.id);updateRowUI(r);if(S.playing.size)startPlay()}else if(b.classList.contains('copy')){copyRow(r,b)}else if(b.classList.contains('move')){r.move=!r.move;updateRowUI(r);requestDraw();if(r.move)$('status').textContent='Drag the highlighted curve on the graph to move it.'}else if(b.classList.contains('menu')){r.menuOpen=!r.menuOpen;updateRowUI(r);if(r.menuOpen)elOf(r).querySelector('.rg').focus()}else if(b.classList.contains('clearrange')){r.dom=null;updateRowUI(r);changed()}else if(b.classList.contains('respawn'))Skate.spawn();else if(b.classList.contains('addslider'))insertRow(r,b.dataset.v+' = 1',false)});
list.addEventListener('keydown',e=>{if(!e.target.classList.contains('expr'))return;const r=rowOf(e.target);if(e.key==='Enter'){e.preventDefault();insertRow(r)}else if(e.key==='Backspace'&&!e.target.value&&S.rows.length>1){e.preventDefault();removeRow(r,true)}else if(e.key==='ArrowDown'||e.key==='ArrowUp'){const i=S.rows.indexOf(r)+(e.key==='ArrowDown'?1:-1);if(S.rows[i]){e.preventDefault();elOf(S.rows[i]).querySelector('.expr').focus()}}});
list.addEventListener('focusin',e=>{const r=rowOf(e.target);if(S.focus===r.id)return;S.focus=r.id;S.rows.forEach(updateRowUI);requestDraw()});


/* ---------- Time: the reserved variable t runs like a clock ---------- */
let clockRaf=0,clockLast=0;
function clockText(){$('clockT').textContent=S.time.toFixed(2);const b=$('clockPlay');b.textContent=S.timeRunning?'❚❚':'▶';b.title=S.timeRunning?'Pause time':'Play time'}
// Advance everything that depends on t without rebuilding the expression list.
function applyTime(){if(S.setTime)S.setTime(S.time);const E=S.env;S.rows.forEach(r=>{if(r.err)return;if(r.kind==='point'&&r.pf){r.px=r.pf[0](E);r.py=r.pf[1](E)}else if(r.kind==='value'&&r.vf)r.value=r.vf(E);if(r.kind==='value'||(r.kind==='param'&&!r.slider)){const el=elOf(r),m=el&&el.querySelector('.emsg');if(m)m.textContent='= '+fmt(r.value)}});clockText()}
function clockSync(){$('clock').hidden=!S.timeUsed;clockText();if(S.timeUsed&&S.timeRunning&&!clockRaf){clockLast=performance.now();clockRaf=requestAnimationFrame(clockFrame)}}
function clockFrame(now){if(!S.timeUsed||!S.timeRunning){clockRaf=0;return}const dt=Math.min(.05,(now-clockLast)/1000);clockLast=now;S.time+=dt*S.timeSpeed;applyTime();S.hover=null;if(!S.skating)draw();clockRaf=requestAnimationFrame(clockFrame)}
$('clockPlay').onclick=()=>{S.timeRunning=!S.timeRunning;clockSync()};
// Restart the whole scene: rewind time first so the turtle respawns onto the curves as they are at t = 0.
function replay(){S.time=0;applyTime();if(S.skating)Skate.spawn();requestDraw()}
$('clockReset').onclick=replay;
$('clockSpeed').onchange=e=>{S.timeSpeed=+e.target.value||1};

/* ---------- Slider animation ---------- */
let playT=0;const dir={};function startPlay(){if(playT)return;let last=performance.now();const step=now=>{const dt=Math.min(.05,(now-last)/1000);last=now;if(!S.playing.size){playT=0;saveHash();return}S.rows.forEach(r=>{if(!S.playing.has(r.id)||!r.slider||r.err)return;let d=dir[r.id]||1,v=r.value+d*(r.max-r.min)*dt/4;if(v>=r.max){v=r.max;d=-1}if(v<=r.min){v=r.min;d=1}dir[r.id]=d;setSlider(r,v)});changed(false);draw();playT=requestAnimationFrame(step)};playT=requestAnimationFrame(step)}

/* ---------- Pan, zoom and click-to-pin ---------- */
const cv=$('plot'),ptrs=new Map;let moved=0;
function viewChanged(){S.hover=null;requestDraw();saveHash()}
function zoomAt(mx,my,f){if(S.skating){V.s=Math.max(1e-6,Math.min(1e9,V.s*f));Skate.center();viewChanged();return}const x=wx(mx),y=wy(my);V.s=Math.max(1e-6,Math.min(1e9,V.s*f));V.cx=x-(mx-G.l-G.w/2)/V.s;V.cy=y+(my-G.t-G.h/2)/V.s;viewChanged()}
cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,{x:e.offsetX,y:e.offsetY});moved=0;drag=null;if(ptrs.size===1&&startMove(e.offsetX,e.offsetY)){S.hover=null;cv.style.cursor='grabbing'}});
cv.addEventListener('pointermove',e=>{const p=ptrs.get(e.pointerId);if(!p){hover(e.offsetX,e.offsetY);return}const nx=e.offsetX,ny=e.offsetY;moved+=Math.abs(nx-p.x)+Math.abs(ny-p.y);if(drag&&ptrs.size===1){doMove(nx,ny)}else if(ptrs.size===1&&S.skating){}else if(ptrs.size===1){V.cx-=(nx-p.x)/V.s;V.cy+=(ny-p.y)/V.s;viewChanged()}else if(ptrs.size===2){const o=[...ptrs.entries()].find(([id])=>id!==e.pointerId)[1],d0=Math.hypot(p.x-o.x,p.y-o.y),d1=Math.hypot(nx-o.x,ny-o.y);V.cx-=(nx-p.x)/2/V.s;V.cy+=(ny-p.y)/2/V.s;if(d0>5)zoomAt((nx+o.x)/2,(ny+o.y)/2,d1/d0);else viewChanged()}p.x=nx;p.y=ny});
const up=e=>{const single=ptrs.size===1;ptrs.delete(e.pointerId);if(drag){drag=null;cv.style.cursor='';changed();return}if(e.type==='pointerup'&&single&&moved<4){S.pin=nearest(e.offsetX,e.offsetY);readout();requestDraw()}};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
cv.addEventListener('pointerleave',()=>{if(!ptrs.size){S.hover=null;$('status').textContent=DEFAULT_STATUS;requestDraw()}});
cv.addEventListener('wheel',e=>{e.preventDefault();zoomAt(e.offsetX,e.offsetY,Math.exp(-Math.max(-120,Math.min(120,e.deltaY))*.0018))},{passive:false});
cv.addEventListener('dblclick',e=>zoomAt(e.offsetX,e.offsetY,2));
function home(){if(S.skating){replay();return}draw();V.cx=0;V.cy=0;V.s=G.w/20;S.pin=null;readout();viewChanged()}

/* ---------- SVG export (records the same drawing calls as the canvas) ---------- */
function recorder(){let o=[],defs=[],path=[],tf=[],stack=[],groups=0,cid=0,W,H;const fs=c=>parseFloat((c.font.match(/(\d+(\.\d+)?)px/)||[0,12])[1]),bold=c=>/^(700|bold)/.test(c.font),esc=s=>String(s).replace(/[&<>"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch])),n=v=>+(+v).toFixed(2);const c={fillStyle:'#000',strokeStyle:'#000',lineWidth:1,font:'10px Arial',textAlign:'start',globalAlpha:1,_dash:[],init(w,h){W=w;H=h;return c},setTransform(){},setLineDash(a){c._dash=a},save(){stack.push([tf.slice(),c.fillStyle,c.strokeStyle,c.lineWidth,c.font,c.textAlign,c.globalAlpha,groups]);groups=0},restore(){const s=stack.pop();while(groups-->0)o.push('</g>');if(s)[tf,c.fillStyle,c.strokeStyle,c.lineWidth,c.font,c.textAlign,c.globalAlpha,groups]=s},translate(x,y){tf.push(`translate(${x} ${y})`)},scale(x,y){tf.push(`scale(${x} ${y})`)},drawImage(im,x,y,w,h){o.push(`<image href="${Skate.href(im)}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="none"${c._a()}/>`)},rotate(a){tf.push(`rotate(${a*180/Math.PI})`)},beginPath(){path=[]},moveTo(x,y){path.push(`M${n(x)} ${n(y)}`)},lineTo(x,y){path.push(`L${n(x)} ${n(y)}`)},closePath(){path.push('Z')},rect(x,y,w,h){path.push(`M${n(x)} ${n(y)}h${n(w)}v${n(h)}h${n(-w)}Z`)},clip(){const id='c'+(++cid);defs.push(`<clipPath id="${id}"><path d="${path.join('')}"/></clipPath>`);o.push(`<g clip-path="url(#${id})">`);groups++},arc(x,y,r){path.push(`M${n(x-r)} ${n(y)}a${r} ${r} 0 1 0 ${2*r} 0a${r} ${r} 0 1 0 ${-2*r} 0`)},_a(){return(c.globalAlpha<1?` opacity="${c.globalAlpha}"`:'')+(tf.length?` transform="${tf.join(' ')}"`:'')},stroke(){if(path.length)o.push(`<path d="${path.join('')}" fill="none" stroke="${c.strokeStyle}" stroke-width="${c.lineWidth}" stroke-linejoin="round"${c._dash.length?` stroke-dasharray="${c._dash.join(' ')}"`:''}${c._a()}/>`)},fill(){if(path.length)o.push(`<path d="${path.join('')}" fill="${c.fillStyle}"${c._a()}/>`)},fillRect(x,y,w,h){o.push(`<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" fill="${c.fillStyle}"${c._a()}/>`)},strokeRect(x,y,w,h){o.push(`<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" fill="none" stroke="${c.strokeStyle}" stroke-width="${c.lineWidth}"${c._a()}/>`)},measureText(t){return{width:String(t).length*fs(c)*(bold(c)?.62:.56)}},fillText(t,x,y){const a={left:'start',start:'start',center:'middle',right:'end',end:'end'}[c.textAlign]||'start';o.push(`<text x="${n(x)}" y="${n(y)}" fill="${c.fillStyle}" font-family="Arial,sans-serif" font-size="${fs(c)}" text-anchor="${a}"${bold(c)?' font-weight="700"':''}${c._a()}>${esc(t)}</text>`)},svg(){while(groups-->0)o.push('</g>');return`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${defs.join('')}</defs>${o.join('')}</svg>`}};return c}
function saveSvg(){if(!S.rows.some(graphable))return;const r=recorder();draw(r);const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([r.svg()],{type:'image/svg+xml'}));a.download='smart-turtle-graph.svg';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}

/* ---------- Graph state in the URL, so a link reopens the same graph ---------- */
let hashT=0;function saveHash(){clearTimeout(hashT);hashT=setTimeout(()=>{try{const st={e:config().expressions,v:[+V.cx.toPrecision(8),+V.cy.toPrecision(8),+V.s.toPrecision(8)]};history.replaceState(null,'','#g='+encodeURIComponent(JSON.stringify(st)))}catch(e){}},300)}
function loadHash(){try{const m=location.hash.match(/^#g=(.+)$/);if(!m)return false;const st=JSON.parse(decodeURIComponent(m[1]));S.rows=rowsFrom(st.e.map(x=>Array.isArray(x)?{text:String(x[0]),hidden:!!x[1]}:x));if(Array.isArray(st.v)&&st.v.every(Number.isFinite)&&st.v[2]>0){V.cx=st.v[0];V.cy=st.v[1];V.s=st.v[2]}return S.rows.length>0}catch(e){return false}}

/* ---------- Skate mode: a rigid-body turtle that rides the graph ---------- */
const Skate=(()=>{
const IMG={happy:'smart_turtle_skate.svg',scared:'smart_turtle_skate_serious.svg',logo:'smart_turtle.svg'},pics={},data={};
// Both skate SVGs share one 71.18 x 59.8 art frame. Body coordinates: origin at the center of mass, y up.
const ART_W=71.177757,ART_H=59.8,LEN=2.4,K=LEN/ART_W,COM=[36,40],M=1,I=1.0;
const B=(ix,iy)=>[(ix-COM[0])*K,(COM[1]-iy)*K],WHEEL_R=4.47*K,HULL_R=.06;
const POINTS=[{p:B(15.6,55),r:WHEEL_R,wheel:true},{p:B(54.6,54.8),r:WHEEL_R,wheel:true},
...[[1.5,46],[10,51],[35,52.5],[62,51],[70.5,44.5],[3,40],[68,39],[6,36],[12,27],[18,13],[26,7],[36,6],[44,9],[52,4],[58,.8],[66,2],[70.5,7],[70,12],[66,20],[60,27],[64,33]].map(([x,y])=>({p:B(x,y),r:HULL_R,wheel:false}))];
let T=null,raf=0,last=0;
function loadPics(){if(pics.happy)return;for(const k of ['happy','scared']){const im=new Image();im.onload=requestDraw;im.src=IMG[k];pics[k]=im;try{fetch(IMG[k]).then(r=>r.ok?r.text():null).then(t=>{if(t)data[k]='data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(t)))}).catch(()=>{})}catch(e){}}}
const setLogo=src=>{$('mascot').src=src;$('emptyMascot').src=src};
const setting=(n,d)=>{const r=S.rows.find(x=>x.kind==='skate'),v=r&&r[n];return Number.isFinite(v)?v:d};
// Camera: the middle of the artwork (not the center of mass) sits at the exact center of the plot.
const MID=B(ART_W/2,ART_H/2);function center(){if(!T)return;const c=Math.cos(T.a),s=Math.sin(T.a);V.cx=T.x+MID[0]*c-MID[1]*s;V.cy=T.y+MID[0]*s+MID[1]*c}
function spawn(){let y=-(B(15.6,55)[1]-WHEEL_R)+.02;
// A curve passing through the origin would cut through the turtle, so set him down on top of it instead.
S.rows.forEach(r=>{if(!graphable(r)||r.kind!=='yfx')return;POINTS.forEach(P=>{const f=r.fx(P.p[0]);if(Number.isFinite(f)&&Math.abs(f)<1.5)y=Math.max(y,f-P.p[1]+P.r+.02)})});
T={x:0,y,a:0,vx:0,vy:0,w:0,feel:1,scared:false,tp:S.time};center();S.pin=null;readout();requestDraw()}
// Every graphed curve near the turtle becomes a chain of line segments it can collide with.
function track(cx,cy,R){const segs=[],N=90;
S.rows.forEach(r=>{if(!graphable(r)||r.kind==='point')return;
if(r.kind==='yfx'||r.kind==='xfy'){const yf=r.kind==='yfx',f=yf?r.fx:r.gy,c0=yf?cx:cy,c1=yf?cy:cx;let prev=null;
for(let i=0;i<=N;i++){const u=c0-R+2*R*i/N,v=f(u);if(!Number.isFinite(v)||Math.abs(v-c1)>R*40){prev=null;continue}
if(prev&&Math.abs(v-prev[1])>R*.15&&isJump(f,prev[0],u,prev[1],v,R*.15)){prev=[u,v];continue}
if(prev)segs.push(yf?[prev[0],prev[1],u,v,r]:[prev[1],prev[0],v,u,r]);prev=[u,v]}return}
const F=r.F,n=40,h=2*R/n,x0=cx-R,y0=cy-R,val=new Float64Array((n+1)*(n+1));for(let j=0;j<=n;j++)for(let i=0;i<=n;i++)val[j*(n+1)+i]=F(x0+i*h,y0+j*h);
const cross=(ax,ay,a,bx,by,b)=>{const t=a/(a-b),x=ax+(bx-ax)*t,y=ay+(by-ay)*t,m=F(x,y);return Number.isFinite(m)&&Math.abs(m)<Math.max(Math.abs(a),Math.abs(b))?[x,y]:null};
for(let j=0;j<n;j++)for(let i=0;i<n;i++){const k=j*(n+1)+i,a=val[k],b=val[k+1],c=val[k+n+2],d=val[k+n+1];if(![a,b,c,d].every(Number.isFinite))continue;const sa=a>0,sb=b>0,sc=c>0,sd=d>0;if(sa===sb&&sb===sc&&sc===sd)continue;const X0=x0+i*h,Y0=y0+j*h,X1=X0+h,Y1=Y0+h,
E1=sa!==sb?cross(X0,Y0,a,X1,Y0,b):null,E2=sb!==sc?cross(X1,Y0,b,X1,Y1,c):null,E3=sd!==sc?cross(X0,Y1,d,X1,Y1,c):null,E4=sa!==sd?cross(X0,Y0,a,X0,Y1,d):null,P=[E1,E2,E3,E4].filter(Boolean),add=(p,q)=>{if(p&&q)segs.push([p[0],p[1],q[0],q[1],r])};
if(P.length===2)add(P[0],P[1]);else if(P.length===4){if(((a+b+c+d)>0)===sa){add(E1,E2);add(E3,E4)}else{add(E1,E4);add(E2,E3)}}}});
return segs}
// How fast a moving curve is travelling at a point, so a rising curve can launch the turtle.
// Writing the curve as G(x, y, t) = 0 gives a normal velocity of -G_t * grad G / |grad G|^2.
function surfVel(r,x,y){if(!S.timeUsed||!S.timeRunning||!r||!S.setTime)return[0,0];
const G=r.kind==='yfx'?(a,b)=>b-r.fx(a):r.kind==='xfy'?(a,b)=>a-r.gy(b):r.F,e=1e-4,h=.01,g0=G(x,y),gx=(G(x+e,y)-G(x-e,y))/(2*e),gy=(G(x,y+e)-G(x,y-e))/(2*e);
S.setTime(S.time-h);const gp=G(x,y);S.setTime(S.time);const gt=(g0-gp)/h,n2=gx*gx+gy*gy;
if(![g0,gp,gx,gy].every(Number.isFinite)||n2<1e-12)return[0,0];let k=-gt/n2*S.timeSpeed;const sp=Math.abs(k)*Math.sqrt(n2);if(sp>120)k*=120/sp;return[k*gx,k*gy]}
// Fast-moving curves can jump clean over the turtle between frames. For every curve, check which side
// each body point was on at the previous time and is on now; if a curve swept past, push the turtle back
// to the side it started on and give it the curve's velocity.
const gOf=r=>r.kind==='yfx'?(a,b)=>b-r.fx(a):r.kind==='xfy'?(a,b)=>a-r.gy(b):r.kind==='implicit'?r.F:null;
function sweep(tP,tN){const rows=S.rows.filter(r=>graphable(r)&&r.kind!=='point'),Gs=rows.map(gOf),c=Math.cos(T.a),s=Math.sin(T.a),
pts=POINTS.map(P=>[T.x+P.p[0]*c-P.p[1]*s,T.y+P.p[0]*s+P.p[1]*c,P.r]);
S.setTime(tP);const before=Gs.map(G=>pts.map(p=>G(p[0],p[1])));S.setTime(tN);
rows.forEach((r,i)=>{const G=Gs[i];let best=0,hit=null;
pts.forEach((p,k)=>{const g0=before[i][k],g1=G(p[0],p[1]);if(!Number.isFinite(g0)||!Number.isFinite(g1)||!g0||Math.sign(g0)===Math.sign(g1))return;
const e=1e-4,gx=(G(p[0]+e,p[1])-G(p[0]-e,p[1]))/(2*e),gy=(G(p[0],p[1]+e)-G(p[0],p[1]-e))/(2*e),m=Math.hypot(gx,gy);if(!(m>1e-9))return;
const side=Math.sign(g0),need=side*(p[2]+.03)-g1/m;if(Math.abs(need)>Math.abs(best)){best=need;hit=[gx/m,gy/m,side,p]}});
if(!hit)return;T.x+=hit[0]*best;T.y+=hit[1]*best;pts.forEach(p=>{p[0]+=hit[0]*best;p[1]+=hit[1]*best});
const sv=surfVel(r,hit[3][0],hit[3][1]),nx=hit[0]*hit[2],ny=hit[1]*hit[2],vn=(T.vx-sv[0])*nx+(T.vy-sv[1])*ny;if(vn<0){T.vx-=1.1*vn*nx;T.vy-=1.1*vn*ny}})}
// One physics substep: gravity, then impulses at every touching wheel or hull point.
function step(dt,segs,g,mu){T.vy-=g*dt;T.x+=T.vx*dt;T.y+=T.vy*dt;T.a+=T.w*dt;const c=Math.cos(T.a),s=Math.sin(T.a);let J=0;
for(const P of POINTS){const rx=P.p[0]*c-P.p[1]*s,ry=P.p[0]*s+P.p[1]*c,wx=T.x+rx,wy=T.y+ry;let bx=0,by=0,bd=P.r,hit=false,bq=null;
for(const q of segs){const ex=q[2]-q[0],ey=q[3]-q[1],L=ex*ex+ey*ey,t=L?Math.max(0,Math.min(1,((wx-q[0])*ex+(wy-q[1])*ey)/L)):0,qx=q[0]+ex*t,qy=q[1]+ey*t,d=Math.hypot(wx-qx,wy-qy);if(d<bd){bd=d;bx=qx;by=qy;hit=true;bq=q}}
if(!hit||bd<1e-9)continue;const nx=(wx-bx)/bd,ny=(wy-by)/bd,pen=P.r-bd;T.x+=nx*pen*.8;T.y+=ny*pen*.8;
const sv=surfVel(bq[4],bx,by),vn=(T.vx-T.w*ry-sv[0])*nx+(T.vy+T.w*rx-sv[1])*ny;if(vn>=0)continue;
const rn=rx*ny-ry*nx,jn=-(1+(P.wheel?.05:.15))*vn/(1/M+rn*rn/I);T.vx+=jn*nx/M;T.vy+=jn*ny/M;T.w+=rn*jn/I;J+=jn;
// Coulomb friction: wheels use the friction setting, any other part slides with 10x more.
const tx=-ny,ty=nx,vt=(T.vx-T.w*ry-sv[0])*tx+(T.vy+T.w*rx-sv[1])*ty,rt=rx*ty-ry*tx,lim=(P.wheel?mu:mu*10)*jn;let jt=-vt/(1/M+rt*rt/I);jt=Math.max(-lim,Math.min(lim,jt));T.vx+=jt*tx/M;T.vy+=jt*ty/M;T.w+=rt*jt/I}
return J}
function frame(now){if(!S.skating||!T){raf=0;return}const dt=Math.min(.033,Math.max(.001,(now-last)/1000));last=now;
if(S.timeUsed&&S.setTime){const tN=S.time,tP=T.tp;if(tP!=null&&tP!==tN&&Math.abs(tN-tP)<.5)sweep(tP,tN)}T.tp=S.time;
const g=setting('gravity',9.8),mu=Math.max(0,setting('friction',.05)),sp=Math.hypot(T.vx,T.vy)+Math.abs(T.w)*1.6,n=Math.min(48,Math.max(6,Math.ceil(sp*dt/.02))),h=dt/n,segs=track(T.x,T.y,2.2+sp*dt);let J=0;
for(let i=0;i<n;i++)J+=step(h,segs,g,mu);
const v=Math.hypot(T.vx,T.vy);if(v>150){T.vx*=150/v;T.vy*=150/v}T.w=Math.max(-40,Math.min(40,T.w));
// "Feeling" of weight = contact force per unit mass. Near zero means free fall.
T.feel+=(J/dt/M-T.feel)*Math.min(1,dt/.12);const ref=Math.max(g,.5);if(!T.scared&&T.feel<.3*ref)T.scared=true;else if(T.scared&&T.feel>.45*ref)T.scared=false;
center();
if(performance.now()>(S.noteUntil||0))$('status').textContent=`Speed ${v.toFixed(1)} units/s, spin ${Math.round(T.w*180/Math.PI)}°/s${Math.abs(T.w)<.05?'':T.w>0?' counterclockwise':' clockwise'}, feels like ${(g>0?T.feel/g:0).toFixed(2)} g`;
S.hover=null;draw();raf=requestAnimationFrame(frame)}
function draw_(c){if(!T)return;const im=T.scared?pics.scared:pics.happy;if(!im||!im.complete||!im.naturalWidth)return;const sc=V.s*K;c.save();c.translate(px(T.x),py(T.y));c.rotate(-T.a);c.scale(sc,sc);c.drawImage(im,-COM[0],-COM[1],ART_W,ART_H);c.restore()}
function focusKeep(fn){const a=document.activeElement,er=a&&a.closest&&a.closest('.erow'),id=er&&+er.dataset.id,pos=a&&a.selectionStart;fn();if(id){const r=S.rows.find(x=>x.id===id),el=r&&elOf(r);if(el){const inp=el.querySelector('.expr');inp.focus();try{inp.setSelectionRange(pos,pos)}catch(e){}}}}
function sync(){const on=S.rows.some(r=>r.kind==='skate');if(on===!!S.skating)return;S.skating=on;
if(on){loadPics();setLogo(IMG.happy);spawn();last=performance.now();if(!raf)raf=requestAnimationFrame(frame)}
else{setLogo(IMG.logo);T=null;$('status').textContent=DEFAULT_STATUS}}
return{state:()=>T,center,sync,spawn,draw:draw_,href:im=>(im===pics.scared?data.scared:data.happy)||im.src}})();

/* ---------- Record the graph as a video ---------- */
function pickVideoType(){if(!window.MediaRecorder||!MediaRecorder.isTypeSupported)return'';return['video/mp4;codecs=avc1','video/mp4','video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'].find(t=>MediaRecorder.isTypeSupported(t))||''}
function saveBlob(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),5000)}
function recUI(){const b=$('recBtn');b.classList.toggle('on',!!S.recording);$('recSecs').disabled=$('recRestart').disabled=!!S.recording;if(!S.recording)b.textContent='Record video'}
function recTick(){const R=S.recording;if(!R)return;$('recBtn').textContent=`■ Stop (${((performance.now()-R.start)/1000).toFixed(1)} of ${R.secs} s)`;
// Keep frames flowing even when nothing on the graph is moving.
if(!S.skating&&!(S.timeUsed&&S.timeRunning)&&!S.playing.size)draw();requestAnimationFrame(recTick)}
function startRec(){const cv=$('plot');if(!cv.captureStream||!window.MediaRecorder){note('This browser cannot record video. Try a recent Chrome, Edge, Firefox or Safari.');return}
const secs=Math.max(1,Math.min(120,Math.round(+$('recSecs').value)||10));$('recSecs').value=secs;
if($('recRestart').checked){S.time=0;S.timeRunning=true;applyTime();clockSync();if(S.skating)Skate.spawn()}
S.hover=null;draw();
const type=pickVideoType(),stream=cv.captureStream(60),opts={videoBitsPerSecond:8e6};if(type)opts.mimeType=type;let mr;try{mr=new MediaRecorder(stream,opts)}catch(e){stream.getTracks().forEach(t=>t.stop());note('Recording could not start in this browser.');return}
const chunks=[];mr.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data)};
mr.onstop=()=>{stream.getTracks().forEach(t=>t.stop());const mt=(mr.mimeType||type||'video/webm').split(';')[0],ext=mt.includes('mp4')?'mp4':'webm';S.recording=null;recUI();
if(!chunks.length){note('The recording came out empty. Try again.');return}saveBlob(new Blob(chunks,{type:mt}),(S.skating?'smart-turtle-skate':'smart-turtle-graph')+'.'+ext);note(`Saved a ${ext.toUpperCase()} video.`)};
S.recording={mr,secs,start:performance.now(),timer:setTimeout(stopRec,secs*1000)};mr.start(250);recUI();recTick()}
function stopRec(){const R=S.recording;if(!R)return;clearTimeout(R.timer);if(R.mr.state!=='inactive')R.mr.stop()}
$('recBtn').onclick=()=>S.recording?stopRec():startRec();

/* ---------- Start ---------- */
/* ---------- Save and load configuration files ---------- */
function rowsFrom(list){let g=null,f=null;const rows=[];list.forEach(e=>{if(typeof e==='string')e={text:e};if(!e||typeof e.text!=='string')throw Error('An expression in this file is unreadable.');
// Older files kept gravity and friction as their own lines; fold them into the skate line.
const old=e.text.match(/^\s*(gravity|friction)\s*=\s*(-?\d*\.?\d+)\s*$/i);if(old){if(/^g/i.test(old[1]))g=+old[2];else f=+old[2];return}
const r=newRow(e.text.slice(0,500));r.hidden=!!e.hidden;if(Array.isArray(e.slider)&&e.slider.every(Number.isFinite)&&e.slider[0]<e.slider[1]){r.min=e.slider[0];r.max=e.slider[1]}if(e.range){const q=k=>Number.isFinite(+e.range[k])&&e.range[k]!==null&&e.range[k]!==''?String(+e.range[k]):null;r.dom=[q('xMin'),q('xMax'),q('yMin'),q('yMax')]}if(typeof e.color==='string'&&/^#[0-9a-f]{6}$/i.test(e.color)){r.color=e.color.toLowerCase();r.fileColor=true}if(Number.isFinite(e.gravity))r.gravity=Math.max(0,e.gravity);if(Number.isFinite(e.friction))r.friction=Math.max(0,e.friction);rows.push(r)});
const isSk=r=>/^\s*skate\s*$/i.test(r.text);for(let i=rows.length-1,first=rows.findIndex(isSk);i>first&&first>=0;i--)if(isSk(rows[i]))rows.splice(i,1);
const sk=rows.find(isSk);if(sk){if(g!=null&&!Number.isFinite(sk.gravity))sk.gravity=g;if(f!=null&&!Number.isFinite(sk.friction))sk.friction=f}return rows}
function note(t){$('status').textContent=t;S.noteUntil=performance.now()+3500}
function rowData(r){const o={text:r.text,color:r.color};if(r.hidden)o.hidden=true;if(r.slider)o.slider=[r.min,r.max];if(hasRange(r)){const n=v=>v==null||v===''||!Number.isFinite(+v)?null:+v;o.range={xMin:n(r.dom[0]),xMax:n(r.dom[1]),yMin:n(r.dom[2]),yMax:n(r.dom[3])}};if(r.kind==='skate'){o.gravity=r.gravity;o.friction=r.friction}return o}
function config(){return{app:'Smart Turtle Grapher',version:1,saved:new Date().toISOString(),
expressions:S.rows.filter(r=>r.text.trim()).map(rowData),
view:{centerX:V.cx,centerY:V.cy,pixelsPerUnit:V.s}}}

function saveConfig(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(config(),null,2)],{type:'application/json'}));a.download=(S.skating?'smart-turtle-track':'smart-turtle-graph')+'.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);note('Configuration saved. Share the file and load it with Load configuration.')}
function applyConfig(c){if(!c||!Array.isArray(c.expressions))throw Error('This file is not a Smart Turtle Grapher configuration.');
const rows=rowsFrom(c.expressions);
S.playing.clear();S.focus=null;S.pin=null;colorN=0;rows.forEach(r=>{if(!r.fileColor)r.color=COLORS[colorN++%COLORS.length]});S.rows=rows.length?rows:[newRow()];
const v=c.view||{};if([v.centerX,v.centerY,v.pixelsPerUnit].every(Number.isFinite)&&v.pixelsPerUnit>0){V.cx=v.centerX;V.cy=v.centerY;V.s=v.pixelsPerUnit}
const was=S.skating;renderList();changed();if(S.skating&&was)Skate.spawn();readout()}
function loadConfig(file){if(!file)return;if(file.size>1e6){note('That file is too large to be a graph configuration.');return}const fr=new FileReader();fr.onload=()=>{try{applyConfig(JSON.parse(fr.result));note('Loaded '+file.name+'.')}catch(x){note((x instanceof SyntaxError?'That file is not valid JSON.':x.message)+' Nothing was changed.')}};fr.readAsText(file)}
/* ---------- Copy and paste expressions ---------- */
// The clipboard gets the plain expression text; the full segment (range, sliders, settings) is kept alongside it.
function copyRow(r,btn){const data=[rowData(r)],text=r.text.trim();S.clip={text,data};try{localStorage.setItem('smart-turtle-clip',JSON.stringify(S.clip))}catch(e){}
const done=()=>{btn.classList.add('done');setTimeout(()=>btn.classList.remove('done'),700);note('Copied. Press Ctrl+V (Cmd+V on Mac) to paste it as a new expression.')};
const fallback=()=>{const ta=document.createElement('textarea');ta.value=text;ta.style.cssText='position:fixed;opacity:0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy')}catch(e){}ta.remove();done()};
try{navigator.clipboard.writeText(text).then(done,fallback)}catch(e){fallback()}}
function pasteRows(data,target){let rows;try{rows=rowsFrom(data)}catch(e){return}const isSk=r=>/^\s*skate\s*$/i.test(r.text);if(S.rows.some(isSk)&&rows.some(isSk)){rows=rows.filter(r=>!isSk(r));if(!rows.length){note('There is already a skate line. Only one is allowed.');return}}if(!rows.length)return;
let i=target?S.rows.indexOf(target):-1;if(target&&!target.text.trim())S.rows.splice(i,1,...rows);else if(i>=0)S.rows.splice(i+1,0,...rows);else S.rows.push(...rows);
renderList();changed();const inp=elOf(rows[0]).querySelector('.expr');inp.focus();S.focus=rows[0].id;S.rows.forEach(updateRowUI);note(rows.length>1?`Pasted ${rows.length} expressions.`:'Pasted a copy of the expression.')}
document.addEventListener('paste',e=>{const txt=((e.clipboardData||window.clipboardData).getData('text')||'').trim();if(!txt)return;
let clip=S.clip;if(!clip||clip.text!==txt){try{const c=JSON.parse(localStorage.getItem('smart-turtle-clip'));if(c&&c.text===txt)clip=c}catch(x){}}
const ours=!!clip&&clip.text===txt,a=document.activeElement,typing=a&&(a.tagName==='INPUT'||a.tagName==='TEXTAREA');
// Typing in a box keeps normal paste, unless it is our copied expression going into an expression box.
if(typing&&!(ours&&a.classList.contains('expr')))return;
e.preventDefault();const row=a&&a.closest&&a.closest('.erow')?rowOf(a):S.rows.find(r=>r.id===S.focus);
pasteRows(ours?clip.data:txt.split(/\r?\n/).map(t=>t.trim()).filter(Boolean).slice(0,50).map(t=>({text:t})),row)});
// Built-in example graphs offered by Load configuration.
const PRESETS={"islands":{"app":"Smart Turtle Grapher","version":1,"expressions":[{"text":"h = 0.45sin(0.5t)"},{"text":"sin(0.45x)cos(0.45y) + 0.55sin(0.9(-0.74x + 0.68y))cos(0.9(-0.68x - 0.74y)) + 0.3sin(1.8(0.09x - y))cos(1.8(x + 0.09y)) + 0.17sin(3.6(0.61x + 0.79y))cos(3.6(-0.79x + 0.61y)) + 0.09sin(7.2(-0.98x - 0.17y))cos(7.2(0.17x - 0.98y)) + 0.05sin(14.4(0.84x - 0.54y))cos(14.4(0.54x + 0.84y)) >= h","color":"#3f8f3a","range":{"xMin":-14,"xMax":14,"yMin":-9,"yMax":9}}],"view":{"centerX":0,"centerY":0,"pixelsPerUnit":28}},"unit-circle":{"app":"Smart Turtle Grapher","version":1,"expressions":[{"text":"u = mod(t, 2pi)"},{"text":"(x + 2)^2 + y^2 = 1","color":"#1aa6a6"},{"text":"(x + 2)sin(u) - y cos(u) + 0sqrt(1 - (x + 2)^2 - y^2) + 0sqrt((x + 2)cos(u) + y sin(u)) = 0","color":"#334144"},{"text":"x = cos(u) - 2 + 0sqrt(y(sin(u) - y))","color":"#d94b3d"},{"text":"y = sin(u) + 0sqrt(x - cos(u) + 2) + 0sqrt(u - x)","color":"#e08a1e"},{"text":"y = sin(x) + 0sqrt(u - x) + 0sqrt(x)","color":"#1f62c4"},{"text":"(u, sin(u))","color":"#d94b3d"},{"text":"x = -1 + 0sqrt(y(tan(u) - y))","color":"#3f8f3a","range":{"xMin":null,"xMax":null,"yMin":-4,"yMax":4}},{"text":"(x + 2)sin(u) - y cos(u) + 0sqrt((x + 2)(-1 - x)) = 0","color":"#3f8f3a","range":{"xMin":null,"xMax":null,"yMin":-4,"yMax":4}},{"text":"y = tan(u) + 0sqrt(x + 1) + 0sqrt(u - x)","color":"#3f8f3a","range":{"xMin":null,"xMax":null,"yMin":-4,"yMax":4}},{"text":"y = tan(x) + 0sqrt(u - x) + 0sqrt(x)","color":"#3f8f3a","range":{"xMin":null,"xMax":null,"yMin":-4,"yMax":4}},{"text":"(u, tan(u))","color":"#3f8f3a"},{"text":"y = 0sqrt((x + 2)(cos(u) - x - 2))","color":"#a44ac4"},{"text":"y = cos(x) + 0sqrt(u - x) + 0sqrt(x)","color":"#a44ac4"},{"text":"(u, cos(u))","color":"#a44ac4"}],"view":{"centerX":1.6,"centerY":0,"pixelsPerUnit":62}}};
function loadMenu(open){$('loadMenu').hidden=!open;$('loadCfg').setAttribute('aria-expanded',open?'true':'false')}
$('saveCfg').onclick=saveConfig;$('loadCfg').onclick=e=>{e.stopPropagation();loadMenu($('loadMenu').hidden)};
$('loadMenu').addEventListener('click',e=>{e.stopPropagation();const b=e.target.closest('button');if(!b)return;loadMenu(false);
if(b.id==='loadFile'){$('cfgFile').click();return}const p=PRESETS[b.dataset.preset];if(!p)return;S.time=0;S.timeRunning=false;applyConfig(JSON.parse(JSON.stringify(p)));applyTime();clockSync();note('Loaded the '+b.querySelector('strong').textContent+' example. Press ▶ on the time bar to start it.')});
document.addEventListener('click',()=>{if(!$('loadMenu').hidden)loadMenu(false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('loadMenu').hidden){loadMenu(false);$('loadCfg').focus()}});$('cfgFile').onchange=e=>{loadConfig(e.target.files[0]);e.target.value=''};
// Dropping a saved file anywhere on the page also loads it.
document.addEventListener('dragover',e=>{if([...e.dataTransfer.types].includes('Files'))e.preventDefault()});document.addEventListener('drop',e=>{const f=e.dataTransfer.files&&e.dataTransfer.files[0];if(f){e.preventDefault();loadConfig(f)}});
$('add').onclick=()=>insertRow(null);$('saveSvg').onclick=saveSvg;$('reset').onclick=home;
new ResizeObserver(()=>requestDraw()).observe(cv);
const fromLink=loadHash();if(!fromLink)S.rows=[newRow()];
renderList();analyze();Skate.sync();clockSync();S.rows.forEach(updateRowUI);legend();draw();if(!fromLink)V.s=G.w/20;draw();
window.SmartTurtleGrapherEngine={config,applyConfig,lex,compile,findRel,analyze,state:S,view:V,skate:Skate.state};
})();
