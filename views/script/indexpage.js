const getData = async () => {
    try {
        // fetch data here
        const fetchs = await fetch('http://localhost:4000/fetch');

        // convert data to json
        const data = await fetchs.json();

        // create cards here
        for (let i = 0; i < data.length; i++) {
            const cardWrap = document.createElement('div');
            cardWrap.classList.add("cards", "col-sm-12", "col-md-6", "col-lg-3","my-2");
            const card = `<a href="/property/${data[i].propertyId}" class="text-decoration-none text-black"><div class="img">
                <img class="card-img-top" src="./assets/${data[i].gallery[0][0]}" alt="Card image cap">
            </div>
            <div class="cards-detail my-2">
                <div class="card-heading d-flex justify-content-between">
                    <h5 class="card-title">${data[i].propertyName}</h5>
                </div>
                <p class="card-text">${data[i].city}, ${data[i].country}</p>
                <p class="card-text"><strong><span><i class="fa-solid fa-indian-rupee-sign"></i></span>${data[i].pricing}</strong> night</p>
            </div></a>`;
            cardWrap.innerHTML = card;
            const wrap = document.querySelector('#wrap');
            // append card
            wrap.append(cardWrap);
        }
    }
    catch (err) {
        // err
        console.log(err)
    }
}
// call
getData();