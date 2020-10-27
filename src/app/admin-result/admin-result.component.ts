import { Component, OnInit } from '@angular/core';
import { forkJoin } from "rxjs";

import { Answer } from '../shared/modals/answer.modal';
import { User } from '../shared/modals/user.modal';
import { QuestionsService } from '../shared/services/questions.service';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-admin-result',
  templateUrl: './admin-result.component.html',
  styleUrls: ['./admin-result.component.css']
})
export class AdminResultComponent implements OnInit {

  constructor(private userService: UserService, private questionsService: QuestionsService) { }

  users: User[];
  answers: Answer[];

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

}
