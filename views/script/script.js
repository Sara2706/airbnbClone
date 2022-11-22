const log = async () => {
    try {
        // get selector for from frontend
        const logbtn = document.querySelector('.logbtn')
        const log = document.querySelector('.log')
        const linkHost = document.querySelector('.linkHost')

        // user icon select
        logbtn.addEventListener('click', (e) => {
            log.classList.remove('d-none')
        })

        // fetchdata here
        const logdatafetch = await fetch('/log');
        // convert data into json
        const logdata = await logdatafetch.json();

        // give login,logout and register
        for (let i = 0; i < logdata.length; i++) {
            const logLink = `<a href='/${logdata[i]}' class="text-decoration-none text-black">${logdata[i]}</a>`;
            const regLink = document.createElement('div');
            regLink.classList.add('regLink');
            regLink.innerHTML = logLink;
            linkHost.append(regLink)

        }
    } catch (error) {
        // error
        console.log(error);
    }
}
// call
log();