(function () {
    const resData = {
        'agent': agent.state || [],
        'jobnet': jobnet.running || []
    };
    response.header("Content-Type", "application/json; charset=utf-8");
    response.header("Access-Control-Allow-Origin", "*");
    response.status(200);
    response.end(JSON.stringify(resData, undefined, '  '));
})();
