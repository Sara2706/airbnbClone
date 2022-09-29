const getpropertypage = async () => {
    try {
        // fetch data here
        const fetchBookData = await fetch(`http://localhost:4000/mybookingsingledata`);
        const fetchPropData = await fetch(`http://localhost:4000/mybookingsinglepropdata`);
        const ratingBtn = await fetch(`http://localhost:4000/mybookingratebutton`);
        const rating = await fetch(`http://localhost:4000/propertyratingmybook`);
        const fetchreview = await fetch(`http://localhost:4000/propertyreviewingmybook`);

        // convert data to json
        const bookData = await fetchBookData.json();
        const propData = await fetchPropData.json();
        const ratingButton = await ratingBtn.json();
        const ratingdata = await rating.json();
        const reviewdata = await fetchreview.json();

        // rating
        var ratingval = 0;
        var ratingStars;
        if (ratingdata == 0) {
            ratingval = 1;
            ratingStars = ratingval;
        }else{
            // null means not yet
            if (ratingdata == null) {
                ratingval='Not yet';
                ratingStars = ratingval;
            }else{
                ratingval = ratingdata;
                ratingStars=parseFloat(ratingval).toFixed(2)
            }
           
        }
        console.log(ratingval);
        console.log(bookData, propData, ratingButton);

        // get selector fro frontend
        const ratCity = document.querySelector('.rat-City');
        const wrapperData = document.querySelector('.wrapperdata')
        const heading = document.querySelector('.heading');
        const bigImg = document.querySelector('.big-img');
        const smallImg = document.querySelector('.small-img');
        const bookingContent = document.querySelector('.bookingContent');
        const review = document.querySelector('.review');
        const button = document.querySelector('.button');
    
        // change to dynamic and update values
        heading.innerText = `${propData[0].propertyName}`;
        ratCity.innerHTML = ` <p><span class="mr-3"><i class="fa-solid fa-star"></i><span>${ratingStars}    ${propData[0].city},${propData[0].state},${propData[0].country}</p>`;
        bigImg.innerHTML = `<img src="../assets/${propData[0].gallery[0][0]}"
                            alt="Gallery image 1" class="ecommerce-gallery-main-img active" />`;
    
        if (ratingButton.length <= 1) {
            button.innerHTML = `<a href='#' class='text-decoration-none btn btn-primary text-center col-lg-12'>${ratingButton[0]}</a>`
        } else {
            button.innerHTML = `<a href='#' class='text-decoration-none btn btn-primary text-center col-lg-5'>${ratingButton[0]}</a>
                                <a href='/rating' class='text-decoration-none btn btn-primary text-center col-lg-5'>${ratingButton[1]}</a>`;
        }
    
        // select frontend selector
        const guest = document.querySelector('#guestName');
        const nop = document.querySelector('#nop');
        const totalPrice = document.querySelector('#totalPrice');
        const checkIn = document.querySelector('#checkIn');
        const checkOut = document.querySelector('#checkOut');
        const non = document.querySelector('#non');
        const payment = document.querySelector('#payment');

        // set values to frontend
        totalPrice.value = bookData[0].totalPrice;
        non.value = bookData[0].noOfNights;
        nop.value = bookData[0].noOfPersons;
        checkOut.value = bookData[0].checkOut;
        checkIn.value = bookData[0].checkIn;
        guest.value = bookData[0].guestName;
        payment.value = bookData[0].paymentMethod;
    
        // create card for rating
        const cardWrap = document.createElement('div');
        
        cardWrap.classList.add("cards", "col-lg-12", "col-md-12", "col-sm-12",);
        const card = ` <div class="cards-detail border m-2 p-2">
                    <div class="card-heading">
                        <h3 class="card-title"><span class="mr-3"><i class="fa-solid fa-star"></i><span>${reviewdata[0].rating}</h3>
                        <h6 class="card-title">${reviewdata[0].reviewHeading}</h6>
                    </div>
                    <p class="card-text">${reviewdata[0].reviewDescription},</p>
                </div>`;
        cardWrap.innerHTML = card;
        const reviewcontent = document.querySelector('.review');
        // append all rating
        reviewcontent.append(cardWrap);
    } catch (error) {
        // err
        console.log(error);
    }

}
// call
getpropertypage();