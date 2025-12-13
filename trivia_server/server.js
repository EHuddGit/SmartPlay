const { formatTTAQuestion } = require("./formatQuestion.js");
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const QUESTIONS_FILE = path.join(__dirname, "questions.json");

function adaptTTAQuestion(q) {
  return {
    question: q?.question?.text ?? "",
    correct_answer: q?.correctAnswer ?? "",
    incorrect_answers: Array.isArray(q?.incorrectAnswers)
      ? q.incorrectAnswers
      : [],
  };
}

async function loadCategories() {
  try {
    //const resp = await fetch("https://opentdb.com/api_category.php");
    const resp = await fetch("https://the-trivia-api.com/v2/categories")
    console.log(resp)
    if (!resp.ok) throw new Error(`Upstream error: ${resp.status}`);

    const data = await resp.json();
    return Object.keys(data)

  } catch (err) {
    console.error("Failed to retrieve trivia categories:", err);
    throw err;
  }
}

async function loadQuestions(topic, diff) {
  //amount numbers vary per category and difficulty chosen 15 is the amount
  const questionAmount = 5;
  try {
    const resp = await fetch(`https://the-trivia-api.com/v2/questions?limit=${questionAmount}&categories=${topic}&difficulties=${diff}`);

    //console.log(`https://the-trivia-api.com/v2/questions?limit=20&categories=${topic}&difficulties=${diff}`);
    if (!resp.ok) throw new Error(`Upstream error: ${resp.status}`);

    const json = await resp.json();

    //console.log(json)
    if (!Array.isArray(json)) {
      throw new Error("Unexpected Trivia API payload (expected array)");
    }
    //console.log(json)
    return json;

  } catch (err) {
    console.error("Failed to retrieve trivia categories:", err);
    throw err;
  }
}

//should have it so that no matter what trivia api is used, the same json format is returned
app.get("/api/questions", async (req, res) => {

  const topic = req.query.topic || 17;
  const difficulty = req.query.difficulty || "easy";

  try {
    const questions = await loadQuestions(topic, difficulty);
    console.log(questions)
    const normalized = [];

for (let i = 0; i < questions.length; i++) {
  const raw = questions[i];

  try {
    const adapted = adaptTTAQuestion(raw);

    // quick check of what you're feeding into the formatter
    if (i === 0) {
      console.log("adapted sample:", adapted);
    }

    const formatted = formatTTAQuestion(adapted);

    if (formatted) normalized.push(formatted);
  } catch (err) {
    console.log("FAILED at index", i);
    console.log("raw:", raw);
    console.log("adapted:", adaptTTAQuestion(raw));
    console.error(err);
    break; // stop on first failure so the log is readable
  }
}

console.log("normalized count:", normalized.length);
    if (!normalized.length) {
      return res.status(404).json({ error: "No questions returned" });
    }

   res.json(normalized);
  } catch (e) {
    res.status(500).json({ error: "failed to load questions" });
  }
});


//endpoints
app.get("/api/config", (req, res) => {
  res.json({
    topics: ["General", "Science", "History", "Programming"],
    difficulties: ["Easy", "Medium", "Hard"]
  });
});

app.get("/api/categories", async (req, res) => {
  console.log("fetching categories")
  try {
    const categories = await loadCategories();

    res.json({ categories });
    console.log(categories)
  } catch (e) {
    res.status(500).json({ error: "failed to load categories" });
  }
});

app.get("/health", (_, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`server is running on http://localhost:${PORT}`));