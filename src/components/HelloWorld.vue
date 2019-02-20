<template>
  <div id="chat">
    <div>
      <div>
        <h3>Chat</h3>
        <p>Channel: {{channelId}}</p>
        <hr>
      </div>
      <p v-if="historyEnd">All messages loaded.</p>
      <table>
        <template v-for="(msg, index) in messages">
          <tr :key="`row1-${index}`">
            <td>{{msg.direction}}</td>
            <td colspan="2">{{msg.content.payload}}</td>
          </tr>
          <tr :key="`row2-${index}`" class="small chat-row">
            <td>S: {{msg.sent}}</td>
            <td>D: {{msg.delivered}}</td>
            <td>R: {{msg.read}}</td>
          </tr>
        </template>
      </table>
    </div>
    <div style="margin-top: 20px">
      <form @submit.prevent="sendMessage">
        <div>
          <label for="message">Message:</label>
          <input type="text" v-model="message">
        </div>
        <button type="submit">Send</button>
        <button type="button" @click="markMessagesAsRead">Mark as read</button>
        <button type="button" @click="loadHistory">Load history</button>
      </form>
    </div>
  </div>
</template>

<script>
  import {AmioWebchatClient} from 'amio-webchat-sdk'

  export default {
    data() {
      return {
        user: '',
        message: '',
        messages: [],
        chatClient: AmioWebchatClient,
        channelId: process.env.VUE_APP_CHANNEL_ID,
        historyCount: 3,
        historyCursor: null,
        historyEnd: false
      }
    },
    methods: {
      sendMessage(e) {
        e.preventDefault()

        this.chatClient.sendTextMessage(this.message)
          .then((response) => {
            this.messages.push(response)
          })
        this.message = ''
      },
      receiveMessage(data) {
        this.messages.push(data)
      },
      markMessagesAsRead() {
        this.chatClient.markMessagesAsRead()
      },
      loadHistory() {
        this.chatClient.listMessages(this.historyCount, this.historyCursor)
          .then(this.historyLoaded)
      },
      historyLoaded(history) {
        this.historyCursor = history.cursor.next
        this.historyEnd = !history.cursor.has_next
        const loadedMsgs = history.messages.reverse()
        this.messages = loadedMsgs.concat(this.messages)
      }
    },
    mounted() {
      const config = {
        channelId: this.channelId,
        localStorageSessionName: 'my_cool_chat'
      }
      if(process.env.VUE_APP_AMIO_WEBCHAT_SERVER_URL) {
        config._amioWebchatServerUrl = process.env.VUE_APP_AMIO_WEBCHAT_SERVER_URL
      }
      this.chatClient.connect(config)
      this.chatClient.onMessageReceived(this.receiveMessage)
    }
  }
</script>

<style>
#chat {
  text-align: left;
}

.chat-row {
  border-bottom: 1px solid black;
}
.chat-row > td {
  padding: 5px 5px 5px 0; 
}

.small > td {
  color: gray;
  font-size: small;  
}

table {
  border-collapse: collapse
}

</style>
