import * as child_process from 'child_process';
import * as fs from 'fs';
import * as vm from 'vm';
import * as IF from './interface';

export class Api {
    public static DEFAULT_API_PATH = `${__dirname}\\api\\`;
    private _sandbox: IF.ApiContextifiedSandbox | undefined;
    private _apiPath: string;

    constructor(apiPath?: string) {
        this._apiPath = apiPath || Api.DEFAULT_API_PATH;
    }

    public get sandbox(): IF.ApiContextifiedSandbox | undefined {
        return this._sandbox;
    }

    public set sandbox(value: IF.ApiContextifiedSandbox | undefined) {
        this._sandbox = value;
        if (typeof this._sandbox !== 'undefined') {
            this._sandbox.module = {
                'IF': IF,
                'child_process': child_process,
                'fs': fs,
                'vm': vm
            };
        }
    }

    public get apiPath(): string {
        return this._apiPath;
    }

    public set apiPath(value: string) {
        this._apiPath = value;
    }

    public codeRoader(filename: string): string | undefined {
        try {
            return fs.readFileSync(`${this.apiPath}${filename}`, 'utf8');
        } catch (error) {
            return undefined;
        }
    }

    public isExistScript(filename: string): boolean {
        return fs.existsSync(`${this.apiPath}${filename}`);
    }

    public runApi(filename: string): Error | undefined {
        const code = this.codeRoader(filename);
        if (typeof code === 'undefined') return new Error(`${filename} is undefined`);
        try {
            vm.runInNewContext(code, this.sandbox, filename);

            return undefined;
        } catch (error) {
            console.log(error.stack);

            return error;
        }
    }
}

