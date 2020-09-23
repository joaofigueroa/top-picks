<template>
	<ApolloQuery
		:key="$route.params.name"
		:variables="{
			title: $route.params.name,
		}"
		@result="setMovieData"
		:query="require('@/graphql/Movies/GetMovieDetailed.gql')"
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
							{{ data.Movie[0].title }}
						</span>
						<v-divider
							style="  border-color: #2C6796 !important;  !important;"
							class=""
						></v-divider>
					</v-col>
					<v-col class="mx-1 " cols="12" md="5">
						<v-img contain height="650px" :src="data.Movie[0].poster"></v-img>
					</v-col>
					<v-col class="mx-1  mt-6" cols="12" sm="5">
						<v-row>
							<v-col cols="12">
								<v-rating
									:key="$route.params.name"
									class="ml-n3"
									large
									v-model="rating"
									:color="starColor"
									background-color="grey darken-1"
									empty-icon="$ratingFull"
									half-increments
									hover
								></v-rating>
								<span style="font-weight: 700 !important; font-size:45px; color: #2C6796 ">
									Plot
								</span>
								<br />
								<span style=" font-size:20px; color: #2C6796 ">
									{{ data.Movie[0].plot }}
								</span>
								<br />
							</v-col>

							<v-col align="start" cols="12">
								<span style="font-weight: 700 !important;  font-size:20px; color: #2C6796 ">
									Budget: $
								</span>
								<span style=" font-size:20px; color: #2C6796 ">
									{{ data.Movie[0].budget }}
								</span>
							</v-col>

							<v-col align="start" cols="12">
								<span style="font-weight: 700 !important;  font-size:20px; color: #2C6796 ">
									Revenue: $
								</span>
								<span style=" font-size:20px; color: #2C6796 ">
									{{ data.Movie[0].revenue }}
								</span>
							</v-col>
							<v-col align="start" cols="12">
								<span style="font-weight: 700 !important;  font-size:20px; color: #2C6796 ">
									Languagues:
								</span>
								<span
									v-for="(languague, index) in data.Movie[0].languages"
									:key="index"
									style=" font-size:20px; color: #2C6796 "
								>
									{{ index > 0 ? "," : "" }} {{ languague }}
								</span>
							</v-col>

							<v-col align="start" cols="12">
								<span style="font-weight: 700 !important;  font-size:20px; color: #2C6796 ">
									Year:
								</span>
								<span style=" font-size:20px; color: #2C6796 ">
									{{ data.Movie[0].year }}
								</span>
							</v-col>
							<v-col align="start" cols="12">
								<a :href="data.Movie[0].url" target="_blank">
									<v-img
										contain
										height="30px"
										width="70px"
										:src="require('@/assets/imdb.png')"
									></v-img>
								</a>
							</v-col>
						</v-row>
					</v-col>

					<v-col class="ml-6" cols="12">
						<span style="font-weight: 700 !important; font-size:45px; color: #2C6796 ">
							Similar Movies
						</span>
						<v-divider
							style="  border-color: #2C6796 !important;  !important;"
							class=""
						></v-divider>
					</v-col>

					<v-col cols="12">
						<v-sheet class="mx-auto" elevation="0">
							<v-slide-group v-model="slide" class="pa-2" show-arrows>
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
</template>
<script>
import MovieCard from "@/components/Movies/card"
const GET_RATED_MOVIES = require("@/graphql/Movies/GetMoviesRatedByUser.gql")
export default {
	name: "MovieDetailed",

	data: () => ({
		rating: undefined,
		movie: undefined,
		initialRated: false,
		movieRatedByUser: false,
		starColor: "yellow darken-3",
		slide: null,
	}),
	components: {
		MovieCard,
	},
	watch: {
		rating: function() {
			if (this.initialRated) this.mutateMovieRating()
		},
	},

	mounted() {},

	methods: {
		setMovieData(result) {
			this.movie = result.data.Movie[0]
			this.rating = (5 * this.movie.imdbRating) / 10
			this.queryUserRatings()
		},
		mutateMovieRating() {
			this.starColor = "blue darken-3"
			this.$apollo
				.mutate({
					mutation: this.movieRatedByUser
						? require("@/graphql/Movies/UpdateRateMovie.gql")
						: require("@/graphql/Movies/RateMovie.gql"),
					variables: {
						userId: localStorage.getItem("apollo-token"),
						movieId: this.movie.movieId,
						rating: this.rating,
						timestamp: Math.round(new Date().getTime() / 1000),
					},
					update: this.updateCache,
				})
				.then(data => {
					// Result
					this.movieRatedByUser = true
				})
		},
		queryUserRatings() {
			this.$apollo
				.query({
					query: require("@/graphql/Movies/GetMoviesRatedByUser.gql"),
					variables: { userId: localStorage.getItem("apollo-token") },
				})
				.then(data => {
					this.moviesRatedByUser = data.data.User[0].RATED_rel

					this.checkMovieAlreadyRated()
				})
		},

		checkMovieAlreadyRated() {
			this.moviesRatedByUser.forEach(movieAlreadyRated => {
				if (movieAlreadyRated.Movie.movieId == this.movie.movieId) {
					this.starColor = "blue darken-3"
					this.rating = movieAlreadyRated.rating
					this.movieRatedByUser = true
				}
			})
			setTimeout(() => {
				this.initialRated = true
			}, 0)
		},
		updateCache(store, { data: { MergeUserRATED_rel } }) {
			const query = {
				query: GET_RATED_MOVIES,
				variables: { userId: localStorage.getItem("apollo-token") },
			}
			const data = store.readQuery(query)
			data.User[0].RATED_rel.push({ ...MergeUserRATED_rel.from })
			store.writeQuery({
				...query,
				data,
			})
		},
	},
}
</script>
