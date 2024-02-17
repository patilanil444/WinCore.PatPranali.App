import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CustomerDeclarations } from 'src/app/common/customer-declarations';
import { IGeneralDTO, UiEnumGeneralMaster } from 'src/app/common/models/common-ui-models';
import { CustomerService } from 'src/app/services/customers/customer/customer.service';
import { MemberService } from 'src/app/services/customers/member/member.service';
import { GeneralMasterService } from 'src/app/services/masters/general-master/general-master.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.css']
})
export class MemberFormComponent implements OnInit {

  memberForm!: FormGroup;
  personalDetailsForm!: FormGroup;
  nominiForm!: FormGroup;
  dividentForm!: FormGroup;
  documentsForm!: FormGroup;

  uiTitles: any[] = [];
  uiGenders: any[] = [];
  uiAddressStates: any[] = [];
  uiAddressDistricts: any[] = [];
  uiAddressTahshils: any[] = [];
  uiDocumentTypes: any[] = [];
  uiOccupations: any[] = [];
  uiCasts: any[] = [];
  uiRelations: any[] = [];

  id!: number;
  maxId!: number;
  newCode!: string;
  isAddMode!: boolean;
  maxDate!: Date;
  percentDone: number = 0;
  uploadSuccess: boolean = false;

  uiNominis: any[] = [];
  uiDocuments: any[] = [];

  p_nomini: number = 1;
  total_nomini: number = 0;

  dto: IGeneralDTO = {} as IGeneralDTO;

  constructor(private _memberService: MemberService, private _sharedService: SharedService,
    private _generalMasterService: GeneralMasterService, private _toastrService: ToastrService) { }

  ngOnInit(): void {
    this.maxDate = new Date();
    this.uiGenders = CustomerDeclarations.genders;
    this.uiTitles = CustomerDeclarations.titles;
    this.uiDocumentTypes = CustomerDeclarations.documents;

    this.memberForm = new FormGroup({
      memberCode: new FormControl("", []),
    });

    this.personalDetailsForm = new FormGroup({
      personalTitle: new FormControl(this.uiTitles[0].code, [Validators.required]),
      personalFirstName: new FormControl("", [Validators.required]),
      personalMiddleName: new FormControl("", []),
      personalLastName: new FormControl("", [Validators.required]),
      personalDateOfBirth: new FormControl("", [Validators.required]),
      personalAge: new FormControl("", []),
      personalAddress: new FormControl("", []),
      personalState: new FormControl("", []),
      personalDistrict: new FormControl("", []),
      personalTahsil: new FormControl("", [Validators.required]),
      personalPincode: new FormControl("", []),
      personalPhone: new FormControl("", [Validators.required]),
      personalGender: new FormControl(this.uiGenders[0].code, [Validators.required]),
      personalOccupation: new FormControl("", []),
      personalCast: new FormControl("", []),
      personalDirector: new FormControl("", []),
      personalAccountNumber: new FormControl("", []),
      personalAccountopenDate: new FormControl("", []),
      personalAuthorisedBy: new FormControl("", []),
      personalEmail: new FormControl("", [Validators.pattern("[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}")]),
    });

    this.nominiForm = new FormGroup({
      nominiTitle: new FormControl(this.uiTitles[0].code, [Validators.required]),
      nominiFirstName: new FormControl("", [Validators.required]),
      nominiMiddleName: new FormControl("", []),
      nominiLastName: new FormControl("", [Validators.required]),
      nominiRelation: new FormControl("", [Validators.required]),
      nominiAddress: new FormControl("", [Validators.required]),
      nominiCity: new FormControl("", [Validators.required]),
      nominiState: new FormControl("", []),
      nominiDistrict: new FormControl("", []),
      nominiTahsil: new FormControl("", [Validators.required]),
      nominiPincode: new FormControl("", []),
      nominiGivenDate: new FormControl("", [Validators.required]),
      nominiAge: new FormControl("", []),
    });

    this.dividentForm = new FormGroup({
      dividentNoOfShares: new FormControl("", [Validators.required]),
      dividentShareValue: new FormControl("", [Validators.required]),
      dividentTotalShareValue: new FormControl("", [Validators.required]),
      dividentAmount: new FormControl("", [Validators.required]),
      dividentAdmissionFeeDate: new FormControl("", []),
      dividentIncome: new FormControl("", [Validators.required]),
      dividentLoanLimit: new FormControl("", [Validators.required]),
    });

    this.documentsForm = new FormGroup({
      documentSelect: new FormControl(this.uiDocumentTypes[0].code, [Validators.required]),
    });

    this.loadMasters().then(() => {
      this.loadForm();
    })
  }

