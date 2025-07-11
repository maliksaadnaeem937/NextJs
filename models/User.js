import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
    },
    verificationCodeExpires: {
      type: Date,
      default: () => new Date(Date.now() + 10 * 60 * 1000),
    },
    lastVerificationCodeSentAt: {
      type: Date,
      default: () => new Date(),
    },

    techStack: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      default: "",
    },
    profilePic: {
      type: String,
      default: "",
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);
userSchema.index({
  name: "text",
  bio: "text",
  techStack: "text",
});
// Prevent model overwrite error in Next.js hot reload
export default mongoose.models.User || mongoose.model("User", userSchema);
