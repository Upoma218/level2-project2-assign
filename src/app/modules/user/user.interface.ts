/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type TFullName = {
  firstName: string;
  lastName: string;
};

export type TAddress = {
  street: string;
  city: string;
  country: string;
};

export type TOrders = {
  productName: string;
  price: number;
  quantity: number;
};

// creating user type

export type TUser = {
  userId: number;
  username: string;
  password: string;
  fullName: TFullName;
  age: number;
  email: string;
  isActive: boolean;
  hobbies: string[];
  address: TAddress;
  orders?: TOrders[];
};

// Static method

export interface UserModel extends Model<TUser> {
  updateUser(
    userId: number,
    updatedUserData: Partial<TUser>,
  ): Promise<TUser | null>;
  isUserExists(userId: number): Promise<TUser | null>;
  addProductToUser(userId: number, orderData: TOrders): Promise<TUser | null>;
}
