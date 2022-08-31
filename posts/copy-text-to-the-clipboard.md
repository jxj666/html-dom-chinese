---
category: 中级
keywords:
title: 将文本复制到剪贴板
---

Assume that we want to copy a given text, `text`, to the clipboard.

In order to do that, we [create](/create-an-element) a fake `textarea` element with value as `text`. Next, we [select](/trigger-an-event) the content and execute the "Copy" command.

假设我们想要复制一个给定的文本` text `到剪贴板。

为了做到这一点，我们[create](/create-an-element)一个假的`textarea`元素，其值为`text`。接下来，我们[select](/trigger-an-event)内容并执行“Copy”命令。

```js
// Create a fake textarea
const textAreaEle = document.createElement('textarea');

// Reset styles
textAreaEle.style.border = '0';
textAreaEle.style.padding = '0';
textAreaEle.style.margin = '0';

// Set the absolute position
// User won't see the element
textAreaEle.style.position = 'absolute';
textAreaEle.style.left = '-9999px';
textAreaEle.style.top = `${document.documentElement.scrollTop}px`;

// Set the value
textAreaEle.value = text;

// Append the textarea to body
document.body.appendChild(textAreaEle);

// Focus and select the text
textAreaEle.focus();
textAreaEle.select();

// Execute the "copy" command
try {
    document.execCommand('copy');
} catch (err) {
    // Unable to copy
} finally {
    // Remove the textarea
    document.body.removeChild(textAreaEle);
}
```

