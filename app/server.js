import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import sapper from 'sapper';
import serve from 'serve-static';
import compression from 'compression';
import { Store } from 'svelte/store.js';
import { manifest } from './manifest/server.js';
import http from 'http';
import fs from 'fs';

dotenv.config();

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

const httpServer = http.createServer(app);
httpServer.listen(process.env.PORT);
