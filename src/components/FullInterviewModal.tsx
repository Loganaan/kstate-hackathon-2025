'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface FullInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (params: InterviewParams) => void;
}

export interface InterviewParams {
  company: string;
  role: string;
  seniority: 'intern' | 'junior' | 'mid' | 'senior';
  jobDescriptionUrl?: string;
  jobDescription?: string;
  companyInfo?: string;
}

export default function FullInterviewModal({ isOpen, onClose, onStart }: FullInterviewModalProps) {
  const [inputMode, setInputMode] = useState<'manual' | 'url'>('manual');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [seniority, setSeniority] = useState<InterviewParams['seniority']>('junior');
  const [jobDescriptionUrl, setJobDescriptionUrl] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [companyInfo, setCompanyInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate required fields
      if (!company.trim() || !role.trim()) {
        setError('Please fill in company and role fields');
        setIsLoading(false);
        return;
      }

      if (inputMode === 'manual') {
        if (!jobDescription.trim()) {
          setError('Please provide a job description');
          setIsLoading(false);
          return;
        }
        
        // Validate minimum length (API requires at least 50 characters)
        if (jobDescription.trim().length < 50) {
          setError(`Job description must be at least 50 characters (currently ${jobDescription.trim().length})`);
          setIsLoading(false);
          return;
        }
      }

      if (inputMode === 'url' && !jobDescriptionUrl.trim()) {
        setError('Please provide a job posting URL');
        setIsLoading(false);
        return;
      }

      // TODO: If URL mode, scrape the job posting for details
      // This would call a new API endpoint to extract job description and company info
      const finalJobDescription = inputMode === 'url' 
        ? `Job posting URL: ${jobDescriptionUrl}` 
        : jobDescription;
      const finalCompanyInfo = companyInfo;

      if (inputMode === 'url') {
        // TODO: Implement web scraping
        // const scrapedData = await fetch('/api/scrape-job', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ url: jobDescriptionUrl })
        // }).then(res => res.json());
        // finalJobDescription = scrapedData.jobDescription;
        // finalCompanyInfo = scrapedData.companyInfo;
      }

      const params: InterviewParams = {
        company: company.trim(),
        role: role.trim(),
        seniority,
        jobDescription: finalJobDescription,
        companyInfo: finalCompanyInfo || undefined,
        jobDescriptionUrl: inputMode === 'url' ? jobDescriptionUrl : undefined,
      };

      onStart(params);
    } catch (err) {
      setError('Failed to start interview. Please try again.');
      console.error('Interview start error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      // Reset form
      setCompany('');
      setRole('');
      setSeniority('junior');
      setJobDescriptionUrl('');
      setJobDescription('');
      setCompanyInfo('');
      setError('');
    }
  };

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Start Full Interview
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Complete a behavioral interview followed by a technical interview
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Input Mode Toggle */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Input Method
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setInputMode('manual')}
                className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                  inputMode === 'manual'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                }`}
              >
                Manual Input
              </button>
              <button
                type="button"
                onClick={() => setInputMode('url')}
                className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                  inputMode === 'url'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                }`}
              >
                Job Posting URL
              </button>
            </div>
          </div>

          {/* Company Name */}
          <div>
            <label htmlFor="company" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g., Google, Amazon, Microsoft"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
              disabled={isLoading}
            />
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Role / Position *
            </label>
            <input
              type="text"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Software Engineer, Product Manager"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
              disabled={isLoading}
            />
          </div>

          {/* Seniority Level */}
          <div>
            <label htmlFor="seniority" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Seniority Level *
            </label>
            <select
              id="seniority"
              value={seniority}
              onChange={(e) => setSeniority(e.target.value as InterviewParams['seniority'])}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
              disabled={isLoading}
            >
              <option value="intern">Intern</option>
              <option value="junior">Junior</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior</option>
            </select>
          </div>

          {/* URL Mode - Job Posting URL */}
          {inputMode === 'url' && (
            <div>
              <label htmlFor="jobUrl" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Job Posting URL *
              </label>
              <input
                type="url"
                id="jobUrl"
                value={jobDescriptionUrl}
                onChange={(e) => setJobDescriptionUrl(e.target.value)}
                placeholder="https://example.com/careers/job-posting"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
                disabled={isLoading}
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                We&apos;ll extract the job description and company information from this URL
              </p>
            </div>
          )}

          {/* Manual Mode - Job Description */}
          {inputMode === 'manual' && (
            <>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="jobDescription" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Job Description *
                  </label>
                  <span className={`text-xs font-medium ${
                    jobDescription.trim().length < 50 
                      ? 'text-red-600 dark:text-red-400' 
                      : 'text-green-600 dark:text-green-400'
                  }`}>
                    {jobDescription.trim().length}/50 min
                  </span>
                </div>
                <textarea
                  id="jobDescription"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here... (minimum 50 characters)"
                  rows={6}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    jobDescription.trim().length > 0 && jobDescription.trim().length < 50
                      ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:border-transparent transition-all resize-y`}
                  required
                  disabled={isLoading}
                />
                {jobDescription.trim().length > 0 && jobDescription.trim().length < 50 && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {50 - jobDescription.trim().length} more characters needed
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="companyInfo" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Company Information (Optional)
                </label>
                <textarea
                  id="companyInfo"
                  value={companyInfo}
                  onChange={(e) => setCompanyInfo(e.target.value)}
                  placeholder="Add information about company values, culture, mission, or any relevant context..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y"
                  disabled={isLoading}
                />
              </div>
            </>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Starting...
                </span>
              ) : (
                'Start Interview'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
