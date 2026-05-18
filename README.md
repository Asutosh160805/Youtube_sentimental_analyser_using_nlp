# 🎬 YouTube Sentiment Analyser using NLP

A Node.js web application that fetches YouTube video comments via the YouTube Data API and performs **Natural Language Processing (NLP)**-based sentiment analysis to classify comments as **Positive**, **Negative**, or **Neutral**.

---

## 📁 Project Structure

```
Youtube_sentimental_analyser_using_nlp/
├── server.js             # Main Express server — entry point
├── package.json          # Project metadata and dependencies
├── models/               # Mongoose schemas (MongoDB data models)
├── services/             # Business logic (YouTube API calls, NLP analysis)
├── utils/                # Helper/utility functions
└── public/               # Static frontend files (HTML, CSS, JS)
```

---

## 🧠 Core Concepts Explained

### 1. Express.js (Backend Framework)
The server is built with **Express.js**, a minimal Node.js web framework. It handles:
- Serving the frontend (`public/` folder)
- Exposing REST API endpoints (e.g., `POST /analyse`) that the frontend calls

### 2. YouTube Data API (via Axios)
**Axios** is used to make HTTP requests to the YouTube Data API v3, which returns video comments given a video ID or URL. The API key is stored in a `.env` file and loaded with **dotenv** for security.

### 3. Natural Language Processing (NLP) — Sentiment Analysis
The core intelligence of the app. Each fetched comment is processed through an NLP pipeline to determine its sentiment:
- **Tokenisation** — splitting a comment into individual words/tokens
- **Stopword Removal** — filtering out meaningless words like "the", "is", "a"
- **Sentiment Scoring** — assigning a polarity score (positive/negative/neutral) using a lexicon-based approach (e.g., AFINN or node-nlp)
- **Classification** — labelling the comment based on the score

### 4. Mongoose + MongoDB (Data Persistence)
**Mongoose** is an ODM (Object Document Mapper) for MongoDB. The `models/` folder defines schemas for storing:
- Video metadata (title, ID, URL)
- Fetched comments
- Sentiment analysis results

This allows previously analysed videos to be retrieved without re-calling the API.

### 5. dotenv (Environment Configuration)
Sensitive values like the YouTube API key and MongoDB connection string are stored in a `.env` file (never committed to Git). The `dotenv` package loads them into `process.env` at runtime.

### 6. Frontend (`public/`)
A static HTML/CSS/JS interface where users can:
- Enter a YouTube video URL
- Trigger the analysis
- View results (sentiment breakdown, comment list, charts)

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- A [YouTube Data API v3 key](https://console.cloud.google.com/)

### Installation

```bash
# Clone the repository
git clone https://github.com/Asutosh160805/Youtube_sentimental_analyser_using_nlp.git
cd Youtube_sentimental_analyser_using_nlp

# Install dependencies
npm install
```

### Configure Environment Variables

Create a `.env` file in the root directory:

```env
YOUTUBE_API_KEY=your_youtube_api_key_here
MONGO_URI=mongodb://localhost:27017/youtube_sentiment
PORT=3000
```

### Run the Application

```bash
npm start
```

Then open your browser and navigate to `http://localhost:3000`.

---

## 🔄 How It Works

```
User enters YouTube URL
        ↓
Server extracts Video ID
        ↓
YouTube Data API fetches comments (via Axios)
        ↓
NLP pipeline processes each comment:
  - Tokenise → Remove stopwords → Score sentiment
        ↓
Results saved to MongoDB (Mongoose)
        ↓
Sentiment summary returned to frontend
        ↓
User sees: % Positive / Negative / Neutral + chart
```

---

## 📦 Dependencies

| Package    | Purpose                                      |
|------------|----------------------------------------------|
| `express`  | Web server and REST API routing              |
| `axios`    | HTTP client for YouTube Data API requests    |
| `mongoose` | MongoDB object modelling and persistence     |
| `dotenv`   | Loads environment variables from `.env` file |

---

## 🛠️ Future Improvements

- Add authentication so users can save analysis history
- Support batch analysis of multiple videos
- Add more advanced NLP models (e.g., BERT-based transformers)
- Deploy to cloud (Render, Railway, or Vercel + Atlas)
- Add language detection for multilingual comment support

---

## 📄 License

ISC

---

## 👤 Author

**Asutosh** — [GitHub Profile](https://github.com/Asutosh160805)
