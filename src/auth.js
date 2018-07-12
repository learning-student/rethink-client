class Auth {


    constructor(client) {
        this.client = client
    }

    login(user) {
        return this.client.socket.sender(user, 'login').then(result => {
            var token = result.token;

            this.client.token(token);

            return this.client;
        })
    }
}

export default Auth