class ResourceDefinitions {

   async makeOfferClassResource(classId){
       let payload =
           {
               "id": classId,
               "issuerName": "Bacon-Rista",
               "provider": "offers-R-us",
               "redemptionChannel": "online",
               "reviewStatus": "underReview",
               "title": "20% lattes",
               "titleImage": {
                   "sourceUri": {
                       "uri": "https://farm4.staticflickr.com/3723/11177041115_6e6a3b6f49_o.jpg",
                       "description": "titleImage-coffee"
                   }
               },
               "locations": [
                   {
                       "kind": "walletobjects#latLongPoint",
                       "latitude": 37.424015499999996,
                       "longitude": -122.09259560000001
                   },
                   {
                       "kind": "walletobjects#latLongPoint",
                       "latitude": 37.424354,
                       "longitude": -122.09508869999999
                   },
                   {
                       "kind": "walletobjects#latLongPoint",
                       "latitude": 37.7901435,
                       "longitude": -122.39026709999997
                   },
                   {
                       "kind": "walletobjects#latLongPoint",
                       "latitude": 40.7406578,
                       "longitude": -74.00208940000002
                   }
               ],
               "textModulesData": [
                   {
                       "header": "Details",
                       "body": "20% off one cup of coffee at all Baconrista Coffee locations. " +
                           "Only one can be used per visit."
                   },
                   {
                       "header": "About Baconrista",
                       "body": "Since 2013, Baconrista Coffee has been committed to making high " +
                           "quality bacon coffee. Visit us in our stores or online at www.baconrista.com"
                   }
               ] ,
               "linksModuleData": {
                   "uris": [
                       {
                           "kind": "walletobjects#uri",
                           "uri": "https://maps.google.com/",
                           "description": "Nearby Locations"
                       },
                       {
                           "kind": "walletobjects#uri",
                           "uri": "tel:6505555555",
                           "description": "Call Customer Service"
                       }
                   ]
               },
               "imageModulesData": [
                   {
                       "mainImage": {
                           "kind": "walletobjects#image",
                           "sourceUri": {
                               "kind": "walletobjects#uri",
                               "uri": "https://farm4.staticflickr.com/3738/12440799783_3dc3c20606_b.jpg",
                               "description": "Coffee beans"
                           }
                       }
                   }
               ]
           }

       return payload;
    }

   async makeOfferObjectResource(classId, objectId){
       let  payload = {};
       payload = {
           "id": objectId,
           "classId": classId,
           "state": "active",
           "barcode": {
               "type": "qrCode",  //check reference API for types of barcode
               "value": "1234abc",
               "alternateText": "optional alternate text"
           },
           "validTimeInterval": {
               "kind": "walletobjects#timeInterval",
               "end": {
                   "date": "2019-02-01T23:20:50.52Z"
               }
           }
       }

       return payload
   }
}

module.exports = ResourceDefinitions;