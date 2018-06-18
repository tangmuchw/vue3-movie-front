module.exports = {
    plugins: [
        require('postcss-import'),
        require('postcss-url'),
        require('postcss-pxtorem')({
            rootValue: 23.4375,
            minPixelValue: 1,
            propList:['*']
        }),
        require('precss')(),
        require('postcss-calc')(),
        require('autoprefixer')({
            browsers: ['Android >= 4.0', 'iOS >= 7']
        })
    ]
}