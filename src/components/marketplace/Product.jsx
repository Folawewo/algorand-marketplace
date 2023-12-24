import React, { useState } from "react";
import PropTypes from "prop-types";
import { Badge, Button, Card, Col, FloatingLabel, Form, Stack } from "react-bootstrap";
import { microAlgosToString, truncateAddress } from "../../utils/conversions";
import Identicon from "../utils/Identicon";
import { Rating } from '@mui/material';

const Product = ({ address, product, buyProduct, deleteProduct, rateProduct }) => {
    const { name, image, description, price, sold, appId, owner, totalRating, numRatings } = product;
    const [count, setCount] = useState(1);
    const [userRating, setUserRating] = useState(0);

    const handleRateProduct = async () => {
        if(userRating > 0) {
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
                        <Identicon size={28} address={owner}/>
                        <Badge bg="secondary" className="ms-auto">
                            {sold} Sold
                        </Badge>
                    </Stack>
                </Card.Header>
                <div className="ratio ratio-4x3">
                    <img src={image} alt={name} style={{objectFit: "cover"}}/>
                </div>
                <Card.Body className="d-flex flex-column text-center">
                    <Card.Title>{name}</Card.Title>
                    <Card.Text className="flex-grow-1">{description}</Card.Text>
                    {/* Rating Display */}
                    <div className="mt-2">
                        <Rating name="read-only" value={totalRating / numRatings || 0} readOnly />
                    </div>
                    {/* User Rating Interaction */}
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
                    <Form className="d-flex align-content-stretch flex-row gap-2">
                        <FloatingLabel
                            controlId="inputCount"
                            label="Count"
                            className="w-25"
                        >
                            <Form.Control
                                type="number"
                                value={count}
                                min="1"
                                max="10"
                                onChange={(e) => {
                                    setCount(Number(e.target.value));
                                }}
                            />
                        </FloatingLabel>
                        <Button
                            variant="outline-dark"
                            onClick={() => buyProduct(product, count)}
                            className="w-75 py-3"
                        >
                            Buy for {microAlgosToString(price) * count} ALGO
                        </Button>
                        {product.owner === address &&
                            <Button
                                variant="outline-danger"
                                onClick={() => deleteProduct(product)}
                                className="btn"
                            >
                                <i className="bi bi-trash"></i>
                            </Button>
                        }
                    </Form>
                </Card.Body>
            </Card>
        </Col>
    );
};

Product.propTypes = {
    address: PropTypes.string.isRequired,
    product: PropTypes.shape({
        appId: PropTypes.number,
        name: PropTypes.string,
        image: PropTypes.string,
        description: PropTypes.string,
        price: PropTypes.number,
        sold: PropTypes.number,
        owner: PropTypes.string,
        totalRating: PropTypes.number,
        numRatings: PropTypes.number
    }).isRequired,
    buyProduct: PropTypes.func.isRequired,
    deleteProduct: PropTypes.func.isRequired,
    rateProduct: PropTypes.func.isRequired, 
};

export default Product;
