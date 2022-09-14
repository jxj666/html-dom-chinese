---
category: 中级
keywords:
title: 测量给定字体的给定文本的宽度 *
---

### 1. Use the canvas' measureText() method  使用canvas的measureText()方法

```js
const measureWidth = function (text, font) {
    // Create new `canvas` element
    const canvas = document.createElement('canvas');

    // Get the context
    const context = canvas.getContext('2d');

    // Set the font
    context.font = font;

    // Measure the text
    const metrics = context.measureText(text);

    // Return the width in pixels
    return metrics.width;
};
```

### 2. Use a fake element 使用假元素

```js
const measureWidth = function (text, font) {
    // Create an element
    const ele = document.createElement('div');

    // Set styles
    ele.style.position = 'absolute';
    ele.style.visibility = 'hidden';
    ele.style.whiteSpace = 'nowrap';
    ele.style.left = '-9999px';

    // Set font and text
    ele.style.font = font;
    ele.innerText = text;

    // Append to the body
    document.body.appendChild(ele);

    // Get the width
    const width = window.getComputedStyle(ele).width;

    // Remove the element
    document.body.removeChild(ele);

    return width;
};
```

