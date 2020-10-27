import { Component, Input, OnInit } from '@angular/core';
import { Section } from '../shared/modals/section.modal';

@Component({
  selector: 'app-section-header',
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.css']
})
export class SectionHeaderComponent implements OnInit {

  constructor() { }

  @Input() section: Section;

  ngOnInit(): void {
  }

}
