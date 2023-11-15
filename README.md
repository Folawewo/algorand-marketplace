# Marketplace Application - New Features

## Overview
This document provides information about the new features added to the Marketplace application, specifically in the `Products` component. These enhancements aim to improve user experience by allowing easier navigation and interaction with the product listings.

## Prerequisites
- Ensure that Git and Node.js are installed on your system.
- Clone the Repository: Use the command `git clone https://github.com/Folawewo/algorand-marketplace.git` to clone the project to your local machine.
- Navigate to the Project Directory: After cloning, use cd [algorand-marketplace] to navigate into the project directory and run `npm install`.

## Features

### 1. Search Functionality
The search feature allows users to quickly find products by their name. As the user types in the search field, the product list updates in real-time to display only those products that match the search term. This feature is particularly useful in scenarios where the product list is extensive.

#### Implementation Details
- A search input field is integrated into the `Products` component.
- The `useState` hook is used to manage the search term entered by the user.
- The `useEffect` hook monitors changes to the search term and filters the displayed products accordingly.
- Products are filtered on the client side for real-time responsiveness.

### 2. Sorting by Price
This feature allows users to sort the products by their price in either ascending or descending order. Two buttons are provided for users to select their preferred sorting order.

#### Implementation Details
- Two buttons are added to the `Products` component for sorting: "Sort Ascending" and "Sort Descending."
- The sorting function reorders the products based on the price while preserving other attributes.
- Sorting is performed on the client side and can be instantly switched between ascending and descending.

## Usage
- **Search**: Users can type a product name into the search bar to filter the product list. The list updates dynamically with each keystroke.
- **Sort**: Users can click either the "Sort Ascending" or "Sort Descending" button to reorder the product list based on price.

