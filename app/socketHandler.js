module.exports = function(io, streams, list) {

  io.on('connection', function(client) {
    console.log('-- ' + client.id + ' joined --');
    client.emit('id', client.id);

    list.addClient(client.id);

    client.on('message', function (details) {
      var otherClient = io.sockets.connected[details.to];

      if (!otherClient) {
        return;
      }
        delete details.to;
        details.from = client.id;
        otherClient.emit('message', details);
    });
      
    client.on('readyToStream', function(options) {
      console.log('-- ' + client.id + ' is ready to stream --');
      
      streams.addStream(client.id, options.name); 
      list.setActive(client.id);
      citem=list.getFirstReadyClient();
      console.log('citem');
      console.log(citem);
      if(citem != undefined) {
        list.setActive(citem.id, client.id);
        list.setActive(client.id, citem.id);
      } else {
        list.setReady(client.id);
      }
      var otherClient = io.sockets.connected[client.id];
      if (otherClient) {
        otherClient.emit('ready', citem);
      }

      // client.emit('ready', citem);

    });
    
    client.on('update', function(options) {
      streams.update(client.id, options.name);
    });

    function leave() {
      console.log('-- ' + client.id + ' left end --');
      streams.removeStream(client.id);

      rItem = list.getClient(client.id);
    
      newItem = null;
      if(rItem && rItem.status == list.status.ACTIVE) {        
        // newItem=list.getFirstReadyClient();
        // console.log(newItem);
        // if(newItem != undefined) {
        //   list.setActive(rItem.ref, newItem.id);
        //   list.setActive(newItem.id, rItem.ref);
        // } else {
        //   list.setReady(rItem.ref);
        // }
        
        list.setInit(rItem.ref);

        if(rItem.ref != null) {
          var otherClient = io.sockets.connected[rItem.ref];
          if(otherClient) {
            otherClient.emit('ready', newItem);
          }
        }
      }

      list.removeClient(client.id);
      // list.setInit(client.id);
    }

    client.on('end', leave);
    client.on('disconnect', ()=>{
    
      console.log('-- disconnect --');
      leave();
    list.removeClient(client.id);
    });
    client.on('leave', ()=>{
      leave();
      console.log('-- leave --');
    });
  });
};