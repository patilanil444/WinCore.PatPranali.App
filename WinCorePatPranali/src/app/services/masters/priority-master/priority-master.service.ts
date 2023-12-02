import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobleDeclarations } from 'src/app/common/globle-declarations';

@Injectable({
  providedIn: 'root'
})
export class PriorityMasterService {
  serviceBaseURL = "";
  constructor(private http: HttpClient) { }

  getPriorities(branchId: number) {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/priority/priorities?branchId=" + branchId, options);
  }

  getPriority(id: number): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/priority/priority?id=" + id, options);
  }

  createPriority(priorityModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/priority/create-priority", priorityModel, options);
  }

  updatePriority(id: number, priorityModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/priority/update-priority?id=" + id, priorityModel, options);
  }

  deletePriority(id: number): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/priority/delete-priority?id=" + id, options);
  }
}
