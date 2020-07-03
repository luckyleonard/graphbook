import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import path from 'path';

const root = path.join(__dirname, '../../');

const app = express();

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
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
app.use(compression());
app.use(cors());

app.use('/', express.static(path.join(root, 'dist/client')));
app.use('/uploads', express.static(path.join(root, 'uploads')));
app.get('/', (req, res) => {
  res.sendFile(path.join(root, 'dist/client/index.html'));
});
app.listen(process.env.Port || 8000, () =>
  console.log(`Listening on port ${process.env.Port || '8000'}`)
);
