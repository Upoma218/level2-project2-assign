import { TUser } from "./user.interface";
import { User } from "./user.model";

const createUserIntoDB = async (userData: TUser) => {

   /*  if(await User.isUserExists(userData.userId)){
      throw new Error('User Already Exists')
    } */

    const result = await User.create(userData);
    return result;

  };

  export const UserServices = {
    createUserIntoDB
  }