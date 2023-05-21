const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

const serviceAccount = require('./chatapp-bfdc5-firebase-adminsdk-s05m2-bc3d251adf.json')

initializeApp({
    credential: cert(serviceAccount),
})

const fireStoreDb = getFirestore()

module.exports = { fireStoreDb }
