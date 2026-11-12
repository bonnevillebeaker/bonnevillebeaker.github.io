/* Herculean Workout Tracker · Copyright (C) 2026 Coleman Nielsen · GNU GPL v3 or later (see LICENSE) */
window.IRONLOG_CATALOG=true;
/* ---------- platform: standalone file, saved as XML ---------- */
let fileHandle=null, fileDirty=false, lastSaved=null, saving=false;
const FS_OK=typeof window.showSaveFilePicker==="function";
const AUTOSAVE_MS=60000;
const UA=navigator.userAgent||"";
const IS_IOS=/iPhone|iPad|iPod/.test(UA)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
const IS_ANDROID=/Android/.test(UA);
const MOBILE=IS_IOS||IS_ANDROID;
const buildXML=()=>profileToXML(profile,sessions);
function parseProfileText(text){
  let r;try{r=parseXMLText(text)}catch(e){throw new Error("That file isn’t an Herculean profile.")}
  if(xKind(r)!=="herculean")throw new Error(xKind(r)==="herculean-program"?"That’s a program file. Import it from Library instead.":"That file isn’t an Herculean profile.");
  return profileFromXMLRoot(r);
}
function saveNote(){return FS_OK&&fileHandle?"Saved · writes to "+fileHandle.name+" within a minute":MOBILE?"Saved in this browser · tap Download Herculean.xml before you leave":"Saved"}
function setStatus(){
  const n=Object.values(sessions).filter(s=>s.day!=="rest").length;
  $("status").textContent=n+" workout"+(n===1?"":"s")+" logged";
}
function stamp(){localPut("ironlog.savedAt",new Date().toISOString());markFileDirty()}
async function persistProfile(p){if(!localPut("ironlog.profile",p))throw new Error("storage");stamp()}
async function persistSession(id,data){if(!localPut("ironlog.sessions",{...sessions,[id]:data}))throw new Error("storage");stamp()}
async function removeSession(id){const all={...sessions};delete all[id];localPut("ironlog.sessions",all);stamp()}
function blobDownload(name,text){
  const blob=new Blob([text],{type:"application/xml"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000);
}
async function exportText(name,text){blobDownload(name+".xml",text);toast("Exported "+name+".xml")}

function idb(){return new Promise((res,rej)=>{const q=indexedDB.open("ironlog",1);q.onupgradeneeded=()=>q.result.createObjectStore("kv");q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)})}
async function kvSet(k,v){try{const db=await idb();await new Promise((res,rej)=>{const t=db.transaction("kv","readwrite");t.objectStore("kv").put(v,k);t.oncomplete=res;t.onerror=()=>rej(t.error)})}catch(e){}}
async function kvGet(k){try{const db=await idb();return await new Promise(res=>{const q=db.transaction("kv").objectStore("kv").get(k);q.onsuccess=()=>res(q.result);q.onerror=()=>res(null)})}catch(e){return null}}

