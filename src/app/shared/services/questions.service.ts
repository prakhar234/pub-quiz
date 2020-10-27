import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

import { Answer } from '../modals/answer.modal';
import { Question } from '../modals/question.modal';
import { Section } from '../modals/section.modal';



@Injectable({
    providedIn: 'root'
})
export class QuestionsService {
    constructor(private http: HttpClient) {}

    sectionsChanged = new Subject<Section[]>();

    private sections: Section[];

    getSections(){
        this.http.get<Section[]>('https://pub-quiz-82982.firebaseio.com/sections.json').subscribe(response => {
            this.sections = response;
            this.sectionsChanged.next(this.sections.slice());
        })
    }

    getAnswers() {
        return this.http.get<Answer[]>('https://pub-quiz-82982.firebaseio.com/answers-i-am-prakhar-shukla-17-09-1989.json');
    }

    saveQuestions(section) {
        return this.http.put<Section>(`https://pub-quiz-82982.firebaseio.com/sections/${section.id}.json`, section);
    }

    getQuestionUpdate(id) {
        const sectionId = id.split("-")[0];
        const questionId = id.split("-")[1];
        return this.http.get<Question>(`https://pub-quiz-82982.firebaseio.com/sections/${sectionId}/questions/${questionId}.json`);
    }

    getSectionUpdate(id) {
        return this.http.get<Section>(`https://pub-quiz-82982.firebaseio.com/sections/${id}.json`);
    }

}