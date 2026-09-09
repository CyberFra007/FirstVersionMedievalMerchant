'use strict';

const SAVE_KEY='mercanti-regno-v1';
const VEHICLES=[
  {name:'Carro mercantile I',capacity:20,speed:3,cost:0},
  {name:'Carro mercantile II',capacity:32,speed:4,cost:2200},
  {name:'Carro mercantile III',capacity:48,speed:5,cost:5200},
  {name:'Convoglio rinforzato IV',capacity:68,speed:6,cost:11000},
  {name:'Grande convoglio V',capacity:92,speed:7,cost:22000}
];
const REGIONS=[
  ['Valle Reale','#51684c'],['Costa d’Ambra','#6f7f5b'],['Monti Grigi','#565f6d'],['Foresta Verde','#3d654c'],
  ['Marche del Nord','#677e72'],['Pianure Dorate','#8b7454'],['Terre d’Oriente','#775d4f'],['Frontiera Meridionale','#7c625c']
];
const GOODS_BASE=[
 ['Grano','Pianure Dorate',28,8,0.08,1,4],['Pane','Valle Reale',42,7,0.12,1,4],['Carne salata','Marche del Nord',66,8,0.14,1,3],['Pesce','Costa d’Ambra',48,7,0.16,1,3],
 ['Verdure','Pianure Dorate',24,7,0.18,1,2],['Vino','Valle Reale',95,9,0.06,0,0],['Birra','Foresta Verde',54,7,0.05,0,0],['Miele','Foresta Verde',72,9,0.04,1,3],
 ['Legno','Foresta Verde',35,8,0.04,0,0],['Seta grezza','Terre d’Oriente',170,10,0.03,1,4],['Lana','Marche del Nord',58,8,0.05,0,0],['Cotone','Terre d’Oriente',62,7,0.04,0,0],
 ['Canapa','Valle Reale',41,7,0.05,0,0],['Lino','Pianure Dorate',44,7,0.05,0,0],['Tintura blu','Costa d’Ambra',88,8,0.03,0,0],['Tintura rossa','Frontiera Meridionale',96,8,0.03,0,0],
 ['Pelli','Marche del Nord',83,9,0.05,0,0],['Pellicce','Monti Grigi',180,10,0.09,0,0],['Cuoi pregiati','Marche del Nord',140,9,0.04,0,0],['Scarpe','Valle Reale',92,7,0.05,0,0],
 ['Tessuti fini','Costa d’Ambra',154,9,0.04,0,0],['Abiti','Valle Reale',198,8,0.05,0,0],['Stivali','Monti Grigi',155,8,0.04,0,0],['Coperte','Marche del Nord',112,8,0.04,0,0],
 ['Ferro','Monti Grigi',52,8,0.05,0,0],['Rame','Monti Grigi',74,8,0.04,0,0],['Argento','Monti Grigi',220,9,0.04,0,0],['Oro','Terre d’Oriente',360,10,0.03,0,0],
 ['Acciaio','Monti Grigi',180,9,0.05,0,0],['Piombo','Monti Grigi',38,6,0.04,0,0],['Sale','Costa d’Ambra',29,8,0.04,0,0],['Spezie','Terre d’Oriente',240,10,0.08,0,0],
 ['Tè','Terre d’Oriente',155,9,0.06,1,3],['Caffè','Terre d’Oriente',192,9,0.06,0,0],['Zucchero','Frontiera Meridionale',76,8,0.05,1,3],['Cioccolato','Frontiera Meridionale',210,9,0.07,1,4],
 ['Incenso','Frontiera Meridionale',132,8,0.04,0,0],['Profumi','Costa d’Ambra',240,9,0.03,0,0],['Gemme','Terre d’Oriente',480,10,0.02,0,0],['Diamanti','Terre d’Oriente',720,10,0.015,0,0],
 ['Gioielli','Costa d’Ambra',560,10,0.02,0,0],['Vetro','Costa d’Ambra',88,8,0.03,0,0],['Ceramiche','Valle Reale',73,8,0.03,0,0],['Carta','Valle Reale',65,7,0.03,0,0],
 ['Pergamena','Marche del Nord',98,8,0.03,0,0],['Armi','Frontiera Meridionale',210,8,0.05,0,0],['Utensili','Valle Reale',104,8,0.04,0,0],['Carbone','Monti Grigi',26,6,0.03,0,0],
 ['Erbe medicinali','Foresta Verde',90,9,0.07,1,5],['Funghi','Foresta Verde',57,7,0.20,1,3]
];
const SEASONS=[{name:'Primavera',icon:'🌱'},{name:'Estate',icon:'☀️'},{name:'Autunno',icon:'🍂'},{name:'Inverno',icon:'❄️'}];

