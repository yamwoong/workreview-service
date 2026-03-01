import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import type { IQuestion } from '@/types/question.types';
import { AnswerList } from './AnswerList';
import { EditQuestionModal } from './EditQuestionModal';
import { useAuthStore } from '@/stores/authStore';
import { useDeleteQuestion } from '@/hooks/useQuestions';
import toast from 'react-hot-toast';

interface QuestionDetailModalProps {
  question: IQuestion;
  onClose: () => void;
}

export const QuestionDetailModal = ({
  question,
  onClose,
}: QuestionDetailModalProps): JSX.Element => {
  const { user } = useAuthStore();
  const [isEditMode, setIsEditMode] = useState(false);
  const deleteQuestionMutation = useDeleteQuestion();

  const questionUserId = typeof question.user === 'string' ? question.user : question.user._id;
  const canEdit = user?.id === questionUserId;

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // 모달 열릴 때 body 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // 삭제 핸들러
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      await deleteQuestionMutation.mutateAsync(question._id);
      toast.success('Question deleted successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to delete question');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div className="flex-1 pr-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {question.title}
            </h2>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="font-medium text-gray-700">
                {question.user.username}
              </span>
              <span>
                {formatDistanceToNow(new Date(question.createdAt), {
                  addSuffix: true,
                })}
              </span>
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span className="font-medium text-gray-600">
                  {question.answerCount}{' '}
                  {question.answerCount === 1 ? 'answer' : 'answers'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {canEdit && (
              <>
                <button
                  onClick={() => setIsEditMode(true)}
                  className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteQuestionMutation.isPending}
                  className="px-3 py-1.5 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                >
                  Delete
                </button>
              </>
            )}
            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Question Content */}
        <div className="p-6 border-b border-gray-200">
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {question.content}
          </p>
        </div>

        {/* Answers Section */}
        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {question.answerCount > 0
              ? `${question.answerCount} ${question.answerCount === 1 ? 'Answer' : 'Answers'}`
              : 'Be the first to answer'}
          </h3>
          <AnswerList questionId={question._id} />
        </div>
      </div>

      {/* Edit Question Modal */}
      {isEditMode && (
        <EditQuestionModal
          question={question}
          onClose={() => setIsEditMode(false)}
        />
      )}
    </div>
  );
};
