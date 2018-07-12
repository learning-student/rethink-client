class Subscribe {

    constructor( id, addCallback, ws, response) {
        this.id = id
        this.addCallback = addCallback
        this.ws = ws
        this.response = response

    }

    subscribe(callback) {
        this.addCallback(this.id, callback, 'then')
        this.ws.subscribe('subscribe')

        return this.response
    }

}

export default Subscribe