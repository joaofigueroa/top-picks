<template>
	<v-card elevation="0">
		<v-card-title>
			Cadastro
		</v-card-title>
		<v-card-subtitle>
			faça seu cadastro
		</v-card-subtitle>
		<v-flex xs12 class="mx-2">
			<v-text-field
				dense
				label="Nome Completo"
				v-model="name"
				rounded
				color="primary"
				outlined
				append-icon="mdi-user"
			></v-text-field>
		</v-flex>

		<v-card-actions>
			<v-row class=" mx-2 d-flex justify-center">
				<v-col cols="12">
					<v-alert text type="success" v-model="userCreatedAlert">
						Usuário criado com sucesso!
					</v-alert>
				</v-col>
				<v-col cols="6">
					<v-btn @click="emitChangeCard()" outlined small color="primary">Voltar</v-btn>
				</v-col>
				<v-col cols="6">
					<ApolloMutation
						:mutation="require('@/graphql/User/CreateUser.gql')"
						:variables="{
							name,
						}"
						@done="showUserCreatedAlert"
					>
						<template v-slot="{ mutate, loading, error }">
							<v-btn outlined small :loading="loading" @click.native="mutate" color="secondary">
								Registrar
							</v-btn>

							<p v-if="error">Ocorreu um erro: {{ error }}</p>
						</template>
					</ApolloMutation>
				</v-col>
			</v-row>
		</v-card-actions>
	</v-card>
</template>

<script>
export default {
	data: () => ({
		email: undefined,
		password: undefined,
		name: undefined,
		userCreatedAlert: false,
	}),

	methods: {
		emitChangeCard() {
			this.$emit("changeCard")
		},
		showUserCreatedAlert() {
			this.userCreatedAlert = true

			setTimeout(() => {				
				this.userCreatedAlert = false
			}, 3000)
		},
	},
}
</script>
