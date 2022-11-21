const bookDetail = async () => {
    try {
        // fetch data here
        const fetchBookingData = await fetch(`/bookingdetails`);

        // convert to json
        const bookingData = await fetchBookingData.json();
        console.log(bookingData);

        // get selector from frontend
        const propertyName = document.querySelector('#propertyName');
        const nop = document.querySelector('#nop');
        const price = document.querySelector('#price');
        const totalPrice = document.querySelector('#totalPrice');
        const checkIn = document.querySelector('#checkIn');
        const checkOut = document.querySelector('#checkOut');
        const non = document.querySelector('#non');

        // set value
        propertyName.value = bookingData[7];
        totalPrice.value = bookingData[5];
        price.value = bookingData[4];
        non.value = bookingData[3];
        nop.value = bookingData[2];
        checkOut.value = bookingData[1];
        checkIn.value = bookingData[0];
    } catch (error) {
        // err
        console.log(error);
    }
}
// call
bookDetail();