(function () {
    switch (request.method) {
        case 'GET':
            const resData = {
                'jobnet': jobnet.finished|| []
            };
            response.status(200);
            response.end(JSON.stringify(resData, undefined, '  '));

            return;

        default:
            return;
    }
})();
