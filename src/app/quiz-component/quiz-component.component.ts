import { style, trigger, state, transition, animate } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Question } from '../shared/modals/question.modal';
import { Section } from '../shared/modals/section.modal';

import { QuestionsService } from "../shared/services/questions.service";

import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-quiz-component',
  templateUrl: './quiz-component.component.html',
  styleUrls: ['./quiz-component.component.css'],
  animations: [
    trigger('section', [
      state('in', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateX(100vw)'
        }),
        animate(500)
      ])
    ])
  ]
})
export class QuizComponentComponent implements OnInit, OnDestroy {

  constructor(private questionsService: QuestionsService, private userService: UserService) { }

  sections: Section[];
  currentSectionIndex: number = 0;
  currentQuestion: number = null;
  lastSection: boolean;
  resultSection: boolean;

  sectionsSubscription: Subscription;
  userAnswerSaved: Subscription;

  ngOnInit(): void {
    this.questionsService.getSections();

    this.sectionsSubscription = this.questionsService.sectionsChanged.subscribe(sections => {

      const user = JSON.parse(localStorage.getItem('pub-quiz-user-2020'));
      let id;
      let sectionId;
      let questionId;
      let activeSection;
      let activeQuestion;
      if(user && user.answers.length) {
        id = user.answers[user.answers.length - 1].questionId;
        sectionId = +id.split("-")[0];
        questionId = +id.split("-")[1];
        if(sections[sectionId].questions.length === questionId + 1) {
          activeSection = sectionId + 1
          activeQuestion = 0;
        } else {
          activeSection = sectionId;
          activeQuestion = questionId + 1;
        }
        const updatedSections = sections.map(section => {
          section.active = false;
          if(section.id === activeSection) {
            section.active = true;
          }
          const questions = section.questions.map((question, index) => {
            question.active = false;
            if(index === activeQuestion && section.id === activeSection) {
              question.active = true;
            }
            return question;
          });
          section.questions = questions;
          return section;
        });
        this.currentSectionIndex = activeSection;
        this.currentQuestion = activeQuestion;
      }

      if(activeSection === sections.length) {
        this.resultSection = true;
      } else {
        this.sections = sections;
      }
    });

  }

  ngOnDestroy() {
    this.sectionsSubscription.unsubscribe();
    localStorage.removeItem('time-left');
        localStorage.removeItem('selected-answer');
  }

  goToNextSection(flag) {
    this.currentSectionIndex++;
    this.sections = this.sections.map((section, index) => {
      section.active = false;

      if(this.currentSectionIndex === index) {
        section.active = true;
        section.questions[0].active = true;
      }

      return section;
    });

    if(this.currentSectionIndex === this.sections.length - 1) {
      this.lastSection = true;
      
    }

    if(flag) {
      this.resultSection = true;
    }
  }

}
