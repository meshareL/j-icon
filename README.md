# j-icon
Vue 3.0 SVG图标组件

该组件仅渲染`<svg>`元素. 你必须通过`icon` prop 传入图标对象或在安装插件时传入需要使用的图标

使用 [CLI](#使用-1) 批量创建图标

## 安装
```shell
npm install @tomoeed/j-icon --save
```

## 使用
### 通过插件安装
```javascript
import {createApp} from 'vue';
import {plugin} from '@tomoeed/j-icon';

createApp({}).use(plugin, {name: 'j-icon', classes: [], prefix: true, icons: []});
```
```vue
<template>
    <j-icon icon=""/>
</template>
```

### 直接使用组件
```vue
<template>
    <j-icon icon="alert"/>
</template>

<script setup>
import JIcon from '@tomoeed/j-icon';
import {alert} from '< icon_file >';
</script>

// OR
<script>
import JIcon from '@tomoeed/j-icon';
import {alert} from '< icon_file >';

export default {
    component: { JIcon },
    setup() {
        return { alert };
    }
}
</script>
```

## 插件可选的选项对象
- `name`: 组件名称
```vue
app.use(JIcon, {name: 'v-icon'});

<v-icon icon=""/>
```

- `icons`: 所有图标对象. 安装插件时传入的图标在使用组件时可以直接使用该图标的名称
```vue
app.use(JIcon, {icons: {x:{}}});
app.use(JIcon, {icons: [{name: 'x'}]});

<j-icon icon="x"/>
```

- `classes`: 渲染`<svg>`元素时,默认添加的`class`
```vue
app.use(JIcon, {classes: ['icon']});

<svg class="icon">...</svg>
```

- `prefix`: 图标名称`class`前缀
  - 如果为`false`, 则不会添加具有图标名称的`class`
  - 如果为`true`, 则添加`icon-`前缀
  - 如果是字符串, 将会与图标名称拼接
```vue
app.use(JIcon, {prefix: 'j-icon-'});

<j-icon icon="x"/>

<svg class="icon j-icon-x">...</svg>
```

## 组件 props
- `icon`: 需要渲染的图标的名称或该图标对象
- `width`: SVG 元素宽度
- `height`: SVG 元素高度
- `tabindex` SVG 元素是否可以聚焦
- `title`: 为 SVG 元素提供一个描述性字符串, 用来提升 SVG 文档的可访问性
- `aria-label`:
HTML [aria-label](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label) 属性
- `desc`: 为 SVG 元素提供一个长文本描述, 用来提升 SVG 文档的可访问性
- `aria-description`: HTML [aria-description](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-description) 属性

`title` 与 `aria-label` 属性不要同时使用, 若同时为这两个属性提供值, 则优先使用 `title` 属性.
`desc` 与 `aria-description` 属性同理
```vue
<j-icon icon="x" title="title" aria-label="aria-label"/>

<svg aria-labelledby="0123456789">
    <title id="0123456789">title</title>
    ...
</svg>
```

## 创建图标对象
图标对象属性查看 [Icon](https://github.com/meshareL/j-icon/blob/master/index.d.ts#L4)
```javascript
import {h as createElement} from 'vue';
const book = {
    name: 'book',
    viewBox: [0, 0, 16, 16],
    size: [16, 16],
    render: () => createElement('path', {d: ''})
};
```

## CLI
### 使用
```npm
j-icon --input <input-path> --output <dist>
```

### 选项
- -i, --input <path> 文件或文件夹路径, 支持输入多个路径
- -o, --output <path> 文件输出目录
- -f, --format 输出文件格式, 支持格式: esm, umd, ts, type (默认值: esm type)
- -n, --name 输出文件名称 (默认值: index)

## License
[Apache-2.0](https://github.com/meshareL/j-icon/blob/master/LICENSE)
