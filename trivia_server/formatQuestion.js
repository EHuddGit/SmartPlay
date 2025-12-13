function shuffleCopy(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function decodeHtml(str = "") {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}
//TTA == The Trivia API
function formatTTAQuestion(q) {

    if (!q || typeof q.question !== "string" || typeof q.correct_answer !== "string" || !Array.isArray(q.incorrect_answers)) {
    return null;
  }
    const options = shuffleCopy([...q.incorrect_answers, q.correct_answer,]);
    const answerIndex = options.indexOf(q.correct_answer);

    return {
        question: decodeHtml(q.question),
        options: options.map(decodeHtml),
        answer: answerIndex,
    };
}

module.exports = {
  formatTTAQuestion,
};