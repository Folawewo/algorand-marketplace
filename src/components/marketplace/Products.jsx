import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddProduct from "./AddProduct";
import Product from "./Product";
import Loader from "../utils/Loader";
import { NotificationError, NotificationSuccess } from "../utils/Notifications";
import {
    buyProductAction,
    createProductAction,
    deleteProductAction,
    getProductsAction,
    rateProductAction 
} from "../../utils/marketplace";
import PropTypes from "prop-types";
import { Row, FormControl, InputGroup, Button } from "react-bootstrap";

const Products = ({ address, fetchBalance }) => {
    const [products, setProducts] = useState([]);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const getProducts = async () => {
        setLoading(true);
        try {
            const fetchedProducts = await getProductsAction();
            setProducts(fetchedProducts);
            setDisplayedProducts(fetchedProducts); // Initialize displayed products
        } catch (e) {
            console.error(e);
            toast(<NotificationError text="Failed to fetch products." />);
        } finally {
            setLoading(false);
        }
    };

    // Fetch products initially and when certain events occur
    useEffect(() => {
        getProducts();
    }, []);

    // Handle search term change
    useEffect(() => {
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setDisplayedProducts(filteredProducts);
    }, [searchTerm, products]);

    const sortProductsByPrice = (ascending = true) => {
        const sortedProducts = [...displayedProducts].sort((a, b) => {
            return ascending ? a.price - b.price : b.price - a.price;
        });
        setDisplayedProducts(sortedProducts);
    };

    const createProduct = async (data) => {
        try {
            setLoading(true);
            await createProductAction(address, data);
            toast(<NotificationSuccess text="Product added successfully."/>);
            await getProducts();
            await fetchBalance(address);
        } catch (error) {
            console.log(error);
            toast(<NotificationError text={error?.message || "Failed to create a product."}/>);
        } finally {
            setLoading(false);
        }
    };

    const buyProduct = async (product, count) => {
        try {
            setLoading(true);
            await buyProductAction(address, product, count);
            toast(<NotificationSuccess text="Product bought successfully"/>);
            getProducts();
            fetchBalance(address);
        } catch (error) {
            console.log(error);
            toast(<NotificationError text="Failed to purchase product."/>);
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (product) => {
        try {
            setLoading(true);
            await deleteProductAction(address, product.appId);
            toast(<NotificationSuccess text="Product deleted successfully"/>);
            getProducts();
            fetchBalance(address);
        } catch (error) {
            console.log(error);
            toast(<NotificationError text="Failed to delete product."/>);
        } finally {
            setLoading(false);
        }
    };

    const rateProduct = async (product, rating) => {
        try {
            setLoading(true);
            await rateProductAction(address, product, rating);
            toast(<NotificationSuccess text="Product rated successfully"/>);
            await getProducts(); 
        } catch (error) {
            console.error(error);
            toast(<NotificationError text="Failed to rate product."/>);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fs-4 fw-bold mb-0">Street Food</h1>
                <AddProduct createProduct={createProduct} />
            </div>

            <InputGroup className="mb-3">
                <FormControl
                    placeholder="Search Products"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button onClick={() => sortProductsByPrice(true)}>Sort Ascending</Button>
                <Button onClick={() => sortProductsByPrice(false)}>Sort Descending</Button>
            </InputGroup>

            <Row xs={1} sm={2} lg={3} className="g-3 mb-5 g-xl-4 g-xxl-5">
                {displayedProducts.map((product, index) => (
                    <Product
                        address={address}
                        product={product}
                        buyProduct={buyProduct}
                        deleteProduct={deleteProduct}
                        rateProduct={rateProduct}
                        key={index}
                    />
                ))}
            </Row>
        </>
    );
};

Products.propTypes = {
    address: PropTypes.string.isRequired,
    fetchBalance: PropTypes.func.isRequired
};

export default Products;
