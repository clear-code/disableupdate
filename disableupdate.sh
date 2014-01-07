#!/bin/sh

appname=disableupdate

cp ./buildscript/makexpi.sh ./
./makexpi.sh -n $appname -o
rm ./makexpi.sh
