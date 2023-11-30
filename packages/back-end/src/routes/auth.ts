import IRoute from '../types/IRoute';
import { NextFunction, Router } from 'express';
import { compareSync } from 'bcrypt';
import { attachSession } from '../middleware/auth';
import { sequelize, Session, User } from '../services/db';
import { randomBytes } from 'crypto';

const AuthRouter: IRoute = {
  route: '/auth',
  router() {
    const router = Router();
    router.use(attachSession);

    // If we're authenticated, return basic user data.
    router.get('/', (req, res) => {
      if (req.session?.token?.id) {
        const {
          token: { token, ...session },
          user: { password, ...user },
        } = req.session;
        return res.json({
          success: true,
          message: 'Authenticated',
          data: {
            session,
            user,
          },
        });
      } else {
        return res.json({
          success: false,
          message: 'Not Authenticated',
        });
      }
    });
    // Attempt to log in
    router.post('/login', async (req, res) => {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Missing username/password.',
        });
      }

      const user = await User.findOne({
        where: sequelize.where(
          sequelize.fn('lower', sequelize.col('username')),
          sequelize.fn('lower', username),
        ),
      }).catch((err) => console.error('User lookup failed.', err));

      // Ensure the user exists. If not, return an error.
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username/password.',
        });
      }

      // Ensure the password is correct. If not, return an error.
      if (!compareSync(password, user.dataValues.password)) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username/password.',
        });
      }

      // We now know the user is valid so it's time to mint a new session token.
      const sessionToken = randomBytes(32).toString('hex');
      console.log(sessionToken);
      let session;
      try {
        // Persist the token to the database.
        session = await Session.create({
          token: sessionToken,
          user: user.dataValues.id,
          isExpired: false,
        });
      } catch (e) {
        return passError('Failed to create session.', e, res);
      }

      if (!session) {
        // Something broke on the database side. Not much we can do.
        return passError('Returned session was nullish.', null, res);
      }

      // We set the cookie on the response so that browser sessions will
      // be able to use it.
      res.cookie('SESSION_TOKEN', sessionToken, {
        expires: new Date(Date.now() + 3600 * 24 * 7 * 1000), // +7 days
        secure: false,
        httpOnly: true,
      });
      // We return the cookie to the consumer so that non-browser
      // contexts can utilize it easily. This is a convenience for the
      // take-home so you don't have to try and extract the cookie from
      // the response headers etc. Just know that this is a-standard
      // in non-oauth flows :)
      return res.json({
        success: true,
        message: 'Authenticated Successfully.',
        data: {
          token: sessionToken,
        },
      });
    });

    // Attempt to register
    router.post('/register', async (req, res) => {
      const { username, password, displayname } = req.body;
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Missing username/password.',
        });
      }

      const user = await User.findOne({
        where: sequelize.where(
          sequelize.fn('lower', sequelize.col('username')),
          sequelize.fn('lower', username),
        ),
      }).catch((err) => console.error('User lookup failed.', err));

      // Ensure the user doesn't exists. If so, return an error.
      if (user) {
        return res.status(401).json({
          success: false,
          message: 'Username/User exists',
        });
      } else {
        try {
          const newUser = await User.create({
            username: username,
            password: password,
            displayName: displayname,
          });

          const sessionToken = randomBytes(32).toString('hex');

          // Persist the token to the database.
          const session = await Session.create({
            token: sessionToken,
            user: newUser.dataValues.id,
            isExpired: false,
          });

          if (!session) {
            // Something broke on the database side. Not much we can do.
            return passError('Returned session was nullish.', null, res);
          }
          res.cookie('SESSION_TOKEN', sessionToken, {
            expires: new Date(Date.now() + 3600 * 24 * 7 * 1000), // +7 days
            secure: false,
            httpOnly: true,
          });

          // We return the cookie to the consumer so that non-browser
          // contexts can utilize it easily. This is a convenience for the
          // take-home so you don't have to try and extract the cookie from
          // the response headers etc. Just know that this is a-standard
          // in non-oauth flows :)
          return res.json({
            success: true,
            message: 'Authenticated and Created User Successfully.',
            data: {
              token: sessionToken,
            },
          });
        } catch (e) {
          return passError('Failed to create user.', e, res);
        }
      }
    });

    // Log out
    router.post('/logout', async (req, res) => {
      const { token } = req.body;
      console.log(token, 'this is the token off the body in logout method');
      // Find a session by the token
      const currentSession = await Session.findOne({
        where: {
          token: token,
        },
      });
      console.log(currentSession, 'Are getting into the logout method');
      if (currentSession) {
        currentSession.dataValues.isExpired = true;
        currentSession.dataValues.token = null;
        currentSession.save();
      }
      console.log(currentSession, 'after save');
      res.cookie('SESSION_TOKEN', null, {
        expires: new Date(Date.now()),
        secure: false,
        httpOnly: true,
      });

      return res.json({
        success: true,
        message: 'Successfully Logged Out',
        data: {
          isAuth: false,
        },
      });
    });

    return router;
  },
};

export default AuthRouter;

function passError(message, error, response) {
  console.error(message, error);
  return response.status(500).json({
    success: false,
    message: `Internal: ${message}`,
  });
}
