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
// Override function
// const tokenizer = {
//     codespan(src) {
//         const match = src.match(/^\$+([^\$\n]+?)\$+/);
//         if (match) {
//             return {
//                 type: 'codespan',
//                 raw: match[0],
//                 text: match[1].trim()
//             };
//         }

//         // return false to use original codespan tokenizer
//         return false;
//     }
// };
// marked.use({ tokenizer });
// fetch("{{ resource_view.get('page_url') or resource.get('url') }}")      // The path to the raw Markdown file
//     .then(response => response.blob())  // Unwrap to a blob...
//     .then(blob => blob.text())          // ...then to raw text...
//     .then(markdown => {                 // ...then pass the raw text into marked.parse
//         document.getElementById("markdown_content").innerHTML = DOMPurify.sanitize(marked.parse(markdown.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, "")));
//     });
const pageUrl = document.getElementById('markdown_content').getAttribute('data-page-url');
fetch(pageUrl)  // Path to raw Markdown file
    .then(response => response.blob())  // Unwrap to a blob...
    .then(blob => blob.text())  // Convert to text
    .then(markdown => {
        // Sanitize and clean up the markdown text before parsing
        // markdown = markdown.replace(/[^\x20-\x7E\x0A\x0D]/g, ''); // Remove non-printable characters

        // Clean the markdown for math expressions
        markdown = markdown.replace(/\$\$[\s\S]*?\$\$/g, match => cleanMathExpression(match)); // Clean block math
        markdown = markdown.replace(/\$[\s\S]*?\$/g, match => cleanMathExpression(match)); // Clean inline math

        // Parsing the Markdown text into HTML
        let parsedHTML = marked.parse(markdown.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, ""));

        // Sanitize the generated HTML content
        parsedHTML = DOMPurify.sanitize(parsedHTML);

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