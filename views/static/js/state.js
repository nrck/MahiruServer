"use strict";

function getStatus() {
    var URL = "http://localhost:17380/api/state";
    var agentHTML = "";
    var jobnetHTML = "";
    $.getJSON(URL, function (json) {
        json.agent.forEach(agent => {
            agentHTML += "<div>";
            agentHTML += agent.name + "<br />";
            if (agent.conected) {
                agentHTML += '<b>接続中</b>';
            } else {
                agentHTML += '<u>未接続</u><br />';
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
}