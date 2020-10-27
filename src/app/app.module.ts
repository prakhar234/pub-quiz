import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { QuizComponentComponent } from './quiz-component/quiz-component.component';
import { QuestionsComponent } from './questions/questions.component';
import { QuestionComponent } from './questions/question/question.component';
import { AdminResultComponent } from './admin-result/admin-result.component';
import { QuizStartComponent } from './quiz-start/quiz-start.component';
import { SectionHeaderComponent } from './section-header/section-header.component';
import { AdminComponent } from './admin/admin.component';
import { ResultSectionComponent } from './result-section/result-section.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    QuizComponentComponent,
    QuestionsComponent,
    QuestionComponent,
    AdminResultComponent,
    QuizStartComponent,
    SectionHeaderComponent,
    AdminComponent,
    ResultSectionComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
