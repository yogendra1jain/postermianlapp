import React from 'react';
import { withRouter } from 'react-router-dom';
import { Detector } from 'react-detect-offline';
/* Lodash Imports */
import _get from 'lodash/get';
import _set from 'lodash/set';
import _cloneDeep from 'lodash/cloneDeep';
/* Pouch DB */
import PouchDb from 'pouchdb';
/* Material import */
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
/* Redux Imports */
import { connect } from 'react-redux';
import { commonActionCreater } from '../../Redux/commonAction';
import { APPLICATION_BFF_URL } from '../../Redux/urlConstants';
import { postData } from '../../Redux/postAction';
import showMessage from '../../Redux/toastAction';
/* Global Imports */
import generateV1uuid from '../../Global/Uuid';
import LoaderButton from '../../Global/Components/LoaderButton';
import genericPostData from '../../Global/dataFetch/genericPostData';
import showErrorAlert from '../../Global/PosFunctions/showErrorAlert';
/* Component Imports */
import CashPay from './PaymentMethods/CashPay';
import CardPay from './PaymentMethods/CardPay';
import EmployeePay from './PaymentMethods/EmployeePay';
import GiftPay from './PaymentMethods/GiftPay';
import LoyaltyRedeem from './PaymentMethods/LoyaltyRedeem';
import PaymentReceipt from './paymentReceipt';
import CostCenter from './CostCenter';

let transactiondb = new PouchDb('transactiondb')
/* style */

class PaymentSection extends React.Component {

    constructor() {
        super();
        this.state = {
            showCashPay: false,
            showCardPay: false,
            showEmpPay: false,
            showGiftPay: false,
            showLoyaltyRedeem: false,
            cardAmountValue: '',
            defaultcardAmountValue: '',
            cashPayValue: '',
            giftPayNumberValue: '',
            giftAmountRedeemValue: '',
            receiptData: {},
            showPaymentReceipt: false,
            giftCard: {},
            originalGiftCard: {},
            giftCardUsedValue: 0,
            comment: '',
            currentFocus: ''
        }
    }

    componentDidMount() {
        //Action for getting total remaining ammount
        this.props.dispatch(commonActionCreater({ totalAmount: this.props.totalAmount }, 'CASH_INPUT_HANDLER'));

    }
    componentWillUnmount() {
        //Action for destroy all amount reducer
    }

    handleCashPayment = () => {
        this.setState({ showCashPay: true })
    }
    handleCardPayment = () => {
        this.setState({ showCardPay: true })

    }
    handleEmployeePay = () => {
        this.setState({ showEmpPay: true })
    }
    handleGiftCardPayment = () => {
        this.setState({ showGiftPay: true })
    }
    handleLoyaltyRedeem = () => {
        this.setState({ showLoyaltyRedeem: true })
    }
    handleCostCenter = () => {
        this.setState({ showCostCenter: true })
    }

