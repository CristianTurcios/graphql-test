// Import necessary modules
import mongoose, { Schema, Document } from 'mongoose';

export interface IPlayer extends Document {
    playerId: number;
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
        name: { type: String, required: true },
        position: { type: String, required: true },
        dateOfBirth: { type: Date, required: true },
        nationality: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.model<IPlayer>('Player', playerSchema);