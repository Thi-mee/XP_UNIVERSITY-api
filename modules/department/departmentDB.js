const pool = require('../../dbconfig');
let errorMessage = '';


// Get all departments
const getAllDepartments = async () => {
  try {
    const result = await pool.query('SELECT * FROM "AcadSchema"."Department" ORDER BY "DepartmentId" ASC');
    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

const getDepartments = async (facultyId, status, name) => {
  console.log({facultyId, status, name})
  try {
    let query = 'SELECT * FROM "AcadSchema"."Department" WHERE 1 = 1';
    let values = [];
    let index = 1;
    if (name && name.length > 0) {
      query += ` AND "Name" LIKE $${index}`;
      index++;
      values.push(`%${name}%`);
    }
    if (facultyId && facultyId > 0) {
      query += ` AND "FacultyId" = $${index}`;
      index++
      values.push(facultyId);
    }
    if (status > -1) {
      query += ` AND "Status" = $${index}`;
      values.push(status);
    }
    query += ' ORDER BY "Department" ASC ';
    console.log(query, values)
    const result = await pool.query(query, values);
    if (result.rows.length > 0) {
      return result.rows;
    }
    return [];
  } catch (error) {
    console.log(error);
    errorMessage = error;
    return null;
  }
}

const getDepartment = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM "AcadSchema"."Department" WHERE "DepartmentId" = $1', [id]);
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    return null;
  } catch (error) {
    console.log(error);
    errorMessage = error;
    return null;
  }
}

const addDepartment = async (department) => {
  try {
    const result = await pool.query('INSERT INTO "AcadSchema"."Department" ("Name", "FacultyId", "UniqueId", "Code", "Status") VALUES ($1, $2, $3, $4, $5) RETURNING *', [department.Name, department.FacultyId, department.UniqueId, department.Code, department.Status]);
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    return null;
  } catch (error) {
    if (error.code === '23505') {
      errorMessage = 'Unique Id already exists'
    } else if (error.code === '23503') {
      errorMessage = 'Faculty does not exist'
    } else {
      errorMessage = error;
    }
    console.log(error);
    return null;
  }
}

const editDepartment = async (department) => {
  try {
    const result = await pool.query('UPDATE "AcadSchema"."Department" SET "Name" = $1, "FacultyId" = $2, "UniqueId" = $3, "Code" = $4, "Status" = $5 WHERE "DepartmentId" = $6 RETURNING *', [department.Name, department.FacultyId, department.UniqueId, department.Code, department.Status, department.DepartmentId]);
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    return null;
  } catch (error) {
    if (error.code === '23505') {
      errorMessage = 'Unique Id already exists'
    } else if (error.code === '23503') {
      errorMessage = 'Faculty does not exist'
    } else {
      errorMessage = error;
    }
    return null;
  }
}

const removeDepartment = async (id) => {
  try {
    const result = await pool.query('DELETE FROM "AcadSchema"."Department" WHERE "DepartmentId" = $1 RETURNING *', [id]);
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    return null;
  } catch (error) {
    if (error.code === '23503') {
      errorMessage = 'Cannot delete faculty as there are departments associated with it'
    } else {
      errorMessage = error;
    }
    return null;
  }
}




const getError = () => {
  const temp = errorMessage;
  errorMessage = '';
  return temp;
}

module.exports = {
  getAllDepartments,
  getDepartments,
  getDepartment,
  addDepartment,
  editDepartment,
  removeDepartment,
  getError
}