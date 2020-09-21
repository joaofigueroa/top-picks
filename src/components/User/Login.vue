<template>
	<v-card elevation="0">
		<v-card-title>
			Login
		</v-card-title>
		<v-card-subtitle>
			faça seu login
		</v-card-subtitle>
		<v-flex xs12 class="mx-2">
			<v-text-field
				dense
				label="Usuário"
				v-model="name"
				rounded
				color="primary"
				outlined
				append-icon="mdi-user"
			></v-text-field>
		</v-flex>

		<v-card-actions>
			<v-row class=" mx-2 d-flex justify-center">
				<v-col cols="6">
					<ApolloQuery
						:skip="skipQuery"
						:variables="{
							name,
						}"
						:update="data => data.User"
						@result="saveToken"
						:query="require('@/graphql/User/Login.gql')"
					>
						<template v-slot="{ result: { error } }">
							<v-btn @click="performQuery()" outlined small color="primary">Login</v-btn>

							<p v-if="error">Errpr: {{ error }}</p>
						</template>
					</ApolloQuery>
				</v-col>
				<v-col cols="6">
					<v-btn @click="emitChangeCard()" outlined small color="secondary">Registrar</v-btn>
				</v-col>
			</v-row>
		</v-card-actions>
	</v-card>
</template>

<script>
import { onLogin } from "@/vue-apollo"
export default {
	data: () => ({
		name: "",
		skipQuery: true,
	}),

	watch: {},

	methods: {
		emitChangeCard() {
			this.$emit("changeCard")
		},

		performQuery() {
			this.skipQuery = false
			setTimeout(() => {
				this.skipQuery = true
			}, 500)
		},

		saveToken(result) {
			const token = result.data[0].userId
			onLogin(this.$apollo.provider.defaultClient, token)
			location.reload()
		},
	},
}
</script>
