module.exports = {
    quotes: async (user, args, {models}) => {
        return await models.Quote.find({author: user._id}).sort({_id: -1});
    },
    favorites: async(user,args,{models}) => {
        return await models.Quote.find({favoritedBy: user._id}).sort({_id: -1});
    }
};