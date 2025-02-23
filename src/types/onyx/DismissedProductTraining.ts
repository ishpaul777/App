import CONST from '@src/CONST';

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
} = CONST.PRODUCT_TRAINING_TOOLTIP_NAMES;

/**
 * This type is used to store the timestamp of when the user dismisses a product training ui elements.
 */
type DismissedProductTrainingElement = {
    /** The timestamp of when the user dismissed the product training element. */
    dismissedTime: string;

    /** The method of how the user dismissed the product training element, click or x. */
    dismissedMethod: 'click' | 'x';
};
/**
 * This type is used to store the timestamp of when the user dismisses a product training ui elements.
 */
type DismissedProductTraining = {
    /**
     * When user dismisses the nudgeMigration Welcome Modal, we store the timestamp here.
     */
    [CONST.MIGRATED_USER_WELCOME_MODAL]: DismissedProductTrainingElement;

    /**
     * When user dismisses the conciergeLHNGBR product training tooltip, we store the timestamp here.
     */
    [CONCEIRGE_LHN_GBR]: DismissedProductTrainingElement;

    /**
     * When user dismisses the renameSavedSearch product training tooltip, we store the timestamp here.
     */
    [RENAME_SAVED_SEARCH]: DismissedProductTrainingElement;

    /**
     * When user dismisses the workspaceChatCreate product training tooltip, we store the timestamp here.
     */
    [WORKSAPCE_CHAT_CREATE]: DismissedProductTrainingElement;

    /**
     * When user dismisses the quickActionButton product training tooltip, we store the timestamp here.
     */
    [QUICK_ACTION_BUTTON]: DismissedProductTrainingElement;

    /**
     * When user dismisses the searchFilterButtonTooltip product training tooltip, we store the timestamp here.
     */
    [SEARCH_FILTER_BUTTON_TOOLTIP]: DismissedProductTrainingElement;

    /**
     * When user dismisses the bottomNavInboxTooltip product training tooltip, we store the timestamp here.
     */
    [BOTTOM_NAV_INBOX_TOOLTIP]: DismissedProductTrainingElement;

    /**
     * When user dismisses the lhnWorkspaceChatTooltip product training tooltip, we store the timestamp here.
     */
    [LHN_WORKSPACE_CHAT_TOOLTIP]: DismissedProductTrainingElement;

    /**
     * When user dismisses the globalCreateTooltip product training tooltip, we store the timestamp here.
     */
    [GLOBAL_CREATE_TOOLTIP]: DismissedProductTrainingElement;

    /**
     * When user dismisses the globalCreateTooltip product training tooltip, we store the timestamp here.
     */
    [SCAN_TEST_TOOLTIP]: DismissedProductTrainingElement;

    /**
     * When user dismisses the onboardingTaskTooltip product training tooltip, we store the timestamp here.
     */
    [ONBOARDING_TASK_TOOLTIP]: DismissedProductTrainingElement;
};

export default DismissedProductTraining;
