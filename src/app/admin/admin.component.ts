import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Section } from '../shared/modals/section.modal';
import { QuestionsService } from '../shared/services/questions.service';

import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private userService: UserService, private questionsService: QuestionsService) { }

  @ViewChild('f') updateQuestionsForm: NgForm;


  sectionsSubscription: Subscription;
  sections: Section[];

  ngOnInit(): void {
    this.questionsService.getSections();
    this.sectionsSubscription = this.questionsService.sectionsChanged.subscribe(sections => {
      this.sections = sections;
    })
  }

  onSubmit(section) {
    this.questionsService.saveQuestions(section).subscribe(response => {
    })
  }
}
