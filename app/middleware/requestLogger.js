// app/middleware/requestLogger.js

const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString(); // Get the current timestamp
  const method = req.method; // HTTP method (GET, POST, etc.)
  const url = req.originalUrl; // Requested URL
  const body = req.body; // Request body (for POST/PUT requests)

  // Log the request details
  console.log(`[${timestamp}] ${method} request to ${url}`);

  // Log the request body regardless of its content
  console.log("Raw Request Body:", JSON.stringify(body, null, 2));

  // Store the start time to calculate request duration
  const startTime = Date.now();

  // Listen for the response finish event to log response status and duration
  res.on('finish', () => {
    const duration = Date.now() - startTime; // Calculate the duration
    const status = res.statusCode; // Response status code
    console.log(`[${timestamp}] Response Status: ${status}, Duration: ${duration}ms`);
  });

  // Call the next middleware in the stack
  next();
};

module.exports = requestLogger; // Export the middleware function
