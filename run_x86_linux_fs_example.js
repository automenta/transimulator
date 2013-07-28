var _ = require('underscore');
var fs = require('fs');

require('./run_x86_linux_fs').runX86LinuxFS(
    {    
	//HARDWARE
	    memSize: '128MB',
	    memType: 'lpddr3_1600_x32',
			/*
			   lpddr3_1600_x32 => LPDDR3_1600_x32
			   lpddr2_s4_1066_x32 => LPDDR2_S4_1066_x32
			   ddr3_1600_x64 => DDR3_1600_x64
			   wio_200_x128 => WideIO_200_x128
			   simple_mem => SimpleMemory
			*/
	    l2Cache: false,

	//SOFTWARE
	    diskImage: 'linux_blank',
	    initCommands: 'm5 dumpresetstats ; m5 exit',
	    experimentFolder: 'c',

	//SIMULATOR
	    trace: false,

// /new_experiment_disk.sh [[diskImage (without .img)]] [init commands] [experiment folder/] ; node run_x86_linux_fs_example.js > /tmp/output
    },
    
    function(error, stdout, stderr, params, results, outdir) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);                
               
	var resultFileBase = 'result/' + process.pid + '-' + Date.now();

	//write JSON
	{
		var js = JSON.stringify([params, results], null, 4);		
		fs.writeFile(resultFileBase + '.js', 'exports.experiment = ' + js, function(err) {
		    if(err) console.log(err);
		}); 
	}

	//write CSV
	{
		function getCSVLine(array) {
			var s = '';
			for (var i = 0; i < array.length; i++) {
				s += array[i] + ',';
			}
			return s.substring(0, s.length-1);
		}

		var k = _.keys(params);
		var s = getCSVLine(k) + '\n' + getCSVLine( _.map(k, function(x) { return params[x] } ) ) + '\n'; 
		fs.writeFile(resultFileBase + '.in.csv', s, function(err) {
		    if(err) console.log(err);
		}); 


		var k = _.keys(results[0]);
		var t = getCSVLine(k) + '\n';
		for (var i = 0; i < results.length; i++)
			t += getCSVLine( _.map(k, function(x) { return results[i][x] } ) ) + '\n';
		fs.writeFile(resultFileBase + '.out.csv', t, function(err) {
		    if(err) console.log(err);
		}); 
	}	

    }
);
