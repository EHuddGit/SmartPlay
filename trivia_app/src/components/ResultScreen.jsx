import { useLocation, useNavigate } from "react-router-dom"
import "./QuizStyles.css";

export default function ResultScreen() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const score = state?.score ?? 0;
    const total = state?.total ?? 0;

    const percentage = ((score / total) * 100).toFixed(0);

    return (
    <section>
    <div className="card result-wrap">
      <h1 className="header">Smart Play</h1>
      <h2 className="subhead">Quiz Complete!</h2>

      <div className="score-card">
        <p className="score-big">{score} / {total}</p>
        <p className="score-meta">{(total ? (score / total) * 100 : 0).toFixed(0)}%</p>
      </div>

      <div className="actions">
        {/* ADD THE CLASS */}
        <button className="btn" onClick={() => navigate("/", { replace: true })}>
          Back to Start
        </button>
      </div>
    </div>
  </section>
    )
}