import { Schema, model } from "mongoose";
import { TUser } from "./User.interface";
import Bcrypt from "bcrypt";

const userSchema = new Schema<TUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      required: true,
      default: "user",
    },

    status: {
      type: String,
      enum: ["active", "block"],
      default: "active",
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 20,
      select: false, // Use `select: false` to omit password by default
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    image: {
      type: String,
    },
    passwordChangeAt: {
      type: Date,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password; // Explicitly remove password from the JSON output
        return ret;
      },
    },
  }
);

// using middleware pre hook by save data   === Before
userSchema.pre("save", async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const userData = this;
  userData.password = await Bcrypt.hash(
    this.password,
    Number(process.env.BCRYPT_NUMBER)
  );
  next();
});

// after save data  middle ware
userSchema.post("save", async function (doc, next) {
  doc.password = "";
  next();
});

export const UserModel = model<TUser>("User", userSchema);
