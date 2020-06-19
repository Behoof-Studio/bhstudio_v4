require('dotenv').config();

const blocksToHtml = require('@sanity/block-content-to-html');
const sanityClient = require('./source/utils/sanityClient');
const imageUrlBuilder = require('@sanity/image-url');
const { getImageAsset } = require('@sanity/asset-utils');

// Sanity Project ID 
const projectId = process.env.SANITY_PROJECT

// Get a pre-configured url-builder from your sanity client
const builder = imageUrlBuilder(sanityClient);

// Simple function like this that gives the
// builder an image and returns the builder to specify additional
// parameters:
function urlFor(source) {
    return builder.image(source)
}

// Rendering custom marks in HTML from Sanity https://github.com/sanity-io/block-content-to-html
const h = blocksToHtml.h;

const serializers = {
    // Check what is inside props for example this way <pre>${JSON.stringify(props, null, 2)}</pre>. Put it inside innerHTML below.
    types: {
        image: props => (
            h('figure', {
                className: 'bh__image-container',
                innerHTML: `
                    <img src="${urlFor(props.node.asset).width(1000).auto('format').url()}"
                        alt="${props.node.alt}">
                    <figcaption>${props.node.alt}</figcaption>    
                `
            })
        )
    }
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
            serializers: serializers,
            imageOptions: { w: 1000, auto: 'format', q: 80 },
            projectId: projectId,
            dataset: 'production'
        })
    });

    // Sanity Image URL Builder filter for normal cards https://www.sanity.io/docs/presenting-images
    eleventyConfig.addFilter("urlForCard", function (sourceUrl, width) {
        return urlFor(sourceUrl).width(width).auto('format').url();
    });

    // Sanity Image URL Builder filter for wide cards
    eleventyConfig.addFilter("urlForWideCard", function (sourceUrl) {
        return urlFor(sourceUrl).width(650).auto('format').url();
    });

    // Sanity Image URL Builder filter for case study cover images
    eleventyConfig.addFilter("urlForCoverImg", function (sourceUrl) {
        return urlFor(sourceUrl).width(900).auto('format').url();
    });

    // Sanity Image URL Builder filter for LQIP images
    eleventyConfig.addFilter("lqip", function (imageAsset) {
        return getImageAsset(imageAsset).metadata.lqip;
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
