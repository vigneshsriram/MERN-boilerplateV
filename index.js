const { GraphQLServer } = require('graphql-yoga')
//https://www.youtube.com/watch?v=rpJO0T08Bnc

// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
	useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

var schema = mongoose.Schema;


//NEWS_LOCAL_SAMPLE

const News = mongoose.model("news4", {
  _id : String,
  coin : String,
  url : String,
  author : String,
  content : String,
  description : String,
  image: String,
  language: String,
  publishedAt : String,
  relevance : String,
  sentiment : String,
  source : {
      name: String,
      id : String,
  },
  title: String
})

const typeDefs = `
  type Query {
    hello(name1: String): String!
    getNews: [News]
  }
  type sources{
    name: String
    id: String
  }

  type News {
  _id : ID!
  coin : String
  url : String
  author : String
  content : String
  description : String
  image: String
  language: String
  publishedAt : String
  relevance : String
  sentiment : String
  source(name:String, id: String): sources
  title: String
  }

  type Mutation {
      createNews(coin: String!, newsTitle: String!, sourceName: String, date: String, description:String) : News
  }

`

const resolvers = {
  Query: {
    hello: (_, { name1 }) => `Hello ${name1 || 'World'}`,
    getNews: () => News.find().limit(20)
  }
}

const server = new GraphQLServer({ typeDefs, resolvers })
mongoose.connection.once("open", function(){
    server.start(() => console.log('Server is running on localhost:4000'))     
})
