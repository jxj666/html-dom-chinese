---
category: 基础
keywords:
title: 自动选择文本区的文本
---

Assume that `ele` represents a textarea element.

```js
ele.addEventListener('focus', function (e) {
    // Select the text
    e.target.select();
});
```

### See also

-   [Attach or detach an event handler](/attach-or-detach-an-event-handler)
-   [Trigger an event](/trigger-an-event)
