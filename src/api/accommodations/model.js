import mongoose from "mongoose";

const { Schema, model } = mongoose;

const accommodationsSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    maxGuests: { type: Number, required: true },
    host: { type: Schema.Types.ObjectId, ref: "Users" },
    city: { type: String, required: true },
  },
  {
    timestamps: true, // this option automatically adds the createdAt and updatedAt fields
  }
);

export default model("Accommodation", accommodationsSchema); // this model is now automagically linked to the "accommodations" collection, if collection is not there it will be created
