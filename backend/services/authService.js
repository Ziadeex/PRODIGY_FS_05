const { query } = require("../database/db");

const authenticate = async (data) => {
  const { email, password } = data;
  const sql = `SELECT * FROM users
    WHERE useremail = ? AND userpassword = ?`;
  try {
    const user = await query(sql, [email, password]);
    if (user && user.length) {
      return { status: 200, message: "Successful", user: user[0] };
    } else {
      return { status: 401, message: "cannot login with these credentials!" };
    }
  } catch (error) {
    return { status: 500, message: "internal error" };
  }
};


const retrieveuseridfromusername = async (user_id) => {
  
  const sql = `SELECT username FROM users
    WHERE user_id = ?`;
  
  try {
    const user = await query(sql, [user_id]);
    if (user.length > 0) {
      return { status: 200, message: "Successful", user };
    } else {
      return { status: 401, message: "cannot login with these credentials!" };
    }
  } catch (error) {
    return { status: 500, message: "internal error" };
  }
};

const signup = async (data) => {
  const { name, email, password } = data;
  const sql = `INSERT INTO users (username, useremail, userpassword) VALUES (?, ?, ?)`;
  try {
    const result = await query(sql, [name, email, password]);
 
    if (result.affectedRows) {
      
      const user = { name, email, client_id: result.insertId };  
      return { status: 200, message: "Successful", user };
    } else {
      return { status: 401, message: "unable to add the user to the database" };
    }
  } catch (error) {
    console.error(error);
    return { status: 500, message: "internal error" };
  }
};


module.exports = {
  authenticate,
  signup,
  retrieveuseridfromusername
};
