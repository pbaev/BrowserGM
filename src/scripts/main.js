window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  e.returnValue = '';
});


// GLOBAL VARIABLES

Vue.prototype.$class = {
  Player: require('../classes/class-player.js'),
  Team: require('../classes/class-team.js'),
  Game: require('../classes/class-game.js')
}
Vue.prototype.$events = { draft: {}, freeAgency: { day: 'season' }, playoffs: {} }
Vue.prototype.$news = []
Vue.prototype.$players = { onehl: [], twohl: [], thrhl: [], prospects: [], juniors: [], freeAgents: [] }
Vue.prototype.$saves = { quickSave1: {}, quickSave2: {}, quickSave3: {}, dates: {} }
Vue.prototype.$schedule = { dates: { onehl: {}, twohl: {}, thrhl: {} }, teams: { onehl: {}, twohl: {}, thrhl: {} }, id: { onehl: {}, twohl: {}, thrhl: {} } }
Vue.prototype.$teams = {
  onehl: {}, twohl: {}, thrhl: {},
  prospects: {
    canada: { players: [] }, states: { players: [] }, easternEurope: { players: [] }, europe: { players: [] },
    scandanavia: { players: [] }, rest: { players: [] }
  }
}
Vue.prototype.$gameInfo = {
  autoRoster: true,
  colours: {main: '#3e9462', light: '#ffc6a4'},
  history: [{ url: 'home', sub: '', details: {} }],
  page: {
    url: 'start', sub: '', details: {},
  },
  player: { team: 100 },
  salaryCap: 85,
  scouting: {
    canada: { percentage: 17, points: 0 },
    states: { percentage: 17, points: 0 },
    easternEurope: { percentage: 17, points: 0 },
    europe: { percentage: 17, points: 0 },
    scandanavia: { percentage: 16, points: 0 },
    rest: { percentage: 16, points: 0 }
  },
  time: {
    date: { day: 24, month: 8, year: 2019 },
    season: 2020,
    period: 'regular'
  },
}


// GLOBAL METHODS

const methodProspect = require('./prospect.js')
const methodSim = require('./sim.js')
const methodSchedule = require('./schedule.js')
const methodProgression = require('./progression.js')
const methodPlayoff = require('./playoff.js')
const methodYearEnd = require('./year-end.js')
const methodNewGame = require('./new-game.js')
const methodAI = require('./ai.js')
const methodTools = require('./tools.js')

var gMixin = {
  methods: {
    addressChange: methodTools.addressChange,
    cleanTeamRosters: methodAI.cleanTeamRosters,
    colour: methodTools.colour,
    freeAgencyUpdate: methodAI.freeAgencyUpdate,
    generateGame: methodNewGame.generateGame,
    laterDate: methodTools.laterDate,
    loadGame: methodTools.loadGame,
    newNews: methodTools.newNews,
    nextDays: methodSchedule.nextDays,
    playerProgression: methodProgression.playerProgression,
    playoffRound: methodPlayoff.playoffRound,
    playoffStart: methodPlayoff.playoffStart,
    prettyDate: methodSchedule.prettyDate,
    prospectFogOfWar: methodProspect.prospectFogOfWar,
    prospectGen: methodProspect.prospectGen,
    readableTime: methodTools.readableTime,
    rnd: methodTools.rnd,
    retirees: methodYearEnd.retirees,
    sameObject: methodTools.sameObject,
    scheduleGen: methodSchedule.scheduleGen,
    signNecessaryDepth: methodAI.signNecessaryDepth,
    simToDate: methodSim.simToDate,
    startPreSeason: methodSchedule.startPreSeason,
    startSeason: methodSchedule.startSeason,
    teamConvert: methodTools.teamConvert,
    tradeBuriedPlayers: methodAI.tradeBuriedPlayers,
    tradeForNeeds: methodAI.tradeForNeeds,
    tradeToEvenDepth: methodAI.tradeToEvenDepth,
    tradeUnderCap: methodAI.tradeUnderCap,
    yearEnd: methodYearEnd.yearEnd,
    yearEndReSign: methodAI.yearEndReSign,
  }

}

module.exports = gMixin


