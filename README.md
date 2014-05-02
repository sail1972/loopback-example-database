# loopback-example-database

This project contains examples to demonstrate LoopBack connectors for databases:

- [LoopBack PostgreSQL connector](https://github.com/strongloop/loopback-connector-postgresql)
- [LoopBack MongoDB connector](https://github.com/strongloop/loopback-connector-mongodb)
- [LoopBack Oracle connector](https://github.com/strongloop/loopback-connector-oracle)
- [LoopBack PostgreSQL connector](https://github.com/strongloop/loopback-connector-postgresql)

You can pretty much switch between the databases by updating datasources.json and models.json.
No code change is required. In the following steps, we'll use postgresql as the example.

For those who are not familiar with [LoopBack](http://docs.strongloop.com/loopback), it’s an open source mobile backend
framework that connects mobile devices to enterprise data. LoopBack provides out-of-box data access capabilities for
models through pluggable [datasources and connectors](http://docs.strongloop.com/loopback-datasource-juggler/#loopback-datasource-and-connector-guide).
Connectors provide connectivity to variable backend systems, such as databases or REST APIs. Models are in turn exposed
to mobile devices as REST APIs and SDKs.

## Prerequisite

First, make sure you have strong-cli installed.

```sh
    npm install -g strong-cli
```

Next, you need a running PostgreSQL server. In this article, you'll connect to an instance running on demo.strongloop.com.

## Create the LoopBack application

To demonstrate how to use PostgreSQL connector for LoopBack, we'll create a simple application from scratch using the `slc`
command:

```sh
    slc lb project loopback-example-database
    cd loopback-example-database
    slc lb datasource accountDB --connector postgresql
    slc lb model account -i --data-source accountDB
```

Follow the prompts to create your model with the following properties:

- email: string - The email id for the account
- level: number - The game level you are in
- created: date - The date your account is created
- modified: date - The date your account is updated

The properties will be saved to models.json.  


## Install dependencies

Let's add the `loopback-connector-postgresql` module and install the dependencies.

```sh
    npm install loopback-connector-postgresql --save
```

## Configure the data source

The generated data source use the memory connector by default, to connect to PostgreSQL, we'll modify the data source
configuration as follows.

```sh
    vi datasources.json
```

**Note: Future releases will probably generate a config.json file for the data source configuration.**

In datasoures.json, replace the data source configuration for postgresql with the following snippet:

```javascript
    "accountDB": {
    "connector": "postgresql",
    "host": "demo.strongloop.com",
    "port": 5432,
    "database": "demo",
    "username": "demo",
    "password": "L00pBack"
  }
```

## Create the table and add test data

Now we have an `account` model in LoopBack, do we need to run some SQL statements to create the corresponding table in
PostgreSQL database?

Sure, but even simpler, LoopBack provides Node.js APIs to do so automatically. The code is `create-test-data.js`.

```sh
    node create-test-data
```

Let's look at the code:

```javascript
    dataSource.automigrate('account', function (err) {
      accounts.forEach(function(act) {
        Account.create(act, function(err, result) {
          if(!err) {
            console.log('Record created:', result);
          }
        });
      });
    });
```

`dataSource.automigrate()` creates or recreates the table in PostgreSQL based on the model definition for `account`. Please
note **the call will drop the table if it exists and your data will be lost**. We can use `dataSource.autoupdate()` instead
to keep the existing data.

`Account.create()` inserts two sample records to the PostgreSQL table.

   
## Run the application

```sh
    node app
```

Open your browser now.

To get all accounts, go to http://localhost:3000/api/accounts.

```json
    [
      {
        "email": "foo@bar.com",
        "level": 10,
        "created": "2013-10-15T21:34:50.000Z",
        "modified": "2013-10-15T21:34:50.000Z",
        "id": 1
      },
      {
        "email": "bar@bar.com",
        "level": 20,
        "created": "2013-10-15T21:34:50.000Z",
        "modified": "2013-10-15T21:34:50.000Z",
        "id": 2
      }
    ]
```

To get an account by id, go to http://localhost:3000/api/accounts/1.

```json
    {
      "email": "foo@bar.com",
      "level": 10,
      "created": "2013-10-15T21:34:50.000Z",
      "modified": "2013-10-15T21:34:50.000Z",
      "id": "1"
    }
```

All the REST APIs can be explored at:

    http://127.0.0.1:3000/explorer

 
## Try the discovery

Now we have the `account` table existing in PostgreSQL, we can try to discover the LoopBack model from the database. Let's
run the following example:

```sh
    node discover
```

First, we'll see the model definition for `account` in JSON format.

```json
    {
      "name": "Account",
      "options": {
        "idInjection": false,
        "postgresql": {
          "schema": "public",
          "table": "account"
        }
      },
      "properties": {
        "email": {
          "type": "String",
          "required": false,
          "length": 1073741824,
          "precision": null,
          "scale": null,
          "postgresql": {
            "columnName": "email",
            "dataType": "character varying",
            "dataLength": 1073741824,
            "dataPrecision": null,
            "dataScale": null,
            "nullable": "YES"
          }
        },
        ...,
        "id": {
          "type": "Number",
          "required": false,
          "length": null,
          "precision": 32,
          "scale": 0,
          "postgresql": {
            "columnName": "id",
            "dataType": "integer",
            "dataLength": null,
            "dataPrecision": 32,
            "dataScale": 0,
            "nullable": "NO"
          }
        }
      }
    }

```

Then we use the model to find all accounts from PostgreSQL:

```json
[ { id: 1,
    email: 'foo@bar.com',
    level: 10,
    created: Tue Oct 15 2013 14:34:50 GMT-0700 (PDT),
    modified: Tue Oct 15 2013 14:34:50 GMT-0700 (PDT) },
  { id: 2,
    email: 'bar@bar.com',
    level: 20,
    created: Tue Oct 15 2013 14:34:50 GMT-0700 (PDT),
    modified: Tue Oct 15 2013 14:34:50 GMT-0700 (PDT) } ]
```

Let's examine the code in discover.js too. It's surprisingly simple! The `dataSource.discoverSchema()` method returns the
model definition based on the `account` table schema. `dataSource.discoverAndBuildModels()` goes one step further by making
the model classes available to perform CRUD operations.

```javascript
    dataSource.discoverSchema('account', {schema: 'public'}, function (err, schema) {
        console.log(JSON.stringify(schema, null, '  '));
    });

    dataSource.discoverAndBuildModels('account', {schema: 'public'}, function (err, models) {
        models.Account.find(function (err, act) {
            if (err) {
                console.error(err);
            } else {
                console.log(act);
            }
        });
    });
```

As you have seen, the PostgreSQL connector for LoopBack enables applications to work with data in PostgreSQL databases. 
It can be new data generated by mobile devices that need to be persisted, or existing data that need to be shared
between mobile clients and other backend applications.  No matter where you start, LoopBack makes it easy to handle 
your data with PostgreSQL. It’s great to have PostgreSQL in the Loop!
