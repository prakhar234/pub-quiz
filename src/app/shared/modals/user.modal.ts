import { Answer } from './answer.modal';

export interface User {
    name: string,
    email: string,
    id?: string,
    answers: {answer: number, questionId: string}[],
    score?: number
}