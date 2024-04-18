import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CustomerDeclarations } from 'src/app/common/customer-declarations';
import { IGeneralDTO, UiEnumGeneralMaster } from 'src/app/common/models/common-ui-models';
import { CustomerService } from 'src/app/services/customers/customer/customer.service';
import { SharedService } from 'src/app/services/shared.service';
import { NgxDropdownConfig } from 'ngx-select-dropdown';
import { Router } from '@angular/router';

interface ICustomerModel {
  CustomerId: number;
  BranchCode: number;
  Title: number;
  FName: string;
  MName: string;
  LName: string;
  Phone: string;
  Mobileno: string;
  Mobileno1: string;
  BirthDate: Date;
  CustOpenDate: Date;
  Emailid: string;
  PanNo: string;
  Aadharno: string;
  Gender: number;
  CustGroup: number;
  CustZone: number;
  CustCast: number;
  CustStatus: number;
  Occupation: number;
  MarritalStatus: number;
  Nationality: number;
  Education: number;
  CustCategory: number;
  Religion: number;
  Createdby: string;
  ModifiedBy: string;
  CustomerAddresses: ICustomerAddress[];
  CustomerNominees: ICustomerNominee[];
  Documents: any[];
}

interface ICustomerAddress {
  AddressID: number;
  CustomerId: number;
  Address_Type: number;
  Address: string;
  City: string;
  Taluka: number;
  Dist: number;
  Stateid: number;
  PinCode: string;
  is_Default: number;
  Createdby: string;
  ModifiedBy: string;
}

interface ICustomerNominee {
  Id: number;
  CustomerId: number;
  NomineeName: string;
  NomineeAddress: string;
  BirthDate: Date;
  Relation: number;
  Guardian: string;
  Percentage: number;
  Phone: string;
  Createdby: string;
}


export interface UiAddress {
  id: number,
  customerId: number,
  address: string,
  city: string,
  talukaId: number,
  talukaName: string,
  districtId: string,
  districtName: string,
  stateId: number,
  pincode: string,
  addressTypeId: string,
  addressTypeName: string,
  isDefault: boolean,
  createdby: string,
  modifiedBy: string,
  mstCustomer: {}
}

export interface UiNomini {
  id: number,
  customerId: number,
  srNo: string,
  nomineeName: string,
  nomineeAddress: string,
  birthDate: Date,
  relation: number,
  relationName: string,
  guardian: string,
  active: number,
  percentage: string,
  phone: string,
  createdBy: string,
  modifiedBy: string,
  mstCustomer: {}
}

