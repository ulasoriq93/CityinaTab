(function(){
  const loaded=StorageSystem.load(); Game.state=loaded||Game.newState(); const oldVersion=Game.state.version||0; const upgradingV13=oldVersion<6; const upgradingV131=oldVersion<7; const upgradingV132=oldVersion<8; const upgradingV133=oldVersion<9; const upgradingV14=oldVersion<11; const upgradingV15=oldVersion<12;
  if(!Game.state.lifetime)Game.state.lifetime={earned:0,spent:0,events:0,builds:0};
  if(!Game.state.flags)Game.state.flags={}; if(!Game.state.modifiers)Game.state.modifiers=[]; if(!Game.state.speed)Game.state.speed=1; if(!Game.state.recentEvents)Game.state.recentEvents=[]; if(!Array.isArray(Game.state.eventBag))Game.state.eventBag=[]; if(typeof Game.state.lastEventId==='undefined')Game.state.lastEventId=Game.state.recentEvents.at(-1)||null; if(!Array.isArray(Game.state.recentDecisions))Game.state.recentDecisions=[]; if(!Array.isArray(Game.state.decisionUnlocksSeen))Game.state.decisionUnlocksSeen=DECISIONS.filter(d=>Game.state.population>=d.minPop).map(d=>d.id); if(!Array.isArray(Game.state.decisionUnlockQueue))Game.state.decisionUnlockQueue=[]; if(typeof Game.state.landExpansions!=='number')Game.state.landExpansions=Math.max(0,Math.ceil(((Game.state.mapSize||16)-16)/4)); if(!Game.state.nextEventAt||Game.state.nextEventAt<Date.now()-600000)Game.state.nextEventAt=Date.now()+120000; if(upgradingV13){Game.state.nextEventAt=Math.max(Game.state.nextEventAt||0,Date.now()+150000);} if(upgradingV14){
    // Timer-based Mayor's Desk is retired in V1.4. Existing cities keep their
    // current briefing if one is already open, but past population milestones
    // are marked as handled so migration never dumps old policies on the player.
    Game.state.decisionUnlocksSeen=Array.from(new Set([...(Game.state.decisionUnlocksSeen||[]),...DECISIONS.filter(d=>Game.state.population>=d.minPop).map(d=>d.id)]));
    Game.state.decisionUnlockQueue=[];
    Game.state.nextDecisionAt=null;
    Game.state.version=11;
  } else if(upgradingV133)Game.state.version=9;
  if(upgradingV15){
    // Preserve old cities without replaying every historical policy. Completed
    // decisions stay completed; policies below the migration population are
    // grandfathered, except the new 8k policy for cities currently in that band.
    Game.state.decisionHistory=Array.from(new Set([...(Game.state.decisionHistory||[]),...(Game.state.recentDecisions||[])]));
    const pop=Game.state.population||0;
    Game.state.decisionGrandfathered=DECISIONS.filter(d=>d.minPop<=pop&&!Game.state.decisionHistory.includes(d.id)&&d.id!=='housingScale').map(d=>d.id);
    if(pop>=10000&&!Game.state.decisionHistory.includes('housingScale'))Game.state.decisionGrandfathered.push('housingScale');
    Game.state.decisionUnlockQueue=(Game.state.decisionUnlockQueue||[]).filter(id=>!Game.state.decisionGrandfathered.includes(id));
    Game.state.nextDecisionAt=null;Game.state.version=12;
  }
  Game.state.version=Game.VERSION;
  if(!Game.state.settings)Game.state.settings={sound:false,reducedMotion:false,mapView:'normal'}; if(!Game.state.settings.mapView)Game.state.settings.mapView='normal'; if(!Game.state.settings.language)Game.state.settings.language=localStorage.getItem('cityInATabLang')||'en'; localStorage.setItem('cityInATabLang',Game.state.settings.language); MapSystem.ensureMinimumSize(16); Sim.ensureStatLayers(Game.state,{repairLegacyGhosts:!!loaded&&upgradingV132});
  document.getElementById('cityNameLabel').textContent=Game.state.cityName;
  UI.init(); MapSystem.render(); window.addEventListener('resize',()=>{if(Game.state.settings?.mapView==='fit')MapSystem.applyViewMode();});
  const away=Math.max(0,(Date.now()-(Game.state.lastTick||Date.now()))/1000); if(loaded&&away>15){const report=Sim.offline(Game.state,away);MapSystem.expandIfNeeded();MapSystem.render();UI.refreshAll();setTimeout(()=>UI.showOffline(report),150)}
  Game.state.lastTick=Date.now();
  let uiTimer=0;
  function advanceToNow(){
    const now=Date.now(), last=Game.state.lastTick||now;
    const elapsed=Math.max(0,(now-last)/1000);
    if(elapsed<=0)return 0;
    if(!Game.state.paused){
      if(elapsed>2) Sim.offline(Game.state,elapsed);
      else Sim.tick(Game.state,elapsed);
    }
    Game.state.lastTick=now;
    return elapsed;
  }
  function loop(){
    const dt=advanceToNow();
    uiTimer+=Math.min(dt,.5);
    if(uiTimer>=.5){MapSystem.expandIfNeeded();UI.refreshAll();uiTimer=0}
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  document.addEventListener('visibilitychange',()=>{
    advanceToNow();
    if(document.visibilityState==='hidden') StorageSystem.save(Game.state);
    else {MapSystem.expandIfNeeded();MapSystem.render();UI.refreshAll();}
  });
  setInterval(()=>{advanceToNow();StorageSystem.save(Game.state)},10000);
  window.addEventListener('beforeunload',()=>{advanceToNow();StorageSystem.save(Game.state)});
  if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js',{updateViaCache:'none'}).then(r=>r.update()).catch(console.warn));
})();
