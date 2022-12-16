# j-icon-cli
自动将 `SVG` 图标转换为 [Icon](https://github.com/meshareL/j-icon/blob/master/index.d.ts#L3) 对象的命令行工具

## 安装
```shell
npm install @tomoeed/j-icon-cli --save-dev
```

## 使用
```shell
j-icon -i svgs -o dist
```

## 选项
```text
-i, --input <path> 文件或文件夹路径
-o, --output <path> 文件输出目录
-f, --format 输出文件格式 (默认值: esm umd ts type)
-n, --name 输出文件名称 (默认值: index)
```

## API
```js
const process = require('@tomoeed/j-icon-cli');
process({input: ''});
```