// MAIN COMPONENTS

const componentHome = require('../components/home.js')
const componentRoster = require('../components/roster.js')
const componentStats = require('../components/stats.js')
const componentScouting = require('../components/scouting.js')
const componentStandings = require('../components/standings.js')
const componentSchedule = require('../components/schedule.js')
const componentTrade = require('../components/trade.js')
const componentProfiles = require('../components/profiles.js')
const componentMisc = require('../components/misc.js')


// Home

var mainHome = {
  mixins: [gMixin],
  template: `
  <div>
    <home-page v-if="gameInfo.page.sub === ''"></home-page>
  </div>
  `,
  components: {
    'home-page': componentHome.homePage
  },

  data: function () {
    return { gameInfo: Vue.prototype.$gameInfo }
  },
}


// Rosters

var mainRoster = {
  mixins: [gMixin],
  template: `
<div>
  <roster-page v-if="gameInfo.page.sub === ''"></roster-page>
  <lines-page v-if="gameInfo.page.sub === 'lines'"></lines-page>
  <contracts-page v-if="gameInfo.page.sub === 'contracts'"></contracts-page>
  <negotiate-page v-if="gameInfo.page.sub.split('-')[0] === 'negotiate'"></negotiate-page>
  <free-agent-page v-if="gameInfo.page.sub === 'free-agency'"></free-agent-page>
</div>
`,
  components: {
    'roster-page': componentRoster.rosterPage,
    'lines-page': componentRoster.rosterLinesPage,
    'contracts-page': componentRoster.rosterContractPage,
    'negotiate-page': componentRoster.negotiateContract,
    'free-agent-page': componentRoster.freeAgentPage
  },
  data: function () {
    return { gameInfo: Vue.prototype.$gameInfo }
  }
}


// Standings

var mainStandings = {
  mixins: [gMixin],
  template: `
  <div>
    <standings-season-page v-if="gameInfo.page.sub === 'season'"></standings-season-page>
    <standings-playoff-page v-if="gameInfo.page.sub === 'playoffs'"></standings-playoff-page>
  </div>
  `,
  components: {
    'standings-season-page': componentStandings.standingsSeasonPage,
    'standings-playoff-page': componentStandings.standingsPlayoffPage
  },

  data: function () {
    return { gameInfo: Vue.prototype.$gameInfo }
  },
}


// Player Stats 

var mainStats = {
  mixins: [gMixin],
  template: `
  <div>
    <stats-overview-page v-if="gameInfo.page.sub === 'overview'"></stats-overview-page>
    <stats-page v-if="gameInfo.page.sub === ''"></stats-page>
  </div>
  `,
  components: {
    'stats-overview-page': componentStats.statsOverviewPage,
    'stats-page': componentStats.statsPage
  },

  data: function () {
    return { gameInfo: Vue.prototype.$gameInfo }
  }
}


// Trade

var mainTrade = {
  template: `
  <div>
      <trade-page></trade-page>
  </div>
  `,
  components: {
    'trade-page': componentTrade.tradePage,
  },
  data: function () {
    return { gameInfo: Vue.prototype.$gameInfo }
  }
}

// Schedule

var mainSchedule = {
  template: `
  <div>
      <schedule-page v-if="gameInfo.page.sub === ''"></schedule-page>
  </div>
  `,
  components: {
    'schedule-page': componentSchedule.schedulePage,
  },
  data: function () {
    return { gameInfo: Vue.prototype.$gameInfo }
  }
}


// Scouting

var mainScouting = {
  mixins: [gMixin],
  template: `
  <div>
      <scouting-page v-if="gameInfo.page.sub === ''"></scouting-page>
      <scouting-player-page v-if="gameInfo.page.sub !== ''"></scouting-player-page>
  </div>
  `,
  data: function () {
    return { gameInfo: Vue.prototype.$gameInfo }
  },
  components: {
    'scouting-page': componentScouting.scoutingPage,
    'scouting-player-page': componentScouting.scoutingPlayerPage
  },
}


// Miscellaneous

