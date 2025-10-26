import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function QuizScreen() {
    const navigate = useNavigate();
    const { state } = useLocation();
    
    const [questions,setQuestions] = useState([]);
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    useEffect(() => {loadQuestions();}, [state]);

    const curQuestion = useMemo(() => questions[current] ?? null, [questions, current]);

    async function loadQuestions() {
        try {
            setLoading(true);
            setErr("");

            const API_URL = import.meta.env.VITE_API_URL || "";
            const topicSafe = encodeURIComponent(state?.topic || "general");
            const difficultySafe = encodeURIComponent(state?.difficulty || "easy");

            const res = await fetch(`${API_URL}/api/questions?topic=${topicSafe}&difficulty=${difficultySafe}`);

            if (!res.ok) {
                throw new Error(`Failed to fetch questions: ${res.statusText}`);
            }

            const data = await res.json();
            setQuestions(data);
            setCurrent(0);
            setScore(0);

        } catch (error) {
            setErr(error.message);
        } finally {
            setLoading(false);
  }
}

    function handleAnswerSelect(optionIndex) {

        if(!curQuestion) return;

        const last = current === questions.length - 1;
        const isCorrect = optionIndex === curQuestion.answer;
        const nextScore = isCorrect ? score + 1 : score;

        if(!last) {
            if(isCorrect) setScore((s) => s + 1);
            setCurrent((i) => i + 1)
        }
        else {
            navigate("/results", { state: { score: nextScore, total: questions.length } });
        }
       
    }

    if (loading) return <p style={{padding:16}}>Loading questions…</p>;
    if (err) return <p style={{padding:16, color:'crimson'}}>Error: {err}</p>;
    if (!curQuestion) return <p style={{padding:16}}>No questions found.</p>;

    return (
        <section>
            <h2>Question {current + 1} of {questions.length}</h2>
            <h1>{curQuestion.question}</h1>

            <div className="Answers">
                {curQuestion.options.map((opt, i) => (
                    <button key={i} onClick={() => handleAnswerSelect(i)}>{opt}</button>
                ))}
            </div>
        </section>
    );
}