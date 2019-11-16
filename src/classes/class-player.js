module.exports = {
  Player: class Player {
    constructor({
      type = null,
      region = null,

      position = null,
      load = null
    }) {
      if (type === 'start' || type === 'free agent' || type === 'depth') {
        this.league = 'freeAgents'
        this.team = 0
      }
      else if (type === 'prospect') {
        this.league = 'prospects'
        this.team = region
      }
      if (type !== 'load') {
        this.age = this.generateAge(type)
        this.position = this.generatePosition(position)
        this.attributes = this.generateAttributes(type)

        this.contract = this.generateContract(type)
        this.country = this.generateCountry(type)
        this.face = rnd(1, 50)
        this.id = this.playerId()
        this.fullName = this.generateName()
        this.newContract = {}
        this.progression = this.generateProgression()
        this.stats = {}
        this.stats[Vue.prototype.$gameInfo.time.season] = this.generateStats()
        this.positionStrength = this.positionStrength()
        this.potential = this.generatePotential(type)

        Vue.prototype.$players[this.league].push(this.id)
      }
      else {
        for (var info in load) {
          this[info] = load[info]
        }
      }
    }

    categoryScores() {
      function multiplier(value, variance) {
        // variance is how much above and below 1 the range can be
        // for example a variance of 0.10 (0.90 - 1.10)
        // value 0 returns 0.90, value 50 returns 1.00, value 90 returns 1.08
        var score = (1 - variance) + (variance * (value / 100) * 2)
        return score
      }

      const factor = {
        oiq: { lw: 0.30, c: 0.40, rw: 0.30, ld: 0.40, rd: 0.40 },
        wrist: { lw: 0.35, c: 0.30, rw: 0.35, ld: 0.10, rd: 0.10 },
        slap: { lw: 0.15, c: 0.10, rw: 0.15, ld: 0.25, rd: 0.25 },
        hands: { lw: 0.20, c: 0.20, rw: 0.20, ld: 0.15, rd: 0.15 },
        diq: { lw: 0.35, c: 0.35, rw: 0.35, ld: 0.35, rd: 0.35 },
        stick: { lw: 0.30, c: 0.30, rw: 0.30, ld: 0.25, rd: 0.25 },
        blocking: { lw: 0.25, c: 0.25, rw: 0.25, ld: 0.20, rd: 0.20 },
        hitting: { lw: 0.10, c: 0.10, rw: 0.10, ld: 0.20, rd: 0.20 },
        handEye: { lw: 0.10, c: 0.10, rw: 0.10, ld: 0.10, rd: 0.10 },
      }

      var scores = { offence: 0, defence: 0 }
      for (var type in scores) {
        // A player with perfect attributes would get a total of 100
        var total = 0
        if (type === 'offence') {
          if (this.position !== 'g') {
            total += this.attributes.oiq * factor.oiq[this.position]
            total += this.attributes.wrist * factor.wrist[this.position]
            total += this.attributes.slap * factor.slap[this.position]
            total += this.attributes.hands * factor.hands[this.position]
            total += this.attributes.handEye * factor.handEye[this.position]
            total /= 1.1
            total *= multiplier(this.attributes.skating, 0.125)
            total *= multiplier(this.attributes.passing, 0.1)
            total *= multiplier(this.attributes.strength, 0.05)
            total *= multiplier(this.attributes.hustle, 0.05)
            total /= (multiplier(100, 0.05) * multiplier(100, 0.05) * multiplier(100, 0.1) * multiplier(100, 0.125))
          }
          else {
            total += this.attributes.iq * 0.20
            total += this.attributes.puck * 0.60
            total += this.attributes.confidence * 0.20
          }
        }
        else if (type === 'defence') {
          if (this.position !== 'g') {
            total += this.attributes.diq * factor.diq[this.position]
            total += this.attributes.stick * factor.stick[this.position]
            total += this.attributes.blocking * factor.blocking[this.position]
            total += this.attributes.hitting * factor.hitting[this.position]
            total += this.attributes.handEye * factor.handEye[this.position]
            total /= 1.1
            total *= multiplier(this.attributes.skating, 0.125)
            total *= multiplier(this.attributes.passing, 0.1)
            total *= multiplier(this.attributes.strength, 0.05)
            total *= multiplier(this.attributes.hustle, 0.05)
            total /= (multiplier(100, 0.05) * multiplier(100, 0.05) * multiplier(100, 0.1) * multiplier(100, 0.125))
          }
          else {
            total += this.attributes.glove * 0.20
            total += this.attributes.blocker * 0.20
            total += this.attributes.pads * 0.20
            total += this.attributes.rebounds * 0.20
            total += this.attributes.reflex * 0.17
            total += this.attributes.puck * 0.03
            total *= multiplier(this.attributes.strength, 0.025)
            total *= multiplier(this.attributes.iq, 0.075)
            total *= multiplier(this.attributes.confidence, 0.03)
            total *= multiplier(this.attributes.work, 0.025)
            total /= (multiplier(100, 0.025) * multiplier(100, 0.075) * multiplier(100, 0.03) * multiplier(100, 0.025))
          }
        }
        scores[type] = Math.round(total)
      }

      return scores
    }


    desiredContract() {
      var cap = 1
      var years = 1

      if (this.age <= 20) {
        // Entry level contracts at minimum until age 21
        cap = 1
        years = 21 - this.age
      }

      else if (this.overall() <= 76) {
        //Minor league players get minimum contracts
        if (this.age < 25) {
          cap = 1
          years = 1
        }
        if (this.age < 29) {
          cap = 1
          years = this.seedRnd(1, 2, 1)
        }
        else {
          cap = 1
          years = this.seedRnd(1, 3, 1)
        }
      }

      else {
        if (this.age === 21) {
          years = this.seedRnd(2, 3, 1)
        }
        else if (this.age <= 25) {
          years = this.seedRnd(3, 4, 1)
        }
        else if (this.age <= 30) {
          years = this.seedRnd(6, 8, 1)
        }
        else if (this.age <= 34) {
          years = this.seedRnd(5, 7, 1)
        }
        else {
          years = this.seedRnd(1, 3, 1)
        }

        var cap = (this.overall() * 0.6 - 45)
        if (['c', 'ld', 'rd'].includes(this.position)) {
          cap += ((this.overall() - 60) / 10)
        }
        else if (this.position === 'g') {
          cap = (this.overall() * 0.5 - 37.2)
        }
        if (cap > 15) { cap = 15 }
        else if (cap < 1.25) { cap = 1.25 }

      }

      if (Vue.prototype.$events.freeAgency.day !== 'season') {
        if (Vue.prototype.$events.freeAgency.day > 10) {
          cap -= (Vue.prototype.$events.freeAgency.day - 10) * 0.1
        }
      }

      cap = parseFloat(cap.toFixed(2));
      if (cap < 1) { cap = 1 }

      return { cap: cap, years: years }
    }


    generateAge(type) {
      if (type === 'start' || type === 'free agent' || type === 'depth') {
        if (Math.random() < 0.85) {
          var age = rnd(18, 30) + rnd(0, 7)
        }
        else {
          var age = rnd(18, 21)
        }
        return age
      }
      else if (type === 'prospect') {
        return 17
      }
    }


    generateAttributes(type) {
      if (type === 'start') {
        var r = Math.random()

        if (r < 0.33) {
          var mean = rnd(60, 77)
        }
        else if (r < 0.66) {
          var mean = rnd(77, 88)
        }
        else if (r < 0.97) {
          var mean = rnd(89, 97)
        }
        else {
          var mean = rnd(95, 100)
        }

      }
      else if (type === 'prospect') {
        var mean = rnd(55, 80)
        if (Math.round() > 0.8) {
          mean += rnd(0, 20)
        }
      }
      else if (type === 'free agent') {
        var mean = (57, 75)
        if (Math.random() > 0.98) {
          mean += rnd(0, 25)
        }
      }
      else if (type === 'depth') {
        var mean = 55
      }

      if (this.age < 25) {
        mean -= ((25 - this.age))
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
        }
        return attributes
      }
      else {
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
        }
        return attributes
      }
    }


    generateContract(type) {
      if (type === 'start') {
        var contract = this.desiredContract()
        if (this.age > 20 && this.overall() >= 76) {
          var yearChange = this.seedRnd(0, 2, 2)
          contract.years += yearChange
          if (contract.years < 1 || contract.years > 8) {
            contract.years -= yearChange
          }

          var capChange = (this.seedRnd(-20, 20, 1) / 10)
          contract.cap += capChange
          if (contract.cap < 1.25 || contract.cap > 15) {
            contract.cap -= capChange
          }
          contract.cap = parseFloat(contract.cap.toFixed(2))
          return contract

        }
        else {
          return contract
        }

      }
      else if (type === 'prospect' || type === 'free agent' || type === 'depth') {
        return { cap: 0, years: 0 }
      }
    }


    generateCountry(type) {
      if (type === 'start' || type === 'free agent' || type === 'depth') {
        var country = [
          'Canada',
          'Russia', 'Ukraine', 'Latvia', 'Romania', 'Belarus', 'Czech', 'Slovakia',
          'France', 'United Kingdom', 'Germany', 'Italy', 'Switzerland', 'Austria', 'Croatia', 'Slovenia',
          'Japan', 'Congo', 'Australia', 'Chile', 'Argentina', 'Hong Kong', 'South Korea',
          'Sweden', 'Norway', 'Finland', 'Denamrk',
          'United States'
        ]
        var choice = country[rnd(0, (country.length - 1))]
        return choice
      }
      else if (type === 'prospect') {
        var regions = {
          canada: ['Canada'],
          easternEurope: ['Russia', 'Ukraine', 'Latvia', 'Romania', 'Belarus', 'Czech', 'Slovakia'],
          europe: ['France', 'United Kingdom', 'Germany', 'Italy', 'Switzerland', 'Austria', 'Croatia', 'Slovenia'],
          rest: ['Japan', 'Congo', 'Australia', 'Chile', 'Argentina', 'Hong Kong', 'South Korea'],
          scandanavia: ['Sweden', 'Norway', 'Finland', 'Denmark'],
          states: ['United States']
        }
        var choice = regions[this.team][rnd(0, (regions[this.team].length - 1))]
        return choice
      }
    }

    generateName() {
      var firstName = ["Jimmy", "Jori", "Michael", "Scott", "Ron", "Chris", "Adam", "Brooks", "Daniel", "Curtis", "Tucker", "Justin", "Niklas", "David", "Dale", "Anders", "TJ", "Gustav", "Derek", "Matt", "Paul", "Greg", "Eric", "Thomas", "Ryan", "Braydon", "Dion", "Jeff", "Dustin", "Brent", "Steve", "Zach", "Eric", "Ryan", "Matt", "Ryan", "Brian", "Jared", "Mark", "Patrick", "Dominic", "Loui", "Marcus", "Tage", "Brad", "Lance", "Patrice", "Rasmus", "Zac", "Shea", "Tommy", "Travis", "Zach", "Torey", "Andrei", "Denis", "Matt", "Christian", "David", "Matt", "J.T.", "Matt", "Dominik", "Christian", "Luke", "Troy", "Yanni", "Shane", "Zach", "Bobby", "Ryan", "Alex", "Morgan", "Hampus", "Nail", "Matt", "Pontus", "Phillip", "Jordie", "Sami", "Kyle", "Brady", "Stefan", "Tanner", "Scott", "Mark", "Olli", "Mike", "Jordan", "Zemgus", "Cody", "Tom", "Tomas", "Teuvo", "Derrick", "Jacob", "Slater", "Filip", "Radek", "Patrick", "Matt", "Colton", "Brendan", "Oskar", "Brad", "Esa", "Marc", "Chandler", "Shayne", "Devin", "Jujhar", "Adam", "Jimmy", "Nate", "Jordan", "Boo", "Damon", "Martin", "Colton", "Jake", "Mike", "Brock", "Micheal", "Joe", "Connor", "Kyle", "Charles", "Dominic", "Trevor", "Taylor", "Jaccob", "Andreas", "Patrick", "Gemel", "Brett", "Jake", "Kevin", "Toby", "Cedric", "Dustin", "Erik", "Carl", "Danny", "Paul", "Ryan", "Vinnie", "Matt", "Tanner", "Jared", "Antoine", "David", "Christoph", "Jake", "Joseph", "Connor", "Ben", "Alexander", "Sven", "Steven", "Jonathan", "Jaycob", "Adam", "Christian", "Joakim", "Brandon", "Matt", "Nicolas", "Steven", "Liam", "Keegan", "Kurtis", "Victor", "Blake", "Ashton", "Logan", "Alexander", "Calle", "Ethan", "Mark", "Mark", "Andrej", "Noah", "Jayson", "Marco", "Daniel", "Henrik", "Tyler", "Josh", "Andrew", "Tanner", "David", "Anthony", "Brent", "Johnny", "Jordan", "Marcus", "Kyle", "Nick", "Landon", "Ryan", "Josh", "Kyle", "Alex", "Jakob", "Tim", "John", "Danny", "Marian", "Evander", "Brayden", "Cam", "Casey", "Magnus", "Ryan", "Calvin", "Zack", "Peter", "Kevin", "Nick", "Corey", "Chris", "Jacob", "John", "Brayden", "Reilly", "Carter", "Tomas", "Kalle", "Kevin", "Chad", "Brandon", "Dmitry", "Paul", "Brandon", "Brian", "Richard", "Luke", "Matthew", "Marcus", "Auston", "Matt", "Jordan", "Craig", "Chris", "Charlie", "Casey", "David", "Nicolas", "Cody", "Alex", "Michael", "Patrik", "Kevin", "Clayton", "Jesse", "Zdeno", "Gabriel", "Justin", "Wade", "Gabriel", "Logan", "Anton", "Tyson", "Janne", "Byron", "Ben", "Victor", "Markus", "Erik", "John", "Evgeni", "Austin", "MacKenzie", "Samuel", "Pierre-Luc", "Tyler", "Will", "Henrik", "Joel", "Alex", "Jesper", "Andrew", "Blake", "Dennis", "Carson", "Drew", "Darren", "Nick", "Jordan", "Vladimir", "Ben", "Travis", "Jonny", "Mike", "Jake", "Nic", "Hudson", "Troy", "Tyrell", "John", "Pavel", "Blake", "Mattias", "Anthony", "Nikita", "Lee", "Brandon", "Anton", "Oliver", "Drake", "Alex", "David", "Miles", "Nick", "Justin", "Andrew", "Ben", "Michal", "Yohann", "Ryan", "Alexei", "Andre", "Michael", "Alexander", "Marko", "Morgan", "Jason", "Ryan", "Ian", "Chris", "Adam", "Jacob", "J.T.", "Valentin", "Laurent", "Remi", "Robert", "Steven", "Nic", "Gustav", "Dillon", "Carl", "Justin", "Madison", "Artturi", "Marc", "William", "Tyler", "Torrey", "Ryan", "Mike", "Brett", "Kris", "Nicholas", "Nathan", "Aleksander", "Jonathan", "Seth", "Elias", "Sean", "Darnell", "Rasmus", "Bo", "Samuel", "Max", "Josh", "Alexander", "Ryan", "Nikita", "Curtis", "Mirco", "Radko", "Anthony", "Frederik", "Brad", "Nick", "Jean-Sebastien", "Ross", "Derek", "Colby", "Taylor", "Dylan", "Will", "Dakota", "Erik", "Kyle", "Blake", "Trevor", "Josh", "Andrew", "Leo", "Jamie", "Brenden", "Eric", "Giovanni", "Milan", "Troy", "Mikael", "Eeli", "Maxim", "Matt", "Chris", "Curtis", "Matt", "Josh", "Bryan", "Ryan", "Adam", "Cal", "Dmitry", "Vadim", "James", "Kerby", "Claude", "Mike", "Alex", "Daniel", "Jordan", "Matt", "Peter", "Adam", "Tyler", "Francois", "Michael", "Brian", "Phil", "Jason", "Jannik", "Mikko", "Korbinian", "Dan", "Ales", "Nicklas", "Michael", "Nate", "Artem", "Shawn", "Matt", "Nikolay", "Andrew", "Mikhail", "Michael", "Chris", "Filip", "Jason", "Jonathan", "Artemi", "Kris", "Victor", "Tomas", "Mathieu", "Dalton", "Alexander", "Kris", "Patrick", "Christopher", "Mats", "Vladislav", "Roman", "Calle", "Oscar", "Martin", "Justin", "David", "Jason", "Tyler", "Ryan", "Johan", "Mark", "Stephen", "Greg", "Connor", "Jordan", "Michael", "Markus", "Kevin", "Evgeny", "Charlie", "Patrik", "Jon", "Tyler", "Cody", "Brock", "Alexander", "Devante", "Mike", "Nick", "Beau", "Derek", "Kevin", "Cam", "Paul", "Austin", "Jaden", "Sidney", "Riley", "Jack", "Benoit", "Andrej", "Chris", "Anze", "Jussi", "Brooks", "Jeff", "Zach", "Martin", "Alexander", "Deryk", "Erik", "Conor", "Brett", "Ryan", "T.J.", "Brendan", "Mark", "Trevor", "Ryan", "Nino", "Christian", "Jordan", "Marc-Edouard", "Taylor", "Joakim", "Michael", "Johnny", "Bryan", "Justin", "Adam", "Joonas", "Brendan", "Keith", "Tom", "Marcus", "Valtteri", "Cody", "Vladimir", "Tim", "Kenny", "Robert", "Zach", "Daniel", "Jesper", "Chris", "Oliver", "Jared", "Tom", "Niklas", "Garnet", "Anthony", "Brandon", "Frederick", "Vinni", "Jaromir", "Melker", "Freddie", "Kevin", "Kailer", "Pierre-Edouard", "Tomas", "Aaron", "Sam", "Leon", "Sam", "Michael", "Jake", "Haydn", "William", "Nikolaj", "Nick", "Kevin", "Brendan", "Jakub", "Julius", "Dylan", "Sonny", "Nathan", "Alex", "Zach", "Casey", "Kasperi", "John", "Cal", "David", "Nikita", "Nikolay", "Joshua", "Adrian", "John", "Brendan", "Ivan", "Owen", "Marcus", "Andreas", "Vladislav", "Roland", "Nathan", "Brandon", "Ryan", "Christian", "Martin", "Dominic", "Marek", "Warren", "Brett", "Mark", "Louie", "Anton", "Michael", "Antoine", "Lias", "Lucas", "Ben", "Erik", "Patric", "Justin", "Viktor", "Danton", "Nolan", "Gustav", "Tyson", "Alex", "Oskar", "Andrew", "Dennis", "Anton", "Anders", "Alexander", "Alex", "Karl", "Justin", "Jamie", "Jakub", "David", "Neal", "Oscar", "Dan", "Sammy", "Nick", "Dylan", "Ian", "Andreas", "Christopher", "Philip", "Henrik", "Jim", "Justin", "Jan", "Darren", "Kevin", "Shea", "Kyle", "Patrick", "Ondrej", "James", "Paul", "Sam", "Matthew", "Logan", "P.K.", "Chris", "Anthony", "Riley", "Thomas", "Jeff", "Kyle", "Brian", "Paul", "Sebastian", "Joe", "Brad", "Brendan", "Brandon", "Mattias", "Colton", "Tony", "David", "Luke", "Nick", "Chris", "Dryden", "Sami", "Taylor", "Carl", "Matt", "Mario", "Yannick", "Rick", "Patrick", "Kevan", "Derek", "Cory", "Evgenii", "Mikael", "Ryan", "Max", "Brian", "Jakub", "Jake", "Alec", "Mark", "Jack", "Carl", "Spencer", "Lars", "Wayne", "Scottie", "Trevor", "Nick", "Nazem", "Kyle", "Victor", "Jason", "Henrik", "Patrik", "Micheal", "Alex", "Matthew", "Frans", "Ondrej", "Scott", "Jay", "Zack", "Trevor", "Frank", "Rob", "Matt", "Lukas", "Josh", "Danick", "Frank", "Chase", "Max", "Nikita", "Josh", "Jakob", "Travis", "Dylan", "Alex", "Iiro", "Derick", "Jay", "Tomas", "Tyler", "Johnny", "Noah", "Rinat", "Kyle", "Radim", "Colin", "Pavel", "Connor", "Jack", "Tobias", "Vince", "Travis", "Jordan", "Timo", "Fredrik", "Blake", "Nick", "A.J.", "Sean", "Brendan", "Joe", "Sebastian", "Andrew", "Evgeny", "Christian", "Shane", "Vincent", "Travis", "Dylan", "Nick", "Brandon", "Brock", "Mathew", "Nicholas", "Joel", "Daniel", "Klas", "Andy", "Nick", "Andy", "Alan", "Jack", "Zach", "Nicolas", "Kyle", "Ryan", "Daniel", "Jean-Gabriel", "Thomas", "Mike", "Reid", "Duncan", "Lawson", "Ty", "Rocco", "Scott", "Tomas", "Adam", "Boone", "Mitchell", "Dmitrij", "Victor", "Brandon", "Brett", "Filip", "Joel", "Matt", "Xavier", "Zack", "Joel", "Miikka", "William", "Scott", "Ryan", "Ivan", "Nikita", "Ryan", "Gabriel", "Jonathan", "Adam", "Gabriel", "Mika", "Mark", "Sean", "Dougie", "Jonas", "Duncan", "Ryan", "Sven", "Jamie", "J.T.", "Joel", "Nathan", "Anthony", "Oscar", "Connor", "Stefan", "Joe", "Andy", "Phillip", "Tanner", "Rickard", "Jason", "Markus", "Evan", "Seth", "Mark", "Alexandre", "Brayden", "Andreas", "Dean", "Noel", "Nico", "Colin", "Derek", "Jonathan", "Jason", "Nate", "Andreas", "Tyler", "Drew", "Steven", "Alex", "Zach", "Luke", "Colin", "Mikkel", "Josh", "Tyler", "Barclay", "Erik", "Luca", "Mikko", "Jake", "Matt", "Michael", "Jordan", "Tyler", "John", "Roman", "Justin", "Aaron", "Zac", "Travis", "Derek", "Mitch", "Eric"]
      var lastName = ["Hayes", "Lehtera", "Stone", "Hartnell", "Hainsey", "Kunitz", "Henrique", "Orpik", "Brickley", "McKenzie", "Poolman", "Williams", "Kronwall", "Warsofsky", "Weise", "Lee", "Brodie", "Nyquist", "Grant", "Calvert", "Martin", "Pateryn", "Staal", "Vanek", "Suter", "Coburn", "Phaneuf", "Carter", "Brown", "Seabrook", "Bernier", "Parise", "Fehr", "Getzlaf", "Martin", "Kesler", "Boyle", "Spurgeon", "Barberio", "Eaves", "Moore", "Eriksson", "Kruger", "Thompson", "Hunt", "Bouma", "Bergeron", "Andersson", "Rinaldo", "Weber", "Wingels", "Sanheim", "Redmond", "Krug", "Mironov", "Malgin", "Bartkowski", "Wolanin", "Backes", "Hendricks", "Brown", "Tennyson", "Simon", "Jaros", "Glendening", "Terry", "Gourde", "Gersich", "Whitecloud", "Ryan", "Murray", "Galchenyuk", "Rielly", "Lindholm", "Yakupov", "Dumba", "Aberg", "Di Giuseppe", "Benn", "Niku", "Quincey", "Skjei", "Matteau", "Pearson", "Laughton", "Jankowski", "Maatta", "Matheson", "Schmaltz", "Girgensons", "Ceci", "Wilson", "Hertl", "Teravainen", "Pouliot", "Trouba", "Koekkoek", "Forsberg", "Faksa", "Sieloff", "Grzelcyk", "Parayko", "Leipsic", "Sundqvist", "Richardson", "Lindell", "Methot", "Stephenson", "Gostisbehere", "Shore", "Khaira", "Pelech", "Vesey", "Thompson", "Martinook", "Nieves", "Severson", "Frk", "Sissons", "McCabe", "Hoffman", "McGinn", "Ferland", "Pavelski", "Carrick", "Brodziak", "Hudon", "Toninato", "Carrick", "Leier", "Slavin", "Athanasiou", "Marleau", "Smith", "Kulak", "Guentzel", "Roy", "Enstrom", "Paquette", "Byfuglien", "Gustafsson", "Soderberg", "O'Regan", "LaDue", "Reaves", "Hinostroza", "Moulson", "Glass", "McCann", "Vermette", "Booth", "Bertschy", "Dotchin", "Blandisi", "Brown", "Hutton", "Kerfoot", "Andrighetto", "Kampfer", "Ericsson", "Megna", "Lowry", "Djoos", "Ryan", "Dubinsky", "Cullen", "Kerdiles", "Fogarty", "O'Brien", "Lowe", "MacDermid", "Ejdsell", "Coleman", "Sautner", "Shaw", "Steen", "Rosen", "Bear", "Giordano", "Borowiecki", "Sekera", "Juulsen", "Megna", "Scandella", "Sedin", "Sedin", "Bozak", "Leivo", "Mangiapane", "Fritz", "Desharnais", "Beauvillier", "Burns", "Boychuk", "Schroeder", "Johansson", "Palmieri", "Lappin", "Ferraro", "O'Reilly", "Gorges", "Clifford", "Chiasson", "Silfverberg", "Schaller", "Tavares", "DeKeyser", "Gaborik", "Kane", "Schenn", "Atkinson", "Nelson", "Paajarvi", "Ellis", "de Haan", "Kassian", "Cehlarik", "Labanc", "Leddy", "Perry", "Kreider", "Josefson", "Moore", "McNabb", "Smith", "Rowney", "Tatar", "Kossila", "Rooney", "Ruhwedel", "Tanev", "Orlov", "Carey", "Pirri", "Dumoulin", "Panik", "Witkowski", "Tkachuk", "Foligno", "Matthews", "Duchene", "Szwarz", "Smith", "Wideman", "McAvoy", "Cizikas", "Savard", "Deslauriers", "Eakin", "DeBrincat", "Raffl", "Laine", "Connauton", "Keller", "Puljujarvi", "Chara", "Dumont", "Faulk", "Megan", "Bourque", "Brown", "Blidh", "Jost", "Kuokkanen", "Froese", "Chiarot", "Mete", "Granlund", "Haula", "Gilmour", "Malkin", "Czarnik", "Weegar", "Girard", "Dubois", "Motte", "Butcher", "Borgstrom", "Hanley", "Ovechkin", "Bratt", "Ladd", "Wheeler", "Seidenberg", "Soucy", "Stafford", "Archibald", "Jensen", "Nolan", "Tarasenko", "Sexton", "Zajac", "Brodzinski", "Green", "DeBrusk", "Dowd", "Fasching", "Stecher", "Goulbourne", "Hayden", "Buchnevich", "Comeau", "Janmark", "Duclair", "Zaitsev", "Stempniak", "Manning", "Slepyshev", "Bjorkstrand", "Caggiula", "Goligoski", "Krejci", "Wood", "Paul", "Auger", "Copp", "Harpur", "Kempny", "Auvitu", "Strome", "Emelin", "Burakovsky", "McCarron", "Edler", "Dano", "Klimchuk", "Dickinson", "Hartman", "McCoshen", "Bigras", "Erne", "de la Rose", "Compher", "Zykov", "Dauphin", "Elie", "Hagg", "Santini", "Petan", "Olofsson", "Heatherington", "Dahlstrom", "Bailey", "Bowey", "Lehkonen", "Staal", "Carrier", "Bertuzzi", "Mitchell", "Callahan", "Liambas", "Pesce", "Versteeg", "Baptiste", "MacKinnon", "Barkov", "Drouin", "Jones", "Lindholm", "Monahan", "Nurse", "Ristolainen", "Horvat", "Morin", "Domi", "Morrissey", "Wennberg", "Pulock", "Zadorov", "Lazar", "Mueller", "Gudas", "Mantha", "Gauthier", "Marchand", "Foligno", "Dea", "Johnston", "Dorsett", "Cave", "Hall", "Gambrell", "O'Neill", "Mermis", "Johnson", "Okposo", "Hillman", "Lewis", "Anderson", "Cogliano", "Komarov", "McGinn", "Dillon", "Gryba", "Fiore", "Lucic", "Brouwer", "Granlund", "Tolvanen", "Mamin", "Hunwick", "Stewart", "Valk", "Beleskey", "Jooris", "Little", "Lomberg", "Gaudette", "Clutterbuck", "Kulikov", "Shipachyov", "Neal", "Rychel", "Giroux", "Fisher", "Biega", "Winnik", "Staal", "Niskanen", "Holland", "Cracknell", "Seguin", "Beauchemin", "Grabner", "Gionta", "Kessel", "Spezza", "Hansen", "Koivu", "Holzer", "Hamhuis", "Hemsky", "Backstrom", "Frolik", "Prosser", "Anisimov", "Matthias", "Irwin", "Kulemin", "MacDonald", "Sergachev", "Cammalleri", "Thorburn", "Chytil", "Pominville", "Toews", "Panarin", "Letang", "Antipin", "Plekanec", "Perreault", "Prout", "Radulov", "Russell", "Sharp", "Tanev", "Zuccarello", "Namestnikov", "Polak", "Jarnkrok", "Lindberg", "Marincin", "Holl", "Schlemko", "Zucker", "Toffoli", "Spooner", "Larsson", "Alt", "Johns", "McKegg", "Brickley", "Weal", "Bournival", "Nutivaara", "Bieksa", "Kuznetsov", "Coyle", "Nemeth", "Merrill", "Pitlick", "McLeod", "Nelson", "Petrovic", "Smith-Pelly", "Blunden", "Bjugstad", "Bennett", "Forbort", "Hayes", "Fowler", "Stastny", "Watson", "Schwartz", "Crosby", "Sheahan", "Johnson", "Pouliot", "Sustr", "Wagner", "Kopitar", "Jokinen", "Laich", "Skinner", "Hyman", "Hanzal", "Burmistrov", "Engelland", "Gudbranson", "Sheary", "Connolly", "Johansen", "Oshie", "Gaunce", "Pysyk", "van Riemsdyk", "Carpenter", "Niederreiter", "Folin", "Oesterle", "Vlasic", "Chorney", "Nordstrom", "Chaput", "Oduya", "Rust", "Abdelkader", "McQuaid", "Donskoi", "Gallagher", "Yandle", "Kuhnhackl", "Sorensen", "Filppula", "Franson", "Sobotka", "Heed", "Agostino", "Bortuzzo", "Aston-Reese", "Carr", "Fast", "Butler", "Ekman-Larsson", "Boll", "Pyatt", "Hjalmarsson", "Hathaway", "Bitetto", "Davidson", "Gaudreau", "Lettieri", "Jagr", "Karlsson", "Hamilton", "Gravel", "Yamamoto", "Bellemare", "Nosek", "Ekblad", "Reinhart", "Draisaitl", "Bennett", "Dal Colle", "Virtanen", "Fleury", "Nylander", "Ehlers", "Ritchie", "Fiala", "Perlini", "Vrana", "Honka", "Larkin", "Milano", "Gerbe", "Tuch", "Trotman", "Mittelstadt", "Kapanen", "Klingberg", "O'Reilly", "Pastrnak", "Scherbak", "Goldobin", "Ho-Sang", "Kempe", "Quenneville", "Lemieux", "Barbashev", "Tippett", "Pettersson", "Englund", "Kamenev", "McKeown", "Walker", "Montour", "Donato", "Dvorak", "Necas", "Turgeon", "Hrivik", "Foegele", "Lernout", "Letestu", "Belpedio", "Stralman", "Amadio", "Roussel", "Andersson", "Wallmark", "Lovejoy", "Burgdoerfer", "Hornqvist", "Kloos", "Arvidsson", "Heinen", "Patrick", "Forsling", "Barrie", "Iafallo", "Lindblom", "Crescenzi", "Rasmussen", "Lindholm", "Bjork", "Nylander", "Killorn", "Alzner", "Falk", "Benn", "Jerabek", "Kampf", "Pionk", "Fantenberg", "Girardi", "Blais", "Bonino", "Sikura", "Cole", "Borgman", "DiDomenico", "Holm", "Haapala", "O'Brien", "Braun", "Rutta", "Helm", "Shattenkirk", "Theodore", "Criscuolo", "Maroon", "Kase", "van Riemsdyk", "Byron", "Gagner", "Highmore", "Couture", "Subban", "Tierney", "Peluso", "Nash", "Hickey", "Petry", "Turris", "Lashoff", "Postma", "Aho", "Hicketts", "Malone", "Smith", "Sutter", "Ekholm", "Sceviour", "DeAngelo", "Perron", "Kunin", "Schmaltz", "Kelly", "Hunt", "Vatanen", "Fedun", "Gunnarsson", "Read", "Kempe", "Weber", "Nash", "Kane", "Miller", "MacKenzie", "Conacher", "Dadonov", "Backlund", "McDonagh", "Pacioretty", "Gibbons", "Voracek", "Muzzin", "Martinez", "Stone", "Rodewald", "Hagelin", "Foo", "Eller", "Simmonds", "Upshall", "Daley", "Holden", "Kadri", "Capobianco", "Hedman", "Demers", "Zetterberg", "Berglund", "Haley", "Broadhurst", "Peca", "Nielsen", "Palat", "Wilson", "Bouwmeester", "Smith", "Murphy", "Corrado", "O'Gara", "Stajan", "Sedlak", "Manson", "Martel", "Vatrano", "Balisy", "McCormick", "Soshnikov", "Archibald", "Chychrun", "Boyd", "DeMelo", "Formenton", "Pakarinen", "Brassard", "Beagle", "Hyka", "Graovac", "Gaudreau", "Hanifin", "Valiev", "Connor", "Vrbata", "White", "Zacha", "McDavid", "Eichel", "Rieder", "Dunn", "Dermott", "Greenway", "Meier", "Claesson", "Pietila", "Seeler", "Greer", "Kuraly", "Guhle", "Thornton", "Aho", "Shaw", "Svechnikov", "Fischer", "Prince", "Trocheck", "Konecny", "Strome", "Cousins", "Carlo", "Boeser", "Barzal", "Merkley", "Ward", "Catenacci", "Dahlbeck", "Andreoff", "Shore", "Welinski", "Quine", "Roslovic", "Werenski", "Roy", "Rau", "Dzingel", "Sprong", "Pageau", "Chabot", "Reilly", "Boucher", "Keith", "Crouse", "Rattie", "Grimaldi", "Mayfield", "Jurco", "Clendening", "Jenner", "Marner", "Jaskin", "Rask", "Saad", "Ritchie", "Chlapik", "Edmundson", "Nieto", "Ouellet", "Mitchell", "Eriksson Ek", "Salomaki", "Karlsson", "Harrington", "Sproul", "Provorov", "Kucherov", "Nugent-Hopkins", "Landeskog", "Huberdeau", "Larsson", "Carlsson", "Zibanejad", "Scheifele", "Couturier", "Hamilton", "Brodin", "Siemens", "Murphy", "Baertschi", "Oleksiak", "Miller", "Armia", "Beaulieu", "Cirelli", "Klefbom", "Murphy", "Noesen", "Morrow", "Greene", "Danault", "Kero", "Rakell", "Chimera", "Hannikainen", "Rodrigues", "Griffith", "Streit", "Burrows", "Point", "Martinsen", "Kukan", "Acciari", "Hischier", "Miller", "Ryan", "Marchessault", "Garrison", "Schmidt", "Johnsson", "Johnson", "Doughty", "Stamkos", "Pietrangelo", "Bogosian", "Schenn", "Wilson", "Boedker", "Bailey", "Myers", "Goodrow", "Karlsson", "Sbisa", "Rantanen", "Gardiner", "Benning", "Del Zotto", "Eberle", "Ennis", "Carlson", "Josi", "Schultz", "Ness", "Dalpe", "Hamonic", "Stepan", "Reinke", "Robinson"]
      var first = firstName[rnd(0, (firstName.length - 1))]
      var last = lastName[rnd(0, (lastName.length - 1))]
      return first + ' ' + last
    }


    generatePosition(pos) {
      if (pos === 'any') {
        if (Math.random() < 0.60) {
          return ['lw', 'c', 'rw'][rnd(0, 2)]
        }
        else {
          return ['ld', 'rd'][rnd(0, 1)]
        }
      }
      else {
        return pos
      }
    }


    generatePotential(type) {
      const position = this.position
      function intToChance(int) {
        if (int >= 80) { return 'A' }
        else if (int >= 70) { return 'B' }
        else if (int >= 60) { return 'C' }
        else if (int >= 50) { return 'D' }
        else if (int >= 30) { return 'E' }
        else { return 'F' }

      }
      function intToCeiling(int) {
        if (position === 'g') {
          if (int > 80) { return 'Starter' }
          else if (int > 70) { return 'Backup' }
          else { return 'Replacement' }
        }
        else if (position === 'ld' | position === 'rd') {
          if (int > 84) { return '1st Pair' }
          else if (int > 78) { return '2nd Pair' }
          else if (int > 74) { return '3rd Pair' }
          else { return 'Replacement' }
        }
        else if (position === 'lw' | position === 'c' | position === 'rw') {
          if (int > 84) { return 'Top 3' }
          else if (int > 78) { return 'Top 6' }
          else if (int > 75) { return 'Top 9' }
          else if (int > 72) { return 'Top 12' }
          else { return 'Replacement' }
        }
      }

      var potential = {
        ceiling: { int: 0, name: '', shownInt: 0, shownName: '' },
        chance: { int: 0, name: '', shownInt: 0, shownName: '' },
        certainty: { int: 100, name: 'A' }
      }

      const overall = this.overall()

      if (type === 'start' || type === 'free agent') {
        if (this.age >= 33) {
          potential.ceiling.int = overall
          potential.ceiling.name = intToCeiling(overall)
          potential.chance.int = 100
          potential.chance.name = 'A'
        }
        else if (this.age >= 29) {
          potential.ceiling.int = overall + rnd(0, 1)
          potential.ceiling.name = intToCeiling(overall + potential.ceiling.int)
          potential.chance.int = rnd(90, 100)
          potential.chance.name = intToChance(potential.chance.int)
        }
        else if (this.age >= 26) {
          potential.ceiling.int = overall + rnd(0, 5)
          potential.ceiling.name = intToCeiling(overall + potential.ceiling.int)
          potential.chance.int = rnd(80, 100)
          potential.chance.name = intToChance(potential.chance.int)
        }
        else if (this.age >= 23) {
          potential.ceiling.int = overall + rnd(0, 12)
          potential.ceiling.name = intToCeiling(overall + potential.ceiling.int)
          potential.chance.int = rnd(50, 100)
          potential.chance.name = intToChance(potential.chance.int)
        }
        else if (this.age >= 20) {
          potential.ceiling.int = overall + rnd(0, 15)
          potential.ceiling.name = intToCeiling(overall + potential.ceiling.int)
          potential.chance.int = rnd(30, 100)
          potential.chance.name = intToChance(potential.chance.int)
        }
        else if (this.age >= 18) {
          potential.ceiling.int = overall + rnd(0, 25)
          potential.ceiling.name = intToCeiling(overall + potential.ceiling.int)
          potential.chance.int = rnd(15, 100)
          potential.chance.name = intToChance(potential.chance.int)
        }
      }
      else if (type === 'prospect') {
        potential.ceiling.int = overall + rnd(0, 25)
        if (Math.random() > 0.8) { potential.ceiling.int += rnd(0, 20) }
        potential.ceiling.name = intToCeiling(overall + potential.ceiling.int)
        potential.chance.int = rnd(10, 70)
        if (Math.random() > 0.7) { potential.chance.int += rnd(0, 30) }
        potential.chance.name = intToChance(potential.chance.int)
      }
      if (potential.ceiling.int > 100) { potential.ceiling.int = 100 }
      if (potential.chance.int > 100) { potential.chance.int = 100 }
      return potential
    }

    generateProgression() {
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
        }
      }
      else {
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
        }
      }
      return attributes
    }
    

    generateStats() {
      if (this.position === 'g') {
        return { gamesPlayed: 0, saves: 0, goalsAgainst: 0, savePctg: 0, gaa: 0, toi: 0 }
      }
      else {
        return { gamesPlayed: 0, points: 0, goals: 0, assists: 0, toi: 0, pim: 0, shots: 0 }
      }
    }


    name() {
      const name = this.fullName.split(' ')
      const abb = name[0].slice(0, 1) + '. ' + name[1]
      const first = name[0]
      const last = name[1]

      return { abb: abb, first: first, last: last }
    }


    overall() {
      function weighter(valueOne, weightOne, valueTwo, weightTwo) {
        return Math.round((valueOne * weightOne) + (valueTwo * weightTwo))
      }

      var overall = 0
      var scores = this.categoryScores()

      if (this.position === 'g') {
        overall = scores.defence
      }
      else if (this.position === 'c') {
        overall = weighter(scores.offence, 0.7, scores.defence, 0.3)
      }
      else if (['lw', 'rw'].includes(this.position)) {
        overall = weighter(scores.offence, 0.8, scores.defence, 0.2)
      }
      else if (['ld', 'rd'].includes(this.position)) {
        overall = weighter(scores.offence, 0.2, scores.defence, 0.8)
      }

      if (overall > 100) { overall = 100 }

      return overall

    }


    playerId() {
      var dupe = true
      var id = 0
      while (dupe) {
        id = rnd(10, 9999997)
        if (typeof Vue.prototype.$players[id] === 'undefined') {
          break
        }
      }
      return id
    }


    positionStrength() {
      const bestPosition = this.position
      if (bestPosition === 'lw') {
        return { 'lw': 1, 'c': 0.8, 'rw': 0.9, 'ld': 0.4, 'rd': 0.3 }
      }
      else if (bestPosition === 'c') {
        return { 'lw': 0.9, 'c': 1, 'rw': 0.9, 'ld': 0.4, 'rd': 0.4 }
      }
      else if (bestPosition === 'rw') {
        return { 'lw': 0.9, 'c': 0.8, 'rw': 1, 'ld': 0.3, 'rd': 0.4 }
      }
      else if (bestPosition === 'ld') {
        return { 'lw': 0.4, 'c': 0.4, 'rw': 0.4, 'ld': 1, 'rd': 0.8 }
      }
      else if (bestPosition === 'rd') {
        return { 'lw': 0.4, 'c': 0.4, 'rw': 0.4, 'ld': 0.8, 'rd': 1 }
      }
    }


    release() {
      this.contract = { cap: 0, years: 0 }
      this.newContract = {}
      const id = this.id
      if (this.league === 'juniors') {
        Vue.prototype.$teams.onehl[this.team].juniors = Vue.prototype.$teams.onehl[this.team].juniors.filter(
          function (pid) {
            return pid !== id
          })
      }
      else {
        Vue.prototype.$teams[this.league][this.team].players = Vue.prototype.$teams[this.league][this.team].players.filter(
          function (pid) {
            return pid !== id
          })
      }
      this.removeFromLines(this.league, this.team)
      Vue.prototype.$players.freeAgents.push(this.id)
      this.team = 0
      this.league = 'freeAgents'
    }


    removeFromLines(oldLeague, oldTeam) {
      try {
        if (!['juniors', 'freeAgents', 'prospects'].includes(oldLeague)) {
          var lines = Vue.prototype.$teams[oldLeague][oldTeam].lines
          for (var strength in lines) {
            for (var position in lines[strength]) {
              for (var p in lines[strength][position]) {
                if (lines[strength][position][p] === this.id) {
                  lines[strength][position][p] = 0
                }
              }
            }
          }
          var goalieIndex = lines.g.indexOf(this.id)
          if (goalieIndex !== -1) {
            lines.g[goalieIndex] = 0
          }
        }
      }
      catch {
        //starting a new game
      }

    }


    retire() {
      const id = this.id
      if (this.league === 'prospects') {
        Vue.prototype.$teams.prospects[this.team].players = Vue.prototype.$teams.prospects[this.team].players.filter(pid => pid != id)
      }
      else if (this.league !== 'freeAgents') {
        Vue.prototype.$teams[this.league][this.team].players = Vue.prototype.$teams[this.league][this.team].players.filter(
          pid => pid != id)
      }
      for (var league in { onehl: 0, twohl: 0, thrhl: 0, juniors: 0, prospects: 0, freeAgents: 0 }) {
        Vue.prototype.$players[league] = Vue.prototype.$players[league].filter(pid => pid != id)
      }
      this.removeFromLines(this.league, this.team)
      delete Vue.prototype.$players[id]
    }


    seedRnd(low, high, num) {
      //close enough to random
      var num = parseFloat('0.' + Math.sin(seed).toString().slice(num + 4))
      var seed = parseInt(this.id) * parseInt(this.age) * num
      var random = parseFloat('0.' + Math.sin(seed).toString().slice(5))
      var r = Math.floor(random * (high - low + 1))
      return low + r
    }


    switchTeam(team) {
      const leagueConvert = { 1: 'onehl', 2: 'twohl', 3: 'thrhl' }
      team = team.toString()

      if (this.league === 'prospects') {
        var newTeam = team.split('-')[0]
        var newLeague = 'juniors'
        Vue.prototype.$teams.onehl[newTeam].juniors.push(this.id)
        Vue.prototype.$players.juniors.push(this.id)
        Vue.prototype.$players.prospects = Vue.prototype.$players.prospects.filter((id) => { return id !== this.id })
      }
      else if (this.league === 'juniors') {
        var sameTeam = team.toString().slice(1) === this.team.toString().slice(1)

        if (sameTeam) {
          var newTeam = team
          var newLeague = leagueConvert[team.toString().slice(0, 1)]
          Vue.prototype.$teams.onehl[this.team].juniors = Vue.prototype.$teams.onehl[this.team].juniors.filter((id) => { return id !== this.id })
          Vue.prototype.$players.juniors = Vue.prototype.$players.juniors.filter((id) => { return id !== this.id })
          Vue.prototype.$players[newLeague].push(this.id)
          Vue.prototype.$teams[newLeague][team].players.push(this.id)
          this.contract = { years: 21 - this.age, cap: 1 }
        }
        else {
          var newTeam = '1' + team.slice(1)
          var newLeague = 'juniors'
          Vue.prototype.$teams.onehl[this.team].juniors = Vue.prototype.$teams.onehl[this.team].juniors.filter((id) => { return id !== this.id })
          Vue.prototype.$teams.onehl[newTeam].juniors.push(this.id)
        }
      }
      else if (this.league === 'freeAgents') {
        var newTeam = '3' + team.slice(1, 3)
        var newLeague = 'thrhl'
        Vue.prototype.$teams.thrhl[newTeam].players.push(this.id)
        Vue.prototype.$players.thrhl.push(this.id)
        Vue.prototype.$players.freeAgents = Vue.prototype.$players.freeAgents.filter((id) => { return id !== this.id })
      }
      else {
        var newTeam = team
        var newLeague = leagueConvert[team.toString().slice(0, 1)]
        var oldTeam = this.team
        var oldLeague = this.league

        Vue.prototype.$players[oldLeague] = Vue.prototype.$players[oldLeague].filter((id) => { return id !== this.id })
        Vue.prototype.$players[newLeague].push(this.id)

        Vue.prototype.$teams[oldLeague][oldTeam].players = Vue.prototype.$teams[oldLeague][oldTeam].players.filter((id) => { return id !== this.id })
        Vue.prototype.$teams[newLeague][newTeam].players.push(this.id)
      }
      //remove player from old lines
      this.removeFromLines(oldLeague, oldTeam)

      this.league = newLeague
      this.team = parseInt(newTeam)
    }


    teamName() {
      if (this.league === 'freeAgents') {
        return { city: 'Free Agency', logo: '', full: 'Free Agency', abb: 'FA' }
      }
      else if (this.league === 'prospects') {
        const cityConvert = { canada: 'Canada', easternEurope: 'East Europe', europe: 'West Europe', rest: 'Other', scandanavia: 'Scandanavia', states: 'United States' }
        const abbConvert = { canada: 'CAN', easternEurope: 'EUE', europe: 'EUW', rest: 'OTH', scandanavia: 'SCN', states: 'USA' }
        return { city: cityConvert[this.team], logo: 'Prospects', full: cityConvert[this.team] + ' Prospects', abb: abbConvert[this.team] }
      }
      else {
        if (this.league === 'juniors') {
          var teamName = Vue.prototype.$teams.onehl[this.team].name
          return { city: teamName.city, logo: 'Juniors', full: teamName.city + ' Juniors', abb: 'J' + teamName.abb }
        }
        else {
          //onehl, twohl, thrhl
          return Vue.prototype.$teams[this.league][this.team].name
        }
      }
    }


    tradeValue() {
      const overallFactor = this.overall() ** 1.5
      const ageFactor = (1 / (this.age + 28))
      const desiredContract = this.desiredContract()

      if (this.age + desiredContract.years > 33) {
        var yearsFactor = (((this.age + desiredContract.years) - 33) ** 1.4) ** -1
      }
      else {
        var yearsFactor = 1
      }

      if ((this.contract.cap - desiredContract.cap) > 0) {
        var capFactor = 1 + ((this.contract.cap - desiredContract.cap) / (8.1 - desiredContract.years))
      }
      else {
        var capFactor = 1 - ((this.contract.cap - desiredContract.cap) / (8.1 - desiredContract.years))
      }

      var finalValue = overallFactor * ageFactor * yearsFactor * capFactor ** 2

      return parseInt(finalValue)
    }



  }
}



// rnd is pasted so it doesn't have to be imported, the others are not used outside of this file

function rnd(low, high) {
  //returns a random number between low and high (linear)
  var random = Math.random()
  var r = Math.floor(random * (high - low + 1))
  return low + r
}


function normal(mean, range, min, max) {
  // generates a random number on a close enough to nomral distribution 
  // sd is replaced by range, returns mean +/- range
  range += 1
  var result = 0
  for (var n = 0; n < 3; n++) {
    result += Math.random()
  }
  result = result - 1.5
  result = Math.round(((result / 1.5) * range) + mean)

  if (result < min) {
    return normal(mean, range, min, max)
  }
  else if (result > max) {
    return normal(mean, range, min, max)
  }
  else {
    return result
  }
}


function halfNormal(direction, mean, value) {
  // generate a random number from half of a nomral ditribution
  // the half is decided by direction, returned int can't be past bound
  if (direction === 'left') {
    if (value > mean) {
      return (mean - (value - mean))
    }
    else {
      return value
    }
  }
  else if (direction === 'right') {
    if (value < mean) {
      return (mean + (mean - value))
    }
    else {
      return value
    }
  }
}
