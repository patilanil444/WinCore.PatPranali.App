import { EventEmitter, Injectable } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BehaviorSubject } from 'rxjs';
import { IGeneralMasterDTO, UiUser } from 'src/app/common/models/common-ui-models';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public applicationUser: UiUser;

  public uiAllStates = [];
  public uiAllDistricts = [];
  public uiAllTalukas = [];
  public uiAllVillages = [];
  public uiGLTypesAndGroups = [];
  public uiTypeOfAccounts = [];
  public uiCurrencies = [];
  public uiDenominatons = [];

  public uiAllMasters: any[] = [];

  private workOperationDate: string;

  private apiCount = 0;
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  datepickerConfig: BsDatepickerConfig;

  constructor(private bsConfig: BsDatepickerConfig) {
    this.datepickerConfig = Object.assign({}, this.bsConfig);
    this.datepickerConfig.dateInputFormat = 'DD-MM-YYYY'; // Date format
    this.datepickerConfig.containerClass = 'theme-dark-blue'; // Custom theme class for datepicker
    this.datepickerConfig.showWeekNumbers = false; // Disable week numbers
    this.datepickerConfig.isAnimated = true; // Enable animation
   }

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

  setWorkOperationDate(openDate: string) {
    this.workOperationDate = openDate;
  }

  getWorkOperationDate() {
    return this.workOperationDate;
  }

  getDatepickerConfig()
  {
    return this.datepickerConfig;
  }

}
