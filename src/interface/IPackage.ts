export interface IBasePrice {
  vehicleType: {
    _id: string;
    name: string;
  };
  price: number;
}

export interface IPackage {
  _id: string;
  name: string;
  frequency: "1 Time" | "8 Times" | "12 Times";
  description: string;
  basePrices: IBasePrice[];
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

