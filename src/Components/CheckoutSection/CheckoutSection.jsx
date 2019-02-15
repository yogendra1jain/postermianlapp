import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */

/* Redux Imports */

/* Component Imports */
import TabView from './TabView'


class CheckoutSection extends React.Component {

    constructor() {
        super();
        this.state = {

        }
    }

    render() {
        return (
            <div className='pos-checkout' style={{height: this.props.windowHeight}}>
                <TabView
                    toggleViewPayment={this.props.toggleViewPayment}
                    toggleViewProduct={this.props.toggleViewProduct}
                    checkoutMainPart={this.props.checkoutMainPart}
                    checkoutcalcArea={this.props.checkoutcalcArea}
                    checkoutactionArea={this.props.checkoutactionArea}
                    checkoutcartArea={this.props.checkoutcartArea}
                />
            </div>
        );
    }
}

export default CheckoutSection;