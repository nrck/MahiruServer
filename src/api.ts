import * as child_process from 'child_process';
import * as fs from 'fs';
import * as vm from 'vm';
import { Common } from './common';
import * as IF from './interface';

export class Api {
    public static DEFAULT_API_PATH_WIN = `${__dirname}\\api\\`;
    public static DEFAULT_API_PATH_UNIX = `${__dirname}/api/`;
    private _sandbox: IF.ApiContextifiedSandbox | undefined;
    private _apiPath: string;

    constructor(apiPath?: string) {
        this._apiPath = apiPath || Api.DEFAULT_API_PATH_UNIX;
    }

    public get sandbox(): IF.ApiContextifiedSandbox | undefined {
        return this._sandbox;
    }

    /**
     * API向けに渡すSandoboxです。module部分については上書きされます。
     */
    public set sandbox(value: IF.ApiContextifiedSandbox | undefined) {
        this._sandbox = value;
        if (typeof this._sandbox !== 'undefined') {
            this._sandbox.module = {
                'IF': IF,
                'child_process': child_process,
                'fs': fs,
                'vm': vm
            };

            if (typeof this._sandbox.agent.define !== 'undefined') {
                this._sandbox.agent.define.forEach((agentJSON: IF.AgentJSON) => {
                    agentJSON.sharekey = '********';
                });
            }
        }
    }

    public get apiPath(): string {
        return this._apiPath;
    }

    public set apiPath(value: string) {
        this._apiPath = value;
    }

    /**
     * コードを読み込みます。
     * @param filename ファイルネーム
     */
    public codeRoader(filename: string): string | undefined {
        try {
            return fs.readFileSync(`${this.apiPath}${filename}`, 'utf8');
        } catch (error) {
            return undefined;
        }
    }

    /**
     * APIファイルが存在するか確認します。
     * @param filename 対象のファイルネーム
     */
    public isExistScript(filename: string): boolean {
        return fs.existsSync(`${this.apiPath}${filename}`);
    }

    /**
     * APIを実行します。
     * @param filename 実行対象のファイルネーム
     */
    public runApi(filename: string, callback: (error: Error | undefined, sandbox: IF.ApiContextifiedSandbox | undefined) => void): void {
        Common.trace(Common.STATE_DEBUG, `${this.runApi.name}が実行されました。`);
        const code = this.codeRoader(filename);
        const mySandbox = this.sandbox;
        try {
            // codeがなかった場合
            if (typeof code === 'undefined') throw new Error(`${filename} is undefined`);
            // sandoboxが未定義のとき
            if (typeof mySandbox === 'undefined') throw new Error('Sandbox is undefined');
            vm.runInNewContext(code, mySandbox, filename);

            // 特に問題がなく終了したらErrorは無し
            callback(undefined, mySandbox);

            return;
        } catch (error) {
            Common.trace(Common.STATE_ERROR, error.message);
            Common.trace(Common.STATE_DEBUG, error.stack);
            callback(error, mySandbox);

            return;
        }
    }
}

