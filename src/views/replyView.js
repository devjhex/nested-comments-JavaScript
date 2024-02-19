import { pubSub } from "../pubsub.js";

class reply_View{
    constructor(){
        this.commentsContainer = document.querySelector('.comments');
    }

    /* Add an event listener to the reply button. */
    addReplyBtnHandler(handler){
            this.commentsContainer.addEventListener('click', (event)=>{
                let btn = event.target.closest('.reply-btn');
                if(!btn) return;
                let mainId = parseInt(event.target.closest('.mainComment').dataset.id); 
                btn.classList.remove('reply-btn');
                let mainComment = btn.closest('.mainComment').parentElement.classList.contains('comments');
                let parentId = mainId;
    
                if(!mainComment){
                    parentId = parseInt(btn.closest('.mainComment').parentElement.parentElement.dataset.id);
                }
                /* we need to get the parentId, mainId */
                console.log(mainId, parentId);

                handler(parentId, mainId);

            })
    }

    /* Render the reply UI input for the user to reply */
     renderReplyInput = async (data) =>   {
        let wrapper = document.querySelector(`[data-id="${data.data.id}"]`)
        let mainComment = wrapper.firstElementChild;
        let markup = await this.generateReplyInputMarkup(data.currentUser);
        mainComment.insertAdjacentHTML('afterend', markup);

        this.commentsContainer.addEventListener('click', event=>{
        let btn = event.target.closest('.cancel-btn');
        if (!btn) return;   
        const btnReplies = wrapper.querySelectorAll(".action-btn");
        btnReplies.forEach(btn=>{
          btn.classList.add('reply-btn');
        });

        btn.closest('.commentInput').remove();
      });
    }

    /* Generate the reply UI input markup */
    async generateReplyInputMarkup(data){
      console.log(data);
        return `
        <div class="commentInput bg-white dark:bg-darkWhite  p-4 rounded-[.5rem] md:flex md:items-start md:gap-[1rem] animate-fadeIn mt-4">
        <textarea name="comment" id="newCommentInput" rows="4" class=" w-full resize-none border-2 dark:bg-darkLightGray border-nueLightGray dark:border-none dark:outline-none dark:caret-darkModerateBlue rounded-[.8rem] p-4 placeholder:text-nueGrayishBlue dark:placeholder:text-darkGrayishBlue placeholder:font-[500] text-nueGrayishBlue dark:text-darkGrayishBlue text-[1.2rem] font-[500] outline-priModerateBlue dark:outline-darkWhite" placeholder="Add a comment..."></textarea>
        <div class="p-2 flex items-center justify-between md:-order-1">
  
          <div>
            <img src="${data.image.png}" alt="${data.username}" class="w-[45px]">
          </div>
          
          <div class="flex flex-row-reverse md:flex-col gap-[.5rem] md:gap-[1rem]">
            <button class="block md:hidden bg-priModerateBlue dark:bg-darkModerateBlue duration-[.5s] hover:bg-[hsl(221,20%,72%)] text-white w-[100px] py-[.5rem] rounded-[.5rem] font-[700] uppercase submit-reply">
              Reply
            </button> 
            <button class="block md:hidden bg-priSoftRed dark:bg-darkSoftRed duration-[.5s] hover:bg-[hsl(9,83%,82%)] w-[100px] text-white py-[.5rem] rounded-[.5rem] font-[700] uppercase cancel-btn">
              Cancel
            </button> 
          </div>
        </div>
        <div class="md:flex md:flex-col md:gap-[1rem] md:self-center">
          <button class="hidden md:block bg-priModerateBlue duration-[.5s] hover:bg-[hsl(221,20%,72%)] text-white py-[.5rem] px-4 w-[100px] rounded-[.5rem] font-[700] uppercase submit-reply">
            reply
          </button>
          <button class="hidden md:block bg-priSoftRed duration-[.5s] hover:bg-[hsl(9,83%,82%)] w-[100px] text-white py-[.5rem] px-4 rounded-[.5rem] font-[700] uppercase cancel-btn">
            cancel
          </button>
          
        </div>
      </div>
        `;
    }

    /* Add and event listener to the submit reply button. */

    addSubmitBtnHandler(handler){
        this.commentsContainer.addEventListener('click', e=>{
            let btn = e.target.closest(".submit-reply");
            if(!btn) return;

            /* Get the parentId, mainId and new Comment */
            let parentEl = btn.closest('.commentInput');
            let parentElementReplyBtn = parentEl.previousElementSibling.querySelector('.action-btn');
            let replyToElement = btn.closest('.commentInput').previousElementSibling.parentElement;
            let replyToId = parseInt(replyToElement.dataset.id);
            let mainComment = replyToElement.parentElement.classList.contains('comments');
            let parentId = replyToId;

            if (!mainComment) {
                parentId = parseInt(btn.closest('.commentInput').nextElementSibling.parentElement.parentElement.closest('.mainComment').dataset.id);
            }

            
            const comment = parentEl.querySelector('#newCommentInput').value;

            if (comment) {

            /* Remove the reply input element markup */
            parentEl.remove();

            /* Add the class to the reply button that was previously removed by the first click of the reply. */
            parentElementReplyBtn.classList.add('reply-btn');

            handler(replyToId, parentId, comment);
            }
            else {
            /* Remove the reply input element markup */
            parentEl.remove();

            /* Add the class to the reply button that was previously removed by the first click of the reply. */
            parentElementReplyBtn.classList.add('reply-btn');
            return;
            }
        })
    }
}
const replyView = new reply_View();
export default replyView;
pubSub.subscribe('replyComment', replyView.renderReplyInput);
