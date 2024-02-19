import newCommentView from "./views/newCommentView.js";
import commentView from "./views/commentView.js";
import model from "./model.js";
import replyView from "./views/replyView.js";
import scoreView from "./views/scoreView.js";
import deleteModalView from "./views/deleteModalView.js";
import editView from "./views/editView.js";
import timeStampView from "./views/timeStampView.js";
import "./darkMode.js";
(function() {

    const handleAddNewComment = function (){
        let newCommentObj;
         try {
            let newComment = newCommentView.getNewCommentFromInput();
            if(newComment){
                newCommentObj = {"content":newComment};
                // console.log({...newCommentObj});
                // console.log('new comment is truthy');
            }else if(!newComment){
                return;
                // console.log('the value is falsy');
            }
         } catch (error) {
            console.log(error);
         }
        
        model.addNewComment(newCommentObj);
    }

    const handleAddNewReply = function(replyToId, parentId, newReply){
        let newReplyObj;
        try {
            if (newReply) {
                newReplyObj = {"content":newReply};
            }  
        } catch (error) {
          console.log(error);
          return  
        }
        /* What do we need. we need the parentId, and the data that has been passed in. */
        model.addNewReply(replyToId, parentId, newReplyObj);
    }

    const handleUpvoteDownvote = function (parentId, mainId, vote) {

        console.log(parentId, mainId, vote);

        if(parentId === mainId) {
            // console.log('this is a main comment that is being handled');
            model.upvoteDownvoteComment(mainId, vote);
        } else if (parentId !== mainId){
            // console.log('this is a reply that is being handled.');
            model.upvoteDownvoteReply(parentId, mainId, vote);
        }

    }

    const handleDeleteComment = function (parentId, mainId){
        console.log(parentId, mainId);
        if(parentId && mainId){
            if(parentId === mainId) {
                console.log(parentId, mainId);
                model.deleteComment(mainId);            
            }else if(parentId !== mainId){
                model.deleteReply(parentId, mainId);
            }else{
                return;
            }
        }
           
    }

    const handleEditComment = function (parentId, commentUid, newComment ){
        console.log('this is me getting clicked');
                if(commentUid === parentId) {
                    console.log(commentUid, newComment);
                    model.editComment(commentUid, newComment);
                } else if(parentId !== commentUid){
                    if ((parentId && commentUid) && newComment) {
                        console.log(parentId,commentUid, newComment);
                        model.editReply(parentId, commentUid, newComment);
                    }
                }

    }
   
    function init (){
        newCommentView.addNewCommentHandler(handleAddNewComment);
        replyView.addReplyBtnHandler(model.getClickedElementReplyData);
        replyView.addSubmitBtnHandler(handleAddNewReply);
        scoreView.addUpvoteDownvoteHandler(handleUpvoteDownvote);
        deleteModalView.addDeleteBtnHandler(handleDeleteComment);
        editView.addEditBtnHandler(model.getClickedElementEditData);
        editView.addUpdateBtnHandler(handleEditComment);
    }
    init();

    const loadMainComment = (data) => {
        let commentData = model.processMainComment(data);
        commentView.renderMainComment(commentData);
    };

    const loadReplyComment = (data, parentId) => {
        let commentData = model.processRepliedComment(data, parentId);
        commentView.renderRepliedComment(commentData);
    }

    /* handlePageLoad function for handling when the user loads the page for the first time or refreshes the page. */
    const handlePageLoad = async function (){
        const jsonData = await model.loadData();
        const {comments} = await jsonData;

        for (let index = 0; index < comments.length; index++) {
            let currentComment = comments[index];
            loadMainComment(currentComment);
            if(currentComment.replies){
                if(currentComment.replies.length > 0){
    
                    for (let j = 0; j < currentComment.replies.length; j++) {
                        const reply = currentComment.replies[j];
                        loadReplyComment(reply, currentComment.id); 
                    }
                }
            }
            
        }

        setInterval(async () => {
            await model.updateTime(model.data.comments);
        }, 1000);
    }

    handlePageLoad();
   
})();