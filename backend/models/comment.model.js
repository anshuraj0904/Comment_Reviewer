import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    commentedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    commentedOn: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    reviewGiven: {
      type: String,
      enum: [
        "positive",          // Helpful, kind, supportive
        "negative",          // Criticism, disapproval
        "toxic",             // Abusive / hateful tone
        "harassment",        // Targeted harassment
        "hate_speech",       // Racism, casteism, sexism, etc.
        "sexual_content",    // NSFW, explicit
        "self_harm",         // Mentions of suicide/self-harm
        "violence",          // Violent / graphic threats
        "misinformation",    // Fake news / false info
        "scam_fraud",        // Phishing, scam attempts
        "spam",              // Repeated / irrelevant messages
        "bot",               // Automated / AI-like
        "neutral",           // Neither positive nor negative
        "off_topic",         // Irrelevant to context
        "profanity"          // Swearing / offensive words
      ],
      default: null,
    },
    status: {
      type: String,
      enum: [
        "active",                  // Normal state
        "flagged_by_ai",           // AI flagged it
        "flagging_approved_by_admin" // Admin agrees AI was right
      ],
      default: "active"
    },
    isUserNotified: {type:Boolean, default:false}
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
