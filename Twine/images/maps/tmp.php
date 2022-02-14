<?php
foreach (glob("*") as $filename) {
print($filename);
//xcopy($filename,"..");
`cp $filename ..`;

}
