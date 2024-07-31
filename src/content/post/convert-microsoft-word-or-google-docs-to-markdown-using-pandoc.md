---
publishDate: 2024-07-18T04:50:20.486Z
updateDate: 2024-07-18T04:50:20.487Z
draft: false
title: How to Convert Microsoft Word or Google Docs to Markdown Using Pandoc
type: post
slug: convert-word-or-docs-to-markdown-using-pandoc
excerpt: This tutorial teaches you how to convert Microsoft Word document or Google Docs into Markdown format using Pandoc.
image: https://www.docstomarkdown.pro/open-graph-convert-word-or-g-docs-to-md-pandoc.png
---

 Markdown, a lightweight markup language, has become a popular choice for writing and publishing content online due to its simplicity, flexibility, and ease of use. Pandoc is a powerful, open-source tool that allows you to convert files between different formats, including [Markdown to Word](/convert-markdown-to-word/) or Google Docs or vice versa.

Many writers use Word or Google Docs for their initial drafting because of the robust editing features and ease of use. However, for publishing content to platforms like WordPress or any other [Static site generators](https://www.cloudflare.com/en-gb/learning/performance/static-site-generator/) such as Jekyll or Hugo, converting these documents to Markdown is essential.

By converting Docx to Markdown, you ensure your content is cleanly formatted and simplify the transition from Word or [Google Docs to WordPress](https://workspace.google.com/marketplace/app/docs_to_wordpress_pro/346830534164) or any other CMS. In this tutorial, you'll learn how to convert your Word or Google Docs to Markdown, enabling a smoother and more efficient publishing workflow.

## Installing Pandoc

To use [Pandoc](https://pandoc.org/), you'll need to install it on your computer. 
Pandoc is available for Windows, macOS, and Linux, and you can download it from the [releases](https://github.com/jgm/pandoc/releases) list. 
    
The [Installation page](https://pandoc.org/installing.html) has a detailed tutorial on the steps to install it on different systems.

Once Pandoc is installed, you can use it in the command line to perform different document conversion operations.

## Preparing the Files

To convert your files to Markdown format, place the Word files in a folder. If you are using Google Docs, export the Google Docs as Word files and place them in the same folder where you want to execute the conversion.

## Convert Docx Files to Markdown format using Pandoc

To [convert Docx files to Markdown](/convert-word-to-markdown/) format, follow the below steps:

1. Open your terminal or command prompt 
2. Navigate to the folder containing your DOCX files
3. Execute the following command.

```
pandoc input.docx -t markdown -o output.md
```

Replace `input.docx` with your actual file name and `output.md` with your desired Markdown file name.

## Exporting the Images During Markdown Conversion

When [converting Docx files or Google Docs with images to Markdown format](/convert-google-docs-to-markdown/) using Pandoc, it's important to ensure that the images are correctly exported and linked in the resulting Markdown file. 

Here's how you can export images while converting to Markdown using the **Using Pandoc's Media Extraction Option**:

To extract media files (including images) from DOCX files and place them in a specified directory while converting to Markdown using the following command:

```
pandoc input.docx -t markdown -o output.md --extract-media=./media
```

- Replace `input.docx` with your actual DOCX file name.
- `--extract-media=./media` specifies the directory (`media`) where Pandoc will save extracted images. You can customize the directory name to match the images directory of your CMS, ensuring the generated Markdown file is ready for publishing.


Once images are extracted, Pandoc will automatically reference them in the Markdown file using relative paths. You can verify that the Markdown file and the `media` directory are kept together to maintain these links.

Example Markdown content referencing an image:

```
![alt text](media/image1.png)
```

**Verification** - After conversion, verify that all images are correctly displayed in your Markdown file by opening it with a [Markdown editor](https://stackedit.io/) or viewer that supports image rendering.

This is how you can generate a publish ready Markdown of the Docx files with images.

## Including Table of Contents

Including a [table of contents](/insert-table-of-contents-in-google-docs-and-include-only-specific-headings-levels/) in a document enhances the readability and navigability of your Markdown documents, making them more user-friendly and organized.

To generate a TOC while Markdown conversion, use the --toc option as shown below. 

```
pandoc input.docx -t markdown -o output.md --toc
```

- Replace input.docx with your actual DOCX file name.
- `--toc` specifies that Pandoc should generate a table of contents based on the document headings.

The generated TOC will appear at the beginning of your Markdown file, providing a structured overview of its contents. This feature is particularly useful for longer documents or those intended for navigation. It is also beneficial when your CMS does not automatically generate a Table of Contents.

## Including Front Matter

Including [front matter](https://gohugo.io/content-management/front-matter/) in your Markdown documents is essential for adding metadata such as title, date, author information, or any other custom fields. This metadata is 
used by static site generators or content management systems (CMS) to customize how content is displayed or organized. 

Here’s how you can include front matter using Pandoc:

**Option 1 - Using Metadata Files** 

1. Create a YAML or JSON file containing your desired metadata fields. For example, create a file named `metadata.yaml` with the following content:

```
title: "Your Document Title"
date: "2024-07-18"
author: "Your Name"
```

2. Run Pandoc with Metadata File by Using the `--metadata-file` option to include the metadata in your Markdown file:

```
pandoc input.docx -t markdown -o output.md --metadata-file=metadata.yaml
```

- Replace `input.docx` with your actual DOCX file name.
- `--metadata-file=metadata.yaml` specifies the YAML file containing metadata.

**Option 2 - Inline Metadata**

You can specify metadata directly in the `Pandoc` command. This method allows you to define metadata fields directly in the command without using a separate file.

```
pandoc input.docx -t markdown -o output.md --metadata title="Your Document Title" --metadata date="2024-07-18" --metadata author="Your Name"
```
Including front matter ensures that your Markdown files are properly structured with metadata, making them suitable for integration into CMS platforms or static site generators.

## Conclusion

Converting DOCX files to Markdown using Pandoc helps you streamline the publishing process. It also simplifies the process by preserving document structure while enabling features like table of contents, image exporting, and front matter inclusion. 

Whether for blogs, technical documents, or academic papers, Pandoc ensures seamless integration with CMS platforms such as WordPress.