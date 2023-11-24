import { Request, Response } from 'express';
import userValidationSchema from './user.validation';
import { UserServices } from './user.service';
import { User } from './user.model';

// Creating a user

const createUser = async (req: Request, res: Response) => {
  try {
    const { user: userData } = req.body;

    // data validation using zod

    const zodParseData = userValidationSchema.parse(userData);
    const result = await UserServices.createUserIntoDB(zodParseData);

    // when I will give post request for users, orders property won't be showed in response
    if (!userData.orders) {
      zodParseData.orders = undefined;
    }

    res.status(200).json({
      success: true,
      message: 'User created successfully!',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to create a new user!',
      data: err,
    });
  }
};

// getting all users
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await UserServices.getAllUsersFromDB();
    res.status(200).json({
      success: true,
      message: 'Users fetched successfully!',
      data: result,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: 'User not found',
      error: {
        code: 404,
        description: 'User not found!',
      },
    });
  }
};

// Getting an user
const getAnUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const parseInt = parseFloat(userId);
    const result = await UserServices.getAnUserFromDB(parseInt);

    res.status(200).json({
      success: true,
      message: 'User fetched successfully!',
      data: result,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: 'User not found',
      error: {
        code: 404,
        description: 'User not found!',
      },
    });
  }
};

// Updating the user
const updateAnUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const parseInt = parseFloat(userId);
    const updatedUserData = req.body.user;

    const result = await UserServices.updateAnUserFromDB(
      parseInt,
      updatedUserData,
    );

    res.status(200).json({
      success: true,
      message: 'User updated successfully!',
      data: result,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: 'User not found',
      error: {
        code: 404,
        description: 'User not found!',
      },
    });
  }
};

// Deleting the user

const deleteAnUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const parseInt = parseFloat(userId);

    // Check if the user exists
    const existingUser = await UserServices.getAnUserFromDB(parseInt);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: {
          code: 404,
          description: 'User not found!',
        },
      });
    }

    await User.deleteOne({ userId: parseInt });

    res.status(200).json({
      success: true,
      message: 'User deleted successfully!',
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete the user!',
      data: err,
    });
  }
};

export const UserController = {
  createUser,
  getAllUsers,
  getAnUser,
  updateAnUser,
  deleteAnUser,
  // getAllOrdersOfUser,
  // getTotalPriceOfProducts,
  // getTotalPriceOfProducts
};
