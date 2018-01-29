const tool = require('./index')
const autoprefixer = require('autoprefixer')

let plugin = {
    // uh how do i make it so if this is installed as a package, the user can access these?
    typescript: require('./plugin/typescript'),
    lesscss: require('./plugin/lesscss'),
    postcss: require('./plugin/postcss'),
    babel: require('./plugin/babel')
}

let build
let targets
let options

build = {
    async less ({ source, destination, content }) {
        let $lesscss
        let $postcss
        
        
        // more of this should probably be done in the plugin itself tbh
        $lesscss = (await plugin.lesscss(content)).css
        $postcss = (await plugin.postcss($lesscss, [ autoprefixer ], {from: source, to: destination})).css
    
        return $postcss
    },
    async tsx ({ source, destination, content }) {
        let $typescript
        let $babel
    
        // is the syntax highlighting only messed up for me, or...?
        $typescript = (await plugin.typescript(content, options.typescript)).outputText
        $babel = (await plugin.babel($typescript, options.babel)).code
    
        return $babel
    }
}

targets = [
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
        // everything is required right now.
        name: 'tsx',
        category: 'script',

        from: /^source\/(.+?)\.tsx$/,
        to: filename => `public/script/${filename}.js`,

        build: build.tsx
    }
]

options = {
    // see uility/directory for this, as that's what it's being passed to.
    directory: {
        ignore: 'node_modules',
        watch: true,
        recursive: true,
    },

    // being passed when appropriate to fs#()
    fs: {
        encoding: 'utf8'
    },

    // this isn't even being used by the build tool, just in the build.tsx function above.
    typescript: {
        compilerOptions: {
            jsx: "react",
            target: "esnext",
            module: "commonjs",
            lib: [
                "esnext",
                "dom",
                "dom.iterable",
                "webworker"
            ]
        },
    },

    // same as above.
    babel: {
        comments: false,
        sourceType: 'module',
        presets: [
            ["@babel/preset-react", {}],
            ["@babel/preset-env", {
                targets: {
                    node: 'current'
                }
            }],
        ]
    }
}

// call the build tool when ready.
tool({options, targets})