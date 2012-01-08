<?php
$im = imagecreatefrompng("mars_gs.png");
$h = fopen(__DIR__ . '/file_data.txt', 'w');
for ($x = 0; $x < 1000; ++$x) {
    for ($y = 0; $y < 500; ++$y){
$rgb = imagecolorat($im, $x, $y);
$b = $rgb & 0xFF;
    fputs($h, "$b,");
    }
    fputs($h, "\n");
}
fclose($h);