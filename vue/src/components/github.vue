<template>
	<div class="github">
		<v-btn color="primary" elevation="0" @click="github"><img src="../assets/github.svg"><span class="ml-2">GitHub</span></v-btn>
	</div>
</template>

<script>
	export default {
		name: 'github',
		methods: {
			github() {
				window.open('https://github.com/smichalev/vue_example');
			},
		},
	};
</script>

<style scoped>
	.github {
		display: block;
		position: absolute;
		top: 30px;
		right: 30px;
	}
</style>