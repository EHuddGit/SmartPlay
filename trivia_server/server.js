const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const QUESTIONS_FILE = path.join(__dirname, "questions.json");

function loadQuestions() {
  try {
    const data = fs.readFileSync(QUESTIONS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading questions file:", err);
    return {};
  }
}

app.get("/api/questions", (req, res) => {
  const topic = req.query.topic || "general";
  const difficulty = req.query.difficulty || "easy";

  const data = loadQuestions();

  if (!data[topic] || !data[topic][difficulty]) {
    return res.status(404).json({ error: "Topic or difficulty not found" });
  }

  res.json(data[topic][difficulty]);
});

app.get("/api/config", (req, res) => {
  res.json({
    topics: ["General", "Science", "History", "Programming"],
    difficulties: ["Easy", "Medium", "Hard"]
  });
});

app.get("/health", (_, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`server is running on http://localhost:${PORT}`));