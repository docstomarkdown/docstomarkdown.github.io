---
publishDate: 2024-06-07T04:41:37.117Z
updateDate: 2024-06-07T04:41:37.117Z
draft: false
title: Add Images to Readme.MD on GitHub
type: post
slug: add-images-to-readme-md-file-github
excerpt: This tutorial teaches you how to add images to GitHub readme md file using the Markdown syntax or the HTML img tag.
---

A README file on GitHub is a brief, informative introduction to your project, typically including a description, installation instructions, and contribution guidelines, all formatted in Markdown for readability.

**To add images to readme.md file in GitHub, upload the image to your GitHub repository and use the Markdown image syntax `![Image caption](path to your image/imagename.jpg)` in the readme.md file.**

This tutorial teaches you in detail on how to upload the image files to your GitHub repository and add that image to the readme.md file on GitHub. 

## Uploading Images to GitHub with Drag & Drop

To upload the images to your GitHub repository,

- Navigate to your GitHub repository and drag and drop the image file
- Enter a commit message and choose a branch, then click "Commit" to upload the image file
- The image will be uploaded in the directory.

To reference the image in your [README.md](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes), use one of the following methods.

## Adding Images to Readme.Md file on GitHub Using Markdown

To add images in the readme.md file on GitHub using markdown, use the Markdown image sytax as shown below:

```
![Image caption](Path_to_your_image/image_file.jpg)
``` 

It will render the image in the readme file. 

You can use the image file stored on your GitHub repository or also use the public URL of the image hosted elsewhere. 

**Markdown image syntax limitations:**

- Center, left, or right alignment is not possible
- Image size cannot be changed

These limitations can be addressed using HTML tags for images in the readme.md file, as explained in the following section.

## Adding Images to Readmd.MD file on GitHub using the HTML tags

To add an image to the readme.md file on GitHub using the HTML, use the HTML `<img>` tag as shown below. 

```
<img src="Path_to_your_image/image_file.jpg">
```

**Advantages of HTML Tags for Images**

- **Alignment** - HTML tags allow you to center, left-align, or right-align images within the readme
- **Resizing** - You have control over image size using HTML

## Aligning the Images on Readme File with HTML

To [center the image in the readme file on github](/center-an-image-in-the-readmemd-file-on-github), wrap the HTML image tag using the `<div>` tag and specify the `align="center"` attribue as shown below. 

```
<div align="center">
	<img src="https://i.imgur.com/8BgVXcY.png">
</div>
```

The image will be displayed at the center of the screen as below:

<div align="center">
	<img width="50%" src="https://i.imgur.com/8BgVXcY.png">
</div>

## Changing the Size of the Image in GitHub Readme file

To [change the image size](/change-image-size-in-markdown/) on readme file, specify the height and the width attribute within the img tag as shown below. 

```
<div>
  <img width="50%" src="https://i.imgur.com/8BgVXcY.png" alt="Sample image compressed 50%" title="Sample image compressed 50%">
</div>
```

The image width is reduced to 50% and displayed. 

<div align="left">
<img width="50%" src="https://i.imgur.com/8BgVXcY.png" alt="Sample image compressed 50%" title="Sample image compressed 50%">
</div>

> You can also use the pixels to reduce the image. However, using the percentage is recommended to have the responsive layout in various devices. 

## Add images Using the Docs to Markdown Pro Add-on with Google Docs

Do you use Google Docs for collaborative content creation in your Docs as Code workflow, with GitHub or GitLab as your repository? If so, the [Docs to Markdown Pro](https://workspace.google.com/marketplace/app/docs_to_markdown_pro/483386994804) add-on can streamline your process.

This add-on efficiently converts your Google Doc to Markdown format and commits it directly to your GitHub/GitLab repository with a single click. It also handles image uploads seamlessly, eliminating the need to manually upload images to Git and adjust paths within the Markdown file.