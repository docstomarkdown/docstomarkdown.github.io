---
publishDate: 2024-06-06T06:18:58.162Z
updateDate: 2024-06-06T06:18:58.162Z
draft: false
title: How to Change Image Size in Markdown
type: post
slug: change-image-size-in-markdown
excerpt: This tutorial teaches you how to change the image size in native Markdown, Pandoc Markdown and in the Kramdown Markdown processor.
---

Markdown is a widely used text formatting language for creating online content. While praised for its simplicity and ease of use, it has a limitation when it comes to image manipulation. Markdown itself doesn’t offer built-in methods for resizing images. However, there are different ways to change image sizes depending on your setup. 

This tutorial teaches you how to change image size in different flavours of Markdown: 

1. Changing image size in vanilla Markdown using HTML attributes
2. Changing image size in Pandoc Markdown using Image dimensions attribute
3. Changing image size in Kramdown

## Changing Image Size Using HTML Img Tag and Attributes

[GitHub Flavoured Markdown](https://github.github.com/gfm/) and other Markdown processors such as [kramdown](https://kramdown.gettalong.org/documentation.html) 
Markdown processors allow embedding HTML code within the Markdown documents. This enables you to control image dimensions using the HTML `<img>` tag. 

**To change the size of an image in Markdown, use the HTML `<img>` tag and specify the `width` and the `height` attributes.** 

The `<img>` tag offers two attributes for controlling the image dimentions - `width` and `height`. These attributes allow you to specify the image size in two ways: 
- Resizing images with Pixels 
- Resizing images with Percentages

*GitHub uses the GitHub Flavoured Markdown. Hence, you can use any of the following methods to [resize the images in the GitHub readme.md files](/center-an-image-in-the-readmemd-file-on-github/) or the GitHub Wiki pages.* 

### **1. Resizing image using Pixels**

This method provides precise control over the dimensions of your images within Markdown documents. It’s ideal for situations where you need images to display at a specific size, regardless of the viewing device.

Here’s the syntax:

```
<img src="path/to/your/image.jpg" width="400" height="300" alt="Image description">
```

- Replace `path/to/your/image.jpg` with the actual location of your image
- Set the desired width and height values in pixels within the width and height attributes
- Include a descriptive alt attribute for accessibility purposes


### **2. Resizing images using Percentages**


For optimal image display across various screen sizes, consider using percentages for image width and height within the `<img>` tag. 

Here’s the syntax for using the percentage to change the image size:

```
<img src="image.jpg" width="50%" alt="Image description">
```

This code displays the image at 50% of its surrounding area’s width. Think of this area like a flexible container that holds your content. By using a percentage, you tell the image to occupy a specific portion of that space.

The image will be displayed as below: 

<div align="center">
	<img width="50%" src="https://i.imgur.com/8BgVXcY.png" alt="Sample image compressed 50%" title="Sample image compressed 50%">
	<p>Sample image compressed to 50% using the width attribute</p>
</div>


- This approach ensures a more responsive layout, allowing images to gracefully adapt to different device dimensions. 
- Eliminates potential overflow issues on smaller screens and create a more consistent user experience.

**Note:** Not all Markdown processors support including raw HTML. Check your specific platform’s documentation to confirm if this method is compatible.

**Security Notice:** While helpful, using raw HTML might introduce security risks if not sanitized properly by the Markdown processor.

## Changing Image Size in Pandoc Using the Image Dimensions Attribute

[Pandoc](https://www.pandoc.org/) is a universal document converter that supports Markdown and allows the use of attributes to control image size directly within the Markdown syntax. 

If you're using Pandoc, you can set the width of an image like this:

```
![figure description](imageFile.png){width=250}
```

This sets the image width to 250 pixels. Pandoc processes this attribute and applies the specified size to the image.

## Changing Image Size in Kramdown Markdown Processor

[Kramdown](https://kramdown.gettalong.org/) is a fast, pure Ruby Markdown parser that is used by Jekyll, a popular static site generator. 

[Jekyll uses Kramdown](https://jekyllrb.com/docs/configuration/markdown/) as its default Markdown processor, allowing for specifying image dimensions directly within the Markdown syntax. Here’s how to set the width of an image to 50% of its container:

```
![alt](image.png){: width="50%"}
```

This syntax tells the Kramdown processor to render the image at 50% of the container’s width.

## Using the Pre-Resized Images 


The most reliable approach across different Markdown environments is to resize your images before using them in your documents. You can use the various online tools such as [Image Resizer](https://imageresizer.com/).


Once you have resized images, you can include them in your Markdown document using the standard Markdown syntax for images:

```
![Image description](path/to/your/resized_image.jpg)
```

**Why Using Resized Image is Better**
- **Portability** - Pre-resized images work consistently across different Markdown processors and platforms without relying on specific syntax or features. If you change the Markdown processor, there is no need to revisit the Markdown later
- **Preserves Quality** - Resizing images with dedicated tools often yields better quality than relying on browser resizing, which can sometimes distort images
- **Reduced Processing Power** - Including pre-resized images reduces the load on the Markdown processor and browser, leading to faster rendering times
- **Guaranteed Appearance** - Pre-resized images ensure that your content looks exactly as intended across all devices and platforms, providing a consistent user experience

## Conclusion

While Markdown offers limited native support for image resizing, the methods outlined above provide solutions for incorporating images with desired dimensions. Whether you leverage HTML attributes or pre-resize your images, you can effectively control how images appear within your Markdown content.
