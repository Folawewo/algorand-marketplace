import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Badge, Button, Card, Col, FloatingLabel, Form, Stack } from "react-bootstrap";
import { microAlgosToString, truncateAddress } from "../../utils/conversions";
import Identicon from "../utils/Identicon";
import { Rating } from '@mui/material';

const Product = ({ address, product, buyProduct, deleteProduct, rateProduct }) => {
    const { name, image, description, price, sold, appId, owner, totalRating, numRatings } = product;
    const [count, setCount] = useState(1);
    const [userRating, setUserRating] = useState(0);
    const [isInWishlist, setIsInWishlist] = useState(false);

    useEffect(() => {
        const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        setIsInWishlist(wishlist.some(wishProduct => wishProduct.appId === product.appId));
    }, [product]);

    const toggleWishlist = () => {
        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        if (isInWishlist) {
            wishlist = wishlist.filter(wishProduct => wishProduct.appId !== product.appId);
        } else {
            wishlist.push(product);
        }
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        setIsInWishlist(!isInWishlist);
    };

    const handleRateProduct = async () => {
        if (userRating > 0) {
            await rateProduct(product, userRating);
            setUserRating(0);
        }
    };

    return (
        <Col key={appId}>
            <Card className="h-100">
                <Card.Header>
                    <Stack direction="horizontal" gap={2}>
                        <span className="font-monospace text-secondary">{truncateAddress(owner)}</span>
                        <Identicon size={28} address={owner} />
                        <Badge bg="secondary" className="ms-auto">
                            {sold} Sold
                        </Badge>
                    </Stack>
                </Card.Header>
                <div className="ratio ratio-4x3">
                    <img src={image} alt={name} style={{ objectFit: "cover" }} />
                </div>
                <Card.Body className="d-flex flex-column text-center">
                    <Card.Title>{name}</Card.Title>
                    <Card.Text className="flex-grow-1">{description}</Card.Text>
                    <div className="mt-2">
                        <Rating name="read-only" value={totalRating / numRatings || 0} readOnly />
                    </div>
                    <div className="rating-control">
                        <Rating
                            name="simple-controlled"
                            value={userRating}
                            onChange={(event, newValue) => {
                                setUserRating(newValue);
                            }}
                        />
                        <Button variant="primary" onClick={handleRateProduct}>Rate</Button>
                    </div>
                    <FloatingLabel controlId="inputCount" label="Count" className="mb-3">
                        <Form.Control
                            type="number"
                            value={count}
                            min="1"
                            onChange={(e) => setCount(Number(e.target.value))}
                        />
                    </FloatingLabel>
                    <Button
                        variant="outline-dark"
                        onClick={() => buyProduct(product, count)}
                        className="py-3"
                    >
                        Buy for {microAlgosToString(price * count)} ALGO
                    </Button>
                    {product.owner === address &&
                        <Button
                            variant="outline-danger"
                            onClick={() => deleteProduct(product)}
                            className="my-2"
                        >
                            Delete Product
                        </Button>
                    }
                    <Button variant="outline-secondary" onClick={toggleWishlist}>
                        <i className={`bi bi-heart${isInWishlist ? '-fill' : ''}`}></i>
                    </Button>
                </Card.Body>
            </Card>
        </Col>
    );
};

Product.propTypes = {
    address: PropTypes.string.isRequired,
    product: PropTypes.shape({
        appId: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        sold: PropTypes.number.isRequired,
        owner: PropTypes.string.isRequired,
        totalRating: PropTypes.number.isRequired,
        numRatings: PropTypes.number.isRequired
    }).isRequired,
    buyProduct: PropTypes.func.isRequired,
    deleteProduct: PropTypes.func.isRequired,
    rateProduct: PropTypes.func.isRequired,
};

export default Product;
