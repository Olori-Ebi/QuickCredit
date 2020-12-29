import helperUtils from '../utils/HelperUtils.js';

/**
 * @class AuthenticateUser
 * @description Authenticates a given user
 * @exports AuthenticateUser
 */
class AuthenticateUser {

  static verifyAuthHeader(req) {
    const token = req.headers.auth_token;
    const payload = helperUtils.verifyToken(token)
    if(!token) {
      return { error: 'auth error' };
    }

    if(!payload) {
      return { error: 'token error'}
    }

    return payload
  }

  static verifyAdmin(req, res, next) {
    const payload = AuthenticateUser.verifyAuthHeader(req);
    let error;
    let statusCode;

    if (payload && payload.error === 'auth error') {
      statusCode = 401;
      error = 'No authorization header was specified'
      res.status(statusCode).json({
        statusCode, error
      });
      return;
    }
    if (payload && payload.error === 'token error') {
      statusCode = 401;
      error = 'Token provided cannot be authenticated'
      res.status(statusCode).json({
        statusCode, error
      });
      return;
    }
    if (payload.isadmin !== true) {
      res.status(403).json({
        status: 403,
        error: 'Only admin can access this route'
      })
      return;
    }
    next();
  }


  static prevAdmin(req, res, next) {
    const payload = AuthenticateUser.verifyAuthHeader(req);
    let error;
    let statusCode;

    if (payload && payload.error === 'auth error') {
      statusCode = 401;
      error = 'No authorization header was specified'
      res.status(statusCode).json({
        statusCode, error
      });
      return;
    }
    if (payload && payload.error === 'token error') {
      statusCode = 401;
      error = 'Token provided cannot be authenticated'
      res.status(statusCode).json({
        statusCode, error
      });
      return;
    }
    if (payload.isadmin === true) {
      res.status(403).json({
        status: 403,
        error: 'Admin cannot request loans'
      })
      return;
    }
    next();
  }

  static verifyUser(req, res, next) {
    const payload = AuthenticateUser.verifyAuthHeader(req);
    let error;
    let statusCode;

    if (payload && payload.error === 'auth error') {
      statusCode = 401;
      error = 'No authorization header was specified'
      res.status(statusCode).json({
        statusCode, error
      });
      return;
    }
    if (payload && payload.error === 'token error') {
      statusCode = 401;
      error = 'Token provided cannot be authenticated'
      res.status(statusCode).json({
        statusCode, error
      });
      return;
    }
    req.user = payload;
    // console.log('req.user', req.user)
    next();
  }
}

export default AuthenticateUser