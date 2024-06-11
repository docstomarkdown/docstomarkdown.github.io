---
publishDate: 2024-06-10T11:43:41.572Z
updateDate: 2024-06-10T11:43:41.573Z
draft: false
title: Lists in Markdown - A Definitive Guide
type: post
slug: lists-in-markdown
excerpt: This tutorial explains lists in Markdown, how to create ordered lists, unordered lists, nested lists and a Todo list.
---

Lists allows you to group a set of related items in an ordered or unordered manner. 

**You can create unordered lists in Markdown by prefixing a hyphen `-` to each item and ordered list by starting each item with a number followed by a period (.)**

In this tutorial, I'll demonstrate how to create unordered lists, ordered lists, nested lists and a todo lists in Markdown. 

## Unordered Lists in Markdown

Unordered lists, also known as bulleted lists, are used to present a collection of items where a **specific order doesn't matter**. For example, creating a list of products or features, including items in a recipies and so on.

Unordered lists,  are created using asterisks `*`, or plus signs `+`, or hyphens `-` followed by a space. 


- Each item in the list is prefixed with one of these symbols
- Use the same symbol for all the list items

The following code demonstrates how to create an unordered lists.

```
* Item 1
* Item 2
* Item 3
```

**Output**

* Item 1
* Item 2
* Item 3

> When you publish Markdown with lists, the bullet points or numbering will be automatically styled based on the styles defined in your publishing tool.

## Ordered Lists in Markdown

Ordered lists, also known as numbered lists, are used to present a collection of items where the **order matters**. The ordered lists are displayed with numbers or letters, *emphasizing the sequential nature* of the items.

Ordered lists, are created by prefixing each list item with a number followed by a period. 

The following syntax demonstrates how to create an ordered lists in Markdown.

```
1. First item
2. Second item
3. Third item
```

**Output**

1. First item
2. Second item
3. Third item

## Nested Lists in Markdown

[Nested lists](https://commonmark.org/help/tutorial/10-nestedLists.html), also known as sublists, are used to represent hierarchical data or data with multiple levels of organization. For example, *Organizational charts*, *Outlines with subheadings*, *Product categories and subcategories*.

Nested lists are created by indenting list items with spaces or tabs. *Both unordered and ordered lists can be nested within each other.*

The following code demonstrates how to create a nested lists in markdown:

```
1. First item
   * Subitem 1
   * Subitem 2
2. Second item
   1. Subitem 1
   2. Subitem 2
```

**Output**

1. First item
   * Subitem 1
   * Subitem 2
2. Second item
   1. Subitem 1
   2. Subitem 2

## Creating Lists Inside Markdown Table

Markdown doesn't natively support creating lists inside table. However, you can use the inline HTML to create lists inside table cells, if your Markdown processors supports it. 

To create lists inside table in Markdown, follow the steps:

1. Wrap the list content in HTML `<ul>` (unordered) or `<ol>` (ordered) tags.
2. Use `<li>` tags for each list item.
3. Escape any special characters within the list items using HTML character codes (e.g., `&amp;` for ampersand).


**Example**

```
| Shopping List |
|---|
|<ul><li>Apples</li><li>Bananas</li><li>Oranges</li></ul> |
```

The above Markdown will redered a table as follows:

| Shopping List |
|---|
|<ul><li>Apples</li><li>Bananas</li><li>Oranges</li></ul> |

## Checklist in Markdown

Task lists, also known as checklists, are a special type of list used to represent tasks with a completion status. They are particularly useful for creating to-do lists or marking steps as complete in a process.

**However, it's important to note that task list functionality is not supported by all Markdown processors.**  They are most commonly found in environments like GitHub issues and GitLab. In standard Markdown files (like readme.md), these will render as standard unordered lists with hyphens and square brackets.

Here's how to create task lists in environments that support them:

- Each task item is prefixed with a hyphen - followed by a space and square brackets []
- An empty bracket [] indicates an incomplete task
- A bracket with an "x" [x] indicates a completed task

The following code shows how to create checklists in the GitHub or GitLab issues.

```
- [] Task 1
- [x] Task 2 (completed)
- [ ] Task 3
```

It will create a checkbox list as below: 

![Checkboxes in GitHub](./images/checkboxes-inside-issues-github.png)

This code would render an [interactive checklist in environments like GitHub issues](/draw-checkbox-in-github-markdown-table/), allowing you to check/uncheck tasks directly in the UI.

## Conclusion

Markdown simplifies [list creation](https://daringfireball.net/projects/markdown/syntax#list) with its support for ordered lists (using numbers), unordered lists (using hyphens, asterisks, or plus signs), and nested lists (using indentation). These features make it easy to organize content clearly and effectively.
