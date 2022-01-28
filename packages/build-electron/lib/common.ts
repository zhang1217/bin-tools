import { ResolvedConfig } from 'vite'

export interface BuildElectronConfig {
    // 入口文件路径
    entry: string;
    // 输出文件路径
    outPut: string;
    // 打包electron配置
    builderOptions: object;
    dev: object;
    build: object;
}

export interface BuildConfig extends ResolvedConfig {
    // electron 配置信息
    electron?: BuildElectronConfig
}
