import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomerDeclarations } from 'src/app/common/customer-declarations';
import { IGeneralDTO, UiEnumGeneralMaster } from 'src/app/common/models/common-ui-models';
import { MemberService } from 'src/app/services/customers/member/member.service';
import { GeneralMasterService } from 'src/app/services/masters/general-master/general-master.service';
import { SharedService } from 'src/app/services/shared.service';

interface ICustomerModel {
  Id: number;
  Title: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  DateOfBirth: Date;
  Address: string;
  TahsilId: number;
  Pincode: string;
  Phone: string;
  Gender: string;
  OccupationId: number;
  CastId: number;
  DirectorId: number;
  AccountNumber: string;
  AccOpenDate: Date;
  AuthorisedBy: string;
  Email: string;
  NumOfShares: number;
  ShareValue: number;
  DividentAmount: number;
  LoanLimitAmount: number;
  AdmissionFeeDate: Date;
  Income: number;
  Status: string;
  BranchId: number;
  Nominis: any[];
  Documents: any[];
}

export interface UiNomini {
  id: number,
  memberId: number,
  title: string,
  firstName: string,
  middleName: string,
  lastName: string,
  relationId: number,
  relationName: string,
  gender: string,
  address: string,
  street: string,
  city: string,
  tahshilId: number,
  tahshilName: string,
  districtId: number,
  districtName: string,
  pincode: string,
  percentage: string,
  givenDate: string,
}

