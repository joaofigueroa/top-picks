<template>
	<v-container fill-height fluid>
		<v-row align="center" justify="center" class="mx-2">
			<v-card elevation="10" max-width="720px">
				<v-row align="center" justify="center">
					<v-col cols="6">
						<ApolloQuery :query="require('@/graphql/Movies/GetMoviesPosters.gql')">
							<template v-slot="{ result: { loading, error, data } }">
								<div v-if="loading" class="loading apollo">
									<v-progress-circular indeterminate color="black"></v-progress-circular>
								</div>
								<div v-else-if="error" class="error apollo">Um erro ocorreu :(</div>
								<div v-else-if="data" class="result apollo">
									<v-img
										class="ma-2"
										max-height="650px"
										contain
										:src="data.Movie[Math.floor(Math.random() * 100)].poster"
									></v-img>
								</div>
								<div v-else class="no-result apollo">Nenhuma informação encontrada :(</div>
							</template>
						</ApolloQuery>
					</v-col>
					<v-col class=" block d-flex justify-center" cols="6">
						<login-card v-if="loginCard" @changeCard="changeCard"></login-card>

						<register-card v-else @changeCard="changeCard"></register-card>
					</v-col>
				</v-row>
			</v-card>
		</v-row>
	</v-container>
</template>

<script>
import LoginCard from "@/components/User/Login"
import RegisterCard from "@/components/User/Register"
export default {
	components: {
		LoginCard,
		RegisterCard,
	},

	data: () => ({
		loginCard: true,
	}),

	methods: {
		changeCard() {
			this.loginCard = !this.loginCard
		},
	},
}
</script>
<style scoped>
.slide-left-out-anim {
	animation-name: slide-left-out !important;
	animation-duration: 2000ms !important;
	animation-iteration-count: 1 !important;
	animation-fill-mode: forwards !important;
	animation-timing-function: ease-in-out !important;
}
.pulse-anim {
	animation-name: pulse;
	animation-duration: 2000ms;
	animation-iteration-count: infinite;
	animation-fill-mode: forwards;
	animation-timing-function: ease-in-out;
}
</style>
