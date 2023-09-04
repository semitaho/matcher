import { Team } from "./team.enum";

export interface Configuration {
    teams: Team[],
    extraMatchups:
    {
        [key in keyof typeof Team]?: Team[]

    },
    seasonStartDate: Date
}