async function writeFile(){
  if(!fileHandle||saving)return false;
  saving=true;$("fileState").textContent="Writing to "+fileHandle.name+"…";
  try{
    if((await fileHandle.queryPermission({mode:"readwrite"}))!=="granted"){saving=false;renderFileBar();return false}
    const w=await fileHandle.createWritable();await w.write(buildXML());await w.close();
    fileDirty=false;lastSaved=new Date();saving=false;renderFileBar();return true;
  }catch(e){saving=false;$("fileState").textContent="Couldn’t write "+fileHandle.name+". Click Save now to retry.";return false}
}
function markFileDirty(){fileDirty=true;renderFileBar()}
const XML_TYPES=[{description:"Herculean profile",accept:{"application/xml":[".xml"]}}];
async function linkNewFile(){
  try{
    fileHandle=await window.showSaveFilePicker({suggestedName:"Herculean.xml",startIn:"documents",types:XML_TYPES});
    await kvSet("handle",fileHandle);fileDirty=true;await writeFile();toast("Saving to "+fileHandle.name);
  }catch(e){if(e&&e.name!=="AbortError")toast("Couldn’t create the file.")}
}
async function openExisting(){
  try{
    const [h]=await window.showOpenFilePicker({startIn:"documents",types:XML_TYPES});
    loadProfile(parseProfileText(await (await h.getFile()).text()));
    fileHandle=h;await kvSet("handle",h);
    if((await h.requestPermission({mode:"readwrite"}))==="granted"){fileDirty=false;lastSaved=new Date()}
    renderFileBar();toast("Loaded "+h.name);
  }catch(e){if(e&&e.name!=="AbortError")toast(e.message||"Couldn’t open the file.")}
}
async function reconnect(){
  if(!fileHandle)return;
  try{if((await fileHandle.requestPermission({mode:"readwrite"}))==="granted"){
    const text=await (await fileHandle.getFile()).text();
    const data=parseProfileText(text);
    const fileSaved=parseXMLText(text).getAttribute("saved")||"";
    const localSaved=localLoad("ironlog.savedAt","");
    if(fileSaved>localSaved){loadProfile(data);fileDirty=false}else fileDirty=true;
    lastSaved=new Date(fileSaved||Date.now());
    if(fileDirty)await writeFile();renderFileBar();toast("Reconnected to "+fileHandle.name);if(profile.me.name)hideWelcome();
  }}catch(e){toast("Couldn’t reconnect. Use Open file instead.")}
}
function loadProfile(d){
  profile=d.profile;sessions=d.sessions;
  localPut("ironlog.profile",profile);localPut("ironlog.sessions",sessions);localPut("ironlog.savedAt",new Date().toISOString());
  edit=null;derive();if(!$("editView").hidden)showView("lib");goToDate(todayISO(),false);setStatus();renderAll();
  if(profile.me.name)hideWelcome();else showWelcome();
}
/* Settings → Reset user profile: wipe this browser, unlink (never delete) the profile file, show the welcome setup */
window.resetUserProfile=async()=>{
  ["ironlog.profile","ironlog.sessions","ironlog.savedAt","ironlog.program"].forEach(k=>{try{localStorage.removeItem(k)}catch(e){}});
  fileHandle=null;await kvSet("handle",null);fileDirty=false;lastSaved=null;
  loadProfile({profile:presetProfile(),sessions:{}});
  localPut("ironlog.savedAt","");renderFileBar();
};
window.openProfileFile=()=>{if(FS_OK)openExisting();else $("importInput").click()};
function downloadProfile(){blobDownload("Herculean.xml",buildXML());fileDirty=false;lastSaved=new Date();renderFileBar()}
function renderFileBar(){
  const st=$("fileState"),bt=$("fileBtns");bt.innerHTML="";
  const b=(t,cls,fn)=>{const x=document.createElement("button");x.textContent=t;if(cls)x.className=cls;x.onclick=fn;bt.appendChild(x)};
  const when=lastSaved?lastSaved.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}):null;
  $("fileBar").classList.remove("warn");
  if(FS_OK){
    if(fileHandle){
      fileHandle.queryPermission({mode:"readwrite"}).then(p=>{
        bt.innerHTML="";
        if(p!=="granted"){st.textContent=fileHandle.name+" is linked. Reconnect to keep autosaving.";b("Reconnect "+fileHandle.name,"primary",reconnect);b("Open file…","ghost",openExisting);return}
        st.textContent=(fileDirty?"Unsaved changes · autosaves within a minute":"All changes saved")+" · "+fileHandle.name+(when?" at "+when:"");
        b("Save now","",()=>writeFile().then(ok=>ok&&toast("Saved to "+fileHandle.name)));b("Open file…","ghost",openExisting);b("Save as…","ghost",linkNewFile);
      });
    } else {
      st.textContent="No profile file linked yet. Your log lives in this browser until you link one.";
      b("Create profile file…","primary",linkNewFile);b("Open file…","ghost",openExisting);
    }
  } else {
    const where=IS_IOS?"On iPhone, the file goes to the Files app (Downloads). Next time, use Load profile to open it."
      :IS_ANDROID?"On Android, the file goes to your Downloads folder. Next time, use Load profile to open it."
      :"This browser saves the file to your Downloads folder. Use Chrome or Edge on a computer for automatic saving.";
    const head=MOBILE?"Your log is not written to a file automatically on "+(IS_IOS?"iPhone":"Android")+". Before you leave or close the app, tap Download Herculean.xml to save it."
      :"This browser can’t write to a file automatically. Download your profile to save it.";
    st.innerHTML="";
    const h=document.createElement("strong");h.textContent=head;
    const w=document.createElement("div");w.className="muted";w.style.marginTop="4px";w.textContent=where+(when?" Last saved at "+when+".":"");
    st.append(h,w);
    $("fileBar").classList.toggle("warn",fileDirty);
    if(fileDirty){const u=document.createElement("div");u.style.marginTop="4px";u.textContent="You have unsaved changes.";st.appendChild(u)}
    b("Download Herculean.xml","primary",downloadProfile);b("Load profile…","ghost",()=>$("importInput").click());
  }
}
async function init(){
  sessions=localLoad("ironlog.sessions",{});profile=loadLocalProfile();derive();
  goToDate(todayISO());setStatus();
  if(FS_OK)fileHandle=await kvGet("handle");
  renderFileBar();
  setInterval(()=>{if(fileDirty&&fileHandle)writeFile()},AUTOSAVE_MS);
  document.addEventListener("visibilitychange",()=>{if(document.hidden&&fileDirty&&fileHandle)writeFile()});
  window.addEventListener("beforeunload",e=>{if(fileDirty){if(fileHandle)writeFile();e.preventDefault();e.returnValue=""}});
  if(!profile.me.name)showWelcome();
  $("importInput").onchange=async e=>{const f=e.target.files[0];e.target.value="";if(!f)return;
    try{loadProfile(parseProfileText(await f.text()));toast("Loaded "+f.name)}catch(err){toast(err.message||"Couldn’t read the file.")}};
}
init();
