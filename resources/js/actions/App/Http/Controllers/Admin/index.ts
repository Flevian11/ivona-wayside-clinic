import SystemReleaseController from './SystemReleaseController'
import DeveloperToolsController from './DeveloperToolsController'
const Admin = {
    SystemReleaseController: Object.assign(SystemReleaseController, SystemReleaseController),
DeveloperToolsController: Object.assign(DeveloperToolsController, DeveloperToolsController),
}

export default Admin