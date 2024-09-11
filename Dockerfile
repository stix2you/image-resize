FROM public.ecr.aws/lambda/nodejs:20

# Set working directory
WORKDIR /var/task

# Install zip utility using microdnf
RUN microdnf install zip -y

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --platform=linux --arch=x64 --libc=glibc sharp

# Copy the rest of the application files
COPY . .

# Create zip file for deployment
RUN zip -r lambda-function.zip .
