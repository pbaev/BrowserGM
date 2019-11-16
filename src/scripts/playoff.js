module.exports = {
    playoffStart: function playoffStart() {
        Vue.prototype.$gameInfo.time.period = 'playoff-r1'
        const leagues = { 'onehl': 0, 'twohl': 0, 'thrhl': 0 }
        var standings = { 'onehl': [], 'twohl': [], 'thrhl': [] }

        for (var league in leagues) {
            var gamesList = Object.keys(Vue.prototype.$schedule.id[league])
            gamesList = gamesList.map(v => parseInt(v, 10))
            gamesList = gamesList.filter(function (id) { return !isNaN(id) })
            for (var team in Vue.prototype.$teams[league]) {
                var current = Vue.prototype.$teams[league][team]
                standings[league].push({
                    'id': current.id,
                    'name': current.name.city,
                    'gamesPlayed': current.stats.gamesPlayed,
                    'points': current.stats.points,
                    'wins': current.stats.wins,
                    'losses': current.stats.losses,
                    'otw': current.stats.otw,
                    'otl': current.stats.otl,
                    'sow': current.stats.sow,
                    'sol': current.stats.sol,
                    'goalsFor': current.stats.goalsFor,
                    'goalsAgainst': current.stats.goalsAgainst
                })
            }
            standings[league] = standings[league].sort(function (a, b) { return a.points - b.points || (a.goalsFor - a.goalsAgainst) - (b.goalsFor - b.goalsAgainst) }).reverse()
            standings[league] = standings[league].slice(0, 16)
            var meta = { r1: {}, r2: {}, r3: {}, r4: {} }
            for (var teamGroup = 0; teamGroup < 8; teamGroup++) {
                meta.r1[(teamGroup + 1).toString() + 'v' + (16 - teamGroup).toString()] = {
                    hi: standings[league][teamGroup].id,
                    lo: standings[league][15 - teamGroup].id,
                    score: [0, 0]
                }
                Vue.prototype.$events.playoffs[league] = meta
            }
            for (var teamGroup = 0; teamGroup < 8; teamGroup++) {
                var startDate = JSON.parse(JSON.stringify(Vue.prototype.$gameInfo.time.date))
                startDate.day += 1
                var teamOne = standings[league][teamGroup]
                var teamTwo = standings[league][15 - teamGroup]


                var g = new Vue.prototype.$class.Game.Game({ league: league, home: teamOne.id, away: teamTwo.id, date: startDate, type: 'playoff' })
                Vue.prototype.$schedule.id[league][g.id] = g
            }
        }
    },


    playoffRound: function playoffRound(round) {
        const finishedRound = 'r' + (round - 1).toString()
        round = 'r' + round.toString()
        var nextRound = {
            r2: {
                '1v8': ['1v16', '8v9'], '2v7': ['2v15', '7v10'],
                '3v6': ['3v14', '6v11'], '4v5': ['4v13', '5v12']
            },
            r3: { '1v4': ['1v8', '4v5'], '2v3': ['2v7', '3v6'] },
            r4: { '1v2': ['1v4', '2v3'] }
        }

        const leagues = { onehl: 0, twohl: 0, thrhl: 0 }
        for (var league in leagues) {
            var matchups = {}
            var playoffs = Vue.prototype.$events.playoffs[league]
            for (var series in nextRound[round]) {
                var fromSeries = nextRound[round][series]

                if (playoffs[finishedRound][fromSeries[0]].score[0] == 4) {
                    var hiTeam = playoffs[finishedRound][fromSeries[0]].hi
                }
                else {
                    var hiTeam = playoffs[finishedRound][fromSeries[0]].lo
                }
                if (playoffs[finishedRound][fromSeries[1]].score[0] == 4) {
                    var loTeam = playoffs[finishedRound][fromSeries[1]].hi
                }
                else {
                    var loTeam = playoffs[finishedRound][fromSeries[1]].lo
                }

                matchups[series] = {
                    hi: hiTeam,
                    lo: loTeam,
                    score: [0, 0]
                }
                var startDate = JSON.parse(JSON.stringify(Vue.prototype.$gameInfo.time.date))
                startDate.day += 1
                var g = new Vue.prototype.$class.Game.Game({ league: league, home: hiTeam, away: loTeam, date: startDate, type: 'playoff' })
                Vue.prototype.$schedule.id[league][g.id] = g
            }
            Vue.prototype.$events.playoffs[league][round] = matchups
        }
    }
}