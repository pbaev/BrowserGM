module.exports = {
    Team: class Team {
        constructor({
            id = null,
            league = null,

            load = null,
            loadData = null

        }) {

            if (load) {
                for (var info in loadData) {
                    this[info] = loadData[info]
                  }
            }
            else {
                this.stats = {
                    gamesPlayed: 0, goalsAgainst: 0, goalsFor: 0, otl: 0, otw: 0, sol: 0, sow: 0, wins: 0, losses: 0, ppTime: 0, pps: 0,
                    ppgf: 0, ppga: 0, pkTime: 0, pks: 0, pkgf: 0, pkga: 0, fow: 0, fol: 0, shots: 0, saves: 0
                }

                this.id = id
                this.juniors = []
                this.players = []
                this.picks = {
                    2020: [{ round: 1, team: this.id, position: null, player: false }, { round: 2, team: this.id, position: null, player: false }, { round: 3, team: this.id, position: null, player: false }, { round: 4, team: this.id, position: null, player: false }, { round: 5, team: this.id, position: null, player: false }, { round: 6, team: this.id, position: null, player: false }, { round: 7, team: this.id, position: null, player: false }],
                    2021: [{ round: 1, team: this.id, position: null, player: false }, { round: 2, team: this.id, position: null, player: false }, { round: 3, team: this.id, position: null, player: false }, { round: 4, team: this.id, position: null, player: false }, { round: 5, team: this.id, position: null, player: false }, { round: 6, team: this.id, position: null, player: false }, { round: 7, team: this.id, position: null, player: false }],
                    2022: [{ round: 1, team: this.id, position: null, player: false }, { round: 2, team: this.id, position: null, player: false }, { round: 3, team: this.id, position: null, player: false }, { round: 4, team: this.id, position: null, player: false }, { round: 5, team: this.id, position: null, player: false }, { round: 6, team: this.id, position: null, player: false }, { round: 7, team: this.id, position: null, player: false }]
                }
                this.league = league
                this.name = this.generateName()
                this.lines = {}
                this.outlook = this.generateOutlook()

                Vue.prototype.$schedule.teams[this.league][this.id] = []
            }
        }



        addPlayers(players) {
            if (typeof players === 'object') {
                this.players = this.players.concat(players)
            }
            else {
                this.players.push(players)
            }
        }


        allPlayers(juniors) {
            if (juniors) {
                return this.players.concat(
                    Vue.prototype.$teams.twohl[this.farmTeam('twohl')].players,
                    Vue.prototype.$teams.thrhl[this.farmTeam('thrhl')].players,
                    this.juniors
                )
            }
            else {
                return this.players.concat(
                    Vue.prototype.$teams.twohl[this.farmTeam('twohl')].players,
                    Vue.prototype.$teams.thrhl[this.farmTeam('thrhl')].players,
                )
            }
        }


        capSpent(left) {
            var total = 0
            for (var n = 0; n < this.players.length; n++) {
                total += Vue.prototype.$players[this.players[n]].contract.cap
            }

            var otherPlayers = Vue.prototype.$teams.twohl[this.farmTeam('twohl')].players.concat(
                Vue.prototype.$teams.thrhl[this.farmTeam('thrhl')].players
            )
            for (var n = 0; n < otherPlayers.length; n++) {
                if (Vue.prototype.$players[otherPlayers[n]].contract.cap > 1) {
                    total += (Vue.prototype.$players[otherPlayers[n]].contract.cap - 1)
                }
            }

            if (left) {
                return parseFloat((Vue.prototype.$gameInfo.salaryCap - total).toFixed(2))
            }
            else {
                return parseFloat(total.toFixed(2))
            }
        }


        changePicks(action, pick) {
            const season = Vue.prototype.$gameInfo.time.season
            if (action === 'remove') {
                this.picks[season] = this.picks[season].filter(a => !(pick.round === a.round && pick.team === a.team))
            }
            else if (action === 'add') {
                this.picks[season].push({ round: pick.round, team: pick.team, position: pick.position, player: false })
            }
        }


        checkLineValidity() {
            for (var position in this.lines.v55) {
                if (this.lines.v55[position].indexOf(0) !== -1) {
                    return false
                }
            }
            if (this.lines.g.indexOf(0) !== -1) {
                return false
            }
            if (this.lines.specialTeams.pk.indexOf(0) !== -1) {
                return false
            }
            if (this.lines.specialTeams.pp.indexOf(0) !== -1) {
                return false
            }

            return true
        }


        extendAll() {
            const allPlayersList = this.allPlayers(false)
            if (allPlayersList.length > 76) { return }
            var allExpiringList = []

            var capLeft = Vue.prototype.$gameInfo.salaryCap + 30 //extra M for players outside of 1HL

            for (var p = 0; p < allPlayersList.length; p++) {
                var player = Vue.prototype.$players[allPlayersList[p]]
                if (player.contract.years === 1 && isNaN(player.newContract.years)) {
                    allExpiringList.push(player.id)
                }
                else if (!isNaN(player.newContract.cap)) {
                    capLeft -= player.newContract.cap
                }
                else {
                    capLeft -= player.contract.cap
                }

            }


            // Extends juniors
            for (var p = 0; p < this.juniors.length; p++) {
                var player = Vue.prototype.$players[this.juniors[p]]
                if (player.overall() >= 60 && player.contract.years === 1 && isNaN(player.newContract.years)) {
                    player.newContract = player.desiredContract()
                    player.switchTeam(this.farmTeam('thrhl'))
                    capLeft -= player.newContract.cap
                }
                else if (player.contract.years === 1 && isNaN(player.newContract.years)) {
                    player.release()
                }
            }

            // Extends minimums
            for (var p = 0; p < allExpiringList.length; p++) {
                var player = Vue.prototype.$players[allExpiringList[p]]
                if (player.overall() > 63 && player.overall() < 76) {
                    player.newContract = player.desiredContract()
                    player.newContract.cap = 1
                    allExpiringList = allExpiringList.filter(id => id !== player.id)
                    capLeft -= player.newContract.cap
                }
                if (player.age <= 22) {
                    player.newContract = player.desiredContract()
                    allExpiringList = allExpiringList.filter(id => id !== player.id)
                    capLeft -= player.newContract.cap
                }
            }

            if (capLeft < 0) { return }

            // Extends rest
            var prioritySort = []
            for (var p = 0; p < allExpiringList.length; p++) {
                var player = Vue.prototype.$players[allExpiringList[p]]
                var value = player.overall() * (-(player.age * 0.08))
                if (player.overall() > 63) {
                    prioritySort.push({ id: player.id, value: value })
                }
            }
            prioritySort = prioritySort.sort((a, b) => a.value - b.value).reverse()

            for (var p in prioritySort) {
                var player = Vue.prototype.$players[prioritySort[p].id]
                if (player.desiredContract() > capLeft) {
                    continue
                }
                else {
                    var contract = player.desiredContract()
                    contract.cap -= 0.3
                    var yearChange = rnd(-1, 1)
                    contract.years += yearChange
                    if (contract.years > 8 || contract.years < 1) {
                        contract.years -= yearChange
                    }
                    if (contract.cap < 1) { contract.cap = 1 }

                    contract.cap = parseFloat((contract.cap).toFixed(2))
                    if ((capLeft - contract.cap) > 0) {
                        player.newContract = contract
                        capLeft -= contract.cap
                    }
                }
            }
        }


        farmTeam(league) {
            var leagueConvert = { onehl: '1', twohl: '2', thrhl: '3' }
            return parseInt(leagueConvert[league] + this.id.toString().slice(1, 3))
        }
        

        generateLines(custom, specialTeams, goalies) {
            // custom is false or the desired 5v5 players { 'lw': [], 'c': [], 'rw': [], 'ld': [], 'rd': [],
            // specialTeams is false or a list of desired player ids for each type
            // ex: {pp: [83734, 4863434,...], pk:[43433,8755,..,]} pp is 10 long, pk is 8
            // goalies is false or a list of desired goalie ids : [547223,45333]
            const players = this.players

            function positionRank() {
                var ranks = {
                    even: { 'lw': [], 'c': [], 'rw': [], 'ld': [], 'rd': [] },
                    pp: { 'lw': [], 'c': [], 'rw': [], 'ld': [], 'rd': [] },
                    pk: { 'lw': [], 'c': [], 'rw': [], 'ld': [], 'rd': [] }
                }
                var overallRank = { even: [], pp: [], pk: [] }

                players.forEach(pid => {
                    var player = Vue.prototype.$players[pid]
                    if (player.position != 'g') {
                        for (var position in ranks.even) {
                            var evenScore = player.overall() * player.positionStrength[position]
                            overallRank.even.push({ id: pid, score: evenScore, position: position })

                            var ppScore = player.overall() * player.positionStrength[position] * player.attributes.oiq * player.attributes.wrist * player.attributes.slap * player.attributes.hands
                            overallRank.pp.push({ id: pid, score: ppScore, position: position })

                            var pkScore = player.overall() * player.positionStrength[position] * player.attributes.diq * player.attributes.blocking * player.attributes.hitting * player.attributes.stick
                            overallRank.pk.push({ id: pid, score: pkScore, position: position })
                        }
                    }
                })

                for (var type in ranks) {
                    for (var position in ranks[type]) {
                        ranks[type][position] = ranks[type][position].sort((a, b) => a.score - b.score).reverse()
                    }
                }
                for (var type in overallRank) {
                    overallRank[type] = overallRank[type].sort((a, b) => a.score - b.score).reverse()
                }
                return overallRank
            }


            function allocateLines(ranking) {
                var lines = {
                    v55: { 'lw': [], 'c': [], 'rw': [], 'ld': [], 'rd': [], },
                    v44: { 'lw': [], 'c': [], 'rw': [], 'ld': [], 'rd': [] },
                    v33: { 'lw': [], 'c': [], 'rw': [], 'ld': [], 'rd': [] },
                    v54: { 'lw': [], 'c': [], 'rw': [], 'ld': [], 'rd': [] }, v53: {},
                    v43: { 'lw': [], 'c': [], 'rw': [], 'ld': [], 'rd': [] },
                    v45: { 'lw': [], 'c': [], 'rw': [], 'ld': [], 'rd': [] }, v35: {}, v34: {},
                    g: [],
                    specialTeams: { pp: [], pk: [] }
                }
                //v55
                if (!custom) {
                    var lineLength = { 'lw': 4, 'c': 4, 'rw': 4, 'ld': 3, 'rd': 3 }
                    var unusedPlayers = JSON.parse(JSON.stringify(players))
                    for (var n in ranking.even) {
                        var player = ranking.even[n]
                        if (unusedPlayers.includes(player.id)) {
                            if (lineLength[player.position] !== lines.v55[player.position].length) {
                                lines.v55[player.position].push(player.id)
                                unusedPlayers = unusedPlayers.filter(function (pid) { return pid != player.id })
                            }
                        }
                    }
                    for (var player in unusedPlayers) {
                        var pid = unusedPlayers[player]
                        if (Vue.prototype.$players[pid].position === 'g') {
                            lines.g.push({ id: pid, overall: Vue.prototype.$players[pid].overall() })
                        }
                    }

                    for (var pos in lines.v55) {
                        if (lines.v55[pos].length < lineLength[pos]) {
                            lines.v55[pos].concat(new Array(lineLength[pos] - lines.v55[pos].length).fill(0))
                        }
                    }
                    if (lines.g.length < 2) {
                        lines.g.concat(new Array(2 - lines.g.length).fill(0))
                    }
                }
                else {
                    lines.v55 = custom
                }

                if (!goalies) {
                    var goalies = players.filter(p => Vue.prototype.$players[p].position === 'g')
                    lines.g = goalies.sort((a, b) => Vue.prototype.$players[a].overall() - Vue.prototype.$players[b].overall()).reverse()
                }
                else {
                    lines.g = goalies
                }

                //v44
                var lineLength = { 'lw': 3, 'c': 3, 'rw': 3, 'ld': 2, 'rd': 2 }
                var unusedPlayers = JSON.parse(JSON.stringify(players))
                for (var n in ranking.even) {
                    var player = ranking.even[n]
                    if (unusedPlayers.includes(player.id)) {
                        if (lineLength[player.position] !== lines.v44[player.position].length) {
                            lines.v44[player.position].push(player.id)
                            if (player.position === 'lw') { lines.v44.rw.push(0) }
                            else if (player.position === 'rw') { lines.v44.lw.push(0) }
                            unusedPlayers = unusedPlayers.filter(function (pid) { return pid != player.id })
                        }
                    }
                }

                //v33
                var lineLength = { 'lw': 3, 'c': 3, 'rw': 3, 'ld': 3, 'rd': 3 }
                var unusedPlayers = JSON.parse(JSON.stringify(players))
                for (var n in ranking.even) {
                    var player = ranking.even[n]
                    if (unusedPlayers.includes(player.id)) {
                        if (lineLength[player.position] !== lines.v33[player.position].length) {
                            lines.v33[player.position].push(player.id)
                            if (player.position === 'ld') { lines.v33.rd.push(0) }
                            else if (player.position === 'rd') { lines.v33.ld.push(0) }
                            else if (player.position === 'lw') { lines.v33.rw.push(0) }
                            else if (player.position === 'rw') { lines.v33.lw.push(0) }
                            unusedPlayers = unusedPlayers.filter(function (pid) { return pid != player.id })
                        }
                    }
                }

                //v34 & v35 & v45
                if (specialTeams !== false) { var unusedPlayers = specialTeams.pk }
                else { var unusedPlayers = JSON.parse(JSON.stringify(players)) }

                var lineLength = { 'lw': 2, 'c': 2, 'rw': 2, 'ld': 2, 'rd': 2 }
                for (var n in ranking.pk) {
                    var player = ranking.pk[n]
                    if (unusedPlayers.includes(player.id)) {
                        if (lineLength[player.position] !== lines.v45[player.position].length) {
                            lines.v45[player.position].push(player.id)
                            if (player.position === 'lw') { lines.v45.rw.push(0) }
                            else if (player.position === 'rw') { lines.v45.lw.push(0) }
                            unusedPlayers = unusedPlayers.filter(function (pid) { return pid != player.id })
                            lines.specialTeams.pk.push(player.id)
                        }
                    }
                }
                lines.v35 = JSON.parse(JSON.stringify(lines.v45))
                lines.v35.lw = [0, 0]
                lines.v35.rw = [0, 0]
                lines.v34 = lines.v35

                //v54 v53
                if (specialTeams !== false) { var unusedPlayers = specialTeams.pp }
                else { var unusedPlayers = JSON.parse(JSON.stringify(players)) }

                var lineLength = { 'lw': 2, 'c': 2, 'rw': 2, 'ld': 2, 'rd': 2 }
                for (var n in ranking.pp) {
                    var player = ranking.pp[n]
                    if (unusedPlayers.includes(player.id)) {
                        if (lineLength[player.position] !== lines.v54[player.position].length) {
                            lines.v54[player.position].push(player.id)
                            unusedPlayers = unusedPlayers.filter(function (pid) { return pid != player.id })
                            lines.specialTeams.pp.push(player.id)
                        }
                    }
                }

                lines.v53 = JSON.parse(JSON.stringify(lines.v54))

                //v43
                if (specialTeams !== false) { var unusedPlayers = specialTeams.pp }
                else { var unusedPlayers = JSON.parse(JSON.stringify(players)) }

                var lineLength = { 'lw': 2, 'c': 2, 'rw': 2, 'ld': 2, 'rd': 2 }
                for (var n in ranking.pp) {
                    var player = ranking.pp[n]
                    if (unusedPlayers.includes(player.id)) {
                        if (lineLength[player.position] !== lines.v43[player.position].length) {
                            lines.v43[player.position].push(player.id)
                            if (player.position === 'ld') { lines.v43.rd.push(0) }
                            else if (player.position === 'rd') { lines.v43.ld.push(0) }
                            unusedPlayers = unusedPlayers.filter(function (pid) { return pid != player.id })
                        }
                    }
                }
                return lines
            }

            var l = allocateLines(positionRank())
            this.lines = l
            return l
        }


        generateName() {
            const leagueConvert = { onehl: '', twohl: '2', thrhl: '3' }
            const logoConvert = { onehl: '', twohl: 'Sr. ', thrhl: 'Jr. ' }
            var team = parseInt(this.id.toString().slice(1, 3))
            var names = [
                'Developer', 'Anaheim', 'Arizona', 'Boston', 'Buffalo', 'Calgary', 'Carolina', 'Chicago', 'Colorado', 'Columbus', 'Dallas', 'Detroit', 'Edmonton', 'Florida',
                'Los Angeles', 'Minnesota', 'Montreal', 'Nashville', 'New Jersey', 'Brooklyn', 'New York', 'Ottawa', 'Philadelphia', 'Pittsburgh', 'San Jose',
                'St. Louis', 'Tampa Bay', 'Toronto', 'Vancouver', 'Vegas', 'Washington', 'Winnipeg'
            ]
            var abbs = [
                'DEV', 'ANA', 'ARI', 'BOS', 'BUF', 'CGY', 'CAR', 'CHI', 'COL', 'CBJ', 'DAL', 'DET', 'EDM', 'FLA', 'LAK', 'MIN', 'MTL', 'NSH', 'NJD', 'NYI', 'NYR', 'OTT', 'PHI', 'PIT', 'SJS',
                'STL', 'TBL', 'TOR', 'VAN', 'VGK', 'WSH', 'WPG'
            ]
            var logos = [
                'Bugs', 'Ducks', 'Coyotes', 'Bruins', 'Sabres', 'Flames', 'Hurricanes', 'Blackhawks', 'Avalanche', 'Blue Jackets', 'Stars', 'Red Wings', 'Oilers', 'Panthers', 'Kings', 'Wild',
                'Canadiens', 'Predators', 'Devils', 'Islanders', 'Rangers', 'Senators', 'Flyers', 'Penguins', 'Sharks', 'Blues', 'Lightning', 'Maple Leafs', 'Canucks', 'Knights', 
                'Capitals', 'Jets'
            ]
            var name = names[team]
            var abb = leagueConvert[this.league] + abbs[team]
            var logo = logoConvert[this.league] + logos[team]
            var full = name + ' ' + logo

            return { city: name, logo: logo, full: full, abb: abb }
        }


        generateOutlook() {
            return ['rebuild', 'bubble', 'playoff', 'cup'][rnd(0, 3)]
        }


        overall() {
            var overall = { forwards: 0, defence: 0, goalies: 0 }
            var overallList = { forwards: [], defence: [], goalies: [] }

            for (var player in this.players) {
                var pid = this.players[player]
                var pos = Vue.prototype.$players[pid].position

                if (pos === 'lw' | pos === 'rw' | pos === 'c') {
                    overallList.forwards.push(Vue.prototype.$players[pid].overall())
                }
                else if (pos === 'ld' | pos === 'rd') {
                    overallList.defence.push(Vue.prototype.$players[pid].overall())
                }
                else {
                    overallList.goalies.push(Vue.prototype.$players[pid].overall())
                }
            }

            for (var type in overallList) {
                overallList[type] = overallList[type].sort(function (a, b) { return a - b; }).reverse()
            }

            overallList.forwards = overallList.forwards.slice(0, 12)
            overallList.defence = overallList.defence.slice(0, 6)
            overallList.goalies = overallList.goalies.slice(0, 2)

            var skaters = { 'forwards': 0, 'defence': 0 }
            for (var type in skaters) {
                for (var item in overallList[type]) {
                    overall[type] += overallList[type][item]
                }
            }

            overall.forwards = parseInt(overall.forwards / 12) + 5
            overall.defence = parseInt(overall.defence / 6) + 4
            overall.goalies = parseInt(overallList.goalies[0] * 0.85 + overallList.goalies[0] * 0.15)

            if (overall.forwards > 100) { overall.forwards = 100 }
            if (overall.defence > 100) { overall.defence = 100 }

            return overall
        }


        playerInterest(id) {
            // interest will slightly modify how a team percieves trade value
            // these aren't very good at the moment
            var player = Vue.prototype.$players[id]
            var capSpace = Vue.prototype.$gameInfo.salaryCap - this.capSpent() - player.contract.cap

            if (this.outlook === 'rebuild') {
                var value = player.tradeValue()
                if (capSpace < 0) {
                    return 0
                }
                if (player.age > 30) {
                    value -= (player.age - 30) * 3 ** 1.5
                }
            }
            else if (this.outlook === 'bubble') {
                if (capSpace < 0) {
                    return 0
                }
                if (player.age > 33) {
                    value -= (player.age - 33) * 3 ** 1.5
                }
            }
            else if (this.outlook === 'playoff') {
                var value = player.tradeValue() + ((player.overall() - 70) / 10)
                if (capSpace < 0) {
                    value -= Math.abs(capSpace) * 10
                }
            }
            else if (this.outlook === 'cup') {
                var value = player.tradeValue() + ((player.overall() - 87) / 10)
                if (capSpace < 0) {
                    value -= Math.abs(capSpace) * 5
                }
                if (player.age < 24) {
                    value -= (24 - player.age) * 3
                }
            }
            return parseInt(value)
        }


        playerPositionSummary() {
            const allPlayers = this.allPlayers(true)
            var all = { lw: 0, c: 0, rw: 0, ld: 0, rd: 0, g: 0 }
            var cap = { lw: 0, c: 0, rw: 0, ld: 0, rd: 0, g: 0 }

            for (var p = 0; p < allPlayers.length; p++) {
                var player = Vue.prototype.$players[allPlayers[p]]
                all[player.position] += 1
                if (player.contract.cap > 1) {
                    cap[player.position] += 1
                }
            }
            return { all: all, cap: cap }
        }


        points() {
            return ((this.stats.wins + this.stats.sow + this.stats.otw) * 2) + this.stats.otl + this.stats.sol
        }
        

        rank(stat, suffix) {
            function rankSuffix(index) {
                if ((4 <= index) & (index <= 20)) { return index + 'th' }
                index = index.toString()
                if (index.slice(index.length - 1) == '1') { return index + 'st' }
                else if (index.slice(index.length - 1) == '2') { return index + 'nd' }
                else if (index.slice(index.length - 1) == '3') { return index + 'rd' }
                else { return index + 'th' }
            }

            var teams = []
            for (var team in Vue.prototype.$teams[this.league]) {
                teams.push(Vue.prototype.$teams[this.league][team])
            }
            if (stat === 'points') {
                teams = teams.sort(function (a, b) { return (a.stats.points / a.stats.gamesPlayed) - (b.stats.points / b.gamesPlayed) || (a.stats.goalsFor - a.stats.goalsAgainst) - (b.stats.goalsFor - b.stats.goalsAgainst) }).reverse()
            }
            else {
                teams = teams.sort(function (a, b) { return (a.stats[stat] - b.stats[stat]) }).reverse()
            }

            var index = teams.findIndex(x => x.id === this.id)
            if (suffix) {
                return rankSuffix(index + 1)
            }
            else {
                return index
            }
        }

        removePlayers(players) {
            this.players = this.players.filter((id) => { return !players.includes(id) })
        }


        sortRoster() {
            var allPlayersList = this.allPlayers(true)

            function playerInfo(pid, position) {
                var player = Vue.prototype.$players[pid]
                // each year younger is 0.5 points added to the overall
                if (position === 'g') {
                    var value = (player.overall() + (((1 / player.age) - 0.3) * 375)) + 100
                }
                else {
                    var value = (player.overall() + (((1 / player.age) - 0.3) * 375) + 100) * player.positionStrength[position]
                }
                if (player.contract.cap === 1) {
                    var contractScore = 'minimum'
                }
                else {
                    var contractScore = (player.contract.cap - player.desiredContract().cap)
                }
                if (player.league === 'juniors') {
                    value -= 10
                }
                return { id: pid, value: value, contractScore: contractScore }
            }

            //Sorting the players by performance in each position

            var allPlayersInfo = { lw: [], c: [], rw: [], ld: [], rd: [], g: [], all: [] }

            for (var p = 0; p < allPlayersList.length; p++) {
                var player = Vue.prototype.$players[allPlayersList[p]]

                if (typeof player === 'undefined') {
                    // bug, ids of players who don't exist find their way into a 3HL player list
                    // this and the next try catch "solve"" it
                    Vue.prototype.$teams.onehl[this.id].players = Vue.prototype.$teams.onehl[this.id].players.filter(id => id != allPlayersList[p])
                    Vue.prototype.$teams.twohl['2' + this.id.toString().slice(1)].players = Vue.prototype.$teams.twohl['2' + this.id.toString().slice(1)].players.filter(id => id != allPlayersList[p])
                    Vue.prototype.$teams.thrhl['3' + this.id.toString().slice(1)].players = Vue.prototype.$teams.thrhl['3' + this.id.toString().slice(1)].players.filter(id => id != allPlayersList[p])
                    this.sortRoster()
                }

                try {
                    if (player.position !== 'g') {
                        allPlayersInfo.all.push(playerInfo(player.id, player.position))
                        for (var pos in { lw: 0, c: 0, rw: 0, ld: 0, rd: 0 }) {
                            allPlayersInfo[pos].push(playerInfo(player.id, pos))
                        }
                    }
                    else {
                        allPlayersInfo.g.push(playerInfo(player.id, 'g'))
                    }
                }
                catch { }
            }

            for (var pos in allPlayersInfo) {
                allPlayersInfo[pos] = allPlayersInfo[pos].sort((a, b) =>
                    (a.value - b.value) ||
                    (a.contractScore - b.contractScore)).reverse()
            }


            // Adding goalies to their league
            try {
                Vue.prototype.$players[allPlayersInfo.g[0].id].switchTeam(this.farmTeam('onehl'))
                Vue.prototype.$players[allPlayersInfo.g[1].id].switchTeam(this.farmTeam('onehl'))
                Vue.prototype.$players[allPlayersInfo.g[2].id].switchTeam(this.farmTeam('twohl'))
                Vue.prototype.$players[allPlayersInfo.g[3].id].switchTeam(this.farmTeam('twohl'))
                Vue.prototype.$players[allPlayersInfo.g[4].id].switchTeam(this.farmTeam('thrhl'))
                Vue.prototype.$players[allPlayersInfo.g[5].id].switchTeam(this.farmTeam('thrhl'))
            }
            catch {
                //less than 6 goalies
            }

            // Adding skaters to their league

            var positionIndex = { lw: 0, c: 0, rw: 0, ld: 0, rd: 0 }
            var chosenPlayerList = []
            for (var league in { onehl: 0, twohl: 0, thrhl: 0 }) {
                for (var line = 0; line < 4; line++) {
                    for (var pos in positionIndex) {
                        if (!(line === 3 && ['ld', 'rd'].includes(pos))) {
                            var notAdded = true

                            while (notAdded && positionIndex[pos] < allPlayersInfo[pos].length) {
                                var player = Vue.prototype.$players[allPlayersInfo[pos][positionIndex[pos]].id]
                                if (chosenPlayerList.includes(player.id)) {
                                    positionIndex[pos] += 1
                                }
                                else {
                                    player.switchTeam(this.farmTeam(league))
                                    chosenPlayerList.push(player.id)
                                    notAdded = false
                                    positionIndex[pos] += 1
                                }
                            }
                        }
                    }
                }
            }
        }


        topPlayer(stat) {
            const season = Vue.prototype.$gameInfo.time.season

            var players = []
            if (['saves', 'savePctg', 'gaa'].includes(stat)) {
                if (this.lines.g[0] !== 0) {
                    var goalie1 = Vue.prototype.$players[this.lines.g[0]]
                }
                else {
                    return { name: 'None', value: 0, id: 0 }
                }

                if (this.lines.g[1] !== 0) {
                    var goalie2 = Vue.prototype.$players[this.lines.g[1]]
                }
                else {
                    return { name: goalie1.fullName, value: goalie1.stats[season][stat], id: goalie1.id }
                }

                if (goalie1.stats[season][stat] >= goalie2.stats[season][stat]) {
                    return { name: goalie1.fullName, value: goalie1.stats[season][stat], id: goalie1.id }
                }
                else {
                    return { name: goalie2.fullName, value: goalie2.stats[season][stat], id: goalie2.id }
                }

            }
            else {
                for (var tid in this.players) {
                    if (Vue.prototype.$players[this.players[tid]].position !== 'g' && tid !== '0') {
                        players.push(Vue.prototype.$players[this.players[tid]])
                    }
                }
            }

            players = players.sort(function (a, b) { return (a.stats[season][stat] - b.stats[season][stat]) }).reverse()

            if (typeof players[0] === 'undefined') {
                return { name: 'None', value: 0, id: 0 }
            }

            return { name: players[0].fullName, value: players[0].stats[season][stat], id: players[0].id }
        }
    }
}


function rnd(low, high) {
    //returns a random number between low and high (linear)
    var random = Math.random()
    var r = Math.floor(random * (high - low + 1))
    return low + r
}
