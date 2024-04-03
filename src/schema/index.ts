import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
} from 'graphql';
import UserType from './User';
import MovieType from './Movie';
import TeamType from './Team';
import CompetitionType from './Competition';

import Movie from '../models/Movie';
import User from '../models/User';
import Competition from '../models/Competition';
import { hashPassword } from '../utils/passwordUtils';
import { getLeague, getTeams } from '../services/league';
import Team from '../models/Team';
import Player from '../models/Player';

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
                        id: competition._id,
                        createdAt: competition.createdAt.toISOString(), // Format createdAt as ISO 8601
                        updatedAt: competition.updatedAt.toISOString(), // Format createdAt as ISO 8601
                    }));
                } catch (error) {
                    throw new Error(error.message);
                }
            },
        },
        // Query to get a user by ID
        competition: {
            type: CompetitionType,
            args: { id: { type: GraphQLNonNull(GraphQLInt) } },
            resolve: async (_, args) => {
                try {
                    const competition = await Competition.findById(args.id);
                    return {
                        ...competition.toObject(),
                        id: competition._id,
                        createdAt: competition.createdAt.toISOString(),
                        updatedAt: competition.updatedAt.toISOString(),
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
                    const teams = await Team.find();
                    return teams.map((team) => ({
                        ...team.toObject(),
                        id: team._id,
                        createdAt: team.createdAt.toISOString(), // Format createdAt as ISO 8601
                        updatedAt: team.updatedAt.toISOString(), // Format createdAt as ISO 8601
                    }));
                } catch (error) {
                    throw new Error(error.message);
                }
            },
        },
        team: {
            type: GraphQLList(TeamType),
            args: { id: { type: GraphQLNonNull(GraphQLInt) } },
            resolve: async (_, args) => {
                try {
                    const team = await Team.findById(args.id);
                    console.log('team1111', team)

                    return {
                        ...team.toObject(),
                        id: team._id,
                        createdAt: team.createdAt.toISOString(),
                        updatedAt: team.updatedAt.toISOString(),
                    };
                } catch (error) {
                    throw new Error(error.message);
                }
            },
        },

        // Query to get all users
        users: {
            type: GraphQLList(UserType),
            resolve: async () => {
                try {
                    const users = await User.find();
                    return users.map((user) => ({
                        ...user.toObject(),
                        id: user._id,
                        createdAt: user.createdAt.toISOString(), // Format createdAt as ISO 8601
                        updatedAt: user.updatedAt.toISOString(), // Format createdAt as ISO 8601
                    }));
                } catch (error) {
                    throw new Error(error.message);
                }
            },
        },

        // Query to get a user by ID
        user: {
            type: UserType,
            args: { id: { type: GraphQLNonNull(GraphQLString) } },
            resolve: async (_, args) => {
                try {
                    const user = await User.findById(args.id);
                    return {
                        ...user.toObject(),
                        id: user._id,
                        createdAt: user.createdAt.toISOString(),
                        updatedAt: user.updatedAt.toISOString(),
                    };
                } catch (error) {
                    throw new Error(error.message);
                }
            },
        },

        // Query to get all movies
        movies: {
            type: GraphQLList(MovieType),
            resolve: async () => {
                try {
                    return await Movie.find();
                } catch (error) {
                    throw new Error(error.message);
                }
            },
        },

        // Query to get a movie by ID
        movie: {
            type: MovieType,
            args: { id: { type: GraphQLNonNull(GraphQLString) } },
            resolve: async (_, args) => {
                try {
                    return await Movie.findById(args.id);
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
            // que peps?
            type: CompetitionType,
            args: {
                leagueCode: { type: GraphQLNonNull(GraphQLInt) }
            },

            resolve: async (_, args) => {
                try {
                    const { leagueCode } = args;
                    const foundCompetition = await Competition.findOne({ competitionId: leagueCode });

                    if (foundCompetition) {
                        return foundCompetition;
                    }

                    const competitions = await getLeague(leagueCode);

                    if(competitions) {
                        const { teams, squad } = await getTeams(leagueCode);
                        console.log('leagueCode', leagueCode);
                        console.log('competitions', competitions);
                        console.log('teams', teams[0]);
                        console.log('squad', squad[0]);

                        const competition = new Competition(competitions);
                        const result = await competition.save();
                        await Team.insertMany(teams, { ordered: true });
                        await Player.insertMany(squad, { ordered: true });
                        return result;
                    }

                    return { id: null };
                } catch (error) {
                    throw new Error(error.message);
                }
            },
        },
        // Mutation to add a new user
        addUser: {
            type: UserType,
            args: {
                email: { type: GraphQLNonNull(GraphQLString) },
                username: { type: GraphQLNonNull(GraphQLString) },
                password: { type: GraphQLNonNull(GraphQLString) },
                isAdmin: { type: GraphQLNonNull(GraphQLBoolean) },
            },

            resolve: async (_, args) => {
                try {
                    // Destructure password
                    const { password, ...others } = args;

                    //   Send a hashed password
                    const hashedPassword = await hashPassword(password);

                    console.log(hashPassword);

                    const user = new User({
                        password: hashedPassword,
                        ...others,
                    });
                    return await user.save();
                } catch (error) {
                    throw new Error(error.message);
                }
            },
        },

        // Mutation to update a user by ID
        updateUser: {
            type: UserType,
            args: {
                id: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                username: { type: GraphQLNonNull(GraphQLString) },
                password: { type: GraphQLNonNull(GraphQLString) },
                isAdmin: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: async (_, args) => {
                try {
                    return await User.findByIdAndUpdate(args.id, args, { new: true });
                } catch (error) {
                    throw new Error(error.message);
                }
            },
        },

        // Mutation to delete a user by ID
        deleteUser: {
            type: UserType,
            args: { id: { type: GraphQLNonNull(GraphQLString) } },
            resolve: async (_, args) => {
                try {
                    return await User.findByIdAndDelete(args.id);
                } catch (error) {
                    throw new Error(error.message);
                }
            },
        },

        // Mutation to add a new movie
        addMovie: {
            type: MovieType,
            args: {
                title: { type: GraphQLNonNull(GraphQLString) },
                genre: { type: GraphQLNonNull(GraphQLString) },
                rating: { type: GraphQLNonNull(GraphQLInt) },
                duration: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: async (_, args) => {
                try {
                    const movie = new Movie(args);
                    return await movie.save();
                } catch (error) {
                    throw new Error(error.message);
                }
            },
        },

        // Mutation to update a movie by ID
        updateMovie: {
            type: MovieType,
            args: {
                id: { type: GraphQLNonNull(GraphQLString) },
                title: { type: GraphQLNonNull(GraphQLString) },
                genre: { type: GraphQLNonNull(GraphQLString) },
                rating: { type: GraphQLNonNull(GraphQLInt) },
                duration: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: async (_, args) => {
                try {
                    return await Movie.findByIdAndUpdate(args.id, args, { new: true });
                } catch (error) {
                    throw new Error(error.message);
                }
            },
        },

        // Mutation to delete a movie by ID
        deleteMovie: {
            type: MovieType,
            args: { id: { type: GraphQLNonNull(GraphQLString) } },
            resolve: async (_, args) => {
                try {
                    return await Movie.findByIdAndDelete(args.id);
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