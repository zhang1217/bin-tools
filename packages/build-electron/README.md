# `build-electron`

> TODO: description

## Usage

```
const buildElectron = require('@bin-tools/build-electron');
or
import buildElectron from '@bin-tools/build-electron'

在vite.config.ts 中加入 electron 配置

// @ts-ignore 打包electron配置
electron: {
// 打包的入口文件
entry: path.join(process.cwd(), 'src/main/index.ts'),
// 输出的文件路径 使用 vite中的配置 build.outDir
// 输出的文件名
outPut: 'entry.js',
// electron-builder  参考 https://github.com/electron-userland/electron-builder 配置
builderOptions: {
    config: {
    directories: {
        output: './release/release',
        app: vueOutDir
    },
    files: ['**'],
    productName: "便签",
    appId: "com.bianqian.binbin",
    asar: true,
    extraResources: './resource/release',
    win: {
        target: ['zip']
    }
    },
    projectDir: process.cwd(),
},
// 静态资源拷贝
staticDir: [{
    // 源文件夹路径
    src: "src/static",
    // 目标文件夹路径
    dest: vueOutDir.substring(2, vueOutDir.length) + '/static',
}]
}

```

```

```
