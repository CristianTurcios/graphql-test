import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList
} from 'graphql';
import CompetitionType from './Competition';
import PlayerType from './Player';

const TeamType = new GraphQLObjectType({
    name: 'Team',
    fields: () => ({
        teamId: { type: GraphQLInt },
        name: { type: GraphQLString },
        competition: {
            type: CompetitionType,
            description: 'Competition League'
        },
        players: {
            type: GraphQLList(PlayerType),
            description: 'Players or Coach'
        },
        tla: { type: GraphQLString },
        shortname: { type: GraphQLString },
        areaName: { type: GraphQLString },
        address: { type: GraphQLString },
    }),
});

export default TeamType;