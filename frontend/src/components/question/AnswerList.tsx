import { useState } from 'react';
import { useAnswers, useCreateAnswer } from '@/hooks/useQuestions';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/Spinner';
import { AnswerItem } from './AnswerItem';
import toast from 'react-hot-toast';

interface AnswerListProps {
  questionId: string;
}

export const AnswerList = ({ questionId }: AnswerListProps): JSX.Element => {
  const { isAuthenticated } = useAuth();
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [answerContent, setAnswerContent] = useState('');

  const { data, isLoading, error } = useAnswers(questionId, {
    page: 1,
    limit: 50, // Maximum allowed by backend validation
    sort: 'latest',
  });

  const createAnswerMutation = useCreateAnswer(questionId);

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (answerContent.trim().length === 0) {
      toast.error('Answer cannot be empty');
      return;
    }

    try {
      await createAnswerMutation.mutateAsync({
        content: answerContent.trim(),
      });
      toast.success('Answer posted successfully!');
      setAnswerContent('');
      setShowAnswerForm(false);
    } catch (error) {
      toast.error('Failed to post answer');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Spinner size="sm" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-600">
        <p className="text-sm">Failed to load answers</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Answers */}
      {data && data.answers.length > 0 && (
        <div className="space-y-3">
          {data.answers.map((answer) => (
            <AnswerItem
              key={answer._id}
              answer={answer}
              questionId={questionId}
            />
          ))}
        </div>
      )}

      {/* Answer Form */}
      {isAuthenticated && (
        <div className="mt-4">
          {!showAnswerForm ? (
            <button
              onClick={() => setShowAnswerForm(true)}
              className="text-sm text-[#4DCDB3] hover:text-[#3CB89F] font-medium flex items-center gap-1 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add an answer
            </button>
          ) : (
            <form onSubmit={handleSubmitAnswer} className="space-y-3">
              <textarea
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
                placeholder="Write your answer..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DCDB3] focus:border-transparent resize-none text-sm"
                maxLength={2000}
                required
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  {answerContent.length}/2000 characters
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAnswerForm(false);
                      setAnswerContent('');
                    }}
                    className="px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createAnswerMutation.isPending}
                    className="px-3 py-1.5 text-sm bg-[#4DCDB3] hover:bg-[#3CB89F] text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createAnswerMutation.isPending ? 'Posting...' : 'Post Answer'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
