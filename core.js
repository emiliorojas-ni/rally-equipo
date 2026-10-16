/* Pure functions also exercised by node:test. */
(function(root){
const START=Date.parse('2026-10-16T08:00:00-06:00'), END=START+28*3600000;
const STATES=['Pendiente','Lista','En curso','En revisión','Terminada'];
function clock(now){const before=now<START,ended=now>=END;return {label:before?'El Rally comienza en':ended?'El Rally ha finalizado':'Tiempo para entregar',seconds:Math.max(0,Math.floor(((before?START:END)-now)/1000)),progress:Math.min(100,Math.max(0,(now-START)/(END-START)*100))};}
const MILESTONES=['Confirmar equipo en SIRLI','Formular y elegir la idea humana','Contactar al equipo internacional','Publicar TikTok conjunto','Probar el supuesto crítico','Congelar alcance y cifras','Iniciar subida del pitch a YouTube','Verificar entregas en SIRLI'];
function nextMilestone(records){return records.filter(d=>d.kind==='task'&&d.status!=='Terminada'&&MILESTONES.includes(d.title)).sort((a,b)=>MILESTONES.indexOf(a.title)-MILESTONES.indexOf(b.title))[0]||null;}
function formatSeconds(s){return [Math.floor(s/3600),Math.floor(s%3600/60),s%60].map(v=>String(v).padStart(2,'0')).join(':');}
function safeUrl(value){try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)?u.href:'';}catch{return '';}}
function parseRecord(issue){try{const match=issue.body?.match(/<!-- rally-data:v1 -->\s*```json\s*([\s\S]*?)\s*```/);if(!match)return null;const d=JSON.parse(match[1]);if(!['task','idea','decision','document','delivery'].includes(d.kind)||typeof d.title!=='string')return null;return {...d,id:issue.number,updated:issue.updated_at,github:issue.html_url,status:STATES.includes(d.status)?d.status:'Pendiente'};}catch{return null;}}
function serialize(d){const clean={};for(const k of ['kind','title','description','owner','reviewer','status','priority','deadline','area','url','criteria','blocked','origin'])clean[k]=String(d[k]||'');return `Registro de Rally Equipo. Editar desde la web para conservar su estructura.\n\n<!-- rally-data:v1 -->\n\`\`\`json\n${JSON.stringify(clean,null,2)}\n\`\`\``;}
const api={START,END,STATES,MILESTONES,nextMilestone,clock,formatSeconds,safeUrl,parseRecord,serialize};root.Rally=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
