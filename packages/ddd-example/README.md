# @node-ts/ddd-example

This example demonstrates how to use the @node-ts/ddd package in order to create a domain driven design based typescript application.

The application simulates a remote security monitoring company. The security company monitors house alarms for their customers. Each house can have many alarms, and when armed and triggered will send an alert to the monitoring company. 

The monitoring company can then dispatch security personel to go investigate and can remotely silence the alarm.

## Running the application

To run this application:

```bash
yarn
yarn bootstrap
cd packages/ddd-example
yarn dev
```

## Application structure

The application is broken into two parts - the domain, which contains all the business related code, and the cli, which acts as an application interface and a way to interact with the system.
