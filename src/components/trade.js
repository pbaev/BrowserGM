const gMixin = require('../scripts/main.js')

module.exports = {
    tradePage: {
        mixins: [gMixin],
        template: `
    <div>
        <div v-if="gameInfo.page.sub === '' & !deadline">
            <p>Trade Central</p>
            <table v-for="type in ['user','cpu']" class="trade-page-table">
                <caption v-if="type === 'user'" :style="{'color': colour().main}">{{teams[type].name+' '+teams[type].cap+' M'}}</caption>
                <caption v-else :style="{'color': colour().light}">{{teams[type].name+' '+teams[type].cap+' M'}}</caption>
                <tr>
                    <th></th>
                    <th>Player</th>
                    <th>Position</th>
                    <th>Overall</th>
                    <th>Age</th>
                    <th>Contract</th>
                    <th>Value</th>
                </tr>
                <tr v-for="player in teams[type].tradePlayers">
                    <td><a @click="removePlayer(type, player.id)" :style="{'background': colour().main}">x</a>
                    <td v-if="!isNaN(player.age)" @click="addressChange('player',player.id,{tradeTeams:teams})">{{player.name}}</td>
                    <td v-if="!isNaN(player.age)">{{player.position}}</td>  <td v-else>{{player.season}}</td>
                    <td v-if="!isNaN(player.age)">{{player.overall}}</td>   <td v-else>{{player.team}}</td>
                    <td v-if="!isNaN(player.age)">{{player.age}}</td>       <td v-else>{{player.round}}</td>
                    <td v-if="!isNaN(player.age)">{{player.contract}}</td>  <td v-else>-</td>
                    <td><div class="trade-value-bar" :style="{'background': colour().light, 'width': player.value+'%'}"></div></td>
                </tr>
                <tr>
                    <td><a @click="addressChange('trade','rosters',{}); teamSelect = type" :style="{'background': colour().main}">+</a></td>
                </tr>
            </table>
    
            <div class="trade-team-value-bar" id="home" :style="{'background': colour().main, 'width': value.user+'%'}"></div>
            <div class="trade-team-value-bar" id="away" :style="{'background': colour().light, 'width': value.cpu+'%'}"></div>

            <div class="horizontal-buttons">
                <a @click="changeTeam('display')" :style="{'background': colour().main}">Change Team</a>
                <a @click="attemptTrade()" :style="{'background': colour().main}">Offer Trade</a>
            </div>
            <div v-if="dropdown.display" class="roster-dropdown">
                <a v-for="team in dropdown.teams" @click="changeTeam(team.id)">{{team.city}}</a>
            </div>
            <p v-if="alert !== false">{{alert}}</p>
        </div>
    
        <div v-if="gameInfo.page.sub === 'rosters' ">
            <div class="horizontal-buttons">
                <a @click="league = 'onehl'"   :style="{'background': colour().main}">1HL</a>
                <a @click="league = 'twohl'"   :style="{'background': colour().main}">2HL</a>
                <a @click="league = 'thrhl'"   :style="{'background': colour().main}">3HL</a>
                <a @click="league = 'juniors'" :style="{'background': colour().main}">JHL</a>
                <a @click="league = 'picks'"   :style="{'background': colour().main}">Picks</a>
            </div>

            <table v-if="league === 'picks'" class="trade-page-table">
                <caption>{{teams[teamSelect].name}}</caption>
                <tr>
                    <th></th>
                    <th>Season</th>
                    <th>Team</th>
                    <th>Round</th>
                    <th>Value</th>
                </tr>
                <tr v-for="pick in teams[teamSelect].roster[league]">
                    <td v-if="!teams[teamSelect].tradePlayers.includes(pick)">
                        <a @click="addPlayer(pick)" :style="{'background': colour().main}">+</a></td>
                    <td v-else></td>
                    <td>{{pick.season}}</td>
                    <td>{{pick.teamName}}</td>
                    <td>{{pick.round}}</td>
                    <td><div class="trade-value-bar" :style="{'background': colour().light, 'width': pick.value+'%'}"></div></td>
                </tr>
            </table>            

            <table v-else class="trade-page-table">
            <caption>{{teams[teamSelect].name}}</caption>
                <tr>
                    <th></th>
                    <th>Player</th>
                    <th>Position</th>
                    <th>Overall</th>
                    <th>Age</th>
                    <th>Contract</th>
                    <th>Value</th>
                </tr>
                <tr v-for="player in teams[teamSelect].roster[league]">
                    <td v-if="!teams[teamSelect].tradePlayers.includes(player)">
                        <a @click="addPlayer(player.id)" :style="{'background': colour().main}">+</a></td>
                    <td v-else></td>
                    <td @click="addressChange('player',player.id,{tradeTeams:teams})">{{player.name}}</td>
                    <td>{{player.position}}</td>
                    <td>{{player.overall}}</td>
                    <td>{{player.age}}</td>
                    <td>{{player.contract}}</td>
                    <td><div class="trade-value-bar" :style="{'background': colour().light, 'width': player.value+'%'}"></div></td>
                </tr>
            </table>
        </div>
        <div v-if="gameInfo.page.sub === 'tradeComplete' ">
            <p>Trade Accepted</p>
            <p>Make sure to update your lines and roster</p>
            <p>{{'To '+teams.user.id}}</p>
            <p v-for="player in this.teams.cpu.tradePlayers" @click="addressChange('player',player.id,{})">
                {{player.name}}
            </p>
            <p>{{'To '+teams.cpu.id}}</p>
            <p v-for="player in this.teams.user.tradePlayers" @click="addressChange('player',player.id,{})">
                {{player.name}}
            </p>
            <button @click="endTrade()">Close</button>
        </div>
    
        <div v-if="deadline">
        <p>The trade deadline has passed</p>
        </div>
    </div>
    `,
        data: function () {
            var userTeam = Vue.prototype.$gameInfo.player.team
            var teamList = []
            for (var team in Vue.prototype.$teams.onehl) {
                teamList.push({
                    name: Vue.prototype.$teams.onehl[team].name.full,
                    city: Vue.prototype.$teams.onehl[team].name.city,
                    id: Vue.prototype.$teams.onehl[team].id
                })
            }
            teamList = teamList.filter(function (team) {
                return team !== userTeam
            })
            if (userTeam === 100) {
                var cpuTeam = 101
            } else {
                var cpuTeam = 100
            }

            if (Object.keys(Vue.prototype.$gameInfo.page.details).length > 0) {
                var teams = Vue.prototype.$gameInfo.page.details.tradeTeams
            }
            else {
                var teams = {
                    user: {
                        id: userTeam,
                        name: Vue.prototype.$teams.onehl[userTeam].name.full,
                        roster: this.teamRoster(userTeam),
                        cap: Vue.prototype.$teams.onehl[userTeam].capSpent(),
                        tradePlayers: []
                    },
                    cpu: {
                        id: cpuTeam,
                        name: Vue.prototype.$teams.onehl[cpuTeam].name.full,
                        roster: this.teamRoster(cpuTeam),
                        cap: Vue.prototype.$teams.onehl[cpuTeam].capSpent(),
                        tradePlayers: []
                    }
                }
            }

            return {
                gameInfo: Vue.prototype.$gameInfo,
                league: 'onehl',
                teams: teams,
                alert: false,
                screen: { main: true, tradeComplete: false, rosters: false },
                teamSelect: 'user',
                dropdown: {
                    display: false,
                    teams: teamList
                },
                deadline: this.checkDeadline(),
                value: { user: 0, cpu: 0 },
                alert: false,
            }
        },
        created() {
            this.screen = { main: true, tradeComplete: false, rosters: false }
        },
        methods: {
            checkDeadline: function () {
                // returns true if trade deadline has been passed
                var currentDate = Vue.prototype.$gameInfo.time.date
                var deadline = { day: 15, month: 1, year: Vue.prototype.$gameInfo.time.season }
                return this.laterDate(currentDate, deadline)
            },


            removePlayer: function (team, id) {
                var players = this.teams[team].tradePlayers
                for (var i = 0; i < players.length; i++) {
                    if (players[i].id === id) {
                        this.value[team] -= players[i].value
                        players.splice(i, 1)
                    }
                }
                this.teams[team].tradePlayers = players
            },

            teamRoster: function (team) {
                var teams = [team, '2' + team.toString().slice(1, 3), '3' + team.toString().slice(1, 3)]
                var team = Vue.prototype.$teams.onehl[team]
                var leagues = { onehl: 0, twohl: 0, thrhl: 0, juniors: 0 }
                var n = 0
                for (var league in leagues) {
                    var players = []
                    if (league === 'juniors') {
                        var teamList = Vue.prototype.$teams.onehl[teams[0]].juniors
                    }
                    else {
                        var teamList = Vue.prototype.$teams[league][teams[n]].players
                    }
                    for (var curPlayer in teamList) {
                        var player = Vue.prototype.$players[teamList[curPlayer]]
                        players.push({
                            id: player.id,
                            name: player.name().abb,
                            position: player.position,
                            overall: player.overall(),
                            age: player.age,
                            contract: player.contract.cap + 'M x ' + player.contract.years + 'Y',
                            value: player.tradeValue()
                        })
                    }
                    leagues[league] = players
                    n += 1
                }

                //Picks
                leagues.picks = []
                for (var year in team.picks) {
                    for (var pick in team.picks[year]) {
                        var p = team.picks[year][pick]
                        if (p.player === false) {
                            if (p.round >= 4) {
                                var pickValue = 2
                            }
                            else {
                                var pickTeamRank = Vue.prototype.$teams.onehl[p.team].rank('points',false)
                                var pickPosition = ((p.round - 1) * 32) + pickTeamRank + 1
                                var pickValue = parseInt((0.025*pickPosition - 3.3)**4) + 2
                            }

                            leagues.picks.push({
                                season: year,
                                team: p.team,
                                teamName: Vue.prototype.$teams.onehl[p.team].name.abb,
                                round: p.round,
                                value: pickValue,
                                position: p.position,
                                player: null
                            })
                        }
                    }
                }
                leagues.picks = leagues.picks.sort((a, b) => { return a.season - b.season })
                return leagues
            },


            addPlayer: function (id) {
                var teams = this.teams
                var selected = this.teamSelect

                if (typeof id === 'object') {
                    //id is actually a pick object
                    teams[selected].tradePlayers.push(id)
                    this.value[selected] += id.value
                }
                else {
                    for (var player in teams[selected].roster[this.league]) {
                        if (teams[selected].roster[this.league][player].id === id) {
                            this.value[selected] += teams[selected].roster[this.league][player].value
                            teams[selected].tradePlayers.push(teams[selected].roster[this.league][player])
                        }
                    }
                }
                this.teams = teams
            },


            attemptTrade: function () {
                var success = true

                var valueDifference = this.value.user - this.value.cpu

                if (valueDifference > 0) {
                    var success = true
                    this.alert = false
                }
                else {
                    var success = false
                    this.alert = 'Trade Rejected'
                }

                if (success) {
                    const otherTeam = {user: this.teams.cpu.id, cpu: this.teams.user.id}
                    for (var team in this.teams) {
                        for (var p = 0; p < this.teams[team].tradePlayers.length; p++) {
                            if (!isNaN(this.teams[team].tradePlayers[p].id)) {
                                var player = Vue.prototype.$players[this.teams[team].tradePlayers[p].id]
                                if (player.league === 'juniors') {
                                    player.switchTeam(otherTeam[team])
                                }
                                else {
                                    player.switchTeam(this.teamConvert(player.league,otherTeam[team] ))
                                }
                            }
                            else {
                                var pick = this.teams[team].tradePlayers[p]
                                Vue.prototype.$teams.onehl[otherTeam[team]].changePicks('add', pick)
                                Vue.prototype.$teams.onehl[this.teams[team].id].changePicks('remove', pick)
                            }
                        }
                    }

                    Vue.prototype.$teams.onehl[this.teams.cpu.id].sortRoster()
                    Vue.prototype.$teams.onehl[this.teams.cpu.id].generateLines(false, false, false)
                    Vue.prototype.$teams.twohl[this.teamConvert('twohl', this.teams.cpu.id)].generateLines(false, false, false)
                    Vue.prototype.$teams.thrhl[this.teamConvert('thrhl', this.teams.cpu.id)].generateLines(false, false, false)

                    Vue.prototype.$gameInfo.page.sub = 'tradeComplete'
                }
                this.value = { user: 0, cpu: 0 }


            },
            changeTeam: function (display) {
                if (display === 'display') {
                    this.dropdown.display = !this.dropdown.display
                } else {
                    this.dropdown.display = false
                    this.teams.cpu.id = display
                    this.teams.cpu.tradePlayers = []
                    this.teams.cpu.roster = this.teamRoster(display)
                    this.teams.cpu.name = Vue.prototype.$teams.onehl[display].name.full
                }
            },
            endTrade: function () {
                var userTeam = Vue.prototype.$gameInfo.player.team
                this.teams = {
                    'user': {
                        'id': userTeam,
                        'roster': this.teamRoster(userTeam),
                        'tradePlayers': []
                    },
                    'cpu': {
                        'id': this.teams.cpu.id,
                        'roster': this.teamRoster(this.teams.cpu.id),
                        'tradePlayers': []
                    }
                }
                Vue.prototype.$gameInfo.page.sub = ''
            }
        }

    }
}