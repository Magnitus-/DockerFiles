wget --output-document="/opt/master.zip" https://github.com/Magnitus-/$PROJECT/archive/master.zip;
(cd /opt; unzip master.zip);
(cd /opt/"$PROJECT"-master; npm install);
touch /bin/runtest.sh;
echo "(cd /opt/$PROJECT-master; npm test)" > /bin/runtest.sh;
chmod +x /bin/runtest.sh;
rm /opt/master.zip;
