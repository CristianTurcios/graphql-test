import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
} from 'graphql';
import TeamType from './Team';
import PlayerType from './Player';
import CompetitionType from './Competition';
import Competition from '../models/Competition';
import Team, { ITeam } from '../models/Team';
import Player from '../models/Player';
import { getLeague, getPlayers, getTeams } from '../services/league';

// Queries
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        competitions: {
            type: GraphQLList(CompetitionType),
            resolve: async () => {
                try {
                    const competitions = await Competition.find();
                    return competitions.map((competition) => ({
                        ...competition.toObject(),
                    }));
                } catch (error) {
                    throw new Error(error.message);
                }
            },
        },
        competition: {
            type: CompetitionType,
            args: { id: { type: GraphQLNonNull(GraphQLInt) } },
            resolve: async (_, { id }) => {
                try {
                    const competition = await Competition.findById(id);
                    return {
                        ...competition.toObject(),
                    };
                } catch (error) {
                    throw new Error(error.message);
                }
            },
        },
        teams: {
            type: GraphQLList(TeamType),
            resolve: async () => {
                try {
                    const teams = await Team.find().populate('competition');
                    return teams.map((team) => ({
                        ...team.toObject(),
                    }));
                } catch (error) {
                    throw new Error(error.message);
                }
            },
        },
        team: {
            type: TeamType,
            args: { name: { type: GraphQLNonNull(GraphQLString) }, showSquad: { type: GraphQLBoolean } },
            resolve: async (_, { name, showSquad }) => {
                try {
                    const team = await Team.findOne({ name: { $regex: new RegExp(name.trim(), 'i') } }).populate('competition');

                    if (!team) {
                        throw new Error('Team not found');
                    }

                    if (showSquad) {
                        const players = await Player.find({ team: team }).populate('team');
                        return {
                            ...team.toObject(),
                            players,
                        }
                    }

                    return {
                        ...team.toObject(),
                    };
                } catch (error) {
                    throw new Error(error.message);
                }
            },
        },
        players: {
            type: GraphQLList(PlayerType),
            resolve: async () => {
                try {
                    const players = await Player.find().populate('competition');
                    return players.map((player) => ({
                        ...player.toObject(),
                    }));
                } catch (error) {
                    throw new Error(error.message);
                }
            },
        },
        playersByLeague: {
            type: GraphQLList(PlayerType),
            args: { leagueCode: { type: GraphQLNonNull(GraphQLInt) }, teamName: { type: GraphQLString } },
            resolve: async (_, { leagueCode, teamName }) => {
                try {
                    const competition = (await Competition.findOne({ competitionId: leagueCode }));
                    if (!competition) {
                        throw new Error('Competition not found');
                    }

                    if (teamName) {
                        const team = await Team.findOne({ name: { $regex: new RegExp(teamName.trim(), 'i') } });
                        const players = await Player.find({ team: team }).populate('competition');

                        return players.map((player) => ({
                            ...player.toObject(),
                            dateOfBirth: player.dateOfBirth.toLocaleDateString()
                        }));
                    }

                    const players = await Player.find({ competition: competition }).populate('competition');
                    return players.map((player) => ({
                        ...player.toObject(),
                        dateOfBirth: player.dateOfBirth.toLocaleDateString()
                    }));
                } catch (error) {
                    throw new Error(error.message);
                }
            },
        },
    },
});

// Mutations
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        importLeague: {
            type: CompetitionType,
            args: {
                leagueCode: { type: GraphQLNonNull(GraphQLInt) }
            },

            resolve: async (_, { leagueCode }) => {
                try {
                    const foundCompetition = await Competition.findOne({ competitionId: leagueCode });

                    if (foundCompetition) {
                        return foundCompetition;
                    }

                    const competitions = await getLeague(leagueCode);

                    if (competitions) {
                        const competition = new Competition(competitions);
                        console.log(typeof competition)
                        const competitionResult = await competition.save();
                        const teams = await getTeams(leagueCode, competitionResult);

                        teams.forEach(async (element: ITeam) => {
                            const players = element.squad;
                            delete element.squad;
                            const element2 = new Team(element)
                            const teamResult = await element2.save();
                            const squad = getPlayers(players, teamResult, competitionResult);
                            await Player.insertMany(squad, { ordered: true });
                        });

                        return {
                            competitionId: competition.id,
                            area: competition.area,
                            name: competition.name,
                            code: competition.code
                        };
                    }

                    throw new Error('Something went wrong');
                } catch (error) {
                    throw new Error(error.message);
                }
            },
        },
    },
});

export default new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});