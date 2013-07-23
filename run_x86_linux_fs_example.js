require('./run_x86_linux_fs').runX86LinuxFS({
    
    trace: false,
    memSize: '256MB',
    diskImage: 'linux-x86-seth.img',
    l2Cache: true,
    
    callback: function(error, stdout, stderr, outdir) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
                
        var array = require('fs').readFileSync(outdir + '/stats.txt').toString().split("\n");
        var snapshots = [ ];
        var currentSnapShot = [];
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
                currentSnapShot.push([t[0],t[1]]);
            }
        }
        console.log(snapshots);
    }
    
});


