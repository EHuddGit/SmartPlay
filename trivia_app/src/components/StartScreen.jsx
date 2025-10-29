import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./QuizStyles.css";

export default function StartScreen() {
    const [topics, setTopics] = useState([]);
    const [topic, setTopic] = useState(0);
    const [difficulty, setDifficulty] = useState([]);
    const difficulties = ["easy", "medium", "hard"];
    const navigate = useNavigate();

    useEffect(() => {loadCategories();},[]);
    useEffect(() => {
    const all = [
      "-- Choose a Topic --",
      ...topics.map(t => t.name ?? String(t)),
      "-- Choose a Difficulty --",
      ...difficulties.map(d => String(d)),
    ];
    const longest = all.reduce((m, s) => Math.max(m, (s || "").length), 0);
    const ch = Math.min(40, longest + 4); 
    document.documentElement.style.setProperty("--select-ch", `${ch}ch`);
  }, [topics, difficulties]); 

    function handleStart() {
        navigate("/quiz", {state: {topic,difficulty}});
    }

    async function loadCategories() {
        try {
            const API_URL = import.meta.env.VITE_API_URL || "";

            const res = await fetch(`${API_URL}/api/categories`);
            if (!res.ok) {
                throw new Error(`Failed to fetch questions: ${res.statusText}`);
            }

            const data = await res.json();
            const list = data.categories || data.trivia_categories || [];
            setTopics([...list].sort((a,b)=> a.name.localeCompare(b.name)));
            //should have them in alphabetical order

        } catch (err) {
            return {categories: [], error: true}
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
                                <option key={t.id} value={t.id}>{t.name}</option>
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