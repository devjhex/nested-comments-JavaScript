import { pubSub } from "./pubsub.js";
import { formatDate } from "./helpers.js";
import { getUniqueId } from "./helpers.js";

class Model {
  constructor (){
    this.data = {
      comments:[],
      currentUser:null
    };
}
  //Fetches Data and loads it to the local Storage
  async loadData(){
    const localStorageData  = localStorage.getItem('commentData');
  
    if(localStorageData){
      const jsonData = JSON.parse(localStorageData);
      const {currentUser, comments, voted} = jsonData;
      // console.log(jsonData);
      // console.log(jsonData.comments);
      // console.log(jsonData.voted);
      // console.log(voted);
      this.data.comments = comments;
      this.data.currentUser = currentUser;
      this.data.voted = voted;
  
      return jsonData;
    }else {
      const jsonData = await this.getData();
      const currentUser = {...jsonData.currentUser, voted:{}};
  
      this.data.comments = jsonData.comments;
      this.data.currentUser = currentUser;
      this.updateStorage();
  
    }
  }
  
  async getData(){
      try {
          let response = await fetch('./data.json');
          if(!response.ok) throw new Error('Invalid Response');
          let dataObj = await response.json();
          return dataObj;
      } catch (error) {
          console.log(error.message);
      }
  }

  //Fetches Data for the clicked element for editing the UI
  getClickedElementEditData = function (parentId, mainId){
        if(parentId === mainId) {
            
            let data = model.data.comments.find(item=>{
                return item.id === mainId;
            });
            /* publish to the function responsible for the input markup */ 
            pubSub.publish('editComment', data);   
            return data;  
        }else if(parentId !== mainId){
            let parent = model.data.comments.find(item=>{
                return item.id === parentId;
            });
            
            let data = parent.replies.find(item=>{
                return item.id === mainId;
            });

            /* publish to the function responsible for the input markup */
             pubSub.publish('editComment', data);
            return data;
        }
  }

  //Fetches data for the clicked element for rendering the reply input
  getClickedElementReplyData = function (parentId, mainId){
    if(parentId === mainId) {
      let data = model.data.comments.find(item=>{
        return item.id === mainId;
      });
      console.log(data);

        /* publish to the function responsible for the input markup */ 
        pubSub.publish('replyComment', {data,currentUser:model.data.currentUser});   
        return data;  
    }else if(parentId !== mainId){
        let parent = model.data.comments.find(item=>{
            return item.id === parentId;
        });
        
        let data = parent.replies.find(item=>{
            return item.id === mainId;
        });

        /* publish to the function responsible for the input markup */
         pubSub.publish('replyComment', {data,currentUser:model.data.currentUser});
        return data;
    }
  }

  
  processMainComment(data){
    return {
      ...data,
      score:data.score > 0 ? data.score: 0, 
      createdAt:formatDate(data.timeStamp ? data.timeStamp : data.createdAt),
      me:this.data.currentUser.username === data.user.username ? true : undefined
    }
    
  }

  processRepliedComment(data, parentId){
    return {
      ...data,
      score:data.score > 0 ? data.score: 0,
      createdAt:formatDate(data.timeStamp ? data.timeStamp : data.createdAt),
      me:this.data.currentUser.username === data.user.username ? true : undefined,
      parentId: parentId
    }
  }

  async updateTime(allComments){
      let summary = [];
      allComments.forEach(item=>{
        let obj = {};
        obj.id = item.id;
        obj.createdAt = item.timeStamp ? item.timeStamp : item.createdAt;
        summary.push(obj);

        if (item.replies.length > 0) {
          const replies = item.replies;
          replies.forEach(item=>{
            let obj = {};
            obj.id = item.id;
            obj.createdAt = item.timeStamp ? item.timeStamp : item.createdAt;
            summary.push(obj);
          })
        }

      });
      let updatedSummary = summary.map(item=> {
        return {id:item.id, createdAt:formatDate(item.createdAt)};
      });

      updatedSummary.forEach(item=>{
        pubSub.publish('updateTime', item);
      })
      return updatedSummary;
  }

  updateStorage(){
    localStorage.setItem("commentData", JSON.stringify(this.data));
  }
  
