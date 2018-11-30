global.window = self;

const svelteCache = new Map();

const commonCompilerOptions = Object.freeze({
  cascade: false,
  store: true,
  skipIntroByDefault: true,
  nestedTransitions: true,
  dev: true,
});

function loadSvelte(version) {
  if (!svelteCache.has(version)) {
    if (version === 'local') {
      svelteCache.set(version, import(/* webpackChunkName: "svelte" */ 'svelte'));
    } else {
      svelteCache.set(version, new Promise((fulfil => {
        importScripts(`https://unpkg.com/svelte@${version}/compiler/svelte.js`);
        fulfil(global.svelte);
      })));
    }
  }

  return svelteCache.get(version).then(svelte => {
    global.svelte = svelte;
  });
}

export async function init(version) {
  await Promise.all([
    import(/* webpackChunkName: "rollup" */ 'rollup/dist/rollup.browser.js').then(r => {
      global.rollup = r;
    }),
    loadSvelte(version)
  ]);

  return version === 'local' ? version : svelte.VERSION;
}

let cached = {
  dom: null,
  ssr: null
};

let currentToken;

async function getBundle(mode, cache, lookup) {
  let bundle;
  let error;
  let warningCount = 0;

  const info = {};

  try {
    bundle = await rollup.rollup({
      input: 'Example.html',
      external: id => {
        return id[0] !== '.';
      },
      plugins: [{
        resolveId(importee, importer) {
          console.log('importee: ', importee);
          if (importee in lookup) return importee;
        },
        load(id) {
          console.log('load id: ', id);
          if (id in lookup) return lookup[id].fileContents;
        },
        transform(code, id) {
          if (!/\.html$/.test(id)) return null;

          const name = id.replace(/^\.\//, '').replace(/\.html$/, '');

          const { js, css, stats } = svelte.compile(code, Object.assign({
            generate: mode,
            format: 'es',
            name: name,
            filename: name + '.html',
            onwarn: warning => {
              console.warn(warning.message);
              console.log(warning.frame);
              warningCount += 1;
            },
          }, commonCompilerOptions));

          if (stats) {
            if (Object.keys(stats.hooks).filter(hook => stats.hooks[hook]).length > 0) info.usesHooks = true;
          } else if (/[^_]oncreate/.test(code)) {
            info.usesHooks = true;
          }

          return js;
        }
      }],
      cache
    });
  } catch (error) {
    return { error, bundle: null, info: null, warningCount: null }
  }

  return { bundle, info, error: null, warningCount };
}


export async function bundle(example) {
  console.clear();
  console.info(`running Svelte compiler version %c${svelte.VERSION}`, 'font-weight: bold');
  
  const token = currentToken = {};

  const lookup = {};
  example.forEach(info => {
    lookup[info.fileName] = info;
  });

  let dom;
  let error;

  try {
    dom = await getBundle('dom', cached.dom, lookup);
    if (dom.error) {
      throw dom.error;
    }

    if (token !== currentToken) return;

    cached.dom = dom.bundle;

    let uid = 1;
    const importMap = new Map();

    const domResult = await dom.bundle.generate({
      format: 'iife',
      name: 'SvelteComponent',
      globals: id => {
        const name = `import_${uid++}`;
        importMap.set(id, name);
        return name;
      },
      sourcemap: true
    });

    if (token !== currentToken) return;

    const ssr = dom.info.usesHooks
      ? await getBundle('ssr', cached.ssr, lookup)
      : null;

    if (ssr) {
      cached.ssr = ssr.bundle;
      if (ssr.error) {
        throw ssr.error;
      }
    }

    if (token !== currentToken) return;
    
    const ssrResult = ssr
      ? await ssr.bundle.generate({
        format: 'iife',
        name: 'SvelteComponent',
        globals: id => importMap.get(id),
        sourcemap: true
      })
      : null;

    return {
      bundle: {
        imports: dom.bundle.imports,
        importMap
      },
      dom: domResult,
      ssr: ssrResult,
      warningCount: dom.warningCount,
      error: null
    };
  } catch (err) {
    const e = error || err;
    delete e.toString;

    return {
      bundle: null,
      dom: null,
      ssr: null,
      warningCount: dom.warningCount,
      error: Object.assign({}, e, {
        message: e.message,
        stack: e.stack
      })
    };
  }
}
