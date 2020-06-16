const blocksToHtml = require('@sanity/block-content-to-html');

module.exports = function (eleventyConfig) {
    // Copy `assets/` to `_site/assets`
    eleventyConfig.addPassthroughCopy("source/assets");

    // Copy `favicon/` to `_site/favicon`
    eleventyConfig.addPassthroughCopy("source/favicon");

    // Copy Netlify _redirects file to root of the project
    eleventyConfig.addPassthroughCopy("source/_redirects");

    // limit filter
    eleventyConfig.addFilter("limit", function (array, limit) {
        return array.slice(0, limit);
    });

    // Sanity CMS Portable Text to HTML Filter https://github.com/sanity-io/block-content-to-html
    eleventyConfig.addFilter('sanityToHTML', function (value) {
        return blocksToHtml({
            blocks: value,
        })
    });

    // You can return your Config object (optional).
    return {
        passthroughFileCopy: true,
        markdownTemplateEngine: "njk",
        templateFormats: ["html", "njk", "md"],
        dir: {
            input: "source",
            output: "_site",
            includes: "_includes"
        }
    };
};
