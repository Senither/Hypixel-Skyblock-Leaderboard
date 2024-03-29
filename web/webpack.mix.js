const path = require('path')
const config = require('./config')
const mix = require('laravel-mix')
require('laravel-mix-definitions')

mix.definition({
  configApiUrl: `'${config.apiUrl}'`,
  announcement: `{
    enabled: ${config.announcement.enabled},
    title: '${config.announcement.title}',
    message: '${config.announcement.message}'
  }`,
})

mix.webpackConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'assets/js'),
      '@components': path.resolve(__dirname, 'assets/js/components'),
    },
  },
})

mix.js('assets/js/app.js', 'public/js').sass('assets/sass/app.scss', 'public/css')
