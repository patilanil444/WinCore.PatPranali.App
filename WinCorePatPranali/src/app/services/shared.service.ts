import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IGeneralMasterDTO, UiUser } from 'src/app/common/models/common-ui-models';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public applicationUser: UiUser = new UiUser(1, 1, "TempUser");

  public uiAllStates = [];
  public uiAllDistricts = [];
  public uiAllTalukas = [];
  public uiAllVillages = [];
  public uiGLGroups = [];
  public uiTypeOfAccounts = [];
  public uiCurrencies = [];

  public uiAllMasters: any[] = [];

  private apiCount = 0;
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

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

  showLoader()
  {
    if (this.apiCount === 0) {
      this.isLoadingSubject.next(true);
    }
    this.apiCount++;
  }

  hideLoader()
  {
    this.apiCount--;
    if (this.apiCount === 0) {
      this.isLoadingSubject.next(false);
    }
  }

}
