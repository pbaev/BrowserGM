module.exports = {

    generateGame: function () {
        var self = this
        function startingPlayers() {
            for (var n = 0; n < 1960; n++) {
                var player = new Vue.prototype.$class.Player.Player({
                    type: 'start',
                    position: 'any'
                })
                Vue.prototype.$players[player.id] = player
            }
            for (var n = 0; n < 205; n++) {
                var player = new Vue.prototype.$class.Player.Player({
                    type: 'start',
                    position: 'g'
                })
                Vue.prototype.$players[player.id] = player
            }
        }

        function startingTeams() {
            for (var team = 100; team < 132; team++) {
                Vue.prototype.$teams.onehl[team] = new Vue.prototype.$class.Team.Team({
                    id: team,
                    league: 'onehl'
                })
            }

            for (var team = 200; team < 232; team++) {
                Vue.prototype.$teams.twohl[team] = new Vue.prototype.$class.Team.Team({
                    id: team,
                    league: 'twohl'
                })
            }

            for (var team = 300; team < 332; team++) {
                Vue.prototype.$teams.thrhl[team] = new Vue.prototype.$class.Team.Team({
                    id: team,
                    league: 'thrhl'
                })
            }
        }

        function startingDraft() {
            var nextPlayerTo = 100
            var nextGoalieTo = 100
            var teamGoalies = {}
            var teamPlayers = {}
            const freeAgentlist = JSON.parse(JSON.stringify(Vue.prototype.$players.freeAgents))
            for (var p = 0; p < freeAgentlist.length; p++) {
                var player = Vue.prototype.$players[freeAgentlist[p]]

                if (player.position === 'g' && (teamGoalies[nextGoalieTo] < 6 || isNaN(teamGoalies[nextGoalieTo]))) {
                    player.switchTeam(nextGoalieTo)
                    if (isNaN(teamGoalies[nextGoalieTo])) {
                        teamGoalies[nextGoalieTo] = 1
                    }
                    else {
                        teamGoalies[nextGoalieTo] += 1
                    }
                    nextGoalieTo++
                }
                else if (player.position !== 'g' && (teamPlayers[nextPlayerTo] < 60 || isNaN(teamPlayers[nextPlayerTo]))) {
                    if (player.age < 21) {
                        player.league = 'prospects'
                        Vue.prototype.$players.freeAgents = Vue.prototype.$players.freeAgents.filter(function (pid) { return pid !== player.id })
                    }
                    player.switchTeam(nextPlayerTo)

                    if (isNaN(teamPlayers[nextPlayerTo])) {
                        teamPlayers[nextPlayerTo] = 1
                    }
                    else {
                        teamPlayers[nextPlayerTo] += 1
                    }
                    nextPlayerTo++
                }
                if (nextPlayerTo >= 132) {
                    nextPlayerTo = 100
                }
                else if (nextGoalieTo >= 132) {
                    nextGoalieTo = 100
                }
            }
        }

        function manageRosters() {
            for (var league in { onehl: 0, twohl: 0, thrhl: 0 }) {
                for (var team in Vue.prototype.$teams[league]) {
                    if (league === 'onehl') {
                        Vue.prototype.$teams.onehl[team].sortRoster()
                    }
                    Vue.prototype.$teams[league][team].generateLines(false, false, false)
                }
            }

            for (var player in Vue.prototype.$players.freeAgents) {
                Vue.prototype.$players[Vue.prototype.$players.freeAgents[player]].contract = { cap: 0, years: 0 }
            }
        }

        startingPlayers()
        startingTeams()
        startingDraft()
        manageRosters()
        this.prospectGen()
    },





}