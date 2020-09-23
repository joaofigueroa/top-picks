<template>
	<v-app-bar color="#2C6796" dark>
		<v-toolbar-title
			style=" cursor:pointer !important; font-weight:700 !important; font-size:25px !important"
			@click="$router.push('/home')"
			class="title"
		>
			JGLens
		</v-toolbar-title>
		<v-menu class="ma-2" offset-y>
			<template v-slot:activator="{ on, attrs }">
				<v-card v-bind="attrs" v-on="on" color="#2C6796" outlined :hover="true" class="mx-3">
					<v-icon large>mdi-menu-open</v-icon>
				</v-card>
			</template>

			<v-card style="border-radius:20px  !important" max-width="450px" elevation="0" color="white">
				<v-row no-gutters align="center" class="mt-2 mx-2  ">
					<span class="mx-2" style="font-weight: 700 !important; font-size:20px; color: #2C6796 ">
						Genres
					</span>
					<v-flex class="mx-2" xs12>
						<ApolloQuery :query="require('@/graphql/Movies/GetHomeMovies.gql')">
							<template v-slot="{ result: { loading, error, data } }">
								<div v-if="loading" class="loading apollo">
									<v-progress-circular indeterminate color="black"></v-progress-circular>
								</div>
								<div v-else-if="error" class="error apollo">Um erro ocorreu :(</div>
								<div v-else-if="data" class=" result apollo">
									<v-row>
										<v-col v-for="genre in data.Genre" :key="genre.id" cols="4">
											<v-chip-group>
												<v-chip
													@click.native="$router.push('/filmes-genero/' + genre.name)"
													small
													color="#2C6796"
													text-color="white"
													label
													md
												>
													{{ genre.name }}
												</v-chip>
											</v-chip-group>
										</v-col>
									</v-row>
								</div>
								<div v-else class="no-result apollo">Nenhuma informação encontrada :(</div>
							</template>
						</ApolloQuery>
					</v-flex>
				</v-row>
			</v-card>
		</v-menu>

		<v-spacer></v-spacer>

		<v-text-field
			v-if="$route.path.includes('home') || $route.path.includes('genero')"
			outlined
			rounded
			dense
			v-model="search"
			color="white"
			style="border-color: white !important"
			class="d-flex justify-start"
			hide-details
			prepend-inner-icon="mdi-magnify"
			single-line
		></v-text-field>
		<v-spacer></v-spacer>

		<v-menu left bottom>
			<template v-slot:activator="{ on, attrs }">
				<v-btn icon v-bind="attrs" v-on="on">
					<v-icon>mdi-dots-vertical</v-icon>
				</v-btn>
			</template>

			<v-list>
				<v-list-item style=" cursor:pointer !important;" @click="$router.push('/perfil')">
					<v-list-item-icon>
						<v-icon md>mdi-account-details</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						Profile
					</v-list-item-content>
				</v-list-item>
				<v-list-item @click="logout" style=" cursor:pointer !important;">
					<v-list-item-icon>
						<v-icon md color="red">mdi-location-exit</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						Exit
					</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-menu>
	</v-app-bar>
</template>
<script>
import { onLogout } from "@/vue-apollo"

export default {
	data: () => ({
		search: "",
	}),

	watch: {
		search: function() {
			this.$store.commit("setSearch", this.search)
		},
	},

	methods: {
		logout() {
			onLogout(this.$apollo.provider.defaultClient)
			location.reload()
		},
	},
}
</script>
<style scoped>
.v-card {
	border: 1px solid !important;
	border-color: white !important;
}
.v-chip {
	border-radius: 36px !important;
	display: block;
	width: 100px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
</style>
