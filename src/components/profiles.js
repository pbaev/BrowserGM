const gMixin = require('../scripts/main.js')

module.exports = {
  gameProfile: {
    mixins: [gMixin],
    template: `
      <div>
        <div v-if="!gameBeenPlayed">
          <p>{{game.league+' '+prettyDate(game.date)}}</p>
          <p>{{home.name.full+' vs '+away.name.full}}</p>
        </div>
        <div v-else>
          <p>{{game.league+' '+prettyDate(game.date)}}</p>
          <p>{{home.name.full+' '+game.summary.score.home+' - '+game.summary.score.away+' '+away.name.full}}</p>
          <p v-if="game.summary.extraTime !== false">{{game.summary.extraTime}}</p>

          <table>
            <caption>Goals</caption>
            <tr>
              <th>Team</th>
              <th>Period</th>
              <th>Time</th>
              <th>Strength</th>
              <th>Goal</th>
              <th>Assist</th>
              <th>Assist</th>
            </tr>
            <tr v-for="goal in game.summary.goals">
              <td>{{playerTeam(goal.points[0])}}</td>
              <td>{{readableTime(goal.time).period}}</td>
              <td>{{readableTime(goal.time).time}}</td>
              <td>{{goal.strength}}</td>
              <td>{{playerName(goal.points[0])}}</td>
              <td v-if="goal.points.length > 1">{{playerName(goal.points[1])}}</td>
              <td v-else>-</td>
              <td v-if="goal.points.length > 2">{{playerName(goal.points[2])}}</td>
              <td v-else>-</td>
            </tr>
          </table>

          <table>
            <caption>Game Stats</caption>
            <tr>
              <th>Stat</th>
              <th>{{home.name.abb}}</th>
              <th>{{away.name.abb}}</th>
            </tr>
            <tr v-for="n in 7" :key="n">
              <td>{{statInfo(n).name}}</td>
              <td>{{statInfo(n).home}}</td>
              <td>{{statInfo(n).away}}</td>
            </tr>
          </table>

          <table>
            <caption>Penalties</caption>
            <tr>
              <th>Team</th>
              <th>Period</th>
              <th>Time</th>
              <th>Player</th>
            </tr>
            <tr v-for="penalty in game.summary.penalties">
              <td>{{playerTeam(penalty.id)}}</td>
              <td>{{readableTime(penalty.time).period}}</td>
              <td>{{readableTime(penalty.time).time}}</td>
              <td>{{playerName(penalty.id)}}</td>
            </tr>
          </table>

        </div>
      </div>
        `,
    data: function () {
      const sub = Vue.prototype.$gameInfo.page.sub
      const league = sub.split('-')[0]
      const id = sub.split('-')[1]
      const game = Vue.prototype.$schedule.id[league][id]
      const gameBeenPlayed = this.laterDate(Vue.prototype.$gameInfo.time.date, game.date)
      return {
        game: game,
        home: Vue.prototype.$teams[league][game.home],
        away: Vue.prototype.$teams[league][game.away],
        gameBeenPlayed: gameBeenPlayed,
      }
    },
    methods: {
      playerName: function (id) {
        return Vue.prototype.$players[id].fullName
      },

      playerTeam: function (id) {
        return Vue.prototype.$players[id].teamName().abb
      },

      statInfo: function (n) {
        n -= 1
        const statList = ['goals', 'shots', 'ppTime', 'pps', 'ppgf', 'pkgf', 'fow']
        const statConverter = {
          goals: 'Goals',
          pps: 'Power Plays',
          ppTime: 'Power Play Time',
          ppgf: 'Power Play Goals',
          pkgf: 'Penalty Kill Goals',
          fow: 'Face Offs',
          shots: 'Shots',
        }
        var homeStat = this.game.stats.home[statList[n]]
        var awayStat = this.game.stats.away[statList[n]]
        if (n == 2) {
          homeStat = this.readableTime(homeStat).time
          awayStat = this.readableTime(awayStat).time
        }

        return { name: statConverter[statList[n]], home: homeStat, away: awayStat }

      }
    }
  },
  playerProfile: {
    mixins: [gMixin],
    template: `
        <div>
          <div class="player-info-header">
            <img :src="'../images/players/face-'+player.face+'.png'" class="player-info-face"></img>
            <p class="player-info-name">{{player.fullName+' '+player.overall()}}</p>
            <p>{{playerInfo}}</p>
            <p>{{playerNum.contract}}</p>
            <p>{{playerPotential}}</p>
          </div>
          <table v-if="type !== 'goalie'" class="player-info-table" id="attributes">
            <tr>
              <th>Offence</th>
              <th></th>
              <th>Defence</th>
              <th></th>
              <th>Skills</th>
              <th></th>
              <th>Other</th>
              <th></th>
            </tr>
            <tr v-for="i in 4">
              <td>{{attributes.offence[i-1].name}}</td>
              <td v-html="playerAttributes('offence',i)"></td>
      
              <td>{{attributes.defence[i-1].name}}</td>
              <td v-html="playerAttributes('defence',i)"></td>
      
              <td>{{attributes.skills[i-1].name}}</td>
              <td v-html="playerAttributes('skills',i)"></td>
      
              <td>{{attributes.other[i-1].name}}</td>
              <td v-html="playerAttributes('other',i)"></td>
            </tr>
          </table>

          <table v-if="type !== 'goalie' && showStats" class="player-info-table" id="stats">
            <tr>
                <th>GP</th>
                <th>Points</th>
                <th>Goals</th>
                <th>Assists</th>
                <th>Shots</th>
                <th>TOI</th>
                <th>PIM</th>
            </tr>
            <tr>
                <td>{{player.stats[season].gamesPlayed}}</td>
                <td>{{player.stats[season].points}}</td>
                <td>{{player.stats[season].goals}}</td>
                <td>{{player.stats[season].assists}}</td>
                <td>{{player.stats[season].shots}}</td>
                <td>{{toiPerGame()}}</td>
                <td>{{player.stats[season].pim}}</td>
            </tr>
          </table>
      
        <table v-if="type === 'goalie'" class="player-info-table" id="attributes">
          <tr>
            <th>Hockey</th>
            <th></th>
            <th>Athleticism</th>
            <th></th>
            <th>Mental</th>
            <th></th>
          </tr>
          <tr v-for="i in 5">
              <td>{{attributes.hockey[i-1].name}}</td>
              <td v-html="playerAttributes('hockey',i)"></td>
      
              <td>{{attributes.athleticism[i-1].name}}</td>
              <td v-html="playerAttributes('athleticism',i)"></td>
      
              <td>{{attributes.mental[i-1].name}}</td>
              <td v-html="playerAttributes('mental',i)"></td>
          </tr>
        </table>

        <table v-if="type === 'goalie' && showStats" class="player-info-table" id="stats">
          <tr>
              <th>GP</th>
              <th>Save %</th>
              <th>GAA</th>
              <th>Saves</th>
              <th>Goals Against</th>
          </tr>
          <tr>
              <td>{{player.stats[season].gamesPlayed}}</td>
              <td>{{player.stats[season].savePctg}}</td>
              <td>{{player.stats[season].gaa}}</td>
              <td>{{player.stats[season].saves}}</td>
              <td>{{player.stats[season].goalsAgainst}}</td>
          </tr>
        </table>     
        </div>
        `,
    data: function () {
      var player = Vue.prototype.$players[Vue.prototype.$gameInfo.page.sub]
      const leagues = ['onehl', 'twohl', 'thrhl', 'juniors', 'freeAgents']

      if (player.position === 'g') {
        var type = 'goalie'
        var attributes = {
          hockey: [{
            name: 'Glove',
            code: 'glove'
          }, {
            name: 'Blocker',
            code: 'blocker'
          }, {
            name: 'Pads',
            code: 'pads'
          }, {
            name: 'Rebounds',
            code: 'rebounds'
          }, {
            name: 'Puck Skills',
            code: 'puck'
          }],
          athleticism: [{
            name: 'Reflexes',
            code: 'reflex'
          }, {
            name: 'Strength',
            code: 'strength'
          }, {
            name: 'Stamina',
            code: 'stamina'
          }, {}, {}],
          mental: [{
            name: 'IQ',
            code: 'iq'
          }, {
            name: 'Work Rate',
            code: 'work'
          }, {
            name: 'Confidence',
            code: 'confidence'
          }, {}, {}]
        }
      }
      else {
        var type = 'player'
        var attributes = {
          offence: [{ name: 'Off IQ', code: 'oiq' },
          { name: 'Wrist Shot', code: 'wrist' },
          { name: 'Slap Shot', code: 'slap' },
          { name: 'Hands', code: 'hands' }],
          defence: [{ name: 'Def IQ', code: 'diq' },
          { name: 'Stickwork', code: 'stick' },
          { name: 'Blocking', code: 'blocking' },
          {
            name: 'Hitting',
            code: 'hitting'
          }],
          skills: [{
            name: 'Skating',
            code: 'skating'
          }, {
            name: 'Passing',
            code: 'passing'
          }, {
            name: 'Hand Eye',
            code: 'handEye'
          }, {
            name: 'Face Off',
            code: 'faceOff'
          }],
          other: [{
            name: 'Strength',
            code: 'strength'
          }, {
            name: 'Stamina',
            code: 'stamina'
          }, {
            name: 'Hustle',
            code: 'hustle'
          }, {
            name: 'Discipline',
            code: 'discipline'
          }]
        }
      }

      return {
        season: Vue.prototype.$gameInfo.time.season,
        player: player,
        attributes: attributes,
        type: type,
        address: 'players/' + player.id,
        showStats: !(player.league === 'juniors' || player.league === 'prospects')

      }
    },
    computed: {
      playerInfo: function () {
        const posName = { lw: 'left wing', c: 'center', rw: 'right wing', ld: 'left defenceman', rd: 'right defenceman', g: 'goalie' }

        var info = this.player.age + ' year old ' + posName[this.player.position] + ' from ' + this.player.country + ' playing for ' + this.player.teamName().full

        return info
      },
      playerNum: function () {
        var contract = 'Contract: ' + this.player.contract.years + ' years x ' + this.player.contract.cap + ' M'
        return { contract: contract }
      },
      playerPotential: function () {
        if (this.player.league === 'prospects') {

          return 'Potential: ' + this.player.potential.ceiling.shownName + ' ' + this.player.potential.chance.shownName
        }
        else {
          return 'Potential: ' + this.player.potential.ceiling.name + ' ' + this.player.potential.chance.name
        }

      }

    },
    methods: {
      playerAttributes: function (type, i) {
        var attribute = this.player.attributes[this.attributes[type][i - 1].code]
        var progress = Math.round(this.player.progression[this.attributes[type][i - 1].code])
        if (this.player.position === 'g' & ['athleticism', 'mental'].includes(type) & i > 3) {
          return ``
        }
        if (progress > 0) { var id = 'positive' }
        else if (progress === 0) { var id = 'neutral' }
        else if (progress < 0) { var id = 'negative' }
        return `
              <p class="player-info-attribute">`+ attribute + `</p>
              <p class="player-info-attribute" id="`+ id + `">` + progress + `</p>
              `
      },

      toiPerGame: function () {
        var gp = this.player.stats[this.season].gamesPlayed
        var toi = this.player.stats[this.season].toi
        if (gp === 0) {
          return '0:00'
        }
        else {
          return this.readableTime(parseInt(toi / gp)).time
        }
      }
    }
  }
}