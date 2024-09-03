import http from "../http-common";

const addPost = (post, user_id, postImage) => { 
  const formData = new FormData();
  formData.append("post", post);
  formData.append("user_id", user_id);
  formData.append("postImage", postImage);

  return http.post(`/media/addPost`, formData);
};

const displayPosts = (post_id) => {
  return http.get(`/media/displayPosts`, { post_id });
};

const displayUsersPosts = (user_id) => {
  return http.get(`/media/displayUsersPosts?user_id=${user_id}`);
};

const displayPostslikes = (post_id) => {
  return http.get(`/media/displayPostslikes?post_id=${post_id}`);
};

const addlike = (post_id, user_id) => {
  const formData = new FormData();
  formData.append("post_id", post_id);
  formData.append("user_id", user_id);

  return http.post(`/media/addlike?post_id=${post_id}&&user_id=${user_id}`);
};

const removelike = (post_id, user_id) => {
  
  return http.delete(
    `/media/removelike`,{data:{post_id,user_id}})
  // return http.delete(
  //   `/media/removelike?post_id=${post_id}&&user_id=${user_id}`
  // );
};

const displaylike = (post_id) => {
  return http.get(`/media/getlikes?post_id=${post_id}`);
};

const PostService = {
  addPost,
  removelike,
  addlike,
  displaylike,
  displayPosts,
  displayPostslikes,
  displayUsersPosts,
};

export default PostService;
