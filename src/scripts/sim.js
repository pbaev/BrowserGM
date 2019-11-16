module.exports = {
  simToDate: function simToDate(endDate) {
    var startDate = JSON.parse(JSON.stringify(Vue.prototype.$gameInfo.time.date))
    var currentDate = Vue.prototype.$gameInfo.time.date
    var rawEnd = endDate

    var currentInt = (currentDate.day + currentDate.month * 100 + currentDate.year * 10000)
    endDate = (endDate.day + endDate.month * 100 + endDate.year * 10000)
    if (endDate < currentInt) {
      return 'past'
    }

    while (dateCompare()) {
      simGameDay()
      console.log(currentDate.day)
      if (currentDate.day === 28) { this.playerProgression()}

      if (currentDate.day === 1 & currentDate.month === 9) { Vue.prototype.$gameInfo.time.period = 'pre-season' }
      else if (currentDate.day === 1 & currentDate.month === 10) { 
        Vue.prototype.$gameInfo.time.period = 'regular' 
        Vue.prototype.$events.freeAgency.day = 'season'
      }
      else if (currentDate.day === 1 & currentDate.month === 4) {
        Vue.prototype.$gameInfo.time.period = 'playoff-r1'
        this.playoffStart()
      }
      else if (currentDate.day === 20 & currentDate.month === 4) {
        Vue.prototype.$gameInfo.time.period = 'playoff-r2'
        this.playoffRound(2)
      }
      else if (currentDate.day === 10 & currentDate.month === 5) {
        Vue.prototype.$gameInfo.time.period = 'playoff-r3'
        this.playoffRound(3)
      }
      else if (currentDate.day === 1 & currentDate.month === 6) {
        Vue.prototype.$gameInfo.time.period = 'playoff-r4'
        this.playoffRound(4)
      }
      else if (currentDate.day === 15 & currentDate.month === 6) {
        this.addressChange('misc', 'year-end');
        this.retirees()
        currentDate.day += 1
        return currentDate
      }
      else if (currentDate.day === 26 & currentDate.month === 6) {
        this.addressChange('misc', 'draft');
        currentDate.day += 1
        return currentDate
      }
      else if (currentDate.day === 27 & currentDate.month === 6) {
        if (Vue.prototype.$events.draft.currentPick !== 'Completed') {
          this.addressChange('misc', 'draft');
          return currentDate
        }
      }
      else if (currentDate.day === 29 & currentDate.month === 6) {
        this.yearEndReSign()
      }
      else if (currentDate.day === 1 & currentDate.month === 7) {
        Vue.prototype.$gameInfo.time.period = 'off-season'
        this.yearEnd()
      }
      else if (currentDate.day === 1 & currentDate.month === 7) {
        Vue.prototype.$events.freeAgency = {day: 'season'}
        this.tradeForNeeds()
        this.tradeForNeeds()
        this.tradeBuriedPlayers()
        this.tradeToEvenDepth() 
        this.tradeUnderCap()
        this.cleanTeamRosters()
      }
      else if (currentDate.day === 2 & currentDate.month === 7) {
        this.tradeBuriedPlayers()
        this.tradeForNeeds()
        this.tradeBuriedPlayers()
        this.cleanTeamRosters()
      }
      else if (currentDate.day === 25 && currentDate.month === 8) {
        this.signNecessaryDepth()
        this.cleanTeamRosters()
        this.startPreSeason()
      }
      else if (currentDate.day === 25 && currentDate.month === 9) {
        this.startSeason()
      }

      if (currentDate.month === 7) {
        this.freeAgencyUpdate()
      }


      //checks if user's lines are valid during the season
      if ([9, 10, 11, 12, 1, 2, 3, 4, 5].includes(currentDate.month) || (currentDate.month === 6 && currentDate.day < 15)) {
        var userTeam = Vue.prototype.$gameInfo.player.team.toString()
        if (!Vue.prototype.$teams.onehl[userTeam].checkLineValidity() ||
        !Vue.prototype.$teams.twohl['2' + userTeam.slice(1)].checkLineValidity() ||
        !Vue.prototype.$teams.thrhl['3' + userTeam.slice(1)].checkLineValidity()) {
          return currentDate
        }
      }

      currentDate = this.nextDays(currentDate, 1)
    }

    function simGameDay() {
      var stringDate = [currentDate.day, currentDate.month, currentDate.year].join('-')
      const leagues = { onehl: 0, twohl: 0, thrhl: 0 }
      for (var league in leagues) {
        if (Object.keys(Vue.prototype.$schedule.dates[league]).includes(stringDate)) {
          for (var n = 0; n < Vue.prototype.$schedule.dates[league][stringDate].length; n++) {
            var id = Vue.prototype.$schedule.dates[league][stringDate][n]
            var game = Vue.prototype.$schedule.id[league][id]

            game.simGame()
          }
        }
      }
    }

    function dateCompare() {
      var same = false
      if (currentDate.day !== rawEnd.day) { same = true }
      if (currentDate.month !== rawEnd.month) { same = true }
      if (currentDate.year !== rawEnd.year) { same = true }
      return same
    }

    Vue.prototype.$gameInfo.time.date = rawEnd
    return rawEnd
  }
}