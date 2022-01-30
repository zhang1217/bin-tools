import { ResolvedConfig } from 'vite'
import { buildSync } from 'esbuild'
import path from 'path'
import fs from 'fs-extra'
import os from 'os'

export interface BuildStaticDirConfig {
    // 源文件夹路径
    src: string;
    // 目标文件夹路径
    dest: string;
}

export interface BuildElectronConfig {
    // 入口文件路径
    entry: string;
    // 输出文件路径
    outPut: string;
    // 打包electron配置
    builderOptions: object;
    dev: object;
    build: object;
    // 静态文件拷贝
    staticDir: Array<BuildStaticDirConfig>
}

export interface BuildConfig extends ResolvedConfig {
    // electron 配置信息
    electron?: BuildElectronConfig
}


export const buildMain = (electronConfig: BuildElectronConfig, buildConfig: BuildConfig, envScript: string): string => {
    // 入口文件
    let entryFilePath = electronConfig.entry;
    // 输出文件路径
    let outFilePath = path.join(buildConfig.build.outDir, electronConfig.outPut);
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
    let js = `${envScript}${os.EOL}${fs.readFileSync(outFilePath)}`;
    fs.writeFileSync(outFilePath, js)

    // 复制特殊文件夹直接到某个路径
    electronConfig.staticDir.forEach(item => {
        copyDir(item.src, item.dest);
    })

    return outFilePath;
}

// 复制文件夹
export const copyDir = (from: string, to: string) => {
    const fromDir = path.resolve(process.cwd(), from)
    const toDir = path.resolve(process.cwd(), to)
    console.log(fromDir, toDir)
    fs.copySync(fromDir, toDir, { recursive: true });
}
