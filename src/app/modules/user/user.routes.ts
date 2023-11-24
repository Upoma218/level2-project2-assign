import express from 'express';
import { UserController } from './user.controller';

const router = express.Router();

// Users routes

router.post('/', UserController.createUser);
router.get('/', UserController.getAllUsers);
router.get('/:userId', UserController.getAnUser);
router.put('/:userId', UserController.updateAnUser);
router.delete('/:userId', UserController.deleteAnUser);

// // Orders Routes

// router.get('/:userId/orders', UserController.getAllOrdersOfUser);
// router.get('/:userId/orders/total-price', UserController.getTotalPriceOfProducts);
router.put('/:userId/orders', UserController.addANewProduct);

export const UserRoutes = router;
