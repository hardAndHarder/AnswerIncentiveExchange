import { NearBindgen, Vector } from "near-sdk-js";
@NearBindgen({})
export class Question{
    author: string;
    content: string;

    
    constructor(
        author: string,
        content: string,
    ){
        this.author = author;
        this.content = content;
    }
}
@NearBindgen({})
export class Answer{
    author: string;
    content: string;
    likeNumber: number;
    dislikeNumber: number;

    constructor(
        author: string,
        content: string
    ){
        this.author = author;
        this.content = content;
        this.likeNumber = 0;
        this.dislikeNumber = 0;
    }
}