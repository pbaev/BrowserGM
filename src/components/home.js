const gMixin = require('../scripts/main.js')

module.exports = {
homePage: {
    mixins: [gMixin],
    template:`
    <div>
        <div class="home-header">
            <div class="horizontal-buttons">
                <a @click="league = changeLeague('onehl')" :style="{'background': colour().main}">1HL</a>
                <a @click="league = changeLeague('twohl')" :style="{'background': colour().main}">2HL</a>
                <a @click="league = changeLeague('thrhl')" :style="{'background': colour().main}">3HL</a>
            </div>
            <p class="home-team-name" :style="{'color': colour().main}">{{teamInfo.name.city.toUpperCase()}}</p>
            <p class="home-team-name" :style="{'color': colour().light}">{{teamInfo.name.logo.toUpperCase()}}</p>
            <p class="home-header-info">{{record()}}</p>
        </div>

        <table class="home-table">
            <caption>Team Stats</caption>
            <tr>
                <td>GP</td><td>{{teamInfo.stats.gamesPlayed}}</td><td>{{teamInfo.rank('gamesPlayed', true)}}</td>
            </tr>
            <tr>
                <td>PTS</td><td>{{teamInfo.points()}}</td><td>{{teamInfo.rank('points', true)}}</td>
            </tr>
            <tr>
                <td>W</td><td>{{teamInfo.stats.wins}}</td><td>{{teamInfo.rank('wins', true)}}</td>
            </tr>
            <tr>
                <td>OTW</td><td>{{teamInfo.stats.otw}}</td><td>{{teamInfo.rank('otw', true)}}</td>
            </tr>
            <tr>
                <td>OTL</td><td>{{teamInfo.stats.otl}}</td><td>{{teamInfo.rank('otl', true)}}</td>
            </tr>
            <tr>
                <td>SOW</td><td>{{teamInfo.stats.sow}}</td><td>{{teamInfo.rank('sow', true)}}</td>
            </tr>
            <tr>
                <td>SOL</td><td>{{teamInfo.stats.sol}}</td><td>{{teamInfo.rank('sol', true)}}</td>
            </tr>
            <tr>
                <td>GF</td><td>{{teamInfo.stats.goalsFor}}</td><td>{{teamInfo.rank('goalsFor', true)}}</td>
            </tr>
            <tr>
                <td>GA</td><td>{{teamInfo.stats.goalsAgainst}}</td><td>{{teamInfo.rank('goalsAgainst', true)}}</td>
            </tr>
        </table>
        <table class="home-table" id="leaders">
            <caption>Leaders</caption>
            <tr>
                <td>PTS</td><td>{{teamInfo.topPlayer('points').value}}</td>
                <td @click="addressChange('player',teamInfo.topPlayer('points').id)">{{teamInfo.topPlayer('points').name}}</td>
            </tr>
            <tr>
                <td>G</td><td>{{teamInfo.topPlayer('goals').value}}</td>
                <td @click="addressChange('player',teamInfo.topPlayer('goals').id)">{{teamInfo.topPlayer('goals').name}}</td>
            </tr>
            <tr>
                <td>A</td><td>{{teamInfo.topPlayer('assists').value}}</td>
                <td @click="addressChange('player',teamInfo.topPlayer('assists').id)">{{teamInfo.topPlayer('assists').name}}</td>
            </tr>
            <tr>
                <td>Sht</td><td>{{teamInfo.topPlayer('shots').value}}</td>
                <td @click="addressChange('player',teamInfo.topPlayer('assists').id)">{{teamInfo.topPlayer('assists').name}}</td>
            </tr>
            <tr>
                <td>Svs</td><td>{{teamInfo.topPlayer('saves').value}}</td>
                <td @click="addressChange('player',teamInfo.topPlayer('savePctg').id)">{{teamInfo.topPlayer('savePctg').name}}</td>
            </tr>
            <tr>
                <td>SV%</td><td>{{teamInfo.topPlayer('savePctg').value}}</td>
                <td @click="addressChange('player',teamInfo.topPlayer('savePctg').id)">{{teamInfo.topPlayer('savePctg').name}}</td>
            </tr>
                <tr>
                <td>GAA</td><td>{{teamInfo.topPlayer('gaa').value}}</td>
                <td @click="addressChange('player',teamInfo.topPlayer('gaa').id)">{{teamInfo.topPlayer('gaa').name}}</td>
            </tr>
        </table>

        <table>
            <caption>News</caption>
            <tr v-for="article in news">
                <td>{{article}}</td>
            </tr>
        </table>
    </div>
    `,
    data: function () {
        var date = Vue.prototype.$gameInfo.time.date
        var seasonEnd = Vue.prototype.$gameInfo.time.season
        var goTo = {display: false, url:[]}
    
        return {
            date: date,
            goTo: goTo,
            league: 'onehl',
            teamInfo: Vue.prototype.$teams.onehl[Vue.prototype.$gameInfo.player.team],
            news: Vue.prototype.$news
        }
    },
    methods: {
        record() {
            var wins = this.teamInfo.stats.wins + this.teamInfo.stats.otw + this.teamInfo.stats.sow
            var losses = this.teamInfo.stats.losses
            var ot = this.teamInfo.stats.otl + this.teamInfo.stats.sol
            return wins+'-'+losses+'-'+ot+' ('+this.teamInfo.rank('points',true)+')'
        },
        changeLeague(league) {
            this.teamInfo = Vue.prototype.$teams[league][this.teamConvert(league, Vue.prototype.$gameInfo.player.team)]
        }
    }


}
}