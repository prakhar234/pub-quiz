export interface Question {
    id: string,
    question: string,
    image?: string,
    options: string[],
    active: boolean,
    activateNextQuestion: boolean
}