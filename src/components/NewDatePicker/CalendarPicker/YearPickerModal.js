import { subYears, getYear } from 'date-fns';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import _ from 'underscore';
import HeaderWithBackButton from '@components/HeaderWithBackButton';
import Navigation from '@libs/Navigation/Navigation';
import ScreenWrapper from '@components/ScreenWrapper';
import SelectionList from '@components/SelectionList';
import useLocalize from '@hooks/useLocalize';
import lodashGet from 'lodash/get';
import styles from '@styles/styles';
import CONST from '@src/CONST';

const propTypes = {
    /** Route from navigation */
    route: PropTypes.shape({
        /** Params from the route */
        params: PropTypes.shape({
            /** Currently selected country */
            country: PropTypes.string,

            /** Route to navigate back after selecting a currency */
            backTo: PropTypes.string,
        }),
    }).isRequired,

    /** Navigation from react-navigation */
    navigation: PropTypes.shape({
        /** getState function retrieves the current navigation state from react-navigation's navigation property */
        getState: PropTypes.func.isRequired,
    }).isRequired,
};


function YearPickerModal({ route, navigation }) {
    const minDate = subYears(new Date(), CONST.DATE_BIRTH.MAX_AGE)
    const maxDate = subYears(new Date(), CONST.DATE_BIRTH.MIN_AGE)

    const minYear = getYear(new Date(minDate));
    const maxYear = getYear(new Date(maxDate));

    const yearsArray = Array.from({ length: maxYear - minYear + 1 }, (v, i) => i + minYear)
    const { translate } = useLocalize();
    const [searchText, setSearchText] = useState('');

    const currentYear = lodashGet(route, 'params.year', new Date().getFullYear());

    const years = useMemo(() => _.map(yearsArray, (value) => ({
        text: value.toString(),
        value,
        keyForList: value.toString(),
        isSelected: value.toString() === currentYear
    })), [currentYear, yearsArray]);


    const { sections, headerMessage } = useMemo(() => {
        const yearsList = searchText === '' ? years : _.filter(years, (year) => year.text.includes(searchText));
        return {
            headerMessage: !yearsList.length ? translate('common.noResultsFound') : '',
            sections: [{ data: yearsList, indexOffset: 0 }],
        };
    }, [years, searchText, translate]);

    const selectYear = useCallback(
        (option) => {
            const backTo = lodashGet(route, 'params.backTo', '');

            // Check the navigation state and "backTo" parameter to decide navigation behavior
            if (navigation.getState().routes.length === 1 && _.isEmpty(backTo)) {
                // If there is only one route and "backTo" is empty, go back in navigation
                Navigation.goBack();
            } else if (!_.isEmpty(backTo) && navigation.getState().routes.length === 1) {
                // If "backTo" is not empty and there is only one route, go back to the specific route defined in "backTo" with a country parameter
                Navigation.goBack(`${route.params.backTo}?country=${option.value}`);
            } else {
                // Otherwise, navigate to the specific route defined in "backTo" with a country parameter
                Navigation.navigate(`${route.params.backTo}?country=${option.value}`);
            }
        },
        [route, navigation],
    );


    return (
        <ScreenWrapper
            style={[styles.pb0]}
            includePaddingTop={false}
            includeSafeAreaPaddingBottom={false}
            testID={YearPickerModal.displayName}
        >
            <HeaderWithBackButton
                title={translate('yearPickerPage.year')}
            // onBackButtonPress={props.onClose}
            />
            <SelectionList
                shouldDelayFocus
                textInputLabel={translate('yearPickerPage.selectYear')}
                textInputValue={searchText}
                textInputMaxLength={4}
                onChangeText={(text) => setSearchText(text.replace(CONST.REGEX.NON_NUMERIC, '').trim())}
                keyboardType={CONST.KEYBOARD_TYPE.NUMBER_PAD}
                headerMessage={headerMessage}
                sections={sections}
                onSelectRow={selectYear}
                initiallyFocusedOptionKey={currentYear}
                showScrollIndicator
                shouldStopPropagation
            />
        </ScreenWrapper>
    );
}

YearPickerModal.propTypes = propTypes;
YearPickerModal.displayName = 'YearPickerModal';

export default YearPickerModal;
