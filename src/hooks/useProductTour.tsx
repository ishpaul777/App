import React, {createContext, useCallback, useContext, useMemo} from 'react';
import {View} from 'react-native';
import {useOnyx} from 'react-native-onyx';
import type {ValueOf} from 'type-fest';
import Icon from '@components/Icon';
import * as Expensicons from '@components/Icon/Expensicons';
import Text from '@components/Text';
import {
    setMigratedUserFilterTooltipViewed,
    setMigratedUserGlobalCreateTooltipViewed,
    setMigratedUserInboxTooltipViewed,
    setMigratedUserWorkspaceChatTooltipViewed,
} from '@libs/actions/Welcome';
import CONST from '@src/CONST';
import type {TranslationPaths} from '@src/languages/types';
import ONYXKEYS from '@src/ONYXKEYS';
import type ChildrenProps from '@src/types/utils/ChildrenProps';
import useLocalize from './useLocalize';
import useTheme from './useTheme';
import useThemeStyles from './useThemeStyles';

type ProductTourContextType = {
    shouldShowMigratedUserOnboardingModal: boolean;
    renderProductTourElement: (elementName: ValueOf<typeof CONST.MIGRATED_USER_PRODUCT_TRAINING_ELEMENTS>) => React.ReactNode | null;
    shouldShowFilterButtonTooltip: boolean;
    shouldShowBottomNavInboxTooltip: boolean;
    shouldShowWorkspaceChatLhnTooltip: boolean;
    shouldShowGlobalCreateTooltip: boolean;
};

const ProductTourContext = createContext<ProductTourContextType>({
    shouldShowMigratedUserOnboardingModal: false,
    renderProductTourElement: () => null,
    shouldShowFilterButtonTooltip: false,
    shouldShowBottomNavInboxTooltip: false,
    shouldShowWorkspaceChatLhnTooltip: false,
    shouldShowGlobalCreateTooltip: false,
});

const {NUDGE_MIGRATION_WELCOME_MODAL, FILTER_BUTTON_TOOLTIP, BOTTOM_NAV_INBOX_TOOLTIP, WORKSPACE_CHAT_LHN_TOOLTIP, GLOBAL_CREATE_TOOLTIP} = CONST.MIGRATED_USER_PRODUCT_TRAINING_ELEMENTS;

const PRODUCT_TOUR_FLOWS = {
    MIGRATED_USER: {
        [NUDGE_MIGRATION_WELCOME_MODAL]: {
            text: [{translationKey: 'nudgemigrationProductTour.welcomeModal', isBold: false}],
            onHideElement: () => {},
            name: NUDGE_MIGRATION_WELCOME_MODAL,
            priority: 1000,
        },
        [FILTER_BUTTON_TOOLTIP]: {
            text: [
                {translationKey: 'nudgemigrationProductTour.filterButton.bold', isBold: true},
                {translationKey: 'nudgemigrationProductTour.filterButton.regular', isBold: false},
            ],
            onHideElement: setMigratedUserFilterTooltipViewed,
            name: FILTER_BUTTON_TOOLTIP,
            priority: 900,
        },
        [BOTTOM_NAV_INBOX_TOOLTIP]: {
            text: [
                {translationKey: 'nudgemigrationProductTour.bottomNavInbox.bold', isBold: true},
                {translationKey: 'nudgemigrationProductTour.bottomNavInbox.regular', isBold: false},
            ],
            onHideElement: setMigratedUserInboxTooltipViewed,
            name: BOTTOM_NAV_INBOX_TOOLTIP,
            priority: 800,
        },
        [WORKSPACE_CHAT_LHN_TOOLTIP]: {
            text: [{translationKey: 'nudgemigrationProductTour.workspaceChat', isBold: false}],
            onHideElement: setMigratedUserWorkspaceChatTooltipViewed,
            name: WORKSPACE_CHAT_LHN_TOOLTIP,
            priority: 700,
        },
        [GLOBAL_CREATE_TOOLTIP]: {
            text: [{translationKey: 'nudgemigrationProductTour.globalCreate', isBold: false}],
            onHideElement: setMigratedUserGlobalCreateTooltipViewed,
            name: GLOBAL_CREATE_TOOLTIP,
            priority: 600,
        },
    },
};

