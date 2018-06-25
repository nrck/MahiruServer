import * as Express from 'express';
import { Api } from './api';
import { WebUI } from './webUI';

class App {
    private ui = Express();
    private api = new Api();

    public init(): void {
        this.ui.set('views', `${__dirname}/../views/pages/`);
        this.ui.set('view engine', 'ejs');
        this.ui.get('/', (_req: Express.Request, _res: Express.Response, _next: Express.NextFunction) => { _res.render('index', WebUI.renderIndex()); });
        this.ui.get('/api/:apiname', (_req: Express.Request, _res: Express.Response, _next: Express.NextFunction) => { this.startApi(_req, _res, _next); });
        // this.ui.use(this.ui.router);
        this.ui.listen(WebUI.WEB_UI_PORT);
    }

    public startApi(_req: Express.Request, _res: Express.Response, _next: Express.NextFunction): void {
        const apipath = `${_req.url.replace('/api/', '')}.api.js`;
        if (this.api.isExistScript(apipath) === false) {
            // tslint:disable-next-line:no-magic-numbers
            _res.status(404);
            _res.send(WebUI.errorCode('404'));

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
            _res.send(WebUI.errorCode('500'));

            return;
        }
    }
}

const app = new App();
app.init();
