import * as Express from 'express';

export class WebUI {
    public static UI = Express();
    public static WEBUI_PORT = '8080';
    private 

    private constructor() {
    }

    public static init(): void {
        WebUI.UI.set('view engine', 'ejs');
        WebUI.UI.get('/', (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
            res.render('views/pages/index');
        });
    }
}
