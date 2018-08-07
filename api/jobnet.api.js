'use strict';
(function () {
    const cmCallback = function (err, data) {
        if (err !== undefined || data === undefined) {
            response.status(500);
            response.end();
            return;
        }
        response.status(200);
        response.header("Content-Type", "application/json; charset=utf-8");
        response.end(JSON.stringify(newJobnet, undefined, '  '));
        return;
    };

    const jobnetName = request.query.jobnetName || undefined;
    const newJobnet = request.query.jobnet;

    switch (request.method) {
        case 'POST':
            // 新規作成・更新
            if (jobnetName === undefined) {
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
            response.status(200);
            response.header("Content-Type", "application/json; charset=utf-8");
            response.end(JSON.stringify(jobnet, undefined, '  '));
            return;
    }
})();