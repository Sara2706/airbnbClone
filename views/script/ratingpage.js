const ratingsAndReview = async () => {
    try {
        // get slector from html
        const allStar = document.querySelectorAll('.star');
        const submitBtn = document.querySelector('.submitBtn');
        var rating = document.querySelector('.ratingValue');
        var click;

        // all star function
        await allStar.forEach((stard, i) => {
            // onclick
            stard.onclick = () => { 
                // setvalue
                click = i + 1;
                allStar.forEach((stard, j) => {
                    // change color of star
                    if (click >= j + 1) {
                        stard.innerHTML = '&#9733;'
                        rating.innerHTML = `${click}`
    
                    } else {
                        stard.innerHTML = '&#9734;'
                    }
                });
                // send data to back end
                submitBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const rating = click;
                    const review = document.querySelector('#review');
                    const reviewheading = document.querySelector('#heading');
                    // define data
                    const data = {
                        rating: rating,
                        reviewheading: reviewheading.value,
                        review: review.value
                    } 
                    // send data to his api
                    fetch('/reviewdata', {
                        method: "POST",
                        headers: {
                            'Content-Type': "application/json"
                        },
                        body: JSON.stringify(data),
                    })
                    // redirec 
                    window.location='/';
                    
                })
            }
    
        });
    } catch (error) {
        // err
        console.log(error);
    }
}
// call
ratingsAndReview();