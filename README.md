# j-icon
A SVG icon component for Vue

该组件仅渲染`<svg>`元素. 你必须通过`icon` prop传入渲染函数或在安装插件时传入所有图标

## 安装
```text
npm install @tomoeed/j-icon --save
```

## 使用
```javascript
import Vue from 'vue';
import jIcon from 'j-icon';

Vue.use(jIcon, {name: '', icons: {}, classNames: []});
```

## 插件可选的选项对象
- `name`: 组件名称
```vue
Vue.use(jIcon, {name: 'v-icon'});
// use
<v-icon icon=""/>
```

- `icons`: 所有图标渲染函数. 安装插件时传入的渲染函数在使用组件时可以直接使用该函数的名称
```vue
Vue.use(jIcon, {icons: {x: ${renderFunction}}});
// use
<j-icon icon="x"/>
```

- `classNames`: 渲染`<svg>`元素时,默认携带的`class`
```vue
Vue.use(jIcon, {classNames: ['icon']});
// rendered
<svg class="icon">...</svg>
```

- `prefix`: 图标名称`class`前缀
  - 传递`false`将不会添加图标名称`class`
  - 传递`true`将自动添加`icon-`前缀

```vue
Vue.use(jIcon, {prefix: 'j-icon-'});

<j-icon icon="x"/>
// rendered
<svg class="icon j-icon-x">...</svg>
```

## 组件 props
- `icon`: 图标名称或渲染图标的函数
- `title`: 为SVG元素添加一个 [&lt;title&gt;](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/title) 元素. 当鼠标悬停在该SVG元素时,显示文本内容
- `width`: SVG元素的宽
- `height`: SVG元素的高度
- `ariaLabel`:
HTML [aria-label attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute).
如果未传入任何值, [aria-hidden](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-hidden_attribute) 将为`true`
```vue
<j-icon icon="x"/>
<!-- result -->
<svg aria-hidden="true"></svg>

<!-- ================================= -->

<j-icon icon="x" aria-label="aria-label"/>
<!-- result -->
<svg aria-label="aria-label" aria-hidden="false"></svg>
```

## 创建渲染函数
渲染图标的函数有一个Vue `CreateElement` 参数, 并且必须返回一个Vue [VNode](https://github.com/vuejs/vue/blob/dev/src/core/vdom/vnode.js) 数组
```javascript
function Book(h) {
    return [h('path', {attrs: {d: ""}})];
}
// iconName属性可以省略
// 如果省略 iconName 属性, 将使用函数名称
Book.iconName = 'book';
// size 属性可以省略
// 如果省略 size 属性, 将使用 viewBox 属性
// e.g: viewBox = [0, 0, 12, 16] --> size = [12, 16]
//        width, height
Book.size = [16, 16];
Book.viewBox = [0, 0, 16, 16];
```

## License
[Apache-2.0](https://github.com/meshareL/j-icon/blob/master/LICENSE)