import * as Express from 'express';
import { Api } from './api';
import { ClientManager } from './clientManager';
import { ApiContextifiedSandbox } from './interface';
import { WebUI } from './webUI';

class App {
    private static SERVER_PORT = 27131; // ポニーテール小さい
    private static SERVER_HOST = '127.0.0.1';

    private ui = Express();
    private api = new Api('./api/');
    private cm = new ClientManager(App.SERVER_HOST, App.SERVER_PORT, '/fep');

    // 初期化処理
    public init(): void {
        // this.ui.set('views', `${__dirname}/../views/pages/`); // WinとUNIXで処理を変えたいね
        this.ui.set('views', './views/pages/');
        this.ui.set('view engine', 'ejs');
        // this.ui.use(Express.static(`${__dirname}/views/static`));
        this.ui.use(Express.static('./views/static'));

        this.cm.open();

        this.setRouter();
        // this.ui.use(this.ui.router);
        this.ui.listen(WebUI.WEB_UI_PORT);
    }

    public setRouter(): void {
        this.ui.get('/api/:apiname', (_req: Express.Request, _res: Express.Response, _next: Express.NextFunction) => { this.startApi(_req, _res, _next); });
        this.ui.get('/agent', (_req: Express.Request, _res: Express.Response, _next: Express.NextFunction) => { _res.render('setting', WebUI.renderAgent()); });
        this.ui.get('/jobnet', (_req: Express.Request, _res: Express.Response, _next: Express.NextFunction) => { _res.render('jobnet', WebUI.renderJobnet()); });
        this.ui.get('/setting', (_req: Express.Request, _res: Express.Response, _next: Express.NextFunction) => { _res.render('setting', WebUI.renderSetting()); });
        this.ui.get('/', (_req: Express.Request, _res: Express.Response, _next: Express.NextFunction) => { _res.render('index', WebUI.renderIndex()); });
    }

    public startApi(_req: Express.Request, _res: Express.Response, _next: Express.NextFunction): void {
        const apipath = `${_req.path.replace('/api/', '')}.api.js`;
        if (this.api.isExistScript(apipath) === false) {
            // tslint:disable-next-line:no-magic-numbers
            _res.status(404);
            _res.send(WebUI.errorCode('404'));
            _res.end();

            return;
        }

        this.cm.getCollectInfo(_req, _res, (sandbox: ApiContextifiedSandbox): void => {
            this.api.sandbox = sandbox;

            this.api.runApi(apipath, (error?: Error, _sandbox?: ApiContextifiedSandbox) => {
                if (typeof error !== 'undefined') {
                    // tslint:disable-next-line:no-magic-numbers
                    _res.status(500);
                    _res.send(WebUI.errorCode('500'));
                    _res.end();

                    return;
                }
            });
        });

        return;
    }
}

const app = new App();
app.init();
