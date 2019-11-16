# Developer Docs

BrowserGM is a project made with Vue.js.

This documentation contains descriptions of the website structure, classes, global variables, and global methods.

# Structure

#### npm

npm is used in development but not production, the following plugins are used:

<u>babel</u> Used for the ability to write ES6.

<u>browserify</u> Compiles all imports/exports into one file, bundle.js.

<u>http-server</u> Runs a local server.

Below are the custom scripts run with > npm run 'script':

<u>compile</u> Compiles all JavaScript files into one bundle.js

<u>server</u> Runs a server.

<u>build-all</u> Compiles files then runs the server.

#### Folder Structure

```
dist/
	bundle.js
node_modules/
src/
	classes/
	components/
	images/
	pages/
	scripts/
	styles/
.babelrc
package.json
packag-lock.json
```

<u>dist/</u> Contains the bundle.js game file which is the compiled version of all JavaScript files in 'src/'.

<u>src/classes/</u> Contains separate files for each class.

<u>src/components/</u> Contains files of components separated by category.

<u>src/images/</u> Contains any website images, mainly player faces.

<u>src/pages/</u> Contains all HTML files as well as .md versions of the documentation.

<u>src/scripts/</u> Contains files of global methods separated by category.

<u>src/styles/</u> Contains CSS files for the game and documentation

# Classes

## Player

```
Player = {
	age: Integer,
	attributes: {
		blocking: Integer,
		diq: Integer,			// defensive iq
		discipline: Integer,
		faceOff: Integer,
		handEye: Integer,
		hands: Integer,
		hitting: Integer,
		hustle: Integer,
		oiq: Integer,			// offensive iq
		passing: Integer,
		skating: Integer,
		slap: Integer,			// slap shot
		stamina: Integer,
		stick: Integer,			// stick work (defensively)
		strength: Integer,
		wrist: Integer			// wrist shot
	},
	contract: { cap: Float, years: Integer },
	country: String,
	face: Integer,
	fullName: String,
	id: Integer,
	league: String,
	newContract: { cap: Float, years: Integer },
	position: String,
	positionStrength: {
		lw: Float,
		c: Float
         rw: Float,
         ld: Float,
         rd: Float
        },
   	potential: {
       ceiling: {int: Integer, name: String, shownInt: Integer, shownName: String},
       chance:  {int: Integer, name: String, shownInt: Integer, shownName: String},
       certainty: {int: Integer, name: String}
    },
    progression: {same as attributes},
    stats: { 
    	2020: { // Skater
    		assists: Integer,
    		gamesPlayed: Integer,
    		goals: Integer,
    		pim: Integer,		// penalty minutes
    		points: Integer,
    		shots: Integer,
    		toi: Integer,		// time on ice
    	}
    	2019: { // Goalie
    		gaa: Float,			// goals against average
        	gamesPlayed: Integer,
            goalsAgainst: Integer,
            savePctg: Float,
            saves: Integer,
            toi: Integer
    	},
    	...
    },
    team: Team.id
}
```

#### age

The player's age. All players age on the same day when seasons change on July 1st.

#### attributes

Attributes determine a player's effectiveness in game, each attribute is weighted by position for it's contribution to the player's effectiveness. The weighting is done by **Player.categoryScores()**.

#### contract

The player's current contract. If a player is not signed with a team their contract is {cap: 0, years: 0}.

#### face

The id of the player's face image. All faces can be found in 'images/players'.

#### fullName

The player's full name. Derivatives like last or first name can be retrieved with **Player.name()**.

#### id

The player's randomly generated id. The id ranges from 10 9999999, they numbers no significance.

#### league

The player's current league. Can be one of: 'onehl', 'twohl', 'thrhl', 'juniors', 'prospects', 'freeAgents'.

#### newContract

If a player has signed an extension in the last year of their contract,  then newContract is their extension. If no extension has been signed newContract is an empty object.

#### position

The player's position, can be one of: 'lw', 'c', 'rw', 'ld', 'rd', 'g'.

#### positionStrength

