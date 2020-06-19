const client = require('../utils/sanityClient');

module.exports = async function () {
    const query = `
    *[ _type == "post"]{
      title,
      excerpt,
      author->{name, slug {current}, image{asset->{path, url}}},
      mainImage{alt, asset->{metadata,path,url}},
      caseStudyUrl,
      categories[]->{title, description},
      slug {current},
      publishedAt,
      body
    } | order(publishedAt desc)
  `
    const params = {}

    return await client.fetch(query, params)
}
