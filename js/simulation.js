window.Sim = {
  statKeys:['happiness','traffic','pollution','culture','safety','reputation'],

  buildingBonuses(state){
    const out={happiness:0,traffic:0,pollution:0,culture:0,safety:0,reputation:0};
    for(const id of state.map||[]){
      if(!id)continue;
      const b=BUILDINGS.find(x=>x.id===id); if(!b)continue;
      out.happiness+=b.happy||0;
      out.traffic+=b.traffic||0;
      out.pollution+=b.pollution||0;
      out.culture+=b.culture||0;
      out.safety+=b.safety||0;
      out.reputation+=b.reputation||0;
    }
    return out;
  },

  // V1.3.2: building effects are derived from the current map instead of being
  // permanently baked into stats. This makes bulldozing fully reversible.
  ensureStatLayers(state,{repairLegacyGhosts=false}={}){
    if(state.baseStats && this.statKeys.every(k=>Number.isFinite(state.baseStats[k]))){
      this.recalculateStats(state); return;
    }
    const bonuses=this.buildingBonuses(state);
    const legacyGhosts={happiness:0,traffic:0,pollution:0,culture:0,safety:0,reputation:0};

    // Saves made before V1.3.2 kept demolished-building effects forever. Recent
    // demolition log entries let us repair those ghosts during the one-time migration.
    if(repairLegacyGhosts){
      for(const entry of state.news||[]){
        if(entry?.type!=='build_demolished'||!entry.buildingId)continue;
        const b=BUILDINGS.find(x=>x.id===entry.buildingId); if(!b)continue;
        legacyGhosts.happiness+=b.happy||0;
        legacyGhosts.traffic+=b.traffic||0;
        legacyGhosts.pollution+=b.pollution||0;
        legacyGhosts.culture+=b.culture||0;
        legacyGhosts.safety+=b.safety||0;
        legacyGhosts.reputation+=b.reputation||0;
      }
    }

    state.baseStats={};
    for(const k of this.statKeys){
      const shown=Number.isFinite(state.stats?.[k])?state.stats[k]:0;
      state.baseStats[k]=Game.clamp(shown-(bonuses[k]||0)-(legacyGhosts[k]||0));
    }
    this.recalculateStats(state);
  },

  recalculateStats(state){
    if(!state.baseStats)return;
    const bonuses=this.buildingBonuses(state);
    state.buildingBonuses=bonuses;
    state.stats=state.stats||{};
    for(const k of this.statKeys) state.stats[k]=Game.clamp((state.baseStats[k]||0)+(bonuses[k]||0));
  },

  growthBreakdown(state,popCap,netIncome=0){
    const stage=Game.stageFor(state);
    const stageBase={
      'Settlement':0.80,
      'Town':1.15,
      'Small City':1.65,
      'Regional City':2.25,
      'Metropolis':3.10,
      'Megacity':4.25
    }[stage.name]||0.80;

    // V1.4: growth potential now scales with city stage instead of being capped
    // around the starter 0.8/s forever. Good city management can also push the
    // result above the stage baseline rather than merely avoiding penalties.
    const happinessFactor=.85+(Game.clamp(state.stats.happiness,0,100)/200); // 0.85..1.35
    const pollutionFactor=Math.max(.55,1-state.stats.pollution/250);
    const trafficFactor=Math.max(.55,1-state.stats.traffic/300);
    const economyFactor=netIncome>=0
      ? 1+Math.min(.12,netIncome/400)
      : Math.max(.70,1+netIncome/80);
    const denseFactor=state.traits.includes('dense')?1.05:1;
    const capacityFactor=state.population>=popCap?-.25:1;

    let value=stageBase;
    const afterHappiness=value*happinessFactor;
    const happinessImpact=afterHappiness-value; value=afterHappiness;
    const afterPollution=value*pollutionFactor;
    const pollutionImpact=afterPollution-value; value=afterPollution;
    const afterTraffic=value*trafficFactor;
    const trafficImpact=afterTraffic-value; value=afterTraffic;
    const afterEconomy=value*economyFactor;
    const economyImpact=afterEconomy-value; value=afterEconomy;
    const afterDense=value*denseFactor;
    const denseImpact=afterDense-value; value=afterDense;
    const afterCapacity=value*capacityFactor;
    const capacityImpact=afterCapacity-value; value=afterCapacity;

    return {base:stageBase,stageName:stage.name,happinessFactor,pollutionFactor,trafficFactor,economyFactor,denseFactor,capacityFactor,
      happinessImpact,pollutionImpact,trafficImpact,economyImpact,denseImpact,capacityImpact,popGrowth:value,popCap};
  },

  rates(state){
    let income=1.2, upkeep=0.4, popCap=300;
    for(const id of state.map){ if(!id)continue; const b=BUILDINGS.find(x=>x.id===id); if(!b)continue; income+=b.income||0; upkeep+=b.upkeep||0; popCap+=b.pop||0; }
    if(state.traits.includes('factory')) income*=1.10;
    if(state.traits.includes('industrialGiant')) income*=1.12;
    if(state.traits.includes('tourist')) income*=1.06;
    if(state.traits.includes('mega')) upkeep*=.95;
    for(const m of state.modifiers||[]) if(m.incomeMult) income*=m.incomeMult;
    const net=income-upkeep;
    const growth=this.growthBreakdown(state,popCap,net);
    return {income,upkeep,net,popGrowth:growth.popGrowth,popCap,growth};
  },

  applyEffects(s,e={},silent=false){
    this.ensureStatLayers(s);
    if(e.money){s.money+=e.money;if(e.money>0)s.lifetime.earned+=e.money;else s.lifetime.spent+=-e.money}
    if(e.population) s.population=Math.max(0,s.population+e.population);
    for(const k of this.statKeys) if(e[k]) s.baseStats[k]=Game.clamp((s.baseStats[k]||0)+e[k]);
    this.recalculateStats(s);
    if(!silent) UI.refreshAll();
  },

  tick(s,seconds){
    if(s.paused)return;
    this.ensureStatLayers(s);
    const r=this.rates(s), factor=seconds*(s.speed||1);
    s.money+=r.net*factor; s.lifetime.earned+=Math.max(0,r.net*factor); s.lifetime.spent+=Math.max(0,-r.net*factor);
    s.population=Math.max(0,s.population+r.popGrowth*factor);
    const density=s.population/Math.max(1,r.popCap);

    // Natural city drift belongs to the underlying stat layer. Building effects are
    // re-added afterwards from what is physically present on the map.
    s.baseStats.traffic=Game.clamp(s.baseStats.traffic+(density>.82?.018:-.006)*factor);
    s.baseStats.pollution=Game.clamp(s.baseStats.pollution-.003*factor);
    this.recalculateStats(s);
    const stress=(s.stats.traffic>70?-.006:0)+(s.stats.pollution>65?-.006:0)+(s.money<0?-.012:0);
    s.baseStats.happiness=Game.clamp(s.baseStats.happiness+stress*factor);
    this.recalculateStats(s);

    s.minutes+=factor*4;
    while(s.minutes>=1440){s.minutes-=1440;s.day++; if(s.day===7)UI.addHistory({type:'first_week'});}
    if(s.money<0)s.flags.wasBroke=true;
    s.modifiers=(s.modifiers||[]).map(m=>({...m,duration:m.duration-factor})).filter(m=>m.duration>0);
    this.checkTraits(s); this.checkAchievements(s); this.maybeEvent(s); this.maybeDecision(s);
  },

  offline(s,seconds){
    this.ensureStatLayers(s);
    const max=8*3600, used=Math.min(seconds,max), before={money:s.money,pop:s.population,stats:{...s.stats}};
    const chunks=Math.ceil(used/30); for(let i=0;i<chunks;i++) this.tick(s,Math.min(30,used-i*30));
    return {seconds:used,capped:seconds>max,money:s.money-before.money,pop:s.population-before.pop,stats:Object.fromEntries(Object.keys(s.stats).map(k=>[k,s.stats[k]-before.stats[k]]))};
  },

  maybeEvent(s){
    if(Date.now()<s.nextEventAt)return;
    s.recentEvents=s.recentEvents||[];
    s.eventBag=Array.isArray(s.eventBag)?s.eventBag:[];

    // Rotation deck: every event is seen once before any event can return.
    // When a new deck is created, the previous event is prevented from becoming first.
    const validIds=new Set(CITY_EVENTS.map(ev=>ev.id));
    s.eventBag=s.eventBag.filter(id=>validIds.has(id));
    if(!s.eventBag.length){
      const ids=CITY_EVENTS.map(ev=>ev.id);
      for(let i=ids.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[ids[i],ids[j]]=[ids[j],ids[i]];}
      if(ids.length>1&&ids[0]===s.lastEventId){const swap=1+Math.floor(Math.random()*(ids.length-1));[ids[0],ids[swap]]=[ids[swap],ids[0]];}
      s.eventBag=ids;
    }
    const nextId=s.eventBag.shift();
    const ev=CITY_EVENTS.find(item=>item.id===nextId) || CITY_EVENTS[0];
    if(!ev)return;
    s.lastEventId=ev.id;
    s.recentEvents.push(ev.id);
    s.recentEvents=s.recentEvents.slice(-8);
    this.applyEffects(s,ev.effects,true);
    s.lifetime.events++;
    const evTitle=I18N.item('events',ev.id,'title',ev.title), evText=I18N.item('events',ev.id,'text',ev.text);
    UI.addNews({type:'event_news',eventId:ev.id});
    if(['crisis','blackout','crime','fire'].includes(ev.id))UI.addHistory({type:'event_history',eventId:ev.id});
    UI.toast(evTitle,evText,'event');
    s.nextEventAt=Date.now()+180000+Math.random()*120000;
  },

  maybeDecision(s){
    s.recentDecisions=Array.isArray(s.recentDecisions)?s.recentDecisions:[];
    s.decisionUnlocksSeen=Array.isArray(s.decisionUnlocksSeen)?s.decisionUnlocksSeen:[];
    s.decisionUnlockQueue=Array.isArray(s.decisionUnlockQueue)?s.decisionUnlockQueue:[];

    // V1.3.3: population-based Mayor's Desk unlocks are now literal.
    // When Next Unlock says a policy opens at N population, crossing N queues that
    // exact policy immediately instead of waiting for the normal briefing timer.
    const newlyUnlocked=DECISIONS
      .filter(d=>s.population>=d.minPop&&!s.decisionUnlocksSeen.includes(d.id))
      .sort((a,b)=>a.minPop-b.minPop);
    for(const d of newlyUnlocked){
      s.decisionUnlocksSeen.push(d.id);
      if(!s.decisionUnlockQueue.includes(d.id))s.decisionUnlockQueue.push(d.id);
    }

    if(s.currentDecision)return;

    // Newly unlocked policies take priority and bypass the regular cooldown.
    while(s.decisionUnlockQueue.length){
      const id=s.decisionUnlockQueue.shift();
      const d=DECISIONS.find(x=>x.id===id);
      if(!d||s.population<d.minPop)continue;
      s.currentDecision=id;
      UI.renderDecision();
      return;
    }

    // V1.4: no timer-based repeat briefings. After the opening decision,
    // Mayor's Desk appears only when a new population milestone is crossed.
  },
  checkTraits(s){ for(const t of TRAITS){if(!s.traits.includes(t.id)&&t.condition(s)){s.traits.push(t.id); const tn=UI.trName(t); UI.toast(I18N.lang()==='tr'?'Şehir özelliği açıldı':'Trait unlocked',tn,'good'); UI.addHistory({type:'trait_history',traitId:t.id}); UI.addNews({type:'trait_news',traitId:t.id});}}},
  checkAchievements(s){ for(const a of ACHIEVEMENTS){if(!s.achievements.includes(a.id)&&a.test(s)){s.achievements.push(a.id); UI.toast(I18N.lang()==='tr'?'Başarı açıldı':'Achievement unlocked',UI.aName(a),'good');}}}
};
