const FB_APPID = process.env['FB_APPID'];

window.fbAsyncInit = function() {
  FB.init({
    appId      : FB_APPID,
    cookie     : true,
    status     : true,
    xfbml      : true,
    version    : 'v2.8'
  });
  (FB as any).AppEvents.logPageView();
};

(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));