const mix = require('laravel-mix');
const path = require('path');

mix.webpackConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'assets/js'),
            '@components': path.resolve(__dirname, 'assets/js/components'),
        }
    }
});

mix.js('assets/js/app.js', 'public/js')
   .sass('assets/sass/app.scss', 'public/css');
