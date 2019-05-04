const axios = require('axios');
var containerUtil = require('./containerUtil');
var http_util = require('./util/http_util');
var timerHandler = undefined;
var apiCounter = 0;
var firstRequest = true;
var TWO_MIN_IN_MSEC = 2 * 60 * 1000;


function httpCallBack(responseObj,apiResp){
      responseObj.sendStatus(200);
}

function loadBalancer() {
    firstRequest = true;
    let numberOfContainersTobeRun = Math.ceil(apiCounter/20);
    apiCounter = 0;
}

function handleRequest(request, response) {
    apiCounter++;
    if(firstRequest){
        firstRequest = false;
        timerHandler = setTimeout(loadBalancer, TWO_MIN_IN_MSEC);
        // start timer for 2 min
    }

    var hostUrl = containerUtil.getHostUrl();

    http_util.makeRequest(hostUrl, request, response, httpCallBack);
    //console.log("<loadBalancerUtil> url: "+url);
}


module.exports.handleRequest = handleRequest;