//let auth = require("google-auth-library");
const {google} = require('googleapis');
let Conf = require('./conf');
let config = new Conf();
var request = require('request');

const scopes = config.SCOPES;

var serviceAccount = require("./creds");

class RestMethods {

   async insertClass(verticalType, payload) {
       let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=UTF-8',
        };

       let jwtClient = new google.auth.JWT(
           serviceAccount.client_email,
           null,
           serviceAccount.private_key,
           scopes
       );

       let data = await jwtClient.authorize();

       let isValidData = await this.validateData(data);
       if(isValidData){

          let accessToken = data.access_token;
          console.log("insertClass : " + accessToken);
          let url = `https://walletobjects.googleapis.com/walletobjects/v1/offerClass/?access_token=${accessToken}`;

          var options = {
              method: 'POST',
              url: url,
              json: true,
              body: payload,
              headers: headers,
          },
          response;

          var promise = new Promise((resolve, reject) => {
              request.post(options, function (error, response) {

                  if(error) {
                      reject(error);
                  }
                  resolve(response);
              });
          });

          return promise;
       }
    }

   async insertObject(verticalType, payload){
       let headers = {
           'Accept': 'application/json',
           'Content-Type': 'application/json; charset=UTF-8'
       };

       let jwtClient = new google.auth.JWT(
           serviceAccount.client_email,
           null,
           serviceAccount.private_key,
           scopes
       );

       let data = await jwtClient.authorize();
       //Define insert() REST call of target vertical
       let accessToken = data.access_token;

       console.log("insert object : " +accessToken);
       let isValidData = await this.validateData(data);
       if(isValidData){


           let url = `https://walletobjects.googleapis.com/walletobjects/v1/offerObject/?access_token=${accessToken}`;

           var options = {
               url: url,
               body: payload,
               json: true,
               headers: headers
           }, response;

           var promise = new Promise((resolve, reject) => {
               request.post(options, function (error, response) {

                   if(error) {
                       reject(error);
                   }
                   resolve(response);
               });
           });

           return promise;
       }
   }

    async validateData(data) {
        if(data.access_token === null){
            console.log("Provided service account does not have permission to generate access tokens");
            return false;
        }else if(data === undefined){
            console.log("Error making request to generate access token:");
            return false;
        }
        return true;
    }

   async getClass(verticalType, classId){
        let jwtClient = new google.auth.JWT(
           serviceAccount.client_email,
           null,
           serviceAccount.private_key,
           scopes
       );

       let data = await jwtClient.authorize();

       let isValidData = await this.validateData(data);

       if(isValidData){
           let accessToken = data.access_token;
           let url = `https://walletobjects.googleapis.com/walletobjects/v1/offerClass/${classId}`;
           let headers = {
               'Accept': 'application/json',
               'Content-Type': 'application/json; charset=UTF-8'
           };

           var options = {
                   method: 'GET',
                   url: url,
                   headers: headers,
                   auth: {
                       'bearer': accessToken
                   }
               };

           var promise = new Promise((resolve, reject) => {
               request.get(options, function (error, response) {

                   if(error) {
                       reject(error);
                   }
                   resolve(response);
               });
           });

           return promise;
       }
   }

   async getObject(verticalType, objectId){
      let headers = {
           'Accept': 'application/json',
           'Content-Type': 'application/json; charset=UTF-8'
       };

       let jwtClient = new google.auth.JWT(
           serviceAccount.client_email,
           null,
           serviceAccount.private_key,
           scopes
       );

       let data = await jwtClient.authorize();
       let isValidData = await this.validateData(data);

       if(isValidData){
           let accessToken = data.access_token;
           let url = `https://walletobjects.googleapis.com/walletobjects/v1/offerObject/${objectId}`;

           var options = {
               method: 'GET',
               url: url,
               headers: headers,
               auth: {
                   'bearer': accessToken
               }
           };

           var promise = new Promise((resolve, reject) => {
               request.get(options, function (error, response) {

                   if(error) {
                       reject(error);
                   }
                   resolve(response);
               });
           });

           return promise;

       }

   }
}

module.exports = RestMethods;