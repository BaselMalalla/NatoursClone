module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
    // next above is simplified way of saying this in js: "(err) => next(err)"
  };
};
