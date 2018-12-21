import io from 'socket.io-client'

const amioChatServerUrl = 'localhost:8888'

class AmioChatClient {

  constructor() {
    this.sessionId = localStorage.getItem('amio_chat_session')
    this.messageReceivedHandler = () => {console.error('MessageReceivedHandler is not set')}
  }

  connect(channelId) {
    if(!channelId) {
      console.error('Channel ID is missing')
      return
    }

    const opts = {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 99999,
      query: {
        channelId: channelId
      }
    }
    if (this.sessionId) {
      opts.query.sessionId = this.sessionId
    }
    this.socket = io(amioChatServerUrl, opts)

    this.socket.on('message_server', (data, ack) => {
      ack({
        message_id: data.id
      })
      this.messageReceivedHandler(data)
    })

    this.socket.on('connection_accepted', data => {
      const sessionId = data.session_id
      this.sessionId = sessionId
      localStorage.setItem('amio_chat_session', data.session_id)
    })

  }

  sendMessage(text) {
    if(!this.socket) {
      console.error('Not connected, call connect() first')
      return
    }
    this.socket.emit('message_client', {
      content: {
        type: 'text',
        payload: text
      }
    })
  }

  setMessageReceivedHandler(func) {
    this.messageReceivedHandler = func
  }

}

export default new AmioChatClient()
