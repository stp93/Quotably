const express = require('express');
const helmet = require('helmet');
const cors = require('cors')
const jwt = require('jsonwebtoken');
const {ApolloServer} = require ('apollo-server-express');
require('dotenv').config();

const db = require('./db');


//server on env declared port or 4001
const port = process.env.PORT || 4001
const DB_HOST = process.env.DB_HOST;
const models = require('./models')
//GraphQL Schema
const typeDefs = require('./schema')

const resolvers = require('./resolvers');

//resolver functions for fields
// const resolvers = {
//     Query: {
        
//         quotes: async () => {
//             return await models.Quote.find();
//         },
//         quote: async (parent,args) => {
//             return await models.Quote.findById(args.id);
//         }
//     },
//         Mutation: {
//             newQuote: async (parent,args) => {
//                 return await models.Quote.create({
//                     id: String(quotes.length + 1),
//                     content: args.content,
//                     author: 'So and So'
//                 });
                
//             }
//         }
    
// };


const app = express();
//app.use(helmet());
app.use(cors());
db.connect(DB_HOST)

const depthLimit = require('graphql-depth-limit');

const {createComplexityLimitRule} = require('graphql-validation-complexity');

const getUser = token => {
    if(token){
        try{
            return jwt.verify(token, process.env.JWT_SECRET);
        }catch (err){
            throw new Error('session invalid');
        }
    }
}

//Apollo server
const server = new ApolloServer({
    typeDefs, 
    resolvers, 
    validationRules: [depthLimit(5),
    createComplexityLimitRule(1000)],
    context: ({req})=>{
        const token = req.headers.authorization;
        const user = getUser(token);
        console.log(user);
    return{models, user};
}});

//middleware
server.applyMiddleware({app, path: '/api'});

app.listen({port}, ()=> console.log(`GraphQL server running ${port}${server.graphqlPath}`))
