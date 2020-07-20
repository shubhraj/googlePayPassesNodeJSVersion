let promptUtil = require("./lib/prompt");
let getFromPrompt = promptUtil.getFromPrompt;
const uuid1 = require('uuid/v1');
const conf = require('./conf');
var config = new conf();
let Services = require('./services');
var jwt = require('jsonwebtoken');
let services = new Services();


const SAVE_LINK = "https://pay.google.com/gp/v/save/" ;  //Save link that uses JWT. See https://developers.google.com/pay/passes/guides/get-started/implementing-the-api/save-to-google-pay#add-link-to-email

init();

async function getPassType(){
    let choice = await getFromPrompt('\n\n*****************************\n' +
        'Which pass type would you like to demo?\n' +
        'b - Boarding Pass\n' +
        'e - Event Ticket\n' +
        'g - Gift Card\n' +
        'l - Loyalty\n' +
        'o - Offer\n' +
        't - Transit\n' +
        'q - Quit\n' +
        '\n\nEnter your choice:');

   return choice;
}

function isValidChoice(choice){
    let choiceArr = ['b','e','g','l','o','t','q'];
    if (choiceArr.includes(choice))
        return true;
    return false;
}

async function init(){
    let verticalType = 'VerticalType.OFFER';
    let classUid = verticalType.split('.')[1] + "_CLASS_" + uuid1();
    let classId = '' + config.ISSUER_ID + '.' +classUid;
    let objectUid = verticalType.split('.')[1] + "_OBJECT_" + uuid1();
    let objectId = '' + config.ISSUER_ID + '.' + objectUid;
    await demoSkinnyJwt(verticalType, classId, objectId);
}

async function demoSkinnyJwt(verticalType, classId, objectId){

    console.log('\'\'\'\n' +
       '\n' +
       '  #############################\n' +
       '  #\n' +
       '  #  Generates a signed "skinny" JWT.\n' +
       '  #  2 REST calls are made:\n' +
       '  #    x1 pre-insert one classes\n' +
       '  #    x1 pre-insert one object which uses previously inserted class\n' +
       '  #\n' +
       '  #  This JWT can be used in JS web button.\n' +
       '  #  This is the shortest type of JWT; recommended for Android intents/redirects.\n' +
       '  #\n' +
       '  #############################\n' +
       '\n' +
       '  \'\'\'');

    let skinnyJwt = await services.makeSkinnyJwt(verticalType, classId, objectId);

    if(skinnyJwt){
        let decoded = jwt.decode(skinnyJwt);
        console.log(`This is an "skinny" jwt: ${decoded}`);
        let url = 'https://developers.google.com/pay/passes/support/testing#test-and-debug-a-jwt';
        console.log(`you can decode it with a tool to see the unsigned JWT representation:\n ${url}`);
        let SAVE_LINK = "https://pay.google.com/gp/v/save/"+ skinnyJwt;
        console.log(`Try this save link in your browser:\n ${SAVE_LINK}`);
        return;
    }
}