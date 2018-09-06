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
    private static SERVER_PORT: number = App.CONFIG.poplarServer.port || 27131;
    /** Mahiru Serverのポート */
    // tslint:disable-next-line:no-magic-numbers
    private static WEB_UI_PORT: number = App.CONFIG.mahiruServer.port || 17380; // いなみ80番ポート

    private ui = Express();
    private api = new Api(`.${App.CONFIG.apiPath}`);
    private cm = new ClientManager(App.SERVER_HOST, App.SERVER_PORT, App.CONFIG.namespace);

    /**
     * 初期化処理をし、設定したポート番号でWebUIをリッスンします。
     */
    public init(): void {
        // Viewのフォルダ
        this.ui.set('views', './views/pages/');
        // Viewエンジンにejsを指定
        this.ui.set('view engine', 'ejs');

        // クエリのパーサーを読み込み
        this.ui.use(bodyParser.json());
        this.ui.use(bodyParser.urlencoded({ 'extended': true }));

        // そのまま読み込ませる静的なドキュメントのフォルダ
        this.ui.use(Express.static('./views/static'));

        // Poplar Serverとの接続を開始
        this.cm.open();

        // ルーティングを設定
        this.setRouter();

        // WebUIのリッスンを開始
        this.ui.listen(App.WEB_UI_PORT);
    }

    /**
     * ルーティングを設定します。
     */
    public setRouter(): void {
        // API
        this.ui.all('/api/:apiname', (_req: Express.Request, _res: Express.Response, _next: Express.NextFunction) => { this.startApi(_req, _res, _next); });
        // Agent概要ページ
        this.ui.all('/agent', (_req: Express.Request, _res: Express.Response, _next: Express.NextFunction) => { _res.render('agent', WebUI.renderAgent()); });
        // Jobnet概要ページ
        this.ui.all('/jobnet', (_req: Express.Request, _res: Express.Response, _next: Express.NextFunction) => { _res.render('jobnet', WebUI.renderJobnet()); });
        // 設定ページ
        this.ui.all('/setting', (_req: Express.Request, _res: Express.Response, _next: Express.NextFunction) => { _res.render('setting', WebUI.renderSetting()); });
        // Jobnet編集ページ
        this.ui.all('/edit/jobnet', (_req: Express.Request, _res: Express.Response, _next: Express.NextFunction) => { _res.render('editJobnet', WebUI.renderEditJobnet()); });
        // Agent編集ページ
        this.ui.all('/edit/agent', (_req: Express.Request, _res: Express.Response, _next: Express.NextFunction) => { _res.render('editAgent', WebUI.renderEditAgent()); });
        // ダッシュボードページ
        this.ui.all('/', (_req: Express.Request, _res: Express.Response, _next: Express.NextFunction) => { _res.render('index', WebUI.renderIndex()); });
    }

    /**
     * PoplarServerから情報を受取、APIの呼び出しを行います
     * @param _req リクエスト
     * @param _res レスポンス
     * @param _next ネクスト
     */
    public startApi(_req: Express.Request, _res: Express.Response, _next: Express.NextFunction): void {
        // APIパスの取得
        const apipath = `${_req.path.replace('/api/', '')}.api.js`;

        // APIファイルがなければ404エラー
        if (this.api.isExistScript(apipath) === false) {
            // tslint:disable-next-line:no-magic-numbers
            _res.status(404);
            _res.send(WebUI.errorCode('404'));
            _res.end();

            return;
        }

        // Popla Serverと未接続なら503エラー
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
                // API実行で失敗したら500エラー
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

// さぁ始めよう
const app = new App();
app.init();
