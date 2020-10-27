import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-quiz-start',
  templateUrl: './quiz-start.component.html',
  styleUrls: ['./quiz-start.component.css']
})
export class QuizStartComponent implements OnInit, OnDestroy {

  constructor(private userService: UserService){}

  showLogin: boolean = false;
  showQuiz: boolean = false;
  emailExists: boolean = false;
  userLoginSubscription: Subscription;

  ngOnInit(): void {
    this.userLoginSubscription = this.userService.userLoggedIn.subscribe(user => {
      if(user) {
        this.showLogin = false;
        this.showQuiz = true;
        this.emailExists = false;
      } else {
        this.showLogin = true;
        if(user === false) {
          this.emailExists = true;
        }
        this.showQuiz = false;
        localStorage.removeItem('pub-quiz-user-2020');
      }
      
    });

    const userData = JSON.parse(localStorage.getItem('pub-quiz-user-2020'));
    if(userData) {
      this.userService.setUserOnLoad(userData);
    } else {
      this.showLogin = true;
      localStorage.removeItem('time-left');
      localStorage.removeItem('selected-answer');
    }
  }

  ngOnDestroy() {
    this.userLoginSubscription.unsubscribe();
  }

}
