import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.css']
})
export class MessageBoxComponent implements OnInit {

  @ViewChild('messageBoxModal', {static: false}) modal: ElementRef;
  @Input() messageNotes: any[] = [];
  @Output() onConfirm = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  open() {
    this.modal.nativeElement.style.display = 'block';
  }

  close() {
    this.messageNotes = [];
    this.modal.nativeElement.style.display = 'none';
    this.onConfirm.emit(true);
  }

}
