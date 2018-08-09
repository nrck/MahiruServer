(function () {
    switch (request.method) {
        case 'GET':
            const resData = {
                'define': define,
                'agent': agent,
                'jobnet': jobnet
            };
            response.header("Content-Type", "application/json; charset=utf-8");
            response.status(200);
            response.end(JSON.stringify(resData, undefined, '  '));

            return;

        default:
            return;
    }
})();