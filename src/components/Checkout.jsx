import {useContext} from 'react';
import Modal from "./UI/Modal.jsx";
import CartContext from "../store/CartContext";
import { currencyFormatter } from '../util/formatting';
import Input from './UI/Input.jsx';
import Button from './UI/Button.jsx';
import UserProgressContext from '../store/UserProgressContext.jsx';
import useHttp from '../hooks/useHttp.js';
import Error from './Error.jsx';
const requestConfig={
    method:'POST',
    headers:{
        'Content-Type':'application/json'
    }
};
export default function Checkout(){
    const cartCtx=useContext(CartContext);
    const userProgressCtx=useContext(UserProgressContext);
    const{
        data,
        error,
        isLoading:isSending,
        sendRequest,
        clearData
    }=useHttp('http://localhost:3000/orders',requestConfig)
    const cartTotal=cartCtx.items.reduce(
        (totalPrice,item)=>totalPrice+item.quantity*item.price,
    0);
    function handleClose(){
        userProgressCtx.hideCheckout();
    };
    function handleFinish(){
        userProgressCtx.hideCheckout();
        cartCtx.clearCart();
        clearData();
    }
    function handleSubmit(event){
        event.preventDefault();
        const fd=new FormData(event.target);
        const customerData=Object.fromEntries(fd.entries());
        sendRequest(
            JSON.stringify({
                order:{
                    items: cartCtx.items,
                    customer: customerData,
                }
            }),
        )
    }
    let actions=(
        <>
        <Button  type="button" textOnly onClick={handleClose}>Close</Button>
        <Button>Submit Order</Button>
        </>
    );
    if(isSending){
        actions=<span> Hold on,sending order data...</span>;
    }
    if(data && !error){
        return <Modal open={userProgressCtx.progress==='checkout'} onClose={handleClose} >
            <h2>Success!</h2>
            <p>Your order was submitted successfully</p>
            <p>
                Shortly, confirmation mail will se sent to you at your e-mail id. You will soon getback to you with your meal.
            </p>
            <p className="modal-actions">
                <Button onClick={handleFinish}>Okay</Button>
            </p>
        </Modal>
    }
    return(
    <Modal open={userProgressCtx.progress==='checkout'} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
            <h2>Checkout</h2>
            <p>Total amount:{currencyFormatter.format(cartTotal)}</p>
            <Input label="Full Name" type="text" id="name"/>
            <Input label="E-Mail Address" type="email" id="email"/>
            <Input label="Street" type="text" id="street"/>
            <div className='control-row'>
                <Input label="Postal Code" type="text" id="postal-code"/>
                <Input label="City" type="text" id="city"/>
            </div>
            {error && <Error title="Failed to submit order" message={error}/>}
            <p className="modal-actions">
               {actions} 
            </p>
        </form>
    </Modal>
    );
}