import ToDoItem from "./ToDoItem";

class ToDo {
    
    constructor() {
        this.items = this.loadFromLocalStorage();
    }

    add(item) {
        this.items.push(item);

        // Previous way to save item to LocalStorage
        //this.saveToLocalStorage();

        // Create XMLHTTPRequest Object (AJAX Request)
        var xhttp = new XMLHttpRequest();
        // Add Callback function to the Request
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                // Check is item saved or not saved
                if(this.responseText === "Saved"){
                    console.log("Item Saved");
                }else{
                    console.log("Item Not Saved");
                }
            }
          };
        // Open Request
        xhttp.open("POST", "http://localhost/vue/api/save.php", true);
        // Set Header to be POST type
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        // Send Request with stringified Object
        xhttp.send("item=" + JSON.stringify(item));
    }

    delete(item) {
        this.items.splice(this.items.indexOf(item), 1);
        this.saveToLocalStorage();
    }

    changeState(item) {
        item.completed = !item.completed;
        this.saveToLocalStorage();
    }

    saveToLocalStorage() {
        // Previous way to save to LocalStorage of all items
        //localStorage.setItem('todo-data', JSON.stringify(this.items));

        // Create XMLHTTPRequest Object (AJAX Request)
        var xhttp = new XMLHttpRequest();
        // Add Callback function to the Request
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                // Check is item saved or not saved
                if(this.responseText === "Saved"){
                    console.log("Items Saved");
                }else{
                    console.log("Items Not Saved");
                }
            }
          };
        // Open Request
        xhttp.open("POST", "http://localhost/vue/api/saveAll.php", false);
        // Set Header to be POST type
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        // Send Request with stringified Object
        xhttp.send("items=" + JSON.stringify(this.items));
    }

    loadFromLocalStorage() {
        // Previous way to load from LocalStorage
        //var json = localStorage.getItem('todo-data');
        
        // Variable which will hold the data from API
        var json;
        // Create XMLHTTPRequest Object (AJAX Request)
        var xhttp = new XMLHttpRequest();
        // Open Request with third paramater value of false, because we want for script to wait for execution
        xhttp.open("POST", "http://localhost/vue/api/load.php", false);
        // Set Header to be POST type
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        // Add Callback function to the Request
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                // Load the items
                json = this.responseText;
            }
        };
        // Send the Request
        xhttp.send();

        // Changed this to match empty string instead of null, because we are saving this now to the file
        if (json == ""){
            return [];
        }
        

        var jsonParsed = JSON.parse(json, (key, value) => {
            if (key === "date") {
                value = new Date(value);
            }
            return value;
        });

        if (jsonParsed.length === 0){
            return [];
        }

        

        let toDoItems = [];

        for (let i = 0; i < jsonParsed.length; i++) {
            toDoItems.push(ToDoItem.fromJSON(jsonParsed[i]));
        }

        return toDoItems;

    }

}


export default ToDo;