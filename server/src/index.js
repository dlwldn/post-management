import express from 'express';
import cors from 'cors';
import messagesRoute from './routes/messages.js'
import usersRoute from './routes/users.js';
import { ApolloServer } from 'apollo-server-express';

const app = express();
// app.use(express.urlencoded({extended: true}))
// app.use(express.json())

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    db: {
      messages: '',
      users: ''
    }
  }
})

server.applyMiddleware({ app, path: '/graphql' })

app.listen(8000, ()=> {
  console.log('server listen 8000')
})

// const routes = [ ...messagesRoute, ...usersRoute ];
// routes.forEach(({method, route, handler }) => {
//   app[method](route, handler)
// })