import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GlobleDeclarations } from 'src/app/common/globle-declarations';
import { IGeneralDTO } from 'src/app/common/models/common-ui-models';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  serviceBaseURL = "";
  agentIdToDelete = -1;

  CollectionAccountToDelete = -1;

  constructor(private http: HttpClient) { }

  private dto = new BehaviorSubject<IGeneralDTO>({} as IGeneralDTO);
  setDTO(object: any) {
    this.dto.next(object);
  }
  getDTO() {
    return this.dto.asObservable();
  }

  getDocumentTypes() {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/Document/get-document-types", options);
  }

  getDocumentMasters() {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/Document/get-document-masters", options);
  }


  getDocument(documentId: number) {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/Document/get-document?documentId=" + documentId, options);
  }

  getAgent(branchCode: number, agentId: number) {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/PigmyMaster/agent?branchCode =" + branchCode + "&agentId=" + agentId, options);
  }


  saveDocument(documentModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/Document/save-document", documentModel, options);
  }


  deleteDocument(documentModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/Document/delete-document", documentModel, options);
  }

  getDocumentByDocumentNo(documentNo: string, documentMasterId: number): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/Document/get-documents-by-documentNo?documentNo=" + documentNo + "&documentMasterId=" + documentMasterId, options);
  }

  getDocumentsByEntityId(entityId: number, entityTypeId: number): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/Document/get-entity-documents?entityId=" + entityId + "&entityTypeId=" + entityTypeId, options);
  }

}
