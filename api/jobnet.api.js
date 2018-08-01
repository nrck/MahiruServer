'use strict';
(function () {
    switch (request.method) {
        case 'POST':
            let newJobnet = request.query;
            if (typeof newJobnet === 'string') {
                try {
                    newJobnet = JSON.parse(newJobnet);
                } catch (error) {
                    response.sendStatus(400);
                    response.end(error.message);

                    return;
                }
            }

            if (JSON.stringify(newJobnet) === '{}') {
                response.sendStatus(400);

                return;
            } else {
                jobnet.define.push(newJobnet);
                response.status(200);
                response.header("Content-Type", "application/json; charset=utf-8");
                response.end(JSON.stringify(newJobnet, undefined, '  '));
            }

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