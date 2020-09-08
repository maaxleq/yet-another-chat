new Vue({
    el: "#validation",
    data: {
        name: "",
        buttonClicked: false
    },
    methods: {
        setButtonClicked: function(){
            this.buttonClicked = true
            setTimeout(() => {
                this.buttonClicked = false
            }, 2000);
        },
        animateOut: function(){
            
        },
        clickFormButton: function(){
            this.setButtonClicked()
            this.animateOut()
        }
    },
    watch: {
        name: function(){
            if (this.name.length > 30){
                this.name = this.name.slice(0, 30 - this.name.length)
            }
        }
    }
})