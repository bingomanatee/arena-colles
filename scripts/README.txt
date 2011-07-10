Loading mars data

0. Delete the sector_files in the scripts directory
1. Save a Map in the web app
2. change the ID in the manifest to the id of that map
3. from the app root call

node script.js read_sectors.js

4. call

node script.js  load_sector_latlong.js

5. call

node script.js load_sector_rows.js