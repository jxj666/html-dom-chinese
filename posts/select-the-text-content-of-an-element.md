---
category: 基础
keywords: createRange, getSelection, removeAllRanges, select text content, selectNodeContents
title: 选择一个元素的文本内容
---

The following function selects the text content of the `ele` element:

```js
const selectText = function (ele) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(ele);
    selection.removeAllRanges();
    selection.addRange(range);
};
```

### See also

-   [Copy highlighted code to the clipboard](/copy-highlighted-code-to-the-clipboard)
-   [Get the selected text](/get-the-selected-text)
-   [Paste as plain text](/paste-as-plain-text)
-   [Save and restore the text selection](/save-and-restore-the-text-selection)
