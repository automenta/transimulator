# This doesn't work:
#gcc -O2 -static -m32 -o nbody nbody.c /usr/lib32/libm.a
 

# compile from within virtual machine: cc -o nbody.32 nbody.c -lm 
./new_experiment_disk.sh nbody_c 'm5 dumpresetstats ; cd /exp ; echo Compiling nbody.c ; cc -o nbody.32 nbody.c -lm ; m5 dumpresetstats ; echo Executing nbody ; ./nbody.32 2000 ; m5 dumpresetstats ; m5 exit' c/

# without compiling (using a precompiled nbody.32 binary: (DOESNT SEEM TO WORK)
./new_experiment_disk.sh nbody_c 'm5 dumpresetstats ; cd /exp ; m5 dumpresetstats ; time ./nbody.32 2000 ; m5 dumpresetstats ; m5 exit' c/

node run_x86_linux_fs_example.js > /tmp/output
