var vm = new Vue({
    el: '#app',
    data: {
        host: host,
        error_username: false,
        error_pwd: false,
        error_pwd_message: '请填写密码',
        username: '',
        password: '',
    },
    methods: {
        // 获取url路径参数
        get_query_string: function (name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return decodeURI(r[2]);
            }
            return null;
        },
        // 检查数据
        check_username: function () {
            if (!this.username) {
                this.error_username = true;
            } else {
                this.error_username = false;
            }
        },
        check_pwd: function () {
            if (!this.password) {
                this.error_pwd_message = '请填写密码';
                this.error_pwd = true;
            } else {
                this.error_pwd = false;
            }
        },
        // 点击登录 - 表单提交
        on_submit: function () {
            this.check_username();
            this.check_pwd();

            if (this.error_username == false && this.error_pwd == false) {
                axios.post(this.host + '/authorizations/', {
                    username: this.username,
                    password: this.password,
                }, {
                    responseType: 'json',
                    withCredentials: true
                })
                    .then(response => {
                        // 浏览器本地存储token
                        sessionStorage.clear();
                        localStorage.token = response.data.token;
                        localStorage.user_id = response.data.user_id;
                        localStorage.username = response.data.username;

                        // 跳转页面
                        var return_url = this.get_query_string('next');
                        if (!return_url) {
                            return_url = '/index.html';
                        }
                        location.href = return_url;
                    })
                    .catch(error => {
                        if (error.response.status == 400) {
                            this.error_pwd_message = '用户名或密码错误';
                        } else {
                            this.error_pwd_message = '服务器错误';
                        }
                        this.error_pwd = true;
                    })
            }
        }
    },

});