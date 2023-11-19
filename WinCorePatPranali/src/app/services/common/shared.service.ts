import { EventEmitter, Injectable } from '@angular/core';
import { UiUser } from 'src/app/common/models/common-ui-models';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public applicationUser:UiUser = new UiUser(1,1);

  public uiAllStates = [];
  public uiAllDistricts = [];
  public uiAllTahshils = [];

  constructor() { }

  bankEmitter = new EventEmitter<any>();
}
