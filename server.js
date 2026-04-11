require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const analyzeText = require("./utils/nlp");
const Comment = require("./models/Comment");
const { getVideoId, fetchComments } = require("./utils/youtube");

const app = express();
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("Mongo Error:", err));


// API endpoint
app.post("/get-comments", async (req, res) => {
    try {
        const { youtubeUrl } = req.body;

        // ✅ Validate URL
        const videoId = getVideoId(youtubeUrl);
        if (!videoId) {
            return res.status(400).json({ error: "Invalid YouTube URL" });
        }

        // ✅ Check DB first (cache)
        const existing = await Comment.find({ videoId });

        if (existing.length >= 50) {
            return res.json({
                source: "database",
                count: existing.length,
                comments: existing.slice(0, 50)
            });
        }

        // ✅ Fetch comments from YouTube
        const comments = await fetchComments(
            videoId,
            process.env.YOUTUBE_API_KEY,
            200
        );

        if (comments.length === 0) {
            return res.json({ message: "No comments found" });
        }

        // ⚠️ IMPORTANT: Limit for NLP (avoid API overload)
        const limitedComments = comments.slice(0, 50);

        // ✅ Analyze comments (sentiment + emotion)
        const docs = await Promise.all(
            limitedComments.map(async (c) => {
                try {
                    const analysis = await analyzeText(c.text);

                    return {
                        ...c,
                        videoId,
                        sentimentLabel: analysis.sentimentLabel,
                        sentimentScore: analysis.sentimentScore,
                        emotion: analysis.emotion,
                        emotionScore: analysis.emotionScore
                    };
                } catch (err) {
                    console.log("NLP Error for comment:", err.message);

                    // fallback (so one failure doesn't break everything)
                    return {
                        ...c,
                        videoId,
                        sentimentLabel: "neutral",
                        sentimentScore: 0,
                        emotion: "neutral",
                        emotionScore: 0
                    };
                }
            })
        );

        // ✅ Store in DB (skip duplicates)
        await Comment.insertMany(docs, { ordered: false });

        // ✅ Send correct response
        return res.json({
            source: "youtube_api",
            count: docs.length,
            comments: docs
        });

    } catch (err) {
        console.error("FULL ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});


// Start server
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});