import express from 'express'
import path from 'path'

import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import config from '../webpack.config.js'

const app = express()

const getMarkup = html => (
`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Twister</title>
</head>
<body>
  <div id="react-root">
    ${html}
  </div>
</body>
</html>
  `
)

const isDeveloping = process.env.NODE_ENV !== 'production'
if (isDeveloping) {
  const compiler = webpack(config)
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: {
      colors: true,
    },
  })
  app.use(middleware)
  app.use(webpackHotMiddleware(compiler))
  app.use((req, res) => {
    res.status(200).sendFile(path.resolve('index.html'))
  })
} else {
  app.use('/dist', express.static('./dist'))
  app.use((req, res) => {
    console.log('production mode')
    res.status(200).send(getMarkup('<h1>Hello, express</h1>'))
  })
}

app.listen(8080, () => {
  console.log('Server start listening at http://localhost:8080')
})