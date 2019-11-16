const gMixin = require('../scripts/main.js')

module.exports = {
    schedulePage: {
        mixins: [gMixin],
        template: `
    <div class="schedule">
        <div class="horizontal-buttons">
            <a @click="league = 'onehl'" :style="{'background': colour().main}">1HL</a>
            <a @click="league = 'twohl'" :style="{'background': colour().main}">2HL</a>
            <a @click="league = 'thrhl'" :style="{'background': colour().main}">3HL</a>
        </div>
        <div class="schedule-legend">
            <div>
            <p>Current Date</p>
            <div class="schedule-legend-block schedule-current-date"></div>
            </div>
            <div>
            <p>Selected Date</p>
            <div class="schedule-legend-block schedule-selected-date"></div>
            </div>
            <div>
            <p>Special Event</p>
            <div class="schedule-legend-block schedule-special-date"></div>
            </div>
        </div>
        <p>{{prettyDate(date.split)}}</p>
        <div class="schedule-container">
            <a @click="scan('back')" class="schedule-arrow light-text" :style="{'background': colour().light}"> < </a>
            <table class="schedule-calendar">
                <tr>
                    <th>Sun</th>
                    <th>Mon</th>
                    <th>Tue</th>
                    <th>Wed</th>
                    <th>Thu</th>
                    <th>Fri</th>
                    <th>Sat</th>
                </tr>
                <tr v-for="week in 6" v-if="(((week-1)*7))-date.datePos <= date.month[date.split.month].length-1">
                    <td 
                    v-for="day in 7"
                    v-if="(((week-1)*7)+day)-date.datePos <= date.month[date.split.month].length & (((week-1)*7)+day)-date.datePos > 0"
                    @click="selectDate(((week-1)*7)+day-date.datePos)"
                    :class="dateInfo(((week-1)*7)+day-date.datePos).className"
                    v-html="dateInfo(((week-1)*7)+day-date.datePos).html">
                    </td>
    
                    <td v-else></td>
                </tr>
            </table>
            <a @click="scan('forward')" class="schedule-arrow light-text" :style="{'background': colour().light}"> > </a>
        </div>
        <p v-if="alert !== false">{{alert}}</p>
        <div class="selected-bar selected-bar-bottom">
            <div class="horizontal-buttons">
                <a @click="simButton()" :style="{'background': colour().main}">Sim To Date</a>
                <a v-if="checkGame(selectedDate).display" :style="{'background': colour().main}"
                @click="addressChange('game',league+'-'+checkGame(selectedDate).display,{})">View Game</a>
            </div>
        </div>
    </div>
    `,

        data: function () {
            var split = JSON.parse(JSON.stringify(Vue.prototype.$gameInfo.time.date))
            return {
                gameInfo: Vue.prototype.$gameInfo,
                league: 'onehl',
                selectedDate: 4,
                alert: false,
                date: {
                    'split': split,
                    'datePos': this.datePosition(split),
                    'month': {
                        1: {
                            'name': 'January',
                            'length': 31
                        },
                        2: {
                            'name': 'February',
                            'length': 28
                        },
                        3: {
                            'name': 'March',
                            'length': 31
                        },
                        4: {
                            'name': 'April',
                            'length': 30
                        },
                        5: {
                            'name': 'May',
                            'length': 31
                        },
                        6: {
                            'name': 'June',
                            'length': 30
                        },
                        7: {
                            'name': 'July',
                            'length': 31
                        },
                        8: {
                            'name': 'August',
                            'length': 31
                        },
                        9: {
                            'name': 'September',
                            'length': 30
                        },
                        10: {
                            'name': 'October',
                            'length': 31
                        },
                        11: {
                            'name': 'November',
                            'length': 30
                        },
                        12: {
                            'name': 'December',
                            'length': 31
                        },
                    }
                }
            }
        },
        methods: {
            dateInfo: function (date) {
                try {
                    var league = this.league
                }
                catch {
                    var league = 'onehl'
                }
                var team = this.teamConvert(league,  Vue.prototype.$gameInfo.player.team )
                var games = Vue.prototype.$schedule.teams[league][team]


                var currentTime = Vue.prototype.$gameInfo.time.date
                if (date == currentTime.day & this.date.split.month === currentTime.month & this.date.split.year === currentTime.year) {
                    var clas = 'schedule-current-date'
                }
                else if (date == this.selectedDate) {
                    var clas = 'schedule-selected-date'
                }
                else {
                    var clas = ''
                }

                // Used to mark events on calendar
                if (this.sameObject({ day: date, month: this.date.split.month }, { day: 1, month: 9 })) {
                    if (clas === '') { clas = 'schedule-special-date' }
                    return { html: `<p>` + date + `</p>` + `<p>Pre</p><p>Season</p>`, className: clas }
                }
                if (this.sameObject({ day: date, month: this.date.split.month }, { day: 1, month: 10 })) {
                    if (clas === '') { clas = 'schedule-special-date' }
                    return { html: `<p>` + date + `</p>` + `<p>Regular</p><p>Season</p>`, className: clas }
                }
                if (this.sameObject({ day: date, month: this.date.split.month }, { day: 14, month: 1 })) {
                    if (clas === '') { clas = 'schedule-special-date' }
                    return { html: `<p>` + date + `</p>` + `<p>Trade</p><p>Deadline</p>`, className: clas }
                }
                else if (this.sameObject({ day: date, month: this.date.split.month }, { day: 27, month: 6 })) {
                    if (clas === '') { clas = 'schedule-special-date' }
                    return { html: `<p>` + date + `</p>` + `<p>Draft</p>`, className: clas }
                }
                else if (this.sameObject({ day: date, month: this.date.split.month }, { day: 1, month: 4 })) {
                    if (clas === '') { clas = 'schedule-special-date' }
                    return { html: `<p>` + date + `</p>` + `<p>Round</p><p>One</p>`, className: clas }
                }
                else if (this.sameObject({ day: date, month: this.date.split.month }, { day: 20, month: 4 })) {
                    if (clas === '') { clas = 'schedule-special-date' }
                    return { html: `<p>` + date + `</p>` + `<p>Round</p><p>Two</p>`, className: clas }
                }
                else if (this.sameObject({ day: date, month: this.date.split.month }, { day: 10, month: 5 })) {
                    if (clas === '') { clas = 'schedule-special-date' }
                    return { html: `<p>` + date + `</p>` + `<p>Round</p><p>Three</p>`, className: clas }
                }
                else if (this.sameObject({ day: date, month: this.date.split.month }, { day: 1, month: 6 })) {
                    if (clas === '') { clas = 'schedule-special-date' }
                    return { html: `<p>` + date + `</p>` + `<p>Round</p><p>Four</p>`, className: clas }
                }
                else if (this.sameObject({ day: date, month: this.date.split.month }, { day: 1, month: 7 })) {
                    if (clas === '') { clas = 'schedule-special-date' }
                    return { html: `<p>` + date + `</p>` + `<p>Free</p><p>Agency</p>`, className: clas }
                }

                for (var game in games) {
                    var day = Vue.prototype.$schedule.id[league][games[game]].date
                    if (day.day === date & day.month === this.date.split.month & day.year === this.date.split.year) {
                        var sGame = Vue.prototype.$schedule.id[league][games[game]]
                        var team = this.teamConvert(league,Vue.prototype.$gameInfo.player.team )

                        if (sGame.home == team) {
                            var info = 'vs ' + Vue.prototype.$teams[league][sGame.away].name.abb
                            var score = sGame.summary.score.home + '-' + sGame.summary.score.away
                            if (score === '0-0') { score = '' }
                        }
                        else {
                            var info = '@ ' + Vue.prototype.$teams[league][sGame.home].name.abb
                            var score = sGame.summary.score.away + '-' + sGame.summary.score.home
                            if (score === '0-0') { score = '' }
                        }
                        if (sGame.summary.extraTime == 'ot') {
                            score += ' OT'
                        }
                        else if (sGame.summary.extraTime == 'so') {
                            score += ' SO'
                        }

                        return { html: `<p>` + date + `</p><p>` + info + `</p><p>` + score + `<p>`, className: clas }
                    }

                }
                return { html: `<p>` + date + `</p>`, className: clas }
            },

            checkGame: function (date) {
                try {
                    var league = this.league
                }
                catch {
                    var league = 'onehl'
                }
                var gameInfo = { display: false }
                var dateGames = Vue.prototype.$schedule.dates[league][date + '-' + this.date.split.month + '-' + this.date.split.year]
                for (var item in dateGames) {
                    var game = Vue.prototype.$schedule.id[league][dateGames[item]]
                    if (game.home == this.teamConvert(league, Vue.prototype.$gameInfo.player.team)
                        || game.away == this.teamConvert(league, Vue.prototype.$gameInfo.player.team)) {
                        gameInfo.display = game.id
                    }
                }
                return gameInfo
            },

            datePosition: function (date) {
                //finds what day the first of the month is
                var yearCode = parseInt(date.year.toString().slice(2, 4))
                yearCode += Math.floor(yearCode / 4)
                yearCode %= 7

                const monthGuide = [0, 3, 3, 6, 1, 4, 6, 2, 5, 0, 3, 5]
                var monthCode = monthGuide[parseInt(date['month']) - 1]

                const centuryGuide = {
                    19: 0,
                    20: 6,
                    21: 4,
                    22: 2,
                    23: 0
                }
                var centuryCode = centuryGuide[parseInt(date.year.toString().slice(0, 2))]

                var datePos = (yearCode + monthCode + centuryCode + 1) % 7 % 7 % 7

                try {
                    this.date.datePos = datePos
                } catch { } //So it doesn't run first time
                return datePos
            },

            scan: function (direction) {
                if (direction === 'forward') {
                    var d = this.date.split
                    if (d['month'] === 12) {
                        d['month'] = 1
                        d['year'] = (parseInt(d['year']) + 1)
                    } else {
                        d['month'] = (parseInt(d['month']) + 1)
                    }
                    this.datePosition(d)

                } else if (direction === 'back') {
                    var d = this.date.split
                    if (d['month'] === 1) {
                        d['month'] = 12
                        d['year'] = (parseInt(d['year']) - 1)
                    } else {
                        d['month'] = (parseInt(d['month']) - 1)
                    }
                    this.datePosition(d)
                }
            },

            checkLines: function () {
                if ([9, 10, 11, 12, 1, 2, 3, 4, 5].includes(this.date.split.month) || (this.date.split.month === 6 && this.date.split.day < 15)) {
                    var userTeam = Vue.prototype.$gameInfo.player.team.toString()
                    if (!Vue.prototype.$teams.onehl[userTeam].checkLineValidity()) {
                        return '1HL lines are not valid'
                    }
                    else if (!Vue.prototype.$teams.twohl['2' + userTeam.slice(1)].checkLineValidity()) {
                        return '2HL lines are not valid'
                    }
                    else if (!Vue.prototype.$teams.thrhl['3' + userTeam.slice(1)].checkLineValidity()) {
                        return '3HL lines are not valid'
                    }
                    else {
                        return true
                    }
                }
                else {
                    return true
                }
            },

            selectDate: function (date) {
                this.selectedDate = date
                this.alert = false
            },
            simButton: function () {
                var endDate = {
                    'day': this.selectedDate,
                    'month': this.date.split.month,
                    'year': this.date.split.year
                }
                var currentDate = JSON.parse(JSON.stringify(Vue.prototype.$gameInfo.time.date))
                if (this.laterDate(currentDate, endDate)) {
                    this.alert = "Can't sim backwards"
                    return
                }
                else if (this.checkLines() !== true) {
                    this.alert = this.checkLines()
                    return
                }
                var returnedDate = JSON.parse(JSON.stringify(this.simToDate(endDate)))
                this.date.split.day = returnedDate.day
                this.date.split.month = returnedDate.month
                this.date.split.year = returnedDate.year
            }

        },

    }

}