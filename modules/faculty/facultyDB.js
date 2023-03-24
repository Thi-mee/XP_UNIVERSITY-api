const pool = require('../../dbconfig');
let errMsg = "";

const getAllFaculties = async () => {
  try {
    const result = await pool.query('SELECT * FROM "AcadSchema"."Faculty" ORDER BY "Name" ASC')
    return result.rows;
  } catch (error) {
    console.log(error);
    errMsg = error;
    return null;
  }
}

const getFaculties = async (status, name) => {
  try {
    let query = 'SELECT * FROM "AcadSchema"."Faculty" WHERE 1 = 1';
    let values = [];
    let index = 1;
    if (name !== "" && name.length > 0) {
      query += ` AND "Name" LIKE $${index}`;
      index++;
      values.push(`%${name}%`);
    }
    if (status > -1) {
      query += ` AND "Status" = $${index}`;
      values.push(status);
    }
    query += ' ORDER BY "FacultyId" ASC ';
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.log(error);
    errMsg = error;
    return null;
  }
}

/**
 * 
 * @param {string} id 
 * @returns {boolean} true if faculty exists, false otherwise
 */
const getFaculty = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM "AcadSchema"."Faculty" WHERE "FacultyId" = $1', [id])
    if (result.rows.length > 0) return result.rows[0];
    return null;
  } catch (error) {
    errMsg = error;
    return null;
  }
}

/**
 * Queries Database to Add a Faculty
 * @param {{
 * Name: string,
 * UniqueId: string,
 * Code: string,
 * Status: number
 * }} faculty 
 * @returns 
 */
const addFaculty = async (faculty) => {
  try {
    const result = await pool.query('INSERT INTO "AcadSchema"."Faculty" ("Name", "UniqueId", "Code", "Status") VALUES ($1, $2, $3, $4) RETURNING "FacultyId"', [faculty.Name, faculty.UniqueId, faculty.Code, faculty.Status]);
    return result.rows[0];
  } catch (error) {
    if (error.code === '23505') {
      errMsg = 'Unique Id already exists'
    } else {
      errMsg = error;
    }
    return null;
  }
}

const editFaculty = async (faculty) => {
  try {
    const result = await pool.query('UPDATE "AcadSchema"."Faculty" SET "Name" = $1, "UniqueId" = $2, "Code" = $3, "Status" = $4 WHERE "FacultyId" = $5 RETURNING *', [faculty.Name, faculty.UniqueId, faculty.Code, faculty.Status, faculty.FacultyId]);
    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      return [];
    }
  } catch (error) {
    if (error.code === '23505') {
      errMsg = 'Unique Id already exists'
    } else {
      errMsg = error;
    }
    return null;
  }

}

const removeFaculty = async (id) => {
  try {
    const result = await pool.query('DELETE FROM "AcadSchema"."Faculty" WHERE "FacultyId" = $1 RETURNING *', [id]);
    console.log(result)
    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      return null;
    }
  } catch (error) {
    if (error.code === '23503') {
      errMsg = 'Cannot delete faculty as there are departments associated with it'
    } else {
      errMsg = error;
    }
    return null;
  }
}

const getError = () => {
  const temp = errMsg;
  errMsg = "";
  return temp;
}

module.exports = {
  getAllFaculties,
  getFaculties,
  getFaculty,
  addFaculty,
  editFaculty,
  removeFaculty,
  getError
}
