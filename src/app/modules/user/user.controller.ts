import { Request, Response } from 'express';
import userValidationSchema from './user.validation';
import { UserServices } from './user.service';

const createUser = async (req: Request, res: Response) => {
  try {
    const { user: userData } = req.body;

    // data validation using zod

    const zodParseData = userValidationSchema.parse(userData);
    const result = await UserServices.createUserIntoDB(zodParseData);

    res.status(200).json({
      success: true,
      message: 'User created successfully!',
      data: result,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to create a new user!',
      data: err,
    });
  }
};

export const UserController = {
  createUser,
  // getUsers,
  // getAnUser,
  // updateAnUser,
  // deleteAnUser,
  // getAllOrdersOfUser,
  // getTotalPriceOfProducts,
  // getTotalPriceOfProducts
};
