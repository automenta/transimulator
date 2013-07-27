var _ = require('underscore');
var fs = require('fs');

require('./run_x86_linux_fs').runX86LinuxFS(
    {    
	    trace: false,
	    memSize: '128MB',
	    diskImage: 'linux_blank.img',
	    memType: 'lpddr3_1600_x32',
	    l2Cache: false
    },
    
    function(error, stdout, stderr, params, results, outdir) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);                
               
	//write JSON
	var resultFileBase = 'result/' + process.pid + '-' + Date.now();
	{
		var js = JSON.stringify([params, results], null, 4);		
		fs.writeFile(resultFileBase + '.js', 'exports.experiment = ' + js, function(err) {
		    if(err) console.log(err);
		}); 
	}

	function getCSVLine(array) {
		var s = '';
		for (var i = 0; i < array.length; i++) {
			s += array[i] + ',';
		}
		return s.substring(0, s.length-1);
	}

	//write CSV
	{
		var k = _.keys(params);
		var s = getCSVLine(k) + '\n' + getCSVLine( _.map(k, function(x) { return params[x] } ) ) + '\n'; 
		fs.writeFile(resultFileBase + '.in.csv', s, function(err) {
		    if(err) console.log(err);
		}); 


		var k = _.without(_.keys(results[0]), 'callback');
		var t = getCSVLine(k) + '\n';
		for (var i = 0; i < results.length; i++)
			t += getCSVLine( _.map(k, function(x) { return results[i][x] } ) ) + '\n';
		fs.writeFile(resultFileBase + '.out.csv', t, function(err) {
		    if(err) console.log(err);
		}); 
	}	

    }
);
