import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CustomerDeclarations } from 'src/app/common/customer-declarations';
import { IGeneralDTO, UiEnumGeneralMaster } from 'src/app/common/models/common-ui-models';
import { CustomerService } from 'src/app/services/customers/customer/customer.service';
import { SharedService } from 'src/app/services/shared.service';
import { GeneralMasterService } from 'src/app/services/masters/general-master/general-master.service';
import { Router } from '@angular/router';
import { MemberService } from 'src/app/services/customers/member/member.service';
import { NgxDropdownConfig } from 'ngx-select-dropdown';

interface ICustomerModel {
  Id: number;
  Title: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  Gender: string;
  CustomerGroupId: number;
  CustomerType: string;
  OccupationId: number;
  MaritalStatus: string;
  DateOfBirth: Date;
  PAN: string;
  Aadhar: string;
  Phone: string;
  Email: string;
  Education: string;
  TDSApplicable: string;
  TDSPrinting: string;
  TDSRate: number;
  Form60: string;
  Form61: string;
  MemberId: number;
  Status: string;
  BranchId: number;
  Addresses: any[];
  Nominis: any[];
  Documents: any[];

}

export interface UiAddress {
  id: number,
  customerId: number,
  addressType: string,
  addressTypeName: string,
  address: string,
  street: string,
  landmark: string,
  city: string,
  tahshilId: number,
  tahsilName: string,
  districtId: string,
  districtName: string,
  pincode: string,
}

export interface UiNomini {
  id: number,
  customerId: number,
  title: string,
  firstName: string,
  middleName: string,
  lastName: string,
  relationId: number,
  relationName: string,
  guardian: string,
  percentage: string,
  dateOfBirth: string,
  address: string,
  street: string,
  city: string,
  tahshilId: number,
  tahshilName: string,
  districtId: number,
  districtName: string,
  pincode: string,
  phone: string,
  email: string,
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

  customerForm!: FormGroup;
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

  uiCustomerGroups: any[] = [];
  uiRelations: any[] = [];
  uiOccupations: any[] = [];
  uiAddresses: any[] = [];
  uiNominis: any[] = [];
  uiDocuments: any[] = [];

  uiMembers: any[] = [];

  dto: IGeneralDTO = {} as IGeneralDTO;


  constructor(private router: Router, private _customerService: CustomerService, 
    private _sharedService: SharedService, private _memberService: MemberService, 
    private _generalMasterService: GeneralMasterService, private _toastrService: ToastrService) { }

  ngOnInit(): void {
    this.maxDate = new Date();

    this.uiGenders = CustomerDeclarations.genders;
    this.uiMaritalStatuses = CustomerDeclarations.maritalStatuses;
    this.uiStatuses = CustomerDeclarations.statuses;
    this.uiEducations = CustomerDeclarations.educations;
    //this.uiTdsApplicables = CustomerDeclarations.tdsApplicables;
    //this.uiTdsPrintings = CustomerDeclarations.tdsPrintings;
    this.uiAddressTypes = CustomerDeclarations.addressTypes;
    this.uiCustomerTypes = CustomerDeclarations.customerTypes;
    this.uiTitles = CustomerDeclarations.titles;
    this.uiDocumentTypes = CustomerDeclarations.documents;
    //this.uiForm60YN = CustomerDeclarations.form60YN;
    //this.uiForm61YN = CustomerDeclarations.form61YN;

    this.customerForm = new FormGroup({
      customerCode: new FormControl("", []),
    });

    this.personalDetailsForm = new FormGroup({
      personalTitle: new FormControl(this.uiTitles[0].code, [Validators.required]),
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
      personalGender: new FormControl("", [Validators.required]),
      personalCustGroup: new FormControl("", [Validators.required]),
      personalCustZone: new FormControl("", [Validators.required]),
      personalCustCaste: new FormControl("", []),
      personalCustReligion: new FormControl("", []),
      personalOccupation: new FormControl("", [Validators.required]),
      personalMaritalStatus: new FormControl("", []),
      personalNationality: new FormControl("", [Validators.required]),
      personalEducation: new FormControl("", []),
      personalStatus: new FormControl(this.uiStatuses[0].code, []),
      personalCustCategory: new FormControl("", [])
    });

    this.addressForm = new FormGroup({
      addressType: new FormControl(this.uiAddressTypes[0].code, [Validators.required]),
      addressText: new FormControl("", [Validators.required]),
      addressCity: new FormControl("", [Validators.required]),
      addressState: new FormControl("", [Validators.required]),
      addressDistrict: new FormControl("", [Validators.required]),
      addressTaluka: new FormControl("", [Validators.required]),
      addressPincode: new FormControl("", []),
      addressDefault: new FormControl(true, []),
    });

    this.nominiForm = new FormGroup({
      nominiTitle: new FormControl(this.uiTitles[0].code, [Validators.required]),
      nominiName: new FormControl("", [Validators.required]),
      nominiAddress: new FormControl("", [Validators.required]),
      nominiDateOfBirth: new FormControl("", [Validators.required]),
      nominiAge: new FormControl("", []),
      nominiRelation: new FormControl("", [Validators.required]),
      nominiGuardian: new FormControl("", []),
      nominiPercentage: new FormControl("100", [Validators.required]),
    });

    this.documentsForm = new FormGroup({
      documentSelect: new FormControl(this.uiDocumentTypes[0].code, [Validators.required]),
    });

    this.loadMasters().then(() => {
      this.loadForm();
    })
   
  }

