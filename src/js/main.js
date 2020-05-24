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

            let boolean = false;

            const genreName = $(this).data("name");
            $(this).attr('data-state', $(this).attr('data-state') == 'true' ? 'false' : 'true');
            let checkIfActive = $(this).attr('data-state');

            if (checkIfActive === 'true') {
                if (genreName != 'adults' && genreName != 'kids') {
                    genreArray.push(genreName);
                } else {
                    ageArray.push(genreName)
                }
            } else {
                genreArray = removeElemFromArray(genreArray, genreName)
                ageArray = removeElemFromArray(ageArray, genreName)
            }

            genresByName(ageArray, genreArray);
        });
    }
    // ==============  remove element from aaray  ============== //
    function removeElemFromArray(array, name) {
        return array = $.grep(array, function (value) {
            return value != name;
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
    function genresByName(ageArray, genreArray) {
        let emptyArray = [];
        let filteredData;
        if( typeof genreArray !== 'undefined' && genreArray.length == 0 && typeof ageArray !== 'undefined' && ageArray.length == 0 ) {
            printRandomData(allData);
        } else {
            if (typeof genreArray !== 'undefined' && genreArray.length == 0) {
                console.log('Age buttons clicked');
                for(let q of allData) {
                    filteredData = filterByAge(emptyArray, ageArray, q);
                }
            } else {
                filteredData = filterByGenre(emptyArray, ageArray, genreArray);
            }

            $("#data").empty();
            printData(filteredData);
        }
    }
    // !PRINT FUNCTIONS
    // ==============  create random cards  ============== //
    function printRandomData(dataArray) {
        const number = 10;
        let randomArray = [];
        for (let i = 0; i < number; i++) {
            randomArray.push(dataArray[Math.floor(Math.random() * dataArray.length)]);
        }
        randomArray = filterDublicates(randomArray);
        printData(randomArray);
    }
    // ==============  Make Cards by genre  ============== //
    function printData(dataGenre) {
        $("#data").empty();
        dataGenre = sortByName(dataGenre, "name", "asc");

        for (let q of dataGenre) {
            let html = `<div data-genre='${capitalizeString(q.genre)}' class="card ${capitalizeString(q.genre)} col-3" style="width: 18rem;">
                        <section> <img src="${q["social-share-image"].url}"> </section>
                        <div class="card-body">
                            <h5 class="card-title bold">${q.name}</h5>
                            <p> ${q["video-length"]} </p>
                            <a href="?slug=${q._id}" class="btn btn-primary info">Lees meeer</a>
                        </div>
                    </div>`;

            $('main #data').append(html);
        }
        $('.card img').css({
            "width": "100%",
        })

        let urlGet = getUrlParameter('slug');

        if (urlGet != undefined) {
            printDetailData(allData , urlGet)
        }

        countCard();
    }

    function printDetailData(data , detailElement) {
        {/* <section>${q["link-to-video"].metadata.html}</section> */}
        let html;
        console.log(detailElement);
        for (let q of data) {
            console.log(q._id)
            if(q._id == detailElement) {
                console.log('ok')
                html = `<div class="jumbotron">
                            <article>
                                <h1>${q.name}</h1>
                                <section>${q["link-to-video"].metadata.html}</section>
                                ${q["key-takeaways"]}
                                <p class="lead">${q["social-share-description"]}</p>
                                <a href="/" class="btn btn-lg btn-primary" href="/docs/4.5/components/navbar/" role="button">Go back »</a>
                            </article>
                        </div>`
                        $(html).appendTo('body');
            } else {
                console.log('nok')
            }
        }
        $('.jumbotron').css({
            "position": "fixed",
            "top": "50%",
            "left": "50%",
            "transform": "translate(-50%, -50%)"
        })
        $('.jumbotron').css({
            "height": "90%",
            "max-height": 540,
            "overflow": "auto"
        })
        $('.jumbotron iframe').css({
            "width": 640,
            "height": 360
        })
    }
    // ==============  Make Filter with genres  ============== //
    function makeFilterGenres(genres) {
        let duplicateArray = [];
        for (let q of genres) {
            for (const data of allData) {
                if (capitalizeString(q) == capitalizeString(data.genre)) {
                    duplicateArray.push(q);
                }
            }
            $('main .genre-filter').append(`<a href='#${q}' class="btn btn-dark genre-btn m-2" data-state="false" data-name="${q}">${q} (${getDuplicates(duplicateArray, q)})</a>`);
        }
        clickedGenre();
    }
    // ==============  FUnction to return duplicates in a number  ============== //
    function getDuplicates(array, value) {
        return array.filter((v) => (v === value)).length;
    }
    // ==============  Filter by selected genre  ============== //
    function filterByGenre(emptyArray, ageArray, genreArray) {
        for (let array in genreArray) {
            for (let q of allData) {
                let genre = capitalizeString(q.genre)
                if (genre == genreArray[array]) {
                    if(ageArray == "") {
                        emptyArray.push(q)
                    } else {
                        emptyArray = filterByAge(emptyArray, ageArray, q);
                    }
                } 
            }
        }
        return emptyArray;
    }
    // ==============  Filter by age  ============== //  
    function filterByAge(emptyArray, ageArray, data) {
        let age = parseInt(data.age);        
        for (let ageArrayName of ageArray) {
            if (ageArrayName === 'adults' && age >= 18 || ageArrayName === 'adults' && isNaN(age)) {
                emptyArray.push(data)
            } else if (ageArrayName === 'kids' && age < 18 ) {
                emptyArray.push(data)
            }
        }
        return emptyArray;
    }
    // ==============  COUNT PRINTED DATA  ============== //  
    function countCard() {
        let card = $('#data .card').length;
        if (card == 0) {
            $('#data').empty();
            $('#data').append(`<h3 class='card-result'>There are 0 results</h3>`);
        } else {
            $('.card-result').remove();
            $('main section:first').append(`<h3 class='card-result'>Result: ${card}</h3>`);
        }
        return card;
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
    // Get url parameter
    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };
});