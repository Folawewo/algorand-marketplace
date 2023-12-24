import React, { useState, useEffect } from "react";
import Product from "./marketplace/Product";

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        setWishlist(storedWishlist);
    }, []);

    return (
        <div>
            <h2>My Wishlist</h2>
            <div className="product-grid">
                {wishlist.length > 0 ? (
                    wishlist.map(product => (
                        <Product key={product.appId} product={product} />
                    ))
                ) : (
                    <p>Your wishlist is empty</p>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
