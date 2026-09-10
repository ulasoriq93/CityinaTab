window.TRAITS = [
{id:'creative',name:'Creative City',desc:'Culture drives reputation.',condition:s=>s.stats.culture>=65,effect:'+8% reputation gains'},
{id:'factory',name:'Factory Town',desc:'Industry dominates the local economy.',condition:s=>countCat(s,'industrial')>=6,effect:'+10% industrial income'},
{id:'green',name:'Green Haven',desc:'Parks and clean air define the city.',condition:s=>s.stats.pollution<=18&&countCat(s,'green')>=5,effect:'+5 happiness baseline'},
{id:'tourist',name:'Tourist Magnet',desc:'Visitors arrive for the city itself.',condition:s=>s.stats.reputation>=70,effect:'+6% commercial income'},
{id:'night',name:'Nightlife Capital',desc:'The city never really sleeps.',condition:s=>s.flags.nightlife===true,effect:'+4 culture'},
{id:'universityTown',name:'University Town',desc:'Students reshape the city.',condition:s=>s.projects.includes('university'),effect:'+8 culture'},
{id:'spaghetti',name:'Urban Spaghetti',desc:'Growth outpaced planning.',condition:s=>s.stats.traffic>=78,effect:'Traffic events more likely'},
{id:'car',name:'Car Dependency',desc:'Wide roads, long trips, lots of cars.',condition:s=>countType(s,'road')>=18&&s.stats.traffic>=55,effect:'+3 pollution'},
{id:'culture',name:'Cultural Hub',desc:'Museums, libraries and events matter here.',condition:s=>s.stats.culture>=80,effect:'+5 happiness'},
{id:'industrialGiant',name:'Industrial Giant',desc:'Production is the city’s engine.',condition:s=>countCat(s,'industrial')>=10,effect:'+12% base income'},
{id:'safe',name:'Safe Streets',desc:'Residents trust the public realm.',condition:s=>s.stats.safety>=80,effect:'+4 happiness'},
{id:'wealthy',name:'Boomtown',desc:'Money is flowing faster than planners can spend it.',condition:s=>s.money>=250000,effect:'+4 reputation'},
{id:'dense',name:'Vertical Living',desc:'Thousands live in compact towers.',condition:s=>countType(s,'tower')>=4,effect:'+5% population growth'},
{id:'metro',name:'Transit Paradise',desc:'Fast transit changes daily life.',condition:s=>s.projects.includes('metro'),effect:'-12 traffic'},
{id:'corporate',name:'Corporate Playground',desc:'Major firms have unusual influence.',condition:s=>s.flags.corporate===true,effect:'+8% income, -2 happiness'},
{id:'water',name:'River City',desc:'The waterfront became a civic identity.',condition:s=>s.projects.includes('waterfront'),effect:'+5 reputation'},
{id:'sports',name:'Sports City',desc:'Big crowds gather under floodlights.',condition:s=>s.projects.includes('stadium'),effect:'+4 happiness'},
{id:'global',name:'Global Gateway',desc:'The city is connected to the wider world.',condition:s=>s.projects.includes('airport'),effect:'+8 reputation'},
{id:'mega',name:'Megaproject Habit',desc:'Big bets became routine.',condition:s=>s.projects.length>=4,effect:'Projects cost 5% less'}
];
function countCat(s,cat){return s.map.filter(t=>t&&BUILDINGS.find(b=>b.id===t)?.cat===cat).length}
function countType(s,id){return s.map.filter(t=>t===id).length}