Indicates a multiplier of player effectiveness when playing a position that isn't their main one.

#### potential

Ceiling is the maximum overall the player can attain. Chance is the probability of a player's ceiling being achievable, an actual ceiling is calculated based on chance in **playerProgression()**. Certainty is the user's certainty in a player's ceiling and potential when they are a prospect, this is based on scouting.

#### progression

Tracks the amount a player has progressed or regressed in each attribute since the start of the season.

#### stats

Each year of a player's stats is tracked up to 4 years.

#### team

The player's current team's id. If the player is a free agent the team is 0, if the player is a prospect the team is the team's region.

#### Player.categoryScores()

Returns a defensive and offensive player score to demonstrate the player's effectiveness in each category. Attributes are weighted on a scale of 1 or act as multipliers, a perfect score is 100 in a category.

Defence Score

| Attribute | Left Wing | Center | Right Wing | Left Defence | Right Defence |
| :-------: | :-------: | :----: | :--------: | :----------: | :-----------: |
| blocking  |   0.25    |  0.25  |    0.25    |     0.20     |     0.20      |
|    diq    |   0.35    |  0.35  |    0.35    |     0.35     |     0.35      |
|  hitting  |   0.10    |  0.10  |    0.10    |     0.20     |     0.20      |
|  handEye  |   0.10    |  0.10  |    0.10    |     0.10     |     0.10      |
|   stick   |   0.30    |  0.30  |    0.30    |     0.25     |     0.25      |

Offence Score

| Attribute | Left Wing | Center | Right Wing | Left Defence | Right Defence |
| :-------: | :-------: | :----: | :--------: | :----------: | :-----------: |
|  handEye  |   0.10    |  0.10  |    0.10    |     0.10     |     0.10      |
|   hands   |   0.20    |  0.20  |    0.20    |     0.15     |     0.15      |
|    oiq    |   0.30    |  0.40  |    0.30    |     0.40     |     0.40      |
|   slap    |   0.15    |  0.10  |    0.15    |     0.25     |     0.25      |
|   wrist   |   0.35    |  0.30  |    0.35    |     0.10     |     0.10      |

Multipliers

| Attribute |  Multiple   |
| :-------: | :---------: |
|  hustle   |  0.95 1.05  |
|  passing  |   0.9 1.1   |
|  skating  | 0.875 1.125 |
| strength  |  0.95 1.05  |

<u>returns</u> {offence: Integer, defence: Integer}

#### Player.desiredContract()

Generates what contract the player would like to receive.

<u>returns</u> {cap: Float, years: Integer}

#### Player.generateAge()

On player creation, this generates a player age based on the player type.

<u>returns</u> Integer

#### Player.generateAttributes()

On player creation, this generates the player's starting attributes based on player type.

<u>returns</u> attributes object

#### Player.generateContract()

On player creation, this generates the player's contract based on **Player.desiredContract()** which is then slightly altered.

<u>returns</u> {cap: Float, years: Integer}

#### Player.generateCountry()

On player creation, this generates the player's country. If the player is a prospect, the country is based on their team's region.

<u>returns</u> String

#### Player.generateName()

On player creation, this generates the player's name. Names combinations are based on NHL players.

<u>returns</u> String

#### Player.generatePosition()

On player creation, generates the player's position if not already specified.

<u>returns</u> String

#### Player.generatePotential()

On player creation, generates the player's potential based on type.

<u>returns</u> potential object

#### Player.generateProgression()

On player creation, generates the player's progression of attributes, all values will be 0.

<u>returns</u> attribute object

#### Player.generateProgression()

On player creation, generates the player's stats for the season, all values will be 0's.

<u>returns</u> stats object

#### Player.name()

Based on the player's name, produce their first name, last name, an abbreviated name (First Last -> F. Last)

<u>returns</u> {abb: String, first: String, last: String}

#### Player.overall()

Produces an overall player score. This based on the offence and defence scores of **Player.categoryScores()**, which are then weighted by position.

