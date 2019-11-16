module.exports = {
  Game: class Game {
    constructor({
      load = null,
      loadData = null,

      league = null,
      home = null,
      away = null,
      date = null,
      type = null
    }) {
      if (load) {
        for (var info in loadData) {
          this[info] = loadData[info]
        }
      }
      else {
        this.league = league
        this.id = this.generateId()
        this.home = parseInt(home)
        this.away = parseInt(away)
        this.date = date
        this.type = type
        this.summary = {
          extraTime: false,
          goals: [],
          penalties: [],
          ticks: 0,
          score: { home: 0, away: 0 }
        }
        this.stats = {
          home: {
            goals: 0, pps: 0, ppTime: 0, ppgf: 0, ppga: 0, pks: 0, pkTime: 0, pkgf: 0, pkga: 0, fow: 0, fol: 0, shots: 0, saves: 0
          },
          away: {
            goals: 0, pps: 0, ppTime: 0, ppgf: 0, ppga: 0, pks: 0, pkTime: 0, pkgf: 0, pkga: 0, fow: 0, fol: 0, shots: 0, saves: 0
          }
        }
      }

      // Adds game to schedule. Catch if the date doesn't have any games yet
      try {
        Vue.prototype.$schedule.teams[this.league][this.home].push(this.id)
      }
      catch {
        Vue.prototype.$schedule.teams[this.league][this.home] = [this.id]
      }
      try {
        Vue.prototype.$schedule.teams[this.league][this.away].push(this.id)
      }
      catch {
        Vue.prototype.$schedule.teams[this.league][this.away] = [this.id]
      }
      try {
        Vue.prototype.$schedule.dates[this.league][this.date.day + '-' + this.date.month + '-' + this.date.year].push(this.id)
      }
      catch {
        Vue.prototype.$schedule.dates[this.league][this.date.day + '-' + this.date.month + '-' + this.date.year] = [this.id]
      }
    }


    generateId() {
      if (Math.max.apply(Math, Object.keys(Vue.prototype.$schedule.id[this.league])) === -Infinity) {
        return 1
      }
      else {
        //finds max int in a list where there can be strings
        return Math.max.apply(Math, Object.keys(Vue.prototype.$schedule.id[this.league])) + 1
      }
    }


    nextPlayoffGame(seriesInfo) {
      var league = this.league
      var date = JSON.parse(JSON.stringify(Vue.prototype.$gameInfo.time.date))
      var gameNum = seriesInfo.score[0] + seriesInfo.score[1]

      function nextDay(date, increment) {
        if (date.month == 2) {
          var monthLength = 27
        }
        else {
          var monthLength = 29
        }
        date.day += increment
        if (date.day > monthLength) {
          date.day = 1
          date.month++
          if (date.month === 13) {
            date.year++
            date.month = 1
            date.day = 1
          }
        }
        return JSON.parse(JSON.stringify(date))
      }

      if (gameNum == 0 || gameNum == 1 || gameNum == 4 || gameNum == 6) {
        var homeTeam = seriesInfo.hi
        var awayTeam = seriesInfo.lo
      }
      else {
        var homeTeam = seriesInfo.lo
        var awayTeam = seriesInfo.hi
      }

      var g = new Vue.prototype.$class.Game.Game({ league: league, home: homeTeam, away: awayTeam, date: nextDay(date, 2), type: 'playoff' })
      Vue.prototype.$schedule.id[league][g.id] = g
    }



    simGame() {
      const season = Vue.prototype.$gameInfo.time.season
      const home = this.home
      const away = this.away
      const league = this.league
      var summary = this.summary
      var teams = {
        home: Vue.prototype.$teams[league][home],
        away: Vue.prototype.$teams[league][away],
      }

      const otherTeam = { home: 'away', away: 'home' }


      /* STATS */

      var stats = this.stats

      /* PLAYERS */

      function makeGamePlayer(pid) {

        function multiplier(value, variance) {
          // variance is how much above and below 1 the range can be
          // for example a variance of 0.10 (0.90 - 1.10)
          // value 0 returns 0.90, value 50 returns 1.00, value 90 returns 1.08
          var score = (1 - variance) + (variance * (value / 100) * 2)
          return score
        }


        function playerEnergyDrain(player) {
          if (player.position === 'g') {
            return 0.02
          }
          else if (['lw', 'c', 'rw'].includes(player.position)) {
            // The energy drain range is (0.695 - 1.105) 
            // That is (42 - 66) energy lost per minute of playing
            var score = 2 - multiplier(player.attributes.stamina, 0.2) - (multiplier(player.attributes.strength, 0.05) * 0.1)
            return score
          }
          else {
            // The energy drain range is (0.595 - 1.005) 
            // That is (36 - 60) energy lost per minute of playing
            var score = 1.9 - multiplier(player.attributes.stamina, 0.2) - (multiplier(player.attributes.strength, 0.05) * 0.1)
            return score
          }

        }

        var player = Vue.prototype.$players[pid]


        var playerInfo = {
          id: player.id,
          position: player.position,
          offence: player.categoryScores().offence,
          defence: player.categoryScores().defence,
          stats: player.stats[season],
          energy: 100,
          energyDrain: playerEnergyDrain(player),
          penalized: false,
        }

        return Object.assign({}, playerInfo, player.attributes)
      }


      var players = {}
      for (var team in teams) {
        for (var n in teams[team].players) {
          var pid = teams[team].players[n]
          players[pid] = makeGamePlayer(pid)
        }
      }


      /* Lines */

      var lines = {
        home: teams.home.lines,
        away: teams.away.lines,
      }

      function playersInLine(team, strength, type, line) {
        // ex paramaters: function('home', 'v43', 'defence', 2)
        // returns players in line by position, omits missing positions
        // ex return: {ld:74820, rd: Player}
        var pids = {}
        const positionTypes = { forward: ['lw', 'c', 'rw'], defence: ['ld', 'rd'] }
        for (var p in positionTypes[type]) {
          var pos = positionTypes[type][p]
          pids[pos] = players[lines[team][strength][pos][line]]
        }
        return pids
      }

      function allPlayersOnIce() {
        //return all players on ice in format {home: {lw:8362, c:4353, rw:5421, ld: Player, rd: Player}, away:{...}}
        // ids above are actually the player object/class
        var allPlayers = { home: {}, away: {} }
        for (var team in teams) {
          var line = lines[team][getStrength(team)]
          var lineOnIce = gameState.lineOnIce[team]
          allPlayers[team].lw = players[line.lw[lineOnIce.forward]]
          allPlayers[team].c = players[line.c[lineOnIce.forward]]
          allPlayers[team].rw = players[line.rw[lineOnIce.forward]]
          allPlayers[team].ld = players[line.ld[lineOnIce.defence]]
          allPlayers[team].rd = players[line.rd[lineOnIce.defence]]

          for (var pos in { lw: 0, c: 0, rw: 0, ld: 0, rd: 0 }) {
            if (typeof allPlayers[team][pos] === 'undefined') {
              delete allPlayers[team][pos]
            }
          }
        }
        return allPlayers
      }

      function allPlayersOnIceList(grouping) {
        // return players in list like {home: [Player, ...], away: [...]]}

        var allPlayers = allPlayersOnIce()
        var listPlayers = { home: [], away: [] }
        for (var team in teams) {
          for (var position in allPlayers[team]) {
            listPlayers[team].push(allPlayers[team][position])
          }
        }
        if (grouping === 'byTeam') {
          return listPlayers
        }
        else if (grouping === 'all') {
          return listPlayers.home.concat(listPlayers.away)
        }
      }


      function playersTotalAttributes(allPlayers, attribute) {
        // takes in ({lw:4532, c:Player, rw: Player}, faceOff), players are like the output of allPlayersOnIce()
        // then returns the sum of the requested attribute from all the players
        var total = 0
        if (['offence', 'defence', 'energy'].includes(attribute)) {
          for (var position in allPlayers) {
            total += allPlayers[position][attribute]
          }
        }
        else {
          for (var position in allPlayers) {
            total += allPlayers[position].attributes[attribute]
          }
        }
        return total
      }

      function totalLinesAttribute(attribute, team, strength, type) {
        // ex paramaters: function('energy', 'home', 'v54', 'forward')
        // returns total energy of all the forward/defence lines the given strength
        // ex return: [167, 87, 200, 95]
        var energies = []

        var all = lines[team][strength]

        if (type === 'forward') {
          for (var n = 0; n < all.c.length; n++) {
            for (var pos in { lw: 0, c: 0, rw: 0 }) {
              if (all[pos][n] == '0') {
                continue
              }
              else if (energies.length === n) {
                energies.push(players[all[pos][n]][attribute])
              }
              else {
                energies[n] += players[all[pos][n]][attribute]
              }
            }
          }
        }
        else if (type === 'defence') {
          for (var n = 0; n < all.ld.length; n++) {
            for (var pos in { ld: 0, rd: 0 }) {
              if (all[pos][n] == '0') {
                continue
              }
              else if (energies.length === n) {
                energies.push(players[all[pos][n]][attribute])
              }
              else {
                energies[n] += players[all[pos][n]][attribute]
              }
            }
          }
        }
        return energies
      }


      /* GAME STATE */

      // zone is one of: 
      //'home-net','home-blueline','home-neutral','center','away-neutral','away-blueline','away-net'

      function getStrength(team) {
        // returns game strength relative to team
        // ex: function('away') return 'v35'
        if (team === 'home') {
          return 'v' + gameState.strength.home.toString() + gameState.strength.away.toString()
        }
        else if (team === 'away') {
          return 'v' + gameState.strength.away.toString() + gameState.strength.home.toString()
        }

      }

      var gameState = {
        tick: 0,
        endTick: 3600,
        strength: { home: 5, away: 5 },
        penalties: { home: [], away: [] },
        zone: 'center',
        stoppage: true,
        lineOnIce: { home: { forward: 0, defence: 0 }, away: { forward: 0, defence: 0 } },
        gameFinished: false,
        possesion: 'neutral',
        goalies: { home: lines.home.g[0], away: lines.away.g[0] },
        score: { home: 0, away: 0 },
        goalSummary: [],
        penaltySummary: [],
        extraTime: false,
      }

      /* GAME SIMULATION */

      function proportionChance(teamOneValue, teamTwoValue) {
        var total = teamOneValue + teamTwoValue
        teamOneValue = teamOneValue / total
        teamTwoValue = 1 - teamOneValue
        teamOneValue = 0
        if (Math.random() < teamTwoValue) {
          return 'teamTwo'
        }
        else {
          return 'teamOne'
        }
      }

      function changeLines() {
        //Lines change based on line energy and line desirability
        const lineDesire = [1, 0.8, 0.65, 0.6]
        for (team in teams) {
          for (var type in { forward: 0, defence: 0 }) {
            var bestLineValue = -1
            var chosenLine = 0

            var lineWeight = totalLinesAttribute('energy', team, getStrength(team), type)

            for (var n = 0; n < lineWeight.length; n++) {
              lineWeight[n] = parseInt(lineWeight[n] * lineDesire[n])

              if (lineWeight.length > gameState.lineOnIce[team][type]) {
                lineWeight[gameState.lineOnIce[team][type]] += 15
              }

              if (lineWeight[n] > bestLineValue) {
                bestLineValue = lineWeight[n]
                chosenLine = n
              }
            }
            gameState.lineOnIce[team][type] = chosenLine
          }
        }

      }


      function changePossesion() {
        if (gameState.stoppage) {
          //Faceoff

          var faceOffScore = currentPlayers.home.c.faceOff + currentPlayers.away.c.faceOff
          if ((Math.random() * faceOffScore) < currentPlayers.home.c.faceOff) {
            gameState.possesion = 'home'
            stats.home.fow += 1
            stats.away.fol += 1
          }
          else {
            gameState.possesion = 'away'
            stats.home.fol += 1
            stats.away.fow += 1
          }
          gameState.stoppage = false
        }
        else {
          //on the fly possesion change 
          if (Math.random() > 0.9)  {
            var homeScore = playersTotalAttributes(currentPlayers.home, 'offence') + playersTotalAttributes(currentPlayers.home, 'defence')
            var awayScore = playersTotalAttributes(currentPlayers.away, 'offence') + playersTotalAttributes(currentPlayers.away, 'defence')
            var totalScore = homeScore + awayScore
            homeScore = homeScore / totalScore
            awayScore = 1 - homeScore
            homeScore = 0

            if (Math.random() > 0.8) {
              gameState.possesion = 'neutral'
            }
            else if (Math.random() < awayScore) {
              gameState.possesion = 'home'
            }
            else {
              gameState.possesion = 'away'
            }
          }
        }
      }

      function changeZone() {
        const zoneList = ['home-net', 'home-blueline', 'home-neutral', 'center', 'away-neutral', 'away-blueline', 'away-net']
        var currentZoneIndex = zoneList.indexOf(gameState.zone)
        if (Math.random() > 0.9) {
          var homeScore = playersTotalAttributes(currentPlayers.home, 'offence') + playersTotalAttributes(currentPlayers.home, 'defence')
          var awayScore = playersTotalAttributes(currentPlayers.away, 'offence') + playersTotalAttributes(currentPlayers.away, 'defence')

          if (proportionChance(homeScore, awayScore) === 'teamOne') {
            if (currentZoneIndex !== 6) {
              gameState.zone = zoneList[currentZoneIndex + 1]
            }
          }
          else {
            if (currentZoneIndex !== 0)
              gameState.zone = zoneList[currentZoneIndex - 1]
          }
        }
      }


      function tryShot() {
        const zoneMultiplier = { net: 1.1, blueline: 0.75, neutral: 0.3 }
        if (gameState.possesion === 'neutral') {
          return
        }
        if (gameState.possesion === gameState.zone.split('-')[0]) {
          return
        }
        const relTeams = { shooting: gameState.possesion, defending: otherTeam[gameState.possesion] }

        if (gameState.possesion !== gameState.zone.split('-')[1]) {
          var zoneFactor = zoneMultiplier[gameState.zone.split('-')[1]]
          var shootingTeam = playersTotalAttributes(currentPlayers[relTeams.shooting], 'offence') * zoneFactor
          var defendingTeam = playersTotalAttributes(currentPlayers[relTeams.defending], 'defence')

          if (Math.random() > 0.93) {
            //shot is made

            function shooter() {
              var bestScorer = { player: 0, value: -99 }
              for (var pos in currentPlayers[relTeams.shooting]) {
                var player = currentPlayers[relTeams.shooting][pos]
                var score = parseInt((player.wrist + (player.slap / 3) + (player.oiq / 4)) * Math.random())
                if (score > bestScorer.value) {
                  bestScorer = { player: player, value: score }
                }
              }
              bestScorer.player.stats.shots += 1
              return bestScorer.player.id
            }

            var goal = shooter()

            if (proportionChance(shootingTeam, defendingTeam) === 'teamOne') {
              stats[relTeams.shooting].shots += 1
              var goalie = gameState.goalies[relTeams.defending]

              var goalieScore = players[goalie].defence * 28

              if (proportionChance(goalieScore, shootingTeam) === 'teamOne') {
                //save
                players[goalie].stats.saves += 1
                stats[relTeams.defending].saves += 1
              }
              else {
                //goal
                stats[relTeams.shooting].goals += 1
                players[goalie].stats.goalsAgainst += 1
                gameState.score[relTeams.shooting] += 1
                gameState.stoppage = true
                gameState.possesion = 'neutral'
                gameState.zone = 'center'
                var strength = 'EV'

                if (gameState.strength[relTeams.shooting] > gameState.strength[relTeams.defending]) {
                  stats[relTeams.shooting].ppgf += 1
                  stats[relTeams.defending].pkga += 1
                  strength = 'PP'
                }
                else if (gameState.strength[relTeams.shooting] < gameState.strength[relTeams.defending]) {
                  stats[relTeams.shooting].pkgf += 1
                  stats[relTeams.defending].ppga += 1
                  strength = 'PK'
                }

                function assister(alreadyCredited) {
                  var bestAssister = { player: 0, value: -1 }
                  for (var pos in currentPlayers[relTeams.shooting]) {
                    var player = currentPlayers[relTeams.shooting][pos]
                    if (!alreadyCredited.includes(player.id)) {
                      var score = parseInt((player.passing + (player.oiq / 3) - 50) * Math.random())
                      if (score > bestAssister.value) {
                        bestAssister = { player: player, value: score }
                      }
                    }
                  }
                  bestAssister.player.stats.assists += 1
                  bestAssister.player.stats.points += 1
                  return bestAssister.player.id
                }

                //goal is from earlier shooter() function
                players[goal].stats.goals += 1
                players[goal].stats.points += 1
                var points = []
                points.push(goal)

                if (Math.random() > 0.1) {
                  var a1 = assister(points)
                  points.push(a1)
                  var firstAssist = true
                }
                if (firstAssist && Math.random() > 0.4) {
                  var a2 = assister(points)
                  points.push(a2)
                }

                gameState.goalSummary.push({
                  time: gameState.tick,
                  points: points,
                  strength: strength
                })

              }
            }
          }
        }
      }

      function penalties() {
        const onIce = allPlayersOnIceList('byTeam')
        for (var team in teams) {
          if (gameState.penalties[team].length > 0) {
            stats[team].pkTime += 1
            stats[otherTeam[team]].ppTime += 1
          }

          for (var n = 0; n < gameState.penalties[team]; n++) {
            if (gameState.penalties[team][n] === gameState.tick) {
              gameState.penalties[team] = gameState.penalties[team].slice(1)
              if (gameState.penalties[team].length < 2) {
                gameState.strength[team] += 1
              }
            }
          }
          for (var n = 0; n < onIce[team].length; n++) {
            var player = onIce[team][n]
            var penaltyChance = (100 - player.discipline) / 100000
            if (penaltyChance > Math.random()) {
              //penalty called
              if (gameState.strength[team] === 3) {
                var penaltyNum = gameState.penalties[team].length
                var secondLastPenalty = gameState.penalties[penaltyNum - 2]
                gameState.penalties[team].push(secondLastPenalty + 120)
              }
              else {
                gameState.penalties[team].push(gameState.tick + 120)
                gameState.strength[team] -= 1
              }
              gameState.zone = [otherTeam[team], 'blueline'].join('-')
              gameState.stoppage = true
              player.stats.pim += 2
              stats[team].pks += 1
              stats[otherTeam[team]].pps += 1
              gameState.penaltySummary.push({ time: gameState.tick, id: player.id })

            }
          }
        }
      }

      function usedEnergy() {
        var onIce = allPlayersOnIceList('all').map(p => p.id)


        for (var n in players) {
          var player = players[n]
          if (onIce.includes(player.id)) {
            if (player.energy > player.energyDrain) {
              player.energy -= player.energyDrain
            }
            player.stats.toi += 1
          }
          else {
            if (player.energy < 100) {
              player.energy += 0.4
            }
          }
        }
      }

      function stoppage() {
        if ([1200, 2400, 3600].includes(gameState.tick)) {
          //end of period
          gameState.stoppage = true
          gameState.possesion = 'neutral'
          gameState.zone = 'center'
        }
        else if (Math.random() > 0.985) {
          // puck stoppage/out of play
          gameState.stoppage = true
          gameState.possesion = 'neutral'
          if (gameState.zone === 'home-net') {
            gameState.zone = 'home-blueline'
          }
          else if (gameState.zone === 'away-net') {
            gameState.zone = 'away-blueline'
          }
        }
      }



      function gameEnd() {

        if (gameState.score.home !== gameState.score.away) {
          gameState.gameFinished = true
        }

        else if (gameState.tick >= 3900) {
          // a shootout, this is very accurate
          if (self.type === 'playoffs') {
            if (gameState.score.home === gameState.score.away) {
              gameState.endTick++
              gameState.gameFinished = false
            }
            else {
              gameState.gameFinished = true
            }
          }
          else {
            if (Math.random() > 0.5) {
              gameState.score.home += 1
            }
            else {
              gameState.score.away += 1
            }
            gameState.extraTime = 'so'
            gameState.gameFinished = true
          }
        }

        else if (!gameState.extraTime & (gameState.score.home === gameState.score.away)) {
          // overtime
          gameState.extraTime = 'ot'
          gameState.endTick = 3900
        }

        if (gameState.gameFinished) {
          //Game is finished
          summary.goals = gameState.goalSummary
          summary.penalties = gameState.penaltySummary
          summary.extraTime = gameState.extraTime
          summary.score = gameState.score

          for (var team in teams) {
            for (var type in stats[team]) {
              if (type === 'goals') {
                teams[team].stats.goalsFor += stats[team].goals
              }
              else {
                teams[team].stats[type] += stats[team][type]
              }
            }
            teams[team].stats.goalsAgainst = stats[otherTeam[team]].goals
            teams[team].stats.gamesPlayed += 1

            var winner = (gameState.score[team] > gameState.score[otherTeam[team]])
            if (winner & !gameState.extraTime) {
              teams[team].stats.wins += 1
            }
            else if (winner & gameState.extraTime === 'ot') {
              teams[team].stats.otw += 1
            }
            else if (winner & gameState.extraTime === 'so') {
              teams[team].stats.sow += 1
            }
            else if (!winner & !gameState.extraTime) {
              teams[team].stats.losses += 1
            }
            else if (!winner & gameState.extraTime === 'ot') {
              teams[team].stats.otl += 1
            }
            else if (!winner & gameState.extraTime === 'so') {
              teams[team].stats.sol += 1
            }

          }

          for (var n in players) {
            var player = players[n]
            if (player.position !== 'g') {
              player.stats.gamesPlayed += 1
            }
          }

          var homeGoalie = players[gameState.goalies.home].stats
          homeGoalie.toi += gameState.endTick
          homeGoalie.savePctg = (homeGoalie.saves / (homeGoalie.saves + homeGoalie.goalsAgainst)).toFixed(2)
          homeGoalie.gaa = (homeGoalie.goalsAgainst / (homeGoalie.toi / 3600)).toFixed(2)
          homeGoalie.gamesPlayed += 1
          var awayGoalie = players[gameState.goalies.away].stats
          awayGoalie.toi += gameState.endTick
          awayGoalie.savePctg = (awayGoalie.saves / (awayGoalie.saves + awayGoalie.goalsAgainst)).toFixed(2)
          awayGoalie.gaa = (awayGoalie.goalsAgainst / (awayGoalie.toi / 3600)).toFixed(2)
          awayGoalie.gamesPlayed += 1

          if (self.type == 'playoff') {
            var round = Vue.prototype.$gameInfo.time.period.split('-')[1]
            for (var matchup in Vue.prototype.$events.playoffs[self.league][round]) {
              var g = Vue.prototype.$events.playoffs[self.league][round][matchup]
              if (g.hi == home || g.lo == home) {
                if (g.hi == home && (gameState.score.home > gameState.score.away)) {
                  g.score[0] += 1
                }
                else if (g.hi == away && (gameState.score.away > gameState.score.home)) {
                  g.score[0] += 1
                }
                else {
                  g.score[1] += 1
                }

                if (!(g.score[0] >= 4 || g.score[1] >= 4)) {
                  self.nextPlayoffGame(JSON.parse(JSON.stringify(g)))
                }
              }
            }
          }
        }

      }

      while (!gameState.gameFinished) {
        var self = this
        changeLines()
        var currentPlayers = allPlayersOnIce()
        changePossesion()
        changeZone()
        tryShot()
        penalties()
        usedEnergy()
        stoppage()
        

        gameState.tick++
        if ((gameState.tick === gameState.endTick) || gameState.extraTime === 'ot' && (gameState.score.home !== gameState.score.away)) {
          gameEnd()
        }
      }
    }
  }
}


