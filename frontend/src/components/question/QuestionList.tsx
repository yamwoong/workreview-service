import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuestions, useDeleteQuestion } from '@/hooks/useQuestions';
import { Spinner } from '@/components/ui/Spinner';
import { Pagination } from '@/components/ui/Pagination';
import { QuestionItem } from './QuestionItem';
import { AskQuestionModal } from './AskQuestionModal';
import { QuestionDetailModal } from './QuestionDetailModal';
import { EditQuestionModal } from './EditQuestionModal';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';
import type { GetQuestionsParams } from '@/types/question.types';

interface QuestionListProps {
  storeId: string;
}

export const QuestionList = ({ storeId }: QuestionListProps): JSX.Element => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [params, setParams] = useState<GetQuestionsParams>({
    page: 1,
    limit: 10,
    sort: 'latest',
  });

  const deleteQuestionMutation = useDeleteQuestion();

  const { data, isLoading, error } = useQuestions(storeId, params);

  const handleAskQuestion = () => {
    if (!isAuthenticated) {
      toast.error(t('questionList.loginToAsk'));
      return;
    }
    setIsModalOpen(true);
  };

  const handleEdit = (questionId: string) => (e: React.MouseEvent) => {
    e.stopPropagation(); // 모달 열리지 않도록
    setEditingQuestionId(questionId);
  };

  const handleDelete = (questionId: string) => (e: React.MouseEvent) => {
    e.stopPropagation(); // 모달 열리지 않도록

    if (!window.confirm(t('questionList.confirmDelete'))) {
      return;
    }

    deleteQuestionMutation.mutate(questionId, {
      onSuccess: () => {
        toast.success(t('questionList.deleteSuccess'));
      },
      onError: () => {
        toast.error(t('questionList.deleteFailed'));
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p className="text-sm">{t('questionList.loadFailed')}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 font-medium">{t('questionList.sortBy')}</span>
          <div className="flex gap-2">
            {(['latest', 'mostAnswered'] as const).map((sortOption) => (
              <button
                key={sortOption}
                onClick={() => setParams((prev) => ({ ...prev, sort: sortOption, page: 1 }))}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  params.sort === sortOption
                    ? 'bg-primary text-white font-medium'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {sortOption === 'latest' ? t('questionList.latest') : t('questionList.mostAnswered')}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleAskQuestion}
          className="px-4 py-2 bg-primary hover:bg-[#b897c7] text-white font-medium text-sm rounded-md transition-colors"
        >
          {t('questionList.askQuestion')}
        </button>
      </div>

      {/* Questions List */}
      {data && data.questions.length > 0 ? (
        <>
          <div className="space-y-4">
            {data.questions.map((question) => {
              const questionUserId = typeof question.user === 'string' ? question.user : question.user._id;
              const canEdit = user?.id === questionUserId;

              return (
                <QuestionItem
                  key={question._id}
                  question={question}
                  onClick={() => setSelectedQuestionId(question._id)}
                  onEdit={handleEdit(question._id)}
                  onDelete={handleDelete(question._id)}
                  canEdit={canEdit}
                />
              );
            })}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={data.pagination.page}
            totalPages={data.pagination.pages}
            totalItems={data.pagination.total}
            itemsPerPage={data.pagination.limit}
            onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
          />
        </>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm mt-2">{t('questionList.noQuestionsYet')}</p>
          {isAuthenticated && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 px-4 py-2 bg-primary hover:bg-[#b897c7] text-white font-medium text-sm rounded-md transition-colors"
            >
              {t('questionList.askFirstQuestion')}
            </button>
          )}
        </div>
      )}

      {/* Ask Question Modal */}
      {isModalOpen && (
        <AskQuestionModal
          storeId={storeId}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Question Detail Modal */}
      {selectedQuestionId && data && (
        <QuestionDetailModal
          question={data.questions.find((q) => q._id === selectedQuestionId)!}
          onClose={() => setSelectedQuestionId(null)}
        />
      )}

      {/* Edit Question Modal */}
      {editingQuestionId && data && (
        <EditQuestionModal
          question={data.questions.find((q) => q._id === editingQuestionId)!}
          onClose={() => setEditingQuestionId(null)}
        />
      )}
    </div>
  );
};
