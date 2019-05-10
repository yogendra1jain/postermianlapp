import React from 'react';
import moment from "moment";
import ReactToPrint from 'react-to-print';
/* Lodash Imports */
import _get from 'lodash/get';
import RefundHistory from './RefundHistory';
import RefundDialogue from './RefundDialogue/RefundDialogue';
/* Material import */
import HandlePrint from '../../../Global/PosFunctions/handlePrint';
import aobLogo from '../../../assets/images/aobLogodark.png';
import { connect } from 'react-redux';
import OrderPrintView from './OrderPrintView';
import Dinero from 'dinero.js';

let DineroInit = (amount, currency, precision) => (
    Dinero({amount:  parseInt(amount) || 0, currency: currency || 'USD', precision: precision || 2})
)
class HistoryDetailArea extends React.Component {

    constructor() {
        super();
        this.state = {
            openRefund: false,
        }
    }
    componentDidMount() {
        let logo
        if (localStorage.getItem('storeLogo')) {
            logo = localStorage.getItem('storeLogo')
        } else {
            logo = aobLogo
        }
        this.setState({ logo })

    }
    handleRefundClose = () => {
        this.setState({ openRefund: false });
    };

    showItemList = () => {
        let saleItems = _get(this.props, "selectedSaleTransaction.sale.saleItems", []);
        let saleItemResp = saleItems.map((saleItem, index) => {
            return (<tr>
                <td>{_get(saleItem, "product.name", '')}</td>
                <td>{_get(saleItem, "qty", 0)}</td>
                <td>{_get(saleItem, "returnQty", 0)}</td>

            </tr>)
        })
        return (
            <React.Fragment>
                {saleItemResp}
            </React.Fragment>

        )

    }
    paymentMethods = (num) => {
        let method
        switch (num) {
            case 0:
                method = 'Cash'
                break;
            case 1:
                method = 'Card'
                break;
            case 2:
                method = 'Gift Card'
                break;
            case 3:
                method = 'Cost Center Charge'
                break;
            case 4:
                method = 'Employee'
                break;
            case 5:
                method = 'Loyalty'
                break;
                case 6:
                method = 'Declining Balance'
                break;
        }

        return method
    }
    showPaymentMethods = () => {
        const paymentMethodsView = _get(this.props.selectedSaleTransaction, 'sale.payments', []).map((payment) => (
            <div className='flex-row justify-space-between mb-5'>
                <span className='summary-key'>{this.paymentMethods(_get(payment, 'paymentMethod', 0))}</span>
                <span className='summary-value'>
                {(DineroInit(_get(payment, 'paymentAmount.amount', 0), _get(payment, 'paymentAmount.currency', 'USD'))).toFormat('$0,0.00')}
                </span>
            </div>
        ))
        return (
            <React.Fragment>
                {paymentMethodsView}
            </React.Fragment>
        )
    }
    summaryPanel = () => {
        let selectedOrder = _get(this.props, "selectedSaleTransaction", []);
console.log(selectedOrder.sale, 'igyfydyty')
        return (
            <div className="mui-col-md-12 flex-column mt-10" >
                <div className='flex-row justify-space-between mb-5'>
                    <span className='summary-key'>{`Created Date: `}</span>
                    <span className='summary-value'>{moment(_get(selectedOrder, 'sale.saleCommitTimeStamp.seconds', 0) * 1000).format('MM/DD/YYYY h:mm a')}</span>
                </div>
                <div className='flex-row justify-space-between mb-5'>
                    <span className='summary-key'>{`Served By: `}</span>
                    <span className='summary-value'>{_get(selectedOrder, 'operator.person.firstName', '') + ' ' + _get(selectedOrder, 'operator.person.lastName', '')}</span>
                </div>
                {
                    (_get(selectedOrder, 'sale.cartDiscountAmount.amount', 0) + _get(selectedOrder, 'sale.employeeDiscountAmount.amount', 0) + _get(selectedOrder, 'sale.itemDiscountAmount.amount', 0)) > 0 ?
                        <div className='flex-row justify-space-between mb-5'>
                            <span className='summary-key'>{`Discounts: `}</span>
                            <span className='summary-value'>{(_get(selectedOrder, 'sale.cartDiscountAmount.currencyCode', '$') + (_get(selectedOrder, 'sale.cartDiscountAmount.amount', 0) + _get(selectedOrder, 'sale.employeeDiscountAmount.amount', 0) + _get(selectedOrder, 'sale.itemDiscountAmount.amount', 0)).toFixed(2))}</span>
                        </div> : null
                }
                <div className='flex-row justify-space-between mb-5'>
                    <span className='summary-key'>{`Tax: `}</span>
                    <span className='summary-value'>
                    {(DineroInit(_get(selectedOrder, 'sale.totalTaxAmount.amount', 0), _get(selectedOrder, 'sale.totalTaxAmount.currency', 'USD'))).toFormat('$0,0.00')}
                    </span>
                </div>
                <div className='flex-row justify-space-between mb-5'>
                    <span className='summary-key'>{`Grand Total: `}</span>
                    <span className='summary-value'>
                    {(DineroInit(_get(selectedOrder, 'sale.totalAmount.amount', 0), _get(selectedOrder, 'sale.totalAmount.currency', 'USD'))).toFormat('$0,0.00')}
                    </span>
                </div>
                <div className='flex-row justify-space-between mb-5'>
                    <span className='summary-key'>{`Returned Amount: `}</span>
                    <span className='summary-value'>
                    {(DineroInit(this.calcReturnedAmountTotal(), _get(selectedOrder, 'sale.totalRefundAmount.currency', 'USD'))).toFormat('$0,0.00')}
                    </span>
                </div>
                <div className='flex-row justify-space-between mb-5'>
                    <span className='summary-key'>{`Total Paid: `}</span>
                    <span className='summary-value'>
                    {(DineroInit(_get(selectedOrder, 'sale.totalAmountPaid.amount', 0), _get(selectedOrder, 'sale.totalAmountPaid.currency', 'USD'))).toFormat('$0,0.00')}
                    </span>
                </div>
                <div className='flex-row justify-space-between mb-5'>
                    <span className='summary-key'>{`Change: `}</span>
                    <span className='summary-value'>
                    {(DineroInit(_get(selectedOrder, 'sale.changeDue.amount', 0), _get(selectedOrder, 'sale.changeDue.currency', 'USD'))).toFormat('$0,0.00')}
                    </span>
                </div>
                <div className="flex-column">
                    <span>Payment Methods</span>
                    {this.showPaymentMethods()}
                </div>


                {/* <span className='summary-value'>{`$ ${_get(selectedOrder, 'sale.paymentAmount', '100.00')}`}</span> */}
            </div>
        )
    }
    makePrintContent = () => {

        let printArea =

            console.log(printArea, "printAreaprintArea");
        return ("printarea")
    }
    makeIframeContent = () => {
        return (<iframe id="ifmcontentstoprint" style={{
            height: '0px',
            width: '0px',
            position: 'absolute'
        }}></iframe>
        )

    }
    handlePrint = () => {
        var content = this.makePrintContent();
        var pri = this.makeIframeContent().contentWindow;
        console.log(pri, content, "contentpri")

        // pri.document.open();
        // pri.document.write(content.innerHTML);
        // pri.document.close();
        // pri.focus();
        // pri.print();
    }
    calcReturnedAmountTotal = () => {
        let returns = _get(this.props, "selectedSaleTransaction.sale.returns", []);
        let TotalRefundAmount = returns.reduce((acc, returnObj) => {
            return (acc + returnObj.refundTotal.amount)
        }, 0);
        return TotalRefundAmount;

    }

