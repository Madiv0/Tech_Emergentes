'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {COLORS,score}=require('./game.js');const [r,b,v,j,o]=COLORS;
function fixedGame(){let draws=0;const context={crypto:{getRandomValues(buffer){buffer[0]=(draws++)%6;return buffer;}}};vm.createContext(context);vm.runInContext(fs.readFileSync(__dirname+'/game.js','utf8'),context);return context.CodeCouleurs.createGame();}
test('palette exacte et exemples fournis',()=>{
 assert.deepEqual(COLORS,['rouge','bleu','vert','jaune','orange','violet']);
 assert.deepEqual(score([r,b,v,j],[r,v,b,o]),{wellPlaced:1,misplaced:2});
 assert.deepEqual(score([r,r,b,v],[r,r,r,r]),{wellPlaced:2,misplaced:0});
});
test('les 1 679 616 paires : occurrences et positions',()=>{
 const codes=[];for(let n=0;n<1296;n++){let k=n;const code=[];for(let i=0;i<4;i++){code.push(COLORS[k%6]);k=Math.floor(k/6);}codes.push(code);}
 for(const secret of codes)for(const guess of codes){
  const exact=secret.reduce((n,c,i)=>n+Number(c===guess[i]),0);
  const overlap=COLORS.reduce((n,c)=>n+Math.min(secret.filter(x=>x===c).length,guess.filter(x=>x===c).length),0);
  const actual=score(secret,guess);
  if(actual.wellPlaced!==exact||actual.misplaced!==overlap-exact)assert.fail(JSON.stringify({secret,guess,actual}));
 }
});
test('refus sans mutation, copies et secret caché',()=>{
 const game=fixedGame(),initial=JSON.stringify(game.snapshot());
 for(const guess of [null,[],[r,b,v],[r,b,v,j,o],[r,null,b,v],[r,'Rose',b,v],new Array(4)]){
  const result=game.submit(guess);assert.equal(result.ok,false);assert.ok(result.error);assert.equal(JSON.stringify(game.snapshot()),initial);
 }
 const guess=[r,r,r,r];game.submit(guess);guess[0]=b;const state=game.snapshot();assert.equal(state.secret,null);assert.equal(state.history[0].guess[0],r);state.history[0].guess[0]=b;assert.equal(game.snapshot().history[0].guess[0],r);
});
test('victoire aux essais 1 et 10 puis verrouillage',()=>{
 for(const winsAt of [1,10]){
  const game=fixedGame();for(let i=1;i<winsAt;i++)assert.equal(game.submit([o,o,o,o]).status,'playing');
  const result=game.submit([r,b,v,j]);assert.equal(result.status,'won');assert.equal(result.attempts,winsAt);assert.equal(Array.from(result.secret).join(','),[r,b,v,j].join(','));
  const ended=JSON.stringify(game.snapshot());assert.equal(game.submit([r,b,v,j]).ok,false);assert.equal(JSON.stringify(game.snapshot()),ended);
 }
});
test('défaite puis remise à zéro et nouveau tirage',()=>{
 const game=fixedGame();for(let i=0;i<10;i++)game.submit([o,o,o,o]);assert.equal(game.snapshot().status,'lost');assert.equal(game.snapshot().attempts,10);
 const ended=JSON.stringify(game.snapshot());assert.equal(game.submit([r,b,v,j]).ok,false);assert.equal(JSON.stringify(game.snapshot()),ended);
 const reset=game.reset();assert.equal(reset.status,'playing');assert.equal(reset.history.length,0);assert.equal(reset.remaining,10);assert.equal(reset.secret,null);assert.equal(game.submit([o,COLORS[5],r,b]).status,'won');
});
test('tirage avec répétitions et rejet du biais',()=>{
 const values=[4294967295,0,0,0,0],context={crypto:{getRandomValues(buffer){buffer[0]=values.shift();return buffer;}}};vm.createContext(context);vm.runInContext(fs.readFileSync(__dirname+'/game.js','utf8'),context);assert.equal(context.CodeCouleurs.createGame().submit([r,r,r,r]).status,'won');assert.equal(values.length,0);
});

