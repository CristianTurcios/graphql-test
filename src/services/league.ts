import { ICompetition } from "models/Competition";
import { IPlayer } from "../models/Player";
import { Document } from 'mongoose';
import axios from 'axios';

export const getLeague = async (leagueCode: number): Promise<any> => {
    try {
        const options = {
            'headers': {
                'X-Auth-Token': process.env.API_TOKEN
            },
        }

        const url = `${process.env.API_URL}/competitions/${leagueCode}`;
        const response = await axios.get(url, options);

        if ('message' in response.data) {
            return null;
        }

        const competition = {
            competitionId: response.data.id,
            area: response.data.area.name,
            name: response.data.name,
            code: response.data.code,
        };

        return competition;
    } catch (err: any) {
        throw new Error(err.message);
    }
};

export const getTeams = async (leagueCode: number, result: Document<ICompetition>) => {
    try {
        const options = {
            'headers': {
                'X-Auth-Token': process.env.API_TOKEN
            },
        }

        const url = `${process.env.API_URL}/competitions/${leagueCode}/teams`;
        const response = await axios.get(url, options);

        const teams = response.data.teams.map((element: any) => {
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
    } catch (err: any) {
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
