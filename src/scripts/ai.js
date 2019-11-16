module.exports = {
    cleanTeamRosters: function () {
        for (var t in Vue.prototype.$teams.onehl) {
            Vue.prototype.$teams.onehl[t].sortRoster()
            if (t == Vue.prototype.$gameInfo.player.team &&
                !Vue.prototype.$gameInfo.autoRoster) {
                continue
            }
        }
        for (var league in { onehl: 0, twohl: 0, thrhl: 0 }) {
            for (var t in Vue.prototype.$teams[league]) {
                if (t == Vue.prototype.$gameInfo.player.team &&
                    !Vue.prototype.$gameInfo.autoRoster) {
                    continue
                }
                Vue.prototype.$teams[league][t].generateLines(false, false, false)
            }
        }
    },

    freeAgencyUpdate: function () {
        var self = this
        var fa = Vue.prototype.$events.freeAgency

        function generateOffers(type) {
            var sortedFreeAgents = JSON.parse(JSON.stringify(Vue.prototype.$players.freeAgents))
            sortedFreeAgents = sortedFreeAgents.map(pid =>
                ({ id: pid, overall: Vue.prototype.$players[pid].overall() }))
            sortedFreeAgents = sortedFreeAgents.sort((a, b) => a.overall - b.overall).reverse()

            for (var t in Vue.prototype.$teams.onehl) {
                var team = Vue.prototype.$teams.onehl[t]
                if (team.id == Vue.prototype.$gameInfo.player.team &&
                    !Vue.prototype.$gameInfo.autoRoster) {
                    continue
                }
                var depth = team.playerPositionSummary().all
                var totalSkaters = depth.lw + depth.c + depth.rw + depth.ld + depth.rd
                var totalGoalies = depth.g
                var needs = team.playerPositionSummary().cap

                if (type === 'needs') {
                    needs = { lw: 4 - needs.lw, c: 4 - needs.c, rw: 4 - needs.rw, ld: 3 - needs.ld, rd: 3 - needs.rd, g: 2 - needs.g }
                }
                else if (type === 'depth') {
                    needs = { lw: 12 - depth.lw, c: 12 - depth.c, rw: 12 - depth.rw, ld: 9 - depth.ld, rd: 9 - depth.rd, g: 6 - depth.g }
                }
                var capLeft = team.capSpent(true)

                function priority() {
                    //list in order the positions that should be signed
                    var priorityList = Object.keys(needs)
                    priorityList.sort((a, b) => needs[a] - needs[b]).reverse()
                    for (var n = 0; n < priorityList.length; n++) {
                        var pos = priorityList[n]
                        if (needs[pos] <= 0) {
                            delete needs[pos]
                            priorityList = priorityList.filter(position => position !== pos)
                        }
                    }
                    return priorityList
                }


                while (priority().length > 0 && (totalGoalies < 6 || totalSkaters < 55)) {
                    var pos = priority()[0]
                    for (var p = 0; p < sortedFreeAgents.length; p++) {
                        var player = Vue.prototype.$players[sortedFreeAgents[p].id]

                        if (typeof Vue.prototype.$events.freeAgency[player.id] === 'undefined') {
                            var firstOffer = true
                            var offeredContract = false
                        }
                        else if (typeof Vue.prototype.$events.freeAgency[player.id][team.id] === 'undefined') {
                            var firstOffer = false
                            var offeredContract = false
                        }
                        else {
                            var offeredContract = true
                        }

                        if (((player.position === pos)) && !offeredContract) {
                            var contract = player.desiredContract()
                            if (player.overall() > 80) {
                                contract.cap += (self.rnd(-15, 15)) * 0.1
                            }
                            else if (player.overall > 76) {
                                contract.cap += (self.rnd(-4, 4)) * 0.1
                            }
                            else if (player.overall() > 72) {
                                contract.cap += (self.rnd(-1, 1)) * 0.1
                            }
                            if (contract.cap > capLeft) {
                                contract.cap = capLeft - 0.1
                                if (capLeft < 1) {
                                    contract.cap = 1
                                }
                            }
                            if (contract.cap < 1) { contract.cap = 1 }
                            if (contract.cap > 15) { contract.cap = 15 }
                            contract.years += self.rnd(-1, 1)
                            if (contract.years < 1) { contract.years = 1 }
                            if (contract.years > 8) { contract.years = 8 }
                            contract.cap = parseFloat(contract.cap.toFixed(2))
                            if (firstOffer) {
                                Vue.prototype.$events.freeAgency[player.id] = {}
                            }
                            Vue.prototype.$events.freeAgency[player.id][team.id] = contract
                            if (pos === 'g') { totalGoalies += 1 }
                            else { totalSkaters += 1 }
                            if (type === 'depth') {
                                capLeft -= (contract.cap - 1)
                            }
                            else {
                                capLeft -= contract.cap
                            }
                            needs[pos] -= 1
                            break
                        }
                        if (p === sortedFreeAgents.length - 1) {
                            delete needs[pos]
                        }
                    }
                }
            }
        }

        function acceptOffers() {
            for (var id in Vue.prototype.$events.freeAgency) {
                if (id === 'day') { continue }
                var player = Vue.prototype.$players[id]
                var offers = []
                var desired = player.desiredContract()
                for (var o in Vue.prototype.$events.freeAgency[player.id]) {
                    var offer = Vue.prototype.$events.freeAgency[player.id][o]
                    var yearDifference = Math.abs(offer.years - desired.years)
                    var capDifference = offer.cap - desired.cap

                    var offer = Vue.prototype.$events.freeAgency[player.id][o]
                    var value = offer.cap * (offer.years - yearDifference)

                    if (yearDifference <= 1 && capDifference > -1) {
                        offers.push({ team: o, value: value, contract: offer })
                    }
                }

                offers = offers.sort((a, b) => a.value - b.value).reverse()
                // Accepting the best offer if valid
                for (var n = 0; n < offers.length; n++) {
                    var forceAccept = false
                    if (player.desiredContract().cap === 1 && player.desiredContract().years === 1) {
                        n = self.rnd(0, offers.length - 1)
                        forceAccept = true
                    }
                    if (Vue.prototype.$teams.onehl[offers[n].team].capSpent(true) > 0 || forceAccept) {
                        player.switchTeam(offers[n].team)
                        player.contract = offers[n].contract

                        if (Vue.prototype.$gameInfo.player.team == offers[n].team) {
                            self.newNews('contract', player)
                        }
                        delete Vue.prototype.$events.freeAgency[player.id]
                        break
                    }
                }
            }
        }

        // duplicate generateOffers() are to account for needs not met due to
        // players signing with other teams
        if (fa.day === 1) {
            generateOffers('depth')
            generateOffers('needs')
            generateOffers('needs')
        }
        else if ([4, 6, 8, 10, 12, 14].includes(fa.day)) {
            acceptOffers()
            generateOffers('needs')
            generateOffers('depth')
        }
        else if ([15, 16, 17, 18, 20, 22, 24].includes(fa.day)) {
            acceptOffers()
            generateOffers('depth')
            generateOffers('depth')
        }
        else if (fa.day > 24) {
            acceptOffers()
            generateOffers('depth')
            generateOffers('depth')
        }
        else if (fa.day === 30) {
            Vue.prototype.$events.freeAgency.day = {day: 'finished'}

        }

        fa.day++
    },

    signNecessaryDepth: function () {
        for (var t in Vue.prototype.$teams.onehl) {
            var sortedFreeAgents = JSON.parse(JSON.stringify(Vue.prototype.$players.freeAgents))
            sortedFreeAgents = sortedFreeAgents.map(pid =>
                ({ id: pid, overall: Vue.prototype.$players[pid].overall() }))
            sortedFreeAgents = sortedFreeAgents.sort((a, b) => a.overall - b.overall).reverse()

            var team = Vue.prototype.$teams.onehl[t]

            if (team.id == Vue.prototype.$gameInfo.player.team &&
                !Vue.prototype.$gameInfo.autoRoster) {
                continue
            }

            var depth = team.playerPositionSummary().all
            var totalSkaters = depth.lw + depth.c + depth.rw + depth.ld + depth.rd


            for (var p = 0; p < sortedFreeAgents.length; p++) {
                var player = Vue.prototype.$players[sortedFreeAgents[p].id]

                if (player.position === 'g' && depth.g < 6) {
                    player.contract = { cap: 1, years: 1 }
                    player.switchTeam(t)
                    depth.g += 1
                }
                else if (player.position !== 'g' && totalSkaters < 55) {
                    player.contract = { cap: 1, years: 1 }
                    player.switchTeam(t)
                    totalSkaters += 1
                }
            }
            //Create new players if not enough in free agency
            if (depth.g < 6) {
                for (var n = 0; n < (6 - depth.g); n++) {
                    var player = new Vue.prototype.$class.Player.Player({
                        type: 'depth',
                        position: 'g'
                    })
                    player.contract = { years: 1, cap: 1 }
                    player.switchTeam(t)
                }
                depth.g = 6
            }
            if (totalSkaters < 55) {
                for (var n = 0; n < (55 - totalSkaters); n++) {
                    var player = new Vue.prototype.$class.Player.Player({
                        type: 'depth',
                        position: 'any'
                    })
                    player.contract = { years: 1, cap: 1 }
                    player.switchTeam(t)
                }
                totalSkaters = 55
            }

            Vue.prototype.$teams.onehl[t].sortRoster()
            Vue.prototype.$teams.onehl[t].generateLines(false, false, false)
        }
    },
    tradeForNeeds: function () {
        var wantTeams = { lw: [], c: [], rw: [], ld: [], rd: [] }
        var haveTeams = { lw: [], c: [], rw: [], ld: [], rd: [] }
        for (var tid in Vue.prototype.$teams.onehl) {
            var team = Vue.prototype.$teams.onehl[tid]
            if (team.id == Vue.prototype.$gameInfo.player.team &&
                !Vue.prototype.$gameInfo.autoRoster) {
                continue
            }
            var depth = team.playerPositionSummary().cap
            var cap = { lw: 4 - depth.lw, c: 4 - depth.c, rw: 4 - depth.rw, ld: 3 - depth.ld, rd: 3 - depth.rd }
            for (var pos in cap) {
                if (cap[pos] > 0) {
                    wantTeams[pos].push(team.id)
                }
                else if (cap[pos] < 0) {
                    haveTeams[pos].push(team.id)
                }
            }
        }

        for (var pos in wantTeams) {
            for (var wantIndex = 0; wantIndex < wantTeams[pos].length; wantIndex++) {
                for (var haveIndex = 0; haveIndex < haveTeams[pos].length; haveIndex++) {
                    if (wantIndex === haveIndex || wantTeams[pos][wantIndex] === 'traded' || haveTeams[pos][haveIndex] === 'traded') { continue }
                    var wantTeam = Vue.prototype.$teams.onehl[wantTeams[pos][wantIndex]]
                    var haveTeam = Vue.prototype.$teams.onehl[haveTeams[pos][haveIndex]]

                    var wantPlayers = wantTeam.allPlayers(false).filter(pid => (Vue.prototype.$players[pid].overall() > 76))
                    var havePlayers = haveTeam.allPlayers(false).filter(pid => (Vue.prototype.$players[pid].overall() > 76 && Vue.prototype.$players[pid].position === pos))


                    var tradeMade = false
                    for (var p1 = 0; p1 < havePlayers.length; p1++) {
                        for (var p2 = 0; p2 < wantPlayers.length; p2++) {
                            var havePlayer = Vue.prototype.$players[havePlayers[p1]]
                            var wantPlayer = Vue.prototype.$players[wantPlayers[p2]]

                            if (wantTeams[havePlayer.position].includes(wantTeam.id) &&
                                (haveTeam.capSpent(true) - wantPlayer.contract.cap) > 0 &&
                                (wantTeam.capSpent(true) - havePlayer.contract.cap) > 0 &&
                                Math.abs(havePlayer.tradeValue() - wantPlayer.tradeValue()) < 4) {

                                havePlayer.switchTeam(wantTeam.id)
                                wantPlayer.switchTeam(haveTeam.id)
                                haveTeams[pos][haveTeams[pos].indexOf(haveTeam.id)] = 'traded'
                                wantTeams[pos][wantTeams[pos].indexOf(wantTeam.id)] = 'traded'
                                tradeMade = true
                                break
                            }
                        }
                        if (tradeMade) { break }
                    }
                }
            }
        }

        var wantTeams = { lw: [], c: [], rw: [], ld: [], rd: [], g: [] }
        var haveTeams = { lw: [], c: [], rw: [], ld: [], rd: [], g: [] }
        for (var tid in Vue.prototype.$teams.onehl) {
            var team = Vue.prototype.$teams.onehl[tid]
            var depth = team.playerPositionSummary().cap
            var cap = { lw: 4 - depth.lw, c: 4 - depth.c, rw: 4 - depth.rw, ld: 3 - depth.ld, rd: 3 - depth.rd, g: 2 - depth.g }
            for (var pos in cap) {
                if (cap[pos] > 0) {
                    wantTeams[pos].push(team.id)
                }
                else if (cap[pos] < 0) {
                    haveTeams[pos].push(team.id)
                }
            }
        }
    },

    tradeBuriedPlayers: function () {
        var buriedPlayers = []
        for (var p in Vue.prototype.$players) {
            if (isNaN(parseInt(p))) { continue }
            var player = Vue.prototype.$players[p]

            if (player.team == Vue.prototype.$gameInfo.player.team &&
                !Vue.prototype.$gameInfo.autoRoster) {
                continue
            }

            if ((player.league === 'twohl' && player.overall() >= 78 ||
                player.league === 'thrhl' && player.overall() >= 70) &&
                player.position !== 'g') {

                buriedPlayers.push({
                    team: '1' + player.team.toString().slice(1),
                    id: player.id,
                    value: player.tradeValue(),
                })
            }
        }
        buriedPlayers = buriedPlayers
            .map((a) => ({ sort: Math.random(), value: a }))
            .sort((a, b) => a.sort - b.sort)
            .map((a) => a.value)

        for (var playerOneIndex = 0; playerOneIndex < buriedPlayers.length; playerOneIndex++) {
            for (var playerTwoIndex = 0; playerTwoIndex < buriedPlayers.length; playerTwoIndex++) {
                if (buriedPlayers[playerOneIndex].id === 'traded' ||
                    buriedPlayers[playerTwoIndex].id === 'traded') {
                    continue
                }

                var playerOne = Vue.prototype.$players[buriedPlayers[playerOneIndex].id]
                var playerTwo = Vue.prototype.$players[buriedPlayers[playerTwoIndex].id]
                var oneTeam = Vue.prototype.$teams.onehl[buriedPlayers[playerOneIndex].team]
                var twoTeam = Vue.prototype.$teams.onehl[buriedPlayers[playerTwoIndex].team]


                if (playerOne.team === playerTwo.team ||
                    Math.abs(playerOne.tradeValue() - playerTwo.tradeValue()) > 3 ||
                    (oneTeam.capSpent(true) - playerTwo.contract.cap) < 0 ||
                    (twoTeam.capSpent(true) - playerOne.contract.cap) < 0 ||
                    playerOne.position !== playerTwo.position) {
                    continue
                }
                else {
                    playerOne.switchTeam(twoTeam.id)
                    playerTwo.switchTeam(oneTeam.id)
                    buriedPlayers[playerOneIndex].id = 'traded'
                    buriedPlayers[playerTwoIndex].id = 'traded'
                }
            }
        }
    },

    tradeToEvenDepth: function () {
        var teamDepths = []
        for (var tid in Vue.prototype.$teams.onehl) {
            var team = Vue.prototype.$teams.onehl[tid]
            if (team.id == Vue.prototype.$gameInfo.player.team &&
                !Vue.prototype.$gameInfo.autoRoster) {
                continue
            }
            var depth = team.playerPositionSummary().all
            var needs = { lw: 12 - depth.lw, c: 12 - depth.c, rw: 12 - depth.rw, ld: 9 - depth.ld, rd: 9 - depth.rd, g: 6 - depth.g }
            teamDepths.push(Object.assign({}, { id: team.id }, needs))
        }

        var done = false
        while (!done) {
            var tradesMade = 0
            for (var pos in needs) {
                // sorts all teams by depth in given position
                var posDepth = JSON.parse(JSON.stringify(teamDepths.sort((a, b) => (a[pos] - b[pos]))))
                if (posDepth[0][pos] > -2) { break }
                if (posDepth[31][pos] < 2) { break }

                var teamNeed = Vue.prototype.$teams.onehl[posDepth[0].id]
                var teamGive = Vue.prototype.$teams.onehl[posDepth[31].id]

                //finds the most crowded position of the needing team, this is the position they will trade away
                var x = JSON.parse(JSON.stringify(posDepth[0]))
                delete x.id
                var givePos = Object.keys(x).reduce((a, b) => x[a] > x[b] ? a : b)

                var teamNeedPlayers = teamNeed.allPlayers(false)
                var teamGivePlayers = teamGive.allPlayers(false)

                var needIndex = teamNeedPlayers.length - 1
                var giveIndex = teamGivePlayers.length - 1
                var noTrade = true
                while (noTrade && needIndex > 3 && giveIndex > 3) {
                    var needPlayer = Vue.prototype.$players[teamNeedPlayers[needIndex]]
                    var givePlayer = Vue.prototype.$players[teamGivePlayers[giveIndex]]
                    if (needPlayer.position !== pos) { needIndex -= 1; continue }
                    if (givePlayer.position !== givePos) { giveIndex -= 1; continue }

                    if (Math.abs(needPlayer.tradeValue() - givePlayer.tradeValue()) < 3) {
                        needPlayer.switchTeam(teamGive.id)
                        givePlayer.switchTeam(teamNeed.id)
                        noTrade = false
                        tradesMade += 1
                    }
                    else if (needPlayer.tradeValue() > givePlayer.tradeValue()) {
                        giveIndex -= 1
                    }
                    else {
                        needIndex -= 1
                    }
                }

            }
            if (tradesMade === 0) {
                done = true
            }

        }
    },

    tradeUnderCap: function () {
        var teamCaps = []
        for (var tid in Vue.prototype.$teams.onehl) {
            var team = Vue.prototype.$teams.onehl[tid]
            if (team.id == Vue.prototype.$gameInfo.player.team &&
                !Vue.prototype.$gameInfo.autoRoster) {
                continue
            }
            teamCaps.push({ id: team.id, capLeft: team.capSpent(true) })
        }
        teamCaps.sort((a, b) => a.capLeft - b.capLeft)
        var teamsOver = teamCaps.filter(t => t.capLeft < 0)
        var teamsUndr = teamCaps.filter(t => t.capLeft > 0).reverse()



        for (var o = 0; o < teamsOver.length; o++) {

            for (var u = 0; u < teamsUndr.length; u++) {
                var overTeam = Vue.prototype.$teams.onehl[teamsOver[o].id]
                var undrTeam = Vue.prototype.$teams.onehl[teamsUndr[u].id]
                if (undrTeam.capSpent(true) < 0) { break }
                var overPlayers = overTeam.allPlayers(false)
                var undrPlayers = undrTeam.allPlayers(false)

                var overIndex = overPlayers.length - 1
                var undrIndex = undrPlayers.length - 1

                var overCap = true
                while (undrIndex > 0 && overCap) {
                    var overPlayer = Vue.prototype.$players[overPlayers[overIndex]]
                    var undrPlayer = Vue.prototype.$players[undrPlayers[undrIndex]]

                    if ((overPlayer.tradeValue() - undrPlayer.tradeValue()) > 2 &&
                        (overPlayer.tradeValue() - undrPlayer.tradeValue()) < 5 &&
                        overPlayer.contract.cap > undrPlayer.contract.cap &&
                        (undrTeam.capSpent(true) - overPlayer.contract.cap) > 0) {

                        overPlayer.switchTeam(undrTeam.id)
                        undrPlayer.switchTeam(overTeam.id)
                        overIndex -= 1
                        undrIndex -= 1
                        if (overTeam.capSpent(true) > 0) {
                            overCap = false
                            break
                        }
                    }

                    overIndex -= 1
                    if (overIndex < 0) {
                        overIndex = overPlayers.length - 1
                        undrIndex -= 1
                    }


                }
                if (!overCap) {
                    break
                }
            }
        }
    },

    yearEndReSign: function () {
        for (var t in Vue.prototype.$teams.onehl) {
            var team = Vue.prototype.$teams.onehl[t]
            if (team.id == Vue.prototype.$gameInfo.player.team &&
                !Vue.prototype.$gameInfo.autoRoster) {
                continue
            }
            team.extendAll()

        }
    },

}