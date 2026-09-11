(function(){
  const loaded=StorageSystem.load(); Game.state=loaded||Game.newState(); const oldVersion=Game.state.version||0; const upgradingV13=oldVersion<6; const upgradingV131=oldVersion<7; const upgradingV132=oldVersion<8; const upgradingV133=oldVersion<9; const upgradingV14=oldVersion<11;
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
  if(!Game.state.settings)Game.state.settings={sound:false,reducedMotion:false}; if(!Game.state.settings.language)Game.state.settings.language=localStorage.getItem('cityInATabLang')||'en'; localStorage.setItem('cityInATabLang',Game.state.settings.language); MapSystem.ensureMinimumSize(16); Sim.ensureStatLayers(Game.state,{repairLegacyGhosts:!!loaded&&upgradingV132});
  document.getElementById('cityNameLabel').textContent=Game.state.cityName;
  UI.init(); MapSystem.render();
  const away=Math.max(0,(Date.now()-(Game.state.lastTick||Date.now()))/1000); if(loaded&&away>15){const report=Sim.offline(Game.state,away);MapSystem.expandIfNeeded();MapSystem.render();UI.refreshAll();setTimeout(()=>UI.showOffline(report),150)}
  Game.state.lastTick=Date.now();
  let prev=performance.now(), uiTimer=0;
  function loop(now){const dt=Math.min(2,(now-prev)/1000);prev=now;Sim.tick(Game.state,dt);Game.state.lastTick=Date.now();uiTimer+=dt;if(uiTimer>.5){MapSystem.expandIfNeeded();UI.refreshAll();uiTimer=0}requestAnimationFrame(loop)} requestAnimationFrame(loop);
  setInterval(()=>StorageSystem.save(Game.state),10000);
  window.addEventListener('beforeunload',()=>{Game.state.lastTick=Date.now();StorageSystem.save(Game.state)});
  if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js',{updateViaCache:'none'}).then(r=>r.update()).catch(console.warn));
})();
