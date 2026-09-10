window.UI = {
  activeTab:'news',
  buildCat:'all',
  init(){
    if(!Game.state.settings) Game.state.settings={sound:false,reducedMotion:false,language:'en'};
    if(!Game.state.settings.language) Game.state.settings.language=localStorage.getItem('cityInATabLang')||'en';
    localStorage.setItem('cityInATabLang',Game.state.settings.language);
    this.migrateLogs();
    document.getElementById('pauseBtn').onclick=()=>{Game.state.paused=!Game.state.paused;this.refreshAll();this.toast(Game.state.paused?this.t('pausedToast'):this.t('resumedToast'),Game.state.paused?this.t('pausedToastText'):this.t('resumedToastText'),Game.state.paused?'event':'good')};
    document.getElementById('speed1Btn').onclick=()=>{Game.state.speed=1;this.refreshAll();this.toast(this.t('speedChanged'),this.t('speedOne'),'good')};
    document.getElementById('speed2Btn').onclick=()=>{Game.state.speed=2;this.refreshAll();this.toast(this.t('speedChanged'),this.t('speedTwo'),'good')};
    document.getElementById('howToPlayBtn').onclick=()=>this.openHowToPlay();
    document.getElementById('settingsBtn').onclick=()=>this.openSettings();
    document.getElementById('bulldozeBtn').onclick=()=>{Game.state.bulldoze=!Game.state.bulldoze;Game.state.selectedBuild=null;this.refreshAll()};
    document.getElementById('centerMapBtn').onclick=()=>document.getElementById('cityMap').scrollTo({top:0,left:0,behavior:'smooth'});
    document.getElementById('expandLandBtn').onclick=()=>this.confirmExpansion();
    document.querySelectorAll('#infoTabs .tab-btn').forEach(b=>b.onclick=()=>{this.activeTab=b.dataset.tab;this.applyStaticLanguage();this.renderTab()});
    this.applyStaticLanguage();
    this.refreshAll();
  },
  t(key,vars){return I18N.t(key,vars)},
  bName(b){return I18N.item('buildings',b.id,'name',b.name)},
  bDesc(b){return I18N.item('buildings',b.id,'desc',b.desc)},
  pName(p){return I18N.item('projects',p.id,'name',p.name)},
  pDesc(p){return I18N.item('projects',p.id,'desc',p.desc)},
  trName(t){return I18N.item('traits',t.id,'name',t.name)},
  trDesc(t){return I18N.item('traits',t.id,'desc',t.desc)},
  trEffect(t){return I18N.item('traits',t.id,'effect',t.effect)},
  aName(a){return I18N.item('achievements',a.id,'name',a.name)},
  aDesc(a){return I18N.item('achievements',a.id,'desc',a.desc)},
  fmt(n){ if(Math.abs(n)>=1e6)return (n/1e6).toFixed(2)+'M'; if(Math.abs(n)>=1e3)return (n/1e3).toFixed(1)+'K'; return Math.round(n).toLocaleString(I18N.lang()==='tr'?'tr-TR':'en-US'); },
  applyStaticLanguage(){
    document.documentElement.lang=I18N.lang();
    const q=(sel)=>document.querySelector(sel);
    q('.stats-panel h2').textContent=this.t('cityPulse');
    q('.progression-wrap .label-row span:first-child').textContent=this.t('growthStage');
    const nul=document.getElementById('nextUnlockLabel'); if(nul) nul.textContent=this.t('nextUnlock');
    q('.build-panel h2').textContent=this.t('build');
    document.getElementById('buildHint').textContent=this.t('buildHint');
    q('.decision-panel h2').textContent=this.t('mayorDesk');
    q('.projects-panel h2').textContent=this.t('megaProjects');
    q('.projects-panel .section-title-row .muted').textContent=this.t('megaSub');
    document.getElementById('howToPlayBtn').textContent=this.t('howToPlay');
    document.getElementById('settingsBtn').textContent=this.t('settings');
    document.getElementById('bulldozeBtn').textContent=this.t('bulldoze');
    document.getElementById('centerMapBtn').textContent=this.t('center');
    document.querySelectorAll('#infoTabs .tab-btn').forEach(b=>{b.textContent=this.t({news:'news',traits:'traits',achievements:'awards',history:'history'}[b.dataset.tab]);b.classList.toggle('active',b.dataset.tab===this.activeTab)});
  },
  refreshAll(){
    const s=Game.state,r=Sim.rates(s),stage=Game.stageFor(s);
    document.getElementById('moneyValue').textContent='$'+this.fmt(s.money);
    document.getElementById('moneyRate').textContent=(r.net>=0?'+':'')+'$'+r.net.toFixed(1)+'/s';
    document.getElementById('populationValue').textContent=`${this.fmt(s.population)} / ${this.fmt(r.popCap)}`;
    document.getElementById('populationRate').textContent=(r.popGrowth>=0?'+':'')+r.popGrowth.toFixed(2)+'/s';
    const popMetric=document.getElementById('populationMetric'); if(popMetric){const tip=this.populationGrowthTip(s,r);popMetric.dataset.growthTip=tip;popMetric.setAttribute('aria-label',tip);}
    const h=Math.floor(s.minutes/60),m=Math.floor(s.minutes%60);document.getElementById('timeValue').textContent=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;document.getElementById('dayValue').textContent=this.t('day',{n:s.day});
    document.getElementById('citySubtitle').textContent=`${I18N.stage(stage.name)} · ${this.t('day',{n:s.day})}`; document.getElementById('stageBadge').textContent=I18N.stage(stage.name);
    const dk=document.getElementById('decisionKind'); if(dk) dk.textContent=this.t('policyDecision'); document.getElementById('pauseBtn').textContent=s.paused?this.t('resume'):this.t('pause'); document.getElementById('speed1Btn').classList.toggle('active',(s.speed||1)===1); document.getElementById('speed2Btn').classList.toggle('active',(s.speed||1)===2); document.getElementById('bulldozeBtn').classList.toggle('active',s.bulldoze); const simStatus=document.getElementById('simStatus'); if(simStatus){simStatus.textContent=s.paused?this.t('pausedStatus'):this.t('liveStatus',{n:s.speed||1});simStatus.classList.toggle('paused',s.paused);simStatus.classList.toggle('live',!s.paused);}
    const expandBtn=document.getElementById('expandLandBtn'),offer=MapSystem.expansionOffer(); if(expandBtn){if(!offer){expandBtn.textContent=this.t('landMax');expandBtn.disabled=true;}else{const unlocked=s.population>=offer.minPop;expandBtn.textContent=unlocked?this.t('expandLandCost',{n:offer.target,cost:this.fmt(offer.cost)}):this.t('expandLandLocked',{n:offer.minPop});expandBtn.disabled=!unlocked;expandBtn.title=this.t('expandLandTip',{n:offer.target,cost:this.fmt(offer.cost),pop:offer.minPop.toLocaleString()});}}
    const next=stage.next, progress=next===Infinity?100:((s.population-stage.pop)/(next-stage.pop))*100;
    document.getElementById('stageProgressBar').style.width=Game.clamp(progress)+'%'; document.getElementById('stageProgressText').textContent=next===Infinity?'MAX':`${this.fmt(s.population)} / ${this.fmt(next)}`;
    const nextUnlockText=document.getElementById('nextUnlockText'); if(nextUnlockText) nextUnlockText.textContent=this.nextUnlockText(s);
    if(!s.selectedBuild&&!s.bulldoze)document.getElementById('mapStatus').textContent=this.t('mapHint');
    this.renderStats();this.renderBuild(false);this.renderProjects();this.renderTab();this.renderDecision();
  },
  populationGrowthTip(s,r){
    const g=r.growth||Sim.growthBreakdown(s,r.popCap), tr=I18N.lang()==='tr';
    const signed=(v)=>`${v>=0?'+':''}${v.toFixed(2)}/s`;
    const lines=[
      tr?'NÜFUS ARTIŞI':'POPULATION GROWTH',
      `${tr?'Temel':'Base'}: ${signed(g.base)}`,
      `${tr?'Mutluluk':'Happiness'}: ${signed(g.happinessImpact)}`,
      `${tr?'Kirlilik':'Pollution'}: ${signed(g.pollutionImpact)}`,
      `${tr?'Trafik':'Traffic'}: ${signed(g.trafficImpact)}`
    ];
    if(g.floorImpact>0.0005) lines.push(`${tr?'Minimum büyüme koruması':'Minimum growth floor'}: ${signed(g.floorImpact)}`);
    if(Math.abs(g.denseImpact)>0.0005) lines.push(`${tr?'Yoğun şehir traiti':'Dense City trait'}: ${signed(g.denseImpact)}`);
    if(Math.abs(g.capacityImpact)>0.0005) lines.push(`${tr?'Kapasite aşımı':'Over capacity'}: ${signed(g.capacityImpact)}`);
    else lines.push(`${tr?'Kapasite':'Capacity'}: ${this.fmt(s.population)} / ${this.fmt(r.popCap)} · ${tr?'ceza yok':'no penalty'}`);
    lines.push(`${tr?'Net':'Net'}: ${signed(r.popGrowth)}`);
    lines.push(tr?'Not: Konut kapasiteyi artırır; kapasite dolmadıkça tek başına büyüme hızını yükseltmez.':'Note: Housing raises capacity; it does not directly speed growth until capacity becomes a constraint.');
    return lines.join('\n');
  },

  nextUnlockText(s){
    const items=[];
    for(const b of BUILDINGS){ if(b.unlock>s.population) items.push({n:b.unlock,name:this.bName(b),priority:1}); }
    const offer=MapSystem.expansionOffer(); if(offer&&offer.minPop>s.population) items.push({n:offer.minPop,name:this.t('landExpansionName'),priority:0});
    for(const p of MEGA_PROJECTS){ if(p.minPop>s.population&&!s.projects.includes(p.id)) items.push({n:p.minPop,name:this.pName(p),priority:2}); }
    for(const d of DECISIONS){ if(d.minPop>s.population) items.push({n:d.minPop,name:this.t('mayorPolicyName'),priority:3}); }
    if(!items.length) return this.t('allPopUnlocks');
    items.sort((a,b)=>a.n-b.n||a.priority-b.priority||a.name.localeCompare(b.name));
    const first=items[0];
    const same=items.filter(x=>x.n===first.n&&x.name!==first.name).slice(0,1);
    const name=same.length?`${first.name} + ${same[0].name}`:first.name;
    return this.t('atPopulation',{name,n:first.n.toLocaleString(I18N.lang()==='tr'?'tr-TR':'en-US')});
  },
  statInsight(key){
    const s=Game.state,r=Sim.rates(s), tr=I18N.lang()==='tr';
    const density=s.population/Math.max(1,r.popCap);
    const placed=(id)=>s.map.filter(x=>x===id).length;
    const industrial=placed('workshop')+placed('factory')+placed('advanced');
    const green=placed('park')+placed('garden');
    const civic=placed('clinic')+placed('police')+placed('library');
    const trend=(v)=>v>0.003?(tr?'Yükseliyor':'Rising'):v<-.003?(tr?'Düşüyor':'Falling'):(tr?'Dengede':'Stable');
    if(key==='happiness'){
      let delta=(s.stats.traffic>70?-.006:0)+(s.stats.pollution>65?-.006:0)+(s.money<0?-.012:0);
      const why=[]; if(s.stats.traffic>70)why.push(tr?'yüksek trafik':'high traffic'); if(s.stats.pollution>65)why.push(tr?'yüksek kirlilik':'high pollution'); if(s.money<0)why.push(tr?'eksi bütçe':'negative budget'); if(!why.length)why.push(tr?'şu an büyük bir stres etkeni yok':'no major active stress');
      return `${trend(delta)} · ${why.join(', ')}. ${tr?'Parklar, kararlar ve kamu yapıları değeri iyileştirebilir.':'Parks, decisions and civic buildings can improve it.'}`;
    }
    if(key==='traffic'){
      const delta=density>.82?.018:-.006;
      return `${trend(delta)} · ${tr?'Doluluk':'Capacity use'} ${Math.round(density*100)}%. ${tr?'Yoğunluk ve binaların trafik etkisi baskı oluşturur; yollar ve bazı projeler azaltır.':'Density and building traffic effects create pressure; roads and some projects reduce it.'}`;
    }
    if(key==='pollution') return `${trend(-.003)} · ${tr?`${industrial} sanayi, ${green} yeşil alan.`:`${industrial} industry, ${green} green spaces.`} ${tr?'Yeni sanayi anlık kirlilik ekler; yeşil yapılar ve eventler dengeleyebilir.':'New industry adds pollution on placement; green buildings and events can offset it.'}`;
    if(key==='culture') return `${tr?'Kültür':'Culture'} ${Math.round(s.stats.culture)} · ${tr?`${placed('library')} kütüphane, ${placed('garden')} botanik bahçesi.`:`${placed('library')} libraries, ${placed('garden')} botanical gardens.`} ${tr?'Kararlar, eventler ve projeler de etkiler.':'Decisions, events and projects also affect it.'}`;
    if(key==='safety') return `${tr?'Güvenlik':'Safety'} ${Math.round(s.stats.safety)} · ${tr?`${placed('police')} polis merkezi, ${placed('clinic')} klinik.`:`${placed('police')} police stations, ${placed('clinic')} clinics.`} ${tr?'Suç eventleri ve kararlar değeri değiştirebilir.':'Crime events and decisions can change it.'}`;
    return `${tr?'İtibar':'Reputation'} ${Math.round(s.stats.reputation)} · ${tr?'Traitler, büyük eventler, kültür ve mega projeler şehrin dışarıdaki imajını şekillendirir.':'Traits, major events, culture and mega projects shape how the city is seen.'}`;
  },
  buildingEffects(b){
    const tr=I18N.lang()==='tr', bits=[];
    if(b.pop)bits.push(`${tr?'Kapasite':'Cap'} +${b.pop}`);
    if(b.income)bits.push(`+$${b.income}/s`);
    if(b.upkeep)bits.push(`${tr?'Gider':'Upkeep'} -$${b.upkeep}/s`);
    const labels={happy:tr?'Mutl.':'Happy',traffic:tr?'Trafik':'Traffic',pollution:tr?'Kirl.':'Poll.',culture:tr?'Kültür':'Culture',safety:tr?'Güven.':'Safety'};
    for(const k of ['happy','traffic','pollution','culture','safety']) if(b[k]) bits.push(`${labels[k]} ${b[k]>0?'+':''}${b[k]}`);
    return bits.join(' · ') || (tr?'Doğrudan stat etkisi yok':'No direct stat effect');
  },
  renderStats(){
    const s=Game.state,defs=[['happiness','happiness','heart'],['traffic','traffic','car'],['pollution','pollution','smoke'],['culture','culture','star'],['safety','safety','shield'],['reputation','reputation','flag']],root=document.getElementById('statsGrid');
    if(root.children.length!==defs.length || !root.querySelector('[data-stat]')){
      root.innerHTML=defs.map(([k,n,i])=>`<div class="stat-card" tabindex="0" data-stat="${k}"><div class="stat-head"><span class="ico ${i}"></span><span class="stat-label"></span><b class="stat-value"></b></div><div class="pixel-progress small"><div class="${k}"></div></div></div>`).join('');
    }
    for(const [k,n] of defs){
      const card=root.querySelector(`[data-stat="${k}"]`); if(!card)continue;
      card.querySelector('.stat-label').textContent=this.t(n);
      card.querySelector('.stat-value').textContent=Math.round(s.stats[k]);
      card.querySelector('.pixel-progress>div').style.width=s.stats[k]+'%';
      card.dataset.tip=this.statInsight(k);
    }
  },
  renderBuild(force=true){
    const s0=Game.state; const unlockBand=BUILDINGS.map(b=>s0.population>=b.unlock?'1':'0').join(''); const key=[this.buildCat||'all',s0.selectedBuild,s0.bulldoze,unlockBand,I18N.lang()].join('|'); if(!force&&this._buildKey===key)return; this._buildKey=key;
    const cats=['all','residential','commercial','industrial','green','civic','infrastructure'], tabs=document.getElementById('buildTabs'); if(!this.buildCat)this.buildCat='all';
    tabs.innerHTML=cats.map(c=>`<button class="tab-btn ${this.buildCat===c?'active':''}" data-cat="${c}">${this.t(c)}</button>`).join('');
    tabs.querySelectorAll('button').forEach(b=>b.onclick=()=>{this.buildCat=b.dataset.cat;this.renderBuild(true)});
    const s=Game.state, list=BUILDINGS.filter(b=>this.buildCat==='all'||b.cat===this.buildCat);
    document.getElementById('buildList').innerHTML=list.map(b=>{const locked=s.population<b.unlock,selected=s.selectedBuild===b.id&&!s.bulldoze;const name=this.bName(b),desc=this.bDesc(b);return `<button class="build-card ${locked?'locked':''} ${selected?'selected':''}" data-id="${b.id}" title="${this.buildingEffects(b)}"><span class="build-mini"><img class="static-build-icon" src="assets/build-icons/${b.id}.svg" alt="" draggable="false"></span><span class="build-copy"><b>${name}</b><small>${desc}</small><span class="build-meta">$${b.cost.toLocaleString()} · ${b.income?`+$${b.income}/s`:this.t('utility')}</span><span class="build-effects">${this.buildingEffects(b)}</span>${locked?`<span class="lock-chip">${this.t('locked')} · ${b.unlock.toLocaleString()} ${this.t('pop')}</span>`:''}</span></button>`}).join('');
    document.querySelectorAll('.build-card').forEach(el=>el.onclick=()=>{const b=BUILDINGS.find(x=>x.id===el.dataset.id);if(Game.state.population<b.unlock)return this.toast(this.t('locked'),this.t('requires',{n:b.unlock.toLocaleString()}),'bad');Game.state.selectedBuild=b.id;Game.state.bulldoze=false;this.renderBuild(true);document.getElementById('mapStatus').textContent=this.t('placing',{name:this.bName(b)});});
  },
  renderDecision(){
    const s=Game.state,root=document.getElementById('decisionCard'); if(!s.currentDecision){root.className='decision-card empty-card';root.innerHTML=`<div class="empty-pixel skyline"></div><h3>${this.t('noDecision')}</h3><p>${this.t('noDecisionText')}</p>`;document.getElementById('decisionTimer').textContent=this.t('nextBrief');return}
    const d=DECISIONS.find(x=>x.id===s.currentDecision); if(!d){s.currentDecision=null;return}
    const title=I18N.item('decisions',d.id,'title',d.title),text=I18N.item('decisions',d.id,'text',d.text);
    root.className='decision-card';root.innerHTML=`<div><span class="eyebrow">${this.t('cityHallBrief')}</span><h3>${title}</h3><p>${text}</p></div><div class="choice-grid">${d.choices.map((c,i)=>`<button class="choice-btn" data-i="${i}"><b>${I18N.choice(d.id,i,c.label)}</b><small>${this.effectsText(c.effects)}</small></button>`).join('')}</div>`;
    root.querySelectorAll('.choice-btn').forEach(b=>b.onclick=()=>this.chooseDecision(d,+b.dataset.i));document.getElementById('decisionTimer').textContent=this.t('decisionRequired');
  },
  chooseDecision(d,i){const c=d.choices[i],s=Game.state;Sim.applyEffects(s,c.effects,true);if(c.timed)s.modifiers.push({...c.timed});if(d.id==='nightlife'&&i===0)s.flags.nightlife=true;if(d.id==='company'&&i===0)s.flags.corporate=true;const clabel=I18N.choice(d.id,i,c.label);this.addNews({type:'decision_news',decisionId:d.id,choice:i});this.addHistory({type:'decision_history',decisionId:d.id,choice:i});s.recentDecisions=Array.isArray(s.recentDecisions)?s.recentDecisions:[];s.recentDecisions.push(d.id);s.recentDecisions=s.recentDecisions.slice(-6);s.currentDecision=null;s.nextDecisionAt=Date.now()+65000+Math.random()*65000;this.toast(this.t('decisionMade')||'Decision made',clabel,'good');this.refreshAll()},
  effectsText(e){const labels={money:this.t('budget'),population:this.t('pop'),happiness:this.t('happiness'),traffic:this.t('traffic'),pollution:this.t('pollution'),culture:this.t('culture'),safety:this.t('safety'),reputation:this.t('reputation')};return Object.entries(e).map(([k,v])=>`${v>0?'+':''}${v} ${labels[k]||k}`).join(' · ')},
  renderTab(){
    const s=Game.state,root=document.getElementById('tabContent');
    if(this.activeTab==='news')root.innerHTML=s.news.slice(0,35).map(n=>`<article class="feed-item"><span class="feed-dot"></span><div><p>${this.logText(n,'news')}</p><small>${this.relative(n.t)}</small></div></article>`).join('')||this.empty('newspaper',this.t('noHeadlines'));
    if(this.activeTab==='history')root.innerHTML=s.history.slice().reverse().map(n=>`<article class="feed-item history"><div><p>${this.logText(n,'history')}</p><small>${new Date(n.t).toLocaleDateString(I18N.lang()==='tr'?'tr-TR':'en-US')}</small></div></article>`).join('')||this.empty('book',this.t('historyBegins'));
    if(this.activeTab==='traits')root.innerHTML=TRAITS.map(t=>`<div class="collection-card ${s.traits.includes(t.id)?'unlocked':'locked'}"><span class="trait-glyph"></span><div><b>${this.trName(t)}</b><p>${s.traits.includes(t.id)?this.trDesc(t):this.t('shapeDiscover')}</p><small>${s.traits.includes(t.id)?this.trEffect(t):this.t('locked')}</small></div></div>`).join('');
    if(this.activeTab==='achievements')root.innerHTML=ACHIEVEMENTS.map(a=>`<div class="collection-card ${s.achievements.includes(a.id)?'unlocked':'locked'}"><span class="award-glyph"></span><div><b>${this.aName(a)}</b><p>${this.aDesc(a)}</p><small>${s.achievements.includes(a.id)?this.t('unlocked'):this.t('locked')}</small></div></div>`).join('');
  },
  renderProjects(){const s=Game.state;document.getElementById('projectList').innerHTML=MEGA_PROJECTS.map(p=>{const done=s.projects.includes(p.id),locked=s.population<p.minPop,name=this.pName(p),desc=this.pDesc(p);return `<div class="project-card ${done?'done':''} ${locked?'locked':''}"><div><b>${name}</b><p>${desc}</p><small>${done?this.t('completed'):locked?this.t('unlocksAt',{n:p.minPop.toLocaleString()}):this.t('cost',{n:p.cost.toLocaleString()})}</small></div>${done?'✓':`<button class="pixel-btn compact" data-project="${p.id}" ${locked?'disabled':''}>${this.t('buildVerb')}</button>`}</div>`}).join('');document.querySelectorAll('[data-project]').forEach(b=>b.onclick=()=>this.buildProject(b.dataset.project))},
  buildProject(id){const s=Game.state,p=MEGA_PROJECTS.find(x=>x.id===id),name=this.pName(p);if(s.money<p.cost)return this.toast(this.t('budgetSmall'),this.t('needMore',{n:this.fmt(p.cost-s.money)}),'bad');s.money-=p.cost;s.lifetime.spent+=p.cost;s.projects.push(id);Sim.applyEffects(s,p.effects,true);this.addHistory({type:'project_history',projectId:id});this.addNews({type:'project_news',projectId:id});this.toast(this.t('megaComplete'),name,'good');this.refreshAll()},
  addNews(entry){Game.state.news.unshift({t:Date.now(),...(typeof entry==='string'?{text:entry}:entry)});Game.state.news=Game.state.news.slice(0,60)}, addHistory(entry){Game.state.history.push({t:Date.now(),...(typeof entry==='string'?{text:entry}:entry)});},
  decisionNewsText(id,index){
    const d=DECISIONS.find(x=>x.id===id),fallback=d?.choices?.[index]?.news||''; if(I18N.lang()!=='tr')return fallback;
    const tr={parkParking:['Belediye meclisi merkezde yeni bir parkı onayladı.','Alışveriş caddesinin yanında yeni otopark açıldı.'],transitBudget:['Büyüyen yerleşimde otobüs seferleri artırıldı.','Ulaşım hizmeti mevcut düzeyinde kaldı.','Şehir tasarruf için otobüs seferlerini azalttı.'],smallBusiness:['Küçük işletme hibeleri ana caddeye yeni hareket getirdi.','Belediye yerel işletmelerin ruhsat süreçlerini hızlandırdı.','Şehir ana caddedeki dönüşümü piyasaya bıraktı.'],tax:['Şehir mali denge için vergileri artırdı.','Vergi oranları değişmeden kaldı.','Şehir geçici vergi indirimi açıkladı.'],recycling:['Şehir çapında geri dönüşüm standardı yürürlüğe girdi.','Sakinler gönüllü geri dönüşüm kampanyasına katıldı.','Geri dönüşüm programı bir sonraki bütçe dönemine ertelendi.'],streetUpgrade:['Yeni sokak ağaçları büyüyen konut bölgesine gölge kattı.','Yeni aydınlatma mahalle sokaklarını geceleri daha güvenli hale getirdi.','Ekipler büyük tasarım değişikliği olmadan temel onarımları tamamladı.'],rent:['Yeni kiracı korumaları yükselen kiralara dair kaygıları azalttı.','İnşaat teşvikleri yeni konut faaliyetini hızlandırdı.','Belediye konut piyasasına müdahale etmemeyi seçti.'],cultureFund:['Yerel sanatçılar şehrin ilk kültür hibelerini aldı.','Kültür bütçesi halka açık etkinliklere yönlendirildi.','Kültür fonu bu yıl bütçeye alınmadı.'],delivery:['Yeni teslimat saatleri gündüz yük trafiğini azalttı.','Ticari teslimatlar gün boyu serbest bırakıldı.','Merkezde düşük emisyonlu yük taşımacılığı kuralları başladı.'],industry:['Sanayi genişlemesine onay verildi.','Şehir daha temiz sanayi standartları talep etti.'],schools:['Şehir genelinde yeni sınıflar açıldı.','Geçici sınıflar okul kalabalığını hafifletti.','Artan öğrenci sayısına rağmen okul genişlemesi ertelendi.'],tourism:['Yeni turizm kampanyası şehri bölgesel olarak tanıtmaya başladı.','Şehir tanıtımı yerel halka yönelik etkinliklere kaydırıldı.','Turizm kampanyası bütçeyi korumak için rafa kaldırıldı.'],nightlife:['Merkezde gece hayatı kuralları gevşetildi.','Kapanış saatleri değişmeden kaldı.'],zoning:['Büyüyen koridorlarda karma kullanımlı imar onaylandı.','Daha sakin bölgelerde düşük yoğunluk korumaları getirildi.','Gelişimi hızlandırmak için planlama kuralları gevşetildi.'],publicSafety:['Yoğun mahallelerde toplum odaklı devriyeler artırıldı.','Merkezde yeni kamera ağı devreye alındı.','Kamu güvenliği kadrosu bu yıl değişmedi.'],company:['Büyük işveren şehre taşınacağını doğruladı.','Belediye meclisi kurumsal vergi indirimini reddetti.'],energy:['Güneş çatısı destekleri ev ve işletmelerde yayılmaya başladı.','Yeni yedek üretim şebeke güvenilirliğini artırdı.','Büyük enerji yatırımı ertelendi.'],heritage:['Eski Mahalle koruma statüsü aldı.','Tarihi blok yeniden geliştirme için temizlendi.'],cars:['Yol genişletme projesi başladı.','Ana caddelerde özel otobüs şeritleri açıldı.'],university:['Şehir Üniversitesi ilk öğrencilerini karşıladı.','Üniversite planı ertelendi.'],metro:['Metro planlama ofisi resmen açıldı.','Şehir metro planlamasını erteledi.'],waterfront:['Halka açık kıyı planı onaylandı.','Nehir boyunca lüks kuleler planlandı.']};
    return tr[id]?.[index]||fallback;
  },
  logText(entry,channel){
    if(!entry)return ''; const tr=I18N.lang()==='tr';
    if(!entry.type)return entry.text||'';
    if(entry.type==='foundation_news')return tr?'New Pixelton resmen kuruldu.':'New Pixelton officially founded.';
    if(entry.type==='foundation_history')return tr?'Yerleşim kuruldu.':'The settlement was founded.';
    if(entry.type==='decision_news')return this.decisionNewsText(entry.decisionId,entry.choice);
    if(entry.type==='decision_history'){const d=DECISIONS.find(x=>x.id===entry.decisionId),c=d?.choices?.[entry.choice];if(!d||!c)return entry.text||'';return `${I18N.item('decisions',d.id,'title',d.title)}: ${I18N.choice(d.id,entry.choice,c.label)}.`;}
    if(entry.type==='event_news'){const ev=CITY_EVENTS.find(x=>x.id===entry.eventId);if(!ev)return entry.text||'';return `${I18N.item('events',ev.id,'title',ev.title)}: ${I18N.item('events',ev.id,'text',ev.text)}`;}
    if(entry.type==='event_history'){const ev=CITY_EVENTS.find(x=>x.id===entry.eventId);if(!ev)return entry.text||'';return `${I18N.item('events',ev.id,'title',ev.title)}${tr?' şehri vurdu.':' struck the city.'}`;}
    if(entry.type==='trait_history'||entry.type==='trait_news'){const t=TRAITS.find(x=>x.id===entry.traitId),name=t?this.trName(t):'';return entry.type==='trait_history'?(tr?`Şehir özelliği açıldı: ${name}.`:`City trait unlocked: ${name}.`):(tr?`Şehir yeni bir kimlik kazandı: ${name}.`:`City earns a new identity: ${name}.`);}
    if(entry.type==='project_history'||entry.type==='project_news'){const p=MEGA_PROJECTS.find(x=>x.id===entry.projectId),name=p?this.pName(p):'';return entry.type==='project_history'?(tr?`Mega proje tamamlandı: ${name}.`:`Mega project completed: ${name}.`):(tr?`${name}, yıllar süren planlamanın ardından açıldı.`:`${name} opens after years of planning.`);}
    if(entry.type==='build_demolished'){const b=BUILDINGS.find(x=>x.id===entry.buildingId),name=b?this.bName(b):(tr?'Yapı':'Structure');return tr?`${name} yıkıldı.`:`${name} demolished.`;}
    if(entry.type==='build_opened'){const b=BUILDINGS.find(x=>x.id===entry.buildingId),name=b?this.bName(b):'';return tr?`${name} açıldı; şehir genelinde inşaat sürüyor.`:`${name} opens as construction continues across the city.`;}
    if(entry.type==='boundaries_history')return tr?'Şehir sınırları genişledi.':'City boundaries expanded.';
    if(entry.type==='boundaries_news')return tr?'Belediye yeni arazi satın alarak şehir sınırlarını genişletti.':'City hall purchased new land and expanded the city limits.';
    if(entry.type==='first_week')return tr?'Şehir ilk haftasını geride bıraktı.':'The city survived its first week.';
    return entry.text||'';
  },
  normalizeLegacyLog(entry,channel){
    if(!entry||entry.type||!entry.text)return entry; const text=entry.text;
    if(text==='New Pixelton officially founded.'||text==='New Pixelton resmen kuruldu.')return {...entry,type:'foundation_news',text:undefined};
    if(text==='The settlement was founded.'||text==='Yerleşim kuruldu.')return {...entry,type:'foundation_history',text:undefined};
    if(text==='The city survived its first week.'||text==='Şehir ilk haftasını geride bıraktı.')return {...entry,type:'first_week',text:undefined};
    if(text==='City boundaries expanded.'||text==='Şehir sınırları genişledi.')return {...entry,type:'boundaries_history',text:undefined};
    for(const ev of CITY_EVENTS){const trrow=I18N.data.tr.events?.[ev.id];if(text===`${ev.title}: ${ev.text}`||text===`${trrow?.[0]}: ${trrow?.[1]}`)return {...entry,type:'event_news',eventId:ev.id,text:undefined};if(text===`${ev.title} struck the city.`||text===`${trrow?.[0]} şehri vurdu.`)return {...entry,type:'event_history',eventId:ev.id,text:undefined};}
    for(const d of DECISIONS){const trrow=I18N.data.tr.decisions?.[d.id];for(let i=0;i<d.choices.length;i++){const c=d.choices[i];if(text===c.news||text===this.decisionNewsTextForLang(d.id,i,'tr'))return {...entry,type:'decision_news',decisionId:d.id,choice:i,text:undefined};if(text===`${d.title}: ${c.label}.`||text===`${trrow?.[0]}: ${trrow?.[2]?.[i]}.`)return {...entry,type:'decision_history',decisionId:d.id,choice:i,text:undefined};}}
    for(const p of MEGA_PROJECTS){const trrow=I18N.data.tr.projects?.[p.id],tn=trrow?.[0];if(text===`Mega project completed: ${p.name}.`||text===`Mega proje tamamlandı: ${tn}.`)return {...entry,type:'project_history',projectId:p.id,text:undefined};if(text===`${p.name} opens after years of planning.`||text===`${tn}, yıllar süren planlamanın ardından açıldı.`)return {...entry,type:'project_news',projectId:p.id,text:undefined};}
    for(const t of TRAITS){const trrow=I18N.data.tr.traits?.[t.id],tn=trrow?.[0];if(text===`City trait unlocked: ${t.name}.`||text===`Şehir özelliği açıldı: ${tn}.`)return {...entry,type:'trait_history',traitId:t.id,text:undefined};if(text===`City earns a new identity: ${t.name}.`||text===`Şehir yeni bir kimlik kazandı: ${tn}.`)return {...entry,type:'trait_news',traitId:t.id,text:undefined};}
    for(const b of BUILDINGS){const trrow=I18N.data.tr.buildings?.[b.id],tn=trrow?.[0];if(text===`${b.name} demolished.`||text===`${tn} yıkıldı.`)return {...entry,type:'build_demolished',buildingId:b.id,text:undefined};if(text===`${b.name} opens as construction continues across the city.`||text===`${tn} açıldı; şehir genelinde inşaat sürüyor.`)return {...entry,type:'build_opened',buildingId:b.id,text:undefined};}
    return entry;
  },
  decisionNewsTextForLang(id,index,lang){const prev=Game.state.settings.language;Game.state.settings.language=lang;const out=this.decisionNewsText(id,index);Game.state.settings.language=prev;return out;},
  migrateLogs(){let changed=false;for(const key of ['news','history']){if(!Array.isArray(Game.state[key]))Game.state[key]=[];Game.state[key]=Game.state[key].map(x=>{const y=this.normalizeLegacyLog(x,key);if(y!==x)changed=true;return y;});}if(changed)StorageSystem.save(Game.state);},
  relative(t){const s=Math.max(0,Math.floor((Date.now()-t)/1000));if(I18N.lang()==='tr'){if(s<60)return 'az önce';if(s<3600)return Math.floor(s/60)+' dk önce';return Math.floor(s/3600)+' sa önce'}if(s<60)return 'just now';if(s<3600)return Math.floor(s/60)+'m ago';return Math.floor(s/3600)+'h ago'},
  empty(kind,text){return `<div class="big-empty"><div class="empty-pixel ${kind}"></div><p>${text}</p></div>`},
  toast(title,text,type=''){const root=document.getElementById('toastContainer'),el=document.createElement('div');el.className='toast '+type;el.innerHTML=`<b>${title}</b><span>${text}</span>`;root.appendChild(el);setTimeout(()=>el.classList.add('show'),20);setTimeout(()=>{el.classList.remove('show');setTimeout(()=>el.remove(),250)},4200)},
  modal(html){const r=document.getElementById('modalRoot');r.classList.remove('hidden');r.innerHTML=`<div class="modal-backdrop"></div><section class="modal pixel-panel">${html}</section>`;r.querySelector('.modal-backdrop').onclick=()=>r.classList.add('hidden');r.querySelectorAll('[data-close]').forEach(x=>x.onclick=()=>r.classList.add('hidden'))},
  openHowToPlay(){
    const cards=[['helpBuild','helpBuildText'],['helpMoney','helpMoneyText'],['helpPop','helpPopText'],['helpStats','helpStatsText'],['helpDecisions','helpDecisionsText'],['helpIdle','helpIdleText'],['helpGoal','helpGoalText'],['helpGlossary','helpGlossaryText']];
    this.modal(`<div class="section-title-row"><div><span class="eyebrow">CITY IN A TAB</span><h2>${this.t('helpTitle')}</h2></div><button class="pixel-btn compact" data-close>${this.t('close')}</button></div><p class="help-intro">${this.t('helpIntro')}</p><div class="help-grid">${cards.map(([a,b])=>`<article class="help-card"><b>${this.t(a)}</b><p>${this.t(b)}</p></article>`).join('')}</div><button class="pixel-btn wide" data-close>${this.t('gotIt')}</button>`);
  },
  confirmExpansion(){
    const offer=MapSystem.expansionOffer();if(!offer)return;
    this.modal(`<div class="new-game-confirm"><span class="eyebrow">${this.t('cityExpansion')}</span><h2>${this.t('expandTo',{n:offer.target})}</h2><p>${this.t('expandConfirm',{cost:this.fmt(offer.cost),n:offer.target})}</p><div class="settings-actions"><button class="pixel-btn" data-close>${this.t('cancel')}</button><button id="confirmExpansion" class="pixel-btn">${this.t('buyLand')}</button></div></div>`);
    document.getElementById('confirmExpansion').onclick=()=>{document.getElementById('modalRoot').classList.add('hidden');MapSystem.purchaseExpansion();};
  },
  openSettings(){
    this.modal(`<div class="section-title-row"><h2>${this.t('settingsSave')}</h2><button class="pixel-btn compact" data-close>${this.t('close')}</button></div><label class="field-label">${this.t('cityName')}<input id="cityNameInput" value="${Game.state.cityName}"></label><label class="language-row"><span>${this.t('language')}</span><select id="languageSelect"><option value="en" ${I18N.lang()==='en'?'selected':''}>${this.t('english')}</option><option value="tr" ${I18N.lang()==='tr'?'selected':''}>${this.t('turkish')}</option></select></label><div class="settings-actions"><button id="renameCity" class="pixel-btn">${this.t('rename')}</button><button id="exportSave" class="pixel-btn">${this.t('exportJson')}</button><label class="pixel-btn file-label">${this.t('importJson')}<input id="importSave" type="file" accept="application/json"></label><button id="newGame" class="pixel-btn danger">${this.t('newGame')}</button></div><p class="muted settings-note">${this.t('autosave')}</p>`);
    document.getElementById('languageSelect').onchange=e=>{Game.state.settings.language=e.target.value;localStorage.setItem('cityInATabLang',e.target.value);StorageSystem.save(Game.state);this._buildKey='';this.applyStaticLanguage();this.refreshAll();MapSystem.render();this.openSettings()};
    document.getElementById('renameCity').onclick=()=>{const v=document.getElementById('cityNameInput').value.trim().slice(0,28);if(v){Game.state.cityName=v;document.getElementById('cityNameLabel').textContent=v;StorageSystem.save(Game.state);this.toast(this.t('cityRenamed'),v,'good')}};
    document.getElementById('exportSave').onclick=()=>StorageSystem.export(Game.state);
    document.getElementById('importSave').onchange=e=>StorageSystem.importFile(e.target.files[0],(err,s)=>{if(err)return this.toast(this.t('importFailed'),err.message,'bad');Game.state=s;location.reload()});
    document.getElementById('newGame').onclick=()=>this.confirmNewGame();
  },
  confirmNewGame(){
    this.modal(`<div class="new-game-confirm"><span class="eyebrow">${this.t('newCity')}</span><h2>${this.t('startNew')}</h2><p>${this.t('replaceSave')}</p><div class="settings-actions"><button id="cancelNewGame" class="pixel-btn">${this.t('keepCity')}</button><button id="confirmNewGame" class="pixel-btn danger">${this.t('eraseStart')}</button></div></div>`);
    document.getElementById('cancelNewGame').onclick=()=>document.getElementById('modalRoot').classList.add('hidden');
    document.getElementById('confirmNewGame').onclick=()=>{const lang=I18N.lang();const fresh=Game.newState();fresh.settings.language=lang;StorageSystem.reset();Game.state=fresh;StorageSystem.save(fresh);location.reload();};
  },
  showOffline(r){if(r.seconds<15)return;const hrs=Math.floor(r.seconds/3600),mins=Math.floor((r.seconds%3600)/60),time=`${hrs?hrs+'h ':''}${mins}m`;this.modal(`<div class="offline-hero"><div class="empty-pixel skyline large"></div><span class="eyebrow">${this.t('welcomeBack')}</span><h2>${this.t('whileAway')}</h2><p>${this.t('awayText',{time,cap:r.capped?this.t('capApplied'):''})}</p></div><div class="offline-grid"><div><small>Population</small><b>${r.pop>=0?'+':''}${this.fmt(r.pop)}</b></div><div><small>${this.t('budget')}</small><b>${r.money>=0?'+':''}$${this.fmt(r.money)}</b></div><div><small>${this.t('happiness')}</small><b>${r.stats.happiness>=0?'+':''}${r.stats.happiness.toFixed(1)}</b></div><div><small>${this.t('traffic')}</small><b>${r.stats.traffic>=0?'+':''}${r.stats.traffic.toFixed(1)}</b></div></div><button class="pixel-btn wide" data-close>${this.t('backCity')}</button>`) }
};
