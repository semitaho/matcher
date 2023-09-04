import useDateformatter from "@/hooks/useDateformatter";
import { MatchDay } from "@/models/match-day.model";
import { generate } from "@/services/generator";

import { Team } from "@/models/team.enum";
export async function fetchData(): Promise<MatchDay[]> {

  return await generate({
    teams:
      [
        Team.Vimpeli,
        Team.Sotkamo,
        Team.Tampere,
        Team.Kempele,
        Team.Joensuu,
        Team.Kouvola,
        Team.Seinajoki,
        Team.Kitee,
        Team.Hyvinkaa,
        Team.Pattijoki,
        Team.Imatra,
        Team.Alajarvi,
        Team.Koskenkorva
      ],
    seasonStartDate: new Date(2023, 5, 5),
    extraMatchups: {
      Alajarvi: [Team.Seinajoki_2, Team.Vimpeli_2],
      Hyvinkaa: [Team.Kouvola_2, Team.Tampere_2],
      Imatra: [Team.Kitee_2, Team.Kouvola_2],
      Joensuu: [Team.Kitee_2, Team.Sotkamo_2],
      Kempele: [Team.Pattijoki_2, Team.Sotkamo_2],
      Kitee: [Team.Imatra_2, Team.Joensuu_2],
      Koskenkorva: [Team.Tampere_2, Team.Seinajoki_2],
      Kouvola: [Team.Hyvinkaa_2, Team.Imatra_2],
      Tampere: [Team.Hyvinkaa_2, Team.Koskenkorva_2],
      Pattijoki: [Team.Kempele_2, Team.Vimpeli_2],
      Seinajoki: [Team.Alajarvi_2, Team.Koskenkorva_2],
      Sotkamo: [Team.Joensuu_2, Team.Kempele_2],
      Vimpeli: [Team.Alajarvi_2, Team.Pattijoki_2]
    }
  });

}
export default async function Schedule() {
  const items = await fetchData();
  const dfn = useDateformatter()
  return (
    <div className="grid justify-center content-center">

      <ul>{
        items.map(({ day, matches }) => ((
          <li className="mb-3">
            {dfn(day)}
            <ul>{
              matches.map(({ home, visitor }) => (
                <li className="match">{home} - {visitor}</li>
              ))
            }
            </ul>
          </li>

        ))
        )}</ul>
    </div>
  )

}