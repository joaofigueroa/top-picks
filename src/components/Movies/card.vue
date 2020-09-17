<template>
	<v-hover v-slot:default="{ hover }">
		<v-card
			@click.native="$router.push('/detalhes-filme/' + movie.title)"
			:elevation="hover ? 12 : 2"
			width="320"
		>
			<v-row>
				<v-col cols="12">
					<v-img
						lazy-src="https://cdn.vuetifyjs.com/images/parallax/material2.jpg"
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
								v-model="rating"
								color="yellow darken-3"
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
export default {
	name: "MovieCard",

	props: ["movie"],

	components: {},

	data: () => ({
		rating: undefined,
	}),

	mounted() {
		this.rating = (5 * this.movie.imdbRating) / 10
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
