import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./QuizStyles.css";

export default function StartScreen() {
    const [topics, setTopics] = useState([]);
    const [topic, setTopic] = useState(0);
    const [difficulty, setDifficulty] = useState("");
    const difficulties = ["easy", "medium", "hard"];
    const navigate = useNavigate();

    useEffect(() => {loadCategories();},[]);

    //will need to fix this later, does not work when hitting the back button
    function handleStart() {
        navigate("/quiz", {state: {topic,difficulty}});
    }

    async function loadCategories() {
  try {
    const API_URL = import.meta.env.VITE_API_URL || "";

    const res = await fetch(`${API_URL}/api/categories`);
    if (!res.ok) {
      throw new Error(`Failed to fetch categories: ${res.status} ${res.statusText}`);
    }

    const data = await res.json(); 
    const list = Array.isArray(data.categories) ? data.categories : [];
    setTopics(list.slice().sort((a, b) => a.localeCompare(b)));

    return { categories: list, error: false };
  } catch (err) {
    console.error("Failed to fetch categories:", err);
    setTopics([]);
    return { categories: [], error: true };
  }
}

    return (
        <section>
            <div className="card">
                <h1 className="header">Smart Play</h1>

                <form className="form" onSubmit={handleStart}>
                    <div className="field">
                        <label className="label" htmlFor="topic">Topic</label>
                        <select
                            className="select"
                            id="topic"
                            name="topic"
                            defaultValue=""
                            onChange={(e) => setTopic(e.target.value)}
                            required
                        >
                            <option value="" disabled>-- Choose a Topic --</option>
                            {topics.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    <div className="field">
                        <label className="label" htmlFor="difficulty">Difficulty</label>
                        <select
                            className="select"
                            id="difficulty"
                            name="difficulty"
                            defaultValue=""
                            onChange={(e) => setDifficulty(e.target.value)}
                            required
                        >
                            <option value="" disabled>-- Choose a Difficulty --</option>
                            {difficulties.map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="btn">Start Quiz</button>
                </form>
            </div>
        </section>

    );
}