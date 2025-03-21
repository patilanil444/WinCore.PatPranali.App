import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-pigmy-collection-info',
  templateUrl: './pigmy-collection-info.component.html',
  styleUrls: ['./pigmy-collection-info.component.css']
})
export class PigmyCollectionInfoComponent implements OnInit {

  @Input() uiPigmyCollections:any[] = [];
  @Input() pigmyCollection:number = 0;
  @Input() pigmySubmitted:number = 0;
  @ViewChild('pigmyCollectionModal', {static: false}) modal: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }


  open() {
    this.modal.nativeElement.style.display = 'block';
  }

  
  close() {
    this.modal.nativeElement.style.display = 'none';
  }

}
