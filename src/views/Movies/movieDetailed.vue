<template>
	<ApolloQuery
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
					<v-col cols="6">
						<v-img contain height="650px" :src="data.Movie[0].poster"></v-img>
					</v-col>
					<v-col class=" mt-6" cols="6">
						<v-row>
							<v-col cols="12">
								<v-rating
									class="ml-n3"
									large
									v-model="rating"
									color="yellow darken-3"
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
				</v-row>
			</div>
			<div v-else class="no-result apollo">Nenhuma informação encontrada :(</div>
		</template>
	</ApolloQuery>
</template>
<script>
export default {
	name: "MovieDetailed",

	data: () => ({
		rating: undefined,
		movie: undefined,
	}),

	mounted() {
		this.rating = (5 * this.movie.imdbRating) / 10
	},

	methods: {
		setMovieData(result) {
			this.movie = result.data.Movie[0]
		},
	},
}
</script>
