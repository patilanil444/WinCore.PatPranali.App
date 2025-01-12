import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-confirm-box',
  templateUrl: './confirm-box.component.html',
  styleUrls: ['./confirm-box.component.css']
})
export class ConfirmBoxComponent implements OnInit {

  @ViewChild('messageBoxModal', {static: false}) modal: ElementRef;
  @Input() messageNote: any = {};
  @Output() onConfirm = new EventEmitter<any>();
  confirmAccount = {};

  constructor() { }

  ngOnInit(): void {

  }

  open(account:any) {
    this.modal.nativeElement.style.display = 'block';
    this.confirmAccount = account;
  }

  close() {
    this.messageNote = {};
    this.modal.nativeElement.style.display = 'none';
  }

  confirm()
  {
    this.messageNote = {};
    this.modal.nativeElement.style.display = 'none';
    this.onConfirm.emit(this.confirmAccount);
  }
}
