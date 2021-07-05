const Query = require('./query');
const Mutation = require('./mutation');
const Quote = require('./quote');
const User = require('./user');
const {GraphQLDateTime} = require('graphql-iso-date');


module.exports = {
    Query,
    Mutation,
    Quote,
    User,
    DateTime: GraphQLDateTime
};