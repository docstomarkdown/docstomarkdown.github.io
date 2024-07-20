export const customTemplate = (html) => {
    return `
<aside class="custom-toc">
    <h2>Table of Contents</h2>
    <nav>
        ${html}
    </nav>
</aside>`.trim();
};

