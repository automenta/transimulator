var pendingExperiments = [];
var experiments = { };


function runNextExperiment() {
    
}


function addExperiment(e) {
    
}


//loads all experiments (which are not already loaded) from result/ folder
function loadExperiments() {
    
}

function getAverageResult(e) {
    var res = e.results;
    if (res.length == 1) {
        return res[0];
    }
    else {
        console.log('getAverageResult not fully implemented');
        return res[0];
    }
}

function experimentHeuristic1(e) {
    var r = getAverageResult(e);
}