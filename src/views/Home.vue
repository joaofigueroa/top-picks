<template>
	<v-container fill-height fluid>
		<v-row class="mx-2">
			<v-col cols="12">
				<ApolloQuery
					v-if="search.length == 0"
					:variables="{
						userId,
					}"
					:query="require('@/graphql/Movies/GetRecommendedMovies.gql')"
				>
					<template v-slot="{ result: { loading, error, data } }">
						<div v-if="loading" class="loading apollo">
							<v-progress-circular indeterminate color="black"></v-progress-circular>
						</div>
						<div v-else-if="error" class="error apollo">Um erro ocorreu :(</div>
						<div v-else-if="data" class=" result apollo">
							<v-row v-if="data.User[0].recommendedMovies.length">
								<v-col cols="12">
									<span
										style="cursor: pointer !important; font-weight: 700 !important; font-size:30px; color: #2C6796 "
									>
										Recommended Movies
									</span>
									<v-divider
										style="  border-color: #2C6796 !important; width:80% !important;"
										class=""
									></v-divider>
								</v-col>
								<v-col cols="12">
									<v-sheet class="" elevation="0">
										<v-slide-group v-model="slide" show-arrows>
											<v-slide-item
												v-for="movie in data.User[0].recommendedMovies"
												:key="movie.id"
												v-slot:default="{ active, toggle }"
											>
												<MovieCard
													width="100"
													class="ma-2"
													:color="active ? 'primary' : 'grey lighten-1'"
													:key="movie.id"
													@click="toggle"
													:movie="movie"
												></MovieCard>
											</v-slide-item>
										</v-slide-group>
									</v-sheet>
								</v-col>
							</v-row>
							<v-row v-else>
								<v-col class="mx-2 text-start" cols="12">
									<span
										style="cursor: pointer !important; font-weight: 300 !important; font-size:18px; color: #2C6796 "
									>
										Start rating movies to get recommendations...
									</span>
								</v-col>
							</v-row>
						</div>
						<div v-else class="no-result apollo">Nenhuma informação encontrada :(</div>
					</template>
				</ApolloQuery>

				<ApolloQuery
					v-if="search.length == 0"
					:query="require('@/graphql/Movies/GetHomeMovies.gql')"
				>
					<template v-slot="{ result: { loading, error, data } }">
						<div v-if="loading" class="loading apollo">
							<v-progress-circular indeterminate color="black"></v-progress-circular>
						</div>
						<div v-else-if="error" class="error apollo">Um erro ocorreu :(</div>
						<div v-else-if="data" class=" result apollo">
							<v-row>
								<v-col v-for="genre in data.Genre" :key="genre.id" cols="12">
									<span
										@click="$router.push('/filmes-genero/' + genre.name)"
										style="cursor: pointer !important; font-weight: 700 !important; font-size:30px; color: #2C6796 "
										v-if="genre.name != '(no genres listed)'"
									>
										{{ genre.name }}
									</span>
									<v-divider
										v-if="genre.name != '(no genres listed)'"
										style="  border-color: #2C6796 !important; width:205px !important;"
										class=""
									></v-divider>
									<v-row v-if="genre.name != '(no genres listed)'">
										<v-col cols="12">
											<v-sheet class=" ma-2" elevation="0">
												<v-slide-group v-model="slide" class="" show-arrows>
													<v-slide-item
														v-for="movie in genre.movies"
														:key="movie.id"
														v-slot:default="{ active, toggle }"
													>
														<MovieCard
															width="100"
															class="ma-2"
															:color="active ? 'primary' : 'grey lighten-1'"
															:key="movie.id"
															@click="toggle"
															:movie="movie"
														></MovieCard>
													</v-slide-item>
												</v-slide-group>
											</v-sheet>
										</v-col>
									</v-row>
								</v-col>
							</v-row>
						</div>
						<div v-else class="no-result apollo">Nenhuma informação encontrada :(</div>
					</template>
				</ApolloQuery>

				<ApolloQuery
					v-else
					:query="require('@/graphql/Movies/SearchMovie.gql')"
					:variables="{
						title: search,
					}"
				>
					<template v-slot="{ result: { loading, error, data } }">
						<span style="font-weight: 700 !important; font-size:60px; color: #2C6796 ">
							{{ search }}
						</span>
						<v-divider
							style="  border-color: #2C6796 !important; width:205px !important;"
							class=""
						></v-divider>
						<div v-if="loading" class="loading apollo">
							<v-progress-circular indeterminate color="black"></v-progress-circular>
						</div>
						<div v-else-if="error" class="error apollo">Um erro ocorreu :(</div>
						<div v-else-if="data" class=" result apollo">
							<v-row>
								<v-col cols="12">
									<v-sheet class=" ma-2" elevation="0">
										<v-slide-group v-model="slide" class="" show-arrows>
											<v-slide-item
												v-for="movie in data.Movie"
												:key="movie.id"
												v-slot:default="{ active, toggle }"
											>
												<MovieCard
													width="100"
													class="ma-2"
													:color="active ? 'primary' : 'grey lighten-1'"
													:key="movie.id"
													@click="toggle"
													:movie="movie"
												></MovieCard>
											</v-slide-item>
										</v-slide-group>
									</v-sheet>
								</v-col>
							</v-row>
							<v-row v-if="data.Movie" align="center" justify="center">
								<v-col cols="12">
									<span style="font-weight: 700 !important; font-size:45px; color: #2C6796 ">
										Similar Movies
									</span>
									<v-divider
										style="  border-color: #2C6796 !important;  !important;"
										class=""
									></v-divider>
								</v-col>

								<v-col cols="12">
									<v-sheet class=" ma-2" elevation="0">
										<v-slide-group v-model="slide" class="" show-arrows>
											<v-slide-item
												v-for="movie in data.Movie[0].similarMovies"
												:key="movie.id"
												v-slot:default="{ active, toggle }"
											>
												<MovieCard
													width="100"
													class="ma-2"
													:color="active ? 'primary' : 'grey lighten-1'"
													:key="movie.id"
													@click="toggle"
													:movie="movie"
												></MovieCard>
											</v-slide-item>
										</v-slide-group>
									</v-sheet>
								</v-col>
							</v-row>
						</div>
						<div v-else class="no-result apollo">Nenhuma informação encontrada :(</div>
					</template>
				</ApolloQuery>
			</v-col>
		</v-row>
	</v-container>
</template>
<script>
import MovieCard from "@/components/Movies/card"
export default {
	components: {
		MovieCard,
	},

	data: () => ({
		userId: localStorage.getItem("apollo-token"),
		slide: null,
		slide2: null,
	}),
	mounted() {},

	computed: {
		search() {
			return this.$store.getters.search
		},
	},
}
</script>
