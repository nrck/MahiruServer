export class WebUI {
    public static WEB_UI_PORT = '17380'; // いなみ80番ポート
    public static STATUS_CODE: string[] = [
        '400 Bad Request\n',
        '401 Unauthorized\n',
        '402 Payment Required\n',
        '403 Forbidden\n',
        '404 Not Found\n',
        '405 Method Not Allowed\n',
        '406 Not Acceptable\n',
        '407 Proxy Authentication Required\n',
        '408 Request Timeout\n',
        '409 Conflict\n',
        '410 Gone\n',
        '411 Length Required\n',
        '412 Precondition Failed\n',
        '413 Request Entity Too Large\n',
        '414 Request-URI Too Long\n',
        '415 Unsupported Media Type\n',
        '416 Requested Range Not Satisfiable\n',
        '417 Expectation Failed\n',
        '429 Too Many Requests\n',
        '451 Unavailable For Legal Reasons\n',
        '500 Internal Server Error\n',
        '501 Not Implemented\n',
        '502 Bad Gateway\n',
        '503 Service Unavailable\n'
    ];

    public static errorCode(code: string): string {
        return WebUI.STATUS_CODE.find((str: string): boolean => str.indexOf(code) >= 0) || '500 Internal Server Error\n';
    }

    public static renderIndex(): object {
        const obj = {
            'pageTitle': 'ダッシュボード'
        };

        return obj;
    }
}
