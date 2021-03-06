var User = require('../models/user'),
    bcrypt = require('bcryptjs');

module.exports = {
  login: (req, res) => {
    // console.log('LOGIN::POST::PAYLOAD::', req.body);

    User.findOne({
      email: req.body.email
    }, (err, user) =>{
      if(err){
        console.error('MongoDB Error: ', err);
        res.status(500).json(err);
      }
      if (!user) {
        console.warn('No user found!');
        res.status(403).json({ message: 'No User Found' });
      } else {


        bcrypt.compare(req.body.password, user.password, (compareErr, matched) =>{
          if(compareErr){
            console.error(compareErr);
            res.status(500).json(err);
          }
          else if (!matched) {
            console.warn('Password mismatch');
            res.status(403).json({ message: 'Username/Password Missmatch' });
          } else {
            req.session.userId = user._id;
            res.send(user);
          }
        });
      }
    })
  },
  logout: (req, res) => {
    req.session.reset();
    res.redirect('/index.html');
  },
  register: (req, res) => {
    var newUser = new User(req.body);
    // when this function fires it is going to hit the pre save middleware
    newUser.save((err, user) => {
      if(err){
        console.log('Heres your error!!!!!!!!!!');
        return res.send(err);
      }
      res.send(user);
    });
  }
  ,
  middlewares: {
    session: (req, res, next) => { // this will be the middleware that checks for a loggedin user
      if( req.session.userId ) {
              next();
          } else {
              res.redirect('/');
          }
    }
  },
  updateUser: (req, res) => {
    // console.log(req.body);
    User.update({ _id: req.body._id}, req.body, (err, user) => {
      if (err) {
        console.error(err);
      } else {
        console.log(user);
      }
    });
    res.send('Profile updated');
  },

  findUser: (req, res) => {

    if(req.query.id == ""){ res.redirect('/');}
    User.findOne({_id: req.query.id}, (err, user) =>{
      if (err) {
        console.log(err);
      } else {
        res.send(user);
      }
    })
  }
}
