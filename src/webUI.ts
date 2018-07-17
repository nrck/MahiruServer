import * as Http from 'http';

export class WebUI {
    public static WEB_UI_PORT = '17380'; // いなみ80番ポート
    public static MAHIRU_HOSTNAME = 'localhost';
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
    private static getState(): Promise<string> {
        return new Promise((resolve: (value: string) => void, reject: (reason: Error) => void) => {
            const URL = `http://${WebUI.MAHIRU_HOSTNAME}:${WebUI.WEB_UI_PORT}/api/state`;
            Http.get(URL, (res: Http.IncomingMessage) => {
                // Status Code 200以外はエラーで返す
                const statusCode = res.statusCode;
                // tslint:disable-next-line:no-magic-numbers
                if (statusCode !== 200) {
                    if (typeof statusCode !== 'undefined') {
                        reject(new Error(WebUI.errorCode(statusCode.toString())));
                    } else {
                        reject(new Error(WebUI.errorCode('500')));
                    }

                    return;
                }

                let tmp = '';
                res.setEncoding('utf8');
                res.on('data', (data: string) => {
                    tmp += data;
                });
                res.on('end', () => {
                    resolve(tmp);
                });
            }).on('error', (error: Error) => {
                reject(error);
            });
        });
    }

    public static errorCode(code: string): string {
        return WebUI.STATUS_CODE.find((str: string): boolean => str.indexOf(code) >= 0) || '500 Internal Server Error\n';
    }

    public static renderIndex(): object {
        const obj = {
            'agents': '',
            'jobnets': '',
            'pageTitle': 'ダッシュボード'
        };
        /*
        WebUI.getState().then(
            (value: string) => {
                obj.agents = JSON.parse(value).agent;
                obj.jobnets = JSON.parse(value).jobnet;
                return obj;
            },
            (error: Error) => {
                obj.agents = error.message;
                obj.jobnets = error.message;
                return obj;
            }
        );
        */
        WebUI.getState2().then(
            (value: object) => {

            }
        )

    }

    private static async getState2(): Promise<object> {
        const URL = `http://${WebUI.MAHIRU_HOSTNAME}:${WebUI.WEB_UI_PORT}/api/state`;
        const obj = {
            'error': new Error(),
            'json': ''
        };
        await Http.get(URL, (res: Http.IncomingMessage) => {
            // Status Code 200以外はエラーで返す
            const statusCode = res.statusCode;
            // tslint:disable-next-line:no-magic-numbers
            if (statusCode !== 200) {
                obj.error = typeof statusCode !== 'undefined' ? new Error(WebUI.errorCode(statusCode.toString())) : obj.error = new Error(WebUI.errorCode('500'));

                return;
            }

            let tmp = '';
            res.setEncoding('utf8');

            res.on('data', (data: string) => {
                tmp += data;
            });

            res.on('end', () => {
                obj.json = tmp;
            });
        });

        return obj;
    }


}
