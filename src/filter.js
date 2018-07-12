class Filter {

    constructor(){
        this.commands = []
    }

    /**
     *
     * @param column
     * @returns {Filter}
     */
    eq(column){
        this.commands.push(['eq', [column]])
        return this
    }

    /**
     *
     * @param row
     * @returns {Filter}
     */
    row(row){
        this.commands.push(['row', [row]])
        return this

    }

    /**
     *
     * @returns {Filter}
     */
    count(){
        this.commands.push(['count', []])
        return this

    }

    /**
     *
     * @param number
     * @returns {Filter}
     */
    gt(number){
        this.commands.push(['gt', number])
        return this

    }

    /**
     *
     * @returns {Array}
     */
    getCommands(){
        return this.commands
    }
}

module.exports = Filter