const db = require('./courseOfStudyDB');
const Validate = require('../../validator')

class CourseOfStudy {

    async getAllCoursesOfStudy(req, res) {
        try {
            const retVal = await db.getAllCoursesOfStudy();
            if (retVal == null) {
                res.status(400).json({ Error: "DB Response Was Null" });
            }
            res.status(200).send(retVal);
        } catch (error) {
            res.status(400).json({ Error: error });
            console.log(error);
        }
    }

    async getCoursesOfStudy(req, res) {
        try {
            if(!Validate.courseOfStudyQuery(req.body)) return res.status(400).json({ Error: Validate.error[0] })
            const { DepartmentId, Status, Name } = req.body;
            const retVal = await db.getCoursesOfStudy(DepartmentId, Status, Name);
            if (retVal == null) {
                res.status(400).json({ Error: db.getError() == null ? "DB Response Was Null" : db.getError() });
            }
            res.status(200).send(retVal);
        } catch (error) {
            res.status(400).json({ Error: error });
            console.log(error);
        }
    }

    async getCourseOfStudy(req, res) {
        try {
            const courseOfStudy = await db.getCourseOfStudy(req.params.id)
            res.json(courseOfStudy)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    async createCourseOfStudy(req, res) {
        try {
            if (!Validate.courseOfStudy(req.body)) return res.status(400).json({ message: Validate.error.length > 0 ? Validate.error[0] : "Invalid request body" })

            const retval = await db.addCourseOfStudy(req.body)
            if (retval === null) {
                return res.status(400).json({ message: db.getError() || "DB Response Was Null" })
            }
            res.status(201).json({ message: "Course Of Study Created Successfully", body: retval})
        }
        catch (error) {
            res.status(500).json({ message: error.message })
        }

    }

    async updateCourseOfStudy(req, res) {
        try {
            if (!Validate.courseOfStudy(req.body)) return res.status(400).json({ message: Validate.error.length > 0 ? Validate.error[0] : "Invalid request body" })
            const updatedCourseOfStudy = await db.editCourseOfStudy(req.body)
            res.json({ message: "Course Of Study Updated Successfully", body: updatedCourseOfStudy})
        }
        catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    async deleteCourseOfStudy(req, res) {
        try {
            const deletedCourseOfStudy = await db.removeCourseOfStudy(req.params.id)
            res.json(deletedCourseOfStudy)
        }
        catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

}


module.exports = new CourseOfStudy()