#loopback-example-database
The purpose of this project is to demonstrate the usage of various [LoopBack](http://loopback.io) database connectors. Each branch in this repository contains a prebuilt configuration for a specific connector.

|Connector Name|Branch Name|
|--------------|-----------|
|[LoopBack Microsoft SQL Server Connector](https://github.com/strongloop/loopback-connector-mssql)|[mssql](https://github.com/strongloop/loopback-example-database/tree/mssql)|
|[LoopBack MongoDB Connector](https://github.com/strongloop/loopback-connector-mongodb)|[mongodb](https://github.com/strongloop/loopback-example-database/tree/mongodb)|
|[LoopBack MySQL Connector](https://github.com/strongloop/loopback-connector-mysql)|[master](https://github.com/strongloop/loopback-example-database/tree/master)|
|[LoopBack Oracle Connector](https://github.com/strongloop/loopback-connector-oracle)|[oracle](https://github.com/strongloop/loopback-example-database/tree/oracle)|
|[LoopBack PostgreSQL Connector](https://github.com/strongloop/loopback-connector-postgresql)|[postgresql](https://github.com/strongloop/loopback-example-database/tree/postgresql)|

For example, run the following to view the Oracle example:

```sh
git clone https://github.com/strongloop/loopback-example-database.git
cd loopback-example-database
git checkout oracle
```

##Getting Started
In this example, we will demonstrate the usage of the [LoopBack MongoDB Connector](https://github.com/strongloop/loopback-connector-mongodb). Instead of setting up your own database instance to connect to (which you would normally do), we will be connecting to an preconfigured MongoDB instance running at demo.strongloop.com.

###Prerequisites
We will need the [slc](https://github.com/strongloop/strongloop) (StrongLoop Controller) command line tool to simplify various tasks in the example.

```sh
npm install -g strongloop
```

###Create the LoopBack Application
To demonstrate how to use [LoopBack MongoDB Connector](https://github.com/strongloop/loopback-connector-mongodb), let's create an application from scratch using the `slc` command. Follow the prompt and remember to name your project `loopback-example-database`. We will also add the connector to this project by using [NPM](https://www.npmjs.org/).

```sh
slc loopback #create project
cd loopback-example-database
npm install --save loopback-connector-mongodb #add connector
```

###Add a Data Source
Run the following from the `loopback-example-database` directory to create a data source named `accountDB`:

```sh
slc loopback:datasource accountDB
```

###Configure the Data Source
By default, the auto-generated data source uses the [Memory Connector](http://docs.strongloop.com/display/LB/Memory+connector). However, since we're going to connect using MongoDB, in `loopback-example-database/server/datasources.json`, modify the `accountDB` configuration to look like:

```json
{
  ...
  "accountDB": {
    "name": "accountDB",
    "connector": "mongodb",
    "host": "demo.strongloop.com",
    "port": 3306,
    "database": "demo",
    "username": "demo",
    "password": "L00pBack"
  }
}
```

###Add a Model
Once we have the data source configured properly, we can create an account model by running:

```sh
slc loopback:model account
```

Follow the prompts to create your model with the following properties:

|Property|Data Type|Description|
|--------|---------|-----------|
|email|string|The email id for the account|
|created|date|The time of creation for the account|
|modified|date|The last modification time for the account|

These properties will be saved to `loopback-example-database/common/models/account.json` once the prompt exits.

###Create the Collection and Add Test Data
Now that we have an `account` model configured, we can generate its corresponding collection and documents in the database using the API's provided by [LoopBack](http://loopback.io). Copy `create-test-data.js` from this repository and put it into `loopback-example-database/server/create-test-data.js`. Run the following in `loopback-example-database/server` to add dummy data to your database:

```sh
cd server #make sure you're in the server dir
node create-test-data
```

This script will add two accounts into your database.

####create-test-data.js
```javascript
dataSource.automigrate('account', function(er) {
  ...
  accounts.forEach(function(account) {
    Account.create(account, function(er, result) {
      if (!er) return;
      console.log('Record created:', result);
      ...
    });
  });
});
```

`dataSource.automigrate()` creates or recreates a collection in MongoDB based on the model definition for `account`. This means **if the collection already exists, it will be dropped and all of its existing data will be lost**. If you want to keep the existing data, use `dataSource.autoupdate()` instead.

`Account.create()` inserts two sample documents into the MongoDB collection.

###Run the Application
```sh
cd .. #change back to the project root, ie) loopback-example-database
node .
```

Browse to [http://localhost:3000/api/accounts](http://localhost:3000/api/accounts) to view the accounts you created in the previous step. You should see:

```json
[
  {
    "email": "foo@bar.com",
    "created": "2014-08-28T22:56:28.000Z", #yours will be different
    "modified": "2014-08-28T22:56:28.000Z", #yours will be different
    "id": "5400c8d85d3b77e6bf6abc85" #yours will be different
  },
  {
    "email": "bar@bar.com",
    "created": "2014-08-28T22:56:28.000Z", #yours will be different
    "modified": "2014-08-28T22:56:28.000Z", #yours will be different
    "id": "5400c8d85d3b77e6bf6abc86" #yours will be different
  }
]
```

To get an account by id, browse to [http://localhost:3000/api/accounts/5400c8d85d3b77e6bf6abc85](http://localhost:3000/api/accounts/5400c8d85d3b77e6bf6abc85).

```json
{
  "email": "foo@bar.com",
  "created": "2014-08-28T22:56:28.000Z", #yours will be different
  "modified": "2014-08-28T22:56:28.000Z", #yours will be different
  "id": "5400c8d85d3b77e6bf6abc85" #yours will be different
}
```

Each REST API can be viewed at [http://localhost:3000/explorer](http://localhost:3000/explorer)

###Discovery
We do not support discovery for MongoDB at this time. If you would like this feature, please submit an [issue](https://github.com/strongloop/loopback-example-database/issues) in this repository.

##Conclusion
As you can see, the MongoDB connector for LoopBack enables applications to work with data in MongoDB databases. It can be newly generated data from mobile devices that need to be persisted or existing data that need to be shared between mobile clients and other backend applications. No matter where you start, [LoopBack](http://loopback.io) makes it easy to handle your data with MongoDB. It’s great to have MongoDB in the Loop!

##LoopBack
[LoopBack](http://docs.strongloop.com/loopback) is an open source mobile backend framework that connects mobile devices to enterprise data. It provides out-of-box data access capabilities for models through pluggable [datasources and connectors](http://docs.strongloop.com/loopback-datasource-juggler/#loopback-datasource-and-connector-guide). Connectors provide connectivity to various backend systems (such as databases or REST APIs). Models are in turn exposed to mobile devices as REST APIs and SDKs. For more information, see [https://github.com/strongloop/loopback](https://github.com/strongloop/loopback).
