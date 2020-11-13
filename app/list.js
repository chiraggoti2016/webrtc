module.exports = function() {
  /**
   * available items 
   * the id value is considered unique (provided by socket.io)
   */
  var cList = [];

  const status = {
      INIT: 'init',
      READY: 'ready',
      ACTIVE: 'active',
  } 

  /**
   * Client object
   */
  var Client = function(id) {
    this.id = id;
    this.status = status.INIT;
    this.ref = null;
  }

  return {
    status,

    addClient : function(id) {
      var item = new Client(id);
      cList.push(item);
    },

    removeClient : function(id) {
      var index = 0;
      while(index < cList.length && cList[index].id != id){
        index++;
      }
      cList.splice(index, 1);
    },

    // update function
    update : function(id, ref, status) {
      var item = cList.find(function(element, i, array) {
        return element.id == id;
      });
      if(item != undefined) {
        item.status = status;
        item.ref = ref;
      }
    },

    // update function
    setActive : function(id, ref = null) {
      this.update(id, ref, status.ACTIVE);
    },

    setReady : function(id) {
      this.update(id, null, status.READY);
    },

    setInit : function(id) {
      this.update(id, null, status.INIT);
    },

    getClients : function() {
      return cList;
    },

    getClient : function(id) {
      var item = cList.find(function(element, i, array) {
        return element.id == id;
      });
      return item;
    },

    getFirstReadyClient : function() {
      var item = cList.find(function(element, i, array) {
        return element.status == status.READY && element.ref == null;
      });
      return item;
    }
  }
};