  /* Adds a new Comment to the local storage */
  addNewComment(newCommentObj){
      const timeStamp = new Date().getTime();
      newCommentObj = {
          'id': getUniqueId(),
          ...newCommentObj,
          "createdAt":formatDate(timeStamp),
          "timeStamp":timeStamp,
          'score':0,
          'replies':[],
          "user":this.data.currentUser,
          "me":this.data.currentUser.username,
      };

      this.data.comments.push(newCommentObj);
  
      //update the local Storage and publish your data to the subscribed functions
      this.updateStorage();
      pubSub.publish('addNewComment', newCommentObj);
      return newCommentObj;
  }

  /* Adds a new reply to the local storage. */
  addNewReply(replyToId, parentId, newReplyObj){
    let parentComment = this.data.comments.find(item=>{
      return item.id === parentId;
    });
    let parentCommentIndex =  this.data.comments.findIndex((item)=>{
      return item.id === parentId;
    });

    if(parentComment){
      const timeStamp = new Date().getTime();
      newReplyObj = {
            "id": getUniqueId(),
            ...newReplyObj,
            "createdAt":formatDate(new Date().getTime()),
            "timeStamp":timeStamp,
            "score":0,
            "user":this.data.currentUser,
            "me":this.data.currentUser.username,
            "replyingTo":parentComment.user.username,
      };
      let replies = this.data.comments[parentCommentIndex].replies;

        if(replyToId !== parentId) {
          let replyToComment = parentComment.replies.find(item=>{
            return item.id === replyToId;
          });

          newReplyObj.replyingTo = replyToComment.user.username;

          let replyToIndex = parentComment.replies.findIndex(item=>{
            return item.id === replyToId;
            });
            replies[replyToIndex].replies = replies[replyToIndex].replies || [];
            replies = replies[replyToIndex].replies;
        }
        replies.push(newReplyObj);
        
        //update the local Storage and publish your data to the subscribed functions
        this.updateStorage();
        pubSub.publish('addNewReply',this.processRepliedComment(newReplyObj, parentId));
      return newReplyObj;
    }else {
      return;
    }
  }
  
  /* Edits main comment in the local storage. */
  editComment(commentUid, newComment){
    let oldCommentIndex = this.data.comments.findIndex(item=>{
      return item.id === commentUid;
    });
    let oldComment = this.data.comments.find(item=>{
      return item.id === commentUid;
    });

    if(oldComment){
      this.data.comments[oldCommentIndex].content = newComment;
      this.updateStorage();
      pubSub.publish('updateComment', this.processMainComment(oldComment));
      return newComment;
    }else {
      return;
    }
   
  }

  /* Edits a reply comment in the local storage. */
  editReply(parentId, commentUid, newReply){
    let parentIndex = this.data.comments.findIndex(item=>{
      return item.id === parentId;
    });

    let parentComment = this.data.comments.find(item=>{
      return item.id === parentId;
    });

    if(parentComment){
      let commentIndex = this.data.comments[parentIndex].replies.findIndex(item=>{
        return item.id === commentUid;
      });
      let comment = this.data.comments[parentIndex].replies.find(item=>{
        return item.id === commentUid;
      });
      
      this.data.comments[parentIndex].replies[commentIndex].content = newReply;
      this.updateStorage();
      pubSub.publish('updateComment', this.processMainComment(comment));
      return newReply;
    }else {
      return;
    }
  }
  
  /* Deletes a comment from the local storage */
  deleteComment(commentUid){
    let comment = this.data.comments.find(item=>{
      return item.id === commentUid;
    });
  
    if (comment) {
      let commentToDeleteIndex = this.data.comments.indexOf(comment);
      let deletedComment = this.data.comments.splice(commentToDeleteIndex, 1); 
      this.updateStorage();
      pubSub.publish('deleteComment', {parentId:undefined, mainId:commentUid});
      return deletedComment;
    }else{
      return;
    }
  
    //update the local Storage and publish your data to the subscribed functions
  }
  
  /* Deletes a reply comment from the local storage. */
  deleteReply(parentId,commentUid){
    let parentComment = this.data.comments.find((item)=>{
      return item.id === parentId;
    });
    let parentIndex =  this.data.comments.findIndex((item)=>{
      return item.id === parentId;
    });
    if (parentComment) {
      console.log('hey it is a reply so come over here.');
      let replies = this.data.comments[parentIndex].replies;

      let replyComment = this.data.comments[parentIndex].replies.find(item=>{
      return item.id === commentUid;
      });
    if (replyComment) {
      this.data.comments[parentIndex].replies = replies.filter(item=>{
        return item.id !== commentUid;
      });
      this.updateStorage();
      pubSub.publish('deleteComment', {parentId:parentId, mainId:commentUid});
    }else {
      return;
    } 
    }else{
      return;
    }
  
    //update the local Storage and publish your data to the subscribed functions
  
  }
  
