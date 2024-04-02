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

        const competition = {
            id: data.id,
            area: data.area.name,
            name: data.name,
            code: data.code,
        }
        return competition;
    } catch (err) {
        console.error('err', err);
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
        const teams = data.teams.map((element: any) => {
            return {
                id: element.id,
                name: element.name,
                tla: element.tla,
                shortname: element.shortName,
                areaName: element.area.name,
                address: element.address,
                squad: element.squad.length === 0 ? element.squad : [element.coach],
            }
        });

        return teams;
    } catch (err) {
        console.error('err', err);
    }
}

export const getPlayers = (teams: any): any => {
    console.log('squad', teams);
    const players = teams?.squad.map((element: any) => {
        return {
            name: element.name,
            // position: element.contract ? 'coach' : element.position,
            dateOfBirth: element.dateOfBirth,
            nationality: element.nationality,
        }
    });
    return players;
}
