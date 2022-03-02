# Deno Survey App
Survey application with REST API to manage surveys and questions and website, where all surveys are outputted.

## Installation

You need to have [deno installed](https://deno.land/#installation) in order to run this application.<br>
Install also [denon](https://deno.land/x/denon) which watches your file changes and automatically restarts server.

1. Clone the repository
1. Go to the project root folder
1. Copy `.env.example` into `.env` file and adjust the values

    ```dotenv
    # MongoDB connect URI
    MONGODB_URI = mongodb://localhost:27017
    # MondoDB database name
    DB_NAME = deno_survey
    # JWT encryption/decription secret key
    JWT_SECRET_KEY = some-random-key
    # JWT expiration duration
    JWT_EXP_DURATION = 3600000
    ```
1. Run the application by executing

    ```dotenv

    deno install -qAf --unstable https://deno.land/x/denon/denon.ts

    denon run --allow-net --allow-write --allow-read --allow-env --allow-ffi --unstable app.ts
deno run --allow-net --allow-write --allow-read --allow-env --allow-ffi --unstable --allow-read=node_modules app.ts

    ```
 