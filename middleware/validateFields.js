const validateFields = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validate(req.body, { abortEarly: false });
      next();
    } catch (error) {
      // Convert array of errors into a single object
      const errors = {};
      error.inner.forEach((e) => {
        const path = e.path || "Error"; 
        if (!errors[path]) {
          errors[e.path] = e.message;
        }
      });

      res.status(400).json({ errors });
    }
  };
};

export default validateFields;
