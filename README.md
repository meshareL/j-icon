# j-icon
Vue 3.0 SVG图标组件

该组件仅渲染`<svg>`元素. 你必须通过`icon` prop传入渲染函数或在安装插件时传入需要使用的图标

使用 [j-icon-cli](https://github.com/meshareL/j-icon/tree/cli) 批量创建图标

## 安装
```shell
npm install @tomoeed/j-icon --save
```

## 使用
```javascript
import {createApp} from 'vue';
import JIcon from 'j-icon';

createApp({}).use(JIcon, {name: '', classes: [], prefix: true, icons: []});
```

## 插件可选的选项对象
- `name`: 组件名称
```vue
app.use(JIcon, {name: 'v-icon'});

<v-icon icon=""/>
```

- `icons`: 所有图标渲染函数. 安装插件时传入的图标在使用组件时可以直接使用该图标的名称
```vue
app.use(JIcon, {icons: {}});
app.use(JIcon, {icons: []});

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

```vue
app.use(JIcon, {prefix: 'j-icon-'});

<j-icon icon="x"/>

<svg class="icon j-icon-x">...</svg>
```

## 组件 props
- `icon`: 需要渲染的图标的名称或该图标的渲染函数
- `title`: 为 SVG 元素提供一个描述性字符串, 用来提升 SVG 文档的可访问性
- `width`: SVG 元素宽度
- `height`: SVG 元素高度
- `ariaLabel`:
HTML [aria-label](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute) 属性.
如果未传入任何值, [aria-hidden](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-hidden_attribute) 将为`true`
```vue
<j-icon icon="x"/>

<svg aria-hidden="true"></svg>

<!-- ================================= -->

<j-icon icon="x" aria-label="aria-label"/>

<svg aria-label="aria-label" aria-hidden="false"></svg>
```

## 创建图标对象
图标对象属性查看 [Icon](https://github.com/meshareL/j-icon/blob/master/index.d.ts#L3)
```javascript
import {h as createElement} from 'vue';
const book = {
    name: 'book',
    viewBox: [0, 0, 16, 16],
    size: [16, 16],
    render: () => createElement('path', {d: ''})
};
```

## License
[Apache-2.0](https://github.com/meshareL/j-icon/blob/master/LICENSE)
