import { NextFunction, Request, Response } from 'express';
import { Session, User } from '../services/db';

export function attachSession(req: Request, res: Response, next: NextFunction) {
  if (!req.cookies?.SESSION_TOKEN) {
    return next();
  }
  req.session = {
    token: null,
    user: null,
  };

  Session.findOne({
    where: {
      token: req.cookies.SESSION_TOKEN,
    },
  })
    .then((sess) => {
      console.log(
        sess?.dataValues,
        'checking for isExpired in attachsession',
      );
      const { isLoggedOut } = req.body;
      console.log(isLoggedOut, 'is logged out value');
      if (sess?.dataValues?.id && !isLoggedOut) {
        req.session.token = sess.dataValues;

        User.findOne({
          where: {
            id: sess.dataValues.user,
          },
        }).then((user) => {
          if (user?.dataValues?.id) {
            req.session.user = user.dataValues;
          } // else: session is mapped to a deleted user. should report this somewhere.

          next();
        });
      } else {
        // invalid session token
        console.log('invalid token');
        res.cookie('SESSION_TOKEN', req.session.token, {
          expires: new Date(Date.now()),
        });

        next();
      }
    })
    .catch((err) => {
      console.error('Failed to fetch session by token.', err);
      res.status(500).json({
        success: false,
        message: 'Internal: Failed to fetch session by token.',
      });
    });
}
