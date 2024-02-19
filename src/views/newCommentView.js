
class newCommentView{
    constructor(){
        this.newCommentInput = document.querySelector('.newCommentInput');
        // console.log(this.newCommentInput);
    }

    getNewCommentFromInput(){
        let query = this.newCommentInput.querySelector("#newCommentArea").value;
        console.log(query);
        this.clearInput();
        return query;
    }

    clearInput(){
        let inputEl = this.newCommentInput.querySelector('#newCommentArea');
        inputEl.value = "";
    }

    addNewCommentHandler(handler){
        let buttons = this.newCommentInput.querySelectorAll('.send-btn');

        buttons.forEach(btn=>{
            btn.addEventListener("click", () => {
                handler();
            })
        })
    }

}
export default new newCommentView();