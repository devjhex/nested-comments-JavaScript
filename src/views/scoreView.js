import { pubSub } from "../pubsub.js";

class score_view{
    constructor(){
        this.commentsContainer = document.querySelector(".comments");
    }

    //Add event listeners to the upvote and downvote buttons in th UI
    addUpvoteDownvoteHandler(handler){
        this.commentsContainer.addEventListener('click', event=>{
            let btn = event.target.closest('.vote');
            if(!btn) return;
            
            /* Get the parentId, mainId and the vote */
            let vote = btn.dataset.vote;
            let mainId = parseInt(btn.closest('.mainComment').dataset.id);
            let mainComment = btn.closest('.mainComment').parentElement.classList.contains('comments');
            let parentId = mainId;

            if(!mainComment){
                parentId = parseInt(btn.closest('.mainComment').parentElement.parentElement.dataset.id);
            }

           handler(parentId, mainId, vote);
        });
    }

    //Render the score to the UI of the page.
    renderScore = (scoreData) => {
        const comment = document.querySelector(`[data-id="${scoreData.id}"]`);
        const scoreEl = comment.querySelector('.score');
        scoreEl.textContent = scoreData.score < 0 ? 0 : scoreData.score;
    }
}

const scoreView = new score_view();
export default scoreView;
pubSub.subscribe("upvoteDownvote", scoreView.renderScore);