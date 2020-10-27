import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('f') signupForm: NgForm;
  @Input('emailExists') emailExists: boolean;
  
  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    const user = {
      name: this.signupForm.form.controls.name.value,
      email: this.signupForm.form.controls.email.value,
      answers: []
    }
    this.userService.createUser(user);
  }

}
