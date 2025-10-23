export interface IBuilding  {
    name: string;
    address?: any;
    isActive: boolean;
    isDeleted: boolean;
    images: string[];
    coordinates?: {
      latitude?: number;
      longitude?: number;
    };
    contactNumbers: string[];
    email?: string;
    buildingDetails?: string;
    createdAt: Date;
    updatedAt: Date;
    _id:string
  }