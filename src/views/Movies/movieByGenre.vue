<template>
	<v-container fill-height fluid>
		<v-row class="mx-2">
			<v-col cols="12">
				<ApolloQuery
					v-if="search.length == 0"
					:query="require('@/graphql/Movies/GetMoviesByGenre.gql')"
					:variables="{
						name: $route.params.name,
					}"
				>
					<template v-slot="{ result: { loading, error, data } }">
						<div v-if="loading" class="loading apollo">
							<v-progress-circular indeterminate color="black"></v-progress-circular>
						</div>
						<div v-else-if="error" class="error apollo">Um erro ocorreu :(</div>
						<div v-else-if="data" class=" result apollo">
							<v-row>
								<v-col class="ml-6" cols="12">
									<span style="font-weight: 700 !important; font-size:60px; color: #2C6796 ">
										{{ $route.params.name }}
									</span>
									<v-divider
										style="  border-color: #2C6796 !important;  !important;"
										class=""
									></v-divider>
								</v-col>

								<v-col v-for="movie in data.Genre[0].movies" :key="movie.id" cols="3">
									<MovieCard :movie="movie"></MovieCard>
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
								<v-col v-for="movie in data.Movie" :key="movie.id" cols="12">
									<v-row>
										<v-col cols="3">
											<MovieCard :movie="movie"></MovieCard>
										</v-col>
									</v-row>
								</v-col>
							</v-row>
							<v-row v-if="data.Movie[0]" align="center" justify="center">
								<v-col cols="12">
									<span style="font-weight: 700 !important; font-size:45px; color: #2C6796 ">
										Similar Movies
									</span>
									<v-divider
										style="  border-color: #2C6796 !important;  !important;"
										class=""
									></v-divider>
								</v-col>

								<v-col v-for="movie in data.Movie[0].similarMovies" :key="movie.id" cols="2">
									<MovieCard :movie="movie"></MovieCard>
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
	computed: {
		search() {
			return this.$store.getters.search
		},
	},
}
</script>
