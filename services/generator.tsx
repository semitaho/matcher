import { Configuration } from "@/models/configuration.model";
import { MatchDay } from "@/models/match-day.model";
import { Match } from "@/models/match.model";
import { Team, Team } from "@/models/team.enum";



export async function generate(
  configuration: Configuration
): Promise<MatchDay[]> {
  return createMatrix(configuration);
}


function initMatrix(
  teams: Team[], 
  extraMatchups: {[key in keyof typeof Team]?:  Team[] }  ): { [row: string]: { [column: string]: number } } {
  const matrix: { [row: string]: { [column: string]: number } } = {};
  teams.forEach((teamHome: Team) => {
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

function createMatrix({ teams, extraMatchups, seasonStartDate }: Configuration): MatchDay[] {
  const matchDays: MatchDay[] = [];
  const gameMatrix = initMatrix(teams, extraMatchups);
  const gameDays = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34];
  Object.keys(gameMatrix)
    .forEach((homeTeam: string) => {
      let currentGameDaysForTeam = getAvailableGamedays(gameMatrix, gameDays, homeTeam);
      console.log('current gamedays:', currentGameDaysForTeam);
      Object.keys(gameMatrix[homeTeam])
        .forEach((visitorTeam: string) => {
          if (homeTeam === visitorTeam) return;
          let gamedayIndex;
          do {
            gamedayIndex = random_index(currentGameDaysForTeam)
          } while (bothTeamsArePlayingAtSameDay(gameMatrix, currentGameDaysForTeam[gamedayIndex], homeTeam, visitorTeam))
          gameMatrix[homeTeam][visitorTeam] = currentGameDaysForTeam[gamedayIndex];
          currentGameDaysForTeam.splice(gamedayIndex, 1);
        });
    });
  console.log(gameMatrix);


  for (let days = 0; days < gameDays.length; days++) {
    const matchDate = new Date(seasonStartDate);
    matchDate.setDate(matchDate.getDate() + days);
    const matchDay = createMatchDay(matchDate, gameMatrix, days);
    matchDays.push(matchDay);
  }

  return matchDays;
}

function getAvailableGamedays(gameMatrix: { [row: string]: { [column: string]: number } }, gameDays: number[], homeTeam: string): number[] {
    return gameDays
    .filter(gameday => !hasAlreadyPlayedInVisitor(gameMatrix, gameday, homeTeam));


}

function hasAlreadyPlayedInVisitor(gameMatrix: { [row: string]: { [column: string]: number } }, gameday: number, homeTeam: string): boolean {
  return !!Object.keys(gameMatrix)
  .find((homeTeamCurrent: string) => gameMatrix[homeTeamCurrent][homeTeam] === gameday);
    
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


function createMatchDay(currentDate: Date, matrix: { [row: string]: { [column: string]: number } }, dayNumber: number): MatchDay {
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
