export class UiValueType {
    //public description: string;
    constructor(public id: number, public name: string) {
        //this.description = id + "-" + name;
    }
}

export class UiStaticType
{
    constructor(public id: number,public code: string, public name: string)
        {   }
}


export enum NodeType{
    Customer = 0,
    Location = 1,
    Building = 2,
    Floor = 3,
    Wing = 4,
    Room = 5,
    Equipment = 6,
    Meter = 7
}


export class UiUser
{
    constructor(public id: number, public branchId: number, public userName: string )
        {   }
}

export interface IGeneralMasterDTO
{
    route: string,
    action: string,
    id: number,
    maxId: number,
    masterId: number,
    constantNo: number,
    masterType: string,
    fullName: string,
    shortName: string
}

export interface IGeneralLedgerDTO
{
    route: string,
    action: string,
    id: number,
    maxId: number,
}

export interface IGeneralDTO
{
    route: string,
    action: string,
    id: number,
    maxId: number,
}

export enum UiEnumGeneralMaster {
    GENDER = 1,
    TITLE = 2,
    ACTYPE = 3,
    CASTE = 4,
    CATEGORY = 5,
    ZONE = 6,
    CUSTOMERGROUP = 7,
    INSURANCE = 8,
    HEALTH = 9,
    PURPOSE = 10,
    RELATION = 11,
    RELIGION = 12,
    RESON = 13,
    OCCUPTION = 14,
    VEHICLE = 15,
    GLTYPE = 16,
    YN = 17,
    MARITIALSTATUS = 18,
    EDUCATION = 19,
    NATIONALITY = 20,
    ADDRESSTYPE = 21,
    OPRMODE = 22,
    GLGROUP = 23,
    SCHEDULE = 24,
    TDSREASON = 25
    // GENDER = 1,
    // TITLE = 2,
    // ACTYPE = 3,
    // CASTE = 4,
    // CATEGORY = 5,
    // ZONE = 6,
    // CUSTOMERGROUP = 7,
    // INSURANCE = 8,
    // HEALTH = 9,
    // PURPOSE = 10,
    // RELATION = 11,
    // RELIGION = 12,
    // RESON = 13,
    // OCCUPTION = 14,
    // VEHICLE = 15,
    // GLTYPE = 16,
    // YN = 17,
    // MARITIALSTATUS = 18,
    // EDUCATION = 19,
    // NATIONALITY = 20,
    // ADDRESSTYPE = 21,
    // OPRMODE = 22
}