import asyncHandler from 'express-async-handler'
import Product from '../models/ProductModel.js'
import Fuse from 'fuse.js'


// @desc Fetch all products
// @route /api/products
// @access Public route
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 10
    const page = Number(req.query.pageNumber) || 1

    const keyword = req.query.keyword
        ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {}

    const count = await Product.countDocuments({ ...keyword })
    const products = await Product.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1))

    res.json({ products, page, pages: Math.ceil(count / pageSize) })
})


// @desc Fetch an unique products
// @route /api/products/:id
// @access Public route
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
        res.json(product)
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})


// @desc DELETE  product
// @route /api/products/:id
// @access Private/Admin route
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
        await product.remove()
        res.json({ message: 'Product removed' })
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

// @desc CREATE  product
// @route POST /api/products/
// @access Private/Admin route
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: 'Sample name',
        price: '0',
        user: req.user._id,
        image: '/images/sample.jpeg',
        brand: 'Sample brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description.'
    })

    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
})

// @desc UPDATE  product
// @route PUT /api/products/:id
// @access Private/Admin route
const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, description, image, brand, category, countInStock } = req.body
    const product = await Product.findById(req.params.id)
    if (product) {
        product.name = name
        product.price = price
        product.description = description
        product.image = image
        product.brand = brand
        product.category = category
        product.countInStock = countInStock

        const updatedProduct = await product.save()
        res.json(updatedProduct)
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})


// @desc CREATE new review 
// @route POST /api/products/:id/review
// @access Private route
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body
    const product = await Product.findById(req.params.id)
    if (product) {
        const alreadyReviewed = await product.reviews.find(r => r.user.toString() === req.user._id.toString())

        if (alreadyReviewed) {
            res.status(400)
            throw new Error('Product already reviewed')
        }
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }

        product.reviews.push(review)
        product.numReviews = product.reviews.length
        product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
        await product.save()
        res.status(201).json({ message: 'Review added' })

    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})


// @desc GET Top rated products 
// @route GET /api/products/top
// @access Public route
const getTopProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3)
    res.json(products)
})



export { getProductById, getProducts, deleteProduct, createProduct, updateProduct, createProductReview, getTopProducts }