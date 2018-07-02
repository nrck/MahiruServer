import { EventEmitter } from 'events';
import * as SocketIOClient from 'socket.io-client';
import { Common } from './common';
import { ApiContextifiedSandbox, CollectInfo } from './interface';

export class ClientManager {
    private static CLIENT_PROTOCOL = 'ws';

    private _socket: SocketIOClient.Socket;
    private _serverHost: string;
    private _port: number;
    private _namespace: string;
    private _events: EventEmitter;
    private _no: number;

    /**
     * クライアントマネージャーを作成します。
     * @param serverHost PoplarServerのホスト、またはIPアドレスを指定します。
     * @param port 接続ポートを指定します。
     * @param namespace 接続ネームスペースを指定します。デフォルトで"/"になります。
     * @param no パケットNo
     */
    constructor(serverHost: string, port: number, namespace?: string, no?: number) {
        this._serverHost = serverHost;
        this._port = port;
        this._events = new EventEmitter();
        this._namespace = namespace || '/';
        this._socket = SocketIOClient(`${ClientManager.CLIENT_PROTOCOL}://${this.serverHost}:${this.port}${this.namespace}`, { 'autoConnect': false });
        this._no = no || 0;
        this.initClient();
    }

    public get serverHost(): string {
        return this._serverHost;
    }

    public get port(): number {
        return this._port;
    }

    public get events(): EventEmitter {
        return this._events;
    }

    public get socket(): SocketIOClient.Socket {
        return this._socket;
    }

    public get namespace(): string {
        return this._namespace;
    }

    public get connected(): boolean {
        return this.socket.connected;
    }

    public get no(): number {
        this._no++;

        return this._no;
    }

    /**
     * 初期化します
     */
    public initClient(): void {
        // 接続時
        this.socket.on('connect', () => { this.connection(); });
        // 切断時
        this.socket.on(Common.EVENT_DISCONNECT, (reason: string) => { this.disconnect(reason); });
    }

    /**
     * ソケットを開きます。
     */
    public open(): void {
        if (this.socket.connected) return;
        this.socket.open();
        Common.trace(Common.STATE_INFO, `ws://${this.serverHost}:${this.port}${this.namespace}に接続を開始しました。`);
    }

    /**
     * クローズします。
     */
    public close(): void {
        if (this.socket.disconnected) return;
        this.socket.close();
        Common.trace(Common.STATE_INFO, `ws://${this.serverHost}:${this.port}${this.namespace}を切断しました。`);
        this.socket.removeAllListeners();
    }

    /**
     * コネクション接続時。
     */
    private connection(): void {
        // ログ
        Common.trace(Common.STATE_INFO, `${this.socket.io.uri}に接続しました。`);
    }

    /**
     * 切断時にイベント発火し、Appへ通知します。
     * @param reason 切断理由
     */
    private disconnect(reason: string): void {
        Common.trace(Common.STATE_INFO, `${reason}のため、${this.socket.io.uri}から切断されました。`);
    }

    /**
     * サーバにApi向けの情報を要求します。
     * @param callback 受信したSandboxを処理する関数
     */
    public getCollectInfo(request: Express.Request, response: Express.Response, callback: (sandbox: ApiContextifiedSandbox) => void): void {
        this.socket.emit(Common.EVENT_COLLECT_INFO, (data: CollectInfo) => {
            const sandbox: ApiContextifiedSandbox = {
                'agent': data.agent,
                'define': data.define,
                'jobnet': data.jobnet,
                'request': request,
                'response': response
            };
            callback(sandbox);
        });

    }


}

