# Cli

This folder represents the application interface. This could be anything like an API, an application service that only handles message from a queue, or like this just a simple cli tool.

The main point is that these application interfaces and their specific concerns are removed from the domain layers. APIs have concerns around receiving requests, authenticating them, validating payloads, authorizing users etc. After those responsibilities it calls into the domain logic leaving the API as dumb as possible, whilst allowing the business logic to be ignorant of those concerns.

It also means that you can add many different types of interfaces into your business logic that you need. This makes it much simpler to support changes in technology directions as there's little coupling between how your application's used vs what it does.
