import * as passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';

import User from '../mongoose/User';

function upsertFacebookUser(profile, accessToken, done) {
  const user = {
    name: profile.displayName,
    email: profile.emails[0].value,
    facebookId: profile.id,
    accessToken
  };
  User.findOne({ email: user.email }, (err, res) => {
    if (err)
      return done(err);
    if (res) {
      res.update(user, (err, user) => {
        done(err, user);
      });
    } else {
      new User(user).save((err, user) => {
        done(err, user);
      });
    }
  });
}

export function authenticateFacebook(options = {}) {
  return passport.authenticate(
    'facebook',
    {
      scope: ['public_profile', 'email'],
      session: false,
      successRedirect: '/',
      failureRedirect: '/'
    }
  );
}


export function useFacebookStrategy() {
  passport.use(new FacebookStrategy({
    clientID: process.env['FACEBOOK_APP_ID'],
    clientSecret: process.env['FACEBOOK_APP_SECRET'],
    callbackURL: 'http://localhost:8080/api/auth/facebook',
    profileFields: ['id', 'email', 'displayName']
  },
  (accessToken, refreshToken, profile, done) => {
    upsertFacebookUser(profile, accessToken, done);
  }));
}