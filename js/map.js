window.MapSystem = {
  render(){
    const s=Game.state, root=document.getElementById('cityMap'); root.innerHTML='';
    const grid=document.createElement('div'); grid.className='city-grid'; grid.style.setProperty('--map-size',s.mapSize); root.appendChild(grid);
    s.map.forEach((id,i)=>{
      const tile=document.createElement('button'); tile.className='tile '+(id||'empty'); tile.dataset.i=i; {const bb=id?BUILDINGS.find(b=>b.id===id):null; tile.title=id?(bb?UI.bName(bb):id):(I18N.lang()==='tr'?'Boş arsa':'Empty lot');}
      if(id==='road'){ const x=i%s.mapSize,y=Math.floor(i/s.mapSize),at=(xx,yy)=>xx>=0&&yy>=0&&xx<s.mapSize&&yy<s.mapSize?s.map[yy*s.mapSize+xx]:null; const dirs={n:at(x,y-1)==='road',e:at(x+1,y)==='road',s:at(x,y+1)==='road',w:at(x-1,y)==='road'}; let active=Object.keys(dirs).filter(k=>dirs[k]); if(!active.length) active=['e','w']; const bend=active.length===2&&((active.includes('n')||active.includes('s'))&&(active.includes('e')||active.includes('w'))); tile.classList.add(...active.map(k=>'road-'+k)); tile.innerHTML=`<span class="tile-art road ${bend?'bend':''}">${active.map(k=>`<i class="road-arm ${k}"></i>`).join('')}<i class="road-core"></i>${active.map(k=>`<i class="lane-mark ${k}"></i>`).join('')}<i class="road-dot"></i></span>`; } else if(id){ tile.innerHTML=SpriteArt.markup(id); if(['workshop','factory','advanced'].includes(id)) tile.insertAdjacentHTML('beforeend','<i class="ambient-puff" aria-hidden="true"></i>'); if(['shops','mall'].includes(id)) tile.insertAdjacentHTML('beforeend','<i class="ambient-glint" aria-hidden="true"></i>'); }
      tile.onclick=()=>this.click(i); grid.appendChild(tile);
    });
    this.applyViewMode();
  },
  centerView(smooth=false){
    const root=document.getElementById('cityMap');if(!root)return;
    const left=Math.max(0,(root.scrollWidth-root.clientWidth)/2),top=Math.max(0,(root.scrollHeight-root.clientHeight)/2);
    root.scrollTo({left,top,behavior:smooth?'smooth':'auto'});
  },
  applyViewMode(){
    const root=document.getElementById('cityMap'),grid=root?.querySelector('.city-grid');if(!root||!grid||!Game.state)return;
    const mode=Game.state.settings?.mapView==='fit'?'fit':'normal',fit=mode==='fit',prev=this._viewMode;this._viewMode=mode;root.classList.toggle('fit-view',fit);
    grid.style.removeProperty('position');grid.style.removeProperty('left');grid.style.removeProperty('top');grid.style.removeProperty('transform');grid.style.removeProperty('transform-origin');grid.style.removeProperty('--tile');
    if(!fit){root.style.removeProperty('height');root.style.removeProperty('min-height');if(prev!=='normal')setTimeout(()=>this.centerView(false),0);return;}
    const n=Game.state.mapSize||16,gap=2,pad=24,baseTile=42;
    const naturalW=n*baseTile+gap*(n-1),naturalH=naturalW;
    const maxW=Math.max(240,root.clientWidth||root.parentElement?.clientWidth||800)-pad;
    const maxH=Math.max(280,Math.min(window.innerHeight*.68,760))-pad;
    const scale=Math.min(1,maxW/naturalW,maxH/naturalH);
    const scaledW=Math.round(naturalW*scale),scaledH=Math.round(naturalH*scale);
    grid.style.setProperty('--tile',baseTile+'px');
    grid.style.position='absolute';grid.style.left=Math.max(12,Math.floor((root.clientWidth-scaledW)/2))+'px';grid.style.top='12px';grid.style.transformOrigin='top left';grid.style.transform=`scale(${scale})`;
    root.style.height=(scaledH+24)+'px';root.style.minHeight='0px';root.scrollTo({top:0,left:0});
  },
  async exportImage(){
    const s=Game.state,n=s.mapSize||16,tile=24,pad=24,header=58,w=n*tile+pad*2,h=n*tile+pad*2+header;
    const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;
    ctx.fillStyle='#0d1220';ctx.fillRect(0,0,w,h);ctx.fillStyle='#182033';ctx.fillRect(8,8,w-16,h-16);
    ctx.fillStyle='#eef3f8';ctx.font='bold 18px monospace';ctx.fillText(s.cityName,24,32);ctx.fillStyle='#98a7bd';ctx.font='12px monospace';ctx.fillText(`${Math.round(s.population).toLocaleString()} pop · ${n}×${n} · v${Game.APP_VERSION}`,24,50);
    const iconCache=new Map();
    const loadIcon=(id)=>new Promise(resolve=>{if(iconCache.has(id))return resolve(iconCache.get(id));const img=new Image();img.onload=()=>{iconCache.set(id,img);resolve(img)};img.onerror=()=>resolve(null);img.src=`assets/build-icons/${id}.svg`;});
    const ids=[...new Set(s.map.filter(Boolean))];for(const id of ids)await loadIcon(id);
    for(let y=0;y<n;y++)for(let x=0;x<n;x++){const id=s.map[y*n+x],px=pad+x*tile,py=pad+header+y*tile;ctx.fillStyle=((x+y)%3===0)?'#566f4c':'#526a48';ctx.fillRect(px,py,tile-1,tile-1);if(id){if(id==='road'){
        const at=(xx,yy)=>xx>=0&&yy>=0&&xx<n&&yy<n?s.map[yy*n+xx]:null;
        const dirs={n:at(x,y-1)==='road',e:at(x+1,y)==='road',s:at(x,y+1)==='road',w:at(x-1,y)==='road'};
        let active=Object.keys(dirs).filter(k=>dirs[k]);if(!active.length)active=['e','w'];
        const cX=px+Math.floor(tile/2),cY=py+Math.floor(tile/2),roadW=10,half=Math.floor(roadW/2);
        ctx.fillStyle='#424b57';ctx.fillRect(cX-half,cY-half,roadW,roadW);
        if(active.includes('n'))ctx.fillRect(cX-half,py,roadW,cY-py);
        if(active.includes('s'))ctx.fillRect(cX-half,cY,roadW,py+tile-cY);
        if(active.includes('w'))ctx.fillRect(px,cY-half,cX-px,roadW);
        if(active.includes('e'))ctx.fillRect(cX,cY-half,px+tile-cX,roadW);
        ctx.fillStyle='#d7c96e';ctx.fillRect(cX-1,cY-1,3,3);
        if(active.includes('n'))ctx.fillRect(cX,py,2,Math.max(1,cY-py-4));
        if(active.includes('s'))ctx.fillRect(cX,cY+4,2,Math.max(1,py+tile-(cY+4)));
        if(active.includes('w'))ctx.fillRect(px,cY,Math.max(1,cX-px-4),2);
        if(active.includes('e'))ctx.fillRect(cX+4,cY,Math.max(1,px+tile-(cX+4)),2);
      }else{const img=iconCache.get(id);if(img)ctx.drawImage(img,px+2,py+2,tile-5,tile-5);}}}
    try{const a=document.createElement('a');a.download=`${(s.cityName||'city').replace(/[^a-z0-9_-]+/gi,'-').replace(/^-|-$/g,'')||'city'}-v${Game.APP_VERSION}.png`;a.href=canvas.toDataURL('image/png');a.click();UI.toast(I18N.t('imageSaved'),`${n}×${n}`,'good');}catch(err){console.error(err);UI.toast(I18N.t('imageSaveFailed'),err.message||'PNG export failed','bad');}
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
    if(size<32)return {target:32,minPop:15000,cost:140000};
    if(size<36)return {target:36,minPop:30000,cost:320000};
    if(size<40)return {target:40,minPop:60000,cost:750000};
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
