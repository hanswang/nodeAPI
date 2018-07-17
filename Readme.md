docker pull mongo
use articleDB
db.articles.insertOne({id: 1});
docker run -d -p 27017:27017 -v ~/localDev/MEN_restapi/data:/data/db mongo
