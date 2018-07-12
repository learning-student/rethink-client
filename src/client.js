import Driver from './drivers/websocket'
import Filter from './filter'
import Subscribe from './subscribe'
import Auth from './auth'
class Client {

    constructor(host = 'localhost', port = 8082, callback, options = {}) {
        this.endpoint = '';
        this.commands = []
        this.callbacks = {}
        this.uniq = this.generateId()

        this.authDatas = options.auth || {
            authType: 'unauthenticated'
        }

        this.socket = new Driver(host, port, options.driver || {})
        var self = this;

        this.socket.open(() => {
            console.log('connection opened')


            self.socket.ws.on('subscribe', function (result) {
                var row = result.row
                var err = result.err
                var id = result.id

                var callback = self.callbacks[id];


                if (callback) {
                    if (err && callback['catch']) {
                        callback['catch'](err)
                    } else if (row && callback['then']) {
                        callback['then'](row)
                    }
                }

            })


            callback(this)
        })


    }

    token(token) {
        this.setAuth({authType: 'token', token: token})

        return this
    }


    unauthenticated() {
        this.setAuth({authType: 'unauthenticated'})
    }


    setAuth(auth) {
        this.authDatas = Object.assign({}, this.authDatas, auth)

        return this
    }

    generateId() {
        return Math.random().toString(25).substr(4, 15)
    }

    /**
     *
     * @param string database database name
     * @returns {Client}
     */
    database(database = 'test') {
        this.commands.push(['database', [database]])
        this.endpoint = 'database'
        return this
    }

    /**
     *
     * @param string table table name
     * @returns {Client}
     */
    table(table = 'test') {
        this.commands.push(['table', [table]])
        this.endpoint = 'table'
        return this
    }

    buildCommand() {
        var command = {
            endpoint: this.endpoint,
            commands: this.commands,
            auth: this.authDatas
        }


        command.id = this.uniq

        return command
    }


    /**
     *
     * @param data
     * @returns {Promise}
     */
    insert(data) {
        this.commands.push(['insert', [data]])
        this.endpoint = 'insert'
        return this.run()
    }

    /**
     *
     * @param data
     * @returns {Promise}
     */
    update(data) {
        this.commands.push(['update', [data]])
        this.endpoint = 'update'
        return this.run()
    }

    /**
     *
     * @returns {Promise}
     */
    delete() {
        this.commands.push(['delete', []])
        this.endpoint = 'delete'
        return this.run()
    }

    changes() {
        this.commands.push(['changes', []])
        this.endpoint = 'changes'
        return this
    }

    /**
     *
     * @param filter
     * @returns {Client}
     */
    filter(filter) {
        this.commands.push(['filter', filter.getCommands()])
        return this
    }

    /**
     *
     * @param row
     * @returns {*}
     */
    row(row) {
        const filter = new Filter();

        return filter.row(row)
    }

    /**
     *
     * @returns {Promise}
     */
    findAll() {
        this.endpoint = 'findAll'
        return this.run()
    }


    addCallback(id, callback, type = 'then') {
        if (this.callbacks[id] === undefined) {
            this.callbacks[id] = {}
        }


        this.callbacks[id][type] = callback

    }

    /**
     *
     * @returns {Auth}
     */
    auth() {
        return new Auth(this)
    }

    /**
     *
     * @returns {Promise}
     */
    run() {
        var command = this.buildCommand()
        var response = this.socket.sender(command)

        this.commands = []

        if (this.endpoint === 'changes') {
            return new Subscribe(command.id, this.addCallback.bind(this), this.socket.ws, response)
        } else {
            return response
        }

    }

}

export default Client