const pool = require('../../dbconfig');
let errMsg = "";


const getAllLecturers = async () => {
  try {
    const result = await pool.query('SELECT * FROM "AcadSchema"."Lecturer" ORDER BY "StaffId" ASC')
    return result.rows;
  } catch (error) {
    console.log(error);
    errMsg = error;
    return null;
  }
}

const getLecturers = async (deptId, status, name) => {
  try {
    let query = 'SELECT * FROM "AcadSchema"."Lecturer" WHERE 1 = 1';
    let values = [];
    let index = 1;
    if (name && name.length > 0) {
      query += ` AND ("FirstName" LIKE $${index} OR "Surname" LIKE $${index})`;
      index++;
      values.push(`%${name}%`);
    }
    if (deptId && deptId > 0) {
      query += ` AND "DepartmentId" = $${index}`;
      index++
      values.push(deptId);
    }
    if (status > -1) {
      query += ` AND "Status" = $${index}`;
      values.push(status);
    }
    query += ' ORDER BY "StaffId" ASC ';
    const result = await pool.query(query, values);
    if (result.rows.length > 0) {
      return result.rows;
    }
    return [];
  } catch (error) {
    console.log(error);
    errMsg = error;
    return null;
  }
}

const getLecturer = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM "AcadSchema"."Lecturer" WHERE "LecturerId" = $1', [id])
    if (result.rows.length > 0) {
      return result.rows[0]
    } else {
      return [];
    }
  } catch (error) {
    errMsg = error;
    return null;
  }
}

const addLecturer = async (lecturer) => {
  try {
    const values = [lecturer.FirstName, lecturer.Surname, lecturer.OtherNames, lecturer.StaffId, lecturer.DepartmentId, lecturer.Status];

    const result = await pool.query('INSERT INTO "AcadSchema"."Lecturer" ("FirstName", "Surname", "OtherNames", "StaffId", "DepartmentId", "Status") VALUES ($1, $2, $3, $4, $5, $6) RETURNING "LecturerId"', values);
    if (result.rows.length > 0) {
      return result.rows[0];
    }
  } catch (error) {
    if (error.code === '23505') {
      errMsg = 'Staff Id already exists'
    } else if (error.code === '23503') {
      errMsg = 'Department does not exist'
    } else {
      errMsg = error;
    }
    return null;
  }
}

const editLecturer = async (lecturer) => {
  console.log(lecturer)
  try {
    const values = [lecturer.FirstName, lecturer.Surname, lecturer.OtherNames, lecturer.StaffId, lecturer.DepartmentId, lecturer.Status, lecturer.LecturerId];

    const result = await pool.query('UPDATE "AcadSchema"."Lecturer" SET "FirstName" = $1, "Surname" = $2, "OtherNames" = $3, "StaffId" = $4, "DepartmentId" = $5, "Status" = $6 WHERE "LecturerId" = $7 RETURNING *', values);

    if (result.rows.length > 0) {
      return result.rows[0];
    }
    // return [];
  } catch (error) {
    if (error.code === '23505') {
      errMsg = 'Staff Id already exists'
    } else if (error.code === '23503') {
      errMsg = 'Department does not exist'
    } else {
      errMsg = error;
    }
    console.log(error)
    return null;
  }
}

const removeLecturer = async (id) => {
  try {
    const result = await pool.query('DELETE FROM "AcadSchema"."Lecturer" WHERE "LecturerId" = $1', [id]);
    if (result.rowCount > 0) {
      return true;
    }
    return false;
  } catch (error) {
    errMsg = error;
    return null;
  }
}


const getError = () => {
  return errMsg;
}

module.exports = {
  getAllLecturers,
  getLecturers,
  getLecturer,
  addLecturer,
  editLecturer,
  removeLecturer,
  getError
}