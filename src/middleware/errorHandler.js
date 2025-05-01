const errorHandler = (err, req, res, next) => {
  console.error(err.stack); //Log error stack from terminal

  // Check if the error is a validation error
  res.status(500).json({
    error: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
