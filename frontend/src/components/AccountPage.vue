<template>

    <div class="container">

        <ul class="nav nav-pills nav-justified col-8 mx-auto mb-5" role="tablist">

            <li class="nav-item" role="presentation">
                <a class="nav-link active" data-bs-toggle="pill" data-bs-target="#pills-login" role="tab">Login</a>
            </li>

            <li class="nav-item" role="presentation">
                <a class="nav-link" data-bs-toggle="pill" data-bs-target="#pills-register" role="tab">Register</a>
            </li>

        </ul>

        <div class="tab-content">

            <div class="tab-pane fade show active" id="pills-login" role="tabpanel">
                <form class="col-6 mx-auto" @submit.prevent="submit_sign_in">

                    <div class="form-outline mb-3">
                        <input type="text" class="form-control" v-model="username" placeholder="Username" />
                    </div>

                    <div class="form-outline mb-3">
                        <input type="password" class="form-control" v-model="password" placeholder="Password" />
                    </div>

                    <button type="submit" class="btn btn-primary btn-block">Sign in</button>

                </form>
            </div>

            <div class="tab-pane fade" id="pills-register" role="tabpanel">
                <form class="col-6 mx-auto" @submit.prevent="submit_sign_up">

                    <div class="form-outline mb-3">
                        <input type="text" class="form-control" v-model="username" placeholder="Username" />
                    </div>

                    <div class="form-outline mb-3">
                        <input type="password" class="form-control" v-model="password" placeholder="Password" />
                        <small class="form-text text-muted">8 characters minimum</small>
                    </div>

                    <div class="form-outline mb-3">
                        <input type="password" class="form-control" v-model="repeat_password"
                            placeholder="Repeat Password" />
                    </div>

                    <div class="form-check d-flex justify-content-center mb-3">

                        <input class="form-check-input me-2" type="checkbox" v-model="checkbox_term" />

                        <!-- TODO the term -->
                        <label class="form-check-label">
                            I have read and agree to the terms
                        </label>

                    </div>

                    <div :title="sign_up_error">
                        <button type="submit" class="btn btn-primary btn-block" :disabled="check_sign_up">Sign
                            up</button>
                    </div>

                </form>
            </div>

        </div>

    </div>

    <div>
        <p>{{ username }}</p>
        <p>{{ password }}</p>
        <p>{{ repeat_password }}</p>
        <p>{{ checkbox_term }}</p>
        <p>{{ submit_str }}</p>
    </div>

    <div>
        <button type="button" class="btn btn-primary btn-block" @click="token_test">Token test</button>
        <p>{{ token_test_result }}</p>
    </div>

</template>

<script>
export default {
    name: 'AccountPage',
    data() {
        return {
            submit_str: null,
            token: null,
            token_test_result: '',

            // check_sign_up
            res_valid_username: false,
            username: null,
            password: null,
            repeat_password: null,
            checkbox_term: null,
            sign_up_error: '',
        }
    },
    watch: {
        username() {
            this.valid_username();
        }
    },
    computed: {
        check_sign_up() {
            // return disabled or not

            if (!this.username) {
                // username check fail
                this.set_sign_up_error('Username check fail.');
                return true;
            }

            if (!this.res_valid_username) {
                // username has been used
                this.set_sign_up_error('Username has been used.');
                return true;
            }

            if (!this.password || !this.repeat_password || (this.password.length < 8)) {
                // password check fail
                this.set_sign_up_error('Password check fail.');
                return true;
            }

            if (this.password !== this.repeat_password) {
                // password and repeat password should be the same
                this.set_sign_up_error('Password and repeat password should be the same.');
                return true;
            }

            if (!this.checkbox_term) {
                // term check fail
                this.set_sign_up_error('Please read and agree to the terms and check the checkbox above.');
                return true;
            }

            this.set_sign_up_error(null);
            return false;
        },
    },
    methods: {
        set_sign_up_error(c_str) {
            this.sign_up_error = c_str;
        },
        async submit_sign_in() {
            this.submit_str = 'Hi_sign_in';
            const url = `${window.location.protocol}//${window.location.host}/api/auth/signin`;
            const body = {
                'username': this.username,
                'password': this.password,
            };

            const res = await (await fetch(url, {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                },
            })).json();

            this.token = res.token;

            // TODO jump to content page
        },
        async valid_username() {
            const url = `${window.location.protocol}//${window.location.host}/api/auth/valid_username`;
            const body = {
                'username': this.username,
            };

            const res = await (await fetch(url, {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                },
            })).json();

            this.res_valid_username = res.message;
        },
        async submit_sign_up() {
            this.submit_str = 'Hi_sign_up';
            const url = `${window.location.protocol}//${window.location.host}/api/auth/signup`;
            const body = {
                'username': this.username,
                'password': this.password,
                'repeat_password': this.repeat_password,
                'checkbox_term': this.checkbox_term,
            };

            const res = await (await fetch(url, {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                },
            })).json();

            this.token = res.token;

            // TODO jump to content page
        },
        async token_test() {
            const url = `${window.location.protocol}//${window.location.host}/api/auth/token_test`;
            const body = {
                'token': this.token,
            };

            const res = await (await fetch(url, {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                },
            })).json();

            this.token_test_result = res;
        },
    },
}
</script>
