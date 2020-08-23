export function getFormattedError(error) {
  let errorDescription = '';
  switch (error.response.data.code) {
  case 401:
    errorDescription = 'Check your credentials';
    break;

  case 403:
    errorDescription = 'No access, you\'re not admin';
    break;

  default:
    errorDescription = 'Something went wrong, try again later or contact Administrator';
    break;
  }

  const newError = {
    code: error.response.data.code,
    message: error.response.data.error,
    description: errorDescription
  };

  return newError;
}