function cleanMathExpression(expression) {
    // Additional clean-up for zero-width characters or other formatting issues
    expression = expression.replace(/\\bigg\{([^\}]*?)\}/g, '\\bigg$1 '); // \bigg{whatever} -> \biggwhatever
    expression = expression.replace(/\\left\\{/g, '\\left('); // Replace \left{ with \left(
    expression = expression.replace(/\\right\\}/g, '\\right)'); // Replace \right} with \right)
    return expression;
}

marked.use("marked-extended-tables", "gfm");
const renderer = new marked.Renderer();
renderer.image = function (href, title, text) {
    return `<img class="img-fluid" src="${href}" alt="${text}" title="${title}" />`; // for local references
};
renderer.paragraph = function (text) {
    return `<p class="text-break">${text}</p>`;
};
marked.use({ renderer });

document.addEventListener("DOMContentLoaded", async function () {
    
    const pageUrl = document.getElementById('markdown_content').getAttribute('data-page-url');
    
    try {
        const response = await fetch(pageUrl);  // Path to raw Markdown file
        const blob = await response.blob();  // Unwrap to a blob...
        const markdown = await blob.text();  // Convert to text

        // Parse the Markdown text into HTML
        let parsedHTML;

        // Check if 'start' and 'end' are set and different
        if (typeof start === 'number' && typeof end === 'number' && start < end) {
            // Split the Markdown text into three parts
            const beforeSlice = markdown.slice(0, start);
            const highlightedSlice = markdown.slice(start, end);
            const afterSlice = markdown.slice(end);

            // Render the parts
            let parsedBefore = marked.parse(beforeSlice.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, ""));
            let parsedHighlighted = `<div id="highlighted" class="highlight">${marked.parse(highlightedSlice)}</div>`;
            let parsedAfter = marked.parse(afterSlice.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, ""));

            // Sanitize the generated HTML content
            parsedBefore = DOMPurify.sanitize(parsedBefore);
            parsedHighlighted = DOMPurify.sanitize(parsedHighlighted);
            parsedAfter = DOMPurify.sanitize(parsedAfter);

            // Combine the parts
            parsedHTML = parsedBefore + parsedHighlighted + parsedAfter;
        } else {
            // If 'start' and 'end' are not valid, render the entire Markdown
            parsedHTML = marked.parse(markdown.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, ""));
            parsedHTML = DOMPurify.sanitize(parsedHTML);
        }

        // Inject sanitized HTML into the page
        const contentDiv = document.getElementById("markdown_content");
        contentDiv.innerHTML = parsedHTML;

        
        // Render math in the body
        renderMathInElement(document.body, {
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: true },
                { left: '\\(', right: '\\)', display: false },
                { left: '\\[', right: '\\]', display: true }
            ],
            throwOnError: false
        });
        // Use requestAnimationFrame to ensure the scroll happens after rendering
        requestAnimationFrame(() => {
            // Delay scrolling slightly to allow other JS to affect rendering
            setTimeout(() => {
                const highlightedElement = document.getElementById('highlighted');
                if (highlightedElement) {
                    highlightedElement.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                        inline: "nearest"
                    });
                }
            }, 500); // Adjust the delay as necessary
        });
    } catch (error) {
        console.error("Failed to load Markdown content:", error);
    }
});