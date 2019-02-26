import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _findIndex from 'lodash/findIndex';
import _find from 'lodash/find'
/* Material import */
import Info from '@material-ui/icons/Info';
import SimpleModal from '../../Global/Components/Modal/MaterialUIModal.jsx';
import { Button } from '@material-ui/core';
import RemoveCircleIcons from '@material-ui/icons/RemoveCircleOutline';
import AddIcons from '@material-ui/icons/AddCircleOutline';
/* Redux Imports */
import { commonActionCreater } from '../../Redux/commonAction';

import img1 from '../../assets/images/flowers/flower1.jpg'

class Product extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openModal: false,
            counter: 0,
            qty: 0,
            fromInfoView: false
        };
        this.ProductDetails = [];
    }

    componentWillReceiveProps(props) {
        let cartItems = _get(props, 'cart.cartItems', [])
        let data = _get(this, `props.data`, {});

        if (_find(cartItems, data)) {
            let qty = (_find(cartItems, data)).qty;
            this.setState({ qty })
        }
        else {
            this.setState({ qty: 0 })
        }
    }

    addToCart = (index, quantity, fromInfoView) => {
        if (this.state.fromInfoView || fromInfoView) {
            let cartItems = _get(this, 'props.cart.cartItems', [])
            let data = _get(this, `props.data`, {});
            let reqObj
            if (_isEmpty(_find(cartItems, data))) {
                reqObj = [
                    ...cartItems,
                    {
                        ...data,
                        qty: quantity ? quantity : 1,
                        saleType: 0,
                    }
                ];
                this.setState({ qty: quantity ? quantity : 1 })
            }
            else {
                let qty = (_find(cartItems, data)).qty + (quantity ? quantity : 1)
                let index = _findIndex(cartItems, ['id', data.id]);
                reqObj = [
                    ...cartItems
                ]
                reqObj[index].qty = qty;
                this.setState({ qty })
            }
            this.props.dispatch(commonActionCreater(reqObj, 'CART_ITEM_LIST'));
        }
        else {

        }
    }

    viewProductDetails = (index) => {
        this.setState({ openModal: true, fromInfoView: true })
    }

    onClose = () => {
        this.setState({ openModal: false, fromInfoView: false })
    }

    render() {
        let data = this.props.data;
        let index = this.props.index;
        return (
            <React.Fragment>
                <div className='each-tile white-background flex-row relative' onClick={() => this.addToCart(index)}>
                    <div className='absolute added-item-position'>
                        {this.state.qty ? <div className='added-item-count'>{this.state.qty}</div> : null}
                    </div>
                    <div className='product-image'>
                        <img src={_get(data, 'doc.product.image')} alt="" />
                    </div>
                    <div className='flex-column justify-space-between product-info'>
                        <div className='flex-column fwidth'>
                            <div className='truncate'>
                                <span className="each-card-name">{_get(data, 'doc.product.name', 'undefined')}</span>
                            </div>
                            <div className='truncate'>
                                <span className="each-card-code-head">Code : </span>
                                <span className='each-card-code'>{_get(data, 'doc.product.id', '')}</span>
                            </div>
                            <div className="each-card-price flex-row">
                                {_get(data, 'doc.product.salePrice.currencyCode', '')} {_get(data, 'doc.product.salePrice.price', 'NaN')}
                                <div className='indicator'></div>
                            </div>
                            <span onClick={() => this.viewProductDetails(index)} className="quick-view each-card-more" title="View Details">
                                <Info />
                            </span>
                        </div>
                    </div>
                </div>
                {
                    this.state.openModal ?
                        <SimpleModal
                            open={this.state.openModal}
                            onClose={this.onClose}
                            title={'Product Details'}
                            productDetails={_get(this.props, 'data.doc.product', {})}
                            inventoryDetails={_get(this.props, 'data.doc.inventory', {})}
                            index={index}
                            addToCart={(index, qty, fromInfoView) => this.addToCart(index, qty, fromInfoView)}
                        /> : ''
                }
            </React.Fragment>)
    }
}

export default Product;