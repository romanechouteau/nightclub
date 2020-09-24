const express = require('express')
const router = express.Router()
const { Playlist } = require('../models/index.js')

/* GET home page. */
router.get('/', (req, res, next) => {
  return Playlist.findAll()
    .then(playlists => {
      console.log(playlists[playlists.length - 1].dataValues.saveData.length)
      res.render('list', { playlists , title:'All playlists'})
    })
    .catch(err => {
      console.log(
        'There was an error querying playlists',
        JSON.stringify(err),
      )
      return res.send(err)
    })
})

module.exports = router
