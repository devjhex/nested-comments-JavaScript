 import { pubSub } from "../pubsub.js";
 class updateTimeStamp_View {

    constructor() {
        this.commentsContainer = document.querySelector(".comments");
    }

     updateTimeStampView = async (timeData) =>{
            const mainComment = this.commentsContainer.querySelector(`[data-id="${timeData.id}"]`);
            const timePassed = mainComment.querySelector('.timeElapsed');
            timePassed.textContent = timeData.createdAt;
    }
}

let timeStampView = new updateTimeStamp_View();
export default timeStampView;
pubSub.subscribe('updateTime', timeStampView.updateTimeStampView);



