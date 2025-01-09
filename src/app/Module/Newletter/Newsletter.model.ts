import mongoose, { Schema, Document } from "mongoose";

// Define the structure of the Newsletter document
interface INewsletter extends Document {
  email: string; // Email field for the subscriber
  createdAt: Date; // Timestamp for creation
  updatedAt: Date; // Timestamp for updates (auto-managed by Mongoose)
}

// Define the schema for the Newsletter model
const newsletterSchema: Schema<INewsletter> = new Schema(
  {
    email: {
      type: String,
      required: true, // Email is required
      unique: true, // Ensure unique email for each subscriber
      lowercase: true, // Store email in lowercase
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please provide a valid email address",
      ], // Email validation regex
    },
  },
  {
    timestamps: true, // Mongoose will automatically add createdAt and updatedAt
  }
);

// Create the model based on the schema
const NewsletterModel = mongoose.model<INewsletter>("Newsletter", newsletterSchema);

export default NewsletterModel;