export interface UiDocument {
  id: number,
  memberId: number,
  documentKey: string,
  documentName: string,
  filePath: string,
  uploadSuccess: false;
  percentDone: 0;
}

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

  uiAllStates: any[] = [];
  uiAllDistricts: any[] = [];
  uiAllTahshils: any[] = [];

  uiAddressStates: any[] = [];
  uiAddressDistricts: any[] = [];
  uiAddressTahshils: any[] = [];

  uiNominiStates: any[] = [];
  uiNominiDistricts: any[] = [];
  uiNominiTahshils: any[] = [];
  uiDocumentTypes: any[] = [];
  uiOccupations: any[] = [];
  uiCasts: any[] = [];
  uiRelations: any[] = [];
  uiDirectors: any[] = [];

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

  constructor(private router: Router, private _memberService: MemberService, private _sharedService: SharedService,
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
      nominiSharePercentage: new FormControl(100, []),
      nominiGender: new FormControl(this.uiGenders[0].code, [])
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
      documentSelect: new FormControl(this.uiDocumentTypes[2].code, [Validators.required]),
    });

    this.loadMasters().then(() => {
      this.loadForm();
    })
  }

  loadForm() {
    this.uiAllStates = this._sharedService.uiAllStates;
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

    this._memberService.getDTO().subscribe((obj:any) => this.dto = obj);
    if (this.dto) {
      this.personalDetailsForm.patchValue({
        personalOccupation: this.uiOccupations[0].id,
        personalDirector : this.uiDirectors[0].id,
        personalCast: this.uiCasts[0].id,
        personalState: this.uiAddressStates[0].id,
        personalDistrict: this.uiAddressDistricts[0].id,
        personalTahsil: this.uiAddressTahshils[0].id,
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

        // TODO:
        this._memberService.getMaxMemberId(this._sharedService.applicationUser.branchId).subscribe((data: any) => {
          let maxCustId = data.data.data;
          this.maxId = maxCustId + 1;
          this.memberForm.patchValue({
            memberCode: this.maxId,
          });

          this.personalDetailsForm.patchValue({
            personalDateOfBirth: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
            personalAccountopenDate: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
            personalAge: this.calculateAge(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
          });

          this.nominiForm.patchValue({
            nominiGivenDate: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
          });

          this.dividentForm.patchValue({
            dividentAdmissionFeeDate: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
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
              var member = data.data.data;

              let tahshils = this.uiAllTahshils.filter((d: any) => d.id == member.tahsilId);
              let district = this.uiAllDistricts[0];
              if (tahshils.length) {
                let dists = this.uiAllDistricts.filter((d: any) => d.id == tahshils[0].districtId);
                district = dists[0];
              }

              this.memberForm.patchValue({
                memberCode: member.id,
              });

              this.personalDetailsForm.patchValue({
                personalTitle: member.title,
                personalFirstName: member.firstName,
                personalMiddleName: member.middleName,
                personalLastName: member.lastName,
                personalDateOfBirth: formatDate(new Date(member.dateOfBirth), 'yyyy-MM-dd', 'en'),
                personalAge: this.calculateAge(member.dateOfBirth),
                personalAddress: member.address,
                personalState : district.stateId,
                personalDistrict: district.id,
                personalTahsil: member.tahsilId,
                personalPincode: member.pincode,
                personalPhone: member.phone,
                personalGender: member.gender,
                personalOccupation: member.occupationId,
                personalCast: member.castId,
                personalDirector: member.directorId,
                personalAccountNumber: member.accountNumber,
                personalAccountopenDate: formatDate(new Date(member.accOpenDate), 'yyyy-MM-dd', 'en'),
                personalAuthorisedBy: member.authorisedBy,
                personalEmail: member.email,
              });

              this.nominiForm.patchValue({
                nominiGivenDate: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
              });

               this.uiNominis = member.nominis.map((nomini: any) => (
               {
                ...nomini,
                givenDate: formatDate(new Date(nomini.givenDate), 'yyyy-MM-dd', 'en')
               }));

               this.dividentForm.patchValue({
                dividentNoOfShares: member.numOfShares,
                dividentShareValue: member.shareValue,
                dividentTotalShareValue: parseFloat(member.shareValue) * parseFloat(member.numOfShares),
                dividentAmount: member.dividentAmount,
                dividentAdmissionFeeDate: formatDate(new Date(member.admissionFeeDate), 'yyyy-MM-dd', 'en'),
                dividentIncome: member.income,
                dividentLoanLimit: member.loanLimitAmount,
              });

              if (member.documents) {
                  member.documents.forEach((doc:any) => {
                  let uiDocument = {} as UiDocument;
                  uiDocument.memberId = this.dto.id;
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
      let occupationsMasterModel = {
        GeneralMasterId: UiEnumGeneralMaster.OccupationMaster,
        BranchId: this._sharedService.applicationUser.branchId
      }
      this._generalMasterService.getAllGeneralMasters(occupationsMasterModel).subscribe((memberGroups: any) => {
        if (memberGroups) {
          if (memberGroups.statusCode == 200 && memberGroups.data.data) {
            this.uiOccupations = memberGroups.data.data;

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

                        this._memberService.getDirectors(this._sharedService.applicationUser.branchId).subscribe((directors: any) => {
                          if (directors) {
                            if (directors.statusCode == 200 && directors.data.data) {
                              this.uiDirectors = directors.data.data;
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
      let districts = this.uiAllDistricts.filter((d: any) => d.stateId == parseInt(stateId[1]));
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
      let tahshils = this.uiAllTahshils.filter((d: any) => d.districtId == parseInt(districtId[1]));
      if (tahshils) {
        this.uiAddressTahshils = tahshils;
        this.personalDetailsForm.patchValue({
          personalTahsil: this.uiAddressTahshils[0].id
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

  validNominiForm()
  {
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

      // Check existing nomini with name and relation
      // let nominiIndex = this.uiNominis.findIndex(nomini =>
      //   nomini.firstName.toLowerCase() == this.nominiFirstName.value.toLowerCase() &&
      //   nomini.middleName.toLowerCase() == this.nominiMiddleName.value.toLowerCase() &&
      //   nomini.lastName.toLowerCase() == this.nominiLastName.value.toLowerCase());

        let nominiIndex = this.uiNominis.findIndex(nomini =>
        nomini.relationId == this.nominiRelation.value);

      let totalPercentage = this.uiNominis.reduce((sum, nomini) => sum + parseInt(nomini.percentage), 0);
      if (nominiIndex > -1) {
        totalPercentage = totalPercentage - this.uiNominis[nominiIndex].percentage;
      }
      if (totalPercentage == 100) {
        this._toastrService.warning('Total percentage for nomini exceeded.', 'Warning!');
        return;
      }

      let relation = "";
      let uiRelation = this.uiRelations.filter(r => r.id == parseInt(this.nominiRelation.value.toString()));
      if (uiRelation) {
        relation = uiRelation[0].branchMasterName;
      }

      let district = this.uiAllDistricts.filter(d => d.id == this.nominiDistrict.value.toString());
      let districtName = district[0].name;

      if (nominiIndex > -1) {
        let uiNomini = this.uiNominis[nominiIndex];
        uiNomini.title = this.nominiTitle.value.toString();
        uiNomini.firstName = this.nominiFirstName.value.toString();
        uiNomini.middleName = this.nominiMiddleName.value.toString();
        uiNomini.lastName = this.nominiLastName.value.toString();
        uiNomini.relationId = this.nominiRelation.value.toString();
        uiNomini.relationName = relation;
        uiNomini.gender = this.nominiGender.value.toString();
        uiNomini.address = this.nominiAddress.value.toString();
        uiNomini.city = this.nominiCity.value.toString();
        uiNomini.districtId = this.nominiDistrict.value.toString();
        uiNomini.districtName = districtName;
        uiNomini.tahshilId = this.nominiTahsil.value.toString();
        uiNomini.pincode = this.nominiPincode.value.toString();
        uiNomini.percentage = this.nominiSharePercentage.value.toString();
        uiNomini.givenDate = this.nominiGivenDate.value.toString();
      }
      else {
        let uiNomini = {} as UiNomini;
        uiNomini.id = this.uiNominis.length + 1;
        uiNomini.title = this.nominiTitle.value.toString();
        uiNomini.firstName = this.nominiFirstName.value.toString();
        uiNomini.middleName = this.nominiMiddleName.value.toString();
        uiNomini.lastName = this.nominiLastName.value.toString();
        uiNomini.relationId = this.nominiRelation.value.toString();
        uiNomini.relationName = relation;
        uiNomini.gender = this.nominiGender.value.toString();
        uiNomini.address = this.nominiAddress.value.toString();
        uiNomini.city = this.nominiCity.value.toString();
        uiNomini.districtId = this.nominiDistrict.value.toString();
        uiNomini.districtName = districtName;
        uiNomini.tahshilId = this.nominiTahsil.value.toString();
        uiNomini.pincode = this.nominiPincode.value.toString();
        uiNomini.percentage = this.nominiSharePercentage.value.toString();
        uiNomini.givenDate = this.nominiGivenDate.value.toString();
        this.uiNominis.push(uiNomini);
      }

      this.clearNomini();
    }
  }

  clearNomini() {
    this.nominiForm.patchValue({
      nominiTitle: this.uiTitles[0].code,
      nominiFirstName: "",
      nominiMiddleName: "",
      nominiLastName: "",
      nominiRelation: this.uiRelations[0].id,
      nominiAddress: "",
      nominiCity: "",
      nominiStreet: "",
      nominiState: this.uiNominiStates[0].id,
      nominiDistrict: this.uiNominiDistricts[0].id,
      nominiTahsil: this.uiNominiTahshils[0].id,
      nominiPincode: "",
      nominiSharePercentage: 100,
      nominiGivenDate: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
      nominiGender: this.uiGenders[0].code
    });
  }

  editNomini(uiNomini: any, ind: number) {
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
      nominiAddress: uiNomini.address,
      nominiCity: uiNomini.city,
      nominiState: stateId,
      nominiDistrict: parseInt(uiNomini.districtId),
      nominiTahsil: parseInt(uiNomini.tahsilId),
      nominiPincode: uiNomini.pincode,
      nominiGivenDate: formatDate(new Date(uiNomini.givenDate), 'yyyy-MM-dd', 'en'),
      nominiSharePercentage: uiNomini.percentage,
      nominiGender: uiNomini.gender
    });
  }

  deleteNomini(uiNomini: any, ind: number) {
    this.uiNominis.splice(ind, 1);
  }

  calculateTotalShareValue()
  {
    this.dividentForm.patchValue({
      dividentTotalShareValue: new FormControl("", [])
    })

    let numberOfShares = this.dividentNoOfShares.value;
    let shareValue = this.dividentShareValue.value;
    if (parseFloat(numberOfShares) > 0 && parseFloat(shareValue) > 0 ) {
      let totalAmount = parseFloat(numberOfShares) * parseFloat(shareValue);
      this.dividentForm.patchValue({
        dividentTotalShareValue: totalAmount
      })
    }
  }

  addDocument() {
    let documentIndex = this.uiDocuments.findIndex(d => d.documentKey == this.documentSelect.value.toString());
    if (documentIndex > -1) {
      this._toastrService.error('Document already exists.', 'Error!');
      return;
    }
    let uiDocument = {} as UiDocument;
    uiDocument.memberId = parseInt(this.memberCode.value);
    uiDocument.documentKey = this.documentSelect.value.toString();
    uiDocument.documentName = this.uiDocumentTypes.filter(d => d.code == uiDocument.documentKey)[0].name;
    uiDocument.filePath = "";
    uiDocument.id = 0;
    uiDocument.uploadSuccess = false;
    uiDocument.percentDone = 0;
    this.uiDocuments.push(uiDocument);
  }

  uploadDocument(event: any, index: number, documentKey: string) {
    this.uploadAndProgressSingle(event.target.files[0], index, documentKey);
  }

  uploadAndProgressSingle(file: File, index: number, documentKey: string) {
    let formData = new FormData();
    formData.append('documentName', file.name);
    formData.append('documentKey', documentKey);
    formData.append('memberId', this.memberCode.value);
    formData.append('postedDocument', file);

    this._memberService.uploadDocument(formData).subscribe((data: any) => {
      let result = data.data.data;
      if (result.includes(file.name)) {
        this.uiDocuments[index].uploadSuccess = true;
        this.uiDocuments[index].percentDone = 100;
      }
      this.uiDocuments[index].filePath = file.name;
    });
  }

  deleteDocument(index: number) {
    this.uiDocuments.splice(index, 1);
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

  validDividentForm() {
    if (this.dividentForm.invalid) {
      for (const control of Object.keys(this.dividentForm.controls)) {
        this.dividentForm.controls[control].markAsTouched();
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


  saveMember() {
    if (!this.validPersonalDetailsForm()) {
      this._toastrService.error('Personal details has errors.', 'Error!');
      return;
    }
    if (this.uiNominis.length == 0) {
      this._toastrService.error('Nominis not added.', 'Error!');
      return;
    }
    if (!this.validDividentForm()) {
      this._toastrService.error('Divident details has errors.', 'Error!');
      return;
    }
    if (!this.validDocumentsForm()) {
      this._toastrService.error('Document details has errors.', 'Error!');
      return;
    }

    let memberModel = {} as ICustomerModel;
    memberModel.Id = parseInt(this.memberCode.value.toString());
    memberModel.Title = this.personalTitle.value.toString();
    memberModel.FirstName = this.personalFirstName.value.toString();
    memberModel.MiddleName = this.personalMiddleName.value.toString();
    memberModel.LastName = this.personalLastName.value.toString();
    memberModel.DateOfBirth = this.personalDateOfBirth.value.toString();
    memberModel.Address = this.personalAddress.value.toString();
    memberModel.TahsilId = this.personalTahsil.value.toString();
    memberModel.Pincode = this.personalPincode.value.toString();
    memberModel.Phone = this.personalPhone.value.toString();
    memberModel.Gender = this.personalGender.value.toString();
    memberModel.OccupationId = this.personalOccupation.value.toString();
    memberModel.CastId = this.personalCast.value.toString();
    memberModel.DirectorId = this.personalDirector.value.toString();
    memberModel.AccountNumber = this.personalAccountNumber.value.toString();
    memberModel.AccOpenDate = this.personalAccountopenDate.value.toString();
    memberModel.AuthorisedBy = this.personalAuthorisedBy.value.toString();
    memberModel.Email = this.personalEmail.value.toString();
    memberModel.NumOfShares = this.dividentNoOfShares.value.toString();
    memberModel.ShareValue = this.dividentShareValue.value.toString();
    memberModel.DividentAmount = this.dividentAmount.value.toString();
    memberModel.LoanLimitAmount = this.dividentLoanLimit.value.toString();
    memberModel.AdmissionFeeDate = this.dividentAdmissionFeeDate.value.toString();
    memberModel.Income = this.dividentIncome.value.toString();
    //memberModel.Status = this.stat.value.toString();
    memberModel.BranchId = this._sharedService.applicationUser.branchId;
    memberModel.Nominis = this.uiNominis;
    memberModel.Documents = this.uiDocuments;

    console.log(memberModel);

    if (this.isAddMode) {
      this._memberService.createMember(memberModel).subscribe((data: any) => {
        console.log(data);
        if (data) {
          if (data.statusCode == 200 && data.data.data > 0) {
            this._toastrService.success('Member created.', 'Success!');
            this.clear();
            this.loadForm();
          }
        }
      })
    }
    else {
      this._memberService.updateMember(memberModel.Id, memberModel).subscribe((data: any) => {
        console.log(data);
        if (data) {
          if (data.statusCode == 200 && data.data.data > 0) {
            this._toastrService.success('Member updated.', 'Success!');
            this.clear();
            this.loadForm();
          }
        }
      })
    }
  }

  clearPersonalDetails() {
    this.personalDetailsForm.patchValue({
      personalTitle: this.uiTitles[0].code,
      personalFirstName: "",
      personalMiddleName: "",
      personalLastName: "",
      personalDateOfBirth: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
      personalAge: 0,
      personalAddress: "",
      personalState: this.uiAddressStates[0].id,
      personalDistrict: this.uiAddressDistricts[0].id,
      personalTahsil: this.uiAddressTahshils[0].id,
      personalPincode: "",
      personalPhone: "",
      personalGender: this.uiGenders[0].code,
      personalOccupation: this.uiOccupations[0].id,
      personalCast: this.uiCasts[0].id,
      personalDirector: this.uiDirectors[0].id,
      personalAccountNumber: "",
      personalAccountopenDate: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
      personalAuthorisedBy: "",
      personalEmail: "",
    });
  }

  clearDivident()
  {
    this.dividentForm.patchValue({
      dividentNoOfShares: "",
      dividentShareValue: "",
      dividentTotalShareValue: "",
      dividentAmount: "",
      dividentAdmissionFeeDate: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
      dividentIncome: "",
      dividentLoanLimit: "",
    });
  }

  clearDocuments()
  {
    this.uiDocuments = [];
  }

  clear() {
    this.clearPersonalDetails();
    this.clearNomini();
    this.clearDivident();
    this.clearDocuments();
  }

  calculateAge(dateOfBirth: any) { // birthday is a date
    let currentDate = new Date().getFullYear();
    let dob = new Date(dateOfBirth).getFullYear();
    return Math.abs(currentDate - dob);
  }

  searchMember()
  {
    this.configClick("member-list");
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/' + routeValue]);
  }

  //member
  get memberCode() {
    return this.memberForm.get('memberCode')!;
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
  get nominiSharePercentage() {
    return this.nominiForm.get('nominiSharePercentage')!;
  }
  get nominiGender() {
    return this.nominiForm.get('nominiGender')!;
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
    return this.documentsForm.get('documentSelect')!;
  }
}
