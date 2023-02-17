import mongoose, { Document, Model, Schema } from "mongoose";

interface IAccommodation extends Document {
  name: string;
  description: string;
  maxGuests: number;
  host: Schema.Types.ObjectId;
  city: string;
}

const accommodationsSchema: Schema<IAccommodation> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    maxGuests: { type: Number, required: true },
    host: { type: Schema.Types.ObjectId, ref: "User" },
    city: { type: String, required: true },
  },
  {
    timestamps: true, // this option automatically adds the createdAt and updatedAt fields
  }
);

const Accommodation: Model<IAccommodation> = mongoose.model(
  "Accommodation",
  accommodationsSchema
);

export default Accommodation; // this model is now automagically linked to the "accommodations" collection, if collection is not there it will be created
