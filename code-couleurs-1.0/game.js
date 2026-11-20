'use strict';
(function(root){
const COLORS=Object.freeze(['rouge','bleu','vert','jaune','orange','violet']);
const MAX_ATTEMPTS=10;
function validate(code){
 if(!Array.isArray(code)||code.length!==4)return 'Une proposition doit contenir exactement quatre couleurs.';
 if(Array.from(code).some(c=>c==null||c===''))return 'Choisissez une couleur pour chacun des quatre emplacements.';
 if(Array.from(code).some(c=>!COLORS.includes(c)))return 'Couleur non autorisée : utilisez rouge, bleu, vert, jaune, orange ou violet.';
 return null;
}
function score(secret,guess){
 const error=validate(secret)||validate(guess);if(error)throw new TypeError(error);
 let wellPlaced=0,misplaced=0;const left=[],right=[];
 for(let i=0;i<4;i++){if(secret[i]===guess[i])wellPlaced++;else{left.push(secret[i]);right.push(guess[i]);}}
 for(const color of right){const i=left.indexOf(color);if(i!==-1){misplaced++;left.splice(i,1);}}
 return {wellPlaced,misplaced};
}
function randomIndex(){const b=new Uint32Array(1);do{root.crypto.getRandomValues(b);}while(b[0]>=4294967292);return b[0]%6;}
function createGame(){
 let secret,history,status;
 function snapshot(){return {status,attempts:history.length,remaining:10-history.length,history:history.map(r=>({guess:[...r.guess],...r.clue})),secret:status==='playing'||!secret?null:[...secret]};}
 function reset(code){
  if(code!==undefined){const error=validate(code);if(error)throw new TypeError(error);}
  secret=code===undefined?Array.from({length:4},()=>COLORS[randomIndex()]):[...code];
  history=[];status='playing';return snapshot();
 }
 function prepareTest(){secret=null;history=[];status='setup';return snapshot();}
 function submit(guess){
  if(status!=='playing')return {ok:false,error:'La partie est terminée. Lancez une nouvelle partie.',...snapshot()};
  const error=validate(guess);if(error)return {ok:false,error,...snapshot()};
  const clue=score(secret,guess);history.push({guess:[...guess],clue});
  if(clue.wellPlaced===4)status='won';else if(history.length===10)status='lost';
  return {ok:true,...snapshot()};
 }
 reset();return Object.freeze({submit,reset,snapshot,prepareTest});
}
const api=Object.freeze({COLORS,MAX_ATTEMPTS,score,createGame});
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.CodeCouleurs=api;
})(globalThis);
