import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PriorityMasterService } from 'src/app/services/masters/priority-master/priority-master.service';
import { SharedService } from 'src/app/services/shared.service';

interface IPriorityServerModel {
  Id: string;
  Name: string;
  FromAmount:number;
  ToAmount:number;
  BranchId:number
}

@Component({
  selector: 'app-priority-form',
  templateUrl: './priority-form.component.html',
  styleUrls: ['./priority-form.component.css']
})
export class PriorityFormComponent {
  priorityForm!: FormGroup;
  id!: string;
  maxId!: string;

  newCode!: string;
  isAddMode!: boolean;

  constructor(private router: Router, private route: ActivatedRoute,
    private _priorityMasterService: PriorityMasterService,
    private _sharedService: SharedService) {

  }

  ngOnInit(): void {

    this.id = this.route.snapshot.params['id'];
    this.maxId = this.route.snapshot.params['maxId'];
    this.isAddMode = !this.id;

    this.priorityForm = new FormGroup({
      code: new FormControl("", []),
      name: new FormControl("", [Validators.required]),
      fromAmount: new FormControl("", [Validators.required]),
      toAmount: new FormControl("", [Validators.required])
    });

    if (!this.isAddMode) {
      this._priorityMasterService.getPriority(parseInt(this.id)).subscribe((data: any) => {
        console.log(data);
        if (data) {
          if (data.statusCode == 200 && data.data.data) {
            var priority = data.data.data;
            this.priorityForm = new FormGroup({
              code: new FormControl(priority.id, []),
              name: new FormControl(priority.name, [Validators.required]),
              fromAmount: new FormControl(priority.fromAmount, [Validators.required]),
              toAmount: new FormControl(priority.toAmount, [Validators.required])
            });
          }
        }
      })
    }
    else
    {
      this.priorityForm.patchValue({
        code: parseInt(this.maxId) + 1
     });
    }
  }

  get name() {
    return this.priorityForm.get('name')!;
  }

  get fromAmount() {
    return this.priorityForm.get('fromAmount')!;
  }

  get toAmount() {
    return this.priorityForm.get('toAmount')!;
  }

  public savePriority(): void {
    if (this.validateForm()) {
      let priorityModel = {} as IPriorityServerModel;

      priorityModel.Name = this.name.value.toString();
      priorityModel.FromAmount = this.fromAmount.value.toString();
      priorityModel.ToAmount = this.toAmount.value.toString();
      priorityModel.BranchId = this._sharedService.applicationUser.branchId;
      console.log(priorityModel);

      if (this.isAddMode) {
        this._priorityMasterService.createPriority(priorityModel).subscribe((data: any) => {
          console.log(data);
          if (data) {
            if (data.statusCode == 200 && data.data.data == 1) {
              this.configClick("priorities");
            }
          }
        })
      }
      else  
      {
        this._priorityMasterService.updatePriority(parseInt(this.id), priorityModel).subscribe((data: any) => {
          console.log(data);
          if (data) {
            if (data.statusCode == 200 && data.data.data == 1) {
              this.configClick("priorities");
            }
          }
        })
      }

    }
  }

  public validateForm(): boolean {

    if (this.priorityForm.invalid) {
      for (const control of Object.keys(this.priorityForm.controls)) {
        this.priorityForm.controls[control].markAsTouched();
      }
      return false;
    }
    return true;
  }

  public clear(): void {
    this.priorityForm = new FormGroup({
      // code: new FormControl("", []),
      name: new FormControl("", [Validators.required]),
      fromAmount: new FormControl("", [Validators.required]),
      toAmount: new FormControl("", [Validators.required])
    });
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/' + routeValue]);
  }
}
