---
title: "Add Captions to Images in Markdown - Definitive Guide"
publishDate: 2023-10-24
excerpt: "This definitive guide will show you how to add captions to images in Markdown and provide you with some tips for creating effective image captions."
categories: 
  - "jekyll"
tags: 
  - "images"
  - "markdown"
  - "syntax"
showToc: true
image: https://www.docstomarkdown.pro/open-graph-add-caption-to-images-in-markdown.png
---

Image captions are an important part of any blog post, as they can help to explain and contextualize your images, making them more informative and engaging for your readers.

This definitive guide will show you how to add captions to images in Markdown or using the Jekyll-figure extension if you're using Jekyll to build your site.

<!-- toc -->

## Adding Image Captions in the Markdown Image Syntax

**To add captions to images in Markdown, use the `![alt text](<image_url> “Your image caption”)` syntax.**

Where:

- _**alt text**_ is a brief description of the image, which is displayed to users who cannot see the image, such as those who are blind or have visual impairments

- _**image\_url**_ is the URL of the image file

- _**Your image caption**_ is the text of the image caption

**Example**

The following example shows how to add a caption to an image in Markdown:

```
![A bowl of ice cream](https://example.com/image_1.jpg "This is a delicious bowl of ice cream.")
```

This will render the following HTML(An [img](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img) tag with the title attribute)

```
<img src="https://example.com/image_1.jpg" alt="A bowl of ice cream" title=" This is a delicious bowl of ice cream.">
```

The _alt text_ will be displayed to users who cannot see the image, and the _title_ attribute will be displayed when users hover over the image.

## Using the Jekyll Figure Extension to Add Captions to Images

If you're building the site using the Jekyll static site generation, the [Jekyll Figure](https://github.com/paulrobertlloyd/jekyll-figure) extension provides a simple way to add captions to images in Jekyll blog posts using Markdown.

**When to use this method:**  
You need to use this method when you want to render the images and captions using the `<figure>` and `<figcaption>` html tags.

### Installing the Jekyll Figure extension

To install the Jekyll Figure extension, add the following line to your `Gemfile`:

```
gem 'jekyll-figure'
```

Then, run the following command to install the extension:

```
bundle install
```

Once the extension is installed, you can start using it to add captions to images in your Jekyll blog posts using the Liquid Markdown syntax.

_Liquid Markdown is a combination of Markdown and the Liquid templating language which is a feature of the Jekyll static site generator. It allows you to use Liquid tags and variables within your Markdown content. This gives you more flexibility in how you format your content and allows you to add dynamic elements to your pages._

Use the following liquid Markdown syntax to add images to your Markdown content with captions:

```
{% figure image_url caption %}
{% endfigure %}
```

Where:

- _**image\_url**_ is the URL of the image file

- _**caption**_ is the text of the image caption

**Example**

The following example shows how to add a caption to an image using the Liquid Markdown supported by the Jekyll Figure extension:

```
{% figure https://example.com/image.png My image caption %}

{% endfigure %}
```

This will render the following HTML(creating `<figure>` tag and the `<figcaption>` tag):

```
<figure>
  <img src="https://example.com/image.png" alt="My image caption">
  <figcaption>My image caption</figcaption>
</figure>
```

The [figure tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure) groups an image and its caption together, and the `figcaption` tag contains the caption text.

**Benefits of using the `figure` and `figcaption` tags**

There are a few benefits to using the `figure` and `figcaption` tags to add captions to images in Markdown:

- **Semantic value:** The `figure` and `figcaption` tags are semantic HTML elements, which means that they have a specific meaning to search engines and other assistive technologies. This can help to improve the SEO of your Markdown content and make it more accessible to all users.

- **Styling flexibility:** You can use `CSS` to style the appearance of your image captions using the `figure` and `figcaption` tags. This gives you more control over how your captions look and feel.

- **Compatibility:** The `figure` and `figcaption` tags are supported by all major web browsers. This means that your image captions will be displayed correctly to all of your readers, regardless of the browser they are using.

## Adding Image caption using the figure and figcaption HTML Tag Directly in the Markdown

Another way to [add captions to images](/add-caption-to-images-google-docs/) in Markdown is to use the figure and figcaption HTML tags _**directly**_ in the Markdown text.

To add a caption to an image using the `figure` and `figcaption` tags,

- Simply wrap the image in a `figure` tag

- Place the caption text in a `figcaption` tag next to the `image` tag.

For example,

```
<figure>
  <img src="https://example.com/image.png" alt="Image description">
  <figcaption>This is the image caption.</figcaption>
</figure>
```

This will render the following HTML:

```
<figure>
  <img src="https://example.com/image.png" alt="Image description">
  <figcaption>This is the image caption.</figcaption>
</figure>
```

## Auto-Add Image Captions with Docs to Markdown Pro

Streamline your content creation workflow with [Docs to Markdown Pro](https://workspace.google.com/marketplace/app/docs_to_markdown_pro/483386994804), a Google Docs add-on that automatically generates Markdown syntax for images, including captions.

Whether you're writing a blog post or creating a documentation page, Docs to Markdown Pro saves you time and effort by:

- Extracting image captions from images in Google Docs or generating them using Google AI

- Uploading images to your Git repository

- Creating a Markdown file with the appropriate image URLs and captions

- Committing the Markdown file to your Git repository

With Docs to Markdown Pro, you can focus on creating great content without worrying about the technicalities of Markdown syntax.

Try Docs to Markdown Pro today and see the difference it can make in your content creation workflow.

## Conclusion

Adding image captions to your Jekyll blog posts is a great way to improve the accessibility, SEO, and styling flexibility of your content. By following the tips in this definitive guide, you can easily add effective image captions to your Jekyll blog posts using Markdown.
