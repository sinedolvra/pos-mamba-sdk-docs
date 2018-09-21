import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import sapper from 'sapper';
import serve from 'serve-static';
import compression from 'compression';
import { Store } from 'svelte/store.js';
import { manifest } from './manifest/server.js';
import https from 'https';
import fs from 'fs';

dotenv.config();

const https_options = {
  key: fs.readFileSync('/home/deployusr/cert/_.stone.com.br.key'),
  cert: fs.readFileSync('/home/deployusr/cert/_.stone.com.br.crt'),
  ca: [
        fs.readFileSync('/home/deployusr/cert/gd_bundle-g2-g1.crt'),
        fs.readFileSync('/home/deployusr/cert/be94a68b8af575bd.crt')
      ]
}

const app = express();
app
  .use(
    compression({ threshold: 0 }),
    serve('public'),
    sapper({
      manifest,
      store: req => {
        return new Store({
          guide_contents: [],
        })
      },
    }),
  )

const httpsServer = https.createServer(https_options, app);
httpsServer.listen(process.env.PORT);
