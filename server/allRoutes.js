
module.exports = function(app){

  app.get('/api/alls', function(req, res) {
    res.send('You hit an ExpressJS route!');
  });

  app.get('/api/all/:id', function(req, res) {
    res.send('You hit an ExpressJS route with ' + req.params.id);
  });

  app.post('/api/alls', function(req, res) {
    
  });

  app.put('/api/all/:id', function(req, res) {

  });

  app.delete('/api/all/:id', function(req, res) {

  });

};
