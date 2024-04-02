import {
    GraphQLObjectType,
    // GraphQLID,
    // GraphQLString,
    GraphQLInt,
} from 'graphql';

const LeagueType = new GraphQLObjectType({
    name: 'League',
    fields: () => ({
        id: { type: GraphQLInt },
        // title: { type: GraphQLString },
        // genre: { type: GraphQLString },
        // rating: { type: GraphQLInt },
        // duration: { type: GraphQLString },
    }),
});

export default LeagueType;