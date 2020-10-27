import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Answer } from '../shared/modals/answer.modal';
import { User } from '../shared/modals/user.modal';

import { QuestionsService } from '../shared/services/questions.service';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-result-section',
  templateUrl: './result-section.component.html',
  styleUrls: ['./result-section.component.css']
})
export class ResultSectionComponent implements OnInit {

  constructor(private userService: UserService, private questionsService: QuestionsService) { }

  users: User[];
  answers: Answer[];
  score: number;
  userProfile: User;

  winners: User[];
  losers: User[];

  ngOnInit(): void {
    
    let users = this.userService.getResult();
    let answers = this.questionsService.getAnswers();

    forkJoin([users, answers]).subscribe(response => {
      const users = Object.keys(response[0]).map(user => {
        return response[0][user];
      });
      this.users = [...users];
      this.answers = [...response[1]];
      this.users = this.users.map((user, index) => {
        let sum = 0;
        user.answers.map((answer, ansIndex) => {
          if(answer.questionId === this.answers[ansIndex].questionIdRef && answer.answer === this.answers[ansIndex].answer) {
            sum++;
          }
        });
        user.score = sum;
        return user;
      });
      this.users.sort((a, b) => {
        return a.score < b.score? 1 : -1
      });
      
    })
  }

  checkResult() {
    const userProfile = JSON.parse(localStorage.getItem('pub-quiz-user-2020'));
    this.score = this.users.find(user => user.id === userProfile.id).score;
    this.userProfile = userProfile;
    this.winners = this.users.slice(0, 3);
    this.losers = this.users.slice(this.users.length - 3);
    
  }

}
