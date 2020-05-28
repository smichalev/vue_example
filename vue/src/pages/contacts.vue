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
						<v-toolbar-title>Ваши контакты</v-toolbar-title>
						<v-spacer></v-spacer>
						<v-btn elevation="0" color="red" @click="dialogExit = true">Выйти</v-btn>
					</v-toolbar>
					<div v-if="contacts.length">
						<div class="mx-2 mt-2">
							<v-text-field
								label="Быстрый поиск"
								outlined
								dense
								v-model="searchContact"
								hide-details
								class="mb-2"
							></v-text-field>
						</div>
						<v-divider></v-divider>
						<v-list v-for="contact in filterList" :key="contact.id" two-line>
							<v-list-item>
								<v-list-item-content>
									<v-list-item-title>{{ contact.name }}</v-list-item-title>
								</v-list-item-content>
								<v-list-item-action>
									<v-btn elevation="0" color="error" small text @click="modalRemove(contact)">
										Удалить
									</v-btn>
								</v-list-item-action>
							</v-list-item>
						</v-list>
					</div>
					<div class="title px-2 py-2" v-else>Нет ни одного контакта</div>
					<v-divider></v-divider>
					<v-card-actions class="d-block">
						<v-text-field
							label="Имя пользователя"
							outlined
							dense
							v-model="username"
							hide-details
							class="mb-2"
						></v-text-field>
						<v-btn color="success" elevation="0" block :disabled="!username.length" @click="addNewContact">Добавить новый контакт</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
		<v-dialog v-model="dialogExit" persistent max-width="290">
			<v-card>
				<v-card-title class="headline">Вы уверены?</v-card-title>
				<v-card-text>
					Вы уверены что хотите выйти?
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="error" text @click="logout">Выйти</v-btn>
					<v-btn color="primary" text @click="dialogExit = false">Отмена</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-dialog v-model="dialogRemove" persistent max-width="290">
			<v-card>
				<v-card-title class="headline">Вы уверены?</v-card-title>
				<v-card-text>
					Вы уверены что хотите удалить этот контакт?
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="error" text @click="removeContact">Удалить</v-btn>
					<v-btn color="primary" text @click="closeModalRemove">Отмена</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script>
	export default {
		name: 'index',
		data() {
			return {
				target: null,
				username: '',
				searchContact: '',
				dialogExit: false,
				dialogRemove: false,
				contacts: [],
			};
		},
		computed: {
			filterList() {
				return this.contacts.filter(item => item.name.indexOf(this.searchContact) !== -1);
			},
		},
		methods: {
			addNewContact() {
				if (this.username.length) {
					return this.$http.post(this.$address + '/list', {
							name: this.username,
						})
						.then((data) => {
                            this.contacts.push(data.data.contacts);
							this.username = '';
						});
				}
			},
			modalRemove(index) {
				this.target = index;
				this.dialogRemove = true;
			},
			closeModalRemove() {
				this.target = null;
				this.dialogRemove = false;
			},
			removeContact() {
				return this.$http.delete(this.$address + '/list/'+this.target._id)
					.then(() => {
						this.contacts = this.contacts.filter((item) => item !== this.target);
						this.target = null;
						this.dialogRemove = false;
					});
			},
			logout() {
				return this.$http.post(this.$address + '/logout')
					.then(() => {
						this.$store.commit('LOGOUT');
						this.dialogExit = false;
						this.$router.push('/login');
					});
			},
		},
		mounted() {
			if (!this.$store.state.auth.profile) {
				this.$router.push('/login');
			}
			else {
				return this.$http.get(this.$address + '/list')
					.then((data) => {
						this.contacts = data.data.contacts;
					});
			}
		},
	};
</script>

<style scoped>
	.v-list--two-line .v-list-item, .v-list-item--two-line {
		min-height: 0;
	}
</style>
