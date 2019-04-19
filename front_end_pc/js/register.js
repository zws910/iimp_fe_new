var vm = new Vue({
    el: '#app',
    data: {
        host: host,

        error_name: false,
        error_password: false,
        error_check_password: false,

        error_name_message: '',
        username: '',
        password: '',
        password_repeat: '',
    },

    methods: {
        // 检查用户名
        check_username: function () {
            var len = this.username.length;
            if (len < 5 || len > 20) {
                this.error_name_message = '请输入5-20个字符的用户名';
                this.error_name = true;
            } else {
                this.error_name = false;
            }
            // 检查重名
            if (this.error_name == false) {
                axios.get(this.host + '/usernames/' + this.username + '/count/', {
                    responseType: 'json'
                })
                    .then(response => {
                        if (response.data.count > 0) {
                            this.error_name_message = '用户名已存在';
                            this.error_name = true;
                        } else {
                            this.error_name = false;
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
            }

        },
        // 检查密码
        check_pwd: function () {
            var len = this.password.length;
            if (len < 8 || len > 20) {
                this.error_password = true;
            } else {
                this.error_password = false;
            }
        },
        // 检查确认密码
        check_cpwd: function () {
            if (this.password != this.password_repeat) {
                this.error_check_password = true;
            } else {
                this.error_check_password = false;
            }
        },
        // 点击注册
        on_submit: function () {
            this.check_username();
            this.check_pwd();
            this.check_cpwd();

            if (this.error_name == false && this.error_password == false && this.error_check_password == false) {

                axios.post(this.host + '/users/', {
                    username: this.username,
                    password: this.password,
                    password_repeat: this.password_repeat,
                }, {
                    responseType: 'json'
                })
                    .then(response => {
                        // 记录用户的登录状态
                        sessionStorage.clear();
                        localStorage.clear();

                        localStorage.token = response.data.token;
                        localStorage.username = response.data.username;
                        localStorage.user_id = response.data.id;

                        location.href = '/index.html';
                    })
                    .catch(error => {
                        if (error.response.status == 400) {
                            console.log(error.response.data)
                        } else {
                            console.log(error.response.status);
                        }
                    })
            }
        }
    }
});