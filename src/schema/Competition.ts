import {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
} from 'graphql';

const CompetitionType = new GraphQLObjectType({
    name: 'Competition',
    fields: () => ({
        id: { type: GraphQLID },
        competitionId: { type: GraphQLInt },
        area: { type: GraphQLString },
        name: { type: GraphQLString },
        code: { type: GraphQLString },
    }),
});

export default CompetitionType;