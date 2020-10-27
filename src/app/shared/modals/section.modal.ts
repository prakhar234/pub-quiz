import { Question } from './question.modal';

export interface Section {
    active : boolean;
    id: string;
    activateNextSection: boolean;
    name: string;
    description: string;
    questions: Question[];
}