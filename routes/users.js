const userRouter = require('express').Router();
const {
  getAllUsers, getUserById, updateUserProfile, updateUserAvatar, getCurrentUser,
} = require('../controllers/users');
const { celebrate, Joi } = require('celebrate');

userRouter.get('/users', getAllUsers);
userRouter.get('/users/me', getCurrentUser);
userRouter.get('/users/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().hex().length(24),
  }),
}), getUserById);
userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserProfile);
userRouter.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(new RegExp(/^(http|https):\/\/[^ "]+$/)),
  }),
}), updateUserAvatar);

module.exports = userRouter;
