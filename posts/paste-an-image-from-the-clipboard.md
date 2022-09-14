---
category: 中级
keywords: clipboardData, createObjectURL, FormData, getAsFile, paste event, paste image from clipboard, XMLHttpRequest
title: 从剪贴板粘贴图像
---


> Blob 对象表示一个不可变、原始数据的类文件对象。它的数据可以按文本或二进制的格式进行读取，也可以转换成 ReadableStream 来用于数据操作。

```js
// Handle the `paste` event
document.addEventListener('paste', function (evt) {
    // Get the data of clipboard
    const clipboardItems = evt.clipboardData.items;
    const items = [].slice.call(clipboardItems).filter(function (item) {
        // Filter the image items only
        return item.type.indexOf('image') !== -1;
    });
    if (items.length === 0) {
        return;
    }

    const item = items[0];
    // Get the blob of image
    const blob = item.getAsFile();
});
```

From the image blob, we can preview it as you see in the live example below:

从图像blob中，我们可以预览它，就像你在下面的实时示例中看到的那样:

```js
// Assume that we have an `img` element
// <img id="preview" />

const imageEle = document.getElementById('preview');
imageEle.src = URL.createObjectURL(blob);
```

> URL.createObjectURL() 静态方法会创建一个 DOMString，其中包含一个表示参数中给出的对象的 URL。这个 URL 的生命周期和创建它的窗口中的 document 绑定。这个新的 URL 对象表示指定的 File 对象或 Blob 对象。

or [upload](/upload-files-with-ajax) it to the server with an Ajax request:

或者通过Ajax请求将其上传到服务器:

```js
// Create a new FormData
const formData = new FormData();
formData.append('image', blob, 'filename');

// Create new Ajax request
const req = new XMLHttpRequest();
req.open('POST', '/path/to/back-end', true);

// Handle the events
req.onload = function () {
    if (req.status >= 200 && req.status < 400) {
        const res = req.responseText;
        // Do something with the response
        // ...
    }
};

// Send it
req.send(formData);
```

> XMLHttpRequest（XHR）对象用于与服务器交互。通过 XMLHttpRequest 可以在不刷新页面的情况下请求特定 URL，获取数据。这允许网页在不影响用户操作的情况下，更新页面的局部内容。XMLHttpRequest 在 AJAX 编程中被大量使用。

### Demo

:demo[]{title="Paste an image from the clipboard" url="/demo/paste-an-image-from-the-clipboard/index.html"}
