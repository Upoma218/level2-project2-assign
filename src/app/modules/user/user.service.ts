import { TOrders, TUser } from './user.interface';
import { User } from './user.model';

// Creating a user

const createUserIntoDB = async (userData: TUser) => {
  if (await User.isUserExists(userData.userId)) {
    throw new Error('User Already Exists');
  }

  const result = await User.create(userData);
  return result;
};

// getting all users

const getAllUsersFromDB = async () => {
  const users: TUser[] = await User.aggregate([
    {
      $project: {
        _id: 0,
        username: 1,
        fullName: {
          firstName: 1,
          lastName: 1,
        },
        age: 1,
        email: 1,
        address: {
          street: 1,
          city: 1,
          country: 1,
        },
      },
    },
  ]);
  return users;
};

// Getting an user

const getAnUserFromDB = async (userId: number) => {
  const result = await User.aggregate([
    {
      $match: { userId: { $eq: userId } },
    },
    {
      $project: {
        _id: 0,
        userId: 1,
        username: 1,
        fullName: {
          firstName: 1,
          lastName: 1,
        },
        age: 1,
        email: 1,
        isActive: 1,
        hobbies: 1,
        address: {
          street: 1,
          city: 1,
          country: 1,
        },
      },
    },
  ]);
  return result;
};

// Updating the user

const updateAnUserFromDB = async (
  userId: number,
  updatedUserData: Partial<TUser>,
): Promise<TUser | null> => {
  const existingUser = await User.findOne({ userId });

  if (!existingUser) {
    throw new Error('User not found!');
  }

  const updatedUser = await User.updateUser(userId, updatedUserData);

  return updatedUser;
};

// Deleting the user

const deleteAnUserFromDB = async (userId: number): Promise<void> => {
  const existingUser = await User.findOne({ userId });

  if (!existingUser) {
    throw new Error('User not found!');
  }
  await User.deleteOne({ userId });
};

// Adding a new product

const addANewProductToUser = async (
  userId: number,
  orderData: TOrders,
): Promise<TUser | null> => {
  const existingUser = await User.findOne({ userId });

  if (!existingUser) {
    throw new Error('User not found!');
  }

  const updatedUser = await User.addProductToUser(userId, orderData);
  return updatedUser;
};

const getUserOrdersFromDB = async (userId: number) => {
  const result = await User.aggregate([
    { $match: { userId: userId } },
    {
      $project: {
        _id: 0,
        orders: {
          $map: {
            input: '$orders',
            as: 'order',
            in: {
              productName: '$$order.productName',
              price: '$$order.price',
              quantity: '$$order.quantity',
            },
          },
        },
      },
    },
  ]);

  const orders = result[0].orders || [];

  return orders;
};

const getTotalPriceOfProducts = async (userId: number) => {
  const result = await User.aggregate([
    {
      $match: { userId: userId },
    },
    {
      $unwind: '$orders',
    },
    {
      $group: {
        _id: null,
        totalAmount: {
          $sum: {
            $multiply: ['$orders.price', '$orders.quantity'],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalAmount: 1,
      },
    },
  ]);

  const totalAmount = result[0].totalAmount || 0;

  return totalAmount;
};

export const UserServices = {
  createUserIntoDB,
  getAllUsersFromDB,
  getAnUserFromDB,
  updateAnUserFromDB,
  deleteAnUserFromDB,
  addANewProductToUser,
  getUserOrdersFromDB,
  getTotalPriceOfProducts,
};
