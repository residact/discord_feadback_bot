import {model, Schema} from "mongoose";

const ChatMessageSchema = new Schema({
    messageId: {required: true, type: String},
    user: {required: true, type: String},
    chanelId: {required: true, type: String},
    model: {required: true, type: String},
    messageUser: {required: true, type: String},
    messageSystem: {required: false, type: String},
    answer: {required: false, type: String},
    correctAnswer: {required: false, type: String},
    like: {required: true, type: Boolean},
    dislike: {required: true, type: Boolean},
})

const ChatMessageModel = model("chatMessage", ChatMessageSchema)

export default ChatMessageModel