  loadForm()
  {
    this.uiAddressStates = this._sharedService.uiAllStates;
    this.uiNominiStates = this._sharedService.uiAllStates;

    this.uiAllDistricts = this._sharedService.uiAllDistricts;
    this.uiAllTahshils = this._sharedService.uiAllTahshils;
    let districts = this.uiAllDistricts.filter((d: any) => d.stateId == this.uiAddressStates[0].id);
    if (districts) {
      this.uiAddressDistricts = districts;
      this.uiNominiDistricts = districts;
    }

    let tahshils = this.uiAllTahshils.filter((d: any) => d.districtId == this.uiAddressDistricts[0].id);
    if (tahshils) {
      this.uiAddressTahshils = tahshils;
      this.uiNominiTahshils = tahshils;
    }

    this._customerService.getDTO().subscribe(obj => this.dto = obj);
    if (this.dto) {
      this.personalDetailsForm.patchValue({
        personalGroup: this.uiCustomerGroups[0].id,
        personalOccupation: this.uiOccupations[0].id,
      })

      this.addressForm.patchValue({
        addressState: this.uiAddressStates[0].id,
        addressDistrict: this.uiAddressDistricts[0].id,
        addressTahsil: this.uiAddressTahshils[0].id,
      })

      this.nominiForm.patchValue({
        nominiRelation: this.uiRelations[0].id,
        nominiState: this.uiNominiStates[0].id,
        nominiDistrict: this.uiNominiDistricts[0].id,
        nominiTahsil: this.uiNominiTahshils[0].id,
      })

      this.id = this.dto.id;
      if (this.dto.id == 0 || this.dto.id == undefined) {
        // Add Mode
        this.isAddMode = true;

        this._customerService.getMaxCustomerId(this._sharedService.applicationUser.branchId).subscribe((data: any) => {
          let maxCustId = data.data.data;
          this.maxId = maxCustId + 1;
          this.customerForm.patchValue({
            customerCode: this.maxId,
          });

          this.personalDetailsForm.patchValue({
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
        this._customerService.getCustomer(this.dto.id).subscribe((data: any) => {
          console.log(data);
          if (data) {
            if (data.statusCode == 200 && data.data.data) {
              var customer = data.data.data;

              let member = this.uiMembers.filter((d: any) => d.id == customer.memberId);

              this.customerForm.patchValue({
                customerCode: customer.id,
              });

              this.personalDetailsForm.patchValue({
                code: customer.id,
                personalTitle: customer.title,
                personalFirstName: customer.firstName,
                personalMiddleName: customer.middleName,
                personalLastName: customer.lastName,
                personalGender: customer.gender,
                personalGroup: customer.customerGroupId,
                personalCustomerType: customer.customerType,
                personalOccupation: customer.occupationId,
                personalMaritalStatus: customer.maritalStatus,
                personalStatus: customer.status,
                personalDateOfBirth: formatDate(new Date(customer.dateOfBirth), 'yyyy-MM-dd', 'en'),
                personalAge: this.calculateAge(customer.dateOfBirth),
                personalPAN: customer.pan,
                personalAadhar: customer.aadhar,
                personalPhone: customer.phone,
                personalEmail: customer.email,
                personalEducation: customer.education,
                personalTDSApplicable: customer.tdsApplicable,
                personalTDSPrinting: customer.tdsPrinting,
                personalTDSRate: customer.tdsRate,
                personalForm60: customer.form60,
                personalForm61: customer.form61,
                personalMember: member ? member[0].firstName + " " + member[0].middleName + " " + member[0].lastName : ""
              });

              if (customer.addresses) {
                customer.addresses.forEach((add:any) => {
                  let uiAddress = {} as UiAddress;

                  let addresssType = this.uiAddressTypes.filter(d => d.code == add.addressType);
                  let addressTypeName = addresssType[0].name;

                  uiAddress.addressType = add.addressType;
                  uiAddress.addressTypeName = addressTypeName;
                  uiAddress.address = add.address;
                  uiAddress.street = add.street;
                  uiAddress.landmark = add.landmark;
                  uiAddress.city = add.city;
                  uiAddress.districtId = add.districtId;
                  uiAddress.districtName = add.districtName;
                  uiAddress.tahshilId = add.tahshilId;
                  uiAddress.pincode = add.pincode;

                  this.uiAddresses.push(uiAddress);
                });
              }

              this.uiNominis = customer.nominis;

              if (customer.documents) {
                customer.documents.forEach((doc:any) => {
                  let uiDocument = {} as UiDocument;
                  uiDocument.customerId = this.dto.id;
                  uiDocument.documentKey = doc.documentKey;
                  uiDocument.documentName = this.uiDocumentTypes.filter(d => d.code == uiDocument.documentKey)[0].name;
                  uiDocument.filePath = doc.filePath;
                  uiDocument.id = doc.id;
                  this.uiDocuments.push(uiDocument);
                });
              }
            }
          }
        })
      }
    }
  }

  loadMasters() {
    return new Promise((resolve, reject) => {
      // let customerGroupMasterModel = {
      //   GeneralMasterId: UiEnumGeneralMaster.CustomerGroupMaster,
      //   BranchId: this._sharedService.applicationUser.branchId
      // }
      // this._generalMasterService.getAllGeneralMasters(customerGroupMasterModel).subscribe((customerGroups: any) => {
      //   if (customerGroups) {
      //     if (customerGroups.statusCode == 200 && customerGroups.data.data) {
      //       this.uiCustomerGroups = customerGroups.data.data;

      //       let occupationsMasterModel = {
      //         GeneralMasterId: UiEnumGeneralMaster.OccupationMaster,
      //         BranchId: this._sharedService.applicationUser.branchId
      //       }
      //       this._generalMasterService.getAllGeneralMasters(occupationsMasterModel).subscribe((occupations: any) => {
      //         if (occupations) {
      //           if (occupations.statusCode == 200 && occupations.data.data) {
      //             this.uiOccupations = occupations.data.data;

      //             let relationsMasterModel = {
      //               GeneralMasterId: UiEnumGeneralMaster.RelationMaster,
      //               BranchId: this._sharedService.applicationUser.branchId
      //             }
      //             this._generalMasterService.getAllGeneralMasters(relationsMasterModel).subscribe((relations: any) => {
      //               if (relations) {
      //                 if (relations.statusCode == 200 && relations.data.data) {
      //                   this.uiRelations = relations.data.data;

      //                   this._memberService.getAllMembers(this._sharedService.applicationUser.branchId).subscribe((members: any) => {
      //                     if (members) {
      //                       if (members.statusCode == 200 && members.data.data) {
                              
      //                         if (members.data.data) {
      //                           this.uiMembers = members.data.data.map((member: any) => ({
      //                             ...member,
      //                             name: member.firstName + " " + member.middleName + " " + member.lastName
      //                           }));
      //                         }
      //                         resolve(true);
      //                       }
      //                     }
      //                   })

      //                 }
      //               }
      //             })
      //           }
      //         }
      //       })
      //     }
      //   }
      // })
    })

  }

  onClick(section: string): void { 
    window.location.hash = '';
    window.location.hash = section;
  }

  selectMember(memberEvent:any)
  {
    if (memberEvent && memberEvent.value.id > 0) {
      this.addressForm.patchValue({
        personalMember: memberEvent.value.id
      });
    }
  }

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
      if (districts) {
        this.uiAddressDistricts = districts;
        this.addressForm.patchValue({
          addressDistrict: this.uiAddressDistricts[0].id
        });
      }
    }

  }

  onNominiStateChange(event: any) {
    let targetValue = event.target.value;
    let stateId = targetValue.split(":");
    if (stateId) {
      this.uiNominiDistricts = [];
      let districts = this.uiAllDistricts.filter((d: any) => d.stateId == parseInt(stateId[1]));
      if (districts) {
        this.uiNominiDistricts = districts;
        this.nominiForm.patchValue({
          nominiDistrict: this.uiNominiDistricts[0].id
        });
      }
    }
  }

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

  onNominiDistrictChange(event: any) {
    let targetValue = event.target.value;
    let districtId = targetValue.split(":");
    if (districtId) {
      this.uiNominiTahshils = [];
      let tahshils = this.uiAllTahshils.filter((d: any) => d.districtId == parseInt(districtId[1]));
      if (tahshils) {
        this.uiNominiTahshils = tahshils;
        this.nominiForm.patchValue({
          nominiTahsil: this.uiNominiTahshils[0].id
        });
      }
    }
  }

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

  saveCustomer() {
    // if (!this.validPersonalDetailsForm()) {
    //   this._toastrService.error('Personal details has errors.', 'Error!');
    //   return;
    // }
    // if (this.uiAddresses.length == 0) {
    //   this._toastrService.error('Address details has errors.', 'Error!');
    //   return;
    // }
    // if (this.uiNominis.length == 0) {
    //   this._toastrService.error('Nomini details has errors.', 'Error!');
    //   return;
    // }
    // if (!this.validDocumentsForm()) {
    //   this._toastrService.error('Document details has errors.', 'Error!');
    //   return;
    // }

    // let customerModel = {} as ICustomerModel;
    // customerModel.Id = parseInt(this.customerCode.value.toString());
    // customerModel.Title = this.personalTitle.value.toString();
    // customerModel.FirstName = this.personalFirstName.value.toString();
    // customerModel.MiddleName = this.personalMiddleName.value.toString();
    // customerModel.LastName = this.personalLastName.value.toString();
    // customerModel.Gender = this.personalGender.value.toString();
    // customerModel.CustomerGroupId = this.personalGroup.value.toString();

    // customerModel.CustomerGroupId = this.personalGroup.value.toString();
    // customerModel.CustomerType = this.personalCustomerType.value.toString();
    // customerModel.OccupationId = this.personalOccupation.value.toString();
    // customerModel.MaritalStatus = this.personalMaritalStatus.value.toString();
    // customerModel.DateOfBirth = this.personalDateOfBirth.value.toString();
    // customerModel.PAN = this.personalPAN.value.toString();
    // customerModel.Aadhar = this.personalAadhar.value.toString();
    // customerModel.Phone = this.personalPhone.value.toString();
    // customerModel.Email = this.personalEmail.value.toString();
    // customerModel.Education = this.personalEducation.value.toString();
    // customerModel.TDSApplicable = this.personalTDSApplicable.value.toString();
    // customerModel.TDSPrinting = this.personalTDSPrinting.value.toString();
    // customerModel.TDSRate = this.personalTDSRate.value.toString();
    // customerModel.Form60 = this.personalForm60.value.toString();
    // customerModel.Form61 = this.personalForm61.value.toString();
    // customerModel.MemberId = this.personalMember.value.id.toString();
    // customerModel.Status = this.personalStatus.value.toString();
    // customerModel.BranchId = this._sharedService.applicationUser.branchId;
    // customerModel.Addresses = this.uiAddresses;
    // customerModel.Nominis = this.uiNominis;
    // customerModel.Documents = this.uiDocuments;

    // console.log(customerModel);

    // if (this.isAddMode) {
    //   this._customerService.createCustomer(customerModel).subscribe((data: any) => {
    //     console.log(data);
    //     if (data) {
    //       if (data.statusCode == 200 && data.data.data > 0) {
    //         this._toastrService.success('Customer created.', 'Success!');
    //         this.clear();
    //         this.loadForm();
    //       }
    //     }
    //   })
    // }
    // else {
    //   this._customerService.updateCustomer(customerModel.Id, customerModel).subscribe((data: any) => {
    //     console.log(data);
    //     if (data) {
    //       if (data.statusCode == 200 && data.data.data > 0) {
    //         this._toastrService.success('Customer updated.', 'Success!');
    //         this.clear();
    //         this.loadForm();
    //       }
    //     }
    //   })
    // }
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
      personalTitle: this.uiTitles[0].code,
      personalFirstName: "",
      personalMiddleName: "",
      personalLastName: "",
      personalGender: this.uiGenders[0].code,
      personalGroup: this.uiCustomerGroups[0].code,
      personalCustomerType: this.uiCustomerTypes[0].code,
      personalOccupation: this.uiOccupations[0].code,
      personalMaritalStatus: this.uiMaritalStatuses[0].code,
      personalStatus: this.uiStatuses[0].code,
      personalDateOfBirth: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
      personalAge: this.calculateAge(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
      personalPAN: "",
      personalAadhar: "",
      personalPhone: "",
      personalEmail: "",
      personalEducation: this.uiEducations[0].code,
      personalTDSApplicable: this.uiTdsApplicables[0].code,
      personalTDSPrinting: this.uiTdsPrintings[0].code,
      personalTDSRate: "",
      personalForm60: this.uiForm60YN[0].code,
      personalForm61: this.uiForm61YN[0].code
    });
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

  addAddress() {
    if (this.validAddressForm()) {



      let addressTypeName = "";
      let districtName = "";
      // Find corresponding state
      let addresssType = this.uiAddressTypes.filter(d => d.code == this.addressType.value.toString());
      addressTypeName = addresssType[0].name;

      let district = this.uiAllDistricts.filter(d => d.id == this.addressDistrict.value.toString());
      districtName = district[0].name;

      let addressIndex = this.uiAddresses.findIndex(add => add.addressType == this.addressType.value.toString());
      // if (addressIndex > -1) {
      //   // update old
      //   let uiAddress = this.uiAddresses[addressIndex];
      //   uiAddress.addressType = this.addressType.value.toString();
      //   uiAddress.addressTypeName = addressTypeName;
      //   uiAddress.address = this.addressBuilding.value.toString();
      //   uiAddress.street = this.addressStreet.value.toString();
      //   uiAddress.landmark = this.addressLandmark.value.toString();
      //   uiAddress.city = this.addressCity.value.toString();
      //   uiAddress.districtId = this.addressDistrict.value.toString();
      //   uiAddress.districtName = districtName;
      //   uiAddress.tahshilId = this.addressTahsil.value.toString();
      //   uiAddress.pincode = this.addressPincode.value.toString();
      // }
      // else {
      //   // add new
      //   let uiAddress = {} as UiAddress;
      //   uiAddress.id = 0;
      //   uiAddress.addressType = this.addressType.value.toString();
      //   uiAddress.addressTypeName = addressTypeName;
      //   uiAddress.address = this.addressBuilding.value.toString();
      //   uiAddress.street = this.addressStreet.value.toString();
      //   uiAddress.landmark = this.addressLandmark.value.toString();
      //   uiAddress.city = this.addressCity.value.toString();
      //   uiAddress.districtId = this.addressDistrict.value.toString();
      //   uiAddress.districtName = districtName;
      //   uiAddress.tahshilId = this.addressTahsil.value.toString();
      //   uiAddress.pincode = this.addressPincode.value.toString();
      //   this.uiAddresses.push(uiAddress);
      // }

    }
  }

  editAddress(uiAddress: any, index: number) {
    let stateId = 0;
    if (uiAddress.districtId) {
      // Find corresponding state
      let addressstate = this.uiAddressDistricts.filter(d => d.id == uiAddress.districtId);
      stateId = addressstate[0].stateId;
    }
    // Bind Districts
    if (stateId) {
      let districts = this.uiAllDistricts.filter(d => d.stateId == stateId);
      this.uiAddressDistricts = districts;
    }
    // Bind Tahsils
    if (uiAddress.districtId) {
      let tahsils = this.uiAllTahshils.filter(d => d.districtId == uiAddress.districtId);
      this.uiAddressTahshils = tahsils;
    }

    this.addressForm.patchValue({
      addressType: uiAddress.addressType,
      addressBuilding: uiAddress.address,
      addressStreet: uiAddress.street,
      addressLandmark: uiAddress.landmark,
      addressCity: uiAddress.city,
      addressState: stateId,
      addressDistrict: parseInt(uiAddress.districtId),
      addressTahsil: parseInt(uiAddress.tahshilId),
      addressPincode: uiAddress.pincode,
    });

  }

  deleteAddress(uiAddress: any, index: number) {
    this.uiAddresses.splice(index, 1);
  }

  clearAddress() {
    this.addressForm.patchValue({
      addressType: this.uiAddressTypes[0].code,
      addressBuilding: "",
      addressStreet: "",
      addressLandmark: "",
      addressCity: "",
      addressState: this.uiAddressStates[0].id,
      addressDistrict: this.uiAddressDistricts[0].id,
      addressTahsil: this.uiAddressTahshils[0].id,
      addressPincode: "",
    });
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

  addNomini() {
    if (this.validNominiForm()) {

      // // Check existing nomini with name and relation
      // let nominiIndex = this.uiNominis.findIndex(nomini =>
      //   nomini.firstName.toLowerCase() == this.nominiFirstName.value.toLowerCase() &&
      //   nomini.middleName.toLowerCase() == this.nominiMiddleName.value.toLowerCase() &&
      //   nomini.lastName.toLowerCase() == this.nominiLastName.value.toLowerCase());

      // let totalPercentage = this.uiNominis.reduce((sum, nomini) => sum + parseInt(nomini.percentage), 0);
      // if (nominiIndex > -1) {
      //   totalPercentage = totalPercentage - this.uiNominis[nominiIndex].percentage;
      // }
      // if (totalPercentage == 100) {
      //   this._toastrService.warning('Total percentage for nomini exceeded.', 'Warning!');
      //   return;
      // }

      // let relation = "";
      // let uiRelation = this.uiRelations.filter(r => r.id == parseInt(this.nominiRelation.value.toString()));
      // if (uiRelation) {
      //   relation = uiRelation[0].branchMasterName;
      // }

      // let district = this.uiAllDistricts.filter(d => d.id == this.nominiDistrict.value.toString());
      // let districtName = district[0].name;

      // if (nominiIndex > -1) {
      //   let uiNomini = this.uiNominis[nominiIndex];
      //   uiNomini.title = this.nominiTitle.value.toString();
      //   uiNomini.firstName = this.nominiFirstName.value.toString();
      //   uiNomini.middleName = this.nominiMiddleName.value.toString();
      //   uiNomini.lastName = this.nominiLastName.value.toString();
      //   uiNomini.relationId = this.nominiRelation.value.toString();
      //   uiNomini.relationName = relation;
      //   uiNomini.guardian = this.nominiGuardian.value.toString();
      //   uiNomini.percentage = this.nominiPercentage.value.toString();
      //   uiNomini.dateOfBirth = this.nominiDateOfBirth.value.toString();
      //   uiNomini.address = this.nominiBuilding.value.toString();
      //   uiNomini.street = this.nominiStreet.value.toString();
      //   uiNomini.city = this.nominiCity.value.toString();
      //   uiNomini.districtId = this.nominiDistrict.value.toString();
      //   uiNomini.districtName = districtName;
      //   uiNomini.tahshilId = this.nominiTahsil.value.toString();
      //   uiNomini.pincode = this.nominiPincode.value.toString();
      //   uiNomini.phone = this.nominiPhone.value.toString();
      //   uiNomini.email = this.nominiEmail.value.toString();
      // }
      // else {
      //   let uiNomini = {} as UiNomini;
      //   uiNomini.id = 0;
      //   uiNomini.title = this.nominiTitle.value.toString();
      //   uiNomini.firstName = this.nominiFirstName.value.toString();
      //   uiNomini.middleName = this.nominiMiddleName.value.toString();
      //   uiNomini.lastName = this.nominiLastName.value.toString();
      //   uiNomini.relationId = this.nominiRelation.value.toString();
      //   uiNomini.relationName = relation;
      //   uiNomini.guardian = this.nominiGuardian.value.toString();
      //   uiNomini.percentage = this.nominiPercentage.value.toString();
      //   uiNomini.dateOfBirth = this.nominiDateOfBirth.value.toString();
      //   uiNomini.address = this.nominiBuilding.value.toString();
      //   uiNomini.street = this.nominiStreet.value.toString();
      //   uiNomini.city = this.nominiCity.value.toString();
      //   uiNomini.districtId = this.nominiDistrict.value.toString();
      //   uiNomini.districtName = districtName;
      //   uiNomini.tahshilId = this.nominiTahsil.value.toString();
      //   uiNomini.pincode = this.nominiPincode.value.toString();
      //   uiNomini.phone = this.nominiPhone.value.toString();
      //   uiNomini.email = this.nominiEmail.value.toString();

      //   this.uiNominis.push(uiNomini);
      // }
    }
  }

  editNomini(uiNomini: any, index: number) {
    let stateId = 0;
    if (uiNomini.districtId) {
      // Find corresponding state
      let addressState = this.uiNominiDistricts.filter(d => d.id == uiNomini.districtId);
      stateId = addressState[0].stateId;
    }
    // Bind Districts
    if (stateId) {
      let districts = this.uiAllDistricts.filter(d => d.stateId == stateId);
      this.uiNominiDistricts = districts;
    }
    // Bind Tahsils
    if (uiNomini.districtId) {
      let tahsils = this.uiAllTahshils.filter(d => d.districtId == uiNomini.districtId);
      this.uiNominiTahshils = tahsils;
    }

    this.nominiForm.patchValue({
      nominiTitle: uiNomini.title,
      nominiFirstName: uiNomini.firstName,
      nominiMiddleName: uiNomini.middleName,
      nominiLastName: uiNomini.lastName,
      nominiRelation: parseInt(uiNomini.relationId),
      nominiGuardian: uiNomini.guardian,
      nominiPercentage: uiNomini.percentage,
      nominiDateOfBirth: formatDate(new Date(uiNomini.dateOfBirth), 'yyyy-MM-dd', 'en'),
      nominiAge: this.calculateAge(uiNomini.dateOfBirth),
      nominiBuilding: uiNomini.address,
      nominiStreet: uiNomini.street,
      nominiCity: uiNomini.city,
      nominiState: stateId,
      nominiDistrict: parseInt(uiNomini.districtId),
      nominiTahsil: parseInt(uiNomini.tahshilId),
      nominiPincode: uiNomini.pincode,
      nominiPhone: uiNomini.phone,
      nominiEmail: uiNomini.email,
    });


  }

  deleteNomini(uiNomini: any, index: number) {
    this.uiNominis.splice(index, 1);
  }

  clearNomini() {
    this.nominiForm.patchValue({
      nominiTitle: this.uiTitles[0].code,
      nominiFirstName: "",
      nominiMiddleName: "",
      nominiLastName: "",
      nominiRelation: new FormControl("", [Validators.required]),
      nominiGuardian: "",
      nominiPercentage: 100,
      nominiDateOfBirth: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
      nominiAge: this.calculateAge(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
      nominiBuilding: "",
      nominiStreet: "",
      nominiCity: "",
      nominiState: this.uiNominiStates[0].id,
      nominiDistrict: this.uiNominiDistricts[0].id,
      nominiTahsil: this.uiNominiTahshils[0].id,
      nominiPincode: "",
      nominiPhone: "",
      nominiEmail: "",
    });
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

  get customerCode() {
    return this.customerForm.get('customerCode')!;
  }
  ///

  /// Personal
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
  get personalStatus() {
    return this.personalDetailsForm.get('personalStatus')!;
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
  get nominiTitle() {
    return this.nominiForm.get('nominiTitle')!;
  }
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
