import Api from './Api'
import DashboardController from './DashboardController'
import ReleaseChangelogController from './ReleaseChangelogController'
import DashboardReleaseAcknowledgementController from './DashboardReleaseAcknowledgementController'
import Admin from './Admin'
import Settings from './Settings'
const Controllers = {
    Api: Object.assign(Api, Api),
DashboardController: Object.assign(DashboardController, DashboardController),
ReleaseChangelogController: Object.assign(ReleaseChangelogController, ReleaseChangelogController),
DashboardReleaseAcknowledgementController: Object.assign(DashboardReleaseAcknowledgementController, DashboardReleaseAcknowledgementController),
Admin: Object.assign(Admin, Admin),
Settings: Object.assign(Settings, Settings),
}

export default Controllers