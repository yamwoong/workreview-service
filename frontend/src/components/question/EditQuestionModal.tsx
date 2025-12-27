import { useEffect, useState } from 'react';
import { useUpdateQuestion } from '@/hooks/useQuestions';
import toast from 'react-hot-toast';
import type { IQuestion } from '@/types/question.types';

interface EditQuestionModalProps {
  question: IQuestion;
  onClose: () => void;
}

export const EditQuestionModal = ({
  question,
  onClose,
}: EditQuestionModalProps): JSX.Element => {
  const [title, setTitle] = useState(question.title);
  const [content, setContent] = useState(question.content);
  const updateQuestionMutation = useUpdateQuestion();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (title.trim().length === 0) {
      toast.error('Title cannot be empty');
      return;
    }

    if (content.trim().length === 0) {
      toast.error('Content cannot be empty');
      return;
    }

    try {
      await updateQuestionMutation.mutateAsync({
        questionId: question._id,
        input: {
          title: title.trim(),
          content: content.trim(),
        },
      });
      toast.success('Question updated successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to update question');
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
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Edit Question</h2>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Title Field */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your question title"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4DCDB3] focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                {title.length} characters
              </p>
            </div>

            {/* Content Field */}
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Content *
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Describe your question in detail"
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4DCDB3] focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {content.length} characters
              </p>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={updateQuestionMutation.isPending}
            className="px-4 py-2 bg-[#4DCDB3] hover:bg-[#3CB89F] text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateQuestionMutation.isPending ? 'Updating...' : 'Update Question'}
          </button>
        </div>
      </div>
    </div>
  );
};
