import { BuildConfig, BuildElectronConfig } from "./common";
import path from 'path'
import esbuild from 'esbuild'
import fs from 'fs'
import os from 'os'
import { spawn } from 'child_process'

let buildConfig: BuildConfig;
let electronConfig: BuildElectronConfig;

let outFilePath = ""

// 编译electron主程序
const buildMain = () => {
    // 入口文件
    let entryFilePath = electronConfig.entry;
    // 输出文件路径
    outFilePath = path.join(buildConfig.build.outDir, electronConfig.outPut);
    esbuild.buildSync({
        // 入口
        entryPoints: [entryFilePath],
        // 输出目录
        outfile: outFilePath,
        // 打包
        bundle: true,
        minify: false,
        platform: "node",
        // 启动sourcemap
        sourcemap: false,
        external: ["electron"],
    })
    let envScript = `process.env={...process.env,...${JSON.stringify(electronConfig.dev)}};`
    let js = `${envScript}${os.EOL}${fs.readFileSync(outFilePath)}`;
    fs.writeFileSync(outFilePath, js)
}

// 使用electron启动进程
const runElectron = () => {
    let electron = spawn(require('electron').toString(), [outFilePath], {
        cwd: process.cwd(),
        env: { ...electronConfig.dev }
    })
    electron.on('close', () => {
        process.exit();
    })
    electron.stdout.on('data', (data) => {
        data = data.toString();
        buildConfig.logger.info(data);
    })
    electron.stderr.on('data', (data) => {
        data = data.toString();
        buildConfig.logger.error(data);
    })
    electron.stdout.on('error', (data) => {
        // data = data.toString();
        // buildConfig.logger.error(data);
        console.log('error')
    })
}

export default (config: BuildConfig) => {
    if (config.electron) {
        if (!config.electron!.dev) config.electron!.dev = {}
        buildConfig = config;
        electronConfig = config.electron!;

        buildMain();
        runElectron();
    }
}