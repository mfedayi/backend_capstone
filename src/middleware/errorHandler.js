const errorHandler = (err, req, res, next) => {
  console.error(err.stack); //Log error stack from terminal

  res.status(500).json({
    error: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
