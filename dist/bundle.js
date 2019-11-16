"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(function () {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = "function" == typeof require && require;
          if (!f && c) return c(i, !0);
          if (u) return u(i, !0);
          var a = new Error("Cannot find module '" + i + "'");
          throw a.code = "MODULE_NOT_FOUND", a;
        }

        var p = n[i] = {
          exports: {}
        };
        e[i][0].call(p.exports, function (r) {
          var n = e[i][1][r];
          return o(n || r);
        }, p, p.exports, r, e, n, t);
      }

      return n[i].exports;
    }

    for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) {
      o(t[i]);
    }

    return o;
  }

  return r;
})()({
  1: [function (require, module, exports) {
    module.exports = {
      Game:
      /*#__PURE__*/
      function () {
        function Game(_ref) {
          var _ref$load = _ref.load,
              load = _ref$load === void 0 ? null : _ref$load,
              _ref$loadData = _ref.loadData,
              loadData = _ref$loadData === void 0 ? null : _ref$loadData,
              _ref$league = _ref.league,
              league = _ref$league === void 0 ? null : _ref$league,
              _ref$home = _ref.home,
              home = _ref$home === void 0 ? null : _ref$home,
              _ref$away = _ref.away,
              away = _ref$away === void 0 ? null : _ref$away,
              _ref$date = _ref.date,
              date = _ref$date === void 0 ? null : _ref$date,
              _ref$type = _ref.type,
              type = _ref$type === void 0 ? null : _ref$type;

          _classCallCheck(this, Game);

          if (load) {
            for (var info in loadData) {
              this[info] = loadData[info];
            }
          } else {
            this.league = league;
            this.id = this.generateId();
            this.home = parseInt(home);
            this.away = parseInt(away);
            this.date = date;
            this.type = type;
            this.summary = {
              extraTime: false,
              goals: [],
              penalties: [],
              ticks: 0,
              score: {
                home: 0,
                away: 0
              }
            };
            this.stats = {
              home: {
                goals: 0,
                pps: 0,
                ppTime: 0,
                ppgf: 0,
                ppga: 0,
                pks: 0,
                pkTime: 0,
                pkgf: 0,
                pkga: 0,
                fow: 0,
                fol: 0,
                shots: 0,
                saves: 0
              },
              away: {
                goals: 0,
                pps: 0,
                ppTime: 0,
                ppgf: 0,
                ppga: 0,
                pks: 0,
                pkTime: 0,
                pkgf: 0,
                pkga: 0,
                fow: 0,
                fol: 0,
                shots: 0,
                saves: 0
              }
            };
          } // Adds game to schedule. Catch if the date doesn't have any games yet


          try {
            Vue.prototype.$schedule.teams[this.league][this.home].push(this.id);
          } catch (_unused) {
            Vue.prototype.$schedule.teams[this.league][this.home] = [this.id];
          }

          try {
            Vue.prototype.$schedule.teams[this.league][this.away].push(this.id);
          } catch (_unused2) {
            Vue.prototype.$schedule.teams[this.league][this.away] = [this.id];
          }

          try {
            Vue.prototype.$schedule.dates[this.league][this.date.day + '-' + this.date.month + '-' + this.date.year].push(this.id);
          } catch (_unused3) {
            Vue.prototype.$schedule.dates[this.league][this.date.day + '-' + this.date.month + '-' + this.date.year] = [this.id];
          }
        }

        _createClass(Game, [{
          key: "generateId",
          value: function generateId() {
            if (Math.max.apply(Math, Object.keys(Vue.prototype.$schedule.id[this.league])) === -Infinity) {
              return 1;
            } else {
              //finds max int in a list where there can be strings
              return Math.max.apply(Math, Object.keys(Vue.prototype.$schedule.id[this.league])) + 1;
            }
          }
        }, {
          key: "nextPlayoffGame",
          value: function nextPlayoffGame(seriesInfo) {
            var league = this.league;
            var date = JSON.parse(JSON.stringify(Vue.prototype.$gameInfo.time.date));
            var gameNum = seriesInfo.score[0] + seriesInfo.score[1];

            function nextDay(date, increment) {
              if (date.month == 2) {
                var monthLength = 27;
              } else {
                var monthLength = 29;
              }

              date.day += increment;

              if (date.day > monthLength) {
                date.day = 1;
                date.month++;

                if (date.month === 13) {
                  date.year++;
                  date.month = 1;
                  date.day = 1;
                }
              }

              return JSON.parse(JSON.stringify(date));
            }

            if (gameNum == 0 || gameNum == 1 || gameNum == 4 || gameNum == 6) {
              var homeTeam = seriesInfo.hi;
              var awayTeam = seriesInfo.lo;
            } else {
              var homeTeam = seriesInfo.lo;
              var awayTeam = seriesInfo.hi;
            }

            var g = new Vue.prototype.$class.Game.Game({
              league: league,
              home: homeTeam,
              away: awayTeam,
              date: nextDay(date, 2),
              type: 'playoff'
            });
            Vue.prototype.$schedule.id[league][g.id] = g;
          }
        }, {
          key: "simGame",
          value: function simGame() {
            var season = Vue.prototype.$gameInfo.time.season;
            var home = this.home;
            var away = this.away;
            var league = this.league;
            var summary = this.summary;
            var teams = {
              home: Vue.prototype.$teams[league][home],
              away: Vue.prototype.$teams[league][away]
            };
            var otherTeam = {
              home: 'away',
              away: 'home'
            };
            /* STATS */

            var stats = this.stats;
            /* PLAYERS */

            function makeGamePlayer(pid) {
              function multiplier(value, variance) {
                // variance is how much above and below 1 the range can be
                // for example a variance of 0.10 (0.90 - 1.10)
                // value 0 returns 0.90, value 50 returns 1.00, value 90 returns 1.08
                var score = 1 - variance + variance * (value / 100) * 2;
                return score;
              }

              function playerEnergyDrain(player) {
                if (player.position === 'g') {
                  return 0.02;
                } else if (['lw', 'c', 'rw'].includes(player.position)) {
                  // The energy drain range is (0.695 - 1.105) 
                  // That is (42 - 66) energy lost per minute of playing
                  var score = 2 - multiplier(player.attributes.stamina, 0.2) - multiplier(player.attributes.strength, 0.05) * 0.1;
                  return score;
                } else {
                  // The energy drain range is (0.595 - 1.005) 
                  // That is (36 - 60) energy lost per minute of playing
                  var score = 1.9 - multiplier(player.attributes.stamina, 0.2) - multiplier(player.attributes.strength, 0.05) * 0.1;
                  return score;
                }
              }

              var player = Vue.prototype.$players[pid];
              var playerInfo = {
                id: player.id,
                position: player.position,
                offence: player.categoryScores().offence,
                defence: player.categoryScores().defence,
                stats: player.stats[season],
                energy: 100,
                energyDrain: playerEnergyDrain(player),
                penalized: false
              };
              return Object.assign({}, playerInfo, player.attributes);
            }

            var players = {};

            for (var team in teams) {
              for (var n in teams[team].players) {
                var pid = teams[team].players[n];
                players[pid] = makeGamePlayer(pid);
              }
            }
            /* Lines */


            var lines = {
              home: teams.home.lines,
              away: teams.away.lines
            };

            function playersInLine(team, strength, type, line) {
              // ex paramaters: function('home', 'v43', 'defence', 2)
              // returns players in line by position, omits missing positions
              // ex return: {ld:74820, rd: Player}
              var pids = {};
              var positionTypes = {
                forward: ['lw', 'c', 'rw'],
                defence: ['ld', 'rd']
              };

              for (var p in positionTypes[type]) {
                var pos = positionTypes[type][p];
                pids[pos] = players[lines[team][strength][pos][line]];
              }

              return pids;
            }

            function allPlayersOnIce() {
              //return all players on ice in format {home: {lw:8362, c:4353, rw:5421, ld: Player, rd: Player}, away:{...}}
              // ids above are actually the player object/class
              var allPlayers = {
                home: {},
                away: {}
              };

              for (var team in teams) {
                var line = lines[team][getStrength(team)];
                var lineOnIce = gameState.lineOnIce[team];
                allPlayers[team].lw = players[line.lw[lineOnIce.forward]];
                allPlayers[team].c = players[line.c[lineOnIce.forward]];
                allPlayers[team].rw = players[line.rw[lineOnIce.forward]];
                allPlayers[team].ld = players[line.ld[lineOnIce.defence]];
                allPlayers[team].rd = players[line.rd[lineOnIce.defence]];

                for (var pos in {
                  lw: 0,
                  c: 0,
                  rw: 0,
                  ld: 0,
                  rd: 0
                }) {
                  if (typeof allPlayers[team][pos] === 'undefined') {
                    delete allPlayers[team][pos];
                  }
                }
              }

              return allPlayers;
            }

            function allPlayersOnIceList(grouping) {
              // return players in list like {home: [Player, ...], away: [...]]}
              var allPlayers = allPlayersOnIce();
              var listPlayers = {
                home: [],
                away: []
              };

              for (var team in teams) {
                for (var position in allPlayers[team]) {
                  listPlayers[team].push(allPlayers[team][position]);
                }
              }

              if (grouping === 'byTeam') {
                return listPlayers;
              } else if (grouping === 'all') {
                return listPlayers.home.concat(listPlayers.away);
              }
            }

            function playersTotalAttributes(allPlayers, attribute) {
              // takes in ({lw:4532, c:Player, rw: Player}, faceOff), players are like the output of allPlayersOnIce()
              // then returns the sum of the requested attribute from all the players
              var total = 0;

              if (['offence', 'defence', 'energy'].includes(attribute)) {
                for (var position in allPlayers) {
                  total += allPlayers[position][attribute];
                }
              } else {
                for (var position in allPlayers) {
                  total += allPlayers[position].attributes[attribute];
                }
              }

              return total;
            }

            function totalLinesAttribute(attribute, team, strength, type) {
              // ex paramaters: function('energy', 'home', 'v54', 'forward')
              // returns total energy of all the forward/defence lines the given strength
              // ex return: [167, 87, 200, 95]
              var energies = [];
              var all = lines[team][strength];

              if (type === 'forward') {
                for (var n = 0; n < all.c.length; n++) {
                  for (var pos in {
                    lw: 0,
                    c: 0,
                    rw: 0
                  }) {
                    if (all[pos][n] == '0') {
                      continue;
                    } else if (energies.length === n) {
                      energies.push(players[all[pos][n]][attribute]);
                    } else {
                      energies[n] += players[all[pos][n]][attribute];
                    }
                  }
                }
              } else if (type === 'defence') {
                for (var n = 0; n < all.ld.length; n++) {
                  for (var pos in {
                    ld: 0,
                    rd: 0
                  }) {
                    if (all[pos][n] == '0') {
                      continue;
                    } else if (energies.length === n) {
                      energies.push(players[all[pos][n]][attribute]);
                    } else {
                      energies[n] += players[all[pos][n]][attribute];
                    }
                  }
                }
              }

              return energies;
            }
            /* GAME STATE */
            // zone is one of: 
            //'home-net','home-blueline','home-neutral','center','away-neutral','away-blueline','away-net'


            function getStrength(team) {
              // returns game strength relative to team
              // ex: function('away') return 'v35'
              if (team === 'home') {
                return 'v' + gameState.strength.home.toString() + gameState.strength.away.toString();
              } else if (team === 'away') {
                return 'v' + gameState.strength.away.toString() + gameState.strength.home.toString();
              }
            }

            var gameState = {
              tick: 0,
              endTick: 3600,
              strength: {
                home: 5,
                away: 5
              },
              penalties: {
                home: [],
                away: []
              },
              zone: 'center',
              stoppage: true,
              lineOnIce: {
                home: {
                  forward: 0,
                  defence: 0
                },
                away: {
                  forward: 0,
                  defence: 0
                }
              },
              gameFinished: false,
              possesion: 'neutral',
              goalies: {
                home: lines.home.g[0],
                away: lines.away.g[0]
              },
              score: {
                home: 0,
                away: 0
              },
              goalSummary: [],
              penaltySummary: [],
              extraTime: false
            };
            /* GAME SIMULATION */

            function proportionChance(teamOneValue, teamTwoValue) {
              var total = teamOneValue + teamTwoValue;
              teamOneValue = teamOneValue / total;
              teamTwoValue = 1 - teamOneValue;
              teamOneValue = 0;

              if (Math.random() < teamTwoValue) {
                return 'teamTwo';
              } else {
                return 'teamOne';
              }
            }

            function changeLines() {
              //Lines change based on line energy and line desirability
              var lineDesire = [1, 0.8, 0.65, 0.6];

              for (team in teams) {
                for (var type in {
                  forward: 0,
                  defence: 0
                }) {
                  var bestLineValue = -1;
                  var chosenLine = 0;
                  var lineWeight = totalLinesAttribute('energy', team, getStrength(team), type);

                  for (var n = 0; n < lineWeight.length; n++) {
                    lineWeight[n] = parseInt(lineWeight[n] * lineDesire[n]);

                    if (lineWeight.length > gameState.lineOnIce[team][type]) {
                      lineWeight[gameState.lineOnIce[team][type]] += 15;
                    }

                    if (lineWeight[n] > bestLineValue) {
                      bestLineValue = lineWeight[n];
                      chosenLine = n;
                    }
                  }

                  gameState.lineOnIce[team][type] = chosenLine;
                }
              }
            }

            function changePossesion() {
              if (gameState.stoppage) {
                //Faceoff
                var faceOffScore = currentPlayers.home.c.faceOff + currentPlayers.away.c.faceOff;

                if (Math.random() * faceOffScore < currentPlayers.home.c.faceOff) {
                  gameState.possesion = 'home';
                  stats.home.fow += 1;
                  stats.away.fol += 1;
                } else {
                  gameState.possesion = 'away';
                  stats.home.fol += 1;
                  stats.away.fow += 1;
                }

                gameState.stoppage = false;
              } else {
                //on the fly possesion change 
                if (Math.random() > 0.9) {
                  var homeScore = playersTotalAttributes(currentPlayers.home, 'offence') + playersTotalAttributes(currentPlayers.home, 'defence');
                  var awayScore = playersTotalAttributes(currentPlayers.away, 'offence') + playersTotalAttributes(currentPlayers.away, 'defence');
                  var totalScore = homeScore + awayScore;
                  homeScore = homeScore / totalScore;
                  awayScore = 1 - homeScore;
                  homeScore = 0;

                  if (Math.random() > 0.8) {
                    gameState.possesion = 'neutral';
                  } else if (Math.random() < awayScore) {
                    gameState.possesion = 'home';
                  } else {
                    gameState.possesion = 'away';
                  }
                }
              }
            }

            function changeZone() {
              var zoneList = ['home-net', 'home-blueline', 'home-neutral', 'center', 'away-neutral', 'away-blueline', 'away-net'];
              var currentZoneIndex = zoneList.indexOf(gameState.zone);

              if (Math.random() > 0.9) {
                var homeScore = playersTotalAttributes(currentPlayers.home, 'offence') + playersTotalAttributes(currentPlayers.home, 'defence');
                var awayScore = playersTotalAttributes(currentPlayers.away, 'offence') + playersTotalAttributes(currentPlayers.away, 'defence');

                if (proportionChance(homeScore, awayScore) === 'teamOne') {
                  if (currentZoneIndex !== 6) {
                    gameState.zone = zoneList[currentZoneIndex + 1];
                  }
                } else {
                  if (currentZoneIndex !== 0) gameState.zone = zoneList[currentZoneIndex - 1];
                }
              }
            }

            function tryShot() {
              var zoneMultiplier = {
                net: 1.1,
                blueline: 0.75,
                neutral: 0.3
              };

              if (gameState.possesion === 'neutral') {
                return;
              }

              if (gameState.possesion === gameState.zone.split('-')[0]) {
                return;
              }

              var relTeams = {
                shooting: gameState.possesion,
                defending: otherTeam[gameState.possesion]
              };

              if (gameState.possesion !== gameState.zone.split('-')[1]) {
                var zoneFactor = zoneMultiplier[gameState.zone.split('-')[1]];
                var shootingTeam = playersTotalAttributes(currentPlayers[relTeams.shooting], 'offence') * zoneFactor;
                var defendingTeam = playersTotalAttributes(currentPlayers[relTeams.defending], 'defence');

                if (Math.random() > 0.93) {
                  //shot is made
                  var shooter = function shooter() {
                    var bestScorer = {
                      player: 0,
                      value: -99
                    };

                    for (var pos in currentPlayers[relTeams.shooting]) {
                      var player = currentPlayers[relTeams.shooting][pos];
                      var score = parseInt((player.wrist + player.slap / 3 + player.oiq / 4) * Math.random());

                      if (score > bestScorer.value) {
                        bestScorer = {
                          player: player,
                          value: score
                        };
                      }
                    }

                    bestScorer.player.stats.shots += 1;
                    return bestScorer.player.id;
                  };

                  var goal = shooter();

                  if (proportionChance(shootingTeam, defendingTeam) === 'teamOne') {
                    stats[relTeams.shooting].shots += 1;
                    var goalie = gameState.goalies[relTeams.defending];
                    var goalieScore = players[goalie].defence * 28;

                    if (proportionChance(goalieScore, shootingTeam) === 'teamOne') {
                      //save
                      players[goalie].stats.saves += 1;
                      stats[relTeams.defending].saves += 1;
                    } else {
                      var assister = function assister(alreadyCredited) {
                        var bestAssister = {
                          player: 0,
                          value: -1
                        };

                        for (var pos in currentPlayers[relTeams.shooting]) {
                          var player = currentPlayers[relTeams.shooting][pos];

                          if (!alreadyCredited.includes(player.id)) {
                            var score = parseInt((player.passing + player.oiq / 3 - 50) * Math.random());

                            if (score > bestAssister.value) {
                              bestAssister = {
                                player: player,
                                value: score
                              };
                            }
                          }
                        }

                        bestAssister.player.stats.assists += 1;
                        bestAssister.player.stats.points += 1;
                        return bestAssister.player.id;
                      }; //goal is from earlier shooter() function


                      //goal
                      stats[relTeams.shooting].goals += 1;
                      players[goalie].stats.goalsAgainst += 1;
                      gameState.score[relTeams.shooting] += 1;
                      gameState.stoppage = true;
                      gameState.possesion = 'neutral';
                      gameState.zone = 'center';
                      var strength = 'EV';

                      if (gameState.strength[relTeams.shooting] > gameState.strength[relTeams.defending]) {
                        stats[relTeams.shooting].ppgf += 1;
                        stats[relTeams.defending].pkga += 1;
                        strength = 'PP';
                      } else if (gameState.strength[relTeams.shooting] < gameState.strength[relTeams.defending]) {
                        stats[relTeams.shooting].pkgf += 1;
                        stats[relTeams.defending].ppga += 1;
                        strength = 'PK';
                      }

                      players[goal].stats.goals += 1;
                      players[goal].stats.points += 1;
                      var points = [];
                      points.push(goal);

                      if (Math.random() > 0.1) {
                        var a1 = assister(points);
                        points.push(a1);
                        var firstAssist = true;
                      }

                      if (firstAssist && Math.random() > 0.4) {
                        var a2 = assister(points);
                        points.push(a2);
                      }

                      gameState.goalSummary.push({
                        time: gameState.tick,
                        points: points,
                        strength: strength
                      });
                    }
                  }
                }
              }
            }

            function penalties() {
              var onIce = allPlayersOnIceList('byTeam');

              for (var team in teams) {
                if (gameState.penalties[team].length > 0) {
                  stats[team].pkTime += 1;
                  stats[otherTeam[team]].ppTime += 1;
                }

                for (var n = 0; n < gameState.penalties[team]; n++) {
                  if (gameState.penalties[team][n] === gameState.tick) {
                    gameState.penalties[team] = gameState.penalties[team].slice(1);

                    if (gameState.penalties[team].length < 2) {
                      gameState.strength[team] += 1;
                    }
                  }
                }

                for (var n = 0; n < onIce[team].length; n++) {
                  var player = onIce[team][n];
                  var penaltyChance = (100 - player.discipline) / 100000;

                  if (penaltyChance > Math.random()) {
                    //penalty called
                    if (gameState.strength[team] === 3) {
                      var penaltyNum = gameState.penalties[team].length;
                      var secondLastPenalty = gameState.penalties[penaltyNum - 2];
                      gameState.penalties[team].push(secondLastPenalty + 120);
                    } else {
                      gameState.penalties[team].push(gameState.tick + 120);
                      gameState.strength[team] -= 1;
                    }

                    gameState.zone = [otherTeam[team], 'blueline'].join('-');
                    gameState.stoppage = true;
                    player.stats.pim += 2;
                    stats[team].pks += 1;
                    stats[otherTeam[team]].pps += 1;
                    gameState.penaltySummary.push({
                      time: gameState.tick,
                      id: player.id
                    });
                  }
                }
              }
            }

            function usedEnergy() {
              var onIce = allPlayersOnIceList('all').map(function (p) {
                return p.id;
              });

              for (var n in players) {
                var player = players[n];

                if (onIce.includes(player.id)) {
                  if (player.energy > player.energyDrain) {
                    player.energy -= player.energyDrain;
                  }

                  player.stats.toi += 1;
                } else {
                  if (player.energy < 100) {
                    player.energy += 0.4;
                  }
                }
              }
            }

            function stoppage() {
              if ([1200, 2400, 3600].includes(gameState.tick)) {
                //end of period
                gameState.stoppage = true;
                gameState.possesion = 'neutral';
                gameState.zone = 'center';
              } else if (Math.random() > 0.985) {
                // puck stoppage/out of play
                gameState.stoppage = true;
                gameState.possesion = 'neutral';

                if (gameState.zone === 'home-net') {
                  gameState.zone = 'home-blueline';
                } else if (gameState.zone === 'away-net') {
                  gameState.zone = 'away-blueline';
                }
              }
            }

            function gameEnd() {
              if (gameState.score.home !== gameState.score.away) {
                gameState.gameFinished = true;
              } else if (gameState.tick >= 3900) {
                // a shootout, this is very accurate
                if (self.type === 'playoffs') {
                  if (gameState.score.home === gameState.score.away) {
                    gameState.endTick++;
                    gameState.gameFinished = false;
                  } else {
                    gameState.gameFinished = true;
                  }
                } else {
                  if (Math.random() > 0.5) {
                    gameState.score.home += 1;
                  } else {
                    gameState.score.away += 1;
                  }

                  gameState.extraTime = 'so';
                  gameState.gameFinished = true;
                }
              } else if (!gameState.extraTime & gameState.score.home === gameState.score.away) {
                // overtime
                gameState.extraTime = 'ot';
                gameState.endTick = 3900;
              }

              if (gameState.gameFinished) {
                //Game is finished
                summary.goals = gameState.goalSummary;
                summary.penalties = gameState.penaltySummary;
                summary.extraTime = gameState.extraTime;
                summary.score = gameState.score;

                for (var team in teams) {
                  for (var type in stats[team]) {
                    if (type === 'goals') {
                      teams[team].stats.goalsFor += stats[team].goals;
                    } else {
                      teams[team].stats[type] += stats[team][type];
                    }
                  }

                  teams[team].stats.goalsAgainst = stats[otherTeam[team]].goals;
                  teams[team].stats.gamesPlayed += 1;
                  var winner = gameState.score[team] > gameState.score[otherTeam[team]];

                  if (winner & !gameState.extraTime) {
                    teams[team].stats.wins += 1;
                  } else if (winner & gameState.extraTime === 'ot') {
                    teams[team].stats.otw += 1;
                  } else if (winner & gameState.extraTime === 'so') {
                    teams[team].stats.sow += 1;
                  } else if (!winner & !gameState.extraTime) {
                    teams[team].stats.losses += 1;
                  } else if (!winner & gameState.extraTime === 'ot') {
                    teams[team].stats.otl += 1;
                  } else if (!winner & gameState.extraTime === 'so') {
                    teams[team].stats.sol += 1;
                  }
                }

                for (var n in players) {
                  var player = players[n];

                  if (player.position !== 'g') {
                    player.stats.gamesPlayed += 1;
                  }
                }

                var homeGoalie = players[gameState.goalies.home].stats;
                homeGoalie.toi += gameState.endTick;
                homeGoalie.savePctg = (homeGoalie.saves / (homeGoalie.saves + homeGoalie.goalsAgainst)).toFixed(2);
                homeGoalie.gaa = (homeGoalie.goalsAgainst / (homeGoalie.toi / 3600)).toFixed(2);
                homeGoalie.gamesPlayed += 1;
                var awayGoalie = players[gameState.goalies.away].stats;
                awayGoalie.toi += gameState.endTick;
                awayGoalie.savePctg = (awayGoalie.saves / (awayGoalie.saves + awayGoalie.goalsAgainst)).toFixed(2);
                awayGoalie.gaa = (awayGoalie.goalsAgainst / (awayGoalie.toi / 3600)).toFixed(2);
                awayGoalie.gamesPlayed += 1;

                if (self.type == 'playoff') {
                  var round = Vue.prototype.$gameInfo.time.period.split('-')[1];

                  for (var matchup in Vue.prototype.$events.playoffs[self.league][round]) {
                    var g = Vue.prototype.$events.playoffs[self.league][round][matchup];

                    if (g.hi == home || g.lo == home) {
                      if (g.hi == home && gameState.score.home > gameState.score.away) {
                        g.score[0] += 1;
                      } else if (g.hi == away && gameState.score.away > gameState.score.home) {
                        g.score[0] += 1;
                      } else {
                        g.score[1] += 1;
                      }

                      if (!(g.score[0] >= 4 || g.score[1] >= 4)) {
                        self.nextPlayoffGame(JSON.parse(JSON.stringify(g)));
                      }
                    }
                  }
                }
              }
            }

            while (!gameState.gameFinished) {
              var self = this;
              changeLines();
              var currentPlayers = allPlayersOnIce();
              changePossesion();
              changeZone();
              tryShot();
              penalties();
              usedEnergy();
              stoppage();
              gameState.tick++;

              if (gameState.tick === gameState.endTick || gameState.extraTime === 'ot' && gameState.score.home !== gameState.score.away) {
                gameEnd();
              }
            }
          }
        }]);

        return Game;
      }()
    };
  }, {}],
  2: [function (require, module, exports) {
    module.exports = {
      Player:
      /*#__PURE__*/
      function () {
        function Player(_ref2) {
          var _ref2$type = _ref2.type,
              type = _ref2$type === void 0 ? null : _ref2$type,
              _ref2$region = _ref2.region,
              region = _ref2$region === void 0 ? null : _ref2$region,
              _ref2$position = _ref2.position,
              position = _ref2$position === void 0 ? null : _ref2$position,
              _ref2$load = _ref2.load,
              load = _ref2$load === void 0 ? null : _ref2$load;

          _classCallCheck(this, Player);

          if (type === 'start' || type === 'free agent' || type === 'depth') {
            this.league = 'freeAgents';
            this.team = 0;
          } else if (type === 'prospect') {
            this.league = 'prospects';
            this.team = region;
          }

          if (type !== 'load') {
            this.age = this.generateAge(type);
            this.position = this.generatePosition(position);
            this.attributes = this.generateAttributes(type);
            this.contract = this.generateContract(type);
            this.country = this.generateCountry(type);
            this.face = rnd(1, 50);
            this.id = this.playerId();
            this.fullName = this.generateName();
            this.newContract = {};
            this.progression = this.generateProgression();
            this.stats = {};
            this.stats[Vue.prototype.$gameInfo.time.season] = this.generateStats();
            this.positionStrength = this.positionStrength();
            this.potential = this.generatePotential(type);
            Vue.prototype.$players[this.league].push(this.id);
          } else {
            for (var info in load) {
              this[info] = load[info];
            }
          }
        }

        _createClass(Player, [{
          key: "categoryScores",
          value: function categoryScores() {
            function multiplier(value, variance) {
              // variance is how much above and below 1 the range can be
              // for example a variance of 0.10 (0.90 - 1.10)
              // value 0 returns 0.90, value 50 returns 1.00, value 90 returns 1.08
              var score = 1 - variance + variance * (value / 100) * 2;
              return score;
            }

            var factor = {
              oiq: {
                lw: 0.30,
                c: 0.40,
                rw: 0.30,
                ld: 0.40,
                rd: 0.40
              },
              wrist: {
                lw: 0.35,
                c: 0.30,
                rw: 0.35,
                ld: 0.10,
                rd: 0.10
              },
              slap: {
                lw: 0.15,
                c: 0.10,
                rw: 0.15,
                ld: 0.25,
                rd: 0.25
              },
              hands: {
                lw: 0.20,
                c: 0.20,
                rw: 0.20,
                ld: 0.15,
                rd: 0.15
              },
              diq: {
                lw: 0.35,
                c: 0.35,
                rw: 0.35,
                ld: 0.35,
                rd: 0.35
              },
              stick: {
                lw: 0.30,
                c: 0.30,
                rw: 0.30,
                ld: 0.25,
                rd: 0.25
              },
              blocking: {
                lw: 0.25,
                c: 0.25,
                rw: 0.25,
                ld: 0.20,
                rd: 0.20
              },
              hitting: {
                lw: 0.10,
                c: 0.10,
                rw: 0.10,
                ld: 0.20,
                rd: 0.20
              },
              handEye: {
                lw: 0.10,
                c: 0.10,
                rw: 0.10,
                ld: 0.10,
                rd: 0.10
              }
            };
            var scores = {
              offence: 0,
              defence: 0
            };

            for (var type in scores) {
              // A player with perfect attributes would get a total of 100
              var total = 0;

              if (type === 'offence') {
                if (this.position !== 'g') {
                  total += this.attributes.oiq * factor.oiq[this.position];
                  total += this.attributes.wrist * factor.wrist[this.position];
                  total += this.attributes.slap * factor.slap[this.position];
                  total += this.attributes.hands * factor.hands[this.position];
                  total += this.attributes.handEye * factor.handEye[this.position];
                  total /= 1.1;
                  total *= multiplier(this.attributes.skating, 0.125);
                  total *= multiplier(this.attributes.passing, 0.1);
                  total *= multiplier(this.attributes.strength, 0.05);
                  total *= multiplier(this.attributes.hustle, 0.05);
                  total /= multiplier(100, 0.05) * multiplier(100, 0.05) * multiplier(100, 0.1) * multiplier(100, 0.125);
                } else {
                  total += this.attributes.iq * 0.20;
                  total += this.attributes.puck * 0.60;
                  total += this.attributes.confidence * 0.20;
                }
              } else if (type === 'defence') {
                if (this.position !== 'g') {
                  total += this.attributes.diq * factor.diq[this.position];
                  total += this.attributes.stick * factor.stick[this.position];
                  total += this.attributes.blocking * factor.blocking[this.position];
                  total += this.attributes.hitting * factor.hitting[this.position];
                  total += this.attributes.handEye * factor.handEye[this.position];
                  total /= 1.1;
                  total *= multiplier(this.attributes.skating, 0.125);
                  total *= multiplier(this.attributes.passing, 0.1);
                  total *= multiplier(this.attributes.strength, 0.05);
                  total *= multiplier(this.attributes.hustle, 0.05);
                  total /= multiplier(100, 0.05) * multiplier(100, 0.05) * multiplier(100, 0.1) * multiplier(100, 0.125);
                } else {
                  total += this.attributes.glove * 0.20;
                  total += this.attributes.blocker * 0.20;
                  total += this.attributes.pads * 0.20;
                  total += this.attributes.rebounds * 0.20;
                  total += this.attributes.reflex * 0.17;
                  total += this.attributes.puck * 0.03;
                  total *= multiplier(this.attributes.strength, 0.025);
                  total *= multiplier(this.attributes.iq, 0.075);
                  total *= multiplier(this.attributes.confidence, 0.03);
                  total *= multiplier(this.attributes.work, 0.025);
                  total /= multiplier(100, 0.025) * multiplier(100, 0.075) * multiplier(100, 0.03) * multiplier(100, 0.025);
                }
              }

              scores[type] = Math.round(total);
            }

            return scores;
          }
        }, {
          key: "desiredContract",
          value: function desiredContract() {
            var cap = 1;
            var years = 1;

            if (this.age <= 20) {
              // Entry level contracts at minimum until age 21
              cap = 1;
              years = 21 - this.age;
            } else if (this.overall() <= 76) {
              //Minor league players get minimum contracts
              if (this.age < 25) {
                cap = 1;
                years = 1;
              }

              if (this.age < 29) {
                cap = 1;
                years = this.seedRnd(1, 2, 1);
              } else {
                cap = 1;
                years = this.seedRnd(1, 3, 1);
              }
            } else {
              if (this.age === 21) {
                years = this.seedRnd(2, 3, 1);
              } else if (this.age <= 25) {
                years = this.seedRnd(3, 4, 1);
              } else if (this.age <= 30) {
                years = this.seedRnd(6, 8, 1);
              } else if (this.age <= 34) {
                years = this.seedRnd(5, 7, 1);
              } else {
                years = this.seedRnd(1, 3, 1);
              }

              var cap = this.overall() * 0.6 - 45;

              if (['c', 'ld', 'rd'].includes(this.position)) {
                cap += (this.overall() - 60) / 10;
              } else if (this.position === 'g') {
                cap = this.overall() * 0.5 - 37.2;
              }

              if (cap > 15) {
                cap = 15;
              } else if (cap < 1.25) {
                cap = 1.25;
              }
            }

            if (Vue.prototype.$events.freeAgency.day !== 'season') {
              if (Vue.prototype.$events.freeAgency.day > 10) {
                cap -= (Vue.prototype.$events.freeAgency.day - 10) * 0.1;
              }
            }

            cap = parseFloat(cap.toFixed(2));

            if (cap < 1) {
              cap = 1;
            }

            return {
              cap: cap,
              years: years
            };
          }
        }, {
          key: "generateAge",
          value: function generateAge(type) {
            if (type === 'start' || type === 'free agent' || type === 'depth') {
              if (Math.random() < 0.85) {
                var age = rnd(18, 30) + rnd(0, 7);
              } else {
                var age = rnd(18, 21);
              }

              return age;
            } else if (type === 'prospect') {
              return 17;
            }
          }
        }, {
          key: "generateAttributes",
          value: function generateAttributes(type) {
            if (type === 'start') {
              var r = Math.random();

              if (r < 0.33) {
                var mean = rnd(60, 77);
              } else if (r < 0.66) {
                var mean = rnd(77, 88);
              } else if (r < 0.97) {
                var mean = rnd(89, 97);
              } else {
                var mean = rnd(95, 100);
              }
            } else if (type === 'prospect') {
              var mean = rnd(55, 80);

              if (Math.round() > 0.8) {
                mean += rnd(0, 20);
              }
            } else if (type === 'free agent') {
              var mean = (57, 75);

              if (Math.random() > 0.98) {
                mean += rnd(0, 25);
              }
            } else if (type === 'depth') {
              var mean = 55;
            }

            if (this.age < 25) {
              mean -= 25 - this.age;
            }

            if (this.position === 'g') {
              var attributes = {
                puck: normal(mean, 30, 0, 100),
                glove: normal(mean, 30, 0, 100),
                blocker: normal(mean, 30, 0, 100),
                pads: normal(mean, 30, 0, 100),
                rebounds: normal(mean, 30, 0, 100),
                reflex: normal(mean, 30, 0, 100),
                strength: normal(mean, 30, 0, 100),
                stamina: normal(mean, 30, 0, 100),
                iq: normal(mean, 30, 0, 100),
                work: normal(mean, 30, 0, 100),
                confidence: normal(mean, 30, 0, 100)
              };
              return attributes;
            } else {
              var attributes = {
                blocking: normal(mean, 30, 0, 100),
                diq: normal(mean, 30, 0, 100),
                discipline: normal(80, 20, 0, 100),
                faceOff: normal(mean, 30, 0, 100),
                handEye: normal(mean, 30, 0, 100),
                hands: normal(mean, 30, 0, 100),
                hitting: normal(mean, 30, 0, 100),
                hustle: normal(mean, 30, 0, 100),
                oiq: normal(mean, 30, 0, 100),
                passing: normal(mean, 30, 0, 100),
                skating: normal(mean, 30, 0, 100),
                slap: normal(mean, 30, 0, 100),
                stamina: normal(mean, 30, 0, 100),
                stick: normal(mean, 30, 0, 100),
                strength: normal(mean, 30, 0, 100),
                wrist: normal(mean, 30, 0, 100)
              };
              return attributes;
            }
          }
        }, {
          key: "generateContract",
          value: function generateContract(type) {
            if (type === 'start') {
              var contract = this.desiredContract();

              if (this.age > 20 && this.overall() >= 76) {
                var yearChange = this.seedRnd(0, 2, 2);
                contract.years += yearChange;

                if (contract.years < 1 || contract.years > 8) {
                  contract.years -= yearChange;
                }

                var capChange = this.seedRnd(-20, 20, 1) / 10;
                contract.cap += capChange;

                if (contract.cap < 1.25 || contract.cap > 15) {
                  contract.cap -= capChange;
                }

                contract.cap = parseFloat(contract.cap.toFixed(2));
                return contract;
              } else {
                return contract;
              }
            } else if (type === 'prospect' || type === 'free agent' || type === 'depth') {
              return {
                cap: 0,
                years: 0
              };
            }
          }
        }, {
          key: "generateCountry",
          value: function generateCountry(type) {
            if (type === 'start' || type === 'free agent' || type === 'depth') {
              var country = ['Canada', 'Russia', 'Ukraine', 'Latvia', 'Romania', 'Belarus', 'Czech', 'Slovakia', 'France', 'United Kingdom', 'Germany', 'Italy', 'Switzerland', 'Austria', 'Croatia', 'Slovenia', 'Japan', 'Congo', 'Australia', 'Chile', 'Argentina', 'Hong Kong', 'South Korea', 'Sweden', 'Norway', 'Finland', 'Denamrk', 'United States'];
              var choice = country[rnd(0, country.length - 1)];
              return choice;
            } else if (type === 'prospect') {
              var regions = {
                canada: ['Canada'],
                easternEurope: ['Russia', 'Ukraine', 'Latvia', 'Romania', 'Belarus', 'Czech', 'Slovakia'],
                europe: ['France', 'United Kingdom', 'Germany', 'Italy', 'Switzerland', 'Austria', 'Croatia', 'Slovenia'],
                rest: ['Japan', 'Congo', 'Australia', 'Chile', 'Argentina', 'Hong Kong', 'South Korea'],
                scandanavia: ['Sweden', 'Norway', 'Finland', 'Denmark'],
                states: ['United States']
              };
              var choice = regions[this.team][rnd(0, regions[this.team].length - 1)];
              return choice;
            }
          }
        }, {
          key: "generateName",
          value: function generateName() {
            var firstName = ["Jimmy", "Jori", "Michael", "Scott", "Ron", "Chris", "Adam", "Brooks", "Daniel", "Curtis", "Tucker", "Justin", "Niklas", "David", "Dale", "Anders", "TJ", "Gustav", "Derek", "Matt", "Paul", "Greg", "Eric", "Thomas", "Ryan", "Braydon", "Dion", "Jeff", "Dustin", "Brent", "Steve", "Zach", "Eric", "Ryan", "Matt", "Ryan", "Brian", "Jared", "Mark", "Patrick", "Dominic", "Loui", "Marcus", "Tage", "Brad", "Lance", "Patrice", "Rasmus", "Zac", "Shea", "Tommy", "Travis", "Zach", "Torey", "Andrei", "Denis", "Matt", "Christian", "David", "Matt", "J.T.", "Matt", "Dominik", "Christian", "Luke", "Troy", "Yanni", "Shane", "Zach", "Bobby", "Ryan", "Alex", "Morgan", "Hampus", "Nail", "Matt", "Pontus", "Phillip", "Jordie", "Sami", "Kyle", "Brady", "Stefan", "Tanner", "Scott", "Mark", "Olli", "Mike", "Jordan", "Zemgus", "Cody", "Tom", "Tomas", "Teuvo", "Derrick", "Jacob", "Slater", "Filip", "Radek", "Patrick", "Matt", "Colton", "Brendan", "Oskar", "Brad", "Esa", "Marc", "Chandler", "Shayne", "Devin", "Jujhar", "Adam", "Jimmy", "Nate", "Jordan", "Boo", "Damon", "Martin", "Colton", "Jake", "Mike", "Brock", "Micheal", "Joe", "Connor", "Kyle", "Charles", "Dominic", "Trevor", "Taylor", "Jaccob", "Andreas", "Patrick", "Gemel", "Brett", "Jake", "Kevin", "Toby", "Cedric", "Dustin", "Erik", "Carl", "Danny", "Paul", "Ryan", "Vinnie", "Matt", "Tanner", "Jared", "Antoine", "David", "Christoph", "Jake", "Joseph", "Connor", "Ben", "Alexander", "Sven", "Steven", "Jonathan", "Jaycob", "Adam", "Christian", "Joakim", "Brandon", "Matt", "Nicolas", "Steven", "Liam", "Keegan", "Kurtis", "Victor", "Blake", "Ashton", "Logan", "Alexander", "Calle", "Ethan", "Mark", "Mark", "Andrej", "Noah", "Jayson", "Marco", "Daniel", "Henrik", "Tyler", "Josh", "Andrew", "Tanner", "David", "Anthony", "Brent", "Johnny", "Jordan", "Marcus", "Kyle", "Nick", "Landon", "Ryan", "Josh", "Kyle", "Alex", "Jakob", "Tim", "John", "Danny", "Marian", "Evander", "Brayden", "Cam", "Casey", "Magnus", "Ryan", "Calvin", "Zack", "Peter", "Kevin", "Nick", "Corey", "Chris", "Jacob", "John", "Brayden", "Reilly", "Carter", "Tomas", "Kalle", "Kevin", "Chad", "Brandon", "Dmitry", "Paul", "Brandon", "Brian", "Richard", "Luke", "Matthew", "Marcus", "Auston", "Matt", "Jordan", "Craig", "Chris", "Charlie", "Casey", "David", "Nicolas", "Cody", "Alex", "Michael", "Patrik", "Kevin", "Clayton", "Jesse", "Zdeno", "Gabriel", "Justin", "Wade", "Gabriel", "Logan", "Anton", "Tyson", "Janne", "Byron", "Ben", "Victor", "Markus", "Erik", "John", "Evgeni", "Austin", "MacKenzie", "Samuel", "Pierre-Luc", "Tyler", "Will", "Henrik", "Joel", "Alex", "Jesper", "Andrew", "Blake", "Dennis", "Carson", "Drew", "Darren", "Nick", "Jordan", "Vladimir", "Ben", "Travis", "Jonny", "Mike", "Jake", "Nic", "Hudson", "Troy", "Tyrell", "John", "Pavel", "Blake", "Mattias", "Anthony", "Nikita", "Lee", "Brandon", "Anton", "Oliver", "Drake", "Alex", "David", "Miles", "Nick", "Justin", "Andrew", "Ben", "Michal", "Yohann", "Ryan", "Alexei", "Andre", "Michael", "Alexander", "Marko", "Morgan", "Jason", "Ryan", "Ian", "Chris", "Adam", "Jacob", "J.T.", "Valentin", "Laurent", "Remi", "Robert", "Steven", "Nic", "Gustav", "Dillon", "Carl", "Justin", "Madison", "Artturi", "Marc", "William", "Tyler", "Torrey", "Ryan", "Mike", "Brett", "Kris", "Nicholas", "Nathan", "Aleksander", "Jonathan", "Seth", "Elias", "Sean", "Darnell", "Rasmus", "Bo", "Samuel", "Max", "Josh", "Alexander", "Ryan", "Nikita", "Curtis", "Mirco", "Radko", "Anthony", "Frederik", "Brad", "Nick", "Jean-Sebastien", "Ross", "Derek", "Colby", "Taylor", "Dylan", "Will", "Dakota", "Erik", "Kyle", "Blake", "Trevor", "Josh", "Andrew", "Leo", "Jamie", "Brenden", "Eric", "Giovanni", "Milan", "Troy", "Mikael", "Eeli", "Maxim", "Matt", "Chris", "Curtis", "Matt", "Josh", "Bryan", "Ryan", "Adam", "Cal", "Dmitry", "Vadim", "James", "Kerby", "Claude", "Mike", "Alex", "Daniel", "Jordan", "Matt", "Peter", "Adam", "Tyler", "Francois", "Michael", "Brian", "Phil", "Jason", "Jannik", "Mikko", "Korbinian", "Dan", "Ales", "Nicklas", "Michael", "Nate", "Artem", "Shawn", "Matt", "Nikolay", "Andrew", "Mikhail", "Michael", "Chris", "Filip", "Jason", "Jonathan", "Artemi", "Kris", "Victor", "Tomas", "Mathieu", "Dalton", "Alexander", "Kris", "Patrick", "Christopher", "Mats", "Vladislav", "Roman", "Calle", "Oscar", "Martin", "Justin", "David", "Jason", "Tyler", "Ryan", "Johan", "Mark", "Stephen", "Greg", "Connor", "Jordan", "Michael", "Markus", "Kevin", "Evgeny", "Charlie", "Patrik", "Jon", "Tyler", "Cody", "Brock", "Alexander", "Devante", "Mike", "Nick", "Beau", "Derek", "Kevin", "Cam", "Paul", "Austin", "Jaden", "Sidney", "Riley", "Jack", "Benoit", "Andrej", "Chris", "Anze", "Jussi", "Brooks", "Jeff", "Zach", "Martin", "Alexander", "Deryk", "Erik", "Conor", "Brett", "Ryan", "T.J.", "Brendan", "Mark", "Trevor", "Ryan", "Nino", "Christian", "Jordan", "Marc-Edouard", "Taylor", "Joakim", "Michael", "Johnny", "Bryan", "Justin", "Adam", "Joonas", "Brendan", "Keith", "Tom", "Marcus", "Valtteri", "Cody", "Vladimir", "Tim", "Kenny", "Robert", "Zach", "Daniel", "Jesper", "Chris", "Oliver", "Jared", "Tom", "Niklas", "Garnet", "Anthony", "Brandon", "Frederick", "Vinni", "Jaromir", "Melker", "Freddie", "Kevin", "Kailer", "Pierre-Edouard", "Tomas", "Aaron", "Sam", "Leon", "Sam", "Michael", "Jake", "Haydn", "William", "Nikolaj", "Nick", "Kevin", "Brendan", "Jakub", "Julius", "Dylan", "Sonny", "Nathan", "Alex", "Zach", "Casey", "Kasperi", "John", "Cal", "David", "Nikita", "Nikolay", "Joshua", "Adrian", "John", "Brendan", "Ivan", "Owen", "Marcus", "Andreas", "Vladislav", "Roland", "Nathan", "Brandon", "Ryan", "Christian", "Martin", "Dominic", "Marek", "Warren", "Brett", "Mark", "Louie", "Anton", "Michael", "Antoine", "Lias", "Lucas", "Ben", "Erik", "Patric", "Justin", "Viktor", "Danton", "Nolan", "Gustav", "Tyson", "Alex", "Oskar", "Andrew", "Dennis", "Anton", "Anders", "Alexander", "Alex", "Karl", "Justin", "Jamie", "Jakub", "David", "Neal", "Oscar", "Dan", "Sammy", "Nick", "Dylan", "Ian", "Andreas", "Christopher", "Philip", "Henrik", "Jim", "Justin", "Jan", "Darren", "Kevin", "Shea", "Kyle", "Patrick", "Ondrej", "James", "Paul", "Sam", "Matthew", "Logan", "P.K.", "Chris", "Anthony", "Riley", "Thomas", "Jeff", "Kyle", "Brian", "Paul", "Sebastian", "Joe", "Brad", "Brendan", "Brandon", "Mattias", "Colton", "Tony", "David", "Luke", "Nick", "Chris", "Dryden", "Sami", "Taylor", "Carl", "Matt", "Mario", "Yannick", "Rick", "Patrick", "Kevan", "Derek", "Cory", "Evgenii", "Mikael", "Ryan", "Max", "Brian", "Jakub", "Jake", "Alec", "Mark", "Jack", "Carl", "Spencer", "Lars", "Wayne", "Scottie", "Trevor", "Nick", "Nazem", "Kyle", "Victor", "Jason", "Henrik", "Patrik", "Micheal", "Alex", "Matthew", "Frans", "Ondrej", "Scott", "Jay", "Zack", "Trevor", "Frank", "Rob", "Matt", "Lukas", "Josh", "Danick", "Frank", "Chase", "Max", "Nikita", "Josh", "Jakob", "Travis", "Dylan", "Alex", "Iiro", "Derick", "Jay", "Tomas", "Tyler", "Johnny", "Noah", "Rinat", "Kyle", "Radim", "Colin", "Pavel", "Connor", "Jack", "Tobias", "Vince", "Travis", "Jordan", "Timo", "Fredrik", "Blake", "Nick", "A.J.", "Sean", "Brendan", "Joe", "Sebastian", "Andrew", "Evgeny", "Christian", "Shane", "Vincent", "Travis", "Dylan", "Nick", "Brandon", "Brock", "Mathew", "Nicholas", "Joel", "Daniel", "Klas", "Andy", "Nick", "Andy", "Alan", "Jack", "Zach", "Nicolas", "Kyle", "Ryan", "Daniel", "Jean-Gabriel", "Thomas", "Mike", "Reid", "Duncan", "Lawson", "Ty", "Rocco", "Scott", "Tomas", "Adam", "Boone", "Mitchell", "Dmitrij", "Victor", "Brandon", "Brett", "Filip", "Joel", "Matt", "Xavier", "Zack", "Joel", "Miikka", "William", "Scott", "Ryan", "Ivan", "Nikita", "Ryan", "Gabriel", "Jonathan", "Adam", "Gabriel", "Mika", "Mark", "Sean", "Dougie", "Jonas", "Duncan", "Ryan", "Sven", "Jamie", "J.T.", "Joel", "Nathan", "Anthony", "Oscar", "Connor", "Stefan", "Joe", "Andy", "Phillip", "Tanner", "Rickard", "Jason", "Markus", "Evan", "Seth", "Mark", "Alexandre", "Brayden", "Andreas", "Dean", "Noel", "Nico", "Colin", "Derek", "Jonathan", "Jason", "Nate", "Andreas", "Tyler", "Drew", "Steven", "Alex", "Zach", "Luke", "Colin", "Mikkel", "Josh", "Tyler", "Barclay", "Erik", "Luca", "Mikko", "Jake", "Matt", "Michael", "Jordan", "Tyler", "John", "Roman", "Justin", "Aaron", "Zac", "Travis", "Derek", "Mitch", "Eric"];
            var lastName = ["Hayes", "Lehtera", "Stone", "Hartnell", "Hainsey", "Kunitz", "Henrique", "Orpik", "Brickley", "McKenzie", "Poolman", "Williams", "Kronwall", "Warsofsky", "Weise", "Lee", "Brodie", "Nyquist", "Grant", "Calvert", "Martin", "Pateryn", "Staal", "Vanek", "Suter", "Coburn", "Phaneuf", "Carter", "Brown", "Seabrook", "Bernier", "Parise", "Fehr", "Getzlaf", "Martin", "Kesler", "Boyle", "Spurgeon", "Barberio", "Eaves", "Moore", "Eriksson", "Kruger", "Thompson", "Hunt", "Bouma", "Bergeron", "Andersson", "Rinaldo", "Weber", "Wingels", "Sanheim", "Redmond", "Krug", "Mironov", "Malgin", "Bartkowski", "Wolanin", "Backes", "Hendricks", "Brown", "Tennyson", "Simon", "Jaros", "Glendening", "Terry", "Gourde", "Gersich", "Whitecloud", "Ryan", "Murray", "Galchenyuk", "Rielly", "Lindholm", "Yakupov", "Dumba", "Aberg", "Di Giuseppe", "Benn", "Niku", "Quincey", "Skjei", "Matteau", "Pearson", "Laughton", "Jankowski", "Maatta", "Matheson", "Schmaltz", "Girgensons", "Ceci", "Wilson", "Hertl", "Teravainen", "Pouliot", "Trouba", "Koekkoek", "Forsberg", "Faksa", "Sieloff", "Grzelcyk", "Parayko", "Leipsic", "Sundqvist", "Richardson", "Lindell", "Methot", "Stephenson", "Gostisbehere", "Shore", "Khaira", "Pelech", "Vesey", "Thompson", "Martinook", "Nieves", "Severson", "Frk", "Sissons", "McCabe", "Hoffman", "McGinn", "Ferland", "Pavelski", "Carrick", "Brodziak", "Hudon", "Toninato", "Carrick", "Leier", "Slavin", "Athanasiou", "Marleau", "Smith", "Kulak", "Guentzel", "Roy", "Enstrom", "Paquette", "Byfuglien", "Gustafsson", "Soderberg", "O'Regan", "LaDue", "Reaves", "Hinostroza", "Moulson", "Glass", "McCann", "Vermette", "Booth", "Bertschy", "Dotchin", "Blandisi", "Brown", "Hutton", "Kerfoot", "Andrighetto", "Kampfer", "Ericsson", "Megna", "Lowry", "Djoos", "Ryan", "Dubinsky", "Cullen", "Kerdiles", "Fogarty", "O'Brien", "Lowe", "MacDermid", "Ejdsell", "Coleman", "Sautner", "Shaw", "Steen", "Rosen", "Bear", "Giordano", "Borowiecki", "Sekera", "Juulsen", "Megna", "Scandella", "Sedin", "Sedin", "Bozak", "Leivo", "Mangiapane", "Fritz", "Desharnais", "Beauvillier", "Burns", "Boychuk", "Schroeder", "Johansson", "Palmieri", "Lappin", "Ferraro", "O'Reilly", "Gorges", "Clifford", "Chiasson", "Silfverberg", "Schaller", "Tavares", "DeKeyser", "Gaborik", "Kane", "Schenn", "Atkinson", "Nelson", "Paajarvi", "Ellis", "de Haan", "Kassian", "Cehlarik", "Labanc", "Leddy", "Perry", "Kreider", "Josefson", "Moore", "McNabb", "Smith", "Rowney", "Tatar", "Kossila", "Rooney", "Ruhwedel", "Tanev", "Orlov", "Carey", "Pirri", "Dumoulin", "Panik", "Witkowski", "Tkachuk", "Foligno", "Matthews", "Duchene", "Szwarz", "Smith", "Wideman", "McAvoy", "Cizikas", "Savard", "Deslauriers", "Eakin", "DeBrincat", "Raffl", "Laine", "Connauton", "Keller", "Puljujarvi", "Chara", "Dumont", "Faulk", "Megan", "Bourque", "Brown", "Blidh", "Jost", "Kuokkanen", "Froese", "Chiarot", "Mete", "Granlund", "Haula", "Gilmour", "Malkin", "Czarnik", "Weegar", "Girard", "Dubois", "Motte", "Butcher", "Borgstrom", "Hanley", "Ovechkin", "Bratt", "Ladd", "Wheeler", "Seidenberg", "Soucy", "Stafford", "Archibald", "Jensen", "Nolan", "Tarasenko", "Sexton", "Zajac", "Brodzinski", "Green", "DeBrusk", "Dowd", "Fasching", "Stecher", "Goulbourne", "Hayden", "Buchnevich", "Comeau", "Janmark", "Duclair", "Zaitsev", "Stempniak", "Manning", "Slepyshev", "Bjorkstrand", "Caggiula", "Goligoski", "Krejci", "Wood", "Paul", "Auger", "Copp", "Harpur", "Kempny", "Auvitu", "Strome", "Emelin", "Burakovsky", "McCarron", "Edler", "Dano", "Klimchuk", "Dickinson", "Hartman", "McCoshen", "Bigras", "Erne", "de la Rose", "Compher", "Zykov", "Dauphin", "Elie", "Hagg", "Santini", "Petan", "Olofsson", "Heatherington", "Dahlstrom", "Bailey", "Bowey", "Lehkonen", "Staal", "Carrier", "Bertuzzi", "Mitchell", "Callahan", "Liambas", "Pesce", "Versteeg", "Baptiste", "MacKinnon", "Barkov", "Drouin", "Jones", "Lindholm", "Monahan", "Nurse", "Ristolainen", "Horvat", "Morin", "Domi", "Morrissey", "Wennberg", "Pulock", "Zadorov", "Lazar", "Mueller", "Gudas", "Mantha", "Gauthier", "Marchand", "Foligno", "Dea", "Johnston", "Dorsett", "Cave", "Hall", "Gambrell", "O'Neill", "Mermis", "Johnson", "Okposo", "Hillman", "Lewis", "Anderson", "Cogliano", "Komarov", "McGinn", "Dillon", "Gryba", "Fiore", "Lucic", "Brouwer", "Granlund", "Tolvanen", "Mamin", "Hunwick", "Stewart", "Valk", "Beleskey", "Jooris", "Little", "Lomberg", "Gaudette", "Clutterbuck", "Kulikov", "Shipachyov", "Neal", "Rychel", "Giroux", "Fisher", "Biega", "Winnik", "Staal", "Niskanen", "Holland", "Cracknell", "Seguin", "Beauchemin", "Grabner", "Gionta", "Kessel", "Spezza", "Hansen", "Koivu", "Holzer", "Hamhuis", "Hemsky", "Backstrom", "Frolik", "Prosser", "Anisimov", "Matthias", "Irwin", "Kulemin", "MacDonald", "Sergachev", "Cammalleri", "Thorburn", "Chytil", "Pominville", "Toews", "Panarin", "Letang", "Antipin", "Plekanec", "Perreault", "Prout", "Radulov", "Russell", "Sharp", "Tanev", "Zuccarello", "Namestnikov", "Polak", "Jarnkrok", "Lindberg", "Marincin", "Holl", "Schlemko", "Zucker", "Toffoli", "Spooner", "Larsson", "Alt", "Johns", "McKegg", "Brickley", "Weal", "Bournival", "Nutivaara", "Bieksa", "Kuznetsov", "Coyle", "Nemeth", "Merrill", "Pitlick", "McLeod", "Nelson", "Petrovic", "Smith-Pelly", "Blunden", "Bjugstad", "Bennett", "Forbort", "Hayes", "Fowler", "Stastny", "Watson", "Schwartz", "Crosby", "Sheahan", "Johnson", "Pouliot", "Sustr", "Wagner", "Kopitar", "Jokinen", "Laich", "Skinner", "Hyman", "Hanzal", "Burmistrov", "Engelland", "Gudbranson", "Sheary", "Connolly", "Johansen", "Oshie", "Gaunce", "Pysyk", "van Riemsdyk", "Carpenter", "Niederreiter", "Folin", "Oesterle", "Vlasic", "Chorney", "Nordstrom", "Chaput", "Oduya", "Rust", "Abdelkader", "McQuaid", "Donskoi", "Gallagher", "Yandle", "Kuhnhackl", "Sorensen", "Filppula", "Franson", "Sobotka", "Heed", "Agostino", "Bortuzzo", "Aston-Reese", "Carr", "Fast", "Butler", "Ekman-Larsson", "Boll", "Pyatt", "Hjalmarsson", "Hathaway", "Bitetto", "Davidson", "Gaudreau", "Lettieri", "Jagr", "Karlsson", "Hamilton", "Gravel", "Yamamoto", "Bellemare", "Nosek", "Ekblad", "Reinhart", "Draisaitl", "Bennett", "Dal Colle", "Virtanen", "Fleury", "Nylander", "Ehlers", "Ritchie", "Fiala", "Perlini", "Vrana", "Honka", "Larkin", "Milano", "Gerbe", "Tuch", "Trotman", "Mittelstadt", "Kapanen", "Klingberg", "O'Reilly", "Pastrnak", "Scherbak", "Goldobin", "Ho-Sang", "Kempe", "Quenneville", "Lemieux", "Barbashev", "Tippett", "Pettersson", "Englund", "Kamenev", "McKeown", "Walker", "Montour", "Donato", "Dvorak", "Necas", "Turgeon", "Hrivik", "Foegele", "Lernout", "Letestu", "Belpedio", "Stralman", "Amadio", "Roussel", "Andersson", "Wallmark", "Lovejoy", "Burgdoerfer", "Hornqvist", "Kloos", "Arvidsson", "Heinen", "Patrick", "Forsling", "Barrie", "Iafallo", "Lindblom", "Crescenzi", "Rasmussen", "Lindholm", "Bjork", "Nylander", "Killorn", "Alzner", "Falk", "Benn", "Jerabek", "Kampf", "Pionk", "Fantenberg", "Girardi", "Blais", "Bonino", "Sikura", "Cole", "Borgman", "DiDomenico", "Holm", "Haapala", "O'Brien", "Braun", "Rutta", "Helm", "Shattenkirk", "Theodore", "Criscuolo", "Maroon", "Kase", "van Riemsdyk", "Byron", "Gagner", "Highmore", "Couture", "Subban", "Tierney", "Peluso", "Nash", "Hickey", "Petry", "Turris", "Lashoff", "Postma", "Aho", "Hicketts", "Malone", "Smith", "Sutter", "Ekholm", "Sceviour", "DeAngelo", "Perron", "Kunin", "Schmaltz", "Kelly", "Hunt", "Vatanen", "Fedun", "Gunnarsson", "Read", "Kempe", "Weber", "Nash", "Kane", "Miller", "MacKenzie", "Conacher", "Dadonov", "Backlund", "McDonagh", "Pacioretty", "Gibbons", "Voracek", "Muzzin", "Martinez", "Stone", "Rodewald", "Hagelin", "Foo", "Eller", "Simmonds", "Upshall", "Daley", "Holden", "Kadri", "Capobianco", "Hedman", "Demers", "Zetterberg", "Berglund", "Haley", "Broadhurst", "Peca", "Nielsen", "Palat", "Wilson", "Bouwmeester", "Smith", "Murphy", "Corrado", "O'Gara", "Stajan", "Sedlak", "Manson", "Martel", "Vatrano", "Balisy", "McCormick", "Soshnikov", "Archibald", "Chychrun", "Boyd", "DeMelo", "Formenton", "Pakarinen", "Brassard", "Beagle", "Hyka", "Graovac", "Gaudreau", "Hanifin", "Valiev", "Connor", "Vrbata", "White", "Zacha", "McDavid", "Eichel", "Rieder", "Dunn", "Dermott", "Greenway", "Meier", "Claesson", "Pietila", "Seeler", "Greer", "Kuraly", "Guhle", "Thornton", "Aho", "Shaw", "Svechnikov", "Fischer", "Prince", "Trocheck", "Konecny", "Strome", "Cousins", "Carlo", "Boeser", "Barzal", "Merkley", "Ward", "Catenacci", "Dahlbeck", "Andreoff", "Shore", "Welinski", "Quine", "Roslovic", "Werenski", "Roy", "Rau", "Dzingel", "Sprong", "Pageau", "Chabot", "Reilly", "Boucher", "Keith", "Crouse", "Rattie", "Grimaldi", "Mayfield", "Jurco", "Clendening", "Jenner", "Marner", "Jaskin", "Rask", "Saad", "Ritchie", "Chlapik", "Edmundson", "Nieto", "Ouellet", "Mitchell", "Eriksson Ek", "Salomaki", "Karlsson", "Harrington", "Sproul", "Provorov", "Kucherov", "Nugent-Hopkins", "Landeskog", "Huberdeau", "Larsson", "Carlsson", "Zibanejad", "Scheifele", "Couturier", "Hamilton", "Brodin", "Siemens", "Murphy", "Baertschi", "Oleksiak", "Miller", "Armia", "Beaulieu", "Cirelli", "Klefbom", "Murphy", "Noesen", "Morrow", "Greene", "Danault", "Kero", "Rakell", "Chimera", "Hannikainen", "Rodrigues", "Griffith", "Streit", "Burrows", "Point", "Martinsen", "Kukan", "Acciari", "Hischier", "Miller", "Ryan", "Marchessault", "Garrison", "Schmidt", "Johnsson", "Johnson", "Doughty", "Stamkos", "Pietrangelo", "Bogosian", "Schenn", "Wilson", "Boedker", "Bailey", "Myers", "Goodrow", "Karlsson", "Sbisa", "Rantanen", "Gardiner", "Benning", "Del Zotto", "Eberle", "Ennis", "Carlson", "Josi", "Schultz", "Ness", "Dalpe", "Hamonic", "Stepan", "Reinke", "Robinson"];
            var first = firstName[rnd(0, firstName.length - 1)];
            var last = lastName[rnd(0, lastName.length - 1)];
            return first + ' ' + last;
          }
        }, {
          key: "generatePosition",
          value: function generatePosition(pos) {
            if (pos === 'any') {
              if (Math.random() < 0.60) {
                return ['lw', 'c', 'rw'][rnd(0, 2)];
              } else {
                return ['ld', 'rd'][rnd(0, 1)];
              }
            } else {
              return pos;
            }
          }
        }, {
          key: "generatePotential",
          value: function generatePotential(type) {
            var position = this.position;

            function intToChance(_int) {
              if (_int >= 80) {
                return 'A';
              } else if (_int >= 70) {
                return 'B';
              } else if (_int >= 60) {
                return 'C';
              } else if (_int >= 50) {
                return 'D';
              } else if (_int >= 30) {
                return 'E';
              } else {
                return 'F';
              }
            }

            function intToCeiling(_int2) {
              if (position === 'g') {
                if (_int2 > 80) {
                  return 'Starter';
                } else if (_int2 > 70) {
                  return 'Backup';
                } else {
                  return 'Replacement';
                }
              } else if (position === 'ld' | position === 'rd') {
                if (_int2 > 84) {
                  return '1st Pair';
                } else if (_int2 > 78) {
                  return '2nd Pair';
                } else if (_int2 > 74) {
                  return '3rd Pair';
                } else {
                  return 'Replacement';
                }
              } else if (position === 'lw' | position === 'c' | position === 'rw') {
                if (_int2 > 84) {
                  return 'Top 3';
                } else if (_int2 > 78) {
                  return 'Top 6';
                } else if (_int2 > 75) {
                  return 'Top 9';
                } else if (_int2 > 72) {
                  return 'Top 12';
                } else {
                  return 'Replacement';
                }
              }
            }

            var potential = {
              ceiling: {
                "int": 0,
                name: '',
                shownInt: 0,
                shownName: ''
              },
              chance: {
                "int": 0,
                name: '',
                shownInt: 0,
                shownName: ''
              },
              certainty: {
                "int": 100,
                name: 'A'
              }
            };
            var overall = this.overall();

            if (type === 'start' || type === 'free agent') {
              if (this.age >= 33) {
                potential.ceiling["int"] = overall;
                potential.ceiling.name = intToCeiling(overall);
                potential.chance["int"] = 100;
                potential.chance.name = 'A';
              } else if (this.age >= 29) {
                potential.ceiling["int"] = overall + rnd(0, 1);
                potential.ceiling.name = intToCeiling(overall + potential.ceiling["int"]);
                potential.chance["int"] = rnd(90, 100);
                potential.chance.name = intToChance(potential.chance["int"]);
              } else if (this.age >= 26) {
                potential.ceiling["int"] = overall + rnd(0, 5);
                potential.ceiling.name = intToCeiling(overall + potential.ceiling["int"]);
                potential.chance["int"] = rnd(80, 100);
                potential.chance.name = intToChance(potential.chance["int"]);
              } else if (this.age >= 23) {
                potential.ceiling["int"] = overall + rnd(0, 12);
                potential.ceiling.name = intToCeiling(overall + potential.ceiling["int"]);
                potential.chance["int"] = rnd(50, 100);
                potential.chance.name = intToChance(potential.chance["int"]);
              } else if (this.age >= 20) {
                potential.ceiling["int"] = overall + rnd(0, 15);
                potential.ceiling.name = intToCeiling(overall + potential.ceiling["int"]);
                potential.chance["int"] = rnd(30, 100);
                potential.chance.name = intToChance(potential.chance["int"]);
              } else if (this.age >= 18) {
                potential.ceiling["int"] = overall + rnd(0, 25);
                potential.ceiling.name = intToCeiling(overall + potential.ceiling["int"]);
                potential.chance["int"] = rnd(15, 100);
                potential.chance.name = intToChance(potential.chance["int"]);
              }
            } else if (type === 'prospect') {
              potential.ceiling["int"] = overall + rnd(0, 25);

              if (Math.random() > 0.8) {
                potential.ceiling["int"] += rnd(0, 20);
              }

              potential.ceiling.name = intToCeiling(overall + potential.ceiling["int"]);
              potential.chance["int"] = rnd(10, 70);

              if (Math.random() > 0.7) {
                potential.chance["int"] += rnd(0, 30);
              }

              potential.chance.name = intToChance(potential.chance["int"]);
            }

            if (potential.ceiling["int"] > 100) {
              potential.ceiling["int"] = 100;
            }

            if (potential.chance["int"] > 100) {
              potential.chance["int"] = 100;
            }

            return potential;
          }
        }, {
          key: "generateProgression",
          value: function generateProgression() {
            if (this.position === 'g') {
              var attributes = {
                puck: 0,
                glove: 0,
                blocker: 0,
                pads: 0,
                rebounds: 0,
                reflex: 0,
                strength: 0,
                stamina: 0,
                iq: 0,
                work: 0,
                confidence: 0
              };
            } else {
              var attributes = {
                blocking: 0,
                diq: 0,
                discipline: 0,
                faceOff: 0,
                handEye: 0,
                hands: 0,
                hitting: 0,
                hustle: 0,
                oiq: 0,
                passing: 0,
                skating: 0,
                slap: 0,
                stamina: 0,
                stick: 0,
                strength: 0,
                wrist: 0
              };
            }

            return attributes;
          }
        }, {
          key: "generateStats",
          value: function generateStats() {
            if (this.position === 'g') {
              return {
                gamesPlayed: 0,
                saves: 0,
                goalsAgainst: 0,
                savePctg: 0,
                gaa: 0,
                toi: 0
              };
            } else {
              return {
                gamesPlayed: 0,
                points: 0,
                goals: 0,
                assists: 0,
                toi: 0,
                pim: 0,
                shots: 0
              };
            }
          }
        }, {
          key: "name",
          value: function name() {
            var name = this.fullName.split(' ');
            var abb = name[0].slice(0, 1) + '. ' + name[1];
            var first = name[0];
            var last = name[1];
            return {
              abb: abb,
              first: first,
              last: last
            };
          }
        }, {
          key: "overall",
          value: function overall() {
            function weighter(valueOne, weightOne, valueTwo, weightTwo) {
              return Math.round(valueOne * weightOne + valueTwo * weightTwo);
            }

            var overall = 0;
            var scores = this.categoryScores();

            if (this.position === 'g') {
              overall = scores.defence;
            } else if (this.position === 'c') {
              overall = weighter(scores.offence, 0.7, scores.defence, 0.3);
            } else if (['lw', 'rw'].includes(this.position)) {
              overall = weighter(scores.offence, 0.8, scores.defence, 0.2);
            } else if (['ld', 'rd'].includes(this.position)) {
              overall = weighter(scores.offence, 0.2, scores.defence, 0.8);
            }

            if (overall > 100) {
              overall = 100;
            }

            return overall;
          }
        }, {
          key: "playerId",
          value: function playerId() {
            var dupe = true;
            var id = 0;

            while (dupe) {
              id = rnd(10, 9999997);

              if (typeof Vue.prototype.$players[id] === 'undefined') {
                break;
              }
            }

            return id;
          }
        }, {
          key: "positionStrength",
          value: function positionStrength() {
            var bestPosition = this.position;

            if (bestPosition === 'lw') {
              return {
                'lw': 1,
                'c': 0.8,
                'rw': 0.9,
                'ld': 0.4,
                'rd': 0.3
              };
            } else if (bestPosition === 'c') {
              return {
                'lw': 0.9,
                'c': 1,
                'rw': 0.9,
                'ld': 0.4,
                'rd': 0.4
              };
            } else if (bestPosition === 'rw') {
              return {
                'lw': 0.9,
                'c': 0.8,
                'rw': 1,
                'ld': 0.3,
                'rd': 0.4
              };
            } else if (bestPosition === 'ld') {
              return {
                'lw': 0.4,
                'c': 0.4,
                'rw': 0.4,
                'ld': 1,
                'rd': 0.8
              };
            } else if (bestPosition === 'rd') {
              return {
                'lw': 0.4,
                'c': 0.4,
                'rw': 0.4,
                'ld': 0.8,
                'rd': 1
              };
            }
          }
        }, {
          key: "release",
          value: function release() {
            this.contract = {
              cap: 0,
              years: 0
            };
            this.newContract = {};
            var id = this.id;

            if (this.league === 'juniors') {
              Vue.prototype.$teams.onehl[this.team].juniors = Vue.prototype.$teams.onehl[this.team].juniors.filter(function (pid) {
                return pid !== id;
              });
            } else {
              Vue.prototype.$teams[this.league][this.team].players = Vue.prototype.$teams[this.league][this.team].players.filter(function (pid) {
                return pid !== id;
              });
            }

            this.removeFromLines(this.league, this.team);
            Vue.prototype.$players.freeAgents.push(this.id);
            this.team = 0;
            this.league = 'freeAgents';
          }
        }, {
          key: "removeFromLines",
          value: function removeFromLines(oldLeague, oldTeam) {
            try {
              if (!['juniors', 'freeAgents', 'prospects'].includes(oldLeague)) {
                var lines = Vue.prototype.$teams[oldLeague][oldTeam].lines;

                for (var strength in lines) {
                  for (var position in lines[strength]) {
                    for (var p in lines[strength][position]) {
                      if (lines[strength][position][p] === this.id) {
                        lines[strength][position][p] = 0;
                      }
                    }
                  }
                }

                var goalieIndex = lines.g.indexOf(this.id);

                if (goalieIndex !== -1) {
                  lines.g[goalieIndex] = 0;
                }
              }
            } catch (_unused4) {//starting a new game
            }
          }
        }, {
          key: "retire",
          value: function retire() {
            var id = this.id;

            if (this.league === 'prospects') {
              Vue.prototype.$teams.prospects[this.team].players = Vue.prototype.$teams.prospects[this.team].players.filter(function (pid) {
                return pid != id;
              });
            } else if (this.league !== 'freeAgents') {
              Vue.prototype.$teams[this.league][this.team].players = Vue.prototype.$teams[this.league][this.team].players.filter(function (pid) {
                return pid != id;
              });
            }

            for (var league in {
              onehl: 0,
              twohl: 0,
              thrhl: 0,
              juniors: 0,
              prospects: 0,
              freeAgents: 0
            }) {
              Vue.prototype.$players[league] = Vue.prototype.$players[league].filter(function (pid) {
                return pid != id;
              });
            }

            this.removeFromLines(this.league, this.team);
            delete Vue.prototype.$players[id];
          }
        }, {
          key: "seedRnd",
          value: function seedRnd(low, high, num) {
            //close enough to random
            var num = parseFloat('0.' + Math.sin(seed).toString().slice(num + 4));
            var seed = parseInt(this.id) * parseInt(this.age) * num;
            var random = parseFloat('0.' + Math.sin(seed).toString().slice(5));
            var r = Math.floor(random * (high - low + 1));
            return low + r;
          }
        }, {
          key: "switchTeam",
          value: function switchTeam(team) {
            var _this = this;

            var leagueConvert = {
              1: 'onehl',
              2: 'twohl',
              3: 'thrhl'
            };
            team = team.toString();

            if (this.league === 'prospects') {
              var newTeam = team.split('-')[0];
              var newLeague = 'juniors';
              Vue.prototype.$teams.onehl[newTeam].juniors.push(this.id);
              Vue.prototype.$players.juniors.push(this.id);
              Vue.prototype.$players.prospects = Vue.prototype.$players.prospects.filter(function (id) {
                return id !== _this.id;
              });
            } else if (this.league === 'juniors') {
              var sameTeam = team.toString().slice(1) === this.team.toString().slice(1);

              if (sameTeam) {
                var newTeam = team;
                var newLeague = leagueConvert[team.toString().slice(0, 1)];
                Vue.prototype.$teams.onehl[this.team].juniors = Vue.prototype.$teams.onehl[this.team].juniors.filter(function (id) {
                  return id !== _this.id;
                });
                Vue.prototype.$players.juniors = Vue.prototype.$players.juniors.filter(function (id) {
                  return id !== _this.id;
                });
                Vue.prototype.$players[newLeague].push(this.id);
                Vue.prototype.$teams[newLeague][team].players.push(this.id);
                this.contract = {
                  years: 21 - this.age,
                  cap: 1
                };
              } else {
                var newTeam = '1' + team.slice(1);
                var newLeague = 'juniors';
                Vue.prototype.$teams.onehl[this.team].juniors = Vue.prototype.$teams.onehl[this.team].juniors.filter(function (id) {
                  return id !== _this.id;
                });
                Vue.prototype.$teams.onehl[newTeam].juniors.push(this.id);
              }
            } else if (this.league === 'freeAgents') {
              var newTeam = '3' + team.slice(1, 3);
              var newLeague = 'thrhl';
              Vue.prototype.$teams.thrhl[newTeam].players.push(this.id);
              Vue.prototype.$players.thrhl.push(this.id);
              Vue.prototype.$players.freeAgents = Vue.prototype.$players.freeAgents.filter(function (id) {
                return id !== _this.id;
              });
            } else {
              var newTeam = team;
              var newLeague = leagueConvert[team.toString().slice(0, 1)];
              var oldTeam = this.team;
              var oldLeague = this.league;
              Vue.prototype.$players[oldLeague] = Vue.prototype.$players[oldLeague].filter(function (id) {
                return id !== _this.id;
              });
              Vue.prototype.$players[newLeague].push(this.id);
              Vue.prototype.$teams[oldLeague][oldTeam].players = Vue.prototype.$teams[oldLeague][oldTeam].players.filter(function (id) {
                return id !== _this.id;
              });
              Vue.prototype.$teams[newLeague][newTeam].players.push(this.id);
            } //remove player from old lines


            this.removeFromLines(oldLeague, oldTeam);
            this.league = newLeague;
            this.team = parseInt(newTeam);
          }
        }, {
          key: "teamName",
          value: function teamName() {
            if (this.league === 'freeAgents') {
              return {
                city: 'Free Agency',
                logo: '',
                full: 'Free Agency',
                abb: 'FA'
              };
            } else if (this.league === 'prospects') {
              var cityConvert = {
                canada: 'Canada',
                easternEurope: 'East Europe',
                europe: 'West Europe',
                rest: 'Other',
                scandanavia: 'Scandanavia',
                states: 'United States'
              };
              var abbConvert = {
                canada: 'CAN',
                easternEurope: 'EUE',
                europe: 'EUW',
                rest: 'OTH',
                scandanavia: 'SCN',
                states: 'USA'
              };
              return {
                city: cityConvert[this.team],
                logo: 'Prospects',
                full: cityConvert[this.team] + ' Prospects',
                abb: abbConvert[this.team]
              };
            } else {
              if (this.league === 'juniors') {
                var teamName = Vue.prototype.$teams.onehl[this.team].name;
                return {
                  city: teamName.city,
                  logo: 'Juniors',
                  full: teamName.city + ' Juniors',
                  abb: 'J' + teamName.abb
                };
              } else {
                //onehl, twohl, thrhl
                return Vue.prototype.$teams[this.league][this.team].name;
              }
            }
          }
        }, {
          key: "tradeValue",
          value: function tradeValue() {
            var overallFactor = Math.pow(this.overall(), 1.5);
            var ageFactor = 1 / (this.age + 28);
            var desiredContract = this.desiredContract();

            if (this.age + desiredContract.years > 33) {
              var yearsFactor = Math.pow(Math.pow(this.age + desiredContract.years - 33, 1.4), -1);
            } else {
              var yearsFactor = 1;
            }

            if (this.contract.cap - desiredContract.cap > 0) {
              var capFactor = 1 + (this.contract.cap - desiredContract.cap) / (8.1 - desiredContract.years);
            } else {
              var capFactor = 1 - (this.contract.cap - desiredContract.cap) / (8.1 - desiredContract.years);
            }

            var finalValue = overallFactor * ageFactor * yearsFactor * Math.pow(capFactor, 2);
            return parseInt(finalValue);
          }
        }]);

        return Player;
      }()
    }; // rnd is pasted so it doesn't have to be imported, the others are not used outside of this file

    function rnd(low, high) {
      //returns a random number between low and high (linear)
      var random = Math.random();
      var r = Math.floor(random * (high - low + 1));
      return low + r;
    }

    function normal(mean, range, min, max) {
      // generates a random number on a close enough to nomral distribution 
      // sd is replaced by range, returns mean +/- range
      range += 1;
      var result = 0;

      for (var n = 0; n < 3; n++) {
        result += Math.random();
      }

      result = result - 1.5;
      result = Math.round(result / 1.5 * range + mean);

      if (result < min) {
        return normal(mean, range, min, max);
      } else if (result > max) {
        return normal(mean, range, min, max);
      } else {
        return result;
      }
    }

    function halfNormal(direction, mean, value) {
      // generate a random number from half of a nomral ditribution
      // the half is decided by direction, returned int can't be past bound
      if (direction === 'left') {
        if (value > mean) {
          return mean - (value - mean);
        } else {
          return value;
        }
      } else if (direction === 'right') {
        if (value < mean) {
          return mean + (mean - value);
        } else {
          return value;
        }
      }
    }
  }, {}],
  3: [function (require, module, exports) {
    module.exports = {
      Team:
      /*#__PURE__*/
      function () {
        function Team(_ref3) {
          var _ref3$id = _ref3.id,
              id = _ref3$id === void 0 ? null : _ref3$id,
              _ref3$league = _ref3.league,
              league = _ref3$league === void 0 ? null : _ref3$league,
              _ref3$load = _ref3.load,
              load = _ref3$load === void 0 ? null : _ref3$load,
              _ref3$loadData = _ref3.loadData,
              loadData = _ref3$loadData === void 0 ? null : _ref3$loadData;

          _classCallCheck(this, Team);

          if (load) {
            for (var info in loadData) {
              this[info] = loadData[info];
            }
          } else {
            this.stats = {
              gamesPlayed: 0,
              goalsAgainst: 0,
              goalsFor: 0,
              otl: 0,
              otw: 0,
              sol: 0,
              sow: 0,
              wins: 0,
              losses: 0,
              ppTime: 0,
              pps: 0,
              ppgf: 0,
              ppga: 0,
              pkTime: 0,
              pks: 0,
              pkgf: 0,
              pkga: 0,
              fow: 0,
              fol: 0,
              shots: 0,
              saves: 0
            };
            this.id = id;
            this.juniors = [];
            this.players = [];
            this.picks = {
              2020: [{
                round: 1,
                team: this.id,
                position: null,
                player: false
              }, {
                round: 2,
                team: this.id,
                position: null,
                player: false
              }, {
                round: 3,
                team: this.id,
                position: null,
                player: false
              }, {
                round: 4,
                team: this.id,
                position: null,
                player: false
              }, {
                round: 5,
                team: this.id,
                position: null,
                player: false
              }, {
                round: 6,
                team: this.id,
                position: null,
                player: false
              }, {
                round: 7,
                team: this.id,
                position: null,
                player: false
              }],
              2021: [{
                round: 1,
                team: this.id,
                position: null,
                player: false
              }, {
                round: 2,
                team: this.id,
                position: null,
                player: false
              }, {
                round: 3,
                team: this.id,
                position: null,
                player: false
              }, {
                round: 4,
                team: this.id,
                position: null,
                player: false
              }, {
                round: 5,
                team: this.id,
                position: null,
                player: false
              }, {
                round: 6,
                team: this.id,
                position: null,
                player: false
              }, {
                round: 7,
                team: this.id,
                position: null,
                player: false
              }],
              2022: [{
                round: 1,
                team: this.id,
                position: null,
                player: false
              }, {
                round: 2,
                team: this.id,
                position: null,
                player: false
              }, {
                round: 3,
                team: this.id,
                position: null,
                player: false
              }, {
                round: 4,
                team: this.id,
                position: null,
                player: false
              }, {
                round: 5,
                team: this.id,
                position: null,
                player: false
              }, {
                round: 6,
                team: this.id,
                position: null,
                player: false
              }, {
                round: 7,
                team: this.id,
                position: null,
                player: false
              }]
            };
            this.league = league;
            this.name = this.generateName();
            this.lines = {};
            this.outlook = this.generateOutlook();
            Vue.prototype.$schedule.teams[this.league][this.id] = [];
          }
        }

        _createClass(Team, [{
          key: "addPlayers",
          value: function addPlayers(players) {
            if (_typeof(players) === 'object') {
              this.players = this.players.concat(players);
            } else {
              this.players.push(players);
            }
          }
        }, {
          key: "allPlayers",
          value: function allPlayers(juniors) {
            if (juniors) {
              return this.players.concat(Vue.prototype.$teams.twohl[this.farmTeam('twohl')].players, Vue.prototype.$teams.thrhl[this.farmTeam('thrhl')].players, this.juniors);
            } else {
              return this.players.concat(Vue.prototype.$teams.twohl[this.farmTeam('twohl')].players, Vue.prototype.$teams.thrhl[this.farmTeam('thrhl')].players);
            }
          }
        }, {
          key: "capSpent",
          value: function capSpent(left) {
            var total = 0;

            for (var n = 0; n < this.players.length; n++) {
              total += Vue.prototype.$players[this.players[n]].contract.cap;
            }

            var otherPlayers = Vue.prototype.$teams.twohl[this.farmTeam('twohl')].players.concat(Vue.prototype.$teams.thrhl[this.farmTeam('thrhl')].players);

            for (var n = 0; n < otherPlayers.length; n++) {
              if (Vue.prototype.$players[otherPlayers[n]].contract.cap > 1) {
                total += Vue.prototype.$players[otherPlayers[n]].contract.cap - 1;
              }
            }

            if (left) {
              return parseFloat((Vue.prototype.$gameInfo.salaryCap - total).toFixed(2));
            } else {
              return parseFloat(total.toFixed(2));
            }
          }
        }, {
          key: "changePicks",
          value: function changePicks(action, pick) {
            var season = Vue.prototype.$gameInfo.time.season;

            if (action === 'remove') {
              this.picks[season] = this.picks[season].filter(function (a) {
                return !(pick.round === a.round && pick.team === a.team);
              });
            } else if (action === 'add') {
              this.picks[season].push({
                round: pick.round,
                team: pick.team,
                position: pick.position,
                player: false
              });
            }
          }
        }, {
          key: "checkLineValidity",
          value: function checkLineValidity() {
            for (var position in this.lines.v55) {
              if (this.lines.v55[position].indexOf(0) !== -1) {
                return false;
              }
            }

            if (this.lines.g.indexOf(0) !== -1) {
              return false;
            }

            if (this.lines.specialTeams.pk.indexOf(0) !== -1) {
              return false;
            }

            if (this.lines.specialTeams.pp.indexOf(0) !== -1) {
              return false;
            }

            return true;
          }
        }, {
          key: "extendAll",
          value: function extendAll() {
            var allPlayersList = this.allPlayers(false);

            if (allPlayersList.length > 76) {
              return;
            }

            var allExpiringList = [];
            var capLeft = Vue.prototype.$gameInfo.salaryCap + 30; //extra M for players outside of 1HL

            for (var p = 0; p < allPlayersList.length; p++) {
              var player = Vue.prototype.$players[allPlayersList[p]];

              if (player.contract.years === 1 && isNaN(player.newContract.years)) {
                allExpiringList.push(player.id);
              } else if (!isNaN(player.newContract.cap)) {
                capLeft -= player.newContract.cap;
              } else {
                capLeft -= player.contract.cap;
              }
            } // Extends juniors


            for (var p = 0; p < this.juniors.length; p++) {
              var player = Vue.prototype.$players[this.juniors[p]];

              if (player.overall() >= 60 && player.contract.years === 1 && isNaN(player.newContract.years)) {
                player.newContract = player.desiredContract();
                player.switchTeam(this.farmTeam('thrhl'));
                capLeft -= player.newContract.cap;
              } else if (player.contract.years === 1 && isNaN(player.newContract.years)) {
                player.release();
              }
            } // Extends minimums


            for (var p = 0; p < allExpiringList.length; p++) {
              var player = Vue.prototype.$players[allExpiringList[p]];

              if (player.overall() > 63 && player.overall() < 76) {
                player.newContract = player.desiredContract();
                player.newContract.cap = 1;
                allExpiringList = allExpiringList.filter(function (id) {
                  return id !== player.id;
                });
                capLeft -= player.newContract.cap;
              }

              if (player.age <= 22) {
                player.newContract = player.desiredContract();
                allExpiringList = allExpiringList.filter(function (id) {
                  return id !== player.id;
                });
                capLeft -= player.newContract.cap;
              }
            }

            if (capLeft < 0) {
              return;
            } // Extends rest


            var prioritySort = [];

            for (var p = 0; p < allExpiringList.length; p++) {
              var player = Vue.prototype.$players[allExpiringList[p]];
              var value = player.overall() * -(player.age * 0.08);

              if (player.overall() > 63) {
                prioritySort.push({
                  id: player.id,
                  value: value
                });
              }
            }

            prioritySort = prioritySort.sort(function (a, b) {
              return a.value - b.value;
            }).reverse();

            for (var p in prioritySort) {
              var player = Vue.prototype.$players[prioritySort[p].id];

              if (player.desiredContract() > capLeft) {
                continue;
              } else {
                var contract = player.desiredContract();
                contract.cap -= 0.3;
                var yearChange = rnd(-1, 1);
                contract.years += yearChange;

                if (contract.years > 8 || contract.years < 1) {
                  contract.years -= yearChange;
                }

                if (contract.cap < 1) {
                  contract.cap = 1;
                }

                contract.cap = parseFloat(contract.cap.toFixed(2));

                if (capLeft - contract.cap > 0) {
                  player.newContract = contract;
                  capLeft -= contract.cap;
                }
              }
            }
          }
        }, {
          key: "farmTeam",
          value: function farmTeam(league) {
            var leagueConvert = {
              onehl: '1',
              twohl: '2',
              thrhl: '3'
            };
            return parseInt(leagueConvert[league] + this.id.toString().slice(1, 3));
          }
        }, {
          key: "generateLines",
          value: function generateLines(custom, specialTeams, goalies) {
            // custom is false or the desired 5v5 players { 'lw': [], 'c': [], 'rw': [], 'ld': [], 'rd': [],
            // specialTeams is false or a list of desired player ids for each type
            // ex: {pp: [83734, 4863434,...], pk:[43433,8755,..,]} pp is 10 long, pk is 8
            // goalies is false or a list of desired goalie ids : [547223,45333]
            var players = this.players;

            function positionRank() {
              var ranks = {
                even: {
                  'lw': [],
                  'c': [],
                  'rw': [],
                  'ld': [],
                  'rd': []
                },
                pp: {
                  'lw': [],
                  'c': [],
                  'rw': [],
                  'ld': [],
                  'rd': []
                },
                pk: {
                  'lw': [],
                  'c': [],
                  'rw': [],
                  'ld': [],
                  'rd': []
                }
              };
              var overallRank = {
                even: [],
                pp: [],
                pk: []
              };
              players.forEach(function (pid) {
                var player = Vue.prototype.$players[pid];

                if (player.position != 'g') {
                  for (var position in ranks.even) {
                    var evenScore = player.overall() * player.positionStrength[position];
                    overallRank.even.push({
                      id: pid,
                      score: evenScore,
                      position: position
                    });
                    var ppScore = player.overall() * player.positionStrength[position] * player.attributes.oiq * player.attributes.wrist * player.attributes.slap * player.attributes.hands;
                    overallRank.pp.push({
                      id: pid,
                      score: ppScore,
                      position: position
                    });
                    var pkScore = player.overall() * player.positionStrength[position] * player.attributes.diq * player.attributes.blocking * player.attributes.hitting * player.attributes.stick;
                    overallRank.pk.push({
                      id: pid,
                      score: pkScore,
                      position: position
                    });
                  }
                }
              });

              for (var type in ranks) {
                for (var position in ranks[type]) {
                  ranks[type][position] = ranks[type][position].sort(function (a, b) {
                    return a.score - b.score;
                  }).reverse();
                }
              }

              for (var type in overallRank) {
                overallRank[type] = overallRank[type].sort(function (a, b) {
                  return a.score - b.score;
                }).reverse();
              }

              return overallRank;
            }

            function allocateLines(ranking) {
              var lines = {
                v55: {
                  'lw': [],
                  'c': [],
                  'rw': [],
                  'ld': [],
                  'rd': []
                },
                v44: {
                  'lw': [],
                  'c': [],
                  'rw': [],
                  'ld': [],
                  'rd': []
                },
                v33: {
                  'lw': [],
                  'c': [],
                  'rw': [],
                  'ld': [],
                  'rd': []
                },
                v54: {
                  'lw': [],
                  'c': [],
                  'rw': [],
                  'ld': [],
                  'rd': []
                },
                v53: {},
                v43: {
                  'lw': [],
                  'c': [],
                  'rw': [],
                  'ld': [],
                  'rd': []
                },
                v45: {
                  'lw': [],
                  'c': [],
                  'rw': [],
                  'ld': [],
                  'rd': []
                },
                v35: {},
                v34: {},
                g: [],
                specialTeams: {
                  pp: [],
                  pk: []
                }
              }; //v55

              if (!custom) {
                var lineLength = {
                  'lw': 4,
                  'c': 4,
                  'rw': 4,
                  'ld': 3,
                  'rd': 3
                };
                var unusedPlayers = JSON.parse(JSON.stringify(players));

                for (var n in ranking.even) {
                  var player = ranking.even[n];

                  if (unusedPlayers.includes(player.id)) {
                    if (lineLength[player.position] !== lines.v55[player.position].length) {
                      lines.v55[player.position].push(player.id);
                      unusedPlayers = unusedPlayers.filter(function (pid) {
                        return pid != player.id;
                      });
                    }
                  }
                }

                for (var player in unusedPlayers) {
                  var pid = unusedPlayers[player];

                  if (Vue.prototype.$players[pid].position === 'g') {
                    lines.g.push({
                      id: pid,
                      overall: Vue.prototype.$players[pid].overall()
                    });
                  }
                }

                for (var pos in lines.v55) {
                  if (lines.v55[pos].length < lineLength[pos]) {
                    lines.v55[pos].concat(new Array(lineLength[pos] - lines.v55[pos].length).fill(0));
                  }
                }

                if (lines.g.length < 2) {
                  lines.g.concat(new Array(2 - lines.g.length).fill(0));
                }
              } else {
                lines.v55 = custom;
              }

              if (!goalies) {
                var goalies = players.filter(function (p) {
                  return Vue.prototype.$players[p].position === 'g';
                });
                lines.g = goalies.sort(function (a, b) {
                  return Vue.prototype.$players[a].overall() - Vue.prototype.$players[b].overall();
                }).reverse();
              } else {
                lines.g = goalies;
              } //v44


              var lineLength = {
                'lw': 3,
                'c': 3,
                'rw': 3,
                'ld': 2,
                'rd': 2
              };
              var unusedPlayers = JSON.parse(JSON.stringify(players));

              for (var n in ranking.even) {
                var player = ranking.even[n];

                if (unusedPlayers.includes(player.id)) {
                  if (lineLength[player.position] !== lines.v44[player.position].length) {
                    lines.v44[player.position].push(player.id);

                    if (player.position === 'lw') {
                      lines.v44.rw.push(0);
                    } else if (player.position === 'rw') {
                      lines.v44.lw.push(0);
                    }

                    unusedPlayers = unusedPlayers.filter(function (pid) {
                      return pid != player.id;
                    });
                  }
                }
              } //v33


              var lineLength = {
                'lw': 3,
                'c': 3,
                'rw': 3,
                'ld': 3,
                'rd': 3
              };
              var unusedPlayers = JSON.parse(JSON.stringify(players));

              for (var n in ranking.even) {
                var player = ranking.even[n];

                if (unusedPlayers.includes(player.id)) {
                  if (lineLength[player.position] !== lines.v33[player.position].length) {
                    lines.v33[player.position].push(player.id);

                    if (player.position === 'ld') {
                      lines.v33.rd.push(0);
                    } else if (player.position === 'rd') {
                      lines.v33.ld.push(0);
                    } else if (player.position === 'lw') {
                      lines.v33.rw.push(0);
                    } else if (player.position === 'rw') {
                      lines.v33.lw.push(0);
                    }

                    unusedPlayers = unusedPlayers.filter(function (pid) {
                      return pid != player.id;
                    });
                  }
                }
              } //v34 & v35 & v45


              if (specialTeams !== false) {
                var unusedPlayers = specialTeams.pk;
              } else {
                var unusedPlayers = JSON.parse(JSON.stringify(players));
              }

              var lineLength = {
                'lw': 2,
                'c': 2,
                'rw': 2,
                'ld': 2,
                'rd': 2
              };

              for (var n in ranking.pk) {
                var player = ranking.pk[n];

                if (unusedPlayers.includes(player.id)) {
                  if (lineLength[player.position] !== lines.v45[player.position].length) {
                    lines.v45[player.position].push(player.id);

                    if (player.position === 'lw') {
                      lines.v45.rw.push(0);
                    } else if (player.position === 'rw') {
                      lines.v45.lw.push(0);
                    }

                    unusedPlayers = unusedPlayers.filter(function (pid) {
                      return pid != player.id;
                    });
                    lines.specialTeams.pk.push(player.id);
                  }
                }
              }

              lines.v35 = JSON.parse(JSON.stringify(lines.v45));
              lines.v35.lw = [0, 0];
              lines.v35.rw = [0, 0];
              lines.v34 = lines.v35; //v54 v53

              if (specialTeams !== false) {
                var unusedPlayers = specialTeams.pp;
              } else {
                var unusedPlayers = JSON.parse(JSON.stringify(players));
              }

              var lineLength = {
                'lw': 2,
                'c': 2,
                'rw': 2,
                'ld': 2,
                'rd': 2
              };

              for (var n in ranking.pp) {
                var player = ranking.pp[n];

                if (unusedPlayers.includes(player.id)) {
                  if (lineLength[player.position] !== lines.v54[player.position].length) {
                    lines.v54[player.position].push(player.id);
                    unusedPlayers = unusedPlayers.filter(function (pid) {
                      return pid != player.id;
                    });
                    lines.specialTeams.pp.push(player.id);
                  }
                }
              }

              lines.v53 = JSON.parse(JSON.stringify(lines.v54)); //v43

              if (specialTeams !== false) {
                var unusedPlayers = specialTeams.pp;
              } else {
                var unusedPlayers = JSON.parse(JSON.stringify(players));
              }

              var lineLength = {
                'lw': 2,
                'c': 2,
                'rw': 2,
                'ld': 2,
                'rd': 2
              };

              for (var n in ranking.pp) {
                var player = ranking.pp[n];

                if (unusedPlayers.includes(player.id)) {
                  if (lineLength[player.position] !== lines.v43[player.position].length) {
                    lines.v43[player.position].push(player.id);

                    if (player.position === 'ld') {
                      lines.v43.rd.push(0);
                    } else if (player.position === 'rd') {
                      lines.v43.ld.push(0);
                    }

                    unusedPlayers = unusedPlayers.filter(function (pid) {
                      return pid != player.id;
                    });
                  }
                }
              }

              return lines;
            }

            var l = allocateLines(positionRank());
            this.lines = l;
            return l;
          }
        }, {
          key: "generateName",
          value: function generateName() {
            var leagueConvert = {
              onehl: '',
              twohl: '2',
              thrhl: '3'
            };
            var logoConvert = {
              onehl: '',
              twohl: 'Sr. ',
              thrhl: 'Jr. '
            };
            var team = parseInt(this.id.toString().slice(1, 3));
            var names = ['Developer', 'Anaheim', 'Arizona', 'Boston', 'Buffalo', 'Calgary', 'Carolina', 'Chicago', 'Colorado', 'Columbus', 'Dallas', 'Detroit', 'Edmonton', 'Florida', 'Los Angeles', 'Minnesota', 'Montreal', 'Nashville', 'New Jersey', 'Brooklyn', 'New York', 'Ottawa', 'Philadelphia', 'Pittsburgh', 'San Jose', 'St. Louis', 'Tampa Bay', 'Toronto', 'Vancouver', 'Vegas', 'Washington', 'Winnipeg'];
            var abbs = ['DEV', 'ANA', 'ARI', 'BOS', 'BUF', 'CGY', 'CAR', 'CHI', 'COL', 'CBJ', 'DAL', 'DET', 'EDM', 'FLA', 'LAK', 'MIN', 'MTL', 'NSH', 'NJD', 'NYI', 'NYR', 'OTT', 'PHI', 'PIT', 'SJS', 'STL', 'TBL', 'TOR', 'VAN', 'VGK', 'WSH', 'WPG'];
            var logos = ['Bugs', 'Ducks', 'Coyotes', 'Bruins', 'Sabres', 'Flames', 'Hurricanes', 'Blackhawks', 'Avalanche', 'Blue Jackets', 'Stars', 'Red Wings', 'Oilers', 'Panthers', 'Kings', 'Wild', 'Canadiens', 'Predators', 'Devils', 'Islanders', 'Rangers', 'Senators', 'Flyers', 'Penguins', 'Sharks', 'Blues', 'Lightning', 'Maple Leafs', 'Canucks', 'Knights', 'Capitals', 'Jets'];
            var name = names[team];
            var abb = leagueConvert[this.league] + abbs[team];
            var logo = logoConvert[this.league] + logos[team];
            var full = name + ' ' + logo;
            return {
              city: name,
              logo: logo,
              full: full,
              abb: abb
            };
          }
        }, {
          key: "generateOutlook",
          value: function generateOutlook() {
            return ['rebuild', 'bubble', 'playoff', 'cup'][rnd(0, 3)];
          }
        }, {
          key: "overall",
          value: function overall() {
            var overall = {
              forwards: 0,
              defence: 0,
              goalies: 0
            };
            var overallList = {
              forwards: [],
              defence: [],
              goalies: []
            };

            for (var player in this.players) {
              var pid = this.players[player];
              var pos = Vue.prototype.$players[pid].position;

              if (pos === 'lw' | pos === 'rw' | pos === 'c') {
                overallList.forwards.push(Vue.prototype.$players[pid].overall());
              } else if (pos === 'ld' | pos === 'rd') {
                overallList.defence.push(Vue.prototype.$players[pid].overall());
              } else {
                overallList.goalies.push(Vue.prototype.$players[pid].overall());
              }
            }

            for (var type in overallList) {
              overallList[type] = overallList[type].sort(function (a, b) {
                return a - b;
              }).reverse();
            }

            overallList.forwards = overallList.forwards.slice(0, 12);
            overallList.defence = overallList.defence.slice(0, 6);
            overallList.goalies = overallList.goalies.slice(0, 2);
            var skaters = {
              'forwards': 0,
              'defence': 0
            };

            for (var type in skaters) {
              for (var item in overallList[type]) {
                overall[type] += overallList[type][item];
              }
            }

            overall.forwards = parseInt(overall.forwards / 12) + 5;
            overall.defence = parseInt(overall.defence / 6) + 4;
            overall.goalies = parseInt(overallList.goalies[0] * 0.85 + overallList.goalies[0] * 0.15);

            if (overall.forwards > 100) {
              overall.forwards = 100;
            }

            if (overall.defence > 100) {
              overall.defence = 100;
            }

            return overall;
          }
        }, {
          key: "playerInterest",
          value: function playerInterest(id) {
            // interest will slightly modify how a team percieves trade value
            // these aren't very good at the moment
            var player = Vue.prototype.$players[id];
            var capSpace = Vue.prototype.$gameInfo.salaryCap - this.capSpent() - player.contract.cap;

            if (this.outlook === 'rebuild') {
              var value = player.tradeValue();

              if (capSpace < 0) {
                return 0;
              }

              if (player.age > 30) {
                value -= (player.age - 30) * Math.pow(3, 1.5);
              }
            } else if (this.outlook === 'bubble') {
              if (capSpace < 0) {
                return 0;
              }

              if (player.age > 33) {
                value -= (player.age - 33) * Math.pow(3, 1.5);
              }
            } else if (this.outlook === 'playoff') {
              var value = player.tradeValue() + (player.overall() - 70) / 10;

              if (capSpace < 0) {
                value -= Math.abs(capSpace) * 10;
              }
            } else if (this.outlook === 'cup') {
              var value = player.tradeValue() + (player.overall() - 87) / 10;

              if (capSpace < 0) {
                value -= Math.abs(capSpace) * 5;
              }

              if (player.age < 24) {
                value -= (24 - player.age) * 3;
              }
            }

            return parseInt(value);
          }
        }, {
          key: "playerPositionSummary",
          value: function playerPositionSummary() {
            var allPlayers = this.allPlayers(true);
            var all = {
              lw: 0,
              c: 0,
              rw: 0,
              ld: 0,
              rd: 0,
              g: 0
            };
            var cap = {
              lw: 0,
              c: 0,
              rw: 0,
              ld: 0,
              rd: 0,
              g: 0
            };

            for (var p = 0; p < allPlayers.length; p++) {
              var player = Vue.prototype.$players[allPlayers[p]];
              all[player.position] += 1;

              if (player.contract.cap > 1) {
                cap[player.position] += 1;
              }
            }

            return {
              all: all,
              cap: cap
            };
          }
        }, {
          key: "points",
          value: function points() {
            return (this.stats.wins + this.stats.sow + this.stats.otw) * 2 + this.stats.otl + this.stats.sol;
          }
        }, {
          key: "rank",
          value: function rank(stat, suffix) {
            var _this2 = this;

            function rankSuffix(index) {
              if (4 <= index & index <= 20) {
                return index + 'th';
              }

              index = index.toString();

              if (index.slice(index.length - 1) == '1') {
                return index + 'st';
              } else if (index.slice(index.length - 1) == '2') {
                return index + 'nd';
              } else if (index.slice(index.length - 1) == '3') {
                return index + 'rd';
              } else {
                return index + 'th';
              }
            }

            var teams = [];

            for (var team in Vue.prototype.$teams[this.league]) {
              teams.push(Vue.prototype.$teams[this.league][team]);
            }

            if (stat === 'points') {
              teams = teams.sort(function (a, b) {
                return a.stats.points / a.stats.gamesPlayed - b.stats.points / b.gamesPlayed || a.stats.goalsFor - a.stats.goalsAgainst - (b.stats.goalsFor - b.stats.goalsAgainst);
              }).reverse();
            } else {
              teams = teams.sort(function (a, b) {
                return a.stats[stat] - b.stats[stat];
              }).reverse();
            }

            var index = teams.findIndex(function (x) {
              return x.id === _this2.id;
            });

            if (suffix) {
              return rankSuffix(index + 1);
            } else {
              return index;
            }
          }
        }, {
          key: "removePlayers",
          value: function removePlayers(players) {
            this.players = this.players.filter(function (id) {
              return !players.includes(id);
            });
          }
        }, {
          key: "sortRoster",
          value: function sortRoster() {
            var allPlayersList = this.allPlayers(true);

            function playerInfo(pid, position) {
              var player = Vue.prototype.$players[pid]; // each year younger is 0.5 points added to the overall

              if (position === 'g') {
                var value = player.overall() + (1 / player.age - 0.3) * 375 + 100;
              } else {
                var value = (player.overall() + (1 / player.age - 0.3) * 375 + 100) * player.positionStrength[position];
              }

              if (player.contract.cap === 1) {
                var contractScore = 'minimum';
              } else {
                var contractScore = player.contract.cap - player.desiredContract().cap;
              }

              if (player.league === 'juniors') {
                value -= 10;
              }

              return {
                id: pid,
                value: value,
                contractScore: contractScore
              };
            } //Sorting the players by performance in each position


            var allPlayersInfo = {
              lw: [],
              c: [],
              rw: [],
              ld: [],
              rd: [],
              g: [],
              all: []
            };

            for (var p = 0; p < allPlayersList.length; p++) {
              var player = Vue.prototype.$players[allPlayersList[p]];

              if (typeof player === 'undefined') {
                // bug, ids of players who don't exist find their way into a 3HL player list
                // this and the next try catch "solve"" it
                Vue.prototype.$teams.onehl[this.id].players = Vue.prototype.$teams.onehl[this.id].players.filter(function (id) {
                  return id != allPlayersList[p];
                });
                Vue.prototype.$teams.twohl['2' + this.id.toString().slice(1)].players = Vue.prototype.$teams.twohl['2' + this.id.toString().slice(1)].players.filter(function (id) {
                  return id != allPlayersList[p];
                });
                Vue.prototype.$teams.thrhl['3' + this.id.toString().slice(1)].players = Vue.prototype.$teams.thrhl['3' + this.id.toString().slice(1)].players.filter(function (id) {
                  return id != allPlayersList[p];
                });
                this.sortRoster();
              }

              try {
                if (player.position !== 'g') {
                  allPlayersInfo.all.push(playerInfo(player.id, player.position));

                  for (var pos in {
                    lw: 0,
                    c: 0,
                    rw: 0,
                    ld: 0,
                    rd: 0
                  }) {
                    allPlayersInfo[pos].push(playerInfo(player.id, pos));
                  }
                } else {
                  allPlayersInfo.g.push(playerInfo(player.id, 'g'));
                }
              } catch (_unused5) {}
            }

            for (var pos in allPlayersInfo) {
              allPlayersInfo[pos] = allPlayersInfo[pos].sort(function (a, b) {
                return a.value - b.value || a.contractScore - b.contractScore;
              }).reverse();
            } // Adding goalies to their league


            try {
              Vue.prototype.$players[allPlayersInfo.g[0].id].switchTeam(this.farmTeam('onehl'));
              Vue.prototype.$players[allPlayersInfo.g[1].id].switchTeam(this.farmTeam('onehl'));
              Vue.prototype.$players[allPlayersInfo.g[2].id].switchTeam(this.farmTeam('twohl'));
              Vue.prototype.$players[allPlayersInfo.g[3].id].switchTeam(this.farmTeam('twohl'));
              Vue.prototype.$players[allPlayersInfo.g[4].id].switchTeam(this.farmTeam('thrhl'));
              Vue.prototype.$players[allPlayersInfo.g[5].id].switchTeam(this.farmTeam('thrhl'));
            } catch (_unused6) {} //less than 6 goalies
            // Adding skaters to their league


            var positionIndex = {
              lw: 0,
              c: 0,
              rw: 0,
              ld: 0,
              rd: 0
            };
            var chosenPlayerList = [];

            for (var league in {
              onehl: 0,
              twohl: 0,
              thrhl: 0
            }) {
              for (var line = 0; line < 4; line++) {
                for (var pos in positionIndex) {
                  if (!(line === 3 && ['ld', 'rd'].includes(pos))) {
                    var notAdded = true;

                    while (notAdded && positionIndex[pos] < allPlayersInfo[pos].length) {
                      var player = Vue.prototype.$players[allPlayersInfo[pos][positionIndex[pos]].id];

                      if (chosenPlayerList.includes(player.id)) {
                        positionIndex[pos] += 1;
                      } else {
                        player.switchTeam(this.farmTeam(league));
                        chosenPlayerList.push(player.id);
                        notAdded = false;
                        positionIndex[pos] += 1;
                      }
                    }
                  }
                }
              }
            }
          }
        }, {
          key: "topPlayer",
          value: function topPlayer(stat) {
            var season = Vue.prototype.$gameInfo.time.season;
            var players = [];

            if (['saves', 'savePctg', 'gaa'].includes(stat)) {
              if (this.lines.g[0] !== 0) {
                var goalie1 = Vue.prototype.$players[this.lines.g[0]];
              } else {
                return {
                  name: 'None',
                  value: 0,
                  id: 0
                };
              }

              if (this.lines.g[1] !== 0) {
                var goalie2 = Vue.prototype.$players[this.lines.g[1]];
              } else {
                return {
                  name: goalie1.fullName,
                  value: goalie1.stats[season][stat],
                  id: goalie1.id
                };
              }

              if (goalie1.stats[season][stat] >= goalie2.stats[season][stat]) {
                return {
                  name: goalie1.fullName,
                  value: goalie1.stats[season][stat],
                  id: goalie1.id
                };
              } else {
                return {
                  name: goalie2.fullName,
                  value: goalie2.stats[season][stat],
                  id: goalie2.id
                };
              }
            } else {
              for (var tid in this.players) {
                if (Vue.prototype.$players[this.players[tid]].position !== 'g' && tid !== '0') {
                  players.push(Vue.prototype.$players[this.players[tid]]);
                }
              }
            }

            players = players.sort(function (a, b) {
              return a.stats[season][stat] - b.stats[season][stat];
            }).reverse();

            if (typeof players[0] === 'undefined') {
              return {
                name: 'None',
                value: 0,
                id: 0
              };
            }

            return {
              name: players[0].fullName,
              value: players[0].stats[season][stat],
              id: players[0].id
            };
          }
        }]);

        return Team;
      }()
    };

    function rnd(low, high) {
      //returns a random number between low and high (linear)
      var random = Math.random();
      var r = Math.floor(random * (high - low + 1));
      return low + r;
    }
  }, {}],
  4: [function (require, module, exports) {
    var gMixin = require('../scripts/main.js');

    module.exports = {
      homePage: {
        mixins: [gMixin],
        template: "\n    <div>\n        <div class=\"home-header\">\n            <div class=\"horizontal-buttons\">\n                <a @click=\"league = changeLeague('onehl')\" :style=\"{'background': colour().main}\">1HL</a>\n                <a @click=\"league = changeLeague('twohl')\" :style=\"{'background': colour().main}\">2HL</a>\n                <a @click=\"league = changeLeague('thrhl')\" :style=\"{'background': colour().main}\">3HL</a>\n            </div>\n            <p class=\"home-team-name\" :style=\"{'color': colour().main}\">{{teamInfo.name.city.toUpperCase()}}</p>\n            <p class=\"home-team-name\" :style=\"{'color': colour().light}\">{{teamInfo.name.logo.toUpperCase()}}</p>\n            <p class=\"home-header-info\">{{record()}}</p>\n        </div>\n\n        <table class=\"home-table\">\n            <caption>Team Stats</caption>\n            <tr>\n                <td>GP</td><td>{{teamInfo.stats.gamesPlayed}}</td><td>{{teamInfo.rank('gamesPlayed', true)}}</td>\n            </tr>\n            <tr>\n                <td>PTS</td><td>{{teamInfo.points()}}</td><td>{{teamInfo.rank('points', true)}}</td>\n            </tr>\n            <tr>\n                <td>W</td><td>{{teamInfo.stats.wins}}</td><td>{{teamInfo.rank('wins', true)}}</td>\n            </tr>\n            <tr>\n                <td>OTW</td><td>{{teamInfo.stats.otw}}</td><td>{{teamInfo.rank('otw', true)}}</td>\n            </tr>\n            <tr>\n                <td>OTL</td><td>{{teamInfo.stats.otl}}</td><td>{{teamInfo.rank('otl', true)}}</td>\n            </tr>\n            <tr>\n                <td>SOW</td><td>{{teamInfo.stats.sow}}</td><td>{{teamInfo.rank('sow', true)}}</td>\n            </tr>\n            <tr>\n                <td>SOL</td><td>{{teamInfo.stats.sol}}</td><td>{{teamInfo.rank('sol', true)}}</td>\n            </tr>\n            <tr>\n                <td>GF</td><td>{{teamInfo.stats.goalsFor}}</td><td>{{teamInfo.rank('goalsFor', true)}}</td>\n            </tr>\n            <tr>\n                <td>GA</td><td>{{teamInfo.stats.goalsAgainst}}</td><td>{{teamInfo.rank('goalsAgainst', true)}}</td>\n            </tr>\n        </table>\n        <table class=\"home-table\" id=\"leaders\">\n            <caption>Leaders</caption>\n            <tr>\n                <td>PTS</td><td>{{teamInfo.topPlayer('points').value}}</td>\n                <td @click=\"addressChange('player',teamInfo.topPlayer('points').id)\">{{teamInfo.topPlayer('points').name}}</td>\n            </tr>\n            <tr>\n                <td>G</td><td>{{teamInfo.topPlayer('goals').value}}</td>\n                <td @click=\"addressChange('player',teamInfo.topPlayer('goals').id)\">{{teamInfo.topPlayer('goals').name}}</td>\n            </tr>\n            <tr>\n                <td>A</td><td>{{teamInfo.topPlayer('assists').value}}</td>\n                <td @click=\"addressChange('player',teamInfo.topPlayer('assists').id)\">{{teamInfo.topPlayer('assists').name}}</td>\n            </tr>\n            <tr>\n                <td>Sht</td><td>{{teamInfo.topPlayer('shots').value}}</td>\n                <td @click=\"addressChange('player',teamInfo.topPlayer('assists').id)\">{{teamInfo.topPlayer('assists').name}}</td>\n            </tr>\n            <tr>\n                <td>Svs</td><td>{{teamInfo.topPlayer('saves').value}}</td>\n                <td @click=\"addressChange('player',teamInfo.topPlayer('savePctg').id)\">{{teamInfo.topPlayer('savePctg').name}}</td>\n            </tr>\n            <tr>\n                <td>SV%</td><td>{{teamInfo.topPlayer('savePctg').value}}</td>\n                <td @click=\"addressChange('player',teamInfo.topPlayer('savePctg').id)\">{{teamInfo.topPlayer('savePctg').name}}</td>\n            </tr>\n                <tr>\n                <td>GAA</td><td>{{teamInfo.topPlayer('gaa').value}}</td>\n                <td @click=\"addressChange('player',teamInfo.topPlayer('gaa').id)\">{{teamInfo.topPlayer('gaa').name}}</td>\n            </tr>\n        </table>\n\n        <table>\n            <caption>News</caption>\n            <tr v-for=\"article in news\">\n                <td>{{article}}</td>\n            </tr>\n        </table>\n    </div>\n    ",
        data: function data() {
          var date = Vue.prototype.$gameInfo.time.date;
          var seasonEnd = Vue.prototype.$gameInfo.time.season;
          var goTo = {
            display: false,
            url: []
          };
          return {
            date: date,
            goTo: goTo,
            league: 'onehl',
            teamInfo: Vue.prototype.$teams.onehl[Vue.prototype.$gameInfo.player.team],
            news: Vue.prototype.$news
          };
        },
        methods: {
          record: function record() {
            var wins = this.teamInfo.stats.wins + this.teamInfo.stats.otw + this.teamInfo.stats.sow;
            var losses = this.teamInfo.stats.losses;
            var ot = this.teamInfo.stats.otl + this.teamInfo.stats.sol;
            return wins + '-' + losses + '-' + ot + ' (' + this.teamInfo.rank('points', true) + ')';
          },
          changeLeague: function changeLeague(league) {
            this.teamInfo = Vue.prototype.$teams[league][this.teamConvert(league, Vue.prototype.$gameInfo.player.team)];
          }
        }
      }
    };
  }, {
    "../scripts/main.js": 14
  }],
  5: [function (require, module, exports) {
    var gMixin = require('../scripts/main.js');

    module.exports = {
      fourOhFour: {
        template: "\n    <div>\n        <p>404 The url wasn't found</p>\n    </div>\n    "
      },
      draftHomePage: {
        mixins: [gMixin],
        template: "\n<div v-if=\"draftTime\">\n    <div class=\"horizontal-buttons\">\n        <a :style=\"{'background': colour().main}\" @click=\"selectedTable = 'available'; setScope('start')\">Available</a>\n        <a :style=\"{'background': colour().main}\" @click=\"selectedTable = 'drafted'; setScope('start')\">Drafted</a>\n        <a :style=\"{'background': colour().main}\" @click=\"selectedTable = 'ranked'; setScope('start')\">Ranking</a>\n    </div>\n    <p>{{selectedTable.slice(0,1).toUpperCase()+selectedTable.slice(1)+' Players'}}</p>\n\n    <div class=\"stats-page-container\">\n        <a @click=\"setScope('start')\" class=\"scope-change\" :style=\"{'background': colour().main}\"> << </a> \n        <a @click=\"setScope('backward')\" class=\"scope-change light\" :style=\"{'background': colour().light}\"> < </a>\n        <div class=\"table-scroll\">\n            <table>\n                <tr>\n                    <th>Rank</th>\n                    <th>Region</th>\n                    <th>Name</th>\n                    <th>Position</th>\n                    <th>Overall</th>\n                    <th>Ceiling</th>\n                    <th>Chance</th>\n                    <th>Certainty</th>\n                </tr>\n                <tr v-for=\"i in 15\" @click=\"playerMenu.display = true; selectedPlayer = playerInfo(i, 'id')\" class=\"hover-hand\">\n                    <td v-if=\"selectedTable !== 'available'\">{{i+scope[0]}}</td>\n                    <td v-else>{{playerInfo(i, 'rank')}}</td>\n                    <td>{{playerInfo(i, 'region')}}</td>\n                    <td>{{playerInfo(i, 'name')}}</td>\n                    <td>{{playerInfo(i, 'position')}}</td>\n                    <td>{{playerInfo(i, 'overall')}}</td>\n                    <td>{{playerInfo(i, 'ceiling')}}</td>\n                    <td>{{playerInfo(i, 'chance')}}</td>\n                    <td>{{playerInfo(i, 'certainty')}}</td>\n                </tr>\n            </table>\n        </div>\n        <a @click=\"setScope('forward')\" class=\"scope-change light\" :style=\"{'background': colour().light}\"> > </a>\n    </div>\n\n    <p>{{'Current Pick: '+draft.currentPick}}</p>\n    <div class=\"horizontal-buttons\">\n        <a :style=\"{'background': colour().main}\" @click=\"nextPick()\">Next Pick</a>\n        <a :style=\"{'background': colour().main}\" @click=\"nextUserPick()\">Your Next Pick</a>\n        <a :style=\"{'background': colour().main}\" @click=\"autoComplete()\">Auto Complete</a>\n    </div>\n    \n    <table>\n        <caption>Your Picks</caption>\n        <tr>\n            <th>Round</th>\n            <th>Pick</th>\n            <th>Player</th>\n        </tr>\n        <tr v-for=\"pick in pickList.user\"  @click=\"playerMenu.display = true; selectedPlayer = pick.player\">\n            <td>{{pick.round}}</td>\n            <td>{{pick.position}}</td>\n            <td v-if=\"!pick.player\">-</td>\n            <td v-else>{{idPlayerInfo(pick.player)}}</td>\n        </tr>\n    </table>\n\n\n    <div v-if=\"playerMenu.display\" class=\"selected-bar\">\n        <p>{{idPlayerInfo(selectedPlayer)}}</p>\n        <div class=\"horizontal-buttons\">\n            <a @click=\"addressChange('player',selectedPlayer,{})\"\n                :style=\"{'background': colour().main}\">View Profile</a>\n            <a @click=\"draftPlayer(selectedPlayer, playerTeam)\" v-if=\"letPlayerDraft()\"\n                :style=\"{'background': colour().main}\">Draft Player</a>\n            <a @click=\"playerMenu.display = false\" :style=\"{'background': colour().main}\">X</a>\n        </div>\n    </div>\n\n</div>\n<div v-else>\n    <p>The draft starts on June 27th</p>\n</div>\n",
        data: function data() {
          if (Object.keys(Vue.prototype.$events.draft).length === 0 && this.laterDate(Vue.prototype.$gameInfo.time.date, {
            day: 27,
            month: 6,
            year: 1990
          })) {
            var draft = this.generateDraft();
            Vue.prototype.$events.draft = draft;
            var draftTime = true;
          } else if (!this.laterDate(Vue.prototype.$gameInfo.time.date, {
            day: 27,
            month: 6,
            year: 1990
          })) {
            var draftTime = false;
          } else {
            var draft = Vue.prototype.$events.draft;
            var draftTime = true;
          }

          return {
            draftTime: draftTime,
            draft: draft,
            selectedTable: 'available',
            selectedPlayer: 0,
            playerMenu: {
              display: false,
              id: 0
            },
            scope: [0, 15],
            season: Vue.prototype.$gameInfo.time.season,
            pickList: this.getPickList(),
            playerTeam: Vue.prototype.$gameInfo.player.team
          };
        },
        methods: {
          setScope: function setScope(direction) {
            if (direction === 'start') {
              this.scope = [0, 10];
            } else if (direction === 'forward') {
              this.scope = [this.scope[0] + 10, this.scope[1] + 10];
            } else if (direction === 'backward') {
              this.scope = [this.scope[0] - 10, this.scope[1] - 10];
            }

            if (this.scope[0] < 0) {
              this.scope = [0, 10];
            }

            this.$forceUpdate();
          },
          generateDraft: function generateDraft() {
            var draft = {
              players: {
                available: [],
                drafted: [],
                ranked: []
              },
              currentPick: 1
            };
            var playerList = [];
            var places = ['canada', 'states', 'europe', 'easternEurope', 'scandanavia', 'rest'];

            for (var place in places) {
              for (var player in Vue.prototype.$teams.prospects[places[place]].players) {
                playerList.push(Vue.prototype.$players[Vue.prototype.$teams.prospects[places[place]].players[player]]);
              }
            }

            playerList = playerList.sort(function (a, b) {
              return a.potential.chance["int"] * a.potential.ceiling["int"] - b.potential.chance["int"] * b.potential.ceiling["int"];
            }).reverse();

            for (var player in playerList) {
              draft.players.ranked.push(playerList[player].id);
              Vue.prototype.$players[playerList[player].id].rank = parseInt(player) + 1;
            }

            draft.players.available = JSON.parse(JSON.stringify(draft.players.ranked));
            return draft;
          },
          playerInfo: function playerInfo(listPosition, attribute) {
            listPosition += this.scope[0] - 1;
            var pid = this.draft.players[this.selectedTable][listPosition];

            if (isNaN(pid)) {
              return '-';
            }

            var player = Vue.prototype.$players[pid];

            if (attribute === 'name') {
              return player.fullName;
            } else if (attribute === 'region') {
              return player.teamName().abb;
            } else if (attribute === 'position') {
              return player.position.toUpperCase();
            } else if (attribute === 'overall') {
              return player.overall();
            } else if (attribute === 'ceiling') {
              return player.potential.ceiling.shownName;
            } else if (attribute === 'chance') {
              return player.potential.chance.shownName;
            } else if (attribute === 'certainty') {
              return player.potential.certainty.name;
            } else if (attribute === 'id') {
              return pid;
            } else if (attribute === 'rank') {
              return player.rank;
            }

            return '-';
          },
          idPlayerInfo: function idPlayerInfo(pid) {
            return Vue.prototype.$players[pid].fullName;
          },
          getPickList: function getPickList() {
            var season = Vue.prototype.$gameInfo.time.season;
            var pickList = {
              all: {},
              user: {}
            };

            for (var tid in Vue.prototype.$teams.onehl) {
              var team = Vue.prototype.$teams.onehl[tid];

              for (var pickId in team.picks[season]) {
                var pick = team.picks[season][pickId];
                var pickTeamPositon = Vue.prototype.$teams.onehl[pick.team].rank('points', false);

                if (pick.position === null) {
                  pick.position = (pick.round - 1) * 32 + pickTeamPositon + 1;
                }

                if (team.id === Vue.prototype.$gameInfo.player.team) {
                  pickList.user[pick.position] = pick;
                }

                pickList.all[pick.position] = pick;
              }
            }

            return pickList;
          },
          draftPlayer: function draftPlayer(pid) {
            if (!this.draft.players.available.includes(pid)) {
              return false;
            }

            if (this.draft.currentPick > 7 * 32) {
              this.draft.currentPick = 'Complete';
              return false;
            }

            var player = Vue.prototype.$players[pid];
            var pick = this.pickList.all[this.draft.currentPick];
            pick.player = pid;

            for (var pickId in Vue.prototype.$teams.onehl[pick.team].picks[this.season]) {
              if (Vue.prototype.$teams.onehl[pick.team].picks[this.season][pickId].position === this.currentPick) {
                Vue.prototype.$teams.onehl[pick.team].picks[this.season][pickId].player = pid;
              }
            }

            this.draft.players.available = this.draft.players.available.filter(function (id) {
              return pid !== id;
            });
            this.draft.players.drafted.push(pid);
            player.switchTeam(pick.team);
            this.draft.currentPick += 1;
            this.playerMenu.display = false;
          },
          letPlayerDraft: function letPlayerDraft() {
            var playerAvailable = this.draft.players.available.includes(this.selectedPlayer);
            var userSelection = false;

            for (var pick in this.pickList.user) {
              if (this.pickList.user[pick].position === this.draft.currentPick) {
                userSelection = true;
              }
            }

            return playerAvailable & userSelection;
          },
          nextPick: function nextPick() {
            this.draftPlayer(this.cpuChoice());
          },
          nextUserPick: function nextUserPick() {
            var picks = Object.keys(this.pickList.user);
            picks = picks.map(function (id) {
              return parseInt(id);
            });
            picks = picks.sort(function (a, b) {
              return a - b;
            });

            for (var n in picks) {
              var pick = picks[n];

              if (pick > this.draft.currentPick) {
                var nextPick = pick;
                break;
              }
            }

            var picksToSim = nextPick - this.draft.currentPick;

            for (var n = 0; n < picksToSim; n++) {
              this.nextPick();
            }
          },
          autoComplete: function autoComplete() {
            var picksToSim = 7 * 32 - this.draft.currentPick + 1;

            for (var n = 0; n < picksToSim; n++) {
              this.nextPick();
            }

            this.draft.currentPick = 'Completed';
          },
          cpuChoice: function cpuChoice() {
            var randomChoice = this.rnd(0, Math.floor(this.draft.currentPick * 0.1) + 1);
            return this.draft.players.available[randomChoice];
          }
        }
      },
      yearEndPage: {
        mixins: [gMixin],
        template: "\n    <div>\n        <img :src=\"'../images/cup.png'\" class=\"year-end-cup\"></img>\n        <p>This year's winners of the questionable looking cup are</p>\n        <div class=\"year-end-winners\">\n            <p>1HL</p>\n            <p :style=\"{'color': colour().main}\"> {{winners('onehl').first}}</p>\n            <p :style=\"{'color': colour().light}\">{{winners('onehl').last}}</p>\n        </div>\n        <div class=\"year-end-winners\">\n            <p>2HL</p>\n            <p :style=\"{'color': colour().main}\"> {{winners('twohl').first}}</p>\n            <p :style=\"{'color': colour().light}\">{{winners('twohl').last}}</p>\n        </div>\n        <div class=\"year-end-winners\">\n            <p>3HL</p>\n            <p :style=\"{'color': colour().main}\"> {{winners('thrhl').first}}</p>\n            <p :style=\"{'color': colour().light}\">{{winners('thrhl').last}}</p>\n        </div>\n\n    </div>\n    \n    ",
        methods: {
          winners: function winners(league) {
            var matchup = Vue.prototype.$events.playoffs[league].r4['1v2'];

            if (matchup.score[0] > matchup.score[1]) {
              var winner = matchup.hi;
            } else {
              var winner = matchup.lo;
            }

            var team = Vue.prototype.$teams[league][winner];
            return {
              first: team.name.city,
              last: team.name.logo
            };
          }
        }
      },
      savePage: {
        mixins: [gMixin],
        template: "\n    <div class=\"save-page\">\n        <p v-if=\"alert !== false\">{{alert}}</p>\n        <h3>Full Save</h3>\n        <div>\n            <p class=\"save-page-desc\">Downloads the save file ~ 3 Mb</p>\n            <input v-model=\"fileName\" class=\"save-page-file-name\"></input>\n            <div class=\"horizontal-buttons\">\n                <a @click=\"fullSave()\" :style=\"{'background': colour().main}\">Save Game</a>\n            </div>\n        </div>\n        <div>\n            <input type=\"file\" id=\"load-game-file\"></input>\n            <div class=\"horizontal-buttons\">\n                <a @click=\"loader()\" :style=\"{'background': colour().main}\">Load Game</a>\n            </div>\n        </div>\n        \n        <h3 class=\"save-page-heading\">Quick Saves</h3>\n        <div class=\"save-page-quick\">\n            <p>{{'Slot 1 - '+quickStatus.quickSave1}}</p>\n            <div class=\"horizontal-buttons\">\n                <a @click=\"quickSaver('quickSave1')\" :style=\"{'background': colour().main}\">Save</a>\n                <a @click=\"quickLoader('quickSave1')\" :style=\"{'background': colour().light}\" class=\"light-text\">Load</a>\n            </div>\n        </div>\n\n        <div class=\"save-page-quick\">\n            <p>{{'Slot 2 - '+quickStatus.quickSave2}}</p>\n            <div class=\"horizontal-buttons\">\n                <a @click=\"quickSaver('quickSave2')\" :style=\"{'background': colour().main}\">Save</a>\n                <a @click=\"quickLoader('quickSave2')\" :style=\"{'background': colour().light}\" class=\"light-text\">Load</a>\n            </div>\n        </div>\n\n        <div class=\"save-page-quick\">\n            <p>{{'Slot 3 - '+quickStatus.quickSave3}}</p>\n            <div class=\"horizontal-buttons\">\n                <a @click=\"quickSaver('quickSave3')\" :style=\"{'background': colour().main}\">Save</a>\n                <a @click=\"quickLoader('quickSave3')\" :style=\"{'background': colour().light}\" class=\"light-text\">Load</a>\n            </div>\n        </div>\n\n    </div>\n    \n    ",
        data: function data() {
          return {
            alert: false,
            quickStatus: this.quickStatusGetter(),
            fileName: 'bgm-save-1'
          };
        },
        methods: {
          fullSave: function fullSave() {
            //https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server
            var fileName = this.fileName + '.txt';
            var data = JSON.stringify({
              events: Vue.prototype.$events,
              gameInfo: Vue.prototype.$gameInfo,
              news: Vue.prototype.$news,
              players: Vue.prototype.$players,
              schedule: Vue.prototype.$schedule,
              teams: Vue.prototype.$teams
            });
            var blob = new Blob([data], {
              type: 'text/csv'
            });

            if (window.navigator.msSaveOrOpenBlob) {
              window.navigator.msSaveBlob(blob, fileName);
            } else {
              var elem = window.document.createElement('a');
              elem.href = window.URL.createObjectURL(blob);
              elem.download = fileName;
              document.body.appendChild(elem);
              elem.click();
              document.body.removeChild(elem);
            }

            this.alert = 'Game File Downloaded';
          },
          loader: function loader() {
            this.loadGame('upload');
            this.alert = 'Game Loaded';
          },
          quickSaver: function quickSaver(slot) {
            Vue.prototype.$saves[slot] = JSON.stringify({
              events: Vue.prototype.$events,
              gameInfo: Vue.prototype.$gameInfo,
              news: Vue.prototype.$news,
              players: Vue.prototype.$players,
              schedule: Vue.prototype.$schedule,
              teams: Vue.prototype.$teams
            });
            Vue.prototype.$saves.dates[slot] = JSON.parse(JSON.stringify(Vue.prototype.$gameInfo.time.date));
            this.alert = 'Slot Saved';
          },
          quickLoader: function quickLoader(slot) {
            this.loadGame(slot);
            this.alert = 'Quick Save Loaded';
          },
          quickStatusGetter: function quickStatusGetter() {
            var status = {};

            for (var s in {
              quickSave1: 0,
              quickSave2: 0,
              quickSave3: 0
            }) {
              var save = Vue.prototype.$saves[s];

              if (Object.keys(save).length === 0) {
                status[s] = 'Empty';
              } else {
                status[s] = 'Saved ' + this.prettyDate(Vue.prototype.$saves.dates[s]);
              }
            }

            return status;
          }
        }
      }
    };
  }, {
    "../scripts/main.js": 14
  }],
  6: [function (require, module, exports) {
    var gMixin = require('../scripts/main.js');

    module.exports = {
      gameProfile: {
        mixins: [gMixin],
        template: "\n      <div>\n        <div v-if=\"!gameBeenPlayed\">\n          <p>{{game.league+' '+prettyDate(game.date)}}</p>\n          <p>{{home.name.full+' vs '+away.name.full}}</p>\n        </div>\n        <div v-else>\n          <p>{{game.league+' '+prettyDate(game.date)}}</p>\n          <p>{{home.name.full+' '+game.summary.score.home+' - '+game.summary.score.away+' '+away.name.full}}</p>\n          <p v-if=\"game.summary.extraTime !== false\">{{game.summary.extraTime}}</p>\n\n          <table>\n            <caption>Goals</caption>\n            <tr>\n              <th>Team</th>\n              <th>Period</th>\n              <th>Time</th>\n              <th>Strength</th>\n              <th>Goal</th>\n              <th>Assist</th>\n              <th>Assist</th>\n            </tr>\n            <tr v-for=\"goal in game.summary.goals\">\n              <td>{{playerTeam(goal.points[0])}}</td>\n              <td>{{readableTime(goal.time).period}}</td>\n              <td>{{readableTime(goal.time).time}}</td>\n              <td>{{goal.strength}}</td>\n              <td>{{playerName(goal.points[0])}}</td>\n              <td v-if=\"goal.points.length > 1\">{{playerName(goal.points[1])}}</td>\n              <td v-else>-</td>\n              <td v-if=\"goal.points.length > 2\">{{playerName(goal.points[2])}}</td>\n              <td v-else>-</td>\n            </tr>\n          </table>\n\n          <table>\n            <caption>Game Stats</caption>\n            <tr>\n              <th>Stat</th>\n              <th>{{home.name.abb}}</th>\n              <th>{{away.name.abb}}</th>\n            </tr>\n            <tr v-for=\"n in 7\" :key=\"n\">\n              <td>{{statInfo(n).name}}</td>\n              <td>{{statInfo(n).home}}</td>\n              <td>{{statInfo(n).away}}</td>\n            </tr>\n          </table>\n\n          <table>\n            <caption>Penalties</caption>\n            <tr>\n              <th>Team</th>\n              <th>Period</th>\n              <th>Time</th>\n              <th>Player</th>\n            </tr>\n            <tr v-for=\"penalty in game.summary.penalties\">\n              <td>{{playerTeam(penalty.id)}}</td>\n              <td>{{readableTime(penalty.time).period}}</td>\n              <td>{{readableTime(penalty.time).time}}</td>\n              <td>{{playerName(penalty.id)}}</td>\n            </tr>\n          </table>\n\n        </div>\n      </div>\n        ",
        data: function data() {
          var sub = Vue.prototype.$gameInfo.page.sub;
          var league = sub.split('-')[0];
          var id = sub.split('-')[1];
          var game = Vue.prototype.$schedule.id[league][id];
          var gameBeenPlayed = this.laterDate(Vue.prototype.$gameInfo.time.date, game.date);
          return {
            game: game,
            home: Vue.prototype.$teams[league][game.home],
            away: Vue.prototype.$teams[league][game.away],
            gameBeenPlayed: gameBeenPlayed
          };
        },
        methods: {
          playerName: function playerName(id) {
            return Vue.prototype.$players[id].fullName;
          },
          playerTeam: function playerTeam(id) {
            return Vue.prototype.$players[id].teamName().abb;
          },
          statInfo: function statInfo(n) {
            n -= 1;
            var statList = ['goals', 'shots', 'ppTime', 'pps', 'ppgf', 'pkgf', 'fow'];
            var statConverter = {
              goals: 'Goals',
              pps: 'Power Plays',
              ppTime: 'Power Play Time',
              ppgf: 'Power Play Goals',
              pkgf: 'Penalty Kill Goals',
              fow: 'Face Offs',
              shots: 'Shots'
            };
            var homeStat = this.game.stats.home[statList[n]];
            var awayStat = this.game.stats.away[statList[n]];

            if (n == 2) {
              homeStat = this.readableTime(homeStat).time;
              awayStat = this.readableTime(awayStat).time;
            }

            return {
              name: statConverter[statList[n]],
              home: homeStat,
              away: awayStat
            };
          }
        }
      },
      playerProfile: {
        mixins: [gMixin],
        template: "\n        <div>\n          <div class=\"player-info-header\">\n            <img :src=\"'../images/players/face-'+player.face+'.png'\" class=\"player-info-face\"></img>\n            <p class=\"player-info-name\">{{player.fullName+' '+player.overall()}}</p>\n            <p>{{playerInfo}}</p>\n            <p>{{playerNum.contract}}</p>\n            <p>{{playerPotential}}</p>\n          </div>\n          <table v-if=\"type !== 'goalie'\" class=\"player-info-table\" id=\"attributes\">\n            <tr>\n              <th>Offence</th>\n              <th></th>\n              <th>Defence</th>\n              <th></th>\n              <th>Skills</th>\n              <th></th>\n              <th>Other</th>\n              <th></th>\n            </tr>\n            <tr v-for=\"i in 4\">\n              <td>{{attributes.offence[i-1].name}}</td>\n              <td v-html=\"playerAttributes('offence',i)\"></td>\n      \n              <td>{{attributes.defence[i-1].name}}</td>\n              <td v-html=\"playerAttributes('defence',i)\"></td>\n      \n              <td>{{attributes.skills[i-1].name}}</td>\n              <td v-html=\"playerAttributes('skills',i)\"></td>\n      \n              <td>{{attributes.other[i-1].name}}</td>\n              <td v-html=\"playerAttributes('other',i)\"></td>\n            </tr>\n          </table>\n\n          <table v-if=\"type !== 'goalie' && showStats\" class=\"player-info-table\" id=\"stats\">\n            <tr>\n                <th>GP</th>\n                <th>Points</th>\n                <th>Goals</th>\n                <th>Assists</th>\n                <th>Shots</th>\n                <th>TOI</th>\n                <th>PIM</th>\n            </tr>\n            <tr>\n                <td>{{player.stats[season].gamesPlayed}}</td>\n                <td>{{player.stats[season].points}}</td>\n                <td>{{player.stats[season].goals}}</td>\n                <td>{{player.stats[season].assists}}</td>\n                <td>{{player.stats[season].shots}}</td>\n                <td>{{toiPerGame()}}</td>\n                <td>{{player.stats[season].pim}}</td>\n            </tr>\n          </table>\n      \n        <table v-if=\"type === 'goalie'\" class=\"player-info-table\" id=\"attributes\">\n          <tr>\n            <th>Hockey</th>\n            <th></th>\n            <th>Athleticism</th>\n            <th></th>\n            <th>Mental</th>\n            <th></th>\n          </tr>\n          <tr v-for=\"i in 5\">\n              <td>{{attributes.hockey[i-1].name}}</td>\n              <td v-html=\"playerAttributes('hockey',i)\"></td>\n      \n              <td>{{attributes.athleticism[i-1].name}}</td>\n              <td v-html=\"playerAttributes('athleticism',i)\"></td>\n      \n              <td>{{attributes.mental[i-1].name}}</td>\n              <td v-html=\"playerAttributes('mental',i)\"></td>\n          </tr>\n        </table>\n\n        <table v-if=\"type === 'goalie' && showStats\" class=\"player-info-table\" id=\"stats\">\n          <tr>\n              <th>GP</th>\n              <th>Save %</th>\n              <th>GAA</th>\n              <th>Saves</th>\n              <th>Goals Against</th>\n          </tr>\n          <tr>\n              <td>{{player.stats[season].gamesPlayed}}</td>\n              <td>{{player.stats[season].savePctg}}</td>\n              <td>{{player.stats[season].gaa}}</td>\n              <td>{{player.stats[season].saves}}</td>\n              <td>{{player.stats[season].goalsAgainst}}</td>\n          </tr>\n        </table>     \n        </div>\n        ",
        data: function data() {
          var player = Vue.prototype.$players[Vue.prototype.$gameInfo.page.sub];
          var leagues = ['onehl', 'twohl', 'thrhl', 'juniors', 'freeAgents'];

          if (player.position === 'g') {
            var type = 'goalie';
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
            };
          } else {
            var type = 'player';
            var attributes = {
              offence: [{
                name: 'Off IQ',
                code: 'oiq'
              }, {
                name: 'Wrist Shot',
                code: 'wrist'
              }, {
                name: 'Slap Shot',
                code: 'slap'
              }, {
                name: 'Hands',
                code: 'hands'
              }],
              defence: [{
                name: 'Def IQ',
                code: 'diq'
              }, {
                name: 'Stickwork',
                code: 'stick'
              }, {
                name: 'Blocking',
                code: 'blocking'
              }, {
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
            };
          }

          return {
            season: Vue.prototype.$gameInfo.time.season,
            player: player,
            attributes: attributes,
            type: type,
            address: 'players/' + player.id,
            showStats: !(player.league === 'juniors' || player.league === 'prospects')
          };
        },
        computed: {
          playerInfo: function playerInfo() {
            var posName = {
              lw: 'left wing',
              c: 'center',
              rw: 'right wing',
              ld: 'left defenceman',
              rd: 'right defenceman',
              g: 'goalie'
            };
            var info = this.player.age + ' year old ' + posName[this.player.position] + ' from ' + this.player.country + ' playing for ' + this.player.teamName().full;
            return info;
          },
          playerNum: function playerNum() {
            var contract = 'Contract: ' + this.player.contract.years + ' years x ' + this.player.contract.cap + ' M';
            return {
              contract: contract
            };
          },
          playerPotential: function playerPotential() {
            if (this.player.league === 'prospects') {
              return 'Potential: ' + this.player.potential.ceiling.shownName + ' ' + this.player.potential.chance.shownName;
            } else {
              return 'Potential: ' + this.player.potential.ceiling.name + ' ' + this.player.potential.chance.name;
            }
          }
        },
        methods: {
          playerAttributes: function playerAttributes(type, i) {
            var attribute = this.player.attributes[this.attributes[type][i - 1].code];
            var progress = Math.round(this.player.progression[this.attributes[type][i - 1].code]);

            if (this.player.position === 'g' & ['athleticism', 'mental'].includes(type) & i > 3) {
              return "";
            }

            if (progress > 0) {
              var id = 'positive';
            } else if (progress === 0) {
              var id = 'neutral';
            } else if (progress < 0) {
              var id = 'negative';
            }

            return "\n              <p class=\"player-info-attribute\">" + attribute + "</p>\n              <p class=\"player-info-attribute\" id=\"" + id + "\">" + progress + "</p>\n              ";
          },
          toiPerGame: function toiPerGame() {
            var gp = this.player.stats[this.season].gamesPlayed;
            var toi = this.player.stats[this.season].toi;

            if (gp === 0) {
              return '0:00';
            } else {
              return this.readableTime(parseInt(toi / gp)).time;
            }
          }
        }
      }
    };
  }, {
    "../scripts/main.js": 14
  }],
  7: [function (require, module, exports) {
    var gMixin = require('../scripts/main.js');

    module.exports = {
      rosterPage: {
        mixins: [gMixin],
        template: "\n        <div>\n            <p @click=\"rules = !rules\" class=\"roster-rules\">Rules</p>\n            <div v-if=\"rules\" class=\"roster-rules\">\n                <p>Traded players will stay in the same league they were previously in</p>\n                <p>Free agent singings will go to the 3HL</p>\n                <p>Players brought up from juniors can't be sent back, they recieve an automatic contract of 1M until the age of 21</p>\n                <p>If junior players aren't signed at age 21, they will be released</p>\n                <p>Players on minimum contracts (1 M cap hit) can be released</p>\n                <p>Each team needs at least 18 skaters and 2 goalies to play</p> \n            </div>\n            <p class=\"home-team-name\" :style=\"{'color':colour().main}\">{{teamName.city}}</p>\n            <p class=\"home-team-name\" :style=\"{'color':colour().light}\">{{teamName.logo}}</p>\n            <div class=\"roster-league-overall\">\n                <div class=\"onehl-highlight\">\n                    <p>1HL</p>\n                    <p>{{'Forwards: '+overall.onehl.forwards}}</p>\n                    <p>{{'Defence: '+overall.onehl.defence}}</p>\n                    <p>{{'Goalies: '+overall.onehl.goalies}}</p>\n                    <p>{{totals.onehl+'/23'}}</p>\n                </div>\n                <div class=\"twohl-highlight\">\n                    <p>2HL</p>\n                    <p>{{'Forwards: '+overall.twohl.forwards}}</p>\n                    <p>{{'Defence: '+overall.twohl.defence}}</p>\n                    <p>{{'Goalies: '+overall.twohl.goalies}}</p>\n                    <p>{{totals.twohl+'/23'}}</p>\n                </div>\n                <div class=\"thrhl-highlight\">\n                    <p>3HL</p>\n                    <p>{{'Forwards: '+overall.thrhl.forwards}}</p>\n                    <p>{{'Defence: '+overall.thrhl.defence}}</p>\n                    <p>{{'Goalies: '+overall.thrhl.goalies}}</p>\n                    <p>{{totals.thrhl+'/30'}}</p>\n                </div>\n                <div class=\"juniors-highlight\">\n                    <p>Juniors</p>\n                    <p>{{totals.juniors+'/\u221E'}}</p>\n                </div>\n            </div>\n            <p>{{'Cap '+team.capSpent()+' M / 85 M'}}</p>\n            <div class=\"horizontal-buttons\">\n                <a @click=\"dropdown.display = !dropdown.display\" :style=\"{'background': colour().main}\">Teams</a>\n                <a @click=\"attemptTransactions()\" v-if=\"userTeam == selectedTeam\" :style=\"{'background': colour().main}\">Save</a>\n            </div>\n            <div v-if=\"dropdown.display\" class=\"roster-dropdown\">\n                <a v-for=\"team in dropdown.teams\" @click=\"teamChange(team.id)\" :id=\"team.id\">{{ team.name }}</a>\n            </div>\n        \n            <div v-if=\"userTeam == selectedTeam & Object.keys(pending).length > 0\">\n                <p>Pending Transactions</p>\n                <p v-if=\"alert !== false\">{{alert}}</p>\n                <table>\n                    <tr>\n                    <th>\n                    <th>Player</th>\n                    <th>From</th>\n                    <th>To</th>\n                    </tr>\n                    <tr v-for=\"player in pending\">\n                    <td><a @click=\"changePending('remove',player)\">X</a></td>\n                    <td>{{player.name}}</td>\n                    <td>{{player.league}}</td>\n                    <td>{{player.toLeague}}</td>\n                    </tr>\n                </table>\n            </div>\n            <div v-else-if=\"userTeam == selectedTeam\">\n                <p>No pending transactions</p>\n            </div>\n        \n            <div class=\"roster-table-container\">\n                <div v-for=\"position in ['lw','c','rw']\">\n                <p :style=\"{'color':colour().light}\">{{positionTranslate[position]}}</p>\n                <table>\n                    <tr>\n                    <th>Age</th>\n                    <th>Name</th>\n                    <th>Overall</th>\n                    </tr>\n                    <tr v-for=\"player in players\" v-if=\"position === player.position\" :class=\"player.className\" @click=\"selectPlayer(player.id)\">\n                    <td>{{player.age}}</td>\n                    <td>{{player.name}}</td>\n                    <td>{{player.overall}}</td>\n                    </tr>\n                </table>\n                </div>\n            </div>\n        \n            <div class=\"roster-table-container\">\n                <div v-for=\"position in ['ld','rd']\">\n                <p :style=\"{'color':colour().light}\">{{positionTranslate[position]}}</p>\n                <table>\n                    <tr>\n                    <th>Age</th>\n                    <th>Name</th>\n                    <th>Overall</th>\n                    </tr>\n                    <tr v-for=\"player in players\" v-if=\"position === player.position\" :class=\"player.className\" @click=\"selectPlayer(player.id)\">\n                    <td>{{player.age}}</td>\n                    <td>{{player.name}}</td>\n                    <td>{{player.overall}}</td>\n                    </tr>\n                </table>\n                </div>\n            </div>\n        \n            <div class=\"roster-table-container\">\n                <div v-for=\"position in ['g']\">\n                <p :style=\"{'color':colour().light}\">{{positionTranslate[position]}}</p>\n                <table>\n                    <tr>\n                    <th>Age</th>\n                    <th>Name</th>\n                    <th>Overall</th>\n                    </tr>\n                    <tr v-for=\"player in players\" v-if=\"position === player.position\" :class=\"player.className\" @click=\"selectPlayer(player.id)\">\n                    <td>{{player.age}}</td>\n                    <td>{{player.name}}</td>\n                    <td>{{player.overall}}</td>\n                    </tr>\n                </table>\n                </div>\n            </div>\n\n            <div v-if=\"selectedPlayer.display\" class=\"selected-bar\">\n                <p>{{selectedPlayer.overall}}</p>\n                <p>{{selectedPlayer.name}}</p>\n                <div class=\"horizontal-buttons\">\n                    <a @click=\"addressChange('player',selectedPlayer.id,{})\"\n                    :style=\"{'background': colour().main}\">Player Page</a>\n                    <a v-if=\"selectedPlayer.league !== 'onehl' & userTeam == selectedTeam\" \n                    :style=\"{'background': colour().main}\"\n                    @click=\"changePending('onehl',selectedPlayer)\">To 1HL</a>\n                    <a v-if=\"selectedPlayer.league !== 'twohl' & userTeam == selectedTeam\" \n                    :style=\"{'background': colour().main}\"\n                    @click=\"changePending('twohl',selectedPlayer)\">To 2HL</a>\n                    <a v-if=\"selectedPlayer.league !== 'thrhl' & userTeam == selectedTeam\" \n                    :style=\"{'background': colour().main}\"\n                    @click=\"changePending('thrhl',selectedPlayer)\">To 3HL</a>\n                    <a v-if=\"selectedPlayer.canBeReleased\" \n                    :style=\"{'background': colour().main}\"\n                    @click=\"changePending('release',selectedPlayer)\">Release</a>\n                    <a @click=\"selectPlayer('close')\"\n                    :style=\"{'background': colour().main}\">X</a>\n                </div>\n            </div>\n        </div>\n        ",
        data: function data() {
          var userTeam = Vue.prototype.$gameInfo.player.team;
          return {
            gameInfo: Vue.prototype.$gameInfo,
            totals: this.totalCount(),
            players: this.teamChange('init'),
            team: Vue.prototype.$teams.onehl[userTeam],
            dropdown: {
              'teams': this.teamlist(),
              'current': 0,
              'display': false
            },
            overall: this.overalls('init'),
            selectedPlayer: {
              display: false
            },
            pending: [],
            alert: false,
            userTeam: userTeam,
            selectedTeam: userTeam,
            rules: false,
            positionTranslate: {
              lw: 'Left Wing',
              c: 'Center',
              rw: 'Right Wing',
              ld: 'Left Defence',
              rd: 'Right Defence',
              g: 'Goalie'
            }
          };
        },
        methods: {
          teamChange: function teamChange(state) {
            if (state === 'init') {
              var team = Vue.prototype.$gameInfo.player.team;
              this.overall = this.overalls('init');
            } else {
              var team = event.currentTarget.id;
              this.overall = this.overalls();
              this.team = Vue.prototype.$teams.onehl[team];
            }

            var leagues = {
              onehl: team,
              twohl: '2' + team.toString().slice(1, 3),
              thrhl: '3' + team.toString().slice(1, 3)
            };
            var players = [];

            for (var league in leagues) {
              for (var curPlayer in Vue.prototype.$teams[league][leagues[league]].players) {
                var player = Vue.prototype.$players[Vue.prototype.$teams[league][leagues[league]].players[curPlayer]];
                players.push({
                  'id': player.id,
                  'age': player.age,
                  'name': player.name().abb,
                  'position': player.position,
                  'overall': player.overall(),
                  'league': league,
                  'className': league + '-highlight',
                  'team': player.team
                });
              }
            }

            for (var curPlayer in Vue.prototype.$teams.onehl[team].juniors) {
              var player = Vue.prototype.$players[Vue.prototype.$teams.onehl[team].juniors[curPlayer]];
              players.push({
                'id': player.id,
                'age': player.age,
                'name': player.name().abb,
                'position': player.position,
                'overall': player.overall(),
                'league': 'juniors',
                'className': 'juniors-highlight',
                'team': player.team
              });
            }

            players = players.sort(function (a, b) {
              return a.overall - b.overall;
            }).reverse();

            try {
              this.selectedTeam = team;
            } catch (_unused7) {}

            this.players = players;
            this.totals = this.totalCount();
            return players;
          },
          changePending: function changePending(league, player) {
            if (league !== 'remove') {
              player.toLeague = league;
              var newList = this.pending.filter(function (pid) {
                return pid.id !== player.id;
              });
              newList.push(JSON.parse(JSON.stringify(player)));

              if (this.pending.length !== newList.length) {
                this.totals[player.toLeague] += 1;
                this.totals[player.league] -= 1;
              }

              this.pending = newList;
            } else {
              this.pending = this.pending.filter(function (pid) {
                return pid.id !== player.id;
              });
              this.totals[player.toLeague] -= 1;
              this.totals[player.league] += 1;
            }
          },
          attemptTransactions: function attemptTransactions() {
            var leagueConvert = {
              onehl: '1HL',
              twohl: '2HL',
              thrhl: '3HL'
            };
            var leagueNumber = {
              onehl: '1',
              twohl: '2',
              thrhl: '3'
            };
            var success = true;

            for (var league in this.totals) {
              if (league !== 'thrhl') {
                if (this.totals[league] > 23) {
                  this.alert = 'Too many players in ' + leagueConvert[league];
                  success = false;
                }
              } else {
                if (this.totals[league] > 30) {
                  this.alert = 'Too many players in ' + leagueConvert[league];
                  success = false;
                }
              }
            }

            if (success) {
              this.alert = 'Transactions have been made';
              var pending = this.pending;

              for (var item in pending) {
                var player = pending[item];
                var newTeam = leagueNumber[player.toLeague] + player.team.toString().slice(1, 3);

                if (player.toLeague === 'release') {
                  Vue.prototype.$players[player.id].release();
                } else {
                  Vue.prototype.$players[player.id].switchTeam(newTeam);
                }
              }

              this.pending = [];
              this.teamChange('init');
            }
          },
          totalCount: function totalCount() {
            if (typeof this.players === 'undefined') {
              var players = this.teamChange('init');
            } else {
              var players = this.players;
            }

            var total = {
              onehl: 0,
              twohl: 0,
              thrhl: 0,
              juniors: 0
            };

            for (var n in players) {
              var player = players[n];
              total[player.league] += 1;
            }

            return total;
          },
          teamlist: function teamlist() {
            var teams = [];

            for (var team in Vue.prototype.$teams.onehl) {
              teams.push({
                name: Vue.prototype.$teams.onehl[team].name.city,
                id: team.toString()
              });
            }

            return teams;
          },
          overalls: function overalls(state) {
            if (state === 'init') {
              var team = Vue.prototype.$teams.onehl[Vue.prototype.$gameInfo.player.team];
            } else {
              var team = Vue.prototype.$teams.onehl[event.currentTarget.id];
            }

            var team2 = Vue.prototype.$teams.twohl[this.teamConvert('twohl', team.id)];
            var team3 = Vue.prototype.$teams.thrhl[this.teamConvert('thrhl', team.id)];
            return {
              onehl: team.overall(),
              twohl: team2.overall(),
              thrhl: team3.overall()
            };
          },
          selectPlayer: function selectPlayer(pid) {
            if (pid !== 'close') {
              var player = Vue.prototype.$players[pid];
              this.selectedPlayer.display = true;
              this.selectedPlayer.id = pid;
              this.selectedPlayer.name = player.fullName;
              this.selectedPlayer.overall = player.overall();
              this.selectedPlayer.league = player.league;
              this.selectedPlayer.team = player.team;
              this.selectedPlayer.canBeReleased = player.contract.cap === 1;
              this.$forceUpdate();
              this.alert = false;
            } else {
              this.selectedPlayer.display = false;
              this.alert = false;
            }
          }
        },
        computed: {
          teamName: function teamName() {
            var team = Vue.prototype.$teams.onehl[this.selectedTeam];
            return {
              city: team.name.city.toUpperCase(),
              logo: team.name.logo.toUpperCase()
            };
          }
        }
      },
      rosterContractPage: {
        mixins: [gMixin],
        template: "\n    <div>\n        <div class=\"horizontal-buttons\">\n            <a @click=\"selectedLeague = 'onehl'\"\n            :style=\"{'background': colour().main}\">1HL</a>\n            <a @click=\"selectedLeague = 'twohl'\"\n            :style=\"{'background': colour().main}\">2HL</a>\n            <a @click=\"selectedLeague = 'thrhl'\"\n            :style=\"{'background': colour().main}\">3HL</a>\n        </div>\n        <table>\n            <tr>\n                <th>Name</th>\n                <th>Age</th>\n                <th>Overall</th>\n                <th>Position</th>\n                <th v-for=\"year in 8\">{{contractYears[year-1]}}</th>\n            </tr>\n            <tr v-for=\"player in players[selectedLeague]\" @click=\"selectPlayer(player)\"\n            class=\"hover-hand\">\n                <td v-if=\"player.negotiate\" :style=\"{'color': colour().light}\">{{player.name}}</td>\n                <td v-else>{{player.name}}</td>\n                <td>{{player.age}}</td>\n                <td>{{player.overall}}</td>\n                <td>{{player.position.toUpperCase()}}</td>\n                <td v-for=\"year in 8\">{{player.cap[year-1]}}</td>\n            </tr>\n        </table>\n\n        <div v-if=\"selectedPlayer.display\" class=\"selected-bar\">\n            <p>{{selectedPlayer.overall}}</p>\n            <p>{{selectedPlayer.name}}</p>\n            <div class=\"horizontal-buttons\">\n                <a @click=\"addressChange('player',selectedPlayer.id,{})\"\n                :style=\"{'background': colour().main}\">Player Page</a>\n                <a @click=\"addressChange('roster','negotiate-'+selectedPlayer.id,{})\" v-if=\"selectedPlayer.negotiate\"\n                :style=\"{'background': colour().main}\">New Contract</a>\n                <a @click=\"selectPlayer('close')\"\n                :style=\"{'background': colour().main}\">X</a>\n            </div>\n        </div>\n    </div>\n    ",
        data: function data() {
          var gameInfo = Vue.prototype.$gameInfo;
          var team = gameInfo.player.team;
          var pids = {};
          pids.onehl = Vue.prototype.$teams.onehl[team].players;
          pids.twohl = Vue.prototype.$teams.twohl['2' + team.toString().slice(1, 3)].players;
          pids.thrhl = Vue.prototype.$teams.thrhl['3' + team.toString().slice(1, 3)].players;
          var playerList = {
            onehl: [],
            twohl: [],
            thrhl: []
          };

          for (var league in pids) {
            for (var pid in pids[league]) {
              var player = Vue.prototype.$players[pids[league][pid]];
              var insert = {};
              insert.id = player.id;
              insert.name = player.name().abb;
              insert.fullName = player.fullName;
              insert.cap = [];

              for (var i = 0; i < player.contract.years; i++) {
                insert.cap.push(player.contract.cap);
              }

              for (var i = 0; i < player.newContract.years; i++) {
                insert.cap.push(player.newContract.cap);
              }

              insert.years = player.contract.years;
              insert.clause = player.contract.clause;
              insert.age = player.age;
              insert.position = player.position;
              insert.overall = player.overall();

              if (insert.years === 1) {
                insert.negotiate = true;
              } else {
                insert.negotiate = false;
              }

              playerList[league].push(insert);
            }

            playerList.onehl = playerList.onehl.sort(function (a, b) {
              return a.cap[0] - b.cap[0];
            }).reverse();
            playerList.twohl = playerList.twohl.sort(function (a, b) {
              return a.cap[0] - b.cap[0];
            }).reverse();
            playerList.thrhl = playerList.thrhl.sort(function (a, b) {
              return a.cap[0] - b.cap[0];
            }).reverse();
          }

          return {
            players: playerList,
            selectedLeague: 'onehl',
            contractYears: this.yearsCalc(),
            selectedPlayer: {
              display: false
            }
          };
        },
        methods: {
          selectPlayer: function selectPlayer(player) {
            if (player === 'close') {
              this.selectedPlayer.display = false;
            } else {
              if (player.years === 1) {
                var negotiate = true;
              } else {
                var negotiate = false;
              }

              var selectedPlayer = {
                display: true,
                id: player.id,
                name: player.fullName,
                overall: player.overall,
                negotiate: negotiate
              };
              this.selectedPlayer = selectedPlayer;
            }
          },
          yearsCalc: function yearsCalc() {
            var season = Vue.prototype.$gameInfo.time.season;
            var seasons = [];

            for (var i = 0; i < 8; i++) {
              var seasonText = (season - 1).toString().slice(2, 4) + '-' + season.toString().slice(2, 4);
              seasons.push(seasonText);
              season += 1;
            }

            return seasons;
          }
        }
      },
      rosterLinesPage: {
        mixins: [gMixin],
        template: "\n    <div>\n        <div class=\"horizontal-buttons\">\n            <a @click=\"league = 'onehl';teamPlayers();lineGen('init');changeSpecial('init');alert=false\"\n            :style=\"{'background': colour().main}\">1HL</a>\n            <a @click=\"league = 'twohl';teamPlayers();lineGen('init');changeSpecial('init');alert=false\"\n            :style=\"{'background': colour().main}\">2HL</a>\n            <a @click=\"league = 'thrhl';teamPlayers();lineGen('init');changeSpecial('init');alert=false\"\n            :style=\"{'background': colour().main}\">3HL</a>\n        </div>\n        <div class=\"horizontal-buttons\" id=\"lines-page\">\n            <a @click=\"saveLines()\" class=\"light-text\"\n            :style=\"{'background': colour().light}\">Save Lines</a>\n            <a @click=\"suggestedLines()\" class=\"light-text\"\n            :style=\"{'background': colour().light}\">Suggested Lines</a>\n        </div>\n        <p>{{'PP: '+specialTeams.pp.count+'/10 PK: '+specialTeams.pk.count+'/8'}}</p>\n        <p v-if=\"alert !== false\">{{alert}}</p>\n        <table class=\"roster-lines-table\">\n            <tr>\n                <th :style=\"{'color': colour().light}\">Left Wing</th>\n                <th :style=\"{'color': colour().light}\">Center</th>\n                <th :style=\"{'color': colour().light}\">Right Wing</th>\n            </tr>\n            <tr v-for=\"i in 4\">\n                <td \n                v-for=\"pos in ['lw','c','rw']\"\n                :class=\"lines[pos][i-1].class\">\n                <a @click=\"changeSpecial('pp',lines[pos][i-1].id)\"\n                :class=\"checkSpecialClass('pp',lines[pos][i-1].id)\"\n                id=\"pp\">PP</a>\n                    <p class=\"roster-lines-name\" @click=\"swapPlayer(pos,i-1)\">{{lines[pos][i-1].name+' '+lines[pos][i-1].overall}}</p>\n                <a @click=\"changeSpecial('pk',lines[pos][i-1].id)\"\n                :class=\"checkSpecialClass('pk',lines[pos][i-1].id)\"\n                id=\"pk\">PK</a>\n                </td>\n            </tr>\n        </table>\n        <table class=\"roster-lines-table\">\n            <tr>\n                <th :style=\"{'color': colour().light}\">Left Defence</th>\n                <th :style=\"{'color': colour().light}\">Right Defence</th>\n            </tr>\n            <tr v-for=\"i in 3\">\n                <td \n                v-for=\"pos in ['ld','rd']\"\n                :class=\"lines[pos][i-1].class\">\n                <a @click=\"changeSpecial('pp',lines[pos][i-1].id)\"\n                :class=\"checkSpecialClass('pp',lines[pos][i-1].id)\"\n                id=\"pp\">PP</a>\n                    <p class=\"roster-lines-name\" @click=\"swapPlayer(pos,i-1)\">{{lines[pos][i-1].name+' '+lines[pos][i-1].overall}}</p>\n                <a @click=\"changeSpecial('pk',lines[pos][i-1].id)\"\n                :class=\"checkSpecialClass('pk',lines[pos][i-1].id)\"\n                id=\"pk\">PK</a>\n                </td>\n            </tr>\n        </table>\n        <table class=\"roster-lines-table\">\n            <tr>\n                <th :style=\"{'color': colour().light}\">Goalies</th>\n            </tr>\n            <tr v-for=\"i in 2\">\n                <td :class=\"lines.g[i-1].class\"\n                @click=\"swapPlayer('g',i-1)\">\n                {{lines.g[i-1].name+' '+lines.g[i-1].overall}}\n                </td>\n            </tr>\n        </table>\n    \n        <p>Roster Players</p>\n        <table>\n            <tr>\n                <th :style=\"{'color': colour().light}\">Left Wing</th>\n                <th :style=\"{'color': colour().light}\">Center</th>\n                <th :style=\"{'color': colour().light}\">Right Wing</th>\n            </tr>\n            <tr v-for=\"i in Math.max(players.lw.length, players.c.length, players.rw.length)\">\n                <td v-if=\"i-1 < players.lw.length\"\n                :class=\"players.lw[i-1].class\" \n                @click=\"selectPlayer(players.lw[i-1].id)\">\n                {{players.lw[i-1].name+' '+players.lw[i-1].overall}}</td>\n                <td v-else></td>\n                \n                <td v-if=\"i-1 < players.c.length\"\n                :class=\"players.c[i-1].class\" \n                @click=\"selectPlayer(players.c[i-1].id)\">\n                {{players.c[i-1].name+' '+players.c[i-1].overall}}</td>\n                <td v-else></td>\n                \n                <td v-if=\"i-1 < players.rw.length\"\n                :class=\"players.rw[i-1].class\" \n                @click=\"selectPlayer(players.rw[i-1].id)\">\n                {{players.rw[i-1].name+' '+players.rw[i-1].overall}}</td>\n                <td v-else></td>\n            </tr>\n        </table>\n        <table>\n            <tr>\n                <th :style=\"{'color': colour().light}\">Left Defence</th>\n                <th :style=\"{'color': colour().light}\">Right Defence</th>\n            </tr>\n            <tr v-for=\"i in Math.max(players.ld.length, players.rd.length)\">\n                <td v-if=\"i-1 < players.ld.length\"\n                :class=\"players.ld[i-1].class\" \n                @click=\"selectPlayer(players.ld[i-1].id)\">\n                {{players.ld[i-1].name+' '+players.ld[i-1].overall}}</td>\n                <td v-else></td>\n                \n                <td v-if=\"i-1 < players.rd.length\"\n                :class=\"players.rd[i-1].class\" \n                @click=\"selectPlayer(players.rd[i-1].id)\">\n                {{players.rd[i-1].name+' '+players.rd[i-1].overall}}</td>\n                <td v-else></td>\n            </tr>\n        </table>\n        <table>\n            <tr>\n                <th :style=\"{'color': colour().light}\">Goalies</th>\n            </tr>\n            <tr v-for=\"i in players.g.length\">\n                <td v-if=\"i-1 < players.g.length\" \n                :class=\"players.g[i-1].class\" \n                @click=\"selectPlayer(players.g[i-1].id)\">\n                {{players.g[i-1].name+' '+players.g[i-1].overall}}</td>\n                <td v-else></td>\n            </tr>\n        </table>\n    </div>\n    ",
        data: function data() {
          return {
            gameInfo: Vue.prototype.$gameInfo,
            players: this.teamPlayers(),
            lines: this.lineGen('init'),
            selectedId: false,
            alert: false,
            specialTeams: this.changeSpecial('init'),
            league: 'onehl'
          };
        },
        methods: {
          teamPlayers: function teamPlayers(state) {
            var players = {
              'lw': [],
              'c': [],
              'rw': [],
              'ld': [],
              'rd': [],
              'g': []
            };

            if (this.league === undefined) {
              var league = 'onehl';
              var team = Vue.prototype.$gameInfo.player.team;
            } else {
              var league = this.league;
              var leagueConvert = {
                onehl: '1',
                twohl: '2',
                thrhl: '3'
              };
              var team = leagueConvert[league] + Vue.prototype.$gameInfo.player.team.toString().slice(1, 3);
            }

            for (var curPlayer in Vue.prototype.$teams[league][team].players) {
              var player = Vue.prototype.$players[Vue.prototype.$teams[league][team].players[curPlayer]];
              players[player.position].push({
                'id': player.id,
                'name': player.name().abb,
                'position': player.position,
                'overall': player.overall()
              });
            }

            this.players = players;

            for (var position in players) {
              players[position] = players[position].sort(function (a, b) {
                return a.overall - b.overall;
              }).reverse();
            }

            return players;
          },
          lineGen: function lineGen(state) {
            var players = this.players;

            if (this.league === undefined) {
              var league = 'onehl';
              var team = Vue.prototype.$gameInfo.player.team;
            } else {
              var league = this.league;
              var leagueConvert = {
                onehl: '1',
                twohl: '2',
                thrhl: '3'
              };
              var team = leagueConvert[league] + Vue.prototype.$gameInfo.player.team.toString().slice(1, 3);
            }

            if (state === 'init') {
              var lines = JSON.parse(JSON.stringify(Vue.prototype.$teams[league][team].lines.v55));
              lines.g = JSON.parse(JSON.stringify(Vue.prototype.$teams[league][team].lines.g));
            } else {
              var lines = state.v55;
              lines.g = state.g;
            }

            var lineReturn = {
              'lw': [],
              'c': [],
              'rw': [],
              'ld': [],
              'rd': [],
              'g': []
            };
            var pos = ['lw', 'c', 'rw', 'ld', 'rd', 'g'];
            var poslen = {
              'lw': players.lw.length,
              'c': players.c.length,
              'rw': players.rw.length,
              'ld': players.ld.length,
              'rd': players.rd.length,
              'g': players.g.length
            };
            pos.forEach(function (position) {
              for (var lineNum = 0; lineNum < lines[position].length; lineNum++) {
                var player = Vue.prototype.$players[lines[position][lineNum]];

                try {
                  lineReturn[position].push({
                    'name': player.name().abb,
                    'overall': player.overall(),
                    'class': '',
                    'id': player.id,
                    'position': player.position
                  });
                } catch (_unused8) {
                  lineReturn[position].push({
                    'name': 'Empty',
                    'overall': ''
                  });
                } //Empty Slot

              }

              for (var lineNum = 0; lineNum < poslen[position]; lineNum++) {
                players[position][lineNum]["class"] = '';
              }
            });
            this.players = players;
            this.lines = lineReturn;
            return lineReturn;
          },
          selectPlayer: function selectPlayer(id) {
            var players = this.players;
            var lines = this.lines;
            var pos = ['lw', 'c', 'rw', 'ld', 'rd', 'g'];
            var poslen = {
              'lw': players.lw.length,
              'c': players.c.length,
              'rw': players.rw.length,
              'ld': players.ld.length,
              'rd': players.rd.length,
              'g': players.g.length
            };
            pos.forEach(function (position) {
              for (var lineNum = 0; lineNum < poslen[position]; lineNum++) {
                try {
                  lines[position][lineNum]["class"] = '';
                } catch (_unused9) {}

                try {
                  players[position][lineNum]["class"] = '';
                } catch (_unused10) {}

                try {
                  if (id === lines[position][lineNum].id) {
                    lines[position][lineNum]["class"] = 'roster-lines-selected-player';
                  }
                } catch (_unused11) {}

                if (id === players[position][lineNum].id) {
                  players[position][lineNum]["class"] = 'roster-lines-selected-player';
                }
              }
            });
            this.players = players;
            this.lines = lines;
            this.selectedId = id;
          },
          swapPlayer: function swapPlayer(position, line) {
            if (!this.selectedId) {
              return;
            }

            var player = Vue.prototype.$players[this.selectedId];
            var lines = this.lines;
            var skaters = ['lw', 'c', 'rw', 'ld', 'rd'];

            if (skaters.includes(position) === skaters.includes(player.position)) {
              lines[position][line] = {
                'name': player.name().abb,
                'overall': player.overall(),
                'class': '',
                'id': player.id,
                'position': player.position
              };
              this.lines = lines;
              this.alert = false;
              this.$forceUpdate();
            } else {
              this.alert = 'Can\'t switch players and goalies';
            }
          },
          changeSpecial: function changeSpecial(type, id) {
            if (this.league === undefined) {
              var league = 'onehl';
              var team = Vue.prototype.$gameInfo.player.team;
            } else {
              var league = this.league;
              var leagueConvert = {
                onehl: '1',
                twohl: '2',
                thrhl: '3'
              };
              var team = leagueConvert[league] + Vue.prototype.$gameInfo.player.team.toString().slice(1, 3);
            }

            if (type === 'init') {
              var players = Vue.prototype.$teams[league][team].lines.specialTeams;
              this.specialTeams = {
                pp: {
                  count: 10,
                  players: players.pp,
                  max: 10
                },
                pk: {
                  count: 8,
                  players: players.pk,
                  max: 8
                }
              };
              return {
                pp: {
                  count: 10,
                  players: players.pp,
                  max: 10
                },
                pk: {
                  count: 8,
                  players: players.pk,
                  max: 8
                }
              };
            } else {
              if (this.specialTeams[type].players.includes(id)) {
                this.specialTeams[type].count -= 1;
                this.specialTeams[type].players = this.specialTeams[type].players.filter(function (pid) {
                  return pid != id;
                });
              } else {
                this.specialTeams[type].count += 1;
                this.specialTeams[type].players.push(id);
              }
            }
          },
          checkSpecialClass: function checkSpecialClass(type, id) {
            if (this.specialTeams[type].players.includes(id)) {
              return 'roster-lines-special-selected ';
            } else {
              return 'roster-lines-special-unselected ';
            }
          },
          saveLines: function saveLines() {
            if (this.league === undefined) {
              var league = 'onehl';
              var team = Vue.prototype.$gameInfo.player.team;
            } else {
              var league = this.league;
              var leagueConvert = {
                onehl: '1',
                twohl: '2',
                thrhl: '3'
              };
              var team = leagueConvert[league] + Vue.prototype.$gameInfo.player.team.toString().slice(1, 3);
            }

            var lines = this.lines;
            var pos = ['lw', 'c', 'rw', 'ld', 'rd', 'g'];
            var lineReturn = {
              'lw': [],
              'c': [],
              'rw': [],
              'ld': [],
              'rd': [],
              'g': []
            };
            var duplicatePlayers = {};
            var noDupes = true;
            var goodSpecialCount = true;
            pos.forEach(function (position) {
              for (var lineNum = 0; lineNum < lines[position].length; lineNum++) {
                lineReturn[position].push(lines[position][lineNum].id);

                if (lines[position][lineNum].id in duplicatePlayers) {
                  noDupes = false;
                }

                duplicatePlayers[lines[position][lineNum].id] = 1;
              }
            });

            if (this.specialTeams.pk.count !== this.specialTeams.pk.max | this.specialTeams.pp.count !== this.specialTeams.pp.max) {
              goodSpecialCount = false;
            }

            if (noDupes & goodSpecialCount) {
              var newv55 = {
                lw: [],
                c: [],
                rw: [],
                ld: [],
                rd: []
              };

              for (var position in newv55) {
                for (var player in this.lines[position]) {
                  newv55[position].push(this.lines[position][player].id);
                }
              }

              var newGoalies = [this.lines.g[0].id, this.lines.g[1].id];
              this.alert = false;
              var special = {
                pp: this.specialTeams.pp.players,
                pk: this.specialTeams.pk.players
              };
              Vue.prototype.$teams[league][team].generateLines(newv55, special, newGoalies);
              Vue.prototype.$teams[league][team].lines.specialTeams = special;
              this.alert = 'Saved';
            } else {
              if (!noDupes) {
                this.alert = 'Can\'t have multiple lines with same player';
              } else if (!goodSpecialCount) {
                this.alert = 'There should be 10 PP and 8 PK players selected';
              }
            }
          },
          suggestedLines: function suggestedLines() {
            var leagueConvert = {
              onehl: '1',
              twohl: '2',
              thrhl: '3'
            };
            var team = leagueConvert[this.league] + Vue.prototype.$gameInfo.player.team.toString().slice(1, 3);
            var playerCount = {
              skater: 0,
              goalie: 0
            };

            for (var p = 0; p < Vue.prototype.$teams[this.league][team].players.length; p++) {
              var id = Vue.prototype.$teams[this.league][team].players[p];

              if (Vue.prototype.$players[id].position === 'g') {
                playerCount.goalie += 1;
              } else {
                playerCount.skater += 1;
              }
            }

            if (playerCount.skater >= 18 && playerCount.goalie >= 2) {
              var gen = Vue.prototype.$teams[this.league][team].generateLines(false, false, false);
              var lines = this.lineGen(gen);
              this.lines = lines;
              this.specialTeams = {
                pp: {
                  count: 10,
                  players: gen.specialTeams.pp,
                  max: 10
                },
                pk: {
                  count: 8,
                  players: gen.specialTeams.pk,
                  max: 8
                }
              };
            } else {
              this.alert = 'Not Enough Players on Team, need 18 skaters and 2 goalies';
            }
          }
        }
      },
      negotiateContract: {
        mixins: [gMixin],
        template: "\n    <div>\n        <div v-if=\"available\">\n            <p>{{player.fullName}}</p>\n            <p>Length 1-8 years</p>\n            <p>Cap 1M - 15M</p>\n            <a @click=\"addressChange('player',player.id,{})\">Player Page</a>\n            <p>{{'Ask: '+ask.cap+'M x'+ask.years+' years'}}</p>\n            <input v-model=\"offer.cap\" type=\"number\">M</input>\n            <input v-model=\"offer.years\" type=\"number\">years</input>\n            <a @click=\"offerContract()\">Offer</a>\n            <p v-if=\"alert !== false\">{{alert}}</p>\n        </div>\n        <div v-else>\n            <p>This player is not available to negotiate with</p>\n        </div>\n    </div>\n    ",
        data: function data() {
          var pid = Vue.prototype.$gameInfo.page.sub.split('-')[1];
          var player = Vue.prototype.$players[pid];
          var available = true;
          var playerTeam = player.team.toString().slice(1, 3);
          var userTeam = Vue.prototype.$gameInfo.player.team.toString().slice(1, 3);

          if (Object.keys(player.newContract).length > 0 || playerTeam !== userTeam & playerTeam !== '') {
            var available = false;
          }

          if (player.contract.years > 1) {
            player = [];
          }

          return {
            player: player,
            ask: player.desiredContract(),
            offer: {
              years: 1,
              cap: 1
            },
            alert: false,
            available: available
          };
        },
        methods: {
          offerContract: function offerContract() {
            var success = true;
            var interest = 100;
            interest -= Math.abs(this.ask.years - this.offer.years) * Math.pow(6, 1.1);
            interest += (this.offer.cap - this.ask.cap) * Math.pow(5, 1.1);

            if (parseInt(this.offer.years) !== parseFloat(this.offer.years)) {
              this.alert = 'Invalid number of years';
              success = false;
            } else if (this.offer.years > 8) {
              this.alert = 'The maximum contract length is 8 years';
              success = false;
            } else if (this.offer.years < 1) {
              this.alert = 'Contracts can\'t last 0 years';
              success = false;
            } else if (this.offer.cap > 15) {
              this.alert = 'The maximum contract cap is 12.5M';
              success = false;
            } else if (this.offer.cap < 1) {
              this.alert = 'The minimum contract cap is 0.5M';
              success = false;
            }

            if (success & interest > 90 && Vue.prototype.$events.freeAgency.day === 'season') {
              this.alert = 'Contract Accepted';
              var player = Vue.prototype.$players[this.player.id];

              if (player.contract.years === 0) {
                Vue.prototype.$players[this.player.id].contract = {
                  cap: parseFloat(this.offer.cap),
                  years: parseInt(this.offer.years)
                };
                player.switchTeam(Vue.prototype.$gameInfo.player.team);
                this.newNews('contract', Vue.prototype.$players[player.id]);
              } else {
                player.newContract = {
                  cap: parseFloat(this.offer.cap),
                  years: parseInt(this.offer.years)
                };
                this.newNews('extension', Vue.prototype.$players[player.id]);
              }
            } else if (Vue.prototype.$events.freeAgency.day !== 'season') {
              this.alert = 'Contract will be considered';

              if (typeof Vue.prototype.$events.freeAgency[this.player.id] === 'undefined') {
                Vue.prototype.$events.freeAgency[this.player.id] = [];
              }

              Vue.prototype.$events.freeAgency[this.player.id][Vue.prototype.$gameInfo.player.team] = {
                cap: parseFloat(this.offer.cap),
                years: parseInt(this.offer.years)
              };
            } else {
              this.alert = 'Contract Rejected';
            }
          }
        }
      },
      freeAgentPage: {
        mixins: [gMixin],
        template: "\n    <div>\n    <p>Free Agents</p>\n    <div class=\"horizontal-buttons stats-filter\">\n        <a @click=\"currentTable = 'stats';      tableDisplay(currentTable)\" :style=\"{'background': colour().main}\">Stats</a>\n        <a @click=\"currentTable = 'attributes'; tableDisplay(currentTable)\" :style=\"{'background': colour().main}\">Attributes</a>\n        <a @click=\"htmlDisplay.filter = !htmlDisplay.filter\" class=\"light-text\" :style=\"{'background': colour().light}\">Filter</a>\n    </div>\n    <div v-if=\"htmlDisplay.filter\" style=\"display: inline-block; height: 30px\">\n        <a @click=\"htmlDisplay.positions = !htmlDisplay.positions\" class=\"stats-page-filter-button hover-text\">Positions</a>\n    </div>\n\n\n    <div v-if=\"htmlDisplay.positions & htmlDisplay.filter\" class=\"stats-page-filter-container\">\n        <p  v-for=\"position in ['lw','c','rw','ld','rd','g']\"\n            :style=\"positionStyle(position)\"\n            @click=\"filterPositions(position)\">\n            {{position.toUpperCase()}}\n        </p>\n    </div>\n    \n    \n    <div class=\"stats-page-container\">\n        <a @click=\"setScope('start')\" class=\"scope-change\" :style=\"{'background': colour().main}\"> << </a> \n        <a @click=\"setScope('backward')\" class=\"scope-change light\" :style=\"{'background': colour().light}\"> < </a> \n        <div class=\"table-scroll\">\n            <table class=\"stats-page-table\">\n                <tr>\n                    <th>#</th>\n                    <th v-for=\"i in table.header\" @click=\"changeSort(i)\">\n                        <p class=\"stats-table-header\">{{i}}</p>\n                    </th>\n                </tr>\n                <tr v-for=\"(player, i) in players\" \n                @click=\"selectedPlayer = player; htmlDisplay.selectedPlayer = true\" class=\"hover-hand\">\n                    <td>{{scope[0]+1+i}}</td>\n                    <td>{{player.name}}</td>\n                    <td>{{player.position.toUpperCase()}}</td>\n                    <td v-for=\"stat in table.row\">{{player[stat]}}</td>\n                </tr>\n            </table>\n        </div>\n        <a @click=\"setScope('forward')\" class=\"scope-change light\" :style=\"{'background': colour().light}\"> > </a>\n    </div>\n\n    <div v-if=\"htmlDisplay.selectedPlayer\" class=\"selected-bar\">\n        <p>{{selectedPlayer.overall}}</p>\n        <p>{{selectedPlayer.name}}</p>\n        <div class=\"horizontal-buttons\">\n            <a @click=\"addressChange('player',selectedPlayer.id)\"\n            :style=\"{'background': colour().main}\">Player Page</a>\n            <a @click=\"addressChange('roster','negotiate-'+selectedPlayer.id)\"\n            :style=\"{'background': colour().main}\">New Contract</a>\n            <a @click=\" htmlDisplay.selectedPlayer=false\"\n            :style=\"{'background': colour().main}\">X</a>\n        </div>\n    </div>\n    </div>\n    ",
        data: function data() {
          return {
            table: this.tableDisplay('stats'),
            players: this.filteredPlayers(['lw', 'c', 'rw', 'ld', 'rd'], 'points', true, [0, 10]),
            positions: ['lw', 'c', 'rw', 'ld', 'rd'],
            sortedBy: 'overall',
            sortedPositively: true,
            scope: [0, 10],
            htmlDisplay: {
              filter: false,
              positions: false,
              selectedPlayer: false
            },
            selectedPlayer: {},
            currentTable: 'stats'
          };
        },
        methods: {
          updatePlayers: function updatePlayers() {
            this.players = this.filteredPlayers(this.positions, this.sortedBy, this.sortedPositively, this.scope);

            if (this.players.length === 0) {
              this.scope = [this.scope[0] - 10, this.scope[1] - 10];
            }

            this.players = this.filteredPlayers(this.positions, this.sortedBy, this.sortedPositively, this.scope);
          },
          filterPositions: function filterPositions(position) {
            if (position === 'g') {
              this.positions = ['g'];
              this.tableDisplay(this.currentTable);
            } else if (this.positions.includes(position)) {
              this.positions = this.positions.filter(function (pos) {
                return pos !== position;
              });
              this.positions = this.positions.filter(function (pos) {
                return pos !== 'g';
              });
            } else {
              this.positions.push(position);
              this.positions = this.positions.filter(function (pos) {
                return pos !== 'g';
              });
            }

            this.updatePlayers();
          },
          filteredPlayers: function filteredPlayers(positions, sortedBy, sortedPositively, scope) {
            var season = Vue.prototype.$gameInfo.time.season;
            var league = 'freeAgents';

            function getFreeAgents() {
              var freeAgents = [];

              for (var n in Vue.prototype.$players[league]) {
                var pid = Vue.prototype.$players[league][n];
                var player = Vue.prototype.$players[pid];
                freeAgents.push({
                  id: player.id,
                  name: player.fullName,
                  age: player.age,
                  position: player.position,
                  team: player.team,
                  teamName: player.teamName().abb,
                  overall: player.overall(),
                  gamesPlayed: player.stats[season].gamesPlayed,
                  points: player.stats[season].points,
                  goals: player.stats[season].goals,
                  assists: player.stats[season].assists,
                  shots: player.stats[season].shots,
                  pim: player.stats[season].pim,
                  savePctg: player.stats[season].savePctg,
                  gaa: player.stats[season].gaa,
                  saves: player.stats[season].saves,
                  goalsAgainst: player.stats[season].goalsAgainst
                });
                freeAgents[n] = Object.assign({}, freeAgents[n], player.attributes);
              }

              return freeAgents;
            }

            function filterPlayers(players, positions) {
              players = players.filter(function (player) {
                return positions.includes(player.position);
              });
              return players;
            }

            var players = filterPlayers(getFreeAgents(), positions);
            players = players.sort(function (a, b) {
              return a[sortedBy] - b[sortedBy];
            });

            if (sortedPositively) {
              players = players.reverse();
            }

            players = players.slice(scope[0], scope[1]);
            return players;
          },
          setScope: function setScope(direction) {
            if (direction === 'start') {
              this.scope = [0, 10];
            } else if (direction === 'forward') {
              this.scope = [this.scope[0] + 10, this.scope[1] + 10];
            } else if (direction === 'backward') {
              this.scope = [this.scope[0] - 10, this.scope[1] - 10];
            }

            if (this.scope[0] < 0) {
              this.scope = [0, 10];
            }

            this.updatePlayers();
          },
          tableDisplay: function tableDisplay(type) {
            var table = {
              header: [],
              row: []
            };

            try {
              if (this.positions[0] === 'g') {
                var goalie = true;
              } else {
                var goalie = false;
              }
            } catch (_unused12) {
              var goalie = false;
            }

            if (type === 'stats') {
              if (goalie) {
                table.header = ['Name', 'Pos', 'Age', 'Overall', 'GP', 'Sv%', 'GAA', 'Svs', 'GA'];
                table.row = ['age', 'overall', 'gamesPlayed', 'savePctg', 'gaa', 'saves', 'goalsAgainst'];
              } else {
                table.header = ['Name', 'Pos', 'Age', 'Ovr', 'GP', 'PTS', 'G', 'A', 'Sht', 'PIM'];
                table.row = ['age', 'overall', 'gamesPlayed', 'points', 'goals', 'assists', 'shots', 'pim'];
              }
            }

            if (type === 'attributes') {
              if (goalie) {
                table.header = ['Name', 'Pos', 'Age', 'Overall', 'Glove', 'Blocker', 'Pads', 'Rebounds', 'Puck', 'Reflexes', 'Strength', 'Stamina', 'IQ', 'Work', 'Confidence'];
                table.row = ['age', 'overall', 'glove', 'blocker', 'pads', 'rebounds', 'puck', 'reflex', 'strength', 'stamina', 'iq', 'work', 'confidence'];
              } else {
                table.header = ['Name', 'Pos', 'Age', 'OIQ', 'Wrist', 'Slap', 'Hands', 'DIQ', 'Stickwork', 'Blocking', 'Hitting', 'Skating', 'Passing', 'Hand Eye', 'Face Off', 'Strength', 'Stamina', 'Hustle', 'Discipline'];
                table.row = ['age', 'oiq', 'wrist', 'slap', 'hands', 'diq', 'stick', 'blocking', 'hitting', 'skating', 'passing', 'handEye', 'faceOff', 'strength', 'stamina', 'hustle', 'discipline'];
              }
            }

            this.table = table;
            return table;
          },
          positionStyle: function positionStyle(position) {
            if (this.positions.includes(position)) {
              return {
                'font-weight': 'bold'
              };
            } else {
              return {
                'color': '#dddddd'
              };
            }
          },
          changeSort: function changeSort(type) {
            type = this.table.row[this.table.header.indexOf(type) - 2];

            if (type === this.sortedBy) {
              this.sortedPositively = !this.sortedPositively;
            }

            this.sortedBy = type;
            this.updatePlayers();
          }
        }
      }
    };
  }, {
    "../scripts/main.js": 14
  }],
  8: [function (require, module, exports) {
    var gMixin = require('../scripts/main.js');

    module.exports = {
      schedulePage: {
        mixins: [gMixin],
        template: "\n    <div class=\"schedule\">\n        <div class=\"horizontal-buttons\">\n            <a @click=\"league = 'onehl'\" :style=\"{'background': colour().main}\">1HL</a>\n            <a @click=\"league = 'twohl'\" :style=\"{'background': colour().main}\">2HL</a>\n            <a @click=\"league = 'thrhl'\" :style=\"{'background': colour().main}\">3HL</a>\n        </div>\n        <div class=\"schedule-legend\">\n            <div>\n            <p>Current Date</p>\n            <div class=\"schedule-legend-block schedule-current-date\"></div>\n            </div>\n            <div>\n            <p>Selected Date</p>\n            <div class=\"schedule-legend-block schedule-selected-date\"></div>\n            </div>\n            <div>\n            <p>Special Event</p>\n            <div class=\"schedule-legend-block schedule-special-date\"></div>\n            </div>\n        </div>\n        <p>{{prettyDate(date.split)}}</p>\n        <div class=\"schedule-container\">\n            <a @click=\"scan('back')\" class=\"schedule-arrow light-text\" :style=\"{'background': colour().light}\"> < </a>\n            <table class=\"schedule-calendar\">\n                <tr>\n                    <th>Sun</th>\n                    <th>Mon</th>\n                    <th>Tue</th>\n                    <th>Wed</th>\n                    <th>Thu</th>\n                    <th>Fri</th>\n                    <th>Sat</th>\n                </tr>\n                <tr v-for=\"week in 6\" v-if=\"(((week-1)*7))-date.datePos <= date.month[date.split.month].length-1\">\n                    <td \n                    v-for=\"day in 7\"\n                    v-if=\"(((week-1)*7)+day)-date.datePos <= date.month[date.split.month].length & (((week-1)*7)+day)-date.datePos > 0\"\n                    @click=\"selectDate(((week-1)*7)+day-date.datePos)\"\n                    :class=\"dateInfo(((week-1)*7)+day-date.datePos).className\"\n                    v-html=\"dateInfo(((week-1)*7)+day-date.datePos).html\">\n                    </td>\n    \n                    <td v-else></td>\n                </tr>\n            </table>\n            <a @click=\"scan('forward')\" class=\"schedule-arrow light-text\" :style=\"{'background': colour().light}\"> > </a>\n        </div>\n        <p v-if=\"alert !== false\">{{alert}}</p>\n        <div class=\"selected-bar selected-bar-bottom\">\n            <div class=\"horizontal-buttons\">\n                <a @click=\"simButton()\" :style=\"{'background': colour().main}\">Sim To Date</a>\n                <a v-if=\"checkGame(selectedDate).display\" :style=\"{'background': colour().main}\"\n                @click=\"addressChange('game',league+'-'+checkGame(selectedDate).display,{})\">View Game</a>\n            </div>\n        </div>\n    </div>\n    ",
        data: function data() {
          var split = JSON.parse(JSON.stringify(Vue.prototype.$gameInfo.time.date));
          return {
            gameInfo: Vue.prototype.$gameInfo,
            league: 'onehl',
            selectedDate: 4,
            alert: false,
            date: {
              'split': split,
              'datePos': this.datePosition(split),
              'month': {
                1: {
                  'name': 'January',
                  'length': 31
                },
                2: {
                  'name': 'February',
                  'length': 28
                },
                3: {
                  'name': 'March',
                  'length': 31
                },
                4: {
                  'name': 'April',
                  'length': 30
                },
                5: {
                  'name': 'May',
                  'length': 31
                },
                6: {
                  'name': 'June',
                  'length': 30
                },
                7: {
                  'name': 'July',
                  'length': 31
                },
                8: {
                  'name': 'August',
                  'length': 31
                },
                9: {
                  'name': 'September',
                  'length': 30
                },
                10: {
                  'name': 'October',
                  'length': 31
                },
                11: {
                  'name': 'November',
                  'length': 30
                },
                12: {
                  'name': 'December',
                  'length': 31
                }
              }
            }
          };
        },
        methods: {
          dateInfo: function dateInfo(date) {
            try {
              var league = this.league;
            } catch (_unused13) {
              var league = 'onehl';
            }

            var team = this.teamConvert(league, Vue.prototype.$gameInfo.player.team);
            var games = Vue.prototype.$schedule.teams[league][team];
            var currentTime = Vue.prototype.$gameInfo.time.date;

            if (date == currentTime.day & this.date.split.month === currentTime.month & this.date.split.year === currentTime.year) {
              var clas = 'schedule-current-date';
            } else if (date == this.selectedDate) {
              var clas = 'schedule-selected-date';
            } else {
              var clas = '';
            } // Used to mark events on calendar


            if (this.sameObject({
              day: date,
              month: this.date.split.month
            }, {
              day: 1,
              month: 9
            })) {
              if (clas === '') {
                clas = 'schedule-special-date';
              }

              return {
                html: "<p>" + date + "</p>" + "<p>Pre</p><p>Season</p>",
                className: clas
              };
            }

            if (this.sameObject({
              day: date,
              month: this.date.split.month
            }, {
              day: 1,
              month: 10
            })) {
              if (clas === '') {
                clas = 'schedule-special-date';
              }

              return {
                html: "<p>" + date + "</p>" + "<p>Regular</p><p>Season</p>",
                className: clas
              };
            }

            if (this.sameObject({
              day: date,
              month: this.date.split.month
            }, {
              day: 14,
              month: 1
            })) {
              if (clas === '') {
                clas = 'schedule-special-date';
              }

              return {
                html: "<p>" + date + "</p>" + "<p>Trade</p><p>Deadline</p>",
                className: clas
              };
            } else if (this.sameObject({
              day: date,
              month: this.date.split.month
            }, {
              day: 27,
              month: 6
            })) {
              if (clas === '') {
                clas = 'schedule-special-date';
              }

              return {
                html: "<p>" + date + "</p>" + "<p>Draft</p>",
                className: clas
              };
            } else if (this.sameObject({
              day: date,
              month: this.date.split.month
            }, {
              day: 1,
              month: 4
            })) {
              if (clas === '') {
                clas = 'schedule-special-date';
              }

              return {
                html: "<p>" + date + "</p>" + "<p>Round</p><p>One</p>",
                className: clas
              };
            } else if (this.sameObject({
              day: date,
              month: this.date.split.month
            }, {
              day: 20,
              month: 4
            })) {
              if (clas === '') {
                clas = 'schedule-special-date';
              }

              return {
                html: "<p>" + date + "</p>" + "<p>Round</p><p>Two</p>",
                className: clas
              };
            } else if (this.sameObject({
              day: date,
              month: this.date.split.month
            }, {
              day: 10,
              month: 5
            })) {
              if (clas === '') {
                clas = 'schedule-special-date';
              }

              return {
                html: "<p>" + date + "</p>" + "<p>Round</p><p>Three</p>",
                className: clas
              };
            } else if (this.sameObject({
              day: date,
              month: this.date.split.month
            }, {
              day: 1,
              month: 6
            })) {
              if (clas === '') {
                clas = 'schedule-special-date';
              }

              return {
                html: "<p>" + date + "</p>" + "<p>Round</p><p>Four</p>",
                className: clas
              };
            } else if (this.sameObject({
              day: date,
              month: this.date.split.month
            }, {
              day: 1,
              month: 7
            })) {
              if (clas === '') {
                clas = 'schedule-special-date';
              }

              return {
                html: "<p>" + date + "</p>" + "<p>Free</p><p>Agency</p>",
                className: clas
              };
            }

            for (var game in games) {
              var day = Vue.prototype.$schedule.id[league][games[game]].date;

              if (day.day === date & day.month === this.date.split.month & day.year === this.date.split.year) {
                var sGame = Vue.prototype.$schedule.id[league][games[game]];
                var team = this.teamConvert(league, Vue.prototype.$gameInfo.player.team);

                if (sGame.home == team) {
                  var info = 'vs ' + Vue.prototype.$teams[league][sGame.away].name.abb;
                  var score = sGame.summary.score.home + '-' + sGame.summary.score.away;

                  if (score === '0-0') {
                    score = '';
                  }
                } else {
                  var info = '@ ' + Vue.prototype.$teams[league][sGame.home].name.abb;
                  var score = sGame.summary.score.away + '-' + sGame.summary.score.home;

                  if (score === '0-0') {
                    score = '';
                  }
                }

                if (sGame.summary.extraTime == 'ot') {
                  score += ' OT';
                } else if (sGame.summary.extraTime == 'so') {
                  score += ' SO';
                }

                return {
                  html: "<p>" + date + "</p><p>" + info + "</p><p>" + score + "<p>",
                  className: clas
                };
              }
            }

            return {
              html: "<p>" + date + "</p>",
              className: clas
            };
          },
          checkGame: function checkGame(date) {
            try {
              var league = this.league;
            } catch (_unused14) {
              var league = 'onehl';
            }

            var gameInfo = {
              display: false
            };
            var dateGames = Vue.prototype.$schedule.dates[league][date + '-' + this.date.split.month + '-' + this.date.split.year];

            for (var item in dateGames) {
              var game = Vue.prototype.$schedule.id[league][dateGames[item]];

              if (game.home == this.teamConvert(league, Vue.prototype.$gameInfo.player.team) || game.away == this.teamConvert(league, Vue.prototype.$gameInfo.player.team)) {
                gameInfo.display = game.id;
              }
            }

            return gameInfo;
          },
          datePosition: function datePosition(date) {
            //finds what day the first of the month is
            var yearCode = parseInt(date.year.toString().slice(2, 4));
            yearCode += Math.floor(yearCode / 4);
            yearCode %= 7;
            var monthGuide = [0, 3, 3, 6, 1, 4, 6, 2, 5, 0, 3, 5];
            var monthCode = monthGuide[parseInt(date['month']) - 1];
            var centuryGuide = {
              19: 0,
              20: 6,
              21: 4,
              22: 2,
              23: 0
            };
            var centuryCode = centuryGuide[parseInt(date.year.toString().slice(0, 2))];
            var datePos = (yearCode + monthCode + centuryCode + 1) % 7 % 7 % 7;

            try {
              this.date.datePos = datePos;
            } catch (_unused15) {} //So it doesn't run first time


            return datePos;
          },
          scan: function scan(direction) {
            if (direction === 'forward') {
              var d = this.date.split;

              if (d['month'] === 12) {
                d['month'] = 1;
                d['year'] = parseInt(d['year']) + 1;
              } else {
                d['month'] = parseInt(d['month']) + 1;
              }

              this.datePosition(d);
            } else if (direction === 'back') {
              var d = this.date.split;

              if (d['month'] === 1) {
                d['month'] = 12;
                d['year'] = parseInt(d['year']) - 1;
              } else {
                d['month'] = parseInt(d['month']) - 1;
              }

              this.datePosition(d);
            }
          },
          checkLines: function checkLines() {
            if ([9, 10, 11, 12, 1, 2, 3, 4, 5].includes(this.date.split.month) || this.date.split.month === 6 && this.date.split.day < 15) {
              var userTeam = Vue.prototype.$gameInfo.player.team.toString();

              if (!Vue.prototype.$teams.onehl[userTeam].checkLineValidity()) {
                return '1HL lines are not valid';
              } else if (!Vue.prototype.$teams.twohl['2' + userTeam.slice(1)].checkLineValidity()) {
                return '2HL lines are not valid';
              } else if (!Vue.prototype.$teams.thrhl['3' + userTeam.slice(1)].checkLineValidity()) {
                return '3HL lines are not valid';
              } else {
                return true;
              }
            } else {
              return true;
            }
          },
          selectDate: function selectDate(date) {
            this.selectedDate = date;
            this.alert = false;
          },
          simButton: function simButton() {
            var endDate = {
              'day': this.selectedDate,
              'month': this.date.split.month,
              'year': this.date.split.year
            };
            var currentDate = JSON.parse(JSON.stringify(Vue.prototype.$gameInfo.time.date));

            if (this.laterDate(currentDate, endDate)) {
              this.alert = "Can't sim backwards";
              return;
            } else if (this.checkLines() !== true) {
              this.alert = this.checkLines();
              return;
            }

            var returnedDate = JSON.parse(JSON.stringify(this.simToDate(endDate)));
            this.date.split.day = returnedDate.day;
            this.date.split.month = returnedDate.month;
            this.date.split.year = returnedDate.year;
          }
        }
      }
    };
  }, {
    "../scripts/main.js": 14
  }],
  9: [function (require, module, exports) {
    var gMixin = require('../scripts/main.js');

    module.exports = {
      scoutingPage: {
        mixins: [gMixin],
        template: "\n    <div>\n        <a class=\"horizontal-button\" :style=\"{'background':colour().main}\" @click=\"addressChange('scouting','all',{})\">View All Prospects</a>\n        \n        <div class=\"scouting-page-region\"><p>Canada</p></div>\n        <input class=\"scouting-page-input\" type=\"number\" v-model=\"proportion.canada\" @input=\"spareCalc()\"><p class=\"inline\">%</p>\n        <a class=\"horizontal-button\" :style=\"{'background':colour().main}\" @click=\"addressChange('scouting','canada',{})\">Players</a></input>\n        \n        <div class=\"scouting-page-region\"><p>United States</p></div>\n        <input class=\"scouting-page-input\" type=\"number\" v-model=\"proportion.states\" @input=\"spareCalc()\"><p class=\"inline\">%</p>\n        <a class=\"horizontal-button\" :style=\"{'background':colour().main}\" @click=\"addressChange('scouting','states',{})\">Players</a></input>\n        \n        <div class=\"scouting-page-region\"><p>Eastern Europe</p><p>Russia, Lativia, Ukraine, Belarus</p></div>\n        <input class=\"scouting-page-input\" type=\"number\" v-model=\"proportion.easternEurope\" @input=\"spareCalc()\"><p class=\"inline\">%</p>\n        <a class=\"horizontal-button\" :style=\"{'background':colour().main}\" @click=\"addressChange('scouting','easternEurope',{})\">Players</a></input>\n        \n        <div class=\"scouting-page-region\"><p>Western/Central Europe</p><p>Czech, Slovakia, Germany, France, Switzerland</p></div>\n        <input class=\"scouting-page-input\" type=\"number\" v-model=\"proportion.europe\" @input=\"spareCalc()\"><p class=\"inline\">%</p>\n        <a class=\"horizontal-button\" :style=\"{'background':colour().main}\" @click=\"addressChange('scouting','europe',{})\">Players</a></input>\n        \n        <div class=\"scouting-page-region\"><p>Scandanavia</p><p>Sweden, Finland, Norway</p></div>\n        <input class=\"scouting-page-input\" type=\"number\" v-model=\"proportion.scandanavia\" @input=\"spareCalc()\"><p class=\"inline\">%</p>\n        <a class=\"horizontal-button\" :style=\"{'background':colour().main}\" @click=\"addressChange('scouting','scandanavia',{})\">Players</a></input>\n        \n        <div class=\"scouting-page-region\"><p>Rest of World</p><p>Asia, South America, Africa, Australia</p></div>\n        <input class=\"scouting-page-input\" type=\"number\" v-model=\"proportion.rest\" @input=\"spareCalc()\"><p class=\"inline\">%</p>\n        <a class=\"horizontal-button\" :style=\"{'background':colour().main}\" @click=\"addressChange('scouting','rest',{})\">Players</a></input>\n        \n        <div class=\"scouting-page-region\"><p>Spare</p></div>\n        <p>{{proportion.spare+' %'}}</p>\n        <p v-if=\"alert !== false\">{{alert}}</p>\n        <div class=\"horizontal-buttons\">\n            <a :style=\"{'background':colour().main}\" @click=\"recommendedProportions()\">Recommended</a>\n            <a :style=\"{'background':colour().main}\" @click=\"currentProportions()\">Current</a>\n            <a :style=\"{'background':colour().main}\" @click=\"saveProportions()\">Save</a>\n        </div>\n    </div>\n    ",
        data: function data() {
          var proportion = {
            'spare': 0
          };

          for (var region in Vue.prototype.$gameInfo.scouting) {
            proportion[region] = Vue.prototype.$gameInfo.scouting[region].percentage;
            proportion.spare += Vue.prototype.$gameInfo.scouting[region].percentage;
          }

          proportion.spare = 100 - proportion.spare;
          return {
            gameInfo: Vue.prototype.$gameInfo,
            proportion: proportion,
            alert: false
          };
        },
        methods: {
          saveProportions: function saveProportions() {
            if (this.proportion.spare >= 0) {
              var regions = ['canada', 'states', 'easternEurope', 'europe', 'scandanavia', 'rest'];

              for (var region in regions) {
                Vue.prototype.$gameInfo.scouting[regions[region]].percentage = parseInt(this.proportion[regions[region]]);
              }

              this.alert = 'Scouting saved';
            } else {
              this.alert = 'Total must be 100% or lower';
            }
          },
          recommendedProportions: function recommendedProportions() {
            this.proportion = {
              'canada': 17,
              'states': 17,
              'easternEurope': 17,
              'europe': 17,
              'scandanavia': 16,
              'rest': 16,
              'spare': 0
            };
            this.alert = false;
          },
          spareCalc: function spareCalc() {
            this.proportion.spare = 100;
            var regions = ['canada', 'states', 'easternEurope', 'europe', 'scandanavia', 'rest'];

            for (var region in regions) {
              this.proportion.spare -= this.proportion[regions[region]];
            }

            this.proportion.spare = parseFloat(this.proportion.spare.toFixed(1));
          },
          currentProportions: function currentProportions() {
            var proportion = {
              'spare': 0
            };

            for (var region in Vue.prototype.$gameInfo.scouting) {
              this.proportion[region] = Vue.prototype.$gameInfo.scouting[region].percentage;
              this.proportion.spare += Vue.prototype.$gameInfo.scouting[region].percentage;
            }

            this.proportion.spare = 100 - this.proportion.spare;
          }
        }
      },
      scoutingPlayerPage: {
        mixins: [gMixin],
        template: "\n    <div>\n        <p>{{region}}</p>\n        <div class=\"stats-page-container\">\n            <a @click=\"setScope('start')\" class=\"scope-change\" :style=\"{'background': colour().main}\"> << </a> \n            <a @click=\"setScope('backward')\" class=\"scope-change light\" :style=\"{'background': colour().light}\"> < </a> \n            <div class=\"table-scroll\">\n                <table class=\"stats-page-table\">\n                    <tr>\n                        <th>Rank</th>\n                        <th>Region</th>\n                        <th>Name</th>\n                        <th>Position</th>\n                        <th>Overall</th>\n                        <th>Ceiling</th>\n                        <th>Chance</th>\n                        <th>Certainty</th>\n                    </tr>\n                    <tr v-for=\"(player, n) in players\" @click=\"addressChange('player',player.id,{})\"\n                    class=\"hover-hand\">\n                        <td>{{scope[0]+n+1}}</td>\n                        <td>{{player.teamName().city}}</td>\n                        <td>{{player.fullName}}</td>\n                        <td>{{player.position.toUpperCase()}}</td>\n                        <td>{{player.overall()}}</td>\n                        <td>{{player.potential.ceiling.shownName}}</td>\n                        <td>{{player.potential.chance.shownName}}</td>\n                        <td>{{regionCertainty(player.team)}}</td>\n                    </tr>\n                </table>\n            </div>\n            <a @click=\"setScope('forward')\" class=\"scope-change light\" :style=\"{'background': colour().light}\"> > </a>\n        </div>\n    </div>\n    ",
        data: function data() {
          var region = Vue.prototype.$gameInfo.page.sub;
          return {
            region: region,
            players: this.playerList([0, 10]),
            scope: [0, 10]
          };
        },
        methods: {
          regionCertainty: function regionCertainty(region) {
            var points = Vue.prototype.$gameInfo.scouting[region].points;
            var certainty = '';

            if (points > 80) {
              certainty = 'A';
            } else if (points > 60) {
              certainty = 'B';
            } else if (points > 40) {
              certainty = 'C';
            } else if (points > 20) {
              certainty = 'D';
            } else {
              certainty = 'F';
            }

            return certainty;
          },
          setScope: function setScope(direction) {
            if (direction === 'start') {
              this.scope = [0, 10];
            } else if (direction === 'forward') {
              this.scope = [this.scope[0] + 10, this.scope[1] + 10];
            } else if (direction === 'backward') {
              this.scope = [this.scope[0] - 10, this.scope[1] - 10];
            }

            if (this.scope[0] < 0) {
              this.scope = [0, 10];
            }

            this.players = this.playerList(this.scope);
            this.$forceUpdate();
          },
          playerList: function playerList(scope) {
            var region = Vue.prototype.$gameInfo.page.sub;
            var players = [];

            if (region === 'all') {
              var places = ['canada', 'states', 'europe', 'easternEurope', 'scandanavia', 'rest'];

              for (var place in places) {
                for (var player in Vue.prototype.$teams.prospects[places[place]].players) {
                  players.push(Vue.prototype.$players[Vue.prototype.$teams.prospects[places[place]].players[player]]);
                }
              }
            } else {
              for (var player in Vue.prototype.$teams.prospects[region].players) {
                players.push(Vue.prototype.$players[Vue.prototype.$teams.prospects[region].players[player]]);
              }
            }

            players = players.sort(function (a, b) {
              return a.potential.chance["int"] * a.potential.ceiling["int"] - b.potential.chance["int"] * b.potential.ceiling["int"];
            }).reverse();
            players = players.slice(scope[0], scope[1]);
            return players;
          }
        }
      }
    };
  }, {
    "../scripts/main.js": 14
  }],
  10: [function (require, module, exports) {
    var gMixin = require('../scripts/main.js');

    module.exports = {
      standingsSeasonPage: {
        mixins: [gMixin],
        template: "\n    <div>\n        <div class=\"horizontal-buttons\">\n            <a @click=\"standingsSet('onehl')\" :style=\"{'background': colour().main}\">1HL</a>\n            <a @click=\"standingsSet('twohl')\" :style=\"{'background': colour().main}\">2HL</a>\n            <a @click=\"standingsSet('thrhl')\" :style=\"{'background': colour().main}\">3HL</a>\n        </div>\n        <div class=\"table-scroll\">\n            <table class=\"standings-table\">\n                <tr>\n                    <th>#</th>\n                    <th>Team</th>\n                    <th>GP</th>\n                    <th>PTS</th>\n                    <th>W</th>\n                    <th>L</th>\n                    <th>OT</th>\n                    <th>GF</th>\n                    <th>GA</th>\n                    <th>Shots</th>\n                    <th>Saves</th>\n                    <th>PPs</th>\n                    <th>PPG</th>\n                    <th>PKs</th>\n                    <th>PKGA</th>\n                </tr>\n                <tr v-for=\"(team, count) in teams\" v-if=\"count < 16\">\n                    <td :style=\"{'color': colour().light}\">{{count++ + 1}}</td>\n                    <td :style=\"{'color': colour().light}\">{{team.name}}</td>\n                    <td>{{team.gamesPlayed}}</td>\n                    <td>{{team.points}}</td>\n                    <td>{{team.wins + team.otw + team.sow}}</td>\n                    <td>{{team.losses}}</td>\n                    <td>{{team.otl + team.sol}}</td>\n                    <td>{{team.goalsFor}}</td>\n                    <td>{{team.goalsAgainst}}</td>\n                    <td>{{team.shots}}</td>\n                    <td>{{team.saves}}</td>\n                    <td>{{team.pps}}</td>\n                    <td>{{team.ppgf}}</td>\n                    <td>{{team.pks}}</td>\n                    <td>{{team.pkga}}</td>\n                </tr>\n                <tr v-for=\"(team, count) in teams\" v-if=\"count >= 16\">\n                    <td>{{count++ + 1}}</td>\n                    <td>{{team.name}}</td>\n                    <td>{{team.gamesPlayed}}</td>\n                    <td>{{team.points}}</td>\n                    <td>{{team.wins + team.otw + team.sow}}</td>\n                    <td>{{team.losses}}</td>\n                    <td>{{team.otl + team.sol}}</td>\n                    <td>{{team.goalsFor}}</td>\n                    <td>{{team.goalsAgainst}}</td>\n                    <td>{{team.shots}}</td>\n                    <td>{{team.saves}}</td>\n                    <td>{{team.pps}}</td>\n                    <td>{{team.ppgf}}</td>\n                    <td>{{team.pks}}</td>\n                    <td>{{team.pkga}}</td>\n                </tr>\n            </table>\n        </div>\n    </div>\n    ",
        data: function data() {
          return {
            teams: this.standingsSet('onehl')
          };
        },
        methods: {
          standingsSet: function standingsSet(league) {
            var teams = [];

            for (var team in Vue.prototype.$teams[league]) {
              var current = Vue.prototype.$teams[league][team];
              var gp = current.stats.gamesPlayed;

              if (gp === 0) {
                gp = 0.00001;
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
                pkga: (current.stats.pkga / gp).toFixed(2)
              });
            }

            teams = teams.sort(function (a, b) {
              return a.points / a.gamesPlayed - b.points / b.gamesPlayed || a.goalsFor - a.goalsAgainst - (b.goalsFor - b.goalsAgainst);
            }).reverse();
            this.teams = teams;
            return teams;
          }
        }
      },
      standingsPlayoffPage: {
        mixins: [gMixin],
        template: "\n    <div>\n        <div v-if=\"display\">\n            <p>Playoffs</p>\n            <div class=\"horizontal-buttons\">\n                <a @click=\"league = 'onehl'\" :style=\"{'background': colour().main}\">1HL</a>\n                <a @click=\"league = 'twohl'\" :style=\"{'background': colour().main}\">2HL</a>\n                <a @click=\"league = 'thrhl'\" :style=\"{'background': colour().main}\">3HL</a>\n            </div>\n            <table>\n                <tr>\n                    <th>Round 1</th>\n                    <th>Round 2</th>\n                    <th>Round 3</th>\n                    <th>Finals</th>\n                </tr>\n                <tr><td>{{seriesInfo({round: 'r1', series: 1}) }}</td></tr>\n                <tr><td></td><td>{{seriesInfo({round: 'r2', series: 1}) }}</td></tr>\n                <tr><td>{{seriesInfo({round: 'r1', series: 8}) }}</td></tr>\n                <tr><td></td><td></td><td>{{seriesInfo({round: 'r3', series: 1}) }}</td></tr>\n                <tr><td>{{seriesInfo({round: 'r1', series: 4}) }}</td></tr>\n                <tr><td></td><td>{{seriesInfo({round: 'r2', series: 4}) }}</td></tr>\n                <tr><td>{{seriesInfo({round: 'r1', series: 5}) }}</td></tr>\n                <tr><td></td><td></td><td></td>{{seriesInfo({round: 'r4', series: 1}) }}</td></tr>\n                <tr><td>{{seriesInfo({round: 'r1', series: 3}) }}</td></tr>\n                <tr><td></td>{{seriesInfo({round: 'r2', series: 3}) }}</td></tr>\n                <tr><td>{{seriesInfo({round: 'r1', series: 6}) }}</td></tr>\n                <tr><td></td><td></td>{{seriesInfo({round: 'r3', series: 2}) }}</td></tr>\n                <tr><td>{{seriesInfo({round: 'r1', series: 2}) }}</td></tr>\n                <tr><td></td>{{seriesInfo({round: 'r2', series: 2}) }}</td></tr>\n                <tr><td>{{seriesInfo({round: 'r1', series: 7}) }}</td></tr>\n            </table>\n        </div>\n        <p v-else>The playoffs have not yet started</p>\n    </div>\n    ",
        data: function data() {
          if (['regular', 'pre-seaon'].includes(Vue.prototype.$gameInfo.time.period)) {
            var display = false;
          } else {
            var display = true;
          }

          return {
            display: display,
            playoffs: Vue.prototype.$events.playoffs,
            league: 'onehl'
          };
        },
        methods: {
          seriesInfo: function seriesInfo(param) {
            // param = {series: 5, round: 'r2', team:'hi'}
            var playoffs = Vue.prototype.$events.playoffs[this.league];
            var round = param.round;
            var totalTeams = {
              r1: 17,
              r2: 9,
              r3: 5,
              r4: 3
            };
            var series = param.series.toString() + 'v' + (totalTeams[round] - param.series).toString();

            if (typeof playoffs[round][series] === 'undefined') {
              return 'TBD';
            }

            var hiTeam = {
              rank: param.series,
              team: playoffs[round][series].hi,
              abb: Vue.prototype.$teams[this.league][playoffs[round][series].hi].name.abb
            };
            var loTeam = {
              rank: totalTeams[round] - param.series,
              team: playoffs[round][series].lo,
              abb: Vue.prototype.$teams[this.league][playoffs[round][series].lo].name.abb
            };
            var score = playoffs[round][series].score[0].toString() + '-' + playoffs[round][series].score[1].toString();

            if (round === 'r1') {
              return hiTeam.rank + ' ' + hiTeam.abb + ' ' + score + ' ' + loTeam.abb + ' ' + loTeam.rank;
            } else {
              return hiTeam.abb + ' ' + score + ' ' + loTeam.abb;
            }
          }
        }
      }
    };
  }, {
    "../scripts/main.js": 14
  }],
  11: [function (require, module, exports) {
    var gMixin = require('../scripts/main.js');

    module.exports = {
      statsPage: {
        mixins: [gMixin],
        template: "\n        <div>\n        <div class=\"horizontal-buttons\">\n            <a @click=\"league = 'onehl';updatePlayers('change league')\" :style=\"{'background': colour().main}\">1HL</a>\n            <a @click=\"league = 'twohl';updatePlayers('change league')\" :style=\"{'background': colour().main}\">2HL</a>\n            <a @click=\"league = 'thrhl';updatePlayers('change league')\" :style=\"{'background': colour().main}\">3HL</a>\n        </div>\n        <div class=\"horizontal-buttons stats-filter\">\n            <a @click=\"currentTable = 'stats';      tableDisplay(currentTable)\" :style=\"{'background': colour().main}\">Stats</a>\n            <a @click=\"currentTable = 'attributes'; tableDisplay(currentTable)\" :style=\"{'background': colour().main}\">Attributes</a>\n            <a @click=\"htmlDisplay.filter = !htmlDisplay.filter\" class=\"light-text\" :style=\"{'background': colour().light}\">Filter</a>\n        </div>\n        \n        <div v-if=\"htmlDisplay.filter\" style=\"display: inline-block; height: 30px\">\n            <a @click=\"htmlDisplay.teams = !htmlDisplay.teams; htmlDisplay.positions = false\"      class=\"stats-page-filter-button hover-text\">Teams</a>\n            <a @click=\"htmlDisplay.positions = !htmlDisplay.positions; htmlDisplay.teams = false\" class=\"stats-page-filter-button hover-text\">Positions</a>\n        </div>\n\n        <div v-if=\"htmlDisplay.teams & htmlDisplay.filter\" class=\"stats-page-filter-container\">\n            <p v-for=\"team in teams\"\n                :style=\"teamStyle(team.id)\"\n                @click=\"filterTeams(team.id)\">\n                {{team.abb}}\n            </p>\n            <div style=\"display: inline-block; height: 30px\">\n                <a @click=\"filterTeams('select all')\"\n                    class=\"stats-page-filter-button hover-text\">Select All</a>\n                <a @click=\"filterTeams('deselect all')\"\n                    class=\"stats-page-filter-button hover-text\">Deselect All</a>\n            </div>\n        </div>\n\n        <div v-if=\"htmlDisplay.positions & htmlDisplay.filter\" class=\"stats-page-filter-container\">\n            <p  v-for=\"position in ['lw','c','rw','ld','rd','g']\"\n                :style=\"positionStyle(position)\"\n                @click=\"filterPositions(position)\">\n                {{position.toUpperCase()}}\n            </p>\n        </div>\n                \n        <div class=\"stats-page-container\">\n            <a @click=\"setScope('start')\" class=\"scope-change\" :style=\"{'background': colour().main}\"> << </a> \n            <a @click=\"setScope('backward')\" class=\"scope-change light\" :style=\"{'background': colour().light}\"> < </a> \n            <div class=\"table-scroll\">\n                <table class=\"stats-page-table\">\n                    <tr>\n                        <th>#</th>\n                        <th v-for=\"i in table.header\" @click=\"changeSort(i)\">\n                            <p class=\"stats-table-header\">{{i}}</p>\n                        </th>\n                    </tr>\n                    <tr v-for=\"(player, i) in players\">\n                        <td>{{scope[0]+1+i}}</td>\n                        <td @click=\"addressChange('player',player.id,{})\" class=\"hover-hand\">{{player.name}}</td>\n                        <td>{{player.position.toUpperCase()}}</td>\n                        <td v-for=\"stat in table.row\">{{player[stat]}}</td>\n                    </tr>\n                </table>\n            </div>\n            <a @click=\"setScope('forward')\" class=\"scope-change light\" :style=\"{'background': colour().light}\"> > </a>\n        </div>\n        </div>\n        ",
        data: function data() {
          return {
            table: this.tableDisplay('stats'),
            currentTable: 'stats',
            players: this.filteredPlayers('onehl', this.allTeams('onehl'), ['lw', 'c', 'rw', 'ld', 'rd'], 'points', true, [0, 10]),
            teams: this.allTeams('onehl'),
            league: 'onehl',
            positions: ['lw', 'c', 'rw', 'ld', 'rd'],
            sortedBy: 'points',
            sortedPositively: true,
            scope: [0, 10],
            htmlDisplay: {
              filter: false,
              positions: false,
              teams: false
            }
          };
        },
        methods: {
          updatePlayers: function updatePlayers(arg) {
            if (arg === 'change league') {
              this.teams = this.allTeams(this.league);
            }

            this.players = this.filteredPlayers(this.league, this.teams, this.positions, this.sortedBy, this.sortedPositively, this.scope);

            if (this.players.length === 0) {
              this.scope = [this.scope[0] - 10, this.scope[1] - 10];
            }

            this.players = this.filteredPlayers(this.league, this.teams, this.positions, this.sortedBy, this.sortedPositively, this.scope);
          },
          allTeams: function allTeams(league) {
            var teams = {};

            for (var tid in Vue.prototype.$teams[league]) {
              var team = Vue.prototype.$teams[league][tid];
              teams[team.id] = {
                abb: team.name.abb,
                id: team.id,
                selected: true
              };
            }

            return teams;
          },
          filterTeams: function filterTeams(arg) {
            if (arg === 'select all') {
              for (var tid in this.teams) {
                this.teams[tid].selected = true;
              }
            } else if (arg === 'deselect all') {
              for (var tid in this.teams) {
                this.teams[tid].selected = false;
              }
            } else {
              this.teams[arg].selected = !this.teams[arg].selected;
            }

            this.updatePlayers();
          },
          filterPositions: function filterPositions(position) {
            if (position === 'g') {
              this.positions = ['g'];
              this.tableDisplay(this.currentTable);
            } else if (this.positions.includes(position)) {
              this.positions = this.positions.filter(function (pos) {
                return pos !== position;
              });
              this.positions = this.positions.filter(function (pos) {
                return pos !== 'g';
              });
            } else {
              this.positions.push(position);
              this.positions = this.positions.filter(function (pos) {
                return pos !== 'g';
              });
            }

            this.updatePlayers();
          },
          filteredPlayers: function filteredPlayers(league, teams, positions, sortedBy, sortedPositively, scope) {
            var season = Vue.prototype.$gameInfo.time.season;

            function getPlayersInLeague(league) {
              var leaguePlayers = [];

              for (var n in Vue.prototype.$players[league]) {
                var pid = Vue.prototype.$players[league][n];
                var player = Vue.prototype.$players[pid];
                leaguePlayers.push({
                  id: player.id,
                  name: player.fullName,
                  age: player.age,
                  position: player.position,
                  team: player.team,
                  teamName: player.teamName().abb,
                  overall: player.overall(),
                  gamesPlayed: player.stats[season].gamesPlayed,
                  points: player.stats[season].points,
                  goals: player.stats[season].goals,
                  assists: player.stats[season].assists,
                  shots: player.stats[season].shots,
                  pim: player.stats[season].pim,
                  savePctg: player.stats[season].savePctg,
                  gaa: player.stats[season].gaa,
                  saves: player.stats[season].saves,
                  goalsAgainst: player.stats[season].goalsAgainst
                });
                leaguePlayers[n] = Object.assign({}, leaguePlayers[n], player.attributes);
              }

              return leaguePlayers;
            }

            function filterPlayers(players, teams, positions) {
              var teamList = [];

              for (var team in teams) {
                if (teams[team].selected) {
                  teamList.push(team);
                }
              }

              players = players.filter(function (player) {
                return teamList.includes(player.team.toString()) & positions.includes(player.position);
              });
              return players;
            }

            var players = filterPlayers(getPlayersInLeague(league), teams, positions);
            players = players.sort(function (a, b) {
              return a[sortedBy] - b[sortedBy];
            });

            if (sortedPositively) {
              players = players.reverse();
            }

            players = players.slice(scope[0], scope[1]);
            return players;
          },
          setScope: function setScope(direction) {
            if (direction === 'start') {
              this.scope = [0, 10];
            } else if (direction === 'forward') {
              this.scope = [this.scope[0] + 10, this.scope[1] + 10];
            } else if (direction === 'backward') {
              this.scope = [this.scope[0] - 10, this.scope[1] - 10];
            }

            if (this.scope[0] < 0) {
              this.scope = [0, 10];
            }

            this.updatePlayers();
          },
          tableDisplay: function tableDisplay(type) {
            var table = {
              header: [],
              row: []
            }; //first 2 rows ommited because they're hardcoded into the html

            try {
              if (this.positions[0] === 'g') {
                var goalie = true;
              } else {
                var goalie = false;
              }
            } catch (_unused16) {
              var goalie = false;
            }

            if (type === 'stats') {
              if (goalie) {
                table.header = ['Name', 'Pos', 'Age', 'Team', 'Overall', 'GP', 'Sv%', 'GAA', 'Svs', 'GA'];
                table.row = ['age', 'teamName', 'overall', 'gamesPlayed', 'savePctg', 'gaa', 'saves', 'goalsAgainst'];
              } else {
                table.header = ['Name', 'Pos', 'Age', 'Team', 'Ovr', 'GP', 'PTS', 'G', 'A', 'Sht', 'PIM'];
                table.row = ['age', 'teamName', 'overall', 'gamesPlayed', 'points', 'goals', 'assists', 'shots', 'pim'];
              }
            }

            if (type === 'attributes') {
              if (goalie) {
                table.header = ['Name', 'Pos', 'Age', 'Team', 'Overall', 'Glove', 'Blocker', 'Pads', 'Rebounds', 'Puck', 'Reflexes', 'Strength', 'Stamina', 'IQ', 'Work', 'Confidence'];
                table.row = ['age', 'teamName', 'overall', 'glove', 'blocker', 'pads', 'rebounds', 'puck', 'reflex', 'strength', 'stamina', 'iq', 'work', 'confidence'];
              } else {
                table.header = ['Name', 'Pos', 'Age', 'Team', 'OIQ', 'Wrist', 'Slap', 'Hands', 'DIQ', 'Stickwork', 'Blocking', 'Hitting', 'Skating', 'Passing', 'Hand Eye', 'Face Off', 'Strength', 'Stamina', 'Hustle', 'Discipline'];
                table.row = ['age', 'teamName', 'oiq', 'wrist', 'slap', 'hands', 'diq', 'stick', 'blocking', 'hitting', 'skating', 'passing', 'handEye', 'faceOff', 'strength', 'stamina', 'hustle', 'discipline'];
              }
            }

            this.table = table;
            return table;
          },
          positionStyle: function positionStyle(position) {
            if (this.positions.includes(position)) {
              return {
                'font-weight': 'bold'
              };
            } else {
              return {
                'color': '#dddddd'
              };
            }
          },
          teamStyle: function teamStyle(tid) {
            for (var team in this.teams) {
              if (this.teams[team].id == tid) {
                if (this.teams[team].selected) {
                  return {
                    'font-weight': 'bold'
                  };
                } else {
                  return {
                    'color': '#dddddd'
                  };
                }
              }
            }
          },
          changeSort: function changeSort(type) {
            type = this.table.row[this.table.header.indexOf(type) - 2];

            if (type === this.sortedBy) {
              this.sortedPositively = !this.sortedPositively;
            }

            this.sortedBy = type;
            this.updatePlayers();
          }
        }
      },
      statsOverviewPage: {
        mixins: [gMixin],
        template: "\n    <div class=\"player-overview\">\n        <p>Top Players</p>\n        <div>\n        <p>Points</p>\n        <table>\n            <tr>\n            <th>Player</th>\n            <th>Points</th>\n            </tr>\n            <tr v-for=\"player in stats.points\">\n            <td @click=\"addressChange('player',player.id,{})\">{{player.name}}</td>\n            <td>{{player.stat}}</td>\n            </tr>\n        </table>\n        </div>\n\n        <p>Goals</p>\n        <table>\n            <tr>\n            <th>Player</th>\n            <th>Goals</th>\n            </tr>\n            <tr v-for=\"player in stats.goals\">\n            <td @click=\"addressChange('player',player.id,{})\">{{player.name}}</td>\n            <td>{{player.stat}}</td>\n            </tr>\n        </table>\n        </div>\n\n        <p>Assists</p>\n        <table>\n            <tr>\n            <th>Player</th>\n            <th>Assists</th>\n            </tr>\n            <tr v-for=\"player in stats.assists\">\n            <td @click=\"addressChange('player',player.id,{})\">{{player.name}}</td>\n            <td>{{player.stat}}</td>\n            </tr>\n        </table>\n        </div>\n    \n        <div>\n        <p>Overall</p>\n        <table>\n            <tr>\n            <th>Player</th>\n            <th>Overall</th>\n            </tr>\n            <tr v-for=\"player in stats.overall\">\n            <td @click=\"addressChange('player',player.id,{})\">{{player.name}}</td>\n            <td>{{player.stat}}</td>\n            </tr>\n        </table>\n        </div>\n    </div>\n    ",
        data: function data() {
          return {
            stats: {
              points: this.statsSet('points'),
              overall: this.statsSet('goals'),
              goals: this.statsSet('goals'),
              assists: this.statsSet('assists'),
              shots: this.statsSet('shots')
            }
          };
        },
        methods: {
          statsSet: function statsSet(type) {
            var statList = [];
            var playerList = Vue.prototype.$players.onehl;

            for (var player in Vue.prototype.$players.onehl) {
              var p = Vue.prototype.$players[playerList[player]];

              if (type === 'overall') {
                var stat = p.overall();
              } else {
                var stat = p.stats[Vue.prototype.$gameInfo.time.season][type];
              }

              statList.push({
                id: p.id,
                name: p.name().abb,
                stat: stat
              });
            }

            statList = statList.sort(function (a, b) {
              return a.stat - b.stat;
            }).reverse();
            return statList.slice(0, 10);
          }
        }
      }
    };
  }, {
    "../scripts/main.js": 14
  }],
  12: [function (require, module, exports) {
    var gMixin = require('../scripts/main.js');

    module.exports = {
      tradePage: {
        mixins: [gMixin],
        template: "\n    <div>\n        <div v-if=\"gameInfo.page.sub === '' & !deadline\">\n            <p>Trade Central</p>\n            <table v-for=\"type in ['user','cpu']\" class=\"trade-page-table\">\n                <caption v-if=\"type === 'user'\" :style=\"{'color': colour().main}\">{{teams[type].name+' '+teams[type].cap+' M'}}</caption>\n                <caption v-else :style=\"{'color': colour().light}\">{{teams[type].name+' '+teams[type].cap+' M'}}</caption>\n                <tr>\n                    <th></th>\n                    <th>Player</th>\n                    <th>Position</th>\n                    <th>Overall</th>\n                    <th>Age</th>\n                    <th>Contract</th>\n                    <th>Value</th>\n                </tr>\n                <tr v-for=\"player in teams[type].tradePlayers\">\n                    <td><a @click=\"removePlayer(type, player.id)\" :style=\"{'background': colour().main}\">x</a>\n                    <td v-if=\"!isNaN(player.age)\" @click=\"addressChange('player',player.id,{tradeTeams:teams})\">{{player.name}}</td>\n                    <td v-if=\"!isNaN(player.age)\">{{player.position}}</td>  <td v-else>{{player.season}}</td>\n                    <td v-if=\"!isNaN(player.age)\">{{player.overall}}</td>   <td v-else>{{player.team}}</td>\n                    <td v-if=\"!isNaN(player.age)\">{{player.age}}</td>       <td v-else>{{player.round}}</td>\n                    <td v-if=\"!isNaN(player.age)\">{{player.contract}}</td>  <td v-else>-</td>\n                    <td><div class=\"trade-value-bar\" :style=\"{'background': colour().light, 'width': player.value+'%'}\"></div></td>\n                </tr>\n                <tr>\n                    <td><a @click=\"addressChange('trade','rosters',{}); teamSelect = type\" :style=\"{'background': colour().main}\">+</a></td>\n                </tr>\n            </table>\n    \n            <div class=\"trade-team-value-bar\" id=\"home\" :style=\"{'background': colour().main, 'width': value.user+'%'}\"></div>\n            <div class=\"trade-team-value-bar\" id=\"away\" :style=\"{'background': colour().light, 'width': value.cpu+'%'}\"></div>\n\n            <div class=\"horizontal-buttons\">\n                <a @click=\"changeTeam('display')\" :style=\"{'background': colour().main}\">Change Team</a>\n                <a @click=\"attemptTrade()\" :style=\"{'background': colour().main}\">Offer Trade</a>\n            </div>\n            <div v-if=\"dropdown.display\" class=\"roster-dropdown\">\n                <a v-for=\"team in dropdown.teams\" @click=\"changeTeam(team.id)\">{{team.city}}</a>\n            </div>\n            <p v-if=\"alert !== false\">{{alert}}</p>\n        </div>\n    \n        <div v-if=\"gameInfo.page.sub === 'rosters' \">\n            <div class=\"horizontal-buttons\">\n                <a @click=\"league = 'onehl'\"   :style=\"{'background': colour().main}\">1HL</a>\n                <a @click=\"league = 'twohl'\"   :style=\"{'background': colour().main}\">2HL</a>\n                <a @click=\"league = 'thrhl'\"   :style=\"{'background': colour().main}\">3HL</a>\n                <a @click=\"league = 'juniors'\" :style=\"{'background': colour().main}\">JHL</a>\n                <a @click=\"league = 'picks'\"   :style=\"{'background': colour().main}\">Picks</a>\n            </div>\n\n            <table v-if=\"league === 'picks'\" class=\"trade-page-table\">\n                <caption>{{teams[teamSelect].name}}</caption>\n                <tr>\n                    <th></th>\n                    <th>Season</th>\n                    <th>Team</th>\n                    <th>Round</th>\n                    <th>Value</th>\n                </tr>\n                <tr v-for=\"pick in teams[teamSelect].roster[league]\">\n                    <td v-if=\"!teams[teamSelect].tradePlayers.includes(pick)\">\n                        <a @click=\"addPlayer(pick)\" :style=\"{'background': colour().main}\">+</a></td>\n                    <td v-else></td>\n                    <td>{{pick.season}}</td>\n                    <td>{{pick.teamName}}</td>\n                    <td>{{pick.round}}</td>\n                    <td><div class=\"trade-value-bar\" :style=\"{'background': colour().light, 'width': pick.value+'%'}\"></div></td>\n                </tr>\n            </table>            \n\n            <table v-else class=\"trade-page-table\">\n            <caption>{{teams[teamSelect].name}}</caption>\n                <tr>\n                    <th></th>\n                    <th>Player</th>\n                    <th>Position</th>\n                    <th>Overall</th>\n                    <th>Age</th>\n                    <th>Contract</th>\n                    <th>Value</th>\n                </tr>\n                <tr v-for=\"player in teams[teamSelect].roster[league]\">\n                    <td v-if=\"!teams[teamSelect].tradePlayers.includes(player)\">\n                        <a @click=\"addPlayer(player.id)\" :style=\"{'background': colour().main}\">+</a></td>\n                    <td v-else></td>\n                    <td @click=\"addressChange('player',player.id,{tradeTeams:teams})\">{{player.name}}</td>\n                    <td>{{player.position}}</td>\n                    <td>{{player.overall}}</td>\n                    <td>{{player.age}}</td>\n                    <td>{{player.contract}}</td>\n                    <td><div class=\"trade-value-bar\" :style=\"{'background': colour().light, 'width': player.value+'%'}\"></div></td>\n                </tr>\n            </table>\n        </div>\n        <div v-if=\"gameInfo.page.sub === 'tradeComplete' \">\n            <p>Trade Accepted</p>\n            <p>Make sure to update your lines and roster</p>\n            <p>{{'To '+teams.user.id}}</p>\n            <p v-for=\"player in this.teams.cpu.tradePlayers\" @click=\"addressChange('player',player.id,{})\">\n                {{player.name}}\n            </p>\n            <p>{{'To '+teams.cpu.id}}</p>\n            <p v-for=\"player in this.teams.user.tradePlayers\" @click=\"addressChange('player',player.id,{})\">\n                {{player.name}}\n            </p>\n            <button @click=\"endTrade()\">Close</button>\n        </div>\n    \n        <div v-if=\"deadline\">\n        <p>The trade deadline has passed</p>\n        </div>\n    </div>\n    ",
        data: function data() {
          var userTeam = Vue.prototype.$gameInfo.player.team;
          var teamList = [];

          for (var team in Vue.prototype.$teams.onehl) {
            teamList.push({
              name: Vue.prototype.$teams.onehl[team].name.full,
              city: Vue.prototype.$teams.onehl[team].name.city,
              id: Vue.prototype.$teams.onehl[team].id
            });
          }

          teamList = teamList.filter(function (team) {
            return team !== userTeam;
          });

          if (userTeam === 100) {
            var cpuTeam = 101;
          } else {
            var cpuTeam = 100;
          }

          if (Object.keys(Vue.prototype.$gameInfo.page.details).length > 0) {
            var teams = Vue.prototype.$gameInfo.page.details.tradeTeams;
          } else {
            var teams = {
              user: {
                id: userTeam,
                name: Vue.prototype.$teams.onehl[userTeam].name.full,
                roster: this.teamRoster(userTeam),
                cap: Vue.prototype.$teams.onehl[userTeam].capSpent(),
                tradePlayers: []
              },
              cpu: {
                id: cpuTeam,
                name: Vue.prototype.$teams.onehl[cpuTeam].name.full,
                roster: this.teamRoster(cpuTeam),
                cap: Vue.prototype.$teams.onehl[cpuTeam].capSpent(),
                tradePlayers: []
              }
            };
          }

          return _defineProperty({
            gameInfo: Vue.prototype.$gameInfo,
            league: 'onehl',
            teams: teams,
            alert: false,
            screen: {
              main: true,
              tradeComplete: false,
              rosters: false
            },
            teamSelect: 'user',
            dropdown: {
              display: false,
              teams: teamList
            },
            deadline: this.checkDeadline(),
            value: {
              user: 0,
              cpu: 0
            }
          }, "alert", false);
        },
        created: function created() {
          this.screen = {
            main: true,
            tradeComplete: false,
            rosters: false
          };
        },
        methods: {
          checkDeadline: function checkDeadline() {
            // returns true if trade deadline has been passed
            var currentDate = Vue.prototype.$gameInfo.time.date;
            var deadline = {
              day: 15,
              month: 1,
              year: Vue.prototype.$gameInfo.time.season
            };
            return this.laterDate(currentDate, deadline);
          },
          removePlayer: function removePlayer(team, id) {
            var players = this.teams[team].tradePlayers;

            for (var i = 0; i < players.length; i++) {
              if (players[i].id === id) {
                this.value[team] -= players[i].value;
                players.splice(i, 1);
              }
            }

            this.teams[team].tradePlayers = players;
          },
          teamRoster: function teamRoster(team) {
            var teams = [team, '2' + team.toString().slice(1, 3), '3' + team.toString().slice(1, 3)];
            var team = Vue.prototype.$teams.onehl[team];
            var leagues = {
              onehl: 0,
              twohl: 0,
              thrhl: 0,
              juniors: 0
            };
            var n = 0;

            for (var league in leagues) {
              var players = [];

              if (league === 'juniors') {
                var teamList = Vue.prototype.$teams.onehl[teams[0]].juniors;
              } else {
                var teamList = Vue.prototype.$teams[league][teams[n]].players;
              }

              for (var curPlayer in teamList) {
                var player = Vue.prototype.$players[teamList[curPlayer]];
                players.push({
                  id: player.id,
                  name: player.name().abb,
                  position: player.position,
                  overall: player.overall(),
                  age: player.age,
                  contract: player.contract.cap + 'M x ' + player.contract.years + 'Y',
                  value: player.tradeValue()
                });
              }

              leagues[league] = players;
              n += 1;
            } //Picks


            leagues.picks = [];

            for (var year in team.picks) {
              for (var pick in team.picks[year]) {
                var p = team.picks[year][pick];

                if (p.player === false) {
                  if (p.round >= 4) {
                    var pickValue = 2;
                  } else {
                    var pickTeamRank = Vue.prototype.$teams.onehl[p.team].rank('points', false);
                    var pickPosition = (p.round - 1) * 32 + pickTeamRank + 1;
                    var pickValue = parseInt(Math.pow(0.025 * pickPosition - 3.3, 4)) + 2;
                  }

                  leagues.picks.push({
                    season: year,
                    team: p.team,
                    teamName: Vue.prototype.$teams.onehl[p.team].name.abb,
                    round: p.round,
                    value: pickValue,
                    position: p.position,
                    player: null
                  });
                }
              }
            }

            leagues.picks = leagues.picks.sort(function (a, b) {
              return a.season - b.season;
            });
            return leagues;
          },
          addPlayer: function addPlayer(id) {
            var teams = this.teams;
            var selected = this.teamSelect;

            if (_typeof(id) === 'object') {
              //id is actually a pick object
              teams[selected].tradePlayers.push(id);
              this.value[selected] += id.value;
            } else {
              for (var player in teams[selected].roster[this.league]) {
                if (teams[selected].roster[this.league][player].id === id) {
                  this.value[selected] += teams[selected].roster[this.league][player].value;
                  teams[selected].tradePlayers.push(teams[selected].roster[this.league][player]);
                }
              }
            }

            this.teams = teams;
          },
          attemptTrade: function attemptTrade() {
            var success = true;
            var valueDifference = this.value.user - this.value.cpu;

            if (valueDifference > 0) {
              var success = true;
              this.alert = false;
            } else {
              var success = false;
              this.alert = 'Trade Rejected';
            }

            if (success) {
              var otherTeam = {
                user: this.teams.cpu.id,
                cpu: this.teams.user.id
              };

              for (var team in this.teams) {
                for (var p = 0; p < this.teams[team].tradePlayers.length; p++) {
                  if (!isNaN(this.teams[team].tradePlayers[p].id)) {
                    var player = Vue.prototype.$players[this.teams[team].tradePlayers[p].id];

                    if (player.league === 'juniors') {
                      player.switchTeam(otherTeam[team]);
                    } else {
                      player.switchTeam(this.teamConvert(player.league, otherTeam[team]));
                    }
                  } else {
                    var pick = this.teams[team].tradePlayers[p];
                    Vue.prototype.$teams.onehl[otherTeam[team]].changePicks('add', pick);
                    Vue.prototype.$teams.onehl[this.teams[team].id].changePicks('remove', pick);
                  }
                }
              }

              Vue.prototype.$teams.onehl[this.teams.cpu.id].sortRoster();
              Vue.prototype.$teams.onehl[this.teams.cpu.id].generateLines(false, false, false);
              Vue.prototype.$teams.twohl[this.teamConvert('twohl', this.teams.cpu.id)].generateLines(false, false, false);
              Vue.prototype.$teams.thrhl[this.teamConvert('thrhl', this.teams.cpu.id)].generateLines(false, false, false);
              Vue.prototype.$gameInfo.page.sub = 'tradeComplete';
            }

            this.value = {
              user: 0,
              cpu: 0
            };
          },
          changeTeam: function changeTeam(display) {
            if (display === 'display') {
              this.dropdown.display = !this.dropdown.display;
            } else {
              this.dropdown.display = false;
              this.teams.cpu.id = display;
              this.teams.cpu.tradePlayers = [];
              this.teams.cpu.roster = this.teamRoster(display);
              this.teams.cpu.name = Vue.prototype.$teams.onehl[display].name.full;
            }
          },
          endTrade: function endTrade() {
            var userTeam = Vue.prototype.$gameInfo.player.team;
            this.teams = {
              'user': {
                'id': userTeam,
                'roster': this.teamRoster(userTeam),
                'tradePlayers': []
              },
              'cpu': {
                'id': this.teams.cpu.id,
                'roster': this.teamRoster(this.teams.cpu.id),
                'tradePlayers': []
              }
            };
            Vue.prototype.$gameInfo.page.sub = '';
          }
        }
      }
    };
  }, {
    "../scripts/main.js": 14
  }],
  13: [function (require, module, exports) {
    module.exports = {
      cleanTeamRosters: function cleanTeamRosters() {
        for (var t in Vue.prototype.$teams.onehl) {
          Vue.prototype.$teams.onehl[t].sortRoster();

          if (t == Vue.prototype.$gameInfo.player.team && !Vue.prototype.$gameInfo.autoRoster) {
            continue;
          }
        }

        for (var league in {
          onehl: 0,
          twohl: 0,
          thrhl: 0
        }) {
          for (var t in Vue.prototype.$teams[league]) {
            if (t == Vue.prototype.$gameInfo.player.team && !Vue.prototype.$gameInfo.autoRoster) {
              continue;
            }

            Vue.prototype.$teams[league][t].generateLines(false, false, false);
          }
        }
      },
      freeAgencyUpdate: function freeAgencyUpdate() {
        var self = this;
        var fa = Vue.prototype.$events.freeAgency;

        function generateOffers(type) {
          var sortedFreeAgents = JSON.parse(JSON.stringify(Vue.prototype.$players.freeAgents));
          sortedFreeAgents = sortedFreeAgents.map(function (pid) {
            return {
              id: pid,
              overall: Vue.prototype.$players[pid].overall()
            };
          });
          sortedFreeAgents = sortedFreeAgents.sort(function (a, b) {
            return a.overall - b.overall;
          }).reverse();

          for (var t in Vue.prototype.$teams.onehl) {
            var priority = function priority() {
              //list in order the positions that should be signed
              var priorityList = Object.keys(needs);
              priorityList.sort(function (a, b) {
                return needs[a] - needs[b];
              }).reverse();

              for (var n = 0; n < priorityList.length; n++) {
                var pos = priorityList[n];

                if (needs[pos] <= 0) {
                  delete needs[pos];
                  priorityList = priorityList.filter(function (position) {
                    return position !== pos;
                  });
                }
              }

              return priorityList;
            };

            var team = Vue.prototype.$teams.onehl[t];

            if (team.id == Vue.prototype.$gameInfo.player.team && !Vue.prototype.$gameInfo.autoRoster) {
              continue;
            }

            var depth = team.playerPositionSummary().all;
            var totalSkaters = depth.lw + depth.c + depth.rw + depth.ld + depth.rd;
            var totalGoalies = depth.g;
            var needs = team.playerPositionSummary().cap;

            if (type === 'needs') {
              needs = {
                lw: 4 - needs.lw,
                c: 4 - needs.c,
                rw: 4 - needs.rw,
                ld: 3 - needs.ld,
                rd: 3 - needs.rd,
                g: 2 - needs.g
              };
            } else if (type === 'depth') {
              needs = {
                lw: 12 - depth.lw,
                c: 12 - depth.c,
                rw: 12 - depth.rw,
                ld: 9 - depth.ld,
                rd: 9 - depth.rd,
                g: 6 - depth.g
              };
            }

            var capLeft = team.capSpent(true);

            while (priority().length > 0 && (totalGoalies < 6 || totalSkaters < 55)) {
              var pos = priority()[0];

              for (var p = 0; p < sortedFreeAgents.length; p++) {
                var player = Vue.prototype.$players[sortedFreeAgents[p].id];

                if (typeof Vue.prototype.$events.freeAgency[player.id] === 'undefined') {
                  var firstOffer = true;
                  var offeredContract = false;
                } else if (typeof Vue.prototype.$events.freeAgency[player.id][team.id] === 'undefined') {
                  var firstOffer = false;
                  var offeredContract = false;
                } else {
                  var offeredContract = true;
                }

                if (player.position === pos && !offeredContract) {
                  var contract = player.desiredContract();

                  if (player.overall() > 80) {
                    contract.cap += self.rnd(-15, 15) * 0.1;
                  } else if (player.overall > 76) {
                    contract.cap += self.rnd(-4, 4) * 0.1;
                  } else if (player.overall() > 72) {
                    contract.cap += self.rnd(-1, 1) * 0.1;
                  }

                  if (contract.cap > capLeft) {
                    contract.cap = capLeft - 0.1;

                    if (capLeft < 1) {
                      contract.cap = 1;
                    }
                  }

                  if (contract.cap < 1) {
                    contract.cap = 1;
                  }

                  if (contract.cap > 15) {
                    contract.cap = 15;
                  }

                  contract.years += self.rnd(-1, 1);

                  if (contract.years < 1) {
                    contract.years = 1;
                  }

                  if (contract.years > 8) {
                    contract.years = 8;
                  }

                  contract.cap = parseFloat(contract.cap.toFixed(2));

                  if (firstOffer) {
                    Vue.prototype.$events.freeAgency[player.id] = {};
                  }

                  Vue.prototype.$events.freeAgency[player.id][team.id] = contract;

                  if (pos === 'g') {
                    totalGoalies += 1;
                  } else {
                    totalSkaters += 1;
                  }

                  if (type === 'depth') {
                    capLeft -= contract.cap - 1;
                  } else {
                    capLeft -= contract.cap;
                  }

                  needs[pos] -= 1;
                  break;
                }

                if (p === sortedFreeAgents.length - 1) {
                  delete needs[pos];
                }
              }
            }
          }
        }

        function acceptOffers() {
          for (var id in Vue.prototype.$events.freeAgency) {
            if (id === 'day') {
              continue;
            }

            var player = Vue.prototype.$players[id];
            var offers = [];
            var desired = player.desiredContract();

            for (var o in Vue.prototype.$events.freeAgency[player.id]) {
              var offer = Vue.prototype.$events.freeAgency[player.id][o];
              var yearDifference = Math.abs(offer.years - desired.years);
              var capDifference = offer.cap - desired.cap;
              var offer = Vue.prototype.$events.freeAgency[player.id][o];
              var value = offer.cap * (offer.years - yearDifference);

              if (yearDifference <= 1 && capDifference > -1) {
                offers.push({
                  team: o,
                  value: value,
                  contract: offer
                });
              }
            }

            offers = offers.sort(function (a, b) {
              return a.value - b.value;
            }).reverse(); // Accepting the best offer if valid

            for (var n = 0; n < offers.length; n++) {
              var forceAccept = false;

              if (player.desiredContract().cap === 1 && player.desiredContract().years === 1) {
                n = self.rnd(0, offers.length - 1);
                forceAccept = true;
              }

              if (Vue.prototype.$teams.onehl[offers[n].team].capSpent(true) > 0 || forceAccept) {
                player.switchTeam(offers[n].team);
                player.contract = offers[n].contract;

                if (Vue.prototype.$gameInfo.player.team == offers[n].team) {
                  self.newNews('contract', player);
                }

                delete Vue.prototype.$events.freeAgency[player.id];
                break;
              }
            }
          }
        } // duplicate generateOffers() are to account for needs not met due to
        // players signing with other teams


        if (fa.day === 1) {
          generateOffers('depth');
          generateOffers('needs');
          generateOffers('needs');
        } else if ([4, 6, 8, 10, 12, 14].includes(fa.day)) {
          acceptOffers();
          generateOffers('needs');
          generateOffers('depth');
        } else if ([15, 16, 17, 18, 20, 22, 24].includes(fa.day)) {
          acceptOffers();
          generateOffers('depth');
          generateOffers('depth');
        } else if (fa.day > 24) {
          acceptOffers();
          generateOffers('depth');
          generateOffers('depth');
        } else if (fa.day === 30) {
          Vue.prototype.$events.freeAgency.day = {
            day: 'finished'
          };
        }

        fa.day++;
      },
      signNecessaryDepth: function signNecessaryDepth() {
        for (var t in Vue.prototype.$teams.onehl) {
          var sortedFreeAgents = JSON.parse(JSON.stringify(Vue.prototype.$players.freeAgents));
          sortedFreeAgents = sortedFreeAgents.map(function (pid) {
            return {
              id: pid,
              overall: Vue.prototype.$players[pid].overall()
            };
          });
          sortedFreeAgents = sortedFreeAgents.sort(function (a, b) {
            return a.overall - b.overall;
          }).reverse();
          var team = Vue.prototype.$teams.onehl[t];

          if (team.id == Vue.prototype.$gameInfo.player.team && !Vue.prototype.$gameInfo.autoRoster) {
            continue;
          }

          var depth = team.playerPositionSummary().all;
          var totalSkaters = depth.lw + depth.c + depth.rw + depth.ld + depth.rd;

          for (var p = 0; p < sortedFreeAgents.length; p++) {
            var player = Vue.prototype.$players[sortedFreeAgents[p].id];

            if (player.position === 'g' && depth.g < 6) {
              player.contract = {
                cap: 1,
                years: 1
              };
              player.switchTeam(t);
              depth.g += 1;
            } else if (player.position !== 'g' && totalSkaters < 55) {
              player.contract = {
                cap: 1,
                years: 1
              };
              player.switchTeam(t);
              totalSkaters += 1;
            }
          } //Create new players if not enough in free agency


          if (depth.g < 6) {
            for (var n = 0; n < 6 - depth.g; n++) {
              var player = new Vue.prototype.$class.Player.Player({
                type: 'depth',
                position: 'g'
              });
              player.contract = {
                years: 1,
                cap: 1
              };
              player.switchTeam(t);
            }

            depth.g = 6;
          }

          if (totalSkaters < 55) {
            for (var n = 0; n < 55 - totalSkaters; n++) {
              var player = new Vue.prototype.$class.Player.Player({
                type: 'depth',
                position: 'any'
              });
              player.contract = {
                years: 1,
                cap: 1
              };
              player.switchTeam(t);
            }

            totalSkaters = 55;
          }

          Vue.prototype.$teams.onehl[t].sortRoster();
          Vue.prototype.$teams.onehl[t].generateLines(false, false, false);
        }
      },
      tradeForNeeds: function tradeForNeeds() {
        var wantTeams = {
          lw: [],
          c: [],
          rw: [],
          ld: [],
          rd: []
        };
        var haveTeams = {
          lw: [],
          c: [],
          rw: [],
          ld: [],
          rd: []
        };

        for (var tid in Vue.prototype.$teams.onehl) {
          var team = Vue.prototype.$teams.onehl[tid];

          if (team.id == Vue.prototype.$gameInfo.player.team && !Vue.prototype.$gameInfo.autoRoster) {
            continue;
          }

          var depth = team.playerPositionSummary().cap;
          var cap = {
            lw: 4 - depth.lw,
            c: 4 - depth.c,
            rw: 4 - depth.rw,
            ld: 3 - depth.ld,
            rd: 3 - depth.rd
          };

          for (var pos in cap) {
            if (cap[pos] > 0) {
              wantTeams[pos].push(team.id);
            } else if (cap[pos] < 0) {
              haveTeams[pos].push(team.id);
            }
          }
        }

        for (var pos in wantTeams) {
          for (var wantIndex = 0; wantIndex < wantTeams[pos].length; wantIndex++) {
            for (var haveIndex = 0; haveIndex < haveTeams[pos].length; haveIndex++) {
              if (wantIndex === haveIndex || wantTeams[pos][wantIndex] === 'traded' || haveTeams[pos][haveIndex] === 'traded') {
                continue;
              }

              var wantTeam = Vue.prototype.$teams.onehl[wantTeams[pos][wantIndex]];
              var haveTeam = Vue.prototype.$teams.onehl[haveTeams[pos][haveIndex]];
              var wantPlayers = wantTeam.allPlayers(false).filter(function (pid) {
                return Vue.prototype.$players[pid].overall() > 76;
              });
              var havePlayers = haveTeam.allPlayers(false).filter(function (pid) {
                return Vue.prototype.$players[pid].overall() > 76 && Vue.prototype.$players[pid].position === pos;
              });
              var tradeMade = false;

              for (var p1 = 0; p1 < havePlayers.length; p1++) {
                for (var p2 = 0; p2 < wantPlayers.length; p2++) {
                  var havePlayer = Vue.prototype.$players[havePlayers[p1]];
                  var wantPlayer = Vue.prototype.$players[wantPlayers[p2]];

                  if (wantTeams[havePlayer.position].includes(wantTeam.id) && haveTeam.capSpent(true) - wantPlayer.contract.cap > 0 && wantTeam.capSpent(true) - havePlayer.contract.cap > 0 && Math.abs(havePlayer.tradeValue() - wantPlayer.tradeValue()) < 4) {
                    havePlayer.switchTeam(wantTeam.id);
                    wantPlayer.switchTeam(haveTeam.id);
                    haveTeams[pos][haveTeams[pos].indexOf(haveTeam.id)] = 'traded';
                    wantTeams[pos][wantTeams[pos].indexOf(wantTeam.id)] = 'traded';
                    tradeMade = true;
                    break;
                  }
                }

                if (tradeMade) {
                  break;
                }
              }
            }
          }
        }

        var wantTeams = {
          lw: [],
          c: [],
          rw: [],
          ld: [],
          rd: [],
          g: []
        };
        var haveTeams = {
          lw: [],
          c: [],
          rw: [],
          ld: [],
          rd: [],
          g: []
        };

        for (var tid in Vue.prototype.$teams.onehl) {
          var team = Vue.prototype.$teams.onehl[tid];
          var depth = team.playerPositionSummary().cap;
          var cap = {
            lw: 4 - depth.lw,
            c: 4 - depth.c,
            rw: 4 - depth.rw,
            ld: 3 - depth.ld,
            rd: 3 - depth.rd,
            g: 2 - depth.g
          };

          for (var pos in cap) {
            if (cap[pos] > 0) {
              wantTeams[pos].push(team.id);
            } else if (cap[pos] < 0) {
              haveTeams[pos].push(team.id);
            }
          }
        }
      },
      tradeBuriedPlayers: function tradeBuriedPlayers() {
        var buriedPlayers = [];

        for (var p in Vue.prototype.$players) {
          if (isNaN(parseInt(p))) {
            continue;
          }

          var player = Vue.prototype.$players[p];

          if (player.team == Vue.prototype.$gameInfo.player.team && !Vue.prototype.$gameInfo.autoRoster) {
            continue;
          }

          if ((player.league === 'twohl' && player.overall() >= 78 || player.league === 'thrhl' && player.overall() >= 70) && player.position !== 'g') {
            buriedPlayers.push({
              team: '1' + player.team.toString().slice(1),
              id: player.id,
              value: player.tradeValue()
            });
          }
        }

        buriedPlayers = buriedPlayers.map(function (a) {
          return {
            sort: Math.random(),
            value: a
          };
        }).sort(function (a, b) {
          return a.sort - b.sort;
        }).map(function (a) {
          return a.value;
        });

        for (var playerOneIndex = 0; playerOneIndex < buriedPlayers.length; playerOneIndex++) {
          for (var playerTwoIndex = 0; playerTwoIndex < buriedPlayers.length; playerTwoIndex++) {
            if (buriedPlayers[playerOneIndex].id === 'traded' || buriedPlayers[playerTwoIndex].id === 'traded') {
              continue;
            }

            var playerOne = Vue.prototype.$players[buriedPlayers[playerOneIndex].id];
            var playerTwo = Vue.prototype.$players[buriedPlayers[playerTwoIndex].id];
            var oneTeam = Vue.prototype.$teams.onehl[buriedPlayers[playerOneIndex].team];
            var twoTeam = Vue.prototype.$teams.onehl[buriedPlayers[playerTwoIndex].team];

            if (playerOne.team === playerTwo.team || Math.abs(playerOne.tradeValue() - playerTwo.tradeValue()) > 3 || oneTeam.capSpent(true) - playerTwo.contract.cap < 0 || twoTeam.capSpent(true) - playerOne.contract.cap < 0 || playerOne.position !== playerTwo.position) {
              continue;
            } else {
              playerOne.switchTeam(twoTeam.id);
              playerTwo.switchTeam(oneTeam.id);
              buriedPlayers[playerOneIndex].id = 'traded';
              buriedPlayers[playerTwoIndex].id = 'traded';
            }
          }
        }
      },
      tradeToEvenDepth: function tradeToEvenDepth() {
        var teamDepths = [];

        for (var tid in Vue.prototype.$teams.onehl) {
          var team = Vue.prototype.$teams.onehl[tid];

          if (team.id == Vue.prototype.$gameInfo.player.team && !Vue.prototype.$gameInfo.autoRoster) {
            continue;
          }

          var depth = team.playerPositionSummary().all;
          var needs = {
            lw: 12 - depth.lw,
            c: 12 - depth.c,
            rw: 12 - depth.rw,
            ld: 9 - depth.ld,
            rd: 9 - depth.rd,
            g: 6 - depth.g
          };
          teamDepths.push(Object.assign({}, {
            id: team.id
          }, needs));
        }

        var done = false;

        while (!done) {
          var tradesMade = 0;

          for (var pos in needs) {
            // sorts all teams by depth in given position
            var posDepth = JSON.parse(JSON.stringify(teamDepths.sort(function (a, b) {
              return a[pos] - b[pos];
            })));

            if (posDepth[0][pos] > -2) {
              break;
            }

            if (posDepth[31][pos] < 2) {
              break;
            }

            var teamNeed = Vue.prototype.$teams.onehl[posDepth[0].id];
            var teamGive = Vue.prototype.$teams.onehl[posDepth[31].id]; //finds the most crowded position of the needing team, this is the position they will trade away

            var x = JSON.parse(JSON.stringify(posDepth[0]));
            delete x.id;
            var givePos = Object.keys(x).reduce(function (a, b) {
              return x[a] > x[b] ? a : b;
            });
            var teamNeedPlayers = teamNeed.allPlayers(false);
            var teamGivePlayers = teamGive.allPlayers(false);
            var needIndex = teamNeedPlayers.length - 1;
            var giveIndex = teamGivePlayers.length - 1;
            var noTrade = true;

            while (noTrade && needIndex > 3 && giveIndex > 3) {
              var needPlayer = Vue.prototype.$players[teamNeedPlayers[needIndex]];
              var givePlayer = Vue.prototype.$players[teamGivePlayers[giveIndex]];

              if (needPlayer.position !== pos) {
                needIndex -= 1;
                continue;
              }

              if (givePlayer.position !== givePos) {
                giveIndex -= 1;
                continue;
              }

              if (Math.abs(needPlayer.tradeValue() - givePlayer.tradeValue()) < 3) {
                needPlayer.switchTeam(teamGive.id);
                givePlayer.switchTeam(teamNeed.id);
                noTrade = false;
                tradesMade += 1;
              } else if (needPlayer.tradeValue() > givePlayer.tradeValue()) {
                giveIndex -= 1;
              } else {
                needIndex -= 1;
              }
            }
          }

          if (tradesMade === 0) {
            done = true;
          }
        }
      },
      tradeUnderCap: function tradeUnderCap() {
        var teamCaps = [];

        for (var tid in Vue.prototype.$teams.onehl) {
          var team = Vue.prototype.$teams.onehl[tid];

          if (team.id == Vue.prototype.$gameInfo.player.team && !Vue.prototype.$gameInfo.autoRoster) {
            continue;
          }

          teamCaps.push({
            id: team.id,
            capLeft: team.capSpent(true)
          });
        }

        teamCaps.sort(function (a, b) {
          return a.capLeft - b.capLeft;
        });
        var teamsOver = teamCaps.filter(function (t) {
          return t.capLeft < 0;
        });
        var teamsUndr = teamCaps.filter(function (t) {
          return t.capLeft > 0;
        }).reverse();

        for (var o = 0; o < teamsOver.length; o++) {
          for (var u = 0; u < teamsUndr.length; u++) {
            var overTeam = Vue.prototype.$teams.onehl[teamsOver[o].id];
            var undrTeam = Vue.prototype.$teams.onehl[teamsUndr[u].id];

            if (undrTeam.capSpent(true) < 0) {
              break;
            }

            var overPlayers = overTeam.allPlayers(false);
            var undrPlayers = undrTeam.allPlayers(false);
            var overIndex = overPlayers.length - 1;
            var undrIndex = undrPlayers.length - 1;
            var overCap = true;

            while (undrIndex > 0 && overCap) {
              var overPlayer = Vue.prototype.$players[overPlayers[overIndex]];
              var undrPlayer = Vue.prototype.$players[undrPlayers[undrIndex]];

              if (overPlayer.tradeValue() - undrPlayer.tradeValue() > 2 && overPlayer.tradeValue() - undrPlayer.tradeValue() < 5 && overPlayer.contract.cap > undrPlayer.contract.cap && undrTeam.capSpent(true) - overPlayer.contract.cap > 0) {
                overPlayer.switchTeam(undrTeam.id);
                undrPlayer.switchTeam(overTeam.id);
                overIndex -= 1;
                undrIndex -= 1;

                if (overTeam.capSpent(true) > 0) {
                  overCap = false;
                  break;
                }
              }

              overIndex -= 1;

              if (overIndex < 0) {
                overIndex = overPlayers.length - 1;
                undrIndex -= 1;
              }
            }

            if (!overCap) {
              break;
            }
          }
        }
      },
      yearEndReSign: function yearEndReSign() {
        for (var t in Vue.prototype.$teams.onehl) {
          var team = Vue.prototype.$teams.onehl[t];

          if (team.id == Vue.prototype.$gameInfo.player.team && !Vue.prototype.$gameInfo.autoRoster) {
            continue;
          }

          team.extendAll();
        }
      }
    };
  }, {}],
  14: [function (require, module, exports) {
    window.addEventListener('beforeunload', function (e) {
      e.preventDefault();
      e.returnValue = '';
    }); // GLOBAL VARIABLES

    Vue.prototype.$class = {
      Player: require('../classes/class-player.js'),
      Team: require('../classes/class-team.js'),
      Game: require('../classes/class-game.js')
    };
    Vue.prototype.$events = {
      draft: {},
      freeAgency: {
        day: 'season'
      },
      playoffs: {}
    };
    Vue.prototype.$news = [];
    Vue.prototype.$players = {
      onehl: [],
      twohl: [],
      thrhl: [],
      prospects: [],
      juniors: [],
      freeAgents: []
    };
    Vue.prototype.$saves = {
      quickSave1: {},
      quickSave2: {},
      quickSave3: {},
      dates: {}
    };
    Vue.prototype.$schedule = {
      dates: {
        onehl: {},
        twohl: {},
        thrhl: {}
      },
      teams: {
        onehl: {},
        twohl: {},
        thrhl: {}
      },
      id: {
        onehl: {},
        twohl: {},
        thrhl: {}
      }
    };
    Vue.prototype.$teams = {
      onehl: {},
      twohl: {},
      thrhl: {},
      prospects: {
        canada: {
          players: []
        },
        states: {
          players: []
        },
        easternEurope: {
          players: []
        },
        europe: {
          players: []
        },
        scandanavia: {
          players: []
        },
        rest: {
          players: []
        }
      }
    };
    Vue.prototype.$gameInfo = {
      autoRoster: true,
      colours: {
        main: '#3e9462',
        light: '#ffc6a4'
      },
      history: [{
        url: 'home',
        sub: '',
        details: {}
      }],
      page: {
        url: 'start',
        sub: '',
        details: {}
      },
      player: {
        team: 100
      },
      salaryCap: 85,
      scouting: {
        canada: {
          percentage: 17,
          points: 0
        },
        states: {
          percentage: 17,
          points: 0
        },
        easternEurope: {
          percentage: 17,
          points: 0
        },
        europe: {
          percentage: 17,
          points: 0
        },
        scandanavia: {
          percentage: 16,
          points: 0
        },
        rest: {
          percentage: 16,
          points: 0
        }
      },
      time: {
        date: {
          day: 24,
          month: 8,
          year: 2019
        },
        season: 2020,
        period: 'regular'
      }
    }; // GLOBAL METHODS

    var methodProspect = require('./prospect.js');

    var methodSim = require('./sim.js');

    var methodSchedule = require('./schedule.js');

    var methodProgression = require('./progression.js');

    var methodPlayoff = require('./playoff.js');

    var methodYearEnd = require('./year-end.js');

    var methodNewGame = require('./new-game.js');

    var methodAI = require('./ai.js');

    var methodTools = require('./tools.js');

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
        yearEndReSign: methodAI.yearEndReSign
      }
    };
    module.exports = gMixin; // MAIN COMPONENTS

    var componentHome = require('../components/home.js');

    var componentRoster = require('../components/roster.js');

    var componentStats = require('../components/stats.js');

    var componentScouting = require('../components/scouting.js');

    var componentStandings = require('../components/standings.js');

    var componentSchedule = require('../components/schedule.js');

    var componentTrade = require('../components/trade.js');

    var componentProfiles = require('../components/profiles.js');

    var componentMisc = require('../components/misc.js'); // Home


    var mainHome = {
      mixins: [gMixin],
      template: "\n  <div>\n    <home-page v-if=\"gameInfo.page.sub === ''\"></home-page>\n  </div>\n  ",
      components: {
        'home-page': componentHome.homePage
      },
      data: function data() {
        return {
          gameInfo: Vue.prototype.$gameInfo
        };
      }
    }; // Rosters

    var mainRoster = {
      mixins: [gMixin],
      template: "\n<div>\n  <roster-page v-if=\"gameInfo.page.sub === ''\"></roster-page>\n  <lines-page v-if=\"gameInfo.page.sub === 'lines'\"></lines-page>\n  <contracts-page v-if=\"gameInfo.page.sub === 'contracts'\"></contracts-page>\n  <negotiate-page v-if=\"gameInfo.page.sub.split('-')[0] === 'negotiate'\"></negotiate-page>\n  <free-agent-page v-if=\"gameInfo.page.sub === 'free-agency'\"></free-agent-page>\n</div>\n",
      components: {
        'roster-page': componentRoster.rosterPage,
        'lines-page': componentRoster.rosterLinesPage,
        'contracts-page': componentRoster.rosterContractPage,
        'negotiate-page': componentRoster.negotiateContract,
        'free-agent-page': componentRoster.freeAgentPage
      },
      data: function data() {
        return {
          gameInfo: Vue.prototype.$gameInfo
        };
      }
    }; // Standings

    var mainStandings = {
      mixins: [gMixin],
      template: "\n  <div>\n    <standings-season-page v-if=\"gameInfo.page.sub === 'season'\"></standings-season-page>\n    <standings-playoff-page v-if=\"gameInfo.page.sub === 'playoffs'\"></standings-playoff-page>\n  </div>\n  ",
      components: {
        'standings-season-page': componentStandings.standingsSeasonPage,
        'standings-playoff-page': componentStandings.standingsPlayoffPage
      },
      data: function data() {
        return {
          gameInfo: Vue.prototype.$gameInfo
        };
      }
    }; // Player Stats 

    var mainStats = {
      mixins: [gMixin],
      template: "\n  <div>\n    <stats-overview-page v-if=\"gameInfo.page.sub === 'overview'\"></stats-overview-page>\n    <stats-page v-if=\"gameInfo.page.sub === ''\"></stats-page>\n  </div>\n  ",
      components: {
        'stats-overview-page': componentStats.statsOverviewPage,
        'stats-page': componentStats.statsPage
      },
      data: function data() {
        return {
          gameInfo: Vue.prototype.$gameInfo
        };
      }
    }; // Trade

    var mainTrade = {
      template: "\n  <div>\n      <trade-page></trade-page>\n  </div>\n  ",
      components: {
        'trade-page': componentTrade.tradePage
      },
      data: function data() {
        return {
          gameInfo: Vue.prototype.$gameInfo
        };
      }
    }; // Schedule

    var mainSchedule = {
      template: "\n  <div>\n      <schedule-page v-if=\"gameInfo.page.sub === ''\"></schedule-page>\n  </div>\n  ",
      components: {
        'schedule-page': componentSchedule.schedulePage
      },
      data: function data() {
        return {
          gameInfo: Vue.prototype.$gameInfo
        };
      }
    }; // Scouting

    var mainScouting = {
      mixins: [gMixin],
      template: "\n  <div>\n      <scouting-page v-if=\"gameInfo.page.sub === ''\"></scouting-page>\n      <scouting-player-page v-if=\"gameInfo.page.sub !== ''\"></scouting-player-page>\n  </div>\n  ",
      data: function data() {
        return {
          gameInfo: Vue.prototype.$gameInfo
        };
      },
      components: {
        'scouting-page': componentScouting.scoutingPage,
        'scouting-player-page': componentScouting.scoutingPlayerPage
      }
    }; // Miscellaneous

    var mainMisc = {
      mixins: [gMixin],
      template: "\n  <div>\n    <draft-home-page v-if=\"gameInfo.page.sub === 'draft'\"></draft-home-page>\n    <year-end-page v-if=\" gameInfo.page.sub === 'year-end' \"></year-end-page>\n    <save-page v-if=\" gameInfo.page.sub === 'save' \"></save-page>\n  </div>\n  ",
      data: function data() {
        return {
          gameInfo: Vue.prototype.$gameInfo
        };
      },
      components: {
        'draft-home-page': componentMisc.draftHomePage,
        'year-end-page': componentMisc.yearEndPage,
        'save-page': componentMisc.savePage
      }
    }; // Web Container

    var webContainer = {
      mixins: [gMixin],
      template: "\n  <div v-if=\"gameInfo.page.url !== 'start'\" class=\"web-container\">\n    <div class=\"web-container-header-top\">\n      <div class=\"web-container-subnav\">\n        <a v-for=\"page in subNav\" @click=\"addressChange(page.url,page.sub,page.details)\">{{page.name}}</a>\n        <a @click=\"addressChange('back')\" id=\"back\">Back</a>\n      </div>\n      <input type=\"text\" v-model=\"address\" @keyup.enter=\"goSearch()\" @focus=\"typing = true\" @blur=\"typing = false\"></input>\n    </div>\n\n    <main-home           v-if=\"gameInfo.page.url === 'home' \"      class=\"web-container-body\"></main-home>\n    <player-profile v-else-if=\"gameInfo.page.url === 'player' \"    class=\"web-container-body\"></player-profile>\n    <game-profile   v-else-if=\"gameInfo.page.url === 'game' \"      class=\"web-container-body\"></game-profile>\n    <main-roster    v-else-if=\"gameInfo.page.url === 'roster' \"    class=\"web-container-body\"></main-roster>\n    <main-stats     v-else-if=\"gameInfo.page.url === 'stats' \"     class=\"web-container-body\"></main-stats>\n    <main-scouting  v-else-if=\"gameInfo.page.url === 'scouting' \"  class=\"web-container-body\"></main-scouting>\n    <main-standings v-else-if=\"gameInfo.page.url === 'standings' \" class=\"web-container-body\"></main-standings>\n    <main-schedule  v-else-if=\"gameInfo.page.url === 'schedule' \"  class=\"web-container-body\"></main-schedule>\n    <main-trade     v-else-if=\"gameInfo.page.url === 'trade' \"     class=\"web-container-body\"></main-trade>\n    <main-misc     v-else-if=\"gameInfo.page.url === 'misc' \"     class=\"web-container-body\"></main-misc>\n    <error v-else class=\"web-container-body\"></error>\n  </div>\n  ",
      data: function data() {
        return {
          gameInfo: Vue.prototype.$gameInfo,
          address: this.computeAddress(),
          typing: false,
          subNav: this.computeSubs()
        };
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
        'error': componentMisc.fourOhFour
      },
      methods: {
        goSearch: function goSearch() {
          var url = this.address.split('/')[0];
          var sub = this.address.split('/')[1];

          if (typeof sub === 'undefined') {
            sub = '/';
          }

          this.addressChange(url, sub, {});
        },
        computeAddress: function computeAddress() {
          return Vue.prototype.$gameInfo.page.url + '/' + Vue.prototype.$gameInfo.page.sub;
        },
        computeSubs: function computeSubs() {
          if (Vue.prototype.$gameInfo.page.url === 'roster') {
            var subNav = [{
              name: 'Rosters',
              url: 'roster',
              sub: '',
              details: {}
            }, {
              name: 'Lines',
              url: 'roster',
              sub: 'lines',
              details: {}
            }, {
              name: 'Contracts',
              url: 'roster',
              sub: 'contracts',
              details: {}
            }, {
              name: 'Free Agency',
              url: 'roster',
              sub: 'free-agency',
              details: {}
            }];
          } else if (Vue.prototype.$gameInfo.page.url === 'stats') {
            var subNav = [{
              name: 'Table',
              url: 'stats',
              sub: '',
              details: {}
            }, {
              name: 'Overview',
              url: 'stats',
              sub: 'overview',
              details: {}
            }];
          } else if (Vue.prototype.$gameInfo.page.url === 'standings') {
            var subNav = [{
              name: 'Season',
              url: 'standings',
              sub: 'season',
              details: {}
            }, {
              name: 'Playoffs',
              url: 'standings',
              sub: 'playoffs',
              details: {}
            }];
          } else {
            var subNav = [];
          }

          return subNav;
        }
      },
      updated: function updated() {
        if (!this.typing) {
          this.address = Vue.prototype.$gameInfo.page.url + '/' + Vue.prototype.$gameInfo.page.sub;
        }
      },
      beforeUpdate: function beforeUpdate() {
        this.subNav = this.computeSubs();
      }
    }; // Navigation Bar

    var mainNavigation = {
      mixins: [gMixin],
      template: "\n  <div v-if=\"gameInfo.page.url !== 'start'\">\n    <h2>BGM</h2>\n    <a @click=\"addressChange('home','',{})\">Home</a>\n    <a @click=\"addressChange('roster','',{})\">Roster</a>\n    <a @click=\"addressChange('standings','season',{})\">Standings</a>\n    <a @click=\"addressChange('stats','',{})\">Stats</a>\n    <a @click=\"addressChange('schedule','',{})\">Schedule</a>\n    <a @click=\"addressChange('trade','',{})\">Trade</a>\n    <a @click=\"addressChange('scouting','',{})\">Scouting</a>\n    <a @click=\"addressChange('misc','save',{})\">Save</a>\n    <a href=\"docs.html\">Meta</a>\n  </div>",
      data: function data() {
        return {
          gameInfo: Vue.prototype.$gameInfo
        };
      },
      methods: {}
    }; // Start

    var startPage = {
      mixins: [gMixin],
      template: "\n  <div v-if=\"gameInfo.page.url === 'start'\" class=\"start-page\">\n    <div class=\"start-page-header\">\n      <input v-model=\"title\" @change=\"urlChange()\" autofocus></input>\n      <a @click=\"back()\">Back</a>\n    </div>\n\n    <div v-if=\"menu === 'home'\" class=\"start-page-container\">\n      <p class=\"start-page-info-big\">BrowserGm is a WIP hockey management game</p> \n      <p class=\"start-page-info-big\">Manage a team and its affiliates to try and win the cup!</p>\n      <div>\n        <a :style=\"{'background':colour().main}\" class=\"start-page-choice-large\" \n          @click=\"menu = 'new'; title = 'start-page/new-game'; alert = false \">New Game</a>\n        <a :style=\"{'background':colour().main}\" class=\"start-page-choice-large\" \n          @click=\"menu = 'load'; title = 'start-page/load-game'; alert = false\">Load Game</a>\n      </div>\n      <div>\n        <a :style=\"{'background':colour().light}\" class=\"start-page-choice-small light-text\" href=\"docs.html\">Documentation</a>\n        <a :style=\"{'background':colour().light}\" class=\"start-page-choice-small light-text\" href=\"player-guide.html\" >Playing Rules</a>\n        <a :style=\"{'background':colour().light}\" class=\"start-page-choice-small light-text\" href=\"https://github.com/pbaev\" >Github</a>\n      </div>\n    </div>\n\n    <div v-if=\"menu === 'load'\" class=\"start-page-new\">\n      <p class=\"start-page-info\">Load a gamefile</p>\n      <label class=\"custom-file-upload\" :style=\"{'background':colour().light}\">\n        <input type=\"file\" id=\"load-game-file\" class=\"light-text\">Upload</input>\n      </label>\n      <div class=\"horizontal-buttons\">\n        <a @click=\"loader()\" :style=\"{'background': colour().main}\">Load Game</a>\n      </div>\n      <p v-if=\"alert !== false\">{{alert}}</p>\n    </div>\n\n\n    <div v-if=\"menu === 'new'\" class=\"start-page-new\">\n      <h3>Choose your team's name</h3>\n      <div class=\"start-page-name\">\n        <p class=\"start-page-info\">City (Max 15)</p>\n        <input v-model=\"city\"></input>\n      </div>\n      <div class=\"start-page-name\">\n        <p class=\"start-page-info\">Name (Max 15)</p>\n        <input v-model=\"name\"></input>\n      </div>\n      <div class=\"start-page-name\">\n        <p class=\"start-page-info\">Abbreviation (Max 4)</p>\n        <input v-model=\"abb\"></input>\n      </div>\n      <h3>Choose your theme colours</h3>\n      <div>\n        <div class=\"start-page-theme-colour\">\n          <a class=\"start-page-theme-colour\" :style=\"{'background':colour().main}\">Main</a\n        </div>\n\n        <div class=\"start-page-colour-block\">\n          <div @click=\"changeColour('main','#c63860')\" :style=\"{'background':'#c63860'}\"></div>\n          <div @click=\"changeColour('main','#8a4ca9')\" :style=\"{'background':'#8a4ca9'}\"></div>\n          <div @click=\"changeColour('main','#3f53b7')\" :style=\"{'background':'#3f53b7'}\"></div>\n          <div @click=\"changeColour('main','#3f8fb7')\" :style=\"{'background':'#3f8fb7'}\"></div>\n          <div @click=\"changeColour('main','#3e9462')\" :style=\"{'background':'#3e9462'}\"></div>\n          <div @click=\"changeColour('main','#75993f')\" :style=\"{'background':'#75993f'}\"></div>\n          <div @click=\"changeColour('main','#ad653a')\" :style=\"{'background':'#ad653a'}\"></div>\n        </div>\n      </div>\n      <div>\n        <div class=\"start-page-theme-colour\">\n          <a class=\"light-text\" :style=\"{'background':colour().light}\">Light</a>\n        </div>\n\n        <div class=\"start-page-colour-block\">\n          <div @click=\"changeColour('light','#ffaab5')\" :style=\"{'background':'#ffaab5'}\"></div>\n          <div @click=\"changeColour('light','#e3aaff')\" :style=\"{'background':'#e3aaff'}\"></div>\n          <div @click=\"changeColour('light','#aabbff')\" :style=\"{'background':'#aabbff'}\"></div>\n          <div @click=\"changeColour('light','#a7dff1')\" :style=\"{'background':'#a7dff1'}\"></div>\n          <div @click=\"changeColour('light','#9cd6af')\" :style=\"{'background':'#9cd6af'}\"></div>\n          <div @click=\"changeColour('light','#b4d69c')\" :style=\"{'background':'#b4d69c'}\"></div>\n          <div @click=\"changeColour('light','#e7bea5')\" :style=\"{'background':'#e7bea5'}\"></div>\n        </div>\n\n        <p v-if=\"alert !== false\">{{alert}}</p>\n\n        <div class=\"start-page-game\">\n          <a @click=\"startGame()\" :style=\"{'background':colour().main}\">Start Game</a>\n        </div>\n      </div>\n    </div>\n\n    </div>\n  </div>",
      data: function data() {
        return {
          gameInfo: Vue.prototype.$gameInfo,
          menu: 'home',
          title: 'start-page/',
          urlChanged: false,
          city: 'Seattle',
          name: 'Battle Cattle',
          abb: 'SEA',
          colours: JSON.parse(JSON.stringify(Vue.prototype.$gameInfo.colours)),
          alert: false
        };
      },
      methods: {
        urlChange: function urlChange() {
          if (!this.urlChanged) {
            this.title = 'Smart thinking! Changing the URL will be useful in game';
            this.urlChanged = true;
          }
        },
        back: function back() {
          if (this.menu !== 'home') {
            this.menu = 'home';
            this.title = 'start-page/';
          } else {
            this.title = 'There\'s nothing to go back to';
          }

          this.alert = false;
        },
        changeColour: function changeColour(type, hex) {
          this.colours[type] = hex;
          Vue.prototype.$gameInfo.colours[type] = hex;
        },
        loader: function loader() {
          this.loadGame('upload');

          if (typeof Vue.prototype.$teams.onehl[100] === 'undefined') {
            this.alert = 'Save load failed';
          }
        },
        startGame: function startGame() {
          if (this.city.length > 15) {
            this.alert = 'City should be 15 or fewer characters long';
            return;
          } else if (this.city.name > 15) {
            this.alert = 'Name should be 15 or fewer characters long';
            return;
          } else if (this.abb.length > 4) {
            this.alert = 'Abbreviation should be 4 or fewer characters long';
            return;
          }

          this.generateGame();
          this.startPreSeason();
          Vue.prototype.$gameInfo.colours = this.colours;
          Vue.prototype.$teams.onehl[100].name = {
            city: this.city,
            logo: this.name,
            full: this.city + ' ' + this.name,
            abb: this.abb
          };
          Vue.prototype.$teams.twohl[200].name = {
            city: this.city,
            logo: 'Sr. ' + this.name,
            full: this.city + ' ' + this.name,
            abb: '2' + this.abb
          };
          Vue.prototype.$teams.thrhl[300].name = {
            city: this.city,
            logo: 'Jr. ' + this.name,
            full: this.city + ' ' + this.name,
            abb: '3' + this.abb
          };
          this.addressChange('home', '');
        }
      }
    };
    new Vue({
      el: '.content',
      created: function created() {//
      },
      mixins: [gMixin],
      components: {
        'main-navigation': mainNavigation,
        'web-container': webContainer,
        'start-page': startPage
      }
    });
  }, {
    "../classes/class-game.js": 1,
    "../classes/class-player.js": 2,
    "../classes/class-team.js": 3,
    "../components/home.js": 4,
    "../components/misc.js": 5,
    "../components/profiles.js": 6,
    "../components/roster.js": 7,
    "../components/schedule.js": 8,
    "../components/scouting.js": 9,
    "../components/standings.js": 10,
    "../components/stats.js": 11,
    "../components/trade.js": 12,
    "./ai.js": 13,
    "./new-game.js": 15,
    "./playoff.js": 16,
    "./progression.js": 17,
    "./prospect.js": 18,
    "./schedule.js": 19,
    "./sim.js": 20,
    "./tools.js": 21,
    "./year-end.js": 22
  }],
  15: [function (require, module, exports) {
    module.exports = {
      generateGame: function generateGame() {
        var self = this;

        function startingPlayers() {
          for (var n = 0; n < 1960; n++) {
            var player = new Vue.prototype.$class.Player.Player({
              type: 'start',
              position: 'any'
            });
            Vue.prototype.$players[player.id] = player;
          }

          for (var n = 0; n < 205; n++) {
            var player = new Vue.prototype.$class.Player.Player({
              type: 'start',
              position: 'g'
            });
            Vue.prototype.$players[player.id] = player;
          }
        }

        function startingTeams() {
          for (var team = 100; team < 132; team++) {
            Vue.prototype.$teams.onehl[team] = new Vue.prototype.$class.Team.Team({
              id: team,
              league: 'onehl'
            });
          }

          for (var team = 200; team < 232; team++) {
            Vue.prototype.$teams.twohl[team] = new Vue.prototype.$class.Team.Team({
              id: team,
              league: 'twohl'
            });
          }

          for (var team = 300; team < 332; team++) {
            Vue.prototype.$teams.thrhl[team] = new Vue.prototype.$class.Team.Team({
              id: team,
              league: 'thrhl'
            });
          }
        }

        function startingDraft() {
          var nextPlayerTo = 100;
          var nextGoalieTo = 100;
          var teamGoalies = {};
          var teamPlayers = {};
          var freeAgentlist = JSON.parse(JSON.stringify(Vue.prototype.$players.freeAgents));

          for (var p = 0; p < freeAgentlist.length; p++) {
            var player = Vue.prototype.$players[freeAgentlist[p]];

            if (player.position === 'g' && (teamGoalies[nextGoalieTo] < 6 || isNaN(teamGoalies[nextGoalieTo]))) {
              player.switchTeam(nextGoalieTo);

              if (isNaN(teamGoalies[nextGoalieTo])) {
                teamGoalies[nextGoalieTo] = 1;
              } else {
                teamGoalies[nextGoalieTo] += 1;
              }

              nextGoalieTo++;
            } else if (player.position !== 'g' && (teamPlayers[nextPlayerTo] < 60 || isNaN(teamPlayers[nextPlayerTo]))) {
              if (player.age < 21) {
                player.league = 'prospects';
                Vue.prototype.$players.freeAgents = Vue.prototype.$players.freeAgents.filter(function (pid) {
                  return pid !== player.id;
                });
              }

              player.switchTeam(nextPlayerTo);

              if (isNaN(teamPlayers[nextPlayerTo])) {
                teamPlayers[nextPlayerTo] = 1;
              } else {
                teamPlayers[nextPlayerTo] += 1;
              }

              nextPlayerTo++;
            }

            if (nextPlayerTo >= 132) {
              nextPlayerTo = 100;
            } else if (nextGoalieTo >= 132) {
              nextGoalieTo = 100;
            }
          }
        }

        function manageRosters() {
          for (var league in {
            onehl: 0,
            twohl: 0,
            thrhl: 0
          }) {
            for (var team in Vue.prototype.$teams[league]) {
              if (league === 'onehl') {
                Vue.prototype.$teams.onehl[team].sortRoster();
              }

              Vue.prototype.$teams[league][team].generateLines(false, false, false);
            }
          }

          for (var player in Vue.prototype.$players.freeAgents) {
            Vue.prototype.$players[Vue.prototype.$players.freeAgents[player]].contract = {
              cap: 0,
              years: 0
            };
          }
        }

        startingPlayers();
        startingTeams();
        startingDraft();
        manageRosters();
        this.prospectGen();
      }
    };
  }, {}],
  16: [function (require, module, exports) {
    module.exports = {
      playoffStart: function playoffStart() {
        Vue.prototype.$gameInfo.time.period = 'playoff-r1';
        var leagues = {
          'onehl': 0,
          'twohl': 0,
          'thrhl': 0
        };
        var standings = {
          'onehl': [],
          'twohl': [],
          'thrhl': []
        };

        for (var league in leagues) {
          var gamesList = Object.keys(Vue.prototype.$schedule.id[league]);
          gamesList = gamesList.map(function (v) {
            return parseInt(v, 10);
          });
          gamesList = gamesList.filter(function (id) {
            return !isNaN(id);
          });

          for (var team in Vue.prototype.$teams[league]) {
            var current = Vue.prototype.$teams[league][team];
            standings[league].push({
              'id': current.id,
              'name': current.name.city,
              'gamesPlayed': current.stats.gamesPlayed,
              'points': current.stats.points,
              'wins': current.stats.wins,
              'losses': current.stats.losses,
              'otw': current.stats.otw,
              'otl': current.stats.otl,
              'sow': current.stats.sow,
              'sol': current.stats.sol,
              'goalsFor': current.stats.goalsFor,
              'goalsAgainst': current.stats.goalsAgainst
            });
          }

          standings[league] = standings[league].sort(function (a, b) {
            return a.points - b.points || a.goalsFor - a.goalsAgainst - (b.goalsFor - b.goalsAgainst);
          }).reverse();
          standings[league] = standings[league].slice(0, 16);
          var meta = {
            r1: {},
            r2: {},
            r3: {},
            r4: {}
          };

          for (var teamGroup = 0; teamGroup < 8; teamGroup++) {
            meta.r1[(teamGroup + 1).toString() + 'v' + (16 - teamGroup).toString()] = {
              hi: standings[league][teamGroup].id,
              lo: standings[league][15 - teamGroup].id,
              score: [0, 0]
            };
            Vue.prototype.$events.playoffs[league] = meta;
          }

          for (var teamGroup = 0; teamGroup < 8; teamGroup++) {
            var startDate = JSON.parse(JSON.stringify(Vue.prototype.$gameInfo.time.date));
            startDate.day += 1;
            var teamOne = standings[league][teamGroup];
            var teamTwo = standings[league][15 - teamGroup];
            var g = new Vue.prototype.$class.Game.Game({
              league: league,
              home: teamOne.id,
              away: teamTwo.id,
              date: startDate,
              type: 'playoff'
            });
            Vue.prototype.$schedule.id[league][g.id] = g;
          }
        }
      },
      playoffRound: function playoffRound(round) {
        var finishedRound = 'r' + (round - 1).toString();
        round = 'r' + round.toString();
        var nextRound = {
          r2: {
            '1v8': ['1v16', '8v9'],
            '2v7': ['2v15', '7v10'],
            '3v6': ['3v14', '6v11'],
            '4v5': ['4v13', '5v12']
          },
          r3: {
            '1v4': ['1v8', '4v5'],
            '2v3': ['2v7', '3v6']
          },
          r4: {
            '1v2': ['1v4', '2v3']
          }
        };
        var leagues = {
          onehl: 0,
          twohl: 0,
          thrhl: 0
        };

        for (var league in leagues) {
          var matchups = {};
          var playoffs = Vue.prototype.$events.playoffs[league];

          for (var series in nextRound[round]) {
            var fromSeries = nextRound[round][series];

            if (playoffs[finishedRound][fromSeries[0]].score[0] == 4) {
              var hiTeam = playoffs[finishedRound][fromSeries[0]].hi;
            } else {
              var hiTeam = playoffs[finishedRound][fromSeries[0]].lo;
            }

            if (playoffs[finishedRound][fromSeries[1]].score[0] == 4) {
              var loTeam = playoffs[finishedRound][fromSeries[1]].hi;
            } else {
              var loTeam = playoffs[finishedRound][fromSeries[1]].lo;
            }

            matchups[series] = {
              hi: hiTeam,
              lo: loTeam,
              score: [0, 0]
            };
            var startDate = JSON.parse(JSON.stringify(Vue.prototype.$gameInfo.time.date));
            startDate.day += 1;
            var g = new Vue.prototype.$class.Game.Game({
              league: league,
              home: hiTeam,
              away: loTeam,
              date: startDate,
              type: 'playoff'
            });
            Vue.prototype.$schedule.id[league][g.id] = g;
          }

          Vue.prototype.$events.playoffs[league][round] = matchups;
        }
      }
    };
  }, {}],
  17: [function (require, module, exports) {
    module.exports = {
      playerProgression: function playerProgression() {
        var season = Vue.prototype.$gameInfo.time.season;
        var monthFactor = [1, 1, 1, 1, 0.5, 0.5, 0.5, 0, 0.5, 1, 1, 1, 1, 1][Vue.prototype.$gameInfo.time.date.month];

        function realCeiling(player) {
          // generates the player's actual ceiling taking into account the ceiling and chance to achieve it
          // seed used so it's always the same
          var seed = player.seedRnd(0, 100, 99);

          if (seed < player.potential.chance["int"]) {
            return player.potential.ceiling["int"];
          } else {
            var ceiling = player.potential.ceiling["int"];
            var dif = see - player.potential.ceiling["int"];

            if (dif > 50) {
              var a = ceiling - dif * 0.4;
            } else {
              var b = 0.03 * dif;
              var a = ceiling - dif / Math.pow(2, b);
            }

            if (a > 45) {
              return parseInt(a);
            } else {
              return 45;
            }
          }
        }

        function ageFactor(age) {
          //ranges from -1 to 1
          if (age > 30) {
            return -(0.1 * age - 3);
          } else {
            var a = Math.abs(age - 30);
            return Math.pow(a, 1 / 3) / 3;
          }
        }

        function ceilingFactor(ceiling, overall) {
          //ranges from 0 to 1
          var dif = ceiling - overall;

          if (dif > 15) {
            return 1;
          } else {
            var a = -Math.pow(0.07 * dif - 1, 2) + 1;
            return a;
          }
        }

        function toiFactor(alltoi, gp, position) {
          // ranges from 0 to 2.5
          var toi = parseInt(alltoi / gp / 60); //minutes per game

          if (position === 'ld' || position === 'rd') {
            var a = toi * 0.12;
          } else {
            var a = toi * 0.1;
          }

          if (isNaN(a)) {
            return 0;
          } else if (a > 2.5) {
            return 2.5;
          } else {
            return a;
          }
        }

        function statsFactor(stat, gp, position) {
          // ranges from 0.5 to 2
          // stat is points or save %
          var points = stat / gp;

          if (position === 'ld' || position === 'rd') {
            var a = points * 1.2 + 0.5;
          } else if (position !== 'g') {
            var a = points * 1.8 + 0.5;
          } else {
            var a = 5 * (stat - 0.8) + 0.5;
          }

          if (isNaN(a)) {
            return 0.5;
          } else if (a > 2) {
            return 2;
          } else if (a < 0) {
            return 0;
          } else {
            return a;
          }
        }

        for (var p in Vue.prototype.$players) {
          if (isNaN(parseInt(p))) {
            continue;
          }

          var player = Vue.prototype.$players[p];

          if (!['onehl', 'twohl', 'thrhl'].includes(player.league)) {
            continue;
          }

          if (player.position === 'g') {
            //Goalies
            var attributeCategories = {
              hockey: ['glove', 'blocker', 'pads', 'rebound', 'puck'],
              athleticism: ['reflex', 'strength', 'stamina'],
              mental: ['iq', 'work', 'confidence']
            };
            var af = ageFactor(player.age);
            var cf = ceilingFactor(realCeiling(player), player.overall());
            var sf = statsFactor(player.stats[season].savePctg, 0, 'g');
            var mf = monthFactor;

            if (af > 0) {
              var score = af * cf * sf * mf;
            } else {
              var score = af * (1 - cf) * (1.5 - sf) * mf;
            }

            score = parseFloat(score.toFixed(2));

            for (var attribute in player.progression) {
              player.attributes[attribute] -= Math.floor(player.progression[attribute]);
              player.progression[attribute] += score * (Math.random() + 0.5);
              player.attributes[attribute] += Math.floor(player.progression[attribute]);

              if (player.attributes[attribute] > 100) {
                player.attributes[attribute] = 100;
              } else if (player.attributes[attribute] < 0) {
                player.attributes[attribute] = 0;
              }
            }
          } else {
            //Players
            var attributeCategories = {
              offence: ['oiq', 'wrist', 'slap', 'hands'],
              defence: ['diq', 'stick', 'blocking', 'hitting'],
              skills: ['skating', 'passing', 'handEye', 'faceOff'],
              other: ['strength', 'stamina', 'hustle', 'discipline']
            };
            var af = ageFactor(player.age);
            var cf = ceilingFactor(realCeiling(player), player.overall());
            var tf = toiFactor(player.stats[season].toi, player.stats[season].gamesPlayed, player.position);
            var sf = statsFactor(player.stats[season].points, player.stats[season].gamesPlayed, player.position);
            var mf = monthFactor;

            if (af > 0) {
              var score = af * cf * sf * tf * mf;
            } else {
              var score = af * (1 - cf) * (1.5 - sf) * (2 - tf) * mf;
            }

            score = parseFloat(score.toFixed(2));

            for (var attribute in player.progression) {
              player.attributes[attribute] -= Math.floor(player.progression[attribute]);
              player.progression[attribute] += score * (Math.random() + 0.5);
              player.attributes[attribute] += Math.floor(player.progression[attribute]);

              if (player.attributes[attribute] > 100) {
                player.attributes[attribute] = 100;
              } else if (player.attributes[attribute] < 0) {
                player.attributes[attribute] = 0;
              }
            }
          }
        }

        for (var p = 0; p < Vue.prototype.$players.juniors.length; p++) {
          var player = Vue.prototype.$players[Vue.prototype.$players.juniors[p]];
          var af = ageFactor(player.age);
          var cf = ceilingFactor(realCeiling(player), player.overall());
          var mf = monthFactor;
          var score = af * cf * mf * 1.5;

          for (var attribute in player.progression) {
            player.attributes[attribute] -= Math.floor(player.progression[attribute]);
            player.progression[attribute] += score * (Math.random() + 0.5);
            player.attributes[attribute] += Math.floor(player.progression[attribute]);

            if (player.attributes[attribute] > 100) {
              player.attributes[attribute] = 100;
            } else if (player.attributes[attribute] < 0) {
              player.attributes[attribute] = 0;
            }
          }
        }
      }
    };
  }, {}],
  18: [function (require, module, exports) {
    module.exports = {
      prospectGen: function prospectGen() {
        var regions = ['canada', 'states', 'easternEurope', 'europe', 'scandanavia', 'rest'];

        for (var n = 0; n < 300; n++) {
          var r = Math.round();

          if (r > 0.9) {
            var position = 'g';
          } else if (r > 0.54) {
            var position = ['ld', 'rd'][this.rnd(0, 1)];
          } else {
            var position = ['lw', 'c', 'rw'][this.rnd(0, 2)];
          }

          var region = regions[this.rnd(0, 5)];
          var player = new Vue.prototype.$class.Player.Player({
            type: 'prospect',
            position: position,
            region: region
          });
          Vue.prototype.$players[player.id] = player;
          Vue.prototype.$teams.prospects[region].players.push(player.id);
        }

        this.prospectFogOfWar();
      },
      prospectFogOfWar: function prospectFogOfWar() {
        var regions = ['canada', 'states', 'easternEurope', 'europe', 'scandanavia', 'rest'];

        for (var region in regions) {
          var players = Vue.prototype.$teams.prospects[regions[region]].players;

          for (var prospect in players) {
            var intToChance = function intToChance(_int3) {
              if (_int3 >= 80) {
                return 'A';
              } else if (_int3 >= 70) {
                return 'B';
              } else if (_int3 >= 60) {
                return 'C';
              } else if (_int3 >= 50) {
                return 'D';
              } else if (_int3 >= 30) {
                return 'E';
              } else {
                return 'F';
              }
            };

            var intToCeiling = function intToCeiling(_int4) {
              if (player.position === 'g') {
                if (_int4 > 80) {
                  return 'Starter';
                } else if (_int4 > 70) {
                  return 'Backup';
                } else {
                  return 'Replacement';
                }
              } else if (player.position === 'ld' | player.position === 'rd') {
                if (_int4 > 84) {
                  return '1st Pair';
                } else if (_int4 > 78) {
                  return '2nd Pair';
                } else if (_int4 > 74) {
                  return '3rd Pair';
                } else {
                  return 'Replacement';
                }
              } else if (player.position === 'lw' | player.position === 'c' | player.position === 'rw') {
                if (_int4 > 84) {
                  return 'Top 3';
                } else if (_int4 > 78) {
                  return 'Top 6';
                } else if (_int4 > 75) {
                  return 'Top 9';
                } else if (_int4 > 72) {
                  return 'Top 12';
                } else {
                  return 'Replacement';
                }
              }
            };

            var certainty = Vue.prototype.$gameInfo.scouting[regions[region]].points + this.rnd(-10, 10);
            var player = Vue.prototype.$players[players[prospect]];
            player.potential.certainty["int"] = certainty;
            player.potential.certainty.name = intToChance(certainty);
            player.potential.chance.shownInt = player.potential.chance["int"] + this.rnd(-Math.floor((100 - certainty) / 2), Math.floor((100 - certainty) / 2));
            player.potential.chance.shownName = intToChance(player.potential.chance.shownInt);
            player.potential.ceiling.shownInt = player.potential.ceiling["int"] + this.rnd(-Math.floor((100 - certainty) / 2), Math.floor((100 - certainty) / 2));
            player.potential.ceiling.shownName = intToCeiling(player.potential.ceiling.shownInt);
          }
        }
      }
    };
  }, {}],
  19: [function (require, module, exports) {
    module.exports = {
      nextDays: function nextDays(currentDay, days) {
        var months = {
          1: 31,
          2: 28,
          3: 31,
          4: 30,
          5: 31,
          6: 30,
          7: 31,
          8: 31,
          9: 30,
          10: 31,
          11: 30,
          12: 31
        };

        if (currentDay.day === 31 & currentDay.month === 12) {
          currentDay.day = 1;
          currentDay.month = 1;
          currentDay.year += 1;
        } else {
          //Rolls over the month
          if (currentDay.day + 1 > months[currentDay.month]) {
            currentDay.day = 1;
            currentDay.month += 1;
          } else {
            currentDay.day += 1;
          }
        }

        if (days == 1) {
          return currentDay;
        } else {
          return this.nextDays(currentDay, days - 1);
        }
      },
      prettyDate: function prettyDate(date) {
        var monthConvert = {
          1: 'January',
          2: 'February',
          3: 'March',
          4: 'April',
          5: 'May',
          6: 'June',
          7: 'July',
          8: 'August',
          9: 'September',
          10: 'October',
          11: 'November',
          12: 'December'
        };

        function daySuffix(day) {
          if ([1, 21, 31].includes(day)) {
            return day + 'st';
          }

          if ([2, 22].includes(day)) {
            return day + 'nd';
          }

          if ([3, 23].includes(day)) {
            return day + 'rd';
          }

          if (4 <= day & day <= 20 || 24 <= day & day <= 30) {
            return day + 'th';
          }
        }

        return monthConvert[date.month] + ' ' + daySuffix(date.day) + ' ' + date.year;
      },
      scheduleGen: function scheduleGen(length, startDate) {
        function shuffle(a) {
          var j, x, i;

          for (var i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
          }

          return a;
        }

        var leagues = {
          onehl: 0,
          twohl: 0,
          thrhl: 0
        };

        for (var league in leagues) {
          var schedule = {};
          var teams = [];

          for (var team in Vue.prototype.$teams[league]) {
            teams.push(team);
            schedule[team] = [];
          }

          var date = JSON.parse(JSON.stringify(startDate));
          Vue.prototype.$schedule.dates[league] = {};

          for (var game = 0; game < length; game++) {
            var shuffled = shuffle(teams);
            var groupOne = shuffled.slice(0, 16);
            var groupTwo = shuffled.slice(16);

            for (var tid = 0; tid < groupOne.length; tid += 2) {
              var g = new Vue.prototype.$class.Game.Game({
                league: league,
                home: groupOne[tid],
                away: groupOne[tid + 1],
                date: JSON.parse(JSON.stringify(date)),
                type: 'regular'
              });
              Vue.prototype.$schedule.id[league][g.id] = g;
            }

            date = this.nextDays(date, 1);

            for (var tid = 0; tid < groupTwo.length; tid += 2) {
              var g = new Vue.prototype.$class.Game.Game({
                league: league,
                home: groupTwo[tid],
                away: groupTwo[tid + 1],
                date: JSON.parse(JSON.stringify(date)),
                type: 'regular'
              });
              Vue.prototype.$schedule.id[league][g.id] = g;
            }

            date = this.nextDays(date, 1);
          }
        }
      },
      startPreSeason: function startPreSeason() {
        Vue.prototype.$schedule = {
          dates: {
            onehl: {},
            twohl: {},
            thrhl: {}
          },
          teams: {
            onehl: {},
            twohl: {},
            thrhl: {}
          },
          id: {
            onehl: {},
            twohl: {},
            thrhl: {}
          }
        };
        this.scheduleGen(8, {
          day: 2,
          month: 9,
          year: Vue.prototype.$gameInfo.time.season - 1
        });
      },
      startSeason: function startSeason() {
        Vue.prototype.$gameInfo.time.period = 'regular';
        var season = Vue.prototype.$gameInfo.time.season;
        Vue.prototype.$schedule = {
          dates: {
            onehl: {},
            twohl: {},
            thrhl: {}
          },
          teams: {
            onehl: {},
            twohl: {},
            thrhl: {}
          },
          id: {
            onehl: {},
            twohl: {},
            thrhl: {}
          }
        };
        this.scheduleGen(82, {
          day: 2,
          month: 10,
          year: season - 1
        });

        for (var league in {
          onehl: 0,
          twohl: 0,
          thrhl: 0
        }) {
          for (var tid in Vue.prototype.$teams[league]) {
            var team = Vue.prototype.$teams[league][tid];

            for (var stat in team.stats) {
              team.stats[stat] = 0;
            }
          }
        }

        for (var p in Vue.prototype.$players) {
          if (isNaN(parseInt(p))) {
            continue;
          }

          var player = Vue.prototype.$players[p];

          for (var stat in player.stats[season]) {
            player.stats[season][stat] = 0;
          }
        }
      }
    };
  }, {}],
  20: [function (require, module, exports) {
    module.exports = {
      simToDate: function simToDate(endDate) {
        var startDate = JSON.parse(JSON.stringify(Vue.prototype.$gameInfo.time.date));
        var currentDate = Vue.prototype.$gameInfo.time.date;
        var rawEnd = endDate;
        var currentInt = currentDate.day + currentDate.month * 100 + currentDate.year * 10000;
        endDate = endDate.day + endDate.month * 100 + endDate.year * 10000;

        if (endDate < currentInt) {
          return 'past';
        }

        while (dateCompare()) {
          simGameDay();
          console.log(currentDate.day);

          if (currentDate.day === 28) {
            this.playerProgression();
          }

          if (currentDate.day === 1 & currentDate.month === 9) {
            Vue.prototype.$gameInfo.time.period = 'pre-season';
          } else if (currentDate.day === 1 & currentDate.month === 10) {
            Vue.prototype.$gameInfo.time.period = 'regular';
            Vue.prototype.$events.freeAgency.day = 'season';
          } else if (currentDate.day === 1 & currentDate.month === 4) {
            Vue.prototype.$gameInfo.time.period = 'playoff-r1';
            this.playoffStart();
          } else if (currentDate.day === 20 & currentDate.month === 4) {
            Vue.prototype.$gameInfo.time.period = 'playoff-r2';
            this.playoffRound(2);
          } else if (currentDate.day === 10 & currentDate.month === 5) {
            Vue.prototype.$gameInfo.time.period = 'playoff-r3';
            this.playoffRound(3);
          } else if (currentDate.day === 1 & currentDate.month === 6) {
            Vue.prototype.$gameInfo.time.period = 'playoff-r4';
            this.playoffRound(4);
          } else if (currentDate.day === 15 & currentDate.month === 6) {
            this.addressChange('misc', 'year-end');
            this.retirees();
            currentDate.day += 1;
            return currentDate;
          } else if (currentDate.day === 26 & currentDate.month === 6) {
            this.addressChange('misc', 'draft');
            currentDate.day += 1;
            return currentDate;
          } else if (currentDate.day === 27 & currentDate.month === 6) {
            if (Vue.prototype.$events.draft.currentPick !== 'Completed') {
              this.addressChange('misc', 'draft');
              return currentDate;
            }
          } else if (currentDate.day === 29 & currentDate.month === 6) {
            this.yearEndReSign();
          } else if (currentDate.day === 1 & currentDate.month === 7) {
            Vue.prototype.$gameInfo.time.period = 'off-season';
            this.yearEnd();
          } else if (currentDate.day === 1 & currentDate.month === 7) {
            Vue.prototype.$events.freeAgency = {
              day: 'season'
            };
            this.tradeForNeeds();
            this.tradeForNeeds();
            this.tradeBuriedPlayers();
            this.tradeToEvenDepth();
            this.tradeUnderCap();
            this.cleanTeamRosters();
          } else if (currentDate.day === 2 & currentDate.month === 7) {
            this.tradeBuriedPlayers();
            this.tradeForNeeds();
            this.tradeBuriedPlayers();
            this.cleanTeamRosters();
          } else if (currentDate.day === 25 && currentDate.month === 8) {
            this.signNecessaryDepth();
            this.cleanTeamRosters();
            this.startPreSeason();
          } else if (currentDate.day === 25 && currentDate.month === 9) {
            this.startSeason();
          }

          if (currentDate.month === 7) {
            this.freeAgencyUpdate();
          } //checks if user's lines are valid during the season


          if ([9, 10, 11, 12, 1, 2, 3, 4, 5].includes(currentDate.month) || currentDate.month === 6 && currentDate.day < 15) {
            var userTeam = Vue.prototype.$gameInfo.player.team.toString();

            if (!Vue.prototype.$teams.onehl[userTeam].checkLineValidity() || !Vue.prototype.$teams.twohl['2' + userTeam.slice(1)].checkLineValidity() || !Vue.prototype.$teams.thrhl['3' + userTeam.slice(1)].checkLineValidity()) {
              return currentDate;
            }
          }

          currentDate = this.nextDays(currentDate, 1);
        }

        function simGameDay() {
          var stringDate = [currentDate.day, currentDate.month, currentDate.year].join('-');
          var leagues = {
            onehl: 0,
            twohl: 0,
            thrhl: 0
          };

          for (var league in leagues) {
            if (Object.keys(Vue.prototype.$schedule.dates[league]).includes(stringDate)) {
              for (var n = 0; n < Vue.prototype.$schedule.dates[league][stringDate].length; n++) {
                var id = Vue.prototype.$schedule.dates[league][stringDate][n];
                var game = Vue.prototype.$schedule.id[league][id];
                game.simGame();
              }
            }
          }
        }

        function dateCompare() {
          var same = false;

          if (currentDate.day !== rawEnd.day) {
            same = true;
          }

          if (currentDate.month !== rawEnd.month) {
            same = true;
          }

          if (currentDate.year !== rawEnd.year) {
            same = true;
          }

          return same;
        }

        Vue.prototype.$gameInfo.time.date = rawEnd;
        return rawEnd;
      }
    };
  }, {}],
  21: [function (require, module, exports) {
    module.exports = {
      addressChange: function addressChange(url, sub, details) {
        if (url === 'back') {
          if (Vue.prototype.$gameInfo.history.length > 1) {
            Vue.prototype.$gameInfo.history.pop();
            var lastPage = Vue.prototype.$gameInfo.history.pop();
            Vue.prototype.$gameInfo.page = JSON.parse(JSON.stringify(lastPage));
            Vue.prototype.$gameInfo.history.push(JSON.parse(JSON.stringify(Vue.prototype.$gameInfo.page)));
          }
        } else {
          Vue.prototype.$gameInfo.page = {
            url: url,
            sub: sub,
            details: details
          };
          Vue.prototype.$gameInfo.history.push(JSON.parse(JSON.stringify(Vue.prototype.$gameInfo.page)));
        }

        if (Vue.prototype.$gameInfo.history.length > 100) {
          Vue.prototype.$gameInfo.history = Vue.prototype.$gameInfo.history.slice(1);
        }
      },
      colour: function colour() {
        return {
          main: Vue.prototype.$gameInfo.colours.main,
          light: Vue.prototype.$gameInfo.colours.light
        };
      },
      laterDate: function laterDate(date1, date2) {
        // returns true if date 1 is after date2
        // dateX = {day:1, month: 10, year: 1998}
        var date1Score = date1.day + date1.month * 32 + date1.year * 1000;
        var date2Score = date2.day + date2.month * 32 + date2.year * 1000;
        return date1Score > date2Score;
      },
      loadGame: function loadGame(type) {
        if (type === 'upload') {
          var loadFile = new FileReader();
          loadFile.readAsText(document.getElementById('load-game-file').files[0]);

          loadFile.onload = function () {
            workOnFile(loadFile.result);
          };
        } else {
          workOnFile(Vue.prototype.$save[type]);
        }

        function workOnFile(data) {
          var data = JSON.parse(data);
          var backUp = {
            events: Vue.prototype.$events,
            gameInfo: Vue.prototype.$gameInfo,
            news: Vue.prototype.$news,
            players: Vue.prototype.$players,
            schedule: Vue.prototype.$schedule,
            teams: Vue.prototype.$teams
          };

          try {
            //For some reason navigation stops working if the data.gameInfo is directly used
            var gameInfo = backUp.gameInfo;
            gameInfo.history = [];
            gameInfo.page = {
              url: 'home',
              sub: '',
              details: {}
            };
            gameInfo.player.team = data.gameInfo.player.team;
            gameInfo.salaryCap = data.gameInfo.salaryCap;
            gameInfo.scouting = data.gameInfo.scouting;
            gameInfo.tickSpeed = data.gameInfo.tickSpeed;
            gameInfo.time = data.gameInfo.time; //Players

            var players = {
              onehl: [],
              twohl: [],
              thrhl: [],
              prospects: [],
              juniors: [],
              freeAgents: []
            };

            for (var league in players) {
              players[league] = data.players[league];
            }

            for (var p in data.players) {
              if (isNaN(parseInt(p))) {
                continue;
              }

              var player = new Vue.prototype.$class.Player.Player({
                type: 'load',
                load: data.players[p]
              });
              players[player.id] = player;
            } //Schedule


            var schedule = {
              dates: {
                onehl: {},
                twohl: {},
                thrhl: {}
              },
              teams: {
                onehl: {},
                twohl: {},
                thrhl: {}
              },
              id: {
                onehl: {},
                twohl: {},
                thrhl: {}
              }
            };
            schedule.dates = data.schedule.dates;
            schedule.teams = data.schedule.teams;

            for (var league in data.schedule.id) {
              for (var g in data.schedule.id[league]) {
                var game = new Vue.prototype.$class.Game.Game({
                  load: true,
                  loadData: data.schedule.id[league][g]
                });
                schedule.id[league][game.id] = game;
              }
            } //Teams


            var teams = {
              onehl: {},
              twohl: {},
              thrhl: {}
            };

            for (var league in teams) {
              for (var t in data.teams[league]) {
                var team = new Vue.prototype.$class.Team.Team({
                  load: true,
                  loadData: data.teams[league][t]
                });
                teams[league][team.id] = team;
              }
            }

            Vue.prototype.$events = data.events;
            Vue.prototype.$news = data.news;
            Vue.prototype.$players = players;
            Vue.prototype.$schedule = schedule;
            Vue.prototype.$teams = teams;
            Vue.prototype.$gameInfo = gameInfo;
          } catch (_unused17) {
            Vue.prototype.$events = backUp.events;
            Vue.prototype.$news = backUp.news;
            Vue.prototype.$players = backUp.players;
            Vue.prototype.$schedule = backUp.schedule;
            Vue.prototype.$teams = backUp.teams;
            Vue.prototype.$gameInfo = backUp.gameInfo;
          }
        }
      },
      newNews: function newNews(type, item) {
        if (item === false) {
          var entry = type;
        } else if (type === 'retire') {
          var leagueConvert = {
            onehl: '1HL',
            twohl: '2HL',
            thrhl: '3HL'
          };
          var entry = item.fullName + ' retires at the age of ' + item.age + ' from the ' + leagueConvert[item.league];
        } else if (type === 'contract') {
          var entry = item.fullName + ' has signed a ' + item.contract.years + ' year contract at ' + item.contract.cap + ' M';
        } else if (type === 'extension') {
          var entry = item.fullName + ' has signed a ' + item.newContract.years + ' year extension at ' + item.newContract.cap + ' M';
        } else if (type === 'free agent') {
          var player1 = Vue.prototype.$players[item[0]];
          var player2 = Vue.prototype.$players[item[1]];
          var entry = player1.name().last + ' (' + player1.overall() + ') and ' + player2.name().last + ' (' + player2.overall() + ') have entered free agency from the 1KHL';
        } else if (type === 'cap') {
          var spent = Vue.prototype.$teams.onehl[Vue.prototype.$gameInfo.player.team].capSpent();
          var left = (Vue.prototype.$gameInfo.salaryCap - spent).toFixed(1);

          if (left >= 0) {
            var entry = 'Your team has ' + left + ' M available to spend';
          } else {
            var entry = 'Your team has ' + Math.abs(parseFloat(left)) + ' M left to clear to be under the cap';
          }
        }

        Vue.prototype.$news.push(entry);

        if (Vue.prototype.$news.length > 10) {
          Vue.prototype.$news = Vue.prototype.$news.slice(1);
        }
      },
      readableTime: function readableTime(time) {
        //returns time on ice Integer as MM:SS
        var minutes = Math.floor(time / 60);
        var seconds = time - minutes * 60;

        if (seconds < 10) {
          seconds = '0' + seconds.toString();
        }

        var timeString = minutes.toString() + ':' + seconds.toString();
        var period = Math.floor(time / 1200) + 1;
        return {
          period: period,
          time: timeString
        };
      },
      rnd: function rnd(low, high) {
        //returns a random number between low and high (linear)
        var random = Math.random();
        var r = Math.floor(random * (high - low + 1));
        return low + r;
      },
      sameObject: function sameObject(object1, object2) {
        //returns true if both objects are the "same"
        // same as in same keys and values because {} === {} returns false
        var sameKeys = JSON.stringify(Object.keys(object1)) === JSON.stringify(Object.keys(object2));
        var sameValues = JSON.stringify(Object.values(object1)) === JSON.stringify(Object.values(object2));
        return sameKeys && sameValues;
      },
      teamConvert: function teamConvert(league, team) {
        var leagueConvert = {
          onehl: '1',
          twohl: '2',
          thrhl: '3'
        };
        return parseInt(leagueConvert[league] + team.toString().slice(1, 3));
      }
    };
  }, {}],
  22: [function (require, module, exports) {
    // The year ends at the end of June 30th, July 1st and free agency marks the next year
    module.exports = {
      retirees: function retirees() {
        for (var n in Vue.prototype.$players) {
          if (!isNaN(n)) {
            var player = Vue.prototype.$players[n];

            if (player.age > 34 && player.contract.years === 0 && isNaN(player.newContract.years)) {
              if (Math.random() > 0.5) {
                var userTeam = Vue.prototype.$gameInfo.player.team.toString();
                var userTeams = [userTeam, '2' + userTeam.slice(1), '3' + userTeam.slice(1)];

                if (userTeams.includes(player.team.toString())) {
                  this.newNews('retire', player);
                }

                player.retire();
              }
            } else if (player.age > 23 && player.overall < 50 && player.contract.years === 0 && isNaN(player.newContract.years)) {
              var userTeam = Vue.prototype.$gameInfo.player.team.toString();
              var userTeams = [userTeam, '2' + userTeam.slice(1), '3' + userTeam.slice(1)];

              if (userTeams.includes(player.team.toString())) {
                this.newNews('retire', player);
              }

              player.retire();
            }
          }
        }
      },
      yearEnd: function yearEnd() {
        var self = this;

        function updatePlayers() {
          for (var n in Vue.prototype.$players) {
            if (!isNaN(n)) {
              var player = Vue.prototype.$players[n];
              player.age += 1; //Reset progression

              for (var attribute in player.progression) {
                player.progression[attribute] = 0;
              } //Move stats back one year, remembers 4 years


              var season = Vue.prototype.$gameInfo.time.season + 1;
              player.stats[season] = player.generateStats();

              for (var n = 1; n < 4; n++) {
                try {
                  player.stats[season - n] = JSON.parse(JSON.stringify(player.stats[season - (n + 1)]));
                } catch (_unused18) {//hasn't played in the league that long
                }
              } //Releases players without contract, ages contract, appends extensions


              if (player.contract.years !== 0) {
                player.contract.years -= 1;
              } else {
                if (player.contract.cap === 0) {
                  player.contract.years = 0;
                  continue;
                } else if (Object.keys(player.newContract).length === 0) {
                  player.release();
                } else {
                  player.contract = JSON.parse(JSON.stringify(player.newContract));
                  player.newContract = {};
                }
              }

              for (var pid in Vue.prototype.$players) {
                if (typeof pid === 'undefined') {
                  if (typeof Vue.prototype.$players[pid] === 'undefined') {
                    delete Vue.prototype.$players[pid];
                  }
                }
              }
            }
          }
        }

        function updateGameInfo() {
          var game = Vue.prototype.$gameInfo;
          game.time.season += 1;

          for (var area in game.scouting) {
            game.scouting[area].points = 0;
          }
        }

        function updateProspects() {
          Vue.prototype.$events.draft = {};
          var startingList = JSON.parse(JSON.stringify(Vue.prototype.$players.prospects));

          for (var p = 0; p < startingList.length; p++) {
            Vue.prototype.$players[startingList[p]].retire();
          }

          for (var region in Vue.prototype.$teams.prospects) {
            Vue.prototype.$teams.prospects[region].players = [];
          }

          self.prospectGen();
        }

        function updateFreeAgents() {
          var allAdded = []; //Skaters

          for (var n = 0; n < 60; n++) {
            var player = new Vue.prototype.$class.Player.Player({
              type: 'free agent',
              position: 'any'
            });
            Vue.prototype.$players[player.id] = player;
            allAdded.push({
              id: player.id,
              overall: player.overall()
            });
          } //Goalies            


          for (var n = 0; n < 10; n++) {
            var player = new Vue.prototype.$class.Player.Player({
              type: 'free agent',
              position: 'g'
            });
            Vue.prototype.$players[player.id] = player;
            allAdded.push({
              id: player.id,
              overall: player.overall()
            });
          }

          allAdded = allAdded.sort(function (a, b) {
            return a.overall - b.overall;
          }).reverse();
          self.newNews('free agent', [allAdded[0].id, allAdded[1].id]);
        }

        function updateTeams() {
          for (var league in {
            onehl: 0,
            twohl: 0,
            thrhl: 0
          }) {
            for (var tid in Vue.prototype.$teams[league]) {
              var team = Vue.prototype.$teams[league][tid]; //Reset team stats

              for (var stat in team.stats) {
                team.stats[stat] = 0;
              }

              if (league === 'onehl') {
                //Update draft picks
                var season = Vue.prototype.$gameInfo.time.season + 1;
                delete team.picks[season];
                team.picks[season + 2] = [{
                  round: 1,
                  team: team.id
                }, {
                  round: 2,
                  team: team.id
                }, {
                  round: 3,
                  team: team.id
                }, {
                  round: 4,
                  team: team.id
                }, {
                  round: 5,
                  team: team.id
                }, {
                  round: 6,
                  team: team.id
                }, {
                  round: 7,
                  team: team.id
                }];
                team.sortRoster();
              }
            }
          }
        }

        Vue.prototype.$events.freeAgency = {
          day: 1
        };
        updatePlayers();
        updateGameInfo();
        updateProspects();
        updateFreeAgents();
        updateTeams();
        this.newNews('cap');
        this.newNews('Free agency has begun!', false);
      }
    };
  }, {}]
}, {}, [14]);