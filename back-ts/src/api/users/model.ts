import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model, Model } = mongoose;

interface User {
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  password: string;
  role: "Guest" | "Host";
}

interface UserModel extends mongoose.Model<UserDoc> {
  checkCredentials(email: string, password: string): Promise<UserDoc | null>;
}

interface UserDoc extends mongoose.Document, User {
  checkPassword(password: string): Promise<boolean>;
}

const UsersSchema = new Schema<UserDoc, UserModel>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    avatar: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["Guest", "Host"], default: "Guest" },
  },
  {
    timestamps: true,
  }
);

UsersSchema.pre<UserDoc>("save", async function (next) {
  const currentUser = this;

  if (currentUser.isModified("password")) {
    const plainPW = currentUser.password;
    const hash = await bcrypt.hash(plainPW, 11);
    currentUser.password = hash;
  }

  next();
});

UsersSchema.methods.checkPassword = async function (password: string) {
  const user = this as UserDoc;
  return bcrypt.compare(password, user.password);
};

UsersSchema.methods.toJSON = function () {
  const userDocument = this;
  const user = userDocument.toObject();

  delete user.password;
  delete user.__v;

  return user;
};

UsersSchema.static(
  "checkCredentials",
  async function (email: string, password: string) {
    const user: UserDoc | null = await this.findOne({ email });

    if (user) {
      const passwordMatch = await user.checkPassword(password);

      if (passwordMatch) {
        return user;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
);

export default model<UserDoc, UserModel>("User", UsersSchema);
