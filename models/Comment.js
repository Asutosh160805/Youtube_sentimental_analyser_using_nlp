const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    videoId: String,
    commentId: String,
    text: String,
    author: String,
    publishedAt: Date,
    sentimentLabel: String,
    sentimentScore: Number,
    emotion: String,
    emotionScore: Number
});

module.exports = mongoose.model("Comment", commentSchema);