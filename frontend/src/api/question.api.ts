import { AxiosError } from 'axios';
import client from './client';
import type {
  GetQuestionsParams,
  GetQuestionsResponse,
  GetAnswersParams,
  GetAnswersResponse,
  CreateQuestionInput,
  CreateQuestionResponse,
  UpdateQuestionInput,
  UpdateQuestionResponse,
  CreateAnswerInput,
  CreateAnswerResponse,
  UpdateAnswerInput,
  UpdateAnswerResponse,
  SetBestAnswerInput,
  SetBestAnswerResponse,
  IQuestion,
  IAnswer,
} from '@/types/question.types';

const handleRequestError = (error: unknown): never => {
  if (error instanceof AxiosError) {
    if (error.response?.data) {
      throw error.response.data;
    }

    throw new Error(error.message);
  }

  throw error;
};

/**
 * Get questions for a store
 */
export const getQuestions = async (
  storeId: string,
  params?: GetQuestionsParams
): Promise<GetQuestionsResponse['data']> => {
  try {
    const response = await client.get<GetQuestionsResponse>(
      `/stores/${storeId}/questions`,
      { params }
    );
    return response.data.data;
  } catch (error) {
    handleRequestError(error);
  }
};

/**
 * Get question by ID
 */
export const getQuestion = async (questionId: string): Promise<IQuestion> => {
  try {
    const response = await client.get<{ success: true; data: IQuestion }>(
      `/questions/${questionId}`
    );
    return response.data.data;
  } catch (error) {
    handleRequestError(error);
  }
};

/**
 * Create a question
 */
export const createQuestion = async (
  storeId: string,
  input: CreateQuestionInput
): Promise<IQuestion> => {
  try {
    const response = await client.post<CreateQuestionResponse>(
      `/stores/${storeId}/questions`,
      input
    );
    return response.data.data;
  } catch (error) {
    handleRequestError(error);
  }
};

/**
 * Update a question
 */
export const updateQuestion = async (
  questionId: string,
  input: UpdateQuestionInput
): Promise<IQuestion> => {
  try {
    const response = await client.put<UpdateQuestionResponse>(
      `/questions/${questionId}`,
      input
    );
    return response.data.data;
  } catch (error) {
    handleRequestError(error);
  }
};

/**
 * Delete a question
 */
export const deleteQuestion = async (questionId: string): Promise<void> => {
  try {
    await client.delete(`/questions/${questionId}`);
  } catch (error) {
    handleRequestError(error);
  }
};

/**
 * Get answers for a question
 */
export const getAnswers = async (
  questionId: string,
  params?: GetAnswersParams
): Promise<GetAnswersResponse['data']> => {
  try {
    const response = await client.get<GetAnswersResponse>(
      `/questions/${questionId}/answers`,
      { params }
    );
    return response.data.data;
  } catch (error) {
    handleRequestError(error);
  }
};

/**
 * Create an answer
 */
export const createAnswer = async (
  questionId: string,
  input: CreateAnswerInput
): Promise<IAnswer> => {
  try {
    const response = await client.post<CreateAnswerResponse>(
      `/questions/${questionId}/answers`,
      input
    );
    return response.data.data;
  } catch (error) {
    handleRequestError(error);
  }
};

/**
 * Update an answer
 */
export const updateAnswer = async (
  answerId: string,
  input: UpdateAnswerInput
): Promise<IAnswer> => {
  try {
    const response = await client.put<UpdateAnswerResponse>(
      `/answers/${answerId}`,
      input
    );
    return response.data.data;
  } catch (error) {
    handleRequestError(error);
  }
};

/**
 * Delete an answer
 */
export const deleteAnswer = async (answerId: string): Promise<void> => {
  try {
    await client.delete(`/answers/${answerId}`);
  } catch (error) {
    handleRequestError(error);
  }
};

/**
 * Set best answer
 */
export const setBestAnswer = async (
  answerId: string,
  input: SetBestAnswerInput
): Promise<IAnswer> => {
  try {
    const response = await client.patch<SetBestAnswerResponse>(
      `/answers/${answerId}/best`,
      input
    );
    return response.data.data;
  } catch (error) {
    handleRequestError(error);
  }
};

/**
 * Like an answer
 */
export const likeAnswer = async (answerId: string): Promise<IAnswer> => {
  try {
    const response = await client.post<{ success: true; data: IAnswer }>(
      `/answers/${answerId}/like`
    );
    return response.data.data;
  } catch (error) {
    handleRequestError(error);
  }
};
