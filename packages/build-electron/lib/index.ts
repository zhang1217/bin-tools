import { Plugin, ViteDevServer } from 'vite'
import { BuildConfig, BuildElectronConfig } from './common';
import dev from './dev'
import release from './release';
import { AddressInfo } from 'net'

let _env: string = ''; //serve 开发  build 打包
let _config: BuildConfig;
let _server: ViteDevServer;


function BuildElectron() {
    let option: Plugin = {
        name: "build-electron",
        configResolved: (config: BuildConfig) => {
            _config = config;
            _env = _config.command;
        },
        configureServer: async (server: ViteDevServer) => {
            _server = server;
            _server.httpServer?.once("listening", () => {
                var address = (_server.httpServer?.address() as AddressInfo)
                if (_env == 'serve') {
                    _config!.electron!.dev = {
                        ..._config!.electron?.dev,
                        WEB_URL: `http://${address.address}:${address.port}/`
                    }
                    dev(_config!)
                }
            })
        },
        closeBundle: () => {
            if (_env == "build") {
                release(_config!)
            }
        }
    };
    return option
}
export default BuildElectron;


export { BuildConfig, BuildElectronConfig }