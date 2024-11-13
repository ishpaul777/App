import {useFocusEffect} from '@react-navigation/native';
import React, {createContext, useCallback, useContext, useMemo, useState} from 'react';
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
import {hasCompletedGuidedSetupFlowSelector} from '@libs/onboardingSelectors';
import CONST from '@src/CONST';
import type {TranslationPaths} from '@src/languages/types';
import ONYXKEYS from '@src/ONYXKEYS';
import type ChildrenProps from '@src/types/utils/ChildrenProps';
import useLocalize from './useLocalize';
import useResponsiveLayout from './useResponsiveLayout';
import useTheme from './useTheme';
import useThemeStyles from './useThemeStyles';

type ProductTourContextType = {
    shouldShowMigratedUserOnboardingModal: boolean;
    renderProductTourElement: (elementName: ValueOf<typeof CONST.PRODUCT_TRAINING_ELEMENTS>) => React.ReactNode | null;
    shouldShowFilterButtonTooltip: boolean;
    shouldShowBottomNavInboxTooltip: boolean;
    shouldShowWorkspaceChatLhnTooltip: boolean;
    shouldShowGlobalCreateTooltip: boolean;
    shouldShowConciergeGBRTooltip: boolean;
};

const ProductTourContext = createContext<ProductTourContextType>({
    shouldShowMigratedUserOnboardingModal: false,
    renderProductTourElement: () => null,
    shouldShowFilterButtonTooltip: false,
    shouldShowBottomNavInboxTooltip: false,
    shouldShowWorkspaceChatLhnTooltip: false,
    shouldShowGlobalCreateTooltip: false,
    shouldShowConciergeGBRTooltip: false,
});

const {NUDGE_MIGRATION_WELCOME_MODAL, FILTER_BUTTON_TOOLTIP, BOTTOM_NAV_INBOX_TOOLTIP, WORKSPACE_CHAT_LHN_TOOLTIP, GLOBAL_CREATE_TOOLTIP, CONCIERGE_GBR_TOOLTIP} =
    CONST.PRODUCT_TRAINING_ELEMENTS;

const PRODUCT_TOUR_FLOWS = {
    [CONCIERGE_GBR_TOOLTIP]: {
        text: [
            [
                {translationKey: 'productTraining.conciergeGBRTooltip.regular', isBold: false},
                {translationKey: 'productTraining.conciergeGBRTooltip.bold', isBold: true},
            ],
        ],
        onHideElement: () => {},
        name: CONCIERGE_GBR_TOOLTIP,
        shouldShowForNewUserOnly: true,
        shouldShowOnNarrowLayoutOnly: true,
        priority: 1300,
    },
    [NUDGE_MIGRATION_WELCOME_MODAL]: {
        text: [{translationKey: 'productTraining.welcomeModal', isBold: false}],
        onHideElement: () => {},
        name: NUDGE_MIGRATION_WELCOME_MODAL,
        priority: 1000,
    },
    [FILTER_BUTTON_TOOLTIP]: {
        text: [
            {translationKey: 'productTraining.filterButton.bold', isBold: true},
            {translationKey: 'productTraining.filterButton.regular', isBold: false},
        ],
        onHideElement: setMigratedUserFilterTooltipViewed,
        name: FILTER_BUTTON_TOOLTIP,
        priority: 900,
    },
    [BOTTOM_NAV_INBOX_TOOLTIP]: {
        text: [
            [
                {translationKey: 'productTraining.bottomNavInbox.bold', isBold: true},
                {translationKey: 'productTraining.bottomNavInbox.regular.part1', isBold: false},
            ],
            {translationKey: 'productTraining.bottomNavInbox.regular.part2', isBold: false},
        ],
        onHideElement: setMigratedUserInboxTooltipViewed,
        name: BOTTOM_NAV_INBOX_TOOLTIP,
        priority: 800,
    },
    [GLOBAL_CREATE_TOOLTIP]: {
        text: [
            [
                {translationKey: 'productTraining.globalCreate.bold', isBold: true},
                {translationKey: 'productTraining.globalCreate.regular.part1', isBold: false},
            ],
            {translationKey: 'productTraining.globalCreate.regular.part2', isBold: false},
        ],
        onHideElement: setMigratedUserGlobalCreateTooltipViewed,
        name: GLOBAL_CREATE_TOOLTIP,
        priority: 600,
    },
    [WORKSPACE_CHAT_LHN_TOOLTIP]: {
        text: [
            {translationKey: 'productTraining.workspaceChat.regular.part1', isBold: false},
            [
                {translationKey: 'productTraining.workspaceChat.regular.part2', isBold: false},
                {translationKey: 'productTraining.workspaceChat.bold', isBold: true},
            ],
        ],
        onHideElement: setMigratedUserWorkspaceChatTooltipViewed,
        name: WORKSPACE_CHAT_LHN_TOOLTIP,
        priority: 700,
    },
};
const tooltipNames = {
    shouldShowConciergeGBRTooltip: CONCIERGE_GBR_TOOLTIP,
    shouldShowMigratedUserOnboardingModal: NUDGE_MIGRATION_WELCOME_MODAL,
    shouldShowFilterButtonTooltip: FILTER_BUTTON_TOOLTIP,
    shouldShowBottomNavInboxTooltip: BOTTOM_NAV_INBOX_TOOLTIP,
    shouldShowWorkspaceChatLhnTooltip: WORKSPACE_CHAT_LHN_TOOLTIP,
    shouldShowGlobalCreateTooltip: GLOBAL_CREATE_TOOLTIP,
};

