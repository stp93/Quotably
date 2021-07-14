const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const{
    AuthenticationError,
    ForbiddenError
} = require('apollo-server-express');
require('dotenv').config();

module.exports = {
    newQuote: async (parent, args, {models, user}) =>  {
            if(!user){
                throw new AuthenticationError('you must be signed in to quote');
            }

        return await models.Quote.create({
            content: args.content,
            author: mongoose.Types.ObjectId(user.id)
        });
    },
    deleteQuote: async (parent, {id}, {models, user})=> {
        if(!user){
            throw new AuthenicationError('You must be signed in to quote')
        }
        const quote = await models.Quote.findById(id);
        if(quote && String(quote.author) !== user.id){
            throw new ForbiddenError("you dont have the authoritay")
        }
        try{
            await quote.remove();
            return true;
        } catch(err){
            return false;
        }
    },
    updateQuote: async(parent, {content,id},{models, users})=>{
        if(!user){
            throw new AuthenticationError('You must be signed in to quote');
        }
        const quote = await models.Quote.findById(id);
        if(quote && String(quote.author) !== user.id){
            throw new ForbiddenError('You dont have the authoritay');
        }
        return await models.Quote.findOneAndUpdate(
            {
                _id:id,
            },
            {
                $set:{
                    content
                }
            },
            {
                new: true
            }
        )
    },
    signUp: async (parent, {username, email, password}, {models})=>{
        email = email.trim().toLowerCase();
        const hashed = await bcrypt.hash(password,10)
        try{
            const user = await models.User.create({
                username,
                email,
                password: hashed
            });

            return jwt.sign({id: user._id},process.env.JWT_SECRET);
        }catch (err){
            console.log(err);
            throw new Error('error creating account')
        }
    },
    signIn: async (parent, {username, email, password}, {models}) => {
        if(email){
            email = email.trim().toLowerCase();
        }
        const user = await models.User.findOne({
            $or: [{email}, {username}]
        });
        if(!user){
            throw new AuthenticationError('Error signing in');
            
        }

        const valid = await bcrypt.compare(password,user.password);
        if(!valid){
            throw new AuthenticationError('Error Signing In');
            
        }
        return jwt.sign({id: user._id}, process.env.JWT_SECRET);
    },
    toggleFavorites: async(parent,{id},{models, user}) => {
        if(!user){
            throw new AuthenticationError();
        }
        let quoteCheck = await
        models.Quote.findById(id);
            const hasUser = quoteCheck.favoritedBy.indexOf(user.id);
            if(hasUser >= 0){
                return await models.Quote.findByIdAndUpdate(id,{
                    $pull: {
                        favoritedBy: 
                    mongoose.Types.ObjectId(user.id)
                    },
                    $inc: {
                        favoriteCount: -1
                    }
                },
                {
                    new: true
                });
                }else{
                    return await models.Quote.findByIdAndUpdate(id,{
                        $push: {
                            favoritedBy: 
                        mongoose.Types.ObjectId(user.id)
                        },
                        $inc: {
                            favoriteCount: 1
                        }
                    },
                    {
                        new: true
                    });
                }
            
    }

}