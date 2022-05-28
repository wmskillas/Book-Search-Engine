const { Book, User } = require("../models");

const resolvers = {
  Query: {
    user: async (parent, args, { user }) => {
      if (user) {
        const params = await User.findOne({ _id: user._id }).select(
          "-__v -password"
        );
        return params;
      }
    },
  },
  Mutation: {
    createUser: async (parent, args) => {
      const user = await User.create(args);
      return user;
    },
  },
};

module.exports = resolvers;
