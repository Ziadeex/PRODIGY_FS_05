const {
  addPost,
  displayPosts,
  displayPostlikes,
  getdisplayUsersPosts,
} = require("../services/PostServices");
const { query } = require("../database/db");

const getpostlikescontroller = async (req, res) => {
  const { post_id } = req.query;

  try {
    const displayPost = await displayPostlikes(post_id);

    if (displayPost.status === 200) {
      return res.status(200).json({
        message: "Successfully displayed posts",
        dislayMessages: displayPost,
        status: 200,
      });
    } else {
      return { status: 401, message: "no posts to be displayed" };
    }
  } catch (error) {
    return { status: 500, message: "internal error" };
  }
};

const removelikecontroller = async (req, res) => {
  const { post_id, user_id } = req.body;
  
  try {
    const updateLikeCountQuery =
      "UPDATE post SET like_count = like_count - 1 WHERE post_id = ?";
    await query(updateLikeCountQuery, [post_id]);

    const deletelike = await query(
      "DELETE FROM likes WHERE user_id = ? AND post_id = ?",
      [user_id, post_id]
    );

    

    if (deletelike.affectedRows === 1) {
 
      return { status: 200, message: "Successful"};
    } else {
      return { status: 401, message: "post is not deleted" };
    }
  } catch (error) {
    console.error("Error liking post:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the post." });
  }
};

const getdisplayUsersPostscontroller = async (req, res) => {
  const { user_id } = req.query;

  try {
    const displayPost = await getdisplayUsersPosts(user_id);
    if (displayPost.status === 200) {
      return res.status(200).json({
        message: "Successfully displayed posts",
        dislayMessages: displayPost,
        status: 200,
      });
    } else {
      return { status: 401, message: "no posts to be displayed" };
    }
  } catch (error) {
    return { status: 500, message: "internal error" };
  }
};

const addlikecontroller = async (req, res) => {
  const { post_id, user_id } = req.query;

  try {
    const likeCheckQuery =
      "SELECT * FROM likes WHERE user_id = ? AND post_id = ?";
    const likeCheckResult = await query(likeCheckQuery, [user_id, post_id]);

    if (likeCheckResult.length > 0) {
      return res
        .status(400)
        .json({ message: "User has already liked this post." });
    }

    const likeInsertQuery =
      "INSERT INTO likes (user_id, post_id) VALUES (?, ?)";
    await query(likeInsertQuery, [user_id, post_id]);

    const updateLikeCountQuery =
      "UPDATE post SET like_count = like_count + 1 WHERE post_id = ?";
    await query(updateLikeCountQuery, [post_id]);

    res.status(200).json({ message: "Post liked successfully." });
  } catch (error) {
    console.error("Error liking post:", error);
    res
      .status(500)
      .json({ message: "An error occurred while liking the post." });
  }
};

const getlikescontroller = async (req, res) => {
  const post_id = req.query.post_id;

  try {
    const likedisplay = await query(
      `SELECT * FROM likes WHERE post_id = ?`,
      post_id
    );

    if (likedisplay.length > 0) {
      res
        .status(200)
        .json({
          message: "Likes fetched successfully.",
          status: 200,
          data: likedisplay,
        });
    } else {
      res
        .status(200)
        .json({ message: "No likes found.", status: 200, data: [] });
    }
  } catch (error) {
    console.error("Error fetching likes:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching likes." });
  }
};

const addPostController = async (req, res) => {
  const { post, user_id } = req.body;
  const postImage = req.file ? req.file.filename : null; 
  try {
    const result = await addPost(post, user_id, postImage);
    if (result.status === 200) {
      return res.status(200).json({
        message: "Post added successfully",
        insertMessages: result,
        status: 200,
      });
    } else {
      return res.status(401).json({ message: "Failed to post" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const displayPostsController = async (req, res) => {
  try {
    const displayPost = await displayPosts();
    if (displayPost.status === 200) {
      return res.status(200).json({
        message: "Successfully displayed posts",
        dislayMessages: displayPost,
        status: 200,
      });
    } else {
      return { status: 401, message: "no posts to be displayed" };
    }
  } catch (error) {
    return { status: 500, message: "internal error" };
  }
};

module.exports = {
  addPostController,
  displayPostsController,
  removelikecontroller,
  addlikecontroller,
  getlikescontroller,
  getpostlikescontroller,
  getdisplayUsersPostscontroller,
};
