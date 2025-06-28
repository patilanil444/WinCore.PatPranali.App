import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CustomerDeclarations } from 'src/app/common/customer-declarations';
import { MemberService } from 'src/app/services/customers/member/member.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-member-search-base',
  templateUrl: './member-search-base.component.html',
  styleUrls: ['./member-search-base.component.css']
})
export class MemberSearchBaseComponent implements OnInit {

  searchForm!: FormGroup;
  uiMemberSearchBy: any[] = [];
  uiMembers: any[] = [];
  keyword = "memberCodeStr";
  @Output() members = new EventEmitter<any>();
  @Input() allowMultiSearch: boolean = true;

  constructor(private _memberService: MemberService, private _sharedService: SharedService,
    private _toastrService: ToastrService) { }

  ngOnInit(): void {
    this.uiMemberSearchBy = CustomerDeclarations.memberSearchBy;
    this.searchForm = new FormGroup({
      searchBy: new FormControl(this.uiMemberSearchBy[1].code, []),
      searchText: new FormControl("", []),
      searchedCustomerId: new FormControl(0, []),
    });
  }

  searchMember() {
    this.uiMembers = [];
    if (this.searchText.value.length > 5) {

      let memberSearchModel = {
        searchBy: this.searchBy.value,
        searchText: this.searchText.value,
        branchCode: this._sharedService.applicationUser.branchId
      };

      this.keyword = this.readSearchCode(this.searchBy.value);

      this._memberService.getMembersOnSearch(memberSearchModel).subscribe((data: any) => {
        if (data != null && data.data.data != null) {
          let members = data.data.data;
          if (members != null && members.length > 0) {
            let tempMembers = members.map((mem: any) => (
              {
                id: mem.memberId,
                memberName: mem.fullName,
                memberCodeStr: mem.memberCodeStr,
                phone: mem.phone,
                aadhar: mem.aadharno,
                shares: mem.numOfShares,
                email: mem.email,
                //joinDate: formatDate(new Date(mem.custOpenDate), 'yyyy-MM-dd', 'en'),
                status: this.getMemberStatus(mem.active)
              }))

            this.uiMembers = tempMembers;
          }
        }
        if (this.allowMultiSearch) {
          this.members.emit(this.uiMembers);
        }
      })
    }
    else {
      //this._toastrService.info('Enter member details to search.', 'Information!');
    }
  }

  /**
   * Maps the search key to the corresponding field name.
   * @param key The search key.
   * @returns The field name to be used for searching.
   */
  readSearchCode(key: string) {
    let value = "";
    switch (key) {
      case "E":
        value = "email";
        break;
      case "C":
        value = "memberCodeStr";
        break;
      case "N":
        value = "memberName";
        break;
      case "A":
        value = "accountNumber";
        break;
      case "P":
        value = "phone";
        break;
      default:
        value = "memberCodeStr";
        break;
    }
    return value;
  }

  selectEvent(member: any) {
    this.keyword = "memberCodeStr";
    this.searchForm.patchValue({
      searchText: member.memberCodeStr,
      searchedMemberId: member.id
    })
    this.members.emit(member);
  }

  onChangeSearch(val: any) {
    this.searchForm.patchValue({
      searchText: val
    })

    this.searchMember();
  }

  getMemberStatus(status: number) {
    if (status == 1) {
      return "Active";
    }
    else {
      return "In-Active";
    }
  }

  clear() {
    this.searchForm.patchValue({
      searchBy: this.uiMemberSearchBy[1].code,
      searchText: ""
    });
  }

  get searchBy() {
    return this.searchForm.get('searchBy')!;
  }
  get searchText() {
    return this.searchForm.get('searchText')!;
  }

}
