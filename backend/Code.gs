/** TOL shared state. Deploy as a Google Apps Script Web App.
 * Only Spreadsheet scope is required. No Drive file contents are read.
 */
function setup(){
 const props=PropertiesService.getScriptProperties();
 if(!props.getProperty('DATABASE_ID')){
  const book=SpreadsheetApp.create('TOL Estado compartido');
  book.getSheets()[0].setName('Records').appendRow(['id','json','revision']);
  props.setProperty('DATABASE_ID',book.getId());
 }
 if(!props.getProperty('TEAM_KEY'))props.setProperty('TEAM_KEY',Utilities.getUuid()+Utilities.getUuid());
 console.log('Hoja: https://docs.google.com/spreadsheets/d/'+props.getProperty('DATABASE_ID'));
 console.log('Clave del equipo (compartir solo con TOL): '+props.getProperty('TEAM_KEY'));
}
function doGet(){return HtmlService.createHtmlOutput(`<!doctype html><html><body><script>
const allowed=['https://emiliorojas-ni.github.io','http://127.0.0.1:4173','http://localhost:4173'];
window.addEventListener('message',e=>{
 if(e.source!==top||!allowed.includes(e.origin)||e.data?.type!=='tol-rpc')return;
 const origin=e.origin,id=e.data.id,channel=e.data.channel;
 google.script.run.withSuccessHandler(result=>top.postMessage({type:'tol-result',id,channel,result},origin))
 .withFailureHandler(error=>top.postMessage({type:'tol-result',id,channel,result:{ok:false,error:error.message||'Error de Google'}},origin))
 .rpc(e.data.payload);
});
top.postMessage({type:'tol-ready'},'*');
</script></body></html>`).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);}
function rpc(payload){
 try{
  const props=PropertiesService.getScriptProperties();
  if(!payload||!props.getProperty('TEAM_KEY')||payload.key!==props.getProperty('TEAM_KEY'))throw Error('Clave de equipo incorrecta.');
  const lock=LockService.getScriptLock();lock.waitLock(20000);
  try{
   const sheet=SpreadsheetApp.openById(props.getProperty('DATABASE_ID')).getSheetByName('Records');
   const rows=sheet.getDataRange().getValues().slice(1);
   const items=rows.map((r,i)=>({id:String(r[0]),data:JSON.parse(r[1]),revision:Number(r[2]),row:i+2}));
   function write(data,existing){
    const revision=(existing?.revision||0)+1;
    const clean=JSON.parse(JSON.stringify(data));
    delete clean._rev;delete clean.github;
    clean.updated=new Date().toISOString();
    const serialized=JSON.stringify(clean);
    if(serialized.length>45000)throw Error('Registro demasiado extenso. Usa un enlace de Drive para adjuntos.');
    sheet.getRange(existing?.row||sheet.getLastRow()+1,1,1,3).setValues([[clean.id,serialized,revision]]);
    SpreadsheetApp.flush();
    return {...clean,_rev:revision};
   }
   if(payload.action==='list')return {ok:true,records:items.map(x=>({...x.data,_rev:x.revision}))};
   if(payload.action==='seed'){
    if(!Array.isArray(payload.records)||payload.records.length>60)throw Error('Plan inicial inválido.');
    payload.records.forEach(data=>{validate_(data);if(!items.some(x=>x.id===data.id))write(data,null);});
    return {ok:true};
   }
   if(payload.action==='put'){
    const data=payload.record;validate_(data);
    const existing=items.find(x=>x.id===data.id);
    if(existing&&Number(data._rev)!==existing.revision)return {ok:false,conflict:true,error:'Otra persona actualizó esta tarea. Actualiza y vuelve a aplicar tus cambios; tu texto sigue en el formulario.'};
    if(!existing&&data._rev)throw Error('No se encontró el registro para actualizar.');
    return {ok:true,record:write(data,existing)};
   }
   if(payload.action==='contribute'){
    const existing=items.find(x=>x.id===payload.id);if(!existing)throw Error('Tarea no encontrada.');
    const c=payload.contribution;
    if(!c||typeof c.person!=='string'||!c.person||typeof c.text!=='string'||!c.text.trim()||c.text.length>4000)throw Error('Aporte inválido.');
    const data=existing.data;
    if(data.kind!=='task')throw Error('Este registro no admite aportes.');
    const participants=data.participants||[];
    if(participants.length&&!participants.includes(c.person))throw Error('Participante no asignado.');
    const contribution={person:c.person,text:c.text,url:String(c.url||''),done:!!c.done,at:new Date().toISOString()};
    data.contributions=[...(data.contributions||[]).filter(x=>x.person!==c.person),contribution];
    return {ok:true,record:write(data,existing)};
   }
   throw Error('Acción desconocida.');
  }finally{lock.releaseLock();}
 }catch(error){return {ok:false,error:error.message};}
}
function validate_(data){
 if(!data||typeof data.id!=='string'||!/^[-a-zA-Z0-9_]{1,100}$/.test(data.id))throw Error('Identificador inválido.');
 if(!['task','idea','document','decision','delivery','config'].includes(data.kind)||typeof data.title!=='string'||!data.title.trim()||data.title.length>160)throw Error('Registro inválido.');
}
