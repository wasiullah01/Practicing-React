import { useState } from "react";
import AppShell from "./Components/AppShell";
import QuizCard from "./Components/QuizCard";
import QuizProgress from "./Components/QuizProgress";
import ScoreScreen from "./Components/ScoreScreen";
import StartScreen from "./Components/StartScreen";
import { quizQuestions } from "./data/questions";
import type { AnswerRecord, Question } from "./types/quiz";
import "./App.css";

type QuizStage = "start" | "playing" | "finished";

function shuffleQuestions(items: Question[]): Question[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function App() {
  const [stage, setStage] = useState<QuizStage>("start");
  const [shuffle, setShuffle] = useState(false);
  const [questions, setQuestions] = useState<Question[]>(quizQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);

  const currentQuestion = questions[currentIndex];
  const score = answers.filter((answer) => answer.isCorrect).length;

  function handleStartQuiz() {
    setQuestions(shuffle ? shuffleQuestions(quizQuestions) : quizQuestions);
    setCurrentIndex(0);
    setSelectedIndex(null);
    setAnswers([]);
    setStage("playing");
  }

  function handleSelectOption(optionIndex: number) {
    if (selectedIndex !== null) {
      return;
    }

    setSelectedIndex(optionIndex);
    setAnswers((currentAnswers) => [
      ...currentAnswers,
      {
        questionId: currentQuestion.id,
        question: currentQuestion.question,
        selectedOption: currentQuestion.options[optionIndex],
        correctOption: currentQuestion.options[currentQuestion.correctIndex],
        isCorrect: optionIndex === currentQuestion.correctIndex,
      },
    ]);
  }

  function handleNextQuestion() {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setSelectedIndex(null);
    } else {
      setStage("finished");
    }
  }

  function handleRestart() {
    setStage("start");
    setCurrentIndex(0);
    setSelectedIndex(null);
    setAnswers([]);
  }

  const headerText = {
    start: {
      title: "React Fundamentals",
      subtitle: "A quick interactive check to test your core React knowledge.",
    },
    playing: {
      title: "Quick check",
      subtitle: "Choose the best answer below to see an instant explanation.",
    },
    finished: {
      title: "Quiz complete",
      subtitle: "Here is how you did across all questions.",
    },
  }[stage];

  return (
    <AppShell
      eyebrow="React Quiz"
      title={headerText.title}
      subtitle={headerText.subtitle}
    >
      {stage === "start" && (
        <StartScreen
          totalQuestions={quizQuestions.length}
          shuffle={shuffle}
          onToggleShuffle={setShuffle}
          onStart={handleStartQuiz}
        />
      )}

      {stage === "playing" && currentQuestion && (
        <>
          <QuizProgress
            currentIndex={currentIndex}
            total={questions.length}
            score={score}
            answers={answers}
          />
          <QuizCard
            question={currentQuestion}
            selectedIndex={selectedIndex}
            isLastQuestion={currentIndex === questions.length - 1}
            onSelectOption={handleSelectOption}
            onNext={handleNextQuestion}
          />
        </>
      )}

      {stage === "finished" && (
        <ScoreScreen
          score={score}
          total={questions.length}
          answers={answers}
          onRestart={handleRestart}
        />
      )}
    </AppShell>
  );
}

export default App;