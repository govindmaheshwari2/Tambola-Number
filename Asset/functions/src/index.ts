import * as functions from 'firebase-functions';
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
interface CustomData {
    NumberSet?: number[]
  }

import { dialogflow, SimpleResponse, Suggestions } from 'actions-on-google';
const app=dialogflow<CustomData,{}>({debug:true});

const talk:string[]=["Top of the house, number ","Me and you only, number ","Happy family only, number ",
"Murgi chor, number ","Punjab da puttar only, number ","Chopping sticks, number ", "Lucky no. ","Big fat lady, number ",
"You are mine, only number ","A big fat hen, number ","Two beautiful legs, number ",
"One dozen, number ","Unlucky for some lucky for me, number ","Valentine’s Day, number ",
"Yet to be kissed, number ","One Six, number ","Dancing Queen, number ", "Voting age, number ",
"Last of the teens, number ","One score, number ","All womens age, number ","Two little ducks, number ",
"You and me, number ","Two dozen, number ","Wish to have a wife at ",
"Republic Day, number ","Gateway to heaven, number ","Duck and its mate, number ",
"Rise & shine, number ","Women get flirty at ","Time for fun, number ","Buckle my shoe, number ",
"All the 3s, number ","Dil mange more, number ","Flirty wife, number ","Popular size, number ",
"More than eleven, number ","Christmas cake, number ","Watch your waistline, number ",
"Life begins at ", "Time for some fun at ","Winnie the pooh, number ",
"Climb a tree, number ","Chor chor, all the ","Halfway there, number ","Up to tricks, number ",
"Four and seven ","You are not late, number ","Rise and shine, number ",
"Golden Jublee at, number ","five and one ","Pack of cards, number ","Stuck in a tree, number ",
"Clean the floor, number ","All the fives, number ","Pick up sticks, number ","Mutiny Year, number ",
"Make them wait, number ","five and nine ","six and zero ","Bakers bun, number ",
"Turn the screw, number ","Click the three, number ","Catch the chor, number ",
"Old age pension, number ","Chakke pe chakka, number ","Made in heaven, number ",
"Check your weight, number ","Ulta Pulta, number ","Lucky blind, number ",
"Bang the drum, number ","seven and two ","Under the tree, number ","Still want more, number ",
"Diamond Jublee, number ","Lucky six, number ","hum saat saat hai, number ","Lucky seth, number ",
"One more time, number ","Gandhi’s breakfast, number ","Corner shot, number ","Last of the two, number ",
"Time for tea, number ","Last of the chors, number ","Staying alive, number ","Between the sticks, number ",
"Fat lady with a crutch, number ","Two fat ladies, number ","All but one, number ",
"Top of the house, number "]
let previous:number=0;
//let numberdone:number[]=[]

app.intent('Default Welcome Intent', async(conv) => {
    conv.data.NumberSet=[]
    conv.ask(new SimpleResponse({
        text: "Tambola by Govind Maheshwari. Say 'Next' for a new number, 'Repeat' to repeat the current number, 'Pause' to pause for 10 seconds and ask directly number to check whether it is done or not. The mic is going to set open for better interaction, after every number spoken by saying NEXT keyword mic is going to set open for the next command. Let's get started.",
        speech:"Tambola by Govind Maheshwari. Say 'Next' for a new number, 'Repeat' to repeat the current number, 'Pause' to pause for 10 seconds and ask directly number to check whether it is done or not. The mic is going to set open for better interaction, after every number spoken by saying NEXT keyword mic is going to set open for the next command. Let's get started.",
    }));
    conv.ask(new Suggestions(['Start','Pause']));
});

app.intent('previous intent', async(conv) => {
    let numberdone:number[]=[]
    if(conv.data.NumberSet){
        numberdone=conv.data.NumberSet
    }else{
        numberdone.length=0
    }
    if(numberdone.length===0){
        conv.ask(new SimpleResponse({
            text: "Say Start or Next for new number",
            speech:"Say Start or Next for new number",
        }));
        conv.ask(new Suggestions(['Start','Pause']));
        return
    }
    previous=numberdone[numberdone.length-1]
    conv.ask(new SimpleResponse({
        text: talk[previous-1]+previous,
        speech:"<speak>"+talk[previous-1]+previous+"<break time=\"1\"/></speak>",
    }));
    conv.ask(new Suggestions(['Next','Repeat','Pause']));
});

app.intent('Restart intent', async(conv) => {
    conv.data.NumberSet=[]
    conv.ask(new SimpleResponse({
        text: "Game is Restarted.",
        speech:"Game is Restarted.",
    }));
    conv.ask(new Suggestions(['Start','Pause']));
});

app.intent('pause intent', async(conv) => {
    conv.ask(new SimpleResponse({
        text: "Ok.",
        speech:"<speak> Ok. <break time=\"10\"/>Let's Continue.</speak>",
    }));
    conv.ask(new Suggestions([ 'Next','Repeat','Pause']));
});

app.intent('next intent', async(conv) => {
    let numberdone:number[]=[]
    if(conv.data.NumberSet){
        numberdone=conv.data.NumberSet
    }else{
        numberdone.length=0
    }
    const data=await scrapPage(numberdone);
    conv.data.NumberSet=numberdone
    conv.ask(new SimpleResponse({
        text: talk[parseInt(`${data.title}`+"")-1]+`${data.title}`,
        speech: "<speak>"+talk[parseInt(`${data.title}`+"")-1]+`${data.title}`+"<break time=\"1\"/></speak>",
    }));
    conv.ask(new Suggestions(['Next','Repeat','Pause']));
    if(numberdone.length===90){
        conv.close(new SimpleResponse({
            text: `All number done!`,
            speech:`All number done!`,
        }));
    }
});
async function scrapPage(numberdone:number[]){
    let current:number=0
    while(true){
        const no=randomnumber()
        const v=numberdone.indexOf(no)
        if(v===-1){
            numberdone.push(no)
            current=no
            break
        }
    }
    return{
            title:current
    }
}

function randomnumber(){
    const c=Math.floor(Math.random() * 90) + 1  
    return c
}

app.intent('exist number', async(conv,{number}) => {
    if(number!==NaN){
        if(parseInt(number+"")<1 || parseInt(number+"")>90){
            conv.ask(new SimpleResponse({
                text: `Out of Range. Please give a number in a range of 1 to 90`,
                speech:`Out of Range. Please give a number in a range of 1 to 90`,
            }));
            return
        }
        let numberdone:number[]=[]
        if(conv.data.NumberSet){
            numberdone=conv.data.NumberSet
        }else{
            numberdone.length=0
        }
    const check=numberdone.indexOf(parseInt(number+""))
    if(check===-1){
        conv.ask(new SimpleResponse({
            text: `No, `+ number +` has not been spoken`,
            speech:`No, `+ number +` has not been spoken`,
        }));
    }else{
        conv.ask(new SimpleResponse({
            text: `Yes, `+ number +` has been spoken`,
            speech:`Yes, `+ number +` has been spoken`,
        }));
    }
    conv.ask(new Suggestions(['Next','Repeat','Pause']));
}else{
    conv.ask(new SimpleResponse({
        text: `Something went wrong try again`,
        speech:`Something went wrong try again`,
    }));
}
});

export const fulfillment = functions.https.onRequest(app);