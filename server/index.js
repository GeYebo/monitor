
var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
app.httpServer = server;

// Configuration

app.configure(function(){
    app.set('port', process.env.PORT || 8888);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', {
        layout: false
    });
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.session({ secret: 'cranberry juice' }));
    app.use(express.static(__dirname + '/app'));
    // passport must be instantiated before app.router
    app.use(app.router);
    
});

// set up amqp listener
var amqp = require('amqp');
var argv = require('optimist')
    .default({ 'host': 'localhost' })
    .argv

var connection = amqp.createConnection({ host: argv.host });
connection.on('ready', function() {
    console.log('connected to server: ' + argv.host)
});

// Socket.io Communication
// Hook Socket.io into Express
// var server =  http.createServer(app).listen(app.get('port'), function(){
//     console.log("Express server listening on port " + app.get('port'));
// });


var io = require('socket.io').listen(server);
io.set('log level', 2);

io.of('/watch').on('connection', function(socket) {
    socket.on('sub', function(spec) {
        connection.queue('', function(queue) {
            console.log('binding to ' + spec.exchange + ' ' + spec.key)
            queue.bind(spec.exchange, spec.key)
            queue.subscribe(function(message, headers, deliveryInfo) {
                socket.emit('data', {
                    key: deliveryInfo.routingKey,
                    payload: JSON.parse(message.data.toString('utf8'))
                })
            })
        })
    })
})


// var server =  http.createServer(app).listen(app.get('port'), function(){
//     console.log("Express server listening on port " + app.get('port'));
// });


require('./allRoutes')(app);
/* Required Route Files */
module.exports = app;
