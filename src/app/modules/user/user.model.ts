import {
  TAddress,
  TFullName,
  TOrders,
  TUser,
  UserModel,
} from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';
import { Schema, model } from 'mongoose';

const fullNameSchema = new Schema<TFullName>({
  firstName: {
    type: String,
    required: [true, 'Please, enter your first name'],
    maxlength: [20, "First Name can't be more than 20 charactors"],
  },
  lastName: {
    type: String,
    required: [true, 'Please, enter your last name'],
    maxlength: [20, "Last Name can't be more than 20 charactors"],
  },
});

const addressSchema = new Schema<TAddress>({
  street: {
    type: String,
    required: [true, 'Street name is required'],
  },
  city: {
    type: String,
    required: [true, 'City name is required'],
  },
  country: {
    type: String,
    required: [true, 'Country name is required'],
  },
});

const ordersSchema = new Schema<TOrders>({
  productName: {
    type: String,
    required: [true, 'Product name is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    minlength: 0,
  },
  quantity: {
    type: Number,
    required: [true, 'Please, enter the the amount of product'],
    minlength: [1, 'Please , select mininum 1 product'],
  },
});

// creating user schema

const userSchema = new Schema<TUser, UserModel>({
  userId: {
    type: Number,
    required: [true, 'User ID is required'],
    unique: true,
  },
  username: {
    type: String,
    required: [true, 'User Name is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'User password is required'],
  },
  fullName: {
    type: fullNameSchema,
    required: [true, "User's full name is required"],
  },
  age: {
    type: Number,
    required: [true, 'Please enter your age'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
  },
  isActive: {
    type: Boolean,
    default: true,
    required: [true, 'isActive status is required'],
  },
  hobbies: {
    type: [String],
    minlength: [1, 'Please enter atleast one of your hobbies'],
    required: [true, 'Giving mininum one hobby is required'],
  },
  address: {
    type: addressSchema,
    required: [true, 'Please, enter your address'],
  },
  orders: {
    type: [ordersSchema],
  },
});

// secured password using bcrypt

userSchema.pre('save', async function (next) {
  const user = this as TUser;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});
userSchema.post('save', function(doc, next) {
  next()
})

userSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret._id;
    delete ret.__v;
    delete ret.address._id;
    delete ret.fullName._id;
    if (ret.orders && Array.isArray(ret.orders)) {
      ret.orders.forEach((order) => {
        delete order._id;
      });
    }
    return ret;
  },
});

userSchema.statics.isUserExists = async function userCheck(userId: number) {
  const existingUser = await User.findOne({ userId });
  return existingUser;
};

userSchema.statics.updateUser = async function (
  userId: number,
  updatedUserData: Partial<TUser>,
): Promise<TUser | null> {
  
  const updatedUser = await this.findOneAndUpdate(
    { userId },
    { $set: updatedUserData },
    { new: true },
  );


  return updatedUser;
};

// creating user model

userSchema.statics.addProductToUser = async function (
  userId: number,
  orderData: TOrders,
): Promise<TUser | null> {
  const updatedUser = await this.findOneAndUpdate(
    { userId },
    { $push: { orders: orderData } },
    { new: true },
  );

  if (!updatedUser) {
    throw new Error('User not found!');
  }

  return updatedUser;
};

export const User = model<TUser, UserModel>('User', userSchema);