    handleKeyBoardValue = (field, value) => {
        this.setState({ [field]: value });
    }
    handleGiftCardValue = (field, value) => {
        let giftCard = _get(this.state, 'giftCard', {});
        let originalGiftCard = _get(this.state, 'originalGiftCard', {});
        let existingValue = _get(this.state, 'originalGiftCard.value.amount', 0);
        _set(giftCard, 'value.amount', (value == 0 || value == '' ? _get(originalGiftCard, 'value.amount', 0) : existingValue - value));
        this.setState({
            giftCard: giftCard,
            giftCardUsedValue: value,
        })
    }
    onPayWithGiftCard = () => {
        let url = 'Sale/RedeemValueFromGiftCard';
        let value = {};
        let paymentTimeStamp = {
            seconds: parseInt(new Date().getTime() / 1000),
        }
        _set(value, 'amount', parseFloat(this.props.giftCardAmount));
        _set(value, 'currencyCode', '$');
        let data = {
            giftCardId: _get(this.state, 'giftCard.id', ''),
            value: value,
            customerId: _get(this.props, 'customer.id', ''),
            sessionId: localStorage.getItem('sessionId'),
            retailerId: localStorage.getItem('retailerId'),
            paymentTimeStamp: paymentTimeStamp,

        }
        this.paymentWithGiftCard(url, data, this.handleGiftCardPaymentSuccess, this.handleGiftCardPaymentError)
    }
    handleGiftCardPaymentSuccess = (data) => {
        console.log('came in payment success', data);
    }
    handleGiftCardPaymentError = (err) => {
        console.log('came in payment error', err);
    }
    getGiftCardDetail = (field, value) => {
        let url = 'GiftCard/GetByCodeAndStore';
        let data = {
            storeId: localStorage.getItem('storeId'),
            code: value,
        }
        this.getExistingGiftCard(url, data, this.handleGetGiftcardDataSuccess, this.handleGetGiftCardDataError);
    }
    paymentWithGiftCard = (url, data, successMethod, errorMethod) => {
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: data,
            url: url,
            constants: {
                init: 'GET_GIFT_CARD_PAYMENT_DATA_INIT',
                success: 'GET_GIFT_CARD_PAYMENT_DATA_SUCCESS',
                error: 'GET_GIFT_CARD_PAYMENT_DATA_ERROR'
            },
            identifier: 'GET_GIFT_CARD_PAYMENT_DATA',
            successCb: successMethod,
            errorCb: errorMethod,
            dontShowMessage: true
        })
    }
    getExistingGiftCard = (url, data, successMethod, errorMethod) => {
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: data,
            url: url,
            constants: {
                init: 'GET_GIFT_CARD_DATA_INIT',
                success: 'GET_GIFT_CARD__DATA_SUCCESS',
                error: 'GET_GIFT_CARD__DATA_ERROR'
            },
            identifier: 'GET_GIFT_CARD__DATA',
            successCb: successMethod,
            errorCb: errorMethod,
            dontShowMessage: true
        })
    }
    handleGetGiftcardDataSuccess = () => {
        console.log('came in success of gift card get');
        let { giftCard } = this.props;
        let status = _get(giftCard, 'status', 0);
        if (_get(giftCard, 'giftCode') && status === 1) {
            this.setState({
                giftCard: giftCard,
                originalGiftCard: _cloneDeep(giftCard),
            });
        } else {
            this.setState({
                giftCard: {},
            });
            alert('this gift card is not available/active.')
        }
    }
    handleGetGiftCardDataError = () => {
        console.log('came in error of gift card get');
    }

    handleInputChange = num => event => {
        if (this.state.currentFocus !== '') {
            let currentFocus = this.state.currentFocus;
            let focusItemValue = this.props[currentFocus];
            if (num != '<') {
                focusItemValue = (focusItemValue || '') + num;
            }
            else {
                focusItemValue = '';
            }

            this.props.dispatch(commonActionCreater({ [currentFocus]: focusItemValue, totalAmount: this.props.totalAmount }, this.state.handler))
        }
    }
    currentFocus = (field) => {
        this.setState({ currentFocus: field.fieldValue, handler: field.handler })
    }
    onRemovePaymentMethod = (fieldValue) => {
        if (fieldValue == 'showCashPay') {
            if (this.state.currentFocus == 'cashAmount') {
                this.setState({ [fieldValue]: false, currentFocus: '' });
            }
            else {
                this.setState({ [fieldValue]: false });
            }
            this.props.dispatch(commonActionCreater({ cashAmount: '', totalAmount: this.props.totalAmount }, 'CASH_INPUT_HANDLER'))
        }
        if (fieldValue == 'showCardPay') {
            if (this.state.currentFocus == 'cardAmount') {
                this.setState({ [fieldValue]: false, currentFocus: '' });
            }
            else {
                this.setState({ [fieldValue]: false });
            }
            this.props.dispatch(commonActionCreater({ cardAmount: '', totalAmount: this.props.totalAmount }, 'CARD_INPUT_HANDLER'))
        }
        if (fieldValue == 'showEmpPay') {
            if (this.state.currentFocus == 'employeePay') {
                this.setState({ [fieldValue]: false, currentFocus: '' });
            }
            else {
                this.setState({ [fieldValue]: false });
            }
            this.props.dispatch(commonActionCreater({ empPay: '', totalAmount: this.props.totalAmount }, 'Employee'))

        }
        if (fieldValue == 'showGiftPay') {
            if (this.state.currentFocus == 'giftCardAmount' || this.state.currentFocus == 'giftPayNumber') {
                this.setState({ [fieldValue]: false, currentFocus: '' });
            }
            else {
                this.setState({ [fieldValue]: false });
            }
            this.props.dispatch(commonActionCreater({ giftPayNumber: '', totalAmount: this.props.totalAmount }, 'GIFT_CARD_NUMBER'));
            this.props.dispatch(commonActionCreater({ giftCardAmount: '', totalAmount: this.props.totalAmount }, 'GIFT_AMOUNT_TO_REDEEM'));
        }
        if (fieldValue == 'showLoyaltyRedeem') {
            if (this.state.currentFocus == 'loyaltyRedeem') {
                this.setState({ [fieldValue]: false, currentFocus: '' });
            }
            else {
                this.setState({ [fieldValue]: false });
            }
            this.props.dispatch(commonActionCreater({ loyaltyRedeem: '', totalAmount: this.props.totalAmount }, 'LOYALTY_INPUT_HANDLER'));
        }
    }

    makReqObj = async (offline) => {
        let { customer, cartItems, totalAmount, sessionId } = this.props;
        let { cartDiscountAmount, employeeDiscountAmount, itemDiscountAmount, totalTaxAmount } = this.props.cart
        let saleItems = cartItems.map((item) => {
            let obj = {}
            obj.productId = item.doc.product.id;
            obj.qty = item.qty;
            obj.itemEffectiveTotal = item.itemEffectiveTotal;
            obj.itemRegularTotal = item.itemRegularTotal;
            obj.cartDiscountPercent = item.cartDiscountPercent;
            obj.itemDiscountPercent = item.itemDiscountPercent;
            obj.employeeDiscountPercent = item.employeeDiscountPercent;
            obj.itemTotalDiscountAmount = item.itemTotalDiscountAmount;
            obj.itemSubTotal = item.itemSubTotal;
            obj.itemTaxPercent = item.itemTaxPercent;
            obj.itemTaxAmount = item.itemTaxAmount
            obj.saleType = item.saleType;
            return obj;
        });

        let payments = []
        if ((parseFloat(this.props.cashAmount) || 0)) {
            payments.push({
                paymentMethod: 'CASH',
                paymentAmount: { currencyCode: '$', amount: (parseFloat(this.props.cashAmount) || 0) },
                paymentReference: ""
            })
        }
        if ((parseFloat(this.props.employeePay) || 0)) {
            payments.push({
                paymentMethod: 'EMPLOYEE_PAYROLL_DEDUCT',
                paymentAmount: { currencyCode: '$', amount: (parseFloat(this.props.employeePay) || 0) },
                paymentReference: ""
            })
        }
        if ((parseFloat(this.props.cardAmount) || 0)) {
            payments.push({
                paymentMethod: 'CARD',
                paymentAmount: { currencyCode: '$', amount: (parseFloat(this.props.cardAmount) || 0) },
                paymentReference: ""
            })
        }
        if ((parseFloat(this.props.giftCardAmount) || 0)) {
            let url = 'Sale/RedeemValueFromGiftCard';
            let value = {};
            let paymentTimeStamp = {
                seconds: parseInt(new Date().getTime() / 1000),
            }
            _set(value, 'amount', parseFloat(this.props.giftCardAmount));
            _set(value, 'currencyCode', '$');
            let data = {
                giftCardId: _get(this.props, 'giftCardData.id', ''),
                value: value,
                customerId: _get(this.props, 'customer.id', ''),
                sessionId: localStorage.getItem('sessionId'),
                retailerId: localStorage.getItem('retailerId'),
                paymentTimeStamp: paymentTimeStamp,

            }

            let apiResponse = await this.props.dispatch(postData(`${APPLICATION_BFF_URL}${url}`, data, 'GET_GIFT_CARD_PAYMENT_DATA', {
                init: 'GET_GIFT_CARD_PAYMENT_DATA_INIT',
                success: 'GET_GIFT_CARD_PAYMENT_DATA_SUCCESS',
                error: 'GET_GIFT_CARD_PAYMENT_DATA_ERROR'
            }))
            payments.push({
                paymentMethod: 'GIFT_CARD',
                paymentAmount: { currencyCode: '$', amount: (parseFloat(this.props.giftCardAmount) || 0) },
                paymentReference: apiResponse,
            })
        }
        let LoyaltyValue = 0
        if ((parseFloat(this.props.loyaltyRedeem) || 0)) {
            let url = 'Sale/RedeemRewardPoints';
            let data = {
                customerId: _get(this.props, 'customer.id', ''),
                pointsToRedeem: parseInt(this.props.loyaltyRedeem),
                sessionId: localStorage.getItem('sessionId'),
                retailerId: localStorage.getItem('retailerId'),
            }
            LoyaltyValue = this.props.loyaltyRedeem * _get(this.props, 'redemptionRules.lookUpData.redemptionRule.redemptionMultiplier')
            let apiResponse = await this.props.dispatch(postData(`${APPLICATION_BFF_URL}${url}`, data, 'GET_REF_FROM_LOYALTY_REDEEM', {
                init: 'GET_REF_FROM_LOYALTY_REDEEM_INIT',
                success: 'GET_REF_FROM_LOYALTY_REDEEM_SUCCESS',
                error: 'GET_REF_FROM_LOYALTY_REDEEM_ERROR'
            }))
            payments.push({
                paymentMethod: 'LOYALTY_POINTS',
                paymentAmount: { currencyCode: '$', amount: (parseFloat(LoyaltyValue) || 0) },
                paymentReference: apiResponse,
            })
        }

        let totalAmountPaid =
            (parseFloat(this.props.cardAmount) || 0) +
            (parseFloat(this.props.employeePay) || 0) +
            (parseFloat(this.props.cashAmount || 0)) +
            (parseFloat(this.props.giftCardAmount) || 0) +
            (parseFloat(LoyaltyValue || 0))

        let reqObj = {
            customerId: customer.id,
            storeId: localStorage.getItem('storeId'),
            terminalId: localStorage.getItem('terminalId'),
            operatorId: localStorage.getItem('userId'),
            retailerId: localStorage.getItem('retailerId'),
            sessionId: localStorage.getItem('sessionId'),
            saleItems,
            payments,
            miscSaleItems: [],
            totalAmount,
            totalAmountPaid: { currencyCode: '$', amount: totalAmountPaid },
            cartDiscountAmount,
            employeeDiscountAmount,
            itemDiscountAmount,
            totalTaxAmount,
            offline,
            saleComment: _get(this.state, 'comment', ''),
            saleTimeStamp: { seconds: parseInt((new Date().getTime() / 1000)) },
            changeDue: { currencyCode: '$', amount: parseFloat(Math.abs(this.props.remainingAmount.toFixed(2))) }

        };
        if (offline) {
            reqObj.customerName = _get(customer, 'customer.firstName', '') + ' ' + _get(customer, 'customer.lastName');
            reqObj.terminalName = localStorage.getItem('terminalName');
            reqObj.staffName = localStorage.getItem('userName');
            reqObj.id = generateV1uuid();
            reqObj._id = generateV1uuid();
        }
        return reqObj;

    }
    handleSaleTransaction = async (offline) => {
        this.setState({ isLoadingTransaction: true })
        await this.makReqObj(offline).then((reqObj) => {
            if (offline) {
                this.handleSaleTransactionOffline(reqObj);
            }
            else {
                this.handleSaleTransactionOnline(reqObj);
            }

        })
            .catch((error) => {
                this.setState({ isLoadingTransaction: false });
                showErrorAlert({ dispatch: this.props.dispatch, error: error })
            })
    }
    handleSaleTransactionOffline = (reqObj) => {

        transactiondb.put({
            _id: reqObj.id,
            id: reqObj.id,
            transactionDoc: reqObj
        }).then((data) => {
            this.setState({ isLoadingTransaction: false });
            this.props.startPolling();
            this.setState({ receiptData: reqObj, showPaymentReceipt: true, transactionStatus: 'offline' });
            PouchDb.replicate('transactiondb', `http://localhost:5984/transactiondb`, {
                live: true,
                retry: true
            });
        })
            .catch((err) => {
                this.setState({ isLoadingTransaction: false })
            })
    }

    handleSaleTransactionOnline = (reqObj) => {
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj,
            url: 'Sale/CreateSaleTransaction',
            constants: {
                init: 'POST_SALE_TRANSACTION_INIT',
                success: 'POST_SALE_TRANSACTION_SUCCESS',
                error: 'POST_SALE_TRANSACTION_ERROR'
            },
            identifier: 'SALE_TRANSACTION_INIT',
            successCb: this.handleSaleOnlineTransactionSuccess,
            errorCb: this.handleSaleOnlineTransactionError,
            dontShowMessage: true

        })
    }

    handleSaleOnlineTransactionSuccess = (data) => {
        this.setState({ isLoadingTransaction: false })
        this.props.dispatch(commonActionCreater('', 'SALE_COMMENT'));
        this.setState({ receiptData: data, showPaymentReceipt: true, transactionStatus: 'online' })
    }
    handleSaleOnlineTransactionError = () => {
        this.setState({ isLoadingTransaction: false })
    }
    handleClose = () => {
        this.setState({
            showPaymentReceipt: false,
            showCashPay: false,
            showCardPay: false,
            showEmpPay: false,
            showGiftPay: false,
            cardAmountValue: '',
            defaultcardAmountValue: '',
            cashPayValue: '',
            giftPayNumberValue: '',
            receiptData: {},
            showPaymentReceipt: false
        });
        this.props.history.push('/?tab==1');
    }

    buttonToRender = ({ online }) => {
        if (online)
            return (<LoaderButton
                color='primary'
                isFetching={this.state.isLoadingTransaction}
                fullWidth
                disabled={this.props.remainingAmount > 0}
                variant='contained'
                onClick={() => this.handleSaleTransaction(!online)}
            >  Submit Transaction
        </LoaderButton>)
        else {
            return (<LoaderButton
                style={{ color: 'red' }}
                fullWidth
                isFetching={this.state.isLoadingTransaction}
                disabled={this.props.remainingAmount > 0}
                variant='contained'
                onClick={() => this.handleSaleTransaction(!online)}
            >  Submit Transaction Offline
        </LoaderButton>)
        }
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };
    giftCardRender = ({ online }) => {
        let disable = this.props.remainingAmount <= 0 ? { opacity: '0.3', pointerEvents: 'none' } : null
        if (online)
            return (
                <React.Fragment>
                    <li style={disable} onClick={this.handleGiftCardPayment} className="giftcard-section">Gift Card</li>
                    {
                        _get(this.props, 'totalAmount.amount') > _get(this.props, 'redemptionRules.lookUpData.redemptionRule.minimumSaleAmount') && !(_get(this.props, 'customer.guest', false)) ?                     
                        <li style={disable} onClick={this.handleLoyaltyRedeem} className="giftcard-section">Redeem Points</li> : null
                    }
                </React.Fragment>
            )
        else {
            return (<li style={{ opacity: '0.3', pointerEvents: 'none' }} className="giftcard-section">Gift Card</li>)

        }
    }

    render() {
        console.log('mak', _get(this.props, 'totalAmount.amount'),  _get(this.props, 'RedemptionRules.lookUpData.redemptionRule.minimumSaleAmount'))
        console.log(this.state.receiptData, 'this.state.receiptData')
        let disable = this.props.remainingAmount <= 0 ? { opacity: '0.3', pointerEvents: 'none' } : null
        return (
            <div className='pos-payment'>
                <div className='flex-column'>
                    <div className='flex-row justify-space-between'>
                        <ul className="payment-method">
                            <li style={disable} onClick={this.handleCashPayment} className="cash-method">Cash</li>
                            <li style={disable} onClick={this.handleCardPayment} variant="outlined" className="card-method">Debit/Credit Card</li>
                            {_get(this.props, 'customer.isEmpPayEnabled') ? <li style={disable} onClick={this.handleEmployeePay} disabled={this.props.remainingAmount < 0} className="employee-section">Employee</li> : null}
                            <Detector render={this.giftCardRender} />
                            {/* <li  className="freedompay">Freedom <br/> Pay</li>      */}
                            <li style={disable} onClick={this.handleCostCenter} variant="outlined" className="card-method">Cost Center Charge</li>
                        </ul>
                    </div>

                    <div className='flex-row'>
                        <div className='card transaction-card'>
                            <span className='card-title soft-text'>Transactions</span>
                            <div className="Card">
                                <span>{this.props.remainingAmount > 0 ? 'Remaining Amount ' : 'Change Due '}</span>
                                <span>{Math.abs(this.props.remainingAmount).toFixed(2)}</span>
                            </div>
                            {this.state.showCashPay ?
                                <CashPay
                                    handleKeyBoardValue={this.handleKeyBoardValue}
                                    currentFocus={this.currentFocus}
                                    value={this.props.cashAmount}
                                    onRemovePaymentMethod={this.onRemovePaymentMethod}
                                /> : null}
                            {this.state.showCardPay ?
                                <CardPay
                                    handleKeyBoardValue={this.handleKeyBoardValue}
                                    currentFocus={this.currentFocus}
                                    value={this.props.cardAmount}
                                    onRemovePaymentMethod={this.onRemovePaymentMethod}
                                /> : null}
                            {this.state.showEmpPay ?
                                <EmployeePay
                                    handleKeyBoardValue={this.handleKeyBoardValue}
                                    customer={this.props.customer}
                                    value={this.props.employeePay}
                                    currentFocus={this.currentFocus}
                                    onRemovePaymentMethod={this.onRemovePaymentMethod}
                                /> : null}
                            {this.state.showGiftPay ?
                                <GiftPay
                                    handleKeyBoardValue={this.handleKeyBoardValue}
                                    handleGiftCardValue={this.handleGiftCardValue}
                                    getGiftCardDetail={this.getGiftCardDetail}
                                    giftPayNumberValue={this.state.giftPayNumberValue}
                                    giftAmountRedeemValue={this.state.giftAmountRedeemValue}
                                    currentFocus={this.currentFocus}
                                    giftCard={this.state.giftCard}
                                    giftCardId={_get(this.state, 'giftCard.id', '')}
                                    originalGiftCard={this.state.originalGiftCard}
                                    onRemovePaymentMethod={this.onRemovePaymentMethod}
                                    onPayWithGiftCard={this.onPayWithGiftCard}
                                /> : null}
                            {this.state.showLoyaltyRedeem ?
                                <LoyaltyRedeem
                                    handleKeyBoardValue={this.handleKeyBoardValue}
                                    currentFocus={this.currentFocus}
                                    value={this.props.loyaltyRedeem}
                                    onRemovePaymentMethod={this.onRemovePaymentMethod}
                                /> : null}
                            {
                                this.state.showCostCenter ?
                                    <CostCenter /> : null
                            }

                        </div>

                        <div className='numpad-section'>
                            <div className='card numpad-card'>
                                <span className='card-title'>Numpad</span>
                                <div className='flex-row flex-wrap justify-center pt-15'>
                                    <div className='key small-key' onClick={this.handleInputChange('1')}>1</div>
                                    <div className='key small-key' onClick={this.handleInputChange('2')}>2</div>
                                    <div className='key small-key' onClick={this.handleInputChange('3')}>3</div>
                                    <div className='key small-key' onClick={this.handleInputChange('4')}>4</div>
                                    <div className='key small-key' onClick={this.handleInputChange('5')}>5</div>
                                    <div className='key small-key' onClick={this.handleInputChange('6')}>6</div>
                                    <div className='key small-key' onClick={this.handleInputChange('7')}>7</div>
                                    <div className='key small-key' onClick={this.handleInputChange('8')}>8</div>
                                    <div className='key small-key' onClick={this.handleInputChange('9')}>9</div>
                                    <div className='key small-key' onClick={this.handleInputChange('.')}>.</div>
                                    <div className='key small-key' onClick={this.handleInputChange('0')}>0</div>
                                    <div className='key small-key' onClick={this.handleInputChange('<')}>clr</div>
                                    <div className='small-key'></div>
                                    <div className='key big-key'>Enter</div>
                                </div>
                            </div>
                            <div className='card'>
                                <TextField
                                    id="outlined-name"
                                    label="Sale Comment"
                                    value={this.state.comment}
                                    onChange={this.handleChange('comment')}
                                    margin="none"
                                    variant="outlined"
                                    fullWidth
                                />
                            </div>
                            <div className="flex-row justify-flex-end mr-10 ml-10 submit-transaction">
                                <div style={{ width: '100%' }}>
                                    <Detector
                                        render={this.buttonToRender} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.showPaymentReceipt ? <PaymentReceipt
                    open={this.state.showPaymentReceipt}
                    transactionStatus={this.state.transactionStatus}
                    receiptData={this.state.receiptData}
                    handleClose={this.handleClose}
                /> : null}
            </div>
        );
    }
}

