<template>
	<v-row class="">
		<v-col align="start" justify="start" class="ml-6" cols="12">
			<span style="font-weight: 700 !important; font-size:60px; color: #2C6796 ">
				Profile
			</span>
			<v-divider
				style="  border-color: #2C6796 !important; width:205px !important;"
				class=""
			></v-divider>
		</v-col>

		<v-col align="center" justify="center" class="mx-1 " cols="12">
			<ApolloQuery
				:query="require('@/graphql/User/getUser.gql')"
				:variables="{
					userId,
				}"
			>
				<template v-slot="{ result: { error, data } }">
					<v-card class="text-center" outlined max-width="450px" elevation="0">
						<v-card-title>
							Personal Information
						</v-card-title>
						<v-card-subtitle class="text-start">
							Update your name in our system
						</v-card-subtitle>
						<v-flex xs12 class="mx-4">
							<v-text-field
								dense
								label="name"
								:placeholder="data.User[0].name"
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
									<v-alert text type="success" v-model="userUpdatedAlert">
										User Updated!
									</v-alert>
								</v-col>
								<v-col cols="6">
									<v-btn @click="emitChangeCard()" outlined small color="red">Delete Account</v-btn>
								</v-col>
								<v-col cols="6">
									<ApolloMutation
										:mutation="require('@/graphql/User/UpdateUser.gql')"
										:variables="{
											name,
											userId,
										}"
										@done="showUserUpdatedAlert"
									>
										<template v-slot="{ mutate, loading, error }">
											<v-btn
												:disabled="!name.length"
												outlined
												small
												:loading="loading"
												@click.native="mutate"
												color="green"
											>
												Update
											</v-btn>

											<p v-if="error">Ocorreu um erro: {{ error }}</p>
										</template>
									</ApolloMutation>
								</v-col>
							</v-row>
						</v-card-actions>
					</v-card>

					<p v-if="error">Errpr: {{ error }}</p>
				</template>
			</ApolloQuery>
		</v-col>
	</v-row>
</template>
<script>
export default {
	data: () => ({
		userId: "",
		name: "",
		userUpdatedAlert: false,
	}),

	mounted() {
		this.userId = localStorage.getItem("apollo-token")
	},

	methods: {
		showUserUpdatedAlert() {
			this.userUpdatedAlert = true

			setTimeout(() => {
				this.userUpdatedAlert = false
			}, 3000)
		},
	},
}
</script>
