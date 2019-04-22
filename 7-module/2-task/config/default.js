module.exports = {
  mongodb: {
    uri: 'mongodb://localhost/chat_app',
  },
  providers: {
    github: {
      app_id: process.env.GITHUB_APP_ID || 'github_app_id',
      app_secret: process.env.GITHUB_APP_SECRET || 'github_app_secret',
      callback_uri: process.env.GITHUB_CALLBACK_URI || 'http://localhost:3000/oauth/github',
      options: {
        scope: ['user:email']
      }
    },
    facebook: {
      app_id: process.env.FACEBOOK_APP_ID || 'facebook_app_id',
      app_secret: process.env.FACEBOOK_APP_SECRET || 'facebook_app_secret',
      callback_uri: process.env.FACEBOOK_CALLBACK_URI || 'http://localhost:3000/oauth/facebook',
      options: {
        scope: ['email']
      }
    },
    vkontakte: {
      app_id: process.env.VKONTAKTE_APP_ID || 'vkontakte_app_id',
      app_secret: process.env.VKONTAKTE_APP_SECRET || 'vkontakte_app_secret',
      callback_uri: process.env.VKONTAKTE_CALLBACK_URI || 'http://localhost:3000/oauth/vkontakte',
      options: {
        scope: ['email']
      }
    }
  }
};
