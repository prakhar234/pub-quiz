import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminResultComponent } from './admin-result/admin-result.component';
import { AdminComponent } from './admin/admin.component';

import { QuizStartComponent } from './quiz-start/quiz-start.component';

const routes: Routes = [
  {path: '', component: QuizStartComponent},
  {path: 'admin/get-results/get-scores/get-losers/i-am-the-admin', component: AdminResultComponent},
  {path: 'admin/admin-pages/mine/update-questions/login', component: AdminComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
