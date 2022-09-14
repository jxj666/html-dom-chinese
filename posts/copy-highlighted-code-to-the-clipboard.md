---
category: 高级
keywords: addEventListener, addRange, copy text clipboard, createRange, execCommand, getRangeAt, getSelection, rangeCount, removeAllRanges, selectNodeContents, window get selection
title: 将高亮显示的代码复制到剪贴板 *
---

在当今的web开发中，允许用户复制示例代码是一件很常见的事情。为了演示实现，我们创建了两个元素:

```html
<pre id="sampleCode"><code>...</code></pre>
<button id="copyButton">Copy</button>
```

The `sampleCode` element contains the sample code which is already highlighted.

Copying the sample code to the clipboard could consist of three steps:

-   [Select](/select-the-text-content-of-an-element) the text content of the code element
-   [Copy](/copy-text-to-the-clipboard) it to the clipboard using the `document.execCommand('copy')` function
-   Last but not least, both the steps above have an effect on the text selection.

So we have to backup the current selected text before copying, and [restore it](/save-and-restore-the-text-selection) at the end.

You can see the code in the demo below. Enjoy!

### Demo

:demo[]{title="Copy highlighted code to the clipboard" url="/demo/copy-highlighted-code-to-the-clipboard/index.html"}

### See also

-   [Attach or detach an event handler](/attach-or-detach-an-event-handler)
-   [Copy text to the clipboard](/copy-text-to-the-clipboard)
-   [Get the selected text](/get-the-selected-text)
-   [Paste as plain text](/paste-as-plain-text)
-   [Save and restore the text selection](/save-and-restore-the-text-selection)
-   [Select the text content of an element](/select-the-text-content-of-an-element)
