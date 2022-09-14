---
category: 中级
keywords: addEventListener, clientX, clientY, contextmenu event, custom context menu, detect click outside, getBoundingClientRect, mouse position, prevent default action, set element position
title: 在单击位置显示自定义上下文菜单 *
---

The browser will show the default context menu when user right-clicks on the page. Sometimes, we want to replace the default menu with our own menu that allows user to perform additional actions.

This post illustrates a simple implementation. First of all, let's create an element that we want to show a customized context menu element:

当用户在页面上右键单击时，浏览器将显示默认的上下文菜单。有时，我们希望用自己的菜单替换默认菜单，允许用户执行额外的操作。

这篇文章演示了一个简单的实现。首先，让我们创建一个元素，我们想要显示一个定制的上下文菜单元素:

```html
<div id="element">Right-click me</div>

<ul id="menu">...</menu>
```

### Prevent the default context menu from being displayed 防止显示默认的上下文菜单

To do that, we just [prevent the default action](/prevent-the-default-action-of-an-event) of the `contextmenu` event:

要做到这一点，我们只需阻止contextmenu事件的默认动作:

```js
const ele = document.getElementById('element');
ele.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});
```

### Show the menu at clicked position 在点击的位置显示菜单

We will calculate the position of menu, but it need to be positioned absolutely to its container firstly. So, let's place the element and menu to a container whose position is `relative`:

We will calculate the position of menu, but it need to be positioned absolutely to its container firstly. So, let's place the element and menu to a container whose position is relative:

```html
<div class="relative">
    <div id="element">Right-click me</div>

    <ul id="menu" class="absolute hidden">...</menu>
</div>
```

The `relative`, `absolute` and `hidden` classes are defined as following:

定义要用到的样式 relative, absolute , hidden

```css
.relative {
    position: relative;
}
.absolute {
    position: absolute;
}
.hidden {
    /* The menu is hidden at first */
    display: none;
}
```

> **Resource**
>
> This post doesn't tell how to build the menu. It's up to you but [CSS Layout](https://csslayout.io/patterns/menu) is a nice resource to look at
> 这篇文章并没有告诉你如何创建菜单。这取决于你，但CSS布局是一个很好的资源看

It's the time to set the position for the menu. It can be calculated based on [the mouse position](/calculate-the-mouse-position-relative-to-an-element):

现在是设置菜单位置的时候了。可以根据鼠标位置计算:


```js
ele.addEventListener('contextmenu', function (e) {
    const rect = ele.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Set the position for menu
    menu.style.top = `${y}px`;
    menu.style.left = `${x}px`;

    // Show the menu
    menu.classList.remove('hidden');
});
```

### Close the menu when clicking outside 单击外部时关闭菜单

We can handle the `click` event of `document`, and determine if user [clicks outside](/detect-clicks-outside-of-an-element) of the menu:

我们可以处理文档的单击事件，并确定用户是否在菜单外单击:

```js
ele.addEventListener('contextmenu', function(e) {
    ...
    document.addEventListener('click', documentClickHandler);
});

// Hide the menu when clicking outside of it
const documentClickHandler = function(e) {
    const isClickedOutside = !menu.contains(e.target);
    if (isClickedOutside) {
        // Hide the menu
        menu.classList.add('hidden');

        // Remove the event handler
        document.removeEventListener('click', documentClickHandler);
    }
};
```

The menu is hidden by [adding](/add-or-remove-class-from-an-element) the `hidden` class.

More importantly, the `click` event handler is also removed from `document` as we don't need to handle that when the menu is hidden. This technique is mentioned in the [Create one time event handler](/create-one-time-event-handler) post.

通过添加隐藏类来隐藏菜单。

更重要的是，点击事件处理程序也从文档中删除，因为当菜单被隐藏时我们不需要处理它。在创建一次性事件处理程序的帖子中提到了这种技术。

> **Tip**
>
> This post uses the [Attach event handlers inside other handlers](/attach-event-handlers-inside-other-handlers) tip
> 本文使用其他处理程序提示中的附加事件处理程序



### Demo

:demo[]{title="Show a custom context menu at clicked position" url="/demo/show-a-custom-context-menu-at-clicked-position/index.html"}
