import * as bodyParser from 'body-parser';
import * as Express from 'express';
import * as fs from 'fs';
import { Api } from './api';
import { ClientManager } from './clientManager';
import { ApiContextifiedSandbox } from './interface';
import { WebUI } from './webUI';

class App {
    /** configファイルのパス */
    private static CONFIG_PATH = './config/config.json';
    /** 設定値 */
    private static CONFIG = JSON.parse(fs.readFileSync(App.CONFIG_PATH, 'utf-8'));
    /** Poplar Serverのホスト、もしくはIPアドレス */
    private static SERVER_HOST = App.CONFIG.poplarServer.ip || '127.0.0.1';
    /** Poplar Serverのポート */
    // tslint:disable-next-line:no-magic-numbers
    private static SERVER_PORT = App.CONFIG.poplarServer.port || 27131;
    private static WEB_UI_PORT = App.CONFIG.mahiruServer.port || '17380'; // いなみ80番ポート

    private ui = Express();
    private api = new Api(`.${App.CONFIG.apipath}`);
    private cm = new ClientManager(App.SERVER_HOST, App.SERVER_PORT, App.CONFIG.namespace);

    // 初期化処理
    public init(): void {
        this.ui.set('views', './views/pages/');
        this.ui.set('view engine', 'ejs');
        this.ui.use(bodyParser.json());
        this.ui.use(bodyParser.urlencoded({ 'extended': true }));
        this.ui.use(Express.static('./views/static'));

        this.cm.open();

        this.setRouter();
        this.ui.listen(App.WEB_UI_PORT);
    }

    // ルーティング設定
    public setRouter(): void {
        this.ui.all('/api/:apiname', (_req: Express.Request, _res: Express.Response, _next: Express.NextFunction) => { this.startApi(_req, _res, _next); });
        this.ui.all('/agent', (_req: Express.Request, _res: Express.Response, _next: Express.NextFunction) => { _res.render('setting', WebUI.renderAgent()); });
        this.ui.all('/jobnet', (_req: Express.Request, _res: Express.Response, _next: Express.NextFunction) => { _res.render('jobnet', WebUI.renderJobnet()); });
        this.ui.all('/setting', (_req: Express.Request, _res: Express.Response, _next: Express.NextFunction) => { _res.render('setting', WebUI.renderSetting()); });
        this.ui.all('/edit/jobnet', (_req: Express.Request, _res: Express.Response, _next: Express.NextFunction) => { _res.render('editJobnet', WebUI.renderEditJobnet()); });
        this.ui.all('/edit/agent', (_req: Express.Request, _res: Express.Response, _next: Express.NextFunction) => { _res.render('editAgent', WebUI.renderEditAgent()); });
        this.ui.all('/', (_req: Express.Request, _res: Express.Response, _next: Express.NextFunction) => { _res.render('index', WebUI.renderIndex()); });
    }

    // API実行
    public startApi(_req: Express.Request, _res: Express.Response, _next: Express.NextFunction): void {
        const apipath = `${_req.path.replace('/api/', '')}.api.js`;

        // APIファイルがなければエラー
        if (this.api.isExistScript(apipath) === false) {
            // tslint:disable-next-line:no-magic-numbers
            _res.status(404);
            _res.send(WebUI.errorCode('404'));
            _res.end();

            return;
        }

        // Popla Serverと未接続ならエラー
        if (this.cm.connected === false) {
            // tslint:disable-next-line:no-magic-numbers
            _res.status(503);
            _res.send(WebUI.errorCode('503'));
            _res.end();

            return;
        }

        // 情報収集してAPIを実行する
        this.cm.getCollectInfo(_req, _res, (sandbox: ApiContextifiedSandbox): void => {
            this.api.sandbox = sandbox;
            this.api.runApi(apipath, (error?: Error, _sandbox?: ApiContextifiedSandbox) => {
                if (typeof error !== 'undefined') {
                    // tslint:disable-next-line:no-magic-numbers
                    _res.status(500);
                    _res.send(`<b>${WebUI.errorCode('500')}</b><pre>${error.stack}</pre>`);
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