var mainMisc = {
  mixins: [gMixin],
  template: `
  <div>
    <draft-home-page v-if="gameInfo.page.sub === 'draft'"></draft-home-page>
    <year-end-page v-if=" gameInfo.page.sub === 'year-end' "></year-end-page>
    <save-page v-if=" gameInfo.page.sub === 'save' "></save-page>
  </div>
  `,
  data: function () {
    return { gameInfo: Vue.prototype.$gameInfo }
  },
  components: {
    'draft-home-page': componentMisc.draftHomePage,
    'year-end-page': componentMisc.yearEndPage,
    'save-page': componentMisc.savePage,
  },
}


// Web Container

var webContainer = {
  mixins: [gMixin],
  template: `
  <div v-if="gameInfo.page.url !== 'start'" class="web-container">
    <div class="web-container-header-top">
      <div class="web-container-subnav">
        <a v-for="page in subNav" @click="addressChange(page.url,page.sub,page.details)">{{page.name}}</a>
        <a @click="addressChange('back')" id="back">Back</a>
      </div>
      <input type="text" v-model="address" @keyup.enter="goSearch()" @focus="typing = true" @blur="typing = false"></input>
    </div>

    <main-home           v-if="gameInfo.page.url === 'home' "      class="web-container-body"></main-home>
    <player-profile v-else-if="gameInfo.page.url === 'player' "    class="web-container-body"></player-profile>
    <game-profile   v-else-if="gameInfo.page.url === 'game' "      class="web-container-body"></game-profile>
    <main-roster    v-else-if="gameInfo.page.url === 'roster' "    class="web-container-body"></main-roster>
    <main-stats     v-else-if="gameInfo.page.url === 'stats' "     class="web-container-body"></main-stats>
    <main-scouting  v-else-if="gameInfo.page.url === 'scouting' "  class="web-container-body"></main-scouting>
    <main-standings v-else-if="gameInfo.page.url === 'standings' " class="web-container-body"></main-standings>
    <main-schedule  v-else-if="gameInfo.page.url === 'schedule' "  class="web-container-body"></main-schedule>
    <main-trade     v-else-if="gameInfo.page.url === 'trade' "     class="web-container-body"></main-trade>
    <main-misc     v-else-if="gameInfo.page.url === 'misc' "     class="web-container-body"></main-misc>
    <error v-else class="web-container-body"></error>
  </div>
  `,
  data: function () {

    return {
      gameInfo: Vue.prototype.$gameInfo,
      address: this.computeAddress(),
      typing: false,
      subNav: this.computeSubs()
    }
  },
  components: {
    'player-profile': componentProfiles.playerProfile,
    'game-profile': componentProfiles.gameProfile,
    'main-home': mainHome,
    'main-roster': mainRoster,
    'main-stats': mainStats,
    'main-scouting': mainScouting,
    'main-standings': mainStandings,
    'main-schedule': mainSchedule,
    'main-trade': mainTrade,
    'main-misc': mainMisc,
    'error': componentMisc.fourOhFour,
  },

  methods: {
    goSearch: function () {
      var url = this.address.split('/')[0]
      var sub = this.address.split('/')[1]

      if (typeof sub === 'undefined') {
        sub = '/'
      }

      this.addressChange(url, sub, {})
    },
    computeAddress: function () {
      return Vue.prototype.$gameInfo.page.url + '/' + Vue.prototype.$gameInfo.page.sub
    },
    computeSubs: function () {
      if (Vue.prototype.$gameInfo.page.url === 'roster') {
        var subNav = [
          { name: 'Rosters', url: 'roster', sub: '', details: {} },
          { name: 'Lines', url: 'roster', sub: 'lines', details: {} },
          { name: 'Contracts', url: 'roster', sub: 'contracts', details: {} },
          { name: 'Free Agency', url: 'roster', sub: 'free-agency', details: {} }
        ]
      }
      else if (Vue.prototype.$gameInfo.page.url === 'stats') {
        var subNav = [
          { name: 'Table', url: 'stats', sub: '', details: {} },
          { name: 'Overview', url: 'stats', sub: 'overview', details: {} },
        ]
      }
      else if (Vue.prototype.$gameInfo.page.url === 'standings') {
        var subNav = [
          { name: 'Season', url: 'standings', sub: 'season', details: {} },
          { name: 'Playoffs', url: 'standings', sub: 'playoffs', details: {} },
        ]
      }
      else {
        var subNav = []
      }

      return subNav
    }
  },

  updated: function () {
    if (!this.typing) {
      this.address = Vue.prototype.$gameInfo.page.url + '/' + Vue.prototype.$gameInfo.page.sub
    }
  },

  beforeUpdate: function () {
    this.subNav = this.computeSubs()
  }
}

