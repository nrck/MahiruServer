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

        this.cm.open();

        this.setRouter();
        // this.ui.use(this.ui.router);
        this.ui.listen(WebUI.WEB_UI_PORT);
    }

    public setRouter(): void {
        this.ui.get('/', (_req: Express.Request, _res: Express.Response, _next: Express.NextFunction) => { _res.render('index', WebUI.renderIndex()); });
        this.ui.get('/api/:apiname', (_req: Express.Request, _res: Express.Response, _next: Express.NextFunction) => { this.startApi(_req, _res, _next); });
    }

    public startApi(_req: Express.Request, _res: Express.Response, _next: Express.NextFunction): void {
        const apipath = `${_req.url.replace('/api/', '')}.api.js`;
        if (this.api.isExistScript(apipath) === false) {
            // tslint:disable-next-line:no-magic-numbers
            _res.status(404);
            _res.send(WebUI.errorCode('404'));

            return;
        }

        this.cm.getCollectInfo(_req, _res, (sandbox: ApiContextifiedSandbox): void => {
            this.api.sandbox = sandbox;

            const err = this.api.runApi(apipath);
            if (typeof err !== 'undefined') {
                // tslint:disable-next-line:no-magic-numbers
                _res.status(500);
                _res.send(WebUI.errorCode('500'));

                return;
            }
        });

        return;
    }
}

const app = new App();
app.init();
