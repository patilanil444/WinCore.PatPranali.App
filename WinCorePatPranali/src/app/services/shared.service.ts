import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IGeneralMasterDTO, UiUser } from 'src/app/common/models/common-ui-models';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public applicationUser: UiUser = new UiUser(1, 1);

  public uiAllStates = [];
  public uiAllDistricts = [];
  public uiAllTahshils = [];
  public uiGLGroups = [];
  public uiTypeOfAccounts = [];

  constructor() { }

  bankEmitter = new EventEmitter<any>();

  //DTO - data transfer object is used to transfer data
  //      from one component to another component
  private dto = new BehaviorSubject<IGeneralMasterDTO>({} as IGeneralMasterDTO);
  setDTO(object: any) {
    this.dto.next(object);
  }
  getDTO() {
    return this.dto.asObservable();
  }

}
