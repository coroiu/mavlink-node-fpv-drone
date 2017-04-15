const net = require('net');

class ServerLink {
  constructor() {
    this.connected = false;
    this._connect();
  }

  _connect() {
    this.socket = new net.Socket();
    this.socket.connect(7800, '127.0.0.1', () => {
      //this.socket.write('Hello, server! Love, Client.');
      this.connected = true;
      console.log('Server connection established.');
    });

    this.socket.on('data', (data) => {
      console.log('Received: ' + data);
    });

    this.socket.on('close', () => {
      console.log('Server connection closed');
      this.connected = false;
      setTimeout(this._connect.bind(this), 1000);
    });

    this.socket.on('error', (err) => {
      console.log('Server connection error occurred.');
    })
  }

  send(data) {
    if (this.connected) {
      this.socket.write(JSON.stringify(data) + '\n');
    }
  }
}

module.exports = new ServerLink();