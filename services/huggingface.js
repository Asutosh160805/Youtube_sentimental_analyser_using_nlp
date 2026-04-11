const axios = require("axios");

const API_URL = "https://api-inference.huggingface.co/models";

// Models
const SENTIMENT_MODEL = "cardiffnlp/twitter-roberta-base-sentiment";
const EMOTION_MODEL = "j-hartmann/emotion-english-distilroberta-base";

// Generic function
async function query(model, text) {
    try {
        const res = await axios.post(
            `${API_URL}/${model}`,
            { inputs: text },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HF_API_KEY}`
                }
            }
        );
        return res.data;
    } catch (err) {
        console.log("HF ERROR:", err.response?.data || err.message);
        return null;
    }
}

// Sentiment
async function getSentiment(text) {
    const data = await query(SENTIMENT_MODEL, text);

    if (!data) return { label: "neutral", score: 0 };

    const best = data[0].reduce((a, b) => (a.score > b.score ? a : b));

    return {
        label: best.label.toLowerCase(),
        score: best.score
    };
}

// Emotion
async function getEmotion(text) {
    const data = await query(EMOTION_MODEL, text);

    if (!data) return { emotion: "neutral", score: 0 };

    const best = data[0].reduce((a, b) => (a.score > b.score ? a : b));

    return {
        emotion: best.label.toLowerCase(),
        score: best.score
    };
}

module.exports = { getSentiment, getEmotion };