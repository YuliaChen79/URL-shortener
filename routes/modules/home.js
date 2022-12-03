const express = require('express')
const router = express.Router()
const URL = require('../../models/URL')
const shortenURL = require('../../controllers/shortenURL')

// 設定首頁路由
router.get('/', (req, res) => {
  res.render('index')
})

//設定短網址轉換
router.post('/', (req, res) => {
  if (!req.body.url) return res.redirect('/')
  const originURL = req.body.url
  const shortURL = shortenURL(5)
  URL.findOne({ originURL })
    .lean()
    .then(data => {
      if (!data) {
        return URL.create({ originURL, shortURL })
      }
      console.log(data)
      return data
    })
    .then(data => {
      res.render('shortURL', { shortURL: data.shortURL })
    })
    .catch(err => console.log('error'))
})

//設定短網址連結
router.get('/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL
  URL.findOne({ shortURL })
    .lean()
    .then(data => {
      if (!data) {
        res.redirect('/')
      } else {
        res.redirect(`${data.originURL}`)
      }
    })
    .catch(err => console.log('error'))
})

module.exports = router