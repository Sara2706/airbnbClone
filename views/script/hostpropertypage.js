const getpropertypage = async () => {
    try {
         //   fetch data here
        const fetchData = await fetch(`http://localhost:4000/propertydata`)
        const review = await fetch(`http://localhost:4000/propertyreview`)
        const rating = await fetch(`http://localhost:4000/propertyrating`)
         // convert data to json
        const getData = await fetchData.json();
        const reviewdata = await review.json();
        const ratingdata = await rating.json();

        // set ratings
        var ratingval = 0;
        var ratingStars;
        if (ratingdata == 0) {
            ratingval = 1;
            ratingStars = ratingval;
        }else{
             // if null means not yet
            if (ratingdata == null) {
                ratingval='Not yet';
                ratingStars = ratingval;
            }else{
                ratingval = ratingdata;
                ratingStars=parseFloat(ratingval).toFixed(2)
            }
           
        }
        console.log(ratingval);
    
         // select selector from frontend
        const ratCity = document.querySelector('.rat-City');
        const wrapperData = document.querySelector('.wrapperdata')
        const heading = document.querySelector('.heading');
        const bigImg = document.querySelector('.big-img');
        const smallImg = document.querySelector('.small-img');
        const propertyContent = document.querySelector('.propertyContent');
        const description = document.querySelector('.description');
        const price = document.querySelector('.price');
        const amenitiesLi = document.querySelector('.amenitiesLi')
        const aminitiesObj = getData.aminities;
    
        // here change to dynamic update values
        heading.innerText = `${getData.propertyName}`;
        ratCity.innerHTML = ` <p><span class="mr-3"><i class="fa-solid fa-star"></i><span>${ratingStars}    ${getData.city},${getData.state},${getData.country}</p>`;
        bigImg.innerHTML = `<img src="../assets/${getData.gallery[0][0]}"
                            alt="Gallery image 1" class="ecommerce-gallery-main-img active" />`;
        smallImg.innerHTML = ` <div class="col-6 top">
                            <img src="../assets/${getData.gallery[0][1]}"
                            alt="Gallery image 1"/>
                            </div>
                            <div class="col-6 top">
                                <img src="../assets/${getData.gallery[0][2]}"
                                    alt="Gallery image 2"/>
                            </div>
                            <div class="col-6 bottom">
                                <img src="../assets/${getData.gallery[0][3]}"
                                    alt="Gallery image 3" />
                            </div>
                            <div class="col-6 bottom">
                                <img src="../assets/${getData.gallery[0][4]}"
                                    alt="Gallery image 4"/>
                            </div>`;
        propertyContent.innerHTML = `<div class="col-lg-3 col-sm-6">
                                          <h6 class="h6">Guest: ${getData.noOfPeople}
                                          </h6>
                                      </div>
                                      <div class="col-lg-3 col-sm-6">
                                          <h6 class="h6">Bedroom: ${getData.noOfBedroom}
                                          </h6>
                                      </div>
                                      <div class="col-lg-3 col-sm-6">
                                          <h6 class="h6">Bed: ${getData.noOfBed}
                                          </h6>
                                      </div>
                                      <div class="col-lg-3 col-sm-6">
                                          <h6 class="h6">Bathroom: ${getData.noOfBathroom}
                                          </h6>
                                      </div>`;
        description.innerHTML = `<p>${getData.description}</p>`;
    
        // check aminities is true or false
        for (let i = 0; i < Object.keys(aminitiesObj).length; i++) {
            const key = Object.keys(aminitiesObj)[i];
            const value = Object.values(aminitiesObj)[i]
            if (value == 'False') {
                for (let j = 0; j < amenitiesLi.children.length; j++) {
                    const unavailable = amenitiesLi.children[j].textContent;
                    if (key.toLowerCase() == unavailable.toLowerCase()) {
                        amenitiesLi.children[j].classList.add('text-decoration-line-through')
                    }
                }
            }
    
        }

         // show review to user
        for (let i = 0; i < reviewdata.length; i++) {
                const cardWrap = document.createElement('div');
                cardWrap.classList.add("cards","col-lg-3","col-md-6","col-sm-12",);
                const card = ` <div class="cards-detail border m-2 p-2">
                    <div class="card-heading">
                    <h5 class="card-title">${reviewdata[i].rating} of 5</h5>
                        <h5 class="card-title">${reviewdata[i].reviewHeading}</h5>
                    </div>
                    <p class="card-text">${reviewdata[i].reviewDescription},</p>
                </div>`;
                cardWrap.innerHTML = card;
                const review = document.querySelector('.review');
                review.append(cardWrap);
        }
    } catch (error) {
         // log error here
        console.log(error);
    }
}
// call
getpropertypage();