function ProductTourProvider({children}: ChildrenProps) {
    const [tryNewDot] = useOnyx(ONYXKEYS.NVP_TRYNEWDOT);
    const hasBeenAddedToNudgeMigration = !!tryNewDot?.nudgeMigration?.timestamp;
    const [isFirstTimeNewExpensifyUser] = useOnyx(ONYXKEYS.NVP_IS_FIRST_TIME_NEW_EXPENSIFY_USER);
    const [isOnboardingCompleted = true] = useOnyx(ONYXKEYS.NVP_ONBOARDING, {
        selector: hasCompletedGuidedSetupFlowSelector,
    });
    const [dismissedProductTraining] = useOnyx(ONYXKEYS.NVP_DISMISSED_PRODUCT_TRAINING);
    const {translate} = useLocalize();
    const [isScreenFocused, setIsScreenFocused] = useState(false);
    useFocusEffect(
        useCallback(() => {
            setIsScreenFocused(true);
            return () => {
                setIsScreenFocused(false);
            };
        }, []),
    );
    const {shouldUseNarrowLayout} = useResponsiveLayout();

    const styles = useThemeStyles();
    const theme = useTheme();

    const shouldRenderElement = useCallback(
        (elementName: ValueOf<typeof CONST.PRODUCT_TRAINING_ELEMENTS>) => {
            return !dismissedProductTraining?.[elementName] && isScreenFocused;
        },
        [dismissedProductTraining, isScreenFocused],
    );

    const getNextElementForProductTourElement = useCallback(() => {
        if (!isFirstTimeNewExpensifyUser && !hasBeenAddedToNudgeMigration) {
            return undefined;
        }
        const availableTooltips = Object.values(PRODUCT_TOUR_FLOWS)
            .filter((item) => {
                if (item.name === NUDGE_MIGRATION_WELCOME_MODAL) {
                    return hasBeenAddedToNudgeMigration;
                }
                // if item is for new user only don't show if user is not new or onboarding is completed
                if ('shouldShowForNewUserOnly' in item && item.shouldShowForNewUserOnly) {
                    if ('shouldShowOnNarrowLayoutOnly' in item && item.shouldShowOnNarrowLayoutOnly) {
                        return shouldUseNarrowLayout;
                    }
                    return isFirstTimeNewExpensifyUser && isOnboardingCompleted;
                }
                // if item should only show on narrow layout don't show if not on narrow layout
                return true;
            })
            .sort((a, b) => b.priority - a.priority);
        return availableTooltips.find((flow) => shouldRenderElement(flow.name));
    }, [shouldRenderElement, hasBeenAddedToNudgeMigration, isFirstTimeNewExpensifyUser, isOnboardingCompleted, shouldUseNarrowLayout]);

    // Using useMemo to derive each tooltip display boolean based on the next element
    const tooltipStates = useMemo(() => {
        const nextElement = getNextElementForProductTourElement();
        return Object.fromEntries(Object.entries(tooltipNames).map(([key, tooltipName]) => [key, nextElement?.name === tooltipName]));
    }, [getNextElementForProductTourElement]);

    const {
        shouldShowConciergeGBRTooltip,
        shouldShowMigratedUserOnboardingModal,
        shouldShowFilterButtonTooltip,
        shouldShowBottomNavInboxTooltip,
        shouldShowWorkspaceChatLhnTooltip,
        shouldShowGlobalCreateTooltip,
    } = tooltipStates;

    const renderProductTourElement = useCallback(
        (elementName: ValueOf<typeof CONST.PRODUCT_TRAINING_ELEMENTS>) => {
            const element = PRODUCT_TOUR_FLOWS[elementName];
            if (!element) {
                return null;
            }
            return (
                <View style={[styles.alignItemsCenter, styles.flexRow, styles.justifyContentCenter, styles.flexWrap, styles.textAlignCenter, styles.gap1, styles.p2]}>
                    <Icon
                        src={Expensicons.Lightbulb}
                        fill={theme.tooltipHighlightText}
                        medium
                    />
                    <View style={[styles.flexColumn]}>
                        {element.text.map((part) => {
                            if (Array.isArray(part)) {
                                return (
                                    <Text style={styles.quickActionTooltipSubtitle}>
                                        {part.map((subPart) => (
                                            <Text style={subPart.isBold ? [styles.quickActionTooltipSubtitle, styles.textBold] : styles.quickActionTooltipSubtitle}>
                                                {translate(subPart.translationKey as TranslationPaths)}
                                            </Text>
                                        ))}
                                    </Text>
                                );
                            }
                            return (
                                <Text style={part.isBold ? [styles.quickActionTooltipSubtitle, styles.textBold] : styles.quickActionTooltipSubtitle}>
                                    {translate(part.translationKey as TranslationPaths)}
                                </Text>
                            );
                        })}
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
            styles.p2,
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
            shouldShowConciergeGBRTooltip,
        }),
        [
            shouldShowMigratedUserOnboardingModal,
            renderProductTourElement,
            shouldShowFilterButtonTooltip,
            shouldShowBottomNavInboxTooltip,
            shouldShowWorkspaceChatLhnTooltip,
            shouldShowGlobalCreateTooltip,
            shouldShowConciergeGBRTooltip,
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
