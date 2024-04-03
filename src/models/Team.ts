import mongoose, { Schema, Document } from 'mongoose';
import { ICompetition } from './Competition';
import { IPlayer } from './Player';

export interface ITeam extends Document {
    teamId: number;
    competition: ICompetition;
    name: string;
    tla: string;
    shortname: string;
    areaName: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
    squad?: Array<IPlayer>
}

const teamSchema: Schema<ITeam> = new Schema(
    {
        teamId: { type: Number, required: true, unique: true },
        competition: { type: Schema.Types.ObjectId, ref: 'Competition' },
        name: { type: String, required: true },
        tla: { type: String, required: true },
        shortname: { type: String, required: true },
        areaName: { type: String, required: true },
        address: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.model<ITeam>('Team', teamSchema);