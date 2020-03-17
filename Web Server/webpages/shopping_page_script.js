function server_shopping() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("download_button").removeAttribute("disabled")
        }
    };
    xhttp.open("POST", true);
    xhttp.send(document.getElementById("shopping_list").value);
    // document.getElementById("download_button").removeAttribute("disabled")
};