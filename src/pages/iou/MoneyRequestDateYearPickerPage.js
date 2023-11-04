import {getYear} from 'date-fns';
import PropTypes from 'prop-types';
import React from 'react';
import YearPickerModal from '@components/NewDatePicker/CalendarPicker/YearPickerModal';

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

function MoneyRequestDateYearPickerPage({route, navigation}) {
    return (
        <YearPickerModal
            route={route}
            navigation={navigation}
            maxYear={getYear(new Date())}
        />
    );
}

MoneyRequestDateYearPickerPage.displayName = 'MoneyRequestDateYearPickerPage';
MoneyRequestDateYearPickerPage.propTypes = propTypes;

export default MoneyRequestDateYearPickerPage;
