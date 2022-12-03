// 載入 express 並建構應用程式伺服器
const express = require('express')
const app = express()
const mongoose = require('mongoose') // 載入 mongoose
const URL = require("./models/URL")
const shortenURL = require("./controllers/shortenURL")
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
  URL.findOne({ originURL})
    .lean()
    .then(data => {
      if(!data){
        const shortURL = shortenURL()
        URL.create({originURL, shortURL})
      }
      return data
    })
    .then(data => {
      res.render('shortURL', { shortURL: data.shortURL })
    })
})

// 設定 port 3000
app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})