import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Question } from '../shared/modals/question.modal';
import { QuestionsService } from '../shared/services/questions.service';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  constructor() { }

  @Input('questions') questions: Question[];
  @Input('currentQuestion') currentQuestion: number;
  @Input('lastSection') lastSection: boolean;

  @Output() onNextSectionClick = new EventEmitter<boolean>();

  currentQuestionIndex: number = 0;
  lastQuestion: boolean = false;

  ngOnInit(): void {
    if(this.currentQuestion) {
      this.currentQuestionIndex = this.currentQuestion;
    }
  }

  goToNextQuestion() {
    this.currentQuestionIndex++;
    this.questions = this.questions.map((question, index) => {
      question.active = false;
      if(index === this.currentQuestionIndex) {
        question.active = true;
      }
      return question;
    });
    if(this.currentQuestionIndex === this.questions.length - 1) {
      this.lastQuestion = true;
    }
  }

  goToNextSection(lastQuestion) {
    this.onNextSectionClick.emit(lastQuestion);
  }
}