|        Position        | Offence | Defence |
| :--------------------: | :-----: | :-----: |
|         Center         |   0.7   |   0.3   |
| Left Wing / Right Wing |   0.8   |   0.2   |
|        Defence         |   0.2   |   0.8   |
|         Goalie         |    0    |    1    |

<u>returns</u> Integer

#### Player.playerId()

On player creation, generates an unused player id.

<u>returns</u> Integer

#### Player.positionStrength()

Produces a multiplier of player effectiveness when playing a position that isn't their main one.

<u>returns</u> positionStrength object

#### Player.release()

Releases a player from their current team and adds them to free agency.

#### Player.removeFromLines()

Removes a player from all of their team's lines. This is used when a player is traded or going to free agency.

#### Player.retire()

Removes the player entirely from the game.

#### Player.seedRnd(low: Integer, high : Integer, num : Integer)

Same as **rnd()** which generates a random number between high and low. Using the same num for a specific player will produce the same random number for the span of a season. This is used for example in **desiredContract()** to add variance in contracts that stay the same over the course of the year.

<u>low</u> Lower end of the inclusive random range.

<u>high</u> Upper end of the inclusive random range.

<u>num</u> The random seed.

<u>returns</u> Integer

#### Player.switchTeam(team : Team.id)

Switches the player's team to a new one and deals with all related processes.

<u>team</u> The new team the player is going to.

#### Player.teamName()

Produces the player's team's name.

<u>returns</u> {city: String, logo: String, full: String, abb: String}

#### Player.tradeValue()

Generates a player's trade value based on contract, overall, potential, age, and other factors.

<u>returns</u> Integer

## Team

```
Team = {
	id: Integer,
	juniors: [Player.id,  ...],
	league: String,
	lines: {
		g: [Player.id, Player.id],
		specialTeams: {
			pk: [Player.id, ...],
			pp: [Player.id, ...]
		},
		v33: {
			c:  [Player.id, ...],
			ld: [Player.id, ...],
			lw: [Player.id, ...],
			rd: [Player.id, ...],
			rw: [Player.id, ...]
		},
		v34: {...},
		v35: {...},
		v43: {...},
		v44: {...},
		v45: {...},
		v53: {...},
		v54: {...},
		v55: {...}
	},
	name: {
		abb: String,
		city: String,
		full: String,
		logo: String
	},
	outlook: String,
	picks: {
		2020: [{player: any, position: any, round: Integer, team: Team.id}, {...}, ...],
		2021: [...],
		2022: [...]
	},
	players: [Player.id, ...],
	stats: {
		fol: Integer,			// face off wins
		fow: Integer,			// face off losses
		gamesPlayed: Integer,
		goalsAgainst: Integer,
		goalsFor: Integer,
		losses: Integer,
		otl: Integer,			// overtime losses
		otw: Integer,			// overtime wins
		pkTime: Integer,
		pkga: Integer,			// penalty kill goals against
		pkgf: Integer,			// penalty kill goals for
		pks: Integer,
		ppTime: Integer,
		ppga: Integer,			// power play goals against
		ppgf: Integer,			// power play goals for
		pps: Integer,
		saves: Integer,
		shots: Integer,
		sol: Integer,			// shootout losses
		sow: Integer,			// shootout wins
		wins: Integer
	}
}
```

#### id

A three digit long id. The first digit signifies the team's league: 1 1HL, 2 2HL, 3 3HL. The last two range from 00 31, teams with the same last two digits are affiliates.

#### juniors

An array of the team's players that are currently in juniors. Only applies to teams in the 1HL.

#### league

The league the team is playing in, one of: 'onehl', 'twohl', 'thrhl'.

#### lines

<u>g</u> The team's two goalies, the first being the starter.

<u>specialTeams</u> An array of the players selected to be on the penalty kill and power play

<u>v55, vXY, ...</u> Lines for the given strength. X is the amount of players on the ice for the given team, Y is for the number of players of the opponent. Each position has an array of Player.ids, the position of the id in the array signifies which line the player is on. An id of 0 represents an empty slot, not a player.

#### name

<u>abb</u> The team's abbreviation, ex: 'SEA'

