#!/bin/bash

if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
	echo 'Usage: new_experiment_disk.sh [new disk name] [startup commands] [experiment directory source]'
	exit
fi


#$1 = new disk name
#$2 = startup command
#$3 = directory to copy into /exp

cp x86_disk/linux-x86.img x86_disk/$1.img
mkdir /tmp/md_$BASHPID
./mount_image.sh x86_disk/$1.img /tmp/md_$BASHPID

#update rcS startup script (part 1)
sudo chmod a+rw /tmp/md_$BASHPID/etc/init.d/rcS
cp rcS.empty /tmp/md_$BASHPID/etc/init.d/rcS

pushd .

cd /tmp/md_$BASHPID/

#update rcS startup script (part 2)
echo $2 >> etc/init.d/rcS

popd

sudo mkdir /tmp/md_$BASHPID/exp
sudo cp -R $3/* /tmp/md_$BASHPID/exp

sudo umount /tmp/md_$BASHPID
