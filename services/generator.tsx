import { MatchDay } from "@/models/match-day.model";
import { Match } from "@/models/match.model";


export async function generate(
  teams: string[],
  [startDate, endDate]: [Date, Date],
  daysNotToPlay: string[]
): Promise<MatchDay[]> {

  const shuffledTeams = shuffleArray(teams);
  let currentDate = startDate;
  console.log('current date', shuffledTeams);
  const matchDays: MatchDay[] = [];
  while (currentDate <= endDate) {
    matchDays.push({
      day: currentDate,
      matches: createMatchesForDay(currentDate, teams, matchDays)
    });
    const result = currentDate.setDate(currentDate.getDate() + 1);
    currentDate = new Date(result);
  }

  return matchDays;

}

function createMatchesForDay(currentDate: Date, teams: string[], matchDays: MatchDay[]): Match[] {
  let matches = teams.length / 2;
  const matchArr: Match[] = [];
  let teamsForGameday = [...teams];

  for (let i = 0; i < matches; i++) {

    if (teamsForGameday.length === 0) break;
    let home = random_item(teamsForGameday);
    teamsForGameday = teamsForGameday
    .filter(gamedayTeam =>  gamedayTeam !== home);
    let visitor = random_item(teamsForGameday);
    teamsForGameday = teamsForGameday
    .filter(gamedayTeam =>  gamedayTeam !== visitor);
    matchArr.push({
      home, visitor
    });
  }
  return matchArr;
}


function random_item(items: string[]): string {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffleArray(teams: string[]): string[] {
  let shuffled = teams
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
   
  return shuffled;
}