const userRouter = require('express').Router();
const {
  getAllUsers, getUserById, createUser, updateUserProfile, updateUserAvatar,
} = require('../controllers/users');

userRouter.get('/users', getAllUsers);
userRouter.get('/users/:_id', getUserById);
userRouter.post('/users', createUser);
userRouter.patch('/users/me', updateUserProfile);
userRouter.patch('/users/me/avatar', updateUserAvatar);

module.exports = userRouter;
