const Router = require('express').Router


const getYears = (request, response) => {
    var {nomeCorso, tipoCorso} = request.body;
    console.log(nomeCorso + " " + tipoCorso);
    request.database.query('SELECT teachings FROM courses WHERE course_name = $1 AND course_type = $2', [nomeCorso, tipoCorso], (error, result) => {
        if(error) {
            console.error(error);
            response.status(500).send("Errore")
        }
        else {
            console.log("-----------------------");
            //console.log(result.rows[0]);
            var teachs = result.rows[0]["teachings"];
            console.log("Teachs!!");
          //  console.log(teachs)
            var yearMin = null;
            var yearMax = null;
            for(var i in teachs){
                console.log("Teach" + i);
                console.log(teachs[i])
                var teach = teachs[i]
                if(yearMin == null) {
                    yearMin = teach["A.A. OFF.F"]
                }
                if(yearMax == null) {
                    yearMax = teach["A.A. OFF.F"]
                }
                else {
                    if(teach["A.A. OFF.F"] > yearMax) {
                        yearMax =  teach["A.A. OFF.F"];
                    }
                }
            }
            response.status(201).json({
                "yearMin" : yearMin,
                "yearMax" : yearMax
            })
        }
    })
}

module.exports = Router().post("/getYears", getYears)