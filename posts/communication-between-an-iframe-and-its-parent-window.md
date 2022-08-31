---
category: 中级
keywords:
title: iframe和父窗口之间的通信
---

### Send data from an iframe to its parent window
> 从iframe发送数据到父窗口


```js
// Called from the iframe
window.parent.postMessage(message, '*');
```

Where `message` is a string. If you want to send multiple data, you can encode in JSON:
> 其中` message `是一个字符串。如果你想发送多个数据，你可以用JSON编码:

```js
// Called from the iframe
const message = JSON.stringify({
    message: 'Hello from iframe',
    date: Date.now(),
});
window.parent.postMessage(message, '*');
```

### Send data from a page to its child iframe
> 从页面发送数据到子iframe

```js
// Called from the page
frameEle.contentWindow.postMessage(message, '*');
```

Where `frameEle` represents the iframe element.

其中` frameEle `表示iframe元素。

### Receive the sent data

In the iframe or main page, you can listen on the `message` event to receive the sent data:

在iframe或主页面，你可以监听` message `事件来接收发送的数据:

```js
window.addEventListener('message', function (e) {
    // Get the sent data
    const data = e.data;

    // If you encode the message in JSON before sending them,
    // then decode here
    // const decoded = JSON.parse(data);
});
```

### Tip
> 提示

If you send or receive message from different iframes, you can include a parameter to indicate where the message comes from.

如果您从不同的iframe发送或接收消息，您可以包括一个参数来指示消息来自何处。

```js
// From a child iframe
const message = JSON.stringify({
  channel: 'FROM_FRAME_A',
  ...
});
window.parent.postMessage(message, '*');
```

Then in the main page, you can distinguish the messages by looking at the parameter:

然后在主页面上，你可以通过查看参数来区分消息:


```js
window.addEventListener('message', function (e) {
    const data = JSON.parse(e.data);
    // Where does the message come from
    const channel = data.channel;
});
```

Here is an example demonstrates how to send a simple message between a [page](https://github.com/phuoc-ng/html-dom/blob/master/demo/communication-between-an-iframe-and-its-parent-window/index.html) and [a child iframe](https://github.com/phuoc-ng/html-dom/blob/master/demo/communication-between-an-iframe-and-its-parent-window/iframe.html):

下面是一个示例，演示如何在[page](https://github.com/phuoc-ng/html-dom/blob/master/demo/communication-between-an-iframe-and-its-parent-window/index.html)和[子iframe](https://github.com/phuoc-ng/html-dom/blob/master/demo/communication-between-an-iframe-and-its-parent-window/iframe.html)之间发送一个简单的消息

### Demo

:demo[]{title="Communication between an iframe and its parent window" url="/demo/communication-between-an-iframe-and-its-parent-window/index.html"}

