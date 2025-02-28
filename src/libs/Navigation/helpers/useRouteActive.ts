import {findFocusedRoute, useNavigationState} from '@react-navigation/native';
import useRootNavigationState from '@hooks/useRootNavigationState';
import NAVIGATORS from '@src/NAVIGATORS';
import SCREENS from '@src/SCREENS';

/**
 * Determines if the current route is the Home route/screen
 */
function useIsHomeRouteActive(isNarrowLayout: boolean) {
    const focusedRoute = useNavigationState(findFocusedRoute);
    const navigationState = useRootNavigationState((x) => x);

    if (isNarrowLayout) {
        return focusedRoute?.name === SCREENS.HOME;
    }

    // On full width screens HOME is always a sidebar to the Reports Screen
    const isSplit = navigationState?.routes.at(-1)?.name === NAVIGATORS.REPORTS_SPLIT_NAVIGATOR;
    const isReport = focusedRoute?.name === SCREENS.REPORT;
    return isSplit && isReport;
}

function useIsAccountSettingsRouteActive(isNarrowLayout: boolean) {
    const focusedRoute = useNavigationState(findFocusedRoute);
    const navigationState = useRootNavigationState((x) => x);

    const isSplit = navigationState?.routes.at(-1)?.name === NAVIGATORS.SETTINGS_SPLIT_NAVIGATOR;
    const isAccountSettings = focusedRoute?.name === SCREENS.SETTINGS.ROOT;

    return isNarrowLayout ? isAccountSettings : isSplit;
}

function useIsWorkspaceSettingsRouteActive(isNarrowLayout: boolean) {
    const focusedRoute = useNavigationState(findFocusedRoute);
    const navigationState = useRootNavigationState((x) => x);

    const isSplit = navigationState?.routes.at(-1)?.name === NAVIGATORS.WORKSPACE_SPLIT_NAVIGATOR;
    const isAccountSettings = focusedRoute?.name === SCREENS.WORKSPACE.INITIAL;

    return isNarrowLayout ? isAccountSettings : isSplit;
}

export {useIsHomeRouteActive, useIsAccountSettingsRouteActive, useIsWorkspaceSettingsRouteActive};
