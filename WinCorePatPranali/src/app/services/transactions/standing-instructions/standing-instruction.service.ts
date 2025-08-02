import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { GlobleDeclarations } from 'src/app/common/globle-declarations';
import { IGeneralDTO } from 'src/app/common/models/common-ui-models';

@Injectable({
  providedIn: 'root'
})
export class StandingInstructionService {

  serviceBaseURL = "";

  constructor(private http: HttpClient) { }

  private dto = new BehaviorSubject<IGeneralDTO>({} as IGeneralDTO);
  setDTO(object: any) {
    this.dto.next(object);
  }

  getDTO() {
    return this.dto.asObservable();
  }
  getStandingInstructions(branchCode: number, glId: number, status: number): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/StandingInstruction/standing-instructions?branchCode=" + branchCode + "&glId=" + glId + "&status=" + status, options);
  }

  getStandingInstructionById(branchCode: number, id: number, ): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/StandingInstruction/standing-instruction?branchCode=" + branchCode + "&id=" + id, options);
  }

  getMaxInstructionId(branchId: number): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/StandingInstruction/max-instruction-no?branchCode=" + branchId, options);
  }

  saveStandingInstruction(instructionModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/StandingInstruction/save-standing-instruction", instructionModel, options);
  }

  updateStandingInstructionStatus(instructionModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/StandingInstruction/update-instruction-status", instructionModel, options);
  }

   getDueStandingInstructions(branchCode: number): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/StandingInstruction/due-instructions?branchCode=" + branchCode, options);
  }

  executeStandingInstruction(executeInstructionModel: any): any {
      let options = GlobleDeclarations.getHeaderOptions();
      return this.http.post(GlobleDeclarations.apiBaseURL + "api/StandingInstruction/excute-instructions", executeInstructionModel, options);
  }
}
