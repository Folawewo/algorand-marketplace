import React, { useState } from "react";
import Cover from "./components/Cover";
import './App.css';
import Wallet from "./components/Wallet";
import Products from "./components/marketplace/Products";
import Wishlist from "./components/Wishlist";
import { Container, Nav, Navbar } from "react-bootstrap";
import { indexerClient, myAlgoConnect } from "./utils/constants";
import { Notification } from "./components/utils/Notifications";
import coverImg from "./assets/img/sandwich.jpg"

const App = function AppWrapper() {
    const [address, setAddress] = useState(null);
    const [name, setName] = useState(null);
    const [balance, setBalance] = useState(0);
    const [activeTab, setActiveTab] = useState("products");

    const fetchBalance = async (accountAddress) => {
        try {
            const response = await indexerClient.lookupAccountByID(accountAddress).do();
            setBalance(response.account.amount);
        } catch (error) {
            console.error("Error fetching balance:", error);
        }
    };

    const connectWallet = async () => {
        try {
            const accounts = await myAlgoConnect.connect();
            const account = accounts[0];
            setAddress(account.address);
            setName(account.name);
            fetchBalance(account.address);
        } catch (error) {
            console.error('Could not connect to MyAlgo wallet:', error);
        }
    };

    const disconnect = () => {
        setAddress(null);
        setName(null);
        setBalance(null);
    };

    return (
        <>
            <Notification />
            {address ? (
                <Container fluid="md">
                    <Navbar bg="light" expand="lg">
                        <Navbar.Brand href="#home">Street Food Market</Navbar.Brand>
                        <Nav className="me-auto">
                            <Nav.Link href="#products" active={activeTab === "products"} onClick={() => setActiveTab("products")}>Products</Nav.Link>
                            <Nav.Link href="#wishlist" active={activeTab === "wishlist"} onClick={() => setActiveTab("wishlist")}>Wishlist</Nav.Link>
                        </Nav>
                        <Wallet
                            address={address}
                            name={name}
                            amount={balance}
                            disconnect={disconnect}
                            symbol={"ALGO"}
                        />
                    </Navbar>
                    <main>
                        {activeTab === "products" && <Products address={address} fetchBalance={fetchBalance} />}
                        {activeTab === "wishlist" && <Wishlist />}
                    </main>
                </Container>
            ) : (
                <Cover name={"Street Food"} coverImg={coverImg} connect={connectWallet} />
            )}
        </>
    );
}

export default App;
