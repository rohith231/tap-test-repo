const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors');
const helmet = require('helmet');
const compression = require("compression");
const {RateLimiterMemory} = require('rate-limiter-flexible');

const rateLimiter = new RateLimiterMemory({
  points: 10, // 100 requests
  duration: 1, // per 1 second by IP
});

const rateLimiterMiddleware = (req, res, next) => {
  rateLimiter.consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).send('Too Many Requests');
    });
};

module.exports = function (app) {
  //parsers
  app.use(compression());
  app.use(cors());
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb',extended: false}));
  app.use(cookieParser());
  app.use(rateLimiterMiddleware);
  app.use(helmet());
  app.use((req, res, next) => {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log(fullUrl);
    next()
  });

}
