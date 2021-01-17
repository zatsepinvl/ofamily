FROM openjdk:8-jdk-alpine
VOLUME /tmp
ADD target/*.jar app.jar

ENV MONGO_DB_URL=localhost:27011/ofamily
ENV DISCOVERY_URL=http://localhost:8888

EXPOSE 8001

ENTRYPOINT exec java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar /app.jar