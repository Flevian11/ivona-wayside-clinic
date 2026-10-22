import SystemReleaseController from './SystemReleaseController'
import DeveloperToolsController from './DeveloperToolsController'
import AdministrationController from './AdministrationController'
import ClinicSettingsController from './ClinicSettingsController'
const Admin = {
    SystemReleaseController: Object.assign(SystemReleaseController, SystemReleaseController),
DeveloperToolsController: Object.assign(DeveloperToolsController, DeveloperToolsController),
AdministrationController: Object.assign(AdministrationController, AdministrationController),
ClinicSettingsController: Object.assign(ClinicSettingsController, ClinicSettingsController),
}

export default Admin