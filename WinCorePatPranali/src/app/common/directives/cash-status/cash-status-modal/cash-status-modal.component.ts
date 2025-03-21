import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CashStatusComponent } from '../cash-status.component';

@Component({
  selector: 'app-cash-status-modal',
  templateUrl: './cash-status-modal.component.html',
  styleUrls: ['./cash-status-modal.component.css']
})
export class CashStatusModalComponent implements OnInit {

  @ViewChild('cashStatusModal', {static: false}) modal: ElementRef;
  @Input() UserId: number;
  @Input() canLoadData: boolean;
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
