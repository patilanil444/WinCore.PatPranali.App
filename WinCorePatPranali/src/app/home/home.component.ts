import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../services/shared.service';
import { WorkOperationsService } from '../services/transactions/work-operations/work-operations.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private router: Router, private _toastrService: ToastrService,
    private _sharedService: SharedService, private _workOperationsService: WorkOperationsService) { }

  ngOnInit(): void {

    
  }

 
}
