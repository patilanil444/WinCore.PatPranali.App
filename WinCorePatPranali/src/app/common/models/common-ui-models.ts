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