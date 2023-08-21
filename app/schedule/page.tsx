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
    'Imatra'


  ], [new Date(2023, 5, 5), new Date(2023,6, 7)], []);
  
}
export default async function Schedule() {
  const items = await fetchData();
  console.log('items', items);
  const dfn = useDateformatter()
  return (
    <div className="grid h-56 justify-center content-center">

      <ul>{
        items.map(({ day, matches }) => ((
          <li>
            {dfn(day)}
            <ul>{
              matches.map(({ home, visitor }) => (
                <li>{home} - {visitor}</li>
              ))
            }
            </ul>
          </li>

        ))
        )}</ul>
    </div>
  )

}