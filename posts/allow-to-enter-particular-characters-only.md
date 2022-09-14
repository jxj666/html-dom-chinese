---
category: 中级
keywords: addEventListener, input event, keypress event, preventDefault, selectionEnd, selectionStart, setSelectionRange
title: 只允许输入特定字符
---

In this example, we will force users to enter characters from given set only. Specifically, the supported characters in this demonstration include the digits and space. Of course, you can apply the idea for other characters as well.

Here is our input element:

在本例中，我们将强制用户只输入给定字符集中的字符。具体来说，本演示中支持的字符包括数字和空格。当然，你也可以将这一理念应用于其他角色。

这是我们的输入元素:

```html
<input type="text" id="input" />
```

### 1. Handle the events  事件处理

By handling the `keypress` event, we can prevent user from entering characters except digits and space:

通过处理 `keypress` 事件，我们可以阻止用户输入除数字和空格外的字符:

```js
const ele = document.getElementById('input');

ele.addEventListener('keypress', function (e) {
    // Get the code of pressed key
    const key = e.which || e.keyCode;

    // 0, 1, ..., 9 have key code of 48, 49, ..., 57, respectively
    // Space has key code of 32
    if (key != 32 && (key < 48 || key > 57)) {
        // Prevent the default action
        e.preventDefault();
    }
});
```

It looks good but isn't enough since user is still able to paste or drag unsupported characters to the input.
These cases can be handled by the `input` event:

它看起来不错，但还不够，因为用户仍然可以将不支持的字符粘贴或拖动到输入。

这些情况可以通过` input `事件来处理:

```js
// Track the current value
let currentValue = ele.value || '';

ele.addEventListener('input', function (e) {
    const target = e.target;

    // If users enter supported character (digits or space)
    /^[0-9\s]*$/.test(target.value)
        ? // Backup the current value
          (currentValue = target.value)
        : // Otherwise, restore the value
          // Note that in this case, `e.preventDefault()` doesn't help
          (target.value = currentValue);
});
```

Here we check if the value matches the regular expression `/^[0-9\s]*$/` that covers the digit and space characters.

It fixes the cases where users paste from the keyboard (`Ctrl + V`), context menu or drop text to the input.

But there's another issue. Calling `target.value = currentValue` will put the cursor at the end of input. We have to persist the cursor's position.

这里我们检查值是否匹配正则表达式` /^[0-9\s]*$/ `，它包含数字和空格字符。

它修复了用户从键盘粘贴(` Ctrl + V `)，上下文菜单或拖放文本输入的情况。

但还有另一个问题。调用的目标。value = currentValue '将把光标放在输入的末尾。我们必须保持光标的位置。

```js
// Track the current cursor's position
const selection = {};

ele.addEventListener('keydown', function (e) {
    const target = e.target;
    selection = {
        selectionStart: target.selectionStart,
        selectionEnd: target.selectionEnd,
    };
});
```

When user changes the input value, we will restore both the value and selection positions if the value isn't supported:

当用户改变输入值时，如果该值不被支持，我们将恢复该值和选择位置:


```js
ele.addEventListener('input', function (e) {
    const target = e.target;

    if (/^[0-9\s]*$/.test(target.value)) {
        currentValue = target.value;
    } else {
        // Users enter the not supported characters
        // Restore the value and selection
        target.value = currentValue;
        target.setSelectionRange(selection.selectionStart, selection.selectionEnd);
    }
});
```

We can combine the tracked properties (`value`, `selectionStart` and `selectionEnd`) to a single variable as you
see in the demo at the end.

我们可以将被跟踪的属性(` value `， ` selectionStart `和` selectionEnd `)合并到一个变量中

见最后的演示。

### 2. Use the special input 使用特殊输入



We can use a special HTML 5 input to serve particular use cases:

我们可以使用特殊的HTML 5输入来服务于特定的用例:

| `input`                   | Description                       |
| ------------------------- | --------------------------------- |
| `<input type="color" />`  | Let user specify a color          |
| `<input type="date" />`   | Let user enter a date             |
| `<input type="email" />`  | Let user enter an email address   |
| `<input type="number" />` | Let user enter numbers only       |
| `<input type="tel" />`    | Let user enter a telephone number |
| `<input type="time" />`   | Let user enter a time             |
| `<input type="url" />`    | Let user enter a URL              |

There are more built-in types that you can explore [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#%3Cinput%3E_types).

In our specific example, `<input type="number" />` doesn't help because it doesn't allow to enter a space.

您可以在[这里](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#%3Cinput%3E_types)探索更多内置类型。

在我们的特定示例中，` <input type="number" /> `没有帮助，因为它不允许输入空格。

### Demo

:demo[]{title="Allow to enter particular characters only" url="/demo/allow-to-enter-particular-characters-only/index.html"}

