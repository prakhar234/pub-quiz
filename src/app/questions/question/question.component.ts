import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { style, trigger, state, transition, animate } from '@angular/animations';
import { Subscription } from 'rxjs';

import { Question } from 'src/app/shared/modals/question.modal';
import { QuestionsService } from 'src/app/shared/services/questions.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
  animations: [
    trigger('question', [
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
      ]),
      transition('* => void', [
        style({
          opacity: 0,
          transform: 'translateX(-100vw)'
        }),
        animate(500)
      ])
    ])
  ]
})
export class QuestionComponent implements OnInit, OnDestroy {

  constructor(private userService: UserService, private questionsService: QuestionsService) { }
  @Input() question: Question;
  @Input() lastQuestion: boolean;
  @Input() lastSection: boolean;
  @Input() disableCurrentQuestion: boolean;

  @Output() onNextQuestion = new  EventEmitter<void>();
  @Output() onNextSection = new  EventEmitter<boolean>();

  disabled: boolean = false;
  selectedAnswer: number = null;
  answerSavedSubscription: Subscription;
  answerSaved: boolean = false;
  timeLeft: number = 45;
  interval: any;
  timeInterval: any;
  questionNumber: number;
  activateNextSection: boolean;

  
  ngOnInit(): void {
    const questionNumber = +this.question.id.split("-")[1] + 1;
    this.questionNumber = questionNumber;

    const timeLeft = localStorage.getItem('time-left');
    let selectedAnswer = localStorage.getItem('selected-answer');

    if(selectedAnswer ===  "null") {
      selectedAnswer = null;
    }

    if(selectedAnswer !== null) {
      this.selectedAnswer = +selectedAnswer;
    }
    if(timeLeft) {
      this.timeLeft = +timeLeft;
    }
    this.timeInterval = setInterval(() => {
      if(this.timeLeft === 0 && this.selectedAnswer === null) {
        this.selectedAnswer = 4;
        this.onSubmit();
        return;
      }
      if(this.selectedAnswer !== null && this.timeLeft === 0 && !this.answerSaved) {
        localStorage.setItem('selected-answer', this.selectedAnswer + "");
        this.onSubmit();
        return;
      }
      this.timeLeft--;
      localStorage.setItem('time-left', this.timeLeft + "");
      localStorage.setItem('selected-answer', this.selectedAnswer + "");
    },1000);
   
    this.answerSavedSubscription = this.userService.userAnswerSaved.subscribe(() => {
      this.interval = setInterval(() => {
        if(this.lastQuestion) {
          const id = +this.question.id.split("-")[0];
          this.questionsService.getSectionUpdate(id).subscribe(response => {
            if(response.activateNextSection) {
              this.activateNextSection = true;
              this.handleClearInterval();
            }
          })
        } else {
          this.questionsService.getQuestionUpdate(this.question.id).subscribe(response => {
            if(response.activateNextQuestion) {
              this.question = response;
              this.handleClearInterval();
            }
          })
        }
      }, 5000);
      this.answerSaved = true;
    });
  }

  ngOnDestroy() {
    this.answerSavedSubscription.unsubscribe();
    
  }

  onSubmit(){
    this.disabled = true;
    const answerData = {
      answer: this.selectedAnswer,
      questionId: this.question.id
    };
    this.userService.saveAnswerForUser(answerData, this.lastQuestion);
    localStorage.removeItem('time-left');
    localStorage.removeItem('selected-answer');
    this.handleClearTimeInterval();

  }

  handleClearInterval() {
    clearInterval(this.interval);
  }

  handleClearTimeInterval() {
    this.timeLeft = 0;
    clearInterval(this.timeInterval);
  }

  onSelectAnswer(answer: number) {
    if(!this.disabled) {
      this.selectedAnswer = answer;
      localStorage.setItem('selected-answer', this.selectedAnswer + "");
    }
  }

  goToNextSection() {
    if(this.lastSection){
      this.onNextSection.emit(true);
    }
    this.onNextSection.emit(false);
  }

  goToNextQuestion(){
    this.onNextQuestion.emit();
  }


}
