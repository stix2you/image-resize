Image Resizer for AWS

-----------------------------------------------
Packaging the Lambda Function:
-----------------------------------------------

Install Dependencies Locally:

In your project directory, run:

npm init -y
npm install aws-sdk
npm install --platform=linux --arch=x64 --libc=glibc sharp
npm install --platform=linux --arch=x64 --libc=glibc

Zip the Code and Dependencies: Package all files into a .zip file to upload to AWS Lambda:
Compress-Archive -Path * -DestinationPath lambda-function.zip

IF THIS DOES NOT WORK (and it didn't for me...) SEE DOCKER INSTRUCTIONS BELOW

---------------------
Docker Packaging:
---------------------
Build it:
docker build -t lambda-sharp .

Launch a docker container:
winpty docker run -it --rm -v "$(pwd):/var/task" lambda-sharp /bin/sh

Zip the docker container within docker desktop (Exec section)
zip -r lambda-function.zip ./*

Check that the archive is there:
ls -la

Grab the Docker Container ID:
docker ps

Copy the container to the project directory:
docker cp <container_id>:/var/task/lambda-function.zip ./lambda-function.zip

Go to Lambda and upload the .zip of the Docker container, which was built to AWS specs


-------
OTHER:
-------

Triggers and Permissions: Ensure the Lambda function has the correct S3 bucket trigger and appropriate IAM role permissions to read from and write to the S3 bucket.
----------------------------
In Lambda console:
+ Add trigger
Select source: S3
Select the ARN of the bucket (the S3 bucket you are using)
Select "All Object Create Events" for Event Type
Set Prefix to: original-images/
Acknowledge Recursive Invocation warning (we are using a prefix to avoid recursive invocation)


Setup Permissions for the lambda function:
-----------------------------
Within Lambda console, go to Configuration tab
Click Permissions in sidebar
Note the Role Name
Go to IAM dashboard - create new policy that grants read/write access to the S3 bucket that is the Lambda function trigger source.


BE SURE TO USE NODE 20.X 