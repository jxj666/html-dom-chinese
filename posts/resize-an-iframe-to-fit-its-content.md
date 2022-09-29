---
category: 基础
keywords:
title: 调整iframe的大小以适应其内容
---

Assume that `frame` represents the iframe element.

```js
frame.addEventListener('load', function () {
    // Get the height of the content
    const height = frame.contentDocument.body.scrollHeight;

    // Set the height of iframe
    frame.setAttribute('height', `${height}px`);
});
```

### See also

-   [Attach or detach an event handler](/attach-or-detach-an-event-handler)
-   [Show a loading indicator when an iframe is being loaded](/show-a-loading-indicator-when-an-iframe-is-being-loaded)
