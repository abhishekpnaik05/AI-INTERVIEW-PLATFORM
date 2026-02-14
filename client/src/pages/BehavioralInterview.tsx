import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { behavioralService, type BehavioralInterview } from '../services/behavioralService';
import { getApiError } from '../utils/getApiError';

const PRACTICE_QUESTIONS = [
  'Tell me about a time you led a project or initiative.',
  'Describe a conflict you resolved with a teammate.',
  'How do you handle tight deadlines and competing priorities?',
  'Give an example of when you had to adapt to significant change.',
  'Tell me about a time you failed and what you learned from it.',
  'Describe a situation where you had to influence without authority.',
  'How have you dealt with a difficult stakeholder or client?',
  'Tell me about a time you had to make a decision with incomplete information.',
];

function getRandomQuestion(): string {
  return PRACTICE_QUESTIONS[Math.floor(Math.random() * PRACTICE_QUESTIONS.length)];
}

export function BehavioralInterview() {
  const [question, setQuestion] = useState(() => getRandomQuestion());
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<BehavioralInterview | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setIsSubmitting(true);
    setError('');
    setResult(null);
    try {
      const interview = await behavioralService.submit(question, answer.trim());
      setResult(interview);
    } catch (err) {
      setError(getApiError(err, 'Failed to submit. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewQuestion = () => {
    setQuestion(getRandomQuestion());
    setAnswer('');
    setResult(null);
    setError('');
  };

  return (
    <>
      <PageHeader
        title="Behavioral Interview"
        subtitle="Practice STAR method and common behavioral questions."
      />

      <div className="mx-auto max-w-3xl space-y-6">
        {/* Question card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-indigo-600">
              Question
            </span>
            <button
              type="button"
              onClick={handleNewQuestion}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              New question →
            </button>
          </div>
          <p className="text-lg font-medium text-slate-900">{question}</p>
          <p className="mt-2 text-sm text-slate-500">
            Use the STAR method: Situation, Task, Action, Result
          </p>
        </div>

        {/* Answer textarea */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <label htmlFor="answer" className="block text-sm font-medium text-slate-700">
            Your answer
          </label>
          <textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Describe your situation, the task at hand, the actions you took, and the results..."
            rows={8}
            className="mt-2 w-full resize-y rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!answer.trim() || isSubmitting}
            className="mt-4 rounded-lg bg-indigo-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting…' : 'Submit'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Evaluation result */}
        {result && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h4 className="mb-4 font-semibold text-slate-900">Evaluation</h4>
            <div className="space-y-4">
              {result.score != null && (
                <div>
                  <span className="text-sm font-medium text-slate-600">Score: </span>
                  <span className="font-semibold text-indigo-600">{result.score}%</span>
                </div>
              )}
              {result.aiEvaluation ? (
                <div>
                  <span className="mb-2 block text-sm font-medium text-slate-600">Feedback</span>
                  <p className="whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
                    {result.aiEvaluation}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  Submission received. AI evaluation will appear here once integrated.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
