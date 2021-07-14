module.exports = {
    //return all the results
    quotes: async (parent, args, { models }) => {
        return await models.Quote.find().limit(100);
    },
    //return individual result found by ID
    quote:  async (parent,args,{models}) => {
        return await models.Quote.findById(args.id);
    },
    //set up pagination 
    quoteFeed: async (parent, {cursor}, {models}) => {
        const limit = 10;
        let hasNextPage = false;
        let cursorQuery = {};

        if (cursor) {
            cursorQuery = { _id: { $lt: cursor }};
        }

        let quotes = await
        models.Quote.find(cursorQuery)
        .sort({_id: -1})
        .limit(limit + 1);

        if(quotes.length > limit){
            hasNextPage = true;
            quotes = quotes.slice(0, -1);
        }

        const newCursor = quotes[quotes.length - 1]._id;

        return{
            quotes,
            cursor: newCursor,
            hasNextPage
        };
    },
    user: async (parent, {username}, {models}) => {
        return await 
        models.User.findOne({username});
    },
    users: async (parent, args, {models}) =>{
        return await models.User.find({});
    },
    me: async(parent, args, {models,user})=>{
        //find a user on context
        return await models.User.findById(user.id);
    }
}