const jwt = require('jsonwebtoken')
const Router = require('express').Router


const completeProfile = (request, response) => {
    const {
        dipartimento,
        corso,
        anno,
        tipo,
        nome,
        cognome,
        indirizzo,
        interessi
    } = request.body
    console.log(response.locals.decodedToken)
    console.log(indirizzo);
    console.log(interessi);
    var jsonInteressi = (JSON.parse(interessi))
    console.log(jsonInteressi)
    var arrInterests = jsonInteressi["interests"]
    console.log(arrInterests);
    var interests= "{";
    if(arrInterests.length > 0) {
        for(var i = 0; i < arrInterests.length; i++) {
            if(i == arrInterests.length-1){
                interests += arrInterests[i] + "}"
            }
            else {
                interests += arrInterests[i] + ","
            }
        }
    }
    else {
        interests += "}"
    }
    console.log(interests);
    request.database.query('UPDATE users SET course_study = $1, department = $2, academic_year = $3, course_type = $4, name = $5, surname = $6, course_address = $8, interests = interests || $9 WHERE username = $7 RETURNING *', [corso, dipartimento, anno, tipo, nome, cognome, response.locals.decodedToken.username, indirizzo, interests], (error, result) => {
        console.error(error);
        if (error) {
            response.status(400).json({
                message: 'C\'è stato un errore.'
            })
        } else {
            //! Aggiungendo RETURNING * alla fine della prima query posso evitare quest'altra query prendendo i valori che mi servono da "result"
            request.database.query('SELECT * FROM users WHERE username = $1', [response.locals.decodedToken.username], (err2, result2) => {
                response.status(201).json({
                    token: jwt.sign({
                        username: result2.rows[0].username,
                        email: result2.rows[0].email,
                        //  rating: results[0].rating,
                        //profile_image_path: results[0].profile_image_path,
                        course_study: result2.rows[0].course_study,
                        academic_year: result2.rows[0].academic_year,
                        department: result2.rows[0].department,
                        course_type: result2.rows[0].course_type,
                        course_address: result2.rows[0].course_address,
                        name: result2.rows[0].name,
                        surname: result2.rows[0].surname
                    }, request.privateKey, {
                        algorithm: 'RS256'
                    })
                })
            })

        }
    })
}


module.exports = Router({mergeParams : true}).post('/home/completeProfile', completeProfile)
    

