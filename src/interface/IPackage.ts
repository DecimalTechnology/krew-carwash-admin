export interface IPackage  {
    name: string;
    frequency: "1 Time" | "8 Times" | "12 Times";
    description?: string;
    basePrices: any
    isActive: boolean;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    _id:string
  }