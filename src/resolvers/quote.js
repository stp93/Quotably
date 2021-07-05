module.exports = {
    author: async (quote, args, {models}) => {
        return await models.User.findById(quote.author);
    },
    favoritedBy: async (quote, args, {models}) => {
        return await models.User.find({ _id: {$in: quote.favoritedBy}})
    }
};