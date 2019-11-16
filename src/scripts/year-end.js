// The year ends at the end of June 30th, July 1st and free agency marks the next year
module.exports = {

    retirees: function () {
        for (var n in Vue.prototype.$players) {
            if (!isNaN(n)) {
                var player = Vue.prototype.$players[n]
                if (player.age > 34 && player.contract.years === 0 && isNaN(player.newContract.years)) {
                    if (Math.random() > 0.5) {
                        var userTeam = Vue.prototype.$gameInfo.player.team.toString()
                        var userTeams = [userTeam, '2' + userTeam.slice(1), '3' + userTeam.slice(1)]

                        if (userTeams.includes(player.team.toString())) {
                            this.newNews('retire', player)
                        }
                        player.retire()
                    }
                }
                else if (player.age > 23 && player.overall < 50 && player.contract.years === 0 && isNaN(player.newContract.years) ) {
                    var userTeam = Vue.prototype.$gameInfo.player.team.toString()
                    var userTeams = [userTeam, '2' + userTeam.slice(1), '3' + userTeam.slice(1)]

                    if (userTeams.includes(player.team.toString())) {
                        this.newNews('retire', player)
                    }
                    player.retire()
                }
            }
        }
    },

    yearEnd: function yearEnd() {
        var self = this

        function updatePlayers() {
            for (var n in Vue.prototype.$players) {
                if (!isNaN(n)) {
                    var player = Vue.prototype.$players[n]
                    player.age += 1

                    //Reset progression
                    for (var attribute in player.progression) {
                        player.progression[attribute] = 0
                    }

                    //Move stats back one year, remembers 4 years
                    const season = Vue.prototype.$gameInfo.time.season + 1
                    player.stats[season] = player.generateStats()
                    for (var n = 1; n < 4; n++) {
                        try {
                            player.stats[season - n] = JSON.parse(JSON.stringify(player.stats[season - (n + 1)]))
                        }
                        catch {//hasn't played in the league that long
                        }
                    }

                    //Releases players without contract, ages contract, appends extensions
                    if (player.contract.years !== 0) {
                        player.contract.years -= 1
                    }
                    else {
                        if (player.contract.cap === 0) {
                            player.contract.years = 0
                            continue
                        }
                        else if (Object.keys(player.newContract).length === 0) {
                            player.release()
                        }
                        else {
                            player.contract = JSON.parse(JSON.stringify(player.newContract))
                            player.newContract = {}
                        }
                    }

                    for (var pid in Vue.prototype.$players) {
                        if (typeof pid === 'undefined') {
                            if (typeof Vue.prototype.$players[pid] === 'undefined') {
                                delete Vue.prototype.$players[pid]
                            } 
                        }
                    }
                }
            }
        }

        function updateGameInfo() {
            var game = Vue.prototype.$gameInfo
            game.time.season += 1

            for (var area in game.scouting) {
                game.scouting[area].points = 0
            }


        }

        function updateProspects() {
            Vue.prototype.$events.draft = {}
            const startingList = JSON.parse(JSON.stringify(Vue.prototype.$players.prospects))
            for (var p = 0; p < startingList.length; p++) {
                Vue.prototype.$players[startingList[p]].retire()
            }

            for (var region in Vue.prototype.$teams.prospects) {
                Vue.prototype.$teams.prospects[region].players = []
            }

            self.prospectGen()
        }

        function updateFreeAgents() {
            var allAdded = []

            //Skaters
            for (var n = 0; n < 60; n++) {
                var player = new Vue.prototype.$class.Player.Player({
                    type: 'free agent',
                    position: 'any'
                })
                Vue.prototype.$players[player.id] = player
                allAdded.push({ id: player.id, overall: player.overall() })
            }
            //Goalies            
            for (var n = 0; n < 10; n++) {
                var player = new Vue.prototype.$class.Player.Player({
                    type: 'free agent',
                    position: 'g'
                })
                Vue.prototype.$players[player.id] = player
                allAdded.push({ id: player.id, overall: player.overall() })
            }



            allAdded = allAdded.sort((a, b) => a.overall - b.overall).reverse()
            self.newNews('free agent', [allAdded[0].id, allAdded[1].id])
        }

        function updateTeams() {
            for (var league in { onehl: 0, twohl: 0, thrhl: 0 }) {
                for (var tid in Vue.prototype.$teams[league]) {
                    var team = Vue.prototype.$teams[league][tid]

                    //Reset team stats
                    for (var stat in team.stats) {
                        team.stats[stat] = 0
                    }


                    if (league === 'onehl') {
                        //Update draft picks
                        const season = Vue.prototype.$gameInfo.time.season + 1
                        delete team.picks[season]
                        team.picks[season + 2] = [{ round: 1, team: team.id }, { round: 2, team: team.id }, { round: 3, team: team.id }, { round: 4, team: team.id }, { round: 5, team: team.id }, { round: 6, team: team.id }, { round: 7, team: team.id }]

                        team.sortRoster()
                    }
                }
            }
        }
        Vue.prototype.$events.freeAgency = { day: 1 }

        updatePlayers()
        updateGameInfo()
        updateProspects()
        updateFreeAgents()
        updateTeams()

        this.newNews('cap')
        this.newNews('Free agency has begun!', false)
    }
}