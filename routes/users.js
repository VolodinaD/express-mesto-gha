const userRouter = require('express').Router();
const {
  getAllUsers, getUserById, updateUserProfile, updateUserAvatar, getCurrentUser
} = require('../controllers/users');
const { celebrate, Joi } = require('celebrate');

userRouter.get('/users', getAllUsers);
userRouter.get('/users/:_id', getUserById);
userRouter.get('/users/me', getCurrentUser);
userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserProfile);
userRouter.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), updateUserAvatar);

module.exports = userRouter;
