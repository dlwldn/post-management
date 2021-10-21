import { writeDB } from '../dbController.js';
import { v4 } from 'uuid';
// parent: parent 객체, 거의 사용 x 
// args: Query에 필요한 필드에 제공되는 인수(parameter)
// context: 로그인한 사용자. DB Access 등의 중요한 정보들

const messageResolver = {
  Query: {
    messages: (parent, args, { db }) => {
      return db.messages
    },
    message: (parent, { id = '' }, { db }) => {
      return db.messages.find(msg => msg.id === id)
    }
  },
  Mutation: {
    createMessage: () => {},
    updateMessage: () => {},
    deleteMessage: () => {}
  }
}

const getMsgs = () => readDB('messages');
const setMsgs = (data) => writeDB('messages', data);
const messagesRoute = [

    {
        // CREATE MESSAGES
        method: 'post',
        route: '/messages',
        handler: ({ body }, res) => {
            try {
                if (!body.userId) throw Error('no userId');
                const msgs = getMsgs();
                const newMsg = {
                    id: v4(),
                    text: body.text,
                    userId: body.userId,
                    timestamp: Date.now(),
                };
                msgs.unshift(newMsg);
                setMsgs(msgs);
                res.send(newMsg);
            } catch (err) {
              res.status(500).send({ error: err });
            }
        },
    },
    {
        // UPDATE MESSAGES
        method: 'put',
        route: '/messages/:id',
        handler: ({ body, params: { id } }, res) => {
            try {
                const msgs = getMsgs();
                const targetIndex = msgs.findIndex((msg) => msg.id === id);
                if (targetIndex < 0) throw '메세지가 없습니다.';
                if (msgs[targetIndex].userId !== body.userId)
                    throw '사용자가 다릅니다.';

                const newMsg = { ...msgs[targetIndex], text: body.text };
                msgs.splice(targetIndex, 1, newMsg);
                setMsgs(msgs);
                res.send(newMsg);
            } catch (err) {
                res.status(500).send({ error: err });
            }
        },
    },
    {
        // DELETE MESSAGES
        method: 'delete',
        route: '/messages/:id',
        handler: ({ body, params: { id }, query: { userId } }, res) => {
            try {
                const msgs = getMsgs();
                const targetIndex = msgs.findIndex((msg) => msg.id === id);
                if (targetIndex < 0) throw '메세지가 없습니다.';
                if (msgs[targetIndex].userId !== userId)
                    throw '사용자가 다릅니다.';

                msgs.splice(targetIndex, 1);
                setMsgs(msgs);
                res.send(id);
            } catch (err) {
                res.status(500).send({ error: err });
            }
        },
    },
];

export default messagesRoute;
