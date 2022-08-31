---
category: 中级
keywords:
title: 更改网站图标
---

The following function changes the favicon to `url`:

下面的函数将favicon更改为` url `:

```js
const setFavicon = function (url) {
    // Find the current favicon element
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
        // Update the new link
        favicon.href = url;
    } else {
        // Create new `link`
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = url;

        // Append to the `head` element
        document.head.appendChild(link);
    }
};
```

When you want to update the favicon dynamically, for example, to user's icon in a social website:

当你想动态更新favicon，例如，用户的图标在一个社交网站:

```js
setFavicon('/path/to/user/profile/icon.ico');
```

### Use an emoji as the favicon
> 使用表情符号作为favicon

Note that the `setFavicon()` function above accepts the favicon's URL. We can have some cool thing by passing a custom URL.

In the code below, we create a `canvas` element, fill it with a particular emoji and get the custom URL:

注意上面的` setFavicon() `函数接受favicon的URL。通过传递一个自定义URL，我们可以得到一些很酷的东西。

在下面的代码中，我们创建了一个`canvas`元素，用一个特定的表情符号填充它，并获得自定义URL:

```js
const emojiFavicon = function (emoji) {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.height = 64;
    canvas.width = 64;

    // Get the canvas context
    const context = canvas.getContext('2d');
    context.font = '64px serif';
    context.fillText(emoji, 0, 64);

    // Get the custom URL
    const url = canvas.toDataURL();

    // Update the favicon
    setFavicon(url);
};

// Usage
emojiFavicon('🎉');
```

