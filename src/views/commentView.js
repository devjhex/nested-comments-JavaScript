import { pubSub } from "../pubsub.js";
class comment_view{
    constructor (){
        this.commentsContainer = document.querySelector(".comments");
    }

    //1. Render mainComment.
    renderMainComment = (data) => {
        const range = document.createRange();
        range.selectNode(document.body);
        let main_CommentMarkup = this.mainCommentMarkup(data);
        this.commentsContainer.append(main_CommentMarkup);
    }

    //2. Render reply comment.
    renderRepliedComment = (data) => {
      const parentComment = document.querySelector(`[data-id="${data.parentId}"]`);
      const repliesWrapper = parentComment.querySelector(".replies");
      repliesWrapper.append(this.mainCommentMarkup(data));
      this.scrollTo(data);
    }

    //3. Render updated comment.
    renderUpdatedComment = (data) => {
      let mainComment = this.commentsContainer.querySelector(`[data-id="${data.id}"]`);
      let targetComment = mainComment.firstElementChild;
      targetComment.remove();
      mainComment.insertAdjacentHTML('afterbegin', this.commentMarkup(data));
    }

    //4. Scroll to the updated comment
    scrollTo(data){
      const comment = this.commentsContainer.querySelector(`[data-id="${data.id}"]`);

      comment.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
    
    // make up comment markup
    commentMarkup(data){
      const range = document.createRange();
      range.selectNode(document.body);
      return range.createContextualFragment(`<div>
      <article class="comment bg-white dark:bg-darkWhite transition-all duration-[.3s]  p-4 rounded-[.5rem] md:flex md:items-start md:flex-row-reverse md:justify-between md:gap-[1rem]">
      <div class="w-full">
         <div class="md:flex md:items-center md:justify-between">
           <div class="flex items-center gap-[1rem]">
             <img src="${data.user.image.png}" alt="${data.username}" class="w-[45px]">
                  <span class="font-bold text-nueDarkBlue dark:text-darkDarkBlue">${data.user.username}</span>

             ${data.me ? `<span class="text-white bg-priModerateBlue px-[.3rem] font-[500] rounded-[.2rem]">you</span>` : ''}
     
             <span class="font-[500] text-nueGrayishBlue dark:text-darkGrayishBlue text-center timeElapsed">${data.createdAt}</span>
           </div>
           ${data.me === undefined ? `<div class="hidden md:block">
           <button class="flex items-center gap-[.5rem] text-priModerateBlue duration-[.5s] hover:text-[hsl(221,20%,72%)] font-[700] reply-btn action-btn group">
           <svg width="14" height="13" xmlns="http://www.w3.org/2000/svg"><path d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z" fill="#5357B6" class="duration-[.5s] group-hover:fill-[hsl(221,20%,72%)]"/></svg>
             Reply
           </button>
         </div>` : `<div class="hidden md:block">
         <div class="flex items-center gap-[1rem]">
         
           <button class="flex items-center gap-[.5rem] text-priSoftRed font-[700] duration-[.5s] hover:text-[hsl(9,83%,82%)] deleteBtn group">
           <svg width="12" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z" fill="#ED6368" class="duration-[.5s] group-hover:fill-[hsl(9,83%,82%)]"/></svg>
             Delete
           </button>
           <button class="flex items-center gap-[.5rem] text-priModerateBlue duration-[.5s] hover:text-[hsl(221,20%,72%)] font-[700] editBtn group">
           <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z" fill="#5357B6" class="duration-[.5s] group-hover:fill-[hsl(221,20%,72%)]"/></svg>
             edit
           </button>
          </div>
        </div>` }
           
         </div>
         <div class="p-2">
           <p class="text-nueGrayishBlue font-[500] content"> ${data.replyingTo ? `<span class="font-[700] text-priModerateBlue">@${data.replyingTo}</span>` : ''} ${data.content}</p>
         </div>
        </div>
   
         <div class="p-2 flex items-center justify-between">
           <div class="votes flex md:flex-col items-center w-[100px] transition-all duration-[.3s] h-[2.5rem] md:h-[100px] md:w-[2.5rem] bg-nueLightGray dark:bg-darkLightGray rounded-[.7rem] md:-mt-1">
           <button class="p-1 w-[45%] h-full md:h-[45%] md:w-full flex items-center justify-center rounded-l-[.7rem] vote group" data-vote='upvote'>
           <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF" class="duration-[.5s] group-hover:fill-priModerateBlue "/></svg>
         </button>
   
             <span class="text-priModerateBlue font-[700] px-1 score">
               ${data.score}
             </span>
   
            <button class="p-1 w-[45%] h-full md:h-[45%] md:w-full flex items-center justify-center rounded-l-[.7rem] vote group" data-vote="downvote">
      <svg width="11" height="3" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF" class="duration-[.5s] group-hover:fill-priModerateBlue"/></svg>

    </button>
           </div>
           ${data.me === undefined ? `<div class="block md:hidden">
           
           <button class="flex items-center gap-[.5rem] text-priModerateBlue duration-[.5s] hover:text-[hsl(221,20%,72%)] font-[700] reply-btn action-btn group">
           <svg width="14" height="13" xmlns="http://www.w3.org/2000/svg"><path d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z" fill="#5357B6" class="duration-[.5s] group-hover:fill-[hsl(221,20%,72%)]"/></svg>
             Reply
           </button>
         </div>` : `<div class="block md:hidden">
         <div class="flex items-center gap-[1rem]">
         
         <button class="flex items-center gap-[.5rem] text-priSoftRed font-[700] duration-[.5s] hover:text-[hsl(9,83%,82%)] deleteBtn group">
         <svg width="12" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z" fill="#ED6368" class="duration-[.5s] group-hover:fill-[hsl(9,83%,82%)]"/></svg>
           Delete
         </button>
         <button class="flex items-center gap-[.5rem] text-priModerateBlue duration-[.5s] hover:text-[hsl(221,20%,72%)] font-[700] editBtn group">
         <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z" fill="#5357B6" class="duration-[.5s] group-hover:fill-[hsl(221,20%,72%)]"/></svg>
           edit
         </button>
          </div>
        </div>` }
      </div>
       </article></div>`).children[0].innerHTML;
    }

    //makes up the mainComment markup
    mainCommentMarkup(data){
        const range = document.createRange();
        range.selectNode(document.body);
        let commentMarkup = this.commentMarkup(data);
        return range.createContextualFragment(`
        <div class="mainComment gap-[1rem] ${data.parentId ? 'w-[95%] ml-auto': ""} animate-fadeIn" data-id=${data.id}> 
            ${commentMarkup}
            <div class="replies border-l-4 mt-4 border-l-nueLightGray dark:border-l-darkLightBlue w-[99%] md:w-[95%] ml-auto">
            </div>
        </div>
        `).children[0];
    }
}
const commentView = new comment_view();
export default commentView;

/* Subscribe to the relevant events */
pubSub.subscribe('addNewComment',commentView.renderMainComment);
pubSub.subscribe('addNewReply', commentView.renderRepliedComment);
pubSub.subscribe('updateComment', commentView.renderUpdatedComment);




