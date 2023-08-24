import { MatchDay } from "@/models/match-day.model";
import { Match } from "@/models/match.model";
import { match } from "assert";


export async function generate(
  teams: string[],
  [startDate, endDate]: [Date, Date],
  daysNotToPlay: string[]
): Promise<MatchDay[]> {

  return createMatrix(teams, startDate);
}

function createMatrix(teams: string[], startDay: Date): MatchDay[] {
  const matchDays: MatchDay[] = [];


  for (let days = 0; days < 10; days++) {
    const matchDay = new Date(startDay);
    matchDay.setDate(matchDay.getDate() + days);
    const matchDayObj = findOrCreateMatchDay(matchDays, matchDay);
    let matchdayTeams = [...teams];
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
      matchDayObj.matches.push(match);
    }
  }
  return matchDays;
}

function hasFacedHomeLately(matchday: MatchDay[], home: string, visitor: string): boolean {
  return false;
}

function findOrCreateMatchDay(matchDays: MatchDay[], comparableDay: Date): MatchDay {
  const matchDay = matchDays.find(({ day }) => comparableDay.getDate() === day.getDate()
    && comparableDay.getMonth() === day.getMonth() && comparableDay.getFullYear() === day.getFullYear());

  if (matchDay) {
    return matchDay;
  }
  const newMatchDay: MatchDay = {
    day: comparableDay,
    matches: []

  };
  matchDays.push(newMatchDay);
  return newMatchDay;
}

function createMatchesForDay(currentDate: Date, teams: string[], matchDays: MatchDay[]): Match[] {
  let matches = teams.length / 2;
  const matchArr: Match[] = [];
  let teamsForGameday = [...teams];

  for (let i = 0; i < matches; i++) {

    if (teamsForGameday.length === 0) break;
    let home = random_item(teamsForGameday);
    teamsForGameday = teamsForGameday
      .filter(gamedayTeam => gamedayTeam !== home);
    let visitor = random_item(teamsForGameday);
    teamsForGameday = teamsForGameday
      .filter(gamedayTeam => gamedayTeam !== visitor);
    matchArr.push({
      home, visitor
    });
  }
  return matchArr;
}


function random_item(items: string[]): string {
  return items[Math.floor(Math.random() * items.length)];
}


function hasBeenLately(matchDays: MatchDay[], latelyFn: (match: Match) => boolean, gameday: number): boolean {
  if (gameday === 0) return false;
  return !!matchDays[gameday - 1].matches.find(latelyFn);
}
