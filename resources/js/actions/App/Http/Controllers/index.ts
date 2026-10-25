import Api from './Api'
import Auth from './Auth'
import DashboardController from './DashboardController'
import ReleaseChangelogController from './ReleaseChangelogController'
import DashboardReleaseAcknowledgementController from './DashboardReleaseAcknowledgementController'
import Admin from './Admin'
import PatientOperationsController from './PatientOperationsController'
import PatientController from './PatientController'
import Settings from './Settings'
const Controllers = {
    Api: Object.assign(Api, Api),
Auth: Object.assign(Auth, Auth),
DashboardController: Object.assign(DashboardController, DashboardController),
ReleaseChangelogController: Object.assign(ReleaseChangelogController, ReleaseChangelogController),
DashboardReleaseAcknowledgementController: Object.assign(DashboardReleaseAcknowledgementController, DashboardReleaseAcknowledgementController),
Admin: Object.assign(Admin, Admin),
PatientOperationsController: Object.assign(PatientOperationsController, PatientOperationsController),
PatientController: Object.assign(PatientController, PatientController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers