$(function(){
  const page = {
    data:{
      type: 'login',
      timer: null,
      baseUrl: 'http://39.107.71.98:9999'
    },
    init(){
      this.bindEvent();
    },
    bindEvent(){
      var _self = this;
      // 输入框获取焦点
      $('.label-cnt').on('focus',function() {
        $(this).parent().addClass('focus-label');
      })
      // 输入框失去焦点
      $('.label-cnt').on('blur',function() {
        $(this).parent().removeClass('focus-label');
        !!$(this).val().trim() ? $(this).parent().addClass('value-label') : $(this).parent().removeClass('value-label');
      })
      // 登录、注册tab切换
      $('.todoBtn').on('click',function(){
        var todo = $(this).data('todo');
        _self.data.type = todo;
        _self.initInput();
        if (todo == 'login') {
          !$('.login-content').hasClass('login') && $('.login-content').addClass('login');
        } else {
          $('.login-content').removeClass('login');
        }
      })
      // 立即注册
      $('.registerbtn').on('click',function(){
        $('.login-content').removeClass('login');
        _self.data.type = 'register';
        _self.initInput();
      })
      // 立即登录
      $('.loginbtn').on('click', function () {
        $('.wrap').hasClass('registerSuccess') && $('.wrap').removeClass('registerSuccess')
        $('.login-content').addClass('login');
        _self.data.type = 'login';
        _self.initInput();
      })
      $('#submitBtn').on('click',function(){
        var type = _self.data.type;
        if(type == 'login') {
          _self.loginFn();
          return
        }
        if(type == 'register') {
          _self.registerFn();
          return
        }
      })
    },
    initInput() {
      $('#name').val('');
      $('#pwd').val('');
      $('#cfmPwd').val('');
      $('.wrap label').removeClass('value-label');
    },
    loginFn() {
      var _self = this;
      var name = $('#name').val().trim();
      var pwd = $('#pwd').val().trim();
      if(!name){
        _self.errorFn('请输入用户名');
        return
      }
      if(!pwd) {
        _self.errorFn('请输入密码');
        return
      }
      if(pwd.length > 12) {
        _self.errorFn('输入密码长度不能超过12位');
        return
      }
      if (pwd.length < 4) {
        _self.errorFn('输入密码长度不能少于4位');
        return
      }
      _self.ajaxFn({
        url: _self.data.baseUrl + '/login',
        type: 'post',
        data: {name,pwd},
        successFn: function (res) {
          console.log(res);
          /*
            code: 
              -1 用户不存在
              1 成功
              2 密码不正确
          */
          if(res.code == -1){
            _self.errorFn('用户不存在！')
          } else if(res.code == 2){
            _self.errorFn('密码不正确！')
          } else if(res.code == 0){
            _self.errorFn('用户已经登录！')
          } else if(res.code == 1){
            console.log('登录成功！')
            $$.setCookie('name',name);
            window.location.href = '/views/chat.html';
          }
          
        }
      })
    },
    registerFn() {
      var _self = this;
      var name = $('#name').val().trim();
      var pwd = $('#pwd').val().trim();
      var cfmPwd = $('#cfmPwd').val().trim();
      if(!name){
        _self.errorFn('请输入用户名');
        return
      }
      if(!pwd) {
        _self.errorFn('请输入密码');
        return
      }
      if(pwd.length > 12) {
        _self.errorFn('输入密码长度不能超过12位');
        return
      }
      if (pwd.length < 4) {
        _self.errorFn('输入密码长度不能少于4位');
        return
      }
      if(cfmPwd !== pwd) {
        _self.errorFn('两次输入密码不一样');
        return
      }
      _self.ajaxFn({
        url: _self.data.baseUrl + '/register',
        type: 'post',
        data: {name,pwd},
        successFn: function (res) {
          console.log(res);
          /*
            code: 
              1 注册成功
              2 用户名已存在
          */
          if(res.code == 2){
            _self.errorFn('用户名已经存在')
          } else if(res.code == 1){
            $('.wrap').addClass('registerSuccess');
          }
        } 
      })
    },
    errorFn(msg) {
      this.data.timer && clearTimeout(this.data.timer);
      $('.tips').removeClass('hideText').text(msg);
      this.data.timer = setTimeout(() => {
        $('.tips').addClass('hideText');
      }, 2000);
    },
    ajaxFn(obj) {
      $.ajax({
        url: obj.url,
        type: obj.type,
        data: obj.data,
        dataType: "json",
        success: obj.successFn,
        error: function(err){
          console.log(err);
        }
      })
    },
    judgeLogin(){
      var name = $$.getCookie('name');
      if(name){
        window.location.href = '/views/chat.html';
      }
    }
  }
  page.init();
})