import { UserValidationSchema } from './user.validation';
import { UserServices } from './user.service';
import { User } from './user.model';
import { Request, Response } from 'express';

// Creating a user

const createUser = async (req: Request, res: Response) => {
  try {
    const user = req.body;
    
   //user validation with zod
    const zodParseData = UserValidationSchema.userValidationSchema.parse(user);
    const result = await UserServices.createUserIntoDB(zodParseData);

    res.status(200).json({
      success: true,
      message: 'User created successfully!',
      data: result,
    });
  
  } catch (err ) {
    
    res.status(500).json({
      success: false,
      message: 'User not found',
      error: {
        code: 404,
        description: 'User not found!',
      },
    });
  }
};

// Getting all users
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
    const updatedUserData = req.body;
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
      message: 'User not found',
      error: {
        code: 404,
        description: 'User not found!',
      },
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

    const updatedUser = await UserServices.addANewProductToUser(
      parseInt,
      zodParseOrderData,
    );

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
  } catch (err) {
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

// Getting orders of an user
const getAllOrdersOfUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const parseInt = parseFloat(userId);
    const result = await UserServices.getUserOrdersFromDB(parseInt);

    res.status(200).json({
      success: true,
      message: 'Orders fetched successfully!',
      data: {
        orders: result,
      },
    });
  } catch (err) {
    res.status(404).json({
      message: 'User not found',
      error: {
        code: 404,
        description: 'User not found!',
      },
    });
  }
};

const getTotalPriceOfProducts = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const parseInt = parseFloat(userId);
    const totalPrice = await UserServices.getTotalPriceOfProducts(parseInt);
   
    res.status(200).json({
      success: true,
      message: 'Total price calculated successfully!',
      data: {
        totalPrice,
      },
    });
  } catch (err) {
    res.status(404).json({
      message: 'User not found or there is no order for this user',
      error: {
        code: 404,
        description: 'User not found!',
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
  getAllOrdersOfUser,
  getTotalPriceOfProducts,
};