    everyQtyReturned = () => {
        let saleItems = _get(this.props, "selectedSaleTransaction.sale.saleItems", []);
        saleItems = saleItems.filter((saleItem, index) => {
            if (saleItem.saleType == 2) {
                return false
            }
            return true
        })
        let everyQtyReturned = saleItems.every((saleItem, index) => {
            let returnableQty = _get(saleItem, "qty", 0) - _get(saleItem, "returnQty", 0)
            if (returnableQty > 0) {
                return false
            }
            return true
        });
        return everyQtyReturned
    }

    render() {
        const { store } = this.props;
        let selectedOrder = _get(this.props, "selectedSaleTransaction", []);
        console.log(selectedOrder, 'selectedOrder selectedOrder')
        return (
            <div className='history-main flex-column overflow-y'>
                <div className='flex-row justify-space-between'>
                    <div className="card history-order-details">
                        <span className='card-title'>Order Details</span>
                        <div className="mui-row" style={{ paddingLeft: '5%', paddingRight: '6%' }}>
                            <table className="mui-table mui-table--bordered">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Qty</th>
                                        <th>Returned Qty</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.showItemList()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className='order-summary-section'>
                        <div className='card order-summary'>
                            <span className='card-title'>Summary</span>
                            {this.summaryPanel()}
                        </div>
                        <div className='order-action-section flex-row'>
                            {/* <div onClick={() => this.handlePrint()} className='action-btn flex-row justify-center align-center'>Re-Print</div> */}
                            <ReactToPrint
                                trigger={() => <div className='action-btn flex-row justify-center align-center'>Re-Print</div>}
                                content={() => this.printElementRef}
                            />
                            <div className={this.everyQtyReturned() ? 'disable-button action-btn flex-row justify-center align-center' : ' action-btn flex-row justify-center align-center'} onClick={() => { this.setState({ openRefund: true }) }}>Refund</div>
                        </div>
                    </div>
                </div>

                {/* Refund History Area */}
                {_get(selectedOrder.sale, 'returns', []).map(returnData => {
                    return <div className='refund-detail-section'>
                        <RefundHistory
                            store={store}
                            selectedOrder={selectedOrder}
                            logo={this.state.logo}
                            data={returnData} />
                    </div>
                })
                }

                {/* Refund Dialogue */}
                {
                    this.state.openRefund ?
                        <RefundDialogue
                            open={this.state.openRefund}
                            handleRefundClose={this.handleRefundClose}
                            handleHistoryClose={this.props.handleHistoryClose}
                            selectedSaleTransaction={this.props.selectedSaleTransaction}
                            logo={this.state.logo}
                        /> : null
                }
                <div style={{ display: "none" }}>
                    <OrderPrintView
                        ref={el => this.printElementRef = el}
                        store={store}
                        selectedOrder={selectedOrder}
                        logo={this.state.logo}
                    />
                </div>
            </div>
        );
    }
}
function mapStateToProps(state) {
    let { customerSalesList, storeData } = state;
    let salesList = customerSalesList.lookUpData || [];
    let store = storeData.lookUpData || {};

    return {
        salesList,
        store
    }
}

export default connect(mapStateToProps)(HistoryDetailArea);
