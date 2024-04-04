import { ICompetition } from "models/Competition";
import { IPlayer } from "../models/Player";
import { Document } from 'mongoose';

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
        throw new Error(err.message);
    }
};

export const getTeams = async (leagueCode: number, result: Document<ICompetition>) => {
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
            const tempSquad = element.squad.length > 0 ? element.squad : [element.coach];

            return {
                teamId: element.id,
                competition: result._id,
                name: element.name,
                tla: element.tla,
                shortname: element.shortName,
                areaName: element.area.name,
                address: element.address,
                squad: tempSquad,
            }
        });

        return teams;
    } catch (err) {
        throw new Error(err.message);
    }
}

export const getPlayers = (squad: Array<IPlayer>, teamResult: Document<ICompetition>, competition: Document<ICompetition>) => {    
    const players = squad.map((element) => {
        return {
            playerId: element.id,
            team: teamResult._id,
            competition: competition._id,
            name: element.name,
            position: 'contract' in element ? 'coach' : element.position,
            dateOfBirth: new Date(element.dateOfBirth),
            nationality: element.nationality,
        }
    });
    return players;
}