function mulberry32(seed){return function(){let t=seed+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296}}
function hashString(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function clamp(n,a,b){return Math.max(a,Math.min(b,n))}
function fmt(n){return Math.round(n).toLocaleString('it-IT')+' ₮'}
function seasonIndex(day){return Math.floor((day-1)/30)%4}
function seasonFactor(g,season){const idx=seasonIndex(GAME.day);let mod=1;const keywords={
  'Grano':[1.12,.9,.94,1.06],'Pellicce':[1.18,.88,.86,1.15],'Pesce':[.95,1.05,1.1,.9],'Verdure':[.98,1.12,.95,1.02],'Seta grezza':[1.02,1.03,.98,.97],
  'Carne salata':[.95,.95,1.08,1.10],'Miele':[.92,1.02,1.12,1.08],'Erbe medicinali':[1.1,.96,1.05,1.08],'Funghi':[.9,.9,1.18,1.04]
};
  if(keywords[g.name]) mod*=keywords[g.name][idx]; if(g.perishable) mod*=1+(idx===1?0.05:idx===3?0.02:0); return mod;
}
function regionColor(region){return REGIONS.find(r=>r[0]===region)?.[1]||'#61707d'}

function generateCities(){
  const prefixes=['Alder','Bel','Cor','Dorn','Essen','Fal','Garen','Hald','Iver','Jor','Keld','Lorn','Mere','Nor','Ors','Pelt','Quen','Raven','Sarn','Tarn','Ulm','Vey','Wren','Yar','Zerin'];
  const suffixes=['ia','ford','heim','ora','en','ar','is','mont','burg','eth','vale','wick','mere','dor'];
  const rng=mulberry32(1138);
  const cities=[];
  for(let i=0;i<60;i++){
    const region=REGIONS[i%REGIONS.length][0];
    let name=''; if(i===0) name='Valdora'; else name=prefixes[(i*7)%prefixes.length]+suffixes[(i*11)%suffixes.length]+(i%9===0?' Alta':'');
    const angle=(i/60)*Math.PI*2;
    const ring=180+((i*37)%250);
    const x=600+Math.cos(angle*1.65)*ring+(rng()-.5)*90;
    const y=325+Math.sin(angle*1.3)*ring*.55+(rng()-.5)*80;
    const special=GOODS_BASE[(i*7)%GOODS_BASE.length][0];
    const quality=5+Math.floor(rng()*6);
    const difficulty=1+(i%5)+(i%11===0?2:0);
    cities.push({id:i,name,region,x:clamp(x,55,1145),y:clamp(y,80,575),specialty:special,quality,difficulty,flavor:`${name} è nota per ${special.toLowerCase()} di qualità ${quality}/10.`});
  }
  return cities;
}
const CITIES=generateCities();
const GOODS=GOODS_BASE.map((g,i)=>({id:i,name:g[0],homeRegion:g[1],base:g[2],baseQuality:g[3],volatility:g[4],perishable:!!g[5],shelf:g[6]}));

function baseGame(){
  return {version:1,day:1,gold:1000,debt:0,reputation:10,currentCity:0,selectedCity:0,vehicle:0,inventory:{},employees:{guard:0,driver:0,trader:0},investments:{},marketBias:{},log:[{day:1,text:'La tua piccola carovana lascia Valdora. Il regno è davanti a te.'}]};
}
let GAME=baseGame();

function loadGame(data){if(!data||data.version!==1) throw new Error('Salvataggio non compatibile'); GAME=data; GAME.inventory??={};GAME.employees??={guard:0,driver:0,trader:0};GAME.investments??={};GAME.log??=[];GAME.marketBias??={}}
function autoSave(){localStorage.setItem(SAVE_KEY,JSON.stringify(GAME)); renderAll()}
function addLog(text){GAME.log.unshift({day:GAME.day,text}); GAME.log=GAME.log.slice(0,300)}
function toast(t){const el=document.getElementById('toast');el.textContent=t;el.classList.remove('hidden');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.add('hidden'),2300)}
function cityById(id){return CITIES.find(c=>c.id===id)}
function commodityById(id){return GOODS.find(g=>g.id===id)}
function distance(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
function daysBetween(a,b){let d=Math.ceil(distance(a,b)/105);const season=seasonIndex(GAME.day);let weather=season===3?1.25:season===1?.92:season===2?1.08:1;return clamp(Math.ceil(d*weather/(1+GAME.employees.driver*.04)),1,12)}
function localQuality(city,g){let q=g.baseQuality;if(city.specialty===g.name) q=city.quality;const regional=city.region===g.homeRegion?1:0;return clamp(Math.round(q+regional+(hashString(city.id+'|'+g.id)%3)-1),0,10)}
function marketPrice(city,g){const q=localQuality(city,g);const scarcityKey=`${city.id}:${g.id}`;if(GAME.marketBias[scarcityKey]===undefined)GAME.marketBias[scarcityKey]=((hashString(scarcityKey)%101)-50)/100;let scarcity=GAME.marketBias[scarcityKey];const rngFactor=1+scarcity*g.volatility;const season=seasonFactor(g,SEASONS[seasonIndex(GAME.day)]);const regionMod=city.specialty===g.name?.72:city.region===g.homeRegion?.86:1.04;const reputation=1-(GAME.employees.trader*.012);return Math.max(1,g.base*regionMod*rngFactor*season*reputation)}
function availableQty(city,g){const scarcity=((hashString(city.id+':q:'+g.id)%70)-25);return Math.max(0,Math.round(35+scarcity+(city.specialty===g.name?55:0)+(city.region===g.homeRegion?22:0)))}
function invQty(gid){return GAME.inventory[gid]?.qty||0}
function invEntry(gid){GAME.inventory[gid]??={qty:0,quality:0,age:0};return GAME.inventory[gid]}
function decayInventory(days){for(const [gid,e] of Object.entries(GAME.inventory)){const g=commodityById(Number(gid));if(!g||!g.perishable||e.qty<=0)continue;e.age+=days;const freshness=Math.floor(e.age/(g.shelf||4));if(freshness>0){e.qty=Math.max(0,e.qty-Math.ceil(e.qty*(0.12*freshness)));e.quality=clamp((e.quality||localQuality(cityById(GAME.currentCity),g))-freshness,0,10);e.age=e.age%(g.shelf||4)}}}
function payWages(days){const weeks=Math.floor((GAME.day-1)/7)-Math.floor((GAME.day-1-days)/7);if(weeks<=0)return 0;const weekly=GAME.employees.guard*50+GAME.employees.driver*40+GAME.employees.trader*55;const bill=weekly*weeks;GAME.gold-=bill;addLog(`Paghe: ${fmt(bill)} per ${weeks} settimana/e di servizio.`);if(GAME.gold<0){GAME.reputation=Math.max(0,GAME.reputation-1);addLog('Le casse sono in rosso: la reputazione è diminuita di 1.')}return bill}
function advanceDays(days,reason=''){if(days<=0)return;const oldDay=GAME.day;GAME.day+=days;decayInventory(days);payWages(days);for(const k of Object.keys(GAME.investments)){const inv=GAME.investments[k];const cycles=Math.floor(GAME.day/30)-Math.floor(oldDay/30);if(cycles>0){const yieldAmount=inv.amount*0.06*cycles;GAME.gold+=yieldAmount;addLog(`Rendita investimento: +${fmt(yieldAmount)}.`)}}
  if(reason)addLog(reason); for(const [key,b] of Object.entries(GAME.marketBias)){const drift=((hashString(key+'|'+GAME.day)%21)-10)/100;b=clamp(b+drift*.03,-.65,.65);GAME.marketBias[key]=b}
  if(Math.floor((oldDay-1)/30)!==Math.floor((GAME.day-1)/30))addLog(`È iniziato un nuovo mese di mercato. Stagione: ${SEASONS[seasonIndex(GAME.day)].name}.`);
}
function randomTravelEvent(days){const rng=mulberry32(hashString('travel|'+GAME.day+'|'+GAME.currentCity+'|'+GAME.selectedCity));const roll=rng();if(roll<.16){showEvent('⚔','Assalto sulla rotta','Una banda di predoni blocca il passo. Puoi rischiare uno scontro, pagare il pedaggio o affidarti alle guardie.',[
    ['Combatti',()=>{const loss=Math.max(0,Math.ceil(60*(1-GAME.employees.guard*.14)));GAME.gold-=loss;GAME.reputation=Math.max(0,GAME.reputation+(GAME.employees.guard>=2?1:0));addLog(`Assalto respinto. Perdite: ${fmt(loss)}.`);hideEvent();renderAll()}],
    ['Paga 90 ₮',()=>{GAME.gold-=90;addLog('Hai pagato 90 ₮ ai predoni e continui il viaggio.');hideEvent();renderAll()}],
    ['Fuggi',()=>{advanceDays(1,'Hai perso una giornata cercando una via alternativa.');GAME.reputation=Math.max(0,GAME.reputation-1);addLog('La fuga dai predoni ha ridotto la reputazione.');hideEvent();renderAll()}]
  ]);return true}
  if(roll<.34){showEvent('🌧','Meteo avverso','Pioggia intensa rallenta il convoglio e rovina una parte delle merci deperibili.',[['Prosegui',()=>{decayInventory(1);advanceDays(1,'Una giornata di pioggia rallenta la carovana.');hideEvent();renderAll()}],['Sosta prudente',()=>{advanceDays(1,'La carovana si ferma per evitare il fango.');hideEvent();renderAll()}]]);return true}
  if(roll<.42){showEvent('🍀','Buona sorte','Un mercante incontrato lungo la via ti paga per una piccola consegna improvvisata.',[['Accetta',()=>{GAME.gold+=80+GAME.employees.trader*20;GAME.reputation+=1;addLog(`Consegna fortunata: +${fmt(80+GAME.employees.trader*20)}.`);hideEvent();renderAll()}]]);return true}
  return false}
function travel(){const from=cityById(GAME.currentCity),to=cityById(GAME.selectedCity);if(!to||to.id===from.id)return;const days=daysBetween(from,to);GAME.currentCity=to.id;advanceDays(days,`Viaggio completato: ${from.name} → ${to.name} (${days} giorni).`);GAME.gold-=days*2;randomTravelEvent(days);renderAll();autoSave()}
function buy(gid){const city=cityById(GAME.currentCity),g=commodityById(gid),e=invEntry(gid);const qty=1;const price=marketPrice(city,g);if(GAME.gold<price){toast('Oro insufficiente');return}if(currentCargo()+1>VEHICLES[GAME.vehicle].capacity){toast('Carico pieno');return}GAME.gold-=price;e.qty+=qty;e.quality=Math.max(e.quality,localQuality(city,g));e.age=0;GAME.marketBias[`${city.id}:${gid}`]=clamp((GAME.marketBias[`${city.id}:${gid}`]||0)+.02,-.65,.65);addLog(`Acquistata 1× ${g.name} a ${fmt(price)}.`);renderAll();autoSave()}
function sell(gid){const city=cityById(GAME.currentCity),g=commodityById(gid),e=invEntry(gid);if(e.qty<1){toast('Non possiedi questa merce');return}const price=marketPrice(city,g)*(0.92+localQuality(city,g)*.012)*(0.98+GAME.employees.trader*.015);GAME.gold+=price;e.qty-=1;if(e.qty===0){e.quality=0;e.age=0}GAME.marketBias[`${city.id}:${gid}`]=clamp((GAME.marketBias[`${city.id}:${gid}`]||0)-.025,-.65,.65);addLog(`Venduta 1× ${g.name} a ${fmt(price)}.`);renderAll();autoSave()}
function currentCargo(){return Object.values(GAME.inventory).reduce((a,e)=>a+(e.qty||0),0)}
function upgradeVehicle(){const next=GAME.vehicle+1;if(next>=VEHICLES.length){toast('Carovana già al massimo');return}const v=VEHICLES[next];if(GAME.gold<v.cost){toast('Oro insufficiente');return}GAME.gold-=v.cost;GAME.vehicle=next;addLog(`Potenziata la carovana a ${v.name}: ${v.capacity} t, velocità ${v.speed}.`);renderAll();autoSave()}
function hire(kind){const salary={guard:50,driver:40,trader:55}[kind];const initial={guard:120,driver:100,trader:140}[kind];if(GAME.gold<initial){toast('Oro insufficiente');return}GAME.gold-=initial;GAME.employees[kind]++;addLog(`Assunto un nuovo ${kind==='guard'?'guardia':kind==='driver'?'carovaniere':'mercante'} (${fmt(initial)} upfront, salario ${fmt(salary)}/settimana).`);renderAll();autoSave()}
function loan(){const n=Math.max(100,Math.round(Number(document.getElementById('loanAmount').value)||0));if(GAME.debt+n>20000+GAME.reputation*100){toast('La banca non concede altro credito');return}GAME.gold+=n;GAME.debt+=n;addLog(`Prestito ottenuto: +${fmt(n)}.`);renderAll();autoSave()}
function repay(){const n=Math.min(GAME.debt,Math.max(100,Math.round(Number(document.getElementById('loanAmount').value)||0)));if(GAME.gold<n){toast('Non hai abbastanza oro per il rimborso');return}GAME.gold-=n;GAME.debt-=n;addLog(`Rimborso bancario: -${fmt(n)}.`);renderAll();autoSave()}
function invest(region){const cost=1000;if(GAME.gold<cost){toast('Oro insufficiente');return}GAME.gold-=cost;GAME.investments[region]??={amount:0};GAME.investments[region].amount+=cost;addLog(`Investimento in ${region}: ${fmt(cost)}.`);renderAll();autoSave()}

function showEvent(icon,title,text,choices){document.getElementById('eventIcon').textContent=icon;document.getElementById('eventTitle').textContent=title;document.getElementById('eventText').textContent=text;const box=document.getElementById('eventChoices');box.innerHTML='';choices.forEach(([label,fn])=>{const b=document.createElement('button');b.className='primary';b.textContent=label;b.onclick=fn;box.appendChild(b)});document.getElementById('eventModal').classList.remove('hidden')}
function hideEvent(){document.getElementById('eventModal').classList.add('hidden')}

function renderMap(){const svg=document.getElementById('map');svg.innerHTML='';const ns='http://www.w3.org/2000/svg';
  const water=document.createElementNS(ns,'path');water.setAttribute('class','water');water.setAttribute('d','M0 0H1200V650H0Z');svg.appendChild(water);
  // Stylised landmass
  const land=document.createElementNS(ns,'path');land.setAttribute('fill','#18261f');land.setAttribute('stroke','#314438');land.setAttribute('stroke-width','4');land.setAttribute('d','M70 90 Q180 35 310 82 T540 70 T760 90 T1010 65 Q1130 80 1160 180 L1130 300 Q1170 430 1060 560 Q880 625 720 585 Q560 625 390 560 Q210 600 100 500 Q55 390 90 275 Q40 190 70 90Z');svg.appendChild(land);
  for(let i=0;i<7;i++){const p=document.createElementNS(ns,'path');p.setAttribute('class','terrain');p.setAttribute('d',`M ${120+i*150} ${150+(i%2)*35} Q ${270+i*130} ${230+(i%3)*30} ${430+i*105} ${150+(i%2)*80}`);svg.appendChild(p)}
  // routes for each city to a few nearest nodes
  const used=new Set();CITIES.forEach(c=>{const near=CITIES.filter(x=>x.id!==c.id).map(x=>({x,d:distance(c,x)})).sort((a,b)=>a.d-b.d).slice(0,2);near.forEach(n=>{const key=[c.id,n.x.id].sort().join('-');if(used.has(key))return;used.add(key);const line=document.createElementNS(ns,'line');line.setAttribute('class','route-line');line.setAttribute('x1',c.x);line.setAttribute('y1',c.y);line.setAttribute('x2',n.x.x);line.setAttribute('y2',n.x.y);svg.appendChild(line)})});
  CITIES.forEach(c=>{const g=document.createElementNS(ns,'g');g.dataset.id=c.id;const node=document.createElementNS(ns,'circle');node.setAttribute('cx',c.x);node.setAttribute('cy',c.y);node.setAttribute('r',c.id===GAME.currentCity?8:6);node.setAttribute('class',c.id===GAME.currentCity?'player-node':'city-node');node.addEventListener('click',()=>{GAME.selectedCity=c.id;renderMap();renderAll();});node.addEventListener('mouseenter',e=>showMapTooltip(e,c));node.addEventListener('mouseleave',()=>document.getElementById('mapTooltip').classList.add('hidden'));g.appendChild(node);const txt=document.createElementNS(ns,'text');txt.setAttribute('x',c.x+9);txt.setAttribute('y',c.y-9);txt.setAttribute('class','city-label');txt.textContent=c.name;g.appendChild(txt);svg.appendChild(g)});
}
function showMapTooltip(e,c){const el=document.getElementById('mapTooltip');el.textContent=`${c.name} · ${c.region} · ${c.specialty} · qualità ${c.quality}/10`;el.classList.remove('hidden');const rect=document.getElementById('map').getBoundingClientRect();el.style.left=(e.clientX-rect.left)+'px';el.style.top=(e.clientY-rect.top)+'px'}
function renderMarket(){const city=cityById(GAME.currentCity);document.getElementById('marketCityName').textContent=city.name;const qf=document.getElementById('qualityFilter').value;const search=document.getElementById('commoditySearch').value.toLowerCase();const body=document.getElementById('marketBody');body.innerHTML='';GOODS.filter(g=>(!search||g.name.toLowerCase().includes(search))&&(qf==='all'||localQuality(city,g)>=Number(qf))).forEach(g=>{const q=localQuality(city,g);const p=marketPrice(city,g);const row=document.createElement('tr');const sc=document.createElement('span');sc.className='quality';sc.innerHTML=`${q}/10 <span class="quality-bar"><i style="width:${q*10}%"></i></span>`;row.innerHTML=`<td><strong>${g.name}</strong><br><small class="muted">Specialità: ${g.homeRegion}</small></td><td>${availableQty(city,g)}</td><td></td><td class="price">${fmt(p)}</td><td><button class="buy-btn">+1</button></td><td><button class="sell-btn">−1</button></td><td>${g.perishable?`${g.shelf} gg base`:'∞'}</td>`;row.children[2].appendChild(sc);row.querySelector('.buy-btn').onclick=()=>buy(g.id);row.querySelector('.sell-btn').onclick=()=>sell(g.id);body.appendChild(row)})}
function renderCaravan(){const v=VEHICLES[GAME.vehicle];document.getElementById('vehicleName').textContent=v.name;document.getElementById('vehicleStats').textContent=`${v.capacity} t · velocità ${v.speed}`;const next=VEHICLES[GAME.vehicle+1];const ub=document.getElementById('upgradeVehicleBtn');if(next){ub.textContent=`Potenzia · ${fmt(next.cost)}`}else{ub.textContent='Massimo';ub.disabled=true}document.getElementById('cargoBar').style.width=`${Math.min(100,currentCargo()/v.capacity*100)}%`;const list=document.getElementById('cargoList');list.innerHTML='';GOODS.filter(g=>invQty(g.id)>0).forEach(g=>{const e=invEntry(g.id);const d=document.createElement('div');d.className='mini-item';d.innerHTML=`<span>${g.name} ×${e.qty}</span><small>qualità ${e.quality}/10 · ${g.perishable?`età ${e.age} gg`:'non deperibile'}</small>`;list.appendChild(d)});if(!list.children.length)list.innerHTML='<p class="muted">La carovana è vuota.</p>'}
function renderFinance(){document.getElementById('financeDebt').textContent=fmt(GAME.debt);const box=document.getElementById('investments');box.innerHTML='';REGIONS.forEach(r=>{const amount=GAME.investments[r[0]]?.amount||0;const el=document.createElement('div');el.className='investment';el.innerHTML=`<div class="investment-top"><strong>${r[0]}</strong><span>${fmt(amount)}</span></div><small class="muted">Rendimento: 6% ogni 30 giorni</small><div style="margin-top:8px"><button class="secondary" ${GAME.gold<1000?'disabled':''}>Investi 1.000 ₮</button></div>`;el.querySelector('button').onclick=()=>invest(r[0]);box.appendChild(el)})}
function renderLog(){const box=document.getElementById('logList');box.innerHTML='';GAME.log.slice(0,120).forEach(l=>{const el=document.createElement('div');el.className='log-item';el.innerHTML=`<small>Giorno ${l.day}</small>${l.text}`;box.appendChild(el)})}
function renderHud(){const city=cityById(GAME.currentCity);const v=VEHICLES[GAME.vehicle];const s=SEASONS[seasonIndex(GAME.day)];document.getElementById('dayLabel').textContent=GAME.day;document.getElementById('seasonLabel').textContent=`${s.icon} ${s.name} · Giorno ${((GAME.day-1)%30)+1}`;document.getElementById('cityLabel').textContent=city.name;document.getElementById('regionLabel').textContent=city.region;document.getElementById('goldLabel').textContent=fmt(GAME.gold);document.getElementById('debtLabel').textContent=`Debito: ${fmt(GAME.debt)}`;document.getElementById('cargoLabel').textContent=`${currentCargo()} / ${v.capacity}`;document.getElementById('vehicleLabel').textContent=`${v.name} · ${v.capacity} t`;document.getElementById('repLabel').textContent=GAME.reputation;document.getElementById('employeeLabel').textContent=`Dipendenti: ${GAME.employees.guard+GAME.employees.driver+GAME.employees.trader}`}
function renderSelection(){const c=cityById(GAME.selectedCity),from=cityById(GAME.currentCity);document.getElementById('selectedCityName').textContent=c.name;document.getElementById('selectedCityDesc').textContent=c.flavor;document.getElementById('selectedCityTags').innerHTML=`<span>${c.region}</span><span>Specialità: ${c.specialty}</span><span>Qualità ${c.quality}/10</span><span>Difficoltà ${c.difficulty}/5</span>`;const days=c.id===from.id?0:daysBetween(from,c);document.getElementById('travelDays').textContent=c.id===from.id?'Qui':`${days} giorni`;const btn=document.getElementById('travelBtn');btn.disabled=c.id===from.id;btn.textContent=c.id===from.id?'Sei qui':`🚚 Parti · ${days} gg`}
function renderAll(){renderHud();renderSelection();renderMap();renderMarket();renderCaravan();renderFinance();renderLog()}

// Tabs
document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.tab-panel').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.getElementById(b.dataset.tab+'Tab').classList.add('active')});
document.getElementById('travelBtn').onclick=travel;document.getElementById('upgradeVehicleBtn').onclick=upgradeVehicle;document.querySelectorAll('[data-hire]').forEach(b=>b.onclick=()=>hire(b.dataset.hire));document.getElementById('loanBtn').onclick=loan;document.getElementById('repayBtn').onclick=repay;document.getElementById('saveBtn').onclick=()=>{autoSave();toast('Partita salvata automaticamente nel browser')};document.getElementById('exportBtn').onclick=()=>{const blob=new Blob([JSON.stringify(GAME,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`salvataggio_${GAME.day}.json`;a.click();URL.revokeObjectURL(a.href);toast('Salvataggio esportato')};document.getElementById('importInput').addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{loadGame(JSON.parse(r.result));autoSave();toast('Salvataggio importato')}catch(err){toast('File di salvataggio non valido')}};r.readAsText(f)});document.getElementById('resetBtn').onclick=()=>{if(confirm('Vuoi davvero iniziare una nuova partita?')){GAME=baseGame();autoSave();toast('Nuova partita iniziata')}};document.getElementById('clearLogBtn').onclick=()=>{GAME.log=[];renderLog();autoSave()};document.getElementById('commoditySearch').oninput=renderMarket;document.getElementById('qualityFilter').onchange=renderMarket;

try{const saved=localStorage.getItem(SAVE_KEY);if(saved)loadGame(JSON.parse(saved))}catch(e){GAME=baseGame()}
renderAll();

if ('serviceWorker' in navigator) { navigator.serviceWorker.register('./sw.js').catch(()=>{}); }
