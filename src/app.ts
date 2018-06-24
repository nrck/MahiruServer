import * as Express from 'express';
import { Api } from './api';

class App {
    public static WEB_UI_PORT = '8080';
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

    private ui = Express();
    private api = new Api();

    public init(): void {
        this.ui.set('views', 'views/pages/');
        this.ui.set('view engine', 'ejs');
        this.ui.get('/', (_req: Express.Request, _res: Express.Response, _next: Express.NextFunction) => { _res.render('views/pages/index'); });
        this.ui.get('/api/:apiname', (_req: Express.Request, _res: Express.Response, _next: Express.NextFunction) => { this.startApi(_req, _res, _next); });
        // this.ui.use(this.ui.router);
        this.ui.listen(App.WEB_UI_PORT);
    }

    public static errorCode(code: string): string {
        return App.STATUS_CODE.find((str: string): boolean => str.indexOf(code) >= 0) || '500 Error';
    }

    public startApi(_req: Express.Request, _res: Express.Response, _next: Express.NextFunction): void {
        const apipath = `${_req.url.replace('/api/', '')}.api.js`;
        if (this.api.isExistScript(apipath) === false) {
            // tslint:disable-next-line:no-magic-numbers
            _res.status(404);
            _res.send(App.errorCode('404'));

            return;
        }
        this.api.sandbox = {
            'agent': {
                'define': [
                    {
                        'ipaddress': '192.168.2.39',
                        'name': 'testAgent',
                        'sharekey': '1qaz2wsx'
                    },
                    {
                        'ipaddress': '192.168.2.39',
                        'name': 'testAgent2',
                        'sharekey': '1234qwer'
                    }
                ],
                'state': [
                    {
                        'connected': false,
                        'ipaddress': '192.168.2.39',
                        'name': 'testAgent',
                        'runjob': undefined,
                        'socketID': '1qaz2wsx'
                    },
                    {
                        'connected': true,
                        'ipaddress': '192.168.2.39',
                        'name': 'testAgent2',
                        'runjob': undefined,
                        'socketID': '1234qwer'
                    }
                ]
            },
            'define': {
                'MAHIRU_PORT': 27132,
                'POPLAR_PORT': 27131,
                'SCANNING_TIME': 1000
            },
            'jobnet': {
                'define': undefined,
                'finished': undefined,
                'running': undefined,
                'waitting': undefined
            },
            'request': _req,
            'response': _res
        };

        const err = this.api.runApi(apipath);
        if (typeof err !== 'undefined') {
            // tslint:disable-next-line:no-magic-numbers
            _res.status(500);
            _res.send(App.errorCode('500'));

            return;
        }
    }
}

const app = new App();
app.init();
