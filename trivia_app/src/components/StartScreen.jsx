import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StartScreen() {
    const [topic, setTopic] = useState([]);
    const [difficulty, setDifficulty] = useState([]);
    const topics = ["general", "web", "programming"];
    const difficulties = ["easy", "medium", "hard"];
    const navigate = useNavigate();

    function handleStart() {
        navigate("/quiz", {state: {topic,difficulty}});
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