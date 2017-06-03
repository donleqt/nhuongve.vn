/**
 * Created by Don Le on 5/31/2017.
 */

/**
 * This service is to connection and interact with firebase cloud database
 *@param firebase: should import firebase sdk in index
 */
angular.module('myApp').factory('db',function () {
    // Check if SDK was loaded
    if(firebase === undefined) {
        console.log('Db service can\'t find Firebase SDK !');
        return;
    }
    //Config app
    var config = {
        apiKey: "AIzaSyAo0NknIdKjFebkuBCMAFwGlJeHtB4H638",
        authDomain: "nhuong-ve.firebaseapp.com",
        databaseURL: "https://nhuong-ve.firebaseio.com",
        projectId: "nhuong-ve",
        storageBucket: "nhuong-ve.appspot.com",
        messagingSenderId: "319774772014"
    };
    //Load app and export database
    var app = firebase.initializeApp(config);
    return app.database();
});