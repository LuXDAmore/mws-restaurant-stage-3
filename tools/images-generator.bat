@echo off

for %%i in (../src/assets/images/800/*.jpg) do ( magick convert ../src/assets/images/800/%%i -resize 640 ../src/assets/images/640/%%i.webp )