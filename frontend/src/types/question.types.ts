/**
 * Question and Answer TypeScript types
 */

export interface IQuestion {
  _id: string;
  store: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  title: string;
  content: string;
  answerCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IAnswer {
  _id: string;
  question: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  content: string;
  likeCount: number;
  isBestAnswer: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Request/Response Types

export interface GetQuestionsParams {
  page?: number;
  limit?: number;
  sort?: 'latest' | 'mostAnswered';
}

export interface GetQuestionsResponse {
  success: true;
  data: {
    questions: IQuestion[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface GetAnswersParams {
  page?: number;
  limit?: number;
  sort?: 'latest' | 'mostLiked';
}

export interface GetAnswersResponse {
  success: true;
  data: {
    answers: IAnswer[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface CreateQuestionInput {
  title: string;
  content: string;
}

export interface CreateQuestionResponse {
  success: true;
  data: IQuestion;
  message?: string;
}

export interface UpdateQuestionInput {
  title?: string;
  content?: string;
}

export interface UpdateQuestionResponse {
  success: true;
  data: IQuestion;
  message?: string;
}

export interface CreateAnswerInput {
  content: string;
}

export interface CreateAnswerResponse {
  success: true;
  data: IAnswer;
  message?: string;
}

export interface UpdateAnswerInput {
  content?: string;
}

export interface UpdateAnswerResponse {
  success: true;
  data: IAnswer;
  message?: string;
}

export interface SetBestAnswerInput {
  isBestAnswer: boolean;
}

export interface SetBestAnswerResponse {
  success: true;
  data: IAnswer;
  message?: string;
}