test('code choisi : validation atomique, copie, secret caché et mêmes règles',()=>{
 const game=fixedGame();game.submit([o,o,o,o]);const before=JSON.stringify(game.snapshot());
 for(const code of [[],[r,null,b,v],[r,'rose',b,v],new Array(4)]){assert.throws(()=>game.reset(code),{name:'TypeError'});assert.equal(JSON.stringify(game.snapshot()),before);}
 const setup=game.prepareTest();assert.equal(setup.status,'setup');assert.equal(setup.secret,null);assert.equal(setup.attempts,0);assert.equal(game.submit([r,r,b,v]).ok,false);
 const code=[r,r,b,v];game.reset(code);code[0]=o;assert.equal(game.snapshot().secret,null);
 const result=game.submit([r,r,r,r]);assert.equal(result.history[0].wellPlaced,2);assert.equal(result.history[0].misplaced,0);
 for(let i=1;i<9;i++)game.submit([o,o,o,o]);assert.equal(game.submit([r,r,b,v]).status,'won');
 assert.equal(game.submit([r,r,b,v]).ok,false);assert.equal(game.snapshot().attempts,10);
 game.reset([r,b,v,j]);for(let i=0;i<10;i++)game.submit([o,o,o,o]);assert.equal(game.snapshot().status,'lost');
});
test('interface simulée : OFF par défaut, préparation, démarrage, indices et retour OFF',()=>{
 class Element{
  constructor(){this.children=[];this.listeners={};this.disabled=false;this.textContent='';this.classList={remove(){},toggle(){}};this.value='';}
  append(...items){this.children.push(...items);}replaceChildren(...items){this.children=[...items];}
  setAttribute(name,value){this[name]=value;}addEventListener(name,fn){this.listeners[name]=fn;}
  click(){if(!this.disabled)this.listeners.click?.();}focus(){}showModal(){this.open=true;}close(){this.open=false;}
 }
 const nodes=new Map(),html=fs.readFileSync(__dirname+'/index.html','utf8');
 for(const [,id]of html.matchAll(/id="([^"]+)"/g)){assert.ok(!nodes.has(id));nodes.set(id,new Element());}
 let draws=0;const context={crypto:{getRandomValues(buffer){buffer[0]=(draws++)%6;return buffer;}},document:{getElementById(id){assert.ok(nodes.has(id),id);return nodes.get(id);},createElement(){return new Element();},createTextNode(text){return text;}}};context.window=context;
 vm.createContext(context);vm.runInContext(fs.readFileSync(__dirname+'/game.js','utf8'),context);vm.runInContext(fs.readFileSync(__dirname+'/app.js','utf8'),context);
 const el=id=>nodes.get(id),pick=i=>el('palette').children[i].click();
 const code=colors=>colors.forEach((c,i)=>{el('test-code').children[i].children[0].value=c;});
 assert.equal(el('test-toggle')['aria-checked'],'false');assert.equal(el('test-setup').hidden,true);assert.equal(el('test-label').hidden,true);assert.equal(context.document.title,'code-couleurs-1.0');assert.equal(draws,4);
 el('test-toggle').click();assert.equal(el('test-toggle')['aria-checked'],'true');assert.equal(el('test-setup').hidden,false);assert.equal(context.document.title,'code-couleurs-1.0 (test)');assert.equal(el('submit').disabled,true);assert.equal(draws,4);
 el('test-start').click();assert.match(el('test-error').textContent,/quatre emplacements/);assert.equal(el('progress').textContent,'0 / 10 essais');assert.equal(el('test-setup').hidden,false);
 code([r,'rose',b,v]);el('test-start').click();assert.match(el('test-error').textContent,/non autorisée/);assert.equal(el('submit').disabled,true);
 code([r,r,b,v]);el('test-start').click();assert.equal(el('test-setup').hidden,true);assert.equal(el('submit').disabled,false);assert.equal(draws,4);assert.match(el('secret')['aria-label'],/cachée/);
 for(const label of el('test-code').children)assert.equal(label.children[0].value,'');
 [0,0,0,0].forEach(pick);el('submit').click();assert.equal(el('progress').textContent,'1 / 10 essais');assert.match(el('message').textContent,/2 bien placée.*0 mal placée/);
 [0,0,1,2].forEach(pick);el('submit').click();assert.match(el('message').textContent,/Bravo/);assert.equal(el('submit').disabled,true);
 el('restart').click();assert.equal(el('test-setup').hidden,false);assert.equal(el('progress').textContent,'0 / 10 essais');assert.equal(draws,4);
 code([r,r,b,v]);el('test-start').click();for(let i=0;i<10;i++){[4,4,4,4].forEach(pick);el('submit').click();}assert.match(el('message').textContent,/dix essais/);assert.equal(el('submit').disabled,true);
 el('test-toggle').click();assert.equal(el('test-toggle')['aria-checked'],'false');assert.equal(el('test-setup').hidden,true);assert.equal(el('test-label').hidden,true);assert.equal(context.document.title,'code-couleurs-1.0');assert.equal(el('progress').textContent,'0 / 10 essais');assert.equal(el('submit').disabled,false);assert.equal(draws,8);
 el('restart').click();assert.equal(draws,12);
});
