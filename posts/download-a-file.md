---
category: 中级
keywords:
title: 下载一个文件
---

### 1. Use the download attribute
> 使用download属性



Adding the `download` attribute to a link will force the browser to download the file instead of navigating to the link.
Note that the `download` attribute [isn't supported](https://caniuse.com/#feat=download) in IE 11.

在链接中添加`download`属性将迫使浏览器下载文件，而不是导航到该链接。

注意` download `属性[不支持](https://caniuse.com/#feat=download)在IE 11。

```html
<a href="/path/to/file" download>Download</a>
```

### 2. Trigger the click event
> 触发点击事件

The idea comes from creating a link, and trigger its `click` event.

这个想法来自于创建一个链接，并触发它的“点击”事件。

```js
// Create a new link
const link = document.createElement('a');
link.download = 'file name';
link.href = '/path/to/file';

// Append to the document
document.body.appendChild(link);

// Trigger the click event
link.click();

// Remove the element
document.body.removeChild(link);
```

### 3. Download file with generated data
> 下载带有生成数据的文件

It's common to download a file with dynamic data, such as

-   a JSON
-   a text
-   an image

From the data, we can turn it to a blob, then trigger the `click` event as described in the previous section.
The following sample code creates a blob of JSON and downloads it:

下载包含动态数据的文件很常见，例如

- 一个JSON
- 一个文本
- 一个图像

从数据中，我们可以将其转换为blob，然后触发上一节所述的“单击”事件。

下面的示例代码创建了一个JSON blob并下载了它:

```js
const data = JSON.stringify({ 'message': 'Hello Word' });

const blob = new Blob([data], { type: 'application/json' });

// Create new URL
const url = window.URL.createObjectURL(blob);

// Create a link and trigger the download
...

// Free the URL created above
window.URL.revokeObjectURL(url);
```
```
URL.createObjectURL() 静态方法会创建一个 DOMString，其中包含一个表示参数中给出的对象的 URL。这个 URL 的生命周期和创建它的窗口中的 document 绑定。这个新的 URL 对象表示指定的 File 对象或 Blob 对象。
```
```
URL.revokeObjectURL()静态方法用来释放一个之前已经存在的、通过调用 URL.createObjectURL() 创建的 URL 对象。当你结束使用某个 URL 对象之后，应该通过调用这个方法来让浏览器知道不用在内存中继续保留对这个文件的引用了。
```