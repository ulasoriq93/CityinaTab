window.MapSystem = {
  render(){
    const s=Game.state, root=document.getElementById('cityMap'); root.style.setProperty('--map-size',s.mapSize); root.innerHTML='';
    s.map.forEach((id,i)=>{
      const tile=document.createElement('button'); tile.className='tile '+(id||'empty'); tile.dataset.i=i; {const bb=id?BUILDINGS.find(b=>b.id===id):null; tile.title=id?(bb?UI.bName(bb):id):(I18N.lang()==='tr'?'Boş arsa':'Empty lot');}
      if(id==='road'){ const x=i%s.mapSize,y=Math.floor(i/s.mapSize),at=(xx,yy)=>xx>=0&&yy>=0&&xx<s.mapSize&&yy<s.mapSize?s.map[yy*s.mapSize+xx]:null; const dirs={n:at(x,y-1)==='road',e:at(x+1,y)==='road',s:at(x,y+1)==='road',w:at(x-1,y)==='road'}; let active=Object.keys(dirs).filter(k=>dirs[k]); if(!active.length) active=['e','w']; const bend=active.length===2&&((active.includes('n')||active.includes('s'))&&(active.includes('e')||active.includes('w'))); tile.classList.add(...active.map(k=>'road-'+k)); tile.innerHTML=`<span class="tile-art road ${bend?'bend':''}">${active.map(k=>`<i class="road-arm ${k}"></i>`).join('')}<i class="road-core"></i>${active.map(k=>`<i class="lane-mark ${k}"></i>`).join('')}<i class="road-dot"></i></span>`; } else if(id){ tile.innerHTML=SpriteArt.markup(id); if(['workshop','factory','advanced'].includes(id)) tile.insertAdjacentHTML('beforeend','<i class="ambient-puff" aria-hidden="true"></i>'); if(['shops','mall'].includes(id)) tile.insertAdjacentHTML('beforeend','<i class="ambient-glint" aria-hidden="true"></i>'); }
      tile.onclick=()=>this.click(i); root.appendChild(tile);
    });
  },
  click(i){
    const s=Game.state;
    if(s.bulldoze){ if(!s.map[i])return; const old=BUILDINGS.find(b=>b.id===s.map[i]); if(s.map[i]==='road'&&s.map.filter(x=>x==='road').length<=3){UI.toast(I18N.lang()==='tr'?'Korumalı':'Protected',I18N.lang()==='tr'?'En az birkaç yol bırakmalısın.':'Keep at least a few roads.','bad');return} s.map[i]=null; s.money+=Math.round((old?.cost||0)*.2); Sim.recalculateStats(s); UI.addNews({type:'build_demolished',buildingId:old?.id||null}); this.render(); UI.refreshAll(); return; }
    if(!s.selectedBuild)return;
    if(s.map[i]){UI.toast(I18N.lang()==='tr'?'Dolu':'Occupied',I18N.lang()==='tr'?'Boş bir kare seç.':'Choose an empty tile.','bad');return}
    const b=BUILDINGS.find(x=>x.id===s.selectedBuild); if(!b||s.money<b.cost)return UI.toast(I18N.lang()==='tr'?'Para yetmiyor':'Not enough money',I18N.lang()==='tr'?`$${Math.ceil(b.cost-s.money).toLocaleString()} daha gerekli.`:`Need $${Math.ceil(b.cost-s.money).toLocaleString()}.`,'bad');
    const stage=Game.stageFor(s); if(s.population<b.unlock)return UI.toast(I18N.t('locked'),I18N.t('requires',{n:b.unlock.toLocaleString()}),'bad');
    s.money-=b.cost; s.lifetime.spent+=b.cost; s.map[i]=b.id; s.lifetime.builds++;
    Sim.recalculateStats(s);
    if(s.lifetime.builds%8===0) UI.addNews({type:'build_opened',buildingId:b.id});
    this.render(); UI.refreshAll();
  },
  ensureMinimumSize(min=16){
    const s=Game.state;if(s.mapSize>=min)return;const old=s.mapSize,n=min,newMap=Array(n*n).fill(null),off=Math.floor((n-old)/2);
    for(let y=0;y<old;y++)for(let x=0;x<old;x++)newMap[(y+off)*n+(x+off)]=s.map[y*old+x];
    s.mapSize=n;s.map=newMap;
  },
  expansionOffer(){
    const s=Game.state, size=s.mapSize||16;
    if(size<20)return {target:20,minPop:600,cost:4500};
    if(size<24)return {target:24,minPop:2500,cost:18000};
    if(size<28)return {target:28,minPop:8000,cost:65000};
    return null;
  },
  purchaseExpansion(){
    const s=Game.state, offer=this.expansionOffer(); if(!offer)return false;
    if(s.population<offer.minPop){UI.toast(I18N.t('landLocked'),I18N.t('requires',{n:offer.minPop.toLocaleString()}),'bad');return false;}
    if(s.money<offer.cost){UI.toast(I18N.t('budgetSmall'),I18N.t('needMore',{n:UI.fmt(offer.cost-s.money)}),'bad');return false;}
    const old=s.mapSize,n=offer.target,newMap=Array(n*n).fill(null),off=Math.floor((n-old)/2);
    for(let y=0;y<old;y++)for(let x=0;x<old;x++)newMap[(y+off)*n+(x+off)]=s.map[y*old+x];
    s.money-=offer.cost;s.lifetime.spent+=offer.cost;s.mapSize=n;s.map=newMap;s.landExpansions=(s.landExpansions||0)+1;
    UI.addHistory({type:'boundaries_history'});UI.addNews({type:'boundaries_news'});
    UI.toast(I18N.t('landExpanded'),I18N.t('landExpandedText',{n}), 'good');
    this.render();UI.refreshAll();StorageSystem.save(s);return true;
  },
  expandIfNeeded(){ /* V1.3: land expansion is player-controlled. */ }
};
