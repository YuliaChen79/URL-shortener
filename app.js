// 載入 express 並建構應用程式伺服器
const express = require('express')
const app = express()
const mongoose = require('mongoose') // 載入 mongoose
const URL = require('./models/URL')
const shortenURL = require('./controllers/shortenURL')
const bodyParser = require('body-parser')

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB

app.use(bodyParser.urlencoded({ extended: true }))

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// 設定首頁路由
app.get('/', (req, res) => {
  res.render('index')
})

//設定短網址轉換
app.post('/', (req, res) => {
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
app.get('/:shortURL', (req, res) => {
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

// 設定 port 3000
app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})