// export const createError = (status, message) => {
//   const error = new Error(message);
//   error.status = status;
//   return error;
// };

// export const errorHandler = (err, req, res, next) => {
//   const status = err.status || 500;
//   const message = err.message || 'Internal Server Error';
//   res.status(status).json({ success: false, message, ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) });
// };



export const createError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};