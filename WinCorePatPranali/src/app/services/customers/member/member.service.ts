import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GlobleDeclarations } from 'src/app/common/globle-declarations';
import { IGeneralDTO } from 'src/app/common/models/common-ui-models';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  serviceBaseURL = "";

  memberIdToDelete = -1;
  constructor(private http: HttpClient) { }

  private dto = new BehaviorSubject<IGeneralDTO>({} as IGeneralDTO);
  setDTO(object: any) {
    this.dto.next(object);
  }
  getDTO() {
    return this.dto.asObservable();
  }

  getAllMembers(branchId: number) {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/member/members?branchId=" + branchId, options);
  }

  getMembersOnSearch(memberModel: any) {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/member/search-member", memberModel, options);
  }

  getMember(id: number): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/member/member?id=" + id, options);
  }

  getMaxMemberId(branchId: number): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/member/max-member-id?branchId=" + branchId, options);
  }

  createMember(memberModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/member/create-member", memberModel, options);
  }

  updateMember(id: number, memberModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/member/update-member?id=" + id, memberModel, options);
  }

  deleteMember(id: number): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.delete(GlobleDeclarations.apiBaseURL + "api/member/delete-member?id=" + id, options);
  }


  uploadDocument(uplaodMemberDocument: FormData,): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/member/upload-document", uplaodMemberDocument, options);
  }

  getDirectors(branchId: number) {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/member/directors?branchId=" + branchId, options);
  }
}
