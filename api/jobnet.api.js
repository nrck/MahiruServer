'use strict';
(function () {
    const cmCallback = function (err, data) {
        if (err) {
            response.status(500);
            response.send(`<b>${err.message}</b><br><pre>${err.stack}</pre>`);
            response.end();
            return;
        }
        response.status(200);
        response.header("Content-Type", "application/json; charset=utf-8");
        response.end(JSON.stringify(data, undefined, '  '));
        return;
    };

    const jobnetName = request.body.jobnetName || undefined;
    const newJobnet = JSON.stringify(request.body.jobnet, undefined, '  ');

    switch (request.method) {
        case 'POST':
            // 新規作成・更新
            if (typeof jobnetName === 'undefined') {
                clientManager.putDefineJobnet(newJobnet, cmCallback);
            } else {
                clientManager.updateDefineJobnet(jobnetName, newJobnet, cmCallback);
            }
            return;

        case 'DELETE':
            // 削除
            clientManager.removeDefineJobnet(jobnetName, cmCallback);
            return;

        default:
            if (request.query.sort === 'quetime') {
                jobnet.waitting.sort(
                    (a, b) => new Date(a.queTime).getTime() - new Date(b.queTime).getTime()
                );
            }
            if (typeof request.query.name !== 'undefined' ) {
                var name = request.query.name;
                jobnet = jobnet.define.find((definejobnet) => definejobnet.name === name);
                if(typeof jobnet === 'undefined') {
                    jobnet = {};
                }
            }
            response.status(200);
            response.header("Content-Type", "application/json; charset=utf-8");
            response.end(JSON.stringify(jobnet, undefined, '  '));
            return;
    }
})();