const { query } = require("../database/db");

const setProfile = async (user_id, profilepic) => {
  const sql = `UPDATE users SET profilePic = ? WHERE user_id = ?`;

  try {
    const result = await query(sql, [profilepic, user_id]);
    if (result.affectedRows === 1) {
      await query(`SELECT * FROM users`);

      return { status: 200 };
    } else {
      return {
        status: 401,
        message: "unable to add the profile to the users table",
      };
    }
  } catch (error) {
    console.error(error);
    return { status: 500, message: "internal error" };
  }
};

const getProfile = async (userId) => {
  const sql = `SELECT profilePic FROM users WHERE user_id = ?`;

  try {
    const [result] = await query(sql, [userId]);
    if (result) {
      return {
        status: 200,
        message: "Successful",
        user: { profilePic: result.profilePic },
      };
    } else {
      return {
        status: 401,
        message: "Unable to retrieve the user from the database",
      };
    }
  } catch (error) {
    console.error(error);
    return { status: 500, message: "Internal error" };
  }
};

module.exports = {
  setProfile,
  getProfile,
};
