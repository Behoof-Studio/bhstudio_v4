require('dotenv').config();

const blocksToHtml = require('@sanity/block-content-to-html');
const sanityClient = require('./source/utils/sanityClient');
const imageUrlBuilder = require('@sanity/image-url');

// Rendering custom marks in HTML from Sanity https://github.com/sanity-io/block-content-to-html
const h = blocksToHtml.h;

const serializers = {
    types: {
        image: props => (
            // console.log(props.children)
            // h('figure', { className: "bh__image-container" },
            //     h('img', { src: props.node.asset, alt: props.node.alt }, 'figcaption', { innerHTML: "Alt text" })
            // )
            h('figure', { className: "bh__image-container" },
                h('img', { src: "source.jpg", alt: "Alt text" }),
                h('figcaption', { innerHTML: "Alt text" })
            )
        )
    }
}

// Get a pre-configured url-builder from your sanity client
const builder = imageUrlBuilder(sanityClient);

// Sanity Project ID 
const projectId = process.env.SANITY_PROJECT

// Then we like to make a simple function like this that gives the
// builder an image and returns the builder for you to specify additional
// parameters:
function urlFor(source) {
    return builder.image(source)
}

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
            // serializers: serializers,
            imageOptions: { w: 1000, auto: 'format', q: 80 },
            projectId: projectId,
            dataset: 'production'
        })
    });

    // Sanity Image URL Builder filter for normal cards https://www.sanity.io/docs/presenting-images
    eleventyConfig.addFilter("urlForCard", function (sourceUrl) {
        return urlFor(sourceUrl).width(600).auto('format').url();
    });

    // Sanity Image URL Builder filter for wide cards
    eleventyConfig.addFilter("urlForWideCard", function (sourceUrl) {
        return urlFor(sourceUrl).width(650).auto('format').url();
    });

    // Sanity Image URL Builder filter for case study cover images
    eleventyConfig.addFilter("urlForCoverImg", function (sourceUrl) {
        return urlFor(sourceUrl).width(900).auto('format').url();
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
