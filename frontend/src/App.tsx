import { useEffect, useState } from 'react';
import { fetchQuestions, saveAnswers } from './api';
import QuestionCard from './components/QuestionCard';
import './index.css';
import type { Question } from './types';

function App() {
  const [mainQuestions, setMainQuestions] = useState<Question[]>([]);
  const [displayedQuestion, setDisplayedQuestion] = useState<Question>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [saveMessage, setSaveMessage] = useState<string>("");

  useEffect(() => {
    fetchQuestions().then((allQuestions) => {
      setAllQuestions(allQuestions);

      const mainQuestions = allQuestions.filter((q: Question) => !q.relatedQuestionId).sort((a: Question, b: Question) => {
        const numA = parseInt(a.id.split('_')[1], 10);
        const numB = parseInt(b.id.split('_')[1], 10);
        return numA - numB;
      });
      setMainQuestions(mainQuestions);

      const firstQuestion = mainQuestions[0];
      setDisplayedQuestion(firstQuestion);
    }).catch(console.error);
  }, []);

  const handleNext = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex >= mainQuestions.length) return;

    const nextMainQuestion = mainQuestions[nextIndex];
    setDisplayedQuestion(nextMainQuestion);
    setCurrentQuestionIndex(nextIndex);
  };

  const handlePrevious = () => {
    const prevIndex = currentQuestionIndex - 1;
    if (prevIndex < 0) return;

    const prevMainQuestion = mainQuestions[prevIndex];
    setDisplayedQuestion(prevMainQuestion);
    setCurrentQuestionIndex(prevIndex);
  };

  const handleSave = async (answers: { [id: string]: string }) => {
    const formattedAnswers: { questionId: string, content: string, sessionId: string }[] = [];
    const sessionId = crypto.randomUUID();
    Object.entries(answers).forEach(([id, content]) => {
      formattedAnswers.push({
        questionId: id,
        content,
        sessionId: sessionId,
      });
    });
    try {
      await saveAnswers(formattedAnswers);
      setSaveMessage('Save done !');
    } catch {
      setSaveMessage('Save failed');
    }
    setTimeout(() => setSaveMessage(""), 3000);
  };

  if (!mainQuestions.length) return <div>Loading...</div>;
  if (!displayedQuestion) return <div>Loading...</div>;

  return (
    <div className="app-container">
      <QuestionCard
        mainQuestion={displayedQuestion}
        allQuestions={allQuestions}
        onNext={handleNext}
        disableNext={currentQuestionIndex === mainQuestions.length - 1}
        onPrevious={handlePrevious}
        disablePrevious={currentQuestionIndex === 0}
        onSave={handleSave}
      />
      {saveMessage && (
        <div className="save-message">{saveMessage}</div>
      )}
    </div>
  );
}

export default App;
