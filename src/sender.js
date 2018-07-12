class Sender {

    constructor(sender){
        this.sender = sender
    }



    run(client){
        if (!this.sender) {
          throw "Please put a sender"
        }

        return this.sender(this.buildCommand(client))
    }
}
module.exports = Sender