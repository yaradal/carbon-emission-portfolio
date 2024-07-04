
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript repository.
Using Postgres for DB and Prisma for ORM.

```
This project includes two endpoints: 

GET /portfolio/generate?requestedVolume={requestedVolume}
it receives an integer representing the desired volume in tons of carbon credits and returns a list of projects and their corresponding volumes, following recommended principles.
1. The portfolio should aim to use the maximum amount of tons while respecting the distribution weight.
2. The number of tons in a project should be proportional to its "distribution_weight" (dw) relative to the total distribution weight.
3. If a single project does not provide enough credits, the portfolio should make up for the shortfall by using credits from other projects for the remaining amount, while following the distribution rule mentioned above.
4. The portfolio's tonnage can be less than the user's request if there's insufficient available volume, but it must never exceed the requested amount.

Distribution Example
The customer requests 60 tons:
1. There are five projects available with the following distribution weights: 
p1dw : 0.05, p2dw : 0.1, p3dw : 0.15, p4dw: 0.25, p5dw: 0.45.
2. In this case, all projects have enough volume to satisfy the distribution weights.
3. The algorithm should allocate the following tonnage for each project:
   a. p1= 3t
   b. p2= 6t
   c. p3= 9t
   d. p4= 15t
   e. p5= 27
   
```
```
POST /portfolio/checkout
example: 
curl --location 'http://localhost:3000/portfolio/checkout' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "y.dallasheh@gmail.com",
    "portfolio": [
  {
    "id": 1,
    "name": "EverGreen CarbonScape",
    "allocatedVolumeInTons": 15
  },
  {
    "id": 2,
    "name": "VerdeCarbon",
    "allocatedVolumeInTons": 82
  },
  {
    "id": 3,
    "name": "SustainaForest Carbon",
    "allocatedVolumeInTons": 124
  },
  {
    "id": 4,
    "name": "EcoRespire",
    "allocatedVolumeInTons": 207
  },
  {
    "id": 5,
    "name": "EverGreen Carbon",
    "allocatedVolumeInTons": 370
  }
]

}'
```
```
I explained throughout the code  the steps I did and how I did
The returned volume can be a bit smaller than the requested volume, this is because the requirement mentioned that it should only handle carbon credits in whole tons, so
fractional handling is unnecessary.
Areas that would improve over time:
Testing is partial and can be enhanced and done better.

```
## Installation

**Dependencies**

   Install dependencies and build the libs you need to run the project:
```bash
$ npm install
```
## Set Up the database
```bash
#Create a `.env` file to configure the database connection:
$ cp .env.example .env
# first run the db reset
$ npm run db:reset
# and then run the db migrate
$ npm run db:migrate
```
## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

