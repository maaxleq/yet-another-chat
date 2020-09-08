Vue.component("yac-title-set", {
    template: 
    `<div class="yac-title-set">
        <div>
            <p v-for="yacTitle in yacTitles"><span>{{ yacTitle.titleHead }}</span>{{ yacTitle.titleTail }}</p>
        </div>
    </div>`,
    props: [
        "yacTitles"
    ]
})

Vue.component("yac-title", {
    template: 
    `<div class="yac-title">
        <div>
            <p><span>{{ titleHead }}</span>{{ titleTail }}</p>
        </div>
    </div>`,
    props: [
        "titleHead",
        "titleTail"
    ]
})

new Vue({
    el: "#app"
})

