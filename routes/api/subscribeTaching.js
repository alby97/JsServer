const Router = require('express').Router



const subscribeTeaching = (request, response) => {
    console.log(response.locals.decodedToken)
    //var deviceId = response.locals.decodedToken.device_id
    //console.log(deviceId)
    //console.log(request.body['teaching'])
    //console.log(JSON.parse(request.body['teaching']));
    //console.log(JSON.stringify(JSON.parse(request.body['teaching'])));
    var teachString = request.body['teaching'] //JSON.stringify(request.body['teaching'])
    console.log(teachString)
    request.database.query('UPDATE users SET teachings_to_notify = teachings_to_notify || to_jsonb(ARRAY[$1]) WHERE username = $2', [teachString, response.locals.decodedToken.username], (error, result) => {
        if (error) {
            console.log(error);
            response.status(400).json({
                message: "Errore nella richiesta"
            })
        }
        else {
            response.status(200).json({
                message: "Le notifiche per" + request.body['teaching'] + "sono state attivate"
            })
        }
    })


    /*
    var insegnamentoOriginale = "{" + request.body['teaching']   + "}";
    request.database.query("UPDATE users SET teachings_to_notify = teachings_to_notify || $1 WHERE username = $2", [insegnamentoOriginale, response.locals.decodedToken.username], (error, result) => {
        if (error) {
            console.log(error);
            response.status(400).json({
                message: "Errore nella richiesta"
            })
        }
        else {
            response.status(200).json({
                message: "Le notifiche per" + request.body['teaching'] + "sono state attivate"
            })
        }
    })
    */
    

}


module.exports = Router({
    mergeParams: true
}).post('/home/subscribeTeaching', subscribeTeaching)