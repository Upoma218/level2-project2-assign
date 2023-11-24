import { Request, Response } from 'express';
import { UserValidationSchema} from './user.validation';
import { UserServices } from './user.service';
import { User } from './user.model';

// Creating a user

const createUser = async (req: Request, res: Response) => {

  try {

    const { user: userData } = req.body;

    // data validation using zod
    const zodParseData = UserValidationSchema.userValidationSchema.parse(userData);
    const result = await UserServices.createUserIntoDB(zodParseData);

    // when I will give post request for users, orders property won't be shown in response
    if (!userData.orders) {
      zodParseData.orders = undefined;
    }

    res.status(200).json({
      success: true,
      message: 'User created successfully!',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message||'Failed to create a new user!',
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


// Adding product

const addANewProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const parseInt = parseFloat(userId);
    const { productName, price, quantity } = req.body;

    const zodParseOrderData = UserValidationSchema.orderSchema.parse({
      productName,
      price,
      quantity,
    });

    const updatedUser = await UserServices.addANewProductToUser(parseInt, zodParseOrderData);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: {
          code: 404,
          description: 'User not found!',
        },
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order created successfully!',
      data: null,
    });
  } 
  catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to add a new product',
      error: {
        code: 500,
        description: 'Failed to add a new product',
      },
    });
  }
};



export const UserController = {
  createUser,
  getAllUsers,
  getAnUser,
  updateAnUser,
  deleteAnUser,
  addANewProduct,
  // getAllOrdersOfUser,
  // getTotalPriceOfProducts
};
