export class UiValueType
{
    constructor(public id: number, public name: string)
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
    constructor(public id: number, public branchId: number, )
        {   }
}

export interface IGeneralMasterDTO
{
    route: string,
    action: string,
    id: number,
    maxId: number,
    masterId: number,
    masterType: string
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
    PurposeMaster = 1,
    HealthMaster = 2,
    CastMaster = 3, 
    OccupationMaster = 4,
    CategoryMaster = 5,
    RelationMaster = 6,
	VillageMaster = 7,
	ZoneMaster = 8,	
    AccountTypeMaster = 9,
	OperationModeMaster = 10,
	GoldArticleMaster = 11,
	DirectorMaster = 12,
	SanctionByMaster = 13,
	PartyGroupMaster = 14,
    ScheduleMaster = 15
}