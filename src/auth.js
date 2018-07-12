class Auth {


    constructor(ws) {
        this.socket = ws
    }

    login(user) {
        return this.socket.sender(user, 'login')
    }
}

module.exports = Auth