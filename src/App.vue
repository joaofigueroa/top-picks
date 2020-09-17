<template>
	<v-app>
		<div v-if="isUserLoggedIn">
			<AppBar></AppBar>
		</div>
		<v-container class="ma-0 pa-0">
			<v-main>
				<router-view></router-view>
			</v-main>
		</v-container>
	</v-app>
</template>

<script>
import { isAuthenticated } from "./vue-apollo"
import AppBar from "@/components/Navigation/AppBar"
export default {
	name: "App",

	components: {
		AppBar,
	},

	data: () => ({
		//
	}),
	computed: {
		isUserLoggedIn() {
			return isAuthenticated()
		},
	},
}
</script>
