# phosphor
通过项目特性组装的构建工具，基于 webpack，试图屏蔽 webpack 略显复杂的配置项以及引入社区最佳实践。
支持 nodejs 版本 4.6+

## 安装方法
```
clone 本仓库
npm install
npm link
```

## phosphor.config.js 有效配置内容及含义

### 1. entry
|类型|说明|
|---|---|
|string|单入口文件，项目根目录的相对路径，输出路径为该值相对于输出文件夹的路径|
|array<string>|同上，用于指定多个入口文件|
|object<string, string>|与上面不同的是用 key 指定输出文件路径|

### 2. commonChunk
当依赖了声明的库后会打包至相应的 common 包中，如果项目的入口文件中并没有依赖就不会打包进相应的 common 包中。
值为一个数组，声明的顺序决定了最后引用的顺序，最终会按照顺序输出到 html 的 script 标签中，所以注意依赖关系。
对于数组中的每个元素，有以下字段：
|字段名|类型|说明|
|---|---|---|
|name|string|指定 chunk 名称， 非必须项，如果不指定将节选 filename 的文件名|
|filename|string|指定 chunk 存放路径，value 指定chunk 包含的包名数组|
|chunks|string|包含的包名|
|object<string, object<string>>|同上，为了方便直接从 package.json 的 dependencies 中复制，取对象 的 keys|
推荐 key 为：
* stable 稳定库，一年更新频次为个位数（三方库）
* common 一般稳定，一个季度更新频次为个位数（如公司中台维护的二方库，UI 库等）

如果 filename 的文件名 为 'stable+'（如 vendor/stable+） 则代表在 phorsphor 内置 stable 列表的基础上添加
内置 stable 列表为：
* phosphor v0.0.16
  react react-dom fbjs process webpack/* classnames preact preact-compact lodash/* lodash-es/*
> 注：
> 1. 会去重
> 2. 包名指 import 或 require 中所写的内容
>    lodash 包括：lodash、lodash/assign lodash/...

### 3. devServer
因为默认使用 phosphor 中的 hbs 模板，所以有了下面的配置，用于在开发阶段修改测试用 html 模板
值为 html 字符串
* beforeLink
* afterLink
* beforeScript
* afterScript
* body：放容器，默认值为
    ```html
    <div id="app"></div>
    ```

## phosphor 开发文档
###  context
phosphor 核心功能是输出一份 webpack 的配置文件。因为使用 context 对象来解耦构建工具的配置项传输问题，非常容易集成到其他构建工具中，
如：ff build --development 对应 context：
```javascript
{
    env: 'development',
    devServer: {
        enable: false
    },
    project: {
        path: process.cwd(),
        entry: phosphorConfig.entry
    }
    // 可能还有从 phosphor 配置文件中 merge 过来的部分
}
```
context 完整配置项：
```javascript
{
    env: 'production', // 执行环境，目前只有：development，production
    entry: {}, // 入口文件
    uglifyJs: true,
    distPath: '', // 输出目录
    projectPath: '', // 项目根目录的绝对路径
    devServer: {
        enable: false, // 是否启用 dev server
    },
    commonChunk: [], // 同 phosphor 配置文件
}
```