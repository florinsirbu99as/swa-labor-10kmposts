FROM openjdk:17-jdk-alpine
ADD build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]

