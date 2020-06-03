# --------------------------------------------------------------------------------------------------
# Basic metadata
# --------------------------------------------------------------------------------------------------
code: aws_lambda
title: Using AWS Lambda to start/stop instances
title_short: AWS Lambdas
date: "2019-04-23"
image: aws_lambda_square.svg
highlight: True

tags:
  - Python
  - AWS
  - Lambda

tags_filter:
  - Python
  - AWS


# --------------------------------------------------------------------------------------------------
# Extra info. This will add a button with href to the url
# --------------------------------------------------------------------------------------------------
link: 
  text: Github
  url: https://github.com/villoro/villoro_posts/tree/master/0015-aws_lambda


# --------------------------------------------------------------------------------------------------
# Content
# --------------------------------------------------------------------------------------------------
brief_markdown: |
  Learn how to use AWS Lambdas to start/stop EC2 and RDS instances using an API.


content_markdown: |

  <div class="w3-center">
    <img src="/static/images/blog/aws_lambda.svg" alt="aws_lambda" class="w3-image" style="width: 100%;"/>
  </div>

  ## Table of Contents

  [TOC]

  ## 1. Intro to AWS Lambdas
  AWS Lambda is a compute service that lets you run code without provisioning or managing servers. AWS Lambda executes your code only when needed and scales automatically, from a few requests per day to thousands per second.

  AWS lambdas should be used for small and light functions. For more complicated or time expensive functions it is better to use and `EC2` instance which can be turned on/off when needed to keep costs low.


  ## 2. Creating a lambda to start/stop instances

  The idea is to create a lambda that can start a system (both an `EC2` and `RDS`) using an API.

  This lambda allow users to start or stop instances through html requests. There is an URL and users can specify in **queryStringParameters** which system they want to act upon and what action they want (`start/stop/status`). For security reasons it is also needed to include a **token** in the headers.

  And example of the data used would be:
  ```python
  headers = {
    "token": ******
  }

  queryStringParameters = {
    "system_1": "start",
    "system_2": "stop"
  }
  ```

  ### 2.1. How it works
  These lambda is created in **python 3.6** and rely on aws **boto3** library. There are 2 files:

  * **aws.py:** this handles the start/stop of the instances. This file is shared in all lambdas
  * **lambda_function.py:** this has the loggic for deciding what to start/stop

  #### 2.1.1. aws.py
  First of all it will start an AWS session an it is important to start it in the correct region. There is no need to use any credentials since AWS has already put the ACCESS_KEY and SECRET_KEY as an environment vars and are used in _boto3_ background.

  > **Important:** use the appropiate region.

  Then there are 2 functions:
  * act_instance_ec2
  * act_instance_rds

  For **act_instance_ec2** it will simply start/stop the ec2 instance asked.
  For **act_instance_rds** it first will check the state of the instance and then it will act if possible.

  The workflow is:
  * **start rds:** from 'stopped' to 'available'
  * **stop rds:** from 'available' to 'stopped'

  #### 2.1.2. lambda_handler.py

  There is a dictionary with the infos of the instances that the lambdas can act upon. The idea is that users can only use the name of the system (```magento/vtiger```) and the dictionary will give the instance id.

  Example of dictionary:

  ```python
  INSTANCES = {
      "system_1": {
          "EC2": "i-068e5489acdd4a544",
          "RDS": "db_1"
      },
      "system_2": {
          "EC2": "i-0be4e5d15b667ad16",
          "RDS": "db_2"
      },
      "other system": {
        "EC2": None,
        "RDS": None,
      }
  }
  ```

  For the lambda **instances_api** there is some handling of the request. First it will check if the token is present and correct and if not it will return a json with a message of the actual problem.

  If the token is correct it will iterate over the **systems** presents in the request params and if it is found in the _INSTANCES_ dictionary and if the **action** is ```start/stop``` it will act. The lambda will return a json with the result of each system, like this:

  ```JSON
  {
      "system_1": {
          "EC2": "EC2 instance 'i-05acfb91d2225ecd3' started",
          "RDS": "ECS instance 'system_1' started"
      },
      "system_2": {
          "EC2": "EC2 instance 'i-01dd4d50b6fad7de0' stopped",
          "RDS": "ECS not configured"
      }
  }
  ```

  ### 2.2. Create the lambda
  First of all there is some work to do in AWS IAM service. This will give the lambdas the following permissions:

  1. Act on `EC2` instances
  2. Act on `RDS` instances
  3. Write logs

  To do that first you will need to a **policy** and then assign it to a **role**.

  #### 2.2.1. Create a IAM/Policy

  1. Go to AWS IAM service
  2. Create a Policy
      1. Go to sidebar ```policies```
      2. Create policy
      3. Select **JSON**
      4. Paste the json config
      5. Add name + description

  The policy config is:

  ```JSON
  {
      "Version": "2012-10-17",
      "Statement": [
          {
              "Effect": "Allow",
              "Action": [
                  "ec2:DescribeInstanceStatus",
                  "ec2:DescribeInstances",
                  "ec2:StartInstances",
                  "ec2:StopInstances"
              ],
              "Resource": [
                  "*"
              ]
          },
          {
              "Effect": "Allow",
              "Action": [
                  "rds:DescribeDBInstances",
                  "rds:StopDBInstance",
                  "rds:StartDBInstance"
              ],
              "Resource": "*"
          },
          {
              "Action": [
                  "logs:CreateLogGroup",
                  "logs:CreateLogStream",
                  "logs:PutLogEvents"
              ],
              "Effect": "Allow",
              "Resource": "arn:aws:logs:*:*:*"
          }
      ]
  }
  ```

  #### 2.2.2. Create a IAM/Role

  1. Go to AWS IAM service
  2. Create a Policy
      1. Go to sidebar ```roles```
      2. Select **lambda**
      3. Select previously created policy
      4. Add name + description

  #### 2.2.3. Create lambda itself

  1. Go to AWS Lambda service
  2. Go to sidebar ```functions```
  3. Create new
      1. Add name
      2. Select **Python 3.6** or higher
      3. Select role previously created
      4. Press ```create function```
  4. Add code
      1. Add code to ```lambda_function.py```
      2. Update **INSTANCES** dictionary
      3. Add file ```aws.py```
  5. Add tags
  6. Add environment vars for **instances_api**

  #### 2.2.4. Create API

  <div class="w3-center">
    <img src="/static/images/posts/aws_lambda_screenshot.png" alt="aws_lambda_screenshot" class="w3-image w3-border" style="max-height: 500px;"/>
  </div>

  > API Gateway is set used as a triger. Click at the left of the image, where it says add triger.

  1. Go to AWS Lambda service
  2. Open **instances_api** function
  3. Add **API Gateway** triger
      1. Click it to configure it
      2. Select **new API**
      3. Security: **open**
      4. Click **add**
  4. Save lambda and then the API will be created

  ## 3. Extending that lambda

  One way to give more functions to this lambda is to set times to start or stop certain systems. For example you could want to start a system at 7 am and then stop it at 19 pm on workdays. This could be useful for `development` systems.

  You can do this by two ways. First would be to create a second lambda that calls the first using html requests. The second would be to simply hardcode the action (look at `lambda_handler_start.py`) to see this second option.

  And you need to set the time triger by using AWS CloudWatch.

  1. Go to AWS CloudWatch service
  2. Go to sidebar ```Events/rules```
      1. Select **schedule**
      2. Select **cron expresion** and write expected cron
      3. Add lambda function as **target**
  3. Configure
      1. Set name and description

  The cron expressions could be:

  ```YAML
  'start_instances lambda':
      'start_weekdays': '0 7 ? * MON-FRI *''

  'stop_instances lambda':
      'stop-fri': '00 14 ? * FRI *''
      'stop_midnight': '0 23 ? * * *''
      'stop_mon-thu': '00 19 ? * MON-THU *'
  ```
