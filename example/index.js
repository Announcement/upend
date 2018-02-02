const tool = require('../index')
const autoprefixer = require('autoprefixer')

let plugin = {
  typescript: require('@upend/plugin-typescript'),
  lesscss: require('@upend/plugin-lesscss'),
  postcss: require('@upend/plugin-postcss'),
  babel: require('@upend/plugin-babel')
}

let build
let targets
let options

build = {
  async less({ source, destination, content }) {
    let $lesscss
    let $postcss

    $lesscss = await plugin.lesscss(content)
    $postcss = await plugin.postcss($lesscss, {
      plugins: [autoprefixer],
      options: { from: source, to: destination }
    })

    return $postcss
  },
  async tsx({ source, destination, content }) {
    let $typescript
    let $babel

    let options = {
      typescript: {
        compilerOptions: {
          jsx: 'react',
          target: 'esnext',
          module: 'commonjs',
          lib: ['esnext', 'dom', 'dom.iterable', 'webworker']
        }
      },

      // same as above.
      babel: {
        comments: false,
        sourceType: 'module',
        presets: [
          ['@babel/preset-react', {}],
          [
            '@babel/preset-env',
            {
              targets: {
                node: 'current'
              }
            }
          ]
        ]
      }
    }

    $typescript = await plugin.typescript(content, options.typescript)
    $babel = await plugin.babel($typescript, options.babel)

    return $babel
  }
}

tool({
  options: {
    directory: {
      ignore: 'node_modules',
      watch: true,
      recursive: true
    }
  },
  targets: [
    {
      // these make absolutely no difference at the moment, just what it shows up as in the output.
      name: 'less',
      category: 'stylesheet',

      // capture the filename, the rest will be put in the specified folder, with the specified extension.
      from: /^source\/(.+?)\.less$/,

      // how the destination should be established
      to: filename => `public/style/${filename}.css`,

      // the function/filter to use to compile the content
      build: build.less
    },
    {
      name: 'tsx',
      category: 'script',

      from: /^source\/(.+?)\.tsx$/,
      to: filename => `public/script/${filename}.js`,

      build: build.tsx
    }
  ]
})
