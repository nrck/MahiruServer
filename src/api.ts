import * as fs from 'fs';
import * as vm from 'vm';
import { ApiContextifiedSandbox } from './interface';

export class Api {
    public static API_PATH = './api/';
    private sandbox: ApiContextifiedSandbox;

    constructor(value: ApiContextifiedSandbox) {
        this.sandbox = value;
    }

    public codeRoader(filename: string): string {
        let code = '';
        try {
            code = fs.readFileSync(`${Api.API_PATH}${filename}`, 'utf8');
        } catch (error) {
            // なにか
        }

        return code;
    }

    public runApi(path: string) {
        vm.runInNewContext(this.codeRoader(), this.sandbox, path);
    }
}
