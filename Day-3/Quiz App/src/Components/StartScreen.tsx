import styles from "./StartScreen.module.css";

type StartScreenProps = {
  totalQuestions: number;
  shuffle: boolean;
  onToggleShuffle: (checked: boolean) => void;
  onStart: () => void;
};

function StartScreen({
  totalQuestions,
  shuffle,
  onToggleShuffle,
  onStart,
}: StartScreenProps) {
  return (
    <div className={styles.container}>
      <div className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <span className={styles.infoLabel}>Questions</span>
          <span className={styles.infoValue}>{totalQuestions} Multiple Choice</span>
        </div>
        <div className={styles.infoCard}>
          <span className={styles.infoLabel}>Feedback</span>
          <span className={styles.infoValue}>Instant Explanations</span>
        </div>
      </div>

      <label className={styles.toggleRow}>
        <span className={styles.toggleText}>
          <span className={styles.toggleTitle}>Shuffle question order</span>
          <span className={styles.toggleHint}>
            Randomize questions for a fresh challenge
          </span>
        </span>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={shuffle}
          onChange={(e) => onToggleShuffle(e.target.checked)}
        />
      </label>

      <button type="button" className={styles.startButton} onClick={onStart}>
        Start Quiz
      </button>

      <p className={styles.tip}>
        Tip: Use keys <kbd className={styles.kbd}>A</kbd>–
        <kbd className={styles.kbd}>D</kbd> or{" "}
        <kbd className={styles.kbd}>1</kbd>–
        <kbd className={styles.kbd}>4</kbd> to answer, and{" "}
        <kbd className={styles.kbd}>Enter</kbd> for next.
      </p>
    </div>
  );
}

export default StartScreen;