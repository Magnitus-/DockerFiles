# Purpose

Pretty simple image to run Chrony in a container.

A configuration file needs to be mapped at **/etc/chrony.conf** in the container and you probably want to give the container the **CAP_SYS_TIME** permission as well.

