export interface IBuilding  {
    buildingName: string;
    address?: string;
    city: string;
    area: string;
    isActive: boolean;
    isDeleted: boolean;
    contactNumbers: string[];
    packages?: Array<{
      packageId: any;
      prices: Array<{
        vehicleType: any;
        price: number;
      }>;
    }>;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
  }