import { BuildConfig, BuildElectronConfig } from "./common";
import path from 'path'
import os from 'os'
import fs from 'fs'
import { buildSync } from 'esbuild'
import { build } from 'electron-builder'

let buildConfig: BuildConfig;
let electronConfig: BuildElectronConfig;

let outFilePath = ""

// 获取本地环境配置参数
const getEnvScript = () => {
    let script = `process.env={...process.env,...${JSON.stringify(electronConfig.build)}};`
    script += `process.env.RES_DIR = require("path").join(require("path").dirname(process.execPath),"resources/resource/release")`;
    return script;
}
// 打包主程序
const buildMain = () => {
    // 入口文件
    let entryFilePath = electronConfig.entry;
    // 输出文件路径
    outFilePath = path.join(buildConfig.build.outDir, electronConfig.outPut);
    buildSync({
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
    let js = `${getEnvScript()}${os.EOL}${fs.readFileSync(outFilePath)}`;
    fs.writeFileSync(outFilePath, js)
}

// 准备PackageJson 文件
const preparePackageJson = () => {
    let pkgJsonPath = path.join(process.cwd(), "package.json");
    let localPkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
    let electron = localPkgJson.devDependencies.electron.replace("^", "");
    localPkgJson.main = electronConfig.outPut;
    delete localPkgJson.scripts
    delete localPkgJson.devDependencies
    localPkgJson.devDependencies = {
        electron
    }
    fs.writeFileSync(
        path.join(buildConfig.build.outDir, "package.json"),
        JSON.stringify(localPkgJson)
    );
    fs.mkdirSync(path.join(buildConfig.build.outDir, "node_modules"));
}
// 使用electron-builder 打包
const buildInstaller = () => {
    build(electronConfig.builderOptions)
}

export default (config: BuildConfig) => {
    if (config.electron) {
        if (!config.electron!.dev) config.electron!.dev = {}
        buildConfig = config;
        electronConfig = config.electron!;

        buildMain();
        preparePackageJson();
        buildInstaller();
    }
}