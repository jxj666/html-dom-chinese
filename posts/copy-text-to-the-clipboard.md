---
category: 中级
keywords:
title: 将文本复制到剪贴板
---

Assume that we want to copy a given text, `text`, to the clipboard.

In order to do that, we [create](/create-an-element) a fake `textarea` element with value as `text`. Next, we [select](/trigger-an-event) the content and execute the "Copy" command.

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

### See also

-   [Append to an element](/append-to-an-element)
-   [Copy highlighted code to the clipboard](/copy-highlighted-code-to-the-clipboard)
-   [Paste as plain text](/paste-as-plain-text)
-   [Remove an element](/remove-an-element)
