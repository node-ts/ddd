import { ContainerModule } from 'inversify'
import { Cli } from './cli'

export class CliModule extends ContainerModule {

  constructor () {
    super(bind => {
      bind(Cli).toSelf()
    })
  }
}
