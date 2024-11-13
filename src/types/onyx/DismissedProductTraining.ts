/**
 * This type is used to store the timestamp of when the user dismisses a product training ui elements.
 */
type DismissedProductTraining = {
    /**
     * When user dismisses the GBR tooltip on Concierege chat screen, we store the timestamp here.
     */
    conciergeGBRTooltip: Date;

    /**
     * When user dismisses the nudgeMigration Welcome Modal, we store the timestamp here.
     */
    nudgeMigrationWelcomeModal: Date;
    /**
     * When user dismisses the filter icon tooltip, we store the timestamp here.
     */
    filterButtonTooltip: Date;
    /**
     * When user dismisses the bottom nav inbox tooltip, we store the timestamp here.
     */
    bottomNavInboxTooltip: Date;
    /**
     * When user dismisses the workspace chat tooltip, we store the timestamp here.
     */
    workspaceChatLHNTooltip: Date;
    /**
     * When user dismisses the global create tooltip, we store the timestamp here.
     */
    globalCreateTooltip: Date;
};

export default DismissedProductTraining;
