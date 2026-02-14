import { useState, useRef } from 'react';
import { PageHeader } from '../components/PageHeader';
import { resumeService, type ResumeAnalysis } from '../services/resumeService';
import { getApiError } from '../utils/getApiError';

export function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && (f.type === 'application/pdf' || f.name.endsWith('.pdf'))) {
      setFile(f);
      setError('');
      setAnalysis(null);
    } else {
      setError('Please select a PDF file.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      if (f.type === 'application/pdf' || f.name.endsWith('.pdf')) {
        setFile(f);
        setError('');
        setAnalysis(null);
      } else {
        setError('Please select a PDF file.');
        setFile(null);
      }
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    setIsSubmitting(true);
    setError('');
    setAnalysis(null);
    try {
      const result = await resumeService.upload(file);
      setAnalysis(result);
    } catch (err) {
      setError(getApiError(err, 'Upload failed. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setAnalysis(null);
    setError('');
    fileInputRef.current?.value && (fileInputRef.current.value = '');
  };

  return (
    <>
      <PageHeader
        title="Resume Upload"
        subtitle="Upload your resume for AI-powered analysis and suggestions."
      />

      <div className="mx-auto max-w-2xl space-y-6">
        {/* File input / drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
            isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleChange}
            className="hidden"
            id="resume-upload"
            disabled={isSubmitting}
          />
          <label htmlFor="resume-upload" className="cursor-pointer">
            <div className="mb-4 text-4xl">📄</div>
            <p className="font-medium text-slate-700">
              Drop your resume here or click to browse
            </p>
            <p className="mt-1 text-sm text-slate-500">PDF files only, max 5MB</p>
          </label>
          {file && (
            <div className="mt-4 flex items-center justify-center gap-3">
              <p className="text-sm font-medium text-indigo-600">{file.name}</p>
              <button
                type="button"
                onClick={handleReset}
                disabled={isSubmitting}
                className="text-sm text-slate-500 hover:text-slate-700 disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Submit button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!file || isSubmitting}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Analyzing…
              </>
            ) : (
              'Analyze Resume'
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* AI analysis response */}
        {analysis && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h4 className="mb-2 font-semibold text-slate-900">AI Analysis</h4>
            <p className="mb-4 text-sm text-slate-500">{analysis.originalName}</p>
            <div className="prose prose-sm max-w-none text-slate-700">
              <div className="whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm">
                {analysis.aiAnalysis}
              </div>
            </div>
            {analysis.score != null && (
              <p className="mt-4 text-sm">
                <span className="font-medium text-slate-600">Score: </span>
                <span className="font-semibold text-indigo-600">{analysis.score}%</span>
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
