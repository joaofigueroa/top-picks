<template>
	<v-hover v-slot:default="{ hover }">
		<v-card :elevation="hover ? 12 : 2" width="250">
			<v-row>
				<v-col cols="12">
					<v-img
						style="cursor: pointer !important;"
						@click.native="$router.push('/detalhes-filme/' + movie.title)"
						:lazy-src="movie.poster"
						height="250"
						contain
						:src="movie.poster"
					>
						<template v-slot:placeholder>
							<v-row class="fill-height ma-0" align="center" justify="center">
								<v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
							</v-row>
						</template>
					</v-img>
				</v-col>
				<v-col class="d-flex justify-center" cols="12">
					<span class="text">{{ movie.title }}</span>
				</v-col>
				<v-col cols="12">
					<v-expand-transition>
						<v-layout row-wrap v-show="hover">
							<v-rating
								:key="movie.movieId"
								v-model="rating"
								:color="starColor"
								background-color="grey darken-1"
								empty-icon="$ratingFull"
								half-increments
								hover
							></v-rating>
						</v-layout>
					</v-expand-transition>
				</v-col>
			</v-row>
		</v-card>
	</v-hover>
</template>
<script>
const GET_RATED_MOVIES = require("@/graphql/Movies/GetMoviesRatedByUser.gql")
export default {
	name: "MovieCard",

	props: ["movie"],

	components: {},

	data: () => ({
		initialRated: false,
		rating: undefined,
		userId: localStorage.getItem("apollo-token"),
		movieId: "",
		timestamp: "",
		starColor: "yellow darken-3",
		moviesRatedByUser: [],
		movieRatedByUser: false,
		mobileDevice: screen.width < 450 ? true : false,
	}),

	watch: {
		rating: function() {
			if (this.initialRated) this.mutateMovieRating()
		},
	},

	mounted() {
		this.rating = (5 * this.movie.imdbRating) / 10
		this.movieId = this.movie.movieId

		this.queryUserRatings()
		window.addEventListener("resize", this.checkScreenResize)
	},

	methods: {
		checkScreenResize() {
			if (screen.width < 450) this.mobileDevice = true
			else this.mobileDevice = false
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
						movieId: this.movieId,
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
	},
}
</script>
<style scoped>
.text {
	display: block;
	width: 100px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
</style>
