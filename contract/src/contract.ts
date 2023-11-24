// Find all our documentation at https://docs.near.org
import { NearBindgen, near, call, view, UnorderedMap, assert, Vector } from 'near-sdk-js';
import { Question, Answer } from './model';

@NearBindgen({})
class Contract {

    // questions = new UnorderedMap<Question>("q");
    questionById = new UnorderedMap<Question>("i")
    answerByQuesId = new UnorderedMap<Array<Answer> >("a")
    pointsById = new UnorderedMap<number>("p")
    nearEarned = new UnorderedMap<number>("n");


    @call({})
    reset(){
      this.questionById.clear();
      this.answerByQuesId.clear();
      this.pointsById.clear();
      this.nearEarned.clear();
    }

    // save user login
    @call({})
    login(){
      
      const accountId = near.predecessorAccountId();

      // check if the account already exists in pointsById map
      if(this.pointsById.get(accountId) != null){
        // return current points
        return this.pointsById.get(accountId);
      } else {
        // set 0 point for first user
        this.pointsById.set(accountId, 0);
        return 0;
      }
      
    }


    // CALL methods

    // Create new Question Post
    @call({})
    createPost({content}:{ content: string}){
      const author = near.predecessorAccountId()
      const question = new Question(author, content);

      const questionId = this.questionById.length.toString();
      // add it into question map
      this.questionById.set(questionId, question);
      const answers : Array<Answer> = [];
      this.answerByQuesId.set(questionId, answers)
    }

    // Add answer comment to question Post
    @call({})
    addAnswerToQuestion({contentAnswer, questionId}: {contentAnswer: string, questionId: string}){
      const author = near.predecessorAccountId();
      const answer = new Answer(author, contentAnswer);

      assert(this.questionById.get(questionId), "question id not exist")
      
      // add answer to answerById
      let answers = this.answerByQuesId.get(questionId);
      
      answers.push(answer);
      this.answerByQuesId.set(questionId, answers);

      return answers;
    }

    // Function to count number of like of answer
    @call({})
    likeAction({questionId, authorOfComment}:{questionId: string, authorOfComment: string}){
      // assert(this.answerByQuesId.get(answerId), "This answerId does not exist")

      // get all comments of this post(questionId)
      const answers = this.answerByQuesId.get(questionId);
      let answer:Answer; 

      // increase like
      answers.forEach(item => {
        if(item.author == authorOfComment){
          answer = item;
          item.likeNumber+=1;
        }
      })

      // update points for user
      const currentPoint = this.pointsById.get(authorOfComment);
      this.answerByQuesId.set(questionId, answers);
      this.pointsById.set(authorOfComment, currentPoint+1);

      return answers;
    }

    // Function to count dislike, dislike - 10points and the action dislike will pay 0,1 near
    // the 0.1 near will send to contract address. this donate to exchange near and points for active user
    // this to avoid spam like and dislike by cheating accounts
    @call({})
    dislikeAction({questionId, authorOfComment}:{questionId: string, authorOfComment: string}){
      //check answerId
      // assert(this.answerById.get(answerId), "This answerId does not exist");
      
      // check acocunt balance
      assert(near.accountBalance() > BigInt("100000000000000000000000"), "Insifficient balance");
      const promise = near.promiseBatchCreate("loenwei-contract.testnet");
      near.promiseBatchActionTransfer(promise, BigInt("100000000000000000000000"));

      // get all comments of this post(questionId)
      const answers = this.answerByQuesId.get(questionId);
      let answer:Answer; 

      // increase dislike
      answers.forEach(item => {
        if(item.author == authorOfComment){
          answer = item;
          item.dislikeNumber+=1;
        }
      })

      // update points for user
      const currentPoint = this.pointsById.get(authorOfComment);
      this.answerByQuesId.set(questionId, answers);
      this.pointsById.set(authorOfComment, currentPoint - 10);

      return answers;
    }

    // Function to exchange point, which user earn in the answer process
    // 100 points to 1 near
    // the contract address will call this method
    @call({})
    exchangePointsToNear({accountId}:{accountId: string}){
      // get current points
      const currentPoint = this.pointsById.get(accountId);
      if(currentPoint >0){
        const nearExchange = (currentPoint/100);
        const promise = near.promiseBatchCreate(accountId);
        // send near to user and reset points
        near.promiseBatchCreate(accountId);
        near.promiseBatchActionTransfer(promise, BigInt(10000000000000000000000000*nearExchange));
        // reset points to zero
        this.pointsById.set(accountId,0);
        if(this.nearEarned.get(accountId)==null){
          this.nearEarned.set(accountId, nearExchange);
        } else{
          this.nearEarned.set(accountId, nearExchange+this.nearEarned.get(accountId));
        }
        
        return nearExchange + "near";
      }
      assert(currentPoint>0, "Not enough points to exchange. Let's collect more!!!! 5ting!!!");
      return "Not enough points to exchange. Let's collect more!!!! 5ting!!!";
    }


    // View methods
    @view({})
    getAllQuestion(){
      const quesArr = [];
      for(let [k,v] of this.questionById){
        quesArr.push(v);
      }
      return quesArr;
    }

    @view({})
    getCommentsForSpecificPost({questionId}:{questionId: string}){
      return this.answerByQuesId.get(questionId);
    }

    @view({})
    getAllComment(){
      const arr = [];
      for(let [k,v] of this.answerByQuesId){
        arr.push(v);
      }
      return arr;
    }

    @view({})
    getPointLeaderBoard(){
      const leaderBoard = [];

      //convert the map tp an array
      for(let [k,v] of this.pointsById){
        leaderBoard.push({id: k, points: v, earned: this.nearEarned.get(k)});
      }

      // sort the leaderboard based on points in decending order
      leaderBoard.sort((a,b) => b.points - a.points);
      return leaderBoard;
    }
}