---
category: 基础
keywords: check touch events supported, DocumentTouch
title: 检查是否支持触摸事件
---

Check if the current browser supports the touch events:

```js
const touchSupported = 'ontouchstart' in window || (window.DocumentTouch && document instanceof DocumentTouch);
```

### See also

-   [Detect mobile browsers](/detect-mobile-browsers)
