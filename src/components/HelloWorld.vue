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
  import amioChatClient from '../amio-chat.client.js'

  export default {
    data() {
      return {
        user: '',
        message: '',
        messages: [],
        chatClient: amioChatClient,
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

        this.chatClient.sendMessage(this.message)
        this.message = ''
      },
      receiveMessage(data) {
        this.messages.push({
          user: this.channelId,
          message: data.content.payload
        })
      }
    },
    mounted() {
      this.chatClient.connect(this.channelId)
      this.chatClient.setMessageReceivedHandler(this.receiveMessage)
    }
  }
</script>

<style>
#chat {
  text-align: left;
}
</style>
