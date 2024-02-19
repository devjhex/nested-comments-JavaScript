import { pubSub } from "../pubsub.js";

 class deleteModal_View{
    constructor(){
        this.commentsContainer = document.querySelector(".comments");
        this.body = document.body;
    }

    //add event listeners to the delete buttons on the page.
    addDeleteBtnHandler(handler){
        this.commentsContainer.addEventListener("click", event=>{
            let btn = event.target.closest('.deleteBtn');
            if(!btn) return;

            let mainComment = btn.closest('.mainComment').parentElement.classList.contains('comments');
            let mainId = parseInt(btn.closest('.mainComment').dataset.id);
            let parentId = mainId;

            if(!mainComment){
                parentId = parseInt(btn.closest('.mainComment').parentElement.parentElement.dataset.id);
            }

            //Render the whole delete modal.
            this.renderDeleteModal(parentId, mainId, handler);
        })
    }

    //attach event listeners immediately the delete modal is created.
    attachModalEventListeners = (parentId, mainId, handler) => {
        const modal  =  document.getElementById("deleteModal");
        const btnNo = document.querySelector('.noDeleteBtn');
        const btnYes = document.querySelector(".yesDeleteBtn");
        
        const btnNoHandler = () => {
          modal.classList.toggle('animate-fadeOut');
          
          setTimeout((event)=>{
            modal.remove();
            this.body.style.overflow = null;
          },520);
        }

        const btnYesHandler = () => {
          modal.classList.toggle('animate-fadeOut');

          setTimeout(()=>{
            handler(parentId, mainId);
            modal.remove();
            this.body.style.overflow = null;
          },520);
        }

        const modalClickHandler = (event) =>{
          let background = modal.firstElementChild;
          if (event.target === background) {
            modal.classList.toggle('animate-fadeOut');
            setTimeout((event)=>{
              modal.remove();
              this.body.style.overflow = null;
            },520);
          }
        }

        btnNo.addEventListener("click", btnNoHandler);
        btnYes.addEventListener("click", btnYesHandler);
        modal.addEventListener("click", modalClickHandler);

    }

    //Render the delete modal.
    renderDeleteModal = (parentId, mainId, handler) => {
      
      /* Silently generates the delete modal for the user */
      this.body.style.overflow = 'hidden';
      this.body.insertAdjacentHTML('afterbegin', this.generateDeleteModalMarkup());

      //add the event listeners to the buttons inside the modal.
      this.attachModalEventListeners(parentId, mainId, handler);

      const modalWrapper = document.querySelector("#deleteModal");

      //add some styling if needed.
      modalWrapper.classList.toggle('invisible');
      modalWrapper.classList.remove('opacity-0');
      modalWrapper.classList.toggle('animate-fadeIn');
        
    }

    //Generate the delete modal markup.
    generateDeleteModalMarkup(){
        return `<div id="deleteModal" class="relative z-40 w-screen h-screen opacity-0 invisible">
        <div class="fixed w-[100vw] h-[100vh] bg-[#c3c3ef6e] flex items-center justify-center">
          <div class="w-11/12 max-w-[370px] rounded-[.8rem] bg-white dark:bg-darkWhite text-black flex flex-col gap-[.5rem] p-8">
            <h2 class="mb-[2px] text-[1.35rem] text-nueDarkBlue dark:text-darkDarkBlue font-[600]">Delete comment</h2>
            <p class="text-nueGrayishBlue dark:text-darkGrayishBlue">Are you sure you want to delete this comment? This will remove the comment and can't be undone.</p>
            <div class="mt-2 flex items-center justify-between">
              <button class="uppercase text-white py-4 px-6 bg-nueGrayishBlue duration-[.5s] hover:bg-[hsl(209,16%,68%)] rounded-[.5rem] font-[500] noDeleteBtn">
                No, Cancel
              </button>
              <button class="uppercase text-white py-4 px-6 bg-priSoftRed duration-[.5s] hover:bg-[hsl(9,83%,82%)] rounded-[.5rem] font-[500] yesDeleteBtn">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      </div>`
    }

    //delete the comment from the page.
    deleteCommentFromDOM(deleteInfo){
      if (!deleteInfo.parentId) {
        const elementToRemove = document.querySelector(`[data-id="${deleteInfo.mainId}"]`);
        elementToRemove.remove();
        return;
      }else if(deleteInfo.parentId){
        let parent = document.querySelector(`[data-id="${deleteInfo.parentId}"]`);
        let element = parent.querySelector(`[data-id="${deleteInfo.mainId}"]`);
        element.remove(); 
        return;
      }



    }
}

const deleteModalView = new deleteModal_View();
export default deleteModalView;

/* Subscribe to the relevant events */
pubSub.subscribe('deleteComment', deleteModalView.deleteCommentFromDOM);