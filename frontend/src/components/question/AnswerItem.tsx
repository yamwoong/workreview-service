import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useLikeAnswer, useDeleteAnswer } from '@/hooks/useQuestions';
import { EditAnswerModal } from './EditAnswerModal';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';
import type { IAnswer } from '@/types/question.types';

interface AnswerItemProps {
  answer: IAnswer;
  questionId: string;
}

export const AnswerItem = ({ answer, questionId }: AnswerItemProps): JSX.Element => {
  const { user } = useAuthStore();
  const [isEditMode, setIsEditMode] = useState(false);
  const likeAnswerMutation = useLikeAnswer(questionId);
  const deleteAnswerMutation = useDeleteAnswer(questionId);

  const answerUserId = typeof answer.user === 'string' ? answer.user : answer.user._id;
  const canEdit = user?.id === answerUserId;

  const handleLike = async () => {
    try {
      await likeAnswerMutation.mutateAsync(answer._id);
      toast.success('Liked!');
    } catch (error) {
      toast.error('Failed to like answer');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this answer?')) {
      return;
    }

    try {
      await deleteAnswerMutation.mutateAsync(answer._id);
      toast.success('Answer deleted successfully');
    } catch (error) {
      toast.error('Failed to delete answer');
    }
  };

  return (
    <div
      className={`p-4 rounded-lg ${
        answer.isBestAnswer
          ? 'bg-green-50 border-2 border-green-200'
          : 'bg-gray-50 border border-gray-200'
      }`}
    >
      {/* Best Answer Badge */}
      {answer.isBestAnswer && (
        <div className="flex items-center gap-2 mb-2">
          <svg
            className="w-5 h-5 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-semibold text-green-700">Best Answer</span>
        </div>
      )}

      {/* Answer Content */}
      <p className="text-gray-700 whitespace-pre-wrap mb-3">{answer.content}</p>

      {/* Answer Meta */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-3 text-gray-500">
          <span className="font-medium text-gray-700">{answer.user.name}</span>
          <span>
            {formatDistanceToNow(new Date(answer.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Edit/Delete Buttons */}
          {canEdit && (
            <>
              <button
                onClick={() => setIsEditMode(true)}
                className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteAnswerMutation.isPending}
                className="px-2 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
              >
                Delete
              </button>
            </>
          )}

          {/* Like Button */}
          <button
            onClick={handleLike}
            disabled={likeAnswerMutation.isPending}
            className="flex items-center gap-1 text-gray-500 hover:text-[#4DCDB3] transition-colors disabled:opacity-50"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
              />
            </svg>
            <span className="font-medium">{answer.likeCount}</span>
          </button>
        </div>
      </div>

      {/* Edit Answer Modal */}
      {isEditMode && (
        <EditAnswerModal
          answer={answer}
          questionId={questionId}
          onClose={() => setIsEditMode(false)}
        />
      )}
    </div>
  );
};
