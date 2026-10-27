import Api from './Api'
import Auth from './Auth'
import DashboardController from './DashboardController'
import ReleaseChangelogController from './ReleaseChangelogController'
import DashboardReleaseAcknowledgementController from './DashboardReleaseAcknowledgementController'
import Admin from './Admin'
import ShaClaimsController from './ShaClaimsController'
import PatientOperationsController from './PatientOperationsController'
import PatientController from './PatientController'
import InventoryProcurementController from './InventoryProcurementController'
import Settings from './Settings'
import ClinicalOperationsController from './ClinicalOperationsController'
const Controllers = {
    Api: Object.assign(Api, Api),
Auth: Object.assign(Auth, Auth),
DashboardController: Object.assign(DashboardController, DashboardController),
ReleaseChangelogController: Object.assign(ReleaseChangelogController, ReleaseChangelogController),
DashboardReleaseAcknowledgementController: Object.assign(DashboardReleaseAcknowledgementController, DashboardReleaseAcknowledgementController),
Admin: Object.assign(Admin, Admin),
ShaClaimsController: Object.assign(ShaClaimsController, ShaClaimsController),
PatientOperationsController: Object.assign(PatientOperationsController, PatientOperationsController),
PatientController: Object.assign(PatientController, PatientController),
InventoryProcurementController: Object.assign(InventoryProcurementController, InventoryProcurementController),
Settings: Object.assign(Settings, Settings),
ClinicalOperationsController: Object.assign(ClinicalOperationsController, ClinicalOperationsController),
}

export default Controllers