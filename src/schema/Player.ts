import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
} from 'graphql';
import CompetitionType from './Competition';

const PlayerType = new GraphQLObjectType({
    name: 'Player',
    fields: () => ({
        playerId: { type: GraphQLInt },
        name: { type: GraphQLString },
        competition: {
            type: CompetitionType,
            description: 'Competition League'
        },
        position: { type: GraphQLString },
        dateOfBirth: { type: GraphQLString },
        nationality: { type: GraphQLString },
    }),
});

export default PlayerType;