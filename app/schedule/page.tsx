import useDateformatter from "@/hooks/useDateformatter";
import { MatchDay } from "@/models/match-day.model";
import { generate } from "@/services/generator";


export async function fetchData(): Promise<MatchDay[]> {

  return await generate([
    'Vimpeli',
    'Alajärvi',
    'Sotkamo',
    'Joensuu',
    'Kouvola',
    'Imatra',
    'PattU, Raahe',
    'Koskenkorva',
    'Manse PP',
    'Kitee',
    'JymyJussit',
    'Hyvinkää',
    'Kempele'


  ], [new Date(2023, 5, 5), new Date(2023,6, 7)], []);
  
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