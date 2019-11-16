const gMixin = require('../scripts/main.js')

module.exports = {
    scoutingPage: {
        mixins: [gMixin],
        template: `
    <div>
        <a class="horizontal-button" :style="{'background':colour().main}" @click="addressChange('scouting','all',{})">View All Prospects</a>
        
        <div class="scouting-page-region"><p>Canada</p></div>
        <input class="scouting-page-input" type="number" v-model="proportion.canada" @input="spareCalc()"><p class="inline">%</p>
        <a class="horizontal-button" :style="{'background':colour().main}" @click="addressChange('scouting','canada',{})">Players</a></input>
        
        <div class="scouting-page-region"><p>United States</p></div>
        <input class="scouting-page-input" type="number" v-model="proportion.states" @input="spareCalc()"><p class="inline">%</p>
        <a class="horizontal-button" :style="{'background':colour().main}" @click="addressChange('scouting','states',{})">Players</a></input>
        
        <div class="scouting-page-region"><p>Eastern Europe</p><p>Russia, Lativia, Ukraine, Belarus</p></div>
        <input class="scouting-page-input" type="number" v-model="proportion.easternEurope" @input="spareCalc()"><p class="inline">%</p>
        <a class="horizontal-button" :style="{'background':colour().main}" @click="addressChange('scouting','easternEurope',{})">Players</a></input>
        
        <div class="scouting-page-region"><p>Western/Central Europe</p><p>Czech, Slovakia, Germany, France, Switzerland</p></div>
        <input class="scouting-page-input" type="number" v-model="proportion.europe" @input="spareCalc()"><p class="inline">%</p>
        <a class="horizontal-button" :style="{'background':colour().main}" @click="addressChange('scouting','europe',{})">Players</a></input>
        
        <div class="scouting-page-region"><p>Scandanavia</p><p>Sweden, Finland, Norway</p></div>
        <input class="scouting-page-input" type="number" v-model="proportion.scandanavia" @input="spareCalc()"><p class="inline">%</p>
        <a class="horizontal-button" :style="{'background':colour().main}" @click="addressChange('scouting','scandanavia',{})">Players</a></input>
        
        <div class="scouting-page-region"><p>Rest of World</p><p>Asia, South America, Africa, Australia</p></div>
        <input class="scouting-page-input" type="number" v-model="proportion.rest" @input="spareCalc()"><p class="inline">%</p>
        <a class="horizontal-button" :style="{'background':colour().main}" @click="addressChange('scouting','rest',{})">Players</a></input>
        
        <div class="scouting-page-region"><p>Spare</p></div>
        <p>{{proportion.spare+' %'}}</p>
        <p v-if="alert !== false">{{alert}}</p>
        <div class="horizontal-buttons">
            <a :style="{'background':colour().main}" @click="recommendedProportions()">Recommended</a>
            <a :style="{'background':colour().main}" @click="currentProportions()">Current</a>
            <a :style="{'background':colour().main}" @click="saveProportions()">Save</a>
        </div>
    </div>
    `,
        data: function () {
            var proportion = {
                'spare': 0
            }
            for (var region in Vue.prototype.$gameInfo.scouting) {
                proportion[region] = Vue.prototype.$gameInfo.scouting[region].percentage
                proportion.spare += Vue.prototype.$gameInfo.scouting[region].percentage
            }
            proportion.spare = 100 - proportion.spare
            return {
                gameInfo: Vue.prototype.$gameInfo,
                proportion: proportion,
                alert: false
            }
        },
        methods: {
            saveProportions: function () {
                if (this.proportion.spare >= 0) {
                    var regions = ['canada', 'states', 'easternEurope', 'europe', 'scandanavia', 'rest']
                    for (var region in regions) {
                        Vue.prototype.$gameInfo.scouting[regions[region]].percentage = parseInt(this.proportion[regions[region]])
                    }
                    this.alert = 'Scouting saved'
                } else {
                    this.alert = 'Total must be 100% or lower'
                }
            },
            recommendedProportions: function () {
                this.proportion = {
                    'canada': 17,
                    'states': 17,
                    'easternEurope': 17,
                    'europe': 17,
                    'scandanavia': 16,
                    'rest': 16,
                    'spare': 0
                }
                this.alert = false
            },
            spareCalc: function () {
                this.proportion.spare = 100
                var regions = ['canada', 'states', 'easternEurope', 'europe', 'scandanavia', 'rest']
                for (var region in regions) {
                    this.proportion.spare -= this.proportion[regions[region]]
                }
                this.proportion.spare = parseFloat(this.proportion.spare.toFixed(1))
            },
            currentProportions: function () {
                var proportion = {
                    'spare': 0
                }
                for (var region in Vue.prototype.$gameInfo.scouting) {
                    this.proportion[region] = Vue.prototype.$gameInfo.scouting[region].percentage
                    this.proportion.spare += Vue.prototype.$gameInfo.scouting[region].percentage
                }
                this.proportion.spare = 100 - this.proportion.spare
            }
        }
    },
    scoutingPlayerPage: {
        mixins: [gMixin],
        template: `
    <div>
        <p>{{region}}</p>
        <div class="stats-page-container">
            <a @click="setScope('start')" class="scope-change" :style="{'background': colour().main}"> << </a> 
            <a @click="setScope('backward')" class="scope-change light" :style="{'background': colour().light}"> < </a> 
            <div class="table-scroll">
                <table class="stats-page-table">
                    <tr>
                        <th>Rank</th>
                        <th>Region</th>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Overall</th>
                        <th>Ceiling</th>
                        <th>Chance</th>
                        <th>Certainty</th>
                    </tr>
                    <tr v-for="(player, n) in players" @click="addressChange('player',player.id,{})"
                    class="hover-hand">
                        <td>{{scope[0]+n+1}}</td>
                        <td>{{player.teamName().city}}</td>
                        <td>{{player.fullName}}</td>
                        <td>{{player.position.toUpperCase()}}</td>
                        <td>{{player.overall()}}</td>
                        <td>{{player.potential.ceiling.shownName}}</td>
                        <td>{{player.potential.chance.shownName}}</td>
                        <td>{{regionCertainty(player.team)}}</td>
                    </tr>
                </table>
            </div>
            <a @click="setScope('forward')" class="scope-change light" :style="{'background': colour().light}"> > </a>
        </div>
    </div>
    `,
        data: function () {
            var region = Vue.prototype.$gameInfo.page.sub

            return {
                region: region,
                players: this.playerList([0,10]),
                scope: [0,10]
            }
        },
        methods: {
            regionCertainty: function (region) {
                var points = Vue.prototype.$gameInfo.scouting[region].points
                var certainty = ''
                if (points > 80) { certainty = 'A' }
                else if (points > 60) { certainty = 'B' }
                else if (points > 40) { certainty = 'C' }
                else if (points > 20) { certainty = 'D' }
                else { certainty = 'F' }

                return certainty
            },

            setScope: function (direction) {
                if (direction === 'start') {
                    this.scope = [0, 10]
                }
                else if (direction === 'forward') {
                    this.scope = [this.scope[0] + 10, this.scope[1] + 10]
                }
                else if (direction === 'backward') {
                    this.scope = [this.scope[0] - 10, this.scope[1] - 10]
                }
                if (this.scope[0] < 0) {
                    this.scope = [0, 10]
                }
                this.players = this.playerList(this.scope)
                this.$forceUpdate()
            },

            playerList: function(scope) {
                var region = Vue.prototype.$gameInfo.page.sub
                var players = []
                if (region === 'all') {
                    var places = ['canada', 'states', 'europe', 'easternEurope', 'scandanavia', 'rest']
                    for (var place in places) {
                        for (var player in Vue.prototype.$teams.prospects[places[place]].players) {
                            players.push(Vue.prototype.$players[Vue.prototype.$teams.prospects[places[place]].players[player]])
                        }
                    }
                }
                else {
                    for (var player in Vue.prototype.$teams.prospects[region].players) {
                        players.push(Vue.prototype.$players[Vue.prototype.$teams.prospects[region].players[player]])
                    }
                }
    
                players = players.sort(function (a, b) { return (a.potential.chance.int * a.potential.ceiling.int) - (b.potential.chance.int * b.potential.ceiling.int) }).reverse()
                players = players.slice(scope[0], scope[1])

                return players
            }
        }
    },
}