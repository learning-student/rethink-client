import Client from './client'


var handler = {
    get: function (target, name) {
        if(target[name]) {
            return target[name]
        }

        var origMethod = target.callOtherMethods;


        return function (...args) {
            let result = origMethod.apply(this, args);
            console.log(name + JSON.stringify(args)
                + ' -> ' + JSON.stringify(result));
            return result;
        };
    }
}
export default new Proxy(Client, handler)

