import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression'; //压缩文件
import path from 'path';
import servicesLoader from './services'; //graphql service provider
import db from './database';

const utils = { db };
const services = servicesLoader(utils);

const root = path.join(__dirname, '../../');

const app = express();

if (process.env.NODE_ENV === 'production') {
  app.use(helmet()); // prevent XSS
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', '*.amazoneaws.com'],
      },
    })
  );
  app.use(compression());
  app.use(cors());
}

app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
app.use('/', express.static(path.join(root, 'dist/client')));
app.use('/uploads', express.static(path.join(root, 'uploads')));

const serviceNames = Object.keys(services);

serviceNames.forEach((name) => {
  if (name === 'graphql') {
    services[name].applyMiddleware({ app });
  } else {
    app.use(`/${name}`, services[name]);
  }
}); //根据不同的services name 提供不同服务

app.get('/', (req, res) => {
  res.sendFile(path.join(root, 'dist/client/index.html'));
});
app.listen(process.env.Port || 8000, () =>
  console.log(`Listening on port ${process.env.Port || '8000'}`)
);
