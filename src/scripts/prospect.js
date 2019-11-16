module.exports = {
  prospectGen: function() {
    const regions = ['canada', 'states', 'easternEurope', 'europe', 'scandanavia', 'rest']

    for (var n = 0; n < 300; n++) {
      var r = Math.round()
      if (r > 0.9) { var position = 'g' }
      else if (r > 0.54) { var position = ['ld', 'rd'][this.rnd(0, 1)] }
      else { var position = ['lw', 'c', 'rw'][this.rnd(0, 2)] }
      var region = regions[this.rnd(0, 5)]

      var player = new Vue.prototype.$class.Player.Player({
        type: 'prospect',
        position: position,
        region: region

      })
      Vue.prototype.$players[player.id] = player
      Vue.prototype.$teams.prospects[region].players.push(player.id)
    }
    this.prospectFogOfWar()
  },

  prospectFogOfWar: function() {
    const regions = ['canada', 'states', 'easternEurope', 'europe', 'scandanavia', 'rest']
    for (var region in regions) {
      const players = Vue.prototype.$teams.prospects[regions[region]].players
      for (var prospect in players) {

        function intToChance(int) {
          if (int >= 80) { return 'A' }
          else if (int >= 70) { return 'B' }
          else if (int >= 60) { return 'C' }
          else if (int >= 50) { return 'D' }
          else if (int >= 30) { return 'E' }
          else { return 'F' }
  
        }
        function intToCeiling(int) {
          if (player.position === 'g') {
            if (int > 80) { return 'Starter' }
            else if (int > 70) { return 'Backup' }
            else { return 'Replacement' }
          }
          else if (player.position === 'ld' | player.position === 'rd') {
            if (int > 84) { return '1st Pair' }
            else if (int > 78) { return '2nd Pair' }
            else if (int > 74) { return '3rd Pair' }
            else { return 'Replacement' }
          }
          else if (player.position === 'lw' | player.position === 'c' | player.position === 'rw') {
            if (int > 84) { return 'Top 3' }
            else if (int > 78) { return 'Top 6' }
            else if (int > 75) { return 'Top 9' }
            else if (int > 72) { return 'Top 12' }
            else { return 'Replacement' }
          }
        }

        var certainty = Vue.prototype.$gameInfo.scouting[regions[region]].points + this.rnd(-10, 10)

        var player = Vue.prototype.$players[players[prospect]]
        player.potential.certainty.int = certainty
        player.potential.certainty.name = intToChance(certainty)
        player.potential.chance.shownInt = player.potential.chance.int + this.rnd(-Math.floor((100 - certainty)/2), Math.floor((100 - certainty)/2))
        player.potential.chance.shownName = intToChance(player.potential.chance.shownInt)
        player.potential.ceiling.shownInt = player.potential.ceiling.int + this.rnd(-Math.floor((100 - certainty)/2), Math.floor((100 - certainty)/2))
        player.potential.ceiling.shownName = intToCeiling(player.potential.ceiling.shownInt)

        
      }
    }

  },


}