<u>city</u> The team's city, ex: 'Seattle'

<u>full</u> The team's city and logo, ex: 'Seattle Battle Cattle'

<u>logo</u> The team's logo/name, ex: 'Battle Cattle'

#### outlook

The team's goal when making trades and roster moves. Not yet used.

#### picks

An array of the team's draft picks for the current draft and the next two.

<u>player</u> The id of the player selected with the pick, false if no player is selected.

<u>position</u> The position of the draft pick in the draft (ex: #143), this is null before the draft since it's based on team standings at the end of the year.

<u>round</u> The round of the draft pick.

<u>team</u> The pick's original team, this is used to decide the pick position.

#### players

An array of all the ids of players on the team.

#### stats

Team statistics for the current season.

#### Team.addPlayers(players : any)

Adds the given players to the team's player list.

<u>players</u> Either an array of player ids or a single player id.

#### Team.allPlayers(juniors : Boolean)

Produces an array of all players from the current team and affiliate teams.

<u>juniors</u> If true, players in junior are included.

<u>returns</u> array of Player.ids

#### Team.capSpent(left : Boolean)

Produce the team's cap expenditure relative to the current salary cap.

<u>left</u> If true, produces the cap left to spend. If false, produces the cap already spent.

<u>returns</u> Float

#### Team.changePicks(action : String, pick: Object)

Adds or removes the given pick from the team.

<u>action</u> One of: 'add' or 'remove'.

<u>pick</u> The pick object being moved, {player: any, position: any, round: Integer, team: Team.id}.

#### Team.checkLineValidity()

Checks if the team's lines are valid. Used to stop simulation until the user fixes their lines.

<u>returns</u> Boolean, true if lines are valid.

#### Team.extendAll()

Before the end of a season, this extends contracts of desirable players with expiring contracts.

#### Team.farmTeam(league : Team.league)

Produces the affiliate team from the given league.

<u>league</u> One of: 'onehl', 'twohl', 'thrhl'.

#### Team.generateLines(custom : any, specialTeams : any, goalies: any)

Generates all lines with the given customization. If any parameters are false, the parameter will automatically be set.

<u>custom</u> An object containing the desired 5v5 lines.

<u>specialTeams</u> Array of skater ids that will play on the powerplay and penalty kill. 

<u>goalies</u> Array of desired goalie ids in starting order.

#### Team.generateName()

Generate the team's name on creation.

<u>returns</u> name Object

#### Team.generateOutlook()

Generates the team's goal when making trades and roster decisions, currently unused.

#### Team.overall()

Produces the team's overall for their forwards, defence, and goalies, display on roster page.

<u>returns</u> {forwards: Integer, defence: Integer, goalies: Integer}

#### Team.playerInterest(id : Player.id)

Produce and adjusted player trade value based on how the player fits with the team's outlook. Currently unused.

#### Team.playerPositionSummary()

Produces the amount of players the team and its affiliates have in every position, has category 'all' which is all players, and category 'cap' which is players with a contract above minimum.

<u>returns</u> {all: { lw: Integer, c: Integer, rw: Integer, ld: Integer, rd: Integer g: Integer}, cap: {...}}

#### Team.points()

Produces the amount of standings points the team has this season.

<u>returns</u> Integer

#### Team.rank(stat : String, suffix : Boolean)

Produces the team's league wide rank in the given stat.

<u>stat</u> Any stat in Team.stats

<u>suffix</u> If true will add a suffix like 'th' to the end of the rank.

<u>returns</u> String

#### Team.removePlayers(players : any)

Removes the given players to the team's player list.

<u>players</u> Either an array of player ids or a single player id.

#### Team.sortRoster()

Moves players between team affiliates, and calls players up from juniors as is seen fit.

#### Team.topPlayer(stat : String)

Produces the player with the highest value in the given stat on the team, used on the home page.

<u>returns</u> {name : Player.fullName, value: Integer or Float, id: Player.id}

## Game

```
Game = {
	away: Team.id,
	date: {day: Integer, month: integer, year: integer},
	home: Team.id,
	id: Integer,
	league: Team.league,
	stats: {
		away: {
            fol: Integer,			// face off wins
            fow: Integer,			// face off losses
            pkTime: Integer,
            pkga: Integer,			// penalty kill goals against
            pkgf: Integer,			// penalty kill goals for
            pks: Integer,
            ppTime: Integer,
            ppga: Integer,			// power play goals against
            ppgf: Integer,			// power play goals for
            pps: Integer,
            saves: Integer,
            shots: Integer,
		},
		home: {...}
	},
	summary: {
		extraTime: any,
		goals: [{time: Integer, 
				points: [Player.id, Player.id, Player.id],
				strength: String}, 
				{...}],
		penalties:  [{time: Integer, id: Player.id},
					{...}]
	},
	type: String
}
```

#### away

The away team's id.

#### date

The date on which the game occurs

#### home

The home team's id.

#### id

The game's id. Id's are unique to the game's league.

#### league

The league of the teams playing.

#### stats

The in game stats that occurred in the given game.

####  summary

Game summary displayed when a game page is viewed.

#### type

Either 'regular' for regular season games or 'playoff' for playoff games.

#### Game.generateId()

Generates the game's id.

#### Game.nextPlayoffGame(seriesInfo : object)

Adds the next playoff game to the schedule if the series is not complete.

<u>seriesInfo</u> The matchup summary of the series, {score: [Integer, Integer], hi: Team.id, lo: Team.id}

#### Game.simGame()

Simulates the game. Simulation is based on a 1 tick per game second system, each tick potentially triggers: line changes, possession changes, zone changes, shots, penalties, and stoppages.

# Global Variables

These contain all the data that ends up in a save file. They all exist under Vue.prototype.$variableName.

## Vue.prototype.$players

```
Vue.prototype.$players = {
	onehl: [Player.id, ...],
	twohl: [Player.id, ...],
	thrhl: [Player.id, ...],
	juniors: [Player.id, ...],
	prospects: [Player.id, ...],
	freeAgents: [Player.id, ...],
	Player.id: Player,
    ...
}
```

Keys which are league names contain all Player.ids of players currently playing in that league. Numeric keys are Player.ids, their value is the respective Player class.

## Vue.prototype.$teams

```
Vue.prototype.$teams = {
	onehl: {100: Team, 101: Team, ..., 131: Team},
	twohl: {200: Team, 201: Team, ..., 231: Team},
	thrhl: {300: Team, 301: Team, ..., 331: Team}
	prospects: {
		canada: {players: [Player.id, ...]},
		easternEurope: {players: [Player.id, ...]},
		europe: {players: [Player.id, ...]},
         scandanavia: {players: [Player.id, ...]},
		states: {players: [Player.id, ...]},
		rest: {players: [Player.id, ...]}
	}
}
```

'onehl', 'twohl', and 'thrhl 'contain all the Teams as {Team.id: Team}. Juniors do not have their own Teams but are incorporated in their 1HL parent Team.

Prospects are not Teams but just objects. At the moment they only have one key: 'players', which is a list of the Player.ids of Players in that region.

## Vue.prototype.$gameInfo

Contains all meta information about the game.

```
Vue.prototype.$gameInfo = {
	autoRoster: Boolean,
	colours: {
		main: HEX Colour,
		light: HEX Colour,
	}
	history: [{details: {...}, sub: String, url: String}, ...],
	page: {
         url: String,
         sub: String
		details: {}
	},
	player: {
		team: Team.id
	},
	salaryCap: Integer,
	scouting: {
		canada: {percentage: Integer[0,100], points: Integer[0,100]},
		easternEurope: {...}
		europe: {...},
         scandanavia: {...},
		states: {...},
		rest: {...}
	},
	time: {
		date: {
			day: Integer[1,31],
			month: Integer[1,12],
			year: Integer(>= 2019)
		}
		period: String
		season: Integer(>= 2020)
	}
	
}
```

#### autoRoster

False by default. If set to true the user's team will automatically have its roster changed, lines changes, and trades made.

#### colours

Colours are set when starting a new game, and used to style the HTML. **colour()** can be used as a shorthand.

#### history

History of the last 50 pages visited by the user, needed for the back button, managed by **addressChange()**.

#### page

The page that's currently displayed.

<u>url</u> The base url, when viewing any page this is the string before the '/'. There is one base url for every category in the top navbar as well as a few others. These are used to render main components in webContainer. Examples: 'home', 'player', 'rosters', 'free-agents'.

<u>sub</u> The sub url, when viewing most pages, this is the string after the '/'. Under the main component rendered by the base url, the sub renders a specific page. Examples: {url: 'roster', sub: 'contracts'},{url: 'player', sub: '783527'}, {url: 'home', sub:''}

<u>details</u>  Any important data from the previous page. This is used when going back to a page that had user entered info, so that the user doesn't have to re-enter all the info. Example: if the user views a player profile while in the trade screen then presses back, all the players added to the trade would still be there, without details there would be a new empty trade page.

#### player

Contains info about the user playing the game.

<u>team</u> The player's 1HL team.

#### salaryCap

The current salary cap, this is currently kept at a constant 85 Million.

#### scouting

Determines a user's certainty about a draft prospect's potential.

<u>percentage</u> Set by the user in 'scouting/', the proportion of scouting currently set to the region.

<u>points</u> The cumulative certainty for each region, used by **Player.function()**.

#### time

<u>date</u> The current date, same format is used for almost all dates.

<u>period</u> The period of the current date, is one of: 'pre-season', 'regular', 'playoff-r1', 'playoff-r2', 'playoff-r3', 'playoff-r4', 'off-season'.

<u>season</u> The year in which the playoffs occur. For the 2019/2020 season, season = 2020.

## Vue.prototype.$schedule

```
Vue.prototype.$schedule = {
	dates: {
        onehl: {
            'day-month-year': [Game.id, Game.id, ...],
            '1-10-2019': [Game.id, Game.id, ...],
            ...
        },
        twohl: {...},
        thrhl: {...}
	},
	id: {
        onehl: {
        	{{Game.id}}: Game,
        	{{Game.id}}: Game,
        	...
        },
        twohl: {...},
        thrhl: {...}
	},
	teams: {
        onehl: {
        	100: [Game.id, Game.id, ...],
        	...,
        	131: [Game.id, Game.id, ...],
        },
        twohl: {...},
        thrhl: {...}
	}
}
```

#### dates

Each key is a date in the format day-month-year, days without a game or event won't have a key. The value is a list of either games that will be simulated on that day.

#### id

Contains the actual Game class for every game in each league. Leagues will have overlapping ids.

#### teams

Contains the Game.ids that each team will play.

## Vue.prototype.$events

```
Vue.prototype.$events = {
	draft: {
		currentPick: Integer[1,224],
		available: [Player.id, Player.id, ...],
		drafted: [Player.id, Player.id, ...],
		ranked: [Player.id, Player.id, ...]
	},
	freeAgency: {
		day: Integer or String,
		Player.id: [
			{team: Team.id, cap: Float, years: Integer },
			{...},
			...
		],
		...	
	},
	playoffs: {
		onehl: {
            r1: {
            	 '1v16': {
            	 	hi: Team.id, 
            	 	lo: Team.id, 
            	 	score: [Integer (<= 4), Integer (<= 4)]
            	 }
				'2v15': {...},
				'3v14': {...},
				...
            }
            r2: {...},
            r3: {...},
            r4: {...}
		},
		twohl: {...},
		thrhl: {...}
	}
}
```

Contains all data about special events, currently there is only draft.

#### draft

Data about the entry draft, this is initiated when first entering the draft an reset at year end (July 1st).

<u>currentPick</u> The current pick, in other words the earliest unused pick.

<u>available</u> A list of Player.ids of players that are available to be drafted.

<u>drafted</u> A list of Player.ids of players that have already been drafted.

<u>ranked</u> A list of Player.ids ranked by "value".

#### freeAgency

Data specifically about the first month (July) of free agency.  During this period contract are not automatically accepted, instead team periodically offer contracts and players will periodically accept the best offer.

<u>day</u> If in the month of July this is the current day of free agency which is used in **freeAgencyUpdate()** and used to determine contract cap hits. If outside of July day is 'finished'.

<u>Player.id</u> The offers received by the player from each team.

#### playoffs

Data about the playoff bracket including scores and matchups for each league.

<u>r1, r2, r3, r4</u> Each round of the playoffs, 'r1' being the first round, 'r4' being the finals.

<u>1v16, 2v15, XvY</u> The matchup between the team seeded X and Y. 'hi' is the higher seeded team, 'lo' is the lower seeded team, 'score' is the amount of wins for each team in the order high then low.

## Vue.prototype.$news

```
Vue.prototype.$news = [
	'Your team has 11M left to spend in free agency',
	String,
	...
]
```

Contains up to 10 news items which appear in order on the home page. News strings can be made using **newNews()**.

## Vue.prototype.$saves

```
Vue.prototype.$saves = {
	quickSave1: String,
	quickSave2: String,
	quickSave3: String
}
```

Contains up to 3 quick saves which can be made by the user in the save menu. The objects contain all global variables needed to load a previous game. This is the same information that regular save files contain. The data is saved as a string and can be loaded with **gameLoad()**. The save contains information from all global variables other than this one and class.

## Vue.prototype.$class

```
Vue.prototype.$class = {
	Game: Game,
	Player: Player,
	Team: Team
}
```

Contains the 3 classes. To make a new class: new Vue.prototype.$class.Player.Player({...}).

# Global Methods

Global methods are kept in gMixin, which is then imported into every component so that these methods can always be accessed. Methods are stored in separate files by general category, this is in the scripts directory. All methods are listed here alphabetically.

#### addressChange(url : String, sub : String, details : object)  tools.js

Changes the current page, responsible for displaying components. Sets **Vue.prototype.$gameinfo.page** with the given info, also sets **Vue.prototype.$gameinfo.history** with previous pages.

<u>url</u> The main category of navigation, which controls which main component is displayed. All main components are in main.js.

<u>sub</u> The sub category of navigation, which controls which sub component is displayed. These components are located in their respective files under the components folder.

<u>details</u> Optional object that passes along extra details. This is used to store context important data in history. For example, if a player clicks on a player profile when making a trade, details would store all the players already added to the trade so that the user wouldn't have to re-add them every time they leave the page.

#### cleanTeamRosters() ai.js

Calls **Team.sortRoster()** and **Team.generateLines(false, false, false)** for every team. 

#### colour() tools.js

Short hand for Vue.prototype.$gameInfo.colours, used in component styles.

<u>returns</u> {main: HEX Colour, light: HEX Colour}

#### freeAgencyUpdate() ai.js

During the month of July, this periodically generates offers from each team and periodically accepts the best offer received by each player. Offers are made based on team positional needs both in terms of the 1HL roster as well as depth. Players will reject offers below a certain threshold, otherwise they will accept even if there is only one offer.

#### generateGame() new-game.js

Sets up everything to start a new game of BrowserGM.

#### laterDate(date1 : object, date2 : object)

Produces whether or not date1 is later than date2.

<u>date 1</u> {day: Integer, month: Integer, year: Integer}

<u>date 2</u> {day: Integer, month: Integer, year: Integer}

<u>returns</u> Boolean

#### loadGame(givenData : String) tools.js

Loads either a save file or a quick save.

<u>givenData</u> One of: 'upload', 'quickSave1', 'quickSave2', 'quickSave3'

#### newNews(type : any, item : any) tools.js

Adds a new news String to **Vue.prototype.$news** which then appears on the home page. Up to 10 news events are remembered. 

<u>type</u> Either string or false. String can be one of: 'retire', 'contract', 'extension', 'free agent', or 'cap', this will produce the given news type using the item. If false,item is a string that will be directly added to the news log.

<u>item</u> Contextual data based on the type. Used to produce unique news events.

#### nextDays(currentDay : object, days: Integer) schedule.js

Produces a date which is 'days' after the currentDay.

<u>currentDay</u> {day: Integer, month: Integer, year: Integer}

<u>days</u> The numbers of days to advance.

<u>returns</u> {day: Integer, month: Integer, year: Integer}

#### playerProgression() progression.js

Progresses all players. Progression amount is based on several factors like age, points, potential, overall, time on ice, and league. Progression can be either positive or negative.

#### playoffRound(round : Integer) playoff.js

Generates the given playoff round, after playoffs have already been initialised with **playoffStart()**.

<u>round</u> One of: 2, 3, or 4

#### playoffStart() playoff.js

Initially generates the playoffs, this data is stored in **Vue.prototype.$events.playoffs**.

#### prettyDate(date : object) schedule.js

Takes a date object and makes it a readable string.

<u>date</u> {day: Integer, month: Integer, year: Integer}

<u>returns</u> Date in string format, ex: October 20th 2019

#### prospectFogOfWar() prospect.js

Obfuscates prospects' potentials shown to the user. The level of obfuscation is determined by the user's scouting points from **Vue.prototype.$gameInfo.scouting**.

#### prospectGen() prospect.js

Generates 300 prospects from each region for the yearly entry draft.

#### readableTime(time : Integer) tools.js

Converts the given time on ice into a readable time in minutes and seconds.

<u>time</u> Time on ice in total seconds

<u>returns</u> String in format MM:SS, ex: '17:34'

#### rnd(low : Integer, high : Integer) tools.js

Randomly generates a number between low and high. Low and high are included in the range.

<u>low</u> The bottom end of the range.

<u>high</u> The top end of the range.

<u>returns</u> Integer

#### retirees() year-end.js

At the end of the year, this retires old players randomly as well as all player with a low overall past a certain age.

#### sameObject(object1 : object, object2: object) tools.js

Compares the given objects to see if they have the same keys and values. Made because {} !== {}.

#### parameters

<u>object1</u> Any object

<u>object2</u> Any object

<u>returns</u> Boolean

#### scheduleGen(length: Integer, startDate: object) schedule.js

Generates a game schedule in **Vue.prototype.$schedule** starting at startDate that is length games long. There is an average of one game every two days, matchups are randomly assigned.

<u>length</u> The number of games each team will player

<u>startDate</u> The first possible date for games

#### signNecessaryDepth() ai.js

For all teams any empty roster slots are filled with free agents. If enough free agents do not exist, players are created and added to rosters.

#### simToDate(endDate : object) sim.js

Simulates games and events until the end date. Numerous functions will be ran at certain dates, for example **playerProgression()**, **retirees()**, and **yearEnd()**.

<u>endDate</u> The date simulated until but not including, in format {day: Integer, month: Integer, year: Integer}

#### startPreSeason() schedule.js

Makes the pre-season and its games.

#### startSeason() schedule.js

Makes the regular season and its 82 game schedule.

#### teamConvert(league : Team.league, team: Team.id) 

Produces the respective affiliate team in the given league.

<u>league</u> The league of the team that will be returned, one of: 'onehl', 'twohl', 'thrhl'

<u>team</u> The give team id

<u>returns</u> integer, ex: teamConvert('thrhl', 105) -> 305

#### tradeBuriedPlayers() ai.js

Makes teams trade each other buried players of different positions. Buried players are those with contract above the minimum who are not playing in the 1HL due to lots of positional depth on their team.

#### tradeForNeeds() ai.js

Makes teams trade players of their positional strengths for positional weaknesses. This only applies to player above a minimum contract in the 1HL.

#### tradeToEvenDepth() ai.js

Makes teams trade to even up their organizational depth by position, this applies to players in the 2HL and 3HL.

#### tradeUnderCap() ai.js

Makes teams that are over the cap go under through trades.

#### yearEnd() ai.js

Deals with all processes to reset the season at the end of the year on July 1st. Examples of processes include resetting stats, aging players, and advancing contracts.

#### yearEndResign() ai.js

Makes each team resign their players including those in juniors that are of a certain quality, this is done just before contracts expire July 1st.