// Requiring bcrypt for password hashing. Using the bcrypt-nodejs version as the regular bcrypt module
// sometimes causes errors on Windows machines
var bcrypt = require("bcrypt-nodejs");

// Creating the User Model
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    // Name, cannot be null
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    // The email cannot be null, and must be a proper email before creation
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    // User Password
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // User Height in feet
    feet: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    // User Height in inches
    inches: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    // User Weight
    weight: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    // User Body Mass Index
    bmindex: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  });

  // Associate all users to have many Progress
  // When a user unregister from the site, delete their log progress

  User.associate = function(models) {
    models.User.hasMany(models.Progress, {
      onDelete: "cascade"
    });
  };

  User.associate = function(models) {
    models.User.hasMany(models.Workouts, {
      onDelete: "cascade"
    });
  };

  // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  User.hook("beforeCreate", function(user) {
    user.password = bcrypt.hashSync(
      user.password,
      bcrypt.genSaltSync(10),
      null
    );
  });
  return User;
};
