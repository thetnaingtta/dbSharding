# dbSharding

# go to the source folder and make sure Docker file and init.sql files are there

# docker file
FROM postgres
COPY init.sql /docker-entrypoint-initdb.d

# init.sql
CREATE TABLE URL_TABLE
(
    id SERIAL PRIMARY KEY,
    URL TEXT,
    URL_ID CHAR(5)
);

# go to the path of docker file, and run below command
docker build -t pgshard .


# command for pgadmin => 
docker run -p 5555:80 --name pgadmin -e PGADMIN_DEFAULT_EMAIL="thet4455@gmail.com" -e PGADMIN_DEFAULT_PASSWORD=postgres dpage/pgadmin4

# command for postgres db images => 
docker run --name pgshard1 -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d pgshard
# command for postgres db images => 
docker run --name pgshard2 -p 5433:5432 -e POSTGRES_PASSWORD=postgres -d pgshard
# command for postgres db images => 
docker run --name pgshard3 -p 5434:5432 -e POSTGRES_PASSWORD=postgres -d pgshard

# command to find IP/host of the pgshard => 
docker inspect a2fdf8850ce1 | grep "IPAddress" => replace container ID a2fdf8850ce1 with your actual ID

# command to test in console 
fetch("http://localhost:8081/post/?url=testing.com", {"method":"POST"}).then(data => console.log(data)).catch(error=> console.error(error));
