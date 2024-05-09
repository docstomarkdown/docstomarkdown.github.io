---
title: "How to Display Local Images in Markdown - Definitive Guide"
date: "2024-03-26"
categories: 
  - "markdown"
tags: 
  - "images"
  - "local"
coverImage: "p7l-display-local-images-markdown.jpeg"
---

Markdown supports adding images from a URL or a local directory.

**To display local images in Markdown you can specify the relative image path in the Markdown image syntax as _!\[alt text\](/path/image.jpg)_.**

In this tutorial, I’ll demonstrate how to display local images in Markdown and what are the best practices to consider. 

## Preparing the Local Image file

Before using the local image in the Markdown, you need to place the images in a specific location. 

There are two ways you can place the images:

- Place the image in the **same folder** as the Markdown file

- Place the image in a **dedicated folder for static assets** 

While both methods work, **using a dedicated image folder provides a cleaner structure** for your project, especially as the number of images grows. It also makes it easier to manage your images if you need to move your Markdown file to a different location.

The following image shows the folder structure when the images have a dedicated folder called _assets_.

![](/image-2.png)

## Markdown Image Syntax for Displaying Local Images

[Markdown image syntax](https://daringfireball.net/projects/markdown/syntax#img) to display local images is similar to the Markdown link syntax, except having an (!) as the prefix. 

```
![alt text](path/to/image.png)
```

Where,

- **Alt text** - This is where you can provide a descriptive alternative text for the image. Alt text serves multiple purposes, such as helping users on slow connections where images may not load properly and providing accessibility support for users with visual impairments. 

- **path/to/image.png** \- This represents the path to the image file, including the appropriate file extension (e.g., .png, .jpg, .gif). It can either be a web image URL or a local file path.

This will render the following HTML code when published:

```
<img src="path/to/image.png" alt="alt text">
```

### Adding captions to the images in Markdown(Optional)

Markdown also supports adding captions to the images. Captions are optional text elements that provide additional context or information about an image and are typically displayed below or beside the image.

To [add captions to the Markdown images](https://www.docstomarkdown.pro/add-image-captions-to-images-in-jekyll-blog-posts-with-markdown/), use the following syntax. 

```
![alt text](sample_image.png "Sample image caption")
```

This will render the following HTML code when published(An image tag with the title attribute).

```
<img src="sample_image.png" alt="alt text" title="Sample image caption">
```

The following image shows how the image is displayed with Caption.

![](/image-3.png)

## Using Absolute Paths vs Relative Local image paths

When specifying the path to local images in Markdown, you have the option to use either absolute paths or relative paths. Each method has its own advantages and considerations.

| Absolute Paths | Relative Paths |
| --- | --- |
| The complete URL or file path starting from the root directory of the file system or web server | The location of the image file relative to the location of the Markdown file |
| Use absolute paths when your Markdown file needs to reference images from various locations | Use relative paths for local development environments or projects where the Markdown file and images are kept together in the same directory or a predictable folder structure |

Both methods are valid options for referencing local images in Markdown, and the choice depends on the specific needs of your project.

If you have any questions, feel free to comment below.
