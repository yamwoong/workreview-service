import { formatDistanceToNow } from 'date-fns';
import type { IQuestion } from '@/types/question.types';

interface QuestionItemProps {
  question: IQuestion;
  onClick: () => void;
  onEdit?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  canEdit?: boolean;
}

export const QuestionItem = ({
  question,
  onClick,
  onEdit,
  onDelete,
  canEdit = false
}: QuestionItemProps): JSX.Element => {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer hover:border-primary hover:shadow-md transition-all"
    >
      {/* Question Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {question.title}
        </h3>
        <p className="text-gray-700 whitespace-pre-wrap">{question.content}</p>
      </div>

      {/* Question Meta */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <span className="font-medium text-gray-700">{question.user.username}</span>
          <span>
            {formatDistanceToNow(new Date(question.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-gray-400"
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
          <span className="font-medium">
            {question.answerCount} {question.answerCount === 1 ? 'answer' : 'answers'}
          </span>
        </div>
      </div>

      {/* Edit/Delete Actions */}
      {canEdit && (onEdit || onDelete) && (
        <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-gray-200">
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="px-3 py-1.5 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};
