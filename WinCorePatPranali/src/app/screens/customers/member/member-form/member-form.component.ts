import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { CustomerDeclarations } from 'src/app/common/customer-declarations';
import { IGeneralDTO, UiEnumGeneralMaster } from 'src/app/common/models/common-ui-models';
import { MemberService } from 'src/app/services/customers/member/member.service';
import { GeneralMasterService } from 'src/app/services/masters/general-master/general-master.service';
import { SharedService } from 'src/app/services/shared.service';

interface IMemberModel {
  MemberId: number;
  Title: number;
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
  BranchCode: number;
  Createdby: number;
  MemberNominees: any[];
  MemberDocuments: any[];
}

interface IMemberNominee {
  Id: number;
  SrNo: number;
  CustomerId: number;
  NomineeName: string;
  NomineeAddress: string;
  BirthDate: Date;
  Relation: number;
  Guardian: string;
  Percentage: number;
  Phone: string;
  Createdby: number;
  Status: string;
}

export interface UiNomini {
  id: number,
  memberId: number,
  title: string,
  name: string,
  relationId: number,
  relationName: string,
  phone: string,
  address: string,
  percentage: string,
  guardian: string,
  birthDate: Date,
  birthDateText: string | null;
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

  datepickerConfig: BsDatepickerConfig;
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
  maharashtraStateId = 21;

  dto: IGeneralDTO = {} as IGeneralDTO;

  constructor(private router: Router, private _memberService: MemberService, private _sharedService: SharedService,
    private _generalMasterService: GeneralMasterService, private _toastrService: ToastrService, private datePipe: DatePipe) { }

