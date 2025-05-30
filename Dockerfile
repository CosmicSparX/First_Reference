# Frontend stage
FROM nginx:alpine as frontend

# Copy website files
COPY . /usr/share/nginx/html/

# Remove default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# Backend stage
FROM python:3.11-slim as backend

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY api/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy API files
COPY api/ .

# Create and set up the database directory
RUN mkdir -p /app/instance && \
    chmod 777 /app/instance

# Expose port for Flask
EXPOSE 5000

# Set environment variables
ENV FLASK_APP=app.py
ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1
ENV JWT_SECRET_KEY=6cc9c34b45de5f8c411dfb5624afa407d2c0340a57d06ec376860efebf7e77e93c8abf4e0dbd77b5840d473f466af1257303edf4dafaa46812bec96e7787e7efd240882fdb490de19f2d0fdf0544054ae00bfe06a1329d98de8e5a4e1172e44c557283b87c1b6b1aa0f4cf0784cf2664f4a66ca4c36e30119c24915645f1370e1443d7c6b358c757438d426ccd7405ec1da41298cb0f21bc45558fafeee15ebc227ad1f654f90f414ca1abe630e6f57a0e79ba9da52e72a27d64cfb5188111b892c039b5503c2c462446cd679e4160a67e493b2d69991c0b1e7a7181d3e69293068d14e90b6462e720724d8aea887291d0e8621bef7e6b571ef853051dec3d9a

# Start the Flask application
CMD ["flask", "run", "--host=0.0.0.0"] 