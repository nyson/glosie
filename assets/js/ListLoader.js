// Singleton class to load dictionaries from the server.
// Will also cache said dictionaries locally in the future.
function ListLoader() {
    // Load a dictionary by name. Only upper and lowercase latin letters,
    // numbers, dashes and underscores are permitted in names.
    // If sync = true, this method blocks until the request is complete.
    // If callback != null, it is treated as a nullary function to be called
    // immediately upon request completion.
    this.load = function(name, sync, callback) {
        var filteredName = name.match(/[a-zA-Z0-9\-_]+/);
        if(name.length < 1) {
            console.log('WARNING: unable to load dict ' + name);
            return;
        }
        filteredName = filteredName[0];
        var lists = this.loadedLists;
        $.ajax({
	    dataType: "html",
	    url: "dicts/" + filteredName + ".lst",
	    error: function (a,b) {
	        console.log(a,b);
	    },
	    isLocal: true,
            async: !sync,
	    success: function (data){
	        var list = [];
	        data = data.split("\n");
                
	        for(d in data) {
		    var t = data[d].split(":");
		    list.push({"q": t[1], "a": t[0]});
	        }
                
	        lists[filteredName] = list;
                if(callback) {
                    callback();
                }
	    }
        });
    };

    // Returns the list of questions by the given name. Returns null if no such
    // list is found.
    this.getUncached = function(name) {
        if(this.loadedLists[name]) {
            return this.loadedLists[name];
        } else {
            return null;
        }
    };

    // Behaves exactly like getUncached, except that an attempt is made to
    // fetch missing dictionaries from server.
    this.get = function(name) {
        var list = this.getUncached(name);
        if(!list) {
            this.load(name, true);
            return this.getUncached(name);
        } else {
            return list;
        }
    };

    // All currently loaded lists.
    this.loadedLists = {};
}

ListLoader.getSingleton = function() {
    if(!ListLoader.ll) {
        ListLoader.ll = new ListLoader();
    }
    return ListLoader.ll;
}