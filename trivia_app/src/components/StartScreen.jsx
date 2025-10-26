import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StartScreen() {
    const [topics, setTopics] = useState([]);
    const [difficulty, setDifficulty] = useState([]);
    const difficulties = ["easy", "medium", "hard"];
    const navigate = useNavigate();

    useEffect(() => {loadCategories();},[]);

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
            setTopics(list.map(c => c.name));
            //should have them in alphabetical order

        } catch (err) {
            return {categories: [], error: true}
        }
    }

    return (
        <section>
            <h1>Smart Play</h1>
            <form action={handleStart}>

                <label htmlFor="topic">Topic:</label>
                <select id="topic" name="topic" defaultValue="" onChange={(e)=>setTopic(e.target.value)} required>
                    <option value="" disabled>-- Choose a Topic --</option>
                    {topics.map((t) => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>

                <label htmlFor="difficulty">Difficulty:</label>
                <select id="difficulty" name="difficulty" defaultValue="" onChange={(e)=>setDifficulty(e.target.value)} required>
                    <option value="" disabled>-- Choose a Difficulty --</option>
                    {difficulties.map((d) => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>

            <button type="submit">Start Quiz</button>
            </form>
        </section>
    );
}