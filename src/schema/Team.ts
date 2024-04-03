import {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLScalarType,
} from 'graphql';

const TeamType = new GraphQLObjectType({
    name: 'Team',
    fields: () => ({
        id: { type: GraphQLID },
        teamId: { type: GraphQLInt },
        name: { type: GraphQLString },
        competition: { type: GraphQLInt },
        tla: { type: GraphQLString },
        shortname: { type: GraphQLString },
        areaName: { type: GraphQLString },
        address: { type: GraphQLString },
    }),
});

export default TeamType;