import mongoose from "mongoose";

const { Schema, model } = mongoose;

const accomodationsSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    maxGuests: { type: Number, required: true },
    host: [{ type: Schema.Types.ObjectId, ref: "User" }],
    city: { type: String, required: true },
  },
  {
    timestamps: true, // this option automatically adds the createdAt and updatedAt fields
  }
);

export default model("Accomodation", accomodationsSchema); // this model is now automagically linked to the "accomodations" collection, if collection is not there it will be created
