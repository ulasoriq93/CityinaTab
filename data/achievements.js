window.ACHIEVEMENTS = [
{id:'pop1k',name:'Four Digits',desc:'Reach 1,000 population.',test:s=>s.population>=1000},
{id:'pop10k',name:'Real City',desc:'Reach 10,000 population.',test:s=>s.population>=10000},
{id:'pop100k',name:'Concrete Ocean',desc:'Reach 100,000 population.',test:s=>s.population>=100000},
{id:'million',name:'Municipal Millionaire',desc:'Hold $1,000,000.',test:s=>s.money>=1000000},
{id:'happy90',name:'Beloved Mayor',desc:'Reach 90 happiness.',test:s=>s.stats.happiness>=90},
{id:'traffic90',name:'Gridlock!',desc:'Reach 90 traffic.',test:s=>s.stats.traffic>=90},
{id:'clean',name:'Fresh Air',desc:'Keep pollution below 10 with 5,000+ people.',test:s=>s.population>=5000&&s.stats.pollution<10},
{id:'trait',name:'A City With Character',desc:'Unlock a city trait.',test:s=>s.traits.length>=1},
{id:'traits5',name:'Identity Crisis',desc:'Unlock five traits.',test:s=>s.traits.length>=5},
{id:'mega',name:'Think Big',desc:'Complete a mega project.',test:s=>s.projects.length>=1},
{id:'mega4',name:'Monumental',desc:'Complete four mega projects.',test:s=>s.projects.length>=4},
{id:'week',name:'One Week Later',desc:'Reach Day 7.',test:s=>s.day>=7},
{id:'month',name:'City Hall Veteran',desc:'Reach Day 30.',test:s=>s.day>=30},
{id:'survivor',name:'Bounce Back',desc:'Recover above $10,000 after going negative.',test:s=>s.flags.wasBroke&&s.money>10000},
{id:'builder',name:'Urban Fabric',desc:'Place 50 structures.',test:s=>s.map.filter(Boolean).length>=50}
];
