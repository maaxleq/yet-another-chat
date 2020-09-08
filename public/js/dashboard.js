Vue.component("room-button", {
    template:
    `<button type="submit" class="room-button yac-button" name="room" v-bind:value="roomId + ';;' + roomName">
        {{ roomName }}
        <img src="/svg/icon_enter">
    </button>`,
    props: [
        "roomName",
        "roomId"
    ]
})

new Vue({
    el: "#buttons",
    data: {
        rooms : []
    },
    mounted(){
        axios.get("/api/get_rooms").then((output) => {
            this.rooms = output.data
        })
    }
})