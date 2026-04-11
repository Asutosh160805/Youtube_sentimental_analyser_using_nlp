const axios = require("axios");

// Extract video ID from URL
function getVideoId(url) {
    const regex = /(?:v=|\/)([0-9A-Za-z_-]{11}).*/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// Fetch comments from YouTube API
async function fetchComments(videoId, apiKey, max = 500) {
    let comments = [];
    let nextPageToken = "";

    while (comments.length < max) {
        const res = await axios.get(
            `https://www.googleapis.com/youtube/v3/commentThreads`,
            {
                params: {
                    part: "snippet",
                    videoId: videoId,
                    maxResults: 100, // max allowed per request
                    pageToken: nextPageToken,
                    key: apiKey
                }
            }
        );

        const items = res.data.items;

        for (let item of items) {
            const c = item.snippet.topLevelComment.snippet;

            comments.push({
                commentId: item.snippet.topLevelComment.id,
                text: c.textDisplay,
                author: c.authorDisplayName,
                publishedAt: c.publishedAt
            });
        }

        nextPageToken = res.data.nextPageToken;

        if (!nextPageToken || items.length === 0) break;
    }

    return comments.slice(0, max);
}

module.exports = { getVideoId, fetchComments };