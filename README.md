# IntegrationTests

Integration tests for runtime and its SDKs

## Prerequisites

You'll need [Docker](https://www.docker.com/products/docker-desktop) and [NodeJS](https://nodejs.org/en/)
installed.

If you're looking to build and run the .NET Head locally, you'll also need
[.NET Core](https://dotnet.microsoft.com/download) installed.

## The Aviator

The actual framework for writing tests is called the `The Aviator`.
This also happens to be the runner for running the tests.

Right now the tests also lives here, as we have yet to formalize this
as a separate offering.

To get started, open up a shell and navigate to [./Source/TheAviator](./Source/TheAviator).

Run

```shell
$ yarn
```

.. and then ..

```shell
$ yarn start
```

You should see the following:

```shell
████████╗██╗  ██╗███████╗     █████╗ ██╗   ██╗██╗ █████╗ ████████╗ ██████╗ ██████╗ 
╚══██╔══╝██║  ██║██╔════╝    ██╔══██╗██║   ██║██║██╔══██╗╚══██╔══╝██╔═══██╗██╔══██╗
   ██║   ███████║█████╗      ███████║██║   ██║██║███████║   ██║   ██║   ██║██████╔╝
   ██║   ██╔══██║██╔══╝      ██╔══██║╚██╗ ██╔╝██║██╔══██║   ██║   ██║   ██║██╔══██╗
   ██║   ██║  ██║███████╗    ██║  ██║ ╚████╔╝ ██║██║  ██║   ██║   ╚██████╔╝██║  ██║
   ╚═╝   ╚═╝  ╚═╝╚══════╝    ╚═╝  ╚═╝  ╚═══╝  ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝
                                                                                   
                    ______
                    _\ _~-\___
            =  = ==(____AA____D
                        \_____\___________________,-~~~~~~~`-.._
                        /     o O o o o o O O o o o o o o O o  |\_
                        `~-.__        ___..----..                  )
                              `---~~\___________/------------`````
                              =  ===(_________D                                                                                   


✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ 


Welcome to The Aviator - please enjoy the flight.


Running on port '::3000' - awaiting your command.

ctrl + c to exit.

✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ ✈ 



restify listening to http://[::]:3978
```

You can trigger a build by navigating a browser or [Postman](https://www.postman.com) to the
following URL: [http://localhost/api/flight/start](http://localhost/api/flight/start).

## Restoring EventStore dumps/backups

In the result output after running, you can find backups of the eventstore - snapshotted per scenario per microservice. This can be
restored to a running MongoDB instance.

For instance, run a MongoDB instance using Docker:

```shell
$ docker run -d -p 27017:27017 dolittle/mongodb
13286b698a4abf6214f1c455fce645c3286007300e0ec11b9919f0798af1a225
```

Use the `monorestore` utility in the running instance to restore (for instance use the 4 digits of the Docker instance SHA - 1328)

```shell
$ docker exec -i 1328 mongorestore --archive < resultOutput/<date>/<name of context>/<name of>/_microservice/<name of microservice>
```

You should then be able to navigate using your favorite MongoDB tools into the database.

## Microsoft Teams Integration

The [Microsoft Teams](http://teams.microsoft.com) is intended to be for fun and testing.
There is a [writeup](./integration/teams/README.md) for how to get started with it, if you want to have some fun.

## Web Frontend

An experimental Web Frontend is in place as well, built on [Aurelia](https://aurelia.io) and our own
[wrapper of the FluentUI components](https://github.com/dolittle-interaction/FluentUI.Aurelia).

Using another shell, keeping `The Aviator` running, navigate to the [./Source/Web](./Source/Web) folder.

Run

```shell
$ yarn
```

.. and then ..

```shell
$ yarn start
```

WebPack should pop up a browser window for you, but if it doesn't - navigate to [http://localhost:8081](http://localhost:8081).
WebPack has been configured to proxy any `/api` routes to `The Aviator`.
