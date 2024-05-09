---
title: "How to Embed Google Docs in GitLab Markdown File ?"
date: "2024-03-01"
categories: 
  - "gitlab"
  - "google-docs"
tags: 
  - "iframe"
  - "markdown"
coverImage: "Embed-google-docs-to-Gita.jpeg"
---

GitLab Community editions and GitLab Enterprise editions use GitHub-flavoured markdown in the text areas.

If your goal is to display Google Docs content in GitLab within text areas like _Readme.md_ or _Wikis_, **embedding Google Docs in GitLab is not the appropriate solution**, and it is not possible too.

Because GitLab uses GitHub-flavored Markdown (gfm), and gfm does not support the embedding of `<iframes>` in Markdown.

As per GitLab [docs](https://github.github.com/gfm/#example-630:~:text=quot%3B%26gt%3B%3C/p%3E-,6.11Disallowed%20Raw%20HTML,-(extension)):

_GitHub Flavoured Markdown enables the `tagfilter` extension, where the following HTML tags will be filtered when rendering HTML output:_

- _<title>_

- _<textarea>_

- _<style>_

- _<xmp>_

- _<iframe>_

- _<noembed>_

- _<noframes>_

- _<script>_

- _<plaintext>_

`iframe` will be filtered by the `tagfilter` extension **due to the security concerns** such as [Content spoofing](https://owasp.org/www-community/attacks/Content_Spoofing) and [Cross site scripting](https://owasp.org/www-community/attacks/xss/).

Hence, the right way to use the Google Docs content in GitLab is to [convert the Google Docs into Markdown format](https://www.docstomarkdown.pro/) and update into GitLab. There are two options to add the content of Google Docs to GitLab as Markdown.

- Converting Google Docs to Markdown and Paste in GitLab file

- Commit the Google Docs Content as Markdown to GitLab directly

Both of these options are possible using the [Docs to Markdown Pro](https://workspace.google.com/marketplace/app/docs_to_markdown_pro) from Google Docs add-on.

Install this add-on and read further to learn how to use Google Docs content as Markdown in GitLab text areas.

## Converting Google Docs to Markdown and Paste in GitLab file

This section explains how to convert Google Docs content to Markdown text and manually paste the text into a GitLab text area, for example, _readme.md_.

1. From the _Extensions_ menu, select _Docs to Markdown Pro_ > _Convert To Markdown (Copy or Save as a file)_ option.

3. Click the "To Markdown" button. The Google Docs content will be converted to Markdown format, and the output text will be displayed and copied to the clipboard.

5. Navigate to the GitLab repository and open the file to which you need to add the Google Docs content.

7. Paste the copied content and commit it.

9. That’s it. Now, your Google Docs content has been updated in GitLab as Markdown.

**Note:** This process involves manual effort.

In the next section, let us see how you can commit Google Docs content as Markdown to GitLab.

## Committing the Google Docs Content as Markdown to GitLab 

The Docs to Markdown Pro add-on allows you to commit Google Docs content as Markdown _without_ manual effort. Here is how to do it:

1. From the _Extensions_ menu, select _Docs to Markdown Pro_ > _Export as Markdown to GitHub or GitLab_ option

3. On the top left corner, click the _Settings_ window. The settings window will open, allowing you to configure your GitLab repository using the username, personal access tokens, and other data such as Markdown commit location and images commit location. Once configured, close the configure window (this is a one-time activity).

5. In the _Export as Markdown_ window, select the _Git branch_ to which you need to commit the Google Docs as Markdown

7. Update the _Markdown file name_ as required

9. Optionally, if you need to include Front Matter for static sites, use the _Edit Front Matter_ option and update the necessary details.

11. Finally, click the _Push to Git_ option

13. The Google Docs content will be converted to Markdown format and pushed to your GitLab repository

15. If you need to update the contents, make the necessary changes in Google Docs, and click the Push to Git option. The updated content will be committed to the GitLab file

## Advantages of Using the Add-on

- Eliminates manual work, saving time.

- Images are automatically uploaded to Git, and their paths are updated in the generated Markdown.

- Ensures error-free conversion.

- Facilitates seamless updates when there is a change in the content.
