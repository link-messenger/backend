import { model, Schema } from "mongoose";


const ConversationModel = new Schema({
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  ],
});

export const Conversation = model("conversation", ConversationModel);