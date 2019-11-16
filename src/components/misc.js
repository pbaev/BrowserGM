const gMixin = require('../scripts/main.js')

module.exports = {
    fourOhFour: {
        template: `
    <div>
        <p>404 The url wasn't found</p>
    </div>
    `
    },

    draftHomePage: {
        mixins: [gMixin],
        template: `
<div v-if="draftTime">
    <div class="horizontal-buttons">
        <a :style="{'background': colour().main}" @click="selectedTable = 'available'; setScope('start')">Available</a>
        <a :style="{'background': colour().main}" @click="selectedTable = 'drafted'; setScope('start')">Drafted</a>
        <a :style="{'background': colour().main}" @click="selectedTable = 'ranked'; setScope('start')">Ranking</a>
    </div>
    <p>{{selectedTable.slice(0,1).toUpperCase()+selectedTable.slice(1)+' Players'}}</p>

    <div class="stats-page-container">
        <a @click="setScope('start')" class="scope-change" :style="{'background': colour().main}"> << </a> 
        <a @click="setScope('backward')" class="scope-change light" :style="{'background': colour().light}"> < </a>
        <div class="table-scroll">
            <table>
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
                <tr v-for="i in 15" @click="playerMenu.display = true; selectedPlayer = playerInfo(i, 'id')" class="hover-hand">
                    <td v-if="selectedTable !== 'available'">{{i+scope[0]}}</td>
                    <td v-else>{{playerInfo(i, 'rank')}}</td>
                    <td>{{playerInfo(i, 'region')}}</td>
                    <td>{{playerInfo(i, 'name')}}</td>
                    <td>{{playerInfo(i, 'position')}}</td>
                    <td>{{playerInfo(i, 'overall')}}</td>
                    <td>{{playerInfo(i, 'ceiling')}}</td>
                    <td>{{playerInfo(i, 'chance')}}</td>
                    <td>{{playerInfo(i, 'certainty')}}</td>
                </tr>
            </table>
        </div>
        <a @click="setScope('forward')" class="scope-change light" :style="{'background': colour().light}"> > </a>
    </div>

    <p>{{'Current Pick: '+draft.currentPick}}</p>
    <div class="horizontal-buttons">
        <a :style="{'background': colour().main}" @click="nextPick()">Next Pick</a>
        <a :style="{'background': colour().main}" @click="nextUserPick()">Your Next Pick</a>
        <a :style="{'background': colour().main}" @click="autoComplete()">Auto Complete</a>
    </div>
    
    <table>
        <caption>Your Picks</caption>
        <tr>
            <th>Round</th>
            <th>Pick</th>
            <th>Player</th>
        </tr>
        <tr v-for="pick in pickList.user"  @click="playerMenu.display = true; selectedPlayer = pick.player">
            <td>{{pick.round}}</td>
            <td>{{pick.position}}</td>
            <td v-if="!pick.player">-</td>
            <td v-else>{{idPlayerInfo(pick.player)}}</td>
        </tr>
    </table>


    <div v-if="playerMenu.display" class="selected-bar">
        <p>{{idPlayerInfo(selectedPlayer)}}</p>
        <div class="horizontal-buttons">
            <a @click="addressChange('player',selectedPlayer,{})"
                :style="{'background': colour().main}">View Profile</a>
            <a @click="draftPlayer(selectedPlayer, playerTeam)" v-if="letPlayerDraft()"
                :style="{'background': colour().main}">Draft Player</a>
            <a @click="playerMenu.display = false" :style="{'background': colour().main}">X</a>
        </div>
    </div>

</div>
<div v-else>
    <p>The draft starts on June 27th</p>
</div>
`,
        data: function () {
            if (Object.keys(Vue.prototype.$events.draft).length === 0 &&
                this.laterDate(Vue.prototype.$gameInfo.time.date, { day: 27, month: 6, year: 1990 })) {
                var draft = this.generateDraft()
                Vue.prototype.$events.draft = draft
                var draftTime = true
            }
            else if (!this.laterDate(Vue.prototype.$gameInfo.time.date, { day: 27, month: 6, year: 1990 })) {
                var draftTime = false
            }
            else {
                var draft = Vue.prototype.$events.draft
                var draftTime = true
            }

            return {
                draftTime: draftTime,
                draft: draft,
                selectedTable: 'available',
                selectedPlayer: 0,
                playerMenu: { display: false, id: 0 },
                scope: [0, 15],
                season: Vue.prototype.$gameInfo.time.season,
                pickList: this.getPickList(),
                playerTeam: Vue.prototype.$gameInfo.player.team,

            }
        },
        methods: {
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

                this.$forceUpdate()
            },
            generateDraft: function () {
                var draft = {
                    players: {
                        available: [],
                        drafted: [],
                        ranked: []
                    },
                    currentPick: 1
                }

                var playerList = []
                var places = ['canada', 'states', 'europe', 'easternEurope', 'scandanavia', 'rest']
                for (var place in places) {
                    for (var player in Vue.prototype.$teams.prospects[places[place]].players) {
                        playerList.push(Vue.prototype.$players[Vue.prototype.$teams.prospects[places[place]].players[player]])
                    }
                }
                playerList = playerList.sort(function (a, b) {
                    return (a.potential.chance.int * a.potential.ceiling.int) - (b.potential.chance.int * b.potential.ceiling.int)
                }).reverse()

                for (var player in playerList) {
                    draft.players.ranked.push(playerList[player].id)
                    Vue.prototype.$players[playerList[player].id].rank = (parseInt(player) + 1)
                }

                draft.players.available = JSON.parse(JSON.stringify(draft.players.ranked))
                return draft
            },

            playerInfo: function (listPosition, attribute) {
                listPosition += (this.scope[0] - 1)
                var pid = this.draft.players[this.selectedTable][listPosition]
                if (isNaN(pid)) {
                    return '-'
                }

                var player = Vue.prototype.$players[pid]
                if (attribute === 'name') { return player.fullName }
                else if (attribute === 'region') { return player.teamName().abb }
                else if (attribute === 'position') { return player.position.toUpperCase() }
                else if (attribute === 'overall') { return player.overall() }
                else if (attribute === 'ceiling') { return player.potential.ceiling.shownName }
                else if (attribute === 'chance') { return player.potential.chance.shownName }
                else if (attribute === 'certainty') { return player.potential.certainty.name }
                else if (attribute === 'id') { return pid }
                else if (attribute === 'rank') { return player.rank }

                return '-'
            },
            idPlayerInfo: function (pid) {
                return Vue.prototype.$players[pid].fullName
            },
            getPickList: function () {
                const season = Vue.prototype.$gameInfo.time.season
                var pickList = { all: {}, user: {} }
                for (var tid in Vue.prototype.$teams.onehl) {
                    var team = Vue.prototype.$teams.onehl[tid]
                    for (var pickId in team.picks[season]) {
                        var pick = team.picks[season][pickId]
                        var pickTeamPositon = Vue.prototype.$teams.onehl[pick.team].rank('points', false)
                        if (pick.position === null) {
                            pick.position = ((pick.round - 1) * 32) + pickTeamPositon + 1
                        }

                        if (team.id === Vue.prototype.$gameInfo.player.team) {
                            pickList.user[pick.position] = pick
                        }

                        pickList.all[pick.position] = pick
                    }
                }
                return pickList
            },

            draftPlayer: function (pid) {
                if (!this.draft.players.available.includes(pid)) {
                    return false
                }
                if (this.draft.currentPick > (7 * 32)) {
                    this.draft.currentPick = 'Complete'
                    return false
                }

                var player = Vue.prototype.$players[pid]
                var pick = this.pickList.all[this.draft.currentPick]
                pick.player = pid

                for (var pickId in Vue.prototype.$teams.onehl[pick.team].picks[this.season]) {
                    if (Vue.prototype.$teams.onehl[pick.team].picks[this.season][pickId].position === this.currentPick) {
                        Vue.prototype.$teams.onehl[pick.team].picks[this.season][pickId].player = pid
                    }
                }

                this.draft.players.available = this.draft.players.available.filter(function (id) { return pid !== id })
                this.draft.players.drafted.push(pid)

                player.switchTeam(pick.team)
                this.draft.currentPick += 1
                this.playerMenu.display = false
            },
            letPlayerDraft: function () {
                var playerAvailable = this.draft.players.available.includes(this.selectedPlayer)
                var userSelection = false
                for (var pick in this.pickList.user) {
                    if (this.pickList.user[pick].position === this.draft.currentPick) {
                        userSelection = true
                    }
                }
                return (playerAvailable & userSelection)
            },
            nextPick: function () {
                this.draftPlayer(this.cpuChoice())
            },
            nextUserPick: function () {
                var picks = Object.keys(this.pickList.user)
                picks = picks.map(id => parseInt(id))
                picks = picks.sort((a, b) => a - b)
                for (var n in picks) {
                    var pick = picks[n]
                    if (pick > this.draft.currentPick) {
                        var nextPick = pick
                        break
                    }
                }
                const picksToSim = (nextPick - this.draft.currentPick)
                for (var n = 0; n < picksToSim; n++) {
                    this.nextPick()
                }
            },
            autoComplete: function () {
                const picksToSim = ((7 * 32) - this.draft.currentPick) + 1
                for (var n = 0; n < picksToSim; n++) {
                    this.nextPick()
                }
                this.draft.currentPick = 'Completed'
            },
            cpuChoice: function () {
                var randomChoice = this.rnd(0, Math.floor(this.draft.currentPick * 0.1) + 1)
                return this.draft.players.available[randomChoice]
            }
        }
    },

    yearEndPage: {
        mixins: [gMixin],
        template: `
    <div>
        <img :src="'../images/cup.png'" class="year-end-cup"></img>
        <p>This year's winners of the questionable looking cup are</p>
        <div class="year-end-winners">
            <p>1HL</p>
            <p :style="{'color': colour().main}"> {{winners('onehl').first}}</p>
            <p :style="{'color': colour().light}">{{winners('onehl').last}}</p>
        </div>
        <div class="year-end-winners">
            <p>2HL</p>
            <p :style="{'color': colour().main}"> {{winners('twohl').first}}</p>
            <p :style="{'color': colour().light}">{{winners('twohl').last}}</p>
        </div>
        <div class="year-end-winners">
            <p>3HL</p>
            <p :style="{'color': colour().main}"> {{winners('thrhl').first}}</p>
            <p :style="{'color': colour().light}">{{winners('thrhl').last}}</p>
        </div>

    </div>
    
    `,

        methods: {
            winners: function (league) {
                var matchup = Vue.prototype.$events.playoffs[league].r4['1v2']
                if (matchup.score[0] > matchup.score[1]) {
                    var winner = matchup.hi
                }
                else {
                    var winner = matchup.lo
                }
                var team = Vue.prototype.$teams[league][winner]

                return { first: team.name.city, last: team.name.logo }

            }
        }
    },


    savePage: {
        mixins: [gMixin],
        template: `
    <div class="save-page">
        <p v-if="alert !== false">{{alert}}</p>
        <h3>Full Save</h3>
        <div>
            <p class="save-page-desc">Downloads the save file ~ 3 Mb</p>
            <input v-model="fileName" class="save-page-file-name"></input>
            <div class="horizontal-buttons">
                <a @click="fullSave()" :style="{'background': colour().main}">Save Game</a>
            </div>
        </div>
        <div>
            <input type="file" id="load-game-file"></input>
            <div class="horizontal-buttons">
                <a @click="loader()" :style="{'background': colour().main}">Load Game</a>
            </div>
        </div>
        
        <h3 class="save-page-heading">Quick Saves</h3>
        <div class="save-page-quick">
            <p>{{'Slot 1 - '+quickStatus.quickSave1}}</p>
            <div class="horizontal-buttons">
                <a @click="quickSaver('quickSave1')" :style="{'background': colour().main}">Save</a>
                <a @click="quickLoader('quickSave1')" :style="{'background': colour().light}" class="light-text">Load</a>
            </div>
        </div>

        <div class="save-page-quick">
            <p>{{'Slot 2 - '+quickStatus.quickSave2}}</p>
            <div class="horizontal-buttons">
                <a @click="quickSaver('quickSave2')" :style="{'background': colour().main}">Save</a>
                <a @click="quickLoader('quickSave2')" :style="{'background': colour().light}" class="light-text">Load</a>
            </div>
        </div>

        <div class="save-page-quick">
            <p>{{'Slot 3 - '+quickStatus.quickSave3}}</p>
            <div class="horizontal-buttons">
                <a @click="quickSaver('quickSave3')" :style="{'background': colour().main}">Save</a>
                <a @click="quickLoader('quickSave3')" :style="{'background': colour().light}" class="light-text">Load</a>
            </div>
        </div>

    </div>
    
    `,
        data: function () {
            return {
                alert: false,
                quickStatus: this.quickStatusGetter(),
                fileName: 'bgm-save-1'
            }
        },

        methods: {
            fullSave: function () {
                //https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server
                var fileName = this.fileName + '.txt'
                var data = JSON.stringify({
                    events: Vue.prototype.$events,
                    gameInfo: Vue.prototype.$gameInfo,
                    news: Vue.prototype.$news,
                    players: Vue.prototype.$players,
                    schedule: Vue.prototype.$schedule,
                    teams: Vue.prototype.$teams,
                })

                var blob = new Blob([data], { type: 'text/csv' });
                if (window.navigator.msSaveOrOpenBlob) {
                    window.navigator.msSaveBlob(blob, fileName);
                }
                else {
                    var elem = window.document.createElement('a');
                    elem.href = window.URL.createObjectURL(blob);
                    elem.download = fileName;
                    document.body.appendChild(elem);
                    elem.click();
                    document.body.removeChild(elem);
                }
                this.alert = 'Game File Downloaded'
            },

            loader: function () {
                this.loadGame('upload')
                this.alert = 'Game Loaded'
            },

            quickSaver: function (slot) {
                Vue.prototype.$saves[slot] = JSON.stringify({
                    events: Vue.prototype.$events,
                    gameInfo: Vue.prototype.$gameInfo,
                    news: Vue.prototype.$news,
                    players: Vue.prototype.$players,
                    schedule: Vue.prototype.$schedule,
                    teams: Vue.prototype.$teams,
                })
                Vue.prototype.$saves.dates[slot] = JSON.parse(JSON.stringify(Vue.prototype.$gameInfo.time.date))
                this.alert = 'Slot Saved'
            },

            quickLoader: function (slot) {
                this.loadGame(slot)
                this.alert = 'Quick Save Loaded'
            },

            quickStatusGetter: function () {
                var status = {}
                for (var s in { quickSave1: 0, quickSave2: 0, quickSave3: 0 }) {
                    var save = Vue.prototype.$saves[s]
                    if (Object.keys(save).length === 0) {
                        status[s] = 'Empty'
                    }
                    else {
                        status[s] = 'Saved ' + this.prettyDate(Vue.prototype.$saves.dates[s])
                    }
                }
                return status
            },



        }
    }
}
