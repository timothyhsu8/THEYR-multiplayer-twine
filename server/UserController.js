const User = require('./UserSchema')

getUsers = async (req, res) => {
    try {
        User.find({}, function(err, users) {
            var userMap = [];
        
            users.forEach(function(user) {
              userMap.push(user);
            });

            res.send(userMap);  
          });
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
};

module.exports = {
  getUsers
}