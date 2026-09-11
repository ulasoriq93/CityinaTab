window.DECISIONS = [
{id:'parkParking',title:'A Vacant Downtown Lot',text:'Residents want a park. Shop owners want parking.',minPop:150,choices:[
 {label:'Build the park',effects:{money:-600,happiness:6,pollution:-3,culture:1},news:'Council approves a new downtown park.'},
 {label:'Build parking',effects:{money:-350,traffic:-5,happiness:-1,pollution:2},news:'New parking opens beside the shopping street.'}]},
{id:'transitBudget',title:'The Bus Budget',text:'Transit staff want direction before the next service plan.',minPop:200,choices:[
 {label:'Increase service',effects:{money:-500,traffic:-3,happiness:2,reputation:1},news:'Bus frequency increases across the growing settlement.'},
 {label:'Hold the line',effects:{money:-100,happiness:1},news:'Transit service stays at its current level.'},
 {label:'Trim service',effects:{money:650,traffic:4,happiness:-3},news:'The city trims bus service to save money.'}]},
{id:'smallBusiness',title:'Main Street Needs a Push',text:'Local shopkeepers ask city hall for help filling empty storefronts.',minPop:220,choices:[
 {label:'Offer small grants',effects:{money:-450,happiness:2,reputation:2},timed:{incomeMult:1.05,duration:120},news:'Small-business grants bring new life to Main Street.'},
 {label:'Fast-track permits',effects:{money:250,traffic:1,reputation:1},news:'City hall fast-tracks permits for local businesses.'},
 {label:'Stay hands-off',effects:{money:100},news:'The city leaves Main Street to the market.'}]},
{id:'tax',title:'Budget Pressure',text:'The finance office asks for a tax policy.',minPop:250,choices:[
 {label:'Raise taxes',effects:{money:1800,happiness:-5,reputation:-1},timed:{incomeMult:1.12,duration:120},news:'City raises taxes to stabilize finances.'},
 {label:'Keep rates',effects:{happiness:1},news:'Tax rates remain unchanged.'},
 {label:'Cut taxes',effects:{money:-900,happiness:4,reputation:2},timed:{incomeMult:0.92,duration:120},news:'City announces a temporary tax cut.'}]},
{id:'recycling',title:'Waste Is Piling Up',text:'Sanitation crews propose a citywide recycling policy.',minPop:300,choices:[
 {label:'Make recycling standard',effects:{money:-350,pollution:-4,happiness:1,reputation:2},news:'A citywide recycling standard takes effect.'},
 {label:'Run a voluntary campaign',effects:{money:-150,pollution:-2,reputation:1},news:'Residents join a voluntary recycling campaign.'},
 {label:'Delay the program',effects:{money:150,pollution:1},news:'The recycling proposal is delayed for another budget cycle.'}]},
{id:'streetUpgrade',title:'One Street, Two Priorities',text:'A worn residential street can receive one major upgrade this year.',minPop:450,choices:[
 {label:'Plant street trees',effects:{money:-550,pollution:-3,happiness:3},news:'New street trees shade a growing residential block.'},
 {label:'Improve lighting',effects:{money:-450,safety:4,happiness:1},news:'New lighting makes neighborhood streets feel safer at night.'},
 {label:'Basic repairs only',effects:{money:-150,traffic:-1},news:'Crews complete basic repairs without a major redesign.'}]},
{id:'rent',title:'Rents Are Rising',text:'Growth is pushing housing costs upward faster than expected.',minPop:600,choices:[
 {label:'Protect tenants',effects:{money:-300,happiness:4,reputation:2},timed:{incomeMult:.98,duration:120},news:'New tenant protections calm fears over rising rents.'},
 {label:'Reward new construction',effects:{money:900,population:60,traffic:2,happiness:-2},news:'Developer incentives trigger a burst of new housing activity.'},
 {label:'Let the market adjust',effects:{reputation:-1},news:'City hall declines to intervene in the housing market.'}]},
{id:'cultureFund',title:'A Small Cultural Fund',text:'Artists and venue owners pitch a modest city culture program.',minPop:700,choices:[
 {label:'Fund local arts',effects:{money:-700,culture:6,happiness:2,reputation:2},news:'Local artists receive the city’s first cultural grants.'},
 {label:'Back public events',effects:{money:-350,culture:3,happiness:2,reputation:2,traffic:1},news:'The city shifts its culture budget toward public events.'},
 {label:'Skip it this year',effects:{money:200,culture:-1},news:'The cultural fund is left out of this year’s budget.'}]},
{id:'delivery',title:'Delivery Trucks Everywhere',text:'Freight traffic is starting to clog the busiest commercial streets.',minPop:800,choices:[
 {label:'Set delivery windows',effects:{money:-250,traffic:-4,happiness:1},news:'New delivery windows reduce daytime freight congestion.'},
 {label:'Keep access unrestricted',effects:{money:500,traffic:4,pollution:2},news:'Commercial deliveries remain unrestricted around the clock.'},
 {label:'Create low-emission zones',effects:{money:-750,traffic:-1,pollution:-4,reputation:3},news:'Low-emission freight rules arrive in the city center.'}]},
{id:'industry',title:'Industrial Expansion Request',text:'Developers ask to rezone land for heavy industry.',minPop:900,choices:[
 {label:'Approve it',effects:{money:1400,pollution:7,traffic:4,reputation:1},news:'Industrial expansion receives approval.'},
 {label:'Demand cleaner plans',effects:{money:-500,pollution:-2,reputation:3},news:'City demands cleaner industrial standards.'}]},
{id:'schools',title:'Crowded Classrooms',text:'The first wave of young families is putting pressure on local schools.',minPop:950,choices:[
 {label:'Expand school capacity',effects:{money:-1100,happiness:4,culture:3,reputation:2},news:'New classrooms open across the city.'},
 {label:'Use temporary classrooms',effects:{money:-350,happiness:1,culture:1},news:'Temporary classrooms relieve the worst school crowding.'},
 {label:'Defer expansion',effects:{money:300,happiness:-3,reputation:-1},news:'School expansion is deferred despite growing enrollment.'}]},
{id:'tourism',title:'Put the City on the Map?',text:'The tourism office wants a campaign aimed at weekend visitors.',minPop:1200,choices:[
 {label:'Launch the campaign',effects:{money:-900,reputation:6,traffic:3,culture:2},news:'A new tourism campaign begins promoting the city regionally.'},
 {label:'Focus on locals',effects:{money:-300,happiness:3,culture:2},news:'City marketing shifts toward events for local residents.'},
 {label:'Save the money',effects:{money:350,reputation:-1},news:'The tourism campaign is shelved to protect the budget.'}]},
{id:'nightlife',title:'After Midnight',text:'Businesses ask for later closing hours.',minPop:1500,choices:[
 {label:'Let the city stay up',effects:{money:900,happiness:5,culture:4,safety:-3,traffic:2},news:'Nightlife rules relaxed across the center.'},
 {label:'Keep current hours',effects:{safety:2,happiness:-1},news:'Closing hours stay unchanged.'}]},
{id:'zoning',title:'How Dense Should We Grow?',text:'Planners need a zoning direction for the next wave of development.',minPop:1800,choices:[
 {label:'Encourage mixed-use blocks',effects:{money:-800,population:120,traffic:-2,happiness:2,culture:1},news:'Mixed-use zoning is approved for several growing corridors.'},
 {label:'Protect low-density areas',effects:{money:-250,traffic:-3,happiness:2,population:-30},news:'Low-density protections limit redevelopment in quieter districts.'},
 {label:'Prioritize rapid growth',effects:{money:1300,population:120,traffic:5,pollution:2,happiness:-2},news:'Planning rules are loosened to accelerate development.'}]},
{id:'publicSafety',title:'Safety Strategy',text:'The police chief presents three ways to handle a growing city.',minPop:2500,choices:[
 {label:'Community patrols',effects:{money:-750,safety:5,happiness:2,reputation:1},news:'Community patrols expand across busy neighborhoods.'},
 {label:'Install more cameras',effects:{money:-500,safety:7,reputation:-2},news:'A new camera network expands downtown surveillance.'},
 {label:'Keep staffing steady',effects:{money:250,safety:-2},news:'Public-safety staffing remains unchanged this year.'}]},
{id:'company',title:'Big Company, Big Ask',text:'A major employer wants a tax break to relocate here.',minPop:3000,choices:[
 {label:'Give the break',effects:{money:-1400,reputation:7,traffic:3},timed:{incomeMult:1.18,duration:180},news:'Major employer confirms its move to the city.'},
 {label:'No special treatment',effects:{happiness:2,reputation:-1},news:'Council rejects a corporate tax break.'}]},
{id:'energy',title:'Powering the Next Stage',text:'Utilities need an energy strategy before demand grows again.',minPop:4000,choices:[
 {label:'Subsidize solar roofs',effects:{money:-1600,pollution:-5,reputation:4,happiness:1},news:'Solar-roof subsidies spread across homes and businesses.'},
 {label:'Build backup generation',effects:{money:-800,safety:3,pollution:3},news:'New backup generation improves grid reliability.'},
 {label:'Delay major investment',effects:{money:400,reputation:-1},news:'Major energy investment is postponed.'}]},
{id:'heritage',title:'Old Quarter at Risk',text:'A historic block could become high-value development.',minPop:5000,choices:[
 {label:'Protect it',effects:{money:-1100,culture:8,happiness:3,reputation:5},news:'Old Quarter receives protected status.'},
 {label:'Redevelop it',effects:{money:3000,culture:-6,traffic:3,reputation:-2},news:'Historic block cleared for redevelopment.'}]},
{id:'cars',title:'Congested Crossroads',text:'Traffic engineers offer two very different fixes.',minPop:7000,choices:[
 {label:'Widen roads',effects:{money:-1600,traffic:-7,pollution:4,happiness:-1},news:'Road widening project begins.'},
 {label:'Bus lanes',effects:{money:-2200,traffic:-4,pollution:-3,happiness:3,reputation:2},news:'Dedicated bus lanes open on main avenues.'}]},
{id:'university',title:'A University Proposal',text:'Educators propose a public university campus.',minPop:10000,choices:[
 {label:'Fund it',effects:{money:-6500,culture:12,happiness:5,reputation:8,population:500},news:'City University welcomes its first students.'},
 {label:'Too expensive',effects:{money:500,happiness:-2,culture:-2},news:'University plan is postponed.'}]},
{id:'metro',title:'Underground Ambition',text:'Should the city commit to early metro planning?',minPop:20000,choices:[
 {label:'Start planning',effects:{money:-9000,traffic:-10,pollution:-3,reputation:8},news:'Metro planning office officially opens.'},
 {label:'Stay with buses',effects:{money:800,traffic:2},news:'City delays metro planning.'}]},
{id:'waterfront',title:'The Riverfront Question',text:'Old warehouses line the river. What should replace them?',minPop:30000,choices:[
 {label:'Public waterfront',effects:{money:-5000,happiness:9,culture:6,reputation:7,pollution:-4},news:'Public waterfront plan wins approval.'},
 {label:'Luxury development',effects:{money:7500,happiness:-4,reputation:3,traffic:4},news:'Luxury towers planned along the river.'}]}
];
