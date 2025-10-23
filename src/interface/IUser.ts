export interface IUser  {
    name: string;
    email: string;
    password: string;
    phone: number;
    isActive: boolean;
    role: string;
    image?: string;
    isDeleted: boolean;
    verificationMethod: string;
    isVerified: boolean;
    _id:string;
    createdAt:string;
    updatedAt:string
}
