
const fetchData = async(searchTerm) =>{
    //
 const response = await axios.get ('http://omdbapi.com', {
    params: {
        apikey:'edae8d4e ',
        s:'avengers'
    }
 })
 if(response.data.Error){
    return[]
 }
    console.log(response.data.Search)

}
//fetchData()
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

 