const Restaurant = require("../models/Restaurant");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

exports.singup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const address = req.body.address;

  console.log(req.body);

  bcrypt.hash(password, 12).then(hashedPassword => {
    const restaurant = new Restaurant({
        name: name,
        email: email,
        password: hashedPassword,
        address: address,
      });

      return restaurant.save()
  }).then(restaurant => {
    res.status(200).json(restaurant)
  }).catch(err => {
    console.log(err);
  })

};


exports.login = (req,res,next) => {

    const email = req.body.email;
    const password = req.body.password
    let user;

    Restaurant.findOne({email: email}).then(restaurant => {
        if(!restaurant){
            const error = new Error("User does not exists")
            error.status = 401
            throw error;
        }

        user = restaurant
        return bcrypt.compare(password, restaurant.password)

    }).then(isEqual => {
        if(!isEqual){
            const error = new Error("Wrong password")
            error.status = 401
            throw error;
        }

        const token = jwt.sign({
            email: user.email,
            userId: user._id.toString()
        }, 'promenisecretkasnije', 
        {expiresIn: '1h'})

        res.status(200).json({token: token})

    })
    .catch(err => {
        console.log(err);
        next()
    })

}

