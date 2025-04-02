
// const fetchData = async(searchTerm) =>{
//     //
//  const response = await axios.get ('http://omdbapi.com', {
//     params: {
//         apikey:'edae8d4e ',
//         s:'avengers'
//     }
//  })
//  if(response.data.Error){
//     return[]
//  }
//     console.log(response.data.Search)

// }
//fetchData()
autocompleteConfig= {
    renderOption(movie){
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster
        return`
        <img src="${imgSrc}" />
        ${movie.Title} (${movie.Year})
        `
    },
    inputValue(movie){
        return movie.Title
    },
    async fetchData(searchTerm){
        apiMovieURL = 'http://www.omdapi.com/'
        const response = await axios.get(apiMovieURL, {
            params: {
                apikey: 'edae8d4e',
                s : searchTerm
            }
        })
        if(response.data.Error){
            return[]
        }

        console.log(response.data)
        return response.data.Search
    }
}

createAutocomplete({
    ...autocompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector('left.summery'), 'left')
    }
})
createAutocomplete({
    ...autocompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector('right.summary'), 'right')
    }
})
//crea dos variables para left movie y right movie

let leftMovie
let rightMovie

const onmovieSelect = async(movie, summaryElement, side) => {
    const response = await axios.get('http://www.omdapi.com/', {
        params: {
            apikey: 'edae8d4e',
            i: movie.imdbID
        }
    })
    console.log(response.data)
    summaryElement.innerHTML = movieTemplate(response.data)

    //preguntamos cual lado es
    if(side === 'left'){
        leftMovie = response.data
    }else{
        rightMovie = response.data
    }
    //preguntamos si tenemos ambos
    if(leftMovie && rightMovie){
        //entonces ejecutamos la funcion de comparacion
        runComparison()
    }
}

const runComparison = () => {
    console.log('comparacion de peliculas')
    const leftSideStats = document.querySelectorAll('#left-summary .notification')
    const rightSideStats = document.querySelectorAll('#right-summary .notification')

    leftSideStats.forEach((leftStat, index)=> {
        const rightStat= rightSideStats[index]
        const leftSideValue = parseInt(leftStat.dataset.value)
        const rightSideStats = parseInt(rightStat.dataset.value)

        if(rightSideValue > leftSideValue){
        leftStat.classList.remove('is-primary')
        leftStat.classList.remove('is-danger')
    }else{
        rightStat.classList.remove('is-primary')
        rightStat.classList.add('is-danger')
    }

    })

}
const movieTEMPLATE = (movieDatails) =>{

    const dollars = parseInt(movieDatails.Box0ffice.replace(/\$/g,'').replace(/,/g,''))
    console.log(dollars)
    const metascore = parseInt(movieDatails.Metascore)
    const imdbRating = parseFloat(movieDatails.imdbRating)
    const imdbVotes = parseInt(movieDatails.imdbVotes.replace(/,/g,''))
    console.log(metascore, imdbRating,imdbVotes)
    const award = movieDatails.awards.split('').reduce((prev, word)=> {
        const value = parseInt(word)

        if(isNaN(value)){
            return prev
        }else{
            return prev + value
        }
    }, 0)
        console.log('Awards', awards)

        //agregar la propiedad data-value a cada elemento del template

        return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <image src="${movieDetails.Poster}"/>
                </p>
            </figure>
            <div xlass="media-content">
                <div class="content>
                    <h1>${movieDetails.Title}</h1>
                    <h4>${movieDetails.Genre}</h4>
                    <p>${movieDetails.Plot}</p>
                </div>
            </div>
        </article>
        <article data-value="${awards} class="notification is-primary">
            <p class="title">${movieDetails.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value="${dollars} class="notification is-primary">
            <p class="title">${movieDetails.BoxOffice}</p>
            <p class="subtitle">BoxOffice</p>
        </article>
        <article data-value="${metascore} class="notification is-primary">
            <p class="title">${movieDetails.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value="${imdbRating} class="notification is-primary">
            <p class="title">${movieDetails.imdbRating}</p>
            <p class="subtitle">IMBD Rating</p>
        </article>
        <article data-value="${imdbVotes} class="notification is-primary">
            <p class="title">${movieDetails.imdbVotes}</p>
            <p class="subtitle">IMBD Votes</p>
        </article>

        `

}

//va agarrar el elemento del htlml
const root = document.querySelector('.autocomplete')
root.innerHTML = ` 
    <label><b>Busqueda de Peliculas</b></label>
    <input class= "input"/>
    <div class= "dropdown">
         <div class= "dropdown-menu"/>
            <div class= "dropdown-content results"></div>
         </div>
    </div>
`
const input = document.querySelector("input")
const dropdown = document.querySelector(".dropdown")
const resultsWrapper = document.querySelector(".results")

//esta funcion con una espera para trabajar con la consulta
const debonce = (func, dealay = 1000)=> {
    return(...args)=> {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            func.apply(null, args)
        },dealay)
    }
}

//cuando teclee ocurrira un evento por medio de la variable movie 
const onInput = async(event) => {
    const movies = await fetchData(event.taget.value)
    console.log("Movies ", movies )

    if(!movies.length){
        dropdown.classList.remove('is-active')
        return  
    }

    resultsWrapper.innerHTML = ''
    dropdown.classList.add('is-active')

    for(let movie of movies){
        const option = document.createElement('a')
        const imgSrc= movie.Poster === 'N/A' ?  '': movie.Poster //si hay un poster entonces traer la imagen si no, no existe el poster 

        option.classList.add('')



        option.classList.add('dropdown-item')
        option.innerHTML = `  
            <img src="${imgSrc}" />
            ${movie.Title}

        `
        //cuandole declick va remover el nombre de is-active 
        option.addEventListener('click', () => {
            dropdown.classList.remove('is-active')
            input.value = movie.Title
            onMovieSelect(movie)

        })
        resultsWrapper.appendChild(option)
    }
}
//cuando tecleemmos empazara agregar clases 
 input.addEventListener('input', debonce(onInput,1000))

 document.addEventListener('click', event =>{
    if(!root.contains(event.target )){
        dropdown.classList.remove('is-active')
    }
 })

 const onMovieSelect = async(movie) =>{
    const response = await axios.get('http:www.omdbapi.com/', {
        params:{
            apikey: '',
            i: movie.imdbID
        }
    })
    console.log(response.data)
 document.querySelector('#summary').innerHTML = movieTemplate(response.data)
 }

 const movieTemplate = (movieDetail) => {
    return
    <article class="media">
        <figure class="media-left">
            <p class="image">
                <img src="${movieDetail.Poster}"></img>
            </p>
        </figure>
        <div class="media-content">
             <div class="content">
                <h1>${movieDetail.Title}</h1>
                <h1>${movieDetail.Genre}</h1>
                <p>${movieDetail.Plot}</p>
            </div>
         </div>
    </article>
 }

 