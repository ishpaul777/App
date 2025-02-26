import type {ValueOf} from 'type-fest';
import {dismissProductTraining} from '@libs/actions/Welcome';
import CONST from '@src/CONST';
import type {TranslationPaths} from '@src/languages/types';

const {
    CONCEIRGE_LHN_GBR,
    RENAME_SAVED_SEARCH,
    WORKSAPCE_CHAT_CREATE,
    QUICK_ACTION_BUTTON,
    SEARCH_FILTER_BUTTON_TOOLTIP,
    BOTTOM_NAV_INBOX_TOOLTIP,
    LHN_WORKSPACE_CHAT_TOOLTIP,
    GLOBAL_CREATE_TOOLTIP,
    SCAN_TEST_TOOLTIP,
    ONBOARDING_TASK_TOOLTIP,
    BOTTOM_NAV_REPORTS_TOOLTIP,
    OUTSTANDING_EXPENSE_FILTER_TOOLTIP,
    BOTTOM_NAV_ACCOUNT_SETTINGS_TOOLTIP,
    ACCOUNT_SETTINGS_WORKSPACES_OPTION_TOOLTIP,
    WORKSPACE_TOOLTIP,
    MORE_WORKSPACE_FEATURES_TOOLTIP,
} = CONST.PRODUCT_TRAINING_TOOLTIP_NAMES;

type ProductTrainingTooltipName = ValueOf<typeof CONST.PRODUCT_TRAINING_TOOLTIP_NAMES>;

type ShouldShowConditionProps = {
    shouldUseNarrowLayout?: boolean;
    isUserPolicyAdmin?: boolean;
    hasBeenAddedToNudgeMigration?: boolean;
};

type TooltipData = {
    content: Array<{text: TranslationPaths; isBold: boolean}>;
    onHideTooltip: (tooltipName: ProductTrainingTooltipName, isDismissedUsingX?: boolean) => void;
    name: ProductTrainingTooltipName;
    priority: number;
    shouldShow: (props: ShouldShowConditionProps) => boolean;
    shouldRenderActionButtons?: boolean;
};

const onHideTooltip = (tooltipName: ProductTrainingTooltipName, isDismissedUsingX = false) => {
    dismissProductTraining(tooltipName, isDismissedUsingX);
};

const shouldShowAdminOnlyTooltips = ({isUserPolicyAdmin = false, hasBeenAddedToNudgeMigration = false}) => isUserPolicyAdmin && !hasBeenAddedToNudgeMigration;

