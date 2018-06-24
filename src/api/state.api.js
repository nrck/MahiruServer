(function () {
    switch (request.method) {
        case 'GET':
            const resData = {
                'agent': agent.state,
                'jobnet': jobnet.running
            };
            response.status(200);
            response.end(JSON.stringify(resData, undefined, '  '));

            return;

        default:
            return;
    }
})();
