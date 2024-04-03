// Import necessary modules
import mongoose, { Schema, Document } from 'mongoose';

export interface ICompetition extends Document {
    competitionId: number;
    area: string;
    name: string;
    code: string;
    createdAt: Date;
    updatedAt: Date;
}

const competitionSchema: Schema<ICompetition> = new Schema(
    {
        competitionId: { type: Number, required: true, unique: true },
        area: { type: String, required: true },
        name: { type: String, required: true },
        code: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.model<ICompetition>('Competition', competitionSchema);