const { User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const params = await User.findOne({ _id: context.user._id }).select(
          "-__v -password"
        );

        return params;
      }
      throw new AuthenticationError("You are not logged in...");
    },
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Wrong Email or Password...");
      }

      const userPassword = await user.isCorrectPassword(password);
      if (!userPassword) {
        throw new AuthenticationError("Wrong Email or Password...");
      }

      const token = signToken(user);
      return { user, token };
    },

    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { user, token };
    },

    saveBook: async (parent, { bookData }, context) => {
      if (context.user) {
        const updateUserBooks = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: bookData } },
          { new: true }
        );
        return updateUserBooks;
      }
      throw new AuthenticationError(
        "You must be signed in to change this content..."
      );
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const removeUserBook = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return removeUserBook;
      }
      throw new AuthenticationError(
        "You must be signed in to change this content..."
      );
    },
  },
};

module.exports = resolvers;
