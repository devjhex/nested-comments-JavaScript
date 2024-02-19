import { pubSub } from "../pubsub.js";

class edit_View{
    constructor(){
        this.commentsContainer = document.querySelector(".comments");
    }
    // Add an event listener to the edit button
    addEditBtnHandler(handler){
        this.commentsContainer.addEventListener('click', event=>{
           let btn = event.target.closest(".editBtn");
            if (!btn) return;
            /* Get the parentId and the mainId */
            let mainId = parseInt(btn.closest('.mainComment').dataset.id);
            let mainComment = btn.closest('.mainComment').parentElement.classList.contains('comments');
            console.log(mainId);
            let parentId = mainId;

            if(!mainComment){
                parentId = parseInt(btn.closest('.mainComment').parentElement.parentElement.dataset.id);
            }

            handler(parentId, mainId);


        })
    }

    // Add an event listener to the update comment button.
    addUpdateBtnHandler(handler){
        this.commentsContainer.addEventListener("click", event=>{
            let btn = event.target.closest('.updateBtn');
            if(!btn) return;

            /* Get the parentId, mainId and newComment */
            let parentEl = btn.closest('.editCommentInput');
            let mainId = parseInt(parentEl.closest('.mainComment').dataset.id);
            let mainComment = parentEl.closest('.mainComment').parentElement.classList.contains('comments');
            let parentId = mainId;

            if(!mainComment){
                parentId = parseInt(parentEl.closest('.mainComment').parentElement.parentElement.dataset.id);
            }

            const newComment = parentEl.querySelector('.editCommentArea').value;

            handler(parentId, mainId, newComment);

        })
    }

    //Render the editing input field to the UI
    renderEditingField = (data) => {
        const wrapper = document.querySelector(`[data-id="${data.id}"]`);
        console.log(wrapper);

        let editingField = this.generateEditingFieldMarkup(data);

        wrapper.firstElementChild.remove();
        wrapper.insertAdjacentHTML('afterbegin', editingField);
    }

    //Generate the editing input field markup
    generateEditingFieldMarkup = (data) => {
        return `<div class="editCommentInput bg-white dark:bg-darkWhite pb-[.2rem] px-3 pt-3 rounded-[.5rem] animate-fadeIn">
        <article class="comment bg-white dark:bg-darkWhite p-3 rounded-[.5rem] md:flex md:items-start md:flex-row-reverse md:gap-[1rem]">
          <div class="w-full">
           <div class="md:flex md:items-center md:justify-between">
             <div class="flex items-center gap-[1rem]">
               <img src="${data.user.image.png}" alt="${data.username}" class="w-[45px]">
  
               
               <span class="font-bold text-nueDarkBlue dark:text-darkDarkBlue">${data.user.username}</span>
               
               <span class="text-white bg-priModerateBlue dark:bg-darkModerateBlue px-[.3rem] font-[500] rounded-[.2rem]">you</span>
  
               <span class="font-[500] text-nueGrayishBlue dark:text-darkDarkBlue">${data.createdAt}</span>
             </div>
             <div class="hidden md:block">
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
             </div>
           </div>
           <div class="p-2 flex flex-col gap-[1rem]">
             <textarea name="comment" id="editComment" rows="4" class=" w-full resize-none border-2 dark:bg-darkLightGray border-nueLightGray dark:border-none rounded-[.8rem] p-4 placeholder:text-nueGrayishBlue placeholder:dark:text-darkGrayishBlue placeholder:font-[500] text-nueGrayishBlue dark:text-darkGrayishBlue font-[500] outline-priModerateBlue dark:outline-none editCommentArea" placeholder="Update your comment...">${data.content}
             </textarea>
             <div class="">
              <button class="block bg-priModerateBlue duration-[.5s] hover:bg-[hsl(221,20%,72%)] text-white py-[.5rem] px-4 w-[100px] rounded-[.5rem] ml-auto font-[700] uppercase updateBtn">
                update
              </button>
             </div>
           </div>
          </div>
     
           <div class="p-2 flex ">
     
             <div class="block md:hidden ml-auto">
              <div class="flex items-center gap-[1rem] self-center">
              
              <button class="flex items-center gap-[.5rem] text-priSoftRed font-[700] duration-[.5s] hover:text-[hsl(9,83%,82%)] deleteBtn group">
              <svg width="12" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z" fill="#ED6368" class="duration-[.5s] group-hover:fill-[hsl(9,83%,82%)]"/></svg>
                Delete
              </button>
              <button class="flex items-center gap-[.5rem] text-priModerateBlue duration-[.5s] hover:text-[hsl(221,20%,72%)] font-[700] editBtn group">
              <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z" fill="#5357B6" class="duration-[.5s] group-hover:fill-[hsl(221,20%,72%)]"/></svg>
                edit
              </button>
              </div>
             </div>
           </div>
         </article>
      </div>`
    }
}

let editView = new edit_View();
export default editView;
pubSub.subscribe('editComment', editView.renderEditingField);
