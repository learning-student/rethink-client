var WebSocket = require('rpc-websockets').Client


class WebsocketDriver{
    constructor(host = 'localhost', port = 8082, options = {}) {
        this.ws = new WebSocket('ws://' + host + ':' + port, options)
    }

    open(callback){
        this.ws.on('open', callback)
    }

    sender(data){
        return this.ws.call('run_command', data)
    }
}

module.exports = WebsocketDriver