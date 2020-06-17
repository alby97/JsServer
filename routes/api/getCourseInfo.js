const Router = require('express').Router

const getCourseInfo = (request, response) => {
    var courseStudy = response.locals.decodedToken.course_study
    var courseType = response.locals.decodedToken.course_type
    response.status(200).json({
        'course_study' : courseStudy,
        'course_type' : courseType
    })
}

module.exports = Router().get('/home/getLessonsChanges/getCourseInfo', getCourseInfo);