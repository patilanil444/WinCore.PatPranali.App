import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GlobleDeclarations } from 'src/app/common/globle-declarations';
import { IGeneralDTO } from 'src/app/common/models/common-ui-models';

@Injectable({
  providedIn: 'root'
})
export class DistrictMasterService {
  serviceBaseURL = "";
  districtIdToDelete = -1;

  constructor(private http: HttpClient) { }

  private dto = new BehaviorSubject<IGeneralDTO>({} as IGeneralDTO);
  setDTO(object: any) {
    this.dto.next(object);
  }
  getDTO() {
    return this.dto.asObservable();
  }


  getDistricts() {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/master/districts", options);
  }

  getDistrict(id: number): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/master/district?id=" + id, options);
  }

  createDistrict(districtModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/master/create-district", districtModel, options);
  }

  updateDistrict(id: number, districtModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/master/update-district?id=" + id, districtModel, options);
  }

  deleteDistrict(id: number): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.delete(GlobleDeclarations.apiBaseURL + "api/master/delete-district?id=" + id, options);
  }
}