function ProductTourProvider({children}: ChildrenProps) {
    const [tryNewDot] = useOnyx(ONYXKEYS.NVP_TRYNEWDOT);
    const hasBeenAddedToNudgeMigration = !!tryNewDot?.nudgeMigration?.timestamp;
    const [dismissedProductTraining] = useOnyx(ONYXKEYS.NVP_DISMISSED_PRODUCT_TRAINING);
    const {translate} = useLocalize();

    const styles = useThemeStyles();
    const theme = useTheme();

    const shouldRenderElement = useCallback(
        (elementName: ValueOf<typeof CONST.MIGRATED_USER_PRODUCT_TRAINING_ELEMENTS>) => {
            return hasBeenAddedToNudgeMigration && !dismissedProductTraining?.[elementName];
        },
        [hasBeenAddedToNudgeMigration, dismissedProductTraining],
    );

    const getNextElementForProductTourElement = useCallback(() => {
        if (hasBeenAddedToNudgeMigration && !dismissedProductTraining) {
            return PRODUCT_TOUR_FLOWS.MIGRATED_USER[NUDGE_MIGRATION_WELCOME_MODAL];
        }
        const availableTooltips = Object.values(PRODUCT_TOUR_FLOWS.MIGRATED_USER).sort((a, b) => b.priority - a.priority);
        return availableTooltips.find((flow) => shouldRenderElement(flow.name));
    }, [hasBeenAddedToNudgeMigration, dismissedProductTraining, shouldRenderElement]);

    const shouldShowMigratedUserOnboardingModal = useMemo(() => {
        const nextElement = getNextElementForProductTourElement();
        return nextElement?.name === NUDGE_MIGRATION_WELCOME_MODAL && hasBeenAddedToNudgeMigration;
    }, [getNextElementForProductTourElement, hasBeenAddedToNudgeMigration]);

    const shouldShowFilterButtonTooltip = useMemo(() => {
        const nextElement = getNextElementForProductTourElement();
        return nextElement?.name === FILTER_BUTTON_TOOLTIP && hasBeenAddedToNudgeMigration;
    }, [getNextElementForProductTourElement, hasBeenAddedToNudgeMigration]);

    const shouldShowBottomNavInboxTooltip = useMemo(() => {
        const nextElement = getNextElementForProductTourElement();
        return nextElement?.name === BOTTOM_NAV_INBOX_TOOLTIP && hasBeenAddedToNudgeMigration;
    }, [getNextElementForProductTourElement, hasBeenAddedToNudgeMigration]);

    const shouldShowWorkspaceChatLhnTooltip = useMemo(() => {
        const nextElement = getNextElementForProductTourElement();
        return nextElement?.name === WORKSPACE_CHAT_LHN_TOOLTIP && hasBeenAddedToNudgeMigration;
    }, [getNextElementForProductTourElement, hasBeenAddedToNudgeMigration]);

    const shouldShowGlobalCreateTooltip = useMemo(() => {
        const nextElement = getNextElementForProductTourElement();
        return nextElement?.name === GLOBAL_CREATE_TOOLTIP && hasBeenAddedToNudgeMigration;
    }, [getNextElementForProductTourElement, hasBeenAddedToNudgeMigration]);

    const renderProductTourElement = useCallback(
        (elementName: ValueOf<typeof CONST.MIGRATED_USER_PRODUCT_TRAINING_ELEMENTS>) => {
            const element = PRODUCT_TOUR_FLOWS.MIGRATED_USER[elementName];
            if (!element) {
                return null;
            }
            return (
                <View style={[styles.alignItemsCenter, styles.flexRow, styles.justifyContentCenter, styles.flexWrap, styles.textAlignCenter, styles.gap1]}>
                    <Icon
                        src={Expensicons.Lightbulb}
                        fill={theme.tooltipHighlightText}
                        medium
                    />
                    <View style={[styles.flexColumn]}>
                        {element.text.map((part) => (
                            <Text
                                key={part.translationKey}
                                style={part.isBold ? [styles.quickActionTooltipSubtitle, styles.textBold] : styles.quickActionTooltipSubtitle}
                            >
                                {translate(part.translationKey as TranslationPaths)}
                            </Text>
                        ))}
                    </View>
                </View>
            );
        },
        [
            styles.alignItemsCenter,
            styles.flexColumn,
            styles.flexRow,
            styles.flexWrap,
            styles.gap1,
            styles.justifyContentCenter,
            styles.quickActionTooltipSubtitle,
            styles.textAlignCenter,
            styles.textBold,
            theme.tooltipHighlightText,
            translate,
        ],
    );

    const contextValue = useMemo(
        () => ({
            shouldShowMigratedUserOnboardingModal,
            renderProductTourElement,
            shouldShowFilterButtonTooltip,
            shouldShowBottomNavInboxTooltip,
            shouldShowWorkspaceChatLhnTooltip,
            shouldShowGlobalCreateTooltip,
        }),
        [
            shouldShowMigratedUserOnboardingModal,
            renderProductTourElement,
            shouldShowFilterButtonTooltip,
            shouldShowBottomNavInboxTooltip,
            shouldShowWorkspaceChatLhnTooltip,
            shouldShowGlobalCreateTooltip,
        ],
    );

    return <ProductTourContext.Provider value={contextValue}>{children}</ProductTourContext.Provider>;
}

// Hook to use the ProductTour context
const useProductTourContext = () => {
    const context = useContext(ProductTourContext);
    if (!context) {
        throw new Error('useProductTourContext must be used within a ProductTourProvider');
    }
    return context;
};

export {ProductTourProvider};

export default useProductTourContext;
