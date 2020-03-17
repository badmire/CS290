
function add_player() {
    var new_node = document.getElementById("player_form").cloneNode(true);
    new_node.removeAttribute("id")
    document.getElementById("lines").appendChild(new_node);
};

function add_leauge_entry() {
    var title = document.getElementById("title").value;

    var input_list = document.querySelectorAll("input")
    var table_list = [];
    var current_set = [];
    //i = 1 to skip the first instance of input, which is the title.
    for (i = 1; i < input_list.length; i++) {
        current_set.push(input_list[i].value);

        if (current_set.length % 4 == 0) {
            table_list.push(current_set);
            current_set = [];
        };
    };

    function sort_2d(a, b) {
        if (a[2] === b[2]) {
            return 0;
        }
        else {
            return (a[2] < b[2]) ? 1 : -1;
        }
    }
    // Sort by standing
    table_list.sort(sort_2d)

    //Create Div
    var new_list = document.createElement("div");
    document.getElementById("standings").appendChild(new_list);

    //Create title
    var temp = document.createElement("h1");
    temp.innerHTML = title;
    new_list.appendChild(temp);

    //Create Table
    var table = document.createElement("table");
    new_list.appendChild(table);

    //Table body??
    var table_body = document.createElement("tbody")
    table.appendChild(table_body);

    //Create Header
    var header = document.createElement("tr");
    table_body.appendChild(header);

    temp = document.createElement("th");
    temp.innerHTML = "Name";
    header.appendChild(temp);

    temp = document.createElement("th");
    temp.innerHTML = "Season Record (W:L)";
    header.appendChild(temp);

    temp = document.createElement("th");
    temp.innerHTML = "Deck";
    header.appendChild(temp);


    //Add players
    for (i = 0; i < table_list.length; i++) {
        var current_row = document.createElement("tr");
        table_body.appendChild(current_row);

        //Name
        temp = document.createElement("td");
        temp.innerHTML = table_list[i][0];
        current_row.appendChild(temp);

        //Record
        temp = document.createElement("td");
        temp.innerHTML = table_list[i][2] + "-" + table_list[i][3];
        current_row.appendChild(temp);

        //Deck
        temp = document.createElement("td");
        temp.innerHTML = table_list[i][1];
        current_row.appendChild(temp);
    }

};

