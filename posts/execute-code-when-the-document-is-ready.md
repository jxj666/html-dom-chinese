---
category: 基础
keywords:
title: 当文档准备好时执行代码
---

```js
const ready = function (cb) {
  // Check if the `document` is loaded completely
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", function (e) {
        cb();
      })
    : cb();
};

// Usage
ready(function() {
    // Do something when the document is ready
    ...
});
```
