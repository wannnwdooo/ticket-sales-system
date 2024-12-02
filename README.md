## Description

Event booking application.

The basis is a modular structure.
The application consists of an infrastructure module and business modules: auth, user, event, booking, transaction. 

As well as reused functions.

Written using REST but could be rewritten to work with grpc or queues.

For scaling, you can select user, event, booking+transaction as separate microservices.

## TODO

This is a very simple implementation, which has its own flaws that can be improved:
 - Add business errors
 -Transfer work with entities from the service to DAL
 - Add migrations for the database
 - Writing tests
 - Adding balance/wallet that the user can top up
 - Adding CRON or BullMq to check reservations and transactions, as well as adding reservation status
 - Adding analytics and statistics
 - Adding log visualization

This is all about the monolithic application only, not about scaling

## Project setup

```bash
# install dependencies
$ npm i

# copy env
$ cp .env.example .env

# app start
$ sudo docker compose up
```
