import { useEffect } from "react";
import type { Question } from "../types/quiz";
import styles from "./QuizCard.module.css";

type QuizCardProps = {
  question: Question;
  selectedIndex: number | null;
  isLastQuestion: boolean;
  onSelectOption: (index: number) => void;
  onNext: () => void;
};

const optionLetters = ["A", "B", "C", "D"];

function QuizCard({
  question,
  selectedIndex,
  isLastQuestion,
  onSelectOption,
  onNext,
}: QuizCardProps) {
  const isAnswered = selectedIndex !== null;

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const key = event.key.toUpperCase();
      const keyMap: Record<string, number> = {
        A: 0,
        "1": 0,
        B: 1,
        "2": 1,
        C: 2,
        "3": 2,
        D: 3,
        "4": 3,
      };

      if (!isAnswered && key in keyMap) {
        const index = keyMap[key];
        if (index < question.options.length) {
          onSelectOption(index);
        }
      } else if (isAnswered && event.key === "Enter") {
        event.preventDefault();
        onNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAnswered, question, onSelectOption, onNext]);

  function getOptionClassName(index: number) {
    if (!isAnswered) {
      return styles.optionButton;
    }

    if (index === question.correctIndex) {
      return `${styles.optionButton} ${styles.correct}`;
    }

    if (index === selectedIndex) {
      return `${styles.optionButton} ${styles.incorrect}`;
    }

    return `${styles.optionButton} ${styles.dimmed}`;
  }

  return (
    <div key={question.id} className={styles.card}>
      <h2 className={styles.question}>{question.question}</h2>

      <ul className={styles.options}>
        {question.options.map((option, index) => {
          const isCorrectChoice = isAnswered && index === question.correctIndex;
          const isWrongChoice =
            isAnswered &&
            index === selectedIndex &&
            index !== question.correctIndex;

          return (
            <li key={option}>
              <button
                type="button"
                className={getOptionClassName(index)}
                disabled={isAnswered}
                onClick={() => onSelectOption(index)}
              >
                <span className={styles.optionContent}>
                  <span className={styles.letter}>{optionLetters[index]}</span>
                  <span>{option}</span>
                </span>

                {isCorrectChoice && (
                  <span className={styles.statusIcon} aria-label="Correct">
                    ✓
                  </span>
                )}
                {isWrongChoice && (
                  <span className={styles.statusIcon} aria-label="Incorrect">
                    ✕
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {isAnswered && (
        <>
          <p className={styles.feedback}>
            <strong>
              {selectedIndex === question.correctIndex
                ? "Correct! "
                : "Not quite. "}
            </strong>
            {question.explanation}
          </p>

          <div className={styles.footer}>
            <span className={styles.shortcutHint}>
              Press Enter ↵ to continue
            </span>
            <button
              type="button"
              className={styles.nextButton}
              onClick={onNext}
            >
              {isLastQuestion ? "See score" : "Next question"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default QuizCard;