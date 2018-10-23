'use strict';

function sendNewJobnet(data) {
    $.ajax({
            type: "post",
            url: "/api/jobnet",
            data: JSON.stringify(data),
            contentType: 'application/json',
            dataType: "json"
        })
        .then(
            function (res) {
                location.href = `/edit/jobnet?name=${data.jobnet.name}`;
            },
            function (res) {
                $('#error').html(res.responseText);
            }
        );
}

function createNewJobnet(jobnetname) {
    var data = {
        jobnet: {
            name: jobnetname,
            enable: false,
            info: `${jobnetname}の説明文を入れます。`,
            schedule: {
                month: {
                    operation: 'Every month'
                },
                day: {
                    operation: 'Every day'
                },
                start: {
                    time: '0:00',
                    enable: true
                },
                delay: {
                    enable: false
                },
                deadline: {
                    enable: false
                }
            },
            nextMatrix: [
                [0, 1],
                [0, 0]
            ],
            errorMatrix: [
                [0, 1],
                [0, 0]
            ],
            jobs: [{
                    isSpecial: true,
                    code: "start",
                    agentName: "",
                    info: "",
                    schedule: {
                        month: {
                            operation: 'Every month'
                        },
                        day: {
                            operation: 'Every day'
                        },
                        start: {
                            enable: false
                        },
                        delay: {
                            enable: false
                        },
                        deadline: {
                            enable: false
                        }
                    }
                },
                {
                    isSpecial: true,
                    code: "end",
                    agentName: "",
                    info: "",
                    schedule: {
                        month: {
                            operation: 'Every month'
                        },
                        day: {
                            operation: 'Every day'
                        },
                        start: {
                            enable: false
                        },
                        delay: {
                            enable: false
                        },
                        deadline: {
                            enable: false
                        }
                    }
                }
            ]
        }
    };
    sendNewJobnet(data);
}