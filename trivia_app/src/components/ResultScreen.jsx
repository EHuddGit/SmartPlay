import { useLocation, useNavigate } from "react-router-dom"

export default function ResultScreen() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const score = state?.score ?? 0;
    const total = state?.total ?? 0;

    const percentage = ((score / total) * 100).toFixed(0);

    return (
        <section>
            <h1>Quiz Complete!</h1>
            <p>You scored <strong>{score}</strong> out of <strong>{total}</strong></p>
            <button onClick={() => navigate("/", { replace: true })}>Back to Start</button>
        </section>
    )
}