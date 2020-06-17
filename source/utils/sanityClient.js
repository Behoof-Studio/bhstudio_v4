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

module.exports = client
