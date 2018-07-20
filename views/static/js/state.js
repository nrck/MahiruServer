"use strict";

var URL = "http://localhost:17380/api/";
var pollingTime = 5000;

function getApi(apiName, callback) {
    var api = URL + apiName;
    $.getJSON(api, function (json) {
        callback(json);
    });
}

function getStatus() {
    var agentHTML = "";
    var jobnetHTML = "";
    getApi('state', function (json) {
        json.agent.forEach(agent => {
            agentHTML += "<div>";
            agentHTML += agent.name + "<br />";
            if (agent.conected) {
                agentHTML += '<div class="alert alert-success" role="alert">接続中</div>';
            } else {
                agentHTML += '<div class="alert alert-danger" role="alert">未接続</div>';
            }
            agentHTML += agent.ipaddress;
            agentHTML += '</div>';
        });

        json.jobnet.forEach(jobnet => {
            jobnetHTML += "<div>";
            jobnetHTML += "No." + jobnet.serial + " " + jobnet.name + "<br />";
            jobnetHTML += '</div>';
        });

        if (jobnetHTML === "") {
            jobnetHTML = "<p>実行中のジョブネットはありません</p>";
        }
        if (agentHTML === "") {
            agentHTML = "<p>エージェントが定義されていません</p>";
        }

        $("#jobnet").html(jobnetHTML);
        $("#agent").html(agentHTML);
    });

    setTimeout(() => {
        getStatus();
    }, pollingTime);
}

function getStatusJobnet() {
    getApi('allinfo', function () {

    });
    setTimeout(() => {
        getStatusJobnet();
    }, pollingTime);
}

function getStatusAgent() {
    getApi('allinfo', function () {

    });
    setTimeout(() => {
        getStatusAgent();
    }, pollingTime);
}