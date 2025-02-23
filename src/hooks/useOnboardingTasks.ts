import {useOnyx} from 'react-native-onyx';
import {isOpenTaskReport} from '@libs/ReportUtils';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';

const useOnboardingTasks = (taskReportID: string) => {
    // Get introSelected from Onyx
    const [introSelected] = useOnyx(ONYXKEYS.NVP_INTRO_SELECTED);
    const [allReports] = useOnyx(ONYXKEYS.COLLECTION.REPORT);

    // Get onboarding tasks
    const onboardingTasks = CONST.ONBOARDING_MESSAGES[CONST.ONBOARDING_CHOICES.MANAGE_TEAM].tasks;
    const tasks = onboardingTasks.filter((task) => {
        const taskID = introSelected?.[task.type as keyof typeof introSelected] as string;
        if (taskID) {
            // passing allReports as a param so that there is no stale data
            return isOpenTaskReport(taskID, undefined, allReports);
        }
        return false;
    });

    // return true if first task report id is taskReportID
    return introSelected?.[tasks.at(0)?.type as keyof typeof introSelected] === taskReportID;
};

export default useOnboardingTasks;
