const validateRequest = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const error = new Error("Validation Failed");
    error.statusCode = 400;
    error.errors = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return next(error);
  }
  req.validatedBody = result.data;
  next();
};
export default validateRequest;
