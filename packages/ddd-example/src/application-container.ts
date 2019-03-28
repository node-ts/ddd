import { Container } from 'inversify'
import { CliModule } from './cli'

export class ApplicationContainer extends Container {

  constructor () {
    super()
    this.load(
      new CliModule()
    )
  }
}
