(function () {
    switch (request.method) {
        case 'GET':
            const resData = {
                'jobnet': jobnet.finished || []
            };
            response.header("Content-Type", "application/json; charset=utf-8");
            response.status(200);
            response.end(JSON.stringify(resData, undefined, '  '));

            return;

        default:
            return;
    }
})();