function mapStateToProps(state) {
    let cartItems = _get(state, 'cart.cartItems');
    let customer = _get(state, 'cart.customer');
    let totalAmount = _get(state, 'cart.totalAmount');
    let sessionId = _get(state, 'terminalData.lookUpData.sessionId');
    let saleComment = _get(state, 'cart.saleComment');
    let giftCard = _get(state, 'giftCardData.lookUpData', {});
    let giftCardPayment = _get(state, 'giftCardPaymentData.lookUpData', {});
    let cashAmount = _get(state, 'PaymentDetails.cashAmount');
    let loyaltyRedeem = _get(state, 'PaymentDetails.loyaltyRedeem');
    let cardAmount = _get(state, 'PaymentDetails.cardAmount');
    let giftCardAmount = _get(state, 'PaymentDetails.giftCardAmount');
    let giftPayNumber = _get(state, 'PaymentDetails.giftPayNumber');
    let employeePay = _get(state, 'PaymentDetails.employeePay');
    let remainingAmount = _get(state, 'PaymentDetails.remainingAmount');
    let giftCardData = _get(state, 'PaymentDetails.giftCardData');
    let cart = _get(state, 'cart');
    let redemptionRules = _get(state, 'RedemptionRules')

    return {
        cart,
        cartItems,
        cashAmount,
        loyaltyRedeem,
        cardAmount,
        employeePay,
        giftCardAmount,
        giftPayNumber,
        remainingAmount,
        customer,
        totalAmount,
        sessionId,
        saleComment,
        giftCard,
        giftCardData,
        giftCardPayment,
        redemptionRules
    }
}

export default withRouter(connect(mapStateToProps)(PaymentSection));