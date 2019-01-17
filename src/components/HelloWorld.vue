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
        <button type="button" @click="markMessagesAsRead">Mark as read</button>
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
        channelId: process.env.VUE_APP_CHANNEL_ID
      }
    },
    methods: {
      sendMessage(e) {
        e.preventDefault()

        this.messages.push({
          user: this.user,
          message: this.message
        })

        this.chatClient.sendTextMessage(this.message)
        this.message = ''
      },
      receiveMessage(data) {
        this.messages.push({
          user: this.channelId,
          message: data.content.payload
        })
      },
      markMessagesAsRead() {
        this.chatClient.markMessagesAsRead()
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
</style>
