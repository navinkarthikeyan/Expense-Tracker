# Use the official Python 3.11 image as a base
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app



# Copy the requirements.txt first to leverage Docker cache
COPY requirements.txt /app/

# Install Python dependencies
RUN pip install --upgrade pip \
    && pip install -r requirements.txt

# Copy the rest of the application code
COPY . /app/

# Run Django collectstatic command (Environment variables should be set at runtime)
RUN python manage.py collectstatic --noinput

# Expose the port on which Django will run
EXPOSE 8000

# Run the Django server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
