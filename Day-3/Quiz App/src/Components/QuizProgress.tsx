import type { AnswerRecord } from "../types/quiz";
import styles from "./QuizProgress.module.css";

type QuizProgressProps = {
  currentIndex: number;
  total: number;
  score: number;
  answers: AnswerRecord[];
};

function QuizProgress({
  currentIndex,
  total,
  score,
  answers,
}: QuizProgressProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.meta}>
        <span className={styles.step}>
          Question {currentIndex + 1} of {total}
        </span>
        <span className={styles.scoreBadge}>Score: {score}</span>
      </div>

      <div
        className={styles.segments}
        style={{ gridTemplateColumns: `repeat(${total}, 1fr)` }}
        role="progressbar"
        aria-valuenow={currentIndex + 1}
        aria-valuemin={1}
        aria-valuemax={total}
      >
        {Array.from({ length: total }).map((_, index) => {
          const answer = answers[index];
          let segmentClass = styles.segment;

          if (answer) {
            segmentClass += answer.isCorrect
              ? ` ${styles.correct}`
              : ` ${styles.incorrect}`;
          } else if (index === currentIndex) {
            segmentClass += ` ${styles.active}`;
          }

          return <span key={index} className={segmentClass} />;
        })}
      </div>
    </div>
  );
}

export default QuizProgress;