import { TOrders, TUser } from './user.interface';
import { User } from './user.model';

// Creating a user

const createUserIntoDB = async (userData: TUser) => {
  // if (await User.isUserExists(userData.userId)) {
  //   throw new Error('User Already Exists');
  // }
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
  const result = await User.findOne({ userId });
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

const addANewProductToUser = async (userId: number, orderData: TOrders): Promise<TUser | null> => {

  const existingUser = await User.findOne({ userId });

  if (!existingUser) {
    throw new Error('User not found!');
  }

  const updatedUser = await User.addProductToUser(userId, orderData);
  return updatedUser;
}

export const UserServices = {
  createUserIntoDB,
  getAllUsersFromDB,
  getAnUserFromDB,
  updateAnUserFromDB,
  deleteAnUserFromDB,
  addANewProductToUser,
};
