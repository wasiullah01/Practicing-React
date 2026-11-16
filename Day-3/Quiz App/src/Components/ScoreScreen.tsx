import type { AnswerRecord } from "../types/quiz";
import styles from "./ScoreScreen.module.css";

type ScoreScreenProps = {
  score: number;
  total: number;
  answers: AnswerRecord[];
  onRestart: () => void;
};

function ScoreScreen({ score, total, answers, onRestart }: ScoreScreenProps) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  const feedbackMessage =
    percentage === 100
      ? "Perfect score! You nailed every single question."
      : percentage >= 70
        ? "Great job! You have a strong grasp of React fundamentals."
        : "Good effort! Review the answers below and try again.";

  return (
    <div className={styles.container}>
      <div className={styles.summaryCard}>
        <span className={styles.percentage}>{percentage}% accuracy</span>
        <h2 className={styles.scoreHeading}>
          You scored {score} / {total}
        </h2>
        <p className={styles.message}>{feedbackMessage}</p>
      </div>

      <ul className={styles.reviewList}>
        {answers.map((item, index) => (
          <li key={item.questionId} className={styles.reviewItem}>
            <div className={styles.reviewHeader}>
              <p className={styles.reviewQuestion}>
                {index + 1}. {item.question}
              </p>
              <span
                className={
                  item.isCorrect ? styles.tagCorrect : styles.tagIncorrect
                }
              >
                {item.isCorrect ? "Correct" : "Missed"}
              </span>
            </div>
            <p className={styles.reviewDetail}>
              Your answer: <strong>{item.selectedOption}</strong>
              {!item.isCorrect && (
                <>
                  {" "}
                  · Correct answer: <strong>{item.correctOption}</strong>
                </>
              )}
            </p>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={styles.restartButton}
        onClick={onRestart}
      >
        Restart Quiz
      </button>
    </div>
  );
}

export default ScoreScreen;