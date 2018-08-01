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
    var tableHeader = "<table class=\"table table-hover\"><tbody>";
    var tableHooter = "</tbody></table>";
    getApi('state', function (json) {
        json.agent.forEach(agent => {
            agentHTML += "<tr>";
            if (agent.conected) {
                agentHTML += '<td class="text-left"><span class="alert alert-success">接続中</span></td>';
            } else {
                agentHTML += '<td class="text-left"><span class="alert alert-danger">未接続</span></td>';
            }
            agentHTML += "<td>" + agent.name + "</td>";
            agentHTML += "<td>" + agent.ipaddress + "</td>";
            agentHTML += '</tr>';
        });

        json.jobnet.forEach(jobnet => {
            jobnetHTML += "<tr>";
            jobnetHTML += "<td>" + jobnet.serial + "</td>";
            jobnetHTML += "<td>" + jobnet.name + "</td>";
            jobnetHTML += '</tr>';
        });

        if (jobnetHTML === "") {
            jobnetHTML = "<p>実行中のジョブネットはありません</p>";
        }
        if (agentHTML === "") {
            agentHTML = "<p>エージェントが定義されていません</p>";
        } else {
            agentHTML = tableHeader + agentHTML + tableHooter;
        }

        $("#jobnet").html(jobnetHTML);
        $("#agent").html(agentHTML);
    });

    setTimeout(() => {
        getStatus();
    }, pollingTime);
}

function getStatusJobnet() {
    var tableHeader = "<table class=\"table table-hover\"><tbody>";
    var defJobnetTh = "<tr><th>ジョブネット名</th><th>説明</th><th>開始時刻</th><th>月</th><th>日</th></tr>";
    var waitJobnetTh = "<tr><th>#</th><th>ジョブネット名</th><th>説明</th><th>開始時刻</th></tr>";
    var tableHooter = "</tbody></table>";
    var defJobnetHTML = "";
    var runJobnetHTML = "";
    var waitJobnetHTML = "";
    getApi('jobnet?sort=quetime', function (json) {
        //var json = pjson.jobnet;
        json.define.forEach(defJobnet => {
            defJobnetHTML += "<tr>";
            defJobnetHTML += "<td>" + defJobnet.name + "</td>";
            defJobnetHTML += "<td>" + defJobnet.info + "</td>";
            defJobnetHTML += "<td>" + defJobnet.schedule.start.time + "</td>";
            defJobnetHTML += "<td><span class=\"bg-primary text-white px-2 rounded\">" + defJobnet.schedule.month.operation + "</span></td>";
            defJobnetHTML += "<td><span class=\"bg-primary text-white px-2 rounded\">" + defJobnet.schedule.day.operation + "</span></td>";
            defJobnetHTML += '</tr>';
        });

        json.running.forEach(runJobnet => {
            runJobnetHTML += "<tr>";
            runJobnetHTML += "<td>" + runJobnet.name + "</td>";
            runJobnetHTML += "<td>" + runJobnet.info + "</td>";
            runJobnetHTML += "<td>" + runJobnet.schedule.start.time + "</td>";
            runJobnetHTML += "<td><span class=\"bg-primary text-white px-2 rounded\">" + runJobnet.schedule.month.operation + "</span></td>";
            runJobnetHTML += "<td><span class=\"bg-primary text-white px-2 rounded\">" + runJobnet.schedule.day.operation + "</span></td>";
            runJobnetHTML += '</tr>';
        });

        json.waitting.forEach(waitJobnet => {
            waitJobnetHTML += "<tr>";
            waitJobnetHTML += "<td>" + waitJobnet.serial + "</td>";
            waitJobnetHTML += "<td>" + waitJobnet.name + "</td>";
            waitJobnetHTML += "<td>" + waitJobnet.info + "</td>";
            waitJobnetHTML += "<td>" + new Date(waitJobnet.queTime).toLocaleString() + "</td>";
            waitJobnetHTML += '</tr>';
        });

        if (defJobnetHTML !== "") {
            defJobnetHTML = tableHeader + defJobnetTh + defJobnetHTML + tableHooter;
        } else {
            defJobnetHTML = "<p>定義がありません</p>";
        }
        if (runJobnetHTML !== "") {
            runJobnetHTML = tableHeader + defJobnetTh + runJobnetHTML + tableHooter;
        } else {
            runJobnetHTML = "<p>実行中のジョブネットはありません</p>";
        }
        if (waitJobnetHTML !== "") {
            waitJobnetHTML = tableHeader + waitJobnetTh + waitJobnetHTML + tableHooter;
        } else {
            waitJobnetHTML = "<p>開始待ちのジョブネットはありません</p>";
        }

        $("#defJobnet").html(defJobnetHTML);
        $("#runJobnet").html(runJobnetHTML);
        $("#waitJobnet").html(waitJobnetHTML);
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