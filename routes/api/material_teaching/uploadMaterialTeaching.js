/* eslint-disable no-unused-vars */
const Router = require('express').Router


const uploadMaterialTeachings = (request, response) => {
    //console.log(request.body)
    var material_teaching_file = JSON.parse(request.body["material_teaching_file"])
    var file = material_teaching_file["data"]
    var fileToUpload = new Buffer.from(file)
    var file_name = material_teaching_file["file_name"]
    var department = material_teaching_file["department"]
    var course_of_study = material_teaching_file["course_of_study"]
    var params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Body: fileToUpload,
        Key: "material_teaching/" + department + "/" + course_of_study + "/" + file_name
    }
    request.s3.upload(params, (error, data) => {
        if (error) {
            //console.log(error)
            response.status(500).send()
        } else {
            //!query
            var url = data.Location
            var description = material_teaching_file['description']
            var professor = material_teaching_file['professor']
            var academic_year = material_teaching_file['academic_year']
            var teaching = material_teaching_file['teaching']
            var timestamp = material_teaching_file['timestamp']
            var author = material_teaching_file['author']
            var author_name = material_teaching_file["author_name"]
            var author_surname = material_teaching_file["author_surname"]
            request.database.query('INSERT INTO material_teaching (file_name, description, course_of_study, department, url, professor, academic_year, teaching, timestamp, author, author_name, author_surname) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)', [file_name, description, course_of_study, department, url, professor, academic_year, teaching, timestamp, author, author_name, author_surname], (errorQuery, result) => {
                if (errorQuery) {
                    var paramsDelete = {
                        Bucket: process.env.S3_BUCKET_NAME,
                        Key: url
                    }
                    request.s3.deleteObject(params, (errorDelete, dataDelete) => {
                        if (errorDelete) {
                            console.log(errorDelete)
                            response.status(500).send() //da aggiustare, gestire meglio se non si riesce ad eliminare il file
                        } else {
                            response.status(500).send()
                        }
                    })

                } else {
                    response.status(201).send("Il file è stato caricato con successo")
                }
            })

        }
    });
}


module.exports = Router().post("/home/materialTeaching/departments/:department/courses/:course/uploadFiles", uploadMaterialTeachings)