import mongoose, { Schema, Document } from 'mongoose';
import { ICompetition } from './Competition';
import { ITeam } from './Team';

export interface IPlayer extends Document {
    playerId: number;
    competition: ICompetition;
    team: ITeam,
    name: string;
    position: string;
    dateOfBirth: Date;
    nationality: string;
    createdAt: Date;
    updatedAt: Date;
}

const playerSchema: Schema<IPlayer> = new Schema(
    {
        playerId: { type: Number, required: true, unique: true },
        competition: { type: Schema.Types.ObjectId, ref: 'Competition' },
        team: { type: Schema.Types.ObjectId, ref: 'Team' },
        name: { type: String, required: true },
        position: { type: String, required: true },
        dateOfBirth: { type: Date, required: true },
        nationality: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.model<IPlayer>('Player', playerSchema);