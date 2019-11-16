const gMixin = require('../scripts/main.js')

module.exports = {
    rosterPage: {
        mixins: [gMixin],
        template: `
        <div>
            <p @click="rules = !rules" class="roster-rules">Rules</p>
            <div v-if="rules" class="roster-rules">
                <p>Traded players will stay in the same league they were previously in</p>
                <p>Free agent singings will go to the 3HL</p>
                <p>Players brought up from juniors can't be sent back, they recieve an automatic contract of 1M until the age of 21</p>
                <p>If junior players aren't signed at age 21, they will be released</p>
                <p>Players on minimum contracts (1 M cap hit) can be released</p>
                <p>Each team needs at least 18 skaters and 2 goalies to play</p> 
            </div>
            <p class="home-team-name" :style="{'color':colour().main}">{{teamName.city}}</p>
            <p class="home-team-name" :style="{'color':colour().light}">{{teamName.logo}}</p>
            <div class="roster-league-overall">
                <div class="onehl-highlight">
                    <p>1HL</p>
                    <p>{{'Forwards: '+overall.onehl.forwards}}</p>
                    <p>{{'Defence: '+overall.onehl.defence}}</p>
                    <p>{{'Goalies: '+overall.onehl.goalies}}</p>
                    <p>{{totals.onehl+'/23'}}</p>
                </div>
                <div class="twohl-highlight">
                    <p>2HL</p>
                    <p>{{'Forwards: '+overall.twohl.forwards}}</p>
                    <p>{{'Defence: '+overall.twohl.defence}}</p>
                    <p>{{'Goalies: '+overall.twohl.goalies}}</p>
                    <p>{{totals.twohl+'/23'}}</p>
                </div>
                <div class="thrhl-highlight">
                    <p>3HL</p>
                    <p>{{'Forwards: '+overall.thrhl.forwards}}</p>
                    <p>{{'Defence: '+overall.thrhl.defence}}</p>
                    <p>{{'Goalies: '+overall.thrhl.goalies}}</p>
                    <p>{{totals.thrhl+'/30'}}</p>
                </div>
                <div class="juniors-highlight">
                    <p>Juniors</p>
                    <p>{{totals.juniors+'/∞'}}</p>
                </div>
            </div>
            <p>{{'Cap '+team.capSpent()+' M / 85 M'}}</p>
            <div class="horizontal-buttons">
                <a @click="dropdown.display = !dropdown.display" :style="{'background': colour().main}">Teams</a>
                <a @click="attemptTransactions()" v-if="userTeam == selectedTeam" :style="{'background': colour().main}">Save</a>
            </div>
            <div v-if="dropdown.display" class="roster-dropdown">
                <a v-for="team in dropdown.teams" @click="teamChange(team.id)" :id="team.id">{{ team.name }}</a>
            </div>
        
            <div v-if="userTeam == selectedTeam & Object.keys(pending).length > 0">
                <p>Pending Transactions</p>
                <p v-if="alert !== false">{{alert}}</p>
                <table>
                    <tr>
                    <th>
                    <th>Player</th>
                    <th>From</th>
                    <th>To</th>
                    </tr>
                    <tr v-for="player in pending">
                    <td><a @click="changePending('remove',player)">X</a></td>
                    <td>{{player.name}}</td>
                    <td>{{player.league}}</td>
                    <td>{{player.toLeague}}</td>
                    </tr>
                </table>
            </div>
            <div v-else-if="userTeam == selectedTeam">
                <p>No pending transactions</p>
            </div>
        
            <div class="roster-table-container">
                <div v-for="position in ['lw','c','rw']">
                <p :style="{'color':colour().light}">{{positionTranslate[position]}}</p>
                <table>
                    <tr>
                    <th>Age</th>
                    <th>Name</th>
                    <th>Overall</th>
                    </tr>
                    <tr v-for="player in players" v-if="position === player.position" :class="player.className" @click="selectPlayer(player.id)">
                    <td>{{player.age}}</td>
                    <td>{{player.name}}</td>
                    <td>{{player.overall}}</td>
                    </tr>
                </table>
                </div>
            </div>
        
            <div class="roster-table-container">
                <div v-for="position in ['ld','rd']">
                <p :style="{'color':colour().light}">{{positionTranslate[position]}}</p>
                <table>
                    <tr>
                    <th>Age</th>
                    <th>Name</th>
                    <th>Overall</th>
                    </tr>
                    <tr v-for="player in players" v-if="position === player.position" :class="player.className" @click="selectPlayer(player.id)">
                    <td>{{player.age}}</td>
                    <td>{{player.name}}</td>
                    <td>{{player.overall}}</td>
                    </tr>
                </table>
                </div>
            </div>
        
            <div class="roster-table-container">
                <div v-for="position in ['g']">
                <p :style="{'color':colour().light}">{{positionTranslate[position]}}</p>
                <table>
                    <tr>
                    <th>Age</th>
                    <th>Name</th>
                    <th>Overall</th>
                    </tr>
                    <tr v-for="player in players" v-if="position === player.position" :class="player.className" @click="selectPlayer(player.id)">
                    <td>{{player.age}}</td>
                    <td>{{player.name}}</td>
                    <td>{{player.overall}}</td>
                    </tr>
                </table>
                </div>
            </div>

            <div v-if="selectedPlayer.display" class="selected-bar">
                <p>{{selectedPlayer.overall}}</p>
                <p>{{selectedPlayer.name}}</p>
                <div class="horizontal-buttons">
                    <a @click="addressChange('player',selectedPlayer.id,{})"
                    :style="{'background': colour().main}">Player Page</a>
                    <a v-if="selectedPlayer.league !== 'onehl' & userTeam == selectedTeam" 
                    :style="{'background': colour().main}"
                    @click="changePending('onehl',selectedPlayer)">To 1HL</a>
                    <a v-if="selectedPlayer.league !== 'twohl' & userTeam == selectedTeam" 
                    :style="{'background': colour().main}"
                    @click="changePending('twohl',selectedPlayer)">To 2HL</a>
                    <a v-if="selectedPlayer.league !== 'thrhl' & userTeam == selectedTeam" 
                    :style="{'background': colour().main}"
                    @click="changePending('thrhl',selectedPlayer)">To 3HL</a>
                    <a v-if="selectedPlayer.canBeReleased" 
                    :style="{'background': colour().main}"
                    @click="changePending('release',selectedPlayer)">Release</a>
                    <a @click="selectPlayer('close')"
                    :style="{'background': colour().main}">X</a>
                </div>
            </div>
        </div>
        `,

        data: function () {
            var userTeam = Vue.prototype.$gameInfo.player.team
            return {
                gameInfo: Vue.prototype.$gameInfo,
                totals: this.totalCount(),
                players: this.teamChange('init'),
                team: Vue.prototype.$teams.onehl[userTeam],
                dropdown: {
                    'teams': this.teamlist(),
                    'current': 0,
                    'display': false
                },
                overall: this.overalls('init'),
                selectedPlayer: { display: false },
                pending: [],
                alert: false,
                userTeam: userTeam,
                selectedTeam: userTeam,
                rules: false,
                positionTranslate: { lw: 'Left Wing', c: 'Center', rw: 'Right Wing', ld: 'Left Defence', rd: 'Right Defence', g: 'Goalie' }
            }
        },
        methods: {
            teamChange: function (state) {
                if (state === 'init') {
                    var team = Vue.prototype.$gameInfo.player.team
                    this.overall = this.overalls('init')
                } else {
                    var team = event.currentTarget.id
                    this.overall = this.overalls()
                    this.team = Vue.prototype.$teams.onehl[team]
                }

                var leagues = { onehl: team, twohl: '2' + team.toString().slice(1, 3), thrhl: '3' + team.toString().slice(1, 3) }
                var players = []
                for (var league in leagues) {
                    for (var curPlayer in Vue.prototype.$teams[league][leagues[league]].players) {
                        var player = Vue.prototype.$players[Vue.prototype.$teams[league][leagues[league]].players[curPlayer]]
                        players.push({
                            'id': player.id,
                            'age': player.age,
                            'name': player.name().abb,
                            'position': player.position,
                            'overall': player.overall(),
                            'league': league,
                            'className': league + '-highlight',
                            'team': player.team
                        })
                    }
                }
                for (var curPlayer in Vue.prototype.$teams.onehl[team].juniors) {
                    var player = Vue.prototype.$players[Vue.prototype.$teams.onehl[team].juniors[curPlayer]]
                    players.push({
                        'id': player.id,
                        'age': player.age,
                        'name': player.name().abb,
                        'position': player.position,
                        'overall': player.overall(),
                        'league': 'juniors',
                        'className': 'juniors-highlight',
                        'team': player.team
                    })
                }


                players = players.sort((a, b) => a.overall - b.overall).reverse()
                try { this.selectedTeam = team }
                catch { }

                this.players = players
                this.totals = this.totalCount()
                return players
            },

            changePending: function (league, player) {
                if (league !== 'remove') {
                    player.toLeague = league
                    var newList = this.pending.filter(function (pid) { return pid.id !== player.id })
                    newList.push(JSON.parse(JSON.stringify(player)))

                    if (this.pending.length !== newList.length) {
                        this.totals[player.toLeague] += 1
                        this.totals[player.league] -= 1
                    }
                    this.pending = newList

                }
                else {
                    this.pending = this.pending.filter(function (pid) { return pid.id !== player.id })
                    this.totals[player.toLeague] -= 1
                    this.totals[player.league] += 1
                }
            },

            attemptTransactions: function () {
                const leagueConvert = { onehl: '1HL', twohl: '2HL', thrhl: '3HL' }
                const leagueNumber = { onehl: '1', twohl: '2', thrhl: '3' }
                var success = true
                for (var league in this.totals) {
                    if (league !== 'thrhl') {
                        if (this.totals[league] > 23) {
                            this.alert = 'Too many players in ' + leagueConvert[league]
                            success = false
                        }
                    }
                    else {
                        if (this.totals[league] > 30) {
                            this.alert = 'Too many players in ' + leagueConvert[league]
                            success = false
                        }
                    }
                }

                if (success) {
                    this.alert = 'Transactions have been made'
                    var pending = this.pending
                    for (var item in pending) {
                        var player = pending[item]
                        var newTeam = leagueNumber[player.toLeague] + player.team.toString().slice(1, 3)

                        if (player.toLeague === 'release') {
                            Vue.prototype.$players[player.id].release()
                        }
                        else {
                            Vue.prototype.$players[player.id].switchTeam(newTeam)
                        }
                    }
                    this.pending = []

                    
                    this.teamChange('init')
                }
            },

            totalCount: function () {
                if (typeof this.players === 'undefined') {
                    var players = this.teamChange('init')
                }
                else {
                    var players = this.players
                }

                var total = { onehl: 0, twohl: 0, thrhl: 0, juniors: 0 }
                for (var n in players) {
                    var player = players[n]
                    total[player.league] += 1
                }
                return total
            },

            teamlist: function () {
                var teams = []
                for (var team in Vue.prototype.$teams.onehl) {
                    teams.push({ name: Vue.prototype.$teams.onehl[team].name.city, id: team.toString() })
                }
                return teams
            },

            overalls: function (state) {
                if (state === 'init') {
                    var team = Vue.prototype.$teams.onehl[Vue.prototype.$gameInfo.player.team]
                } else {
                    var team = Vue.prototype.$teams.onehl[event.currentTarget.id]
                }
                var team2 = Vue.prototype.$teams.twohl[this.teamConvert('twohl', team.id )]
                var team3 = Vue.prototype.$teams.thrhl[this.teamConvert('thrhl', team.id )]

                return { onehl: team.overall(), twohl: team2.overall(), thrhl: team3.overall() }
            },

            selectPlayer: function (pid) {
                if (pid !== 'close') {
                    var player = Vue.prototype.$players[pid]
                    this.selectedPlayer.display = true
                    this.selectedPlayer.id = pid
                    this.selectedPlayer.name = player.fullName
                    this.selectedPlayer.overall = player.overall()
                    this.selectedPlayer.league = player.league
                    this.selectedPlayer.team = player.team
                    this.selectedPlayer.canBeReleased = (player.contract.cap === 1)
                    this.$forceUpdate()
                    this.alert = false
                }
                else {
                    this.selectedPlayer.display = false
                    this.alert = false
                }
            }
        },
        computed: {
            teamName: function () {
                var team = Vue.prototype.$teams.onehl[this.selectedTeam]
                return { city: team.name.city.toUpperCase(), logo: team.name.logo.toUpperCase() }
            }
        }
    },



    rosterContractPage: {
        mixins: [gMixin],
        template: `
    <div>
        <div class="horizontal-buttons">
            <a @click="selectedLeague = 'onehl'"
            :style="{'background': colour().main}">1HL</a>
            <a @click="selectedLeague = 'twohl'"
            :style="{'background': colour().main}">2HL</a>
            <a @click="selectedLeague = 'thrhl'"
            :style="{'background': colour().main}">3HL</a>
        </div>
        <table>
            <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Overall</th>
                <th>Position</th>
                <th v-for="year in 8">{{contractYears[year-1]}}</th>
            </tr>
            <tr v-for="player in players[selectedLeague]" @click="selectPlayer(player)"
            class="hover-hand">
                <td v-if="player.negotiate" :style="{'color': colour().light}">{{player.name}}</td>
                <td v-else>{{player.name}}</td>
                <td>{{player.age}}</td>
                <td>{{player.overall}}</td>
                <td>{{player.position.toUpperCase()}}</td>
                <td v-for="year in 8">{{player.cap[year-1]}}</td>
            </tr>
        </table>

        <div v-if="selectedPlayer.display" class="selected-bar">
            <p>{{selectedPlayer.overall}}</p>
            <p>{{selectedPlayer.name}}</p>
            <div class="horizontal-buttons">
                <a @click="addressChange('player',selectedPlayer.id,{})"
                :style="{'background': colour().main}">Player Page</a>
                <a @click="addressChange('roster','negotiate-'+selectedPlayer.id,{})" v-if="selectedPlayer.negotiate"
                :style="{'background': colour().main}">New Contract</a>
                <a @click="selectPlayer('close')"
                :style="{'background': colour().main}">X</a>
            </div>
        </div>
    </div>
    `,
        data: function () {
            var gameInfo = Vue.prototype.$gameInfo
            var team = gameInfo.player.team
            var pids = {}
            pids.onehl = Vue.prototype.$teams.onehl[team].players
            pids.twohl = Vue.prototype.$teams.twohl['2' + team.toString().slice(1, 3)].players
            pids.thrhl = Vue.prototype.$teams.thrhl['3' + team.toString().slice(1, 3)].players


            var playerList = { onehl: [], twohl: [], thrhl: [] }
            for (var league in pids) {
                for (var pid in pids[league]) {
                    var player = Vue.prototype.$players[pids[league][pid]]
                    var insert = {}

                    insert.id = player.id
                    insert.name = player.name().abb
                    insert.fullName = player.fullName
                    insert.cap = []
                    for (var i = 0; i < player.contract.years; i++) {
                        insert.cap.push(player.contract.cap)
                    }
                    for (var i = 0; i < player.newContract.years; i++) {
                        insert.cap.push(player.newContract.cap)
                    }
                    insert.years = player.contract.years
                    insert.clause = player.contract.clause
                    insert.age = player.age
                    insert.position = player.position
                    insert.overall = player.overall()
                    if (insert.years === 1) {
                        insert.negotiate = true
                    }
                    else {
                        insert.negotiate = false
                    }

                    playerList[league].push(insert)
                }
                playerList.onehl = playerList.onehl.sort((a, b) => a.cap[0] - b.cap[0]).reverse()
                playerList.twohl = playerList.twohl.sort((a, b) => a.cap[0] - b.cap[0]).reverse()
                playerList.thrhl = playerList.thrhl.sort((a, b) => a.cap[0] - b.cap[0]).reverse()
            }

            return {
                players: playerList,
                selectedLeague: 'onehl',
                contractYears: this.yearsCalc(),
                selectedPlayer: { display: false },
            }
        },
        methods: {
            selectPlayer: function (player) {
                if (player === 'close') {
                    this.selectedPlayer.display = false
                }
                else {
                    if (player.years === 1) {
                        var negotiate = true
                    }
                    else {
                        var negotiate = false
                    }

                    var selectedPlayer = {
                        display: true,
                        id: player.id,
                        name: player.fullName,
                        overall: player.overall,
                        negotiate: negotiate
                    }


                    this.selectedPlayer = selectedPlayer
                }

            },
            yearsCalc: function () {
                var season = Vue.prototype.$gameInfo.time.season
                var seasons = []

                for (var i = 0; i < 8; i++) {
                    var seasonText = (season - 1).toString().slice(2, 4) + '-' + season.toString().slice(2, 4)
                    seasons.push(seasonText)
                    season += 1
                }

                return seasons
            }
        }
    },

    rosterLinesPage: {
        mixins: [gMixin],
        template: `
    <div>
        <div class="horizontal-buttons">
            <a @click="league = 'onehl';teamPlayers();lineGen('init');changeSpecial('init');alert=false"
            :style="{'background': colour().main}">1HL</a>
            <a @click="league = 'twohl';teamPlayers();lineGen('init');changeSpecial('init');alert=false"
            :style="{'background': colour().main}">2HL</a>
            <a @click="league = 'thrhl';teamPlayers();lineGen('init');changeSpecial('init');alert=false"
            :style="{'background': colour().main}">3HL</a>
        </div>
        <div class="horizontal-buttons" id="lines-page">
            <a @click="saveLines()" class="light-text"
            :style="{'background': colour().light}">Save Lines</a>
            <a @click="suggestedLines()" class="light-text"
            :style="{'background': colour().light}">Suggested Lines</a>
        </div>
        <p>{{'PP: '+specialTeams.pp.count+'/10 PK: '+specialTeams.pk.count+'/8'}}</p>
        <p v-if="alert !== false">{{alert}}</p>
        <table class="roster-lines-table">
            <tr>
                <th :style="{'color': colour().light}">Left Wing</th>
                <th :style="{'color': colour().light}">Center</th>
                <th :style="{'color': colour().light}">Right Wing</th>
            </tr>
            <tr v-for="i in 4">
                <td 
                v-for="pos in ['lw','c','rw']"
                :class="lines[pos][i-1].class">
                <a @click="changeSpecial('pp',lines[pos][i-1].id)"
                :class="checkSpecialClass('pp',lines[pos][i-1].id)"
                id="pp">PP</a>
                    <p class="roster-lines-name" @click="swapPlayer(pos,i-1)">{{lines[pos][i-1].name+' '+lines[pos][i-1].overall}}</p>
                <a @click="changeSpecial('pk',lines[pos][i-1].id)"
                :class="checkSpecialClass('pk',lines[pos][i-1].id)"
                id="pk">PK</a>
                </td>
            </tr>
        </table>
        <table class="roster-lines-table">
            <tr>
                <th :style="{'color': colour().light}">Left Defence</th>
                <th :style="{'color': colour().light}">Right Defence</th>
            </tr>
            <tr v-for="i in 3">
                <td 
                v-for="pos in ['ld','rd']"
                :class="lines[pos][i-1].class">
                <a @click="changeSpecial('pp',lines[pos][i-1].id)"
                :class="checkSpecialClass('pp',lines[pos][i-1].id)"
                id="pp">PP</a>
                    <p class="roster-lines-name" @click="swapPlayer(pos,i-1)">{{lines[pos][i-1].name+' '+lines[pos][i-1].overall}}</p>
                <a @click="changeSpecial('pk',lines[pos][i-1].id)"
                :class="checkSpecialClass('pk',lines[pos][i-1].id)"
                id="pk">PK</a>
                </td>
            </tr>
        </table>
        <table class="roster-lines-table">
            <tr>
                <th :style="{'color': colour().light}">Goalies</th>
            </tr>
            <tr v-for="i in 2">
                <td :class="lines.g[i-1].class"
                @click="swapPlayer('g',i-1)">
                {{lines.g[i-1].name+' '+lines.g[i-1].overall}}
                </td>
            </tr>
        </table>
    
        <p>Roster Players</p>
        <table>
            <tr>
                <th :style="{'color': colour().light}">Left Wing</th>
                <th :style="{'color': colour().light}">Center</th>
                <th :style="{'color': colour().light}">Right Wing</th>
            </tr>
            <tr v-for="i in Math.max(players.lw.length, players.c.length, players.rw.length)">
                <td v-if="i-1 < players.lw.length"
                :class="players.lw[i-1].class" 
                @click="selectPlayer(players.lw[i-1].id)">
                {{players.lw[i-1].name+' '+players.lw[i-1].overall}}</td>
                <td v-else></td>
                
                <td v-if="i-1 < players.c.length"
                :class="players.c[i-1].class" 
                @click="selectPlayer(players.c[i-1].id)">
                {{players.c[i-1].name+' '+players.c[i-1].overall}}</td>
                <td v-else></td>
                
                <td v-if="i-1 < players.rw.length"
                :class="players.rw[i-1].class" 
                @click="selectPlayer(players.rw[i-1].id)">
                {{players.rw[i-1].name+' '+players.rw[i-1].overall}}</td>
                <td v-else></td>
            </tr>
        </table>
        <table>
            <tr>
                <th :style="{'color': colour().light}">Left Defence</th>
                <th :style="{'color': colour().light}">Right Defence</th>
            </tr>
            <tr v-for="i in Math.max(players.ld.length, players.rd.length)">
                <td v-if="i-1 < players.ld.length"
                :class="players.ld[i-1].class" 
                @click="selectPlayer(players.ld[i-1].id)">
                {{players.ld[i-1].name+' '+players.ld[i-1].overall}}</td>
                <td v-else></td>
                
                <td v-if="i-1 < players.rd.length"
                :class="players.rd[i-1].class" 
                @click="selectPlayer(players.rd[i-1].id)">
                {{players.rd[i-1].name+' '+players.rd[i-1].overall}}</td>
                <td v-else></td>
            </tr>
        </table>
        <table>
            <tr>
                <th :style="{'color': colour().light}">Goalies</th>
            </tr>
            <tr v-for="i in players.g.length">
                <td v-if="i-1 < players.g.length" 
                :class="players.g[i-1].class" 
                @click="selectPlayer(players.g[i-1].id)">
                {{players.g[i-1].name+' '+players.g[i-1].overall}}</td>
                <td v-else></td>
            </tr>
        </table>
    </div>
    `,
        data: function () {

            return {
                gameInfo: Vue.prototype.$gameInfo,
                players: this.teamPlayers(),
                lines: this.lineGen('init'),
                selectedId: false,
                alert: false,
                specialTeams: this.changeSpecial('init'),
                league: 'onehl'
            }
        },
        methods: {
            teamPlayers: function (state) {
                var players = {
                    'lw': [],
                    'c': [],
                    'rw': [],
                    'ld': [],
                    'rd': [],
                    'g': [],
                }

                if (this.league === undefined) {
                    var league = 'onehl'
                    var team = Vue.prototype.$gameInfo.player.team
                } else {
                    var league = this.league
                    const leagueConvert = { onehl: '1', twohl: '2', thrhl: '3' }
                    var team = leagueConvert[league] + Vue.prototype.$gameInfo.player.team.toString().slice(1, 3)
                }

                for (var curPlayer in Vue.prototype.$teams[league][team].players) {
                    var player = Vue.prototype.$players[Vue.prototype.$teams[league][team].players[curPlayer]]
                    players[player.position].push({
                        'id': player.id,
                        'name': player.name().abb,
                        'position': player.position,
                        'overall': player.overall()
                    })
                }
                this.players = players
                for (var position in players) {
                    players[position] = players[position].sort((a, b) => a.overall - b.overall).reverse()
                }

                return players
            },


            lineGen: function (state) {
                var players = this.players
                if (this.league === undefined) {
                    var league = 'onehl'
                    var team = Vue.prototype.$gameInfo.player.team
                } else {
                    var league = this.league
                    const leagueConvert = { onehl: '1', twohl: '2', thrhl: '3' }
                    var team = leagueConvert[league] + Vue.prototype.$gameInfo.player.team.toString().slice(1, 3)
                }

                if (state === 'init') {
                    var lines = JSON.parse(JSON.stringify(Vue.prototype.$teams[league][team].lines.v55))
                    lines.g = JSON.parse(JSON.stringify(Vue.prototype.$teams[league][team].lines.g))
                } else {
                    var lines = state.v55
                    lines.g = state.g
                }
                var lineReturn = {
                    'lw': [],
                    'c': [],
                    'rw': [],
                    'ld': [],
                    'rd': [],
                    'g': [],
                }
                const pos = ['lw', 'c', 'rw', 'ld', 'rd', 'g']
                const poslen = {
                    'lw': players.lw.length,
                    'c': players.c.length,
                    'rw': players.rw.length,
                    'ld': players.ld.length,
                    'rd': players.rd.length,
                    'g': players.g.length,
                }
                pos.forEach(function (position) {
                    for (var lineNum = 0; lineNum < lines[position].length; lineNum++) {
                        var player = Vue.prototype.$players[lines[position][lineNum]]

                        try {
                            lineReturn[position].push({
                                'name': player.name().abb,
                                'overall': player.overall(),
                                'class': '',
                                'id': player.id,
                                'position': player.position
                            })
                        } catch {
                            lineReturn[position].push({
                                'name': 'Empty',
                                'overall': ''
                            })
                        } //Empty Slot
                    }
                    for (var lineNum = 0; lineNum < poslen[position]; lineNum++) {
                        players[position][lineNum].class = ''
                    }
                })

                this.players = players
                this.lines = lineReturn
                return lineReturn
            },


            selectPlayer: function (id) {
                var players = this.players
                var lines = this.lines
                const pos = ['lw', 'c', 'rw', 'ld', 'rd', 'g']
                const poslen = {
                    'lw': players.lw.length,
                    'c': players.c.length,
                    'rw': players.rw.length,
                    'ld': players.ld.length,
                    'rd': players.rd.length,
                    'g': players.g.length,
                }
                pos.forEach(function (position) {
                    for (var lineNum = 0; lineNum < poslen[position]; lineNum++) {
                        try {
                            lines[position][lineNum].class = ''
                        } catch { }
                        try {
                            players[position][lineNum].class = ''
                        } catch { }
                        try {
                            if (id === lines[position][lineNum].id) {
                                lines[position][lineNum].class = 'roster-lines-selected-player'
                            }
                        } catch { }
                        if (id === players[position][lineNum].id) {
                            players[position][lineNum].class = 'roster-lines-selected-player'
                        }
                    }
                })
                this.players = players
                this.lines = lines
                this.selectedId = id
            },


            swapPlayer: function (position, line) {
                if (!this.selectedId) {
                    return
                }
                const player = Vue.prototype.$players[this.selectedId]
                var lines = this.lines
                const skaters = ['lw', 'c', 'rw', 'ld', 'rd']
                if (skaters.includes(position) === skaters.includes(player.position)) {
                    lines[position][line] = {
                        'name': player.name().abb,
                        'overall': player.overall(),
                        'class': '',
                        'id': player.id,
                        'position': player.position
                    }
                    this.lines = lines
                    this.alert = false
                    this.$forceUpdate()
                } else {
                    this.alert = 'Can\'t switch players and goalies'
                }
            },


            changeSpecial: function (type, id) {
                if (this.league === undefined) {
                    var league = 'onehl'
                    var team = Vue.prototype.$gameInfo.player.team
                } else {
                    var league = this.league
                    const leagueConvert = { onehl: '1', twohl: '2', thrhl: '3' }
                    var team = leagueConvert[league] + Vue.prototype.$gameInfo.player.team.toString().slice(1, 3)
                }
                if (type === 'init') {
                    var players = Vue.prototype.$teams[league][team].lines.specialTeams
                    this.specialTeams = { pp: { count: 10, players: players.pp, max: 10 }, pk: { count: 8, players: players.pk, max: 8 } }
                    return { pp: { count: 10, players: players.pp, max: 10 }, pk: { count: 8, players: players.pk, max: 8 } }
                }

                else {
                    if (this.specialTeams[type].players.includes(id)) {
                        this.specialTeams[type].count -= 1
                        this.specialTeams[type].players = this.specialTeams[type].players.filter(function (pid) { return pid != id })
                    }
                    else {
                        this.specialTeams[type].count += 1
                        this.specialTeams[type].players.push(id)
                    }
                }


            },


            checkSpecialClass: function (type, id) {
                if (this.specialTeams[type].players.includes(id)) {
                    return 'roster-lines-special-selected '
                }
                else {
                    return 'roster-lines-special-unselected '
                }
            },


            saveLines: function () {
                if (this.league === undefined) {
                    var league = 'onehl'
                    var team = Vue.prototype.$gameInfo.player.team
                } else {
                    var league = this.league
                    const leagueConvert = { onehl: '1', twohl: '2', thrhl: '3' }
                    var team = leagueConvert[league] + Vue.prototype.$gameInfo.player.team.toString().slice(1, 3)
                }
                const lines = this.lines
                const pos = ['lw', 'c', 'rw', 'ld', 'rd', 'g']
                var lineReturn = {
                    'lw': [],
                    'c': [],
                    'rw': [],
                    'ld': [],
                    'rd': [],
                    'g': [],
                }
                var duplicatePlayers = {}
                var noDupes = true
                var goodSpecialCount = true

                pos.forEach(function (position) {
                    for (var lineNum = 0; lineNum < lines[position].length; lineNum++) {
                        lineReturn[position].push(lines[position][lineNum].id)

                        if (lines[position][lineNum].id in duplicatePlayers) {
                            noDupes = false
                        }
                        duplicatePlayers[lines[position][lineNum].id] = 1
                    }
                })

                if (this.specialTeams.pk.count !== this.specialTeams.pk.max | this.specialTeams.pp.count !== this.specialTeams.pp.max) {
                    goodSpecialCount = false
                }

                if (noDupes & goodSpecialCount) {
                    var newv55 = {lw:[], c:[], rw: [], ld: [], rd:[]}

                    for (var position in newv55) {
                        for (var player in this.lines[position]) {
                            newv55[position].push(this.lines[position][player].id)
                        }
                    }

                    var newGoalies = [this.lines.g[0].id, this.lines.g[1].id]

                    this.alert = false
                    var special = { pp: this.specialTeams.pp.players, pk: this.specialTeams.pk.players }
                    Vue.prototype.$teams[league][team].generateLines(newv55, special, newGoalies)
                    Vue.prototype.$teams[league][team].lines.specialTeams = special
                    this.alert = 'Saved'
                } else {
                    if (!noDupes) {
                        this.alert = 'Can\'t have multiple lines with same player'
                    }
                    else if (!goodSpecialCount) {
                        this.alert = 'There should be 10 PP and 8 PK players selected'
                    }
                }

            },


            suggestedLines: function () {
                const leagueConvert = { onehl: '1', twohl: '2', thrhl: '3' }
                var team = leagueConvert[this.league] + Vue.prototype.$gameInfo.player.team.toString().slice(1, 3)

                var playerCount = {skater: 0, goalie: 0}
                for (var p=0; p < Vue.prototype.$teams[this.league][team].players.length; p++) {
                    var id = Vue.prototype.$teams[this.league][team].players[p]
                    if (Vue.prototype.$players[id].position === 'g') {
                        playerCount.goalie += 1
                    }
                    else {
                        playerCount.skater += 1
                    }
                }
                if (playerCount.skater >= 18 && playerCount.goalie >= 2) {
                    var gen = Vue.prototype.$teams[this.league][team].generateLines(false, false, false)
                    var lines = this.lineGen(gen)
                    this.lines = lines
                    this.specialTeams = { pp: { count: 10, players: gen.specialTeams.pp, max: 10 }, pk: { count: 8, players: gen.specialTeams.pk, max: 8 } }
                }
                else {
                    this.alert = 'Not Enough Players on Team, need 18 skaters and 2 goalies'
                }
            }

        }
    },



    negotiateContract: {
        mixins: [gMixin],
        template: `
    <div>
        <div v-if="available">
            <p>{{player.fullName}}</p>
            <p>Length 1-8 years</p>
            <p>Cap 1M - 15M</p>
            <a @click="addressChange('player',player.id,{})">Player Page</a>
            <p>{{'Ask: '+ask.cap+'M x'+ask.years+' years'}}</p>
            <input v-model="offer.cap" type="number">M</input>
            <input v-model="offer.years" type="number">years</input>
            <a @click="offerContract()">Offer</a>
            <p v-if="alert !== false">{{alert}}</p>
        </div>
        <div v-else>
            <p>This player is not available to negotiate with</p>
        </div>
    </div>
    `,
        data: function () {
            var pid = Vue.prototype.$gameInfo.page.sub.split('-')[1]
            var player = Vue.prototype.$players[pid]
            var available = true
            const playerTeam = player.team.toString().slice(1, 3)
            const userTeam = Vue.prototype.$gameInfo.player.team.toString().slice(1, 3)

            if ((Object.keys(player.newContract).length > 0) || (playerTeam !== userTeam & playerTeam !== '')) {
                var available = false
            }
            if (player.contract.years > 1) {
                player = []
            }
            return {
                player: player,
                ask: player.desiredContract(),
                offer: { years: 1, cap: 1 },
                alert: false,
                available: available
            }
        },
        methods: {

            offerContract: function () {
                var success = true
                var interest = 100

                interest -= Math.abs(this.ask.years - this.offer.years) * 6 ** 1.1
                interest += (this.offer.cap - this.ask.cap) * 5 ** 1.1

                if (parseInt(this.offer.years) !== parseFloat(this.offer.years)) {
                    this.alert = 'Invalid number of years'
                    success = false
                }
                else if (this.offer.years > 8) {
                    this.alert = 'The maximum contract length is 8 years'
                    success = false
                }
                else if (this.offer.years < 1) {
                    this.alert = 'Contracts can\'t last 0 years'
                    success = false
                }
                else if (this.offer.cap > 15) {
                    this.alert = 'The maximum contract cap is 12.5M'
                    success = false
                }
                else if (this.offer.cap < 1) {
                    this.alert = 'The minimum contract cap is 0.5M'
                    success = false
                }


                if (success & interest > 90 && Vue.prototype.$events.freeAgency.day === 'season') {
                    this.alert = 'Contract Accepted'
                    var player = Vue.prototype.$players[this.player.id]
                    if (player.contract.years === 0) {
                        Vue.prototype.$players[this.player.id].contract = {
                            cap: parseFloat(this.offer.cap),
                            years: parseInt(this.offer.years)
                        }
                        player.switchTeam(Vue.prototype.$gameInfo.player.team)
                        this.newNews('contract', Vue.prototype.$players[player.id])
                    }
                    else {
                        player.newContract = {
                            cap: parseFloat(this.offer.cap),
                            years: parseInt(this.offer.years)
                        }
                        this.newNews('extension', Vue.prototype.$players[player.id])
                    }
                }
                else if (Vue.prototype.$events.freeAgency.day !== 'season') {
                    this.alert = 'Contract will be considered'
                    if (typeof Vue.prototype.$events.freeAgency[this.player.id] === 'undefined') {
                        Vue.prototype.$events.freeAgency[this.player.id] = []
                    }
                    Vue.prototype.$events.freeAgency[this.player.id][Vue.prototype.$gameInfo.player.team] = {
                        cap: parseFloat(this.offer.cap),
                        years: parseInt(this.offer.years)
                    }
                }
                else {
                    this.alert = 'Contract Rejected'
                }

            }
        }
    },





    freeAgentPage: {
        mixins: [gMixin],
        template: `
    <div>
    <p>Free Agents</p>
    <div class="horizontal-buttons stats-filter">
        <a @click="currentTable = 'stats';      tableDisplay(currentTable)" :style="{'background': colour().main}">Stats</a>
        <a @click="currentTable = 'attributes'; tableDisplay(currentTable)" :style="{'background': colour().main}">Attributes</a>
        <a @click="htmlDisplay.filter = !htmlDisplay.filter" class="light-text" :style="{'background': colour().light}">Filter</a>
    </div>
    <div v-if="htmlDisplay.filter" style="display: inline-block; height: 30px">
        <a @click="htmlDisplay.positions = !htmlDisplay.positions" class="stats-page-filter-button hover-text">Positions</a>
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
                <tr v-for="(player, i) in players" 
                @click="selectedPlayer = player; htmlDisplay.selectedPlayer = true" class="hover-hand">
                    <td>{{scope[0]+1+i}}</td>
                    <td>{{player.name}}</td>
                    <td>{{player.position.toUpperCase()}}</td>
                    <td v-for="stat in table.row">{{player[stat]}}</td>
                </tr>
            </table>
        </div>
        <a @click="setScope('forward')" class="scope-change light" :style="{'background': colour().light}"> > </a>
    </div>

    <div v-if="htmlDisplay.selectedPlayer" class="selected-bar">
        <p>{{selectedPlayer.overall}}</p>
        <p>{{selectedPlayer.name}}</p>
        <div class="horizontal-buttons">
            <a @click="addressChange('player',selectedPlayer.id)"
            :style="{'background': colour().main}">Player Page</a>
            <a @click="addressChange('roster','negotiate-'+selectedPlayer.id)"
            :style="{'background': colour().main}">New Contract</a>
            <a @click=" htmlDisplay.selectedPlayer=false"
            :style="{'background': colour().main}">X</a>
        </div>
    </div>
    </div>
    `,

        data: function () {
            return {
                table: this.tableDisplay('stats'),
                players: this.filteredPlayers(['lw', 'c', 'rw', 'ld', 'rd'], 'points', true, [0, 10]),
                positions: ['lw', 'c', 'rw', 'ld', 'rd'],
                sortedBy: 'overall',
                sortedPositively: true,
                scope: [0, 10],
                htmlDisplay: { filter: false, positions: false, selectedPlayer: false },
                selectedPlayer: {},
                currentTable: 'stats'
            }
        },

        methods: {
            updatePlayers: function () {
                this.players = this.filteredPlayers(this.positions, this.sortedBy, this.sortedPositively, this.scope)
                if (this.players.length === 0) {
                    this.scope = [this.scope[0]-10, this.scope[1]-10]
                }
                this.players = this.filteredPlayers(this.positions, this.sortedBy, this.sortedPositively, this.scope)
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

            filteredPlayers: function (positions, sortedBy, sortedPositively, scope) {
                const season = Vue.prototype.$gameInfo.time.season
                const league = 'freeAgents'

                function getFreeAgents() {
                    var freeAgents = []
                    for (var n in Vue.prototype.$players[league]) {
                        var pid = Vue.prototype.$players[league][n]
                        var player = Vue.prototype.$players[pid]
                        freeAgents.push({
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
                        freeAgents[n] = Object.assign({}, freeAgents[n], player.attributes)
                    }
                    return freeAgents
                }

                function filterPlayers(players, positions) {
                    players = players.filter(player =>
                        (positions.includes(player.position)
                        ))

                    return players
                }

                var players = filterPlayers(getFreeAgents(), positions)

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

                try {
                    if (this.positions[0] === 'g') {
                        var goalie = true
                    }
                    else { var goalie = false }
                }
                catch { var goalie = false }

                if (type === 'stats') {
                    if (goalie) {
                        table.header = ['Name', 'Pos', 'Age', 'Overall', 'GP', 'Sv%', 'GAA', 'Svs', 'GA']
                        table.row = ['age', 'overall', 'gamesPlayed', 'savePctg', 'gaa', 'saves', 'goalsAgainst']
                    }
                    else {
                        table.header = ['Name', 'Pos', 'Age', 'Ovr', 'GP', 'PTS', 'G', 'A', 'Sht', 'PIM']
                        table.row = ['age', 'overall', 'gamesPlayed', 'points', 'goals', 'assists', 'shots', 'pim']
                    }
                }
                if (type === 'attributes') {
                    if (goalie) {
                        table.header = ['Name', 'Pos', 'Age', 'Overall', 'Glove', 'Blocker', 'Pads', 'Rebounds', 'Puck', 'Reflexes', 'Strength', 'Stamina', 'IQ', 'Work', 'Confidence']
                        table.row = ['age', 'overall', 'glove', 'blocker', 'pads', 'rebounds', 'puck', 'reflex', 'strength', 'stamina', 'iq', 'work', 'confidence']
                    }
                    else {
                        table.header = ['Name', 'Pos', 'Age', 'OIQ', 'Wrist', 'Slap', 'Hands', 'DIQ', 'Stickwork', 'Blocking', 'Hitting', 'Skating', 'Passing',
                            'Hand Eye', 'Face Off', 'Strength', 'Stamina', 'Hustle', 'Discipline']
                        table.row = ['age', 'oiq', 'wrist', 'slap', 'hands', 'diq', 'stick', 'blocking', 'hitting', 'skating', 'passing', 'handEye', 'faceOff',
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

            changeSort: function (type) {
                type = this.table.row[this.table.header.indexOf(type) - 2]
                if (type === this.sortedBy) {
                    this.sortedPositively = !this.sortedPositively
                }
                this.sortedBy = type
                this.updatePlayers()
            }

        }
    }

}

