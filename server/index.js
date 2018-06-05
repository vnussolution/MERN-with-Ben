const { GraphQLServer } = require("graphql-yoga");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/test1");
const Todo = mongoose.model("Todo", { text: String, complete: Boolean });

const typeDefs = `
  type Query {
    hello(name:String):String!
    todos:[Todo]
  }
  type Todo {
    id: ID!
    text: String!
    complete: Boolean!
  }
  type Mutation {
    createToDoo(text: String!): Todo
    updateToDoo(id:ID!, complete: Boolean!): Boolean
    removeToDoo(id: ID!): Boolean
  }
`;

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || "there..."}`,
    todos: () => Todo.find()
  },
  Mutation: {
    createToDoo: async (_, { text }) => {
      const todo = new Todo({ text, complete: false });
      await todo.save();
      return todo;
    },
    updateToDoo: async (_, { id, complete }) => {
      await Todo.findByIdAndUpdate(id, { complete });
      return true;
    },
    removeToDoo: async (_, { id, complete }) => {
      await Todo.findByIdAndRemove(id);
      return true;
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });
mongoose.connection.once("open", function() {
  server.start(() => console.log("server is running on localhost:4000"));
});
