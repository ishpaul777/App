import React from "react";
import PropTypes from "prop-types";
import YearPickerModal from "@components/NewDatePicker/CalendarPicker/YearPickerModal";

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

function DobYearPickerPage({route, navigation}) {
	return (
		<YearPickerModal route={route} navigation={navigation} />
	)
}

DobYearPickerPage.displayName = 'DobYearPickerPage';
DobYearPickerPage.propTypes = propTypes;

export default DobYearPickerPage;
