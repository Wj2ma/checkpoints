const debug = require('debug')('checkpoints:facebookModule');

const FB = require('fb');

import FacebookToken from '../mongoose/FacebookToken';
import User from '../mongoose/User';
import * as user from './user';

interface FBToken {
  token: string;
  expires: Date;
}

function fb(token: string) {
  return FB.withAccessToken(token);
}

export function getAppFacebookToken(): Promise<FBToken> {
  return new Promise((resolve, reject) => {
    FB.api('oauth/access_token', {
      client_id: process.env['FACEBOOK_APP_ID'],
      client_secret: process.env['FACEBOOK_APP_SECRET'],
      grant_type: 'client_credentials'
    }, res => {
      if (!res || res.error) {
        debug('facebook error', !res ? 'error' : res.error);
        return reject(new Error(JSON.stringify(!res ? 'error' : res.error.message)));
      }
      resolve({
        token: res.access_token,
        expires: Date.now() + res.expires * 1000
      });
    });
  });
}

export function exchangeFacebookToken(exchangeToken: string): Promise<FBToken> {
  return new Promise((resolve, reject) => {
    FB.api('oauth/access_token', {
      client_id: process.env['FACEBOOK_APP_ID'],
      client_secret: process.env['FACEBOOK_APP_SECRET'],
      grant_type: 'fb_exchange_token',
      fb_exchange_token: exchangeToken
    }, res => {
      if (!res || res.error) {
        debug('facebook error', !res ? 'error' : res.error);
        return reject(new Error(JSON.stringify(!res ? 'error' : res.error.message)));
      }
      resolve({
        token: res.access_token,
        expires: Date.now() + res.expires * 1000
      });
    });
  });
}

export function getFacebookToken(facebookId: string): Promise<FBToken> {
  return FacebookToken.findOne({ facebookId }).then(token => token as any);
}

export function saveFacebookToken(facebookId: string, token: string, expires: Date): Promise<FBToken> {
  return getFacebookToken(facebookId)
    .then((res: any) => {
      res = res as Document;
      let deferred;
      if (res) {
        res.set('token', token);
        res.set('expires', expires);
        deferred = res.save();
      } else {
        deferred = FacebookToken.create({ facebookId, token, expires})
      }
      return deferred.then(res => _.pick(res, 'token', 'expires'));
    });
}

export function updateFacebookPicture(facebookId: string, overwriteUserPicture = true): Promise<CheckpointsServer.UserPicture> {
  return Promise.all([
    user.getUserByFacebookId(facebookId),
    getFacebookToken(facebookId)
  ]).then(values => {
    const [user, token] = values;
    if (!user)
      throw new Error(`Facebook user (${facebookId}) not found`);
    if (!token)
      throw new Error(`Facebook token (${facebookId}) not found`);

    return new Promise((resolve, reject) => {
      fb(token.token).api('/me/picture', { width: 200, height: 200, redirect: 0 }, res => {
        if (res && res.error)
          return reject(new Error(res.error.code));
        const picture = _.pick(res.data, 'width', 'height', 'url') as CheckpointsServer.UserPicture;
        let update = {
          'accounts.facebook.picture': picture
        };
        if (overwriteUserPicture)
          update['picture'] = picture;
        User.findByIdAndUpdate(user._id, {
          $set: update
        }).then(() => resolve(picture));
      });
    });
  });
}

// export function getFacebookFriends(facebookId: string) {
//   return Promise.all([
//     user.getUserByFacebookId(facebookId),
//     getFacebookToken(facebookId)
//   ]).then(values => {
//     const [user, token] = values;
//     if (!user)
//       throw new Error(`Facebook user (${facebookId}) not found`);
//     if (!token)
//       throw new Error(`Facebook token (${facebookId}) not found`);

//     return new Promise((resolve, reject) => {
//       fb(token.token).api('/me/friends', res => {
//         if (res && res.error)
//           return reject(new Error(res.error.code));
//         const picture = _.pick(res.data, 'width', 'height', 'url') as CheckpointsServer.UserPicture;
//         let update = {
//           'accounts.facebook.picture': picture
//         };
//         if (overwriteUserPicture)
//           update['picture'] = picture;
//         User.findByIdAndUpdate(user._id, {
//           $set: update
//         }).then(() => resolve(picture));
//       });
//     });
//   });
// }
