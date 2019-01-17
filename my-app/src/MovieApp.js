import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import Select from 'react-select';
import axios from 'axios';
import './MovieApp.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

const columns = [{
  dataField: 'Title',
  text: 'Title'
}, {
  dataField: 'genres',
  text: 'Genres',
}, {
  dataField: 'actor',
  text: 'Actor',
}, {
  dataField: 'actress',
  text: 'Actress',
}, {
  dataField: 'director',
  text: 'Director',
}, {
  dataField: 'Year',
  text: 'Year',
}, {
  dataField: 'runtimeMinutes',
  text: 'RuntimeMinutes',
},{
  dataField: 'tconst',
  text: 'Imdb'
}];
const apiKey = '9d2bff12ed955c7f1f74b83187f188ae'


class MovieApp extends Component {
  constructor(props) {
    super(props)
    this.state = {
        selectedOption: null,
        isLoading: false,
        youTubeUrl: null
    }
  }

  handleChange = (selectedOption) => {
    this.setState({selectedOption})
    const movieId = selectedOption === null ? '' : selectedOption.value
    if (movieId !== '') {
      const url = 'https://api.themoviedb.org' + encodeURI('/3/movie/' + movieId + '/videos?api_key=' + apiKey)
      axios.get(url)
        .then(response => {
          console.log(response)
          this.setState({isLoading: true})
          const urlKey = response.data.results.length === 0 ? null : response.data.results[0].key
          const youTubeUrl = urlKey === '' ? null : encodeURI('https://www.youtube.com/embed/' + urlKey + '?autoplay=1')
          this.setState({
            youTubeUrl: youTubeUrl,
            isLoading: false
          })
        }).catch(error => {
          // handle error
          console.log(error);
        })
    }
  }

  render() {
    const {selectedOption, isLoading, youTubeUrl} = this.state
    const {movies, recommendations} = this.props
    const options = []
    movies.forEach((movie)=>{
        options.push(
          {
            value: movie.imdb,
            label: movie.Title
          }
        )
    })
    const value = selectedOption === null ? '' : selectedOption.value
    const selectedMovie = movies.filter((movie) => {
      return movie.imdb === value
    })[0]; // return selectedMovie Array
    const movieInfo = []
    if (selectedMovie !== null && selectedMovie !== undefined){
        Object.entries(selectedMovie).forEach(
          ([key, value]) => {
            if(key === 'imdb' || key === 'genres' || key === 'runtimeMinutes' || key === 'actor' || key === 'actress' || key === 'director' || key === 'Year'){
                movieInfo.push(<li>{key[0].toUpperCase() + key.substring(1, key.length)} : {value}</li>)
            }
          }
        )
    }
    const selectedMovieRecommendations = recommendations.filter((recommendation) => {
      return Object.keys(recommendation)[0] === value
    })  // return selectedMovieRecommendation Array
    const recommendationsInfo = selectedMovieRecommendations.map((recommendation) => {
      return Object.values(recommendation)[0]
    })
    const youTubeVideo = youTubeUrl !== null ?
      <iframe
        width="560"
        height="315"
        src={youTubeUrl}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen>
      </iframe> : ''
    return (
      <div className="wrapper">
        <header className="header">
          <a href="https://fontmeme.com/netflix-font/">
          <img src="https://fontmeme.com/permalink/181203/5adde3ebbdc631a007dbbad96819fbb1.png" alt="netflix-font" border="0"/>
        </a>
        </header>
        <section className="content">
          <div className="columns">
            <main className="main">
              <div>
                  <div><b>Choose a movie you enjoy: </b></div>
                  <div className='selector' style={{marginTop:'12px', marginBottom:'12px', width:'50%'}}>
                    <Select
                      value={selectedOption}
                      onChange={this.handleChange}
                      options={options}
                      isSearchable={true}
                    />
                  </div>
              </div>
              <div>
                  <ul>
                    {movieInfo}
                  </ul>
              </div>
              <div>
                {youTubeVideo}
              </div>
            </main>
            <aside className="sidebar">
              <div>
                <b>Recommendations:</b>
              </div>
              <div style={{width:'100%', marginTop:'12px'}}>
                <BootstrapTable
                  keyField="tconst"
                  data={recommendationsInfo}
                  columns={columns}
                  striped
                  hover
                  condensed
                />
              </div>
              <div>
                Interested in learning more about the recommendation model?
              </div>
            </aside>
           </div>
        </section>
        <footer className="footer"><b>Created by Sarah Tan @ 2018</b></footer>
      </div>
    );
  }
}


export default MovieApp;
