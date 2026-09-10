window.Game = window.Game || {};
Game.VERSION = 10;
Game.STAGES = [
  {name:'Settlement',pop:0,next:1000},{name:'Town',pop:1000,next:5000},{name:'Small City',pop:5000,next:15000},
  {name:'Regional City',pop:15000,next:50000},{name:'Metropolis',pop:50000,next:150000},{name:'Megacity',pop:150000,next:Infinity}
];
Game.newState = function(){
  const size = 16, map = Array(size*size).fill(null);
  const center = Math.floor(size/2);
  const put=(x,y,id)=>map[y*size+x]=id;
  put(center,center,'road'); put(center-1,center,'road'); put(center+1,center,'road');
  put(center-1,center-1,'house'); put(center+1,center-1,'house'); put(center-1,center+1,'shops'); put(center+1,center+1,'workshop');
  return {
    version:Game.VERSION, cityName:'New Pixelton', createdAt:Date.now(), lastSaved:Date.now(), lastTick:Date.now(),
    money:2800,population:180,day:1,minutes:8*60,paused:false,speed:1,mapSize:size,map,
    stats:{happiness:62,traffic:16,pollution:9,culture:8,safety:58,reputation:5},
    news:[{t:Date.now(),type:'foundation_news'}],history:[{t:Date.now(),type:'foundation_history'}],
    traits:[],achievements:[],projects:[], flags:{}, modifiers:[], currentDecision:null,
    nextDecisionAt:Date.now()+45000,nextEventAt:Date.now()+180000,recentEvents:[],eventBag:[],lastEventId:null,recentDecisions:[],decisionUnlocksSeen:DECISIONS.filter(d=>180>=d.minPop).map(d=>d.id),decisionUnlockQueue:[],landExpansions:0, selectedBuild:null, bulldoze:false,
    settings:{sound:false,reducedMotion:false,language:(localStorage.getItem('cityInATabLang')||'en')}, lifetime:{earned:0,spent:0,events:0,builds:4}
  };
};
Game.clamp=(v,min=0,max=100)=>Math.max(min,Math.min(max,v));
Game.stageFor=s=>[...Game.STAGES].reverse().find(x=>s.population>=x.pop)||Game.STAGES[0];
