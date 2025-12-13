import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./QuizStyles.css";

export default function QuizScreen() {
 
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const topic = searchParams.get("topic");
  const difficulty = searchParams.get("difficulty");

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    // If params are missing, stop loading and show an error
    if (!topic || !difficulty) {
      setErr("Missing topic or difficulty in URL.");
      setLoading(false);
      return;
    }
    loadQuestions(topic, difficulty);
  }, [topic, difficulty]);

  const curQuestion = useMemo(
    () => questions[current] ?? null,
    [questions, current]
  );

  async function loadQuestions(topicValue, difficultyValue) {
    try {
      setLoading(true);
      setErr("");

      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

      const url =
        `${API_URL}/api/questions?topic=${encodeURIComponent(topicValue)}` +
        `&difficulty=${encodeURIComponent(difficultyValue)}`;

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Failed to fetch questions: ${res.status} ${res.statusText}`);
      }

      const questionsArray = await res.json();

      if (!Array.isArray(questionsArray) || !questionsArray.length) {
        throw new Error("No questions returned");
      }

      setQuestions(questionsArray);
      setCurrent(0);
      setScore(0);
    } catch (e) {
      setErr(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  function handleAnswerSelect(optionIndex) {
    const correct = optionIndex === curQuestion.answer;
    const finalScore = score + (correct ? 1 : 0);

    if (correct) setScore((s) => s + 1);

    const isLast = current >= questions.length - 1;

    if (!isLast) {
      setCurrent((i) => i + 1);
    } else {
      navigate("/results", { state: { score: finalScore, total: questions.length } });
    }
  }

    if (loading) return <p style={{padding:16}}>Loading questions…</p>;
    if (err) return <p style={{padding:16, color:'crimson'}}>Error: {err}</p>;
    if (!curQuestion) return <p style={{padding:16}}>No questions found.</p>;

    return (
        <section>
    <div className="card stack">
      <h1 className="header">Smart Play</h1>
      <p className="quiz-progress">Question {current + 1} of {questions.length}</p>
      <h2 className="quiz-question">{curQuestion.question}</h2>

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