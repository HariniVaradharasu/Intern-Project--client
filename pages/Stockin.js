import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, InputGroup, Alert } from 'react-bootstrap';
import Sidenav from '../components/Sidenav';
// import axios from 'axios';

const StockInward = () => {
  const [stockType, setStockType] = useState('');
  const [billNumber, setBillNumber] = useState('');
  const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0]);
  const [vendorName, setVendorName] = useState('');
  const [productCode, setProductCode] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [gstValue, setGstValue] = useState('');
  const [cessValue, setCessValue] = useState('');
  const [grandTotalA, setGrandTotalA] = useState('');
  const [itemCode, setItemCode] = useState('');
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [mrp, setMrp] = useState('');
  const [cost, setCost] = useState('');
  const [gstPercent, setGstPercent] = useState('');
  const [cessPercent, setCessPercent] = useState('');
  const [discount, setDiscount] = useState('');
  const [grandTotalB, setGrandTotalB] = useState('');
  const [tableData, setTableData] = useState([]);
  const [calculatedTotal, setCalculatedTotal] = useState(0);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isSidebarCollapsed] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editItemCode, setEditItemCode] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  // Fetch items from the API
  const fetchItems = () => {
    const savedItems = JSON.parse(localStorage.getItem('stockItems')) || [];
    setTableData(savedItems);
    calculateTotal(savedItems);
  };

  // Add Item to Table and localStorage
  const handleAddOrUpdateItem = () => {
    const total = parseFloat(mrp) + parseFloat(cost) + parseFloat(gstPercent) + parseFloat(cessPercent) - parseFloat(discount || 0);
    const newItem = {
      billNumber,
      billDate,
      productCode,
      vendorName,
      itemCode,
      itemName,
      quantity,
      mrp,
      cost,
      discount,
      gstPercent,
      cessPercent,
      total,
    };

    if (isEditMode) {
      // Update existing item
      const updatedTableData = tableData.map((item) => (item.itemCode === editItemCode ? newItem : item));
      setTableData(updatedTableData);
      localStorage.setItem('stockItems', JSON.stringify(updatedTableData));
      setIsEditMode(false);
      setEditItemCode(null);
    } else {
      // Check for duplicates before adding new item
      const existingItem = tableData.find((item) => item.itemCode === itemCode);
      if (existingItem) {
        setIsDuplicate(true);
        return;
      }
      setIsDuplicate(false);
      const updatedTableData = [...tableData, newItem];
      setTableData(updatedTableData);
      localStorage.setItem('stockItems', JSON.stringify(updatedTableData));
    }

    calculateTotal(tableData);
    resetItemFields();
  };

  // Calculate total for grand total
  const calculateTotal = () => {
    const total = tableData.reduce((acc, item) => acc + parseFloat(item.total || 0), 0);
    setCalculatedTotal(total);
  };

  // Reset item input fields
  const resetItemFields = () => {
    setBillNumber('');
    setProductCode('');
    setVendorName('');
    setTotalValue('');
    setGstValue('');
    setCessValue('');
    setItemCode('');
    setItemName('');
    setQuantity('');
    setMrp('');
    setCost('');
    setGstPercent('');
    setCessPercent('');
    setDiscount('');
    setGrandTotalA('');
    setGrandTotalB('');
  };
  const handleDeleteItem = (itemCode) => {
    const updatedTableData = tableData.filter((item) => item.itemCode !== itemCode);
    setTableData(updatedTableData);
    localStorage.setItem('stockItems', JSON.stringify(updatedTableData));
    calculateTotal(updatedTableData);
  };

  // Save grand total data
  const handleSave = () => {
    if (parseFloat(grandTotalA) === parseFloat(grandTotalB)) {
      alert("Data saved successfully!");
      setTableData([]);
      setGrandTotalA('');
      setGrandTotalB('');
      setCalculatedTotal(0);
      localStorage.removeItem('stockItems');
    } else {
      alert("Grand total does not match! Please check your entries.");
    }
  };

  return (
    <div className="d-flex">
      <Sidenav isCollapsed={isSidebarCollapsed} />
      <Container fluid>
        {/* Stock Type Dropdown */}
        <Form.Floating className="mb-1" style={{marginTop:'7rem'}}>
          <Form.Select
            value={stockType}
            onChange={(e) => setStockType(e.target.value)}
            required
          >
            <option value="">Select Stock Type</option>
            <option value="own product">Own Product</option>
            <option value="other product">Others Product</option>
          </Form.Select>
          <Form.Label> Stock Type</Form.Label>
        </Form.Floating>

        {/* Bill Information */}
        <Row className="mt-3">
          <Col md={4}>
            <Form.Floating>
              <Form.Control
                type="text"
                placeholder=" "
                value={billNumber}
                onChange={(e) => setBillNumber(e.target.value)}
                required
              />
              <Form.Label>Bill Number</Form.Label>
            </Form.Floating>
          </Col>
          <Col md={4}>
            <Form.Floating>
              <Form.Control
                type="date"
                placeholder=" "
                value={billDate}
                onChange={(e) => setBillDate(e.target.value)}
                required
              />
              <Form.Label>Bill Date</Form.Label>
            </Form.Floating>
          </Col>
          <Col md={4}>
            <Form.Floating>
              <Form.Control
                type="text"
                placeholder=" "
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
                required
              />
              <Form.Label>Product Code</Form.Label>
            </Form.Floating>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md={4}>
            <Form.Floating>
              <Form.Control
                type="text"
                placeholder=" "
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                required
              />
              <Form.Label>Vendor Name</Form.Label>
            </Form.Floating>
          </Col>
          <Col md={3}>
            <Form.Floating>
              <Form.Control
                type="number"
                placeholder=" "
                value={totalValue}
                onChange={(e) => setTotalValue(e.target.value)}
                required
              />
              <Form.Label>Total Value</Form.Label>
            </Form.Floating>
          </Col>
          <Col md={3}>
            <Form.Floating>
              <Form.Control
                type="number"
                placeholder=" "
                value={gstValue}
                onChange={(e) => setGstValue(e.target.value)}
                required
              />
              <Form.Label>GST Value</Form.Label>
            </Form.Floating>
          </Col>
          <Col md={2}>
            <Form.Floating>
              <Form.Control
                type="number"
                placeholder=" "
                value={cessValue}
                onChange={(e) => setCessValue(e.target.value)}
                required
              />
              <Form.Label>CESS Value</Form.Label>
            </Form.Floating>
          </Col>
        </Row>

        {/* Single Grand Total Section */}
        <Row className="mt-4">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text>Grand Total</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder=" "
                value={grandTotalA}
                onChange={(e) => setGrandTotalA(e.target.value)}
                required
              />
            </InputGroup>
          </Col>
        </Row>

        {/* Inventory Table */}
        <Table striped bordered hover className="mt-5">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Bill Number</th>
              <th>Bill Date</th>
              <th>Product Code</th>
              <th>Vendor Name</th>
              <th>Item Code</th>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>MRP</th>
              <th>Cost</th>
              <th>Discount</th>
              <th>GST%</th>
              <th>CESS%</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tableData.length > 0 ? (
              tableData.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.billNumber}</td>
                  <td>{item.billDate}</td>
                  <td>{item.productCode}</td>
                  <td>{item.vendorName}</td>
                  <td>{item.itemCode}</td>
                  <td>{item.itemName}</td>
                  <td>{item.quantity}</td>
                  <td>{item.mrp}</td>
                  <td>{item.cost}</td>
                  <td>{item.discount}</td>
                  <td>{item.gstPercent}</td>
                  <td>{item.cessPercent}</td>
                  <td>{item.total}</td>
                  <td>
                    <Button variant="warning" size="sm"  className="me-2"  onClick={() => handleAddOrUpdateItem(item)}>Edit</Button>&nbsp;
                    <Button variant="danger" size="sm" onClick={() => handleDeleteItem(item.itemCode)}>Delete</Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="15" className="text-center">No items added yet.</td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Item Entry */}
        <Row style={{ marginTop:'7rem'}}>
          <Col md={3}>
            <Form.Floating>
              <Form.Control
                type="text"
                placeholder=" "
                value={itemCode}
                onChange={(e) => setItemCode(e.target.value)}
                required
              />
              <Form.Label>Item Code</Form.Label>
            </Form.Floating>
          </Col>
          <Col md={3}>
            <Form.Floating>
              <Form.Control
                type="text"
                placeholder=" "
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
              />
              <Form.Label>Item Name</Form.Label>
            </Form.Floating>
          </Col>
          <Col md={2}>
            <Form.Floating>
              <Form.Control
                type="number"
                placeholder=" "
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
              <Form.Label>Quantity</Form.Label>
            </Form.Floating>
          </Col>
          <Col md={2}>
            <Form.Floating>
              <Form.Control
                type="text"
                placeholder=" "
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
                required
              />
              <Form.Label>MRP</Form.Label>
            </Form.Floating>
          </Col>
          <Col md={2}>
            <Form.Floating>
              <Form.Control
                type="text"
                placeholder=" "
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                required
              />
              <Form.Label>Cost</Form.Label>
            </Form.Floating>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col md={2}>
            <Form.Floating>
              <Form.Control
                type="number"
                placeholder=" "
                value={gstPercent}
                onChange={(e) => setGstPercent(e.target.value)}
                required
              />
              <Form.Label>GST%</Form.Label>
            </Form.Floating>
          </Col>
          <Col md={2}>
            <Form.Floating>
              <Form.Control
                type="number"
                placeholder=" "
                value={cessPercent}
                onChange={(e) => setCessPercent(e.target.value)}
                required
              />
              <Form.Label>CESS%</Form.Label>
            </Form.Floating>
          </Col>
          <Col md={2}>
            <Form.Floating>
              <Form.Control
                type="number"
                placeholder=" "
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                required
              />
              <Form.Label>Discount</Form.Label>
            </Form.Floating>
          </Col>
          <Col md={3}>
          <Button onClick={handleAddOrUpdateItem} className="mt-2" variant="success">Add Item</Button>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text>Grand Total</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder=" "
                value={grandTotalB}
                onChange={(e) => setGrandTotalB(e.target.value)}
                required
              />
            </InputGroup>
          </Col>
        </Row>

        {isDuplicate && (
          <Alert variant="warning" className="mt-3">
            Item already exists in the table.
          </Alert>
        )}

        <Row className="mt-5 ">
          <Col md={4}>
            <Button
              onClick={handleSave}
              disabled={parseFloat(grandTotalA) !== grandTotalB}
              variant="primary"
            >
              Save
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default StockInward;
