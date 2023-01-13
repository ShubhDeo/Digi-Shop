import React, { useState } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import FormContainer from '../components/FormContainer'
import { savePaymentMethod } from '../actions/cartActions'
import CheckoutSteps from '../components/CheckoutSteps'

const PaymentScreen = ({ history }) => {
    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart
    const dispatch = useDispatch()

    if (!shippingAddress) {
        history.push('/shipping')
    }

    const [paymentMethod, setPaymentMethod] = useState('Online Payment')


    const submitHandler = (e) => {
        e.preventDefault()
        //DISPATCH PAYMENT METHOD
        dispatch(savePaymentMethod(paymentMethod))
        history.push('/placeorder')
    }

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3 />
            <h1>Payment Method</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label as='legend'>Select Method</Form.Label>
                    <Col>
                        <Form.Check type='radio' label='Online Payment' id='razorpay' name='paymentMethod' value='Online Payment' checked onChange={(e) => setPaymentMethod(e.target.value)}></Form.Check>
                    </Col>
                    <Col>
                        <Form.Check type='radio' label='Cash On Delivery' id='COD' name='paymentMethod' value='Cash On Delivery' onChange={(e) => setPaymentMethod(e.target.value)}></Form.Check>
                    </Col>
                </Form.Group>

                <Button type='submit' variant='primary'>Continue</Button>
            </Form>

        </FormContainer>
    )
}

export default PaymentScreen
