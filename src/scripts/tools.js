module.exports = {
    addressChange: function (url, sub, details) {
        if (url === 'back') {
            if (Vue.prototype.$gameInfo.history.length > 1) {
                Vue.prototype.$gameInfo.history.pop()
                var lastPage = Vue.prototype.$gameInfo.history.pop()
                Vue.prototype.$gameInfo.page = JSON.parse(JSON.stringify(lastPage))
                Vue.prototype.$gameInfo.history.push(JSON.parse(JSON.stringify(Vue.prototype.$gameInfo.page)))
            }
        }
        else {
            Vue.prototype.$gameInfo.page = { url: url, sub: sub, details: details }
            Vue.prototype.$gameInfo.history.push(JSON.parse(JSON.stringify(Vue.prototype.$gameInfo.page)))
        }
        if (Vue.prototype.$gameInfo.history.length > 100) {
            Vue.prototype.$gameInfo.history = Vue.prototype.$gameInfo.history.slice(1)
        }
    },

    colour: function () {
        return { main: Vue.prototype.$gameInfo.colours.main, light: Vue.prototype.$gameInfo.colours.light }
    },

    laterDate: function (date1, date2) {
        // returns true if date 1 is after date2
        // dateX = {day:1, month: 10, year: 1998}
        var date1Score = date1.day + (date1.month * 32) + (date1.year * 1000)
        var date2Score = date2.day + (date2.month * 32) + (date2.year * 1000)
        return (date1Score > date2Score)
    },

    loadGame: function (type) {
        if (type === 'upload') {
            var loadFile = new FileReader()
            loadFile.readAsText(document.getElementById('load-game-file').files[0])

            loadFile.onload = function () {
                workOnFile(loadFile.result)
            }

        }
        else {
            workOnFile(Vue.prototype.$save[type])
        }

        function workOnFile(data) {
            var data = JSON.parse(data)
            var backUp = {
                events: Vue.prototype.$events,
                gameInfo: Vue.prototype.$gameInfo,
                news: Vue.prototype.$news,
                players: Vue.prototype.$players,
                schedule: Vue.prototype.$schedule,
                teams: Vue.prototype.$teams,
            }

            try {
                //For some reason navigation stops working if the data.gameInfo is directly used
                var gameInfo = backUp.gameInfo
                gameInfo.history = []
                gameInfo.page = { url: 'home', sub: '', details: {} }
                gameInfo.player.team = data.gameInfo.player.team
                gameInfo.salaryCap = data.gameInfo.salaryCap
                gameInfo.scouting = data.gameInfo.scouting
                gameInfo.tickSpeed = data.gameInfo.tickSpeed
                gameInfo.time = data.gameInfo.time

                //Players
                var players = { onehl: [], twohl: [], thrhl: [], prospects: [], juniors: [], freeAgents: [] }
                for (var league in players) {
                    players[league] = data.players[league]
                }
                for (var p in data.players) {
                    if (isNaN(parseInt(p))) { continue }

                    var player = new Vue.prototype.$class.Player.Player({
                        type: 'load',
                        load: data.players[p],
                    })
                    players[player.id] = player
                }


                //Schedule
                var schedule = { dates: { onehl: {}, twohl: {}, thrhl: {} }, teams: { onehl: {}, twohl: {}, thrhl: {} }, id: { onehl: {}, twohl: {}, thrhl: {} } }
                schedule.dates = data.schedule.dates
                schedule.teams = data.schedule.teams

                for (var league in data.schedule.id) {
                    for (var g in data.schedule.id[league]) {
                        var game = new Vue.prototype.$class.Game.Game({
                            load: true,
                            loadData: data.schedule.id[league][g],
                        })
                        schedule.id[league][game.id] = game
                    }
                }

                //Teams
                var teams = { onehl: {}, twohl: {}, thrhl: {}, }
                for (var league in teams) {
                    for (var t in data.teams[league]) {
                        var team = new Vue.prototype.$class.Team.Team({
                            load: true,
                            loadData: data.teams[league][t],
                        })
                        teams[league][team.id] = team
                    }
                }

                Vue.prototype.$events = data.events
                Vue.prototype.$news = data.news
                Vue.prototype.$players = players
                Vue.prototype.$schedule = schedule
                Vue.prototype.$teams = teams
                Vue.prototype.$gameInfo = gameInfo
            }
            catch {
                Vue.prototype.$events = backUp.events
                Vue.prototype.$news = backUp.news
                Vue.prototype.$players = backUp.players
                Vue.prototype.$schedule = backUp.schedule
                Vue.prototype.$teams = backUp.teams
                Vue.prototype.$gameInfo = backUp.gameInfo
            }
        }
    },

    newNews: function (type, item) {
        if (item === false) {
            var entry = type
        }
        else if (type === 'retire') {
            const leagueConvert = { onehl: '1HL', twohl: '2HL', thrhl: '3HL' }
            var entry = item.fullName + ' retires at the age of ' + item.age + ' from the ' + leagueConvert[item.league]
        }
        else if (type === 'contract') {
            var entry = item.fullName + ' has signed a ' + item.contract.years + ' year contract at ' + item.contract.cap + ' M'
        }
        else if (type === 'extension') {
            var entry = item.fullName + ' has signed a ' + item.newContract.years + ' year extension at ' + item.newContract.cap + ' M'
        }
        else if (type === 'free agent') {
            var player1 = Vue.prototype.$players[item[0]]
            var player2 = Vue.prototype.$players[item[1]]
            var entry = player1.name().last + ' (' + player1.overall() + ') and ' + player2.name().last + ' (' + player2.overall() + ') have entered free agency from the 1KHL'
        }
        else if (type === 'cap') {
            var spent = Vue.prototype.$teams.onehl[Vue.prototype.$gameInfo.player.team].capSpent()
            var left = (Vue.prototype.$gameInfo.salaryCap - spent).toFixed(1)
            if (left >= 0) {
                var entry = 'Your team has ' + left + ' M available to spend'
            }
            else {
                var entry = 'Your team has ' + Math.abs(parseFloat(left)) + ' M left to clear to be under the cap'
            }
        }

        Vue.prototype.$news.push(entry)
        if (Vue.prototype.$news.length > 10) {
            Vue.prototype.$news = Vue.prototype.$news.slice(1)
        }
    },

    readableTime: function (time) {
        //returns time on ice Integer as MM:SS
        var minutes = Math.floor(time / 60)
        var seconds = time - (minutes * 60)
        if (seconds < 10) { seconds = '0' + seconds.toString() }
        var timeString = minutes.toString() + ':' + seconds.toString()
        var period = Math.floor(time / 1200) + 1
        return { period: period, time: timeString }
    },

    rnd: function (low, high) {
        //returns a random number between low and high (linear)
        var random = Math.random()
        var r = Math.floor(random * (high - low + 1))
        return low + r
    },

    sameObject: function (object1, object2) {
        //returns true if both objects are the "same"
        // same as in same keys and values because {} === {} returns false
        var sameKeys = (JSON.stringify(Object.keys(object1)) === JSON.stringify(Object.keys(object2)))
        var sameValues = (JSON.stringify(Object.values(object1)) === JSON.stringify(Object.values(object2)))
        return sameKeys && sameValues
    },

    teamConvert: function (league, team) {
        var leagueConvert = { onehl: '1', twohl: '2', thrhl: '3' }
        return parseInt(leagueConvert[league] + team.toString().slice(1, 3))
    },
}