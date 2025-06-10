function cleanMathExpression(expression) {
    // Additional clean-up for zero-width characters or other formatting issues
    // Now remove the curly braces around \bigg{...} and keep the content
    expression = expression.replace(/\\bigg\{([^\}]*?)\}/g, '\\bigg$1 '); // \bigg{whatever} -> \biggwhatever
    // Replace \left{ and \right} with \left( and \right)
    // Replace \left{ with \left( 
    expression = expression.replace(/\\left\\{/g, '\\left(');

    // Replace \right} with \right)
    expression = expression.replace(/\\right\\}/g, '\\right)');
    return expression;
    }
marked.use("marked-extended-tables", "gfm");
const renderer = new marked.Renderer();
renderer.image = function (href, title, text) {
    return `<img class="img-fluid" src="${href}" alt="${text}" title="${title}" />`; // for local references
};
renderer.paragraph = function (text) {
    return `<p class="text-break"/>${text}</p>`;
};
marked.use({ renderer });

    
    const pageUrl = document.getElementById('markdown_content').getAttribute('data-page-url');
    fetch(pageUrl)  // Path to raw Markdown file
        .then(response => response.blob())  // Unwrap to a blob...
        .then(blob => blob.text())  // Convert to text
        .then(markdown => {
        // Clean the markdown for math expressions
        // markdown = markdown.replace(/\$\$[\s\S]*?\$\$/g, match => cleanMathExpression(match)); // Clean block math
        // markdown = markdown.replace(/\$[\s\S]*?\$/g, match => cleanMathExpression(match)); // Clean inline math
        // Parsing the Markdown text into HTML
        // let parsedHTML = marked.parse(markdown.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, ""));
        let parsedHTML;
        // Überprüfen, ob start und end gesetzt und unterschiedlich sind
        if (typeof start === 'number' && typeof end === 'number' && start < end) {
            // Teile den Markdown-Text in drei Teile
            const beforeSlice = markdown.slice(0, start);
            const highlightedSlice = markdown.slice(start, end);
            const afterSlice = markdown.slice(end);

            // Render die Teile
            let parsedBefore = marked.parse(beforeSlice.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, ""));
            let parsedHighlighted = `<div class="highlight">${marked.parse(highlightedSlice)}</div>`;
            let parsedAfter = marked.parse(afterSlice.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, ""));

            // Sanitize the generated HTML content
            parsedBefore = DOMPurify.sanitize(parsedBefore);
            parsedHighlighted = DOMPurify.sanitize(parsedHighlighted);
            parsedAfter = DOMPurify.sanitize(parsedAfter);

            // Kombiniere die Teile
            parsedHTML = parsedBefore + parsedHighlighted + parsedAfter;
        } else {
            // Wenn start und end nicht gültig sind, rendere den gesamten Markdown
            parsedHTML = marked.parse(markdown.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, ""));
            parsedHTML = DOMPurify.sanitize(parsedHTML);
        }

        // Inject sanitized HTML into the page
        const contentDiv = document.getElementById("markdown_content");
        contentDiv.innerHTML = parsedHTML;

        })
        .catch(error => console.error("Failed to load Markdown content:", error));
document.addEventListener("DOMContentLoaded", function () {
    //replace font location
    const styleSheets = document.styleSheets;
    for (let i = 0; i < styleSheets.length; i++) {
        const rules = styleSheets[i].cssRules || styleSheets[i].rules;
        for (let j = 0; j < rules.length; j++) {
            if (rules[j].type === CSSRule.FONT_FACE_RULE && rules[j].style.src.includes('fonts/KaTeX')) {
                rules[j].style.src = rules[j].style.src.replace(/fonts\//g, '/static/katex/fonts/');
            }
        }
    }
    renderMathInElement(document.body, {
        // customised options
        // • auto-render specific keys, e.g.:
        delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: true },
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true }
        ],
        // • rendering keys, e.g.:
        throwOnError: false
    });
});