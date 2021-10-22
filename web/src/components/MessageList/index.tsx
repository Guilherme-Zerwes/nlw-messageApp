import { useEffect, useState } from 'react'
import styles from './styles.module.scss'
import logo from '../../assets/logo.svg'
import io from 'socket.io-client'
import { api } from '../../services/api'

type Message = {
    id: string,
    text: string,
    user: {
        name: string,
        avatar_url: string
    }
}

let messageList: Message[] = []
const socket = io('http://localhost:4000')

socket.on('new_message', newMessage => {
    messageList.push(newMessage)
})

export function MessageList() {
    const [messages,setMessages] = useState<Message[]>([])

    useEffect(() => {
        api.get<Message[]>('messages/last3').then(response => {
            setMessages(response.data)
        })
    }, [])

    useEffect(() =>{
        const timer = setInterval(() => {
            if(messageList.length > 0) {
                setMessages(prevState => [messageList[0], prevState[0], prevState[1]].filter(Boolean))
                messageList.shift()
            }
        }, 3000)
    })
    return (
        <div className={styles.messageListWrapper}>
            <img src={logo}/>

            <ul className={styles.messageList}>
                {messages.map((message) => (
                    <li className={styles.message} key={message.id}>
                    <p className={styles.messageContent}>
                        {message.text}
                    </p>
                    <div className={styles.messageUser}>
                        <div className={styles.userImage}>
                            <img src={message.user.avatar_url} alt="" />
                        </div>
                        <span>{message.user.name}</span>
                    </div>
                </li>
                ))}
            </ul>
        </div>
    )
}