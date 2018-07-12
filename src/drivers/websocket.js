var WebSocket = require('rpc-websockets').Client


class WebsocketDriver{
    constructor(host = 'localhost', port = 8082, options = {}) {
        this.ws = new WebSocket('ws://' + host + ':' + port, options)
    }

    open(callback){
        this.ws.on('open', callback)
    }

    sender(data, command = 'run_command'){
        return this.ws.call(command, data)
    }
}

module.exports = WebsocketDriver