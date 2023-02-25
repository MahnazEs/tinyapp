 const getUserByEmail = (email, users) => {
  for (let user_id in users) {
    if (users[user_id].email === email) {
      return users[user_id];
    }
  }
}; 
/* const getUserByEmail= function(email){
  const userValues=Object.values(users);
  for (const user of userValues){
    if (user.email===email){
      return user;
    }
  }
}; */


module.exports = { getUserByEmail };