export interface UiDocument {
  id: number,
  customerId: number,
  documentKey: string,
  documentName: string,
  filePath: string,
  uploadSuccess: false,
  percentDone: 0
}

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent implements OnInit {

  config: NgxDropdownConfig = {
    displayKey: "name",
    height: "auto",
    search: true,
    placeholder: "Select member",
    searchPlaceholder: "Search member by name...",
    limitTo: 0,
    customComparator: undefined,
    noResultsFound: "No results found",
    moreText: "more",
    clearOnSelection: false,
    inputDirection: "ltr",
    enableSelectAll: false,
  };

  personalDetailsForm!: FormGroup;
  addressForm!: FormGroup;
  nominiForm!: FormGroup;
  documentsForm!: FormGroup;

  uiAddressStates: any[] = [];
  uiAllDistricts: any[] = [];
  uiAllTahshils: any[] = [];
  uiAddressDistricts: any[] = [];
  uiAddressTahshils: any[] = [];

  uiNominiStates: any[] = [];
  uiNominiDistricts: any[] = [];
  uiNominiTahshils: any[] = [];

  id!: number;
  maxId!: number;
  newCode!: string;
  isAddMode!: boolean;
  maxDate!: Date;

  masterData: any = {};

  uiGenders: any[] = [];
  uiForm60YN: any[] = [];
  uiForm61YN: any[] = [];
  uiMaritalStatuses: any[] = [];
  uiStatuses: any[] = [];
  uiEducations: any[] = [];
  uiTdsApplicables: any[] = [];
  uiTdsPrintings: any[] = [];
  uiAddressTypes: any[] = [];
  uiCustomerTypes: any[] = [];
  uiTitles: any[] = [];
  uiDocumentTypes: any[] = [];

  p_address: number = 1;
  p_nomini: number = 1;

  total_address: number = 0;
  total_nomini: number = 0;

  maharashtraStateId = 21;

  uiCustomerGroups: any[] = [];
  uiRelations: any[] = [];
  uiOccupations: any[] = [];
  uiCustomerZones: any[] = [];
  uiCastes: any[] = [];
  uiReligions: any[] = [];
  uiNationalities: any[] = [];
  uiCustomerCategories: any[] = [];
  uiAddresses: any[] = [];
  uiNominis: any[] = [];
  uiDocuments: any[] = [];

  //uiMembers: any[] = [];

  dto: IGeneralDTO = {} as IGeneralDTO;


  constructor(private router: Router, private _customerService: CustomerService,
    private _sharedService: SharedService, private _toastrService: ToastrService) { }

  ngOnInit(): void {
    this.maxDate = new Date();

    this.uiGenders = this.retrieveMasters(UiEnumGeneralMaster.GENDER); // CustomerDeclarations.genders;
    this.uiMaritalStatuses = this.retrieveMasters(UiEnumGeneralMaster.MARITIALSTATUS);
    //this.uiStatuses = CustomerDeclarations.statuses;
    this.uiEducations = this.retrieveMasters(UiEnumGeneralMaster.EDUCATION);
    //this.uiTdsApplicables = CustomerDeclarations.tdsApplicables;
    //this.uiTdsPrintings = CustomerDeclarations.tdsPrintings;
    this.uiAddressTypes = this.retrieveMasters(UiEnumGeneralMaster.ADDRESSTYPE);
    this.uiCustomerTypes = CustomerDeclarations.customerTypes;
    this.uiTitles = this.retrieveMasters(UiEnumGeneralMaster.TITLE);
    this.uiDocumentTypes = CustomerDeclarations.documents;
    this.uiCustomerGroups = this.retrieveMasters(UiEnumGeneralMaster.CUSTOMERGROUP);
    this.uiOccupations = this.retrieveMasters(UiEnumGeneralMaster.OCCUPTION);
    this.uiRelations = this.retrieveMasters(UiEnumGeneralMaster.RELATION);
    this.uiCustomerZones = this.retrieveMasters(UiEnumGeneralMaster.ZONE);
    this.uiCastes = this.retrieveMasters(UiEnumGeneralMaster.CASTE);
    this.uiReligions = this.retrieveMasters(UiEnumGeneralMaster.RELIGION);
    this.uiNationalities = this.retrieveMasters(UiEnumGeneralMaster.NATIONALITY);
    this.uiCustomerCategories = this.retrieveMasters(UiEnumGeneralMaster.CATEGORY);

    //this.uiForm60YN = CustomerDeclarations.form60YN;
    //this.uiForm61YN = CustomerDeclarations.form61YN;

    this.personalDetailsForm = new FormGroup({
      customerCode: new FormControl("", []),
      personalTitle: new FormControl(this.uiTitles[0].constantNo, [Validators.required]),
      personalFirstName: new FormControl("", [Validators.required]),
      personalMiddleName: new FormControl("", []),
      personalLastName: new FormControl("", [Validators.required]),
      personalPhone: new FormControl("", []),
      personalMobile: new FormControl("", [Validators.required]),
      personalDateOfBirth: new FormControl("", [Validators.required]),
      personalAge: new FormControl("", []),
      personalOpenDate: new FormControl("", [Validators.required]),
      personalEmail: new FormControl("", [Validators.pattern("[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}")]),
      personalPAN: new FormControl("", [Validators.required]),
      personalAadhar: new FormControl("", [Validators.required]),
      personalGender: new FormControl(this.uiGenders[0].constantNo, [Validators.required]),
      personalCustGroup: new FormControl(this.uiCustomerGroups[0].constantNo, [Validators.required]),
      personalCustZone: new FormControl(this.uiCustomerZones[0].constantNo, [Validators.required]),
      personalCustCaste: new FormControl(this.uiCastes[0].constantNo, []),
      personalCustReligion: new FormControl(this.uiReligions[0].constantNo, []),
      personalOccupation: new FormControl(1, []),
      personalMaritalStatus: new FormControl(this.uiMaritalStatuses[0].constantNo, []),
      personalNationality: new FormControl(this.uiNationalities[0].constantNo, []),
      personalEducation: new FormControl(this.uiEducations[0].constantNo, []),
      personalCustCategory: new FormControl(this.uiCustomerCategories[0].constantNo, [])
    });

    this.addressForm = new FormGroup({
      addressType: new FormControl(this.uiAddressTypes[0].constantNo, [Validators.required]),
      addressText: new FormControl("", [Validators.required]),
      addressCity: new FormControl("", [Validators.required]),
      addressState: new FormControl("", [Validators.required]),
      addressDistrict: new FormControl("", [Validators.required]),
      addressTaluka: new FormControl("", [Validators.required]),
      addressPincode: new FormControl("", [Validators.required]),
      addressDefault: new FormControl(true, []),
    });

    this.nominiForm = new FormGroup({
      nominiName: new FormControl("", [Validators.required]),
      nominiAddress: new FormControl("", [Validators.required]),
      nominiDateOfBirth: new FormControl("", [Validators.required]),
      nominiAge: new FormControl("", []),
      nominiPhone: new FormControl("", [Validators.required]),
      nominiRelation: new FormControl("", [Validators.required]),
      nominiGuardian: new FormControl("", []),
      nominiPercentage: new FormControl("100", [Validators.required]),
    });

    this.documentsForm = new FormGroup({
      documentSelect: new FormControl(this.uiDocumentTypes[0].code, [Validators.required]),
    });

    this.loadForm();
  }

  retrieveMasters(uiEnumGeneralMaster: UiEnumGeneralMaster) {
    let mastersData = this._sharedService.uiAllMasters.filter((m: any) => m.identifier == uiEnumGeneralMaster);
    if (mastersData && mastersData.length) {
      let masters = mastersData.filter((m: any) => m.identifier == uiEnumGeneralMaster);
      return masters[0].codeTables;
    }
    return [];
  }

  loadForm() {
    this.uiAddressStates = this._sharedService.uiAllStates;
    this.uiAllDistricts = this._sharedService.uiAllDistricts;
    this.uiAllTahshils = this._sharedService.uiAllTalukas;

    if (this.uiAddressStates && this.uiAddressStates.length) {
      // set Maharashtra as default state 
      let states = this.uiAddressStates.filter(s => s.id == this.maharashtraStateId);
      if (states && states.length) {
        this.addressForm.patchValue({
          addressState: states[0].id,
        })
      }
    }
    if (this.uiRelations && this.uiRelations.length) {
      this.nominiForm.patchValue({
        nominiRelation: this.uiRelations[0].constantNo,
      })
    }

    if (this.uiAddressStates && this.uiAddressStates.length) {
      let districts = this.uiAllDistricts.filter((d: any) => d.stateId == this.maharashtraStateId);
      if (districts) {
        this.uiAddressDistricts = districts;
        this.addressForm.patchValue({
          addressDistrict: districts[0].id,
        })
      }
    }

    if (this.uiAddressDistricts && this.uiAddressDistricts.length) {
      let tahshils = this.uiAllTahshils.filter((d: any) => d.districtId == this.uiAddressDistricts[0].id);
      if (tahshils) {
        this.uiAddressTahshils = tahshils;
        this.addressForm.patchValue({
          addressTaluka: tahshils[0].id,
        })
      }
    }

    this._customerService.getDTO().subscribe(obj => this.dto = obj);
    if (this.dto) {
      // this.personalDetailsForm.patchValue({
      //   personalGroup: this.uiCustomerGroups[0].id,
      //   personalOccupation: this.uiOccupations[0].id,
      // })

      // this.addressForm.patchValue({
      //   addressState: this.uiAddressStates[0].id,
      //   addressDistrict: this.uiAddressDistricts[0].id,
      //   addressTahsil: this.uiAddressTahshils[0].id,
      // })

      // this.nominiForm.patchValue({
      //   nominiRelation: this.uiRelations[0].id,
      // })

      this.id = this.dto.id;
      if (this.dto.id == 0 || this.dto.id == undefined) {
        // Add Mode
        this.isAddMode = true;

        this._customerService.getMaxCustomerId(this._sharedService.applicationUser.branchId).subscribe((data: any) => {
          let maxCustId = data.data.data;
          this.personalDetailsForm.patchValue({
            customerCode: maxCustId,
            personalOpenDate: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
            personalDateOfBirth: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
            personalAge: this.calculateAge(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
          });

          this.nominiForm.patchValue({
            nominiDateOfBirth: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
            nominiAge: this.calculateAge(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
          });
        });
      }
      else {
        // Edit Mode
        this.isAddMode = false;
        this._customerService.getCustomer(this._sharedService.applicationUser.branchId, this.dto.id).subscribe((data: any) => {
          console.log(data);
          if (data) {
            if (data.statusCode == 200 && data.data.data) {
              var customer = data.data.data;

              this.personalDetailsForm.patchValue({
                customerCode: customer.id,
                personalTitle: customer.title,
                personalFirstName: customer.fName,
                personalMiddleName: customer.mName,
                personalLastName: customer.lName,
                personalPhone: customer.phone,
                personalMobile: customer.mobileno,
                personalDateOfBirth:  formatDate(new Date(customer.birthDate), 'yyyy-MM-dd', 'en'),
                personalAge: this.calculateAge(customer.birthDate),
                personalOpenDate:  formatDate(new Date(customer.custOpenDate), 'yyyy-MM-dd', 'en'),
                personalEmail: customer.emailid,
                personalPAN: customer.panNo,
                personalAadhar: customer.aadharno,
                personalGender: customer.gender,
                personalCustGroup: customer.custGroup,
                personalCustZone: customer.custZone,
                personalCustCaste: customer.custCast,
                personalCustReligion: customer.religion,
                personalOccupation: customer.occupation,
                personalMaritalStatus: customer.marritalStatus,
                personalNationality: customer.nationality,
                personalEducation: customer.education,
                personalCustCategory: customer.custCategory
              });

              if (customer.customerAddresses) {
                customer.customerAddresses.forEach((add: any) => {
                  let uiAddress = {} as UiAddress;

                  let addresssType = this.uiAddressTypes.filter(d => d.constantNo == add.address_Type);
                  let addressTypeName = (addresssType && addresssType.length > 0) ? addresssType[0].constantname : "";

                  let talukas = this.uiAllTahshils.filter(d => d.id == add.taluka);
                  let talukaName = (talukas && talukas.length > 0) ? talukas[0].talukaName : "";

                  let dists = this.uiAllDistricts.filter(d => d.id == add.dist);
                  let distName = (dists && dists.length > 0) ? dists[0].districtName : "";

                  uiAddress.customerId = customer.id;
                  uiAddress.id = add.addressID;
                  uiAddress.address = add.address;
                  uiAddress.city = add.city;
                  uiAddress.talukaId = add.taluka;
                  uiAddress.talukaName = talukaName;
                  uiAddress.districtId = add.dist;
                  uiAddress.districtName = distName;
                  uiAddress.stateId = add.stateid;
                  uiAddress.pincode = add.pinCode;
                  uiAddress.addressTypeId = add.address_Type;
                  uiAddress.addressTypeName = addressTypeName;
                  uiAddress.isDefault = add.is_Default;
                  this.uiAddresses.push(uiAddress);
                });
              }

              if (customer.customerNominees) {
                customer.customerNominees.forEach((nom: any) => {
                  let uiNomini = {} as UiNomini;

                  let relations = this.uiRelations.filter(d => d.constantNo == nom.relation);
                  let relationName = (relations && relations.length > 0) ? relations[0].constantname : "";

                  uiNomini.id = nom.id;
                  uiNomini.customerId = customer.id;
                  uiNomini.srNo = nom.srNo;
                  uiNomini.nomineeName = nom.nomineeName;
                  uiNomini.nomineeAddress = nom.nomineeAddress;
                  uiNomini.birthDate = new Date(nom.birthDate); //formatDate(new Date(nom.birthDate), 'yyyy-MM-dd', 'en');
                  uiNomini.relation = nom.relation;
                  uiNomini.relationName = relationName;
                  uiNomini.guardian = nom.guardian;
                  uiNomini.percentage = nom.percentage;
                  uiNomini.phone = nom.phone;
                  this.uiNominis.push(uiNomini);
                });
              }

              // if (customer.documents) {
              //   customer.documents.forEach((doc: any) => {
              //     let uiDocument = {} as UiDocument;
              //     uiDocument.customerId = this.dto.id;
              //     uiDocument.documentKey = doc.documentKey;
              //     uiDocument.documentName = this.uiDocumentTypes.filter(d => d.code == uiDocument.documentKey)[0].name;
              //     uiDocument.filePath = doc.filePath;
              //     uiDocument.id = doc.id;
              //     this.uiDocuments.push(uiDocument);
              //   });
              // }
            }
          }
        })
      }
    }
  }

  onClick(section: string): void {
    window.location.hash = '';
    window.location.hash = section;
  }

  // selectMember(memberEvent: any) {
  //   if (memberEvent && memberEvent.value.id > 0) {
  //     this.addressForm.patchValue({
  //       personalMember: memberEvent.value.id
  //     });
  //   }
  // }

  calculateAge(dateOfBirth: any) { // birthday is a date
    let currentDate = new Date().getFullYear();
    let dob = new Date(dateOfBirth).getFullYear();
    return Math.abs(currentDate - dob);
  }

  pageAddressChangeEvent(event: number) {
    this.p_address = event;
  }

  onAddressStateChange(event: any) {
    let targetValue = event.target.value;
    let stateId = targetValue.split(":");
    if (stateId) {
      this.uiAddressDistricts = [];
      let districts = this.uiAllDistricts.filter((d: any) => d.stateId == parseInt(stateId[1]));
      if (districts && districts.length) {
        this.uiAddressDistricts = districts;

        // Load taluka
        let talukas = this.uiAllTahshils.filter((d: any) => d.districtId == parseInt(this.uiAddressDistricts[0].id));
        if (talukas && talukas.length) {
          this.uiAddressTahshils = talukas;
        }
        else {
          this.uiAddressTahshils = [];
        }
        this.addressForm.patchValue({
          addressDistrict: this.uiAddressDistricts[0].id,
          addressTaluka: (talukas && talukas.length) ? talukas[0].id : 0
        });
      }
      else {
        this.uiAddressDistricts = [];
        this.uiAddressTahshils = [];
      }
    }

  }

  // onNominiStateChange(event: any) {
  //   let targetValue = event.target.value;
  //   let stateId = targetValue.split(":");
  //   if (stateId) {
  //     this.uiNominiDistricts = [];
  //     let districts = this.uiAllDistricts.filter((d: any) => d.stateId == parseInt(stateId[1]));
  //     if (districts) {
  //       this.uiNominiDistricts = districts;
  //       this.nominiForm.patchValue({
  //         nominiDistrict: this.uiNominiDistricts[0].id
  //       });
  //     }
  //   }
  // }

  onAddressDistrictChange(event: any) {
    let targetValue = event.target.value;
    let districtId = targetValue.split(":");
    if (districtId) {
      this.uiAddressTahshils = [];
      let tahshils = this.uiAllTahshils.filter((d: any) => d.districtId == parseInt(districtId[1]));
      if (tahshils) {
        this.uiAddressTahshils = tahshils;
        this.addressForm.patchValue({
          addressTahsil: this.uiAddressTahshils[0].id
        });
      }
    }
  }

  // onNominiDistrictChange(event: any) {
  //   let targetValue = event.target.value;
  //   let districtId = targetValue.split(":");
  //   if (districtId) {
  //     this.uiNominiTahshils = [];
  //     let tahshils = this.uiAllTahshils.filter((d: any) => d.districtId == parseInt(districtId[1]));
  //     if (tahshils) {
  //       this.uiNominiTahshils = tahshils;
  //       this.nominiForm.patchValue({
  //         nominiTahsil: this.uiNominiTahshils[0].id
  //       });
  //     }
  //   }
  // }

  onPersonalDOBChange(event: any) {
    let targetValue = new Date(event.target.value);
    let age = this.calculateAge(targetValue);
    if (age > -1) {
      //this.personalAge.setValue(Math.round(age));
      this.personalDetailsForm.patchValue({
        personalAge: age
      });
    }
    else {
      this.personalDetailsForm.patchValue({
        personalAge: 0
      });
    }
  }

  onNominDOBChange(event: any) {
    let targetValue = new Date(event.target.value);
    let age = this.calculateAge(targetValue);
    if (age > -1) {
      //this.nominiAge.setValue(Math.round(age));
      this.nominiForm.patchValue({
        nominiAge: age
      });
    }
    else {
      this.nominiForm.patchValue({
        nominiAge: 0
      });
    }
  }

  validPersonalDetailsForm() {
    if (this.personalDetailsForm.invalid) {
      for (const control of Object.keys(this.personalDetailsForm.controls)) {
        this.personalDetailsForm.controls[control].markAsTouched();
      }
      return false;
    }
    return true;
  }

  validAddressForm() {
    if (this.addressForm.invalid) {
      for (const control of Object.keys(this.addressForm.controls)) {
        this.addressForm.controls[control].markAsTouched();
      }
      return false;
    }
    return true;
  }

  validNominiForm() {
    if (this.nominiForm.invalid) {
      for (const control of Object.keys(this.nominiForm.controls)) {
        this.nominiForm.controls[control].markAsTouched();
      }
      return false;
    }
    return true;
  }

  validDocumentsForm() {
    if (this.documentsForm.invalid) {
      for (const control of Object.keys(this.documentsForm.controls)) {
        this.documentsForm.controls[control].markAsTouched();
      }
      return false;
    }
    return true;
  }

  saveCustomer() {
    if (!this.validPersonalDetailsForm()) {
      this._toastrService.error('Personal details has errors.', 'Error!');
      return;
    }
    if (this.uiAddresses.length == 0) {
      this._toastrService.error('Please add address.', 'Error!');
      return;
    }
    if (this.uiNominis.length == 0) {
      this._toastrService.error('Please add nomini.', 'Error!');
      return;
    }
    if (!this.validDocumentsForm()) {
      this._toastrService.error('Please add documents.', 'Error!');
      return;
    }

    let customerModel = {} as ICustomerModel;
    customerModel.CustomerId = this.dto.id;
    customerModel.BranchCode = this._sharedService.applicationUser.branchId;
    customerModel.Title = this.personalTitle.value.toString();
    customerModel.FName = this.personalFirstName.value.toString();
    customerModel.MName = this.personalMiddleName.value.toString();
    customerModel.LName = this.personalLastName.value.toString();
    customerModel.Phone = this.personalPhone.value.toString();
    customerModel.Mobileno = this.personalMobile.value.toString();
    customerModel.Mobileno1 = this.personalMobile.value.toString();
    customerModel.BirthDate = this.personalDateOfBirth.value.toString();
    customerModel.CustOpenDate = this.personalOpenDate.value.toString();
    customerModel.Emailid = this.personalEmail.value.toString();
    customerModel.PanNo = this.personalPAN.value.toString();
    customerModel.Aadharno = this.personalAadhar.value.toString();
    customerModel.Gender = this.personalGender.value.toString();
    customerModel.CustGroup = this.personalCustGroup.value.toString();
    customerModel.CustZone = this.personalCustZone.value.toString();
    customerModel.CustCast = this.personalCustCaste.value.toString();
    //customerModel.CustStatus = this.personalCustCaste.value.toString();
    customerModel.Occupation = this.personalOccupation.value.toString();
    customerModel.MarritalStatus = this.personalMaritalStatus.value.toString();
    customerModel.Nationality = this.personalNationality.value.toString();
    customerModel.Education = this.personalEducation.value.toString();
    customerModel.CustCategory = this.personalCustCategory.value.toString();
    customerModel.Religion = this.personalCustReligion.value.toString();
    customerModel.Createdby = this._sharedService.applicationUser.userName;
    customerModel.ModifiedBy = this._sharedService.applicationUser.userName;

    let customerAddress = {} as ICustomerAddress;
    customerModel.CustomerAddresses = [];
    this.uiAddresses.forEach(add => {
      customerAddress = {} as ICustomerAddress;
      customerAddress.AddressID =  add.id;
      customerAddress.CustomerId = add.customerId;
      customerAddress.Address_Type = add.addressTypeId;
      customerAddress.Address = add.address;
      customerAddress.City = add.city;
      customerAddress.Taluka = add.talukaId;
      customerAddress.Dist = add.districtId;
      customerAddress.Stateid = add.stateId;
      customerAddress.Createdby = add.createdby;
      customerAddress.ModifiedBy = add.modifiedBy;
      customerAddress.is_Default = add.isDefault ? 1 : 0;
      customerAddress.PinCode = add.pincode;
      customerModel.CustomerAddresses.push(customerAddress);
    });

    let customerNomini = {} as ICustomerNominee;
    customerModel.CustomerNominees = [];
    this.uiNominis.forEach(nom => {
      customerNomini = {} as ICustomerNominee;
      customerNomini.Id =  nom.id;
      customerNomini.CustomerId = nom.customerId;
      customerNomini.BirthDate = nom.birthDate;
      customerNomini.NomineeAddress = nom.nomineeAddress;
      customerNomini.NomineeName = nom.nomineeName;
      customerNomini.Createdby = nom.createdBy;
      customerNomini.Percentage = nom.percentage;
      customerNomini.Phone = nom.phone;
      customerNomini.Relation = nom.relation;
      customerNomini.Guardian = nom.guardian;
      customerModel.CustomerNominees.push(customerNomini);
    });

    customerModel.Documents = this.uiDocuments;
    console.log(customerModel);

    this._customerService.saveCustomer(customerModel).subscribe((data: any) => {
      console.log(data);
      if (data) {
        if (data.data.data && data.data.data.retId > 0) {
          this._toastrService.success('Customer saved.', 'Success!');
          this.clear();
          this.loadForm();
        }
      }
    })


    if (this.isAddMode) {

    }
    else {
      // this._customerService.updateCustomer(customerModel.Id, customerModel).subscribe((data: any) => {
      //   console.log(data);
      //   if (data) {
      //     if (data.statusCode == 200 && data.data.data > 0) {
      //       this._toastrService.success('Customer updated.', 'Success!');
      //       this.clear();
      //       this.loadForm();
      //     }
      //   }
      // })
    }
  }

  clear() {
    this.clearPersonalDetails();
    this.clearAddress();
    this.clearNomini();
    this.clearDocuments();
  }

  searchCustomer() {
    this.configClick("customer-search");
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/' + routeValue]);
  }

  clearPersonalDetails() {
    this.personalDetailsForm.patchValue({
      customerCode: 0,
      personalTitle: this.uiTitles[0].constantNo,
      personalFirstName: "",
      personalMiddleName: "",
      personalLastName: "",
      personalPhone: "",
      personalMobile: "",
      personalDateOfBirth: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
      personalAge: this.calculateAge(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
      personalOpenDate: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
      personalEmail: "",
      personalPAN: "",
      personalAadhar: "",
      personalGender: this.uiGenders[0].constantNo,
      personalCustGroup: this.uiCustomerGroups[0].constantNo,
      personalCustZone: this.uiCustomerZones[0].constantNo,
      personalCustCaste: this.uiCastes[0].constantNo,
      personalCustReligion: this.uiReligions[0].constantNo,
      personalOccupation: this.uiOccupations[0].constantNo,
      personalMaritalStatus: this.uiMaritalStatuses[0].constantNo,
      personalNationality: this.uiNationalities[0].constantNo,
      personalEducation: this.uiEducations[0].constantNo,
      personalCustCategory: this.uiCustomerCategories[0].constantNo
    });
  }


  addAddress() {
    if (this.validAddressForm()) {
      let addressTypeName = "";
      let districtName = "";
      let talukaName = "";
      // Find corresponding state
      let addresssType = this.uiAddressTypes.filter(d => d.constantNo == this.addressType.value.toString());
      addressTypeName = (addresssType && addresssType.length) ? addresssType[0].constantname : "";

      let district = this.uiAllDistricts.filter(d => d.id == this.addressDistrict.value.toString());
      districtName = (district && district.length) ? district[0].districtName : "";

      let taluka = this.uiAllTahshils.filter(d => d.id == this.addressTaluka.value.toString());
      talukaName = (taluka && taluka.length) ? taluka[0].talukaName : "";

      let addressIndex = this.uiAddresses.findIndex(add => add.addressTypeId == this.addressType.value.toString());
      if (addressIndex > -1) {
        // update old
        let uiAddress = this.uiAddresses[addressIndex];

        uiAddress.customerId = this.dto.id;
        uiAddress.address = this.addressText.value.toString();
        uiAddress.city = this.addressCity.value.toString();
        uiAddress.talukaId = this.addressTaluka.value.toString();
        uiAddress.talukaName = talukaName;
        uiAddress.districtId = this.addressDistrict.value.toString();
        uiAddress.districtName = districtName;
        uiAddress.stateId = this.addressState.value.toString();
        uiAddress.pincode = this.addressPincode.value.toString();
        uiAddress.addressTypeId = this.addressType.value.toString();
        uiAddress.addressTypeName = addressTypeName;
        uiAddress.isDefault = true;
        uiAddress.createdby = this._sharedService.applicationUser.userName;
        uiAddress.modifiedBy = this._sharedService.applicationUser.userName;

      }
      else {
        // add new
        let uiAddress = {} as UiAddress;
        uiAddress.id = 0;
        uiAddress.customerId = this.dto.id;
        uiAddress.address = this.addressText.value.toString();
        uiAddress.city = this.addressCity.value.toString();
        uiAddress.talukaId = this.addressTaluka.value.toString();
        uiAddress.talukaName = talukaName;
        uiAddress.districtId = this.addressDistrict.value.toString();
        uiAddress.districtName = districtName;
        uiAddress.stateId = this.addressState.value.toString();
        uiAddress.pincode = this.addressPincode.value.toString();
        uiAddress.addressTypeId = this.addressType.value.toString();
        uiAddress.addressTypeName = addressTypeName;
        uiAddress.isDefault = true;
        uiAddress.createdby = this._sharedService.applicationUser.userName;
        uiAddress.modifiedBy = this._sharedService.applicationUser.userName;

        this.uiAddresses.push(uiAddress);
      }
    }
  }

  editAddress(uiAddress: any, index: number) {
    // Bind Districts
    if (uiAddress.stateId > 0) {
      let districts = this.uiAllDistricts.filter(d => d.stateId == uiAddress.stateId);
      this.uiAddressDistricts = districts;
    }
    // Bind Tahsils
    if (uiAddress.districtId > 0) {
      let tahsils = this.uiAllTahshils.filter(d => d.districtId == uiAddress.districtId);
      this.uiAddressTahshils = tahsils;
    }

    this.addressForm.patchValue({
      addressType: parseInt(uiAddress.addressTypeId),
      addressText: uiAddress.address,
      addressCity: uiAddress.city,
      addressState: parseInt(uiAddress.stateId),
      addressDistrict: parseInt(uiAddress.districtId),
      addressTaluka: parseInt(uiAddress.talukaId),
      addressPincode: uiAddress.pincode,
      addressDefault: uiAddress.isDefault
    });
  }

  deleteAddress(uiAddress: any, index: number) {
    this.uiAddresses.splice(index, 1);
  }

  clearAddress() {
    this.addressForm.patchValue({
      addressType: this.uiAddressTypes[0].constantNo,
      addressText: "",
      addressCity: "",
      addressState: this.uiAddressStates[0].id,
      addressDistrict: "",
      addressTaluka: "",
      addressPincode: "",
      addressDefault: true,
    });
  }



  addNomini() {
    if (this.validNominiForm()) {

      // Check existing nomini with name and relation
      let nominiIndex = this.uiNominis.findIndex(nomini =>
        nomini.nomineeName.toLowerCase() == this.nominiName.value.toLowerCase());

      let totalPercentage = this.uiNominis.reduce((sum, nomini) => sum + parseInt(nomini.percentage), 0);
      if (nominiIndex > -1) {
        totalPercentage = totalPercentage - this.uiNominis[nominiIndex].percentage;
      }
      if (totalPercentage == 100) {
        this._toastrService.warning('Total percentage for nomini exceeded.', 'Warning!');
        return;
      }

      let relationName = "";
      let uiRelation = this.uiRelations.filter(r => r.constantNo == parseInt(this.nominiRelation.value.toString()));
      if (uiRelation) {
        relationName = (uiRelation && uiRelation.length > 0)? uiRelation[0].constantname : "";
      }

      if (nominiIndex > -1) {
        let uiNomini = this.uiNominis[nominiIndex];

        //uiNomini.id = 0;
        uiNomini.customerId = this.dto.id;
        uiNomini.srNo = 0;
        uiNomini.nomineeName = this.nominiName.value.toString();
        uiNomini.nomineeAddress = this.nominiAddress.value.toString();
        uiNomini.birthDate = this.nominiDateOfBirth.value.toString();
        uiNomini.relation = this.nominiRelation.value.toString();
        uiNomini.relationName = relationName;
        uiNomini.guardian = this.nominiGuardian.value.toString();
        uiNomini.percentage = this.nominiPercentage.value.toString();
        uiNomini.phone = this.nominiPhone.value.toString();
        uiNomini.createdBy = this._sharedService.applicationUser.userName;
        uiNomini.modifiedBy = this._sharedService.applicationUser.userName;
      }
      else {
        let uiNomini = {} as UiNomini;
        uiNomini.id = 0;
        uiNomini.nomineeName = this.nominiName.value.toString();
        uiNomini.nomineeAddress = this.nominiAddress.value.toString();
        uiNomini.birthDate = this.nominiDateOfBirth.value.toString();
        uiNomini.relation = this.nominiRelation.value.toString();
        uiNomini.relationName = relationName;
        uiNomini.guardian = this.nominiGuardian.value.toString();
        uiNomini.percentage = this.nominiPercentage.value.toString();
        uiNomini.phone = this.nominiPhone.value.toString();
        uiNomini.createdBy = this._sharedService.applicationUser.userName;
        uiNomini.modifiedBy = this._sharedService.applicationUser.userName;

        this.uiNominis.push(uiNomini);
      }
    }
  }

  editNomini(uiNomini: any, index: number) {
    this.nominiForm.patchValue({
      nominiName: uiNomini.nomineeName,
      nominiAddress: uiNomini.nomineeAddress,
      nominiDateOfBirth: formatDate(uiNomini.birthDate, 'yyyy-MM-dd', 'en'),
      nominiAge:this.calculateAge(formatDate(uiNomini.birthDate, 'yyyy-MM-dd', 'en')),
      nominiPhone: uiNomini.phone,
      nominiRelation: parseInt(uiNomini.relation),
      nominiGuardian: uiNomini.guardian,
      nominiPercentage: uiNomini.percentage
    });
  }

  deleteNomini(uiNomini: any, index: number) {
    this.uiNominis.splice(index, 1);
  }

  clearNomini() {
    this.nominiForm.patchValue({
      nominiName: "",
      nominiAddress: "",
      nominiDateOfBirth: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
      nominiAge: this.calculateAge(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
      nominiPhone: "",
      nominiRelation: this.uiRelations[0].constantNo,
      nominiGuardian: "",
      nominiPercentage: "100",
    });
  }



  addDocument() {

    let documentIndex = this.uiDocuments.findIndex(d => d.documentKey == this.documentSelect.value.toString());
    if (documentIndex > -1) {
      this._toastrService.error('Document already exists.', 'Error!');
      return;
    }
    let uiDocument = {} as UiDocument;
    uiDocument.customerId = parseInt(this.customerCode.value);
    uiDocument.documentKey = this.documentSelect.value.toString();
    uiDocument.documentName = this.uiDocumentTypes.filter(d => d.code == uiDocument.documentKey)[0].name;
    uiDocument.filePath = "";
    uiDocument.id = 0;
    uiDocument.uploadSuccess = false;
    uiDocument.percentDone = 0;
    this.uiDocuments.push(uiDocument);

  }

  deleteDocument(index: number) {
    // Add confirmation 
    this.uiDocuments.splice(index, 1);
  }

  clearDocuments() {
    this.uiDocuments = [];
  }

  uploadDocument(event: any, index: number, documentKey: string) {
    this.uploadAndProgressSingle(event.target.files[0], index, documentKey);
  }

  uploadAndProgressSingle(file: File, index: number, documentKey: string) {
    let formData = new FormData();
    formData.append('documentName', file.name);
    formData.append('documentKey', documentKey);
    formData.append('customerId', this.customerCode.value);
    formData.append('postedDocument', file);

    this._customerService.uploadDocument(formData).subscribe((data: any) => {
      let result = data.data.data;
      if (result.includes(file.name)) {
        this.uiDocuments[index].uploadSuccess = true;
        this.uiDocuments[index].percentDone = 100;
      }

      this.uiDocuments[index].filePath = file.name;
    });
  }

  ///Customer


  ///

  /// Personal
  get customerCode() {
    return this.personalDetailsForm.get('customerCode')!;
  }
  get personalTitle() {
    return this.personalDetailsForm.get('personalTitle')!;
  }
  get personalFirstName() {
    return this.personalDetailsForm.get('personalFirstName')!;
  }
  get personalMiddleName() {
    return this.personalDetailsForm.get('personalMiddleName')!;
  }
  get personalLastName() {
    return this.personalDetailsForm.get('personalLastName')!;
  }
  get personalPhone() {
    return this.personalDetailsForm.get('personalPhone')!;
  }
  get personalMobile() {
    return this.personalDetailsForm.get('personalMobile')!;
  }
  get personalDateOfBirth() {
    return this.personalDetailsForm.get('personalDateOfBirth')!;
  }
  get personalAge() {
    return this.personalDetailsForm.get('personalAge')!;
  }
  get personalOpenDate() {
    return this.personalDetailsForm.get('personalOpenDate')!;
  }
  get personalEmail() {
    return this.personalDetailsForm.get('personalEmail')!;
  }
  get personalPAN() {
    return this.personalDetailsForm.get('personalPAN')!;
  }
  get personalAadhar() {
    return this.personalDetailsForm.get('personalAadhar')!;
  }
  get personalGender() {
    return this.personalDetailsForm.get('personalGender')!;
  }
  get personalCustGroup() {
    return this.personalDetailsForm.get('personalCustGroup')!;
  }
  get personalCustZone() {
    return this.personalDetailsForm.get('personalCustZone')!;
  }
  get personalCustCaste() {
    return this.personalDetailsForm.get('personalCustCaste')!;
  }
  get personalCustReligion() {
    return this.personalDetailsForm.get('personalCustReligion')!;
  }
  get personalOccupation() {
    return this.personalDetailsForm.get('personalOccupation')!;
  }
  get personalMaritalStatus() {
    return this.personalDetailsForm.get('personalMaritalStatus')!;
  }
  get personalNationality() {
    return this.personalDetailsForm.get('personalNationality')!;
  }
  get personalEducation() {
    return this.personalDetailsForm.get('personalEducation')!;
  }
  get personalCustCategory() {
    return this.personalDetailsForm.get('personalCustCategory')!;
  }
  ///
  /// Address

  get addressType() {
    return this.addressForm.get('addressType')!;
  }
  get addressText() {
    return this.addressForm.get('addressText')!;
  }
  get addressCity() {
    return this.addressForm.get('addressCity')!;
  }
  get addressState() {
    return this.addressForm.get('addressState')!;
  }
  get addressDistrict() {
    return this.addressForm.get('addressDistrict')!;
  }
  get addressTaluka() {
    return this.addressForm.get('addressTaluka')!;
  }
  get addressPincode() {
    return this.addressForm.get('addressPincode')!;
  }
  get addressDefault() {
    return this.addressForm.get('addressDefault')!;
  }

  ///
  /// Nomini

  get nominiName() {
    return this.nominiForm.get('nominiName')!;
  }
  get nominiAddress() {
    return this.nominiForm.get('nominiAddress')!;
  }
  get nominiDateOfBirth() {
    return this.nominiForm.get('nominiDateOfBirth')!;
  }
  get nominiAge() {
    return this.nominiForm.get('nominiAge')!;
  }
  get nominiPhone() {
    return this.nominiForm.get('nominiPhone')!;
  }
  get nominiRelation() {
    return this.nominiForm.get('nominiRelation')!;
  }
  get nominiGuardian() {
    return this.nominiForm.get('nominiGuardian')!;
  }
  get nominiPercentage() {
    return this.nominiForm.get('nominiPercentage')!;
  }
  /// 

  /// Document
  get documentSelect() {
    return this.documentsForm.get('documentSelect')!;
  }

  ///

}
