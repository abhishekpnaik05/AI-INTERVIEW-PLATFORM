import { useEffect, useState, useCallback } from 'react';
import { PageHeader } from '../components/PageHeader';
import { codingService, type CodingQuestion, type CodingAttempt } from '../services/codingService';
import { getApiError } from '../utils/getApiError';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

const DIFFICULTY_COLORS = {
  easy: 'bg-emerald-100 text-emerald-800',
  medium: 'bg-amber-100 text-amber-800',
  hard: 'bg-rose-100 text-rose-800',
};

export function CodingInterview() {
  const [questions, setQuestions] = useState<CodingQuestion[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<CodingQuestion | null>(null);
  const [difficulty, setDifficulty] = useState<string>('');
  const [code, setCode] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [feedback, setFeedback] = useState<CodingAttempt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchQuestions = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const list = await codingService.getQuestions(difficulty || undefined);
      setQuestions(list);
      if (list.length > 0) {
        const full = await codingService.getQuestion(list[0]._id);
        setSelectedQuestion(full);
        setCode('');
        setFeedback(null);
        setTimerSeconds(0);
        setIsTimerRunning(false);
      } else {
        setSelectedQuestion(null);
      }
    } catch (err) {
      setError(getApiError(err, 'Failed to load questions.'));
      setQuestions([]);
      setSelectedQuestion(null);
    } finally {
      setIsLoading(false);
    }
  }, [difficulty]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => setTimerSeconds((s) => s + 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const handleSelectQuestion = async (q: CodingQuestion) => {
    setError('');
    setFeedback(null);
    try {
      const full = await codingService.getQuestion(q._id);
      setSelectedQuestion(full);
      setCode('');
      setTimerSeconds(0);
      setIsTimerRunning(false);
    } catch (err) {
      setError(getApiError(err, 'Failed to load question.'));
    }
  };

  const handleStartTimer = () => setIsTimerRunning(true);

  const handleSubmit = async () => {
    if (!selectedQuestion) return;
    setIsSubmitting(true);
    setError('');
    setFeedback(null);
    try {
      const attempt = await codingService.submitAttempt(selectedQuestion._id, code);
      setFeedback(attempt);
      setIsTimerRunning(false);
    } catch (err) {
      setError(getApiError(err, 'Failed to submit. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Coding Interview"
        subtitle="Practice algorithmic questions with AI-driven feedback."
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        {/* Left: Question list & description */}
        <div className="flex-1 space-y-4 lg:min-w-0">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold text-slate-900">Questions</h3>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="">All difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            {isLoading ? (
              <p className="py-4 text-center text-sm text-slate-500">Loading questions…</p>
            ) : questions.length === 0 ? (
              <p className="py-4 text-center text-sm text-slate-500">No questions available.</p>
            ) : (
              <ul className="space-y-1">
                {questions.map((q) => (
                  <li key={q._id}>
                    <button
                      type="button"
                      onClick={() => handleSelectQuestion(q)}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        selectedQuestion?._id === q._id
                          ? 'bg-indigo-50 font-medium text-indigo-700'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span className="block truncate">{q.title}</span>
                      <span
                        className={`mt-0.5 inline-block rounded px-2 py-0.5 text-xs ${
                          DIFFICULTY_COLORS[q.difficulty as keyof typeof DIFFICULTY_COLORS] ??
                          'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {selectedQuestion && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <h3 className="text-lg font-semibold text-slate-900">{selectedQuestion.title}</h3>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    DIFFICULTY_COLORS[
                      selectedQuestion.difficulty as keyof typeof DIFFICULTY_COLORS
                    ] ?? 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {selectedQuestion.difficulty}
                </span>
              </div>
              <div className="prose prose-sm max-w-none text-slate-600">
                <p className="whitespace-pre-wrap">{selectedQuestion.description}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Code editor & feedback */}
        <div className="flex flex-1 flex-col gap-4 lg:max-w-2xl">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2">
              <span className="text-sm font-medium text-slate-600">Code</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 rounded-lg bg-slate-200/80 px-2 py-1 font-mono text-sm text-slate-700">
                  <span className="text-slate-500">⏱</span>
                  <span>{formatTime(timerSeconds)}</span>
                  <button
                    type="button"
                    onClick={handleStartTimer}
                    disabled={isTimerRunning}
                    className="ml-1 rounded px-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-100 disabled:opacity-50"
                  >
                    {isTimerRunning ? 'Running' : 'Start'}
                  </button>
                </div>
                <span className="text-xs text-slate-500">JavaScript</span>
              </div>
            </div>
            <div className="p-2">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// Write your solution here..."
                className="min-h-[320px] w-full resize-y rounded-lg border border-slate-200 bg-slate-50/50 p-4 font-mono text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                spellCheck={false}
              />
            </div>
            <div className="border-t border-slate-200 bg-slate-50 px-4 py-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!selectedQuestion || isSubmitting}
                className="rounded-lg bg-indigo-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting…' : 'Submit'}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {feedback && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h4 className="mb-3 font-semibold text-slate-900">Feedback</h4>
              <div className="space-y-3">
                {feedback.score != null && (
                  <p className="text-sm">
                    <span className="font-medium text-slate-600">Score:</span>{' '}
                    <span className="font-semibold text-indigo-600">{feedback.score}%</span>
                  </p>
                )}
                {feedback.aiFeedback ? (
                  <p className="whitespace-pre-wrap text-sm text-slate-600">{feedback.aiFeedback}</p>
                ) : (
                  <p className="text-sm text-slate-500">
                    Submission received. AI feedback will appear here once integrated.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
