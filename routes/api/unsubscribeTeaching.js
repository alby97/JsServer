const Router = require('express').Router



const unsubscribeTeaching = (request, response) => {
    //var deviceId = response.locals.decodedToken.device_id
    //TODO: Finire il metodo, bisogna rimuovere anche dalla lista di teaches_to_notify
    var teachString = request.body['teaching']
    console.log(teachString)
    request.database.query('UPDATE users SET teachings_to_notify = array_remove(teachings_to_notify, to_jsonb(ARRAY[$1])) WHERE username = $2', [teachString, response.locals.decodedToken.username], (error, result) => {
        if (error) {
            console.log(error);
            response.status(400).json({
                message: "Errore nella richiesta"
            })
        }
        else {
            response.status(200).json({
                message: "Le notifiche per" + request.body['teaching'] + "sono state disattivate"
            })
        }
    })
    /*
    var insegnamentoOriginale =  "{" + request.body['teaching'] + "}";
    request.database.query("UPDATE users SET teachings_to_notify = array_remove(teachings_to_notify, $1::character varying) WHERE username = $2", [insegnamentoOriginale, response.locals.decodedToken.username], (error, result) => {
        if (error) {
            console.log(error);
            response.status(400).json({
                message: "Errore nella richiesta"
            })
        }
        else {
            response.status(200).json({
                message: "Le notifiche per" + request.body['teaching'] + "sono state disattivate"
            })
        }
    })
    */
}

module.exports = Router({
    mergeParams: true
}).post('/home/unsubScribeTeaching', unsubscribeTeaching)