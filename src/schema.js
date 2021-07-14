const {gql} = require('apollo-server-express');

module.exports = gql `
type Quote {
    id: ID!
    content: String!
    author: User!
    createdAt: DateTime!
    updatedAt: DateTime!
    favoriteCount: Int!
    favoritedBy: [User!]
}
type User {
    id: ID!
    username: String!
    email: String!
    avatar: String
    quotes: [Quote!]!
    favorites: [Quote!]!
}
type Query{
    quotes: [Quote!]!
    quote(id: ID): Quote!
    quoteFeed(cursor: String): QuoteFeed
    user(username:String!): User
    users: [User!]!
    me: User!
}
type Mutation {
    newQuote(content: String!): Quote!
    updateQuote(id: ID!, content: String!): Quote!
    deleteQuote(id: ID!): Boolean!
    signUp(username: String!, email: String!, password: String!): String!
    signIn(username: String, email: String, password: String!): String!
    toggleFavorites(id: ID!): Quote!
}
scalar DateTime

type QuoteFeed {
    quotes: [Quote]!
    cursor: String!
    hasNextPage: Boolean!
}
`;