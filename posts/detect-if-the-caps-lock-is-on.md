---
category: 中级
keywords:
title: 检测大写锁定是否开启
---

Assume that we want to let users know if the caps lock is on while they are entering the value for an input (a password field, for example):

假设我们想让用户知道，当他们输入一个输入值(例如，密码字段)时，大写锁定是否打开:


```html
<input type="text" id="textbox" />

<div id="message" />
```

The element with `id` of `message` will be used to show the message.

` id `为` message `的元素将用于显示消息。


### 1. Use the getModifierState() function
> 使用getModifierState()函数

The [getModifierState()](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState) function returns the state of given modifier key.
It can let us know if the `CapsLock` key is pressed by calling `getModifierState('CapsLock')` from the event object.

[getModifierState() ](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState)函数返回给定修饰键的状态。

它可以通过从事件对象调用` getModifierState('CapsLock') `来告诉我们是否按下了`CapsLock`键。

```js
const textboxEle = document.getElementById('textbox');
const messageEle = document.getElementById('message');

textboxEle.addEventListener('keydown', function (e) {
    const capsLockOn = e.getModifierState('CapsLock');

    // Update the content of message
    messageEle.innerHTML = capsLockOn ? 'Caps lock is ON' : '';

    // Show or hide the message based on the CapsLock state
    messageEle.style.display = capsLockOn ? 'block' : 'none';
});
```

This approach doesn't support the case that users press the _Shift_ key.

这种方法不支持用户按_Shift_键的情况。


### 2. Support the Shift key
> 支持Shift键


The caps lock is treated as ON if users press

-   an uppercase letter without Shift
-   or an lowercase letter with Shift

如果用户按下键，大写锁定被视为ON

- 不带Shift的大写字母
- 或小写字母的Shift

```js
const textboxEle = document.getElementById('textbox');
const messageEle = document.getElementById('message');

textboxEle.addEventListener('keypress', function (e) {
    const isMac = /Mac/.test(navigator.platform);

    const keyCode = e.keyCode || e.which;

    // Is the _Shift_ key pressed?
    const shiftKey = e.shiftKey || keyCode === 16;

    // Get the pressed character
    const s = String.fromCharCode(keyCode);
    const capsLockOn =
        (s.toUpperCase() === s && s.toLowerCase() !== s && !(shiftKey && isMac)) ||
        (s.toUpperCase() !== s && s.toLowerCase() === s && shiftKey);

    messageEle.innerHTML = capsLockOn ? 'Caps lock is ON' : '';
    messageEle.style.display = capsLockOn ? 'block' : 'none';
});
```


