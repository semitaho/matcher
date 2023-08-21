import { MatchDay } from "@/models/match-day.model";
import { Match } from "@/models/match.model";


export async function generate(
  teams: string[],
  [startDate, endDate]: [Date, Date],
  daysNotToPlay: string[]
): Promise<MatchDay[]> {

  let currentDate = startDate;
  console.log('current date', currentDate);
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