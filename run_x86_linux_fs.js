var exec = require('child_process').exec;
var _ = require('underscore');

function runX86LinuxFS(params, callback) {
    
    var gem5Options = '-v --dot-config=config.dot ';
    if (params.trace) {
        gem5Options += '--trace-start=0 ';
    }
    
    var pid = process.pid;
    var outdir = '/tmp/m5out' + pid;
    gem5Options += '-d ' + outdir;    

    var memSize = params.memSize;
    var memType = params.memType;
    var archOptions = '--disk-image=' + params.diskImage + '.img --kernel=x86_64-vmlinux-2.6.22.9.smp --mem-size=' + memSize + ' --mem-type=' + memType;

    if (params.l2Cache) {
        archOptions += ' --l2cache --caches ';
    }
    else {
        archOptions += ' --fastmem';
    }
    
    if (params.numProcessors) {
        archOptions += ' -n ' + params.numProcessors + ' ';
    }

    /*
 *  --list-mem-types      List available memory types
  --mem-type=MEM_TYPE   type of memory to use   
  --mem-size=MEM_SIZE   Specify the physical memory size (single memory)
  --caches              
  --l2cache             
  --fastmem             
  --num-dirs=NUM_DIRS   
  --num-l2caches=NUM_L2CACHES
  --num-l3caches=NUM_L3CACHES
  --l1d_size=L1D_SIZE   
  --l1i_size=L1I_SIZE   
  --l2_size=L2_SIZE     
  --l3_size=L3_SIZE     
  --l1d_assoc=L1D_ASSOC
  --l1i_assoc=L1I_ASSOC
  --l2_assoc=L2_ASSOC   
  --l3_assoc=L3_ASSOC   
  --cacheline_size=CACHELINE_SIZE
  --ruby                
 * 
 */
    
    var cmd = 'tool/gem5/build/X86/gem5.fast ' + gem5Options + ' tool/gem5/configs/example/fs.py ' + archOptions;

    var precmd = './new_experiment_disk.sh ' + params.diskImage + ' "' + params.initCommands + '" ' + params.experimentFolder + '/';
	    

    console.log('Executing:');
    console.log(precmd);
    console.log(cmd);
    
	var e = _.clone(process.env);
	e['M5_PATH'] = 'tool/gem5/system/x86';

    var options = { env: e  };
    
	var preproc = exec(precmd, options, function(error, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);

		if (error) {
			console.error(error);
			return;
		}

		var proc = exec(cmd, options, function(error, stdout, stderr) {
		    var array = require('fs').readFileSync(outdir + '/stats.txt').toString().split("\n");
		    var results = [ ];
		    var currentSnapShot = { };
		    for(i in array) {
		        var line = array[i];
		        
		        if (line.indexOf('---------- Begin')==0) {
		            currentSnapShot = { };
		            continue;
		        }
		        else if (line.indexOf('---------- End')==0) {
		            results.push(currentSnapShot);
		            continue;
		        }
		        
		        var t = line.split(/[ ]+/g);
		        if (t.length > 1) {
		            currentSnapShot[t[0]] = t[1];
		        }
		    }
	
		    callback(error, stdout, stderr, params, results, outdir);
		});

	});

}


exports.runX86LinuxFS = runX86LinuxFS;
