import { z } from 'zod';

const fullNameSchema = z.object({
  firstName: z.string().min(1).max(20),
  lastName: z.string().min(1).max(20),
});

const addressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
});

const orderSchema = z.object({
  productName: z.string().min(1),
  price: z.number().min(0),
  quantity: z.number().min(1),
});
// ZOD user validation schema

const userValidationSchema = z.object({
  userId: z.number(),
  username: z.string().min(1),
  password: z.string().min(1),
  fullName: fullNameSchema,
  age: z.number().min(1),
  email: z.string().min(1),
  isActive: z.boolean(),
  hobbies: z.array(z.string()).min(1),
  address: addressSchema,
  orders: z.array(orderSchema).optional(),
});

export const UserValidationSchema = {
  userValidationSchema,
  orderSchema
};
