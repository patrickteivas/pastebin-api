# Paste project
This project is containerized and is meant to create quick pastes by API.<br>
Pastes are stored in Redis in-memory database without volumes (Persistence).

## Getting Started
### Start project
1. Install Docker and Docker Compose
2. Start project
```shell
docker-compose up -d
```
3. Use project endpoints according to swagger documentation

### Documentation
Easiest way to see swagger file as documentation is to copy `swagger.yaml` file to https://editor.swagger.io/<br><br>
**Alternatives**:<br>
To see documentation locally

* Windows:
```shell
docker run -d -p 80:8080 -e SWAGGER_JSON=/swagger.yaml -v %cd%/swagger.yaml:/swagger.yaml swaggerapi/swagger-ui
```
* Linux:
```shell
docker run -d -p 80:8080 -e SWAGGER_JSON=/swagger.yaml -v $(pwd)/swagger.yaml:/swagger.yaml swaggerapi/swagger-ui
```
<br>
To edit documentation locally

* Windows:
```shell
docker run -d -p 80:8080 -v %cd%/swagger.yaml:/tmp/swagger.yaml -e SWAGGER_FILE=/tmp/swagger.yaml swaggerapi/swagger-editor
```
* Linux:
```shell
docker run -d -p 80:8080 -v $(pwd)/swagger.yaml:/tmp/swagger.yaml -e SWAGGER_FILE=/tmp/swagger.yaml swaggerapi/swagger-editor
```