const TOOLTIPS: Record<ProductTrainingTooltipName, TooltipData> = {
    [CONCEIRGE_LHN_GBR]: {
        content: [
            {text: 'productTrainingTooltip.conciergeLHNGBR.part1', isBold: false},
            {text: 'productTrainingTooltip.conciergeLHNGBR.part2', isBold: true},
        ],
        onHideTooltip,
        name: CONCEIRGE_LHN_GBR,
        priority: 2000,
        shouldShow: ({isUserPolicyAdmin = false, hasBeenAddedToNudgeMigration = false, shouldUseNarrowLayout = false}) =>
            shouldShowAdminOnlyTooltips({isUserPolicyAdmin, hasBeenAddedToNudgeMigration}) && shouldUseNarrowLayout,
    },
    [ONBOARDING_TASK_TOOLTIP]: {
        content: [
            {text: 'productTrainingTooltip.onboardingTaskTooltip.part1', isBold: false},
            {text: 'productTrainingTooltip.onboardingTaskTooltip.part2', isBold: true},
        ],
        onHideTooltip,
        name: ONBOARDING_TASK_TOOLTIP,
        priority: 1900,
        shouldShow: shouldShowAdminOnlyTooltips,
    },
    [BOTTOM_NAV_REPORTS_TOOLTIP]: {
        content: [
            {text: 'productTrainingTooltip.bottomNavReportsTooltip.part1', isBold: false},
            {text: 'productTrainingTooltip.bottomNavReportsTooltip.part2', isBold: true},
        ],
        onHideTooltip,
        name: BOTTOM_NAV_REPORTS_TOOLTIP,
        priority: 1800,
        shouldShow: shouldShowAdminOnlyTooltips,
    },
    [OUTSTANDING_EXPENSE_FILTER_TOOLTIP]: {
        content: [
            {text: 'productTrainingTooltip.outstandingExpenseFilterTooltip.part1', isBold: false},
            {text: 'productTrainingTooltip.outstandingExpenseFilterTooltip.part2', isBold: true},
            {text: 'productTrainingTooltip.outstandingExpenseFilterTooltip.part3', isBold: false},
            {text: 'productTrainingTooltip.outstandingExpenseFilterTooltip.part4', isBold: false},
        ],
        onHideTooltip,
        name: OUTSTANDING_EXPENSE_FILTER_TOOLTIP,
        priority: 1700,
        shouldShow: shouldShowAdminOnlyTooltips,
    },
    [BOTTOM_NAV_ACCOUNT_SETTINGS_TOOLTIP]: {
        content: [
            {text: 'productTrainingTooltip.bottomNavAccountSettingsTooltip.part1', isBold: false},
            {text: 'productTrainingTooltip.bottomNavAccountSettingsTooltip.part2', isBold: true},
        ],
        onHideTooltip,
        name: BOTTOM_NAV_ACCOUNT_SETTINGS_TOOLTIP,
        priority: 1600,
        shouldShow: shouldShowAdminOnlyTooltips,
    },
    [ACCOUNT_SETTINGS_WORKSPACES_OPTION_TOOLTIP]: {
        content: [
            {text: 'productTrainingTooltip.accountSettingsWorkspacesOptionTooltip.part1', isBold: false},
            {text: 'productTrainingTooltip.accountSettingsWorkspacesOptionTooltip.part2', isBold: true},
        ],
        onHideTooltip,
        name: ACCOUNT_SETTINGS_WORKSPACES_OPTION_TOOLTIP,
        priority: 1500,
        shouldShow: shouldShowAdminOnlyTooltips,
    },
    [WORKSPACE_TOOLTIP]: {
        content: [
            {text: 'productTrainingTooltip.workspaceTooltip.part1', isBold: false},
            {text: 'productTrainingTooltip.workspaceTooltip.part2', isBold: true},
            {text: 'productTrainingTooltip.workspaceTooltip.part3', isBold: false},
        ],
        onHideTooltip,
        name: WORKSPACE_TOOLTIP,
        priority: 1400,
        shouldShow: shouldShowAdminOnlyTooltips,
    },
    [MORE_WORKSPACE_FEATURES_TOOLTIP]: {
        content: [
            {text: 'productTrainingTooltip.moreWorkspaceFeaturesTooltip.part1', isBold: false},
            {text: 'productTrainingTooltip.moreWorkspaceFeaturesTooltip.part2', isBold: true},
        ],
        onHideTooltip,
        name: MORE_WORKSPACE_FEATURES_TOOLTIP,
        priority: 1300,
        shouldShow: shouldShowAdminOnlyTooltips,
    },
    [RENAME_SAVED_SEARCH]: {
        content: [
            {text: 'productTrainingTooltip.saveSearchTooltip.part1', isBold: true},
            {text: 'productTrainingTooltip.saveSearchTooltip.part2', isBold: false},
        ],
        onHideTooltip,
        name: RENAME_SAVED_SEARCH,
        priority: 1250,
        shouldShow: ({shouldUseNarrowLayout}) => !shouldUseNarrowLayout,
    },
    [GLOBAL_CREATE_TOOLTIP]: {
        content: [
            {text: 'productTrainingTooltip.globalCreateTooltip.part1', isBold: true},
            {text: 'productTrainingTooltip.globalCreateTooltip.part2', isBold: false},
            {text: 'productTrainingTooltip.globalCreateTooltip.part3', isBold: false},
        ],
        onHideTooltip,
        name: GLOBAL_CREATE_TOOLTIP,
        priority: 1200,
        shouldShow: () => true,
    },
    [QUICK_ACTION_BUTTON]: {
        content: [
            {text: 'productTrainingTooltip.quickActionButton.part1', isBold: true},
            {text: 'productTrainingTooltip.quickActionButton.part2', isBold: false},
        ],
        onHideTooltip,
        name: QUICK_ACTION_BUTTON,
        priority: 1150,
        shouldShow: () => true,
    },
    [WORKSAPCE_CHAT_CREATE]: {
        content: [
            {text: 'productTrainingTooltip.workspaceChatCreate.part1', isBold: false},
            {text: 'productTrainingTooltip.workspaceChatCreate.part2', isBold: true},
            {text: 'productTrainingTooltip.workspaceChatCreate.part3', isBold: false},
        ],
        onHideTooltip,
        name: WORKSAPCE_CHAT_CREATE,
        priority: 1100,
        shouldShow: () => true,
    },
    [SEARCH_FILTER_BUTTON_TOOLTIP]: {
        content: [
            {text: 'productTrainingTooltip.searchFilterButtonTooltip.part1', isBold: true},
            {text: 'productTrainingTooltip.searchFilterButtonTooltip.part2', isBold: false},
        ],
        onHideTooltip,
        name: SEARCH_FILTER_BUTTON_TOOLTIP,
        priority: 1000,
        shouldShow: () => true,
    },
    [BOTTOM_NAV_INBOX_TOOLTIP]: {
        content: [
            {text: 'productTrainingTooltip.bottomNavInboxTooltip.part1', isBold: true},
            {text: 'productTrainingTooltip.bottomNavInboxTooltip.part2', isBold: false},
            {text: 'productTrainingTooltip.bottomNavInboxTooltip.part3', isBold: false},
        ],
        onHideTooltip,
        name: BOTTOM_NAV_INBOX_TOOLTIP,
        priority: 900,
        shouldShow: () => true,
    },
    [LHN_WORKSPACE_CHAT_TOOLTIP]: {
        content: [
            {text: 'productTrainingTooltip.workspaceChatTooltip.part1', isBold: true},
            {text: 'productTrainingTooltip.workspaceChatTooltip.part2', isBold: false},
            {text: 'productTrainingTooltip.workspaceChatTooltip.part3', isBold: false},
        ],
        onHideTooltip,
        name: LHN_WORKSPACE_CHAT_TOOLTIP,
        priority: 800,
        shouldShow: () => true,
    },
    [SCAN_TEST_TOOLTIP]: {
        content: [
            {text: 'productTrainingTooltip.scanTestTooltip.part1', isBold: false},
            {text: 'productTrainingTooltip.scanTestTooltip.part2', isBold: true},
            {text: 'productTrainingTooltip.scanTestTooltip.part3', isBold: false},
            {text: 'productTrainingTooltip.scanTestTooltip.part4', isBold: true},
            {text: 'productTrainingTooltip.scanTestTooltip.part5', isBold: false},
            {text: 'productTrainingTooltip.scanTestTooltip.part6', isBold: false},
            {text: 'productTrainingTooltip.scanTestTooltip.part7', isBold: true},
            {text: 'productTrainingTooltip.scanTestTooltip.part8', isBold: false},
        ],
        onHideTooltip,
        name: SCAN_TEST_TOOLTIP,
        priority: 900,
        shouldShow: () => false,
        shouldRenderActionButtons: true,
    },
};

export default TOOLTIPS;
export type {ProductTrainingTooltipName};
