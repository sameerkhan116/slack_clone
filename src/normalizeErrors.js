// formatting the errors based on their path and mesasge.
// if the error has already been received, we push similar
// errors into that the array representing this error.
export default errors =>
  errors.reduce((acc, cv) => {
    if (cv.path in acc) {
      acc[cv.path].push(cv.message);
    } else {
      acc[cv.path] = [cv.message];
    }
    return acc;
  }, {});

