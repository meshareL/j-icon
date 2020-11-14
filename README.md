# j-icon
Vue 3.0 SVG图标组件

该组件仅渲染`<svg>`元素. 你必须通过`icon` prop传入渲染函数或在安装插件时传入需要使用的图标

## 安装
```shell
npm install @tomoeed/j-icon --save
```

## 使用
```javascript
import {createApp} from 'vue';
import JIcon from 'j-icon';

createApp({}).use(JIcon, {name: '', classes: [], prefix: [], icons: {}});
```

## 插件可选的选项对象
- `name`: 组件名称
```vue
app.use(JIcon, {name: 'v-icon'});

<v-icon icon=""/>
```

- `icons`: 所有图标渲染函数. 安装插件时传入的图标在使用组件时可以直接使用该图标的名称
```vue
app.use(JIcon, {icons: {x: {}}});

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
- `icon`: 图标名称或渲染图标的函数
- `title`: 为SVG元素添加一个 [&lt;title&gt;](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/title) 元素. 当鼠标悬停在该SVG元素时,显示文本内容
- `width`: SVG元素的宽度
- `height`: SVG元素的高度
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
