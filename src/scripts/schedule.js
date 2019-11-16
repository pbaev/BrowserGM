module.exports = {
    nextDays: function (currentDay, days) {
        const months = { 1: 31, 2: 28, 3: 31, 4: 30, 5: 31, 6: 30, 7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31 }

        if (currentDay.day === 31 & currentDay.month === 12) {
            currentDay.day = 1
            currentDay.month = 1
            currentDay.year += 1
        }
        else {
            //Rolls over the month
            if ((currentDay.day + 1) > months[currentDay.month]) {
                currentDay.day = 1
                currentDay.month += 1
            }
            else {
                currentDay.day += 1
            }
        }

        if (days == 1) {
            return currentDay
        }
        else {
            return this.nextDays(currentDay, (days - 1))
        }
    },

    prettyDate: function (date) {
        const monthConvert = {
            1: 'January',
            2: 'February',
            3: 'March',
            4: 'April',
            5: 'May',
            6: 'June',
            7: 'July',
            8: 'August',
            9: 'September',
            10: 'October',
            11: 'November',
            12: 'December'
        }
        function daySuffix(day) {
            if ([1, 21, 31].includes(day)) {
                return day + 'st'
            }
            if ([2, 22].includes(day)) {
                return day + 'nd'
            }
            if ([3, 23].includes(day)) {
                return day + 'rd'
            }

            if (((4 <= day) & (day <= 20)) || ((24 <= day) & (day <= 30))) {
                return day + 'th'
            }
        }

        return monthConvert[date.month] + ' ' + daySuffix(date.day) + ' ' + date.year
    },
    
    scheduleGen: function (length, startDate) {
        function shuffle(a) {
            var j, x, i;
            for (var i = a.length - 1; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1))
                x = a[i]
                a[i] = a[j]
                a[j] = x
            }
            return a
        }

        var leagues = { onehl: 0, twohl: 0, thrhl: 0 }
        for (var league in leagues) {
            var schedule = {}
            var teams = []
            for (var team in Vue.prototype.$teams[league]) {
                teams.push(team)
                schedule[team] = []
            }

            var date = JSON.parse(JSON.stringify(startDate))

            Vue.prototype.$schedule.dates[league] = {}
            for (var game = 0; game < length; game++) {
                var shuffled = shuffle(teams)
                var groupOne = shuffled.slice(0, 16)
                var groupTwo = shuffled.slice(16)

                for (var tid = 0; tid < groupOne.length; tid += 2) {
                    var g = new Vue.prototype.$class.Game.Game({
                        league: league,
                        home: groupOne[tid],
                        away: groupOne[tid + 1],
                        date: JSON.parse(JSON.stringify(date)),
                        type: 'regular'
                    })
                    Vue.prototype.$schedule.id[league][g.id] = g
                }
                date = this.nextDays(date, 1)
                for (var tid = 0; tid < groupTwo.length; tid += 2) {
                    var g = new Vue.prototype.$class.Game.Game({
                        league: league,
                        home: groupTwo[tid],
                        away: groupTwo[tid + 1],
                        date: JSON.parse(JSON.stringify(date)),
                        type: 'regular'
                    })
                    Vue.prototype.$schedule.id[league][g.id] = g
                }
                date = this.nextDays(date, 1)
            }
        }
    },

    startPreSeason: function() {
        Vue.prototype.$schedule = { dates: { onehl: {}, twohl: {}, thrhl: {} }, teams: { onehl: {}, twohl: {}, thrhl: {} }, id: { onehl: {}, twohl: {}, thrhl: {} } }
        this.scheduleGen(8, { day: 2, month: 9, year: Vue.prototype.$gameInfo.time.season - 1 })
    },

    startSeason: function() {
        Vue.prototype.$gameInfo.time.period = 'regular'
        const season = Vue.prototype.$gameInfo.time.season
        Vue.prototype.$schedule = { dates: { onehl: {}, twohl: {}, thrhl: {} }, teams: { onehl: {}, twohl: {}, thrhl: {} }, id: { onehl: {}, twohl: {}, thrhl: {} } }
        this.scheduleGen(82, { day: 2, month: 10, year: (season -1) })
        for (var league in { onehl: 0, twohl: 0, thrhl: 0 }) {
            for (var tid in Vue.prototype.$teams[league]) {
                var team = Vue.prototype.$teams[league][tid]
                for (var stat in team.stats) {
                    team.stats[stat] = 0
                }
            }
        }
        for (var p in Vue.prototype.$players) {
            if (isNaN(parseInt(p))) {continue}
            var player = Vue.prototype.$players[p]
            for (var stat in player.stats[season]) {
                player.stats[season][stat] = 0
            }
        }
    }


}