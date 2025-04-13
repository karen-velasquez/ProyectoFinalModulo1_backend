var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var authRoutes = require('./routes/authRoutes');
var taskRoutes = require('./routes/taskRoutes'); // 


const cors = require('cors');

var app = express();

// Habilitar CORS para todas las rutas y orígenes
app.use(cors());

// Si deseas permitir solo tu frontend:
app.use(cors({
  origin: 'http://localhost:3001', // reemplaza con tu URL frontend si está en producción
  credentials: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', authRoutes);
app.use('/api', taskRoutes);


module.exports = app;
