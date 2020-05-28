<template>
	<v-container
		class="fill-height"
		fluid
	>
		<v-row
			align="center"
			justify="center"
		>
			<v-col
				cols="12"
				sm="8"
				md="4"
			>
				<v-card class="elevation-12">
					<v-toolbar
						color="primary"
						dark
						flat
					>
						<v-toolbar-title>Авторизация</v-toolbar-title>
					</v-toolbar>
					<v-alert type="info" dense text class="mb-0">Логин: <span class="font-weight-bold">admin</span> Пароль:
						<span class="font-weight-bold">admin</span></v-alert>
					<v-card-text>
						<v-alert color="error" text class="" v-if="errorList.length" dense>
							<div v-for="(error, index) in errorList" :key="index">
								{{ error }}
							</div>
						</v-alert>
						<v-text-field
							label="Логин"
							outlined
							dense
							v-model="login"
							hide-details
							class="mb-2"
						></v-text-field>
						<v-text-field
							label="Пароль"
							outlined
							dense
							type="password"
							v-model="password"
							hide-details
						></v-text-field>
					</v-card-text>
					<v-divider></v-divider>
					<v-card-actions>
						<v-btn elevation="0" color="success" block :disabled="!disabledBtn" @click="authorization">Войти</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
	export default {
		name: 'index',
		data() {
			return {
				login: '',
				password: '',
				errorList: [],
			};
		},
		methods: {
			authorization() {
				this.errorList = [];
				return this.$http.post(this.$address + '/login', {
						login: this.login,
						password: this.password,
					})
					.then((data) => {
						this.$store.commit('LOGIN', data.data.profile);
						this.$router.push('/');
					})
					.catch((err) => this.errorList.push(err.response.data.error.message))
					.finally(() => {
						this.login = '';
						this.password = '';
					});
			},
		},
		computed: {
			disabledBtn() {
				return this.login.length && this.password.length;
			},
		},
		mounted() {
			if (this.$store.state.auth.profile) {
				this.$router.push('/');
			}
		},
	};
</script>