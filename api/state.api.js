(function () {
    const resData = {
        'agent': agent.state || [],
        'jobnet': jobnet.running|| []
    };
    response.status(200);
    response.end(JSON.stringify(resData, undefined, '  '));
})();
