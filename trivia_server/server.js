const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const QUESTIONS_FILE = path.join(__dirname, "questions.json");

async function loadCategories() {
  try {
    const resp = await fetch("https://opentdb.com/api_category.php");
    if (!resp.ok) throw new Error(`Upstream error: ${resp.status}`);

    const json = await resp.json();   
  
    return json.trivia_categories;   
  } catch (err) {
    console.error("Failed to retrieve trivia categories:", err);
    throw err; 
  }
}

async function loadQuestions(topic,diff) {
    //amount numbers vary per category and difficulty chosen 15 is the amount
    const questionAmount = 5;
  try {
    const resp = await fetch(`https://opentdb.com/api.php?amount=${questionAmount}&category=${topic}&difficulty=${diff}&type=multiple`);
    console.log(`https://opentdb.com/api.php?amount=20&category=${topic}&difficulty=${diff}&type=multiple`);
    if (!resp.ok) throw new Error(`Upstream error: ${resp.status}`);

    const json = await resp.json();   
  
    if (!json || !Array.isArray(json.results)) {
      throw new Error(`Unexpected OpenTDB payload`);
    }
    return json.results;

  } catch (err) {
    console.error("Failed to retrieve trivia categories:", err);
    throw err; 
  }
}



app.get("/api/questions", async (req, res) => {

    const topic = req.query.topic || 17;
    const difficulty = req.query.difficulty || "easy";

    try {
        console.log("checking topic id:" + req.query.topic);
        const questions = await loadQuestions(topic, difficulty);
        console.log(questions)


        if (!questions.length) {
            return res.status(404).json({ error: "No questions returned" });
        }

        res.json({ results: questions });
    } catch (e) {
        res.status(500).json({ error: "failed to load questions" });
    }
});

// app.get("/api/questions", (req, res) => {

// });



app.get("/api/config", (req, res) => {
  res.json({
    topics: ["General", "Science", "History", "Programming"],
    difficulties: ["Easy", "Medium", "Hard"]
  });
});

app.get("/api/categories", async (req, res) => {
  try {
    const categories = await loadCategories();
  
    res.json({ categories });
  } catch (e) {
    res.status(500).json({ error: "failed to load categories" });
  }
});

app.get("/health", (_, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`server is running on http://localhost:${PORT}`));