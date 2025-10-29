import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./QuizStyles.css";


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

    const shuffle = (array) => { 
        for (let i = array.length - 1; i > 0; i--) { 
        const j = Math.floor(Math.random() * (i + 1)); 
        [array[i], array[j]] = [array[j], array[i]]; 
        } 
    return array; 
    }; 

    function decodeHtml(str) {
        const txt = document.createElement("textarea");
        txt.innerHTML = str;
        return txt.value
    }

    async function loadQuestions() {
        try {
            setLoading(true);
            setErr("");

            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
            const topicSafe = encodeURIComponent(state?.topic || "17");
            const difficultySafe = encodeURIComponent(state?.difficulty || "easy");

            const res = await fetch(`${API_URL}/api/questions?topic=${topicSafe}&difficulty=${difficultySafe}`);
            console.log(`${API_URL}/api/questions?topic=${topicSafe}&difficulty=${difficultySafe}`);

            if (!res.ok) {
                throw new Error(`Failed to fetch questions: ${res.statusText}`);
            }

            const data = await res.json();
            console.log("data results" + data)
            const results = Array.isArray(data) ? data : data.results || [];

            const normalized = results.map(q => {
                const options = shuffle([...q.incorrect_answers, q.correct_answer]);
                const answerIndex = options.indexOf(q.correct_answer);

                return {
                    question: decodeHtml(q.question),
                    options: options.map(decodeHtml),
                    answer: answerIndex,
                };
            });

            if(!normalized.length) throw new Error("No questions returned");
            setQuestions(normalized);
            setCurrent(0);
            setScore(0);

        } catch (error) {
            setErr(error.message);
        } finally {
            setLoading(false);
        }
    }

    function handleAnswerSelect(optionIndex) {

        const correct = optionIndex === curQuestion.answer;
        const finalScore = score + (correct ? 1 : 0);

        if (correct) setScore(s => s + 1);
        const isLast = current >= questions.length - 1;

        if (!isLast) {
            setCurrent(i => i + 1);
        } else {
            // use the computed finalScore when navigating
            navigate("/results", { state: { score: finalScore, total: questions.length } });
        }
       
    }

    if (loading) return <p style={{padding:16}}>Loading questions…</p>;
    if (err) return <p style={{padding:16, color:'crimson'}}>Error: {err}</p>;
    if (!curQuestion) return <p style={{padding:16}}>No questions found.</p>;

    return (
        <section>
    <div className="card stack">
      {/* Header */}
      <h1 className="header">Smart Play</h1>

      {/* PROGRESS: now directly under header and styled */}
      <p className="quiz-progress">Question {current + 1} of {questions.length}</p>

      {/* Question text */}
      <h2 className="quiz-question">{curQuestion.question}</h2>

      {/* Answers */}
      <div className="Answers">
        {curQuestion.options.map((option, index) => (
          <button key={index} onClick={() => handleAnswerSelect(index)}>
            {option}
          </button>
        ))}
      </div>
    </div>
  </section>
    );
}