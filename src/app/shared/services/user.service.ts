import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

import { User } from '../modals/user.modal';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) {}

    userLoggedIn = new Subject<User | boolean>();
    userAnswerSaved = new Subject<User>();

    private user: User;

    createUser(userData: User) {
        localStorage.removeItem('time-left');
        localStorage.removeItem('selected-answer');
        this.http.get<User[]>('https://pub-quiz-82982.firebaseio.com/users.json').subscribe(users => {
            let flag = false;
            if(users) {
                const usersList = Object.keys(users).map(userKey => {
                    return users[userKey];
                })
                for(let i = 0; i < usersList.length; i++) {
                    if(usersList[i].email === userData.email) {
                        flag = true;
                        break;
                    }
                }
            }
            
            if(flag) {
                this.userLoggedIn.next(false);
            }
            else {
                this.http.post<{name : string}>('https://pub-quiz-82982.firebaseio.com/users.json', userData).subscribe(response => {
                    userData['id'] = response.name;
                    this.user = {...userData};
                    this.user['activeSection'] = 0;
                    this.user['activeQuestionIndex'] = 0;
                    localStorage.setItem('pub-quiz-user-2020', JSON.stringify(userData));
                    this.userLoggedIn.next({...this.user});
                });
            }
        })
        
    }

    setUserOnLoad(userData: User) {
        this.http.get<User>(`https://pub-quiz-82982.firebaseio.com/users/${userData.id}.json`).subscribe(user => {
            if(user) {
                this.user = userData;
            }
            this.userLoggedIn.next(user);
        })
    }

    saveAnswerForUser(answerData: {answer: number, questionId: string}, lastQuestion?: boolean){
        const user = {...this.user};
        if(!user.answers) {
            user['answers']  = [answerData];
        } else {
            let flag = false;
            user.answers = user.answers.map(answer => {
                if(answerData.questionId === answer.questionId) {
                    flag = true;
                    answer.answer = answerData.answer;
                }
                return answer;
            });
            if(!flag) {
                user.answers.push(answerData);
            }
        }
       

        const id = user.id;
        this.http.put<User>(`https://pub-quiz-82982.firebaseio.com/users/${id}.json`, user).subscribe(response => {
            this.user = {...response};
            localStorage.setItem('pub-quiz-user-2020', JSON.stringify(response));
            this.userAnswerSaved.next();
        })

    }

    getResult() {
        return this.http.get<User[]>('https://pub-quiz-82982.firebaseio.com/users.json');
    }

    getUserResult(id) {
        return this.http.get<User>(`https://pub-quiz-82982.firebaseio.com/users/${id}.json`);
    }

}