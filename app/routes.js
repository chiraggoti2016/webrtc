module.exports = function(app, streams, list) {

  // GET home 
  var index = function(req, res) {
    res.render('index', { 
                          title: 'Project RTC', 
                          header: 'WebRTC live streaming',
                          username: 'Username',
                          share: 'Share this link',
                          footer: 'pierre@chabardes.net',
                          id: req.params.id
                        });
  };

  // GET streams as JSON
  var displayStreams = function(req, res) {
    var streamList = streams.getStreams();
    // JSON exploit to clone streamList.public
    var data = (JSON.parse(JSON.stringify(streamList))); 

    res.status(200).json(data);
  };

  app.get('/streams.json', displayStreams);

  // GET list as JSON
  var displayLists = function(req, res) {
    var cList = list.getClients();
    // JSON exploit to clone streamList.public
    var data = (JSON.parse(JSON.stringify(cList))); 

    res.status(200).json(data);
  };
  app.get('/list.json', displayLists);
  app.get('/', index);
  app.get('/:id', index);
}