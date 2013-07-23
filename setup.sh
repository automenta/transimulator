#!/bin/bash

echo 'Installing packages: libprotobuf-dev libgoogle-perftools-dev'
# Note: there may be other packages necessary; add them here:
sudo apt-get install libprotobuf-dev libgoogle-perftools-dev gcc-multilib m4


pushd .

# http://repo.gem5.org/
# http://www.gem5.org/Introduction

echo 'Installing Gem5 www.gem5.org from mercurial://repo.gem5.org/gem5 to: tool/gem5'
cd tool/
rm -Rf gem5 >/dev/null 2>/dev/null
hg clone http://repo.gem5.org/gem5/
mv README gem5/README
ls -l gem5

cd gem5
yes 'y' | scons -j5   #change j1|2|3|4.. for how many compiler processes
yes 'y' | scons build/X86/gem5.opt -j3
#yes 'y' | scons build/ARM/gem5.opt -j3

    pushd .

        cd util/term
        make

    popd

mkdir -p system/x86
cd system/x86
wget http://www.m5sim.org/dist/current/x86/x86-system.tar.bz2 http://www.m5sim.org/dist/current/x86/config-x86.tar.bz2
tar xvjf x86-system.tar.bz2 ; tar xjvf config-x86.tar.bz2


popd