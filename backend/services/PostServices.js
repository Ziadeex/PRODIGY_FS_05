const { query } = require("../database/db");

const addPost = async (post, user_id, postImage) => {
  const sql = `INSERT INTO post (user_id, post_image, caption) VALUES (?, ?, ?)`;

  try {
    const addPosts = await query(sql, [user_id, postImage, post]);

    if (addPosts.affectedRows) {
      return {
        status: 200,
        message: "Successful",
        insertID: addPosts.insertId,
      };
    } else {
      return { status: 401, message: "post isn't inserted" };
    }
  } catch (error) {
    return { status: 500, message: "internal error" };
  }
};

const displayPosts = async () => {
  try {
    const displayPost = await query(`SELECT * FROM post`);
    if (displayPost.length > 0) {
      return { status: 200, message: "Successful", data: displayPost };
    } else {
      return { status: 401, message: "nothing to be displayed" };
    }
  } catch (error) {
    return { status: 500, message: "internal error" };
  }
};


const displayPostlikes = async (post_id) => {
  try {
    const displayPost = await query(
      `SELECT * FROM post WHERE post_id = ?`,
      post_id
    );
    if (displayPost.length > 0) {
      return { status: 200, message: "Successful", data: displayPost };
    } else {
      return { status: 200, message: "nothing to be displayed", data: [] };
    }
  } catch (error) {
    return { status: 500, message: "internal error" };
  }
};

const getdisplayUsersPosts = async (user_id) => {
  try {
    const displayPost = await query(
      `SELECT * FROM post WHERE user_id = ?`,
      user_id
    );
    if (displayPost.length > 0) {
      return { status: 200, message: "Successful", data: displayPost };
    } else {
      return { status: 200, message: "nothing to be displayed", data: [] };
    }
  } catch (error) {
    return { status: 500, message: "internal error" };
  }
};

module.exports = {
  addPost,
  displayPosts,
  displayPostlikes,
  getdisplayUsersPosts,
};
