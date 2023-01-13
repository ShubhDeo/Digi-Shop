import React, { useEffect } from 'react'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listProducts, deleteProduct, createProduct } from '../actions/productActions'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'
import Paginate from '../components/Paginate'

const ProductListScreen = ({ history, match }) => {
    const pageNumber = match.params.pageNumber || 1
    const dispatch = useDispatch()

    const productList = useSelector(state => state.productList)
    const { loading, products, error, pages, page } = productList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const productCreate = useSelector(state => state.productCreate)
    const { loading: loadingCreate, error: errorCreate, success: successCreate, product: createdProduct } = productCreate

    const productDelete = useSelector(state => state.productDelete)
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = productDelete

    useEffect(() => {
        dispatch({ type: PRODUCT_CREATE_RESET })

        if (!userInfo.isAdmin) { //check for admin
            history.push('/login')
        }
        if (successCreate) {
            history.push(`/admin/products/${createdProduct._id}/edit`)
        } else {
            dispatch(listProducts('', pageNumber))
        }

    }, [dispatch, history, userInfo, successDelete, successCreate, createdProduct, pageNumber])

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure')) {
            //DELETE PRODUCT
            dispatch(deleteProduct(id))
        }
    }

    const createProductHandler = () => {
        dispatch(createProduct()) //CREATE PRODUCT
    }

   
    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <h1>Products</h1>
                </Col>
                <Col className='text-right'>
                    <Button className="my-3" onClick={createProductHandler}>
                        <i className='fas fa-plus'></i> Create Product
                    </Button>
                </Col>
            </Row>
            {loadingDelete && <Loader />}
            {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
            {loadingCreate && <Loader />}
            {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
            {loading ? <Loader /> : error ? <Message variant='dannger'>{error}</Message> : (
                <>
                    <Table striped bordered hover responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>PRICE</th>
                                <th>CATEGORY</th>
                                <th>BRAND</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product._id}>
                                    <td className='align-middle'>{product._id}</td>
                                    <td className='align-middle'>{product.name}</td>
                                    <td className='align-middle'>₹ {product.price}</td>
                                    <td className='align-middle'>{product.category}</td>
                                    <td className='align-middle'>{product.brand}</td>
                                    <td className='align-middle'>
                                        <LinkContainer to={`/admin/products/${product._id}/edit`}>
                                            <Button variant='light' className='btn-sm'><i className='fas fa-edit'></i></Button>
                                        </LinkContainer>
                                        <Button variant='danger' className='btn-sm' onClick={() => { deleteHandler(product._id) }}>
                                            <i className='fas fa-trash'></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Paginate isAdmin={true} pages={pages} page={page} />
                </>
            )}
        </>
    )
}

export default ProductListScreen
