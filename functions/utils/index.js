const emailValidator = require("email-validator");

module.exports.validateAuth =  (body, callback) => {
  const { email, password } = JSON.parse(body);
  if (email.length && password) {
    if (password.length > 100) {
      return {
        statusCode: 400,
        body: "Password may be no longer than 100 characters"
      }
    }

    if (emailValidator.validate(email)) {
      // check if user exists
      return callback(email, password);
    } else {
      return {
        statusCode: 400,
        body: "Email is invalid"
      }
    }
  } else if (email) {
    return {
      statusCode: 400,
      body: "Password is required"
    }
  } else if (password) {
    return {
      statusCode: 400,
      body: "Email is required"
    }
  } else {
    return {
      statusCode: 400,
      body: "Email and password are required"
    }
  }
}
