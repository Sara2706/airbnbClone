const validation = async () => {
    // fetch data here
    const error = await fetch('http://localhost:4000/registererror');
    // convert to json
    const errorData = await error.json();
    console.log(errorData); 
    // give login , register or logout
    if (errorData.length > 0 ) {
        const userAlert = document.querySelector('.alertUser');
        const showErr = ` <p class="alert alert-danger" role="alert">${errorData}</p>`;
        userAlert.innerHTML = showErr;
    }
}
// call
validation();