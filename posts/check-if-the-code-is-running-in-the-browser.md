---
category: 基础
keywords: check code run browser, detect browser
title: 检查代码是否在浏览器中运行
---

We can detect if the current code is running in the browser by checking the existence of `window` and `document` objects:

```js
const isBrowser = typeof window === 'object' && typeof document === 'object';
```

### See also

-   [Detect internet explorer browser](/detect-internet-explorer-browser)
-   [Detect mac os browser](/detect-mac-os-browser)
-   [Detect mobile browsers](/detect-mobile-browsers)
