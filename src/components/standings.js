const gMixin = require('../scripts/main.js')

module.exports = {
standingsSeasonPage: {
    mixins: [gMixin],
    template: `
    <div>
        <div class="horizontal-buttons">
            <a @click="standingsSet('onehl')" :style="{'background': colour().main}">1HL</a>
            <a @click="standingsSet('twohl')" :style="{'background': colour().main}">2HL</a>
            <a @click="standingsSet('thrhl')" :style="{'background': colour().main}">3HL</a>
        </div>
        <div class="table-scroll">
            <table class="standings-table">
                <tr>
                    <th>#</th>
                    <th>Team</th>
                    <th>GP</th>
                    <th>PTS</th>
                    <th>W</th>
                    <th>L</th>
                    <th>OT</th>
                    <th>GF</th>
                    <th>GA</th>
                    <th>Shots</th>
                    <th>Saves</th>
                    <th>PPs</th>
                    <th>PPG</th>
                    <th>PKs</th>
                    <th>PKGA</th>
                </tr>
                <tr v-for="(team, count) in teams" v-if="count < 16">
                    <td :style="{'color': colour().light}">{{count++ + 1}}</td>
                    <td :style="{'color': colour().light}">{{team.name}}</td>
                    <td>{{team.gamesPlayed}}</td>
                    <td>{{team.points}}</td>
                    <td>{{team.wins + team.otw + team.sow}}</td>
                    <td>{{team.losses}}</td>
                    <td>{{team.otl + team.sol}}</td>
                    <td>{{team.goalsFor}}</td>
                    <td>{{team.goalsAgainst}}</td>
                    <td>{{team.shots}}</td>
                    <td>{{team.saves}}</td>
                    <td>{{team.pps}}</td>
                    <td>{{team.ppgf}}</td>
                    <td>{{team.pks}}</td>
                    <td>{{team.pkga}}</td>
                </tr>
                <tr v-for="(team, count) in teams" v-if="count >= 16">
                    <td>{{count++ + 1}}</td>
                    <td>{{team.name}}</td>
                    <td>{{team.gamesPlayed}}</td>
                    <td>{{team.points}}</td>
                    <td>{{team.wins + team.otw + team.sow}}</td>
                    <td>{{team.losses}}</td>
                    <td>{{team.otl + team.sol}}</td>
                    <td>{{team.goalsFor}}</td>
                    <td>{{team.goalsAgainst}}</td>
                    <td>{{team.shots}}</td>
                    <td>{{team.saves}}</td>
                    <td>{{team.pps}}</td>
                    <td>{{team.ppgf}}</td>
                    <td>{{team.pks}}</td>
                    <td>{{team.pkga}}</td>
                </tr>
            </table>
        </div>
    </div>
    `,
    
    data: function() {
        return {
        teams: this.standingsSet('onehl')
        }
    
    },
    methods: {
        standingsSet: function(league) {
        var teams = []
        for (var team in Vue.prototype.$teams[league]) {
            var current = Vue.prototype.$teams[league][team]
            var gp = current.stats.gamesPlayed
            if (gp === 0) {
                gp = 0.00001
            }
            teams.push({
            id: current.stats.id,
            name: current.name.city,
            gamesPlayed: parseInt(gp),
            points: current.points(),
            wins: current.stats.wins,
            losses: current.stats.losses,
            otw: current.stats.otw,
            otl: current.stats.otl,
            sow: current.stats.sow,
            sol: current.stats.sol,
            goalsFor: (current.stats.goalsFor / gp).toFixed(2),
            goalsAgainst: (current.stats.goalsAgainst / gp).toFixed(2),
            shots: (current.stats.shots / gp).toFixed(1),
            saves: (current.stats.saves / gp).toFixed(1),
            pps: (current.stats.pps / gp).toFixed(1),
            ppgf: (current.stats.ppgf / gp).toFixed(2),
            pks: (current.stats.pks / gp).toFixed(1),
            pkga: (current.stats.pkga / gp).toFixed(2),
            })
        }

        teams = teams.sort((a,b) =>
            {return (a.points/a.gamesPlayed) - (b.points/b.gamesPlayed) || (a.goalsFor - a.goalsAgainst) - (b.goalsFor - b.goalsAgainst)}).reverse()
        this.teams = teams
        return teams
        }
    }
},
standingsPlayoffPage: {
    mixins: [gMixin],
    template: `
    <div>
        <div v-if="display">
            <p>Playoffs</p>
            <div class="horizontal-buttons">
                <a @click="league = 'onehl'" :style="{'background': colour().main}">1HL</a>
                <a @click="league = 'twohl'" :style="{'background': colour().main}">2HL</a>
                <a @click="league = 'thrhl'" :style="{'background': colour().main}">3HL</a>
            </div>
            <table>
                <tr>
                    <th>Round 1</th>
                    <th>Round 2</th>
                    <th>Round 3</th>
                    <th>Finals</th>
                </tr>
                <tr><td>{{seriesInfo({round: 'r1', series: 1}) }}</td></tr>
                <tr><td></td><td>{{seriesInfo({round: 'r2', series: 1}) }}</td></tr>
                <tr><td>{{seriesInfo({round: 'r1', series: 8}) }}</td></tr>
                <tr><td></td><td></td><td>{{seriesInfo({round: 'r3', series: 1}) }}</td></tr>
                <tr><td>{{seriesInfo({round: 'r1', series: 4}) }}</td></tr>
                <tr><td></td><td>{{seriesInfo({round: 'r2', series: 4}) }}</td></tr>
                <tr><td>{{seriesInfo({round: 'r1', series: 5}) }}</td></tr>
                <tr><td></td><td></td><td></td>{{seriesInfo({round: 'r4', series: 1}) }}</td></tr>
                <tr><td>{{seriesInfo({round: 'r1', series: 3}) }}</td></tr>
                <tr><td></td>{{seriesInfo({round: 'r2', series: 3}) }}</td></tr>
                <tr><td>{{seriesInfo({round: 'r1', series: 6}) }}</td></tr>
                <tr><td></td><td></td>{{seriesInfo({round: 'r3', series: 2}) }}</td></tr>
                <tr><td>{{seriesInfo({round: 'r1', series: 2}) }}</td></tr>
                <tr><td></td>{{seriesInfo({round: 'r2', series: 2}) }}</td></tr>
                <tr><td>{{seriesInfo({round: 'r1', series: 7}) }}</td></tr>
            </table>
        </div>
        <p v-else>The playoffs have not yet started</p>
    </div>
    `,
    
    data: function() {
        if (['regular','pre-seaon'].includes(Vue.prototype.$gameInfo.time.period)) {
            var display = false
        }
        else {
            var display = true
        }
        return {
        display: display,
        playoffs: Vue.prototype.$events.playoffs,
        league: 'onehl'
        }
    },
    methods: {
        seriesInfo: function(param) {
            // param = {series: 5, round: 'r2', team:'hi'}
            var playoffs = Vue.prototype.$events.playoffs[this.league]
            var round = param.round
            var totalTeams = {r1:17,r2:9,r3:5,r4:3}
            var series = param.series.toString()+'v'+(totalTeams[round]-param.series).toString()
            
            if (typeof playoffs[round][series] === 'undefined') {
                return 'TBD'
            }

            var hiTeam = {
                rank: param.series,
                team: playoffs[round][series].hi,
                abb: Vue.prototype.$teams[this.league][playoffs[round][series].hi].name.abb
            }
            var loTeam = {
                rank: (totalTeams[round]-param.series),
                team: playoffs[round][series].lo,
                abb: Vue.prototype.$teams[this.league][playoffs[round][series].lo].name.abb
            }

            var score = playoffs[round][series].score[0].toString()+'-'+playoffs[round][series].score[1].toString()

            if (round === 'r1') {
                return hiTeam.rank+' '+hiTeam.abb+' '+score+' '+loTeam.abb+' '+loTeam.rank
            }
            else {
                return hiTeam.abb+' '+score+' '+loTeam.abb
            }
            
        }
    }
}
      


}