require('./run_x86_linux_fs').runX86LinuxFS({
    
    trace: false,
    memSize: '128MB',
    diskImage: 'nbody_c.img',
    l2Cache: false,
    
    callback: function(error, stdout, stderr, outdir) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
                
        var array = require('fs').readFileSync(outdir + '/stats.txt').toString().split("\n");
        var snapshots = [ ];
        var currentSnapShot = { };
        for(i in array) {
            var line = array[i];
            
            if (line.indexOf('---------- Begin')==0) {
                currentSnapShot = { };
                continue;
            }
            else if (line.indexOf('---------- End')==0) {
                snapshots.push(currentSnapShot);
                continue;
            }
            
            var t = line.split(/[ ]+/g);
            if (t.length > 1) {
                currentSnapShot[t[0]] = t[1];
            }
        }
        
        this.results = snapshots;
        
        console.log('EXPERIMENT PARAMS & RESULT');
        var js = JSON.stringify(this, null, 4);
        console.log(js);
        var fs = require('fs');
        
        var resultFile = '../result/' + process.pid + '-' + Date.now() + '.js';
        fs.writeFile(resultFile, 'exports.experiment = ' + js, function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("The file was saved!");
            }
        }); 
    }
    
});
