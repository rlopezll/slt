const jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var User = require('./models/user');

module.exports.restrict = function(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/users/login');
  }
}

// Authenticate using our plain-object database of doom!
module.exports.authenticate = function (username, pass, done) {
  if (!module.parent) console.log('authenticating %s:%s', username, pass);

  User.find({'username':username},'password', function(err,user_db) {
    // console.log('User.find inside.');
    if(err) {
      console.log(`Error!! User not found err: ${err}`);
      return done(null, false, { message: 'User not found.' });
    }

    bcrypt.compare(pass, user_db[0].password, function(err,res) {     
      if(res == true) {
        // console.log('Local strategy returned true');

        const today = new Date();  
        const expirationDate = new Date(today);
        expirationDate.setDate(today.getDate() + 60);

        var user = {id: user_db[0]._id, username: username };
        user.token = jwt.sign({ username: username, id: user.id, exp: parseInt(expirationDate.getTime() / 1000, 10), }, 'F00RAfIs5yW6CEsVUXM25aMclq7VGzxVno');
        // console.log("jwt token: " + user.token);
        return done(null, user);
      } else {
        console.log(`Error!! Login Failed err: ${err}`);
        // console.log(username.user);
        return done(null, false, { message: 'Login Failed.' });
      }
    });

  });
}
