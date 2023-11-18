import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public uiAllStates = [];
  public uiAllDistricts = [];
  public uiAllTahshils = [];

  constructor() { }

  bankEmitter = new EventEmitter<any>();
}
