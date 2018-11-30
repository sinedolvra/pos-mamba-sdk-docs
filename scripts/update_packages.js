const fs = require('fs');
const path = require('path');
const degit = require('degit');
const rimraf =  require('rimraf');
const globby = require('globby');
const rollup = require('rollup');
const svelte = require('svelte');
const quickenv = require('quickenv');
const pluginSvelte = require('rollup-plugin-svelte');
const cjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const virtual = require('rollup-plugin-virtual');
const babel = require('rollup-plugin-babel');
const alias = require('rollup-plugin-alias');
const replace = require('rollup-plugin-replace');
const getPreprocessor = require('svelte-preprocess');
const svelteConfig = require('@mamba/configs/svelte');

const packageRoot = path.join(process.cwd(), 'packages');
const componentsPath = path.join(packageRoot, 'components');


const { fromWorkspace, fromProject } = require('../webpack/helpers/paths.js');
const babelConfig = require('../.babelrc.js');
const PKG = quickenv.getPkg();


// degit to temp folder

function moveDir(path, destination, callback) {
  fs.rename(path, destination, (error) => {
    if(error) {
      console.log("ERROR \n" + error.message);
    }
    else {
      if (typeof callback === 'function') {
        callback();
      }
    }
  });
}

// clone repo using degit

function cloneRepo(callback) {
  const emmiter = degit('stone-payments/pos-mamba-sdk#develop', {
    force: true,
    verbose: true,
  });
  return emmiter.clone('.temp/');
}

// check if dir exists and create if it doesnt
function createDir(dirName) {
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, (error) => {
      if(error) {
        console.log('ERROR \n'+error.message);
      }
    });
  }
}

function removePath(path) {
  console.log(`➖ Removing path: ${path}`);
  rimraf.sync(path);
}

function removePaths(paths) {
  paths.forEach((file, idx) => removePath(path.join(componentsPath, file)));
}

const posixify = file => file.replace(/[/\\]/g, '/');


async function build() {
  let bundle;

  console.log(posixify(fromWorkspace('packages/components/Button/example', 'Example.html')));
  // create a bundle
  try {
    bundle = await rollup.rollup({
      input: posixify(fromWorkspace('packages/components/Button/example', 'Example.html')),

      plugins: [
        alias({
          resolve: ['.html'],
          [`${PKG.name}`]: fromWorkspace(),
        }),
        // virtual({
        //   __entry__: `
        //   import '${posixify('@mamba/pos/simulator/index.js')}';
        //   import App from '${posixify(fromWorkspace('packages/components/Button/example', 'Example.html'))}'
        //     new App({ target: document.getElementById('root') })`,
        // }),
        nodeResolve({
          extensions: ['.js', '.svelte', '.html'],
        }),
        cjs(),
        /* {transform(code, id) {

          if (!/\.html$/.test(id)) return null;
          
          
          const name = 'Button';

          const { js, css, stats } = svelte.compile(code, {
            generate: 'ssr',
            format: 'es',
            name: name,
            filename: name + '.html',
            onwarn: warning => {
              console.warn(warning.message);
              console.log(warning.frame);
            }
          });

          return js;
        }}, */
        pluginSvelte({
          generate: 'ssr',
          emitCss: false,
          preprocess: getPreprocessor({
            transformers: {
              postcss: true,
            },
          }),
        }),
        //pluginSvelte(svelteConfig),
        babel({
          /** Enforce usage of '.babelrc.js' at the project's root directory */
          babelrc: false,
          ...babelConfig,
          externalHelpers: true,
          exclude: /node_modules[/\\](?!(svelte)|(@mamba))/,
        }),
        replace({
          __NODE_ENV__: JSON.stringify(process.env.NODE_ENV),
          __APP_ENV__: JSON.stringify(process.env.APP_ENV),
          __PROD__: process.env.NODE_ENV === 'production',
          __TEST__: process.env.NODE_ENV === 'test',
          __DEV__: process.env.NODE_ENV === 'development',
          __POS__: process.env.APP_ENV === 'POS',
          __SIMULATOR__: process.env.MAMBA_SIMULATOR === true,
          __BROWSER__: process.env.APP_ENV === 'browser',
          __DEBUG_LVL__: 2,
        }),
      ]
    });

    console.log(bundle.imports); // an array of external dependencies
    console.log(bundle.exports); // an array of names exported by the entry point
    console.log(bundle.modules); // an array of module objects
    
  } catch(e) {
    console.log('e: ', e);
  }

  try {
    let uid = 1;
    const importMap = new Map();
    await bundle.write({
      format: 'iife',
      name: 'Button',
      file: 'packages/components/Button/bundle.js',
      globals: id => {
        const name = `import_${uid++}`;
        importMap.set(id, name);
        return name;
      },
    });
  } catch(e) {
    console.log('e: ', e);
  }
}

async function clearTemp() {
  await rimraf('.temp/', () => {
    console.log('Temporary Files Removed !');
  });

  // const paths = globby.sync(['*/*.*', '*/.*', '*/*', '!*/*.html', '!Icon/assets', '!*/example', '!*/README.md', '!*/package.json'], {
  //   cwd: componentsPath,
  //   onlyFiles: false,
  //   expandDirectories: {
  //     files: ['*/static'],
  //     extensions: ['svg', 'png', 'jpg', 'jpeg'],
  //   },
  // });


  const paths = globby.sync(['*'], {
    cwd: componentsPath,
    onlyFiles: false,
    expandDirectories: true
  });
  
  // Remove undesired components
  // paths.push('App');

  console.log('paths: ', paths);

  //build();
  
  //removePaths(paths)
}
build();

// clears packages
// rimraf('./packages', () =>{
//   console.log('Cleaning Packages.');
// 
//   // create dirs
//   createDir('packages/');
//   createDir('packages/pos');
//   createDir('packages/components');
// 
//   // clone repo
//   cloneRepo().then(() => {
// 
//     // move to directory and clear temp files
//     moveDir('./.temp/packages/components', './packages/components',
//       moveDir('./.temp/packages/pos', './packages/pos',
//         moveDir('./.temp/packages/store','./packages/store',
//           clearTemp())));
//   });
// })
