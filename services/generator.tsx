import { MatchDay } from "@/models/match-day.model";
import { Match } from "@/models/match.model";
import { match } from "assert";
import { shuffle } from "cypress/types/lodash";


export async function generate(
  teams: string[],
  [startDate, endDate]: [Date, Date],
  daysNotToPlay: string[]
): Promise<MatchDay[]> {
  return createMatrix(teams, startDate);
}


function initMatrix(teams: string[]): { [row: string]: { [column: string]: number } } {
  const matrix: { [row: string]: { [column: string]: number } } = {};
  teams.forEach((teamHome: string) => {
    matrix[teamHome] = {};
    teams.forEach(teamVisit => {
      matrix[teamHome][teamVisit] = -1;
      if (teamHome === teamVisit) {
        matrix[teamHome][teamVisit] = -999
      }
    });
  });
  return matrix;
}

function createMatrix(teams: string[], startDate: Date): MatchDay[] {
  const matchDays: MatchDay[] = [];
  const gameMatrix = initMatrix(teams);
  const gameDays = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
  Object.keys(gameMatrix)
    .forEach((homeTeam: string) => {
      let currentGameDaysForTeam = gameDays.slice();
      Object.keys(gameMatrix[homeTeam])
        .forEach((visitorTeam: string) => {
          console.log('game days:'+currentGameDaysForTeam)
          if (homeTeam === visitorTeam) return;
          let gamedayIndex;
          do {
            gamedayIndex = random_index(currentGameDaysForTeam)
          } while (bothTeamsArePlayingAtSameDay(gameMatrix, currentGameDaysForTeam[gamedayIndex], homeTeam, visitorTeam))
          console.log('game day index:'+gamedayIndex);
          gameMatrix[homeTeam][visitorTeam] = currentGameDaysForTeam[gamedayIndex];
          currentGameDaysForTeam.splice(gamedayIndex, 1);
          console.log('game days AFTER:'+currentGameDaysForTeam)

        });
    });
  console.log(gameMatrix);


for (let days = 0; days < gameDays.length; days++) {
  const matchDate = new Date(startDate);
  matchDate.setDate(matchDate.getDate() + days);
  const matchDay = createMatchDay(matchDate, gameMatrix, days);
  matchDays.push(matchDay);
} 
  /*
  matchDay.setDate(matchDay.getDate() + days);
  const matchDayObj = findOrCreateMatchDay(matchDays, matchDay);
  let matchdayTeams = getMatchdayTeams(gameMatrix, teams);
  console.log('match day teams', matchdayTeams);

  let hometeam: string;
  while (matchdayTeams.length > 1) {
    do {

      hometeam = random_item(matchdayTeams);
    } while (hasBeenLately(matchDays, ({ home }) => home === hometeam, days))
    matchdayTeams = matchdayTeams.filter((matchDayTeam) => matchDayTeam !== hometeam);

    let visitorTeam: string;
    do {

      visitorTeam = random_item(matchdayTeams);
    } while (hasFacedHomeLately(matchDays,hometeam, visitorTeam) ||  hasBeenLately(matchDays, ({ visitor }) => visitor === visitorTeam, days))
    matchdayTeams = matchdayTeams.filter((matchDayTeam) => matchDayTeam !== visitorTeam);

    const match: Match = {
      home: hometeam,
      visitor: visitorTeam
    };
    gameMatrix[hometeam][visitorTeam] = days;
    matchDayObj.matches.push(match);
  }
}
*/
  return matchDays;
}

function bothTeamsArePlayingAtSameDay(gameMatrix: { [row: string]: { [column: string]: number } }, 
  gameday: number,
  home: string, 
  visitor: string): boolean {
    let alreadyPlaying = false;

    Object.keys(gameMatrix)
    .forEach((homeTeam: string) => {
      Object.keys(gameMatrix[homeTeam])
      .forEach((visitorTeam: string) => {
        if (gameMatrix[homeTeam][visitorTeam] === gameday) {
          if (homeTeam === home || visitorTeam === home) {
            alreadyPlaying = true;
            return;
          }

          if (homeTeam === visitor || visitorTeam === visitor) {
            alreadyPlaying = true;
            return;
          }
        }

      })
    });


    return alreadyPlaying;
  
}

/*
function getMatchdayTeams(gameMatrix: { [row: string]: { [column: string]: number } }, teams: string[]): string[] {
  return teams
    .filter(team => teamHasNotPlayedAgainstAll(gameMatrix, team))
}

function teamHasNotPlayedAgainstAll(gameMatrix: { [row: string]: { [column: string]: number } }, team: string): boolean {
  let findNotMatch = Object.keys(gameMatrix[team]).find(visitor => gameMatrix[team][visitor] === -1);
  if !!(findNotMatch) {
    return true;
  }

  findNotMatch = Object.keys(gameMatrix[team]).find(visitor => gameMatrix[team][visitor] === -1);
  findNotMatch = Object.keys(gameMatrix).find(val => gameMatrix[val][team] === -1)
  if !!(findNotMatch) {
    return true;
  }
  return false;
}
*/


function createMatchDay(currentDate: Date, matrix: { [row: string]: { [column: string]: number } } , dayNumber: number): MatchDay {
  const matchDay: MatchDay = {
    day: currentDate,
    matches: []
  };
  Object.keys(matrix)
  .forEach((homeTeam) => {
    Object.keys(matrix[homeTeam])
    .forEach((visitorTeam) => {
      if (matrix[homeTeam][visitorTeam] === dayNumber) {
        matchDay.matches.push({
          home: homeTeam,
          visitor: visitorTeam
        });
      }

    });
  });
  return matchDay;
}

function random_index(items: number[]): number {
  return Math.floor(Math.random() * items.length);
}
