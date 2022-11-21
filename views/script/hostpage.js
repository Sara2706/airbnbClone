const getData = async () => {
         
    try {
        // fetch data here
        const hostFetch = await fetch('/hostproperty');

        // convert data to json
        const hostData = await hostFetch.json();
        console.log(hostData[0]);
        const wrap = document.querySelector('#wrap');

        // my property none means
        if (await hostData.length < 1) {
           const noData = `<div class="d-flex justify-content-center align-items-center flex-column noProperty">
            <p>0</P><p>No property yet</P></div>`;
            wrap.innerHTML=noData;
        }

        // vreate card to show my prperty to host
        for (let i = 0; i < hostData.length; i++) {
            const cardWrap = document.createElement('div');
            cardWrap.classList.add("cards", "col-sm-12", "col-md-6", "col-lg-3","my-2");
            const card = `<a href="/hostproperty/${hostData[i].propertyId}" class="text-decoration-none text-black"><div class="img">
                <img class="card-img-top" src="./assets/${hostData[i].gallery[0][0]}" alt="Card image cap">
            </div>
            <div class="cards-detail my-2">
                <div class="card-heading d-flex justify-content-between">
                    <h5 class="card-title">${hostData[i].propertyName}</h5>
                   
                </div>
                <p class="card-text">${hostData[i].city}, ${hostData[i].country}</p>
                <p class="card-text"><strong><span><i class="fa-solid fa-indian-rupee-sign"></i></span>${hostData[i].pricing}</strong> night</p>
            </div></a>`;
            cardWrap.innerHTML = card;
            // append card here
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