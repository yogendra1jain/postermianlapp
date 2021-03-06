import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */

/* Redux Imports */

/* Component Imports */


class HomeContainer extends React.Component {

    constructor() {
        super();
        this.state = {
            productListHeight: 0,
        }
    }

    componentDidMount(){
        this.calcHeight();
    }

    calcHeight(){
        let windowHeight = document.documentElement.scrollHeight
        let headerHeight = document.getElementById('pos-product-header').offsetHeight;
        let categoriesHeight = document.getElementById('pos-categories-header').offsetHeight;
        let productListHeight = windowHeight - ( headerHeight + categoriesHeight + 30)
        this.setState({
            windowHeight: windowHeight,
            headerHeight,
            categoriesHeight,
            productListHeight
        })
    }


    render() {
        let windowHeight = document.documentElement.scrollHeight
        let { productListHeight } = this.state
        return (
            <div className='pos-body'>
                <div className='pos-products-collection' style={{height: windowHeight}}>
                    <div className='pos-header' id='pos-product-header'>
                        <div className="header-top">

                        </div>
                        <div className='header-bottom'>

                        </div>
                    </div>


                    <div className='product-catogories' id='pos-categories-header'>
                        <div className='each-tile blue-background'>
                            <span className='category-text'>
                                Hello
                            </span>
                        </div>
                        <div className='each-tile blue-background'>
                            <span className='category-text'>
                                Hello
                            </span>
                        </div>
                        <div className='each-tile blue-background'>
                            <span className='category-text'>
                                Hello
                            </span>
                        </div>
                        <div className='each-tile blue-background'>
                            <span className='category-text'>
                                Hello
                            </span>
                        </div>
                    </div>

                    <div className='pos-products' style={{height: productListHeight}}>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Red Blue Green Rose</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Code : </span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Lorem Ipsem</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Code : </span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Lorem Ipsem</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Code : </span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Lorem Ipsem</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Code : </span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Lorem Ipsem</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Code : </span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Lorem Ipsem</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Code : </span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Lorem Ipsem</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Code : </span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Lorem Ipsem</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Code : </span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Lorem Ipsem</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Code : </span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Lorem Ipsem</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Code : </span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Lorem Ipsem</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Code : </span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Lorem Ipsem</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Code : </span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Lorem Ipsem</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Code : </span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Lorem Ipsem</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Code : </span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Lorem Ipsem</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Code : </span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Lorem Ipsem</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Code : </span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Lorem Ipsem</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Code : </span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                    </div>

                </div>



                <div className='pos-checkout'>
                    <div className='pos-header'>
                        <div className='checkout-tabs'>
                            <div className='each-tab'>Order</div>
                            <div className='each-tab'>Customer</div>
                            <div className='each-tab'>Payment</div>
                        </div>
                    </div>
                </div>




                <div className='pos-payment'>
                    hello
                </div>



            </div>
        );
    }
}

export default HomeContainer;