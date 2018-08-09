(function () {
    const resData = {
        'agent': agent.state || [],
        'jobnet': jobnet.running || []
    };
    response.header("Content-Type", "application/json; charset=utf-8");
    response.status(200);
    response.end(JSON.stringify(resData, undefined, '  '));
})();
