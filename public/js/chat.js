Vue.component("message", {
    template:
    `<div class="message">
        <p class="message-name-text">{{ msgName }}</p>
        <p class="message-content-text">{{ msgContent }}</p>
    </div>`,
    props: [
        "msgName",
        "msgContent"
    ],
    methods: {
        mounted(){
            console.log("mounted !")
        }
    }
})

new Vue({
    el: "#chat",
    data: {
        roomId: $("#room-id").val(),
        messages: []
    },
    methods: {
        scrollToBottom: function(){
            $("#messages").animate({
                scrollTop: $("#messages")[0].scrollHeight
            }, 500)
        },
        focusOnSender: function(){
            $("#message-text").focus()
        },
        getMessages: function(){
            axios.get(`/api/get_messages/${this.roomId}`).then((res) => {
                this.messages = res.data
                this.focusOnSender()
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
        },
        forceScroll: function(){
            let interval = setInterval(() => {
                this.scrollToBottom()

                if ($("#messages")[0].scrollTop != 0){
                    clearInterval(interval)
                }
            }, 50)
        }
    },
    mounted(){
        this.getMessages()
        this.poll()

        this.$nextTick(() => {
            this.scrollToBottom()
        })

        this.forceScroll()
    },
    watch: {
        messages: function(){
            $.each(this.messages, index => {
                this.messages[index].content = this.messages[index].content.trim()
            })

            this.scrollToBottom()
        }
    }
})