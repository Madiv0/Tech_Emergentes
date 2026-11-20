'use strict';
const {COLORS,createGame}=window.CodeCouleurs;
const game=createGame(),$=id=>document.getElementById(id),initials=['R','B','V','J','O','Vi'];
let draft=[null,null,null,null],selected=0,testMode=false;
for(let i=0;i<4;i++){
 const label=document.createElement('label');label.textContent='Position '+(i+1);
 const select=document.createElement('select');select.setAttribute('aria-label','Code secret, position '+(i+1));
 const empty=document.createElement('option');empty.value='';empty.textContent='Choisir…';select.append(empty);
 for(const color of COLORS){const option=document.createElement('option');option.value=color;option.textContent=color;select.append(option);}
 label.append(select);$('test-code').append(label);
}
function resetDraft(message){draft=[null,null,null,null];selected=0;$('message').textContent=message;$('message').classList.remove('error');}
function prepareTest(){
 game.prepareTest();
 for(const label of $('test-code').children)label.children[0].value='';
 $('test-error').textContent='';
 resetDraft('Choisissez le code secret puis cliquez sur « Démarrer le test ».');
}
$('test-toggle').addEventListener('click',()=>{
 testMode=!testMode;
 if(testMode)prepareTest();else{game.reset();resetDraft('Nouveau code, nouvelle enquête. À vous de jouer !');}
 render();
});
$('test-start').addEventListener('click',()=>{
 if(!testMode||game.snapshot().status!=='setup')return;
 const code=Array.from($('test-code').children,label=>label.children[0].value);
 try{game.reset(code);}catch(error){$('test-error').textContent=error.message;return;}
 for(const label of $('test-code').children)label.children[0].value='';
 $('test-error').textContent='';resetDraft('Le test a démarré. Composez votre première proposition.');render();$('slots').children[0].focus();
});
function ball(color,extra=''){
 const el=document.createElement('span');el.className='ball '+(color||'empty')+' '+extra;
 el.textContent=color?initials[COLORS.indexOf(color)]:'';
 if(color)el.setAttribute('aria-label',color);return el;
}
for(const color of COLORS){
 const button=document.createElement('button');button.className='color-choice';button.append(ball(color),document.createTextNode(color));button.setAttribute('aria-label','Choisir '+color);
 button.addEventListener('click',()=>{
  if(game.snapshot().status!=='playing')return;
  draft[selected]=color;
  const next=draft.findIndex((c,i)=>i>selected&&!c);
  if(next!==-1)selected=next;else{const first=draft.indexOf(null);if(first!==-1)selected=first;}
  $('message').classList.remove('error');
  $('message').textContent=draft.every(Boolean)?'Votre proposition est prête à être validée.':'Complétez les quatre emplacements.';render();
 });$('palette').append(button);
}
function render(){
 const state=game.snapshot(),ended=state.status!=='playing',setup=state.status==='setup';
 $('test-toggle').setAttribute('aria-checked',String(testMode));
 $('test-toggle-text').textContent=testMode?'Test ON':'Test OFF';
 $('test-label').hidden=!testMode;
 document.title='code-couleurs-1.0'+(testMode?' (test)':'');
 $('test-setup').hidden=!setup;
 $('progress').textContent=state.attempts+' / 10 essais';
 $('turn').textContent=setup?'PRÉPARATION DU TEST':ended?'ENQUÊTE TERMINÉE':'À VOUS DE JOUER · ESSAI '+String(state.attempts+1).padStart(2,'0');
 $('composer-title').textContent=setup?'Préparez votre test.':state.status==='won'?'Le secret est percé !':state.status==='lost'?'Le code a résisté.':'Suivez votre intuition.';
 $('slots').replaceChildren();
 draft.forEach((color,index)=>{
  const button=document.createElement('button');button.className='slot'+(index===selected&&!ended?' selected':'');button.disabled=ended;
  button.setAttribute('aria-label','Emplacement '+(index+1)+' : '+(color||'vide'));button.setAttribute('aria-pressed',String(index===selected));
  const number=document.createElement('small');number.textContent=index+1;button.append(ball(color),number);
  button.addEventListener('click',()=>{selected=index;render();$('slots').children[index].focus();});$('slots').append(button);
 });
 $('history').replaceChildren();
 for(let i=0;i<10;i++){
  const row=state.history[i],current=i===state.attempts&&!ended,li=document.createElement('li');li.className=current?'current':row?'completed':'';
  const num=document.createElement('span');num.className='row-number';num.textContent=String(i+1).padStart(2,'0');
  const code=document.createElement('div');code.className='row-code';for(let j=0;j<4;j++)code.append(ball(row?row.guess[j]:null));
  const clues=document.createElement('div');clues.className='clues';
  if(row){
   const exact=document.createElement('span'),misplaced=document.createElement('span');exact.className='clue exact';misplaced.className='clue misplaced';exact.textContent=row.wellPlaced;misplaced.textContent=row.misplaced;
   exact.setAttribute('aria-label',row.wellPlaced+' bien placées');misplaced.setAttribute('aria-label',row.misplaced+' mal placées');clues.append(exact,misplaced);
  }else clues.textContent=current?'À vous':'—';
  li.append(num,code,clues);$('history').append(li);
 }
 $('secret').replaceChildren();
 if(state.secret)state.secret.forEach(c=>$('secret').append(ball(c)));
 else for(let i=0;i<4;i++){const hidden=ball(null,'hidden-ball');hidden.textContent='?';$('secret').append(hidden);}
 $('secret').setAttribute('aria-label',setup?'Code secret en préparation':state.secret?'Code secret : '+state.secret.join(', '):'Combinaison secrète cachée');
 $('secret-caption').textContent=setup?'Choisissez le code pour démarrer.':ended?'Le code secret est révélé.':'Bien gardé… pour le moment.';
 $('submit').disabled=ended;$('clear').disabled=ended;for(const button of $('palette').children)button.disabled=ended;
}
$('submit').addEventListener('click',()=>{
 const result=game.submit(draft);$('message').classList.toggle('error',!result.ok);
 if(!result.ok){$('message').textContent=result.error;return;}
 if(result.status==='won')$('message').textContent='Bravo ! Vous avez trouvé le code en '+result.attempts+' essai'+(result.attempts>1?'s.':'.');
 else if(result.status==='lost')$('message').textContent='Les dix essais sont écoulés. Le code secret est révélé. Retentez votre chance !';
 else{$('message').textContent=result.history.at(-1).wellPlaced+' bien placée(s), '+result.history.at(-1).misplaced+' mal placée(s). À vous de continuer.';draft=[null,null,null,null];selected=0;}
 render();if(result.status!=='playing')$('restart').focus();
});
$('clear').addEventListener('click',()=>{draft=[null,null,null,null];selected=0;$('message').textContent='Proposition effacée. À vous de jouer.';$('message').classList.remove('error');render();});
$('restart').addEventListener('click',()=>{if(testMode)prepareTest();else{game.reset();resetDraft('Nouveau code, nouvelle enquête. À vous de jouer !');}render();});
$('rules-open').addEventListener('click',()=>$('rules').showModal());
$('rules-close').addEventListener('click',()=>$('rules').close());render();
