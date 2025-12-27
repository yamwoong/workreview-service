import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getAnswers,
  createAnswer,
  updateAnswer,
  deleteAnswer,
  setBestAnswer,
  likeAnswer,
} from '@/api/question.api';
import type {
  GetQuestionsParams,
  CreateQuestionInput,
  UpdateQuestionInput,
  GetAnswersParams,
  CreateAnswerInput,
  UpdateAnswerInput,
  SetBestAnswerInput,
} from '@/types/question.types';

/**
 * Query keys for questions and answers
 */
export const questionKeys = {
  all: ['questions'] as const,
  lists: () => [...questionKeys.all, 'list'] as const,
  list: (storeId: string, params: GetQuestionsParams) =>
    [...questionKeys.lists(), storeId, params] as const,
  details: () => [...questionKeys.all, 'detail'] as const,
  detail: (id: string) => [...questionKeys.details(), id] as const,
  answers: (questionId: string) => ['answers', questionId] as const,
  answerList: (questionId: string, params: GetAnswersParams) =>
    [...questionKeys.answers(questionId), params] as const,
};

/**
 * Hook to fetch questions for a store
 */
export const useQuestions = (storeId: string, params: GetQuestionsParams = {}) => {
  return useQuery({
    queryKey: questionKeys.list(storeId, params),
    queryFn: () => getQuestions(storeId, params),
    enabled: !!storeId,
  });
};

/**
 * Hook to fetch a single question
 */
export const useQuestion = (questionId: string) => {
  return useQuery({
    queryKey: questionKeys.detail(questionId),
    queryFn: () => getQuestion(questionId),
    enabled: !!questionId,
  });
};

/**
 * Hook to create a question
 */
export const useCreateQuestion = (storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateQuestionInput) => createQuestion(storeId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
    },
  });
};

/**
 * Hook to update a question
 */
export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ questionId, input }: { questionId: string; input: UpdateQuestionInput }) =>
      updateQuestion(questionId, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: questionKeys.detail(variables.questionId) });
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
    },
  });
};

/**
 * Hook to delete a question
 */
export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questionId: string) => deleteQuestion(questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
    },
  });
};

/**
 * Hook to fetch answers for a question
 */
export const useAnswers = (questionId: string, params: GetAnswersParams = {}) => {
  return useQuery({
    queryKey: questionKeys.answerList(questionId, params),
    queryFn: () => getAnswers(questionId, params),
    enabled: !!questionId,
  });
};

/**
 * Hook to create an answer
 */
export const useCreateAnswer = (questionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAnswerInput) => createAnswer(questionId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionKeys.answers(questionId) });
      queryClient.invalidateQueries({ queryKey: questionKeys.detail(questionId) });
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
    },
  });
};

/**
 * Hook to update an answer
 */
export const useUpdateAnswer = (questionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ answerId, input }: { answerId: string; input: UpdateAnswerInput }) =>
      updateAnswer(answerId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionKeys.answers(questionId) });
    },
  });
};

/**
 * Hook to delete an answer
 */
export const useDeleteAnswer = (questionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (answerId: string) => deleteAnswer(answerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionKeys.answers(questionId) });
      queryClient.invalidateQueries({ queryKey: questionKeys.detail(questionId) });
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
    },
  });
};

/**
 * Hook to set best answer
 */
export const useSetBestAnswer = (questionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ answerId, input }: { answerId: string; input: SetBestAnswerInput }) =>
      setBestAnswer(answerId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionKeys.answers(questionId) });
    },
  });
};

/**
 * Hook to like an answer
 */
export const useLikeAnswer = (questionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (answerId: string) => likeAnswer(answerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionKeys.answers(questionId) });
    },
  });
};
