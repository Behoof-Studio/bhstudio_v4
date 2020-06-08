module.exports = function (eleventyConfig) {
    // Copy `assets/` to `_site/assets`
    eleventyConfig.addPassthroughCopy("source/assets");

    // Copy `favicon/` to `_site/favicon`
    eleventyConfig.addPassthroughCopy("source/favicon");

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