// Navigation Bar

var mainNavigation = {
  mixins: [gMixin],
  template: `
  <div v-if="gameInfo.page.url !== 'start'">
    <h2>BGM</h2>
    <a @click="addressChange('home','',{})">Home</a>
    <a @click="addressChange('roster','',{})">Roster</a>
    <a @click="addressChange('standings','season',{})">Standings</a>
    <a @click="addressChange('stats','',{})">Stats</a>
    <a @click="addressChange('schedule','',{})">Schedule</a>
    <a @click="addressChange('trade','',{})">Trade</a>
    <a @click="addressChange('scouting','',{})">Scouting</a>
    <a @click="addressChange('misc','save',{})">Save</a>
    <a href="docs.html">Meta</a>
  </div>`,
  data: function () {
    return { gameInfo: Vue.prototype.$gameInfo }
  },
  methods: {

  }
}


// Start

var startPage = {
  mixins: [gMixin],
  template: `
  <div v-if="gameInfo.page.url === 'start'" class="start-page">
    <div class="start-page-header">
      <input v-model="title" @change="urlChange()" autofocus></input>
      <a @click="back()">Back</a>
    </div>

    <div v-if="menu === 'home'" class="start-page-container">
      <p class="start-page-info-big">BrowserGm is a WIP hockey management game</p> 
      <p class="start-page-info-big">Manage a team and its affiliates to try and win the cup!</p>
      <div>
        <a :style="{'background':colour().main}" class="start-page-choice-large" 
          @click="menu = 'new'; title = 'start-page/new-game'; alert = false ">New Game</a>
        <a :style="{'background':colour().main}" class="start-page-choice-large" 
          @click="menu = 'load'; title = 'start-page/load-game'; alert = false">Load Game</a>
      </div>
      <div>
        <a :style="{'background':colour().light}" class="start-page-choice-small light-text" href="docs.html">Documentation</a>
        <a :style="{'background':colour().light}" class="start-page-choice-small light-text" href="player-guide.html" >Playing Rules</a>
        <a :style="{'background':colour().light}" class="start-page-choice-small light-text" href="https://github.com/pbaev/BrowserGM" >Github</a>
      </div>
    </div>

    <div v-if="menu === 'load'" class="start-page-new">
      <p class="start-page-info">Load a gamefile</p>
      <label class="custom-file-upload" :style="{'background':colour().light}">
        <input type="file" id="load-game-file" class="light-text">Upload</input>
      </label>
      <div class="horizontal-buttons">
        <a @click="loader()" :style="{'background': colour().main}">Load Game</a>
      </div>
      <p v-if="alert !== false">{{alert}}</p>
    </div>


    <div v-if="menu === 'new'" class="start-page-new">
      <h3>Choose your team's name</h3>
      <div class="start-page-name">
        <p class="start-page-info">City (Max 15)</p>
        <input v-model="city"></input>
      </div>
      <div class="start-page-name">
        <p class="start-page-info">Name (Max 15)</p>
        <input v-model="name"></input>
      </div>
      <div class="start-page-name">
        <p class="start-page-info">Abbreviation (Max 4)</p>
        <input v-model="abb"></input>
      </div>
      <h3>Choose your theme colours</h3>
      <div>
        <div class="start-page-theme-colour">
          <a class="start-page-theme-colour" :style="{'background':colour().main}">Main</a
        </div>

        <div class="start-page-colour-block">
          <div @click="changeColour('main','#c63860')" :style="{'background':'#c63860'}"></div>
          <div @click="changeColour('main','#8a4ca9')" :style="{'background':'#8a4ca9'}"></div>
          <div @click="changeColour('main','#3f53b7')" :style="{'background':'#3f53b7'}"></div>
          <div @click="changeColour('main','#3f8fb7')" :style="{'background':'#3f8fb7'}"></div>
          <div @click="changeColour('main','#3e9462')" :style="{'background':'#3e9462'}"></div>
          <div @click="changeColour('main','#75993f')" :style="{'background':'#75993f'}"></div>
          <div @click="changeColour('main','#ad653a')" :style="{'background':'#ad653a'}"></div>
        </div>
      </div>
      <div>
        <div class="start-page-theme-colour">
          <a class="light-text" :style="{'background':colour().light}">Light</a>
        </div>

        <div class="start-page-colour-block">
          <div @click="changeColour('light','#ffaab5')" :style="{'background':'#ffaab5'}"></div>
          <div @click="changeColour('light','#e3aaff')" :style="{'background':'#e3aaff'}"></div>
          <div @click="changeColour('light','#aabbff')" :style="{'background':'#aabbff'}"></div>
          <div @click="changeColour('light','#a7dff1')" :style="{'background':'#a7dff1'}"></div>
          <div @click="changeColour('light','#9cd6af')" :style="{'background':'#9cd6af'}"></div>
          <div @click="changeColour('light','#b4d69c')" :style="{'background':'#b4d69c'}"></div>
          <div @click="changeColour('light','#e7bea5')" :style="{'background':'#e7bea5'}"></div>
        </div>

        <p v-if="alert !== false">{{alert}}</p>

        <div class="start-page-game">
          <a @click="startGame()" :style="{'background':colour().main}">Start Game</a>
        </div>
      </div>
    </div>

    </div>
  </div>`,
  data: function () {
    return { 
      gameInfo: Vue.prototype.$gameInfo ,
      menu: 'home',
      title: 'start-page/',
      urlChanged: false,
      city: 'Seattle',
      name: 'Battle Cattle',
      abb: 'SEA',
      colours: JSON.parse(JSON.stringify(Vue.prototype.$gameInfo.colours)),
      alert: false
    }
  },
  methods: {
    urlChange: function() {
      if (!this.urlChanged) {
        this.title = 'Smart thinking! Changing the URL will be useful in game'
        this.urlChanged = true
      }
    },

    back: function() {
      if (this.menu !== 'home') {
        this.menu = 'home'
        this.title = 'start-page/'
      }
      else {
        this.title = 'There\'s nothing to go back to'
      }
      this.alert = false
    },

    changeColour: function(type, hex) {
      this.colours[type] = hex
      Vue.prototype.$gameInfo.colours[type] = hex
    },

    loader: function() {
      this.loadGame('upload')

      if (typeof Vue.prototype.$teams.onehl[100] === 'undefined') {
        this.alert = 'Save load failed'
      }
    },

    startGame: function() {
      if (this.city.length > 15) {
        this.alert = 'City should be 15 or fewer characters long'
        return
      }
      else if (this.city.name > 15) {
        this.alert = 'Name should be 15 or fewer characters long'
        return
      }
      else if (this.abb.length > 4) {
        this.alert = 'Abbreviation should be 4 or fewer characters long'
        return
      }

      this.generateGame()
      this.startPreSeason()
      Vue.prototype.$gameInfo.colours = this.colours
      Vue.prototype.$teams.onehl[100].name = {
        city: this.city,
        logo: this.name,
        full: this.city+' '+this.name,
        abb: this.abb,
      }
      Vue.prototype.$teams.twohl[200].name = {
        city: this.city,
        logo: 'Sr. '+this.name,
        full: this.city+' '+this.name,
        abb: '2'+this.abb,
      }
      Vue.prototype.$teams.thrhl[300].name = {
        city: this.city,
        logo: 'Jr. '+this.name,
        full: this.city+' '+this.name,
        abb: '3'+this.abb,
      }
      this.addressChange('home','')

    }
  }
}


new Vue({
  el: '.content',
  created: function () {
    //
  },
  mixins: [gMixin],
  components: {
    'main-navigation': mainNavigation,
    'web-container': webContainer,
    'start-page': startPage,
  }
})



