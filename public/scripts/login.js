document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("submit").addEventListener("click", (e) => {
        e.preventDefault();
        let pseudo = document.getElementById("username").value.trim();
        let pass = document.getElementById("password").value.trim();

        if (pseudo !== "" && pass !== "") {
            let data = {
                pseudos: pseudo,
                passs: pass
            };

            data = JSON.stringify(data);

            let option = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: data,
            };

            fetch("http://localhost:9000/informationConnexion", option).then(response => response.json()).then(response => {
                console.log(response);
            })
        }
    })
});