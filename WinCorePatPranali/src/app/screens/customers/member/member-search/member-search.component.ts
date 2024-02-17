import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MemberService } from 'src/app/services/customers/member/member.service';

@Component({
  selector: 'app-member-search',
  templateUrl: './member-search.component.html',
  styleUrls: ['./member-search.component.css']
})
export class MemberSearchComponent implements OnInit {

  searchForm!: FormGroup;

  uiMembers:any[] = [];
  p: number = 1;
  total: number = 0;

  constructor(private router: Router, private _toastrService: ToastrService,
    private _memberService: MemberService) { }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      memberNumber: new FormControl("", []),
      memberName: new FormControl("", []),
      memberPhone: new FormControl("", []),
      memberEmail: new FormControl("", [])
    });
  }

  edit(uiMember: any)
  {

  }

  delete(uiMember: any)
  {

  }

  onDelete()
  {

  }

  cancelDelete()
  {

  }

  clear()
  {
    this.searchForm.patchValue({
      memberNumber: "",
      memberName: "",
      memberPhone: "",
      memberEmail: "",
    });
  }

  searchMember()
  {
    this.uiMembers = [];
    if (this.memberNumber.value > 0 || 
     this.memberName.value.length > 0 || 
     this.memberPhone.value.length > 0 || 
     this.memberEmail.value.length > 0) {

     let memberSearchModel = {
       Id: this.memberNumber.value == null || this.memberNumber.value == ""? 0: parseInt(this.memberNumber.value),
       FirstName: this.memberName.value,
       Phone: this.memberPhone.value,
       Email: this.memberEmail.value
     };

     this._memberService.getMembersOnSearch(memberSearchModel).subscribe((data: any) => {
       if (data!=null && data.data.data !=null) {
         let customers = data.data.data;
         if (customers!=null && customers.length>0) {
           this.uiMembers = customers.map((cust: any) => (
             { 
               id: cust.id,
               firstName: cust.firstName,
               middleName: cust.middleName,
               lastName: cust.lastName,
               pan: cust.pan,
               aadhar: cust.aadhar,
               phone: cust.phone,
               status: this.getMemberStatus(cust.status) 
             })) 
         }
       }
     })
    }
    else 
    {
     this._toastrService.info('Enter member details to search.', 'Information!');
    }
  }

  getMemberStatus(status: string)
  {
    if (status=="I") {
      return "In-Active";
    }
    if (status=="A") {
      return "Active";
    }
    if (status=="D") {
      return "Deleted";
    }
    return "";
  }

  addNewMember()
  {
    this.configClick("member");
  }

  pageChangeEvent(event: number) {
    this.p = event;
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/'+ routeValue]);
  }

  get memberNumber() {
    return this.searchForm.get('memberNumber')!;
  }
  get memberName() {
    return this.searchForm.get('memberName')!;
  }
  get memberPhone() {
    return this.searchForm.get('memberPhone')!;
  }
  get memberEmail() {
    return this.searchForm.get('memberEmail')!;
  }

}
