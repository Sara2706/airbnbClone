const getData = async () => {
            
    try {
        // fetch data
        const bookContent= await fetch('http://localhost:4000/fetchmyboookings');
        const propertyContent= await fetch('http://localhost:4000/mybookingpropertydata');  

        // convert to json
        const bookingData = await bookContent.json();
        const propertyData = await propertyContent.json();
        console.log(propertyData[1]);
        const wrap = document.querySelector('#wrap');

        // no booking means
        if (await bookingData.length < 1) {
           const noData = `<div class="d-flex justify-content-center align-items-center flex-column noProperty">
            <p>0</P><p>No property yet</P></div>`;
            wrap.innerHTML=noData;
        }

        // create my booking card
        for (let i = 0; i < bookingData.length; i++) {
            const cardWrap = document.createElement('div');
            cardWrap.classList.add("cards", "col-sm-12", "col-md-12", "col-lg-6","my-2" ,"mb-5");
            const card = `<a href="/mybookings/${bookingData[i].bookingId}" class="text-decoration-none text-black"><div class="img">
                <img class="card-img-top" src="./assets/${propertyData[i][0].gallery[0][0]}" alt="Card image cap">
            </div>
            <div class="cards-detail my-2">
                <div class="card-heading d-flex justify-content-between">
                    <h5 class="card-title">${bookingData[i].propertyName}</h5>
                </div>
                <p class="card-text">${bookingData[i].checkIn}, ${bookingData[i].checkOut}</p>
                <p class="card-text"><strong><span><i class="fa-solid fa-indian-rupee-sign"></i></span>${bookingData[i].totalPrice}</strong> night</p>
            </div></a>`;
            cardWrap.innerHTML = card;
            // append here
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