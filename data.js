const matchesData = {
  matches: [
    {
      id: 1,
      sport: "Football",
      league: "Ligue 1",
      time: "20:45",
      homeTeam: "PSG",
      awayTeam: "Marseille",
      odds: {
        "1": 1.85,
        "N": 3.40,
        "2": 4.20
      },
      status: "upcoming"
    },
    {
      id: 2,
      sport: "Football",
      league: "Premier League",
      time: "16:00",
      homeTeam: "Liverpool",
      awayTeam: "Arsenal",
      odds: {
        "1": 2.10,
        "N": 3.20,
        "2": 3.50
      },
      status: "upcoming"
    },
    {
      id: 3,
      sport: "Basketball",
      league: "NBA",
      time: "02:00",
      homeTeam: "Lakers",
      awayTeam: "Warriors",
      odds: {
        "1": 1.90,
        "2": 1.95
      },
      status: "upcoming"
    },
    {
      id: 4,
      sport: "Tennis",
      league: "Roland Garros",
      time: "14:00",
      homeTeam: "Nadal",
      awayTeam: "Djokovic",
      odds: {
        "1": 2.15,
        "2": 1.75
      },
      status: "upcoming"
    },
    {
      id: 5,
      sport: "Hockey",
      league: "NHL",
      time: "01:00",
      homeTeam: "Canadiens",
      awayTeam: "Bruins",
      odds: {
        "1": 2.45,
        "N": 3.80,
        "2": 2.20
      },
      status: "upcoming"
    }
  ],
  sports: [
    {
      id: "football",
      name: "Football",
      icon: "fas fa-futbol"
    },
    {
      id: "basketball",
      name: "Basketball",
      icon: "fas fa-basketball-ball"
    },
    {
      id: "tennis",
      name: "Tennis",
      icon: "fas fa-volleyball-ball"
    },
    {
      id: "hockey",
      name: "Hockey",
      icon: "fas fa-hockey-puck"
    }
  ]
};

export default matchesData;