  ngOnInit(): void {

    this.datepickerConfig = this._sharedService.getDatepickerConfig();
    this.maxDate = new Date();
    this.uiGenders = this.retrieveMasters(UiEnumGeneralMaster.GENDER);
    this.uiTitles = this.retrieveMasters(UiEnumGeneralMaster.TITLE);
    this.uiOccupations = this.retrieveMasters(UiEnumGeneralMaster.OCCUPTION);
    this.uiCasts = this.retrieveMasters(UiEnumGeneralMaster.CASTE);
    this.uiRelations = this.retrieveMasters(UiEnumGeneralMaster.RELATION);

    this.uiAllStates = this._sharedService.uiAllStates;
    this.uiAllDistricts = this._sharedService.uiAllDistricts;
    this.uiAllTahshils = this._sharedService.uiAllTalukas;

    this.uiDocumentTypes = CustomerDeclarations.documents;



    this.personalDetailsForm = new FormGroup({
      memberCode: new FormControl("", []),
      personalTitle: new FormControl(this.uiTitles[0].constantNo, [Validators.required]),
      personalFirstName: new FormControl("", [Validators.required]),
      personalMiddleName: new FormControl("", []),
      personalLastName: new FormControl("", [Validators.required]),
      personalDateOfBirth: new FormControl(new Date(Date.now()), []),
      personalAge: new FormControl("", []),
      personalAddress: new FormControl("", [Validators.required]),
      personalState: new FormControl("", []),
      personalDistrict: new FormControl("", []),
      personalTahsil: new FormControl("", [Validators.required]),
      personalPincode: new FormControl("", [Validators.required]),
      personalPhone: new FormControl("", [Validators.required]),
      personalGender: new FormControl(this.uiGenders[0].constantNo, [Validators.required]),
      personalOccupation: new FormControl(this.uiOccupations[0].constantNo, []),
      personalCast: new FormControl(this.uiCasts[0].constantNo, []),
      personalDirector: new FormControl("", []),
      personalAccountNumber: new FormControl("", [Validators.required]),
      personalAccountopenDate: new FormControl(new Date(Date.now()), []),
      personalAuthorisedBy: new FormControl("", [Validators.required]),
      personalEmail: new FormControl("", [Validators.pattern("[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}")]),
    });


    this.nominiForm = new FormGroup({
      nominiTitle: new FormControl(this.uiTitles[0].constantNo, [Validators.required]),
      nominiName: new FormControl("", [Validators.required]),
      nominiRelation: new FormControl(this.uiRelations[0].constantNo, [Validators.required]),
      nominiAddress: new FormControl("", [Validators.required]),
      nominiDateOfBirth: new FormControl(new Date(Date.now()), [Validators.required]),
      nominiSharePercentage: new FormControl(100, [Validators.required]),
      nominiGuardian: new FormControl("", []),
      nominiPhone: new FormControl("", [Validators.required]),
    });

    this.dividentForm = new FormGroup({
      dividentNoOfShares: new FormControl("", [Validators.required]),
      dividentShareValue: new FormControl("", [Validators.required]),
      dividentTotalShareValue: new FormControl("", [Validators.required]),
      dividentAmount: new FormControl("", [Validators.required]),
      dividentAdmissionFeeDate: new FormControl(new Date(Date.now()), []),
      dividentIncome: new FormControl("", [Validators.required]),
      dividentLoanLimit: new FormControl("", [Validators.required]),
    });

    this.documentsForm = new FormGroup({
      documentSelect: new FormControl(this.uiDocumentTypes[2].code, [Validators.required]),
    });

    this.loadDirectors().then(() => {
      this.loadForm();
    })
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
    // this.uiNominiStates = this._sharedService.uiAllStates;
    // this.uiAllDistricts = this._sharedService.uiAllDistricts;
    // this.uiAllTahshils = this._sharedService.uiAllTalukas;

    if (this.uiAddressStates && this.uiAddressStates.length) {
      // set Maharashtra as default state 
      let states = this.uiAddressStates.filter(s => s.id == this.maharashtraStateId);
      if (states && states.length) {
        this.personalDetailsForm.patchValue({
          personalState: states[0].id,
        })
      }
    }

    if (this.uiAddressStates && this.uiAddressStates.length) {
      let districts = this.uiAllDistricts.filter((d: any) => d.stateId == this.maharashtraStateId);
      if (districts) {
        this.uiAddressDistricts = districts;
        this.personalDetailsForm.patchValue({
          personalDistrict: districts[0].id,
        })
      }
    }

    if (this.uiAddressDistricts && this.uiAddressDistricts.length) {
      let tahshils = this.uiAllTahshils.filter((d: any) => d.districtId == this.uiAddressDistricts[0].id);
      if (tahshils) {
        this.uiAddressTahshils = tahshils;
        this.personalDetailsForm.patchValue({
          personalTahsil: tahshils[0].id,
        })
      }
    }


    this._memberService.getDTO().subscribe((obj: any) => this.dto = obj);
    if (this.dto) {
      this.personalDetailsForm.patchValue({
        personalOccupation: this.uiOccupations[0].constantNo,
        personalDirector: this.uiDirectors[0].id,
        //personalState: this.uiAddressStates[0].id,
        //personalDistrict: this.uiAddressDistricts[0].id,
        //personalTahsil: this.uiAddressTahshils[0].id,
        personalAge: this.calculateAge(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
      })

      this.id = this.dto.id;
      if (this.dto.id == 0 || this.dto.id == undefined) {
        // Add Mode
        this.isAddMode = true;

        // TODO:
        this._memberService.getMaxMemberId(this._sharedService.applicationUser.branchId).subscribe((data: any) => {
          let maxCustId = data.data.data;
          this.maxId = maxCustId;
          this.personalDetailsForm.patchValue({
            memberCode: this._sharedService.applicationUser.branchId + this.maxId.toString().padStart(5, '0'),
          });
        });
      }
      else {
        // Edit Mode
        this.isAddMode = false;
        this._memberService.getMember(this._sharedService.applicationUser.branchId, this.dto.id).subscribe((data: any) => {

          if (data) {
            if (data.statusCode == 200 && data.data.data) {
              var member = data.data.data;

              this.personalDetailsForm.patchValue({
                memberCode: member.memberCodeStr,
                personalTitle: member.title,
                personalFirstName: member.firstName,
                personalMiddleName: member.middleName,
                personalLastName: member.lastName,
                personalDateOfBirth: new Date(member.dateOfBirth),
                personalAge: this.calculateAge(member.dateOfBirth),
                personalAddress: member.address,
                // personalState: district.stateId,
                // personalDistrict: district.id,
                // personalTahsil: member.tahsilId,
                personalPincode: member.pincode,
                personalPhone: member.phone,
                personalGender: Number(member.gender),
                personalOccupation: member.occupationId,
                personalCast: member.castId,
                personalDirector: member.directorId,
                personalAccountNumber: member.accountNumber,
                personalAccountopenDate: new Date(member.accOpenDate),
                personalAuthorisedBy: member.authorisedBy,
                personalEmail: member.email,
              });

              let tahshils = this.uiAllTahshils.filter((d: any) => d.id == member.tahsilId);
              let districts = [];
              let tashils = [];
               if (tahshils.length) {
                districts = this.uiAllDistricts.filter((d: any) => d.id == tahshils[0].districtId);
                tashils = this.uiAllTahshils.filter((d: any) => d.districtId == tahshils[0].districtId);
                if (districts.length && tashils.length) {
                  this.uiAddressDistricts = districts;
                  this.uiAddressTahshils = tashils;
                  this.personalDetailsForm.patchValue({
                    personalTahsil: member.tahsilId,
                    personalDistrict: districts[0].id,
                  });
                }
              }

              this.nominiForm.patchValue({
                nominiDateOfBirth: new Date(Date.now()),
              });

              this.uiNominis = member.memberNominees.map((nomini: any) => (
                {
                  ...nomini,
                  name: nomini.nomineeName,
                  relationId: nomini.relationId,
                  relationName: this.uiRelations.filter(r => r.constantNo == nomini.relation)[0].constantname,
                  birthDateText: this.datePipe.transform(nomini.birthDate, 'dd-MM-yyyy'),
                  birthDate: new Date(nomini.birthDate),
                  id: nomini.id,
                  nominiDateOfBirth: new Date(nomini.birthDate)
                }));

              this.dividentForm.patchValue({
                dividentNoOfShares: member.numOfShares,
                dividentShareValue: member.shareValue,
                dividentTotalShareValue: parseFloat(member.shareValue) * parseFloat(member.numOfShares),
                dividentAmount: member.dividentAmount,
                dividentAdmissionFeeDate: new Date(member.admissionFeeDate),
                dividentIncome: member.income,
                dividentLoanLimit: member.loanLimitAmount,
              });

              if (member.documents) {
                member.documents.forEach((doc: any) => {
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

  loadDirectors() {
    return new Promise((resolve, reject) => {
      this._memberService.getDirectors().subscribe((directors: any) => {
        if (directors) {
          if (directors.statusCode == 200 && directors.data.data) {
            this.uiDirectors = directors.data.data;
            resolve(true);
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

  onPersonalDOBChange(event: any) {

    if (!event || !event.target || !event.target.value) {
      this.personalDetailsForm.patchValue({
        personalAge: 0
      });
      return;
    }

    const [day, month, year] = event.target.value.split('-').map(Number);
    // Create Date object
    const targetValue = new Date(year, month - 1, day); // month is 0-based
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
    if (!event || !event.target || !event.target.value) {
      this.nominiForm.patchValue({
        nominiAge: 0
      });
      return;
    }
    
    const [day, month, year] = event.target.value.split('-').map(Number);
    // Create Date object
    const targetValue = new Date(year, month - 1, day); // month is 0-based
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

       let nominiIndex = this.uiNominis.findIndex(nomini =>
        nomini.nomineeName.toLowerCase() == this.nominiName.value.toLowerCase());

      let totalPercentage = this.uiNominis.reduce((sum, nomini) => sum + parseInt(nomini.percentage), 0);
      if (nominiIndex > -1) {
        totalPercentage = totalPercentage - this.uiNominis[nominiIndex].percentage;
      }
      if (totalPercentage >= 100) {
        this._toastrService.warning('Total percentage for nomini exceeded.', 'Warning!');
        return;
      }

      if (parseFloat(this.nominiSharePercentage.value) + totalPercentage > 100) {
        this._toastrService.warning('Total percentage for nomini exceeded.', 'Warning!');
        return;
      }

      let relation = "";
      let uiRelation = this.uiRelations.filter(r => r.constantNo == parseInt(this.nominiRelation.value.toString()));
      if (uiRelation) {
        relation = uiRelation[0].constantname;
      }

      if (nominiIndex > -1) {
        let uiNomini = this.uiNominis[nominiIndex];
        uiNomini.title = this.nominiTitle.value.toString();
        uiNomini.name = this.nominiName.value.toString();
      
        uiNomini.relationId = this.nominiRelation.value.toString();
        uiNomini.relationName = relation;
        uiNomini.phone = this.nominiPhone.value.toString();
        uiNomini.address = this.nominiAddress.value.toString();
        uiNomini.percentage = this.nominiSharePercentage.value.toString();
        uiNomini.guardian = this.nominiGuardian.value.toString();
        uiNomini.birthDate = new Date(this.nominiDateOfBirth.value.toString());
        uiNomini.birthDateText = this.datePipe.transform(uiNomini.birthDate, 'dd-MM-yyyy');
      }
      else {
        let uiNomini = {} as UiNomini;
        uiNomini.id = this.uiNominis.length + 1;
        uiNomini.title = this.nominiTitle.value.toString();
        uiNomini.name = this.nominiName.value.toString();
        uiNomini.relationId = this.nominiRelation.value.toString();
        uiNomini.relationName = relation;
        uiNomini.phone = this.nominiPhone.value.toString();
        uiNomini.address = this.nominiAddress.value.toString();
        uiNomini.percentage = this.nominiSharePercentage.value.toString();
        uiNomini.guardian = this.nominiGuardian.value.toString();
        uiNomini.birthDate = new Date(this.nominiDateOfBirth.value.toString());
        uiNomini.birthDateText = this.datePipe.transform(this.nominiDateOfBirth.value, 'dd-MM-yyyy');
        this.uiNominis.push(uiNomini);
      }

      this.clearNomini();
    }
  }

  clearNomini() {
    this.nominiForm.patchValue({
      nominiTitle: this.uiTitles[0].constantNo,
      nominiName: "",
      nominiRelation: this.uiRelations[0].constantNo,
      nominiAddress: "",
      nominiSharePercentage: 100,
      nominiGuardian: "",
      nominiDateOfBirth: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
      nominiPhone: "",
    });
  }

  editNomini(uiNomini: any, ind: number) {

    this.nominiForm.patchValue({
      nominiName: uiNomini.name,
      nominiRelation: parseInt(uiNomini.relation),
      nominiAddress: uiNomini.nomineeAddress,
      nominiDateOfBirth: formatDate(new Date(uiNomini.birthDate), 'yyyy-MM-dd', 'en'),
      nominiSharePercentage: uiNomini.percentage,
      nominiGuardian: uiNomini.guardian,
      nominiPhone: uiNomini.phone
    });
  }

  deleteNomini(uiNomini: any, ind: number) {
    this.uiNominis.splice(ind, 1);
  }

  calculateTotalShareValue() {
    this.dividentForm.patchValue({
      dividentTotalShareValue: new FormControl("", [])
    })

    let numberOfShares = this.dividentNoOfShares.value;
    let shareValue = this.dividentShareValue.value;
    if (parseFloat(numberOfShares) > 0 && parseFloat(shareValue) > 0) {
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

    let memberModel = {} as IMemberModel;
    memberModel.MemberId = this.dto.id;
    memberModel.Title = this.personalTitle.value.toString();
    memberModel.FirstName = this.personalFirstName.value.toString();
    memberModel.MiddleName = this.personalMiddleName.value.toString();
    memberModel.LastName = this.personalLastName.value.toString();
    memberModel.DateOfBirth = new Date(this.personalDateOfBirth.value.toString());
    memberModel.Address = this.personalAddress.value.toString();
    memberModel.TahsilId = this.personalTahsil.value.toString();
    memberModel.Pincode = this.personalPincode.value.toString();
    memberModel.Phone = this.personalPhone.value.toString();
    memberModel.Gender = this.personalGender.value.toString();
    memberModel.OccupationId = this.personalOccupation.value.toString();
    memberModel.CastId = this.personalCast.value.toString();
    memberModel.DirectorId = this.personalDirector.value.toString();
    memberModel.AccountNumber = this.personalAccountNumber.value.toString();
    memberModel.AccOpenDate = new Date(this.personalAccountopenDate.value.toString());
    memberModel.AuthorisedBy = this.personalAuthorisedBy.value.toString();
    memberModel.Email = this.personalEmail.value.toString();
    memberModel.NumOfShares = this.dividentNoOfShares.value.toString();
    memberModel.ShareValue = this.dividentShareValue.value.toString();
    memberModel.DividentAmount = this.dividentAmount.value.toString();
    memberModel.LoanLimitAmount = this.dividentLoanLimit.value.toString();
    memberModel.AdmissionFeeDate = new Date(this.dividentAdmissionFeeDate.value.toString());
    memberModel.Income = this.dividentIncome.value.toString();
    //memberModel.Status = this.stat.value.toString();
    memberModel.BranchCode = this._sharedService.applicationUser.branchId;
    memberModel.Createdby = this._sharedService.applicationUser.id;

    let memberNomini = {} as IMemberNominee;
    memberModel.MemberNominees = [];
    this.uiNominis.forEach(nom => {
      memberNomini = {} as IMemberNominee;
      memberNomini.Id =  nom.id;
      memberNomini.SrNo =  nom.srNo;
      memberNomini.CustomerId = this.dto.id;
      memberNomini.BirthDate = nom.birthDate;
      memberNomini.NomineeAddress = nom.address;
      memberNomini.NomineeName = nom.name;
      memberNomini.Createdby = this._sharedService.applicationUser.id;
      memberNomini.Percentage = nom.percentage;
      memberNomini.Phone = nom.phone;
      memberNomini.Relation = nom.relationId;
      memberNomini.Guardian = nom.guardian;
      memberNomini.Status = nom.status;
      memberModel.MemberNominees.push(memberNomini);
    });

    memberModel.MemberDocuments = this.uiDocuments;

    // console.log(memberModel);

    this._memberService.saveMember(memberModel).subscribe((data: any) => {
      if (data) {
        if (data.statusCode == 200 && data.data.data.retId > 0) {
          this._toastrService.success('Member saved.', 'Success!');
          this.clear();
          this.loadForm();
        }
      }
    })
  }

  clearPersonalDetails() {
    this.personalDetailsForm.patchValue({
      personalTitle: this.uiTitles[0].constantNo,
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
      personalGender: this.uiGenders[0].constantNo,
      personalOccupation: this.uiOccupations[0].constantNo,
      personalCast: this.uiCasts[0].constantNo,
      personalDirector: this.uiDirectors[0].id,
      personalAccountNumber: "",
      personalAccountopenDate: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
      personalAuthorisedBy: "",
      personalEmail: "",
    });
  }

  clearDivident() {
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

  clearDocuments() {
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

  searchMember() {
    this.configClick("member-list");
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/' + routeValue]);
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
  get nominiName() {
    return this.nominiForm.get('nominiName')!;
  }
  get nominiRelation() {
    return this.nominiForm.get('nominiRelation')!;
  }
  get nominiAddress() {
    return this.nominiForm.get('nominiAddress')!;
  }
  get nominiDateOfBirth() {
    return this.nominiForm.get('nominiDateOfBirth')!;
  }
  get nominiSharePercentage() {
    return this.nominiForm.get('nominiSharePercentage')!;
  }
  get nominiGuardian() {
    return this.nominiForm.get('nominiGuardian')!;
  }
  get nominiPhone() {
    return this.nominiForm.get('nominiPhone')!;
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
