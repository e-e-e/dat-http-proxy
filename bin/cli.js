#!/usr/bin/env node

process.title = 'dat-http-proxy'

const path = require('path')
const readFile = require('read-file-live')
const minimist = require('minimist')
const proxies = require('../index.js')

const argv = minimist(process.argv.slice(2))
const cwd = argv.cwd || process.cwd()
const url = argv._[0]

if (argv.help || argv.h) {
  console.log(
    'Usage: dat-http-proxy [url?] [options]\n\n' +
    '  --cwd         [folder to run in]\n'
  )
  process.exit(0)
}

if (url) {
  proxies.add(url)
} else {
  readFile(path.join(cwd, 'url-feeds'), (file) => {
    const urls = file.toString().split('\n').filter(a => !!a)
    const loaded = proxies.urls()
    // check for what is loaded but no longer in url-feeds
    const toClose = loaded.filter(l => urls.indexOf(l) === -1)
    console.log('Removing', toClose)
    toClose.map(proxies.remove)
    console.log('Adding', urls)
    urls.map(proxies.add)
  })
}
