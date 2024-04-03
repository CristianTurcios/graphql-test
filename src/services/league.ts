export const getLeague = async (leagueCode: number) => {
    try {
        const options = {
            'method': 'GET',
            'headers': {
                'X-Auth-Token': process.env.API_TOKEN
            },
        }

        const response = await fetch(`${process.env.API_URL}/competitions/${leagueCode}`, options);
        const data = await response.json();

        if('message' in data) {
            return null;
        }

        const competition = {
            competitionId: data.id,
            area: data.area.name,
            name: data.name,
            code: data.code,
        }
        return competition;
    } catch (err) {
        console.error('err del principal', err);
        return null;
    }
};

export const getTeams = async (leagueCode: number) => {
    try {
        const options = {
            'method': 'GET',
            'headers': {
                'X-Auth-Token': process.env.API_TOKEN
            },
        }

        const response = await fetch(`${process.env.API_URL}/competitions/${leagueCode}/teams`, options);
        const data = await response.json();
        const squad: any = [];
        const teams = data.teams.map((element: any) => {
            const tempSquad = element.squad.length > 0 ? element.squad : [element.coach];
            squad.push(...getPlayers(tempSquad, element.id, leagueCode))

            return {
                teamId: element.id,
                // competitionId: leagueCode,
                name: element.name,
                tla: element.tla,
                shortname: element.shortName,
                areaName: element.area.name,
                address: element.address,

            }
        });

        return { teams, squad: squad };
    } catch (err) {
        console.error('err', err);
    }
}

export const getPlayers = (squad: any, teamId: number, leagueCode: number): any => {
    const players = squad.map((element: any) => {
        return {
            playerId: element.id,
            // teamId,
            // competitionId: leagueCode,
            name: element.name,
            position: 'contract' in element ? 'coach' : element.position,
            dateOfBirth: new Date(element.dateOfBirth),
            nationality: element.nationality,
        }
    });
    return players;
}
