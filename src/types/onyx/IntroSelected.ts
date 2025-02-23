import type {OnboardingInvite} from '@src/CONST';
import type {OnboardingPurpose} from './index';

/** Model of onboarding */
type IntroSelected = {
    /** The choice that the user selected in the engagement modal */
    choice?: OnboardingPurpose;

    /** The invite type */
    inviteType?: OnboardingInvite;

    /** Whether the onboarding is complete */
    isInviteOnboardingComplete?: boolean;

    /** Task reportID for 'viewTour' type */
    viewTour?: string;

    /** Task reportID for 'createWorkspace' type */
    createWorkspace?: string;

    /** Task reportID for 'manageTeam' type */
    meetGuide?: string;

    /** Task reportID for 'setupCategoriesAndTags' type */
    setupCategoriesAndTags?: string;

    /** Task reportID for 'setupCategories' type */
    setupCategories?: string;

    /** Task reportID for 'setupTags' type */
    setupTags?: string;

    /** Task reportID for 'addExpenseApprovals' type */
    addExpenseApprovals?: string;

    /** Task reportID for 'inviteTeam' type */
    inviteTeam?: string;

    /** Task reportID for 'addAccountingIntegration' type */
    addAccountingIntegration?: string;
};

export default IntroSelected;
