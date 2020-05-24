$(document).ready(function () {
    let allData = [];
    getAllData();

    // !ACTIONS
    // ==============  Click on genre  ============== //
    function clickedGenre() {
        let genreArray = [];
        let ageArray = [];
        $('.genre-btn').click(function (e) {
            e.preventDefault();
            $(this).toggleClass("btn-dark btn-primary");
            const genreName = $(this).data("name");
            $(this).attr('data-state', $(this).attr('data-state') == 'true' ? 'false' : 'true');
            let checkIfActive = $(this).attr('data-state');

            if (checkIfActive === 'true') {
                genreArray.push(genreName);
            } else {
                genreArray = $.grep(genreArray, function (value) {
                    return value != genreName;
                });
            }
            console.log(genreArray);
            genresByName(genreArray);
        });
    }

    // !API CALLS
    // ==============  Get  all data  ============== //
    function getAllData() {
        $.ajax({
            url: 'http://localhost:3000/allData',
            method: 'get',
            type: 'json',
            success: function (data) {
                allData = data;
                cachedData = data;
                getAllGenres(printRandomData(data));
            },
            error: function (request, error) {
                console.error("Request: " + JSON.stringify(request));
            }
        });
    }
    // ==============  Get all genres ============== //
    function getAllGenres(data) {
        let genres = [];
        for (let q of allData) {
            let genre = q.genre;
            let capitalize = capitalizeString(genre);
            let trimedString = trimString(capitalize);
            genres.push(trimedString);
        }
        genres = sortByString(filterDublicates(genres));
        makeFilterGenres(genres)
    }
    // ==============  Get genre by id  ============== //
    function genresByName(genreArray) {
        console.log(typeof genreArray !== 'undefined' && genreArray.length == 0);
        if( typeof genreArray !== 'undefined' && genreArray.length == 0 ) {
            $("#data").empty();
            printRandomData(allData);
        } else {
            $("#data").empty();
            printData(filterByGenre(genreArray));
        }
    }
    // !PRINT FUNCTIONS
    // ==============  create random cards
    function printRandomData(dataArray) {
        const number = 10;
        let randomArray = [];
        for (let i = 0; i < number; i++) {
            randomArray.push(dataArray[Math.floor(Math.random() * dataArray.length)]);
        }
        randomArray = filterDublicates(randomArray);
        printData(randomArray);
    }
    // ==============  Make Cards by genre
    function printData(dataGenre) {
        dataGenre = sortByName(dataGenre, "name", "asc");
        console.log(dataGenre);

        for (let q of dataGenre) {
            let html = `<div class="card col-3" style="width: 18rem;">
                        <img src="${q.thumbnail.url}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <p>${q.genre}</p>
                            <p>${q.age}</p>
                            <h5 class="card-title">${q.name}</h5>
                            <p class="card-text">${q["social-share-description"]}</p>
                            <a href="${q["link-to-video"].url}" class="btn btn-primary">Go somewhere</a>
                        </div>
                    </div>`;

            $('main #data').append(html);
        }

    }

    // ==============  Make Filter with genres
    function makeFilterGenres(genres) {
        for (let q of genres) {
            $('main .genre-filter').append(`<a href='#${q}' class="btn btn-dark genre-btn m-2" data-state="false" data-name="${q}">${q}</a>`);
        }
        clickedGenre();
    }
    function filterByGenre(genreArray) {
        let dataGenre = [];
        for (let array in genreArray) {
            for (let q of allData) {
                let genre = capitalizeString(q.genre)
                if (genre == genreArray[array]) {
                    dataGenre.push(q)
                }
            }
        }
        return dataGenre;
    }

    // !STRING FUNCTIONS
    // ==============  Filter Dublicate  ============== //
    let filterDublicates = (array) => {
        let filtered = _.uniq(array);
        filtered = removeEmpty(filtered, "");
        return filtered;
    }
    // ==============  Remove empty  ============== //
    let removeEmpty = (array, e) => {
        return _.without(array, e);
    }
    // ==============  Trim string  ============== //
    let trimString = (str) => {
        return str.trim()
    }
    // ==============  Capitalize Dublicate  ============== //
    let capitalizeString = (str) => {
        return _.capitalize(str);
    }
    // ==============  Sort by string  ============== //
    let sortByString = (str) => {
        return _.sortBy(str);
    }
    // ==============  Sort by name  ============== //
    let sortByName = (str, param, sort) => {
        return _.orderBy(str, [param], [sort]);
    }
});