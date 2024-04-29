const px2vw = require('./src/dev/postcss-plugin-px2vw/index.cjs')

module.exports = {
  plugins: [
    px2vw({
      viewportWidth: 390,
      selectorBlackList: ['px', 'root'],
      // exclude: 除了*/pages/Creator/index.module.css之外所有的(只包含*/pages/Creator/index.module.css)
      include: [/\/pages\/Creator\/index\.module\.css$/],
    }),
  ],
}
