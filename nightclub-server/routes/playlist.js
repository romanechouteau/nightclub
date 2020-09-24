const path = require('path')
const { Router } = require('express')
const multer = require('multer')
const { Playlist } = require('../models/index.js')
const router = Router()
const upload = multer({ dest: path.join(__dirname, '..', 'public', 'uploads') })

// on submitting a new job using form multipart
router.post('/', upload.single('playlist'), (req, res, next) => {
  console.log(req.body, req)
  const user = req.body.user || 'anonymous'
  const saveData = JSON.parse(req.body.saveData)

  return Playlist.create({
    user,
    saveData,
  })
    .then(playlist => res.redirect(301, `/playlist/${playlist.id}`))
    .catch(err => {
      console.log(
        '***There was an error creating a playlist',
        JSON.stringify(playlist),
      )
      return res.status(400).send(err)
    })
})

router.get('/:id(\\d+)', async (req, res, next) => {
  return Playlist.findByPk(parseInt(req.params.id, 10))
    .then(({ dataValues }) => {
      const { user, saveData, createdAt } = dataValues
      return res.render('playlist', { user, saveData, createdAt })
    })
    .catch(err => {
      console.log(
        'There was an error querying playlists',
        JSON.stringify(err),
      )
      next()
    })
})

router.post('/new', (req, res, next) => {
  return res.render('new', {saveData: req.body.saveData})
})

module.exports = router
