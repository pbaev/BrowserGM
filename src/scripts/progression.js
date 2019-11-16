module.exports = {

    playerProgression: function playerProgression() {
        var season = Vue.prototype.$gameInfo.time.season
        const monthFactor = [1, 1, 1, 1, 0.5, 0.5, 0.5, 0, 0.5, 1, 1, 1, 1, 1][Vue.prototype.$gameInfo.time.date.month]

        function realCeiling(player) {
            // generates the player's actual ceiling taking into account the ceiling and chance to achieve it
            // seed used so it's always the same
            var seed = player.seedRnd(0, 100, 99)
            if (seed < player.potential.chance.int) {
                return player.potential.ceiling.int
            }
            else {
                var ceiling = player.potential.ceiling.int
                var dif = see - player.potential.ceiling.int
                if (dif > 50) {
                    var a = ceiling - (dif * 0.4)
                }
                else {
                    var b = 0.03 * dif
                    var a = ceiling - (dif / Math.pow(2, b))
                }
                if (a > 45) {
                    return parseInt(a)
                }
                else {
                    return 45
                }
            }
        }

        function ageFactor(age) {
            //ranges from -1 to 1
            if (age > 30) {
                return -((0.1 * age) - 3)
            }
            else {
                var a = Math.abs(age - 30)
                return (Math.pow(a, (1 / 3)) / 3)
            }
        }

        function ceilingFactor(ceiling, overall) {
            //ranges from 0 to 1
            var dif = ceiling - overall
            if (dif > 15) {
                return 1
            }
            else {
                var a = -(((0.07 * dif) - 1) ** 2) + 1
                return a
            }
        }

        function toiFactor(alltoi, gp, position) {
            // ranges from 0 to 2.5
            var toi = parseInt((alltoi / gp) / 60) //minutes per game
            if (position === 'ld' || position === 'rd') {
                var a = toi * 0.12
            }
            else {
                var a = toi * 0.1
            }
            if (isNaN(a)) {
                return 0
            }
            else if (a > 2.5) {
                return 2.5
            }
            else {
                return a
            }
        }

        function statsFactor(stat, gp, position) {
            // ranges from 0.5 to 2
            // stat is points or save %
            var points = stat / gp
            if (position === 'ld' || position === 'rd') {
                var a = (points * 1.2) + 0.5
            }
            else if (position !== 'g') {
                var a = (points * 1.8) + 0.5
            }
            else {
                var a = 5 * (stat - 0.8) + 0.5
            }
            if (isNaN(a)) {
                return 0.5
            }
            else if (a > 2) {
                return 2
            }
            else if (a < 0) {
                return 0
            }
            else {
                return a
            }
        }


        for (var p in Vue.prototype.$players) {
            if (isNaN(parseInt(p))) { continue }
            var player = Vue.prototype.$players[p]
            if (!['onehl', 'twohl', 'thrhl'].includes(player.league)) { continue }

            if (player.position === 'g') {
                //Goalies
                var attributeCategories = {
                    hockey: ['glove', 'blocker', 'pads', 'rebound', 'puck'],
                    athleticism: ['reflex', 'strength', 'stamina'],
                    mental: ['iq', 'work', 'confidence']
                }
                var af = ageFactor(player.age)
                var cf = ceilingFactor(realCeiling(player), player.overall())
                var sf = statsFactor(player.stats[season].savePctg, 0, 'g')
                var mf = monthFactor

                if (af > 0) {
                    var score = af * cf * sf * mf
                }
                else {
                    var score = af * (1-cf) * (1.5-sf) * mf
                }
                
                score = parseFloat(score.toFixed(2))

                for (var attribute in player.progression) {
                    player.attributes[attribute] -= Math.floor(player.progression[attribute])
                    player.progression[attribute] += (score * (Math.random() + 0.5))
                    player.attributes[attribute] += Math.floor(player.progression[attribute])

                    if (player.attributes[attribute] > 100) {
                        player.attributes[attribute] = 100
                    }
                    else if (player.attributes[attribute] < 0) {
                        player.attributes[attribute] = 0
                    }
                }
            }
            else {
                //Players
                var attributeCategories = {
                    offence: ['oiq', 'wrist', 'slap', 'hands'],
                    defence: ['diq', 'stick', 'blocking', 'hitting'],
                    skills: ['skating', 'passing', 'handEye', 'faceOff'],
                    other: ['strength', 'stamina', 'hustle', 'discipline']
                }
                var af = ageFactor(player.age)
                var cf = ceilingFactor(realCeiling(player), player.overall())
                var tf = toiFactor(player.stats[season].toi, player.stats[season].gamesPlayed, player.position)
                var sf = statsFactor(player.stats[season].points, player.stats[season].gamesPlayed, player.position)
                var mf = monthFactor

                if (af > 0) {
                    var score = af * cf * sf * tf * mf
                }
                else {
                    var score = af * (1-cf) * (1.5-sf) * (2-tf) * mf
                }

                score = parseFloat(score.toFixed(2))

                for (var attribute in player.progression) {
                    player.attributes[attribute] -= Math.floor(player.progression[attribute])
                    player.progression[attribute] += (score * (Math.random() + 0.5))
                    player.attributes[attribute] += Math.floor(player.progression[attribute])

                    if (player.attributes[attribute] > 100) {
                        player.attributes[attribute] = 100
                    }
                    else if (player.attributes[attribute] < 0) {
                        player.attributes[attribute] = 0
                    }
                }
            }
        }

        for (var p=0; p < Vue.prototype.$players.juniors.length; p++) {
            var player = Vue.prototype.$players[Vue.prototype.$players.juniors[p]]

            var af = ageFactor(player.age)
            var cf = ceilingFactor(realCeiling(player), player.overall())
            var mf = monthFactor

            var score = af * cf * mf * 1.5

            for (var attribute in player.progression) {
                player.attributes[attribute] -= Math.floor(player.progression[attribute])
                player.progression[attribute] += (score * (Math.random() + 0.5))
                player.attributes[attribute] += Math.floor(player.progression[attribute])

                if (player.attributes[attribute] > 100) {
                    player.attributes[attribute] = 100
                }
                else if (player.attributes[attribute] < 0) {
                    player.attributes[attribute] = 0
                }
            }
        }
    }
}




