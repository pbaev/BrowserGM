const gMixin = require('../scripts/main.js')

module.exports = {
    statsPage: {
        mixins: [gMixin],
        template: `
        <div>
        <div class="horizontal-buttons">
            <a @click="league = 'onehl';updatePlayers('change league')" :style="{'background': colour().main}">1HL</a>
            <a @click="league = 'twohl';updatePlayers('change league')" :style="{'background': colour().main}">2HL</a>
            <a @click="league = 'thrhl';updatePlayers('change league')" :style="{'background': colour().main}">3HL</a>
        </div>
        <div class="horizontal-buttons stats-filter">
            <a @click="currentTable = 'stats';      tableDisplay(currentTable)" :style="{'background': colour().main}">Stats</a>
            <a @click="currentTable = 'attributes'; tableDisplay(currentTable)" :style="{'background': colour().main}">Attributes</a>
            <a @click="htmlDisplay.filter = !htmlDisplay.filter" class="light-text" :style="{'background': colour().light}">Filter</a>
        </div>
        
        <div v-if="htmlDisplay.filter" style="display: inline-block; height: 30px">
            <a @click="htmlDisplay.teams = !htmlDisplay.teams; htmlDisplay.positions = false"      class="stats-page-filter-button hover-text">Teams</a>
            <a @click="htmlDisplay.positions = !htmlDisplay.positions; htmlDisplay.teams = false" class="stats-page-filter-button hover-text">Positions</a>
        </div>

        <div v-if="htmlDisplay.teams & htmlDisplay.filter" class="stats-page-filter-container">
            <p v-for="team in teams"
                :style="teamStyle(team.id)"
                @click="filterTeams(team.id)">
                {{team.abb}}
            </p>
            <div style="display: inline-block; height: 30px">
                <a @click="filterTeams('select all')"
                    class="stats-page-filter-button hover-text">Select All</a>
                <a @click="filterTeams('deselect all')"
                    class="stats-page-filter-button hover-text">Deselect All</a>
            </div>
        </div>

        <div v-if="htmlDisplay.positions & htmlDisplay.filter" class="stats-page-filter-container">
            <p  v-for="position in ['lw','c','rw','ld','rd','g']"
                :style="positionStyle(position)"
                @click="filterPositions(position)">
                {{position.toUpperCase()}}
            </p>
        </div>
                
        <div class="stats-page-container">
            <a @click="setScope('start')" class="scope-change" :style="{'background': colour().main}"> << </a> 
            <a @click="setScope('backward')" class="scope-change light" :style="{'background': colour().light}"> < </a> 
            <div class="table-scroll">
                <table class="stats-page-table">
                    <tr>
                        <th>#</th>
                        <th v-for="i in table.header" @click="changeSort(i)">
                            <p class="stats-table-header">{{i}}</p>
                        </th>
                    </tr>
                    <tr v-for="(player, i) in players">
                        <td>{{scope[0]+1+i}}</td>
                        <td @click="addressChange('player',player.id,{})" class="hover-hand">{{player.name}}</td>
                        <td>{{player.position.toUpperCase()}}</td>
                        <td v-for="stat in table.row">{{player[stat]}}</td>
                    </tr>
                </table>
            </div>
            <a @click="setScope('forward')" class="scope-change light" :style="{'background': colour().light}"> > </a>
        </div>
        </div>
        `,

        data: function () {
            return {
                table: this.tableDisplay('stats'),
                currentTable: 'stats',
                players: this.filteredPlayers('onehl', this.allTeams('onehl'), ['lw', 'c', 'rw', 'ld', 'rd'], 'points', true, [0, 10]),
                teams: this.allTeams('onehl'),
                league: 'onehl',
                positions: ['lw', 'c', 'rw', 'ld', 'rd'],
                sortedBy: 'points',
                sortedPositively: true,
                scope: [0, 10],
                htmlDisplay: { filter: false, positions: false, teams: false }
            }
        },

        methods: {
            updatePlayers: function (arg) {
                if (arg === 'change league') {
                    this.teams = this.allTeams(this.league)
                }
                this.players = this.filteredPlayers(this.league, this.teams, this.positions, this.sortedBy, this.sortedPositively, this.scope)
                if (this.players.length === 0) {
                    this.scope = [this.scope[0]-10, this.scope[1]-10]
                }
                this.players = this.filteredPlayers(this.league, this.teams, this.positions, this.sortedBy, this.sortedPositively, this.scope)

            },

            allTeams: function (league) {
                var teams = {}
                for (var tid in Vue.prototype.$teams[league]) {
                    var team = Vue.prototype.$teams[league][tid]
                    teams[team.id] = {
                        abb: team.name.abb,
                        id: team.id,
                        selected: true
                    }
                }
                return teams
            },

            filterTeams: function (arg) {
                if (arg === 'select all') {
                    for (var tid in this.teams) {
                        this.teams[tid].selected = true
                    }
                }
                else if (arg === 'deselect all') {
                    for (var tid in this.teams) {
                        this.teams[tid].selected = false
                    }
                }
                else {
                    this.teams[arg].selected = !this.teams[arg].selected
                }
                this.updatePlayers()
            },

            filterPositions: function (position) {
                if (position === 'g') {
                    this.positions = ['g']
                    this.tableDisplay(this.currentTable)
                }
                else if (this.positions.includes(position)) {
                    this.positions = this.positions.filter(pos => pos !== position)
                    this.positions = this.positions.filter(pos => pos !== 'g')
                }
                else {
                    this.positions.push(position)
                    this.positions = this.positions.filter(pos => pos !== 'g')
                }
                this.updatePlayers()
            },

            filteredPlayers: function (league, teams, positions, sortedBy, sortedPositively, scope) {
                const season = Vue.prototype.$gameInfo.time.season

                function getPlayersInLeague(league) {
                    var leaguePlayers = []
                    for (var n in Vue.prototype.$players[league]) {
                        var pid = Vue.prototype.$players[league][n]
                        var player = Vue.prototype.$players[pid]
                        leaguePlayers.push({
                            id: player.id,
                            name: player.fullName,
                            age: player.age,
                            position: player.position,
                            team: player.team,
                            teamName: player.teamName().abb,
                            overall: player.overall(),
                            gamesPlayed: player.stats[season].gamesPlayed,
                            points: player.stats[season].points,
                            goals: player.stats[season].goals,
                            assists: player.stats[season].assists,
                            shots: player.stats[season].shots,
                            pim: player.stats[season].pim,
                            savePctg: player.stats[season].savePctg,
                            gaa: player.stats[season].gaa,
                            saves: player.stats[season].saves,
                            goalsAgainst: player.stats[season].goalsAgainst,
                        })
                        leaguePlayers[n] = Object.assign({}, leaguePlayers[n], player.attributes)
                    }
                    return leaguePlayers
                }

                function filterPlayers(players, teams, positions) {
                    var teamList = []
                    for (var team in teams) {
                        if (teams[team].selected) {
                            teamList.push(team)
                        }
                    }
                    players = players.filter(player =>
                        (teamList.includes(player.team.toString()) & positions.includes(player.position)
                        ))

                    return players
                }

                var players = filterPlayers(getPlayersInLeague(league), teams, positions)

                players = players.sort((a, b) => a[sortedBy] - b[sortedBy])

                if (sortedPositively) {
                    players = players.reverse()
                }

                players = players.slice(scope[0], scope[1])

                return players
            },

            setScope: function (direction) {
                if (direction === 'start') {
                    this.scope = [0, 10]
                }
                else if (direction === 'forward') {
                    this.scope = [this.scope[0] + 10, this.scope[1] + 10]
                }
                else if (direction === 'backward') {
                    this.scope = [this.scope[0] - 10, this.scope[1] - 10]
                }
                if (this.scope[0] < 0) {
                    this.scope = [0, 10]
                }
                this.updatePlayers()
            },


            tableDisplay: function (type) {
                var table = { header: [], row: [] }
                //first 2 rows ommited because they're hardcoded into the html
                try {
                    if (this.positions[0] === 'g') {
                        var goalie = true
                    }
                    else { var goalie = false }
                }
                catch { var goalie = false }


                if (type === 'stats') {
                    if (goalie) {
                        table.header = ['Name', 'Pos', 'Age', 'Team', 'Overall', 'GP', 'Sv%', 'GAA', 'Svs', 'GA']
                        table.row = ['age', 'teamName', 'overall', 'gamesPlayed', 'savePctg', 'gaa', 'saves', 'goalsAgainst']
                    }
                    else {
                        table.header = ['Name', 'Pos', 'Age', 'Team', 'Ovr', 'GP', 'PTS', 'G', 'A', 'Sht', 'PIM']
                        table.row = ['age', 'teamName', 'overall', 'gamesPlayed', 'points', 'goals', 'assists', 'shots', 'pim']
                    }
                }
                if (type === 'attributes') {
                    if (goalie) {
                        table.header = ['Name', 'Pos', 'Age', 'Team', 'Overall', 'Glove', 'Blocker', 'Pads', 'Rebounds', 'Puck', 'Reflexes', 'Strength', 'Stamina', 'IQ', 'Work', 'Confidence']
                        table.row = ['age', 'teamName', 'overall', 'glove', 'blocker', 'pads', 'rebounds', 'puck', 'reflex', 'strength', 'stamina', 'iq', 'work', 'confidence']
                    }
                    else {
                        table.header = ['Name', 'Pos', 'Age', 'Team', 'OIQ', 'Wrist', 'Slap', 'Hands', 'DIQ', 'Stickwork', 'Blocking', 'Hitting', 'Skating', 'Passing',
                            'Hand Eye', 'Face Off', 'Strength', 'Stamina', 'Hustle', 'Discipline']
                        table.row = ['age', 'teamName', 'oiq', 'wrist', 'slap', 'hands', 'diq', 'stick', 'blocking', 'hitting', 'skating', 'passing', 'handEye', 'faceOff',
                            'strength', 'stamina', 'hustle', 'discipline']
                    }
                }
                this.table = table
                return table
            },

            positionStyle: function (position) {
                if (this.positions.includes(position)) {
                    return { 'font-weight': 'bold' }
                }
                else {
                    return { 'color': '#dddddd' }
                }
            },

            teamStyle: function (tid) {
                for (var team in this.teams) {
                    if (this.teams[team].id == tid) {
                        if (this.teams[team].selected) {
                            return { 'font-weight': 'bold' }
                        }
                        else {
                            return { 'color': '#dddddd' }
                        }
                    }
                }
            },

            changeSort: function (type) {
                type = this.table.row[this.table.header.indexOf(type) - 2]
                if (type === this.sortedBy) {
                    this.sortedPositively = !this.sortedPositively
                }
                this.sortedBy = type
                this.updatePlayers()
            }

        }
    },



    statsOverviewPage: {
        mixins: [gMixin],
        template: `
    <div class="player-overview">
        <p>Top Players</p>
        <div>
        <p>Points</p>
        <table>
            <tr>
            <th>Player</th>
            <th>Points</th>
            </tr>
            <tr v-for="player in stats.points">
            <td @click="addressChange('player',player.id,{})">{{player.name}}</td>
            <td>{{player.stat}}</td>
            </tr>
        </table>
        </div>

        <p>Goals</p>
        <table>
            <tr>
            <th>Player</th>
            <th>Goals</th>
            </tr>
            <tr v-for="player in stats.goals">
            <td @click="addressChange('player',player.id,{})">{{player.name}}</td>
            <td>{{player.stat}}</td>
            </tr>
        </table>
        </div>

        <p>Assists</p>
        <table>
            <tr>
            <th>Player</th>
            <th>Assists</th>
            </tr>
            <tr v-for="player in stats.assists">
            <td @click="addressChange('player',player.id,{})">{{player.name}}</td>
            <td>{{player.stat}}</td>
            </tr>
        </table>
        </div>
    
        <div>
        <p>Overall</p>
        <table>
            <tr>
            <th>Player</th>
            <th>Overall</th>
            </tr>
            <tr v-for="player in stats.overall">
            <td @click="addressChange('player',player.id,{})">{{player.name}}</td>
            <td>{{player.stat}}</td>
            </tr>
        </table>
        </div>
    </div>
    `,

        data: function () {
            return {
                stats: {
                    points: this.statsSet('points'),
                    overall: this.statsSet('goals'),
                    goals: this.statsSet('goals'),
                    assists: this.statsSet('assists'),
                    shots: this.statsSet('shots'),

                }
            }
        },

        methods: {
            statsSet: function (type) {
                var statList = []
                const playerList = Vue.prototype.$players.onehl
                for (var player in Vue.prototype.$players.onehl) {
                    var p = Vue.prototype.$players[playerList[player]]

                    if (type === 'overall') {
                        var stat = p.overall()
                    }
                    else {
                        var stat = p.stats[Vue.prototype.$gameInfo.time.season][type]
                    }

                    statList.push({
                        id: p.id,
                        name: p.name().abb,
                        stat: stat
                    })
                }
                statList = statList.sort((a, b) => a.stat - b.stat).reverse()
                return statList.slice(0, 10)
            }
        }
    },
}