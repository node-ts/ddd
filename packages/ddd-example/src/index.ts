import 'reflect-metadata'
import { ApplicationContainer } from './application-container'
import { Cli } from './cli'

const container = new ApplicationContainer()

const cli = container.get(Cli)
cli.run()
  .catch(err => {
    // tslint:disable-next-line:no-console Fatal error logging
    console.log('Fatal error', err)
  })
