const mavlink = require('mavlink');
const mav = new mavlink(1,1,"v1.0",["common", "ardupilotmega"]);

const serverLink = require('./modules/server_link');

const SerialPort = require('serialport');

let port = null;

function connectSerial() {
  port = new SerialPort('/dev/ttyACM0', {
    baudRate: 115200
  });

  port.on('error', function(err) {
    console.log('Error: ', err.message);
    setTimeout(connectSerial, 5000);
  });

  port.on('open', function() {
    console.log('Flight controller connection established.');
  });
}

connectSerial();

mav.on("ready", function() {
  port.on('data', function(data) {
    mav.parse(data);
  });
  
  mav.on('VFR_HUD', function(message, fields) {
    serverLink.send({
      type: 'VFR_HUD',
      fields: fields
    });
    //console.log(fields);
  });
});