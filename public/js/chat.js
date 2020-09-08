Vue.component("message", {
    template:
    `<div class="message">
        <p class="message-name-text">{{ msgName }}</p>
        <p class="message-content-text">{{ msgContent }}</p>
    </div>`,
    props: [
        "msgName",
        "msgContent"
    ]
})

new Vue({
    el: "#chat",
    data: {
        roomId: $("#room-id").val(),
        messages: []
    },
    methods: {
        getMessages: function(){
            axios.get(`/api/get_messages/${this.roomId}`).then((res) => {
                this.messages = res.data
            })
        },
        poll: function(){
            let pollAgain = true
            let t0 = performance.now()

            axios.get("/api/poll", {
                timeout: 300000
            }).then(() => {
                this.getMessages()
            }).catch(() => {
                let t1 = performance.now()
                if (t1 - t0 < 120000){
                    pollAgain = false
                }
            }).finally(() => {
                if (pollAgain){
                    this.poll()
                }
            })
        },
        postMessage: function(){
            let msgName = $("#message-name").val()
            let msgContent = $("#message-text").val()
            axios.post(`/api/add_message/${this.roomId}`, {
                name: msgName,
                content: msgContent
            }).then(msg => {

            }).catch(msg => {

            }).finally(() => {
                $("#message-text").val("")
            })
        }
    },
    mounted(){
        this.getMessages()
        this.poll()
    },
    watch: {
        messages: function(){
            $.each(this.messages, index => {
                this.messages[index].content = this.messages[index].content.trim()
            })
        }
    }
})