"use strict";

var URL = "/api/";
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
            if (agent.connected) {
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

        for (let i = 0; i < (10 < json.waitting.length ? 10 : json.waitting.length); i++) {
            const waitJobnet = json.waitting[i];
            waitJobnetHTML += "<tr>";
            waitJobnetHTML += "<td>" + waitJobnet.serial + "</td>";
            waitJobnetHTML += "<td>" + waitJobnet.name + "</td>";
            waitJobnetHTML += "<td>" + waitJobnet.info + "</td>";
            waitJobnetHTML += "<td>" + new Date(waitJobnet.queTime).toLocaleString() + "</td>";
            waitJobnetHTML += '</tr>';
        }

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
    var tableHeader = "<table class=\"table table-hover\"><tbody>";
    var stateAgentTh = "<tr><th>エージェント名</th><th>IPアドレス</th><th>状態</th></tr>";
    var tableHooter = "</tbody></table>";
    var stateAgentHTML = "";
    getApi('allinfo', function (pjson) {
        var json = pjson.agent;
        json.state.forEach(stateAgent => {
            stateAgentHTML += "<tr>";
            stateAgentHTML += "<td>" + stateAgent.name + "</td>";
            stateAgentHTML += "<td>" + stateAgent.ipaddress + "</td>";
            stateAgentHTML += "<td>" + (stateAgent.connected ? "接続中" : "未接続") + "</td>";
            stateAgentHTML += '</tr>';
        });

        if (stateAgentHTML !== "") {
            stateAgentHTML = tableHeader + stateAgentTh + stateAgentHTML + tableHooter;
        } else {
            stateAgentHTML = "<p>定義がありません</p>";
        }

        $("#stateAgent").html(stateAgentHTML);
    });

    setTimeout(() => {
        getStatusAgent();
    }, pollingTime);
}