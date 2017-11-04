const Dat = require('dat-node')
const datStorage = require('dat-storage')
const http = require('http-random-access')

const STATE_LOADING = 'loading'
const STATE_REMOVED = 'removed'
const dats = {}

function load (url) {
  // flag dat as loading
  dats[url] = STATE_LOADING
  const httpInterface = (file) => http(file, { url })
  return new Promise((resolve, reject) => {
    Dat(
      datStorage(httpInterface),
      { upload: true, download: false, latest: true },
      (err, dat) => {
        if (err) return reject(err)
        resolve(dat)
      }
    )
  })
}

function add (url) {
  if (dats[url]) {
    if (dats[url] === STATE_REMOVED) {
      dats[url] = STATE_LOADING
    }
    return Promise.resolve(dats[url])
  }
  return load(url)
    .then((dat) => {
      // if dat is removed before it is finished loading
      if (dats[url] === STATE_REMOVED) {
        dats[url] = undefined
        return
      }
      dats[url] = dat
      dat.joinNetwork()
      dat.archive.on('error', (e) => {
        console.log('There was an error!')
        console.log(e)
      })
      console.log(`Serving ${url} from dat://${dat.key.toString('hex')}`)
      return dat
    })
    .catch((err) => {
      console.log('Oops! Something is not right')
      console.log(err)
      dats[url] = undefined
    })
}

function remove (url) {
  if (!dats[url] || dats[url] === STATE_REMOVED) return
  if (dats[url] === STATE_LOADING) {
    dats[url] = STATE_REMOVED
    return
  }
  dats[url].close()
  dats[url] = undefined
}

function isDat (url) {
  return (dats[url] && dats[url] !== STATE_REMOVED && dats[url] !== STATE_LOADING)
}

function all () {
  return Object.keys(dats).reduce((p, c) => {
    if (isDat(c)) {
      p[c] = dats[c]
    }
    return p
  }, {})
}

function urls () {
  return Object.keys(dats).filter(isDat)
}

module.exports = {
  all,
  urls,
  add,
  remove
}
