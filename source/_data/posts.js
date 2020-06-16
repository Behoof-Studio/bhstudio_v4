require('dotenv').config()
const sanityClient = require('@sanity/client')

const projectId = process.env.SANITY_PROJECT
// const apiToken = process.env.SANITY_TOKEN

const client = sanityClient({
    projectId,
    dataset: 'production',
    token: '', // sanity-auth-token or leave blank to be anonymous user
    useCdn: true, // `false` if you want to ensure fresh data
})

module.exports = async function () {
    const query = `
    *[ _type == "post"]{
      title,
      excerpt,
      author->{name, slug {current}, image{asset->{path, url}}},
      mainImage{asset->{path,url}},
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