  loadForm() {
    this.uiAddressStates = this._sharedService.uiAllStates;
    this.uiAddressDistricts = this._sharedService.uiAllDistricts;
    this.uiAddressTahshils = this._sharedService.uiAllTahshils;

    let districts = this.uiAddressDistricts.filter((d: any) => d.stateId == this.uiAddressStates[0].id);
    if (districts) {
      this.uiAddressDistricts = districts;
    }

    let tahshils = this.uiAddressTahshils.filter((d: any) => d.districtId == this.uiAddressDistricts[0].id);
    if (tahshils) {
      this.uiAddressTahshils = tahshils;
    }

    this._memberService.getDTO().subscribe(obj => this.dto = obj);
    if (this.dto) {
      this.personalDetailsForm.patchValue({
        personalOccupation: this.uiOccupations[0].id,
        personalCast: this.uiCasts[0].id,
        personalState: this.uiAddressStates[0].id,
        personalDistrict: this.uiAddressDistricts[0].id,
        personalTahsil: this.uiAddressTahshils[0].id,
      })

      this.nominiForm.patchValue({
        nominiRelation: this.uiRelations[0].id,
        nominiState: this.uiAddressStates[0].id,
        nominiDistrict: this.uiAddressDistricts[0].id,
        nominiTahsil: this.uiAddressTahshils[0].id,
      })

      this.id = this.dto.id;
      if (this.dto.id == 0 || this.dto.id == undefined) {
        // Add Mode
        this.isAddMode = true;

        // TODO:
        this._memberService.getMaxMemberId(this._sharedService.applicationUser.branchId).subscribe((data: any) => {
          let maxCustId = data.data.data;
          this.maxId = maxCustId + 1;
          this.memberForm.patchValue({
            memberCode: this.maxId,
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
        this._memberService.getMember(this.dto.id).subscribe((data: any) => {
          console.log(data);
          if (data) {
            if (data.statusCode == 200 && data.data.data) {
              var customer = data.data.data;

              // let tahshils = this.uiAllTahshils.filter((d: any) => d.districtId == customer.districtId);
              // if (tahshils) {
              //   this.uiAddressTahshils = tahshils;
              // }

              this.memberForm.patchValue({
                code: customer.id,
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
              });

              // if (customer.addresses) {
              //   customer.addresses.forEach((add:any) => {
              //     let uiAddress = {} as UiAddress;

              //     let addresssType = this.uiAddressTypes.filter(d => d.code == add.addressType);
              //     let addressTypeName = addresssType[0].name;

              //     uiAddress.addressType = add.addressType;
              //     uiAddress.addressTypeName = addressTypeName;
              //     uiAddress.address = add.address;
              //     uiAddress.street = add.street;
              //     uiAddress.landmark = add.landmark;
              //     uiAddress.city = add.city;
              //     uiAddress.districtId = add.districtId;
              //     uiAddress.districtName = add.districtName;
              //     uiAddress.tahshilId = add.tahshilId;
              //     uiAddress.pincode = add.pincode;

              //     this.uiAddresses.push(uiAddress);
              //   });
              // }

              // this.uiNominis = customer.nominis;

              // if (customer.documents) {
              //   customer.documents.forEach((doc:any) => {
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

  loadMasters() {
    return new Promise((resolve, reject) => {
      let occupationsMasterModel = {
        GeneralMasterId: UiEnumGeneralMaster.OccupationMaster,
        BranchId: this._sharedService.applicationUser.branchId
      }
      this._generalMasterService.getAllGeneralMasters(occupationsMasterModel).subscribe((customerGroups: any) => {
        if (customerGroups) {
          if (customerGroups.statusCode == 200 && customerGroups.data.data) {
            this.uiOccupations = customerGroups.data.data;

            let castMasterModel = {
              GeneralMasterId: UiEnumGeneralMaster.CastMaster,
              BranchId: this._sharedService.applicationUser.branchId
            }
            this._generalMasterService.getAllGeneralMasters(castMasterModel).subscribe((casts: any) => {
              if (casts) {
                if (casts.statusCode == 200 && casts.data.data) {
                  this.uiCasts = casts.data.data;

                  let relationsMasterModel = {
                    GeneralMasterId: UiEnumGeneralMaster.RelationMaster,
                    BranchId: this._sharedService.applicationUser.branchId
                  }
                  this._generalMasterService.getAllGeneralMasters(relationsMasterModel).subscribe((relations: any) => {
                    if (relations) {
                      if (relations.statusCode == 200 && relations.data.data) {
                        this.uiRelations = relations.data.data;
                        resolve(true);
                      }
                    }
                  })
                }
              }
            })
          }
        }
      })
    })

  }

  pageNominiChangeEvent(event: number) {
    this.p_nomini = event;
  }

  onAddressStateChange(event: any) {
    let targetValue = event.target.value;
    let stateId = targetValue.split(":");
    if (stateId) {
      this.uiAddressDistricts = [];
      let districts = this.uiAddressDistricts.filter((d: any) => d.stateId == parseInt(stateId[1]));
      if (districts) {
        this.uiAddressDistricts = districts;
        this.personalDetailsForm.patchValue({
          personalDistrict: this.uiAddressDistricts[0].id
        });
      }
    }

  }

  onAddressDistrictChange(event: any) {
    let targetValue = event.target.value;
    let districtId = targetValue.split(":");
    if (districtId) {
      this.uiAddressTahshils = [];
      let tahshils = this.uiAddressTahshils.filter((d: any) => d.districtId == parseInt(districtId[1]));
      if (tahshils) {
        this.uiAddressTahshils = tahshils;
        this.personalDetailsForm.patchValue({
          personalTahsil: this.uiAddressTahshils[0].id
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

  addNomini() {

  }

  clearNomini() {

  }

  editNomini(uiNomini: any, ind: number) {

  }

  deleteNomini(uiNomini: any, ind: number) {


  }

  addDocument() {

  }

  uploadDocument(event: any, index: number, documentkey: string) {

  }

  deleteDocument(index: number) {

  }

  saveMember() {

  }

  clear() {

  }

  calculateAge(dateOfBirth: any) { // birthday is a date
    let currentDate = new Date().getFullYear();
    let dob = new Date(dateOfBirth).getFullYear();
    return Math.abs(currentDate - dob);
  }

  //member
  get memberCode() {
    return this.personalDetailsForm.get('memberCode')!;
  }

  //Personal
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
  get personalDateOfBirth() {
    return this.personalDetailsForm.get('personalDateOfBirth')!;
  }
  get personalAge() {
    return this.personalDetailsForm.get('personalAge')!;
  }
  get personalAddress() {
    return this.personalDetailsForm.get('personalAddress')!;
  }
  get personalState() {
    return this.personalDetailsForm.get('personalState')!;
  }
  get personalDistrict() {
    return this.personalDetailsForm.get('personalDistrict')!;
  }
  get personalTahsil() {
    return this.personalDetailsForm.get('personalTahsil')!;
  }
  get personalPincode() {
    return this.personalDetailsForm.get('personalPincode')!;
  }
  get personalPhone() {
    return this.personalDetailsForm.get('personalPhone')!;
  }
  get personalGender() {
    return this.personalDetailsForm.get('personalGender')!;
  }
  get personalOccupation() {
    return this.personalDetailsForm.get('personalOccupation')!;
  }
  get personalCast() {
    return this.personalDetailsForm.get('personalCast')!;
  }
  get personalDirector() {
    return this.personalDetailsForm.get('personalDirector')!;
  }
  get personalAccountNumber() {
    return this.personalDetailsForm.get('personalAccountNumber')!;
  }
  get personalAccountopenDate() {
    return this.personalDetailsForm.get('personalAccountopenDate')!;
  }
  get personalAuthorisedBy() {
    return this.personalDetailsForm.get('personalAuthorisedBy')!;
  }
  get personalEmail() {
    return this.personalDetailsForm.get('personalEmail')!;
  }


  // Nomini
  get nominiTitle() {
    return this.nominiForm.get('nominiTitle')!;
  }
  get nominiFirstName() {
    return this.nominiForm.get('nominiFirstName')!;
  }
  get nominiMiddleName() {
    return this.nominiForm.get('nominiMiddleName')!;
  }
  get nominiLastName() {
    return this.nominiForm.get('nominiLastName')!;
  }
  get nominiRelation() {
    return this.nominiForm.get('nominiRelation')!;
  }
  get nominiAddress() {
    return this.nominiForm.get('nominiAddress')!;
  }
  get nominiCity() {
    return this.nominiForm.get('nominiCity')!;
  }
  get nominiState() {
    return this.nominiForm.get('nominiState')!;
  }
  get nominiDistrict() {
    return this.nominiForm.get('nominiDistrict')!;
  }
  get nominiTahsil() {
    return this.nominiForm.get('nominiTahsil')!;
  }
  get nominiPincode() {
    return this.nominiForm.get('nominiPincode')!;
  }
  get nominiGivenDate() {
    return this.nominiForm.get('nominiGivenDate')!;
  }
  get nominiAge() {
    return this.nominiForm.get('nominiAge')!;
  }

  // Divident
  get dividentNoOfShares() {
    return this.dividentForm.get('dividentNoOfShares')!;
  }
  get dividentShareValue() {
    return this.dividentForm.get('dividentShareValue')!;
  }
  get dividentTotalShareValue() {
    return this.dividentForm.get('dividentTotalShareValue')!;
  }
  get dividentAmount() {
    return this.dividentForm.get('dividentAmount')!;
  }
  get dividentAdmissionFeeDate() {
    return this.dividentForm.get('dividentAdmissionFeeDate')!;
  }
  get dividentIncome() {
    return this.dividentForm.get('dividentIncome')!;
  }
  get dividentLoanLimit() {
    return this.dividentForm.get('dividentLoanLimit')!;
  }

  // Document
  get documentSelect() {
    return this.dividentForm.get('documentSelect')!;
  }
}
