const errorHandler = (err, req, res, next) => {
  // Generic error handler middleware. Logs the error and sends a 500 response.
  console.error(err.stack); // Log error stack to console

  res.status(500).json({
    error: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
