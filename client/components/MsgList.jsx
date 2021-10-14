import MsgInput from "./MsgInput";
import MsgItem from "./MsgItem";
import { useEffect, useState } from "react";
import fetcher from '../fetcher';
import { useRouter } from 'next/router';

const MsgList = () => {
  const { query: { userId = '' } } = useRouter();
  const [msgs, setMsgs] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const onCreate = async text => {
    const newMsg = await fetcher('post', '/messages', { text, userId });
    if(!newMsg) throw Error('입력값을 넣으세요')
    setMsgs(msgs => ([newMsg, ...msgs]))
  }

  const onUpdate = async (text, id) => {
    const newMsg = await fetcher('put', `/messages/${id}`, { text, userId })
    if(!newMsg) throw Error('입력값을 넣으세요')
    setMsgs(msgs => {
      const targetIndex = msgs.findIndex(msg => msg.id === id);
      if(targetIndex < 0) return msgs
      const newMsgs = [...msgs];
      newMsgs.splice(targetIndex, 1, newMsg)
      return newMsgs
    })
    doneEdit();
  }

  const onDelete = async (id) => {
    const receivedId = await fetcher('delete', `/messages/${id}`, { params: { userId } })
    setMsgs(msgs => {
      const targetIndex = msgs.findIndex(msg => msg.id === String(receivedId));
      if(targetIndex < 0) return msgs
      const newMsgs = [...msgs];
      newMsgs.splice(targetIndex, 1)
      return newMsgs
    })
  }

  const doneEdit = () => setEditingId(null);

  const getMessages = async () => {
    const msgs = await fetcher('get', '/messages')
    setMsgs(msgs);
  }

  useEffect(()=> {
    getMessages(); 
  }, [])

  

  return (
    <>
      <MsgInput mutate={onCreate} />
      <ul className='messages'>
        {msgs.map(x => <MsgItem key={x.id} {...x} 
        onUpdate={onUpdate} 
        onDelete={() => onDelete(x.id)} 
        startEdit={() => setEditingId(x.id)} 
        isEditing={editingId === x.id}
        myId={userId}
        />)}
      </ul>
    </>
  )
}
export default MsgList;