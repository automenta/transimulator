var exec = require('child_process').exec;
    

function runX86LinuxFS(params) {
    
    var gem5Options = '-v --dot-config=config.dot ';
    if (params.trace) {
        gem5Options += '--trace-start=0 ';
    }
    
    var pid = process.pid;
    var outdir = '/tmp/m5out' + pid;
    gem5Options += '-d ' + outdir;    

    var memSize = params.memSize;
    var memType = 'lpddr3_1600_x32';
    var archOptions = '--disk-image=' + params.diskImage + ' --kernel=x86_64-vmlinux-2.6.22.9.smp --mem-size=' + memSize + ' --mem-type=' + memType;

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
    *  Memory aliases:
           lpddr3_1600_x32 => LPDDR3_1600_x32
           lpddr2_s4_1066_x32 => LPDDR2_S4_1066_x32
           ddr3_1600_x64 => DDR3_1600_x64
           wio_200_x128 => WideIO_200_x128
           simple_mem => SimpleMemory
    
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
    
    console.log('Executing:');
    console.log(cmd);
    
    var options = {
        env: { 'M5_PATH': 'tool/gem5/system/x86' },
    };
    
    var proc = exec(cmd, options, function(error, stdout, stderr) {
        params.callback(error, stdout, stderr, outdir);
    });
}


exports.runX86LinuxFS = runX86LinuxFS;
