<template>
  <div id="chat">
    <div>
      <div>
        <h3>Chat Group</h3>
        <hr>
      </div>
      <div>
        <div class="messages" v-for="(msg, index) in messages" :key="index">
          <p><span>{{ msg.user }}: </span>{{ msg.message }}</p>
        </div>
      </div>
    </div>
    <div>
      <form @submit.prevent="sendMessage">
        <div>
          <label for="user">User:</label>
          <input type="text" v-model="user">
        </div>
        <div>
          <label for="message">Message:</label>
          <input type="text" v-model="message">
        </div>
        <button type="submit">Send</button>
      </form>
    </div>
  </div>
</template>

<script>
  import io from 'socket.io-client'

  export default {
    data() {
      return {
        user: '',
        message: '',
        messages: [],
        socket: null,
        sessionId: localStorage.getItem('amio_chat_session'),
        channelId: '12345'
      }
    },
    methods: {
      sendMessage(e) {
        e.preventDefault()

        this.messages.push({
          user: this.user,
          message: this.message
        })

        this.socket.emit('message_client', {
          version: 1,
          content: {
            type: 'text',
            payload: this.message
          }
        })
        this.message = ''
      }
    },
    mounted() {
      const opts = {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 99999,
        query: {
          channelId: this.channelId
        }
      }
      if(this.sessionId) {
        opts.query.sessionId = this.sessionId
      }
      this.socket = io('localhost:8888', opts)

      this.socket.on('message_server', (data, ack) => {
        this.messages.push({
          user: this.channelId,
          message: data.content.payload
        })
        ack({
          version: 1,
          message_id: data.id
        })
      })

      this.socket.on('connection_accepted', data => {
        const sessionId = data.session_id
        this.sessionId = sessionId
        localStorage.setItem('amio_chat_session', data.session_id)
      })
    }
  }
</script>

<style>
#chat {
  text-align: left;
}
</style>
