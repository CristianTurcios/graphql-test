import {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
} from 'graphql';
import CompetitionType from './Competition';

const TeamType = new GraphQLObjectType({
    name: 'Team',
    fields: () => ({
        id: { type: GraphQLID },
        teamId: { type: GraphQLInt },
        name: { type: GraphQLString },
        competition: {
            type: CompetitionType,
            description: 'Competition League'
        },
        tla: { type: GraphQLString },
        shortname: { type: GraphQLString },
        areaName: { type: GraphQLString },
        address: { type: GraphQLString },
    }),
});

export default TeamType;