  /* Upvote and downvote a main comment */
  upvoteDownvoteComment = (commentUid, vote) => {
    let comment = this.data.comments.find(item=>{
      return item.id === commentUid;
    });
    let hasVoted = this.data.currentUser.voted.hasOwnProperty(commentUid);
     
  if(comment){
      let commentIndex = this.data.comments.indexOf(comment);

      if(!hasVoted){
        this.data.currentUser.voted[commentUid] = vote;

        if(vote === 'upvote'){
          this.data.comments[commentIndex].score+=1;
          this.updateStorage();
          pubSub.publish('upvoteDownvote',
           {
            id:commentUid,
            score:this.data.comments[commentIndex].score,
          });
          return this.data.comments[commentIndex].score;
        }
        else if(vote === 'downvote'){
          if (this.data.comments[commentIndex].score === 0) {
            return;
          }
          this.data.comments[commentIndex].score-=2;
          this.updateStorage();
          pubSub.publish('upvoteDownvote',
           {
            id:commentUid,
            score:this.data.comments[commentIndex].score,
          });

          return this.data.comments[commentIndex].score;
      }

      }
      else if(hasVoted){
        if(vote === 'upvote' && (this.data.currentUser.voted[commentUid] === 'downvote')){
          this.data.comments[commentIndex].score+=2;
          this.data.currentUser.voted[commentUid] = vote;
          this.updateStorage();
          const scoreData = {
            id:commentUid,
            score:this.data.comments[commentIndex].score,
          }
          pubSub.publish('upvoteDownvote', scoreData);
          return this.data.comments[commentIndex].score;
        }
        else if(vote === 'downvote' && (this.data.currentUser.voted[commentUid] === 'upvote')){
          this.data.comments[commentIndex].score-=2;
          this.data.currentUser.voted[commentUid] = vote;
          this.updateStorage();
          const scoreData = {
            id:commentUid,
            score:this.data.comments[commentIndex].score,
          }
          pubSub.publish('upvoteDownvote', scoreData);
          return this.data.comments[commentIndex].score;
        }
        else{
          return;
        }
      }
  }
  }
  
  /* Upvote and downvote a reply to a main comment. */
  upvoteDownvoteReply(parentId, commentUid, vote){
    let parent =  this.data.comments.find((item)=>{
      return item.id === parentId;
    });
    let reply = parent.replies.find(item=>{
      return item.id === commentUid;
    });

    let hasVoted = this.data.currentUser.voted.hasOwnProperty(commentUid);

    if(reply){
      if(!hasVoted){
        this.data.currentUser.voted[commentUid] = vote;

        if(vote === 'upvote'){
            reply.score+=1;
            this.updateStorage();
            pubSub.publish('upvoteDownvote', {id:commentUid, score:reply.score});
            return reply.score;
        }
        if(vote === 'downvote'){
          if(reply.score === 0) {
            return;
          }
          reply.score-=1;
          this.updateStorage();
          pubSub.publish('upvoteDownvote', {id:commentUid, score:reply.score});
          return reply.score;
        }
      }

      let previousVote = this.data.currentUser.voted[commentUid];

      if(previousVote === vote){
        this.updateStorage();
        return;
      }
  
      if(vote === 'upvote' && (previousVote === 'downvote')){
        reply.score+=2;
        this.data.currentUser.voted[commentUid] = vote;
        this.updateStorage();
        const scoreData = {
          id:commentUid,
          score:reply.score,
        }
        /* Publish the data to the UI */
        pubSub.publish('upvoteDownvote', scoreData);
        return reply.score;
      }
      else if(vote === 'downvote' && (previousVote === 'upvote')){
        reply.score-=2;
        this.data.currentUser.voted[commentUid] = vote;
        this.updateStorage();
        const scoreData = {
          id:commentUid,
          score:reply.score,
        }
        /* Publish the data to the UI */
        pubSub.publish('upvoteDownvote', scoreData);
        return reply.score;
    }else{
      return;
    }
    }else{
      return;
    }
  }

}
const model = new Model();
export default model;
await model.loadData();

