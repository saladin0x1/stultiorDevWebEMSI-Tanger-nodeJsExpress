# Use the official MySQL image from the Docker Hub
FROM mysql:latest

# Set environment variables
ENV MYSQL_ROOT_PASSWORD="UAOLBsZkakqI+vO1/fSKWQ=="
ENV MYSQL_DATABASE="Dumberdb"

# Expose the MySQL port
EXPOSE 3306
